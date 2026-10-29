/* Botón fijo "Pedir presupuesto gratis" en toda la web. Móvil: barra abajo con WhatsApp. Ordenador: botón flotante abajo a la izquierda.
   Si la página tiene formulario de presupuesto, lleva a él; si no, a /contacto. */
(function(){try{
 if(document.getElementById('pbar'))return;
 var WA='https://wa.me/34639788220?text='+encodeURIComponent('Hola, AMS Cerramientos. Quiero pedir presupuesto gratis.');
 var f=null;document.querySelectorAll('form').forEach(function(x){if(!f&&x.querySelector('[name=telefono]'))f=x});
 var st=document.createElement('style');
 st.textContent='#pbar{position:fixed;left:0;right:0;bottom:0;z-index:8000;display:flex;gap:8px;padding:8px 10px calc(8px + env(safe-area-inset-bottom));background:rgba(18,32,43,.97);box-shadow:0 -6px 20px rgba(0,0,0,.18);font-family:Inter,system-ui,sans-serif}'+
 '#pbar a{display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;font-weight:700;border-radius:12px;min-height:50px}'+
 '#pbar .pb1{flex:1;background:#C2410C;color:#fff;font-size:17px;box-shadow:0 6px 16px rgba(194,65,12,.4)}'+
 '#pbar .pb2{width:58px;flex:none;background:#1F8F4E}'+
 'body{padding-bottom:72px}a.wa{display:none!important}#asb{bottom:80px!important}'+
 '@media(min-width:860px){#pbar{left:18px;right:auto;bottom:18px;padding:0;background:none;box-shadow:none}#pbar .pb2{display:none}#pbar .pb1{padding:0 24px;border-radius:999px;box-shadow:0 10px 26px rgba(194,65,12,.45)}body{padding-bottom:0}a.wa{display:flex!important}#asb{bottom:88px!important}}'+
 '@media print{#pbar{display:none}}';
 document.head.appendChild(st);
 var b=document.createElement('div');b.id='pbar';
 b.innerHTML='<a class="pb1" href="/contacto">Pedir presupuesto gratis <span aria-hidden="true">&rarr;</span></a><a class="pb2" href="'+WA+'" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp"><svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.7-.1 1.2z"/></svg></a>';
 document.body.appendChild(b);
 if(f){var a=b.querySelector('.pb1');a.addEventListener('click',function(e){e.preventDefault();f.scrollIntoView({behavior:'smooth',block:'center'});var i=f.querySelector('input:not([type=hidden])');if(i)setTimeout(function(){try{i.focus({preventScroll:true})}catch(x){}},600)})}
}catch(e){}})();
