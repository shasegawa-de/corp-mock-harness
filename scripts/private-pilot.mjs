// Private, resumable image comparison. No credential is persisted or sent to Git.
import {readFileSync,writeFileSync,mkdirSync,existsSync,realpathSync,statSync,unlinkSync,copyFileSync,constants} from 'node:fs';
import {resolve,relative,join,isAbsolute,sep} from 'node:path';
import {homedir} from 'node:os';
import {randomBytes} from 'node:crypto';
import {prepareComparison,generateComparison,ARMS} from './prompt-comparison.mjs';
import {sha256} from './gpt-image-transport.mjs';
import {verifyCompletePng} from './png-validate.mjs';

export const TASKS=Object.keys(ARMS).flatMap(arm=>[1,2].map(trial=>({arm,trial,base:arm+'-trial-'+trial})));
export const DEFAULT_PRIVATE_DIR=join(homedir(),'.corp-mock-harness-private-reviews');
const inside=(path,root)=>{const rel=relative(root,path);return rel===''||(rel!=='..'&&!rel.startsWith('..'+sep)&&!isAbsolute(rel));};
const imageFile=(dir,t)=>join(dir,t.base+'.png');
const metaFile=(dir,t)=>join(dir,t.base+'.json');
const pendingFile=(dir,t)=>join(dir,t.base+'.pending');
const save=(path,data)=>writeFileSync(path,data,{flag:'wx',mode:0o600});

export function privateDirectory(root,outputDir,{create=false}={}){
  const repo=realpathSync(resolve(root)),requested=resolve(outputDir);
  if(inside(requested,repo))throw Error('SECURITY: output directory must be outside Git checkout');
  if(create)mkdirSync(requested,{recursive:true,mode:0o700});
  if(!existsSync(requested))return {directory:requested,exists:false};
  const dir=realpathSync(requested);
  if(inside(dir,repo))throw Error('SECURITY: resolved output directory points inside Git checkout');
  const stat=statSync(dir);
  if(!stat.isDirectory()||(stat.mode&0o077)!==0)throw Error('SECURITY: output directory requires mode 0700');
  return {directory:dir,exists:true};
}

export function inventory(root,dir){
  const plans=Object.fromEntries(Object.keys(ARMS).map(id=>[id,prepareComparison(root,id)]));
  const tasks=TASKS.map(t=>{
    const plan=plans[t.arm],p=metaFile(dir,t),i=imageFile(dir,t);
    if(existsSync(pendingFile(dir,t)))throw Error('Unresolved prior paid request marker: '+t.base);
    if(existsSync(i)!==existsSync(p))throw Error('Incomplete PNG and metadata pair: '+t.base);
    if(!existsSync(i))return {...t,status:'missing',prompt_sha256:plan.prompt_sha256};
    const m=JSON.parse(readFileSync(p,'utf8')),data=readFileSync(i),dim=verifyCompletePng(data);
    if(m.arm_id!==t.arm||m.trial!==t.trial||m.prompt_sha256!==plan.prompt_sha256||
       m.image_sha256!==sha256(data)||m.approved!==false||dim.width!==1536||dim.height!==864)
      throw Error('Image provenance integrity failed: '+t.base);
    return {...t,status:'verified',prompt_sha256:plan.prompt_sha256,image_sha256:m.image_sha256};
  });
  return {tasks,complete:tasks.filter(t=>t.status==='verified').length,remaining:tasks.filter(t=>t.status==='missing').length};
}

// No shell history, argv, environment, files, or echo of the key.
export async function maskedKey({input=process.stdin,output=process.stderr}={}){
  if(!input.isTTY||typeof input.setRawMode!=='function')throw Error('Interactive terminal required for secret entry');
  output.write('Temporary OpenAI project API key (input hidden): ');
  input.setRawMode(true);input.resume();
  let key='';
  try{
    return await new Promise((resolveKey,rejectKey)=>{
      const listener=buffer=>{
        for(const char of buffer.toString('utf8')){
          if(char==='\r'||char==='\n'){input.off('data',listener);output.write('\n');resolveKey(key);return;}
          if(char==='\u0003'){input.off('data',listener);output.write('\n');rejectKey(Error('Cancelled'));return;}
          if(char==='\u007f'||char==='\b'){key=key.slice(0,-1);continue;}
          if(char>=' '&&char<='~'){
            key+=char;
            if(key.length>512){input.off('data',listener);rejectKey(Error('Secret input too long'));return;}
          }
        }
      };
      input.on('data',listener);
    });
  }finally{input.setRawMode(false);input.pause();}
}

export async function pilot({root,outputDir=DEFAULT_PRIVATE_DIR,limit=12,key,generate=generateComparison,report=()=>{}}){
  if(!Number.isInteger(limit)||limit<1||limit>12)throw Error('Limit must be 1..12');
  const dir=privateDirectory(root,outputDir,{create:true}).directory,pre=inventory(root,dir);
  if(pre.remaining===0)return {...pre,generated:0,done:true};
  if(!key||typeof key!=='string')throw Error('No temporary key; no paid request');
  let generated=0;
  for(const t of pre.tasks.filter(x=>x.status==='missing').slice(0,limit)){
    // Store an uncertainty marker BEFORE calling the API: never silently retry possibly billed failures.
    save(pendingFile(dir,t),JSON.stringify({task:t.base,prompt_sha256:t.prompt_sha256,state:'inflight_or_unknown'})+'\n');
    report('Generating '+t.base+' (one API request)');
    const {image,metadata}=await generate({root,id:t.arm,key});
    verifyCompletePng(image); // reject truncated or corrupted network images before persisting
    metadata.trial=t.trial;
    save(imageFile(dir,t),image);
    save(metaFile(dir,t),JSON.stringify(metadata,null,2)+'\n');
    unlinkSync(pendingFile(dir,t));
    generated++;
    report('Saved '+t.base+' privately');
  }
  const after=inventory(root,dir);
  return {...after,generated,done:after.remaining===0};
}

export function prepareBlind(root,outputDir){
  const target=privateDirectory(root,outputDir,{create:false});
  if(!target.exists)throw Error('Missing private output directory');
  const scan=inventory(root,target.directory);
  if(scan.remaining)throw Error('All 12 verified pairs are required');
  const blind=join(target.directory,'blind');
  if(existsSync(blind))throw Error('Blind review already exists');
  mkdirSync(blind,{mode:0o700});
  const shuffled=[...scan.tasks];
  for(let i=shuffled.length-1;i>0;i--){const j=randomBytes(4).readUInt32BE(0)%(i+1);[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
  const mapping=shuffled.map((t,i)=>({blind_id:'R'+String(i+1).padStart(2,'0'),arm:t.arm,trial:t.trial,image_sha256:t.image_sha256}));
  for(let i=0;i<shuffled.length;i++)copyFileSync(imageFile(target.directory,shuffled[i]),join(blind,mapping[i].blind_id+'.png'),constants.COPYFILE_EXCL);
  save(join(target.directory,'mapping-private.json'),JSON.stringify(mapping,null,2)+'\n');
  // Reviewers must know MM1 (grounded) versus MM2 (floorless), but not A/B/C or trial.
  const publicSceneManifest=['blind_id,scene,required_spatial_mode',
    ...mapping.map(x=>x.blind_id+','+(x.arm.startsWith('mm1-')?'MM1,grounded':'MM2,floorless'))];
  save(join(blind,'scene-manifest.csv'),publicSceneManifest.join('\n')+'\n');
  const headings=['blind_id','hard_devices','hard_screens','hard_spatial','hard_one_view','geometry_0_2','composition_0_2','architecture_0_2','lighting_0_2','fidelity_0_2','notes'];
  const csv=[headings.join(','),...mapping.map(x=>x.blind_id+','+','.repeat(headings.length-2))].join('\n')+'\n';
  save(join(blind,'scores.csv'),csv);
  return {blind,count:shuffled.length};
}
