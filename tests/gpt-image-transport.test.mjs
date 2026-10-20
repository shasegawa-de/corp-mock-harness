import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {prepareScene,generateOne,pngDimensions,SCENES,sha256} from '../scripts/gpt-image-transport.mjs';
const root=resolve(import.meta.dirname,'..');
for(const id of SCENES)test('fixture prompt is sent verbatim for '+id,()=>{
  const p=prepareScene(root,id);
  assert.equal(p.scene.devices.length,0);
  assert.equal(p.scene.layout_id,'environment-only');
  assert.equal(p.request.n,1);
  assert.equal(p.request.size,'1536x864');
  assert.equal(p.request.prompt,readFileSync(join(root,p.scene.reference_prompt),'utf8'));
  assert.equal(p.prompt_sha256,sha256(p.request.prompt));
  assert.equal(Object.keys(p.sources).length,4);
});
test('unapproved scene IDs are rejected',()=>{
  for(const id of ['../../foo','iphone-front-reference','other'])assert.throws(()=>prepareScene(root,id));
});
test('PNG parser rejects invalid data',()=>assert.throws(()=>pngDimensions(Buffer.from('invalid'))));
test('exact request body, one API call, and image remains unapproved',async()=>{
  const image=Buffer.alloc(33);
  Buffer.from('89504e470d0a1a0a','hex').copy(image);
  image.writeUInt32BE(13,8);image.write('IHDR',12);image.writeUInt32BE(1536,16);image.writeUInt32BE(864,20);
  let count=0;
  const fetcher=async(url,init)=>{
    count++;
    assert.equal(url,'https://api.openai.com/v1/images/generations');
    assert.equal(init.headers.Authorization,'Bearer dummy-key');
    assert.deepEqual(JSON.parse(init.body),prepareScene(root,SCENES[0]).request);
    return {ok:true,json:async()=>({data:[{b64_json:image.toString('base64')}]}),headers:{get:()=>null}};
  };
  const result=await generateOne({root,id:SCENES[0],key:'dummy-key',fetcher});
  assert.equal(count,1);
  assert.equal(result.metadata.prompt_transport,'EXACT_REQUEST_SUBMITTED');
  assert.equal(result.metadata.effective_model_prompt,'UNVERIFIED');
  assert.equal(result.metadata.image_qa,'UNVERIFIED');
  assert.equal(result.metadata.approved,false);
  assert.equal(result.metadata.dimensions.height,864);
});
test('no key blocks request before network',async()=>{
  let called=false;
  await assert.rejects(generateOne({root,id:SCENES[0],key:'',fetcher:()=>{called=true}}),/OPENAI_API_KEY/);
  assert.equal(called,false);
});
test('missing or malformed image fails closed',async()=>{
  const fake=async()=>({ok:true,json:async()=>({data:[{b64_json:Buffer.from('bad').toString('base64')}]}),headers:{get:()=>null}});
  await assert.rejects(generateOne({root,id:SCENES[0],key:'dummy',fetcher:fake}),/Not a PNG/);
});
