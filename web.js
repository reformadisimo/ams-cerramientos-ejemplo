
(function(){
var b=document.querySelector('.burger'),m=document.getElementById('mobile');
if(b){b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');b.querySelector('span').textContent=o?'Cerrar':'Menú';});}
var d=document.querySelector('.drop>button');
if(d){d.addEventListener('click',function(e){e.stopPropagation();var p=d.parentNode;var o=p.classList.toggle('open');d.setAttribute('aria-expanded',o?'true':'false');});
document.addEventListener('click',function(){var p=document.querySelector('.drop');p.classList.remove('open');d.setAttribute('aria-expanded','false');});}
var figs=document.querySelectorAll('.gal-item'),lb=document.getElementById('lb');
if(lb&&figs.length){figs.forEach(function(f){f.querySelector('.gal-link').addEventListener('click',function(e){e.preventDefault();var im=f.querySelector('img');lb.querySelector('img').src=im.src;lb.querySelector('img').alt=im.alt;lb.querySelector('.lb-cap').textContent=f.querySelector('figcaption strong').textContent+' · '+f.querySelector('figcaption span').textContent;lb.showModal();});});
lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-close'))lb.close();});}
var fb=document.querySelectorAll('.gal-filters button');fb.forEach(function(b){b.addEventListener('click',function(){fb.forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false');});b.classList.add('on');b.setAttribute('aria-pressed','true');var k=b.getAttribute('data-filter');figs.forEach(function(f){f.hidden=!(k==='todos'||f.getAttribute('data-cat')===k);});});});
document.querySelectorAll('form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
var v=function(n){var el=f.querySelector('[name='+n+']');return el?el.value.trim():'';};
var nombre=v('nombre'),tel=v('telefono'),loc=v('localidad'),serv=v('servicio'),msg=v('mensaje');
if(!nombre||!tel){alert('Escribe tu nombre y tu teléfono para que podamos llamarte.');return;}
var txt='Hola, AMS Cerramientos. Os escribo desde vuestra web para pedir presupuesto.\n'+
'Nombre: '+nombre+'\nTeléfono: '+tel+(loc?'\nLocalidad: '+loc:'')+(serv?'\nNecesito: '+serv:'')+(msg?'\nDetalles: '+msg:'');
var waUrl='https://wa.me/34639788220?text='+encodeURIComponent(txt);
var mailUrl='mailto:info@amscerramientos.es?subject='+encodeURIComponent('Presupuesto desde la web: '+nombre)+'&body='+encodeURIComponent(txt);
var movil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Macintosh/.test(navigator.userAgent));
var n=nombre.replace(/</g,'');
var ok=document.createElement('div');ok.className='form-ok';ok.setAttribute('role','status');
if(movil){window.open(waUrl,'_blank');
ok.innerHTML='<strong>Gracias, '+n+'. Se abre WhatsApp con tu petición: solo tienes que pulsar enviar.</strong><br>Si no se ha abierto, <a href="'+waUrl+'" target="_blank" rel="noopener">pulsa aquí</a> o llámanos al <a href="tel:+34639788220">639 78 82 20</a>.';}
else{window.location.href=mailUrl;
ok.innerHTML='<strong>Gracias, '+n+'. Se abre tu programa de correo con la petición preparada: solo tienes que pulsar enviar.</strong><br>Si no se ha abierto, puedes <a href="'+mailUrl+'">escribirnos a info@amscerramientos.es</a>, <a href="'+waUrl+'" target="_blank" rel="noopener">enviarla por WhatsApp</a> o llamarnos al <a href="tel:+34639788220">639 78 82 20</a>.';}
f.replaceWith(ok);});});
})();
