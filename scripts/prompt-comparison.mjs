// Isolated, prompt-locked Mac+Mac comparison. Does NOT mutate the live catalog.
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {validateCatalog} from '../catalog-next/engine.mjs';
import {SIZE,sha256,pngDimensions} from './gpt-image-transport.mjs';
import {verifyCompletePng} from './png-validate.mjs';
// Pin the image model for this comparison; a moving alias can invalidate A/B/C controls.
export const COMPARISON_MODEL='gpt-image-2.5-flare-2026-09-08';
export const ARMS={
  'mm1-a':{preset:'two-macs-side-by-side',variant:'A',path:'prompts/macbookpro14-macbookpro14/side-by-side.txt'},
  'mm1-b':{preset:'two-macs-side-by-side',variant:'B',path:'prompts/experiments/mm1-b-structured.txt'},
  'mm1-c':{preset:'two-macs-side-by-side',variant:'C',path:'prompts/experiments/mm1-c-directed.txt'},
  'mm2-a':{preset:'two-macs-depth-staggered',variant:'A',path:'prompts/macbookpro14-macbookpro14/suspended-depth.txt'},
  'mm2-b':{preset:'two-macs-depth-staggered',variant:'B',path:'prompts/experiments/mm2-b-structured.txt'},
  'mm2-c':{preset:'two-macs-depth-staggered',variant:'C',path:'prompts/experiments/mm2-c-directed.txt'}
};
export const REQUIRED=['AGENTS.md','STYLE.md','configs/devices.json','configs/presets.json'];
export const HEADINGS=["OUTPUT","SUBJECT","COMPOSITION","CAMERA","ENVIRONMENT","LIGHTING & ART DIRECTION","EXCLUSIONS"];
export function lexicalWords(prompt){
  return prompt.split('\n').filter(line=>!HEADINGS.includes(line.trim()))
    .join(' ').toLowerCase().match(/[\p{L}\p{N}]+/gu).sort().join('|');
}
export function prepareComparison(root,id){
  const arm=ARMS[id];
  if(!arm)throw Error('Unknown comparison arm: '+id);
  const source=Object.fromEntries(REQUIRED.map(path=>{
    const text=readFileSync(join(root,path),'utf8');
    if(!text.trim())throw Error('Empty required source: '+path);
    return [path,text];
  }));
  if(!source['AGENTS.md'].includes('PRECHECK')||!source['STYLE.md'].includes('HARD RULES'))
    throw Error('Invalid harness source');
  const presets=JSON.parse(source['configs/presets.json']);
  const devices=JSON.parse(source['configs/devices.json']);
  validateCatalog(presets,devices);
  const scene=presets.showcase_presets.find(row=>row.id===arm.preset);
  if(!scene||scene.devices.length!==2||scene.devices.some(device=>device!=='macbookpro14')||
    !['side-by-side','depth-staggered'].includes(scene.layout_id)||
    !['grounded','suspended'].includes(scene.spatial_mode_id)||
    !presets.environments.some(x=>x.id===scene.environment_id)||
    !presets.lighting.some(x=>x.id===scene.lighting_id))
    throw Error('Invalid MM scene contract');
  if(!/^prompts\/(?:experiments|macbookpro14-macbookpro14)\/[\w-]+\.txt$/.test(arm.path))
    throw Error('Unsafe prompt path');
  const prompt=readFileSync(join(root,arm.path),'utf8');
  if(!prompt.startsWith('ONE standalone photorealistic product photograph.')||
    !prompt.includes('ONE camera view.')||!prompt.includes('Horizontal 16:9.')||
    !prompt.includes('Exactly TWO devices:')||!prompt.includes('NO iPhone or third device.'))
    throw Error('Incomplete comparison prompt');
  if(arm.variant!=='A'){
    const lines=prompt.split('\n');
    for(const heading of HEADINGS)if(!lines.includes(heading))throw Error('Missing heading '+heading);
  }
  const words=prompt.trim().split(/\s+/).length;
  if(words<80)throw Error('Prompt lacks essential scene detail: '+words);
  const request={model:COMPARISON_MODEL,prompt,n:1,size:SIZE,quality:'high',background:'opaque',output_format:'png'};
  return {id,arm,scene,request,words,prompt_sha256:sha256(prompt),
    source_hashes:Object.fromEntries(REQUIRED.map(p=>[p,sha256(source[p])]))};
}
export async function generateComparison({root,id,key,fetcher=fetch}){
  if(!key?.trim())throw Error('OPENAI_API_KEY not configured; API not called');
  const plan=prepareComparison(root,id);
  const body=JSON.stringify(plan.request);
  if(sha256(JSON.parse(body).prompt)!==plan.prompt_sha256)throw Error('Prompt mutated before submission');
  const response=await fetcher('https://api.openai.com/v1/images/generations',{
    method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},
    redirect:'error',signal:AbortSignal.timeout(240000),body
  });
  if(!response.ok)throw Error('API HTTP '+response.status);
  const result=await response.json();
  if(result.data?.length!==1||typeof result.data[0].b64_json!=='string')
    throw Error('Expected exactly one image');
  const image=Buffer.from(result.data[0].b64_json,'base64');
  const dimensions=verifyCompletePng(image);
  return {image,metadata:{arm_id:id,variant:plan.arm.variant,scene_preset:plan.arm.preset,
    source_prompt:plan.arm.path,prompt_sha256:plan.prompt_sha256,
    source_hashes:plan.source_hashes,model:COMPARISON_MODEL,size:SIZE,quality:'high',n:1,
    dimensions,image_sha256:sha256(image),prompt_transport:'EXACT_REQUEST_SUBMITTED',
    effective_model_prompt:'UNVERIFIED',image_qa:'UNVERIFIED',approved:false,
    request_id:response.headers?.get?.('x-request-id')??null,
    usage:result.usage??null,generated_at:new Date().toISOString()}};
}
