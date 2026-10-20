import {labels,defaults,validateCatalog,choices,normalize,assemble} from './engine.mjs';
import {exampleConditions} from './examples.mjs';
const $=id=>document.getElementById(id);
const editor=$('composer');
const fieldLabels={subject:'対象',layout:'並び方',spatial:'配置',pose:'姿勢',surface:'建築面',composition:'構図',environment:'背景・素材',lighting:'照明'};
const cards=[...document.querySelectorAll('.item')];
let state,presets,devices,result,activeButton;

try{
  const contents=await Promise.all(['AGENTS.md','STYLE.md','devices.json','presets.json'].map(async name=>{
    const response=await fetch(`./data/${name}`,{cache:'no-cache'});
    if(!response.ok)throw Error(`${name} (${response.status})`);
    const text=await response.text();if(!text.trim())throw Error(`${name}が空です`);return text;
  }));
  devices=JSON.parse(contents[2]);presets=JSON.parse(contents[3]);validateCatalog(presets,devices);
  const examples=cards.map(card=>{
    const reference=card.querySelector('a[href*="/prompts/"]').href.split('/blob/main/')[1];
    const values=[...card.querySelectorAll('.settings dd')].map(el=>el.textContent.trim());
    const input=exampleConditions({reference,device:card.dataset.device,spatial:card.dataset.mode,composition:values[0],environment:values[1],lighting:values[2]},presets);
    const normalized=normalize({...defaults,...input},presets);assemble(normalized.state,presets,devices);
    return {card,input};
  });
  for(const {card,input} of examples){
    const actions=document.createElement('div');actions.className='prompt-actions compose-entry';
    const button=document.createElement('button');button.type='button';button.className='copy';button.textContent='条件を変更';
    button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','composer');
    button.setAttribute('aria-label',`${card.querySelector('h3').textContent}の条件を変更`);
    actions.append(button);card.querySelector('.qa').after(actions);
    button.addEventListener('click',()=>openEditor(card,input,button));
    const row=[...document.querySelectorAll('.table tbody tr')].find(el=>el.querySelector('[data-jump]')?.dataset.jump===card.dataset.id);
    if(row){
      const tableButton=document.createElement('button');tableButton.type='button';tableButton.textContent='条件を変更';
      tableButton.setAttribute('aria-label',button.getAttribute('aria-label'));
      row.lastElementChild.append(' ',tableButton);
      tableButton.addEventListener('click',()=>{document.querySelector('[data-tab="gallery"]').click();openEditor(card,input,button,false);editor.scrollIntoView({block:'center'});});
    }
  }
  for(const key of Object.keys(fieldLabels))$(key).addEventListener('change',event=>{state[key]=event.target.value;render();});
  $('composer-form').addEventListener('submit',event=>event.preventDefault());
  $('composer-close').addEventListener('click',()=>{editor.hidden=true;activeButton?.setAttribute('aria-expanded','false');activeButton?.focus();});
  $('composer-copy').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(result.prompt);$('copy-status').textContent='コピーしました。';}
    catch{const selection=window.getSelection(),range=document.createRange();range.selectNodeContents($('composer-prompt'));selection.removeAllRanges();selection.addRange(range);$('copy-status').textContent='選択した本文を手動でコピーしてください。';}
  });
}catch(error){$('composer-error').hidden=false;$('composer-error').textContent=`条件変更を読み込めません。${error.message}`;console.error(error);}

function openEditor(card,input,button,toggle=true){
  if(activeButton===button&&!editor.hidden){if(toggle)$('composer-close').click();return;}
  activeButton?.setAttribute('aria-expanded','false');activeButton=button;activeButton.setAttribute('aria-expanded','true');
  state={...defaults,...input};render();
  card.querySelector('.card-body').insertBefore(editor,card.querySelector('details'));
  editor.hidden=false;
}
function render(){
  const normalized=normalize(state,presets);state=normalized.state;
  for(const [key,ids] of Object.entries(choices(state,presets))){
    const select=$(key);
    if([...select.options].map(el=>el.value).join('|')!==ids.join('|'))select.replaceChildren(...ids.map(id=>new Option(labels[id]??id,id)));
    select.value=state[key]??'';
  }
  $('layout-field').hidden=state.subject!=='pair';$('pose-field').hidden=state.subject==='environment';$('surface-field').hidden=state.subject!=='environment';
  $('adjustments').textContent=normalized.changes.map(change=>`${fieldLabels[change.key]}を「${labels[change.to]??'対象外'}」に変更`).join('。');
  result=assemble(state,presets,devices);
  if(result.words<80||result.words>170)throw Error('語数が規定範囲外です');
  $('composer-prompt').textContent=result.prompt;$('word-count').textContent=`${result.words} words`;$('copy-status').textContent='';
}
