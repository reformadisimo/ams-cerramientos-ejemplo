(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]})}
// Datos inventados. w: peso de cada tipo de toque [contacto,boton,enlace,campo,foto,titular,menu,aire]
var PAGES=[
 {p:'/',n:'Portada',v:96,baja:38,fuera:58,s10:31,act:21,via:{ads:44,google:26,directo:18,redes:12},sig:[['/ventanas-pvc',30],['/configurador',22],['/contacto',18]],w:[7,10,12,0,14,9,10,6],cr:7},
 {p:'/ventanas-pvc',n:'Ventanas de PVC',v:61,baja:55,fuera:44,s10:18,act:38,via:{ads:30,google:50,directo:12,redes:8},sig:[['/configurador',34],['/contacto',22],['/cerramientos-terrazas',8]],w:[9,8,10,0,26,8,6,5],cr:9},
 {p:'/blog/pvc-o-aluminio',n:'Blog: PVC o aluminio',v:48,baja:22,fuera:100,s10:41,act:9,via:{ads:2,google:92,directo:4,redes:2},sig:[],w:[2,3,10,0,10,8,6,4],cr:2},
 {p:'/cerramientos-terrazas',n:'Cerramientos de terraza',v:44,baja:48,fuera:47,s10:22,act:33,via:{ads:38,google:34,directo:10,redes:18},sig:[['/contacto',27],['/configurador',16],['/ventanas-pvc',10]],w:[8,10,10,0,12,7,6,5],cr:8},
 {p:'/contacto',n:'Contacto',v:31,baja:62,fuera:35,s10:10,act:44,via:{ads:36,google:30,directo:26,redes:8},sig:[['/',20],['/ventanas-pvc',45]],w:[28,6,4,12,2,5,6,4],cr:28},
 {p:'/configurador',n:'Configurador',v:27,baja:70,fuera:37,s10:7,act:71,via:{ads:48,google:22,directo:20,redes:10},sig:[['/contacto',44],['/',19]],w:[10,22,4,18,2,6,6,4],cr:12},
 {p:'/cancelas-puertas',n:'Cancelas y puertas',v:33,baja:12,fuera:70,s10:49,act:11,via:{ads:6,google:64,directo:14,redes:16},sig:[['/contacto',20],['/',10]],w:[5,6,8,0,18,10,8,6],cr:5}
];
var DIAS={7:.27,28:1,90:3.2},DISP={movil:1,pc:.45};
var S={dias:28,disp:'movil',fuente:'todas',pg:0,capas:{calor:1,vano:1,baja:1},notas:[],senal:false,pin:null,taps:null,doc:null,n:0};
function rng(seed){var a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function fac(p){var f=DIAS[S.dias]*DISP[S.disp];if(S.fuente!=='todas')f*=p.via[S.fuente]/100;return f}
function vistas(p){return Math.round(p.v*fac(p))}
function totales(){var v=0,t=0;PAGES.forEach(function(p){v+=vistas(p)});return v}
function visitas(){return Math.max(1,Math.round(totales()/1.5))}
function ppv(){return totales()/visitas()}
function alcanza(p,pct){var L=p.baja/Math.LN2;return Math.max(.1,100*Math.exp(-pct/L))}
function final(p){return alcanza(p,100)}
function fmt(n){return String(n).replace('.',',')}
// ---- conclusiones, con reglas fijas
function conclusiones(){
 var c=[],i,p,v;
 PAGES.forEach(function(p){v=vistas(p);if(v<8)return;
  if(p.fuera>=85)c.push({s:3,pg:p,t:'En '+p.p+' se va de la web el '+p.fuera+' % de quien la ve.',x:'Llegan desde Google a leer el artículo y se van: pon arriba, antes del texto, una invitación clara a ver ventanas o a pedir la visita gratuita.'});
  if(p.baja<=15)c.push({s:3,pg:p,t:'En '+p.p+' casi nadie baja: la mitad de la gente no pasa del '+p.baja+' % de la página.',x:'Lo importante (qué ofrecéis, precio, cómo contactar) tiene que estar en la primera pantalla. Lo de abajo, más corto.'});
  if(p.s10>=45)c.push({s:2,pg:p,t:'En '+p.p+' el '+p.s10+' % de la gente se va en menos de 10 segundos.',x:'No encuentran enseguida lo que buscaban. Revisa el titular y la primera imagen: tienen que decir en un vistazo de qué va la página.'});
 });
 // toques que no hacen nada: la foto de ventanas
 c.push({s:3,pg:PAGES[1],t:'En /ventanas-pvc mucha gente toca las fotos creyendo que se abren y no pasa nada.',x:'Haz que las fotos se amplíen al tocarlas, o que lleven a la ventana que enseñan. Es gente interesada que se queda con las ganas.'});
 if(ppv()<=1.6)c.push({s:2,pg:PAGES[0],t:'Casi todo el mundo ve una sola página ('+fmt(ppv().toFixed(1))+' páginas por visita de media): entra, mira y se va.',x:'La página por la que entran tiene que llevarles a la siguiente: ventanas, cuánto cuesta o la visita gratuita, bien visibles.'});
 var best=null;PAGES.forEach(function(p){if(vistas(p)>=8&&(!best||p.cr>best.cr))best=p});
 if(best)c.push({s:1,pg:best,t:'Donde más se pulsa WhatsApp, llamar o el formulario es '+best.p+': '+best.cr+' toques de contacto por cada 100 vistas.',x:'Es la página que mejor convierte: llévale tráfico (enlaces desde otras páginas, anuncios) y copia lo que funciona en las demás.'});
 c.sort(function(a,b){return b.s-a.s});return c}
function pintaConc(){
 var c=conclusiones(),n=visitas(),tag=n<100?'Pistas':n<1000?'Tendencias':'Firmes';
 var txt=n<100?'Con '+n+' visitas son solo pistas. Hacia las 1.000 serán tendencias firmes.':n<1000?'Con '+n+' visitas ya son tendencias. A partir de 1.000 serán firmes.':'Con '+n+' visitas ya son firmes.';
 var col={3:'#d64545',2:'#b8903a',1:'#2f9e5b'};
 $('lp-conc').innerHTML='<div class="lp-conc-top"><b>Conclusiones</b><span class="lp-tag">'+tag+'</span><button type="button" class="lp-ver" id="lp-ver" aria-expanded="'+($('lp-conc').classList.contains('abierto'))+'">'+($('lp-conc').classList.contains('abierto')?'Ocultar':'Ver las '+c.length)+'</button><span style="font-size:.85rem;color:#5B6B78;flex:1;min-width:160px">'+txt+'</span><span class="lp-barfia"><i><u style="width:'+Math.min(100,n/10)+'%"></u></i>'+n+' de 1.000</span></div><div class="lp-lista">'+c.map(function(x,i){return '<div class="lp-c"><b><i style="background:'+col[x.s]+'"></i><span>'+esc(x.t)+'</span></b><p>'+esc(x.x)+'</p><a data-pg="'+PAGES.indexOf(x.pg)+'">Verlo en la web</a></div>'}).join('')+'</div>';
 $('lp-ver').onclick=function(){$('lp-conc').classList.toggle('abierto');pintaConc()};
 [].forEach.call(document.querySelectorAll('.lp-c a'),function(a){a.onclick=function(){setPg(+a.getAttribute('data-pg'));$('lp-centro').scrollIntoView({block:'start'})}});
 $('lp-sub').innerHTML='<b>'+n+'</b> visitas · <b>'+totales()+'</b> páginas vistas · <b>'+fmt(ppv().toFixed(1))+'</b> páginas por visita · <b>22 s</b> activos por visita (mediana) · solo quien acepta cookies de analítica'}
// ---- lista de páginas
function pintaLista(){
 var mx=Math.max.apply(null,PAGES.map(vistas));
 var o=PAGES.map(function(p,i){return {p:p,i:i,v:vistas(p)}}).sort(function(a,b){return b.v-a.v});
 $('lp-pgs').innerHTML=o.map(function(x){return '<button type="button" class="lp-pg'+(x.i===S.pg?' on':'')+'" data-i="'+x.i+'"><div><span>'+esc(x.p.n)+'</span><span>'+x.v+'</span></div><i><u style="width:'+Math.round(100*x.v/mx)+'%"></u></i><small>bajan '+x.p.baja+' % · se van aquí '+x.p.fuera+' %</small></button>'}).join('');
 [].forEach.call(document.querySelectorAll('.lp-pg'),function(b){b.onclick=function(){setPg(+b.getAttribute('data-i'))}})}
// ---- panel derecho
function pintaPanel(){
 if($('lp-nt')){S.nt=$('lp-nt').value;S.aut=$('lp-aut').value}
 var p=PAGES[S.pg],v=vistas(p),t=S.taps||[];
 var cont={},vano={};
 t.forEach(function(x){var m=x.dead?vano:cont;m[x.lab]=(m[x.lab]||0)+1});
 function top(m,k){return Object.keys(m).map(function(a){return [a,m[a]]}).sort(function(a,b){return b[1]-a[1]}).slice(0,k)}
 function filas(a){return a.length?a.map(function(x){return '<div class="lp-fila"><span>'+esc(x[0])+'</span><span>'+x[1]+'</span></div>'}).join(''):'<div class="lp-fila"><span>Nada destacable</span><span></span></div>'}
 var via=[['Anuncio de Google','ads'],['Google normal','google'],['Directo','directo'],['Instagram y Facebook','redes']];
 var sig=p.sig.map(function(x){var i=PAGES.map(function(q){return q.p}).indexOf(x[0]);return '<div class="lp-fila btn" data-i="'+i+'"><span>'+esc(i>=0?PAGES[i].n:x[0])+'</span><span>'+x[1]+' %</span></div>'}).join('')+'<div class="lp-fila"><span>Se van de la web</span><span>'+p.fuera+' %</span></div>';
 var clar={rabia:Math.round(v*.04),sinresp:Math.round(v*.09),atras:Math.round(v*.07)};
 $('lp-der').innerHTML='<h2>Esta página</h2><p style="margin:0 0 10px;font-weight:700;font-size:1.1rem">'+esc(p.n)+'</p>'
 +'<div class="lp-cifras"><div class="lp-n"><b>'+v+'</b><span>vistas</span></div><div class="lp-n"><b>'+p.baja+' %</b><span>bajan (mediana)</span></div><div class="lp-n"><b>'+fmt(final(p).toFixed(final(p)<10?1:0))+' %</b><span>llegan al final</span></div><div class="lp-n"><b>'+p.act+' s</b><span>activos (mediana)</span></div><div class="lp-n"><b>'+p.s10+' %</b><span>se van en menos de 10&nbsp;segundos</span></div><div class="lp-n"><b>'+p.fuera+' %</b><span>se van de la web aquí</span></div></div>'
 +'<h3>Microsoft Clarity (ejemplo)</h3><div class="lp-fila"><span>Clics en algo que no responde</span><span>'+clar.sinresp+'</span></div><div class="lp-fila"><span>Clics de rabia</span><span>'+clar.rabia+'</span></div><div class="lp-fila"><span>Vuelven atrás enseguida</span><span>'+clar.atras+'</span></div>'
 +'<h3>Lo más tocado</h3>'+filas(top(cont,5))+'<h3>Tocan y no pasa nada</h3>'+filas(top(vano,4))
 +'<h3>De dónde vienen</h3>'+via.map(function(x){return '<div class="lp-fila"><span>'+x[0]+'</span><span>'+p.via[x[1]]+' %</span></div>'}).join('')
 +'<h3>Adónde van después</h3>'+sig
 +'<div class="lp-nota"><h3>Una nota para nosotros</h3><p style="margin:0 0 8px;font-size:.82rem;color:#5B6B78">Escribe qué quieres cambiar y, si quieres, señala el sitio exacto en el móvil. Así lo vemos tal cual lo ves tú.</p><select class="lp-sel" id="lp-aut" aria-label="Quién escribe"><option>Javi</option><option>Ignacio</option></select><textarea id="lp-nt" placeholder="Por ejemplo: aquí quiero un botón de WhatsApp más grande" aria-label="Qué quieres cambiar"></textarea><button type="button" id="lp-sen">'+(S.senal?'Toca ahora en el móvil...':'Señalar un sitio en la página')+'</button><button type="button" class="pri" id="lp-gua">Guardar nota</button><p style="margin:6px 0 0;font-size:.78rem;color:#5B6B78">En esta demostración la nota no se envía a nadie. Con tu web conectada, nos llega por correo con la página y el sitio exacto.</p><ul class="lp-nl" id="lp-nl"></ul></div>';
 [].forEach.call(document.querySelectorAll('.lp-fila.btn'),function(e){e.onclick=function(){var i=+e.getAttribute('data-i');if(i>=0)setPg(i)}});
 $('lp-nt').value=S.nt||'';if(S.aut)$('lp-aut').value=S.aut;
 $('lp-sen').onclick=function(){S.senal=!S.senal;pintaPanel();aplicaSenal()};
 $('lp-gua').onclick=guardaNota;pintaNotas()}
function pintaNotas(){
 var l=S.notas.filter(function(n){return n.pg===S.pg});var cnt=0;
 $('lp-nl').innerHTML=l.map(function(n,i){return '<li class="'+(n.ok?'hecha':'')+'"><span>'+(n.pin&&n.disp===S.disp?'('+(++cnt)+') ':'')+esc(n.autor)+' ['+(n.disp==='pc'?'ordenador':'móvil')+']'+': '+esc(n.t)+'</span><button type="button" data-n="'+S.notas.indexOf(n)+'" style="margin:0">'+(n.ok?'Reabrir':'Hecha')+'</button></li>'}).join('');
 [].forEach.call(document.querySelectorAll('#lp-nl button'),function(b){b.onclick=function(){var n=S.notas[+b.getAttribute('data-n')];n.ok=!n.ok;pintaNotas();dibuja()}})}
function guardaNota(){var t=$('lp-nt').value.trim();if(!t){$('lp-nt').focus();return}
 S.notas.push({pg:S.pg,disp:S.disp,t:t,autor:$('lp-aut').value,pin:S.pin,ok:false});$('lp-nt').value='';S.pin=null;S.senal=false;S.nt='';pintaPanel();dibuja()}
// ---- marco y capas
function lab(el){if(!el)return 'Zona sin nada';var t=(el.getAttribute('aria-label')||el.alt||el.textContent||'').replace(/\s+/g,' ').trim();if(el.tagName==='IMG')t=(el.alt||'').slice(0,20);
 var pre={IMG:'Foto',H1:'Titular',H2:'Titular',INPUT:'Campo',SELECT:'Campo',TEXTAREA:'Campo'}[el.tagName]||'';
 t=t.slice(0,26);return (pre?pre+(t?': ':''):'')+(t||(pre?'':(el.tagName==='A'?'Enlace':el.tagName==='BUTTON'?'Botón':el.tagName.toLowerCase())))}
var SEL=['a[href^="tel:"],a[href*="wa.me"],.btn-call,.btn-quote','a.b1,a.btn,button,.cta a','main a,article a,footer a','input,select,textarea','main img,article img,section img','h1,h2','header summary,header button,.menu-toggle,header a'];
function tomaTaps(doc){
 var p=PAGES[S.pg],n=Math.min(650,Math.round(vistas(p)*2.4)),r=rng(S.pg*97+(S.disp==='pc'?7:1)),W=doc.documentElement.clientWidth,H=Math.max(doc.documentElement.scrollHeight,doc.body.scrollHeight);
 var sc=doc.defaultView.pageYOffset||0,grupos=SEL.map(function(s){var out=[];[].forEach.call(doc.querySelectorAll(s),function(e){if(e.closest&&e.closest('#lp-ov'))return;var b=e.getBoundingClientRect();if(b.width<8||b.height<8)return;var cs=doc.defaultView.getComputedStyle(e);if(cs.position==='fixed')return;out.push({e:e,x:b.left,y:b.top+sc,w:b.width,h:b.height})});return out});
 var w=p.w.slice(),tot=0,i;for(i=0;i<7;i++){if(!grupos[i].length)w[i]=0}for(i=0;i<8;i++)tot+=w[i];
 var dead=[0,0,0,0,1,1,0,1],t=[];
 function pick(){var q=r()*tot,k=0;for(;k<8;k++){q-=w[k];if(q<=0)break}return Math.min(k,7)}
 for(var j=0;j<n;j++){var k=pick(),x,y,lb,d=!!dead[k];
  if(k===7){x=r();var u;do{u=r()}while(r()>alcanza(p,u*100)/100);y=Math.min(H-5,u*H);lb='Zona sin nada'}
  else{var g=grupos[k],o,ok=0,tr=0;do{o=g[Math.floor(r()*g.length)];tr++;ok=r()<Math.max(.06,alcanza(p,Math.min(100,(o.y+o.h/2)/H*100))/100)}while(!ok&&tr<12);x=Math.min(.98,Math.max(.02,(o.x+o.w*(.5+(r()-.5)*.7))/W));y=o.y+o.h*(.5+(r()-.5)*.7);lb=lab(o.e)}
  t.push({x:x,y:y,dead:d,k:k,lab:lb})}
 [0,2].forEach(function(gk){grupos[gk].slice(0,60).forEach(function(o){var pc=Math.min(100,(o.y+o.h/2)/H*100),n2=Math.max(1,Math.round(alcanza(p,pc)/100*(gk===0?3:2)));for(var z=0;z<n2;z++)t.push({x:Math.min(.98,Math.max(.02,(o.x+o.w*(.5+(r()-.5)*.6))/W)),y:o.y+o.h*(.5+(r()-.5)*.6),dead:false,k:gk,lab:lab(o.e)})})});
 return t}
function ocultaFijos(doc){[].forEach.call(doc.querySelectorAll('body *'),function(e){if(e.id==='lp-ov'||(e.closest&&e.closest('#lp-ov')))return;var cs=doc.defaultView.getComputedStyle(e);if(cs.position==='fixed')e.style.setProperty('display','none','important')})}
var PAL=(function(){var c=document.createElement('canvas');c.width=1;c.height=256;var g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'rgba(40,90,220,0)');gr.addColorStop(.25,'rgba(40,150,230,.55)');gr.addColorStop(.5,'rgba(60,200,120,.75)');gr.addColorStop(.72,'rgba(250,210,40,.85)');gr.addColorStop(1,'rgba(230,40,30,.95)');g.fillStyle=gr;g.fillRect(0,0,1,256);return g.getImageData(0,0,1,256).data})();
function dibuja(){
 var doc=S.doc;if(!doc||!doc.body)return;
 var old=doc.getElementById('lp-ov');if(old)old.parentNode.removeChild(old);
 var W=doc.documentElement.clientWidth,H=Math.max(doc.documentElement.scrollHeight,doc.body.scrollHeight),p=PAGES[S.pg];
 var k=S.disp==='pc'?(1366/ $('lp-vent').clientWidth):1;
 var ov=doc.createElement('div');ov.id='lp-ov';ov.style.cssText='position:absolute;left:0;top:0;width:'+W+'px;height:'+H+'px;z-index:2147483000;pointer-events:none;overflow:hidden';
 doc.body.appendChild(ov);
 if(S.capas.baja){for(var q=0;q<10;q++){var a=alcanza(p,q*10+10),b=doc.createElement('div');b.style.cssText='position:absolute;left:0;width:100%;top:'+(H*q/10)+'px;height:'+(H/10)+'px;background:rgba(18,32,43,'+((1-a/100)*.5).toFixed(3)+')';ov.appendChild(b);
   if(q>0){var l=doc.createElement('div');l.textContent=fmt((alcanza(p,q*10)).toFixed(alcanza(p,q*10)<10?1:0))+' % llega aquí';l.style.cssText='position:absolute;left:6px;top:'+(H*q/10)+'px;background:#12202B;color:#fff;font:700 '+Math.round(12*k)+'px Inter,Arial,sans-serif;padding:'+Math.round(3*k)+'px '+Math.round(8*k)+'px;border-radius:'+Math.round(10*k)+'px;opacity:.92';ov.appendChild(l)}}}
 if(S.capas.calor&&S.taps){var cw=Math.max(1,Math.round(W/2)),ch=Math.max(1,Math.min(7000,Math.round(H/2))),cv=doc.createElement('canvas');cv.width=cw;cv.height=ch;cv.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%';var g=cv.getContext('2d'),R=Math.max(14,Math.round(cw*.075));
  S.taps.forEach(function(t){var x=t.x*cw,y=t.y*ch/H;if(y>ch)return;var gr=g.createRadialGradient(x,y,0,x,y,R);gr.addColorStop(0,'rgba(0,0,0,.16)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-R,y-R,2*R,2*R)});
  var im=g.getImageData(0,0,cw,ch),d=im.data,mx=1,i;for(i=3;i<d.length;i+=4)if(d[i]>mx)mx=d[i];for(i=0;i<d.length;i+=4){var al=d[i+3];if(al){var o=Math.min(255,Math.pow(al/mx,.8)*255)|0;d[i]=PAL[o*4];d[i+1]=PAL[o*4+1];d[i+2]=PAL[o*4+2];d[i+3]=PAL[o*4+3]*.9}}g.putImageData(im,0,0);ov.appendChild(cv)}
 if(S.capas.vano&&S.taps){S.taps.forEach(function(t){if(!t.dead)return;var s=Math.round(11*k),e=doc.createElement('div');e.style.cssText='position:absolute;width:'+s+'px;height:'+s+'px;border-radius:50%;background:#e03131;border:'+Math.max(2,Math.round(2*k))+'px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.25);left:'+(t.x*W-s/2)+'px;top:'+(t.y-s/2)+'px;opacity:.85';ov.appendChild(e)})}
 var c=0;S.notas.forEach(function(n){if(n.pg!==S.pg||n.disp!==S.disp)return;c++;if(!n.pin||n.ok)return;pin(doc,ov,n.pin,c,k)});
 if(S.pin)pin(doc,ov,S.pin,'+',k);
 aplicaSenal()}
function pin(doc,ov,pn,txt,k){var s=Math.round(26*k),e=doc.createElement('div');e.textContent=txt;e.style.cssText='position:absolute;width:'+s+'px;height:'+s+'px;border-radius:50% 50% 50% 0;background:#F2C23E;color:#12202B;font:800 '+Math.round(13*k)+'px Inter,Arial,sans-serif;display:flex;align-items:center;justify-content:center;border:2px solid #12202B;left:'+(pn.x*doc.documentElement.clientWidth-s/2)+'px;top:'+(pn.y-s)+'px';ov.appendChild(e)}
function aplicaSenal(){var doc=S.doc;if(!doc)return;var ov=doc.getElementById('lp-ov');if(!ov)return;ov.style.pointerEvents=S.senal?'auto':'none';ov.style.cursor=S.senal?'crosshair':'';
 ov.onclick=S.senal?function(ev){var W=doc.documentElement.clientWidth;var xr=ev.pageX/W,y=ev.pageY;ov.style.pointerEvents='none';var el=doc.elementFromPoint(ev.clientX,ev.clientY);S.pin={x:xr,y:y,lab:lab(el)};S.senal=false;pintaPanel();dibuja()}:null}
function monta(){
 var p=PAGES[S.pg],cont=$('lp-vent'),tel=$('lp-tel'),f=$('lp-if');
 tel.className='lp-tel'+(S.disp==='pc'?' pc':'');
 var cw=cont.clientWidth,hv=S.disp==='pc'?Math.round(Math.min(560,Math.max(360,cw*.62))):640;
 cont.style.height=hv+'px';
 if(S.disp==='pc'){var sc=cw/1366;f.style.width='1366px';f.style.height=Math.round(hv/sc)+'px';f.style.transform='scale('+sc+')'}
 else{f.style.width='100%';f.style.height=hv+'px';f.style.transform='none'}
 S.taps=null;S.doc=null;var url=p.p;if(f.getAttribute('data-p')!==url||f.getAttribute('data-d')!==S.disp){f.setAttribute('data-p',url);f.setAttribute('data-d',S.disp);f.src=url}else{listo()}}
function listo(){
 var f=$('lp-if'),doc;try{doc=f.contentDocument}catch(e){return}if(!doc||!doc.body)return;
 var path=f.contentWindow.location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
 var i=PAGES.map(function(q){return q.p}).indexOf(path);S.sin=i<0;if(i>=0&&i!==S.pg){S.pg=i;S.pin=null;S.senal=false;f.setAttribute('data-p',PAGES[i].p);pintaLista()}
 if(S.sin){S.taps=[];S.doc=doc;f.setAttribute('data-p',path);$('lp-der').innerHTML='<h2>Esta página</h2><p style="margin:0 0 8px;font-weight:700">'+esc(path)+'</p><p style="font-size:.9rem;color:#33495C">Esta página no tiene datos de ejemplo. Vuelve a una de la lista de la izquierda para ver el mapa de calor.</p>';return}
 var run=function(){if(!doc.defaultView||f.contentDocument!==doc)return;ocultaFijos(doc);S.doc=doc;S.taps=tomaTaps(doc);pintaPanel();dibuja()};
 setTimeout(run,700);setTimeout(function(){if(!doc.defaultView||f.contentDocument!==doc)return;var H=Math.max(doc.documentElement.scrollHeight,doc.body.scrollHeight);if(Math.abs(H-(S.altura||0))>30){S.altura=H;run()}},2600)}
function setPg(i){S.pg=i;S.pin=null;S.senal=false;pintaLista();monta();pintaPanel()}
function todo(){pintaConc();pintaLista();pintaPanel();monta()}
// ---- filtros y capas
function seg(id,key,conv){[].forEach.call(document.querySelectorAll('#'+id+' button'),function(b){b.onclick=function(){S[key]=conv?conv(b.getAttribute('data-v')):b.getAttribute('data-v');[].forEach.call(document.querySelectorAll('#'+id+' button'),function(x){x.classList.toggle('on',x===b)});S.pin=null;todo()}})}
seg('lp-dias','dias',Number);seg('lp-disp','disp');
$('lp-fte').onchange=function(){S.fuente=this.value;todo()};
[].forEach.call(document.querySelectorAll('.lp-chip'),function(c){c.onclick=function(){var k=c.getAttribute('data-c');S.capas[k]=S.capas[k]?0:1;c.classList.toggle('off',!S.capas[k]);dibuja()}});
$('lp-if').addEventListener('load',listo);
var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){var w=window.innerWidth;if(S.w===w)return;S.w=w;monta()},250)});
S.w=window.innerWidth;todo();
})();
