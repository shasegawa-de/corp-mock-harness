// CLI for offline masked-image QA ratings. No network or image upload.
import {resolve} from 'node:path';
import {DEFAULT_PRIVATE_DIR} from './private-pilot.mjs';
import {reviewSummary,sealVisualScores} from './review-summary.mjs';
const args=process.argv.slice(2),root=resolve(import.meta.dirname,'..');
if(args.some(x=>x!=='--seal-visual'&&!x.startsWith('--output=')))throw Error('Usage: node scripts/review-summary-cli.mjs [--seal-visual] [--output=private-dir]');
const dir=args.find(x=>x.startsWith('--output='))?.slice(9)??DEFAULT_PRIVATE_DIR;
if(args.includes('--seal-visual')){
  const result=sealVisualScores(root,dir);
  console.log(JSON.stringify({sealed:result.sealed,records:result.records,visual_sha256:result.visual_sha256},null,2));
}else{
  const result=reviewSummary(root,dir);
  console.log(JSON.stringify(result,null,2));
  if(!result.complete)process.exitCode=2;
}
