import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {renderNextCatalog} from '../scripts/render-next-catalog.mjs';
const manifest=JSON.parse(readFileSync(new URL('../assets/experimental-previews/manifest.json',import.meta.url),'utf8'));
const catalog=readFileSync(new URL('../catalog/index.html',import.meta.url),'utf8');
const editor=readFileSync(new URL('../catalog-next/editor.html',import.meta.url),'utf8');
test('nine unapproved raster previews exist and are not misrepresented as tested prompt output',()=>{
 assert.equal(manifest.approved,false);
 assert.equal(manifest.images.length,9);
 for(const row of manifest.images){
  const bytes=readFileSync(new URL('../'+row.asset,import.meta.url));
  assert.ok(bytes.length>1000,row.asset);
  assert.equal(bytes[0],0xff,row.asset);
  assert.equal(bytes[1],0xd8,row.asset);
  assert.equal(row.generated_from_source_prompt,false,row.id);
  assert.equal(row.quality,'unapproved',row.id);
 }
});
test('canonical 30+2 catalog preserved; nine supplementary previews visible on both routes',()=>{
 for(const [base,prefix] of [['./','../'],['./next/','./']]){
  const html=renderNextCatalog(catalog,editor,'preflight',base);
  assert.equal((html.match(/<article class="item"/g)||[]).length,41);
  assert.equal((html.match(/data-preview="experimental"/g)||[]).length,9);
  assert.equal((html.match(/class="quality provisional">仮検証・未承認/g)||[]).length,9);
  for(const row of manifest.images){
   assert.match(html,new RegExp('data-id="'+row.id+'"'));
   assert.ok(html.includes(prefix+row.asset),row.asset);
   assert.ok(html.includes('GitHubのプロンプト'));
  }
  assert.ok(html.indexOf('data-id="EX01"')>html.indexOf('data-id="MM2"'));
  assert.match(html,/この画像は個別の定義プロンプトから生成した結果ではありません/);
 }
});

// EX09 only: source PNG dimensions preserved in the replacement JPEG; near-16:9, still provisional.
function dimensionsFromJpeg(data){
 let i=2;
 while(i<data.length-12){
  if(data[i]!==0xff){i++;continue;}
  const marker=data[i+1];
  if(marker===0xda||marker===0xd9)break;
  if([0xc0,0xc1,0xc2,0xc3].includes(marker))return {height:data.readUInt16BE(i+5),width:data.readUInt16BE(i+7)};
  const length=data.readUInt16BE(i+2);
  if(length<2)break;
  i+=length+2;
 }
 throw Error('EX09 JPEG missing a dimensions header');
}
test('EX09 replacement image is near-16:9 at 1672×941 and still unapproved',()=>{
 const row=manifest.images.find(x=>x.id==='EX09');
 assert.ok(row);
 const image=readFileSync(new URL('../'+row.asset,import.meta.url));
 const size=dimensionsFromJpeg(image);
 assert.deepEqual(size,{width:1672,height:941});
 assert.ok(Math.abs(size.width/size.height-16/9)<0.005);
 assert.equal(row.image_origin.includes('1672×941'),true);
 assert.equal(row.generated_from_source_prompt,false);
 assert.equal(row.quality,'unapproved');
 assert.equal(row.geometric_50_percent_verification,'UNVERIFIED');
 assert.equal(row.physical_device_accuracy,'UNVERIFIED');
 assert.doesNotMatch(row.review_note,/本素材は4:3|16:9比率.*未達/);
 const output=renderNextCatalog(catalog,editor,'preflight','./');
 const card=output.slice(output.indexOf('data-id="EX09"'));
 assert.ok(card.includes('height="225"'));
 assert.match(card,/仮検証・未承認/);
});
