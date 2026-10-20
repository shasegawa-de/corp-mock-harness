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
  const replacement=`<div class="toolbar toolbar-next" aria-label="作品の絞り込み"><div class="legacy-filters" hidden aria-hidden="true">${categories}${legacySelects}</div><div class="tag-panel">${tagRows}<div class="tag-actions"><button class="reset-filters" id="reset-filters" type="button">クリア</button></div></div></div>\n`;
  const footerCopy=intro.replace('画像の拡大・検索・プロンプト全文コピーに対応。','画像の拡大・プロンプトの確認・コピーに対応。');
  return catalog.replace('<main>','<main class="catalog-layout">').replace(toolbar,`<aside class="catalog-sidebar"><button id="open-filters" class="filter-open" type="button" aria-haspopup="dialog" aria-controls="filter-drawer">絞り込み <span aria-hidden="true">☷</span></button></aside><dialog id="filter-drawer" class="filter-drawer" aria-labelledby="filter-heading"><div class="filter-drawer-header"><h2 id="filter-heading">絞り込み</h2><button id="close-filters" type="button" class="reset-filters">閉じる</button></div>${replacement}<div class="filter-drawer-footer"><button type="button" id="show-filters" class="filter-apply">結果を表示</button></div></dialog><div class="catalog-content">`).replace('</main>','</div></main>').replace(header,`<header><div class="header-row"><div>${eyebrow}${title}</div>${repository}</div></header>`)
    .replace(intro,'').replace(/<div class="footer">[\s\S]*?<\/div>/,'')
    .replace('</main>',`</main><footer class="catalog-notes">${footerCopy}</footer>`);
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

// Cards, images, table, shared styles and the existing scripts are reused.
export function renderNextCatalog(catalog,editor,version='local'){
  if(!catalog.includes('</head>')||!catalog.includes('</main>'))throw Error('Catalog insertion points are missing');
  const revision=encodeURIComponent(version);
  return flattenCatalogCards(catalogChrome(catalog)).replace('</head>',`<!-- composer-assets:start --><link rel="stylesheet" href="./style.css?v=${revision}"><script type="module" src="./app.mjs?v=${revision}"></script><!-- composer-assets:end --></head>`)
    .replace('</main>',`<!-- composer-editor:start -->${editor}<!-- composer-editor:end --></main>`);
}

export function versionLocalImports(source,version){
  return source.replace(/(\bfrom\s+['"])(\.\/[^'"]+\.mjs)(['"])/g,`$1$2?v=${encodeURIComponent(version)}$3`);
}
