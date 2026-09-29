// ── Iconos SVG (sustituyen a la fuente de iconos) ──
const ICON_PATHS={"menu": "M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z", "close": "m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z", "check_circle": "m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z", "info": "M453-280h60v-240h-60v240Zm50.5-323.2q9.5-9.2 9.5-22.8 0-14.45-9.48-24.22-9.48-9.78-23.5-9.78t-23.52 9.78Q447-640.45 447-626q0 13.6 9.48 22.8 9.48 9.2 23.5 9.2t23.52-9.2ZM480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Z", "priority_high": "M479.91-120q-28.91 0-49.41-20.59-20.5-20.59-20.5-49.5t20.59-49.41q20.59-20.5 49.5-20.5t49.41 20.59q20.5 20.59 20.5 49.5t-20.59 49.41q-20.59 20.5-49.5 20.5ZM410-360v-480h140v480H410Z"};
function setIcon(el,name){if(!el||!ICON_PATHS[name])return;const p=el.querySelector('path');if(p)p.setAttribute('d',ICON_PATHS[name]);}

// ── Mobile menu ──
(function(){
  const btn=document.getElementById('mob-toggle'),
        menu=document.getElementById('mob-menu'),
        icon=document.getElementById('mob-icon');
  if(!btn)return;
  btn.addEventListener('click',()=>{
    const open=menu.classList.toggle('open');
    setIcon(icon,open?'close':'menu');
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
  });
  document.addEventListener('click',e=>{
    if(!btn.contains(e.target)&&!menu.contains(e.target)){
      menu.classList.remove('open');
      setIcon(icon,'menu');
      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-label','Abrir menú');
    }
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&menu.classList.contains('open')){
      menu.classList.remove('open');
      setIcon(icon,'menu');
      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-label','Abrir menú');
      btn.focus();
    }
  });
})();

// ── Nav shadow on scroll ──
window.addEventListener('scroll',()=>{
  const h=document.getElementById('site-header');
  if(h) h.classList.toggle('shadow-nav',scrollY>10);
},{ passive:true });

// ── Scroll reveal ──
(function(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');obs.unobserve(e.target);}});
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.sr,.sr-l,.sr-r,.sr-s').forEach(el=>obs.observe(el));
})();

// ── Back to top ──
(function(){
  const b=document.getElementById('btt');
  if(!b)return;
  b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll',()=>{
    b.style.opacity=scrollY>400?'1':'0';
    b.style.pointerEvents=scrollY>400?'auto':'none';
  },{passive:true});
})();

// ── Toast helper ──
function showToast(msg,dur=3000){
  const t=document.getElementById('toast');
  if(!t)return;
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),dur);
}

// ── Live open/closed status (hero pill on index.html) ──
(function(){
  const el=document.getElementById('hero-status');
  if(!el)return;
  const now=new Date();
  const day=now.getDay();
  const h=now.getHours()*100+now.getMinutes();
  const isOpen=day>=1&&day<=5&&((h>=1000&&h<=1330)||(h>=1700&&h<=2030));
  if(isOpen){
    el.innerHTML='<span class="open-pill open"><span class="status-dot green"></span>Abierto ahora</span>';
  } else {
    const opens=day>=1&&day<=5?(h<1000?'a las 10:00':h<=1330?'a las 17:00':day<5?'mañana a las 10:00':'el lunes a las 10:00'):'el lunes a las 10:00';
    el.innerHTML=`<span class="open-pill closed"><span class="status-dot red"></span>Cerrado · Abre ${opens}</span>`;
  }
})();

// ── Live open/closed badge (ubicacion.html) ──
(function(){
  const badge=document.getElementById('open-badge');
  if(!badge)return;
  const now=new Date();
  const day=now.getDay();
  const h=now.getHours()*100+now.getMinutes();
  const open=day>=1&&day<=5&&((h>=1000&&h<=1330)||(h>=1700&&h<=2030));
  badge.classList.remove('hidden');
  badge.innerHTML=open
    ?'<span class="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full"><span class="w-2 h-2 rounded-full bg-green-500 inline-block"></span>Abierto ahora</span>'
    :'<span class="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full"><span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>Cerrado ahora</span>';
})();

// ── FAQ accordion ──
(function(){
  document.querySelectorAll('.faq-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const expanded=btn.getAttribute('aria-expanded')==='true';
      document.querySelectorAll('.faq-btn').forEach(b=>{
        b.setAttribute('aria-expanded','false');
        const body=document.getElementById(b.getAttribute('aria-controls'));
        if(body)body.classList.remove('open');
      });
      if(!expanded){
        btn.setAttribute('aria-expanded','true');
        const body=document.getElementById(btn.getAttribute('aria-controls'));
        if(body)body.classList.add('open');
      }
    });
  });
})();

// ── Animated counters ──
function fmtCount(v,decimals){
  return decimals>0 ? v.toFixed(decimals).replace('.',',') : Math.floor(v).toLocaleString('es-ES');
}
function animCount(el){
  const target=parseFloat(el.dataset.target);
  const decimals=el.dataset.decimals?parseInt(el.dataset.decimals):0;
  const suffix=el.dataset.suffix||'';
  const dur=1400,start=performance.now();
  function tick(now){
    const t=Math.min((now-start)/dur,1);
    const eased=1-Math.pow(1-t,3);
    el.textContent=fmtCount(target*eased,decimals)+suffix;
    if(t<1)requestAnimationFrame(tick);
    else el.textContent=fmtCount(target,decimals)+suffix;
  }
  requestAnimationFrame(tick);
}
(function(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){animCount(e.target);obs.unobserve(e.target);}});
  },{threshold:.5});
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('[data-target]').forEach(el=>obs.observe(el));
})();

// ── Cookie banner (RGPD) ──
(function(){
  try{
    if(!document.cookie.includes('oa_cookies=1')){
      const b=document.getElementById('cookie-banner');
      if(b){b.classList.remove('hidden');}
    }
    const btn=document.getElementById('cookie-accept');
    if(btn){btn.addEventListener('click',function(){
      document.cookie='oa_cookies=1; max-age=15552000; path=/; SameSite=Lax';
      const b=document.getElementById('cookie-banner');
      if(b){b.classList.add('hidden');}
    });}
  }catch(e){}
})();

// ── Mapa bajo demanda (no carga Google hasta que el usuario lo pide) ──
(function(){
  document.querySelectorAll('.map-facade').forEach(function(box){
    var btn=box.querySelector('.map-load');
    if(!btn)return;
    btn.addEventListener('click',function(){
      var f=document.createElement('iframe');
      f.src=box.dataset.src;
      f.title=box.dataset.title||'Mapa';
      f.className='absolute inset-0 w-full h-full border-0';
      f.setAttribute('allowfullscreen','');
      f.setAttribute('referrerpolicy','no-referrer-when-downgrade');
      box.innerHTML='';
      box.appendChild(f);
    });
  });
})();
