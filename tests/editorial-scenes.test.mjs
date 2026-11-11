import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {labels,defaults,validateCatalog,fromPreset,normalize,choices,assemble} from '../catalog-next/engine.mjs';

const presets=JSON.parse(readFileSync(new URL('../configs/presets.json',import.meta.url),'utf8'));
const devices=JSON.parse(readFileSync(new URL('../configs/devices.json',import.meta.url),'utf8'));
const ids=['mac-offwhite-high-oblique','mac-offwhite-low-side','mac-walnut-chair-sun','mac-walnut-chair-soft'];
const selected=id=>{
  const row=presets.showcase_presets.find(x=>x.id===id);
  assert.ok(row,id);
  const normalized=normalize({...defaults,...fromPreset(row)},presets);
  assert.deepEqual(normalized.changes,[],id);
  return {row,result:assemble(normalized.state,presets,devices),state:normalized.state};
};
test('four opt-in editorial directions are valid, one Mac only, and ready for independent generation QA',()=>{
  validateCatalog(presets,devices);
  for(const id of ids){
    const {row,result}=selected(id);
    assert.deepEqual(result.contract.devices,['macbookpro14']);
    assert.equal(result.contract.layout_id,'single');
    assert.equal(result.contract.pose_id,'open-display');
    assert.ok(result.words>=80&&result.words<=170,id+': '+result.words);
    assert.match(result.prompt,/ONE standalone photorealistic product photograph/);
    assert.match(result.prompt,/ONE camera view/);
    assert.match(result.prompt,/Horizontal 16:9/);
    assert.match(result.prompt,/featureless pure white/);
    assert.match(result.prompt,/keyboard and trackpad visible/);
    assert.match(row.reference_prompt,/^prompts\/macbookpro14\/editorial-[\w-]+\.txt$/);
    const sample=readFileSync(new URL('../'+row.reference_prompt,import.meta.url),'utf8');
    assert.match(sample,/ONE camera view/);
    assert.match(sample,/Horizontal 16:9/);
    assert.match(sample,/white/i);
    assert.doesNotMatch(sample,/MacBook Mockup|MD\.COM|mockups-design|FREE Laptop/);
  }
});
test('high-key studio distinct from wood-chair interior; both keep white screens',()=>{
  for(const id of ['mac-offwhite-high-oblique','mac-offwhite-low-side']){
    const {result}=selected(id);
    assert.equal(result.contract.spatial_mode_id,'grounded');
    assert.equal(result.contract.environment_id,'offwhite-seamless-studio');
    assert.match(result.prompt,/seamless studio/);
    assert.match(result.prompt,/no wood, desks, furniture/);
    assert.doesNotMatch(result.prompt,/One open MacBook rests flat and stably on the seat/);
  }
  for(const id of ['mac-walnut-chair-sun','mac-walnut-chair-soft']){
    const {result}=selected(id);
    assert.equal(result.contract.spatial_mode_id,'furniture-supported');
    assert.equal(result.contract.environment_id,'walnut-chair-interior');
    assert.match(result.prompt,/ONE walnut wooden chair/);
    assert.match(result.prompt,/wood contact/);
    assert.doesNotMatch(result.prompt,/no wood, desks, furniture/);
    assert.match(result.prompt,/no other furniture/);
  }
  assert.match(selected('mac-walnut-chair-sun').result.prompt,/Single-window directional warm sunlight/);
  assert.match(selected('mac-walnut-chair-soft').result.prompt,/Soft top-left daylight/);
});
test('only a single Mac may choose wood-chair mode, never paired devices, phones or empty studies',()=>{
  for(const subject of ['iphone17','pair','mac-pair','environment']){
    const s={...defaults,subject};
    assert.ok(!choices(s,presets).spatial.includes('furniture-supported'),subject);
    assert.throws(()=>assemble({...s,spatial:'furniture-supported'},presets,devices),/組み合わせ/);
  }
  const mac={...defaults,subject:'macbookpro14',pose:'open-display',spatial:'furniture-supported'};
  assert.deepEqual(choices(mac,presets).environment,['walnut-chair-interior']);
  assert.deepEqual(choices(mac,presets).composition,['mac-chair-elevated','mac-chair-front']);
  assert.ok(choices(mac,presets).lighting.includes('window-cut-sun'));
  assert.ok(!choices({...mac,spatial:'grounded'},presets).environment.includes('walnut-chair-interior'));
  assert.ok(!choices({...mac,spatial:'grounded'},presets).lighting.includes('window-cut-sun'));
  const wrong=structuredClone(presets);
  wrong.showcase_presets.find(x=>x.id==='mac-walnut-chair-sun').devices=['iphone17'];
  assert.throws(()=>validateCatalog(wrong,devices),/木製チェアの配置はMac単体のみ/);
});
test('Mac-specific cameras do not restore generic top-down camera or change default iPhone options',()=>{
  const iphone=choices(defaults,presets).composition;
  assert.equal(iphone.length,6);
  for(const x of ['mac-elevated-three-quarter','mac-low-side-profile','mac-chair-elevated','mac-chair-front','high-view'])assert.ok(!iphone.includes(x));
  const mac=choices({...defaults,subject:'macbookpro14',pose:'open-display'},presets);
  assert.ok(mac.composition.includes('mac-elevated-three-quarter'));
  assert.ok(mac.composition.includes('mac-low-side-profile'));
  assert.ok(!mac.composition.includes('mac-chair-elevated'));
  assert.ok(!mac.composition.includes('high-view'));
  const old=assemble(normalize({...defaults,subject:'macbookpro14',pose:'open-display'},presets).state,presets,devices);
  assert.match(old.prompt,/no wood, desks, furniture/);
  assert.doesNotMatch(old.prompt,/walnut wooden chair/);
});
