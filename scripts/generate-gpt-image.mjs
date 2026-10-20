// No API call unless --execute is explicitly supplied. Node 22+.
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {prepareScene,generateOne,SCENES} from './gpt-image-transport.mjs';
const args=process.argv.slice(2);
const id=args.find(x=>x.startsWith('--scene='))?.slice(8);
const execute=args.includes('--execute');
const output=args.find(x=>x.startsWith('--output='))?.slice(9);
if(!id||!SCENES.includes(id)||args.some(x=>x!=='--execute'&&x!=='--dry-run'&&!x.startsWith('--scene=')&&!x.startsWith('--output=')))throw Error('Use --scene='+SCENES.join('|')+' [--dry-run|--execute]');
const root=resolve(import.meta.dirname,'..');
const plan=prepareScene(root,id);
if(!execute){
  console.log(JSON.stringify({dry_run:true,scene:id,prompt_sha256:plan.prompt_sha256,source_hashes:plan.sources,model:plan.request.model,size:plan.request.size,api_requested:false},null,2));
}else {
  const {image,metadata}=await generateOne({root,id,key:process.env.OPENAI_API_KEY});
  const dest=resolve(output??join(root,'generated-review'));
  mkdirSync(dest,{recursive:true});
  writeFileSync(join(dest,id+'.png'),image,{flag:'wx'});
  writeFileSync(join(dest,id+'.json'),JSON.stringify(metadata,null,2)+'\n',{flag:'wx'});
  console.log('ONE image stored for REVIEW ONLY; scene='+id+' SHA256='+metadata.image_sha256+' QA=UNVERIFIED');
}
