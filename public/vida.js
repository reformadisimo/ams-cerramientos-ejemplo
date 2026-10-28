/* Vida (28 oct 2026): decora etiquetas, titulos, listas, tarjetas y fondos. Solo pintura; sin emojis; sin texto nuevo. */
(function(){
if(document.documentElement.hasAttribute('data-vida'))return;document.documentElement.setAttribute('data-vida','1');
var P={
reloj:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
euro:'M17 6a7 7 0 1 0 0 12M4 10h9M4 14h9',
estrella:'M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8z',
lupa:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5',
ventana:'M4 3h16v18H4zM12 3v18M4 12h16',
casa:'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6',
regla:'M3 15l12-12 6 6-12 12zM8 10l2 2M11 7l2 2M5 13l2 2',
escudo:'M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6zM9 12l2 2 4-4',
telefono:'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
chat:'M4 5h16v11H9l-5 4zM8 10h.01M12 10h.01M16 10h.01',
herramienta:'M14.5 6.5a4 4 0 0 0 5 5L9 22l-3-3zM14.5 6.5L18 3l3 3-3.5 3.5',
rayo:'M13 2 4.5 13.5H12L11 22l8.5-11.5H12z',
regalo:'M4 10h16v4H4zM6 14h12v7H6zM12 10v11M12 10c-2 0-4-1-4-3s3-2 4 3c1-5 4-5 4-3s-2 3-4 3',
grafica:'M4 20h16M4 4v16M8 16v-5M12 16V8M16 16v-3M20 16V6',
sonrisa:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 14c1 1.5 2.3 2 4 2s3-.5 4-2M9 9.5h.01M15 9.5h.01',
cohete:'M12 2c3 2 5 6 5 11l-5 4-5-4c0-5 2-9 5-11zM12 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM7 13l-3 3h4M17 13l3 3h-4',
mapa:'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14',
trofeo:'M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6',
bombilla:'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z',
diana:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2',
check:'M5 12.5l4.5 4.5L19 7',
persona:'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21a8 8 0 0 1 16 0',
sol:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'
};
var C=[['#3b82f6','#1d4ed8'],['#a855f7','#6d28d9'],['#22c55e','#047857'],['#f472b6','#be185d'],['#fbbf24','#d97706'],['#2dd4bf','#0f766e']];
var R=[[/rese[ñn]a|opini|valor/,'estrella'],[/precio|cuesta|euro|€|presupuesto|oferta|barato|financ|ayuda|subvenci/,'euro'],[/google|busca|encuentr|calcul|compar/,'lupa'],[/ventana|persiana|cristal|ventanal/,'ventana'],[/terraza|casa|chalet|vivienda|hogar|comunidad|cancela|puerta|reja|cerramiento|pérgola|pergola/,'casa'],[/medi[rc]|medida|visita|a medida|configur/,'regla'],[/garant|seguridad|confian|protegid|oficial|marca|calidad|kömmerling|alugom/,'escudo'],[/llam|tel[eé]f|contacto|whatsapp/,'telefono'],[/pregunt|duda|dime|ayud/,'chat'],[/instal|obra|montaje|taller|fabric|repar|manten/,'herramienta'],[/rápid|rapid|plazo|tiempo|hora|día|dias|días|cuándo/,'reloj'],[/ahorro|energ|aisla|ruido|luz|térmic|termic/,'sol'],[/novedad|nuevo|estrena/,'rayo'],[/gratis|incluid|sin coste|regalo/,'regalo'],[/zona|alcal|guadalajara|torrej|coslada|villalbilla|mapa|dónde|donde|cerca/,'mapa'],[/trabajo|caso|ejemplo|hecho|real|galer|antes/,'trofeo'],[/equipo|nosotros|empresa|años|experiencia|quién/,'sonrisa'],[/paso|cómo|como|empez|proceso/,'cohete']];
var F=['estrella','cohete','sonrisa','bombilla','regalo','diana'];
function ic(t,i){t=(t||'').toLowerCase();for(var k=0;k<R.length;k++)if(R[k][0].test(t))return R[k][1];return F[i%F.length]}
function sv(n){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+(P[n]||P.estrella)+'"/></svg>'}
function col(el,i){var c=C[i%6];el.style.background='linear-gradient(140deg,'+c[0]+','+c[1]+')';el.style.setProperty('--vs',c[1]+'b3')}
function mk(cls,n,i){var s=document.createElement('span');s.className=cls;s.setAttribute('aria-hidden','true');s.innerHTML=sv(n)+(cls==='vd-lose'?'<i></i>':'');col(s,i);return s}
function run(){
var n=0;
/* 1. etiquetas (pildoras) */
document.querySelectorAll('main p,section p').forEach(function(p){
 if(p.closest('header,footer,nav,.site-header,.site-footer'))return;
 var st=(p.getAttribute('style')||'').replace(/\s+/g,'');
 if(st.indexOf('border-radius:999px')<0||p.querySelector('.vd-ic'))return;
 var t=p.textContent.trim();if(!t||t.length>70)return;
 var s=mk('vd-ic',ic(t,n),n);s.className+=(n%2?' vd-l':' vd-r');p.insertBefore(s,p.firstChild);n++;
});
/* 2. titulos h2 de seccion con chip */
document.querySelectorAll('section h2,article h2').forEach(function(h){
 if(h.closest('header,footer,nav,.site-header,.site-footer,details,.vsec2,.vsec')||h.querySelector('.vd-chip'))return;
 var t=h.textContent.trim();if(!t||t.length>110)return;
 var c=mk('vd-chip',ic(t,n),n);c.className+=(n%2?' vd-l':' vd-r');h.insertBefore(c,h.firstChild);
 h.style.display='flex';h.style.alignItems='center';n++;
});
/* 3. listas en cajitas: marca de color con check */
document.querySelectorAll('section ul>li').forEach(function(li,i){
 var st=(li.getAttribute('style')||'').replace(/\s+/g,'');
 if(li.querySelector('.vd-ok'))return;
 if(!(st.indexOf('padding:14px18px')>=0||st.indexOf('border-radius:12px')>=0&&st.indexOf('padding')>=0))return;
 var c=document.createElement('span');c.className='vd-ok';c.setAttribute('aria-hidden','true');c.innerHTML=sv('check');col(c,i);
 li.style.display='flex';li.style.alignItems='center';li.insertBefore(c,li.firstChild);
});
/* 4. tarjetas sin foto: loseta */
document.querySelectorAll('section a,section div').forEach(function(a){
 var st=(a.getAttribute('style')||'').replace(/\s+/g,'');
 if(st.indexOf('border:1pxsolid#DCE2E7')<0||st.indexOf('flex-direction:column')<0)return;
 if(a.querySelector('img,video,.vd-lose'))return;
 var t=(a.querySelector('span,h3,strong')||a).textContent;
 var l=mk('vd-lose',ic(t,n),n);l.className+=(n%2?' vd-l':' vd-r');l.style.margin='24px 28px 0';l.style.alignSelf='flex-start';a.insertBefore(l,a.firstChild);n++;
});
/* 5. nebulosas de fondo en las secciones claras o de color (no en las que llevan foto) */
var secs=document.querySelectorAll('body>section,main>section,body>main>section,body>div>section,main>article');
var k=0;secs.forEach(function(s){
 var st=(s.getAttribute('style')||'');if(/url\(/.test(st)||s.classList.contains('vsec2')||s.querySelector('.vd-neb'))return;
 var dark=/#12202B|#C2410C/i.test(st.split(';')[0]||'');
 var cols=[['#f9a8d4','#c4b5fd','#fde68a'],['#7dd3fc','#fde68a','#f0abfc'],['#6ee7b7','#fde68a','#c4b5fd'],['#fde68a','#f9a8d4','#7dd3fc']][k%4];
 var nb=document.createElement('div');nb.className='vd-neb';nb.setAttribute('aria-hidden','true');
 cols.forEach(function(c){var x=document.createElement('span');x.style.background=c;nb.appendChild(x)});
 s.classList.add('vd-sec');if(dark)s.classList.add('vd-dark');s.insertBefore(nb,s.firstChild);k++;
});

/* 6. guia del cliente: etiquetas .gt, titulos de apartado, cajas y listas */
if(document.getElementById('indice')){
 document.querySelectorAll('.gt').forEach(function(g){if(g.querySelector('.vd-ic'))return;var t=g.textContent.trim();if(!t||t.length>70)return;var s=mk('vd-ic',ic(t,n),n);s.className+=(n%2?' vd-l':' vd-r');g.insertBefore(s,g.firstChild);g.style.display='inline-flex';g.style.alignItems='center';n++});
 document.querySelectorAll('main h2[id^="s"]').forEach(function(h){if(h.querySelector('.vd-chip'))return;var t=h.textContent.replace('↑ índice','').trim();var c=mk('vd-chip',ic(t,n),n);c.className+=(n%2?' vd-l':' vd-r');h.insertBefore(c,h.firstChild);n++});
 document.querySelectorAll('.box>h3').forEach(function(h){if(h.querySelector('.vd-ic'))return;var s=mk('vd-ic',ic(h.textContent,n),n);s.className+=(n%2?' vd-l':' vd-r');h.insertBefore(s,h.firstChild);n++});
 document.querySelectorAll('.box>ul>li').forEach(function(li,i){if(li.querySelector(':scope>.vd-ok'))return;var c=document.createElement('span');c.className='vd-ok';c.setAttribute('aria-hidden','true');c.innerHTML=sv('check');col(c,i);c.style.marginTop='3px';li.style.listStyle='none';li.style.display='flex';li.style.alignItems='flex-start';var w=document.createElement('div');w.style.minWidth='0';while(li.firstChild)w.appendChild(li.firstChild);li.appendChild(c);li.appendChild(w);var ul=li.parentNode;ul.style.paddingLeft='0'});
}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
