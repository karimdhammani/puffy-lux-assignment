(function(){
  var $=function(id){return document.getElementById(id)};
  var live=$('pf-live');
  function say(t){ if(live) live.textContent=t; }
  var cards=[].slice.call(document.querySelectorAll('.pf-upg3__card')), offer=$('pf-offer');
  function setModel(m){
    cards.forEach(function(c){ var on=c.dataset.model===m; c.setAttribute('aria-checked',String(on)); c.tabIndex=on?0:-1; });
    if(m==='royal'){ offer.classList.remove('is-pulse'); void offer.offsetWidth; offer.classList.add('is-pulse'); say('Puffy Royal selected. Free upgrade, included at no extra cost.'); }
    else say('Puffy Lux selected.');
  }
  cards.forEach(function(c){
    c.addEventListener('click',function(){ setModel(c.dataset.model); });
    c.addEventListener('keydown',function(e){ if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].indexOf(e.key)<0) return; e.preventDefault(); var m=c.dataset.model==='lux'?'royal':'lux'; setModel(m); var n=c.parentNode.querySelector('[data-model="'+m+'"]'); if(n) n.focus(); });
  });
  var zip=$('pf-zip'), btn=$('pf-zip-btn'), out=$('pf-zip-result');
  zip.addEventListener('input',function(){ zip.value=zip.value.replace(/\D/g,'').slice(0,5); btn.disabled=zip.value.length!==5; });
  $('pf-zip-form').addEventListener('submit',function(e){
    e.preventDefault(); if(zip.value.length!==5) return;
    function add(n){ var d=new Date(), c=0; while(c<n){ d.setDate(d.getDate()+1); var w=d.getDay(); if(w&&w<6) c++; } return d; }
    var f={weekday:'short',month:'short',day:'numeric'};
    out.innerHTML='<img src="system/icons/tick-green.svg" alt=""><span>Free delivery to <b>'+zip.value+'</b>: arrives <b>'+add(3).toLocaleDateString('en-US',f)+' – '+add(5).toLocaleDateString('en-US',f)+'</b>. In-home setup available.</span>';
    out.hidden=false;
  });
  function syncModel(){ var r=document.querySelector('.pf-upg3__card[data-model="royal"][aria-checked="true"]'); var m=$('dialog-model'); if(m) m.innerHTML=r?'Puffy Royal Hybrid <b class="size-selection__free">Free Upgrade</b>':'Puffy Lux Hybrid'; }
  cards.forEach(function(c){ c.addEventListener('click',syncModel); c.addEventListener('keydown',function(){ setTimeout(syncModel); }); });
  function syncDlg(){  document.querySelectorAll('.pf-dlg-price').forEach(function(e){ e.textContent=$('pf-price').textContent; }); document.querySelectorAll('.pf-dlg-value').forEach(function(e){ e.textContent=$('pf-value').textContent; }); }
  new MutationObserver(syncDlg).observe($('pf-price'),{childList:true,characterData:true,subtree:true});
  var tg=$('pf-setup-toggle'), body=$('pf-setup-body');
  tg.addEventListener('click',function(){ var open=tg.getAttribute('aria-expanded')!=='true'; tg.setAttribute('aria-expanded',String(open)); body.hidden=!open; });
})();
