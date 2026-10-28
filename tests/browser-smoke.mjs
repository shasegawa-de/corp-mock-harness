import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {chromium} from 'playwright-core';

const root=resolve(import.meta.dirname,'../_site');
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
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
  await page.waitForFunction(()=>document.querySelectorAll('#gallery-view article.item').length===32);
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
  assert.ok(parseFloat(headingTypography.size)>=18&&parseFloat(headingTypography.size)<=21,
    'Compact headline should be 18–21px');
  assert.equal(await page.locator('footer.catalog-notes').count(),0,
    'Redundant bottom notes section must be absent');
  const headerAlignment=await page.locator('header .header-row').evaluate(row=>{
    const group=row.firstElementChild.getBoundingClientRect();
    const github=row.querySelector('a.repo').getBoundingClientRect();
    const header=row.getBoundingClientRect();
    return {
      verticalDifference:Math.abs((group.top+group.bottom)/2-(github.top+github.bottom)/2),
      alignItems:getComputedStyle(row).alignItems,
      height:header.height
    };
  });
  assert.equal(headerAlignment.alignItems,'center');
  assert.ok(headerAlignment.verticalDifference<3,
    'GitHub repository button must be vertically centered against the title group');
  const desktopHeader=await page.locator('body > header').evaluate(header=>{
    const left=header.querySelector('.header-row > div').getBoundingClientRect();
    const right=header.querySelector('a.repo').getBoundingClientRect();
    return {
      padLeft:parseFloat(getComputedStyle(header).paddingLeft),
      padRight:parseFloat(getComputedStyle(header).paddingRight),
      left:left.left,rightGap:window.innerWidth-right.right
    };
  });
  assert.equal(desktopHeader.padLeft,24,'Desktop header uses a 24px left gutter');
  assert.equal(desktopHeader.padRight,24,'Desktop header uses a 24px right gutter');
  assert.ok(Math.abs(desktopHeader.left-24)<2,'Heading sits near the left viewport edge');
  assert.ok(Math.abs(desktopHeader.rightGap-24)<2,'GitHub link sits near the right viewport edge');
  await page.setViewportSize({width:687,height:900});
  const tabletHeader=await page.locator('body > header').evaluate(header=>{
    const heading=header.querySelector('.header-row > div').getBoundingClientRect();
    const github=header.querySelector('a.repo').getBoundingClientRect();
    return {left:heading.left,rightGap:innerWidth-github.right,
      verticalDifference:Math.abs((heading.top+heading.bottom)/2-(github.top+github.bottom)/2),
      overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert.ok(Math.abs(tabletHeader.left-24)<2,'Tablet title must remain near the left edge');
  assert.ok(Math.abs(tabletHeader.rightGap-24)<2,'Tablet GitHub link must sit at the right edge');
  assert.ok(tabletHeader.verticalDifference<3,'Tablet GitHub link must share the title row');
  assert.ok(tabletHeader.overflow<=1,'Tablet header must not cause horizontal scrolling');
  await page.setViewportSize({width:1280,height:900});
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
  assert.equal(await interactiveCards.count(),32,'All 32 cards are direct prompt-modal targets');
  assert.equal(await page.locator('#gallery-view .compose-entry button').count(),0,'Redundant gallery CTA removed');
  assert.equal(await page.locator('#gallery-view [data-image]').count(),0,'No legacy zoom buttons remain');
  assert.equal(await page.locator('#preview').count(),0,'Legacy preview dialog removed');
  const macPair=page.locator('#gallery-view article.item[data-id="MM1"]');
  assert.equal(await macPair.count(),1,'Two MacBook scene appears in the catalog');
  await page.waitForFunction(()=>['MM1','MM2'].every(id=>{
    const card=document.querySelector('#gallery-view article.item[data-id="'+id+'"]');
    const image=card?.querySelector('img');
    return image?.complete&&image?.naturalWidth>=1000&&image.dataset.onlineImage?.includes('/assets/macbook-pair/')
      &&card.querySelector('.quality')?.textContent.includes('生成済み');
  }));
  assert.match(await macPair.locator('.quality').innerText(),/生成済み・要レビュー/);
  assert.match(await macPair.locator('img').getAttribute('alt'),/画像生成済み/);
  assert.match(await page.locator('#gallery-view article.item[data-id="MM2"] .quality').innerText(),/生成済み・要レビュー/);
  for(const id of ['MM1','MM2']){
    const img=page.locator('#gallery-view article.item[data-id="'+id+'"] img');
    const rendered=await img.evaluate(el=>({width:el.naturalWidth,height:el.naturalHeight,src:el.currentSrc}));
    assert.ok(rendered.width>=1000&&rendered.height>=550, id+' loaded full-sized image');
    assert.ok(Math.abs(rendered.width/rendered.height-16/9)<0.025,id+' is widescreen 16:9');
    assert.match(rendered.src,/assets\/macbook-pair\/mm[12]-(?:grounded|suspended)\.jpg$/);
  }
  await macPair.click();
  assert.equal(await page.locator('#composer').evaluate(el=>el.open),true);
  assert.match(await page.locator('#composer-prompt').innerText(),/two identical 14-inch MacBook Pro laptops/);
  await page.locator('#composer-close').click();
  assert.equal(await page.locator('#gallery-view article.item[data-id="MM2"]').count(),1);
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
  await drawer.locator('[data-filter-axis="subject"]').getByRole('radio',{name:'Mac + Mac（2台）'}).click();
  assert.equal(await page.locator('#gallery-view article.item:visible').count(),2,'Mac+Mac subject shows two ungenerated cards');
  assert.equal(await page.locator('.table tbody tr:not([data-next-hidden="true"])').count(),2);
  await drawer.locator('#reset-filters').click();
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
  assert.equal(await page.locator('#gallery-view article.item:visible').count(),32);
  assert.equal(await page.locator('#count').innerText(),'32 / 32');
  assert.equal(await page.locator('.table tbody tr:not([data-next-hidden="true"])').count(),32);
  await drawer.locator('[data-filter-axis="quality"] button[data-value]:not([data-value=""])').first().click();
  assert.notEqual(await page.locator('#quality-filter').inputValue(),await page.locator('#quality-filter option').first().getAttribute('value'),'Quality facet must drive the existing catalog filter');
  await drawer.locator('#reset-filters').click();
  assert.equal(await page.locator('#gallery-view article.item:visible').count(),32);
  await page.setViewportSize({width:390,height:844});
  const mobileHeader=await page.locator('body > header').evaluate(header=>({
    padLeft:parseFloat(getComputedStyle(header).paddingLeft),
    padRight:parseFloat(getComputedStyle(header).paddingRight)
  }));
  assert.equal(mobileHeader.padLeft,16,'Mobile header uses a 16px left gutter');
  assert.equal(mobileHeader.padRight,16,'Mobile header uses a 16px right gutter');
  const phoneHeader=await page.locator('body > header').evaluate(header=>{
    const heading=header.querySelector('.header-row > div').getBoundingClientRect();
    const github=header.querySelector('a.repo').getBoundingClientRect();
    return {left:heading.left,rightGap:innerWidth-github.right,githubBelow:github.top>=heading.bottom,
      overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert.ok(Math.abs(phoneHeader.left-16)<2,'Phone title must be left aligned');
  assert.ok(Math.abs(phoneHeader.rightGap-16)<2,'Phone GitHub link must be right aligned');
  assert.equal(phoneHeader.githubBelow,true,'Phone GitHub link wraps below title without moving left');
  assert.ok(phoneHeader.overflow<=1,'Phone header must not cause horizontal scrolling');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),
    'Compact title and centered GitHub button must not create horizontal overflow on mobile');
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
  // Deployment routing: homepage is the full vNext, /next/ stays bookmarkable,
  // and the previous canonical build remains accessible at /legacy/.
  const homepage=await browser.newPage({viewport:{width:1280,height:900}});
  const homeErrors=[];
  homepage.on('pageerror',error=>homeErrors.push(error.message));
  const homeResponse=await homepage.goto(new URL('/',url).href,{waitUntil:'domcontentloaded'});
  assert.equal(homeResponse.status(),200);
  await homepage.waitForFunction(()=>document.querySelectorAll('#gallery-view article.item[role="button"]').length===32);
  assert.equal(await homepage.locator('#composer-error').isHidden(),true,'Home page must load module-relative configuration');
  assert.equal(await homepage.locator('header h1').innerText(),'PROMPT & VISUAL CATALOG');
  assert.equal(await homepage.locator('#gallery-view article.item').count(),32);
  await homepage.waitForFunction(()=>['MM1','MM2'].every(id=>
    document.querySelector('#gallery-view article.item[data-id="'+id+'"] .quality')?.textContent.includes('生成済み')
  ),{timeout:10000});
  assert.equal(await homepage.locator('.catalog-sidebar .filter-drawer').evaluate(el=>el.open),true);
  await homepage.locator('#gallery-view article.item').first().click();
  assert.equal(await homepage.locator('#composer').evaluate(el=>el.open),true,'Root gallery card opens the prompt editor');
  await homepage.locator('#composer-close').click();
  await homepage.waitForFunction(()=>['MR1','MR2','TX1','TX2'].every(id=>
    document.querySelector(`#gallery-view article.item[data-id="${id}"] .quality`)?.textContent.includes('画像採用')
  ));
  assert.deepEqual(homeErrors,[],'Root version has no page errors');
  await homepage.close();
  const legacy=await browser.newPage();
  const legacyResponse=await legacy.goto(new URL('/legacy/',url).href,{waitUntil:'domcontentloaded'});
  assert.equal(legacyResponse.status(),200);
  assert.equal(await legacy.locator('#gallery-view article.item').count(),30,'Archived catalog retains 30 cards');
  assert.equal(await legacy.locator('#composer').count(),0,'Archived catalog remains the original, without vNext modal');
  await legacy.close();
  assert.deepEqual(errors,[],'No unhandled page errors');
  console.log('PASS: 32 cards including two unrendered Mac+Mac variants; full-height flush-left unboxed filter region; nine facets; mobile modal; resize; composer; approved image assets.');
}finally{await browser.close();server.close();}
