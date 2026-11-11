import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {defaults,fromPreset,normalize,choices,assemble,validateCatalog} from '../catalog-next/engine.mjs';

const p=JSON.parse(readFileSync(new URL('../configs/presets.json',import.meta.url),'utf8'));
const d=JSON.parse(readFileSync(new URL('../configs/devices.json',import.meta.url),'utf8'));
const scene=id=>{
 const row=p.showcase_presets.find(x=>x.id===id);
 assert.ok(row,id);
 const normalized=normalize({...defaults,...fromPreset(row)},p);
 assert.deepEqual(normalized.changes,[],id);
 return {row,normalized,result:assemble(normalized.state,p,d)};
};
const cases=[
 'iphone-grid-ivory-diagonal',
 'iphone-grid-lightgray-diagonal',
 'iphone-grid-ivory-low-oblique',
 'iphone-grid-lightgray-low-oblique'
];

test('exactly six repeated iPhone 17 devices are independently constrained in one photograph',()=>{
 validateCatalog(p,d);
 assert.equal(p.device_layouts.find(x=>x.id==='repeated-grid').device_count,6);
 for(const id of cases){
   const {row,result}=scene(id);
   assert.deepEqual(row.devices,Array(6).fill('iphone17'),id);
   assert.deepEqual(result.contract.devices,Array(6).fill('iphone17'),id);
   assert.equal(result.contract.layout_id,'repeated-grid');
   assert.equal(result.contract.spatial_mode_id,'grounded');
   assert.equal(result.contract.pose_id,'flat-face-up');
   assert.match(result.prompt,/Exactly SIX identical black standard iPhone 17 handsets/);
   assert.match(result.prompt,/regular diagonal 2-by-3 grid/);
   assert.match(result.prompt,/single photograph/);
   assert.match(result.prompt,/only outer phones may be intentionally cut by image edges/);
   assert.match(result.prompt,/featureless pure white/);
   assert.match(result.prompt,/ONE camera view/);
   assert.match(result.prompt,/no furniture/);
   assert.doesNotMatch(result.prompt,/Exactly one black standard iPhone|Exactly two devices|MacBook/);
   assert.ok(result.words>=80 && result.words<=170,id+' words '+result.words);
   const source=readFileSync(new URL('../'+row.reference_prompt,import.meta.url),'utf8');
   assert.match(source,/Exactly SIX identical standard black iPhone 17/);
   assert.match(source,/pure-white blank screens/);
   assert.match(source,/ONE camera view/);
   assert.doesNotMatch(source,/simple mockup|FREE MOCKUPS|SCREEN MOCKUP|mockups-design|https?:\/\//i);
 }
});

test('diagonal and lower-oblique views keep distinct camera elevations',()=>{
 for(const id of cases){
   const {result}=scene(id);
   if(id.includes('low-oblique')){
     assert.equal(result.contract.composition_id,'iphone-tile-low-oblique');
     assert.match(result.prompt,/24–32-degree/);
     assert.doesNotMatch(result.prompt,/One 40–50-degree oblique camera/);
   }else{
     assert.equal(result.contract.composition_id,'iphone-tile-diagonal');
     assert.match(result.prompt,/40–50-degree oblique camera/);
   }
 }
 for(const id of cases){
   const {result}=scene(id);
   if(id.includes('ivory'))assert.equal(result.contract.environment_id,'warm-ivory-seamless');
   else assert.equal(result.contract.environment_id,'pale-gray-seamless');
 }
});

test('pattern-only cropping and low camera do not leak into single iPhone or Mac contracts',()=>{
 const original={...defaults};
 const old=assemble(defaults,p,d);
 assert.deepEqual(defaults,original,'Assembling default prompt must never mutate a caller state');
 assert.deepEqual(old.contract.devices,['iphone17']);
 assert.match(old.prompt,/Exactly one black standard iPhone 17/);
 assert.doesNotMatch(old.prompt,/six|SIX|perimeter|repeated grid/i);
 assert.ok(!choices(defaults,p).composition.includes('iphone-tile-low-oblique'));
 assert.ok(!choices(defaults,p).composition.includes('iphone-tile-diagonal'));
 assert.ok(choices(defaults,p).layout.includes('repeated-grid'));
 for(const subject of ['macbookpro14','pair','mac-pair','environment']){
   const state={...defaults,subject};
   assert.ok(!choices(state,p).layout.includes('repeated-grid'),subject);
   assert.throws(()=>assemble({...state,layout:'repeated-grid'},p,d),/組み合わせ/);
 }
 const ground={...defaults,layout:'repeated-grid',spatial:'grounded',pose:'flat-face-up'};
 assert.deepEqual(choices(ground,p).spatial,['grounded']);
 assert.deepEqual(choices(ground,p).pose,['flat-face-up']);
 assert.deepEqual(choices(ground,p).composition,['iphone-tile-diagonal','iphone-tile-low-oblique']);
 assert.ok(choices(ground,p).environment.includes('warm-ivory-seamless'));
 assert.ok(choices(ground,p).environment.includes('pale-gray-seamless'));
 assert.ok(!choices({...defaults,subject:'iphone17',spatial:'suspended'},p).layout.includes('repeated-grid'));
 assert.ok(!choices({...defaults,subject:'iphone17',spatial:'on-block'},p).layout.includes('repeated-grid'));
 assert.ok(!choices(defaults,p).environment.includes('warm-ivory-seamless'));
 assert.ok(!choices(defaults,p).environment.includes('pale-gray-seamless'));
 assert.ok(!choices(defaults,p).lighting.includes('window-cut-sun'));
 assert.equal(choices(defaults,p).composition.length,6,'existing default iPhone options unchanged');
});
test('invalid repeat setups fail closed instead of silently publishing invalid device counts',()=>{
 const make=()=>structuredClone(p);
 for(const mutation of [
   row=>{row.devices[0]='macbookpro14';},
   row=>{row.devices.pop();},
   row=>{row.spatial_mode_id='suspended';},
   row=>{row.pose_id='upright';},
   row=>{row.composition_id='three-quarter-left';}
 ]){
   const altered=make();
   mutation(altered.showcase_presets.find(x=>x.id==='iphone-grid-ivory-diagonal'));
   assert.throws(()=>validateCatalog(altered,d),/iPhone反復パターン契約/);
 }
 const unrelated=make();
 unrelated.showcase_presets.find(x=>x.id==='iphone-grid-ivory-diagonal').layout_id='single';
 assert.throws(()=>validateCatalog(unrelated,d),/反復以外の多台数構成/);
});
test('the editor exposes layout choice on iPhone while keeping environment-only mode isolated',()=>{
 const src=readFileSync(new URL('../catalog-next/app.mjs',import.meta.url),'utf8');
 assert.match(src,/\['pair','mac-pair','iphone17'\]/);
 const old=normalize({...defaults,subject:'iphone17',spatial:'grounded',layout:'single',pose:'upright'},p);
 assert.deepEqual(old.changes,[]);
 const newScene=normalize({...old.state,layout:'repeated-grid'},p);
 assert.equal(newScene.state.pose,'flat-face-up');
 assert.ok(newScene.changes.some(x=>x.key==='pose'));
 assert.equal(newScene.state.composition,'iphone-tile-diagonal');
 assert.ok(newScene.changes.some(x=>x.key==='composition'));
});
