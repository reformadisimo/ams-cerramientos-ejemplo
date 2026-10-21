
(function(){
var b=document.querySelector('.burger'),m=document.getElementById('mobile');
if(b){b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');b.querySelector('span').textContent=o?'Cerrar':'Menú';});}
var d=document.querySelector('.drop>button');
if(d){d.addEventListener('click',function(e){e.stopPropagation();var p=d.parentNode;var o=p.classList.toggle('open');d.setAttribute('aria-expanded',o?'true':'false');});
document.addEventListener('click',function(){var p=document.querySelector('.drop');p.classList.remove('open');d.setAttribute('aria-expanded','false');});}
document.querySelectorAll('form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
var ok=document.createElement('div');ok.className='form-ok';ok.setAttribute('role','status');
ok.innerHTML='<strong>Gracias, te llamamos en breve.</strong><br>Esto es un ejemplo: en la web real, la petición llegaría directamente a AMS Cerramientos.';
f.replaceWith(ok);});});
})();
