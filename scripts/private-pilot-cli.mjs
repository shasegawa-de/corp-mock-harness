// Dry-run by default. Never takes a credential as argv or environment input.
import {resolve} from 'node:path';
import {privateDirectory,inventory,maskedKey,pilot,prepareBlind,DEFAULT_PRIVATE_DIR} from './private-pilot.mjs';
const root=resolve(import.meta.dirname,'..'),args=process.argv.slice(2);
const execute=args.includes('--execute'),blind=args.includes('--prepare-blind');
const limit=Number(args.find(x=>x.startsWith('--limit='))?.slice(8)??12);
const dir=args.find(x=>x.startsWith('--output='))?.slice(9)??DEFAULT_PRIVATE_DIR;
if(args.some(x=>x!=='--dry-run'&&x!=='--execute'&&x!=='--prepare-blind'&&!x.startsWith('--limit=')&&!x.startsWith('--output='))||
  (execute&&args.includes('--dry-run'))||(blind&&execute)||!Number.isInteger(limit)||limit<1||limit>12)
  throw Error('Usage: [--dry-run] | --execute [--limit=1..12] | --prepare-blind');
const existing=privateDirectory(root,dir,{create:false});
if(blind){
  const output=prepareBlind(root,dir);
  console.log('Blind review is private: '+output.blind);
}else if(!execute){
  if(!existing.exists)console.log('Dry run: no images yet; 12 requests remain. API not called.');
  else {const scan=inventory(root,existing.directory);console.log(JSON.stringify({dry_run:true,complete:scan.complete,remaining:scan.remaining,trials:scan.tasks},null,2));}
}else{
  const scan=existing.exists?inventory(root,existing.directory):null;
  if(scan?.remaining===0){
    console.log('Verified 12/12; all trial images already exist. No API key or paid request needed.');
  }else{
    const key=await maskedKey();
    try{
      const result=await pilot({root,outputDir:dir,key,limit,report:console.log});
      console.log('Verified '+result.complete+'/12; remaining '+result.remaining+'. No files uploaded.');
    }catch(error){
      console.error('Stopped: '+error.message);
      console.error('If a .pending marker exists, reconcile provider usage manually before resubmitting.');
      process.exitCode=1;
    }
  }
}
