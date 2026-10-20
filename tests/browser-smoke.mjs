import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {chromium} from 'playwright-core';

const root=resolve(import.meta.dirname,'../_site');
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=createServer((request,response)=>{
  try{
    let name=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    if(name.endsWith('/'))name+='index.html';
    const path=resolve(root,'.'+name);
    if(!path.startsWith(root+sep))throw Error('Unexpected path');
    const bytes=readFileSync(path);
    response.writeHead(200,{'Content-Type':mime[extname(path)]??'application/octet-stream'});
    response.end(bytes);
  }catch(error){response.writeHead(404);response.end(String(error));}
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const url='http://127.0.0.1:'+server.address().port+'/next/';
const candidates=[process.env.CHROME_PATH,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/opt/google/chrome/chrome','/usr/bin/chromium'].filter(Boolean);
const executablePath=candidates.find(path=>existsSync(path));
if(!executablePath){server.close();throw Error('Chrome is unavailable on the runner');}
const browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
try{
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelectorAll('#gallery-view article.item').length===30);
  await page.waitForTimeout(250);
  const createdButtons=await page.locator('.compose-entry button').count();
  const composerError=await page.locator('#composer-error').textContent();
  console.log('MODAL_INIT',JSON.stringify({createdButtons,composerError,errors}));
  assert.equal(createdButtons,30, 'Each original card requires a prompt confirmation button');
  await page.waitForFunction(()=>['MR1','MR2','TX1','TX2'].every(id=>{
    const card=document.querySelector('#gallery-view article.item[data-id="'+id+'"]');
    return card?.querySelector('.quality')?.textContent.includes('画像採用・GPT Image')&&card.querySelector('img')?.dataset.onlineImage?.includes('/assets/architectural-surfaces/');
  }),null,{timeout:20000});
  for(const id of ['MR1','MR2','TX1','TX2']){
    const img=page.locator('#gallery-view article.item[data-id="'+id+'"] img');
    await img.evaluate(node=>{node.loading='eager';});
    await page.waitForFunction(id=>{
      const img=document.querySelector('#gallery-view article.item[data-id="'+id+'"] img');
      return img?.complete&&img?.naturalWidth===1672;
    },id,{timeout:15000});
  }
  console.log('APPROVED_ASSETS_VISIBLE',JSON.stringify(await page.locator('#gallery-view article.item .quality').allTextContents()));
  const tx2=page.locator('#gallery-view article.item[data-id="TX2"]');
  assert.equal(await tx2.count(),1,'Fiber-cement TX2 card must remain in the catalog');
  assert.ok((await tx2.locator('img').getAttribute('alt'))?.includes('繊維セメント'),'TX2 approved image must be accessible');

  const tx1=page.locator('#gallery-view article.item[data-id="TX1"]');
  assert.equal(await tx1.count(),1,'Microcement TX1 card must remain in the catalog');
  assert.ok((await tx1.locator('img').getAttribute('alt'))?.length>10,'TX1 approved image must be accessible');

  const mr1=page.locator('#gallery-view article.item[data-id="MR1"]');
  assert.equal(await mr1.count(),1,'Carrara MR1 card must remain in the catalog');
  assert.ok((await mr1.locator('img').getAttribute('alt'))?.includes('大理石'),'MR1 approved image must be accessible');

  const mr2=page.locator('#gallery-view article.item[data-id="MR2"]');
  assert.equal(await mr2.count(),1);
  assert.ok((await mr2.locator('img').getAttribute('alt'))?.includes('大理石'),'MR2 approved image must be accessible');
  await page.locator('#open-filters').click();
  assert.equal(await page.locator('#filter-drawer').evaluate(el=>el.open),true);
  const drawer=page.locator('#filter-drawer');
  assert.equal(await drawer.locator('[role="radiogroup"]').count(),9);
  for(const axis of ['subject','layout','spatial','pose','surface','composition','environment','lighting','quality']){
    assert.ok(await drawer.locator(`[data-filter-axis="${axis}"] [role="radio"]`).count()>1,axis+' tags should exist');
  }
  await drawer.locator('[data-filter-axis="subject"]').getByRole('radio',{name:'iPhone 17'}).click();
  await page.waitForFunction(()=>[...document.querySelectorAll('#gallery-view article.item')].filter(el=>getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getClientRects().length>0).length<30);
  const categoryVisible=await page.locator('#gallery-view article.item:visible').count();
  assert.equal(categoryVisible,9,'iPhone 17 filter must show nine standalone cards');
  await drawer.locator('[data-filter-axis="spatial"]').getByRole('radio',{name:'ブロック上'}).click();
  const blockVisible=await page.locator('#gallery-view article.item:visible').count();
  assert.ok(blockVisible>0&&blockVisible<categoryVisible,'Placement must reduce the individual card set');
  assert.equal(await page.locator('.table tbody tr:not([data-next-hidden="true"])').count(),blockVisible,'Table and gallery must share the same selected set');
  await drawer.locator('[data-filter-axis="pose"] [data-value="flat-face-up"]').click();
  assert.ok((await page.locator('#gallery-view article.item:visible').count())>0,'Pose must match existing card');
  await drawer.locator('[data-filter-axis="environment"] [data-value="carrara-marble-wall-floor"]').click();
  assert.equal(await page.locator('#gallery-view article.item:visible').count(),0,'Unrepresented combinations must return zero results');
  assert.equal(await drawer.locator('#show-filters').innerText(),'0件を表示');
  assert.equal(await page.locator('.table tbody tr:not([data-next-hidden="true"])').count(),0,'Empty combinations must also hide table rows');
  await drawer.locator('[data-filter-axis="environment"] [data-value=""]').click();
  await drawer.locator('#show-filters').click();
  assert.equal(await drawer.evaluate(el=>el.open),false);
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'open-filters');
  await page.locator('#gallery-view article.item:visible').first().getByRole('button',{name:/プロンプトを確認/}).click();
  await page.locator('#composer-prompt').waitFor({state:'visible'});
  assert.ok((await page.locator('#composer-prompt').textContent()).trim().length>70);
  const firstHeading=await page.locator('#composer-content > .composer-heading').first().innerText();
  assert.ok(firstHeading.includes('プロンプト'),'Prompt must appear before condition fields');
  await page.locator('#composer-close').click();
  await page.locator('#open-filters').click();
  await drawer.locator('#reset-filters').click();
  assert.equal(await page.locator('#gallery-view article.item:visible').count(),30);
  assert.equal(await page.locator('#count').innerText(),'30 / 30');
  assert.equal(await page.locator('.table tbody tr:not([data-next-hidden="true"])').count(),30);
  await drawer.locator('[data-filter-axis="quality"] button[data-value]:not([data-value=""])').first().click();
  assert.notEqual(await page.locator('#quality-filter').inputValue(),await page.locator('#quality-filter option').first().getAttribute('value'),'Quality facet must drive the existing catalog filter');
  await drawer.locator('#reset-filters').click();
  assert.equal(await page.locator('#gallery-view article.item:visible').count(),30);
  await drawer.locator('#close-filters').click();
  await page.setViewportSize({width:390,height:844});
  await page.locator('#open-filters').click();
  const width=await drawer.evaluate(el=>el.getBoundingClientRect().width);
  assert.ok(width>=380&&width<=390,'Drawer should occupy the mobile viewport');
  await page.keyboard.press('Escape');
  assert.equal(await drawer.evaluate(el=>el.open),false);
  assert.deepEqual(errors,[],'No unhandled page errors');
  console.log('PASS: 30 cards; four original filter groups; category/placement/reset; prompt modal; focus restore; mobile drawer; Escape.');
}finally{await browser.close();server.close();}
