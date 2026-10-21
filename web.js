
(function(){
var b=document.querySelector('.burger'),m=document.getElementById('mobile');
if(b){b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');b.querySelector('span').textContent=o?'Cerrar':'Menú';});}
var d=document.querySelector('.drop>button');
if(d){d.addEventListener('click',function(e){e.stopPropagation();var p=d.parentNode;var o=p.classList.toggle('open');d.setAttribute('aria-expanded',o?'true':'false');});
document.addEventListener('click',function(){var p=document.querySelector('.drop');p.classList.remove('open');d.setAttribute('aria-expanded','false');});}
document.querySelectorAll('form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
var v=function(n){var el=f.querySelector('[name='+n+']');return el?el.value.trim():'';};
var nombre=v('nombre'),tel=v('telefono'),loc=v('localidad'),serv=v('servicio'),msg=v('mensaje');
if(!nombre||!tel){alert('Escribe tu nombre y tu teléfono para que podamos llamarte.');return;}
var txt='Hola, AMS Cerramientos. Os escribo desde vuestra web para pedir presupuesto.\n'+
'Nombre: '+nombre+'\nTeléfono: '+tel+(loc?'\nLocalidad: '+loc:'')+(serv?'\nNecesito: '+serv:'')+(msg?'\nDetalles: '+msg:'');
window.open('https://wa.me/34639788220?text='+encodeURIComponent(txt),'_blank');
var ok=document.createElement('div');ok.className='form-ok';ok.setAttribute('role','status');
ok.innerHTML='<strong>Gracias, '+nombre.replace(/</g,'')+'. Se abre WhatsApp con tu petición: solo tienes que pulsar enviar.</strong><br>Si no se ha abierto, llámanos al <a href="tel:+34639788220">639 78 82 20</a>.';
f.replaceWith(ok);});});
})();
