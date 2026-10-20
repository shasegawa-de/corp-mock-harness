// The existing nine-choice dialog becomes a normal in-flow sidebar on wide screens.
// On narrow screens it stays closed until its original mobile opener is pressed.
const drawer=document.getElementById('filter-drawer');
const desktop=matchMedia('(min-width:1080px)');
function syncSidebar(){
  if(desktop.matches){
    if(drawer.open)drawer.close();
    drawer.show();
    document.body.classList.remove('filter-drawer-open');
  }else if(drawer.open){
    drawer.close();
    document.body.classList.remove('filter-drawer-open');
  }
}
desktop.addEventListener('change',syncSidebar);
syncSidebar();
