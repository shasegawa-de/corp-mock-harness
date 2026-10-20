// The existing catalog remains the single source of shared UI and examples.
export function renderNextCatalog(catalog,editor,version='local'){
  if(!catalog.includes('</head>')||!catalog.includes('</main>'))throw Error('Catalog insertion points are missing');
  const revision=encodeURIComponent(version);
  return catalog.replace('</head>',`<!-- composer-assets:start --><link rel="stylesheet" href="./style.css?v=${revision}"><script type="module" src="./app.mjs?v=${revision}"></script><!-- composer-assets:end --></head>`)
    .replace('</main>',`<!-- composer-editor:start -->${editor}<!-- composer-editor:end --></main>`);
}

export function versionLocalImports(source,version){
  return source.replace(/(\bfrom\s+['"])(\.\/[^'"]+\.mjs)(['"])/g,`$1$2?v=${encodeURIComponent(version)}$3`);
}
