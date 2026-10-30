/* CRM de AMS Cerramientos para el móvil.
   window.CRM = {modo:'demo'} -> datos de ejemplo guardados solo en el móvil.
   window.CRM = {modo:'real', url, key} -> datos en la base de datos de AMS, con enlace personal (#k=...).
   La facturación en euros nunca sale del móvil: al servidor solo llega el porcentaje frente a la media (100 = trabajo medio). */
(function(){
const CFG=window.CRM||{modo:'demo'};
const REAL=CFG.modo==='real';
const K=REAL?'ams-crm-real-v1':'ams-crm-movil-v3';
const P={
 tel:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
 sobre:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 gente:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.5 3.3-5.5 6.5-5.5s5.9 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2 .6 3.2 2.5 3.5 5.5"/>',
 estrella:'<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>',
 casco:'<path d="M3 17h18"/><path d="M5 17a7 7 0 0 1 14 0"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
 globo:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 puntos:'<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',
 ventana:'<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M12 4v16M4 12h16"/>',
 cancela:'<path d="M4 20V9M8 20V7M12 20V6M16 20V7M20 20V9"/><path d="M4 9c2-3 5-4 8-4s6 1 8 4"/><path d="M4 14h16"/>',
 cerr:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6M12 14v6"/>',
 perg:'<path d="M3 8h18"/><path d="M5 8v12M19 8v12"/><path d="M4 8l2-3h12l2 3"/><path d="M8 8v3M12 8v3M16 8v3"/>',
 puerta:'<rect x="6" y="3" width="12" height="18" rx="1"/><circle cx="15" cy="12" r="1"/>',
 check:'<path d="M5 12l4 4L19 7"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 lapiz:'<path d="M4 20l4-1 10-10-3-3L5 16z"/><path d="M13 7l3 3"/>',
 graf:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 bocadillo:'<path d="M4 5h16v10H9l-5 4z"/>',
 casa:'<path d="M3 11l9-7 9 7v9H3z"/>',
 doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
 medalla:'<circle cx="12" cy="14" r="5"/><path d="M8 3l2 6M16 3l-2 6M9 3h6"/>',
 cafe:'<path d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2"/><path d="M8 3v2M11 3v2M14 3v2"/>',
 atras:'<path d="M15 5l-7 7 7 7"/>',
 lupa:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 persona:'<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.5 4-7 8-7s7.2 2.5 8 7"/>',
 mas:'<path d="M12 5v14M5 12h14"/>',
 movil:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 ojo:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/>',
 nube:'<path d="M7 18a5 5 0 0 1-.5-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>',
 llave:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>'
};
const ic=(n,c)=>'<svg class="i'+(c?' '+c:'')+'" viewBox="0 0 24 24">'+P[n]+'</svg>';
const WA='<svg class="i" viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2z"/></svg>';

const ORIG=[
 {k:'buzoneo',n:'Buzoneo',i:'sobre'},
 {k:'reco',n:'Me lo han recomendado',i:'gente'},
 {k:'antiguo',n:'Ya era cliente',i:'estrella'},
 {k:'reformista',n:'Reformista o constructor',i:'casco'},
 {k:'llamada',n:'Me ha llamado',i:'tel'},
 {k:'web',n:'Por la web',i:'globo'},
 {k:'otro',n:'Otra cosa',i:'puntos'}
];
const TRAB=[
 {k:'ventanas',n:'Ventanas',i:'ventana'},{k:'cancela',n:'Cancela',i:'cancela'},{k:'cerramiento',n:'Cerramiento',i:'cerr'},
 {k:'pergola',n:'Pérgola',i:'perg'},{k:'puerta',n:'Puerta',i:'puerta'},{k:'otro',n:'Otra cosa',i:'puntos'}
];
const PASOS=[
 {k:'hablado',n:'Ya hemos hablado',i:'bocadillo',d:'Le has llamado o escrito'},
 {k:'visita',n:'Visita hecha',i:'casa',d:'Has ido a verlo y a medir'},
 {k:'presupuesto',n:'Presupuesto dado',i:'doc',d:'Le has pasado el precio'}
];
const ETN={nuevo:'Sin llamar',hablado:'Ya hemos hablado',visita:'Visita hecha',presupuesto:'Presupuesto dado',si:'Contratado',no:'No ha salido'};
const MOT=['Por el precio','Lo deja para más adelante','No contesta','Se ha ido con otro','No era lo nuestro','Otra cosa'];
const OR=k=>ORIG.find(o=>o.k===k)||ORIG[ORIG.length-1];
const TR=k=>TRAB.find(t=>t.k===k)||{k:'',n:'Sin concretar',i:'puntos'};

const hoy=()=>Date.now(), dias=n=>hoy()-n*864e5;
function demo(){return {yo:'Javi',equipo:['Javi','Óscar'],media:6000,id:20,tour:0,L:[
 {id:1,nombre:'Marta Gil',tel:'600111222',ok:'web',origen:'Anuncio de Google',tk:'ventanas',zona:'Villalbilla',f:dias(0),est:'nuevo',pide:'6 ventanas de PVC, oscilobatientes, blancas',h:[{f:dias(0),q:'Web',x:'Ha pedido presupuesto desde la web'}]},
 {id:2,nombre:'Luis Ortega',tel:'600333444',ok:'web',origen:'Calculadora de la web',tk:'cancela',zona:'Alcalá de Henares',f:dias(1),est:'nuevo',pide:'Cancela corredera motorizada, 4,5 m',h:[{f:dias(1),q:'Web',x:'Ha usado la calculadora: unos 3.100 €'}]},
 {id:3,nombre:'Pilar Romero',tel:'600555666',ok:'buzoneo',origen:'Buzoneo',tk:'ventanas',zona:'Torres de la Alameda',f:dias(6),est:'visita',fv:dias(4),quien:'Javi',h:[{f:dias(6),q:'Javi',x:'Apuntada (buzoneo)'},{f:dias(4),q:'Javi',x:'Visita hecha. Chalet, 8 ventanas de aluminio viejas.'}]},
 {id:4,nombre:'Andrés Molina',tel:'600777888',ok:'reco',origen:'Me lo han recomendado',tk:'cerramiento',zona:'Loeches',f:dias(12),est:'presupuesto',fp:dias(8),quien:'Óscar',h:[{f:dias(12),q:'Javi',x:'Lo manda su cuñado (cliente de 2024)'},{f:dias(8),q:'Óscar',x:'Presupuesto dado'}]},
 {id:5,nombre:'Sonia Prieto',tel:'600999000',ok:'web',origen:'Facebook / Instagram',tk:'cancela',zona:'Meco',f:dias(9),est:'si',quien:'Javi',h:[{f:dias(9),q:'Web',x:'Ha pedido presupuesto desde Instagram'},{f:dias(4),q:'Javi',x:'Contratado'}]},
 {id:6,nombre:'Raúl Benito',tel:'611222333',ok:'buzoneo',origen:'Buzoneo',tk:'ventanas',zona:'Villalbilla',f:dias(12),est:'si',importe:4800,rel:80,quien:'Javi',h:[{f:dias(2),q:'Javi',x:'Contratado'}]},
 {id:7,nombre:'Elena Vidal',tel:'611444555',ok:'web',origen:'Anuncio de Google',tk:'ventanas',zona:'Torrejón de Ardoz',f:dias(14),est:'no',motivo:'Por el precio',quien:'Javi',h:[{f:dias(5),q:'Javi',x:'No ha salido: por el precio'}]},
 {id:8,nombre:'Jorge Pastor',tel:'611666777',ok:'antiguo',origen:'Ya era cliente',tk:'pergola',zona:'Alcalá de Henares',f:dias(16),est:'si',importe:3900,rel:65,quien:'Óscar',h:[{f:dias(7),q:'Óscar',x:'Contratado'}]},
 {id:9,nombre:'Carmen Ruiz',tel:'611888999',ok:'web',origen:'Google (sin anuncio)',tk:'ventanas',zona:'Camarma de Esteruelas',f:dias(18),est:'hablado',h:[{f:dias(17),q:'Javi',x:'Hablado por teléfono. Quiere visita después de Reyes.'}]},
 {id:10,nombre:'Tomás Herrero',tel:'622111222',ok:'reformista',origen:'Reformista o constructor',tk:'ventanas',zona:'Alcobendas',f:dias(20),est:'si',importe:8700,rel:145,quien:'Javi',h:[{f:dias(10),q:'Javi',x:'Contratado'}]},
 {id:11,nombre:'Nuria Sanz',tel:'622333444',ok:'buzoneo',origen:'Buzoneo',tk:'cancela',zona:'Daganzo',f:dias(22),est:'no',motivo:'Lo deja para más adelante',h:[{f:dias(12),q:'Javi',x:'No ha salido: lo deja para más adelante'}]}
]}}
const $=i=>document.getElementById(i);
const lsg=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const lss=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nombre=x=>String(x.nombre||'').split(' ')[0];
function cuando(t){const d=Math.floor((hoy()-t)/864e5);return d<=0?'hoy':d==1?'ayer':'hace '+d+' días'}
function fecha(t){const d=new Date(t);return d.toLocaleDateString('es-ES',{day:'numeric',month:'short'})+', '+d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}
const esWeb=x=>x.ok==='web';
const vibra=()=>{if(navigator.vibrate)try{navigator.vibrate(25)}catch(e){}};
function txtRel(rel){if(!rel)return '';const p=Math.round(rel-100);return p===0?'justo en tu media':(p>0?'un '+p+' % por encima':'un '+(-p)+' % por debajo')+' de tu media'}
function aviso(txt,ico){const t=$('toast');t.innerHTML=(ico?ic(ico):'')+'<span>'+txt+'</span>';t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),2600)}
function fiesta(){const c=$('cf'),ctx=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;c.style.display='block';const col=['#E8742A','#C2410C','#1FA855','#F5C542','#3B82F6','#ffffff'];const Q=[];for(let i=0;i<150;i++)Q.push({x:Math.random()*c.width,y:-20-Math.random()*c.height*.6,r:5+Math.random()*5,c:col[i%col.length],v:2.5+Math.random()*3.5,a:Math.random()*6.28,s:(Math.random()-.5)*.25});let t=0;(function f(){ctx.clearRect(0,0,c.width,c.height);Q.forEach(p=>{p.y+=p.v;p.x+=Math.sin(p.a)*1.4;p.a+=p.s;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=p.c;ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6);ctx.restore()});if(++t<150)requestAnimationFrame(f);else c.style.display='none'})()}

// ---------- datos ----------
let D;            // {yo, equipo, media, tour, L, rol}
let TOKEN='';
const LOCAL=REAL?lsg(K+'-local',{media:0,tour:0,imp:{},ll:{},pos:{}}):null; // en el modo real, lo que solo vive en este móvil
const COLA=REAL?lsg(K+'-cola',[]):[];
function guarda(){
 if(!REAL){lss(K,D);return}
 LOCAL.media=D.media;LOCAL.tour=D.tour;lss(K+'-local',LOCAL);lss(K+'-cola',COLA);
 lss(K+'-copia',{t:hoy(),L:D.L,yo:D.yo,equipo:D.equipo,rol:D.rol});
}
async function rpc(fn,args){
 const r=await fetch(CFG.url+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:CFG.key,Authorization:'Bearer '+CFG.key,'Content-Type':'application/json'},body:JSON.stringify(args)});
 if(!r.ok){const e=new Error('http '+r.status);e.status=r.status;throw e}
 return r.json();
}
function deServidor(c){
 const x=Object.assign({},c);x.h=c.h||[];
 if(LOCAL.imp[x.id])x.importe=LOCAL.imp[x.id];
 if(LOCAL.ll[x.id])x.ll=LOCAL.ll[x.id];
 LOCAL.pos=LOCAL.pos||{};if(LOCAL.pos[x.id])x.pos=LOCAL.pos[x.id];
 return x;
}
let enviando=false;
async function vaciaCola(){
 if(!REAL||enviando||!COLA.length)return;
 enviando=true;pintaNube();
 try{
  while(COLA.length){
   const op=COLA[0];let r;
   if(op.fn==='crear'){
    r=await rpc('crm_crear',{p_token:TOKEN,d:op.d});
    const tmp=op.id,x=D.L.find(y=>y.id===tmp);
    COLA.forEach(o=>{if(o.id===tmp)o.id=r.id});
    if(LOCAL.imp[tmp]){LOCAL.imp[r.id]=LOCAL.imp[tmp];delete LOCAL.imp[tmp]}
    if(x){Object.assign(x,deServidor(r))}
   }else{
    r=await rpc('crm_cambiar',{p_token:TOKEN,p_id:op.id,d:op.d});
    const x=D.L.find(y=>y.id===op.id);if(x){const ll=x.ll,imp=x.importe;Object.assign(x,deServidor(r));if(ll)x.ll=ll;if(imp)x.importe=imp}
   }
   COLA.shift();guarda();
  }
 }catch(e){
  if(e.status===400||e.status===404){COLA.shift();guarda()} // operación imposible: se descarta para no bloquear
 }finally{enviando=false;pintaNube();if(!COLA.length)vista()}
}
function encola(op){COLA.push(op);guarda();vaciaCola()}
async function recarga(silencio){
 if(!REAL||COLA.length)return;
 try{const L=await rpc('crm_listar',{p_token:TOKEN});D.L=L.map(deServidor);guarda();if(!$('sh').classList.contains('on'))vista()}
 catch(e){if(!silencio)aviso('Sin conexión. Te enseño lo último que había.','nube')}
}
function pintaNube(){const n=$('nube');if(!n)return;n.style.display=COLA.length?'flex':'none';n.innerHTML=ic('nube')+(navigator.onLine===false?'Sin conexión: '+COLA.length+' cambio'+(COLA.length>1?'s':'')+' por enviar':'Guardando…')}
addEventListener('online',vaciaCola);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){vaciaCola();recarga(true)}});

// Acciones (iguales en los dos modos)
const A={
 crear(n){
  const o=OR(n.ok);
  if(!REAL){D.id++;const x={id:D.id,nombre:n.nombre,tel:n.tel,ok:n.ok,origen:o.n,tk:n.tk,zona:n.zona,f:hoy(),est:'nuevo',quien:D.yo,h:[{f:hoy(),q:D.yo,x:'Apuntado ('+o.n.toLowerCase()+')'}]};D.L.unshift(x);guarda();return x}
  const tmp='tmp-'+hoy(),x={id:tmp,nombre:n.nombre,tel:n.tel,ok:n.ok,origen:o.n,tk:n.tk,zona:n.zona,f:hoy(),est:'nuevo',quien:D.yo,h:[{f:hoy(),q:D.yo,x:'Apuntado ('+o.n.toLowerCase()+')'}]};
  D.L.unshift(x);encola({fn:'crear',id:tmp,d:{nombre:n.nombre,tel:n.tel,ok:n.ok,origen:o.n,tk:n.tk,zona:n.zona,quien:D.yo}});return x;
 },
 cambiar(x,cambios,evento){
  if('est' in cambios){x.est=cambios.est;if(x.est==='visita'&&!x.fv)x.fv=hoy();if(x.est==='presupuesto'&&!x.fp)x.fp=hoy();delete x.pos;if(REAL)delete LOCAL.pos[x.id];if(x.est!=='si'){delete x.rel}if(x.est!=='no'){delete x.motivo}}
  ['motivo','quien','tel','rel'].forEach(k=>{if(k in cambios)x[k]=cambios[k]});
  if(evento)x.h.push({f:hoy(),q:D.yo,x:evento});
  if(!REAL){guarda();return}
  const d=Object.assign({},cambios);if(evento)d.evento=evento;
  encola({fn:'cambiar',id:x.id,d});
 },
 importe(x,euros){ // los euros se quedan en el móvil; al servidor va el porcentaje
  x.importe=euros;const rel=D.media?Math.max(1,Math.min(2000,Math.round(euros/D.media*100))):null;
  if(REAL){LOCAL.imp[x.id]=euros}
  A.cambiar(x,{rel},rel?'Factura '+txtRel(rel):'Importe apuntado');
 },
 posponer(x,diasN){x.pos=hoy()+diasN*864e5;if(REAL)LOCAL.pos[x.id]=x.pos;guarda()},
 llamado(x,v){if(v)x.ll=v;else delete x.ll;if(REAL){if(v)LOCAL.ll[x.id]=v;else delete LOCAL.ll[x.id]}guarda()}
};

let tab='hoy',filtro='todos',q='';
const mes=()=>D.L.filter(x=>hoy()-x.f<30*864e5);

// ---------- tarjetas ----------
function card(x,conLlamar){
 const o=OR(x.ok),t=TR(x.tk),tl=String(x.tel||'').replace(/\D/g,'');
 let h='<div class="card"><div class="top" data-f="'+x.id+'"><div class="ic '+(esWeb(x)?'web':x.est==='si'?'si':x.est==='no'?'no':'')+'">'+ic(x.est==='si'?'check':x.est==='no'?'x':o.i)+'</div><div class="t"><b>'+esc(x.nombre)+'</b><small>'+esc(t.k?t.n:(x.pide||t.n))+(x.zona?' · '+esc(x.zona):'')+'</small><small>'+esc(x.origen||o.n)+' · '+cuando(x.f)+'</small>'+(x.est==='nuevo'&&diasDe(x.f)>=1?'<small class="tarde">Lleva '+(diasDe(x.f)===1?'un día':diasDe(x.f)+' días')+' esperando tu llamada</small>':'')+'</div><span class="st '+x.est+'">'+ETN[x.est]+'</span></div>';
 if(conLlamar){
  if(x.ll&&x.est==='nuevo')h+='<div class="preg"><span>¿Hablaste ya con '+esc(nombre(x))+'?</span><button class="si" data-h="'+x.id+'">Sí</button><button data-n="'+x.id+'">Aún no</button></div>';
  else if(tl)h+='<div class="acts"><a href="tel:'+tl+'" data-ll="'+x.id+'">'+ic('tel')+'Llamar</a><a class="wa" data-ll="'+x.id+'" href="https://wa.me/34'+tl.slice(-9)+'?text='+encodeURIComponent('Hola '+nombre(x)+', soy '+D.yo+' de AMS Cerramientos. ')+'" target="_blank" rel="noopener">'+WA+'WhatsApp</a></div>';
 }
 return h+'</div>';
}
function desde(x,k,txt){if(x[k])return x[k];const e=(x.h||[]).slice().reverse().find(e=>String(e.x).indexOf(txt)===0);return e?e.f:x.f}
const DIA=864e5,diasDe=t=>Math.floor((hoy()-t)/DIA);
function tocaHacer(){
 const out=[];
 D.L.forEach(x=>{
  if(x.pos&&x.pos>hoy())return;
  if(x.est==='visita'&&diasDe(desde(x,'fv','Visita hecha'))>=3)out.push({x,tipo:'vis',q:'¿Le pasaste el presupuesto a '+esc(nombre(x))+'?',d:'Fuiste a verle hace '+diasDe(desde(x,'fv','Visita hecha'))+' días.'});
  else if(x.est==='presupuesto'&&diasDe(desde(x,'fp','Presupuesto dado'))>=7)out.push({x,tipo:'pre',q:'¿Qué te dijo '+esc(nombre(x))+' del presupuesto?',d:'Se lo pasaste hace '+diasDe(desde(x,'fp','Presupuesto dado'))+' días.'});
  else if(x.est==='si'&&!x.rel&&D.media)out.push({x,tipo:'imp',q:'¿Cuánto factura el trabajo de '+esc(nombre(x))+'?',d:'La cifra se queda en tu móvil.'});
 });
 return out;
}
function cardToca(t){
 const x=t.x;let b='';
 if(t.tipo==='vis')b='<button class="si" data-tv="'+x.id+'">Sí</button><button data-tp="'+x.id+'" data-dd="2">Aún no</button>';
 if(t.tipo==='pre')b='<button class="si" data-tc="'+x.id+'">¡Contratado!</button><button data-tn="'+x.id+'">No ha salido</button><button data-tp="'+x.id+'" data-dd="7">Lo está pensando</button>';
 if(t.tipo==='imp')b='<button class="si" data-f2="'+x.id+'">Ponerlo</button>';
 return '<div class="card toca"><div class="top" data-f="'+x.id+'"><div class="ic web">'+ic(t.tipo==='imp'?'medalla':t.tipo==='pre'?'doc':'casa')+'</div><div class="t"><b class="q2">'+t.q+'</b><small>'+t.d+'</small></div></div><div class="preg botones">'+b+'</div></div>';
}
const lista=(a,txt,ico)=>a.length?a.map(x=>card(x,x.est==='nuevo')).join(''):'<div class="vacio">'+ic(ico||'cafe')+txt+'</div>';
function medalla(n){return n>=5?'¡Mes redondo!':n>=3?'Buen ritmo.':n>=1?'Ya hay uno. A por más.':'Todavía ninguno. Llegarán.'}
const buscar=x=>D.L.find(y=>String(y.id)===String(x));

// ---------- vistas ----------
function vista(){
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
 $('yo').innerHTML=ic('persona')+'Soy '+esc(D.yo);
 let h='';
 if(tab==='hoy'){
  const nuevos=D.L.filter(x=>x.est==='nuevo'),curso=D.L.filter(x=>['hablado','visita','presupuesto'].includes(x.est));
  const si=mes().filter(x=>x.est==='si');
  $('tit').textContent='Hola, '+D.yo;
  $('sub').textContent=nuevos.length?(nuevos.length===1?'Una persona espera tu llamada':nuevos.length+' personas esperan tu llamada'):'Nadie esperando. Todo al día.';
  const TH=tocaHacer();
  h='<button class="big" id="nuevo">'+ic('mas')+'Apuntar a alguien</button>'+
   (TH.length?'<h2>Toca preguntar<span class="n">'+TH.length+'</span></h2>'+TH.map(cardToca).join(''):'')+
   '<h2>Para llamar'+(nuevos.length?'<span class="n">'+nuevos.length+'</span>':'')+'</h2>'+lista(nuevos,'Nadie esperando. Los que piden presupuesto por la web aparecerán aquí solos.')+
   '<h2>En marcha'+(curso.length?'<span class="n">'+curso.length+'</span>':'')+'</h2>'+lista(curso,'Nada en marcha ahora mismo.','casa')+
   '<div class="mes"><div class="md">'+ic('medalla')+'</div><div><b>'+si.length+(si.length===1?' trabajo contratado':' trabajos contratados')+'</b><span>en los últimos 30 días. '+medalla(si.length)+'</span><button data-ir="num">Ver cómo va el mes</button></div></div>';
 }
 if(tab==='todos'){
  $('tit').textContent='Contactos';$('sub').textContent=D.L.length+' personas en total';
  const a=D.L.filter(x=>{
   if(filtro==='marcha'&&!['nuevo','hablado','visita','presupuesto'].includes(x.est))return false;
   if(filtro==='si'&&x.est!=='si')return false;
   if(filtro==='no'&&x.est!=='no')return false;
   return !q||(x.nombre+' '+(x.tel||'')+' '+(x.zona||'')+' '+(x.origen||'')).toLowerCase().includes(q.toLowerCase())});
  h='<div class="busca">'+ic('lupa')+'<input class="t" id="q" placeholder="Nombre, teléfono o pueblo" value="'+esc(q)+'"></div>'+
   '<div class="seg">'+[['todos','Todos'],['marcha','En marcha'],['si','Contratados'],['no','No salió']].map(s=>'<button data-fl="'+s[0]+'"'+(filtro===s[0]?' class="on"':'')+'>'+s[1]+'</button>').join('')+'</div>'+
   (a.length?a.map(x=>card(x,false)).join(''):'<div class="vacio">'+ic('lupa')+'No hay nadie así.</div>');
 }
 if(tab==='num'){
  $('tit').textContent='Cómo va el mes';$('sub').textContent='Últimos 30 días';
  const M=mes(),si=M.filter(x=>x.est==='si'),no=M.filter(x=>x.est==='no'),en=M.length-si.length-no.length;
  const rels=si.map(x=>x.rel).filter(Boolean),rm=rels.length?rels.reduce((a,b)=>a+b,0)/rels.length:0;
  h='<div class="frase">En los últimos 30 días han entrado <b>'+M.length+(M.length===1?' persona':' personas')+'</b>. '+(si.length?'<b>'+si.length+'</b> '+(si.length===1?'ha':'han')+' contratado':'Ninguna ha contratado todavía')+(no.length?', <b>'+no.length+'</b> no'+(en?' y <b>'+en+'</b> siguen en marcha':''):en?' y <b>'+en+'</b> siguen en marcha':'')+'.'+(si.length+no.length>=3?' De cada 10 que deciden, <b>'+Math.round(si.length/(si.length+no.length)*10)+' dicen que sí</b>.':'')+
   '<div class="gente">'+M.map(x=>'<svg class="i '+(x.est==='si'?'si':x.est==='no'?'no':'en')+'" viewBox="0 0 24 24">'+P.persona+'</svg>').join('')+'</div>'+
   '<div class="ley"><span><i style="background:var(--ok)"></i>Contratado</span><span><i style="background:#C9A227"></i>En marcha</span><span><i style="background:var(--ko)"></i>No ha salido</span></div></div>';
  if(si.length)h+='<div class="dos" style="margin-top:12px"><div><b>'+(rm?(rm>=100?'+':'')+Math.round(rm-100)+' %':'—')+'</b><span>lo que facturan tus trabajos frente a tu media</span></div><div><b>'+si.length+'</b><span>trabajos contratados. '+medalla(si.length)+'</span></div></div>';
  const rows=ORIG.filter(o=>o.k!=='web').map(o=>{const f=M.filter(x=>x.ok===o.k);return{o,n:f.length,s:f.filter(x=>x.est==='si').length}});
  [...new Set(M.filter(esWeb).map(x=>x.origen||'Web'))].forEach(og=>{const f=M.filter(x=>esWeb(x)&&(x.origen||'Web')===og);rows.push({o:{k:'web',n:og,i:'globo'},n:f.length,s:f.filter(x=>x.est==='si').length})});
  const rows2=rows.filter(r=>r.n).sort((a,b)=>b.n-a.n),mx=Math.max(1,...rows2.map(r=>r.n));
  if(rows2.length)h+='<h2>De dónde vienen</h2>'+rows2.map(r=>'<div class="fila"><div class="ic '+(r.o.k==='web'?'web':'')+'">'+ic(r.o.i)+'</div><div class="t"><b>'+esc(r.o.n)+'</b><div class="bar"><i style="width:'+Math.round(r.n/mx*100)+'%"></i></div></div><div class="n"><b>'+r.n+'</b><br>'+r.s+' sí</div></div>').join('');
  const wb=M.filter(esWeb),ot=M.filter(x=>!esWeb(x));
  h+='<h2>Internet frente a lo de siempre</h2><div class="dos"><div><b>'+wb.length+'</b><span>por la web y los anuncios<br>('+wb.filter(x=>x.est==='si').length+' han contratado)</span></div><div><b>'+ot.length+'</b><span>por buzoneo, recomendados y demás<br>('+ot.filter(x=>x.est==='si').length+' han contratado)</span></div></div>';
  const mot={};no.forEach(x=>{mot[x.motivo||'Sin motivo']=(mot[x.motivo||'Sin motivo']||0)+1});
  const mk=Object.keys(mot).sort((a,b)=>mot[b]-mot[a]);
  if(mk.length)h+='<h2>Por qué no han salido</h2>'+mk.map(m=>'<div class="fila"><div class="ic">'+ic('x')+'</div><div class="t"><b>'+esc(m)+'</b></div><div class="n"><b>'+mot[m]+'</b></div></div>').join('');
  if(D.rol==='agencia'){ // solo para nosotros: por campaña y palabra
   const C={};M.filter(x=>x.camp).forEach(x=>{const k=x.camp;C[k]=C[k]||{n:0,v:0,p:0,s:0,r:[]};C[k].n++;if(['visita','presupuesto','si'].includes(x.est))C[k].v++;if(['presupuesto','si'].includes(x.est))C[k].p++;if(x.est==='si'){C[k].s++;if(x.rel)C[k].r.push(x.rel)}});
   const ck=Object.keys(C).sort((a,b)=>C[b].n-C[a].n);
   h+='<h2>Por campaña (solo lo veis vosotros)</h2>'+(ck.length?ck.map(k=>{const c=C[k],r=c.r.length?Math.round(c.r.reduce((a,b)=>a+b,0)/c.r.length):0;return '<div class="fila"><div class="ic web">'+ic('graf')+'</div><div class="t"><b>'+esc(k)+'</b><small style="color:var(--mut);font-size:.84rem">'+c.v+(c.v===1?' visita':' visitas')+' · '+c.p+(c.p===1?' presupuesto':' presupuestos')+(r?' · valor '+r+' (100 = medio)':'')+'</small></div><div class="n"><b>'+c.n+'</b><br>'+c.s+' sí</div></div>'}).join(''):'<div class="vacio">Todavía no hay contactos con campaña.</div>');
  }
  h+='<p class="nota">'+ic('ojo')+' Tu facturación es tuya: las cifras que pones se quedan en tu móvil. Solo nos llega el porcentaje de cada trabajo frente a tu media. Con eso sabemos qué anuncios traen los mejores trabajos y dónde poner el dinero.</p>';
 }
 if(tab==='aj'){
  $('tit').textContent='Ajustes';$('sub').textContent='Se tocan una vez y ya';
  if(REAL)h='<div class="caja">'+ic('persona')+' Estás como <b>'+esc(D.yo)+'</b>. Este enlace es solo tuyo: no lo reenvíes. Para dar de alta a alguien de tu equipo, escríbenos y le mandamos el suyo.</div>';
  else h='<label class="l">¿Quién usa este móvil?</label><div class="chips">'+D.equipo.map(p=>'<button class="chip'+(p===D.yo?' on':'')+'" data-yo="'+esc(p)+'">'+ic('persona')+esc(p)+'</button>').join('')+'</div><p class="pista">Así queda apuntado quién ha hecho cada visita.</p>'+
   '<label class="l">Añadir a alguien del equipo</label><div class="linea"><input class="t" id="np" placeholder="Nombre"><button class="peq" id="npok">Añadir</button></div>';
  h+='<div class="caja" style="margin-top:22px"><b>'+ic('ojo')+' Tu facturación es solo tuya.</b><br>Pones una vez lo que facturas de media por trabajo. Después, cuando cierras un trabajo, pones lo que factura. Las cifras se quedan en este móvil: nosotros solo vemos si cada trabajo está por encima o por debajo de tu media, en porcentaje.</div>'+
   '<label class="l">Tu facturación media por trabajo (€)</label><div class="linea"><input class="t" id="med" inputmode="numeric" value="'+(D.media||'')+'"><button class="peq" id="medok">Guardar</button></div><p class="pista">Más o menos. Por ejemplo, 6.000 €. Se puede cambiar cuando quieras.</p>'+
   '<h2>Ponlo como una app en tu móvil</h2><div class="caja"><b>'+ic('movil')+' iPhone:</b> abre esta página en Safari, pulsa el botón de compartir (el cuadrado con la flecha hacia arriba) y elige «Añadir a pantalla de inicio».<br><br><b>'+ic('movil')+' Android:</b> abre esta página en Chrome, pulsa los tres puntos de arriba a la derecha y elige «Añadir a pantalla de inicio».<br><br>Te queda un icono de AMS como cualquier otra app.</div>'+
   '<h2>Ayuda</h2><button class="peq" id="guia" style="width:100%">Ver otra vez la explicación</button>'+
   (REAL?'':'<h2>Demostración</h2><button class="peq" id="rst" style="width:100%">Volver a los datos de ejemplo</button>');
 }
 $('v').innerHTML=h;enlaza();
}
function enlaza(){
 document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>ficha(b.dataset.f));
 document.querySelectorAll('[data-ll]').forEach(a=>a.addEventListener('click',()=>{const x=buscar(a.dataset.ll);if(x){A.llamado(x,hoy());setTimeout(vista,800)}}));
 document.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{const x=buscar(b.dataset.h);A.llamado(x,0);A.cambiar(x,{est:'hablado'},'Ya hemos hablado');vibra();aviso('Apuntado: ya habéis hablado','check');vista()});
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{const x=buscar(b.dataset.n);A.llamado(x,0);vista()});
 document.querySelectorAll('[data-tv]').forEach(b=>b.onclick=()=>{const x=buscar(b.dataset.tv);A.cambiar(x,{est:'presupuesto'},'Presupuesto dado');vibra();aviso('Apuntado: presupuesto dado','check');vista()});
 document.querySelectorAll('[data-tp]').forEach(b=>b.onclick=()=>{const x=buscar(b.dataset.tp);A.posponer(x,+b.dataset.dd);aviso('Vale, te vuelvo a preguntar en '+b.dataset.dd+' días','check');vista()});
 document.querySelectorAll('[data-tc]').forEach(b=>b.onclick=()=>{const x=buscar(b.dataset.tc);A.cambiar(x,{est:'si'},'Contratado');vibra();fiesta();const n=mes().filter(y=>y.est==='si').length;aviso('¡Enhorabuena, '+D.yo+'! '+(n===1?'Primer trabajo del mes.':'Ya van '+n+' este mes.'),'medalla');vista();ficha(x.id)});
 document.querySelectorAll('[data-tn]').forEach(b=>b.onclick=()=>{const x=buscar(b.dataset.tn);A.cambiar(x,{est:'no'},'No ha salido');vibra();vista();ficha(x.id)});
 document.querySelectorAll('[data-f2]').forEach(b=>b.onclick=()=>ficha(b.dataset.f2));
 document.querySelectorAll('[data-ir]').forEach(b=>b.onclick=()=>{tab=b.dataset.ir;vista();scrollTo(0,0)});
 document.querySelectorAll('[data-fl]').forEach(b=>b.onclick=()=>{filtro=b.dataset.fl;vista()});
 document.querySelectorAll('[data-yo]').forEach(b=>b.onclick=()=>{D.yo=b.dataset.yo;guarda();vista()});
 const n=$('nuevo');if(n)n.onclick=nuevo;
 const qi=$('q');if(qi)qi.oninput=()=>{q=qi.value;const p=qi.selectionStart;vista();const z=$('q');z.focus();z.setSelectionRange(p,p)};
 if($('npok'))$('npok').onclick=()=>{const v=$('np').value.trim();if(v&&!D.equipo.includes(v)){D.equipo.push(v);guarda();aviso(v+' ya está en el equipo','check');vista()}};
 if($('medok'))$('medok').onclick=()=>{D.media=+$('med').value.replace(/\D/g,'')||0;guarda();aviso('Guardado en este móvil. Solo lo ves tú.','check')};
 if($('guia'))$('guia').onclick=()=>{tour(0)};
 if($('rst'))$('rst').onclick=()=>{const t=D.tour;D=demo();D.tour=t;guarda();aviso('Datos de ejemplo recuperados','check');vista()};
}

// ---------- hoja ----------
function abre(h){$('pan').innerHTML=h;$('sh').classList.add('on');document.body.style.overflow='hidden';$('pan').scrollTop=0;const c=$('cx');if(c)c.onclick=cierra}
function cierra(){$('sh').classList.remove('on');document.body.style.overflow=''}
$('sh').onclick=e=>{if(e.target.id==='sh')cierra()};
const cab=(t,s)=>'<div class="cab"><div><h3>'+t+'</h3>'+(s?'<p class="sub">'+s+'</p>':'')+'</div><button class="x" id="cx">'+ic('x')+'</button></div>';
function chips(id,ops,sel){return '<div class="chips" id="'+id+'">'+ops.map(o=>'<button type="button" class="chip'+(o===sel?' on':'')+'" data-v="'+esc(o)+'">'+esc(o)+'</button>').join('')+'</div>'}
function chipsVivos(id,fn){document.querySelectorAll('#'+id+' .chip').forEach(c=>c.onclick=()=>{document.querySelectorAll('#'+id+' .chip').forEach(o=>o.classList.remove('on'));c.classList.add('on');if(fn)fn(c.dataset.v)})}
$('yo').onclick=()=>{
 if(REAL){abre(cab('Eres '+esc(D.yo),'Este enlace es solo tuyo.')+'<p class="pista" style="margin-top:12px">Si este móvil lo usa otra persona del equipo, que abra su propio enlace.</p>');return}
 abre(cab('¿Quién eres?','Para apuntar quién hace cada cosa.')+'<div style="margin-top:14px">'+chips('qy',D.equipo,D.yo)+'</div><p class="pista">Si falta alguien, se añade en Ajustes.</p>');chipsVivos('qy',v=>{D.yo=v;guarda();cierra();vista()})};
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;vista();scrollTo(0,0)});

// ---------- apuntar a alguien (paso a paso) ----------
function nuevo(){
 const N={nombre:'',ok:'',tk:'',tel:'',zona:''};let paso=0;
 function puntos(){return '<div class="puntos">'+[0,1,2,3].map(i=>'<i'+(i===paso?' class="on"':'')+'></i>').join('')+'</div>'}
 function pinta(){
  let h=cab(paso?'<button class="volver" id="atras">'+ic('atras')+'Atrás</button>':'Apuntar a alguien','');
  h+=puntos();
  if(paso===0)h+='<p class="q">¿Cómo se llama?</p><p class="por">Con el nombre de pila vale.</p><input class="t" id="w1" value="'+esc(N.nombre)+'" autocomplete="off" placeholder="Por ejemplo, Marta"><p class="pista">'+ic('mic')+'Puedes dictarlo con el micrófono del teclado.</p><button class="big" id="sig" style="margin-top:22px">Siguiente</button>';
  if(paso===1)h+='<p class="q">¿Cómo te ha llegado?</p><p class="por">Esto es lo que más nos ayuda. Toca uno.</p><div class="tiles">'+ORIG.map(o=>'<button class="tile'+(N.ok===o.k?' on':'')+'" data-o="'+o.k+'">'+ic(o.i)+esc(o.n)+'</button>').join('')+'</div>';
  if(paso===2)h+='<p class="q">¿Qué quiere?</p><p class="por">Más o menos. Se puede cambiar luego.</p><div class="tiles">'+TRAB.map(t=>'<button class="tile'+(N.tk===t.k?' on':'')+'" data-tk="'+t.k+'">'+ic(t.i)+esc(t.n)+'</button>').join('')+'</div>';
  if(paso===3)h+='<p class="q">Teléfono y pueblo</p><p class="por">Si no lo tienes a mano, déjalo vacío. Se puede poner después.</p><label class="l">Teléfono</label><input class="t" id="w4" inputmode="tel" value="'+esc(N.tel)+'" autocomplete="off"><label class="l">Pueblo</label><input class="t" id="w5" value="'+esc(N.zona)+'" autocomplete="off"><button class="big verde" id="fin" style="margin-top:24px">'+ic('check')+'Guardar</button>';
  abre(h);
  if($('atras'))$('atras').onclick=()=>{paso--;pinta()};
  if(paso===0){const i=$('w1');setTimeout(()=>i.focus(),50);const ok=()=>{N.nombre=i.value.trim();if(!N.nombre){i.focus();i.style.borderColor='var(--ko)';return}paso=1;pinta()};$('sig').onclick=ok;i.onkeydown=e=>{if(e.key==='Enter')ok()}}
  if(paso===1)document.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{N.ok=b.dataset.o;vibra();paso=2;pinta()});
  if(paso===2)document.querySelectorAll('[data-tk]').forEach(b=>b.onclick=()=>{N.tk=b.dataset.tk;vibra();paso=3;pinta()});
  if(paso===3){$('w4').oninput=()=>N.tel=$('w4').value;$('w5').oninput=()=>N.zona=$('w5').value;$('fin').onclick=()=>{
   N.tel=$('w4').value.trim();N.zona=$('w5').value.trim();
   A.crear(N);vibra();
   abre('<div class="okgrande"><div class="ci">'+ic('check')+'</div><h3>¡Apuntado!</h3><p class="sub">'+esc(N.nombre)+' ya está en tu lista. Cuando le llames o vayas a verle, tócalo y marca cómo va.</p><button class="big" id="cx" style="margin-top:22px">Vale</button></div>');
   $('cx').onclick=()=>{cierra();tab='hoy';vista();scrollTo(0,0)};tab='hoy';vista();
  }}
 }
 pinta();
}

// ---------- ficha ----------
function ficha(id){
 const x=buscar(id);if(!x)return;
 const orden=['nuevo','hablado','visita','presupuesto'];
 function pinta(){
  const o=OR(x.ok),t=TR(x.tk),tl=String(x.tel||'').replace(/\D/g,'');
  const idx=orden.indexOf(x.est),cerrado=x.est==='si'||x.est==='no';
  let h=cab('¿Cómo va con '+esc(nombre(x))+'?',esc(t.k?t.n:'')+(x.zona?(t.k?' · ':'')+esc(x.zona):'')+(t.k||x.zona?' · ':'')+'entró '+cuando(x.f));
  h+='<div class="caja" style="margin-top:8px">'+ic(o.i)+' <b>'+esc(x.origen||o.n)+'</b>'+(x.pide?'<br>Pide: '+esc(x.pide):'')+'</div>';
  if(tl)h+='<div class="acts"><a href="tel:'+tl+'">'+ic('tel')+'Llamar</a><a class="wa" href="https://wa.me/34'+tl.slice(-9)+'?text='+encodeURIComponent('Hola '+nombre(x)+', soy '+D.yo+' de AMS Cerramientos. ')+'" target="_blank" rel="noopener">'+WA+'WhatsApp</a></div>';
  else h+='<label class="l">Teléfono</label><div class="linea"><input class="t" id="ftel" inputmode="tel" placeholder="Si lo tienes"><button class="peq" id="ftelok">Guardar</button></div>';
  h+='<label class="l">Marca lo que ya has hecho</label>';
  PASOS.forEach((p,i)=>{const k=i+1;const hecho=cerrado||idx>=k,sig=!cerrado&&idx===k-1;
   h+='<button class="paso'+(hecho?' hecho':sig?' sig':'')+'" data-p="'+p.k+'"><div class="ic">'+ic(hecho?'check':p.i)+'</div><div><b>'+p.n+'</b><small>'+p.d+'</small></div>'+(sig?'<span class="tag">Siguiente</span>':'')+'</button>'});
  h+='<label class="l">¿Y al final?</label><div class="fin"><button class="si'+(x.est==='si'?' on':'')+'" data-fin="si">'+ic('check')+'¡Contratado!</button><button class="no'+(x.est==='no'?' on':'')+'" data-fin="no">'+ic('x')+'No ha salido</button></div>';
  if(x.est==='si'){
   if(D.media)h+='<div class="caja ok"><label class="l" style="margin-top:0">¿Cuánto factura este trabajo? (€)</label><div class="linea"><input class="t" id="fimp" inputmode="numeric" value="'+(x.importe||'')+'"><button class="peq" id="fimpok">Guardar</button></div><p class="pista" id="fmed" style="color:#14532D"></p></div>';
   else h+='<div class="caja ok">'+(x.rel?'Este trabajo está '+txtRel(x.rel)+'.':'Para apuntar lo que factura, pon antes tu facturación media en Ajustes (o que lo apunte Javi desde su móvil).')+'</div>';
  }
  if(x.est==='no')h+='<div class="caja av"><label class="l" style="margin-top:0">¿Por qué no?</label>'+chips('fmot',MOT,x.motivo||'')+'</div>';
  if(D.equipo.length>1)h+='<label class="l">¿Quién lo lleva?</label>'+chips('fq',D.equipo,x.quien||'');
  h+='<label class="l">Apuntar algo</label><textarea class="t" id="fnt" placeholder="Ej.: chalet, 8 ventanas viejas, lo quieren antes de Navidad"></textarea><p class="pista">'+ic('mic')+'O díctalo con el micrófono del teclado.</p><button class="big gris" id="fntok" style="margin-top:10px">Guardar la nota</button>';
  h+='<h2>Lo que ha pasado</h2><div class="hist">'+x.h.slice().reverse().map(e=>'<div>'+esc(e.x)+'<small>'+fecha(e.f)+' · '+esc(e.q)+'</small></div>').join('')+'</div>';
  abre(h);
  document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const k=b.dataset.p,i=orden.indexOf(k);
   if(x.est===k)A.cambiar(x,{est:orden[i-1]},'Vuelve a «'+ETN[orden[i-1]]+'»');else A.cambiar(x,{est:k},ETN[k]);
   A.llamado(x,0);vibra();aviso('Guardado','check');pinta();vista()});
  document.querySelectorAll('[data-fin]').forEach(b=>b.onclick=()=>{const k=b.dataset.fin;
   if(x.est===k){A.cambiar(x,{est:'presupuesto'},'Vuelve a «Presupuesto dado»');pinta();vista();return}
   A.cambiar(x,{est:k},k==='si'?'Contratado':'No ha salido');A.llamado(x,0);vibra();
   if(k==='si'){fiesta();const n=mes().filter(y=>y.est==='si').length;aviso('¡Enhorabuena, '+D.yo+'! '+(n===1?'Primer trabajo del mes.':'Ya van '+n+' este mes.'),'medalla')}else aviso('Apuntado. Dinos por qué, si lo sabes.');
   pinta();vista();const f=$(k==='si'?'fimp':'fmot');if(f){f.scrollIntoView({block:'center',behavior:'smooth'});if(k==='si'&&!x.importe)setTimeout(()=>f.focus(),350)}});
  if($('fimp')){const m=()=>{const v=+$('fimp').value.replace(/\D/g,'');$('fmed').textContent=v&&D.media?'Está '+txtRel(Math.round(v/D.media*100))+'. Nosotros solo vemos ese porcentaje, no la cifra.':'La cifra se queda en tu móvil.'};$('fimp').oninput=m;m();$('fimpok').onclick=()=>{const v=+$('fimp').value.replace(/\D/g,'');if(!v)return;A.importe(x,v);vibra();aviso('Guardado. La cifra solo la ves tú.','check');vista()}}
  if($('fmot'))chipsVivos('fmot',v=>{A.cambiar(x,{motivo:v},'Motivo: '+v.toLowerCase());vibra();aviso('Guardado','check');vista()});
  if($('fq'))chipsVivos('fq',v=>{A.cambiar(x,{quien:v});vibra();aviso('Lo lleva '+v,'check')});
  if($('ftelok'))$('ftelok').onclick=()=>{const v=$('ftel').value.trim();if(!v)return;A.cambiar(x,{tel:v});pinta();vista()};
  $('fntok').onclick=()=>{const v=$('fnt').value.trim();if(!v)return;A.cambiar(x,{},v);vibra();aviso('Nota guardada','check');pinta()};
 }
 pinta();
}

// ---------- explicación inicial ----------
function tour(i){
 const S=[
  {i:'lapiz',t:'Apunta a cada persona que te pide presupuesto',p:'Nombre y de dónde viene. Diez segundos. Los que entran por la web se apuntan solos.'},
  {i:'check',t:'Después de cada visita, marca cómo va',p:'Un toque: visita hecha, presupuesto dado, contratado. Sin escribir nada.'},
  {i:'graf',t:'El móvil hace los números por ti',p:'Y nosotros sabemos qué anuncios te traen trabajo. Tu facturación no la vemos: solo porcentajes.'}
 ];
 if(!REAL)S.push({i:'persona',t:'¿Quién va a usar este móvil?',p:'Para que quede apuntado quién hace cada cosa.'});
 const u=S.length-1,s=S[i],T=$('tour');
 T.innerHTML='<button class="saltar" id="saltar">Saltar</button><div class="il">'+ic(s.i)+'</div><h3>'+s.t+'</h3><p>'+s.p+'</p>'+(!REAL&&i===u?'<div class="chips">'+D.equipo.map(p=>'<button class="chip'+(p===D.yo?' on':'')+'" data-v="'+esc(p)+'">'+esc(p)+'</button>').join('')+'</div>':'')+'<div class="puntos">'+S.map((_,k)=>'<i'+(k===i?' class="on"':'')+'></i>').join('')+'</div><button class="big" id="tsig">'+(i===u?'Empezar':'Siguiente')+'</button>';
 T.classList.add('on');
 const fin=()=>{D.tour=1;guarda();T.classList.remove('on');vista()};
 $('saltar').onclick=fin;
 $('tsig').onclick=()=>{if(i<u)tour(i+1);else fin()};
 T.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{T.querySelectorAll('.chip').forEach(o=>o.classList.remove('on'));c.classList.add('on');D.yo=c.dataset.v;guarda()});
}

// ---------- arranque ----------
function sinAcceso(msg){
 $('v').innerHTML='<div class="okgrande"><div class="ci" style="background:var(--am);color:var(--or)">'+ic('llave')+'</div><h3>'+msg+'</h3><p class="sub">Ábrela desde el enlace personal que te hemos mandado por WhatsApp o por correo. Si no lo encuentras, escríbenos y te lo volvemos a mandar.</p></div>';
 $('tit').textContent='Tus contactos';$('sub').textContent='';document.querySelector('nav').style.display='none';$('yo').style.display='none';
}
async function arranca(){
 if(!REAL){let d=lsg(K,null);D=d&&d.L?d:demo();vista();if(!D.tour)tour(0);return}
 const m=location.hash.match(/k=([A-Za-z0-9_-]{20,})/);
 TOKEN=m?m[1]:(lsg(K+'-token','')||'');
 if(!TOKEN){sinAcceso('Esta página es privada');return}
 lss(K+'-token',TOKEN);
 const copia=lsg(K+'-copia',null);
 D={yo:copia?copia.yo:'',equipo:copia?copia.equipo:[],rol:copia?copia.rol:'',media:LOCAL.media||0,tour:LOCAL.tour||0,L:copia?copia.L:[]};
 if(copia){vista()}else{$('v').innerHTML='<div class="vacio">'+ic('nube')+'Cargando tus contactos…</div>'}
 try{
  const yo=await rpc('crm_yo',{p_token:TOKEN});
  if(!yo.ok){try{localStorage.removeItem(K+'-token');localStorage.removeItem(K+'-copia')}catch(e){}sinAcceso('Este enlace ya no vale');return}
  D.yo=yo.nombre;D.rol=yo.rol;D.equipo=yo.equipo||[yo.nombre];
  if(!COLA.length){const L=await rpc('crm_listar',{p_token:TOKEN});D.L=L.map(deServidor)}
  guarda();vista();vaciaCola();
  if(!D.tour)tour(0);
 }catch(e){
  if(copia){aviso('Sin conexión. Te enseño lo último que había.','nube')}
  else $('v').innerHTML='<div class="vacio">'+ic('nube')+'No hay conexión ahora mismo. Prueba en un momento.</div>';
 }
 setInterval(()=>{if(document.visibilityState==='visible'){vaciaCola();recarga(true)}},60000);
}
arranca();
})();
