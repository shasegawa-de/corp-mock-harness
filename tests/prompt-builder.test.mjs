import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {defaults,choices,normalize,assemble,fromPreset,validateCatalog} from '../catalog-next/engine.mjs';
const presets=JSON.parse(readFileSync(new URL('../configs/presets.json',import.meta.url)));
const devices=JSON.parse(readFileSync(new URL('../configs/devices.json',import.meta.url)));
const scene=input=>normalize({...defaults,...input},presets).state;

test('device dimensions follow config; generated prompt is exactly one scene',()=>{
  const output=assemble(defaults,presets,devices);
  assert.match(output.prompt,/^ONE standalone photorealistic product photograph\. ONE camera view\. Horizontal 16:9\./);
  assert.match(output.prompt,/Exactly one black standard iPhone 17, NOT Pro/);
  assert.match(output.prompt,/149\.6×71\.5×7\.95mm/);
  assert.match(output.prompt,/featureless pure white/);
  assert.deepEqual(output.contract.devices,['iphone17']);
  const altered=structuredClone(devices);altered.iphone17.physical_mm.width=72;
  assert.match(assemble(defaults,presets,altered).prompt,/149\.6×72×7\.95mm/);
});

test('flat phone camera follows support; supported tilt has credible contact',()=>{
  for(const [spatial,composition]of [['grounded','iphone-oblique-floor'],['on-block','iphone-oblique-block']]){
    const s=scene({pose:'flat-face-up',spatial});
    assert.equal(s.composition,composition);
    const output=assemble(s,presets,devices);assert.match(output.prompt,/Oblique camera 40–5[05] degrees/);
    if(spatial==='on-block')assert.match(output.prompt,/80–140cm-wide/);
  }
  const tilt=assemble(scene({pose:'tilted-supported'}),presets,devices).prompt;
  assert.match(tilt,/Bottom edge contacts floor, upper back touches wall/);
  const laptop=scene({subject:'macbookpro14',pose:'flat-face-up'});
  assert.equal(laptop.pose,'open-display');assert.doesNotMatch(assemble(laptop,presets,devices).prompt,/Phone lies/);
});

test('floorless suspension adapts a floor-containing source environment without leaking floor requirements',()=>{
  const s=scene({subject:'pair',spatial:'suspended',environment:'carrara-marble-wall-floor',layout:'depth-staggered'});
  const result=assemble(s,presets,devices);
  assert.match(result.prompt,/Exactly two devices: one MacBook Pro 14-inch and one standard iPhone 17/);
  assert.match(result.prompt,/float weightlessly in floorless half-gray architecture/);
  assert.match(result.prompt,/NO floor, horizon, floor-wall seam, ground shadow/);
  assert.match(result.prompt,/Mac behind, phone foreground/);
  assert.doesNotMatch(result.prompt,/matching.*floor|Rest directly|contact shadows|wall meeting/);
  assert.deepEqual(result.contract.poses,{macbookpro14:'open-suspended',iphone17:'suspended-angled'});
});

test('environment-only removes devices; floors and glass junctions retain their specific geometry',()=>{
  const floor=assemble(scene({subject:'environment',surface:'horizontal-floor'}),presets,devices);
  assert.deepEqual(floor.contract.devices,[]);assert.equal(floor.contract.surface_type,'horizontal-floor');
  assert.match(floor.prompt,/floor fills 80–85%/);
  assert.doesNotMatch(floor.prompt,/iPhone|MacBook|keyboard|pure white|Phone upright/);
  assert.equal(scene({subject:'environment',spatial:'hover'}).spatial,'grounded');
  const glass=scene({subject:'environment',surface:'vertical-wall-and-floor'});
  assert.equal(glass.environment,'smoked-glass');
  assert.match(assemble(glass,presets,devices).prompt,/glass partition, mineral wall and matching floor/);
});

test('existing example IDs load unchanged; retired and unsupported settings fail closed',()=>{
  validateCatalog(presets,devices);
  for(const row of [...presets.showcase_presets,...presets.surface_studies]){
    const n=normalize({...defaults,...fromPreset(row)},presets);
    assert.deepEqual(n.changes,[],row.id);assemble(n.state,presets,devices);
  }
  assert.throws(()=>assemble({...defaults,composition:'high-view'},presets,devices));
  const altered=structuredClone(presets);altered.environments.push({id:'unmapped-new-material',detail:'unknown'});
  assert.throws(()=>validateCatalog(altered,devices),/未対応の設定/);
});

test('every selectable combination stays single-scene, within 80–170 words, with correct device count',()=>{
  let count=0,min=Infinity,max=0;
  const keys=['subject','spatial','layout','pose','surface','composition','environment','lighting'];
  function visit(s,index){
    if(index<keys.length){
      const key=keys[index],options=choices(s,presets)[key];
      for(const value of options.length?options:[null])visit({...s,[key]:value},index+1);
      return;
    }
    const r=assemble(s,presets,devices);count++;min=Math.min(min,r.words);max=Math.max(max,r.words);
    assert.ok(r.words>=80&&r.words<=170,`${r.words}: ${JSON.stringify(s)}`);
    assert.equal(r.contract.devices.length,s.subject==='environment'?0:s.subject==='pair'?2:1);
    if(s.subject==='environment')assert.doesNotMatch(r.prompt,/iPhone|MacBook|keyboard|pure white/);
    if(s.spatial==='suspended'){
      assert.match(r.prompt,/NO floor, horizon, floor-wall seam, ground shadow/);
      assert.doesNotMatch(r.prompt,/Rest on|Rest directly|floor fills|contact shadows/);
    }
  }
  visit({...defaults},0);assert.ok(count>1000);console.log(`Validated ${count} combinations; ${min}–${max} words.`);
});
