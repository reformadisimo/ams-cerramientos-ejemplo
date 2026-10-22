(function(){
'use strict';
var WA='34639788220';
var $=function(id){return document.getElementById(id);};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
var eur=function(n){return Math.round(n).toLocaleString('es-ES')+' €';};
var eur2=function(n){return Number(n).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';};
var clone=function(o){return JSON.parse(JSON.stringify(o));};

/* ---------- Catalogo ---------- */
var ROOMS=['Salón','Cocina','Dormitorio','Baño','Pasillo','Terraza','Buhardilla','Otra'];
var TYPES=[
 {id:'ventana',n:'Ventana',d:'De 1, 2 o 3 hojas',def:{w:120,h:120,hojas:2},pre:[
  {n:'Pequeña',d:'Baño o cocina',w:60,h:80,hojas:1},{n:'Mediana',d:'Dormitorio',w:120,h:120,hojas:2},{n:'Grande',d:'Salón',w:160,h:130,hojas:2},{n:'Muy ancha',d:'Tres hojas',w:220,h:130,hojas:3}]},
 {id:'balconera',n:'Balconera',d:'Puerta hasta el suelo',def:{w:140,h:215,hojas:2},pre:[
  {n:'Una hoja',d:'Salida al balcón',w:80,h:215,hojas:1},{n:'Dos hojas',d:'La más habitual',w:140,h:215,hojas:2},{n:'Dos hojas grande',d:'Salón',w:170,h:230,hojas:2}]},
 {id:'corredera',n:'Corredera',d:'Ventana o ventanal',def:{w:200,h:215,hojas:2,mat:'alu'},pre:[
  {n:'Ventana corredera',d:'Cocina o dormitorio',w:150,h:120,hojas:2},{n:'Balconera corredera',d:'Salida a terraza',w:200,h:215,hojas:2},{n:'Ventanal',d:'Salón',w:300,h:220,hojas:2},{n:'Gran ventanal',d:'Cuatro hojas',w:400,h:230,hojas:4}]},
 {id:'fijo',n:'Fijo',d:'Cristal que no se abre',def:{w:100,h:100,hojas:1},pre:[
  {n:'Pequeño',d:'Montante o hueco',w:60,h:60,hojas:1},{n:'Mediano',d:'Escalera o pasillo',w:100,h:100,hojas:1},{n:'Grande',d:'Paño de luz',w:150,h:200,hojas:1}]},
 {id:'techo',n:'Ventana de tejado',d:'Para buhardillas',def:{talla:'78x118'}},
 {id:'claraboya',n:'Claraboya',d:'Para cubierta plana',def:{talla:'80'}}];
var TT={};TYPES.forEach(function(t){TT[t.id]=t;});
var TECHO=[['55x78','55 × 78 cm'],['55x98','55 × 98 cm'],['66x118','66 × 118 cm'],['78x98','78 × 98 cm'],['78x118','78 × 118 cm'],['78x140','78 × 140 cm'],['114x118','114 × 118 cm'],['114x140','114 × 140 cm']];
var CLARA=[['60','60 × 60 cm'],['80','80 × 80 cm'],['90','90 × 90 cm'],['100','100 × 100 cm']];
var MAT={pvc:['PVC','Aísla mejor del frío y del ruido. Casi sin mantenimiento.'],alu:['Aluminio','Perfiles más finos y más luz. Muy resistente y duradero.']};
var GAMA={pvc:{eco:['Económica',['Perfil de 70 mm','5 cámaras']],confort:['Confort',['Kömmerling 76 mm','La más vendida']],premium:['Premium',['Perfil de 82 mm','La que más aísla']]},
 alu:{eco:['Sin rotura de puente térmico',['Para trasteros, garajes o cerramientos sin calefacción']],confort:['Con rotura de puente térmico',['Cortizo o Technal','La más vendida']],premium:['Rotura de alta gama',['Hoja oculta y perfil más fino','Máximo aislamiento en aluminio']]}};
var COL=[['blanco','Blanco','#FFFFFF'],['color','Gris antracita u otro color liso','#3F454B'],['bicolor','Blanco dentro, color fuera','linear-gradient(90deg,#fff 50%,#3F454B 50%)'],['madera','Imitación madera','#8A5A35'],['negro','Negro mate','#1B1C1E']];
var COLHEX={blanco:'#FFFFFF',color:'#3F454B',bicolor:'#3F454B',madera:'#8A5A35',negro:'#1B1C1E'};
var VID=[['doble','Doble vidrio','Básico'],['bajoe','Térmico bajo emisivo','Recomendado'],['solar','Control solar','Fachadas con mucho sol'],['mate','Translúcido','Para baños'],['acustico','Acústico','Calles con ruido'],['seguridad','Seguridad laminado','Bajos y casas con niños'],['triple','Triple vidrio','Máximo aislamiento']];
var VID_RAPIDO=['doble','bajoe','acustico','seguridad'];
var PERS=[['no','Sin persiana'],['manual','Manual, con cinta'],['motor','Con motor e interruptor'],['radio','Con motor y mando'],['solar','Motor solar, sin cables']];
var MOSQ=[['no','Sin mosquitera'],['enrollable','Enrollable'],['plisada','Plisada, para puertas']];
var APER=[['osc','Oscilobatiente','Se abre y se inclina'],['practicable','Abatible','Se abre como una puerta'],['fija','Fija','No se abre']];
var FIJO=[['no','Sin fijo'],['sup','Con fijo arriba'],['inf','Con fijo abajo']];
var TECHO_ROOM=[[7,'55x98'],[10,'78x98'],[13,'78x118'],[18,'114x118'],[999,'114x140']];

/* ---------- Estado ---------- */
var S={mode:'rapido',items:[],cur:null,curIdx:-1,res:null,cuota:12,busy:0};

function defItem(tipo){
 var t=TT[tipo],it={tipo:tipo,n:1,hab:''};
 if(tipo==='techo')return Object.assign(it,{talla:'78x118',aper:'giratoria',acc:'manual',estor:false,persext:false,mosq:false,obra:'sustitucion'});
 if(tipo==='claraboya')return Object.assign(it,{talla:'80',acc:'fija',estor:false,obra:'sustitucion'});
 Object.assign(it,{w:t.def.w,h:t.def.h,hojas:t.def.hojas,mat:t.def.mat||'pvc',gama:'confort',col:'blanco',vid:'bajoe',pers:'no',mosq:'no',fijo:'no',umbral:false,elev:false,aper:[]});
 fixAper(it);return it;
}
function fixAper(it){
 if(it.tipo==='techo'||it.tipo==='claraboya')return;
 var a=it.aper||[],out=[];
 for(var i=0;i<it.hojas;i++){
  if(it.tipo==='fijo')out.push('fija');else if(it.tipo==='corredera')out.push('corredera');
  else out.push(a[i]||(S.mode==='rapido'?(a[0]||'osc'):(i===0?'osc':'practicable')));
 }
 it.aper=out;
}

/* ---------- Dibujos ---------- */
/* ---------- Fotos reales ----------
 Cada configuracion busca su foto en este orden: modelo+color, modelo, foto del tipo.
 Modelos: ventana-1h, ventana-2h, ventana-3h, balconera-1h, balconera-2h,
 corredera-ventana, corredera-balconera, corredera-4h, fijo, techo, claraboya.
 Colores: -gris, -madera, -negro (blanco es la foto base). */
var BASEFOTO={'ventana-2h':'ventana-producto','balconera-2h':'balconera-producto','corredera-ventana':'corredera-producto','fijo':'fijo-producto','techo':'techo-producto','claraboya':'claraboya-producto'};
function modelo(it){
 var t=it.tipo;
 if(t==='ventana')return 'ventana-'+Math.min(3,it.hojas)+'h';
 if(t==='balconera')return 'balconera-'+Math.min(2,it.hojas)+'h';
 if(t==='corredera')return it.hojas>=4?'corredera-4h':(it.h>=180?'corredera-balconera':'corredera-ventana');
 return t;
}
function colorSuf(it){var c=it.col;if(c==='bicolor')c=S.view==='out'?'color':'blanco';return {color:'-gris',madera:'-madera',negro:'-negro'}[c]||'';}
function fotoList(it){
 var m=modelo(it),c=colorSuf(it),L=[];
 if(c)L.push('/img/cfg/p/'+m+c+'.webp');
 L.push('/img/cfg/p/'+m+'.webp');
 if(BASEFOTO[m])L.push('/img/cfg/'+BASEFOTO[m]+'.webp');
 L.push('/img/cfg/'+it.tipo+'-producto.webp');
 return L.filter(function(u,i){return L.indexOf(u)===i;});
}
window.cfNext=function(el){var l=(el.getAttribute('data-l')||'').split('|').filter(Boolean);if(!l.length){el.removeAttribute('onerror');return;}el.setAttribute('data-l',l.slice(1).join('|'));el.src=l[0];};
function foto(it,cls){var l=fotoList(it);return '<img class="'+(cls||'ph')+'" src="'+l[0]+'" data-l="'+l.slice(1).join('|')+'" alt="" loading="lazy" onerror="cfNext(this)">';}
function REAL(it,o){return window.AMSRender?window.AMSRender.real(it,o):draw(it,{person:!(o&&o.scene)?false:true});}
function frameCol(it){return COLHEX[it.col]||'#FFFFFF';}
function drawWin(it,opt){
 opt=opt||{};var person=opt.person!==false;
 var floor=it.tipo==='balconera'||(it.tipo==='corredera'&&it.h>=180);
 var sill=floor||!person?0:90, top=Math.max(it.h+sill+(it.pers!=='no'?22:0),person?180:0);
 var sceneW=it.w+(person?70:0), sc=Math.min(180/sceneW,176/top);
 var W=it.w*sc,H=it.h*sc,x=(200-(W+(person?70*sc:0)))/2,ground=190,y=ground-sill*sc-H;
 var fc=frameCol(it),dark=fc==='#FFFFFF'?'#12202B':'#0B151D',sw=Math.max(1.2,Math.min(3,W/60));
 var s='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
 if(person)s+='<line x1="0" y1="'+(ground+.5)+'" x2="200" y2="'+(ground+.5)+'" stroke="#C5CFD7" stroke-width="1"/>';
 if(it.pers&&it.pers!=='no'){var bh=18*sc;s+='<rect x="'+(x-1)+'" y="'+(y-bh)+'" width="'+(W+2)+'" height="'+bh+'" rx="1.5" fill="'+(fc==='#FFFFFF'?'#E5E9ED':fc)+'" stroke="'+dark+'" stroke-width="1"/>';}
 var f=Math.max(3,5*sc);
 s+='<rect x="'+x+'" y="'+y+'" width="'+W+'" height="'+H+'" rx="1.5" fill="'+fc+'" stroke="'+dark+'" stroke-width="'+sw+'"/>';
 var gy=y+f,gh=H-2*f;
 if(it.fijo==='sup'||it.fijo==='inf'){
  var fh=Math.min(40,it.h*0.28)*sc,fy=it.fijo==='sup'?y+f:y+H-f-fh;
  s+='<rect x="'+(x+f)+'" y="'+fy+'" width="'+(W-2*f)+'" height="'+(fh-f*.6)+'" fill="#CFE3F0" stroke="'+dark+'" stroke-width=".8"/>';
  if(it.fijo==='sup'){gy=fy+fh;gh=y+H-f-gy;}else{gh=fy-gy-f*.4;}
 }
 var n=it.hojas||1,hw=(W-2*f)/n;
 for(var i=0;i<n;i++){
  var hx=x+f+i*hw,ix=hx+f*.5,iw=hw-f,iy=gy+f*.5,ih=gh-f;
  s+='<rect x="'+ix+'" y="'+iy+'" width="'+iw+'" height="'+ih+'" fill="'+(it.vid==='mate'?'#E6ECF1':'#CFE3F0')+'" stroke="'+dark+'" stroke-width=".8"/>';
  if(it.vid==='mate')s+='<rect x="'+ix+'" y="'+iy+'" width="'+iw+'" height="'+ih+'" fill="url(#m)" opacity=".5"/>';
  var a=(it.aper||[])[i],hingeLeft=(n===1)||(i<n/2);
  var cx1=hingeLeft?ix+iw:ix,cx2=hingeLeft?ix:ix+iw,st='stroke="'+dark+'" stroke-width=".7" fill="none"';
  if(a==='practicable'||a==='osc')s+='<path d="M'+cx1+' '+iy+'L'+cx2+' '+(iy+ih/2)+'L'+cx1+' '+(iy+ih)+'" '+st+'/>';
  if(a==='osc')s+='<path d="M'+ix+' '+iy+'L'+(ix+iw/2)+' '+(iy+ih)+'L'+(ix+iw)+' '+iy+'" '+st+' stroke-dasharray="2 1.6"/>';
  if(a==='corredera'){var ay=iy+ih/2,dir=i%2?-1:1,ax=ix+iw/2;s+='<path d="M'+(ax-iw*.25*dir)+' '+ay+'H'+(ax+iw*.25*dir)+'M'+(ax+iw*.25*dir-3*dir)+' '+(ay-3)+'L'+(ax+iw*.25*dir)+' '+ay+'L'+(ax+iw*.25*dir-3*dir)+' '+(ay+3)+'" '+st+' stroke-width="1"/>';}
  if(a==='practicable'||a==='osc'){var hx2=hingeLeft?ix+iw-4:ix+2;s+='<rect x="'+hx2+'" y="'+(iy+ih/2-5)+'" width="2" height="10" rx="1" fill="'+dark+'"/>';}
 }
 if(it.mosq&&it.mosq!=='no')s+='<rect x="'+(x+f)+'" y="'+gy+'" width="'+(W-2*f)+'" height="'+gh+'" fill="url(#q)" opacity=".55"/>';
 if(person){var px=x+W+30*sc,ph=175*sc;s+='<g fill="#A9B5BF"><circle cx="'+(px+9*sc)+'" cy="'+(ground-ph+11*sc)+'" r="'+(10*sc)+'"/><path d="M'+(px)+' '+(ground-ph+24*sc)+'h'+(18*sc)+'l'+(4*sc)+' '+(70*sc)+'h'+(-5*sc)+'l'+(-2*sc)+' '+(80*sc)+'h'+(-12*sc)+'l'+(-2*sc)+' '+(-80*sc)+'h'+(-5*sc)+'z"/></g>';
  s+='<text x="'+(px+9*sc)+'" y="'+(ground+9)+'" font-size="7" text-anchor="middle" fill="#7A8894" font-family="Inter,sans-serif">1,75 m</text>';
  s+='<text x="'+(x+W/2)+'" y="'+(Math.max(y-(it.pers!=='no'?20*sc:0)-4,8))+'" font-size="8" font-weight="700" text-anchor="middle" fill="#12202B" font-family="Inter,sans-serif">'+Math.round(it.w)+' × '+Math.round(it.h)+'</text>';}
 s+='<defs><pattern id="m" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#fff"/></pattern><pattern id="q" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0H3M0 0V3" stroke="#6B7A87" stroke-width=".3"/></pattern></defs>';
 return s+'</svg>';
}
function drawTecho(it){
 var p=it.talla.split('x'),w=+p[0],h=+p[1],sc=Math.min(80/114,90/140),W=w*sc,H=h*sc;
 var s='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10 170 L100 40 L190 170 Z" fill="#B85B3C"/><path d="M10 170 L100 40 L190 170" stroke="#8A3F27" stroke-width="3" fill="none"/>';
 s+='<g transform="translate(100 112) skewY(0)">';
 s+='<rect x="'+(-W/2)+'" y="'+(-H/2)+'" width="'+W+'" height="'+H+'" rx="2" fill="#5B636B" stroke="#2B3238" stroke-width="2"/><rect x="'+(-W/2+4)+'" y="'+(-H/2+4)+'" width="'+(W-8)+'" height="'+(H-8)+'" fill="#BFD9EA"/>';
 if(it.persext)s+='<rect x="'+(-W/2+4)+'" y="'+(-H/2+4)+'" width="'+(W-8)+'" height="'+((H-8)*.55)+'" fill="#3F454B"/>';
 if(it.acc!=='manual')s+='<circle cx="'+(W/2-8)+'" cy="'+(-H/2+8)+'" r="4" fill="'+(it.acc==='solar'?'#F2B705':'#1F8F4E')+'"/>';
 s+='</g><text x="100" y="190" font-size="9" font-weight="700" text-anchor="middle" fill="#12202B" font-family="Inter,sans-serif">'+w+' × '+h+' cm</text></svg>';
 return s;
}
function drawClara(it){
 var w=+it.talla,W=w*0.9;
 var s='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="10" y="130" width="180" height="16" fill="#9AA6B1"/><rect x="'+(100-W/2)+'" y="112" width="'+W+'" height="20" fill="#E5E9ED" stroke="#5B636B" stroke-width="1.5"/>';
 s+='<path d="M'+(100-W/2)+' 112 Q100 '+(112-W*.45)+' '+(100+W/2)+' 112 Z" fill="#CFE3F0" stroke="#5B636B" stroke-width="1.5"/>';
 if(it.acc==='electrica')s+='<circle cx="'+(100+W/2-8)+'" cy="122" r="4" fill="#1F8F4E"/>';
 s+='<text x="100" y="170" font-size="9" font-weight="700" text-anchor="middle" fill="#12202B" font-family="Inter,sans-serif">'+w+' × '+w+' cm</text></svg>';
 return s;
}
function draw(it,o){var s=it.tipo==='techo'?drawTecho(it):it.tipo==='claraboya'?drawClara(it):drawWin(it,o);return o&&o.person===false?s.replace(/<text[^>]*>[^<]*<\/text>/g,''):s;}

/* ---------- Prestaciones (0 a 5) ---------- */
function bars(it){
 if(it.tipo==='techo'||it.tipo==='claraboya'){
  return {Aislamiento:4,Ruido:3,Seguridad:3,Luz:5};
 }
 var c=Math.min,b={};
 var th={pvc:{eco:3,confort:4,premium:5},alu:{eco:1,confort:3,premium:4}}[it.mat][it.gama];
 th+={doble:0,bajoe:1,solar:1,mate:0,acustico:.5,seguridad:0,triple:2}[it.vid];
 if(it.tipo==='corredera')th-=.5;
 var ru=(it.mat==='pvc'?3:2)+(it.gama==='premium'?1:0)+({acustico:2,triple:1,seguridad:1}[it.vid]||0)-(it.tipo==='corredera'?1:0);
 var se=2+(it.mat==='alu'?.5:0)+(it.vid==='seguridad'?2:0)+(it.pers!=='no'?1:0)+(it.gama==='premium'?.5:0);
 var lu=3+(it.mat==='alu'?1:0)+(it.tipo==='corredera'||it.tipo==='fijo'?.5:0)-(it.vid==='mate'?2:0)-(it.vid==='solar'||it.vid==='triple'?.5:0)-(it.fijo!=='no'?0:0);
 b.Aislamiento=c(5,Math.max(1,th));b.Ruido=c(5,Math.max(1,ru));b.Seguridad=c(5,Math.max(1,se));b.Luz=c(5,Math.max(1,lu));
 return b;
}
function renderBars(it){
 var b=bars(it),h='';
 for(var k in b){var v=Math.round(b[k]),d='';for(var i=1;i<=5;i++)d+='<s class="'+(i<=v?'f':'')+'"></s>';h+='<div class="cf-bar"><span>'+k+'</span><i>'+d+'</i></div>';}
 $('cfBars').innerHTML=h;
}

/* ---------- Nombres ---------- */
function nombre(it){
 if(it.tipo==='techo')return 'Ventana de tejado';
 if(it.tipo==='claraboya')return 'Claraboya';
 var t={ventana:'Ventana',balconera:'Balconera',corredera:'Corredera',fijo:'Fijo'}[it.tipo];
 if(it.tipo!=='fijo')t+=' de '+it.hojas+(it.hojas==1?' hoja':' hojas');
 return t;
}
function detalle(it){
 if(it.tipo==='techo')return it.talla.replace('x',' × ')+' cm · '+(it.aper==='proyectante'?'proyectante':'giratoria')+' · '+({manual:'manual',electrica:'eléctrica',solar:'solar'}[it.acc])+(it.obra==='nuevo'?' · hueco nuevo':'');
 if(it.tipo==='claraboya')return it.talla+' × '+it.talla+' cm · '+(it.acc==='electrica'?'eléctrica':'fija')+(it.obra==='nuevo'?' · hueco nuevo':'');
 var g=GAMA[it.mat][it.gama][0],c=COL.filter(function(x){return x[0]===it.col;})[0][1].toLowerCase();
 var v=VID.filter(function(x){return x[0]===it.vid;})[0][1].toLowerCase();
 var d=Math.round(it.w)+' × '+Math.round(it.h)+' cm · '+MAT[it.mat][0]+' '+g.toLowerCase()+' · '+c+' · '+v;
 if(it.pers!=='no')d+=' · persiana '+({manual:'manual',motor:'con motor',radio:'con mando',solar:'solar'}[it.pers]);
 if(it.mosq!=='no')d+=' · mosquitera';
 return d;
}

/* ---------- Selector de tipo ---------- */
var AMB={ventana:['/img/ventana-cortina.jpg','Ventana oscilobatiente de dos hojas'],balconera:['/img/obra-balcon.jpg','Balconera recién instalada'],corredera:['/img/terraza-cristal.jpg','Corredera de suelo a techo'],fijo:['/img/salon-ventanal.jpg','Ventanal fijo en un salón']};
window.cfFb=function(el){var fb=el.getAttribute('data-fb');if(fb&&el.getAttribute('src')!==fb){el.setAttribute('src',fb);}else{var p=el.parentNode;if(p)p.classList.add('noamb');el.remove();}};
function media(t,it){
 var fb=AMB[t]?AMB[t][0]:'';
 return '<div class="cf-tm"><img class="amb" src="/img/cfg/'+t+'-ambiente.webp" data-fb="'+fb+'" alt="" loading="lazy" onerror="cfFb(this)"><span class="ins">'+REAL(it)+'</span><img class="prod" src="/img/cfg/'+t+'-producto.webp" alt="" loading="lazy" onerror="this.remove()"></div>';
}
function renderTypes(){
 var h='';
 TYPES.forEach(function(t){var it=defItem(t.id);if(t.id==='corredera'){it.w=200;it.h=215;}
  h+='<button type="button" class="cf-type'+(S.cur&&S.curIdx<0&&S.cur.tipo===t.id?' on':'')+'" data-type="'+t.id+'">'+media(t.id,it)+'<b>'+t.n+'</b><span>'+t.d+'</span><em id="cfFrom_'+t.id+'"></em></button>';});
 $('cfTypes').innerHTML=h;
}

/* ---------- Editor ---------- */
function openEditor(tipo,idx){
 if(idx>=0){S.cur=clone(S.items[idx]);S.curIdx=idx;}else{S.cur=defItem(tipo);S.curIdx=-1;}
 $('cfEditor').hidden=false;
 var tp=S.cur.tipo,fb=AMB[tp]?AMB[tp][0]:'';$('cfAmb').innerHTML='<img src="/img/cfg/'+tp+'-ambiente.webp" data-fb="'+fb+'" alt="" onerror="cfFb(this)"><figcaption>Así queda en una casa'+(AMB[tp]?' · '+AMB[tp][1]:'')+'</figcaption>';$('cfAmb').classList.remove('noamb');
 $('cfEdTitle').textContent=(idx>=0?'Cambia tu ':'Configura tu ')+TT[S.cur.tipo].n.toLowerCase();
 $('cfEdSub').textContent=S.mode==='rapido'?'Modo rápido: lo justo para darte un precio fiable. Si sabes las medidas, cambia a cálculo exacto arriba.':'Modo exacto: con tus medidas y todas las opciones. Cada opción te dice lo que suma o resta.';
 $('cfAdd').textContent=idx>=0?'Guardar cambios':'Añadir al presupuesto';
 renderTypes();renderOpts();refreshCur();schedule();
 var y=$('cfEditor').getBoundingClientRect().top+window.scrollY-80;window.scrollTo({top:y,behavior:'smooth'});
}
function closeEditor(){S.cur=null;S.curIdx=-1;$('cfEditor').hidden=true;renderTypes();schedule();}

/* Foto de cada opcion: /img/cfg/<nombre>.webp. Si no existe, la opcion se ve sin foto. */
function optImg(k,v){
 var it=S.cur||{},t=it.tipo,n=null;
 if(k==='mat')n='perfil-'+v+'-confort';
 else if(k==='gama')n='perfil-'+it.mat+'-'+v;
 else if(k==='vid')n='vidrio-'+v;
 else if(k==='pers'&&v!=='no')n='persiana-'+v;
 else if(k==='mosq'&&t!=='techo'&&v!=='no')n='mosquitera-'+v;
 else if(t==='techo'&&k==='aper')n='techo-'+v;
 else if(t==='techo'&&k==='estor')n='techo-estor';
 else if(t==='techo'&&k==='persext')n='techo-persiana-exterior';
 else if(t==='techo'&&k==='mosq')n='techo-mosquitera';
 else if(t==='claraboya'&&k==='acc')n='claraboya-'+v;
 else if(k==='umbral')n='balconera-umbral';
 else if(k==='elev')n='corredera-elevadora';
 return n?'<img class="oimg" src="/img/cfg/'+n+'.webp" alt="" loading="lazy" onerror="this.remove()">':'';
}
function opt(k,v,label,sub,on,extra){
 return '<button type="button" class="cf-o'+(on?' on':'')+'" data-k="'+k+'" data-v="'+esc(v)+'"'+(extra||'')+'>'+optImg(k,v)+label+(sub?'<small>'+sub+'</small>':'')+'<span class="d" data-dk="'+k+'" data-dv="'+esc(v)+'"></span></button>';
}
function tog(k,label,sub,on){return '<button type="button" class="cf-o'+(on?' on':'')+'" data-k="'+k+'" data-v="'+(on?'0':'1')+'">'+optImg(k,'1')+label+(sub?'<small>'+sub+'</small>':'')+'<span class="d" data-dk="'+k+'" data-dv="1"></span></button>';}
function sec(t,help,body){return '<div class="cf-sec"><h3>'+t+'</h3>'+(help?'<p class="h">'+help+'</p>':'')+body+'</div>';}

function renderOpts(){
 var it=S.cur,R=S.mode==='rapido',h='';
 h+=sec('¿Dónde va?','Para que en el presupuesto sepamos cuál es cada una.','<div class="cf-opts">'+ROOMS.map(function(r){return opt('hab',r,r,'',it.hab===r);}).join('')+'</div>');
 if(it.tipo==='techo'){
  h+=sec('Tamaño','Si cambias una que ya tienes, mira la medida en la etiqueta de su marco.',
   '<div class="cf-opts">'+TECHO.map(function(t){return opt('talla',t[0],t[1],'',it.talla===t[0]);}).join('')+'</div>'+
   '<div class="cf-reco">¿Es una buhardilla nueva? Dinos cuántos m² tiene la habitación y te decimos qué tamaño necesita: <input type="number" id="cfM2" min="3" max="80" placeholder="m²" style="width:90px;min-height:38px;margin-left:6px"> <span id="cfM2r"></span></div>');
  h+=sec('Cómo se abre','',
   '<div class="cf-cards">'+opt('aper','giratoria','<b>Giratoria</b>','Gira por el centro. Fácil de limpiar desde dentro.',it.aper==='giratoria')+opt('aper','proyectante','<b>Proyectante</b>','Se abre hacia fuera desde abajo. Mejor vista, sin estorbar.',it.aper==='proyectante')+'</div>');
  h+=sec('Manual o con motor','La eléctrica y la solar se cierran solas si llueve.',
   '<div class="cf-opts">'+opt('acc','manual','Manual','',it.acc==='manual')+opt('acc','electrica','Eléctrica','Con mando',it.acc==='electrica')+opt('acc','solar','Solar','Sin cables',it.acc==='solar')+'</div>');
  h+=sec('Accesorios','',
   '<div class="cf-opts">'+tog('estor','Estor interior','Oscurece y da intimidad',it.estor)+tog('persext','Persiana exterior solar','Frena el calor del verano',it.persext)+tog('mosq','Mosquitera','',it.mosq)+'</div>');
  h+=sec('Tipo de obra','',
   '<div class="cf-opts">'+opt('obra','sustitucion','Cambio una que ya tengo','',it.obra==='sustitucion')+opt('obra','nuevo','Abrir un hueco nuevo','En el tejado',it.obra==='nuevo')+'</div>');
 } else if(it.tipo==='claraboya'){
  h+=sec('Tamaño','Medida del hueco en la cubierta.','<div class="cf-opts">'+CLARA.map(function(t){return opt('talla',t[0],t[1],'',it.talla===t[0]);}).join('')+'</div>');
  h+=sec('Fija o que se abra','','<div class="cf-opts">'+opt('acc','fija','Fija','Solo luz',it.acc==='fija')+opt('acc','electrica','Eléctrica','Ventila, y se cierra sola si llueve',it.acc==='electrica')+'</div>');
  h+=sec('Accesorios','','<div class="cf-opts">'+tog('estor','Estor interior','',it.estor)+'</div>');
  h+=sec('Tipo de obra','','<div class="cf-opts">'+opt('obra','sustitucion','Cambio una que ya tengo','',it.obra==='sustitucion')+opt('obra','nuevo','Abrir un hueco nuevo','',it.obra==='nuevo')+'</div>');
 } else {
  var t=TT[it.tipo];
  var sizes='<div class="cf-sizes">'+t.pre.map(function(p,i){var on=Math.round(it.w)===p.w&&Math.round(it.h)===p.h&&it.hojas===p.hojas;var tmp=clone(it);tmp.w=p.w;tmp.h=p.h;tmp.hojas=p.hojas;fixAper(tmp);
   return '<button type="button" class="cf-o'+(on?' on':'')+'" data-pre="'+i+'"><span class="cf-pf">'+foto(tmp)+'</span><b>'+p.n+'</b><small>'+p.d+' · '+p.w+' × '+p.h+' cm</small></button>';}).join('')+'</div>';
  if(R) h+=sec('Tamaño','Elige la que más se parezca. Las medidas exactas las tomamos nosotros gratis.',sizes);
  else {
   var hojasOpts=it.tipo==='fijo'?'':'<label class="f" style="flex:0 1 auto">Hojas<span class="cf-opts">'+[1,2,3,4].filter(function(n){return it.tipo==='corredera'?n>=2:n<=3;}).map(function(n){return '<button type="button" class="cf-o'+(it.hojas===n?' on':'')+'" data-k="hojas" data-v="'+n+'">'+n+'</button>';}).join('')+'</span></label>';
   h+=sec('Medidas','En centímetros, ancho por alto del hueco.',
    '<div class="cf-dim"><label class="f">Ancho (cm)<input type="number" inputmode="numeric" id="cfW" value="'+Math.round(it.w)+'"></label><label class="f">Alto (cm)<input type="number" inputmode="numeric" id="cfH" value="'+Math.round(it.h)+'"></label>'+hojasOpts+'</div><div class="cf-hint" id="cfDimHint"></div>'+
    '<details class="cf-howto"><summary>Cómo medir el hueco en 1 minuto</summary><div class="cf-howto-in">'+howto()+'<div>Mide el <b>ancho</b> arriba, en medio y abajo, y el <b>alto</b> a la izquierda, en el centro y a la derecha. Apunta siempre la medida <b>más pequeña</b>. No te preocupes por los milímetros: antes de fabricar vamos a medir con láser.</div></div></details>'+
    '<p class="cf-small">¿No las sabes? Usa un tamaño típico:</p>'+sizes);
  }
  if(it.tipo==='ventana'||it.tipo==='balconera'){
   if(R){
    var all=it.aper.every(function(a){return a===it.aper[0];})?it.aper[0]:'';
    h+=sec('Cómo se abren','La oscilobatiente se abre como una puerta y también se inclina para ventilar sin abrir del todo.',
     '<div class="cf-opts">'+opt('aperAll','osc','Oscilobatiente','Recomendada',all==='osc')+opt('aperAll','practicable','Abatible','Solo se abre',all==='practicable')+'</div>');
   } else {
    var hh='<div class="cf-hojas">';
    it.aper.forEach(function(a,i){hh+='<div class="cf-hoja"><span>Hoja '+(i+1)+'</span>'+APER.map(function(x){return '<button type="button" class="cf-o'+(a===x[0]?' on':'')+'" data-k="aper" data-v="'+i+':'+x[0]+'">'+x[1]+'<span class="d" data-dk="aper" data-dv="'+i+':'+x[0]+'"></span></button>';}).join('')+'</div>';});
    h+=sec('Apertura de cada hoja','En el dibujo ves cómo queda. Oscilobatiente: se abre y se inclina.',hh+'</div>');
    h+=sec('Fijo arriba o abajo','Un cristal fijo encima o debajo de las hojas, típico en ventanas muy altas.','<div class="cf-opts">'+FIJO.map(function(x){return opt('fijo',x[0],x[1],'',it.fijo===x[0]);}).join('')+'</div>');
   }
  }
  h+=sec('Material','',
   '<div class="cf-cards">'+['pvc','alu'].map(function(m){return opt('mat',m,'<b>'+MAT[m][0]+'</b>',MAT[m][1],it.mat===m);}).join('')+'</div>');
  if(!R) h+=sec('Gama','','<div class="cf-cards">'+['eco','confort','premium'].map(function(g){var G=GAMA[it.mat][g];return opt('gama',g,'<b>'+G[0]+'</b>','<ul><li>'+G[1].join('</li><li>')+'</li></ul>',it.gama===g);}).join('')+'</div>');
  h+=sec('Color','','<div class="cf-sw">'+COL.map(function(c){return '<button type="button" class="cf-o'+(it.col===c[0]?' on':'')+'" data-k="col" data-v="'+c[0]+'"><span class="c" style="background:'+c[2]+'"></span><span>'+c[1]+'<span class="d" data-dk="col" data-dv="'+c[0]+'" style="display:block"></span></span></button>';}).join('')+'</div>');
  var vids=R?VID.filter(function(v){return VID_RAPIDO.indexOf(v[0])>=0;}):VID;
  h+=sec('Cristal','Todos son doble cristal con cámara. Cambia lo que protegen.','<div class="cf-opts">'+vids.map(function(v){return opt('vid',v[0],v[1],v[2],it.vid===v[0]);}).join('')+'</div>');
  if(it.tipo!=='fijo'){
   var pers=R?PERS.filter(function(p){return ['no','manual','motor'].indexOf(p[0])>=0;}):PERS;
   h+=sec('Persiana','Con cajón aislado nuevo, para que no entre frío por arriba.','<div class="cf-opts">'+pers.map(function(p){return opt('pers',p[0],p[1],'',it.pers===p[0]);}).join('')+'</div>');
   var mq=R?[['no','Sin mosquitera'],[it.tipo==='ventana'?'enrollable':'plisada','Con mosquitera']]:MOSQ;
   h+=sec('Mosquitera','','<div class="cf-opts">'+mq.map(function(p){return opt('mosq',p[0],p[1],'',it.mosq===p[0]);}).join('')+'</div>');
  }
  if(!R&&it.tipo==='balconera')h+=sec('Extras','','<div class="cf-opts">'+tog('umbral','Umbral rebajado','Sin escalón, accesible',it.umbral)+'</div>');
  if(!R&&it.tipo==='corredera')h+=sec('Extras','','<div class="cf-opts">'+tog('elev','Corredera elevadora','Cierra más estanca y se desliza sola',it.elev)+'</div>');
 }
 h+=sec('Cantidad','¿Cuántas iguales?','<div class="cf-qty"><button type="button" data-q="-1" aria-label="Una menos">−</button><output id="cfQty">'+it.n+'</output><button type="button" class="p" data-q="1" aria-label="Una más">+</button></div>');
 $('cfOpts').innerHTML=h;
 dimHint();updateDeltas();
}
function howto(){return '<svg viewBox="0 0 150 130" aria-hidden="true"><rect x="25" y="15" width="100" height="100" fill="#CFE3F0" stroke="#12202B" stroke-width="3"/><g stroke="#C2410C" stroke-width="1.6"><path d="M25 26H125M25 65H125M25 104H125"/><path d="M36 15V115M75 15V115M114 15V115" stroke-dasharray="3 2"/></g></svg>';}
function dimHint(){
 var el=$('cfDimHint');if(!el||!S.cur)return;var it=S.cur,m=[];
 var hw=it.w/it.hojas;
 if(it.tipo!=='fijo'&&it.tipo!=='corredera'&&hw>130)m.push('Cada hoja mediría '+Math.round(hw)+' cm de ancho: mejor ponle una hoja más.');
 if(it.tipo!=='fijo'&&hw<35)m.push('Hojas de '+Math.round(hw)+' cm son muy estrechas: quita una hoja.');
 if(it.tipo==='corredera'&&hw>150)m.push('Hojas correderas de más de 150 cm pesan mucho: mejor 3 o 4 hojas.');
 el.textContent=m.join(' ');el.className='cf-hint'+(m.length?' bad':'');
}
/* Fondo de la vista previa: la habitacion elegida (o la fachada si se mira desde fuera). */
var ROOMBG={'Salón':'salon','Cocina':'cocina','Dormitorio':'dormitorio','Baño':'bano','Pasillo':'pasillo','Terraza':'terraza','Buhardilla':'salon','Otra':'salon'};
var BGOK={};S.view='in';
function bgName(it){
 if(it.tipo==='techo'||it.tipo==='claraboya')return null;
 if(S.view==='out')return 'fachada';
 return ROOMBG[it.hab]||({ventana:'dormitorio',balconera:'salon',corredera:'salon',fijo:'pasillo'}[it.tipo]);
}
function bgUrl(n){
 if(!n)return null;var u='/img/cfg/fondo-'+n+'.webp';
 if(BGOK[n]===true)return u;
 if(BGOK[n]===undefined){BGOK[n]='cargando';var im=new Image();im.onload=function(){BGOK[n]=true;refreshCur();};im.onerror=function(){BGOK[n]=false;};im.src=u;}
 return null;
}
function refreshCur(){
 if(!S.cur)return;
 var win=S.cur.tipo!=='techo'&&S.cur.tipo!=='claraboya';
 $('cfView').hidden=!win;
 document.querySelectorAll('#cfView button').forEach(function(b){b.classList.toggle('on',b.dataset.view===S.view);});
 var it=S.cur,bg=win?bgUrl(bgName(it)):null;
 if(!win){$('cfDraw').innerHTML='<div class="cf-stage solo">'+foto(it)+'</div>';renderBars(it);return;}
 var floor=it.tipo==='balconera'||(it.tipo==='corredera'&&it.h>=180);
 var k=Math.min(78/it.w,(floor?82:62)/it.h,0.62),w=it.w*k,h=it.h*k;
 var top=floor?(90-h):(46-h/2);
 $('cfDraw').innerHTML='<div class="cf-stage'+(bg?'':' nobg')+'"'+(bg?' style="background-image:url('+bg+')"':'')+'><div class="cf-win" style="left:'+(50-w/2)+'%;top:'+top+'%;width:'+w+'%;height:'+h+'%">'+foto(it)+'</div><span class="cf-dims">'+Math.round(it.w)+' × '+Math.round(it.h)+' cm</span></div>';
 renderBars(it);
}

/* ---------- Precio (servidor) ---------- */
var tmr=null,seq=0;
function payload(){
 var items=S.items.map(clone),probe=null;
 if(S.cur){if(S.curIdx>=0){items[S.curIdx]=clone(S.cur);probe=S.curIdx;}else{items.push(clone(S.cur));probe=items.length-1;}}
 return {items:items,probe:probe};
}
function schedule(){clearTimeout(tmr);tmr=setTimeout(fetchPrice,140);renderSummary();}
function fetchPrice(){
 var p=payload(),my=++seq;
 if(!p.items.length){S.res=null;renderSummary();return;}
 fetch('/api/configurador',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)})
  .then(function(r){if(!r.ok)throw 0;return r.json();})
  .then(function(j){if(my!==seq)return;S.res=j;S.res._probe=p.probe;S.err=false;renderSummary();updateDeltas();})
  .catch(function(){if(my!==seq)return;S.err=true;renderSummary();});
}
function updateDeltas(){
 var v=S.res&&S.res.variantes,cur=S.cur;
 document.querySelectorAll('#cfOpts .d').forEach(function(el){
  var k=el.dataset.dk,val=el.dataset.dv,txt='',cls='d';
  if(v&&v[k]&&v[k][val]!==undefined){var d=v[k][val];
   var on=el.closest('.cf-o')&&el.closest('.cf-o').classList.contains('on');
   if(on&&d===0)txt='Elegido';else if(d===0)txt='Mismo precio';else{txt=(d>0?'+':'−')+eur(Math.abs(d));cls+=d>0?' up':' dn';}
  }
  el.textContent=txt;el.className=cls;
 });
 var now=$('cfNow');
 if(S.res&&S.res._probe!=null&&S.res.lineas[S.res._probe]){var l=S.res.lineas[S.res._probe];now.textContent=eur(l.total);$('cfNowSub').textContent=(S.cur.n>1?S.cur.n+' × '+eur(l.unidad)+' · ':'')+'instalada, sin IVA';}
 else if(S.err){now.textContent='—';$('cfNowSub').textContent='No hemos podido calcularlo ahora.';}
}

/* ---------- Resumen ---------- */
function renderSummary(){
 var L=[],r=S.res,ok=r&&!S.err;
 var list=S.items.map(function(it,i){return {it:S.curIdx===i&&S.cur?S.cur:it,i:i,editing:S.curIdx===i};});
 if(S.cur&&S.curIdx<0)list.push({it:S.cur,i:S.items.length,editing:true,nuevo:true});
 if(!list.length)$('cfItems').innerHTML='<li class="cf-empty">Elige qué quieres poner y aquí irá apareciendo, con su precio.</li>';
 else $('cfItems').innerHTML=list.map(function(x){var it=x.it,p=ok&&r.lineas[x.i]?eur(r.lineas[x.i].total):'…';
  return '<li class="'+(x.editing?'editing':'')+'"><div class="cf-it"><span class="cf-pf sm">'+foto(it)+'</span><div><b>'+(it.n>1?it.n+' × ':'')+esc((it.hab?it.hab+' · ':'')+nombre(it))+'</b><small>'+esc(detalle(it))+'</small></div><span class="p">'+p+'</span>'+
  (x.nuevo?'<div class="cf-it-acts"><small style="color:#9A3412;font-weight:700">Configurando. Pulsa "Añadir al presupuesto".</small></div>':x.editing?'<div class="cf-it-acts"><small style="color:#9A3412;font-weight:700">Editando</small></div>':'<div class="cf-it-acts"><button type="button" data-edit="'+x.i+'">Cambiar</button><button type="button" data-dup="'+x.i+'">Duplicar</button><button type="button" data-del="'+x.i+'">Quitar</button></div>')+'</div></li>';}).join('');
 var n=list.reduce(function(s,x){return s+x.it.n;},0);
 $('cfCount').textContent=n?n+(n==1?' elemento':' elementos'):'Vacío';
 $('cfTot').hidden=!list.length;$('cfMbar').classList.toggle('empty',!list.length);
 if(ok){
  $('cfBase').textContent=eur2(r.base);$('cfIvaL').textContent='IVA ('+r.iva_pct+' %)';$('cfIva').textContent=eur2(r.iva);$('cfTotal').textContent=eur(r.total);
  $('cfCuota').textContent=eur(r.total/S.cuota)+' al mes';$('cfMTotal').textContent=eur(r.total);
  var c=r.comparar,cm=$('cfCmp');
  if(c&&Math.abs(c.pvc-c.alu)>=5){var alt=list.some(function(x){return x.it.mat==='alu';})&&!list.some(function(x){return x.it.mat==='pvc';})?'pvc':'alu';
   var mine=alt==='alu'?'pvc':'alu',d=c[alt]-c[mine];
   cm.hidden=false;cm.innerHTML='<b>Compara:</b> lo mismo en '+(alt==='alu'?'aluminio':'PVC')+' saldría por <b>'+eur(c[alt]*(1+r.iva_pct/100))+'</b> ('+(d>0?'+':'−')+eur(Math.abs(d*(1+r.iva_pct/100)))+'). '+(alt==='alu'?'Más luz y perfil más fino.':'Aísla más del frío y del ruido.')+' <button type="button" class="cf-link" data-swap="'+alt+'" style="background:none;border:0;padding:0;color:#C2410C;font:700 13px Inter,sans-serif;text-decoration:underline;cursor:pointer">Cambiar todo a '+(alt==='alu'?'aluminio':'PVC')+'</button>';}
  else cm.hidden=true;
  $('cfDate').innerHTML=fechaTxt();
 } else if(S.err){$('cfTotal').textContent='—';$('cfCuota').textContent='No hemos podido calcularlo ahora. Pídenos el presupuesto y te lo mandamos hoy.';}
}
function addLab(d,n){d=new Date(d);while(n>0){d.setDate(d.getDate()+1);var w=d.getDay();if(w&&w<6)n--;}return d;}
function fechaTxt(){
 var hoy=new Date(),a=addLab(hoy,14),b=addLab(hoy,20),m=function(d){return d.getDate()+' de '+d.toLocaleDateString('es-ES',{month:'long'});};
 var nav=hoy.getMonth()>=9&&b<=new Date(hoy.getFullYear(),11,20);
 return '<b>Montadas entre el '+m(a)+' y el '+m(b)+'</b> si nos lo encargas esta semana.'+(nav?' Llegas antes de Navidad.':'');
}

/* ---------- Acciones ---------- */
function setMode(m){
 S.mode=m;document.querySelectorAll('.cf-mode').forEach(function(b){var on=b.dataset.mode===m;b.classList.toggle('on',on);b.setAttribute('aria-checked',on?'true':'false');});
 if(S.cur){if(m==='rapido'&&S.cur.gama==='eco'&&S.cur.mat==='alu'){}renderOpts();$('cfEdSub').textContent=m==='rapido'?'Modo rápido: lo justo para darte un precio fiable.':'Modo exacto: con tus medidas y todas las opciones. Cada opción te dice lo que suma o resta.';}
}
document.querySelectorAll('.cf-mode').forEach(function(b){b.addEventListener('click',function(){setMode(b.dataset.mode);var y=$('cf').getBoundingClientRect().top+window.scrollY-80;window.scrollTo({top:y,behavior:'smooth'});});});

$('cfTypes').addEventListener('click',function(e){var b=e.target.closest('[data-type]');if(b)openEditor(b.dataset.type,-1);});
$('cfOpts').addEventListener('click',function(e){
 var b=e.target.closest('button');if(!b||!S.cur)return;var it=S.cur,k=b.dataset.k,v=b.dataset.v;
 if(b.dataset.q){it.n=Math.max(1,Math.min(50,it.n+(+b.dataset.q)));$('cfQty').textContent=it.n;schedule();return;}
 if(b.dataset.pre!=null){var p=TT[it.tipo].pre[+b.dataset.pre];it.w=p.w;it.h=p.h;it.hojas=p.hojas;fixAper(it);}
 else if(k==='hab')it.hab=it.hab===v?'':v;
 else if(k==='hojas'){it.hojas=+v;fixAper(it);}
 else if(k==='aper'){var q=v.split(':');it.aper[+q[0]]=q[1];}
 else if(k==='aperAll'){it.aper=it.aper.map(function(){return v;});}
 else if(k==='mat'){it.mat=v;}
 else if(['estor','persext','umbral','elev'].indexOf(k)>=0||(k==='mosq'&&it.tipo==='techo'))it[k]=v==='1';
 else if(k==='n'){}
 else if(k)it[k]=v;
 renderOpts();refreshCur();schedule();
});
$('cfOpts').addEventListener('input',function(e){
 var el=e.target,it=S.cur;if(!it)return;
 if(el.id==='cfW'||el.id==='cfH'){var v=+el.value;if(v>=30&&v<=600){if(el.id==='cfW')it.w=v;else it.h=v;dimHint();refreshCur();schedule();}}
 if(el.id==='cfM2'){var m=+el.value,r='';if(m>0){var t=TECHO_ROOM.filter(function(x){return m<=x[0];})[0][1];r='Te recomendamos <b>'+t.replace('x',' × ')+' cm</b>. ';if(m>18)r+='Para tanto espacio, mejor dos ventanas.';if(it.talla!==t){it.talla=t;refreshCur();schedule();document.querySelectorAll('#cfOpts [data-k=talla]').forEach(function(b){b.classList.toggle('on',b.dataset.v===t);});}}$('cfM2r').innerHTML=r;}
});
$('cfAdd').addEventListener('click',function(){
 if(!S.cur)return;var it=clone(S.cur);
 if(S.curIdx>=0)S.items[S.curIdx]=it;else S.items.push(it);
 S.cur=null;S.curIdx=-1;$('cfEditor').hidden=true;renderTypes();schedule();saveHash();
 var y=($(window.innerWidth<=980?'cfSide':'cfPick')).getBoundingClientRect().top+window.scrollY-80;window.scrollTo({top:y,behavior:'smooth'});
});
$('cfCancel').addEventListener('click',closeEditor);
$('cfView').addEventListener('click',function(e){var b=e.target.closest('[data-view]');if(!b)return;S.view=b.dataset.view;refreshCur();});
$('cfItems').addEventListener('click',function(e){
 var b=e.target.closest('button');if(!b)return;
 if(b.dataset.edit!=null){openEditor(null,+b.dataset.edit);return;}
 if(b.dataset.dup!=null){S.items.splice(+b.dataset.dup+1,0,clone(S.items[+b.dataset.dup]));}
 if(b.dataset.del!=null){S.items.splice(+b.dataset.del,1);if(S.curIdx>=0)closeEditor();}
 schedule();saveHash();
});
$('cfSide').addEventListener('click',function(e){
 var b=e.target.closest('button');if(!b)return;
 if(b.dataset.m){S.cuota=+b.dataset.m;document.querySelectorAll('#cfCuotaSeg button').forEach(function(x){x.classList.toggle('on',x===b);});renderSummary();}
 if(b.dataset.swap){var m=b.dataset.swap;S.items.forEach(function(it){if(it.mat)it.mat=m;});if(S.cur&&S.cur.mat){S.cur.mat=m;renderOpts();refreshCur();}schedule();saveHash();}
});
$('cfMGo').addEventListener('click',function(){var y=$('cfSide').getBoundingClientRect().top+window.scrollY-70;window.scrollTo({top:y,behavior:'smooth'});});

/* ---------- Guardar y compartir ---------- */
function saveHash(){try{var d=btoa(unescape(encodeURIComponent(JSON.stringify({m:S.mode,i:S.items}))));history.replaceState(null,'','#p='+d);}catch(e){}}
function loadHash(){try{var m=location.hash.match(/#p=(.+)/);if(!m)return;var d=JSON.parse(decodeURIComponent(escape(atob(m[1]))));if(d.m)S.mode=d.m;if(Array.isArray(d.i))S.items=d.i.slice(0,60).filter(function(x){return x&&TT[x.tipo];});}catch(e){}}
$('cfShare').addEventListener('click',function(){
 saveHash();var url=location.href,t='Mi presupuesto de ventanas con AMS Cerramientos';
 if(navigator.share){navigator.share({title:t,url:url}).catch(function(){});}
 else if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){$('cfShare').textContent='Enlace copiado';setTimeout(function(){$('cfShare').textContent='Guardar o compartir';},2200);});}
});

/* ---------- Datos, PDF y WhatsApp ---------- */
var C={};
$('cfLead').addEventListener('click',function(){if(!S.items.length&&S.cur){$('cfAdd').click();}$('cfDlg').showModal();});
function valid(){
 C={nombre:$('cfNombre').value.trim(),tel:$('cfTel').value.trim(),email:$('cfEmail').value.trim(),loc:$('cfLoc').value.trim()};var e=[];
 if(!C.nombre)e.push('tu nombre');if(C.tel.replace(/\D/g,'').length<9)e.push('un teléfono de 9 cifras');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(C.email))e.push('un correo válido');if(!C.loc)e.push('la localidad');if(!$('cfOk').checked)e.push('aceptar el uso de tus datos');
 if(!S.items.length)e.push('al menos una ventana en el presupuesto');
 var b=$('cfErr');if(e.length){b.textContent='Nos falta: '+e.join(', ')+'.';b.classList.add('show');return false;}b.classList.remove('show');return true;
}
function resumen(){
 var r=S.res,L=S.items.map(function(it,i){return '- '+(it.n>1?it.n+' × ':'')+(it.hab?it.hab+': ':'')+nombre(it)+', '+detalle(it)+(r&&r.lineas[i]?' ('+eur(r.lineas[i].total)+' + IVA)':'');});
 if(r)L.push('','Total: '+eur(r.total)+' con IVA');return L.join('\n');
}
$('cfWa').addEventListener('click',function(){
 if(!valid())return;
 var t='Hola, AMS Cerramientos. He configurado mis ventanas en vuestra web:\n\n'+resumen()+'\n\nSoy '+C.nombre+', teléfono '+C.tel+', correo '+C.email+'. La obra está en '+C.loc+'.\nMe gustaría que vinierais a medir.';
 window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(t),'_blank','noopener');
});
$('cfPdf').addEventListener('click',function(){
 if(!valid())return;var r=S.res;if(!r){return;}
 var hoy=new Date(),ref='AMS-'+hoy.getFullYear().toString().slice(2)+String(hoy.getMonth()+1).padStart(2,'0')+String(hoy.getDate()).padStart(2,'0')+'-'+String(Math.floor(Math.random()*900+100));
 var rows=S.items.map(function(it,i){return '<tr><td style="width:70px">'+foto(it,'pdfimg')+'</td><td><b>'+esc((it.hab?it.hab+' · ':'')+nombre(it))+'</b><br>'+esc(detalle(it))+'</td><td class="r">'+it.n+'</td><td class="r">'+eur(r.lineas[i].unidad)+'</td><td class="r">'+eur(r.lineas[i].total)+'</td></tr>';}).join('');
 var base=location.origin;
 $('cfPrint').innerHTML='<div class="pr-head"><img src="/img/logo-ams-color.svg" alt="AMS Cerramientos" class="pr-logo"><div class="pr-title"><h1>Presupuesto orientativo</h1><div>Referencia '+ref+' · '+hoy.toLocaleDateString('es-ES')+' · válido 30 días</div></div></div>'+
  '<div class="pr-for"><span>Para</span><b>'+esc(C.nombre)+'</b> · '+esc(C.tel)+' · '+esc(C.email)+' · Obra en '+esc(C.loc)+'</div>'+
  '<table><thead><tr><th></th><th>Concepto</th><th class="r">Uds.</th><th class="r">Precio</th><th class="r">Importe</th></tr></thead><tbody>'+rows+'</tbody><tfoot><tr class="tot"><td></td><td>Base imponible</td><td></td><td></td><td class="r">'+eur2(r.base)+'</td></tr><tr class="tot"><td></td><td>IVA ('+r.iva_pct+' %)</td><td></td><td></td><td class="r">'+eur2(r.iva)+'</td></tr><tr class="tot gt"><td></td><td>Total</td><td></td><td></td><td class="r">'+eur2(r.total)+'</td></tr></tfoot></table>'+
  '<div class="pr-inc"><b>Qué incluye</b><ul><li>Medición láser en tu casa</li><li>Fabricación a medida en nuestro taller</li><li>Instalación con nuestro equipo</li><li>Retirada de lo viejo y escombros</li><li>Remates y sellado</li><li>2 años de garantía de instalación</li></ul><p>Financiación en 3, 6 o 12 meses sin intereses ('+eur(r.total/12)+' al mes a 12 meses).</p></div>'+
  '<p class="note">Presupuesto orientativo calculado con la información facilitada. El precio definitivo se cierra por escrito después de medir. Instalamos en la Comunidad de Madrid y en Guadalajara.</p>'+
  '<div class="pr-foot"><b>AMS Cerramientos y Servicios S.L.</b> · C/ Siete Picos 28, 28810 Villalbilla (Madrid) · 639 78 82 20 · info@amscerramientos.es<br>Tus datos se usan solo para este presupuesto. Política de privacidad: '+base+'/privacidad</div>';
 var imgs=[].slice.call($('cfPrint').querySelectorAll('img'));
 Promise.race([Promise.all(imgs.map(function(im){return new Promise(function(ok){if(im.complete)return ok();im.onload=im.onerror=ok;});})),new Promise(function(ok){setTimeout(ok,2500);})]).then(function(){window.print();});
});

/* ---------- Arranque ---------- */
function fetchFrom(){
 var its=TYPES.map(function(t){var it=defItem(t.id);if(t.pre){var p=t.pre[0];it.w=p.w;it.h=p.h;it.hojas=p.hojas;fixAper(it);}if(t.id==='techo')it.talla='55x78';if(t.id==='claraboya')it.talla='60';it.vid='doble';it.gama=it.mat==='alu'?'confort':'eco';return it;});
 fetch('/api/configurador',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:its})}).then(function(r){return r.json();}).then(function(j){
  TYPES.forEach(function(t,i){var el=$('cfFrom_'+t.id);if(el&&j.lineas&&j.lineas[i])el.textContent='Instalada desde '+eur(j.lineas[i].unidad);});FROM=j;}).catch(function(){});
}
var FROM=null,_rt=renderTypes;renderTypes=function(){_rt();if(FROM)TYPES.forEach(function(t,i){var el=$('cfFrom_'+t.id);if(el&&FROM.lineas[i])el.textContent='Instalada desde '+eur(FROM.lineas[i].unidad);});};
loadHash();setMode(S.mode);renderTypes();schedule();fetchFrom();
})();
