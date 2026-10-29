// This public repository offers comparison preflight only. Paid image calls use the private local pilot.
import {resolve} from 'node:path';
import {ARMS,prepareComparison} from './prompt-comparison.mjs';
const args=process.argv.slice(2);
if(args.includes('--execute'))throw Error('Paid execution is disabled here; use scripts/private-pilot-cli.mjs --execute in a trusted local terminal');
const id=args.find(x=>x.startsWith('--arm='))?.slice(6);
const trial=args.find(x=>x.startsWith('--trial='))?.slice(8)??'1';
if(!id||!ARMS[id]||!['1','2'].includes(trial)||args.some(x=>x!=='--dry-run'&&!x.startsWith('--arm=')&&!x.startsWith('--trial=')))
  throw Error('Use --arm=mm1-a|mm1-b|mm1-c|mm2-a|mm2-b|mm2-c --trial=1|2 --dry-run');
const root=resolve(import.meta.dirname,'..');
const plan=prepareComparison(root,id);
console.log(JSON.stringify({dry_run:true,arm:id,trial:Number(trial),variant:plan.arm.variant,model:plan.request.model,
  size:plan.request.size,words:plan.words,prompt_sha256:plan.prompt_sha256,
  source_hashes:plan.source_hashes,api_requested:false},null,2));
