import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const manifest=JSON.parse(readFileSync(new URL('../assets/macbook-pair/generation-manifest.json',import.meta.url),'utf8'));
function jpegDimensions(bytes){
  if(bytes.length<2048||bytes[0]!==0xff||bytes[1]!==0xd8)throw Error('Not a JPEG');
  let offset=2;
  while(offset+7<bytes.length){
    if(bytes[offset]!==0xff){offset++;continue;}
    while(bytes[offset]===0xff)offset++;
    const marker=bytes[offset++];
    if(marker===0xd8||marker===0xd9||marker===0x01)continue;
    if(marker===0xda)break;
    const length=bytes.readUInt16BE(offset);
    if(length<2||offset+length>bytes.length)throw Error('Invalid JPEG segment');
    if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)){
      return {height:bytes.readUInt16BE(offset+3),width:bytes.readUInt16BE(offset+5)};
    }
    offset+=length;
  }
  throw Error('JPEG dimensions not found');
}
test('generated Mac pair photos have verified blobs and independently tracked review statuses',()=>{
  assert.equal(manifest.review_status,'MIXED__MM1_VISUAL_DIRECTION_ACCEPTED__MM2_PENDING');
  assert.equal(manifest.prompt_fidelity,'PROMPT_UNVERIFIED');
  assert.equal(manifest.images.length,2);
  assert.deepEqual(manifest.images.map(x=>x.id),['MM1','MM2']);
  for(const item of manifest.images){
    assert.equal(item.path,item.id==='MM1'?'assets/macbook-pair/mm1-adopted-v5.jpg':'assets/macbook-pair/candidates/mm2-float-natural-wall-v3.jpg');
    assert.equal(item.user_approval,item.id==='MM1'?'VISUAL_DIRECTION_ACCEPTED':'PENDING');
    const data=readFileSync(new URL('../'+item.path,import.meta.url));
    const sha=createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex');
    assert.equal(sha,item.git_blob_sha1,item.id+' binary must exactly match its registered Git blob');
    const {width,height}=jpegDimensions(data);
    assert.ok(width>=1000&&height>=550,item.id+' high resolution');
    assert.ok(Math.abs(width/height-16/9)<0.025,item.id+' near 16:9');
  }
});
