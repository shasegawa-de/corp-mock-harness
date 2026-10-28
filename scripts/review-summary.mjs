// Summarize human ratings; never read raw images, credentials, or upload review data.
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {privateDirectory} from './private-pilot.mjs';
export const FIELDS=['blind_id','hard_devices','hard_screens','hard_spatial','hard_one_view','geometry_0_2','composition_0_2','architecture_0_2','lighting_0_2','fidelity_0_2','notes'];
const GATES=FIELDS.slice(1,5),AXES=FIELDS.slice(5,10);
const ARMS=['mm1-a','mm1-b','mm1-c','mm2-a','mm2-b','mm2-c'];
function csvRows(src){
  const rows=[];let row=[],cell='',inside=false;
  for(let i=0;i<src.length;i++){
    const c=src[i];
    if(c==='"'){if(inside&&src[i+1]==='"'){cell+='"';i++;}else inside=!inside;}
    else if(c===','&&!inside){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!inside){
      if(c==='\r'&&src[i+1]==='\n')i++;
      row.push(cell);cell='';
      if(row.some(v=>v!==''))rows.push(row);
      row=[];
    }else cell+=c;
  }
  if(inside)throw Error('Unterminated quoted CSV cell');
  if(row.length||cell){row.push(cell);rows.push(row);}
  return rows;
}
export function reviewSummary(root,outputDir){
  const target=privateDirectory(root,outputDir);
  if(!target.exists)throw Error('Private review folder absent');
  const mapping=JSON.parse(readFileSync(join(target.directory,'mapping-private.json'),'utf8'));
  if(mapping.length!==12||new Set(mapping.map(x=>x.blind_id)).size!==12||
     mapping.some(x=>!ARMS.includes(x.arm)||![1,2].includes(x.trial)))
    throw Error('Invalid or incomplete identity mapping');
  const rows=csvRows(readFileSync(join(target.directory,'blind','scores.csv'),'utf8'));
  if(JSON.stringify(rows.shift())!==JSON.stringify(FIELDS))throw Error('Score columns changed');
  const known=new Map(mapping.map(x=>[x.blind_id,x])),seen=new Set(),rated=[];
  for(const raw of rows){
    if(raw.length!==FIELDS.length)throw Error('Malformed rating row: quote notes containing commas');
    const values=Object.fromEntries(FIELDS.map((field,i)=>[field,raw[i].trim()]));
    const id=values.blind_id,source=known.get(id);
    if(!source||seen.has(id))throw Error('Unknown or repeated blind ID');
    seen.add(id);
    if([...GATES,...AXES].every(key=>values[key]===''))continue;
    if(GATES.some(key=>!['PASS','FAIL'].includes(values[key])))throw Error('Incomplete hard-gate rating for '+id);
    if(AXES.some(key=>!['0','1','2'].includes(values[key])))throw Error('Invalid quality score for '+id);
    rated.push({arm:source.arm,trial:source.trial,pass:GATES.every(key=>values[key]==='PASS'),
      scores:Object.fromEntries(AXES.map(key=>[key,Number(values[key])]))});
  }
  if(seen.size!==12)throw Error('All 12 blind IDs must exist in score sheet');
  const arms=ARMS.map(arm=>{
    const group=rated.filter(v=>v.arm===arm);
    const means=Object.fromEntries(AXES.map(axis=>[axis,group.length?
      Number((group.reduce((sum,v)=>sum+v.scores[axis],0)/group.length).toFixed(2)):null]));
    return {arm,reviewed:group.length,required:2,hard_fail:group.filter(v=>!v.pass).length,means};
  });
  return {reviewed:rated.length,required:12,complete:rated.length===12,
    caution:'Two trials per arm form an exploratory pilot, not proof of statistical superiority.',
    arms};
}
