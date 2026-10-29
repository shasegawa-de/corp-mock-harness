// Verify actual PNG chunk structure and compressed pixel stream, not just header dimensions.
// This prevents a truncated HTTP response from being accepted as a completed paid trial.
import {inflateSync} from 'node:zlib';
import {pngDimensions} from './gpt-image-transport.mjs';
const SIGNATURE='89504e470d0a1a0a';
const crcTable=Array.from({length:256},(_,n)=>{
  let c=n;
  for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;
  return c>>>0;
});
export function crc32(data){
  let c=0xffffffff;
  for(const b of data)c=crcTable[(c^b)&255]^(c>>>8);
  return (c^0xffffffff)>>>0;
}
export function verifyCompletePng(bytes,{width=1536,height=864}={}){
  if(!Buffer.isBuffer(bytes)||bytes.length<57||bytes.subarray(0,8).toString('hex')!==SIGNATURE)
    throw Error('Incomplete or invalid PNG signature');
  const size=pngDimensions(bytes);
  if(size.width!==width||size.height!==height)throw Error('Unexpected image dimensions');
  let offset=8,header=false,idat=false,ended=false,chunks=0;
  const compressed=[];
  while(offset<bytes.length){
    if(offset+12>bytes.length)throw Error('Truncated PNG chunk header');
    const length=bytes.readUInt32BE(offset);
    if(length>bytes.length-offset-12)throw Error('Truncated PNG chunk payload');
    const type=bytes.toString('ascii',offset+4,offset+8);
    const payload=bytes.subarray(offset+8,offset+8+length);
    const calculated=crc32(bytes.subarray(offset+4,offset+8+length));
    const saved=bytes.readUInt32BE(offset+8+length);
    if(calculated!==saved)throw Error('PNG CRC mismatch');
    if(chunks===0){
      if(type!=='IHDR'||length!==13)throw Error('PNG missing first IHDR');
      if(![0,2,3,4,6].includes(payload[9]))throw Error('Unexpected PNG color type');
      header=true;
    }else if(type==='IHDR')throw Error('Repeated PNG IHDR');
    if(type==='IDAT'){idat=true;compressed.push(payload);}
    if(type==='IEND'){
      if(length!==0)throw Error('Invalid PNG IEND');
      ended=true;
      if(offset+12!==bytes.length)throw Error('Unexpected data after PNG IEND');
      break;
    }
    offset+=12+length;
    if(++chunks>100000)throw Error('Excessive PNG chunks');
  }
  if(!header||!idat||!ended)throw Error('PNG lacks required image chunks');
  // API images are modest (1536x864); upper bound protects against corrupt zip bombs.
  try{
    const decoded=inflateSync(Buffer.concat(compressed),{maxOutputLength:128*1024*1024});
    if(decoded.length===0)throw Error('Empty pixel stream');
  }catch(error){throw Error('PNG pixel decompression failed');}
  return size;
}
