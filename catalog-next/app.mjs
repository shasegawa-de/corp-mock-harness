import {labels,defaults,validateCatalog,choices,normalize,fromPreset,assemble} from './engine.mjs';
const $=id=>document.getElementById(id);
const fieldLabels={subject:'対象',layout:'並び方',spatial:'配置',pose:'姿勢',surface:'建築面',composition:'構図',environment:'背景・素材',lighting:'照明'};
let state={...defaults}, presets,devices,rows=[],result;
const sourceRoot='https://github.com/shasegawa-de/corp-mock-harness/blob/main/';
try {
  const paths=['AGENTS.md','STYLE.md','devices.json','presets.json','source.json'];
  const contents=await Promise.all(paths.map(async name=>{
    const r=await fetch(`./data/${name}`,{cache:'no-cache'});
    if(!r.ok)throw Error(`${name}を読み込めません (${r.status})`);
    const text=await r.text();
    if(!text.trim())throw Error(`${name}が空です`);
    return text;
  }));
  devices=JSON.parse(contents[2]);presets=JSON.parse(contents[3]);
  validateCatalog(presets,devices);
  const source=JSON.parse(contents[4]);
  const sourceLink=document.createElement('a');sourceLink.href=`https://github.com/shasegawa-de/corp-mock-harness/commit/${source.commit}`;sourceLink.textContent=`設定の出典: main @ ${source.commit.slice(0,7)}`;
  $('source-info').append(sourceLink,' · 公開時点の必須4ファイルを読込済み。生成時は最新mainを再確認。');
  rows=[...presets.showcase_presets,...presets.surface_studies];
  for(const row of rows){
    const s=fromPreset(row);
    const option=new Option(`${labels[s.subject]} / ${labels[s.spatial]} / ${labels[s.surface!=='space'?s.surface:s.composition]} / ${labels[s.environment]}`,row.id);
    $('preset').add(option);
  }
  for(const id of ['iphone17','macbookpro14','pair','environment']){
    const wrap=document.createElement('div');wrap.className='subject';
    const radio=document.createElement('input');radio.type='radio';radio.name='subject';radio.value=id;radio.id=`subject-${id}`;
    const label=document.createElement('label');label.htmlFor=radio.id;label.textContent=labels[id];
    radio.addEventListener('change',()=>change('subject',id));wrap.append(radio,label);$('subjects').append(wrap);
  }
  for(const key of ['layout','spatial','pose','surface','composition','environment','lighting'])$(key).addEventListener('change',event=>change(key,event.target.value));
  $('conditions-form').addEventListener('submit',event=>event.preventDefault());
  $('preset').addEventListener('change',()=>{
    const row=rows.find(x=>x.id===$('preset').value);if(!row)return;
    state={...defaults,...fromPreset(row)};render();
    $('preset-note').replaceChildren('条件のみ読込。組立文は元の完成プロンプトとは異なります。 ');
    const link=document.createElement('a');link.href=sourceRoot+row.reference_prompt;link.target='_blank';link.rel='noopener noreferrer';link.textContent='元のプロンプト ↗';$('preset-note').append(link);
  });
  $('reset').addEventListener('click',()=>{state={...defaults};$('preset').value='';resetPresetNote();render();});
  $('copy').addEventListener('click',async()=>{
    try {await navigator.clipboard.writeText(result.prompt);$('copy-status').textContent='プロンプト全文をコピーしました。';}
    catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents($('prompt'));selection.removeAllRanges();selection.addRange(range);$('copy-status').textContent='自動コピーできませんでした。選択された本文を手動でコピーしてください。';}
  });
  $('download').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([result.prompt+'\n'],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=`mock-${state.subject}-${state.spatial}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $('loading').hidden=true;$('builder').hidden=false;render();
}catch(error){$('loading').hidden=false;$('builder').hidden=true;$('loading').textContent=`読み込みを停止しました。${error.message}。再読み込みして確認してください。`;console.error(error);}

function resetPresetNote(){$('preset-note').textContent='';}
function change(key,value){state[key]=value;$('preset').value='';resetPresetNote();render();}
function render(){
  const normalized=normalize(state,presets);state=normalized.state;
  const allowed=choices(state,presets);
  for(const key of ['layout','spatial','pose','surface','composition','environment','lighting']){
    const select=$(key);const ids=allowed[key];
    if([...select.options].map(x=>x.value).join('|')!==ids.join('|'))select.replaceChildren(...ids.map(id=>new Option(labels[id]??id,id)));
    select.value=state[key]??'';
  }
  document.querySelectorAll('[name="subject"]').forEach(el=>el.checked=el.value===state.subject);
  $('layout-field').hidden=state.subject!=='pair';
  $('pose-field').hidden=state.subject==='environment';
  $('surface-field').hidden=state.subject!=='environment';
  $('adjustments').textContent=normalized.changes.length?normalized.changes.map(x=>`${fieldLabels[x.key]}を「${labels[x.to]??'対象外'}」に調整`).join('。')+'。選択条件に合わせた変更です。':'';
  result=assemble(state,presets,devices);
  if(result.words<80||result.words>170)throw Error('プロンプトの語数が規定範囲外です');
  $('prompt').textContent=result.prompt;$('word-count').textContent=`${result.words} words`;$('contract').textContent=JSON.stringify(result.contract,null,2);$('copy-status').textContent='';
  const summaryKeys=['subject',...(state.subject==='pair'?['layout']:[]),'spatial',...(state.subject==='environment'?['surface']:['pose']),'composition','environment','lighting'];
  $('summary').replaceChildren(...summaryKeys.map(key=>{const el=document.createElement('span');el.textContent=labels[state[key]];return el;}));
  $('fragments').replaceChildren(...result.fragments.map(row=>{
    const div=document.createElement('div');div.className='fragment';const h=document.createElement('h3');h.textContent=row.label;const p=document.createElement('p');p.textContent=row.text;div.append(h,p);return div;
  }));
}
