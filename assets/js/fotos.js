/* ── Fotos del gabinete: se amplían al tocarlas ── */
(function(){
  var dlg=document.getElementById('lb');
  var items=document.querySelectorAll('[data-full]');
  if(!dlg||!items.length||typeof dlg.showModal!=='function')return;
  var img=document.getElementById('lb-img'), cap=document.getElementById('lb-cap'), last=null;
  items.forEach(function(b){
    b.addEventListener('click',function(){
      last=b; img.src=b.dataset.full; img.alt=b.dataset.cap||''; cap.textContent=b.dataset.cap||'';
      dlg.showModal(); document.documentElement.classList.add('lb-lock');
    });
  });
  function close(){dlg.close();}
  dlg.querySelector('.lb-close').addEventListener('click',close);
  dlg.addEventListener('click',function(e){if(e.target===dlg||e.target.classList.contains('lb-inner'))close();});
  dlg.addEventListener('close',function(){document.documentElement.classList.remove('lb-lock');if(last)last.focus();});
})();
