// Summarize human ratings; never read raw images, credentials, or upload review data.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {privateDirectory} from './private-pilot.mjs';
export const FIELDS=['blind_id','hard_devices','hard_screens','hard_spatial','hard_one_view','geometry_0_2','composition_0_2','architecture_0_2','lighting_0_2','fidelity_0_2','notes'];
const GATES=FIELDS.slice(1,5),VISUAL_AXES=FIELDS.slice(5,9),FIDELITY='fidelity_0_2';
const AXES=[...VISUAL_AXES,FIDELITY];
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
const VISUAL_COLUMNS=['blind_id',...GATES,...VISUAL_AXES,'notes'];
function fingerprintVisualScores(rows){
  const values=rows.map(row=>{
    if(row.length!==FIELDS.length)throw Error('Malformed score sheet');
    return Object.fromEntries(FIELDS.map((field,i)=>[field,row[i].trim()]));
  });
  values.sort((a,b)=>a.blind_id.localeCompare(b.blind_id));
  return createHash('sha256').update(JSON.stringify(values.map(v=>VISUAL_COLUMNS.map(k=>v[k])))).digest('hex');
}
export function sealVisualScores(root,outputDir){
  const target=privateDirectory(root,outputDir);
  if(!target.exists)throw Error('Private review folder absent');
  const seal=join(target.directory,'blind','visual-seal.json');
  if(existsSync(seal))throw Error('Blind visual review has already been sealed');
  const result=reviewSummary(root,outputDir);
  if(!result.visual_complete)throw Error('All 12 blind visual scores are required before sealing');
  const rows=csvRows(readFileSync(join(target.directory,'blind','scores.csv'),'utf8'));
  if(rows.slice(1).some(row=>row[FIELDS.indexOf(FIDELITY)].trim()!==''))
    throw Error('Fidelity scores must be blank before unblinding');
  const fingerprint=fingerprintVisualScores(rows.slice(1));
  writeFileSync(seal,JSON.stringify({visual_sha256:fingerprint,record_count:12,sealed_at:new Date().toISOString()},null,2)+'\n',
    {flag:'wx',mode:0o600});
  return {sealed:true,records:12,visual_sha256:fingerprint};
}

export function reviewSummary(root,outputDir){
  const target=privateDirectory(root,outputDir);
  if(!target.exists)throw Error('Private review folder absent');
  const mapping=JSON.parse(readFileSync(join(target.directory,'mapping-private.json'),'utf8'));
  if(mapping.length!==12||new Set(mapping.map(x=>x.blind_id)).size!==12||
     new Set(mapping.map(x=>x.arm+':'+x.trial)).size!==12||
     mapping.some(x=>!ARMS.includes(x.arm)||![1,2].includes(x.trial))||
     ARMS.some(arm=>[1,2].some(trial=>!mapping.some(x=>x.arm===arm&&x.trial===trial))))
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
    if(VISUAL_AXES.some(key=>!['0','1','2'].includes(values[key])))throw Error('Invalid visual quality score for '+id);
    if(values[FIDELITY]!==''&&!['0','1','2'].includes(values[FIDELITY]))throw Error('Invalid post-unblinding fidelity for '+id);
    rated.push({arm:source.arm,trial:source.trial,pass:GATES.every(key=>values[key]==='PASS'),
      scores:Object.fromEntries(AXES.map(key=>[key,values[key]===''?null:Number(values[key])]))});
  }
  if(seen.size!==12)throw Error('All 12 blind IDs must exist in score sheet');
  const arms=ARMS.map(arm=>{
    const group=rated.filter(v=>v.arm===arm);
    const means=Object.fromEntries(AXES.map(axis=>{
      const values=group.map(x=>x.scores[axis]).filter(x=>x!==null);
      return [axis,values.length?Number((values.reduce((a,b)=>a+b,0)/values.length).toFixed(2)):null];
    }));
    return {arm,reviewed:group.length,fidelity_reviewed:group.filter(v=>v.scores[FIDELITY]!==null).length,required:2,hard_fail:group.filter(v=>!v.pass).length,means};
  });
  const visual_complete=rated.length===12;
  if(!visual_complete&&rated.some(v=>v.scores[FIDELITY]!==null))
    throw Error('Prompt fidelity must remain hidden until every blind visual score is complete');
  const fidelity_complete=visual_complete&&rated.every(v=>v.scores[FIDELITY]!==null);
  const sealFile=join(target.directory,'blind','visual-seal.json');
  const sealed=existsSync(sealFile);
  if(sealed){
    const seal=JSON.parse(readFileSync(sealFile,'utf8'));
    if(seal.record_count!==12||seal.visual_sha256!==fingerprintVisualScores(rows))
      throw Error('Sealed visual review has been modified after unblinding');
  }
  return {reviewed:rated.length,required:12,visual_complete,fidelity_complete,sealed,
    complete:sealed&&visual_complete&&fidelity_complete,
    caution:'Two trials per arm form an exploratory pilot, not proof of statistical superiority.',
    // No arm-level results before the blind review has been explicitly sealed.
    arms:sealed&&visual_complete?arms:[]};
}
