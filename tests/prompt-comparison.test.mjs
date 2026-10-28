import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve,join} from 'node:path';
import {ARMS,prepareComparison,generateComparison,lexicalWords,HEADINGS} from '../scripts/prompt-comparison.mjs';
const root=resolve(import.meta.dirname,'..');
for(const id of Object.keys(ARMS))test('MM comparison prompt is locked: '+id,()=>{
  const plan=prepareComparison(root,id);
  assert.equal(plan.request.n,1);
  assert.equal(plan.request.size,'1536x864');
  assert.deepEqual(plan.scene.devices,['macbookpro14','macbookpro14']);
  assert.equal(plan.request.prompt,readFileSync(join(root,ARMS[id].path),'utf8'));
  assert.ok(plan.words>=80);
  if(plan.arm.variant==='C')assert.ok(plan.words>=250,'C must include substantive art direction');
  assert.equal(plan.arm.variant,id.at(-1).toUpperCase());
});
for(const group of ['mm1','mm2'])test('A/B lexicon stable and C direction changed: '+group,()=>{
  const a=prepareComparison(root,group+'-a').request.prompt;
  const b=prepareComparison(root,group+'-b').request.prompt;
  const c=prepareComparison(root,group+'-c').request.prompt;
  assert.equal(lexicalWords(a),lexicalWords(b));
  assert.notEqual(lexicalWords(b),lexicalWords(c));
  for(const heading of HEADINGS)assert.ok(c.split('\n').includes(heading));
  assert.match(c,/upper-left daylight/);
  assert.ok(c.trim().split(/\s+/).length>b.trim().split(/\s+/).length+80,'C should not merely rephrase B');
  assert.match(c,/Prioritize|Prioritize product/);
  assert.match(c,/microcement/);
  if(group==='mm1'){
    assert.match(c,/contact shadows/);
    assert.match(c,/side-by-side/);
    assert.match(c,/repeated vertical stripes/);
  }else{
    assert.match(c,/NO floor/);
    assert.match(c,/left Mac is farther back/);
    assert.match(c,/no projected ground shadow/);
  }
});
test('API gets exact locked payload and never approves image automatically',async()=>{
  const id='mm1-c',plan=prepareComparison(root,id),image=Buffer.alloc(33);
  Buffer.from('89504e470d0a1a0a','hex').copy(image);
  image.writeUInt32BE(13,8);image.write('IHDR',12);
  image.writeUInt32BE(1536,16);image.writeUInt32BE(864,20);
  let calls=0;
  const fetcher=async(url,init)=>{
    calls++;
    assert.equal(url,'https://api.openai.com/v1/images/generations');
    assert.deepEqual(JSON.parse(init.body),plan.request);
    return {ok:true,json:async()=>({data:[{b64_json:image.toString('base64')}]}),headers:{get:()=>null}};
  };
  const result=await generateComparison({root,id,key:'dummy',fetcher});
  assert.equal(calls,1);
  assert.equal(result.metadata.approved,false);
  assert.equal(result.metadata.effective_model_prompt,'UNVERIFIED');
  assert.equal(result.metadata.prompt_transport,'EXACT_REQUEST_SUBMITTED');
  assert.equal(JSON.stringify(result.metadata).includes('dummy'),false,'API key must never enter metadata');
});
test('missing API key means no request',async()=>{
  let calls=0;
  await assert.rejects(generateComparison({root,id:'mm1-a',key:'',fetcher:()=>{calls++;}}),/OPENAI_API_KEY/);
  assert.equal(calls,0);
});
test('invalid experiment ID rejected',()=>assert.throws(()=>prepareComparison(root,'../mm1-a')));

test('twelve independent dry-run trial IDs do not invoke the image API',()=>{
  const ids=Object.keys(ARMS);
  const seen=new Set();
  for(const id of ids)for(const trial of [1,2]){
    const result=spawnSync(process.execPath,
      ['scripts/prompt-comparison-cli.mjs','--arm='+id,'--trial='+trial,'--dry-run'],
      {cwd:root,encoding:'utf8',env:{...process.env,OPENAI_API_KEY:''}});
    assert.equal(result.status,0,result.stderr);
    const report=JSON.parse(result.stdout);
    assert.equal(report.api_requested,false);
    assert.equal(report.trial,trial);
    assert.equal(report.arm,id);
    seen.add(report.arm+':'+report.trial);
  }
  assert.equal(seen.size,12);
  const bad=spawnSync(process.execPath,['scripts/prompt-comparison-cli.mjs','--arm=mm1-a','--trial=3','--dry-run'],
    {cwd:root,encoding:'utf8'});
  assert.notEqual(bad.status,0);
});

test('paid run rejects output inside Git tree before any request and never logs a key',()=>{
  const canary='TEST_CANARY_TOKEN_NO_NETWORK';
  const run=spawnSync(process.execPath,[
    'scripts/prompt-comparison-cli.mjs','--arm=mm1-c','--trial=1','--execute',
    '--output='+join(root,'generated-review')
  ],{cwd:root,encoding:'utf8',env:{...process.env,OPENAI_API_KEY:canary}});
  assert.notEqual(run.status,0);
  assert.match(run.stderr,/Refusing to write review files inside Git repository/);
  assert.equal((run.stdout+run.stderr).includes(canary),false,'Secret must never be echoed');
});
test('public repository paid workflow has a hard stop before secret injection',()=>{
  const workflow=readFileSync(join(root,'.github/workflows/mm-prompt-comparison.yml'),'utf8');
  assert.match(workflow,/Block paid run on public repository/);
  assert.match(workflow,/REPOSITORY_PRIVATE/);
  assert.match(workflow,/persist-credentials: false/);
});
