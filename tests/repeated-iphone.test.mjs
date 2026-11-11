import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {defaults,fromPreset,normalize,choices,assemble,validateCatalog} from '../catalog-next/engine.mjs';
import {filterOptions} from '../catalog-next/filters.mjs';

const p=JSON.parse(readFileSync(new URL('../configs/presets.json',import.meta.url),'utf8'));
const d=JSON.parse(readFileSync(new URL('../configs/devices.json',import.meta.url),'utf8'));
const originalIds=['iphone-grid-ivory-diagonal','iphone-grid-lightgray-diagonal','iphone-grid-ivory-low-oblique','iphone-grid-lightgray-low-oblique','iphone-grid-pro-ivory-steep','iphone-grid-pro-gray-steep'];
const fromId=(id)=>{
 const row=p.showcase_presets.find(x=>x.id===id);
 assert.ok(row,id);
 const n=normalize({...defaults,...fromPreset(row)},p);
 assert.deepEqual(n.changes,[],id);
 return {row,out:assemble(n.state,p,d)};
};

test('layout types expose precise zero and half-phone body width contracts',()=>{
 validateCatalog(p,d);
 assert.equal(p.device_layouts.find(x=>x.id==='repeated-grid').device_count,6);
 const half=p.device_layouts.find(x=>x.id==='repeated-grid-half-offset');
 assert.equal(half.device_count,6);
 assert.equal(half.offset_ratio,0.5);
 assert.match(half.detail,/EXACTLY 50% of ONE handset body WIDTH/);
});

test('all twelve fixture arms preserve one model, screen front up and the selected exact ratio',()=>{
 for(const base of originalIds){
  for(const suffix of ['','-half-offset']){
   const id=base+suffix,mode=suffix?'repeated-grid-half-offset':'repeated-grid',ratio=suffix?0.5:0;
   const {row,out}=fromId(id);
   const model=base.includes('-pro-')?'iphone17pro':'iphone17';
   assert.deepEqual(row.devices,Array(6).fill(model),id);
   assert.deepEqual(out.contract.devices,Array(6).fill(model),id);
   assert.equal(row.layout_id,mode);
   assert.equal(out.contract.layout_id,mode);
   assert.equal(out.contract.row_offset_ratio,ratio);
   assert.equal(out.contract.pose_id,'flat-face-up');
   assert.match(out.prompt,/Six SAME-MODEL phones FRONT-SCREEN UP, never rear-facing/);
   if(ratio)assert.match(out.prompt,/EXACTLY HALF of ONE phone body width \(50%\)/);
   else assert.match(out.prompt,/ZERO shift, 0%/);
   assert.doesNotMatch(out.prompt,/35%|one.third/i);
   assert.match(out.prompt,/featureless pure white/);
   assert.match(out.prompt,/ONE camera view/);
   assert.ok(out.words>=80&&out.words<=170,id+': '+out.words);
   const src=readFileSync(new URL('../'+row.reference_prompt,import.meta.url),'utf8');
   assert.match(src,/Exactly SIX identical/);
   assert.match(src,/all the SAME model/);
   assert.match(src,/FRONT SCREEN UP/);
   assert.match(src,/NO flipped phones, NO rear cameras/);
   if(ratio)assert.match(src,/EXACTLY HALF of the PHONE BODY WIDTH \(50%\)/);
   else assert.match(src,/ZERO lateral shift \(0%\)/);
   assert.doesNotMatch(src,/ONE THIRD|35%/);
   assert.match(src,/blank pure WHITE/);
  }
 }
});

test('the two modes are available for each iPhone model, but never in normal Mac or empty scenes',()=>{
 for(const sub of ['iphone17','iphone17pro']){
  const s={...defaults,subject:sub,spatial:'grounded'};
  assert.ok(choices(s,p).layout.includes('repeated-grid'));
  assert.ok(choices(s,p).layout.includes('repeated-grid-half-offset'));
  assert.deepEqual(choices({...s,layout:'repeated-grid-half-offset'},p).spatial,['grounded']);
  assert.deepEqual(choices({...s,layout:'repeated-grid-half-offset'},p).pose,['flat-face-up']);
  assert.deepEqual(choices({...s,layout:'repeated-grid-half-offset'},p).composition,['iphone-tile-diagonal','iphone-tile-low-oblique','iphone-tile-steep-oblique']);
 }
 for(const sub of ['macbookpro14','pair','mac-pair','environment']){
  for(const layout of ['repeated-grid','repeated-grid-half-offset']){
   assert.ok(!choices({...defaults,subject:sub},p).layout.includes(layout));
   assert.throws(()=>assemble({...defaults,subject:sub,layout},p,d),/組み合わせ/);
  }
 }
 assert.ok(filterOptions(p).layout.includes('repeated-grid'));
 assert.ok(filterOptions(p).layout.includes('repeated-grid-half-offset'));
 assert.deepEqual(assemble(defaults,p,d).contract.devices,['iphone17']);
 assert.equal(choices(defaults,p).composition.length,6);
});

test('invalid repeated devices, pose, lighting mode or mixed models fail validation for both layouts',()=>{
 for(const base of ['iphone-grid-ivory-diagonal','iphone-grid-ivory-diagonal-half-offset']){
  for(const change of [
   x=>x.devices.pop(),
   x=>x.devices.splice(1,1,'iphone17pro'),
   x=>x.devices.splice(0,1,'macbookpro14'),
   x=>x.spatial_mode_id='suspended',
   x=>x.pose_id='upright',
   x=>x.composition_id='three-quarter-left'
  ]){
   const tmp=structuredClone(p);
   change(tmp.showcase_presets.find(x=>x.id===base));
   assert.throws(()=>validateCatalog(tmp,d),/iPhone反復パターン契約/);
  }
 }
});

test('published concept previews have numerically exact 0% and half-body 50% offsets',()=>{
 const m=JSON.parse(readFileSync(new URL('../assets/experimental-previews/manifest.json',import.meta.url),'utf8'));
 assert.equal(m.geometry_demo.body_width_px,212);
 assert.equal(m.geometry_demo.aligned_offset_px,0);
 assert.equal(m.geometry_demo.half_offset_px,106);
 assert.equal(m.geometry_demo.half_offset_px*2,m.geometry_demo.body_width_px);
 assert.equal(m.geometry_demo.half_offset_ratio,0.5);
 const ex5=m.images.find(x=>x.id==='EX05'),ex6=m.images.find(x=>x.id==='EX06');
 assert.equal(ex5.source_prompt,'prompts/iphone17/repeated-ivory-diagonal.txt');
 assert.equal(ex6.source_prompt,'prompts/iphone17/repeated-ivory-diagonal-half-offset.txt');
 assert.equal(ex5.generated_from_source_prompt,false);
 assert.equal(ex6.generated_from_source_prompt,false);
});
