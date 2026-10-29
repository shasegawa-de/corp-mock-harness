// Valid complete PNG fixture for offline API security tests. No real image API calls.
import {deflateSync} from 'node:zlib';
import {crc32} from '../../scripts/png-validate.mjs';
const header=Buffer.from('89504e470d0a1a0a','hex');
const chunk=(type,payload)=>{
  const name=Buffer.from(type,'ascii'),data=Buffer.concat([name,payload]);
  const prefix=Buffer.alloc(4);prefix.writeUInt32BE(payload.length);
  const checksum=Buffer.alloc(4);checksum.writeUInt32BE(crc32(data));
  return Buffer.concat([prefix,data,checksum]);
};
export function mockPng(width=1536,height=864){
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(width,0);ihdr.writeUInt32BE(height,4);
  ihdr[8]=8;ihdr[9]=6; // 8-bit RGBA, non-interlaced
  const image=Buffer.alloc(height*(1+width*4)); // scanline filter bytes are 0
  return Buffer.concat([header,chunk('IHDR',ihdr),chunk('IDAT',deflateSync(image)),chunk('IEND',Buffer.alloc(0))]);
}
