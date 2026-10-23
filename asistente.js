(function(){
var RUTAS=["/", "/acabados", "/alcala-de-henares", "/automatismos", "/azuqueca-de-henares", "/blog", "/blog/ayudas-cambiar-ventanas-madrid", "/blog/cajones-persiana-aislados", "/blog/cancelas-aluminio-soldado", "/blog/cerrar-terraza-antes-de-navidad", "/blog/condensacion-ventanas", "/blog/cuanto-cuesta-cambiar-ventanas", "/blog/instalacion-ventanas-pvc", "/blog/kommerling-76-ad-md-xtrem", "/blog/licencia-obras-cambiar-ventanas", "/blog/mantenimiento-limpieza-ventanas", "/blog/mas-que-una-ventana", "/blog/mejor-epoca-cambiar-ventanas", "/blog/no-hacemos-ventanas-hacemos-hogares", "/blog/precio-cerrar-terraza", "/blog/pvc-o-aluminio", "/blog/rotura-puente-termico", "/blog/una-ventana-no-es-solo-una-ventana", "/blog/ventanas-ahorro-energia-calor-frio", "/blog/ventanas-oscilobatientes", "/calculadora", "/cancelas-puertas", "/cerramientos-terrazas", "/como-medir-ventanas", "/comprobador-ayudas", "/comunidades", "/configurador", "/contacto", "/coslada", "/diagnostico", "/empresa", "/financiacion", "/garantia-y-postventa", "/glosario", "/guadalajara", "/landing", "/madrid", "/mapa-de-obras", "/meco", "/pergolas", "/permisos-cerrar-terraza", "/persianas-cristales", "/rejas", "/reparaciones", "/revisa-tu-presupuesto", "/simulador", "/techos", "/toldos", "/torrejon-de-ardoz", "/trabajos", "/ventanas-aluminio", "/ventanas-pvc", "/villalbilla", "/visualizador"];
var SUG=['Quiero cambiar las ventanas de mi casa','Quiero cerrar la terraza de mi chalet','Necesito una cancela o una puerta de garaje','¿Cómo puedo pedir presupuesto?'];
var BIEN='Hola. Soy el asistente de AMS, una inteligencia artificial. Te oriento sobre ventanas, cerramientos de terraza, cancelas y puertas, y te digo qué conviene preguntar para pedir un buen presupuesto. Estoy aquí a cualquier hora.';
var AV="/img/logo-cuadrado.png",EQ="/img/equipo-ams.webp";
var msgs=[],ocupado=false,abierto=false,cid='';
try{cid=sessionStorage.getItem('ams_cid')||'';if(!cid){cid=(window.crypto&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2));sessionStorage.setItem('ams_cid',cid)}}catch(e){cid=String(Date.now())+Math.random().toString(16).slice(2)}
var PAG=location.pathname;
try{var g=sessionStorage.getItem('ams_chat');if(g)msgs=JSON.parse(g)||[]}catch(e){}
function guarda(){try{sessionStorage.setItem('ams_chat',JSON.stringify(msgs.slice(-20)))}catch(e){}}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function inl(s){
  s=esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  s=s.replace(/\[([^\]]+)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)\)/g,'<a href="$2">$1</a>');
  s=s.replace(/(^|[\s(])(\/[a-z0-9\-\/]*[a-z0-9])(?=[\s).,;:!?]|$)/g,function(m,p,r){return RUTAS.indexOf(r)>-1?p+'<a href="'+r+'">'+r+'</a>':m});
  return s.replace(/(^|[\s(])(\d{3}) ?(\d{2}) ?(\d{2}) ?(\d{2})(?=[\s).,;:!?]|$)/g,function(m,p,a,b,c,d){return p+'<a href="tel:+34'+a+b+c+d+'">'+a+' '+b+' '+c+' '+d+'</a>'});
}
function fmt(t){
  return t.trim().split(/\n{2,}/).map(function(b){var l=b.split('\n');
    if(l.every(function(x){return /^\s*[-*]\s+/.test(x)}))return '<ul>'+l.map(function(x){return '<li>'+inl(x.replace(/^\s*[-*]\s+/,''))+'</li>'}).join('')+'</ul>';
    if(l.every(function(x){return /^\s*\d+[.)]\s+/.test(x)}))return '<ol>'+l.map(function(x){return '<li>'+inl(x.replace(/^\s*\d+[.)]\s+/,''))+'</li>'}).join('')+'</ol>';
    return '<p>'+l.map(inl).join('<br>')+'</p>'}).join('');
}
var DUDA=/\[\[DUDA:([\s\S]*?)\]\]/;
var $=function(i){return document.getElementById(i)};
function crea(){
  var b=document.createElement('button');b.id='asb';b.type='button';b.setAttribute('aria-label','Abrir el asistente de AMS');
  b.innerHTML='<span class="asf"><img src="'+AV+'" alt="" width="44" height="44"><i class="asd"></i></span><span class="ast2"><strong>Pregunta a AMS</strong><small>Chat 24 h · respuesta al momento</small></span>';
  var p=document.createElement('div');p.id='asp';p.setAttribute('role','dialog');p.setAttribute('aria-label','Asistente de AMS');
  p.innerHTML='<div class="ah"><span class="asf"><img src="'+AV+'" alt="" width="44" height="44"><i class="asd"></i></span><div><b>Asistente de AMS</b><small>Inteligencia artificial · disponible las 24 horas</small></div><button type="button" id="asx">Cerrar</button></div>'
   +'<div id="asm" aria-live="polite"></div>'
   +'<div id="asl"><b>Deja tu teléfono y el equipo te llama.</b><label for="asnm">Nombre</label><input type="text" id="asnm" autocomplete="name"><label for="astl">Teléfono</label><input type="tel" id="astl" autocomplete="tel"><label class="k"><input type="checkbox" id="asok"><span>Acepto que AMS me llame al teléfono que he indicado. <a href="/privacidad">Privacidad</a></span></label><button type="button" class="bt" id="asen">Enviar</button> <span id="asmo"></span></div>'
   +'<form id="asf"><textarea id="ast" rows="1" placeholder="Escribe tu pregunta" aria-label="Tu mensaje" maxlength="1500"></textarea><button type="submit" id="asse">Enviar</button></form>'
   +'<div id="asn"><span>Guardamos la conversación para mejorar el servicio (<a href="/privacidad">privacidad</a>). No escribas datos sensibles. El equipo confirma precios y plazos.</span><button type="button" id="asll">Que me llamen</button></div>';
  document.body.appendChild(b);document.body.appendChild(p);
  b.addEventListener('click',abre);$('asx').addEventListener('click',cierra);
  $('asf').addEventListener('submit',function(e){e.preventDefault();envia($('ast').value)});
  $('ast').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();envia($('ast').value)}});
  $('ast').addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,110)+'px'});
  $('asll').addEventListener('click',function(){$('asl').classList.toggle('on')});
  $('asen').addEventListener('click',contacto);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&abierto)cierra()});
  window.addEventListener('abrir-asistente',abre);
}
function pinta(){
  var m=$('asm');m.innerHTML='';
  if(EQ){var f=document.createElement('figure');f.className='eq';f.innerHTML='<img src="'+EQ+'" alt="Cerramiento de terraza instalado por AMS" width="640" height="360"><figcaption><strong>AMS Cerramientos y Servicios</strong><span>Fabricamos e instalamos ventanas, cerramientos y cancelas desde Villalbilla (Madrid). Si tu caso lo necesita, te atiende una persona del equipo.</span></figcaption>';m.appendChild(f)}
  var a=document.createElement('div');a.className='m a';a.innerHTML='<p>'+esc(BIEN)+'</p>';m.appendChild(a);
  if(!msgs.length){var c=document.createElement('div');c.className='ch';SUG.forEach(function(s){var x=document.createElement('button');x.type='button';x.textContent=s;x.addEventListener('click',function(){envia(s)});c.appendChild(x)});m.appendChild(c)}
  msgs.forEach(function(x){var d=document.createElement('div');d.className='m '+(x.role==='user'?'u':'a');d.innerHTML=x.role==='user'?'<p>'+esc(x.content)+'</p>':fmt(x.content);m.appendChild(d)});
  m.scrollTop=m.scrollHeight;
}
function abre(){abierto=true;$('asp').classList.add('on');$('asb').style.display='none';pinta();setTimeout(function(){$('ast').focus()},50)}
function cierra(){abierto=false;$('asp').classList.remove('on');$('asb').style.display='flex';$('asb').focus()}
async function envia(txt){
  txt=(txt||'').trim();if(!txt||ocupado)return;
  ocupado=true;$('asse').disabled=true;$('ast').value='';$('ast').style.height='auto';
  msgs.push({role:'user',content:txt});guarda();pinta();
  var m=$('asm'),t=document.createElement('div');t.className='t';t.textContent='Escribiendo…';m.appendChild(t);m.scrollTop=m.scrollHeight;
  var burbuja=null,acum='';
  try{
    var r=await fetch('/api/asistente',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cid:cid,pagina:PAG,mensajes:msgs.slice(-20)})});
    if(!r.ok){var j={};try{j=await r.json()}catch(e){}throw new Error(j.error||'No he podido responder ahora. Llámanos al 639 78 82 20.')}
    var lec=r.body.getReader(),dec=new TextDecoder();
    for(;;){var x=await lec.read();if(x.done)break;acum+=dec.decode(x.value,{stream:true});
      if(!burbuja){t.remove();burbuja=document.createElement('div');burbuja.className='m a';m.appendChild(burbuja)}
      burbuja.innerHTML=fmt(acum.replace(DUDA,'').replace(/\[\[DUDA:[^\]]*$/,''));m.scrollTop=m.scrollHeight}
  }catch(e){
    t.remove();acum=(e&&e.message)||'No he podido responder ahora. Llámanos al 639 78 82 20.';
    if(!burbuja){burbuja=document.createElement('div');burbuja.className='m a';m.appendChild(burbuja)}burbuja.innerHTML=fmt(acum);
  }
  var d=acum.match(DUDA);
  if(d){try{fetch('/api/asistente',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accion:'duda',cid:cid,pagina:PAG,pregunta:d[1].trim()})})}catch(e){}}
  var limpio=acum.replace(DUDA,'').trim();
  if(limpio){msgs.push({role:'assistant',content:limpio});guarda()}
  ocupado=false;$('asse').disabled=false;$('ast').focus();
}
async function contacto(){
  var mo=$('asmo'),nm=$('asnm').value.trim(),tl=$('astl').value.trim();
  if(tl.replace(/\D/g,'').length<9){mo.textContent='Pon un teléfono válido.';return}
  if(!$('asok').checked){mo.textContent='Marca la casilla para que podamos llamarte.';return}
  mo.textContent='Enviando…';
  try{
    var r=await fetch('/api/asistente',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accion:'contacto',cid:cid,pagina:PAG,nombre:nm,telefono:tl,consentimiento:true,mensajes:msgs.slice(-12)})});
    var j=await r.json();
    if(j.ok){$('asl').classList.remove('on');msgs.push({role:'assistant',content:'Gracias'+(nm?', '+nm:'')+'. He pasado tu teléfono al equipo de AMS y te llamarán. Si es urgente, puedes llamar ya al 639 78 82 20.'});guarda();pinta()}
    else mo.textContent='No se ha podido enviar. Llama al 639 78 82 20.';
  }catch(e){mo.textContent='No se ha podido enviar. Llama al 639 78 82 20.'}
}
function ini(){var l=document.createElement('link');l.rel='stylesheet';l.href='/asistente.css';document.head.appendChild(l);crea()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ini);else ini();
})();
