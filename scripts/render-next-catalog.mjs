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
  const replacement=`<div class="toolbar toolbar-next" aria-label="作品の絞り込み"><div class="toolbar-detail"><div class="toolbar-label">絞り込み</div><div class="filter-field category-field"><span id="category-label">対象</span>${categories.replace('対象カテゴリ','対象')}</div><div class="facet-fields">${facets}</div></div></div>\n`;
  return catalog.replace(toolbar,replacement).replace(header,`<header><div class="header-row"><div>${eyebrow}${title}</div>${repository}</div></header>`)
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
