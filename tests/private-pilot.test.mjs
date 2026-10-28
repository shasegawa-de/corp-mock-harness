import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,statSync,existsSync,readdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {TASKS,privateDirectory,pilot,prepareBlind} from '../scripts/private-pilot.mjs';
import {sha256} from '../scripts/gpt-image-transport.mjs';
import {prepareComparison} from '../scripts/prompt-comparison.mjs';
const root=resolve(import.meta.dirname,'..');
const fresh=()=>mkdtempSync(join(tmpdir(),'corp-harness-test-'));
const png=()=>{const bytes=Buffer.alloc(33);Buffer.from('89504e470d0a1a0a','hex').copy(bytes);bytes.writeUInt32BE(13,8);bytes.write('IHDR',12);bytes.writeUInt32BE(1536,16);bytes.writeUInt32BE(864,20);return bytes;};
test('12 distinct trial identifiers, dry run without key',()=>{
  assert.equal(new Set(TASKS.map(x=>x.base)).size,12);
  const p=spawnSync(process.execPath,['scripts/private-pilot-cli.mjs','--dry-run'],{cwd:root,encoding:'utf8',env:{...process.env,OPENAI_API_KEY:''}});
  assert.equal(p.status,0,p.stderr);
});
test('private output refuses in-repository and loose permissions',()=>{
  assert.throws(()=>privateDirectory(root,join(root,'generated-review'),{create:true}),/outside Git/);
  const dir=fresh();try{assert.throws(()=>privateDirectory(root,dir),/0700/);}finally{rmSync(dir,{recursive:true,force:true});}
});
test('offline 12-run resume, private PNG/JSON and blind package',async()=>{
  const temp=fresh(),dir=join(temp,'private');let calls=0;
  const generate=async({id,key})=>{assert.equal(key,'DUMMY_NO_NETWORK');calls++;const image=png();return {image,metadata:{arm_id:id,prompt_sha256:prepareComparison(root,id).prompt_sha256,image_sha256:sha256(image),approved:false}};};
  try{
    const a=await pilot({root,outputDir:dir,limit:2,key:'DUMMY_NO_NETWORK',generate});assert.equal(a.complete,2);
    const b=await pilot({root,outputDir:dir,limit:12,key:'DUMMY_NO_NETWORK',generate});assert.equal(b.complete,12);
    assert.equal(calls,12);assert.equal(statSync(dir).mode&0o077,0);
    assert.equal(statSync(join(dir,'mm1-a-trial-1.png')).mode&0o077,0);
    const blind=prepareBlind(root,dir);assert.equal(blind.count,12);
    assert.equal(readdirSync(blind.blind).filter(x=>x.endsWith('.png')).length,12);
    assert.ok(existsSync(join(dir,'mapping-private.json')));
    assert.throws(()=>prepareBlind(root,dir),/already exists/);
    const done=await pilot({root,outputDir:dir,limit:12,key:'DUMMY_NO_NETWORK',generate});assert.equal(done.generated,0);
    assert.equal(calls,12);
  }finally{rmSync(temp,{recursive:true,force:true});}
});
test('unknown paid call does not retry',async()=>{
  const temp=fresh(),dir=join(temp,'private');let calls=0;
  const generate=async()=>{calls++;throw Error('remote error after possible billing')};
  try{
    await assert.rejects(pilot({root,outputDir:dir,limit:1,key:'DUMMY',generate}),/remote error/);
    await assert.rejects(pilot({root,outputDir:dir,limit:1,key:'DUMMY',generate}),/Unresolved prior paid request/);
    assert.equal(calls,1);
  }finally{rmSync(temp,{recursive:true,force:true});}
});
