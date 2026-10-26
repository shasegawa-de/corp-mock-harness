import {cpSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {validateCatalog} from '../catalog-next/engine.mjs';
import {renderNextCatalog,versionLocalImports} from './render-next-catalog.mjs';
const root=resolve(import.meta.dirname,'..'),out=join(root,'_site');
const commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
validateCatalog(JSON.parse(readFileSync(join(root,'configs/presets.json'),'utf8')),JSON.parse(readFileSync(join(root,'configs/devices.json'),'utf8')));
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
// The reviewed vNext is the public landing page. Preserve the canonical
// original as an explicitly named archive and keep /next/ stable for bookmarks.
cpSync(join(root,'catalog'),join(out,'legacy'),{recursive:true});
cpSync(join(root,'catalog-next'),join(out,'next'),{recursive:true});
const catalog=readFileSync(join(root,'catalog/index.html'),'utf8');
const editor=readFileSync(join(root,'catalog-next/editor.html'),'utf8');
writeFileSync(join(out,'next/index.html'),renderNextCatalog(catalog,editor,commit));
writeFileSync(join(out,'index.html'),renderNextCatalog(catalog,editor,commit,'./next/'));
for(const file of ['app.mjs','examples.mjs']){
  const path=join(out,'next',file);writeFileSync(path,versionLocalImports(readFileSync(path,'utf8'),commit));
}
// Publish only the verified standalone PNGs, never the uploaded ZIP.
// The archive is expanded and checked against its SHA-256 manifest by CI.
const approved=JSON.parse(readFileSync(join(root,'assets/architectural-surfaces/approved-manifest.json'),'utf8'));
for(const record of approved.images){
  const destination=join(out,record.path);
  mkdirSync(resolve(destination,'..'),{recursive:true});
  cpSync(join(root,record.path),destination);
}
const data=join(out,'next/data');mkdirSync(data,{recursive:true});
for(const path of ['AGENTS.md','STYLE.md','configs/devices.json','configs/presets.json'])cpSync(join(root,path),join(data,path.split('/').at(-1)));
writeFileSync(join(data,'source.json'),JSON.stringify({commit})+'\n');
writeFileSync(join(out,'.nojekyll'),'');
console.log('Built reviewed vNext catalog at / and /next/; original catalog archived at /legacy/');
