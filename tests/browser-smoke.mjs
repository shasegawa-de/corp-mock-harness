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
  await page.locator('#open-filters').click();
  assert.equal(await page.locator('#filter-drawer').evaluate(el=>el.open),true);
  const drawer=page.locator('#filter-drawer');
  assert.equal(await drawer.locator('[role="radiogroup"]').count(),4);
  await drawer.getByRole('radio',{name:'iPhone 17'}).click();
  await page.waitForFunction(()=>[...document.querySelectorAll('#gallery-view article.item')].filter(el=>getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getClientRects().length>0).length<30);
  const categoryVisible=await page.locator('#gallery-view article.item:visible').count();
  assert.equal(categoryVisible,9,'iPhone 17 filter must show nine standalone cards');
  await drawer.getByRole('radio',{name:'ブロック上'}).click();
  const blockVisible=await page.locator('#gallery-view article.item:visible').count();
  assert.ok(blockVisible>0&&blockVisible<categoryVisible,'Placement must reduce the individual card set');
  await drawer.locator('#show-filters').click();
  assert.equal(await drawer.evaluate(el=>el.open),false);
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'open-filters');
  await page.locator('#gallery-view article.item:visible').first().getByRole('button',{name:/プロンプト確認/}).click();
  await page.locator('#composer-prompt').waitFor({state:'visible'});
  assert.ok((await page.locator('#composer-prompt').textContent()).trim().length>70);
  const firstHeading=await page.locator('#composer-content > .composer-heading').first().innerText();
  assert.ok(firstHeading.includes('プロンプト'),'Prompt must appear before condition fields');
  await page.locator('#composer-close').click();
  await page.locator('#open-filters').click();
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
