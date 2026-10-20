import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const record=JSON.parse(readFileSync(resolve(root,'assets/architectural-surfaces/approved-manifest.json'),'utf8'));
const ids=['MR2','TX1','TX2','MR1'];
test('four independent architectural images have recorded user visual approval',()=>{
  assert.equal(record.review_status,'VISUALLY_APPROVED_BY_USER');
  assert.equal(record.prompt_fidelity,'UNVERIFIED');
  assert.deepEqual(record.images.map(x=>x.id),ids);
  assert.equal(new Set(record.images.map(x=>x.path)).size,4);
});
for(const item of record.images){
  test('approved image is original if binary is published: '+item.id,()=>{
    assert.ok(item.path.startsWith('assets/architectural-surfaces/'));
    assert.match(item.sha256,/^[0-9a-f]{64}$/);
    const file=resolve(root,item.path);
    if(!existsSync(file))return; // User-approved original still awaiting GitHub binary upload.
    const bytes=readFileSync(file);
    assert.equal(bytes.byteLength,item.size_bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256);
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(bytes.toString('ascii',12,16),'IHDR');
    assert.equal(bytes.readUInt32BE(16),item.width);
    assert.equal(bytes.readUInt32BE(20),item.height);
  });
}
