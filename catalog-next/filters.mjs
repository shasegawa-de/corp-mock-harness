import {choices,defaults,labels,normalize} from './engine.mjs';

// These IDs and labels share the prompt editor's authoritative configurations.
// Every facet also offers "すべて": searching existing examples must not
// silently normalize user choices into a different scene.
export const filterAxes=['subject','layout','spatial','pose','surface','composition','environment','lighting'];

// Share the composition/camera options with the prompt editor's right-side panel.
// An unset search facet uses the editor's default for the *option list only*;
// it never silently restricts matching gallery cards.
export function compositionFilterOptions(selected,presets){
  const context={...defaults,
    subject:selected.subject||defaults.subject,
    spatial:selected.spatial||defaults.spatial,
    pose:selected.pose||defaults.pose,
    surface:selected.surface||defaults.surface
  };
  return choices(normalize(context,presets).state,presets).composition;
}
export function filterOptions(presets,qualityOptions=[]){
  const unique=ids=>[...new Set(ids)];
  return {
    subject:choices(defaults,presets).subject,
    layout:presets.device_layouts.map(x=>x.id),
    spatial:presets.spatial_modes.map(x=>x.id),
    pose:unique([...presets.device_pose_rules.iphone17,...presets.device_pose_rules.macbookpro14].map(x=>x.id)),
    surface:choices({...defaults,subject:'environment',spatial:'grounded'},presets).surface,
    composition:compositionFilterOptions({},presets),
    environment:presets.environments.map(x=>x.id),
    lighting:presets.lighting.map(x=>x.id),
    quality:qualityOptions
  };
}
export function matchesTags(state,selected){
  return filterAxes.every(key=>!selected[key]||state[key]===selected[key]);
}
export function initTagFilters({examples,presets}){
  const toolbar=document.querySelector('.toolbar-next');
  const drawer=document.getElementById('filter-drawer');
  const opener=document.getElementById('open-filters');
  const dismiss=document.getElementById('close-filters');
  const applyButton=document.getElementById('show-filters');
  const reset=document.getElementById('reset-filters');
  const qualitySelect=document.getElementById('quality-filter');
  const count=document.getElementById('count');
  const empty=document.getElementById('nothing');
  if(!toolbar||!drawer||!opener||!dismiss||!applyButton||!reset||!qualitySelect||!count||!empty)throw Error('vNext filter drawer is incomplete');
  const groups=[...toolbar.querySelectorAll('[data-filter-axis]')];
  if(groups.length!==9)throw Error('Nine facets are required');
  const qualityDefault=qualitySelect.options[0]?.value??'';
  const qualityOptions=[...qualitySelect.options].filter(option=>option.value!==qualityDefault);
  const values=filterOptions(presets,qualityOptions.map(x=>x.value));
  const selected=Object.fromEntries([...filterAxes,'quality'].map(axis=>[axis,'']));
  const tableRows=new Map([...document.querySelectorAll('.table tbody tr')].map(row=>[row.querySelector('[data-jump]')?.dataset.jump,row]));
  const titleFor=(axis,id)=>axis==='quality'?qualityOptions.find(option=>option.value===id)?.textContent??id:labels[id]??id;
  let matched=examples.length;
  const compositionGroup=groups.find(group=>group.dataset.filterAxis==='composition');
  let compositionSignature='';
  const syncCompositionOptions=()=>{
    const ids=['',...compositionFilterOptions(selected,presets)];
    const signature=ids.join('|');
    if(compositionSignature===signature)return;
    compositionSignature=signature;
    if(selected.composition&&!ids.includes(selected.composition))selected.composition='';
    compositionGroup.replaceChildren(...ids.map(id=>{
      const button=document.createElement('button');
      button.className='filter';button.type='button';button.dataset.value=id;
      button.textContent=id?labels[id]??id:'すべて';
      button.setAttribute('role','radio');
      button.addEventListener('click',()=>{selected.composition=id;filter();});
      return button;
    }));
  };

  const updateActive=()=>{
    for(const group of groups){
      const axis=group.dataset.filterAxis;
      for(const button of group.querySelectorAll('button')){
        const active=selected[axis]===button.dataset.value;
        button.classList.toggle('active',active);
        button.setAttribute('aria-checked',String(active));
        button.tabIndex=active?0:-1;
      }
    }
  };

  const filter=()=>{
    syncCompositionOptions();
    // The original script remains responsible for quality ratings, view
    // switching, table links and lightbox. Clear only our extra visibility
    // restrictions before consulting its current quality result.
    for(const {card} of examples){
      delete card.dataset.nextHidden;
      const row=tableRows.get(card.dataset.id);
      if(row)delete row.dataset.nextHidden;
    }
    qualitySelect.value=selected.quality||qualityDefault;
    qualitySelect.dispatchEvent(new Event('change',{bubbles:true}));
    let total=0;
    for(const example of examples){
      const {card,state}=example;
      const legacyVisible=!card.hidden&&getComputedStyle(card).display!=='none';
      const shown=legacyVisible&&matchesTags(state,selected);
      if(shown)total++;
      else card.dataset.nextHidden='true';
      const row=tableRows.get(card.dataset.id);
      if(row&&!shown)row.dataset.nextHidden='true';
    }
    matched=total;
    const countText=`${total} / ${examples.length}`;
    if(count.textContent!==countText)count.textContent=countText;
    applyButton.textContent=`${total}件を表示`;
    empty.hidden=total>0;
    empty.style.display=total===0?'block':'none';
    reset.disabled=!Object.values(selected).some(Boolean);
    updateActive();
  };
  for(const group of groups){
    const axis=group.dataset.filterAxis, ids=['',...values[axis]];
    if(axis!=='composition')group.replaceChildren(...ids.map(id=>{
      const button=document.createElement('button');
      button.className='filter';button.type='button';button.dataset.value=id;
      button.textContent=id?titleFor(axis,id):'すべて';
      button.setAttribute('role','radio');
      button.addEventListener('click',()=>{selected[axis]=id;filter();});
      return button;
    }));
    group.addEventListener('keydown',event=>{
      const buttons=[...group.querySelectorAll('button')];
      const current=buttons.indexOf(document.activeElement);
      if(current<0)return;
      let next;
      if(['ArrowRight','ArrowDown'].includes(event.key))next=(current+1)%buttons.length;
      if(['ArrowLeft','ArrowUp'].includes(event.key))next=(current-1+buttons.length)%buttons.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=buttons.length-1;
      if(next===undefined)return;
      event.preventDefault();buttons[next].click();buttons[next].focus();
    });
  }
  reset.addEventListener('click',()=>{
    for(const axis of Object.keys(selected))selected[axis]='';
    filter();
  });
  opener.addEventListener('click',()=>{drawer.showModal();document.body.classList.add('filter-drawer-open');});
  dismiss.addEventListener('click',()=>drawer.close());
  applyButton.addEventListener('click',()=>drawer.close());
  drawer.addEventListener('close',()=>{document.body.classList.remove('filter-drawer-open');opener.focus();});
  drawer.addEventListener('click',event=>{
    if(event.target!==drawer)return;
    const bounds=drawer.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)drawer.close();
  });
  // Legacy changes (including gallery/table switch) must not leave stale
  // visible counts in the new facet drawer.
  new MutationObserver(()=>{
    const desired=`${matched} / ${examples.length}`;
    if(count.textContent!==desired)count.textContent=desired;
  }).observe(count,{subtree:true,characterData:true,childList:true});
  filter();
}
