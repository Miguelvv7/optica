// ── Casos clínicos: imagen sensible + visor a pantalla completa ──
(function(){
  // Imagen sensible: se muestra difuminada hasta que el usuario la pulsa
  document.querySelectorAll('.sens').forEach(function(box){
    var cover=box.querySelector('.sens-cover');
    if(!cover)return;
    cover.addEventListener('click',function(){
      box.classList.add('revealed');
      cover.remove();
      var btn=box.querySelector('.lb-open');
      if(btn)btn.focus();
    });
  });

  var dlg=document.getElementById('lb');
  var openers=Array.prototype.slice.call(document.querySelectorAll('.lb-open'));
  if(!dlg||!openers.length||typeof dlg.showModal!=='function')return;

  var img=document.getElementById('lb-img');
  var cap=document.getElementById('lb-cap');
  var items=openers.map(function(btn){
    var pic=btn.querySelector('img');
    var src=(pic.getAttribute('src')||'').replace('-800.jpg','.jpg');
    var art=btn.closest('article');
    var title=art?art.querySelector('h3'):null;
    return {src:src,alt:pic.getAttribute('alt')||'',title:title?title.textContent.trim():''};
  });
  var cur=0,last=null;

  function show(i){
    cur=(i+items.length)%items.length;
    var it=items[cur];
    img.src=it.src;
    img.alt=it.alt;
    cap.textContent=(cur+1)+' / '+items.length+(it.title?' · '+it.title:'');
  }
  function open(i){
    last=document.activeElement;
    show(i);
    dlg.showModal();
    document.documentElement.classList.add('lb-lock');
  }
  function close(){ dlg.close(); }

  openers.forEach(function(btn,i){
    btn.addEventListener('click',function(){
      var box=btn.closest('.sens');
      if(box&&!box.classList.contains('revealed'))return;
      open(i);
    });
  });
  dlg.addEventListener('close',function(){
    document.documentElement.classList.remove('lb-lock');
    if(last&&last.focus)last.focus();
  });
  dlg.querySelector('.lb-close').addEventListener('click',close);
  dlg.querySelector('.lb-prev').addEventListener('click',function(){show(cur-1);});
  dlg.querySelector('.lb-next').addEventListener('click',function(){show(cur+1);});
  // Clic fuera de la imagen cierra
  dlg.addEventListener('click',function(e){
    if(e.target===dlg||e.target.classList.contains('lb-inner'))close();
  });
  document.addEventListener('keydown',function(e){
    if(!dlg.open)return;
    if(e.key==='ArrowLeft')show(cur-1);
    if(e.key==='ArrowRight')show(cur+1);
  });
  // Deslizar en móvil
  var x0=null;
  dlg.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  dlg.addEventListener('touchend',function(e){
    if(x0===null)return;
    var dx=e.changedTouches[0].clientX-x0;
    if(Math.abs(dx)>50)show(dx<0?cur+1:cur-1);
    x0=null;
  },{passive:true});
})();
