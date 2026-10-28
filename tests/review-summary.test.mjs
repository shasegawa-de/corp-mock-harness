import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,rmSync,writeFileSync,readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {reviewSummary,FIELDS} from '../scripts/review-summary.mjs';
const root=resolve(import.meta.dirname,'..');
test('12 blinded scores remain private; report retains per-axis means and hard fails',()=>{
  const dir=mkdtempSync(join(tmpdir(),'corp-mock-qa-test-')),blind=join(dir,'blind');
  mkdirSync(blind,{mode:0o700});
  const arms=['mm1-a','mm1-b','mm1-c','mm2-a','mm2-b','mm2-c'];
  const mapping=arms.flatMap((arm,i)=>[1,2].map(trial=>({blind_id:'R'+String(i*2+trial).padStart(2,'0'),arm,trial})));
  writeFileSync(join(dir,'mapping-private.json'),JSON.stringify(mapping));
  const rows=mapping.map((x,i)=>[x.blind_id,'PASS','PASS',i===0?'FAIL':'PASS','PASS','2','1','2','0','1','"some, note"'].join(','));
  const sheet=join(blind,'scores.csv');
  writeFileSync(sheet,FIELDS.join(',')+'\n'+rows.join('\n')+'\n');
  try {
    const report=reviewSummary(root,dir);
    assert.equal(report.complete,true);
    assert.equal(report.visual_complete,true);
    assert.equal(report.fidelity_complete,true);
    assert.equal(report.reviewed,12);
    assert.equal(report.arms[0].hard_fail,1);
    assert.equal(report.arms[0].means.lighting_0_2,0);
    assert.equal(report.arms[1].hard_fail,0);
    assert.equal(report.arms[5].reviewed,2);
    const source=readFileSync(sheet,'utf8');
    const preUnblind=source.replaceAll(',1,"some, note"',',,"some, note"');
    writeFileSync(sheet,preUnblind);
    const visual=reviewSummary(root,dir);
    assert.equal(visual.visual_complete,true);
    assert.equal(visual.fidelity_complete,false);
    assert.equal(visual.complete,false);
    assert.equal(visual.arms[0].means.fidelity_0_2,null);
    writeFileSync(sheet,source.replace('R01,PASS','R01,UNKNOWN'));
    assert.throws(()=>reviewSummary(root,dir),/Incomplete hard-gate/);
    writeFileSync(sheet,source.replace('R01,PASS,PASS','R01,PASS,'));
    assert.throws(()=>reviewSummary(root,dir),/Incomplete hard-gate/);
    // An early prompt-fidelity rating must not reveal the A/B/C arms.
    writeFileSync(sheet,source.replace('R01,PASS,PASS,FAIL,PASS,2,1,2,0,1,','R01,,,,,,,,,,'));
    assert.throws(()=>reviewSummary(root,dir),/Prompt fidelity must remain hidden/);
    // R01-R12 labels alone are not sufficient: each experimental arm/trial must occur exactly once.
    writeFileSync(sheet,source);
    const invalid=mapping.map(x=>({...x}));
    invalid[11]={...invalid[11],arm:'mm1-a',trial:1};
    writeFileSync(join(dir,'mapping-private.json'),JSON.stringify(invalid));
    assert.throws(()=>reviewSummary(root,dir),/Invalid or incomplete identity mapping/);

  } finally {rmSync(dir,{recursive:true,force:true});}
});
