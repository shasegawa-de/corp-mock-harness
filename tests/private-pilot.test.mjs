import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,statSync,existsSync,readdirSync,chmodSync,readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {TASKS,privateDirectory,pilot,prepareBlind} from '../scripts/private-pilot.mjs';
import {sha256} from '../scripts/gpt-image-transport.mjs';
import {prepareComparison} from '../scripts/prompt-comparison.mjs';
import {mockPng} from './helpers/png-fixture.mjs';
import {verifyCompletePng} from '../scripts/png-validate.mjs';
const root=resolve(import.meta.dirname,'..');
const fresh=()=>mkdtempSync(join(tmpdir(),'corp-harness-test-'));
const png=()=>mockPng();
test('12 distinct trial identifiers, dry run without key',()=>{
  assert.equal(new Set(TASKS.map(x=>x.base)).size,12);
  const p=spawnSync(process.execPath,['scripts/private-pilot-cli.mjs','--dry-run'],{cwd:root,encoding:'utf8',env:{...process.env,OPENAI_API_KEY:''}});
  assert.equal(p.status,0,p.stderr);
});
test('private output refuses in-repository and loose permissions',()=>{
  assert.throws(()=>privateDirectory(root,join(root,'generated-review'),{create:true}),/outside Git/);
  const dir=fresh();try{chmodSync(dir,0o755);assert.throws(()=>privateDirectory(root,dir),/0700/);}finally{rmSync(dir,{recursive:true,force:true});}
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
    const manifest=readFileSync(join(blind.blind,'scene-manifest.csv'),'utf8');
    assert.equal(manifest.trim().split('\n').length,13);
    assert.equal((manifest.match(/,MM1,grounded/g)||[]).length,6);
    assert.equal((manifest.match(/,MM2,floorless/g)||[]).length,6);
    assert.doesNotMatch(manifest,/mm1-a|mm1-b|mm1-c|mm2-a|mm2-b|mm2-c|trial/);
    const already=spawnSync(process.execPath,['scripts/private-pilot-cli.mjs','--execute','--output='+dir],
      {cwd:root,encoding:'utf8',env:{...process.env,OPENAI_API_KEY:''}});
    assert.equal(already.status,0,already.stderr);
    assert.match(already.stdout,/Verified 12\/12/);
    assert.doesNotMatch(already.stdout+already.stderr,/Temporary OpenAI project API key/);
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

test('truncated and CRC-corrupted PNGs are rejected before being recorded as successful trials',async()=>{
  const valid=mockPng();
  assert.deepEqual(verifyCompletePng(valid),{width:1536,height:864});
  assert.throws(()=>verifyCompletePng(valid.subarray(0,33)),/Truncated|lacks|Incomplete/);
  const corrupt=Buffer.from(valid);corrupt[52]^=0xff;
  assert.throws(()=>verifyCompletePng(corrupt),/CRC mismatch|decompression failed/);
  const temp=fresh(),dir=join(temp,'private');
  const bad=async()=>({image:valid.subarray(0,33),metadata:{}});
  try {
    await assert.rejects(pilot({root,outputDir:dir,limit:1,key:'DUMMY',generate:bad}),/Truncated|lacks|Incomplete/);
    assert.ok(existsSync(join(dir,'mm1-a-trial-1.pending')));
    assert.equal(existsSync(join(dir,'mm1-a-trial-1.png')),false);
  }finally{rmSync(temp,{recursive:true,force:true});}
});
