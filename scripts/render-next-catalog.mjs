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
  if(!eyebrow||!title||!repository||start<0||end<0||!categories||!facets)throw Error('Catalog header/filter structure changed');
  const facetRows=[...facets.matchAll(/<label for="([^"]+)">([^<]+)<\/label>(<select[\s\S]*?<\/select>)/g)].map(([,id,label,select])=>`<div class="tag-row"><span id="${id}-label" class="tag-label">${label}</span><div class="tag-options" data-tag-select="${id}" role="radiogroup" aria-labelledby="${id}-label"></div>${select.replace('<select','<select hidden')}</div>`).join('');
  if(!facetRows)throw Error('Catalog facets are missing');
  const replacement=`<details class="toolbar toolbar-next" open aria-label="作品の絞り込み"><summary class="filter-toggle"><span>絞り込み</span><span id="filter-selection" class="filter-selection" hidden></span></summary><div class="tag-panel"><div class="tag-row"><span id="category-label" class="tag-label">対象</span>${categories.replace('class="filters"','class="filters tag-options" role="radiogroup"')}</div>${facetRows}<div class="tag-actions"><button class="reset-filters" id="reset-filters" type="button">クリア</button></div></div></details>\n`;
  return catalog.replace('<main>','<main class="catalog-layout">').replace(toolbar,`<aside class="catalog-sidebar" aria-label="絞り込み">${replacement}</aside><div class="catalog-content">`).replace('</main>','</div></main>').replace(header,`<header><div class="header-row"><div>${eyebrow}${title}</div>${repository}</div></header>`)
    .replace(/<div class="footer">[\s\S]*?<\/div>/,'');
}

// Cards, images, table, shared styles and the existing scripts are reused.
export function renderNextCatalog(catalog,editor,version='local'){
  if(!catalog.includes('</head>')||!catalog.includes('</main>'))throw Error('Catalog insertion points are missing');
  const revision=encodeURIComponent(version);
  return catalogChrome(catalog).replace('</head>',`<!-- composer-assets:start --><link rel="stylesheet" href="./style.css?v=${revision}"><script type="module" src="./app.mjs?v=${revision}"></script><!-- composer-assets:end --></head>`)
    .replace('</main>',`<!-- composer-editor:start -->${editor}<!-- composer-editor:end --></main>`);
}

export function versionLocalImports(source,version){
  return source.replace(/(\bfrom\s+['"])(\.\/[^'"]+\.mjs)(['"])/g,`$1$2?v=${encodeURIComponent(version)}$3`);
}
