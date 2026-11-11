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

test('layout types expose aligned columns and vertical half-length stagger',()=>{
 validateCatalog(p,d);
 assert.equal(p.device_layouts.find(x=>x.id==='repeated-grid').device_count,6);
 const half=p.device_layouts.find(x=>x.id==='repeated-grid-half-offset');
 assert.equal(half.device_count,6);
 assert.equal(half.column_vertical_offset_ratio,0.5);
 assert.equal(half.column_vertical_offset_reference,'device_body_length');
 assert.ok(!('offset_ratio' in half));
 assert.match(half.detail,/CENTER COLUMN DOWN vertically by EXACTLY HALF of ONE handset LONG BODY LENGTH \(50%\)/);
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
   assert.equal(out.contract.column_vertical_offset_ratio,ratio);
   assert.equal(out.contract.pose_id,'flat-face-up');
   assert.match(out.prompt,/Six SAME-MODEL phones FRONT-SCREEN UP, never rear-facing/);
   if(ratio)assert.match(out.prompt,/CENTER COLUMN DOWN vertically EXACTLY HALF of ONE phone LONG BODY LENGTH \(50%\)/);
   else assert.match(out.prompt,/ZERO vertical offset, 0%/);
   assert.doesNotMatch(out.prompt,/35%|one.third/i);
   assert.match(out.prompt,/featureless pure white/);
   assert.match(out.prompt,/ONE camera view/);
   assert.ok(out.words>=80&&out.words<=170,id+': '+out.words);
   const src=readFileSync(new URL('../'+row.reference_prompt,import.meta.url),'utf8');
   assert.match(src,/Exactly SIX identical/);
   assert.match(src,/all the SAME model/);
   assert.match(src,/FRONT SCREEN UP/);
   assert.match(src,/NO flipped phones, NO rear cameras/);
   if(ratio)assert.match(src,/CENTER COLUMN DOWN by EXACTLY HALF the phone LONG BODY LENGTH \(50%\)/);
   else assert.match(src,/ZERO VERTICAL shift \(0%\)/);
   assert.doesNotMatch(src,/SECOND ROW sideways|BODY WIDTH \(50%\)|ONE THIRD|35%/);
   assert.match(src,/blank pure WHITE/i);
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
  assert.deepEqual(choices({...s,layout:'repeated-grid-half-offset'},p).composition,['iphone-tile-diagonal','iphone-tile-low-oblique','iphone-tile-steep-oblique','iphone-tile-detail-closeup']);
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

test('legacy horizontal raster demo invalidated; EX09 is provisional, close-up and vertical length-based',()=>{
 const m=JSON.parse(readFileSync(new URL('../assets/experimental-previews/manifest.json',import.meta.url),'utf8'));
 assert.equal(m.geometry_demo.status,'SUPERSEDED_DO_NOT_USE_FOR_CURRENT_VERTICAL_COLUMN_CONTRACT');
 assert.equal(m.geometry_demo.actual_axis,'horizontal_translation_of_second_row');
 const ex6=m.images.find(x=>x.id==='EX06'),ex9=m.images.find(x=>x.id==='EX09');
 assert.match(ex6.review_note,/仕様には不適合/);
 assert.equal(ex9.quality,'unapproved');
 assert.equal(ex9.generated_from_source_prompt,false);
 assert.match(ex9.actual_aspect_ratio,/^16:9 \(1672×941 px/);
 assert.equal(ex9.geometric_50_percent_verification,'UNVERIFIED');
 const {out:result}=fromId('iphone-grid-ivory-detail-vertical-half-offset');
 assert.equal(result.contract.column_vertical_offset_ratio,0.5);
 assert.equal(result.contract.column_vertical_offset_reference,'device_body_length');
 assert.match(result.prompt,/Close-up elevated 48–58-degree/);
 assert.ok(result.words>=80&&result.words<=170);
 const source=readFileSync(new URL('../'+ex9.source_prompt,import.meta.url),'utf8');
 assert.match(source,/THREE evenly spaced VERTICAL columns of TWO phones/);
 assert.match(source,/CENTER COLUMN DOWN by EXACTLY HALF/);
 assert.match(source,/NEVER shift rows sideways/);
});
