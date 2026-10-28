// Only --execute submits a paid image request; all other paths are free dry-runs.
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {ARMS,prepareComparison,generateComparison} from './prompt-comparison.mjs';
const args=process.argv.slice(2);
const id=args.find(x=>x.startsWith('--arm='))?.slice(6);
const execute=args.includes('--execute');
const output=args.find(x=>x.startsWith('--output='))?.slice(9);
const trial=args.find(x=>x.startsWith('--trial='))?.slice(8)??'1';
if(!id||!ARMS[id]||!['1','2'].includes(trial)||args.some(x=>x!=='--dry-run'&&x!=='--execute'&&!x.startsWith('--arm=')&&!x.startsWith('--output=')&&!x.startsWith('--trial='))||
  (execute&&args.includes('--dry-run')))throw Error('Use --arm=mm1-a|mm1-b|mm1-c|mm2-a|mm2-b|mm2-c --trial=1|2 [--dry-run|--execute]');
const root=resolve(import.meta.dirname,'..');
const plan=prepareComparison(root,id);
if(!execute){
  console.log(JSON.stringify({dry_run:true,arm:id,trial:Number(trial),variant:plan.arm.variant,model:plan.request.model,
    size:plan.request.size,words:plan.words,prompt_sha256:plan.prompt_sha256,
    source_hashes:plan.source_hashes,api_requested:false},null,2));
}else{
  const {image,metadata}=await generateComparison({root,id,key:process.env.OPENAI_API_KEY});
  metadata.trial=Number(trial);
  const dest=resolve(output??join(root,'generated-review'));
  mkdirSync(dest,{recursive:true});
  const fileBase=id+'-trial-'+trial;
  writeFileSync(join(dest,fileBase+'.png'),image,{flag:'wx'});
  writeFileSync(join(dest,fileBase+'.json'),JSON.stringify(metadata,null,2)+'\n',{flag:'wx'});
  console.log('UNAPPROVED comparison image saved: '+id+' sha256='+metadata.image_sha256);
}
