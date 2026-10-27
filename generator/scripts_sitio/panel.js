(function(){
var D=__DATA__;
var $=function(s){return document.querySelector(s)};
var num=function(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')};
var eur=function(n){return num(n)+' €'};
var LOGO={'Google Analytics':'google-analytics-icono.png','Search Console':'google-search-console.png','Google Ads':'google-ads-icono.png','Ficha de Google':'google-business-profile-icono.png','Bing':'bing.svg','Instagram':'instagram.jpg','Facebook':'facebook.png','TikTok':'tiktok.png','WhatsApp':'whatsapp-business.jpg','Resend':'resend.svg','Semrush':'semrush.svg','ChatGPT':'openai.svg','PageSpeed':'pagespeedinsights.svg','Vercel':'vercel.svg'};
function logo(n,t){return '<img class="lg-logo" src="/img/panel/'+LOGO[n]+'" alt="Logotipo de '+n+'" width="'+t+'" height="'+t+'" loading="lazy">'}
function delta(v,inv,suf){var bueno=inv?v<0:v>0;return '<span class="pn-delta '+(bueno?'pn-sube':'pn-baja')+'">'+(v>0?'+':'')+v+(suf||'')+'</span>'}
function caja(t,f,h,c){return '<div class="pn-caja '+(c||'')+'"><div class="pn-caja-cabeza"><h2>'+t+'</h2>'+(f?'<span class="pn-fuente">'+f+'</span>':'')+'</div>'+h+'</div>'}
function sum(a){return a.reduce(function(x,y){return x+y},0)}
function cuenta(el,val){if(!el)return;var d=el._v||0;el._v=val;var t0=performance.now();(function p(t){var k=Math.min(1,(t-t0)/700);el.textContent=num(d+(val-d)*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(p)})(t0)}
function grafico(datos,linea){var max=Math.max.apply(null,datos),maxL=Math.max.apply(null,linea),w=600,h=180,paso=w/datos.length,s='';
 datos.forEach(function(v,i){var a=(v/max)*(h-40);s+='<g data-i="'+i+'"><rect x="'+(i*paso)+'" y="0" width="'+paso+'" height="'+(h-16)+'" fill="transparent"/><rect class="pn-barra-anim b" x="'+(i*paso+3)+'" y="'+(h-16-a)+'" width="'+(paso-6)+'" height="'+a+'" rx="3" fill="#C2410C" opacity=".9" style="animation-delay:'+(i*18)+'ms"/></g>'});
 var pts=linea.map(function(v,i){return (i*paso+paso/2)+','+(h-16-(v/maxL)*(h-40))}).join(' ');
 return '<div class="pn-grafico-caja"><svg viewBox="0 0 '+w+' '+h+'" class="pn-grafico" role="img" aria-label="Presupuestos y visitas por día (ejemplo)" id="gr">'+s+'<polyline points="'+pts+'" fill="none" stroke="#1D6FB8" stroke-width="2.5" stroke-linejoin="round" class="pn-linea-anim"/><line x1="0" y1="'+(h-16)+'" x2="'+w+'" y2="'+(h-16)+'" stroke="#d5dde7"/><text x="0" y="'+(h-2)+'" font-size="11" fill="#6a7786">Hace 30 días</text><text x="'+w+'" y="'+(h-2)+'" font-size="11" fill="#6a7786" text-anchor="end">Hoy</text></svg><p class="pn-tooltip" id="tt">Pasa el dedo o el ratón por las barras para ver cada día.</p></div>'}
function enlazaGrafico(datos,linea){var g=$('#gr');if(!g)return;var tt=$('#tt');function mostrar(i){var bs=g.querySelectorAll('.b');for(var k=0;k<bs.length;k++)bs[k].setAttribute('opacity',k===i?'.9':'.35');tt.innerHTML='<b>'+(i===datos.length-1?'Hoy':'Hace '+(datos.length-1-i)+' días')+'</b>: '+datos[i]+' presupuestos y '+linea[i]+' visitas'}
 g.querySelectorAll('g').forEach(function(e){var i=+e.getAttribute('data-i');e.addEventListener('mouseenter',function(){mostrar(i)});e.addEventListener('click',function(){mostrar(i)})});
 g.addEventListener('mouseleave',function(){g.querySelectorAll('.b').forEach(function(b){b.setAttribute('opacity','.9')});tt.textContent='Pasa el dedo o el ratón por las barras para ver cada día.'})}
function rosco(datos,centro,sub){var tot=sum(datos.map(function(d){return d[1]})),ac=0,r=52,c=2*Math.PI*r,s='';datos.forEach(function(d){var l=d[1]/tot*c;s+='<circle cx="70" cy="70" r="'+r+'" fill="none" stroke="'+d[2]+'" stroke-width="22" stroke-dasharray="'+l+' '+(c-l)+'" stroke-dashoffset="'+(-ac)+'" transform="rotate(-90 70 70)"/>';ac+=l});
 return '<svg viewBox="0 0 140 140" class="pn-rosco" role="img" aria-label="'+sub+'">'+s+'<text x="70" y="68" text-anchor="middle" font-size="24" font-weight="800" fill="#12202B">'+centro+'</text><text x="70" y="87" text-anchor="middle" font-size="11" fill="#6a7786">'+sub+'</text></svg>'}
function linea(serie,color){var mn=Math.min.apply(null,serie),mx=Math.max.apply(null,serie),w=220,h=56,p=serie.map(function(v,i){return (i/(serie.length-1)*w)+','+(h-4-((v-mn)/Math.max(1,mx-mn))*(h-8))}).join(' ');return '<svg viewBox="0 0 '+w+' '+h+'" class="pn-mini" aria-hidden="true"><polygon points="0,'+h+' '+p+' '+w+','+h+'" fill="'+color+'" opacity=".1"/><polyline points="'+p+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linejoin="round" class="pn-linea-anim"/></svg>'}
function medidor(v,et){var r=30,c=2*Math.PI*r,col=v>=90?'#17602f':v>=50?'#e67e22':'#c0392b';return '<div class="pn-medidor"><svg viewBox="0 0 76 76" width="76" height="76" aria-hidden="true"><circle cx="38" cy="38" r="30" fill="none" stroke="#eef1f4" stroke-width="7"/><circle cx="38" cy="38" r="30" fill="none" stroke="'+col+'" stroke-width="7" stroke-dasharray="'+(v/100*c)+' '+c+'" transform="rotate(-90 38 38)" stroke-linecap="round"/><text x="38" y="44" text-anchor="middle" font-size="18" font-weight="800" fill="'+col+'">'+v+'</text></svg><small>'+et+'</small></div>'}
function barrasH(items,max,color){return '<ul class="pn-barras-h">'+items.map(function(x){return '<li><span>'+x[0]+'</span><span class="pn-pista"><span style="width:'+(x[1]/max*100)+'%;'+(color?'background:'+color:'')+'"></span></span><b>'+x[2]+'</b></li>'}).join('')+'</ul>'}
function tres(a,cls){return '<div class="pn-tres '+(cls||'')+'">'+a.map(function(x){return '<div><b>'+x[0]+'</b><small>'+x[1]+'</small></div>'}).join('')+'</div>'}
function kpi(t,b,s,g,id){return '<div class="pn-kpi '+(g?'pn-kpi-grande':'')+'"><small>'+t+'</small><b'+(id?' id="'+id+'"':'')+'>'+b+'</b><span>'+s+'</span></div>'}

var cons30=sum(D.cons),vis30=sum(D.vis);
var totAds=D.camp.reduce(function(a,c){return {inv:a.inv+c.inv,cons:a.cons+c.cons}},{inv:0,cons:0});
var otras=D.meta.inv+D.tiktok.inv;
var iaAhora=D.ia[D.ia.length-1];
var hoy={vis:D.hoy.vis,cons:D.hoy.cons,clics:D.hoy.clics},ahora=9,seg=0,tab='resumen',feed=[],cont=100;
D.eventos.slice(0,5).forEach(function(e,i){feed.push({id:i,tipo:e[0],t:e[1],d:e[2],hace:'hace '+((i+1)*2)+' min'})});

function feedHtml(){return feed.map(function(e){return '<li class="pn-ev pn-ev-'+e.tipo+'"><i></i><span><b>'+e.t+'</b><small>'+e.d+' · '+e.hace+'</small></span></li>'}).join('')}

var T={};
T.resumen=function(){
 return '<section class="pn-kpis">'+
  kpi('Presupuestos pedidos hoy',hoy.cons,num(cons30)+' en los últimos 30 días · '+delta(34),1,'k-cons')+
  kpi('Visitas hoy',hoy.vis,num(vis30)+' en 30 días · '+delta(34,0,' %'),0,'k-vis')+
  kpi('Pulsaciones en llamar y WhatsApp hoy',hoy.clics,'Cada una, con su origen',0,'k-clics')+
  kpi('Coste por presupuesto (Google Ads)',eur(Math.round(totAds.inv/totAds.cons)),delta(-3,1,' €')+' en un mes')+
  kpi('Nota en Google','4,6 ★',delta(8)+' reseñas este mes · objetivo 4,8')+
  kpi('Te nombran las IA',iaAhora+' de 15','preguntas vigiladas')+'</section>'+
 '<section class="pn-fila pn-2">'+
  caja('Presupuestos y visitas, día a día','Tu web y Google Analytics · al momento',grafico(D.cons,D.vis)+'<p class="pn-leyenda"><i style="background:#C2410C"></i> Presupuestos <i style="background:#1D6FB8"></i> Visitas</p>'+tres([[Math.max.apply(null,D.cons),'presupuestos, el mejor día'],[(cons30/30).toFixed(1).replace('.',','),'presupuestos al día de media'],['<span class="pn-sube">+'+Math.round((hoy.cons/(cons30/30)-1)*100)+' %</span>','hoy frente a la media']],'pn-bajo-grafico'))+
  caja('Ahora mismo en tu web','En directo','<ul class="pn-feed" id="feed">'+feedHtml()+'</ul>','pn-feed-caja')+'</section>'+
 '<section class="pn-fila pn-3">'+
  caja('De dónde vienen los presupuestos','Últimos 30 días','<div class="pn-origen">'+rosco(D.origen,String(cons30),'presupuestos')+'<ul>'+D.origen.map(function(o){return '<li><i style="background:'+o[2]+'"></i><span>'+o[0]+'</span><b>'+o[1]+'</b></li>'}).join('')+'</ul></div>')+
  caja('Tu dinero, este mes','Google Ads, Meta y TikTok','<div class="pn-dinero"><div><small>Google Ads</small><b>'+eur(totAds.inv)+'</b><span>'+totAds.cons+' presupuestos</span></div><div><small>Instagram, Facebook y TikTok</small><b>'+eur(otras)+'</b><span>'+(D.meta.cons+D.tiktok.cons)+' presupuestos</span></div></div><div class="pn-barra-pres"><span style="width:'+((totAds.inv+otras)/1000*100)+'%"></span></div><p class="pn-nota-peq">'+eur(totAds.inv+otras)+' de 1.000 € de tope. Cada euro, con el presupuesto que trae. Tú decides el tope.</p>')+
  caja('Tu web, en forma','Comprobado hace 6 min','<div class="pn-salud">'+medidor(94,'Velocidad móvil')+medidor(96,'Accesibilidad')+'<div class="pn-medidor"><span class="pn-agentes">3/3</span><small>Agentes de IA</small></div></div><ul class="pn-checks"><li>En línea: 99,99 % este mes</li><li>Copia guardada hace 2 horas</li><li>0 enlaces rotos</li></ul>')+'</section>';
};
T.clientes=function(){
 var emb=[['Visitas',vis30],['Usan una herramienta',520],['Dejan sus datos o escriben',cons30],['Aceptan una visita',38],['Te contratan (lo apuntas tú)',17]];
 return caja('El camino hasta cliente','Últimos 30 días','<div class="pn-embudo">'+emb.map(function(e,i){return '<div class="pn-embudo-paso" style="width:'+(100-i*15)+'%"><b>'+num(e[1])+'</b><span>'+e[0]+'</span></div>'}).join('')+'</div>').replace('pn-caja ','pn-caja ')+'<div style="height:12px"></div>'+
 caja('Últimos presupuestos','Formularios, WhatsApp, llamadas y chat · al momento','<div class="pn-leads">'+D.leads.map(function(l){var k=l[5].split(' ')[0].toLowerCase();return '<div class="pn-lead"><span class="pn-avatar">'+l[0]+'</span><span class="pn-lead-txt"><b>'+l[1]+'</b><small>'+l[2]+' · '+l[3]+' · '+l[4]+'</small></span><span class="pn-estado pn-e-'+k+'">'+l[5]+'</span></div>'}).join('')+'</div>')+'<div style="height:12px"></div>'+
 '<section class="pn-fila pn-3">'+
  caja('Correos de seguimiento','Resend · al momento',tres([[D.correos.env,'enviados'],['61 %','los abren'],[D.correos.cons,'presupuestos desde un correo']])+barrasH(D.correos.lista.map(function(c){return [c[0],c[1],c[1]+' %']}),100))+
  caja('El asistente de la web','Chat · al momento',tres([[D.chat.conv,'conversaciones'],[D.chat.llamar,'piden que les llames'],[D.chat.fuera+' %','fuera de horario']])+'<p class="pn-nota-peq"><b>Lo que más preguntan:</b> '+D.chat.preguntan+'</p>')+
  caja('Tus herramientas','Usos en 30 días',barrasH(D.herr.map(function(h){return [h[0],h[1],h[1]]}),D.herr[0][1],'#17602f')+'<p class="pn-nota-peq">Una de cada cinco personas que usan una herramienta acaba escribiéndote.</p>')+'</section>';
};
T.anuncios=function(){
 var tot=totAds.inv+otras,con=totAds.cons+D.meta.cons+D.tiktok.cons;
 return '<section class="pn-kpis pn-kpis-4">'+kpi('Invertido este mes',eur(tot),'Google Ads, Meta y TikTok',1)+kpi('Presupuestos desde anuncios',con,delta(11)+' frente al mes pasado')+kpi('Coste por presupuesto',eur(Math.round(tot/con)),delta(-3,1,' €'))+kpi('Palabras que no traen clientes',31,'bloqueadas este mes')+'</section>'+
 caja('Google Ads, campaña a campaña','Google Ads · actualizado hace 3 horas','<div class="pn-tabla"><div class="pn-tabla-cabeza"><span>Campaña</span><span>Invertido</span><span>Clics</span><span>Presupuestos</span><span>Coste por presupuesto</span></div>'+D.camp.map(function(c){return '<div class="pn-tabla-fila"><span class="pn-camp">'+c.n+'</span><span data-t="Invertido">'+eur(c.inv)+'</span><span data-t="Clics">'+c.clics+'</span><span data-t="Presupuestos">'+c.cons+'</span><span data-t="Coste por presupuesto"><b>'+eur(Math.round(c.inv/c.cons))+'</b> '+delta(c.tend,1,' %')+'</span></div>'}).join('')+'</div>')+'<div style="height:12px"></div>'+
 '<section class="pn-fila pn-2">'+caja('Instagram, Facebook y TikTok','Meta y TikTok · al momento',tres([[num(D.meta.alcance),'personas alcanzadas en la zona'],[D.meta.clics+D.tiktok.clics,'clics'],[eur(Math.round(otras/(D.meta.cons+D.tiktok.cons))),'por presupuesto']]))+
 caja('Lo que hemos ajustado','Esta semana','<ul class="pn-checks"><li>Pausada «ventanas baratas»: curiosos, no clientes</li><li>Subida la puja en «ventanas pvc alcalá de henares»</li><li>Nuevo anuncio que lleva directo a la calculadora</li></ul>')+'</section>';
};
T.google=function(){
 return '<section class="pn-kpis pn-kpis-4">'+kpi('Visitas desde Google','860','al mes · antes 190',1)+kpi('Búsquedas en primera página','41',delta(28)+' desde el inicio')+kpi('Autoridad del dominio','11','antes 6')+kpi('Artículos publicados','12','este mes')+'</section>'+
 '<section class="pn-fila pn-2">'+caja('Tus búsquedas clave','Search Console · hace 2 días','<ul class="pn-busquedas">'+D.busq.map(function(b){return '<li><span class="pn-q">'+b[0]+'<small>'+num(b[1])+' búsquedas al mes · antes en el '+b[3]+'.º</small></span><span class="pn-pos"><b>'+b[2]+'.º</b><span class="pn-delta pn-sube">▲ '+(b[3]-b[2])+'</span></span></li>'}).join('')+'</ul>')+
 caja('Te recomiendan las IA','ChatGPT, Gemini y Google · cada semana','<p class="pn-ia-cifra"><b>'+iaAhora+'</b> de 15 preguntas</p><div class="pn-ia-barras" aria-label="Evolución semanal (ejemplo)">'+D.ia.map(function(v,i){return '<span style="height:'+(v/15*100)+'%" title="Semana '+(i+1)+': '+v+'"></span>'}).join('')+'</div><p class="pn-nota-peq">ChatGPT ya te nombra en «¿Qué empresa de cerramientos de terraza me recomiendas en Alcalá de Henares?». Llegan 6 visitas al mes desde ChatGPT.</p>')+'</section>'+
 caja('Tus reseñas','Ficha de Google · hoy','<div class="pn-resenas"><p class="pn-ia-cifra"><b>4,6</b> ★ con 52 reseñas · objetivo 4,8</p><div class="pn-progreso"><span style="width:55%"></span></div><p class="pn-nota-peq">Faltan <b>11 reseñas de cinco estrellas</b> para llegar al 4,7. Este mes: 8 nuevas, todas contestadas con tu visto bueno. 31 pedidas por WhatsApp.</p></div>');
};
T.redes=function(){
 return '<section class="pn-redes">'+D.redes.map(function(r){var u=r.serie[r.serie.length-1],i=r.serie[0];return '<div class="pn-red"><div class="pn-red-cabeza">'+logo(r.red,30)+'<span><b>'+r.red+'</b><small>Seguidores</small></span><span class="pn-red-num"><span class="cnt" data-v="'+u+'">0</span><span class="pn-delta pn-sube">+'+num(u-i)+'</span></span></div>'+linea(r.serie,r.color)+'<p class="pn-nota-peq">'+r.extra+'</p></div>'}).join('')+'</section>'+
 caja('Este mes en redes','Instagram, Facebook y TikTok',tres([[14,'publicaciones'],[5,'vídeos montados por nosotros'],['31.200','reproducciones'],[D.meta.cons+D.tiktok.cons,'presupuestos desde redes']],'pn-cuatro'));
};
T.web=function(){
 return caja('Velocidad y calidad','PageSpeed de Google · comprobado hace 6 min','<div class="pn-salud pn-salud-grande">'+medidor(94,'Velocidad móvil')+medidor(96,'Accesibilidad')+medidor(96,'Buenas prácticas')+medidor(100,'SEO')+'<div class="pn-medidor"><span class="pn-agentes">3/3</span><small>Navegación con IA</small></div></div><p class="pn-nota-peq">Lo comprobamos solos cada día. Si alguna nota baja, nos llega un aviso y lo arreglamos antes de que lo notes. Tu web anterior sacaba 56 de velocidad en el móvil.</p>')+'<div style="height:12px"></div>'+
 '<section class="pn-fila pn-3">'+caja('Seguridad','Al momento','<ul class="pn-checks"><li>Sin WordPress ni complementos que atacar</li><li>Certificado de seguridad válido</li><li>Sin panel de administración que forzar</li></ul>')+
 caja('Copias de seguridad','Vercel','<p class="pn-ia-cifra"><b>'+D.versiones+'</b> versiones guardadas</p><p class="pn-nota-peq">La última, hace 2 horas. Podemos volver a cualquiera en unos minutos: la de ayer, la de hace un mes o la de hace cuatro.</p>')+
 caja('Siempre en línea','Este mes','<p class="pn-ia-cifra"><b>99,99 %</b></p><p class="pn-nota-peq">0 enlaces rotos. Las direcciones antiguas de tu web llevan a la página nueva que les corresponde.</p>')+'</section>'+
 caja('Lo que vemos en Clarity','Mapas de calor y grabaciones anónimas','<ul class="pn-avisos"><li class="pn-aviso">El 41 % de quien llega a cerramientos de terraza desde un anuncio no baja hasta la calculadora. Lo hemos subido arriba.</li><li class="pn-bien">La calculadora de ventanas es lo más pulsado de la portada en el móvil.</li><li class="pn-bien">Nadie se atasca ya en el formulario de contacto: lo terminan 9 de cada 10.</li></ul>');
};
T.gastos=function(){
 var G=[['Nuestros honorarios','0 €','Web, SEO, anuncios, redes, diseño, correos e informes: todo incluido, sin coste para ti','incluido'],['Servidor y mantenimiento de la web','0 €','Incluido: alojamiento, copias y seguridad','incluido'],['SEO (dentro y fuera de tu web)','0 €','Incluido: contenidos, técnico, local y análisis de enlaces','incluido'],['Google Ads',eur(totAds.inv),'Lo pagas tú a Google, con tu tarjeta','variable'],['Instagram, Facebook y TikTok',eur(otras),'Lo pagas tú a cada red, con tu tarjeta','variable'],['Notas de prensa, artículos en medios y vídeos','0 €','Opcional: te pasamos el presupuesto antes y lo pagas tú al medio o al profesional','opcional'],['Asistente de IA','4 €','Por uso: '+D.chat.conv+' conversaciones este mes','variable'],['Dominio en IONOS','≈ 12–33 €/año','Lo pagas tú, como hasta ahora','fijo']];
 return caja('Lo que te cuesta tu marketing este mes','Octubre · todo en un solo sitio','<div class="pn-gastos">'+G.map(function(g){return '<div class="pn-gasto pn-g-'+g[3]+'"><span><b>'+g[0]+'</b><small>'+g[2]+'</small></span><strong>'+g[1]+'</strong></div>'}).join('')+'</div><p class="pn-nota-peq">Este mes, en total: <b>'+eur(totAds.inv+otras+4)+'</b>, todo en anuncios y en el asistente. Nuestro trabajo: <b>0 €</b>. Cada euro, con el presupuesto que trae.</p>')+'<div style="height:12px"></div>'+
 '<section class="pn-fila pn-2">'+caja('Mes a mes','Lo que pagas aparte de nuestro trabajo','<div class="pn-meses">'+D.gm.map(function(m,i){var t=m[0]+m[1]+m[2];return '<div class="pn-mes" title="'+D.meses[i]+': '+eur(t)+'"><span class="pn-mes-col"><i style="height:'+(m[2]/1000*100)+'%;background:#f5a623"></i><i style="height:'+(m[1]/1000*100)+'%;background:#7a4fb3"></i><i style="height:'+(m[0]/1000*100)+'%;background:#C2410C"></i></span><b>'+eur(t)+'</b><small>'+D.meses[i]+'</small></div>'}).join('')+'</div><p class="pn-leyenda"><i style="background:#C2410C"></i> Google Ads <i style="background:#7a4fb3"></i> Meta y TikTok <i style="background:#f5a623"></i> Notas de prensa</p>')+
 caja('Lo que te cuesta cada presupuesto','Gasto aparte ÷ presupuestos pedidos','<ul class="pn-barras-h">'+D.gm.map(function(m,i){var c=Math.round((m[0]+m[1]+m[2])/m[3]);return '<li><span>'+D.meses[i]+'</span><span class="pn-pista"><span style="width:'+(c/25*100)+'%;background:#1D6FB8"></span></span><b>'+eur(c)+'</b></li>'}).join('')+'</ul><p class="pn-nota-peq">En julio se compró un pack de notas de prensa de ejemplo: sube ese mes y luego trae visitas desde Google sin pagar.</p>')+'</section>';
};
T.equipo=function(){
 return '<section class="pn-kpis pn-kpis-4">'+kpi('Tareas hechas este mes','<span class="cnt" data-v="74">0</span>','sin que tengas que pedirlas',1)+kpi('Cambios en la web','22','el mismo día que se pidieron')+kpi('Tiempo medio de respuesta','2 h 15 min','a lo que nos pides')+kpi('Informes enviados','4 + 30','semanales y diarios')+'</section>'+
 caja('Lo que hemos hecho por ti','Nuestro equipo · al momento','<ul class="pn-actividad">'+D.act.map(function(a){return '<li><span class="pn-tipo">'+a[1]+'</span><span>'+a[2]+'<small>'+a[0]+'</small></span></li>'}).join('')+'</ul>');
};

function pinta(){
 $('#vista').innerHTML='<div class="pn-vista">'+T[tab]()+'</div>';
 var m0={'k-cons':hoy.cons,'k-vis':hoy.vis,'k-clics':hoy.clics};for(var k0 in m0){var e0=$('#'+k0);if(e0)e0._v=m0[k0]}
 if(tab==='resumen')enlazaGrafico(D.cons,D.vis);
 document.querySelectorAll('.cnt').forEach(function(e){cuenta(e,+e.getAttribute('data-v'))});
 document.querySelectorAll('#pest button').forEach(function(b){var a=b.getAttribute('data-t')===tab;b.className=a?'activo':'';b.setAttribute('aria-selected',a)});
}
$('#pest').innerHTML=D.pest.map(function(p){return '<button role="tab" data-t="'+p[0]+'">'+p[1]+'</button>'}).join('');
$('#pest').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;tab=b.getAttribute('data-t');pinta()});
$('#conectado-t').textContent=D.conectado.length+' herramientas conectadas';
$('#conectado').innerHTML=D.conectado.map(function(c){return '<span class="pn-chip" title="'+c[0]+': '+c[1]+'">'+logo(c[0],20)+'<span>'+c[0]+'</span><i class="pn-ok" aria-label="conectado"></i></span>'}).join('');
cuenta($('#ahora'),ahora);
setInterval(function(){seg++;var s=$('#seg');if(s)s.textContent=seg},1000);
var idx=5;
setInterval(function(){var e=D.eventos[idx%D.eventos.length];idx++;
 feed=[{id:cont++,tipo:e[0],t:e[1],d:e[2],hace:'ahora mismo'}].concat(feed.slice(0,6).map(function(x,n){return {id:x.id,tipo:x.tipo,t:x.t,d:x.d,hace:n===0?'hace unos segundos':x.hace}}));
 if(e[0]==='visita')hoy.vis++;if(e[0]==='consulta')hoy.cons++;if(e[0]==='whatsapp'||e[0]==='llamada')hoy.clics++;
 ahora=Math.max(3,Math.min(17,ahora+(Math.random()>.5?1:-1)));cuenta($('#ahora'),ahora);seg=0;var s=$('#seg');if(s)s.textContent=0;
 if(tab==='resumen'){var f=$('#feed');if(f)f.innerHTML=feedHtml();cuenta($('#k-cons'),hoy.cons);cuenta($('#k-vis'),hoy.vis);cuenta($('#k-clics'),hoy.clics)}
},4500);
var form=$('#pide-form');form.addEventListener('submit',function(e){e.preventDefault();var v=$('#pide-in').value.trim();if(v)form.innerHTML='<p class="pn-pide-ok">Recibido. Te diríamos cuándo lo tienes en tu panel. (Demostración: no se ha enviado nada.)</p>'});
pinta();
})();
