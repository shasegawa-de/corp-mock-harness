// Only --execute submits a paid image request; all other paths are free dry-runs.
import {mkdirSync,writeFileSync,existsSync,statSync,realpathSync} from 'node:fs';
import {homedir} from 'node:os';
import {resolve,join,relative,isAbsolute,sep} from 'node:path';
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
  // Keep generated images and metadata outside the Git tree; never stage them by accident.
  const dest=resolve(output??join(homedir(),'.corp-mock-harness-private-reviews'));
  const withinRepo=path=>{
    const rel=relative(root,path);
    return rel===''||(!rel.startsWith('..'+sep)&&rel!=='..'&&!isAbsolute(rel));
  };
  if(withinRepo(dest))throw Error('Refusing to write review files inside Git repository');
  mkdirSync(dest,{recursive:true,mode:0o700});
  const resolvedDest=realpathSync(dest);
  if(withinRepo(resolvedDest))throw Error('Refusing to follow output directory into Git repository');
  if((statSync(resolvedDest).mode&0o077)!==0)
    throw Error('Review directory must not be accessible by group or other users (mode 0700)');
  const fileBase=id+'-trial-'+trial;
  const imagePath=join(resolvedDest,fileBase+'.png');
  const metadataPath=join(resolvedDest,fileBase+'.json');
  if(existsSync(imagePath)||existsSync(metadataPath))
    throw Error('Trial output already exists; no additional paid request was sent');
  const {image,metadata}=await generateComparison({root,id,key:process.env.OPENAI_API_KEY});
  metadata.trial=Number(trial);
  writeFileSync(imagePath,image,{flag:'wx',mode:0o600});
  writeFileSync(metadataPath,JSON.stringify(metadata,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log('UNAPPROVED comparison image saved locally: '+id+' trial='+trial+' sha256='+metadata.image_sha256);
}
