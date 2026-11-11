import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {renderNextCatalog} from '../scripts/render-next-catalog.mjs';
const manifest=JSON.parse(readFileSync(new URL('../assets/experimental-previews/manifest.json',import.meta.url),'utf8'));
const catalog=readFileSync(new URL('../catalog/index.html',import.meta.url),'utf8');
const editor=readFileSync(new URL('../catalog-next/editor.html',import.meta.url),'utf8');
test('eight unapproved raster previews exist and are not misrepresented as tested prompt output',()=>{
 assert.equal(manifest.approved,false);
 assert.equal(manifest.images.length,8);
 for(const row of manifest.images){
  const bytes=readFileSync(new URL('../'+row.asset,import.meta.url));
  assert.ok(bytes.length>1000,row.asset);
  assert.equal(bytes[0],0xff,row.asset);
  assert.equal(bytes[1],0xd8,row.asset);
  assert.equal(row.generated_from_source_prompt,false,row.id);
  assert.equal(row.quality,'unapproved',row.id);
 }
});
test('canonical 30+2 catalog preserved; eight supplementary previews visible on both routes',()=>{
 for(const [base,prefix] of [['./','../'],['./next/','./']]){
  const html=renderNextCatalog(catalog,editor,'preflight',base);
  assert.equal((html.match(/<article class="item"/g)||[]).length,40);
  assert.equal((html.match(/data-preview="experimental"/g)||[]).length,8);
  assert.equal((html.match(/class="quality provisional">仮検証・未承認/g)||[]).length,8);
  for(const row of manifest.images){
   assert.match(html,new RegExp('data-id="'+row.id+'"'));
   assert.ok(html.includes(prefix+row.asset),row.asset);
   assert.ok(html.includes('GitHubのプロンプト'));
  }
  assert.ok(html.indexOf('data-id="EX01"')>html.indexOf('data-id="MM2"'));
  assert.match(html,/この画像は個別の定義プロンプトから生成した結果ではありません/);
 }
});
