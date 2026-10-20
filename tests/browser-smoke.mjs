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
  const headingTypography=await page.locator('header h1').evaluate(el=>({
    font:getComputedStyle(el).fontFamily,
    weight:getComputedStyle(el).fontWeight,
    spacing:getComputedStyle(el).letterSpacing,
    size:getComputedStyle(el).fontSize,
    bodyFont:getComputedStyle(document.body).fontFamily,
    content:el.textContent.trim()
  }));
  assert.equal(headingTypography.content,'PROMPT & VISUAL CATALOG');
  assert.match(headingTypography.font,/Outfit/i,'The vNext headline uses Google Fonts Outfit');
  assert.equal(headingTypography.weight,'700');
  assert.ok(Math.abs(parseFloat(headingTypography.spacing)-parseFloat(headingTypography.size)*0.03)<0.05,
    'Only the main title has 0.03em positive letter spacing');
  assert.doesNotMatch(headingTypography.bodyFont,/Outfit/i,'Body typography is unchanged');
  const sectionHeading=await page.locator('.toolbar-bottom h2').evaluate(el=>({
    font:getComputedStyle(el).fontFamily,weight:getComputedStyle(el).fontWeight
  }));
  assert.match(sectionHeading.font,/Outfit/i,'Gallery section title uses Outfit');
  assert.equal(sectionHeading.weight,'700');
  const cardHeading=await page.locator('#gallery-view article.item h3').first().evaluate(el=>({
    font:getComputedStyle(el).fontFamily,weight:getComputedStyle(el).fontWeight
  }));
  assert.match(cardHeading.font,/Outfit/i,'Latin glyphs in card titles use Outfit');
  assert.equal(cardHeading.weight,'700');
  const interactiveCards=page.locator('#gallery-view article.item[role="button"][tabindex="0"]');
  assert.equal(await interactiveCards.count(),30,'All 30 cards are direct prompt-modal targets');
  assert.equal(await page.locator('#gallery-view .compose-entry button').count(),0,'Redundant gallery CTA removed');
  assert.equal(await page.locator('#gallery-view [data-image]').count(),0,'No legacy zoom buttons remain');
  assert.equal(await page.locator('#preview').count(),0,'Legacy preview dialog removed');
  const firstCard=interactiveCards.first();
  const firstId=await firstCard.getAttribute('data-id');
  const composer=page.locator('#composer');
  await firstCard.locator('.image-wrap').click();
  assert.equal(await composer.evaluate(el=>el.open),true,'Image tap opens prompt modal');
  assert.ok((await page.locator('#composer-prompt').textContent()).trim().length>70);
  await page.locator('#composer-close').click();
  assert.equal(await composer.evaluate(el=>el.open),false);
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.id),firstId,'Focus returns to card after modal close');
  await firstCard.locator('.card-body h3').click();
  assert.equal(await composer.evaluate(el=>el.open),true,'Text/body tap opens prompt modal');
  await page.keyboard.press('Escape');
  await firstCard.focus();
  await page.keyboard.press('Enter');
  assert.equal(await composer.evaluate(el=>el.open),true,'Enter activates focused card');
  await page.locator('#composer-close').click();
  await firstCard.focus();
  await page.keyboard.press('Space');
  assert.equal(await composer.evaluate(el=>el.open),true,'Space activates focused card');
  await page.locator('#composer-close').click();
  const composerError=await page.locator('#composer-error').textContent();
  console.log('MODAL_INIT',JSON.stringify({interactiveCards:await interactiveCards.count(),composerError,errors}));
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
  const drawer=page.locator('#filter-drawer');
  await page.waitForFunction(()=>document.getElementById('filter-drawer')?.open);
  assert.equal(await page.locator('#open-filters').isVisible(),false);
  assert.equal(await drawer.evaluate(el=>el.matches(':modal')),false,'Desktop left sidebar is non-modal');
  const heading=await drawer.locator('#filter-heading').boundingBox();
  const clear=drawer.locator('.filter-drawer-header #reset-filters');
  const clearBox=await clear.boundingBox();
  const headerBox=await drawer.locator('.filter-drawer-header').boundingBox();
  assert.ok(heading&&clearBox&&headerBox&&clearBox.x>heading.x+heading.width,'Clear is right of the filter title');
  assert.ok(clearBox.x+clearBox.width<=headerBox.x+headerBox.width+1,'Clear aligns within header right edge');
  assert.equal(await clear.isDisabled(),true,'Clear is disabled before any selection');
  const sidebar=await page.locator('.catalog-sidebar').boundingBox();
  const content=await page.locator('.catalog-content').boundingBox();
  assert.ok(sidebar&&content&&sidebar.x+sidebar.width<=content.x,'Filter must be left of the gallery');
  assert.ok(Math.abs(sidebar.x)<=1,'Filter area should meet viewport left edge');
  const layout=await page.locator('main.catalog-layout').evaluate(el=>({
    left:el.getBoundingClientRect().left,
    paddingLeft:getComputedStyle(el).paddingLeft,
    gap:getComputedStyle(el).columnGap
  }));
  assert.ok(Math.abs(layout.left)<=1&&layout.paddingLeft==='0px'&&layout.gap==='0px',
    'Desktop main should have no left inset or gap before the filter area');
  const visual=await page.locator('.catalog-sidebar .filter-drawer').evaluate(el=>({
    border:getComputedStyle(el).borderLeftWidth,
    rightBorder:getComputedStyle(el).borderRightWidth,
    radius:getComputedStyle(el).borderTopLeftRadius,
    shadow:getComputedStyle(el).boxShadow,
    background:getComputedStyle(el).backgroundColor
  }));
  assert.equal(visual.border,'0px','Filter is an area, not a bordered card');
  assert.equal(visual.rightBorder,'0px','Only the region separator should have a border');
  assert.equal(visual.radius,'0px','Filter area has no rounded corners');
  assert.equal(visual.shadow,'none','Filter area has no floating-card shadow');
  const separator=await page.locator('.catalog-sidebar').evaluate(el=>({
    borderRight:getComputedStyle(el).borderRightWidth,
    background:getComputedStyle(el).backgroundColor
  }));
  assert.equal(separator.borderRight,'1px','A vertical line separates the two regions');
  assert.equal(separator.background,'rgb(255, 255, 255)','Desktop filter region must remain pure white');
  const originalTags=await drawer.evaluate(panel=>{
    const idle=panel.querySelector('[data-filter-axis="subject"] button[data-value]:not([data-value=""])');
    const selected=panel.querySelector('[data-filter-axis="subject"] button[data-value=""]');
    const label=panel.querySelector('.tag-label');
    const options=panel.querySelector('.tag-options');
    const cs=getComputedStyle(idle),on=getComputedStyle(selected);
    return {
      fontSize:cs.fontSize,padding:cs.padding,borderRadius:cs.borderRadius,minWidth:cs.minWidth,
      background:cs.backgroundColor,color:cs.color,
      labelFontSize:getComputedStyle(label).fontSize,
      tagGap:getComputedStyle(options).gap,
      selectedBackground:on.backgroundColor,selectedColor:on.color
    };
  });
  assert.deepEqual(originalTags,{
    fontSize:'11px',padding:'6px 10px',borderRadius:'5px',minWidth:'64px',
    background:'rgb(241, 243, 243)',color:'rgb(70, 81, 85)',
    labelFontSize:'12px',tagGap:'6px',
    selectedBackground:'rgb(32, 38, 42)',selectedColor:'rgb(255, 255, 255)'
  },'Restore the original tag visual design without sidebar-only overrides');
  await page.evaluate(()=>window.scrollTo(0,700));
  await page.waitForTimeout(100);
  const fixed=await page.locator('.catalog-sidebar').boundingBox();
  assert.ok(fixed&&Math.abs(fixed.y)<5,'Full-height left filter region stays sticky at viewport top');
  await page.evaluate(()=>window.scrollTo(0,0));
  assert.equal(await drawer.locator('[role="radiogroup"]').count(),9);
  for(const axis of ['subject','layout','spatial','pose','surface','composition','environment','lighting','quality']){
    assert.ok(await drawer.locator(`[data-filter-axis="${axis}"] [role="radio"]`).count()>1,axis+' tags should exist');
  }
  const cameraGroup=drawer.locator('[data-filter-axis="composition"]');
  assert.equal(await cameraGroup.locator('button').count(),7,'Camera filter initially offers six editor-compatible choices plus All');
  await drawer.locator('[data-filter-axis="subject"]').getByRole('radio',{name:'iPhone 17'}).click();
  await page.waitForFunction(()=>[...document.querySelectorAll('#gallery-view article.item')].filter(el=>getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getClientRects().length>0).length<30);
  const categoryVisible=await page.locator('#gallery-view article.item:visible').count();
  assert.equal(categoryVisible,9,'iPhone 17 filter must show nine standalone cards');
  assert.equal(await clear.isEnabled(),true,'Clear becomes available after a selection');
  await drawer.locator('[data-filter-axis="spatial"]').getByRole('radio',{name:'ブロック上'}).click();
  const blockVisible=await page.locator('#gallery-view article.item:visible').count();
  assert.ok(blockVisible>0&&blockVisible<categoryVisible,'Placement must reduce the individual card set');
  assert.equal(await page.locator('.table tbody tr:not([data-next-hidden="true"])').count(),blockVisible,'Table and gallery must share the same selected set');
  await drawer.locator('[data-filter-axis="pose"] [data-value="flat-face-up"]').click();
  assert.ok((await page.locator('#gallery-view article.item:visible').count())>0,'Pose must match existing card');
  assert.deepEqual(await cameraGroup.locator('button').evaluateAll(buttons=>buttons.map(b=>b.dataset.value)),
    ['','iphone-oblique-block'],'Flat iPhone on block should offer the one camera choice allowed in editor');
  await cameraGroup.locator('[data-value="iphone-oblique-block"]').click();
  assert.ok((await page.locator('#gallery-view article.item:visible').count())>0,
    'Contextual camera filter must match a registered catalog card');
  await cameraGroup.locator('[data-value=""]').click();
  await drawer.locator('[data-filter-axis="environment"] [data-value="carrara-marble-wall-floor"]').click();
  assert.equal(await page.locator('#gallery-view article.item:visible').count(),0,'Unrepresented combinations must return zero results');
  assert.equal(await drawer.locator('#show-filters').innerText(),'0件を表示');
  assert.equal(await page.locator('.table tbody tr:not([data-next-hidden="true"])').count(),0,'Empty combinations must also hide table rows');
  await drawer.locator('[data-filter-axis="environment"] [data-value=""]').click();
  assert.equal(await drawer.evaluate(el=>el.open),true,'Desktop filters remain visible');
  await page.locator('#gallery-view article.item:visible').first().click();
  await page.locator('#composer-prompt').waitFor({state:'visible'});
  assert.ok((await page.locator('#composer-prompt').textContent()).trim().length>70);
  const firstHeading=await page.locator('#composer-content > .composer-heading').first().innerText();
  assert.ok(firstHeading.includes('プロンプト'),'Prompt must appear before condition fields');
  await page.locator('#composer-close').click();
  await clear.click();
  assert.equal(await cameraGroup.locator('button').count(),7,'Clear restores six default camera choices');
  assert.equal(await clear.isDisabled(),true,'Clear returns to disabled after reset');
  assert.equal(await page.locator('#gallery-view article.item:visible').count(),30);
  assert.equal(await page.locator('#count').innerText(),'30 / 30');
  assert.equal(await page.locator('.table tbody tr:not([data-next-hidden="true"])').count(),30);
  await drawer.locator('[data-filter-axis="quality"] button[data-value]:not([data-value=""])').first().click();
  assert.notEqual(await page.locator('#quality-filter').inputValue(),await page.locator('#quality-filter option').first().getAttribute('value'),'Quality facet must drive the existing catalog filter');
  await drawer.locator('#reset-filters').click();
  assert.equal(await page.locator('#gallery-view article.item:visible').count(),30);
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>!document.getElementById('filter-drawer')?.open);
  assert.equal(await page.locator('#open-filters').isVisible(),true);
  await page.locator('#open-filters').click();
  assert.equal(await drawer.evaluate(el=>el.matches(':modal')),true);
  const mobileHeading=await drawer.locator('#filter-heading').boundingBox();
  const mobileClear=await clear.boundingBox();
  assert.ok(mobileHeading&&mobileClear&&mobileClear.x>mobileHeading.x+mobileHeading.width,'Mobile clear remains to the right of title');
  const width=await drawer.evaluate(el=>el.getBoundingClientRect().width);
  assert.ok(width>=380&&width<=390,'Drawer should occupy the mobile viewport');
  await page.keyboard.press('Escape');
  assert.equal(await drawer.evaluate(el=>el.open),false);
  await page.setViewportSize({width:1280,height:900});
  await page.waitForFunction(()=>document.getElementById('filter-drawer')?.open);
  assert.equal(await drawer.evaluate(el=>el.matches(':modal')),false);
  assert.deepEqual(errors,[],'No unhandled page errors');
  console.log('PASS: 30 cards; full-height flush-left unboxed filter region; nine facets; mobile modal; resize; composer; approved image assets.');
}finally{await browser.close();server.close();}
