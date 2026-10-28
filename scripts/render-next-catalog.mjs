import {readFileSync} from 'node:fs';

// Only the explicitly requested catalog chrome changes are applied to the base.
export function catalogChrome(catalog){
  const header=catalog.match(/<header>[\s\S]*?<\/header>/)?.[0];
  const eyebrow=header?.match(/<div class="eyebrow">[\s\S]*?<\/div>/)?.[0];
  const title=header?.match(/<h1>[\s\S]*?<\/h1>/)?.[0]?.replace('Prompt &amp; Visual Catalog','PROMPT &amp; VISUAL CATALOG');
  const repository=header?.match(/<a class="repo"[\s\S]*?<\/a>/)?.[0];
  const start=catalog.indexOf('<div class="toolbar"');
  const end=catalog.indexOf('<div class="toolbar-bottom">');
  const toolbar=catalog.slice(start,end);
  const categories=toolbar.match(/<nav class="filters"[\s\S]*?<\/nav>/)?.[0];
  const facets=toolbar.match(/<div class="filter-field"><label for="placement-filter">[\s\S]*?<div class="reset-field">[\s\S]*?<\/div>/)?.[0];
  const intro=catalog.match(/<p class="intro">[\s\S]*?<\/p>/)?.[0];
  if(!eyebrow||!title||!repository||!intro||start<0||end<0||!categories||!facets)throw Error('Catalog header/filter structure changed');
  // Keep the canonical controls alive for the old catalog script, but let
  // vNext render its eight scene facets from the prompt engine instead.
  const legacySelects=[...facets.matchAll(/<select\b[\s\S]*?<\/select>/g)].map(([select])=>select.replace('<select','<select hidden')).join('');
  if((legacySelects.match(/<select /g)??[]).length!==3)throw Error('Catalog facets are missing');
  const dimensions=[['subject','対象'],['layout','並び方'],['spatial','配置'],['pose','姿勢'],['surface','建築面'],['composition','構図・カメラ'],['environment','素材'],['lighting','照明'],['quality','評価']];
  const tagRows=dimensions.map(([axis,title])=>`<div class="tag-row" data-filter-row="${axis}"><span id="facet-${axis}-label" class="tag-label">${title}</span><div class="tag-options" data-filter-axis="${axis}" role="radiogroup" aria-labelledby="facet-${axis}-label"></div></div>`).join('');
  const replacement=`<div class="toolbar toolbar-next" aria-label="作品の絞り込み"><div class="legacy-filters" hidden aria-hidden="true">${categories}${legacySelects}</div><div class="tag-panel">${tagRows}</div></div>\n`;
  return catalog.replace('<main>','<main class="catalog-layout">').replace(toolbar,`<aside class="catalog-sidebar" aria-label="絞り込み"><button id="open-filters" class="filter-open" type="button" aria-haspopup="dialog" aria-controls="filter-drawer">絞り込み <span aria-hidden="true">☷</span></button><dialog id="filter-drawer" class="filter-drawer" aria-labelledby="filter-heading"><div class="filter-drawer-header"><h2 id="filter-heading">絞り込み</h2><div class="filter-header-actions"><button id="close-filters" type="button" class="reset-filters">閉じる</button><button id="reset-filters" type="button" class="reset-filters">クリア</button></div></div>${replacement}<div class="filter-drawer-footer"><button type="button" id="show-filters" class="filter-apply">結果を表示</button></div></dialog></aside><div class="catalog-content">`).replace('</main>','</div></main>').replace(header,`<header><div class="header-row"><div>${eyebrow}${title}</div>${repository}</div></header>`)
    .replace(intro,'').replace(/<div class="footer">[\s\S]*?<\/div>/,'');
}

// All original cards are retained, but their old category wrappers are discarded in vNext.
export function flattenCatalogCards(catalog){
  const open='<div id="gallery-view">';
  const start=catalog.indexOf(open);
  const end=catalog.indexOf('<div class="nothing" id="nothing">',start);
  if(start<0||end<0)throw Error('Catalog gallery structure changed');
  const source=catalog.slice(start+open.length,end);
  const cards=[...source.matchAll(/<article class="item"[\s\S]*?<\/article>/g)].map(match=>match[0]);
  if(cards.length===0)throw Error('No gallery cards found');
  if(new Set(cards.map(card=>card.match(/data-id="([^"]+)"/)?.[1])).size!==cards.length)throw Error('Duplicate card ID');
  return catalog.slice(0,start)+open+cards.join('')+'</div>'+catalog.slice(end);
}

// Extra Mac+Mac references belong to vNext only. No real photograph exists yet:
// placeholders must NOT be represented as an approved generated asset.
const macPairReferences=[
  {id:'MM1',title:'MacBook Pro ×2・左右配置',spatial:'grounded',
    composition:'three-quarter-left',material:'microcement-seamless',light:'soft-overhead',
    summary:'14インチMacを2台、横並びに配置。両画面とキーボードが見える構図。',
    source:'prompts/macbookpro14-macbookpro14/side-by-side.txt'},
  {id:'MM2',title:'MacBook Pro ×2・前後浮遊',spatial:'suspended',
    composition:'three-quarter-right',material:'suspended-mineral-planes',light:'broad-softbox',
    summary:'14インチMacを2台、奥行きをつけて床のない空間に浮遊。',
    source:'prompts/macbookpro14-macbookpro14/suspended-depth.txt'}
];
const htmlEscape=value=>String(value).replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));
const macPairPlaceholder=encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#e7e9e9"/><text x="800" y="420" text-anchor="middle" font-family="sans-serif" font-size="34" fill="#677073">MacBook Pro 14 x 2</text><text x="800" y="485" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#677073">画像未生成 / NOT RENDERED</text></svg>');
export function appendMacPairReferences(catalog){
  if(catalog.includes('data-id="MM1"')||catalog.includes('data-id="MM2"'))throw Error('Mac pair reference already present');
  const articles=macPairReferences.map(row=>{
    const prompt=readFileSync(new URL('../'+row.source,import.meta.url),'utf8').trim();
    if(!prompt.startsWith('ONE standalone photorealistic product photograph. ONE camera view. Horizontal 16:9.'))throw Error('Mac pair prompt invalid: '+row.id);
    const words=prompt.split(/\s+/).length;
    if(words<80||words>170)throw Error('Mac pair prompt length invalid: '+row.id);
    const image='data:image/svg+xml;charset=utf-8,'+macPairPlaceholder;
    const url='https://github.com/shasegawa-de/corp-mock-harness/blob/main/'+row.source;
    const search=htmlEscape([row.id,row.title,'macbook pro mac mac-pair',row.composition,row.material,row.light,row.summary].join(' ').toLowerCase());
    return [
      '<article class="item" data-device="mac-pair" data-id="'+row.id+'" data-mode="'+row.spatial+'" data-search="'+search+'" data-status="candidate">',
      '<button aria-label="'+htmlEscape(row.title)+'の未生成プレースホルダー" class="image-wrap" data-image="'+row.id+'" type="button"><img alt="'+htmlEscape(row.title)+'：画像未生成。参考写真ではありません" decoding="async" loading="lazy" src="'+image+'"/></button>',
      '<div class="card-body"><div class="minor"><span>'+row.id+' / MacBook Pro ×2</span><span class="quality provisional">未生成・要検証</span></div>',
      '<h3>'+htmlEscape(row.title)+'</h3><p>'+htmlEscape(row.summary)+'</p>',
      '<dl class="settings"><dt>構図</dt><dd>'+row.composition+'</dd><dt>背景</dt><dd>'+row.material+'</dd><dt>照明</dt><dd>'+row.light+'</dd></dl>',
      '<div class="qa"><strong>画像QA</strong> 未生成。写真・筐体精度・実効プロンプト一致は未検証。プロンプトの作例のみ登録。</div>',
      '<details><summary>プロンプト全文 <span>'+words+' words</span></summary><pre>'+htmlEscape(prompt)+'</pre><div class="prompt-actions"><button class="copy" data-copy="'+row.id+'" type="button">全文をコピー</button><a href="'+url+'" rel="noopener noreferrer" target="_blank">GitHubのプロンプト ↗</a></div></details></div>',
      '</article>'
    ].join('\n');
  }).join('');
  const rows=macPairReferences.map(row=>
    '<tr data-device="mac-pair" data-mode="'+row.spatial+'" data-search="'+htmlEscape(row.id+' '+row.title+' mac mac-pair '+row.material)+'" data-status="candidate"><td>'+row.id+'</td><td>'+htmlEscape(row.title)+'</td><td>MacBook Pro ×2</td><td>'+row.spatial+'</td><td>'+row.material+'</td><td>未生成・要検証</td><td><button data-jump="'+row.id+'" type="button">詳細</button></td></tr>'
  ).join('');
  const galleryEnd='</div><div class="nothing" id="nothing">';
  if(catalog.split(galleryEnd).length!==2||catalog.split('</tbody>').length!==2)throw Error('Cannot extend gallery/table');
  return catalog.replace(galleryEnd,articles+galleryEnd).replace('</tbody>',rows+'</tbody>');
}

// Cards, images, table, shared styles and the existing scripts are reused.
export function renderNextCatalog(catalog,editor,version='local',assetBase='./'){
  if(!catalog.includes('</head>')||!catalog.includes('</main>'))throw Error('Catalog insertion points are missing');
  const revision=encodeURIComponent(version);
  return appendMacPairReferences(flattenCatalogCards(catalogChrome(catalog))).replace('</head>',`<!-- composer-assets:start --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@700&amp;display=swap"><link rel="stylesheet" href="${assetBase}style.css?v=${revision}"><link rel="stylesheet" href="${assetBase}left-sidebar.css?v=${revision}"><script type="module" src="${assetBase}app.mjs?v=${revision}"></script><script type="module" src="${assetBase}sidebar-mode.mjs?v=${revision}"></script><!-- composer-assets:end --></head>`)
    .replace('</main>',`<!-- composer-editor:start -->${editor}<!-- composer-editor:end --></main>`);
}

export function versionLocalImports(source,version){
  return source.replace(/(\bfrom\s+['"])(\.\/[^'"]+\.mjs)(['"])/g,`$1$2?v=${encodeURIComponent(version)}$3`);
}
