/* Aplica las preferencias de lectura antes de pintar la página (evita parpadeos). */
(function(){try{var p=JSON.parse(localStorage.getItem('oa_prefs')||'{}'),c=document.documentElement.classList;
if(p.size==='lg')c.add('fs-lg');if(p.size==='xl')c.add('fs-xl');if(p.hc)c.add('hc');if(p.rm)c.add('rm');}catch(e){}})();
