// The canonical catalog owns filtering; tags adapt its existing controls.
export function initTagFilters(){
  const toolbar=document.querySelector('.toolbar-next');
  const drawer=document.getElementById('filter-drawer');
  const opener=document.getElementById('open-filters');
  const dismiss=document.getElementById('close-filters');
  const apply=document.getElementById('show-filters');
  if(!toolbar||!drawer||!opener||!dismiss||!apply)throw Error('vNext filter drawer controls are missing');
  opener.addEventListener('click',()=>{drawer.showModal();document.body.classList.add('filter-drawer-open');});
  dismiss.addEventListener('click',()=>drawer.close());
  apply.addEventListener('click',()=>drawer.close());
  drawer.addEventListener('close',()=>{document.body.classList.remove('filter-drawer-open');opener.focus();});
  drawer.addEventListener('click',event=>{if(event.target!==drawer)return;const bounds=drawer.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)drawer.close();});
  const groups=[...toolbar.querySelectorAll('[role="radiogroup"]')];
  const selectors=[...toolbar.querySelectorAll('select')];
  for(const group of groups){
    const select=document.getElementById(group.dataset.tagSelect);
    if(select){
      group.replaceChildren(...[...select.options].map(option=>{
        const button=document.createElement('button');
        button.type='button';button.className='filter';button.dataset.value=option.value;button.textContent=option.textContent;
        button.addEventListener('click',()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));});
        return button;
      }));
    }
    const buttons=[...group.querySelectorAll('button')];
    for(const button of buttons)button.setAttribute('role','radio');
    group.addEventListener('keydown',event=>{
      const index=buttons.indexOf(document.activeElement);
      if(index<0)return;
      let next;
      if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%buttons.length;
      if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index-1+buttons.length)%buttons.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=buttons.length-1;
      if(next===undefined)return;
      event.preventDefault();buttons[next].click();buttons[next].focus();
    });
    group.addEventListener('click',update);
  }
  for(const select of selectors)select.addEventListener('change',update);
  toolbar.querySelector('#reset-filters').addEventListener('click',update);
  new MutationObserver(update).observe(document.getElementById('count'),{childList:true});
  function update(){
    const count=document.getElementById('count')?.textContent?.trim();
    apply.textContent=count?`${count}を表示`:'結果を表示';
    for(const group of groups){
      const select=document.getElementById(group.dataset.tagSelect);
      for(const button of group.querySelectorAll('button')){
        const active=select?button.dataset.value===select.value:button.classList.contains('active');
        button.classList.toggle('active',active);button.setAttribute('aria-checked',String(active));button.removeAttribute('aria-pressed');button.tabIndex=active?0:-1;
      }
    }
  }
  update();
}
