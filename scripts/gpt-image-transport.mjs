// Explicit GPT Image request transport. This does not claim internal model prompt fidelity.
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {validateCatalog} from '../catalog-next/engine.mjs';
export const MODEL='gpt-image-2.5-flare';
export const SIZE='1536x864';
export const SCENES=['surface-microcement-wall-floor','surface-fiber-cement-wall','surface-carrara-marble','surface-graphite-marble'];
const REQUIRED=['AGENTS.md','STYLE.md','configs/devices.json','configs/presets.json'];
export const sha256=x=>createHash('sha256').update(x).digest('hex');

export function prepareScene(root,id){
  if(!SCENES.includes(id))throw Error('Unapproved scene: '+id);
  const source=Object.fromEntries(REQUIRED.map(path=>{
    const text=readFileSync(join(root,path),'utf8');
    if(!text.trim())throw Error('Empty required file: '+path);
    return [path,text];
  }));
  if(!source['AGENTS.md'].includes('PRECHECK')||!source['STYLE.md'].includes('HARD RULES'))throw Error('Invalid harness sources');
  const presets=JSON.parse(source['configs/presets.json']);
  const devices=JSON.parse(source['configs/devices.json']);
  validateCatalog(presets,devices);
  const row=presets.surface_studies.find(x=>x.id===id);
  if(!row||row.devices.length!==0||row.layout_id!=='environment-only'||row.spatial_mode_id!=='grounded'||row.composition_id!=='empty-stage')throw Error('Invalid environment-only scene contract');
  if(!presets.environments.some(x=>x.id===row.environment_id)||!presets.lighting.some(x=>x.id===row.lighting_id))throw Error('Missing material or lighting configuration');
  if(!/^prompts\/architectural-surfaces\/[\w-]+\.txt$/.test(row.reference_prompt))throw Error('Unsafe source prompt path');
  const prompt=readFileSync(join(root,row.reference_prompt),'utf8');
  if(!prompt.startsWith('ONE standalone photorealistic architectural')||!prompt.includes('ONE camera view.')||!prompt.includes('Horizontal 16:9.')||!prompt.includes('EMPTY'))throw Error('Incomplete scene prompt');
  const request={model:MODEL,prompt,n:1,size:SIZE,quality:'high',background:'opaque',output_format:'png'};
  return {scene:row,request,prompt_sha256:sha256(prompt),sources:Object.fromEntries(REQUIRED.map(p=>[p,sha256(source[p])]))};
}

export function pngDimensions(bytes){
  if(!Buffer.isBuffer(bytes)||bytes.length<33||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||bytes.toString('ascii',12,16)!=='IHDR')throw Error('Not a PNG image');
  return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
}

export async function generateOne({root,id,key,fetcher=fetch}){
  if(!key?.trim())throw Error('OPENAI_API_KEY is not configured; no API request sent');
  const plan=prepareScene(root,id);
  const body=JSON.stringify(plan.request);
  if(sha256(JSON.parse(body).prompt)!==plan.prompt_sha256)throw Error('Prompt mutated before request');
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),240000);
  try {
    const response=await fetcher('https://api.openai.com/v1/images/generations',{
      method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body,signal:controller.signal
    });
    if(!response.ok)throw Error('GPT Image API error HTTP '+response.status);
    const result=await response.json();
    if(result.data?.length!==1||typeof result.data[0].b64_json!=='string')throw Error('Expected one image, received other response');
    const image=Buffer.from(result.data[0].b64_json,'base64');
    const dimensions=pngDimensions(image);
    if(dimensions.width!==1536||dimensions.height!==864)throw Error('Wrong dimensions '+dimensions.width+'x'+dimensions.height);
    return {image,metadata:{
      scene_id:id,reference_prompt:plan.scene.reference_prompt,
      source_hashes:plan.sources,prompt_sha256:plan.prompt_sha256,
      prompt_transport:'EXACT_REQUEST_SUBMITTED',
      effective_model_prompt:'UNVERIFIED',image_qa:'UNVERIFIED',approved:false,
      model:MODEL,size:SIZE,dimensions,quality:'high',n:1,
      image_sha256:sha256(image),request_id:response.headers?.get?.('x-request-id')??null,
      usage:result.usage??null,generated_at:new Date().toISOString()
    }};
  }finally{clearTimeout(timer)}
}
