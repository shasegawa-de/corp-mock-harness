import {fromPreset} from './engine.mjs';

const axes=['subject','layout','spatial','pose','surface','composition','environment','lighting'];
export function combinationKey(state){return JSON.stringify(axes.map(key=>state[key]??null));}
export function matchingExamples(state,examples){return examples.filter(example=>combinationKey(example.state)===combinationKey(state));}

// Prefer the harness metadata; only the two fixtures not indexed by presets
// use their existing catalog settings. Never invent new device combinations.
export function exampleConditions(meta,presets){
  const row=[...presets.showcase_presets,...presets.surface_studies].find(row=>row.reference_prompt===meta.reference);
  if(row)return fromPreset(row);
  if(meta.reference==='prompts/macbookpro14/on-block.txt')return {
    subject:'macbookpro14',layout:'single',pose:'open-display',surface:'space',
    spatial:meta.spatial,composition:meta.composition,environment:meta.environment,lighting:meta.lighting
  };
  if(meta.reference==='prompts/macbookpro14-iphone17/side-by-side.txt')return {
    subject:'pair',layout:'side-by-side',pose:'upright',surface:'space',
    spatial:meta.spatial,composition:meta.composition,environment:meta.environment,lighting:meta.lighting
  };
  throw Error(`作例の条件がありません: ${meta.reference}`);
}
