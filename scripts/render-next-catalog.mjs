// The existing catalog remains the single source of shared UI and examples.
export function renderNextCatalog(catalog,editor){
  if(!catalog.includes('</head>')||!catalog.includes('</main>'))throw Error('Catalog insertion points are missing');
  return catalog.replace('</head>',`<!-- composer-assets:start --><link rel="stylesheet" href="./style.css"><script type="module" src="./app.mjs"></script><!-- composer-assets:end --></head>`)
    .replace('</main>',`<!-- composer-editor:start -->${editor}<!-- composer-editor:end --></main>`);
}
