import re, sys, os, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

S = sys.argv[1]
OUT = os.path.join(S, "site2")
shutil.rmtree(OUT, ignore_errors=True)
os.makedirs(os.path.join(OUT, "img"))
os.makedirs(os.path.join(OUT, "blog"))
for f in os.listdir(os.path.join(S, "fotos-webp")):
    shutil.copy(os.path.join(S, "fotos-webp", f), os.path.join(OUT, "img", f))
for f in [x for x in os.listdir(os.path.join(S, "logo")) if x.startswith("gl-")]:
    shutil.copy(os.path.join(S, "logo", f), os.path.join(OUT, "img", f))
for f in ["logo-blanco.png", "logo-color.png", "logo-cuadrado.png", "favicon.png", "apple-touch-icon.png", "icono-512.png", "logo-ams-blanco.svg", "logo-ams-color.svg"]:
    shutil.copy(os.path.join(S, "logo", f), os.path.join(OUT, "img", f))

for f in os.listdir(os.path.join(S, "vid", "out")):
    shutil.copy(os.path.join(S, "vid", "out", f), os.path.join(OUT, "img", f))
for f in os.listdir(os.path.join(S, "vid", "n2")):
    if not f.startswith(("fr", "sheet")) and f.endswith((".mp4", ".webm", ".jpg")):
        shutil.copy(os.path.join(S, "vid", "n2", f), os.path.join(OUT, "img", f))
for f in os.listdir(os.path.join(S, "vid", "new")):
    shutil.copy(os.path.join(S, "vid", "new", f), os.path.join(OUT, "img", f))

WEB = os.path.join(S, "web2", "project")
LANDING = os.path.join(S, "ams", "project", "Main.dc.html")

# archivo origen -> (ruta publica, archivo de salida)
PAGES = {
    "Main.dc.html": ("/", "index.html"),
    "Empresa.dc.html": ("/empresa", "empresa.html"),
    "Terrazas.dc.html": ("/cerramientos-terrazas", "cerramientos-terrazas.html"),
    "VentanasAluminio.dc.html": ("/ventanas-aluminio", "ventanas-aluminio.html"),
    "VentanasPVC.dc.html": ("/ventanas-pvc", "ventanas-pvc.html"),
    "Pergolas.dc.html": ("/pergolas", "pergolas.html"),
    "Cancelas.dc.html": ("/cancelas-puertas", "cancelas-puertas.html"),
    "Persianas.dc.html": ("/persianas-cristales", "persianas-cristales.html"),
    "Comunidades.dc.html": ("/comunidades", "comunidades.html"),
    "Acabados.dc.html": ("/acabados", "acabados.html"),
    "Financiacion.dc.html": ("/financiacion", "financiacion.html"),
    "Galeria.dc.html": ("/trabajos", "trabajos.html"),
    "Blog.dc.html": ("/blog", "blog/index.html"),
    "ArticuloTerraza.dc.html": ("/blog/precio-cerrar-terraza", "blog/precio-cerrar-terraza.html"),
    "ArticuloPvcAluminio.dc.html": ("/blog/pvc-o-aluminio", "blog/pvc-o-aluminio.html"),
    "ArticuloNavidad.dc.html": ("/blog/cerrar-terraza-antes-de-navidad", "blog/cerrar-terraza-antes-de-navidad.html"),
    "ArticuloAyudas.dc.html": ("/blog/ayudas-cambiar-ventanas-madrid", "blog/ayudas-cambiar-ventanas-madrid.html"),
    "Alcala.dc.html": ("/alcala-de-henares", "alcala-de-henares.html"),
    "Contacto.dc.html": ("/contacto", "contacto.html"),
}
URL = {k: v[0] for k, v in PAGES.items()}
URL["Inicio.dc.html"] = "/"

BLOBS = {
    "1a910bba35c5897bcb02de8f42bbfb4f": "terraza.webp", "3d9f7fd0eeeb8a5abe6ffe1d67bdc556": "terraza.webp",
    "d914ca88dde6596ee42f0d133f83e99d": "ventana-aluminio.webp", "39fcf6a6eb33584c9dfe1e663e94fc61": "ventana-aluminio.webp",
    "98e02c52f597a9d724d33dd0abe8e6c6": "ventana-pvc.webp", "2286e95b33bf6286073bb764cd21f1eb": "ventana-pvc.webp",
    "2a7932893467318db26350e79d1bc93c": "pergola.webp", "7200b6a7ae095935994ddcdbcf65a8d3": "pergola.webp",
    "3619e37693c41631ad43cfdb2461186f": "cancela.webp", "52d00de40288ebef8bdfa1b8470e0f66": "cancela.webp",
    "1505c48ddfe66939733f58f351480ab8": "antes-despues-terraza.webp", "7e22e967e5ff27cac07acadfbe4d5a57": "antes-despues-terraza.webp",
    "53843af7689c3f22684aa68fc625f4c6": "antes-despues-ventana.webp", "4045efba2559a007b96ceace023c2d1f": "antes-despues-ventana.webp",
    "bab2b9b224ed2152c3010f24665d6224": "antes-despues-pergola.webp", "6122aeafb43326ae1622bd60bacad3c1": "antes-despues-pergola.webp",
}

PRODUCTOS = [
    ("/ventanas-aluminio", "Ventanas de aluminio"),
    ("/ventanas-pvc", "Ventanas PVC Kömmerling"),
    ("/cerramientos-terrazas", "Cerramientos de terraza"),
    ("/techos", "Techos de aluminio"),
    ("/cancelas-puertas", "Cancelas y puertas"),
    ("/pergolas", "Pérgolas"),
    ("/toldos", "Toldos y tejidos"),
    ("/persianas-cristales", "Persianas y cristales"),
]
SERVICIOS = [
    ("/automatismos", "Automatización de puertas y cancelas"),
    ("/comunidades", "Mantenimiento para comunidades"),
    ("/reparaciones", "Reparaciones"),
    ("/financiacion", "Financiación y ayudas"),
]
MAS = [("/acabados", "Acabados y calidades"), ("/alcala-de-henares", "Alcalá de Henares")]

import pages_indices
import lectura
from menu_iconos import IC as _IC, URLIC as _URLIC, DESC as _DESC, icono as _icono

ICON_MENU = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
ICON_PHONE = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>'
ICON_DOWN = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'
ICON_WA = '<svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.4-.3z"/></svg>'

CSS = """
:root{--navy:#12202B;--navy2:#0B151D;--line:#24384A;--accent:#C2410C;--accent-d:#9A3412;--peach:#F5C9A8;--bg:#F3F5F7}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--navy);font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:Archivo,system-ui,sans-serif}
img{max-width:100%}
a{color:var(--navy)}a:hover{color:#B8430A}
.demo{background:var(--peach);color:var(--navy);text-align:center;font-size:13px;font-weight:600;padding:7px 12px}
.site-header{position:sticky;top:0;z-index:50;background:var(--navy);color:#fff;box-shadow:0 1px 0 var(--line)}
.bar{max-width:1200px;margin:0 auto;padding:10px 16px;display:flex;align-items:center;gap:20px}
.logo{display:flex;align-items:center;flex:none}
.logo img{display:block;height:50px;width:auto}
.logo-foot img{height:56px;margin-bottom:6px}
.nav{display:flex;align-items:center;gap:4px;margin-left:8px;flex:1}
.nav>a,.drop>button{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 12px;border:0;background:none;border-radius:6px;color:#E6ECF1;font:600 15px Inter,sans-serif;text-decoration:none;cursor:pointer}
.nav>a{white-space:nowrap}.nav>a.nav-cfg{color:#F5B27F}@media(max-width:1699px){.nav>a,.drop>button{padding:0 8px;font-size:14px}.nav{gap:0;margin-left:0}}
@media(min-width:1181px){.nav>a,.drop>button{padding:0 6px;font-size:13.5px;gap:4px}.bar{gap:10px;max-width:1380px}.actions .btn-call{padding-left:12px;padding-right:12px}}
.nav>a:hover,.drop>button:hover,.nav>a.on,.drop.on>button{color:#fff;background:#1C2F3F}
.nav>a.on,.drop.on>button{color:var(--peach)}
.drop{position:relative}
.drop-menu{position:absolute;top:100%;left:0;min-width:300px;padding:8px;background:#fff;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.22);display:none}
.drop.open .drop-menu{display:block}
@media (hover:hover) and (pointer:fine){.drop:hover .drop-menu,.drop:focus-within .drop-menu{display:block}}
.drop-menu a{display:flex;align-items:center;gap:12px;padding:9px 12px;border-radius:10px;color:var(--navy);text-decoration:none;font-weight:600;font-size:15px}
.drop-menu{min-width:340px}
.mi{flex:none;width:38px;height:38px;border-radius:10px;background:#FFF1E8;color:#C2410C;display:inline-flex;align-items:center;justify-content:center;transition:background .15s,color .15s}
.mt{display:flex;flex-direction:column;line-height:1.25}.mt b{font-weight:700}.mt small{font-weight:400;font-size:13px;color:#5A6A76}
.mi{color:#fff!important;box-shadow:0 3px 8px rgba(18,32,43,.18)}
.mi.c0{background:linear-gradient(135deg,#3B7BFF,#1F4FD1)}.mi.c1{background:linear-gradient(135deg,#9B5CFF,#6334D6)}.mi.c2{background:linear-gradient(135deg,#22B573,#0F8A52)}
.mi.c3{background:linear-gradient(135deg,#EC4E88,#BB2A62)}.mi.c4{background:linear-gradient(135deg,#F5922B,#C2410C)}.mi.c5{background:linear-gradient(135deg,#19A9BF,#0D7F92)}
.drop-menu a:hover .mi,.drop-menu a.on .mi,.mobile a:hover .mi{transform:scale(1.07)}
.drop-menu.two{min-width:690px}
.drop-menu a.ver-todo{grid-column:1/-1;background:linear-gradient(90deg,#12202B,#1F3A52);color:#fff;margin-bottom:6px}.drop-menu a.ver-todo small{color:#C8D4DE}.drop-menu a.ver-todo:hover{background:linear-gradient(90deg,#1F3A52,#2A4D6B);color:#fff}
.mobile a.ver-todo{background:#1C2F3F;border-radius:10px;padding:6px 10px;margin:6px 0;border-bottom:0}.mobile a.ver-todo .mt small{display:block;color:#9FB0BE;font-weight:400;font-size:13px}
#hprog{position:absolute;left:0;right:0;bottom:0;height:3px;background:transparent;pointer-events:none}#hprog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#FFC53D,#FF9F1C);border-radius:0 3px 3px 0}
.drop .drop-menu.two{display:none}
.drop.open .drop-menu.two{display:grid;grid-template-columns:1fr 1fr;gap:2px 8px}
@media (hover:hover) and (pointer:fine){.drop:hover .drop-menu.two,.drop:focus-within .drop-menu.two{display:grid;grid-template-columns:1fr 1fr;gap:2px 8px}}
.mobile a{gap:12px}.mobile a .mi{width:32px;height:32px}.mobile a .mt small{display:none}.mobile a .mi svg{width:18px;height:18px}
.drop-menu a:hover,.drop-menu a.on{background:var(--bg);color:#B8430A}
.actions{display:flex;align-items:center;gap:10px;margin-left:auto;flex:none}
.btn-call{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:6px;background:var(--accent);color:#fff;text-decoration:none;font-weight:700;font-size:15px;white-space:nowrap}
.btn-call:hover{background:var(--accent-d);color:#fff}
.btn-quote{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:6px;border:1px solid #5B6B78;color:#fff;text-decoration:none;font-weight:600;font-size:15px;white-space:nowrap}
.btn-quote:hover{border-color:#fff;color:#fff}
.burger{display:none;align-items:center;gap:8px;min-height:44px;padding:0 12px;border:1px solid #5B6B78;border-radius:6px;background:#1C2F3F;color:#fff;font:700 16px Inter,sans-serif;cursor:pointer}
.mobile{display:none;background:var(--navy2);border-top:1px solid var(--line);max-height:calc(100vh - 110px);overflow:auto}
.mobile.open{display:block}
.mobile-in{padding:6px 16px 20px}
.mobile p{margin:16px 0 4px;color:#9FB0BE;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.mobile a{display:flex;align-items:center;min-height:50px;border-bottom:1px solid var(--line);color:#fff;text-decoration:none;font-size:17px;font-weight:600}
.mobile a.on{color:var(--peach)}
.mobile a.cta{justify-content:center;margin-top:16px;border:0;border-radius:6px;background:var(--accent)}
@media (max-width:1699px){.btn-quote{display:none}}
@media (max-width:1180px){
 .nav{display:none}.burger{display:inline-flex}
 .bar{justify-content:space-between;gap:8px}.actions{margin-left:0}
 .btn-call span{display:none}.btn-call::after{content:"Llamar"}.btn-call{padding:0 14px}
 .logo img{height:42px}
}
@media (min-width:1181px){.mobile{display:none !important}}
.wa{position:fixed;right:18px;bottom:18px;z-index:60;width:60px;height:60px;border-radius:50%;background:#1F8F4E;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.wa:hover{background:#17733E}
.site-footer{background:var(--navy2);color:#B9C4CE}
.foot{max-width:1200px;margin:0 auto;padding:48px 16px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px;font-size:14px;line-height:1.6}
.foot div{display:flex;flex-direction:column;gap:6px}
.foot strong{color:#fff;font-size:15px}
.foot a{color:#B9C4CE;text-decoration:none}.foot a:hover{color:#fff}
.foot-bottom{max-width:1200px;margin:0 auto;padding:16px 16px 90px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;font-size:13px}
.foot-bottom a{color:#D3DBE2;text-decoration:underline}.foot-bottom a:hover{color:#fff}
.form-ok{padding:24px;border-radius:8px;background:#E7F4EC;color:#14532D;font-size:16px;line-height:1.5}
.gal{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px 20px}
@media (max-width:900px){.gal{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:600px){.gal{grid-template-columns:1fr}}
.gal-link{display:block;border-radius:10px}.gal-link:hover img{opacity:.92}
.ph{position:relative;aspect-ratio:4/3;border-radius:10px;overflow:hidden;background:linear-gradient(135deg,#12202B 0%,#24465d 100%);display:flex;align-items:center;justify-content:center}
.ph:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(135deg,rgba(255,255,255,.035) 0 2px,transparent 2px 22px)}
.ph svg{position:relative;width:34%;height:auto;stroke:#F5B27F;stroke-width:2.2;fill:none;stroke-linecap:round;stroke-linejoin:round}
.ph b{position:absolute;left:12px;top:12px;font:700 11px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#12202B;background:#F5B27F;padding:5px 10px;border-radius:99px}
.gal-filters{display:flex;flex-wrap:wrap;gap:8px}
.gal-filters button{min-height:40px;padding:0 16px;border:1px solid #DCE2E7;border-radius:999px;background:#fff;color:var(--navy);font:600 14px Inter,sans-serif;cursor:pointer}
.gal-filters button.on{background:var(--navy);color:#fff;border-color:var(--navy)}
.lb{border:0;padding:0;background:transparent;max-width:min(96vw,1100px);width:auto}
.lb::backdrop{background:rgba(0,0,0,.86)}
.lb img{display:block;max-width:96vw;max-height:80vh;width:auto;height:auto;margin:0 auto;border-radius:8px}
.lb-cap{margin:10px 0 0;color:#fff;text-align:center;font-size:15px}
.lb-close{position:absolute;top:8px;right:8px;min-height:40px;padding:0 14px;border:0;border-radius:6px;background:rgba(255,255,255,.92);color:var(--navy);font:700 14px Inter,sans-serif;cursor:pointer}
@media (max-width:600px){main div[style*="padding: 72px 24px"],main div[style*="padding: 80px 24px"],main div[style*="padding: 64px 24px"]{padding:44px 16px !important}main div[style*="padding: 56px 24px"]{padding:40px 16px !important}}
.hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);grid-template-rows:auto auto auto;column-gap:48px;row-gap:22px;align-items:center}
.hero-text{grid-column:1;grid-row:1}.hero-cta{grid-column:1;grid-row:2;align-items:flex-start}.hero-trust{grid-column:1;grid-row:3;justify-content:flex-start}
.hero-img{grid-column:2;grid-row:1/4;height:420px}
.hero-cta .btn-hero{align-self:flex-start}
@media (min-width:861px){.hero-cta a{align-self:flex-start !important}}
@media (max-width:860px){
 .hero{grid-template-columns:1fr;row-gap:18px;padding:24px 16px 36px !important}
 .hero-text{grid-row:1}.hero-img{grid-column:1;grid-row:2;height:auto;aspect-ratio:4/3}.hero-cta{grid-row:3}.hero-trust{grid-row:4;text-align:center}
 .hero-cta .btn-hero{align-self:stretch}
 .hero-trust span{font-size:13px}
}
@media (max-width:600px){
 .demo{font-size:11px;padding:4px 10px}
 .bar{padding:7px 12px}
 .burger{min-height:40px;padding:0 10px;font-size:15px}
 .btn-call{min-height:40px;font-size:14px}
 .logo img{height:36px}
 .mobile a{min-height:46px;font-size:16px}
}
@media (prefers-reduced-motion: reduce){.vbg{display:none}}
.vbg{pointer-events:none}
.vm{display:none}
@media (max-width: 760px){.vm{display:block;flex:1 1 100%;aspect-ratio:16/10;border-radius:10px;overflow:hidden}.vm video{width:100%;height:100%;object-fit:cover;display:block}.vd{display:none}.vsec{background:#12202B!important}.vtxt{text-shadow:none}}
.vtxt{text-shadow:0 2px 14px rgba(0,0,0,.5)}.vtxt #presupuesto,.vtxt .btn-hero{text-shadow:none}
@media (max-width: 760px){.vov{background:linear-gradient(180deg,rgba(18,32,43,0.8) 0%,rgba(18,32,43,0.6) 60%,rgba(18,32,43,0.35) 100%)!important}}
"""

JS = """
(function(){
var b=document.querySelector('.burger'),m=document.getElementById('mobile');
if(b){b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');b.querySelector('span').textContent=o?'Cerrar':'Menú';});}
var ds=document.querySelectorAll('.drop>button');
function closeAll(){ds.forEach(function(x){x.parentNode.classList.remove('open');x.setAttribute('aria-expanded','false');});var ae=document.activeElement;if(ae&&ae.closest&&ae.closest('.drop'))ae.blur();}
ds.forEach(function(d){d.addEventListener('click',function(e){e.stopPropagation();var p=d.parentNode;var was=p.classList.contains('open');closeAll();if(!was){p.classList.add('open');d.setAttribute('aria-expanded','true');}});});
document.addEventListener('click',closeAll);document.addEventListener('pointerdown',function(e){if(!e.target.closest('.drop'))closeAll()},{passive:true});document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});window.addEventListener('scroll',function(){if(document.querySelector('.drop.open'))closeAll()},{passive:true});
var figs=document.querySelectorAll('.gal-item'),lb=document.getElementById('lb');
if(lb&&figs.length){figs.forEach(function(f){var gl=f.querySelector('.gal-link');if(!gl)return;gl.addEventListener('click',function(e){e.preventDefault();var im=f.querySelector('img');lb.querySelector('img').src=im.src;lb.querySelector('img').alt=im.alt;lb.querySelector('.lb-cap').textContent=f.querySelector('figcaption strong').textContent+' · '+f.querySelector('figcaption span').textContent;lb.showModal();});});
lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-close'))lb.close();});}
var fb=document.querySelectorAll('.gal-filters button');fb.forEach(function(b){b.addEventListener('click',function(){fb.forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false');});b.classList.add('on');b.setAttribute('aria-pressed','true');var k=b.getAttribute('data-filter');figs.forEach(function(f){f.hidden=!(k==='todos'||f.getAttribute('data-cat')===k);});});});
document.querySelectorAll('form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
var v=function(n){var el=f.querySelector('[name='+n+']');return el?el.value.trim():'';};
var nombre=v('nombre'),tel=v('telefono'),loc=v('localidad'),serv=v('servicio'),msg=v('mensaje');
var err=function(m){var e=f.querySelector('.form-err');if(!e){e=document.createElement('p');e.className='form-err';e.setAttribute('role','alert');e.style.cssText='grid-column:1/-1;margin:0;color:#B91C1C;font-weight:700;font-size:15px';var bt=f.querySelector('button[type=submit],button:not([type])');if(bt)bt.parentNode.insertBefore(e,bt);else f.appendChild(e);}e.textContent=m;};if(!nombre||!tel){err('Escribe tu nombre y tu teléfono para que podamos llamarte.');return;}var pc=f.querySelector('[name=privacidad]');if(pc&&!pc.checked){err('Marca la casilla de la política de privacidad para poder enviarlo.');return;}
var txt='Hola, AMS Cerramientos. Os escribo desde vuestra web para pedir presupuesto.\\n'+
'Nombre: '+nombre+'\\nTeléfono: '+tel+(loc?'\\nLocalidad: '+loc:'')+(serv?'\\nNecesito: '+serv:'')+(msg?'\\nDetalles: '+msg:'');
var waUrl='https://wa.me/34639788220?text='+encodeURIComponent(txt);
var mailUrl='mailto:info@amscerramientos.es?subject='+encodeURIComponent('Presupuesto desde la web: '+nombre)+'&body='+encodeURIComponent(txt);
var movil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Macintosh/.test(navigator.userAgent));
var n=nombre.replace(/</g,'');
if(window.amsEvento)window.amsEvento('generate_lead',{pagina:location.pathname,via:movil?'whatsapp':'correo'});
var ok=document.createElement('div');ok.className='form-ok';ok.setAttribute('role','status');
if(movil){window.open(waUrl,'_blank');
ok.innerHTML='<strong>Gracias, '+n+'. Se abre WhatsApp con tu petición: solo tienes que pulsar enviar.</strong><br>Si no se ha abierto, <a href="'+waUrl+'" target="_blank" rel="noopener">pulsa aquí</a> o llámanos al <a href="tel:+34639788220">639 78 82 20</a>.';}
else{window.location.href=mailUrl;
ok.innerHTML='<strong>Gracias, '+n+'. Se abre tu programa de correo con la petición preparada: solo tienes que pulsar enviar.</strong><br>Si no se ha abierto, puedes <a href="'+mailUrl+'">escribirnos a info@amscerramientos.es</a>, <a href="'+waUrl+'" target="_blank" rel="noopener">enviarla por WhatsApp</a> o llamarnos al <a href="tel:+34639788220">639 78 82 20</a>.';}
f.replaceWith(ok);});});
})();
"""

from urllib.parse import quote

def wa(msg):
    return "https://wa.me/34639788220?text=" + quote(msg, safe="")

WA_MSG = {
    "/cerramientos-terrazas": "Hola, AMS Cerramientos. He visto vuestra web y quiero presupuesto para cerrar mi terraza. Os mando una foto. Estoy en: ",
    "/ventanas-aluminio": "Hola, AMS Cerramientos. He visto vuestra web y quiero presupuesto para cambiar ventanas (aluminio). Estoy en: ",
    "/ventanas-pvc": "Hola, AMS Cerramientos. He visto vuestra web y quiero presupuesto para ventanas de PVC Kömmerling. Estoy en: ",
    "/pergolas": "Hola, AMS Cerramientos. He visto vuestra web y quiero presupuesto para una pérgola o techo. Os mando una foto del patio. Estoy en: ",
    "/cancelas-puertas": "Hola, AMS Cerramientos. He visto vuestra web y quiero presupuesto para una cancela o puerta. Os mando una foto de la entrada. Estoy en: ",
    "/persianas-cristales": "Hola, AMS Cerramientos. He visto vuestra web y quiero presupuesto para persianas, mosquiteras o cristales. Estoy en: ",
    "/comunidades": "Hola, AMS Cerramientos. Soy administrador o presidente de una comunidad y quiero información sobre vuestros planes de mantenimiento. La comunidad está en: ",
    "/alcala-de-henares": "Hola, AMS Cerramientos. Vivo en Alcalá de Henares, he visto vuestra web y quiero pedir presupuesto para: ",
    "/toldos": "Hola, AMS Cerramientos. He visto vuestra web y quiero presupuesto para un toldo. Os mando una foto de la terraza. Estoy en: ",
    "/rejas": "Hola, AMS Cerramientos. He visto vuestra web y quiero presupuesto para una reja. Os mando una foto de la ventana o la puerta. Estoy en: ",
    "/automatismos": "Hola, AMS Cerramientos. He visto vuestra web y quiero automatizar una puerta o cancela. Os mando una foto de la entrada. Estoy en: ",
    "/techos": "Hola, AMS Cerramientos. He visto vuestra web y quiero presupuesto para un techo de aluminio. Os mando una foto del patio. Estoy en: ",
    "/reparaciones": "Hola, AMS Cerramientos. He visto vuestra web y necesito una reparación. Os mando una foto o un vídeo de lo que pasa. Estoy en: ",
    "/landing": "Hola, AMS Cerramientos. He visto vuestro anuncio y quiero presupuesto para cerrar mi terraza o cambiar ventanas. Os mando una foto. Estoy en: ",
}
WA_DEFAULT = "Hola, AMS Cerramientos. He visto vuestra web y quiero pedir presupuesto para: "

def header(cur):
    def cls(u): return ' class="on"' if u == cur else ''
    prod_on = cur in [u for u, _ in PRODUCTOS]
    serv_on = cur in [u for u, _ in SERVICIOS]
    HERR = [("/revisa-tu-presupuesto", "Revisa tu presupuesto"), ("/diagnostico", "Diagnóstico de tus ventanas"), ("/simulador", "Simulador de ahorro y ruido"), ("/comprobador-ayudas", "Comprobador de ayudas"), ("/permisos-cerrar-terraza", "Permisos para cerrar tu terraza"), ("/como-medir-ventanas", "Cómo medir tus ventanas"), ("/visualizador", "Visualizador con foto (pronto)"), ("/glosario", "Glosario de ventanas")]
    HERR_U = [u for u, _ in HERR]
    BLOGM = [("/blog", "Todas las guías"), ("/glosario", "Glosario"), ("/blog/ventanas-ahorro-energia-calor-frio", "Ahorro de energía"), ("/blog/mas-que-una-ventana", "Más que una ventana"), ("/blog/no-hacemos-ventanas-hacemos-hogares", "No hacemos ventanas, hacemos hogares"), ("/blog/una-ventana-no-es-solo-una-ventana", "Una ventana no es solo una ventana")]
    def dd(items, todo=None):
        out = []
        if todo:
            out.append(f'<a href="{todo[0]}" class="ver-todo"{cls(todo[0])}><i class="mi c0" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h14M13 6l6 6-6 6"/></svg></i><span class="mt"><b>{todo[1]}</b><small>{todo[2]}</small></span></a>')
        for n, (u, t) in enumerate(items):
            d = _DESC.get(u)
            txt = f'<span class="mt"><b>{t}</b><small>{d}</small></span>' if d else f'<span class="mt"><b>{t}</b></span>'
            out.append(f'<a href="{u}"{cls(u)}>{_icono(u, n)}{txt}</a>')
        return "".join(out)
    mob = (
        f'<a href="/"{cls("/")}>Inicio</a><p>Herramientas gratis</p>' + dd([("/configurador", "Calcula tu precio")] + [h for h in HERR if h[0] != "/visualizador"])
        + '<p>Blog y guías</p>' + dd(BLOGM)
        + '<p>Productos</p>' + dd(PRODUCTOS, ("/productos", "Ver todos los productos", "De un vistazo"))
        + '<p>Servicios</p>' + dd(SERVICIOS, ("/servicios", "Ver todos los servicios", "De un vistazo"))
        + '<p>La empresa</p>'
        + dd([("/acabados", "Acabados y calidades"), ("/trabajos", "Trabajos realizados"), ("/alcala-de-henares", "Alcalá de Henares"), ("/empresa", "Quiénes somos"), ("/garantia-y-postventa", "Garantía y postventa"), ("/contacto", "Contacto")])
        + '<a href="/contacto" class="cta">Pedir presupuesto gratis</a>'
    )
    blog_on = True if (cur == "/blog" or cur.startswith("/blog/")) else ''
    return f'''<div class="demo">Ejemplo de diseño para AMS Cerramientos. Fotos y datos provisionales.</div>
<header class="site-header">
<div class="bar">
<button type="button" class="burger" aria-expanded="false" aria-controls="mobile">{ICON_MENU}<span>Menú</span></button>
<a href="/" class="logo"><img src="/img/logo-ams-blanco.svg" alt="AMS Cerramientos" width="302" height="100"></a>
<nav class="nav" aria-label="Principal">
<a href="/"{cls("/")}>Inicio</a>
<div class="drop{' on' if prod_on else ''}"><button type="button" aria-expanded="false" aria-haspopup="true">Productos {ICON_DOWN}</button><div class="drop-menu two">{dd(PRODUCTOS, ("/productos", "Ver todos los productos", "Todo lo que fabricamos, de un vistazo"))}</div></div>
<div class="drop{' on' if serv_on else ''}"><button type="button" aria-expanded="false" aria-haspopup="true">Servicios {ICON_DOWN}</button><div class="drop-menu">{dd(SERVICIOS, ("/servicios", "Ver todos los servicios", "Todo lo que hacemos, de un vistazo"))}</div></div>
<a href="/acabados"{cls("/acabados")}>Acabados</a>
<a href="/trabajos"{cls("/trabajos")}>Trabajos</a>
<a href="/empresa"{cls("/empresa")}>Empresa</a>
<div class="drop{' on' if blog_on else ''}"><button type="button" aria-expanded="false" aria-haspopup="true">Blog {ICON_DOWN}</button><div class="drop-menu">{dd(BLOGM)}</div></div>
<div class="drop{' on' if cur in HERR_U else ''}"><button type="button" aria-expanded="false" aria-haspopup="true">Herramientas {ICON_DOWN}</button><div class="drop-menu">{dd(HERR)}</div></div>
<a href="/configurador"{cls("/configurador")} class="nav-cfg">Calcula tu precio</a>
<a href="/contacto"{cls("/contacto")}>Contacto</a>
</nav>
<div class="actions">
{lectura.BTN}
<a href="/contacto" class="btn-quote">Presupuesto gratis</a>
<a href="tel:+34639788220" class="btn-call" aria-label="Llamar al 639 78 82 20">{ICON_PHONE}<span>639 78 82 20</span></a>
</div>
</div>
<nav id="mobile" class="mobile" aria-label="Menú móvil"><div class="mobile-in">{mob}</div></nav>
{lectura.PANEL}
<div id="hprog" aria-hidden="true"><i></i></div><script>(function(){{var b=document.querySelector("#hprog i");if(!b)return;function f(){{var h=document.documentElement,m=h.scrollHeight-innerHeight;b.style.width=(m>0?Math.min(100,Math.max(0,scrollY/m*100)):0)+"%"}}addEventListener("scroll",f,{{passive:true}});addEventListener("resize",f);f()}})();</script>
</header>'''

FOOTER = '''<footer class="site-footer">
<div class="foot">
<div><a href="/" class="logo logo-foot"><img src="/img/logo-ams-blanco.svg" alt="AMS Cerramientos" width="302" height="100"></a><span>AMS Cerramientos y Servicios S.L.</span><span>C/ Siete Picos 28, 28810 Villalbilla (Madrid)</span><a href="tel:+34918833512">91 883 35 12</a><a href="tel:+34639788220">639 78 82 20</a><a href="mailto:info@amscerramientos.es">info@amscerramientos.es</a></div>
<div><strong>Productos</strong>''' + "".join(f'<a href="{u}">{t}</a>' for u, t in PRODUCTOS) + '''</div>
<div><strong>Servicios</strong>''' + "".join(f'<a href="{u}">{t}</a>' for u, t in SERVICIOS) + '''</div>
<div><strong>AMS</strong><a href="/empresa">Quiénes somos</a><a href="/garantia-y-postventa">Garantía y postventa</a><a href="/trabajos">Trabajos realizados</a><a href="/acabados">Acabados y calidades</a><a href="/blog">Blog y guías</a><a href="/revisa-tu-presupuesto">Revisa tu presupuesto</a><a href="/diagnostico">Diagnóstico de ventanas</a><a href="/simulador">Simulador de ahorro</a><a href="/glosario">Glosario</a><a href="/configurador">Calcula tu precio</a><a href="/contacto">Contacto</a></div>
<div><strong>Zonas</strong><a href="/alcala-de-henares">Alcalá de Henares</a><a href="/torrejon-de-ardoz">Torrejón de Ardoz</a><a href="/villalbilla">Villalbilla</a><a href="/coslada">Coslada</a><a href="/meco">Meco</a><a href="/azuqueca-de-henares">Azuqueca de Henares</a><a href="/guadalajara">Guadalajara</a><a href="/madrid">Madrid</a></div>
</div>
<div class="foot-bottom"><span>© AMS Cerramientos y Servicios S.L.</span><span><a href="/aviso-legal">Aviso legal</a> · <a href="/privacidad">Privacidad</a> · <a href="/cookies">Cookies</a> · <a href="#" data-ck-open>Configurar cookies</a></span></div>
</footer>
<a href="WA_LINK" class="wa" aria-label="Escribir por WhatsApp">''' + ICON_WA + '</a>'

def extract(path):
    s = open(path, encoding="utf-8").read()
    title = re.search(r"<title>(.*?)</title>", s, re.S).group(1)
    body = re.search(r"<x-dc>(.*?)</x-dc>", s, re.S).group(1)
    body = re.sub(r"<helmet>.*?</helmet>", "", body, flags=re.S)
    body = re.sub(r"<header\b.*?</header>", "", body, count=1, flags=re.S)
    body = re.sub(r"<footer\b.*?</footer>", "", body, flags=re.S)
    body = body.replace("{{accent}}", "#C2410C")
    for bid, name in BLOBS.items():
        body = body.replace(f"/_blob/{bid}", "/img/" + name)
    body = re.sub(r'href="([A-Za-z]+\.dc\.html)"', lambda m: f'href="{URL.get(m.group(1), "/")}"', body)
    body = body.replace("<img ", '<img loading="lazy" ', ) if False else body
    if "{{" in body or "sc-if" in body:
        print("AVISO plantilla", path)
    return title, body

from PIL import Image as _Img
DIMS = {}
for _f in os.listdir(os.path.join(OUT, "img")):
    if _f.endswith((".webp", ".png")):
        DIMS["/img/" + _f] = _Img.open(os.path.join(OUT, "img", _f)).size

def img_attrs(body):
    first = [True]
    def fix(m):
        tag = m.group(0)
        src = re.search(r'src="([^"]+)"', tag)
        if src and src.group(1) in DIMS and "width=" not in tag:
            w, h = DIMS[src.group(1)]
            tag = tag.replace("<img ", f'<img width="{w}" height="{h}" ', 1)
        if first[0]:
            first[0] = False
            tag = tag.replace("<img ", '<img fetchpriority="high" ', 1)
        elif 'loading=' not in tag:
            tag = tag.replace("<img ", '<img loading="lazy" ', 1)
        return tag
    return re.sub(r"<img [^>]*>", fix, body)

def zonas_links(body):
    m = {"Alcalá de Henares": "alcala-de-henares", "Torrejón de Ardoz": "torrejon-de-ardoz", "Villalbilla": "villalbilla", "Coslada": "coslada", "Meco": "meco", "Azuqueca de Henares": "azuqueca-de-henares", "Guadalajara": "guadalajara", "Madrid capital": "madrid"}
    def f(mo):
        n = mo.group(2)
        return f'<a href="/{m[n]}" style="{mo.group(1)}; text-decoration: none; color: #12202B">{n}</a>' if n in m else mo.group(0)
    return re.sub(r'<span style="(padding: 8px 14px; border-radius: 999px;[^"]*)">([^<]+)</span>', f, body)



POS = {"hombre-sonriendo": "70% 25%", "llamada-risa": "28% 30%", "cliente-obrero": "60% 40%", "mujer-libro": "55% 40%", "taller-hombre": "70% 40%", "arquitecto-mesa": "60% 50%", "lapiz-medicion": "60% 50%"}

def mosaico(tiles=None, titulo="Así se vive con unas buenas ventanas", sub="Más luz, menos ruido y una terraza que se disfruta también en invierno. Eso es lo que buscamos en cada obra.", fondo="linear-gradient(180deg, #FFF3E6 0%, #FFFFFF 100%)"):
    tiles = tiles or [("terraza-cristal", "Terrazas cerradas todo el año"), ("villa-cristal", "Balcones y pérgolas con cristal"), ("mujer-luz", "Más luz en casa"), ("salon-ventanal", "Salones con gran ventanal")]
    t = "".join(f'''<figure class="mz"><video class="vbg" autoplay muted loop playsinline preload="metadata" poster="/img/{v}.jpg" aria-hidden="true" style="object-position: {POS.get(v, '50% 50%')}"><source src="/img/{v}.webm" type="video/webm"><source src="/img/{v}.mp4" type="video/mp4"></video><figcaption>{c}</figcaption></figure>''' for v, c in tiles)
    return f'''<section style="background: {fondo}">
<style>.mzg{{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:28px}}.mz{{position:relative;margin:0;border-radius:16px;overflow:hidden;aspect-ratio:4/5;background:#DCE9F2;box-shadow:0 10px 28px rgba(18,32,43,.14)}}.mz video{{width:100%;height:100%;object-fit:cover;display:block}}.mz figcaption{{position:absolute;left:0;right:0;bottom:0;padding:44px 16px 16px;background:linear-gradient(180deg,rgba(18,32,43,0) 0%,rgba(18,32,43,.78) 100%);color:#fff;font-weight:700;font-size:17px;line-height:1.25}}@media (max-width:760px){{.mzg{{grid-template-columns:repeat(2,1fr);gap:10px}}.mz figcaption{{font-size:15px;padding:36px 12px 12px}}}}</style>
<div style="max-width: 1200px; margin: 0 auto; padding: 64px 24px">
<h2 style="margin: 0; font-size: clamp(26px, 5.5vw, 40px); font-weight: 800; line-height: 1.1">{titulo}</h2>
<p style="margin: 12px 0 0; font-size: 18px; line-height: 1.5; color: #4A5A68; max-width: 640px">{sub}</p>
<div class="mzg">{t}</div>
</div>
</section>'''

def configurador_sec():
    return '''<section style="background: #12202B; color: #FFFFFF">
<div style="max-width: 1200px; margin: 0 auto; padding: 56px 24px; display: flex; flex-wrap: wrap; gap: 28px 48px; align-items: center">
<div style="flex: 1 1 420px">
<p style="margin: 0 0 10px; display: inline-block; padding: 5px 12px; border-radius: 999px; background: #E8742A; color: #12202B; font-size: 13px; font-weight: 800; letter-spacing: .04em">NOVEDAD · CONFIGURADOR</p>
<h2 style="margin: 0; font-size: clamp(26px, 5.5vw, 40px); font-weight: 800; line-height: 1.1">Configura tus ventanas y mira el precio al momento</h2>
<p style="margin: 14px 0 0; font-size: 18px; line-height: 1.55; color: #D3DBE2; max-width: 600px">Elige medidas, material y color, habitación por habitación. El precio sale al instante e incluye medición, instalación, retirada de lo viejo y remates. Te llevas el presupuesto en PDF o por WhatsApp, sin compromiso.</p>
<p style="margin: 22px 0 0"><a href="/configurador" style="display: inline-block; padding: 15px 28px; border-radius: 8px; background: #E8742A; color: #12202B; font-weight: 800; text-decoration: none; font-size: 17px">Calcular el precio de mis ventanas</a></p>
<p style="margin: 14px 0 0; font-size: 14px; color: #B9C4CE">Precios orientativos. Instalamos en la Comunidad de Madrid y en Guadalajara.</p>
</div>
<ul style="flex: 1 1 280px; margin: 0; padding: 0; list-style: none; display: grid; gap: 12px">
<li style="padding: 14px 18px; border-radius: 12px; background: #1C2F3F; font-weight: 600">Precio en vivo, sin dejar tus datos antes</li>
<li style="padding: 14px 18px; border-radius: 12px; background: #1C2F3F; font-weight: 600">Todo incluido: medición, instalación y remates</li>
<li style="padding: 14px 18px; border-radius: 12px; background: #1C2F3F; font-weight: 600">Presupuesto en PDF o por WhatsApp</li>
</ul>
</div>
</section>'''

def alegria(cur, body):
    if cur not in ("/", "/landing"):
        return body
    if cur == "/":
        a = body.index('<section style="background: #12202B; color: #FFFFFF">')
        b = body.index('</section>', a)
        hero = body[a:b]
        hero = hero.replace('background: #12202B; color: #FFFFFF', 'background: linear-gradient(135deg, #FFF1E2 0%, #EAF4FC 58%, #D8ECFA 100%); color: #12202B', 1)
        hero = hero.replace('background: #24384A; color: #F5C9A8', 'background: #FFDCC2; color: #9A3412')
        hero = hero.replace('color: #D3DBE2', 'color: #3D5163').replace('color: #B9C4CE', 'color: #3D5163')
        hero = hero.replace('stroke="#F08A4B"', 'stroke="#C2410C"')
        body = body[:a] + hero + body[b:]
    mark = '<section style="background: #FFFFFF; border-bottom: 1px solid #DCE2E7">'
    a = body.index(mark)
    b = body.index('</section>', a) + len('</section>')
    body = body[:b] + "\n" + (configurador_sec() + "\n" if cur == "/" else "") + mosaico()  + body[b:]
    for old, new in (('<section style="background: #FFFFFF">', '<section style="background: #FFF8F1">'), ('<section style="background: #FFFFFF">', '<section style="background: #EEF6FC">')):
        if old in body:
            body = body.replace(old, new, 1)
    k = body.rfind('<section style="background: #12202B; color: #FFFFFF">')
    if k >= 0:
        body = body[:k] + mosaico([("cliente-obrero", "Te atendemos en tu casa"), ("hombre-sonriendo", "Hablamos de tú a tú"), ("lapiz-medicion", "Medimos antes de fabricar"), ("taller-hombre", "Fabricamos en nuestro taller")], "Así trabajamos", "Una empresa cercana y con más de 20 años: te atendemos nosotros, medimos nosotros y fabricamos nosotros.", "linear-gradient(180deg, #EEF6FC 0%, #FFFFFF 100%)") + "\n" + body[k:]
        k = body.rfind('<section style="background: #12202B; color: #FFFFFF">')
        e = body.index('</section>', k)
        cta = body[k:e].replace('background: #12202B; color: #FFFFFF', 'background: linear-gradient(90deg, #C2410C 0%, #E8742A 100%); color: #FFFFFF', 1).replace('background: #C2410C', 'background: #12202B').replace('border: 1px solid #5B6B78', 'border: 1.5px solid rgba(255,255,255,0.85)').replace('color: #D3DBE2', 'color: #FFF1E6').replace('color: #B9C4CE', 'color: #FFF1E6')
        body = body[:k] + cta + body[e:]
    return body

def techo_sec():
    return '''<section style="background: #FFFFFF">
<div style="max-width: 1200px; margin: 0 auto; padding: 64px 24px">
<div style="display: flex; flex-wrap: wrap; gap: 24px 40px; align-items: center">
<div style="flex: 1 1 360px">
<h2 style="margin: 0; font-size: clamp(26px, 5.5vw, 40px); font-weight: 800; line-height: 1.1">Luz también desde el techo</h2>
<p style="margin: 14px 0 0; font-size: 18px; line-height: 1.55; color: #4A5A68; max-width: 520px">Ventanas de tejado y claraboyas para buhardillas, cocinas y pasillos sin luz natural. Elige tamaño y opciones en el configurador y mira el precio instalado al momento.</p>
<p style="margin: 22px 0 0"><a href="/configurador" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 26px; border-radius: 6px; background: #C2410C; color: #fff; font-weight: 700; font-size: 17px; text-decoration: none">Ver precio de mi ventana de tejado</a></p>
<p style="margin: 10px 0 0; font-size: 13px; color: #6B7A87">Imágenes ilustrativas.</p>
</div>
<div style="flex: 1.3 1 420px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px">
<img src="/img/techo-claraboya.jpg" alt="Cocina luminosa con claraboya" loading="lazy" style="width: 100%; height: 100%; min-height: 240px; object-fit: cover; border-radius: 16px; box-shadow: 0 10px 28px rgba(18,32,43,.14)">
<img src="/img/techo-buhardilla.jpg" alt="Buhardilla con ventana de tejado" loading="lazy" style="width: 100%; height: 100%; min-height: 240px; object-fit: cover; border-radius: 16px; box-shadow: 0 10px 28px rgba(18,32,43,.14)">
</div>
</div>
</div>
</section>'''

ZONAS_N = {"/alcala-de-henares": "Alcalá de Henares", "/torrejon-de-ardoz": "Torrejón de Ardoz", "/villalbilla": "Villalbilla", "/coslada": "Coslada", "/meco": "Meco", "/azuqueca-de-henares": "Azuqueca de Henares", "/guadalajara": "Guadalajara", "/madrid": "Madrid"}

def personas(cur):
    F = "linear-gradient(180deg, #EEF6FC 0%, #FFFFFF 100%)"
    if cur == "/empresa":
        return mosaico([("cliente-obrero", "Te atendemos en tu casa"), ("hombre-sonriendo", "Hablamos de tú a tú"), ("lapiz-medicion", "Medimos antes de fabricar"), ("taller-hombre", "Fabricamos en nuestro taller")], "Así trabajamos", "Una empresa pequeña y cercana: te atendemos nosotros, medimos nosotros y fabricamos nosotros.", F)
    if cur == "/contacto":
        return mosaico([("llamada-risa", "Te contestamos enseguida"), ("hombre-sonriendo", "Hablamos de tú a tú"), ("obra-balcon", "Vamos a medir a tu casa"), ("arquitecto-mesa", "Te preparamos el presupuesto")], "Hablamos contigo, sin compromiso", "Cuéntanos qué necesitas. Primero te escuchamos, después medimos y luego te damos un precio cerrado por escrito.", F)
    if cur == "/trabajos":
        return mosaico([("arquitecto-mesa", "Primero, el proyecto"), ("lapiz-medicion", "Medimos con cuidado"), ("taller-hombre", "Fabricamos en taller"), ("reforma-ventanal", "Instalamos y rematamos")], "Cómo se hace una obra nuestra", "De la primera visita a la última junta de silicona, siempre el mismo equipo.", F)
    return ""

OPOS = {"sonrisa-luces": "50% 30%", "llamada-sonrisa": "50% 30%", "mujer-luz": "50% 35%", "salon-ventanal": "50% 50%", "reforma-ventanal": "50% 6%", "obra-balcon": "50% 60%", "mujer-movil": "50% 35%", "mujer-libro": "60% 40%", "ventana-cortina": "50% 50%", "arquitecto-mesa": "75% 55%", "cliente-obrero": "55% 45%", "taller-hombre": "65% 40%", "lapiz-medicion": "60% 45%", "terraza-cristal": "50% 55%", "villa-cristal": "50% 50%"}


# Nunca repetir la misma foto o video en una misma pagina: la segunda vez se cambia por otro del banco que no se use en ella.
POOL_MEDIA = ["sonrisa-luces", "salon-ventanal", "mujer-luz", "reforma-ventanal", "obra-balcon", "ventana-cortina", "villa-cristal", "terraza-cristal", "arquitecto-mesa",
              "cliente-obrero", "taller-hombre", "lapiz-medicion", "mujer-libro", "mujer-movil", "hombre-sonriendo", "llamada-risa", "llamada-sonrisa"]
NO_CAMBIAR = {"equipo-ams", "cancela", "pergola", "antes-despues-ventana", "antes-despues-terraza", "antes-despues-pergola", "ejemplo-ventana-antes", "ejemplo-ventana-despues"}


def dedup_media(cur, body):
    pat = re.compile(r'<video[^>]*poster="/img/([\w-]+)\.jpg".*?</video>|<img[^>]+src="/img/([\w-]+)\.(?:jpg|webp)"[^>]*>', re.S)
    h = sum(ord(c) for c in cur)
    for _ in range(40):
        usados = set(re.findall(r'(?:poster="|src="|url\()/img/([\w-]+)\.(?:jpg|webp|webm)', body)) & set(POOL_MEDIA)
        vistos, cambio = set(), False
        ms = list(pat.finditer(body))
        for i, m in enumerate(ms):
            x = m.group(1) or m.group(2)
            if x in NO_CAMBIAR or x not in POOL_MEDIA: continue
            if m.group(2) and i + 1 < len(ms) and ms[i + 1].group(1) == x and not body[m.end():ms[i + 1].start()].strip(): continue
            if x not in vistos:
                vistos.add(x); continue
            libres = [v for v in POOL_MEDIA if v not in usados]
            if not libres: return body
            y = libres[h % len(libres)]; h += 3
            nuevo = re.sub(r"/img/%s\." % re.escape(x), "/img/%s." % y, m.group(0))
            nuevo = re.sub(r"object-position: [^;\"]+", "object-position: " + OPOS.get(y, "50% 50%"), nuevo)
            previo = body[max(0, m.start() - 1800):m.start()]
            ini = max(0, m.start() - 1800)
            if m.group(1):
                k = previo.rfind("/img/%s.jpg" % x)
                if k >= 0:
                    previo = previo[:k] + "/img/%s.jpg" % y + previo[k + len("/img/%s.jpg" % x):]
                    previo = previo.replace('data-v="%s"' % x, 'data-v="%s"' % y)
            body = body[:ini] + previo + nuevo + body[m.end():]
            cambio = True
            break
        if not cambio: break
    return body

def banda(cur, link):
    if cur == "/":
        v, t, sub, btn, href, flt = "sonrisa-luces", "Mándanos una foto de tu ventana o tu terraza", "Te decimos qué se puede hacer y cuánto cuesta, sin compromiso. Contestamos por WhatsApp.", "Escribir por WhatsApp", link, "brightness(1.05) saturate(1.1)"
    elif cur == "/blog/cerrar-terraza-antes-de-navidad":
        v, t, sub, btn, href, flt = "sonrisa-luces", "Que el frío no te quite la terraza esta Navidad", "Cuéntanos cómo es tu terraza y te decimos plazos y precio, sin compromiso. Mándanos una foto por WhatsApp.", "Escribir por WhatsApp", link, "brightness(1.05) saturate(1.1)"
    elif cur == "/ventanas-pvc":
        v, t, sub, btn, href, flt = "mujer-luz", "Más luz en casa, menos ruido y menos frío", "Medimos en tu casa, fabricamos en nuestro taller y las instalamos nosotros. Presupuesto cerrado por escrito.", "Pedir presupuesto", "/contacto", "brightness(1.0) saturate(1.05)"
    elif cur == "/ventanas-aluminio":
        v, t, sub, btn, href, flt = "salon-ventanal", "Ventanas de aluminio a medida, para cada hueco", "Desde una ventana hasta un gran ventanal: lo fabricamos en nuestro taller y lo instalamos nosotros.", "Pedir presupuesto", "/contacto", "brightness(1.0) saturate(1.05)"
    elif cur == "/contacto":
        v, t, sub, btn, href, flt = "llamada-sonrisa", "Cuéntanos tu proyecto", "Llámanos, escríbenos por WhatsApp o rellena el formulario. Te contestamos lo antes posible.", "Escribir por WhatsApp", link, "brightness(1.1) saturate(1.1)"
    elif cur == "/reparaciones":
        v, t, sub, btn, href, flt = "reforma-ventanal", "Antes de cambiarlo todo, déjanos mirarlo", "Mándanos una foto y te decimos si tiene arreglo o conviene sustituirlo, sin compromiso.", "Escribir por WhatsApp", link, "brightness(1.0) saturate(1.05)"
    elif cur == "/cerramientos-terrazas":
        v, t, sub, btn, href, flt = "villa-cristal", "Tu terraza, abierta todo el año", "Cuéntanos cómo es y te decimos qué sistema encaja y cuánto cuesta, sin compromiso.", "Pedir presupuesto", "/contacto", "brightness(1.12) saturate(1.1)"
    elif cur == "/pergolas":
        v, t, sub, btn, href, flt = "villa-cristal", "Sombra y cristal para disfrutar tu casa", "Pérgolas y cerramientos de aluminio a medida. Te asesoramos y medimos en tu casa.", "Pedir presupuesto", "/contacto", "brightness(1.12) saturate(1.1)"
    elif cur == "/persianas-cristales":
        v, t, sub, btn, href, flt = "ventana-cortina", "Luz, intimidad y confort en cada habitación", "Persianas, cristales y cambios de vidrio con medición en tu casa y presupuesto cerrado.", "Pedir presupuesto", "/contacto", "brightness(1.05) saturate(1.05)"
    elif cur == "/acabados":
        v, t, sub, btn, href, flt = "arquitecto-mesa", "Elige con calma cómo quieres que quede", "Colores, vidrios y accesorios: te lo enseñamos con muestras antes de fabricar.", "Pedir presupuesto", "/contacto", "brightness(1.05) saturate(1.05)"
    elif cur == "/comunidades":
        v, t, sub, btn, href, flt = "cliente-obrero", "Un interlocutor para tu comunidad", "Visitamos el edificio, presupuestamos por escrito y trabajamos con orden y limpieza.", "Pedir visita", "/contacto", "brightness(1.1) saturate(1.1)"
    elif cur == "/toldos":
        v, t, sub, btn, href, flt = "villa-cristal", "Sombra y frescor para tu terraza", "Toldos a medida con medición en tu casa y presupuesto cerrado por escrito.", "Pedir presupuesto", "/contacto", "brightness(1.12) saturate(1.1)"
    elif cur == "/automatismos":
        v, t, sub, btn, href, flt = "llamada-risa", "Cuéntanos qué puerta quieres automatizar", "Te asesoramos por teléfono o por WhatsApp y vamos a verla, sin compromiso.", "Escribir por WhatsApp", link, "brightness(1.12) saturate(1.1)"
    elif cur == "/techos":
        v, t, sub, btn, href, flt = "salon-ventanal", "Más luz y un acabado limpio sobre tu cabeza", "Techos de aluminio a medida para porches, terrazas y patios. Medimos en tu casa.", "Pedir presupuesto", "/contacto", "brightness(1.12) saturate(1.1)"
    elif cur == "/blog":
        v, t, sub, btn, href, flt = "mujer-libro", "¿Tienes dudas con tus ventanas?", "Lee las guías o cuéntanos tu caso: te respondemos sin compromiso.", "Escribir por WhatsApp", link, "brightness(1.1) saturate(1.1)"
    elif cur == "/cancelas-puertas":
        v, t, sub, btn, href, flt = "taller-hombre", "Fabricadas a medida en nuestro taller", "Cancelas y puertas de aluminio soldado, con o sin motor, instaladas por nuestro equipo.", "Pedir presupuesto", "/contacto", "brightness(1.12) saturate(1.1)"
    elif cur == "/rejas":
        v, t, sub, btn, href, flt = "lapiz-medicion", "Cada reja se mide y se fabrica a medida", "Medimos en tu casa o tu local y te damos precio cerrado por escrito.", "Pedir presupuesto", "/contacto", "brightness(1.1) saturate(1.1)"
    elif cur in ZONAS_N:
        v, t, sub, btn, href, flt = "cliente-obrero", f"Te atendemos en {ZONAS_N[cur]}", "Vamos a medir a tu casa, sin compromiso. Escríbenos por WhatsApp con una foto y te orientamos.", "Escribir por WhatsApp", link, "brightness(1.1) saturate(1.1)"
    elif cur == "/empresa":
        v, t, sub, btn, href, flt = "mujer-movil", "Ven a vernos o te visitamos nosotros", "Pasa por el taller de Villalbilla o cuéntanos tu proyecto por WhatsApp. Te atendemos personalmente, sin intermediarios.", "Escribir por WhatsApp", link, "brightness(1.1) saturate(1.1)"
    elif cur == "/financiacion":
        v, t, sub, btn, href, flt = "mujer-libro", "Tus ventanas nuevas, sin esperar a tener todo el dinero", "Cuéntanos qué necesitas y te decimos cuánto saldría al mes, sin compromiso.", "Escribir por WhatsApp", link, "brightness(1.05) saturate(1.05)"
    elif cur == "/trabajos":
        v, t, sub, btn, href, flt = "obra-balcon", "Obras bien hechas, de principio a fin", "Medimos, fabricamos en nuestro taller e instalamos nosotros. Sin intermediarios.", "Pedir presupuesto", "/contacto", "brightness(1.15) saturate(1.05)"
    else:
        return ""
    pos = OPOS.get(v, "50% 50%")
    return f'''<section class="vsec2" data-v="{v}" style="background: #12202B url(/img/{v}.jpg) {pos} / cover">
<style>.vsec2{{position:relative;overflow:hidden;color:#fff;min-height:440px;display:flex;align-items:center}}.vsec2 .vb{{position:absolute;inset:0}}.vsec2 .vb video{{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(1.2) saturate(1.06)}}.vsec2[data-v="mujer-luz"] .vb video,.vsec2[data-v="mujer-luz"]{{filter:none}}.vsec2[data-v="mujer-luz"] .vb video{{filter:brightness(1.7) contrast(.95) saturate(1.05)}}.vsec2 .vo{{position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,22,31,.62) 0%,rgba(12,22,31,.40) 38%,rgba(12,22,31,.04) 72%,rgba(12,22,31,0) 100%)}}.vsec2 .vt{{position:relative;width:100%;max-width:1200px;margin:0 auto;padding:72px 24px;text-shadow:0 1px 16px rgba(0,0,0,.5)}}@media (max-width:760px){{.vsec2{{display:block;min-height:0;background:#12202B!important}}.vsec2 .vb{{position:relative;aspect-ratio:16/10;width:100%}}.vsec2 .vo{{display:none}}.vsec2 .vt{{padding:28px 20px 36px}}.vsec2 .vt h2{{text-shadow:none!important}}}}</style>
<div class="vb"><video class="vbg" autoplay muted loop playsinline preload="metadata" poster="/img/{v}.jpg" aria-hidden="true" style="object-position: {pos}; filter: {flt}"><source src="/img/{v}.webm" type="video/webm"><source src="/img/{v}.mp4" type="video/mp4"></video></div>
<div class="vo"></div>
<div class="vt"><div style="max-width: 560px">
<h2 style="margin: 0; font-size: clamp(26px, 5vw, 38px); line-height: 1.12; font-weight: 800; text-shadow: 0 1px 12px rgba(0,0,0,.35)">{t}</h2>
<p style="margin: 14px 0 24px; font-size: 18px; line-height: 1.5; color: #E6ECF1">{sub}</p>
<a href="{href}" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 28px; border-radius: 6px; background: #C2410C; color: #fff; font-weight: 700; font-size: 17px; text-decoration: none">{btn}</a>
</div></div>
</section>'''

MAPA_OLD = '<div style="max-width: 1200px; margin: 0 auto; padding: 0; height: 320px; background: #DCE2E7; display: flex; align-items: center; justify-content: center; color: #4A5A68; font-size: 15px">[Mapa de Google con la ubicación del taller]</div>'
MAPA_NEW = ('<div style="max-width: 1200px; margin: 0 auto; padding: 0; height: 380px; background: #DCE2E7; position: relative">'
            '<iframe title="Mapa: AMS Cerramientos, C/ Siete Picos 28, Villalbilla" data-ck-src="https://www.google.com/maps?q=Calle+Siete+Picos+28,+28810+Villalbilla,+Madrid&hl=es&z=16&output=embed" width="100%" height="380" style="border:0;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>'
            '<p style="max-width: 1200px; margin: 0 auto; padding: 14px 24px 0; font-size: 15px; color: #4A5A68">Nuestro taller: C/ Siete Picos 28, 28810 Villalbilla (Madrid). <a href="https://www.google.com/maps/dir/?api=1&destination=Calle+Siete+Picos+28,+28810+Villalbilla,+Madrid" target="_blank" rel="noopener" style="color: #C2410C; font-weight: 700">Cómo llegar</a></p>')

def write(path_out, cur, title, desc, body):
    body = body.replace(MAPA_OLD, MAPA_NEW)
    body = body.replace("<span>Acepto la política de privacidad</span>", "<span>Acepto la <a href=\"/privacidad\" target=\"_blank\" style=\"color: #C2410C; font-weight: 700\">política de privacidad</a></span>")
    body = alegria(cur, body)
    if cur == "/" and "pasos4" not in body and "Así trabajamos" in body:
        _k = body.index("</section>", body.index("Así trabajamos")) + len("</section>")
        body = body[:_k] + pages_indices.pasos_home() + body[_k:]
    if cur == "/contacto" and "chero" not in body:
        _a = body.find('<section style="background: #12202B; color: #FFFFFF">')
        _b = body.find("</section>", _a)
        if _a >= 0 and _b > _a:
            _in = body[_a:_b]
            _in = _in.replace('<section style="background: #12202B; color: #FFFFFF">', "", 1).replace('max-width: 900px; margin: 0 auto; padding: 56px 24px 56px', 'max-width: 1100px; margin: 0 auto; padding: 64px 24px 64px', 1)
            _in = _in.replace('<p style="margin: 0; font-size: 19px', '<p style="margin: 0; max-width: 540px; font-size: 19px', 1)
            _chips = '<ul class="chc"><li>Visita y medición gratis</li><li>Presupuesto cerrado por escrito</li><li>Sin compromiso</li></ul>'
            _in = _in[:_in.rindex("</div>")] + _chips + "</div>"
            body = (body[:_a] + '<section class="chero"><style>.chero{position:relative;overflow:hidden;background:#12202B;color:#fff;min-height:400px;display:flex;align-items:center}'
                    '.chero .chv{position:absolute;top:0;right:0;bottom:0;width:66%}.chero .chv video{width:100%;height:100%;object-fit:cover;object-position:50% 12%;display:block;filter:brightness(1.12) saturate(1.05)}'
                    '.chero .cho{position:absolute;inset:0;background:linear-gradient(90deg,#12202B 0%,#12202B 30%,rgba(18,32,43,.72) 48%,rgba(18,32,43,.12) 80%,rgba(18,32,43,0) 100%)}'
                    '.chero>div:last-child{position:relative;width:100%}.chc{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}'
                    '.chc li{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:7px 14px;font-weight:600;font-size:14.5px;backdrop-filter:blur(4px)}'
                    '.chero h1,.chero p,.chero a{text-shadow:0 1px 8px rgba(0,0,0,.35)}'
                    '@media(max-width:760px){.chero{min-height:420px}.chero .chv{width:100%}.chero .chv video{object-position:62% 25%}.chero .cho{background:linear-gradient(180deg,rgba(18,32,43,.78) 0%,rgba(18,32,43,.62) 55%,rgba(18,32,43,.86) 100%)}}</style>'
                    '<div class="chv"><video class="vbg" autoplay muted loop playsinline preload="metadata" poster="/img/llamada-sonrisa.jpg" aria-hidden="true"><source src="/img/llamada-sonrisa.webm" type="video/webm"><source src="/img/llamada-sonrisa.mp4" type="video/mp4"></video></div><div class="cho"></div>'
                    + _in + body[_b:])
    body = interlink(cur, body)
    body = body + personas(cur) + banda(cur, wa(WA_MSG.get(cur, WA_DEFAULT)))
    body = dedup_media(cur, body)
    body = zonas_links(img_attrs(body))
    body = re.sub(r"minmax\((\d+)px, 1fr\)", r"minmax(min(\1px, 100%), 1fr)", body)
    body = body.replace('src="" alt=""', 'src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=" alt=""')
    link = wa(WA_MSG.get(cur, WA_DEFAULT))
    body = body.replace('https://wa.me/34639788220"', link + '"')
    foot = FOOTER.replace("WA_LINK", link)
    html = f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#12202B">
{seo.head_extra(cur, title, desc, body)}
<link rel="icon" href="/img/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/estilos.css">
<script>window.va=window.va||function(){{(window.vaq=window.vaq||[]).push(arguments)}}</script>
<script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
{header(cur)}
<main>
{body}
</main>
{foot}
<script src="/web.js"></script>
</body>
</html>
'''
    open(os.path.join(OUT, path_out), "w", encoding="utf-8").write(html)

import seo
from interlink import interlink
from pages_hogar import HOGAR_ARTS, franja_hogar as _hogar, herramientas_sec as _herrsec, FRASES, frase as _frase
from pages_obras import p_mapa, p_garantia, franja as _franja, seccion as _mapa_sec
from pages_zonas import ZONA_PAGES
from pages_cuestionario import pagina as _cuestionario
from pages_correos import pagina as _correos
from pages_fotos import pagina as _fotos
from pages_legal import LEGAL as _LEGAL
from pages_landing_cancelas import p_landing_cancelas as _p_landing_cancelas
from pages_new import NEW_PAGES, head as _head, table as _table, sec as _sec
from articles_new import ARTICLES
from pages_glosario import p_glosario
from pages_herramientas import p_diagnostico, p_simulador, p_presupuesto, p_ayudas, p_medir, p_permisos, p_visualizador

DESCS = {
    "/": "Fabricantes de ventanas de aluminio y PVC, cerramientos de terraza, pérgolas, toldos y cancelas en Alcalá de Henares, Madrid y Guadalajara.",
    "/empresa": "AMS Cerramientos: fabricantes e instaladores de carpintería de aluminio y PVC con más de 20 años de experiencia en Madrid y Guadalajara.",
    "/cerramientos-terrazas": "Cerramientos de terrazas, áticos y porches en aluminio, PVC o cortina de cristal en Alcalá de Henares, Madrid y Guadalajara. Medición y presupuesto gratis.",
    "/ventanas-aluminio": "Ventanas de aluminio a medida con rotura de puente térmico: correderas, practicables, oscilobatientes y mallorquinas. Fabricación propia en nuestro taller de Villalbilla (Madrid).",
    "/ventanas-pvc": "Ventanas de PVC Kömmerling instaladas por la red oficial de la marca en Alcalá de Henares, Madrid y Guadalajara.",
    "/pergolas": "Pérgolas bioclimáticas y techos de aluminio a medida para patios, jardines y terrazas en Alcalá de Henares y el Corredor del Henares.",
    "/cancelas-puertas": "Cancelas de aluminio soldado, puertas y automatismos en Alcalá de Henares, Madrid y Guadalajara. Fabricación propia e instalación.",
    "/persianas-cristales": "Persianas térmicas, de seguridad y motorizadas, mosquiteras y cristales Climalit para tus ventanas. Instalación en Madrid y Guadalajara.",
    "/comunidades": "Mantenimiento y reparación de puertas, cerraduras, motores y persianas para comunidades de vecinos, con tarifa plana o pago por visita.",
    "/acabados": "Acabados de aluminio y PVC: lacado, anodizado, imitación madera y bicolor. Carta de colores y calidades para ventanas y cerramientos.",
    "/financiacion": "Financia tus ventanas y cerramientos hasta en 12 meses y consulta las ayudas disponibles. AMS Cerramientos, Madrid y Guadalajara.",
    "/trabajos": "Trabajos realizados por AMS Cerramientos: cerramientos, ventanas, cancelas, pérgolas y rejas en Madrid y Guadalajara.",
    "/glosario": "Glosario de ventanas, cerramientos y cerrajería explicado sin jerga.",
    "/blog": "Guías y consejos de AMS Cerramientos sobre ventanas, cerramientos de terraza, ayudas y precios en Madrid y Guadalajara.",
    "/blog/precio-cerrar-terraza": "Cuánto cuesta cerrar una terraza en Madrid: precios por metro cuadrado según material y vidrio, y qué factores cambian el presupuesto.",
    "/blog/pvc-o-aluminio": "PVC o aluminio para tus ventanas en Madrid: comparativa de aislamiento, ruido, mantenimiento, estética y precio.",
    "/blog/cerrar-terraza-antes-de-navidad": "Cerrar la terraza antes de las fiestas: plazos, pasos y qué preparar para llegar a tiempo.",
    "/blog/ayudas-cambiar-ventanas-madrid": "Ayudas para cambiar ventanas en Madrid en 2026: qué se puede pedir, requisitos y cómo gestionarlo.",
    "/alcala-de-henares": "Ventanas y cerramientos en Alcalá de Henares: fabricantes locales, licencias, plazos y presupuesto gratis. AMS Cerramientos.",
    "/contacto": "Pide presupuesto gratis a AMS Cerramientos: llama al 639 78 82 20, escribe por WhatsApp o rellena el formulario.",
}

NUEVO_CANCELAS = '<section>\n<div style="max-width: 1200px; margin: 0 auto; padding: 72px 24px; display: flex; flex-direction: column; gap: 28px">\n<h2 style="margin: 0; font-size: clamp(26px, 5.5vw, 36px); font-weight: 800">Precio de referencia</h2>\n<div style="padding: 28px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px; max-width: 520px"><h3 style="margin: 0; font-size: 20px">Cancela de aluminio soldado con lama ciega acanalada</h3><span style="font-family: Archivo, sans-serif; font-size: 30px; font-weight: 800; color: #B8430A">desde 400 € el metro cuadrado</span><span style="font-size: 13px; color: #4A5A68">Precio aproximado, a medida. IVA no incluido. El montaje va incluido; el motor se presupuesta aparte.</span></div>\n<h2 style="margin: 16px 0 0; font-size: clamp(24px, 5vw, 32px); font-weight: 800">Nuestros modelos</h2>\n<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 20px"><div style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 20px">Modelo Henares</h3><p style="margin: 0; font-size: 15px; line-height: 1.55; color: #4A5A68">Lamas anchas ciegas: privacidad total y estilo moderno. Con puerta peatonal integrada si la quieres.</p></div><div style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 20px">Modelo Alcarria</h3><p style="margin: 0; font-size: 15px; line-height: 1.55; color: #4A5A68">Lama, hueco, lama: perfiles verticales que estilizan la fachada de chalets y fincas.</p></div><div style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 20px">Modelo Claridad</h3><p style="margin: 0; font-size: 15px; line-height: 1.55; color: #4A5A68">Lama ciega con barrote vertical: privacidad abajo, luz y vista arriba.</p></div><div style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 20px">Modelo Brisa</h3><p style="margin: 0; font-size: 15px; line-height: 1.55; color: #4A5A68">Lama veneciana o de avión: deja pasar el aire y protege tu intimidad.</p></div><div style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 20px">Modelo Chapa perforada</h3><p style="margin: 0; font-size: 15px; line-height: 1.55; color: #4A5A68">Más visibilidad sin perder privacidad.</p></div><div style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 20px">Modelo Forja</h3><p style="margin: 0; font-size: 15px; line-height: 1.55; color: #4A5A68">La elegancia de la forja de hierro, hecha en aluminio soldado: no se oxida nunca.</p></div><div style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 20px">Modelo Élite</h3><p style="margin: 0; font-size: 15px; line-height: 1.55; color: #4A5A68">Lama con perfil plata, el acabado más cuidado de la gama.</p></div></div>\n</div>\n</section>'
CHIPS = [("/techos", "Techos de aluminio"), ("/toldos", "Toldos y tejidos"), ("/automatismos", "Automatismos"), ("/reparaciones", "Reparaciones"), ("/acabados", "Acabados y calidades")]
CHIP_ST = "display: inline-flex; align-items: center; min-height: 40px; padding: 0 16px; border: 1px solid #DCE2E7; border-radius: 999px; background: #FFFFFF; color: #12202B; text-decoration: none; font-weight: 600; font-size: 14px"
LK = "font-weight: 700; color: #B8430A"

def rep(body, old, new, url):
    if old not in body:
        print("AVISO: no encontrado en", url, "->", old[:60])
        return body
    return body.replace(old, new, 1)

def before_section(body, text, html, url):
    i = body.find(text)
    if i < 0:
        print("AVISO: ancla no encontrada en", url, text); return body
    j = body.rfind("<section", 0, i)
    return body[:j] + html + "\n\n" + body[j:]

def post(url, body):
    if url == "/":
        body = re.sub(r'(<div class="hero-img"[^>]*>)<img[^>]*>', lambda m: m.group(1) + '<video class="vbg" autoplay muted loop playsinline preload="metadata" poster="/img/villa-cristal.jpg" aria-label="Balcón de cristal y pérgola de aluminio" style="width: 100%; height: 100%; object-fit: cover; display: block"><source src="/img/villa-cristal.webm" type="video/webm"><source src="/img/villa-cristal.mp4" type="video/mp4"></video>', body, count=1)
    if url == "/":
        body = before_section(body, "Dónde trabajamos", _mapa_sec(), url)
        body = before_section(body, "Qué fabricamos e instalamos", _franja(), url)
    if url == "/trabajos":
        body = before_section(body, "Pulsa una foto", _mapa_sec(h2=True), url)
    if url in ("/", "/ventanas-pvc", "/ventanas-aluminio", "/cerramientos-terrazas", "/empresa"):
        _t = {"/": "Qué fabricamos e instalamos"}.get(url)
        if _t:
            body = before_section(body, _t, _hogar(), url)
            body = before_section(body, _t, _herrsec(), url)
        else:
            _k = body.rfind('<section style="background: #12202B; color: #FFFFFF">')
            body = body[:_k] + _hogar() + "\n\n" + body[_k:] if _k >= 0 else body + _hogar()
    if url in FRASES:
        if url == "/":
            body = before_section(body, "Dónde trabajamos", _frase(url), url)
        else:
            _k = body.rfind('<section style="background: #12202B; color: #FFFFFF">')
            if _k > 0: body = body[:_k] + _frase(url) + "\n\n" + body[_k:]
            else: print("AVISO: sin cierre oscuro para frase", url)
    if url == "/blog":
        _bn = ('<section style="background:#FFFFFF"><div style="max-width:1200px;margin:0 auto;padding:36px 24px 8px;display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))">'
               '<a href="/glosario" style="padding:26px;background:#12202B;border-radius:12px;display:flex;flex-direction:column;gap:8px;text-decoration:none;color:#fff"><span style="font-size:12px;font-weight:700;color:#F4A261;text-transform:uppercase;letter-spacing:.04em">Glosario</span><b style="font-size:22px;line-height:1.3">Más de cien términos explicados sin jerga</b><span style="color:#D3DBE2">Busca una palabra, entiende tu presupuesto.</span></a>'
               '<a href="/blog/ventanas-ahorro-energia-calor-frio" style="padding:26px;background:linear-gradient(135deg,#FFF1E2,#EAF4FC);border-radius:12px;display:flex;flex-direction:column;gap:8px;text-decoration:none;color:#12202B"><span style="font-size:12px;font-weight:700;color:#B8430A;text-transform:uppercase;letter-spacing:.04em">Ahorro de energía</span><b style="font-size:22px;line-height:1.3">Menos frío en invierno, menos calor en verano</b><span style="color:#3D5163">Qué cambian unas buenas ventanas en tu casa.</span></a>'
               '</div></section>')
        body = before_section(body, "Destacadas", _bn, url)
    if url == "/":
        chips = '<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px"><strong style="font-size: 15px">También:</strong>' + "".join(f'<a href="{u}" style="{CHIP_ST}">{t}</a>' for u, t in CHIPS) + "</div>"
        body = rep(body, '<a href="/comunidades" style="display: flex; flex-wrap: wrap; justify-content', chips + '\n<a href="/comunidades" style="display: flex; flex-wrap: wrap; justify-content', url)
    if url == "/cancelas-puertas":
        body = re.sub(r'<section>\s*<div style="[^"]*">\s*<h2[^>]*>Precios de referencia</h2>.*?</section>', lambda m: NUEVO_CANCELAS, body, count=1, flags=re.S)
        body = re.sub(r'<div style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 20px">Rejas</h3>.*?</p></div>\n', '', body, count=1, flags=re.S)
        body = body.replace("Cancelas, puertas y rejas", "Cancelas y puertas").replace("Cancelas, puertas, rejas y automatismos", "Cancelas, puertas y automatismos")
        body = body.replace("Perfilería Cortizo y Technal de 3 mm", "Perfilería de aluminio de 3 mm")
        body = rep(body, "Para garajes, naves y locales, con automatismo.</p>", f'Para garajes, naves y locales, con automatismo.</p><a href="/automatismos" style="{LK}">Ver automatismos</a>', url)
        body = rep(body, "la puerta se para sola si hay un coche o una persona.</p>", f'la puerta se para sola si hay un coche o una persona.</p><a href="/automatismos" style="{LK}">Ver automatización de puertas y cancelas</a>', url)
    if url == "/pergolas":
        body = rep(body, "De cristal, policarbonato o panel sándwich, para porches, áticos y patios.</p>", f'De cristal, policarbonato o panel sándwich, para porches, áticos y patios.</p><a href="/techos" style="{LK}">Ver techos de aluminio</a>', url)
        body = rep(body, "con un catálogo amplio de lonas para que combine con tu fachada.</p>", f'con un catálogo amplio de lonas para que combine con tu fachada.</p><a href="/toldos" style="{LK}">Ver toldos y tejidos</a>', url)
    if url == "/comunidades":
        body = rep(body, f'<a href="/cancelas-puertas" style="font-weight: 700; color: #B8430A">Ver automatismos de puertas</a>', f'<div style="display: flex; flex-wrap: wrap; gap: 24px"><a href="/automatismos" style="{LK}">Ver automatismos de puertas</a><a href="/reparaciones" style="{LK}">Ver reparaciones</a></div>', url)
    if url == "/persianas-cristales":
        body = re.sub(r'<h2[^>]*>Mamparas</h2>\s*<p[^>]*>.*?</p>', '', body, flags=re.S)
        body = body.replace(" [Confirmar con AMS los modelos de mosquitera que ofrecen]", "")
    if url == "/cancelas-puertas":
        body = rep(body, "Garantía de <strong>5 años en la estructura soldada</strong> y 2 años en la motorización.", "Garantía de <strong>2 años en todos los trabajos</strong>.", url)
    if url == "/blog":
        for ttl, href in [("Ventanas oscilobatientes: precios y materiales para no equivocarte", "/blog/ventanas-oscilobatientes"), ("Cancelas de aluminio soldado: lo que debes saber antes de comprar", "/blog/cancelas-aluminio-soldado"), ("Cómo se instala bien una ventana de PVC y cuánto se tarda", "/blog/instalacion-ventanas-pvc"), ("Cajones de persiana: por qué por ahí se escapa el calor y cómo evitarlo", "/blog/cajones-persiana-aislados")]:
            pat = r'<div (style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px")>(<span[^>]*>[^<]*</span><h3[^>]*>' + re.escape(ttl) + r'</h3>)</div>'
            new_html, n = re.subn(pat, lambda m: '<a href="' + href + '" ' + m.group(1)[:-1] + '; text-decoration: none; color: #12202B">' + m.group(2) + '</a>', body, count=1)
            if n == 0: print("AVISO: tarjeta de blog no encontrada", ttl)
            body = new_html
    if url == "/blog":
        _nueva = '<a href="/blog/rotura-puente-termico" style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px; text-decoration: none; color: #12202B"><span style="font-size: 12px; font-weight: 700; color: #B8430A; text-transform: uppercase; letter-spacing: 0.04em">Ventanas</span><h3 style="margin: 0; font-size: 19px; line-height: 1.3">¿Qué es la rotura de puente térmico y para qué sirve?</h3></a>\n'
        def _card(href, cat, ttl): return '<a href="' + href + '" style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px; text-decoration: none; color: #12202B"><span style="font-size: 12px; font-weight: 700; color: #B8430A; text-transform: uppercase; letter-spacing: 0.04em">' + cat + '</span><h3 style="margin: 0; font-size: 19px; line-height: 1.3">' + ttl + '</h3></a>\n'
        _nueva = _card("/blog/una-ventana-no-es-solo-una-ventana", "Reflexión", "Una ventana no es solo una ventana: es por donde miras y por donde te comunicas") + _card("/blog/no-hacemos-ventanas-hacemos-hogares", "Hogar", "No hacemos ventanas, hacemos hogares") + _card("/blog/ventanas-ahorro-energia-calor-frio", "Ahorro de energía", "Ventanas y ahorro de energía: menos frío en invierno, menos calor en verano") + _card("/blog/mas-que-una-ventana", "Hogar", "Más que una ventana: luz, silencio y una casa donde apetece quedarse") + _card("/blog/condensacion-ventanas", "Ventanas", "Condensación y moho en las ventanas: por qué aparecen y cómo evitarlos") + _card("/blog/kommerling-76-ad-md-xtrem", "Kömmerling", "Kömmerling 76 AD y 76 MD Xtrem: qué son y cuál elegir") + _card("/blog/mantenimiento-limpieza-ventanas", "Mantenimiento", "Cómo limpiar y mantener las ventanas de PVC y aluminio") + _card("/blog/mejor-epoca-cambiar-ventanas", "Consejos", "¿Cuál es la mejor época del año para cambiar las ventanas?") + _nueva
        _gl = '<a href="/glosario" style="padding: 24px; background: #12202B; border-radius: 10px; display: flex; flex-direction: column; gap: 8px; text-decoration: none; color: #FFFFFF; grid-column: 1 / -1"><span style="font-size: 12px; font-weight: 700; color: #F4A261; text-transform: uppercase; letter-spacing: 0.04em">Glosario</span><h3 style="margin: 0; font-size: 22px; line-height: 1.3">Glosario de ventanas, cerramientos y cerrajería: más de cien términos explicados sin jerga</h3></a>\n'
        _nueva = _gl + _card("/blog/cuanto-cuesta-cambiar-ventanas", "Precio", "¿Cuánto cuesta cambiar las ventanas de una casa?") + _card("/blog/licencia-obras-cambiar-ventanas", "Trámites", "¿Hace falta licencia de obras para cambiar las ventanas?") + _nueva
        _ancla = '<a href="/blog/ventanas-oscilobatientes"'
        if _ancla in body: body = body.replace(_ancla, _nueva + _ancla, 1)
        else: print("AVISO: ancla del blog no encontrada")
    if url == "/trabajos":
        _base = "https://amscerramientos.es/wp-content/uploads/"
        def _fig(cat, img, alt, ttl, sub):
            return ('<figure class="gal-item" data-cat="' + cat + '" style="margin: 0; display: flex; flex-direction: column; gap: 10px"><a href="' + _base + img + '" class="gal-link"><img loading="lazy" src="' + _base + img + '" alt="' + alt + '" style="width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 10px; display: block"></a>'
                    '<figcaption style="display: flex; flex-direction: column; gap: 2px"><strong style="font-size: 16px">' + ttl + '</strong><span style="font-size: 14px; color: #4A5A68">' + sub + '</span></figcaption></figure>\n')
        _reales = (_fig("terrazas", "2018/10/Cerramiento-de-aluminio-en-Alcala-de-Henares.jpg", "Cerramiento de terraza de aluminio blanco con grandes correderas de cristal", "Cerramiento de terraza con correderas", "Aluminio blanco · Obra real de AMS")
                   + _fig("terrazas", "2015/02/Cerramiento_AL_6.jpg", "Porche cerrado con aluminio blanco y cristal junto a una escalera de ladrillo", "Cerramiento de porche acristalado", "Aluminio blanco y cristal · Obra real de AMS")
                   + _fig("cancelas", "2019/05/cancela-aluminio-soldado-efecto-gris.jpeg", "Cancela corredera y puerta peatonal de aluminio soldado gris antracita", "Cancela de aluminio soldado con puerta peatonal", "Aluminio gris antracita · Obra real de AMS"))
        _ico = {
            "ventanas": '<svg viewBox="0 0 64 64"><rect x="10" y="8" width="44" height="48" rx="2"/><path d="M32 8v48M10 32h44"/><path d="M26 30v4M38 30v4"/></svg>',
            "terrazas": '<svg viewBox="0 0 64 64"><path d="M6 54h52M10 54V16h44v38"/><path d="M10 28h44M24 16v38M38 16v38"/></svg>',
            "pergolas": '<svg viewBox="0 0 64 64"><path d="M10 58V20M54 58V20M6 20h52"/><path d="M12 28h40M12 36h40M12 44h40" stroke-dasharray="3 5"/><path d="M6 20l6-8h40l6 8"/></svg>',
            "cancelas": '<svg viewBox="0 0 64 64"><path d="M6 54h52M8 54V14M56 54V14"/><rect x="14" y="22" width="36" height="26" rx="1"/><path d="M22 22v26M30 22v26M38 22v26M46 22v26"/><path d="M20 12h24m-5-4l5 4-5 4"/></svg>',
            "rejas": '<svg viewBox="0 0 64 64"><rect x="10" y="8" width="44" height="48" rx="2"/><path d="M20 8v48M32 8v48M44 8v48"/><path d="M14 20c4 0 6 4 6 8M26 20c4 0 6 4 6 8M38 20c4 0 6 4 6 8" /></svg>',
            "toldos": '<svg viewBox="0 0 64 64"><path d="M8 14h48l4 18H4z"/><path d="M20 14l-3 18M32 14v18M44 14l3 18"/><path d="M4 32c4 6 8 6 12 0 4 6 8 6 12 0 4 6 8 6 12 0 4 6 8 6 12 0 3 4 6 5 8 3"/><path d="M12 36v22M52 36v22"/></svg>'}
        def _ph(cat, ttl, sub):
            return ('<figure class="gal-item gal-ph" data-cat="' + cat + '" style="margin: 0; display: flex; flex-direction: column; gap: 10px"><div class="ph" role="img" aria-label="' + ttl + ': foto próximamente"><b>Foto próximamente</b>' + _ico[cat] + '</div>'
                    '<figcaption style="display: flex; flex-direction: column; gap: 2px"><strong style="font-size: 16px">' + ttl + '</strong><span style="font-size: 14px; color: #4A5A68">' + sub + '</span></figcaption></figure>\n')
        _lista = [
            ("terrazas", "Cerramiento de terraza en ático", "Aluminio · Torrejón de Ardoz"),
            ("ventanas", "Ventanas de PVC Kömmerling", "PVC · Alcalá de Henares"),
            ("pergolas", "Pérgola bioclimática de lamas", "Aluminio · Alcalá de Henares"),
            ("cancelas", "Cancela corredera motorizada", "Aluminio soldado · Meco"),
            ("terrazas", "Cierre de terraza con cortina de cristal", "Cristal sin perfiles · Madrid"),
            ("ventanas", "Ventanas oscilobatientes con rotura de puente térmico", "Aluminio · Coslada"),
            ("toldos", "Toldo de brazos extensibles", "Lona acrílica · Azuqueca de Henares"),
            ("terrazas", "Cerramiento de porche acristalado", "Aluminio y cristal · Villalbilla"),
            ("ventanas", "Ventanal corredero de salón", "Aluminio · Guadalajara"),
            ("cancelas", "Cancela batiente con puerta peatonal", "Aluminio soldado · Guadalajara"),
            ("pergolas", "Pérgola adosada a la fachada", "Aluminio · Villalbilla"),
            ("ventanas", "Ventana con persiana integrada", "PVC y aluminio · Torrejón de Ardoz"),
            ("terrazas", "Terraza adosada cerrada con correderas", "Aluminio · Meco"),
        ]
        _tiles = "".join(_ph(*x) for x in _lista)
        _k = body.find('</figure>\n</div>\n<p style="margin: 0; font-size: 14px; color: #4A5A68">Pulsa una foto')
        if _k < 0: print("DEBUG", repr(body[body.rfind("</figure>"):body.rfind("</figure>")+120]))
        assert _k > 0, "fin de galeria no encontrado"
        body = body[:_k + 9] + '\n' + _tiles + body[_k + 9:]
        body = body.replace('<button type="button" data-filter="cancelas" aria-pressed="false" class="">Cancelas</button>', '<button type="button" data-filter="cancelas" aria-pressed="false" class="">Cancelas</button><button type="button" data-filter="toldos" aria-pressed="false" class="">Toldos y techos</button>', 1)
        body = body.replace('<figure class="gal-item"', _reales + '<figure class="gal-item"', 1)
        body = body.replace(" · [Localidad]", "")
        body = body.replace("Boceto: estas imágenes son de muestra. Aquí irán fotos reales de obras, con su localidad y el material.", "Las fotos marcadas como obra real son de trabajos de AMS. El resto son imágenes de muestra: aquí irán más fotos reales de obras, con su localidad y el material.")
    if url == "/blog":
        _bi = {"ayudas-cambiar-ventanas-madrid": "mujer-libro", "cerrar-terraza-antes-de-navidad": "sonrisa-luces", "precio-cerrar-terraza": "terraza-cristal", "pvc-o-aluminio": "reforma-ventanal",
               "condensacion-ventanas": "ventana-cortina", "kommerling-76-ad-md-xtrem": "ventana-pvc-hero", "mantenimiento-limpieza-ventanas": "villa-cristal", "mejor-epoca-cambiar-ventanas": "obra-balcon",
               "rotura-puente-termico": "taller-hombre", "ventanas-oscilobatientes": "mujer-luz", "cancelas-aluminio-soldado": "cancela", "instalacion-ventanas-pvc": "lapiz-medicion", "cajones-persiana-aislados": "arquitecto-mesa", "ventanas-ahorro-energia-calor-frio": "salon-ventanal", "mas-que-una-ventana": "terraza-cristal", "no-hacemos-ventanas-hacemos-hogares": "hombre-sonriendo", "una-ventana-no-es-solo-una-ventana": "ventana-cortina"}
        _ext = lambda n: "/img/" + n + (".webp" if n in ("cancela", "ventana-pvc-hero") else ".jpg")
        _destacadas = [("ayudas-cambiar-ventanas-madrid"), ("cerrar-terraza-antes-de-navidad"), ("precio-cerrar-terraza"), ("pvc-o-aluminio")]
        _it = iter(_destacadas)
        def _sw(m):
            try: sl = next(_it)
            except StopIteration: return m.group(0)
            return re.sub(r'src="/img/antes-despues-[a-z]+\.webp"', 'src="' + _ext(_bi[sl]) + '"', m.group(0))
        body = re.sub(r'<img [^>]*src="/img/antes-despues-[a-z]+\.webp"[^>]*>', _sw, body)
        def _txtcard(m):
            sl = m.group(1)
            if sl not in _bi: return m.group(0)
            return ('<a href="/blog/' + sl + '" style="background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; overflow: hidden; text-decoration: none; color: #12202B">'
                    '<img loading="lazy" src="' + _ext(_bi[sl]) + '" alt="" style="width: 100%; height: 170px; object-fit: cover; display: block">'
                    '<div style="padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 8px">' + m.group(2) + '</div></a>')
        body = re.sub(r'<a href="/blog/([a-z0-9-]+)" style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px; text-decoration: none; color: #12202B">(.*?)</a>', _txtcard, body, flags=re.S)
    if url == "/blog":
        _prox = {"Ventanas practicables: la mejor opción si te molesta el ruido de la calle": "ejemplo-ventana-despues", "Tipos de ventanas: correderas, abatibles, oscilobatientes y cuál poner en cada habitación": "cliente-obrero",
                 "Persianas motorizadas: comodidad y ahorro de energía": "mujer-movil", "Ventanas para una casa pasiva: qué es el certificado Passivhaus": "techo-buhardilla", "10 razones para elegir ventanas de aluminio": "hombre-sonriendo"}
        def _pc(m):
            inner = m.group(1)
            for ttl, im in _prox.items():
                if ttl in inner:
                    return ('<div style="background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; overflow: hidden; color: #12202B"><div style="position: relative"><img loading="lazy" src="/img/' + im + '.jpg" alt="" style="width: 100%; height: 170px; object-fit: cover; display: block">'
                            '<span style="position: absolute; left: 12px; top: 12px; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; background: #F5B27F; color: #12202B; padding: 5px 10px; border-radius: 99px">Próximamente</span></div>'
                            '<div style="padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 8px">' + inner + '</div></div>')
            return m.group(0)
        body = re.sub(r'<div style="padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px">(.*?)</div>', _pc, body, flags=re.S)
    if url == "/blog/ayudas-cambiar-ventanas-madrid":
        body = body.replace('width="448" height="481" src="/img/antes-despues-ventana.webp" alt="Antes y después: ventana antigua deteriorada y la misma ventana sustituida por una de PVC blanco"', 'src="/img/mujer-libro.jpg" alt="Mujer leyendo documentación en el salón de su casa"')
    if url == "/blog/cerrar-terraza-antes-de-navidad":
        body = body.replace('width="512" height="481" src="/img/antes-despues-terraza.webp" alt="Antes y después: terraza abierta y la misma terraza cerrada con aluminio blanco"', 'src="/img/sonrisa-luces.jpg" alt="Mujer sonriendo con luces de Navidad al fondo"')
    if url == "/blog/precio-cerrar-terraza":
        body = body.replace('width="512" height="481" src="/img/antes-despues-terraza.webp" alt="Antes y después: terraza abierta y la misma terraza cerrada con aluminio blanco"', 'src="/img/terraza-cristal.jpg" alt="Terraza cerrada con grandes cristales y vistas a una piscina"')
    if url == "/blog/pvc-o-aluminio":
        body = re.sub(r'(<h1[^>]*>.*?</h1>.*?)<img [^>]*src="/img/[^"]+"[^>]*>', lambda m: m.group(1) + '<img src="/img/reforma-ventanal.jpg" alt="Gran ventanal luminoso en una vivienda en reforma" style="width: 100%; height: 380px; object-fit: cover; border-radius: 10px; display: block">', body, count=1, flags=re.S)
    if url == "/ventanas-aluminio":
        serie = _sec(
            _head("Series que fabricamos", "Perfiles de Cortizo, Technal y Alugom, fabricados y montados por nosotros. Te recomendamos la serie según el aislamiento, el ruido y el presupuesto de tu obra. Si no sabes qué es la rotura de puente térmico, <a href=\"/blog/rotura-puente-termico\" style=\"color: #B8430A\">lo explicamos aquí</a>.")
            + _table(["Serie", "Tipo de ventana", "Detalle"], [
                ["Serie 300 EUR", "Corredera", "Serie estándar"],
                ["Serie 400 EUR", "Corredera", "Serie estándar"],
                ["Serie 350 EUR", "Practicable", "Perfil de 40 mm"],
                ["Silver 65 RPT", "Corredera", "Con rotura de puente térmico"],
                ["Silver 76 RPT", "Corredera", "Perfil de 76 mm, con rotura de puente térmico"],
                ["Universal Libro", "Librillo", "Hojas que se pliegan sobre sí mismas"],
                ["Mallorquina Corredera", "Mallorquina", "Lamas que protegen del sol y de las miradas"],
            ])
        )
        body = before_section(body, "Precios y prestaciones", serie, url)
    return body

for src, (url, out) in PAGES.items():
    title, body = extract(os.path.join(WEB, src))
    body = post(url, body)
    t = "AMS Cerramientos | Ventanas y cerramientos en Alcalá de Henares" if url == "/" else title.replace("AMS Cerramientos - ", "") + " | AMS Cerramientos"
    write(out, url, t, DESCS.get(url, "AMS Cerramientos: fabricantes e instaladores de ventanas y cerramientos de aluminio y PVC en el Corredor del Henares."), body)

for fn in [pages_indices.p_productos(PRODUCTOS), pages_indices.p_servicios(SERVICIOS)] + NEW_PAGES + [_p_landing_cancelas, p_glosario, p_diagnostico, p_simulador, p_presupuesto, p_ayudas, p_medir, p_permisos, p_visualizador, p_mapa, p_garantia] + ARTICLES + HOGAR_ARTS + ZONA_PAGES + [_cuestionario, _correos, _fotos] + _LEGAL:
    url, out, t, d, body = fn()
    write(out, url, t, d, body)

# --- Panel de control de demostracion (pagina independiente) + logos
import pages_panel
os.makedirs(os.path.join(OUT, "guia-javi"), exist_ok=True)
# panel: ahora es una pagina de Next.js (app/guia-javi/panel); ya no se genera aqui
# panel: ahora es una pagina de Next.js (app/guia-javi/panel); ya no se genera aqui
# panel: ahora es una pagina de Next.js (app/guia-javi/panel); ya no se genera aqui
import pages_crm
open(os.path.join(OUT, "guia-javi", "crm.html"), "w", encoding="utf-8").write(pages_crm.pagina_html())
import pages_lupa
open(os.path.join(OUT, "guia-javi", "lupa.html"), "w", encoding="utf-8").write(pages_lupa.pagina_html())
import pages_resumen
open(os.path.join(OUT, "guia-javi", "resumen.html"), "w", encoding="utf-8").write(pages_resumen.pagina_html())
os.makedirs(os.path.join(OUT, "img", "panel"), exist_ok=True)
_PL = os.path.join(S, "panel-logos")
for _f in os.listdir(_PL):
    shutil.copy(os.path.join(_PL, _f), os.path.join(OUT, "img", "panel", _f))

title, body = extract(LANDING)
_hero = '<section style="background: #12202B; color: #FFFFFF">\n<div style="max-width: 1200px; margin: 0 auto; padding: 32px 24px 56px;'
if _hero in body:
    body = body.replace(_hero, '<section class="vsec" style="position: relative; overflow: hidden; background: #12202B url(/img/terraza-cristal.jpg) center / cover; color: #FFFFFF">\n<video class="vbg vd" autoplay muted loop playsinline preload="metadata" poster="/img/terraza-cristal.jpg" aria-hidden="true" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(1.28) saturate(1.3) contrast(1.05)"><source src="/img/terraza-cristal.webm" type="video/webm"><source src="/img/terraza-cristal.mp4" type="video/mp4"></video>\n<div class="vov vd" style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(18,32,43,0.70) 0%, rgba(18,32,43,0.38) 40%, rgba(18,32,43,0) 68%, rgba(18,32,43,0) 100%)"></div>\n<div class="vtxt" style="position: relative; max-width: 1200px; margin: 0 auto; padding: 32px 24px 56px;', 1)
    body = body.replace('class="vtxt" style="position: relative; max-width: 1200px; margin: 0 auto; padding: 32px 24px 56px; display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start">', 'class="vtxt" style="position: relative; max-width: 1200px; margin: 0 auto; padding: 32px 24px 56px; display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start">\n<div class="vm" style="background: #1C2F3F url(/img/villa-cristal.jpg) center / cover"><video class="vbg" autoplay muted loop playsinline preload="metadata" poster="/img/villa-cristal.jpg" aria-label="Balcón de cristal y pérgola de aluminio"><source src="/img/villa-cristal.webm" type="video/webm"><source src="/img/villa-cristal.mp4" type="video/mp4"></video></div>\n', 1)
else:
    print("AVISO: hero de la landing no encontrado")
body = body.replace("</form>", '<p style="margin: 0; font-size: 13px; line-height: 1.4; opacity: .85">Al enviar aceptas la <a href="/privacidad" target="_blank" style="text-decoration: underline">política de privacidad</a>.</p></form>', 1)
os.makedirs(os.path.join(OUT, "landing"), exist_ok=True)
write("landing/index.html", "/landing", "Cierra tu terraza antes del frío | AMS Cerramientos", "Cerramientos de terraza y ventanas directo de fábrica en Alcalá de Henares. Medición y presupuesto gratis.", body)


# --- Páginas hechas en otra sesión (calculadora, configurador): se conservan y se les pone el menú y pie actuales
_SRC = os.path.join(os.path.dirname(OUT.rstrip("/")), "site") if False else None
import shutil
_SITE = os.path.join(os.getcwd(), "site")
_EX = os.path.join(os.path.dirname(os.path.abspath(__file__)), "extra")
os.makedirs(os.path.join(OUT, "api"), exist_ok=True)
shutil.copy(os.path.join(_EX, "cfg-ia.js"), os.path.join(OUT, "cfg-ia.js"))
for _i in ("cancela-marron.jpg", "cancela-marron-800.jpg", "ejemplo-ventana-antes.jpg", "ejemplo-ventana-despues.jpg", "techo-claraboya.jpg", "techo-buhardilla.jpg"):
    shutil.copy(os.path.join(_EX, _i), os.path.join(OUT, "img", _i))
for _f in ("cfg.js", "cfg.css"):
    if os.path.exists(os.path.join(_SITE, _f)):
        shutil.copy(os.path.join(_SITE, _f), os.path.join(OUT, _f))
if os.path.isdir(os.path.join(_SITE, "api")):
    shutil.copytree(os.path.join(_SITE, "api"), os.path.join(OUT, "api"), dirs_exist_ok=True)
shutil.copy(os.path.join(_EX, "ventana-ia.js"), os.path.join(OUT, "api", "ventana-ia.js"))
shutil.copy(os.path.join(_EX, "respuestas.js"), os.path.join(OUT, "api", "respuestas.js"))
shutil.copytree(os.path.join(_EX, "cancelas"), os.path.join(OUT, "img", "cancelas"), ignore=shutil.ignore_patterns("dims.json"), dirs_exist_ok=True)
for _f, _cur in (("configurador.html", "/configurador"), ("calculadora.html", "/calculadora")):
    _p = os.path.join(_SITE, _f)
    if not os.path.exists(_p):
        print("AVISO: falta", _f); continue
    _h = open(_p, encoding="utf-8").read()
    _link = wa(WA_DEFAULT)
    _h, n1 = re.subn(r'<div class="demo">.*?</header>', lambda m: header(_cur).replace("\\", "\\\\"), _h, count=1, flags=re.S)
    _h, n2 = re.subn(r'<footer class="site-footer">.*?</footer>\s*<a href="[^"]*" class="wa".*?</a>', lambda m: FOOTER.replace("WA_LINK", _link), _h, count=1, flags=re.S)
    if n1 != 1 or n2 != 1: print("AVISO: menu/pie no sustituidos en", _f, n1, n2)
    if "/privacidad" not in _h:
        _h = _h.replace("Nada de publicidad ni de pasarlos a nadie.", 'Nada de publicidad ni de pasarlos a nadie. <a href="/privacidad" target="_blank">Política de privacidad</a>.')
    if _f == "configurador.html":
        # "Mira como quedaria en tu casa": se activa con la IA (api/ventana-ia.js). Se aplica aqui para no pisar los cambios de la otra sesion.
        _ia = ('<section class="cf-card cf-ia" id="cfIA">\n<style>.cia-cmp{position:relative;border-radius:12px;overflow:hidden;line-height:0;aspect-ratio:3/4;max-width:340px;margin:0 auto;background:#DDE3E8;user-select:none}.cia-cmp img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}.cia-cmp .cia-top{clip-path:inset(0 50% 0 0)}.cia-cmp input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}.cia-cmp .bar{position:absolute;top:0;bottom:0;left:var(--x,50%);width:3px;margin-left:-1.5px;background:#fff;box-shadow:0 0 6px rgba(0,0,0,.4);pointer-events:none}.cia-cmp .bar::after{content:"\u2194";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:38px;height:38px;border-radius:50%;background:#fff;color:#12202B;font:700 18px/38px Inter,sans-serif;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.35)}.cia-cmp .l,.cia-cmp .r{position:absolute;bottom:10px;padding:4px 10px;border-radius:999px;background:rgba(18,32,43,.78);color:#fff;font:700 12px Inter,sans-serif;line-height:1.4}.cia-cmp .l{left:10px}.cia-cmp .r{right:10px}.cia-soon2{display:inline-block;margin-bottom:10px;padding:6px 12px;border-radius:999px;background:#C2410C;color:#fff;font-size:13px;font-weight:800}.cia-ex{margin:10px 0 0;color:#6B7A87;font-size:13px;text-align:center}</style>\n'
            '<div class="cf-ia-img" style="aspect-ratio:auto;background:none;overflow:visible"><div class="cia-cmp"><img src="/img/ejemplo-ventana-despues.jpg" alt="Ventana nueva" loading="lazy"><img class="cia-top" src="/img/ejemplo-ventana-antes.jpg" alt="Ventana antigua" loading="lazy"><span class="bar"></span><input type="range" min="0" max="100" value="50" aria-label="Comparar antes y después"><span class="l">Ahora</span><span class="r">Nueva</span></div><p class="cia-ex">Ejemplo. Arrastra para comparar.</p></div>\n'
            '<div class="cf-ia-txt"><span class="cia-soon2">Próximamente</span><h2>Mira cómo quedaría en tu casa</h2><p>Haz una foto de tu ventana de ahora y nuestra inteligencia artificial te enseña cómo quedaría con la que has configurado: el color, las hojas, la persiana. Antes de gastar un euro.</p><button type="button" class="cf-btn sec" disabled>Subir foto · muy pronto</button></div>\n</section>')
        _h, n3 = re.subn(r'<section class="cf-card cf-ia"[^>]*>.*?</section>', lambda m: _ia, _h, count=1, flags=re.S)
        _h = _h.replace('<script src="/cfg-ia.js"></script>', '')
        _h, n4 = re.subn(r'<script src="/cfg\.js"></script>', '<script src="/cfg.js"></script>\n<script src="/cfg-ia.js"></script>', _h, count=1)
        if n3 != 1 or n4 != 1: print("AVISO: bloque de foto con IA no sustituido", n3, n4)
    if _f == "configurador.html":
        _h = _h.replace("ventanas de tejado y claraboyas", "ventanas y puertas").replace("Ventanas, balconeras, correderas, ventanas de tejado y claraboyas.", "Ventanas, balconeras y correderas.")
    _h = dedup_media(_cur, _h)
    open(os.path.join(OUT, _f), "w", encoding="utf-8").write(_h)

os.makedirs(os.path.join(OUT, "fonts"), exist_ok=True)
_FN = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "fnt", "node_modules", "@fontsource")
for _w in (400, 600, 700, 800): shutil.copy(os.path.join(_FN, "archivo", "files", "archivo-latin-" + str(_w) + "-normal.woff2"), os.path.join(OUT, "fonts", "archivo-" + str(_w) + ".woff2"))
for _w in (400, 500, 600, 700): shutil.copy(os.path.join(_FN, "inter", "files", "inter-latin-" + str(_w) + "-normal.woff2"), os.path.join(OUT, "fonts", "inter-" + str(_w) + ".woff2"))
_FF = "@font-face{font-family:Archivo;font-weight:400;font-style:normal;font-display:swap;src:url(/fonts/archivo-400.woff2) format('woff2')}@font-face{font-family:Archivo;font-weight:600;font-style:normal;font-display:swap;src:url(/fonts/archivo-600.woff2) format('woff2')}@font-face{font-family:Archivo;font-weight:700;font-style:normal;font-display:swap;src:url(/fonts/archivo-700.woff2) format('woff2')}@font-face{font-family:Archivo;font-weight:800;font-style:normal;font-display:swap;src:url(/fonts/archivo-800.woff2) format('woff2')}@font-face{font-family:Inter;font-weight:400;font-style:normal;font-display:swap;src:url(/fonts/inter-400.woff2) format('woff2')}@font-face{font-family:Inter;font-weight:500;font-style:normal;font-display:swap;src:url(/fonts/inter-500.woff2) format('woff2')}@font-face{font-family:Inter;font-weight:600;font-style:normal;font-display:swap;src:url(/fonts/inter-600.woff2) format('woff2')}@font-face{font-family:Inter;font-weight:700;font-style:normal;font-display:swap;src:url(/fonts/inter-700.woff2) format('woff2')}"
MOVIL_TABLAS = """
@media (max-width: 640px){main table,.sct,table{min-width:0!important;font-size:14px!important;table-layout:auto}table th,table td{padding:10px 9px!important;overflow-wrap:anywhere;word-break:normal;vertical-align:top}}
"""
MOVIL_TABLAS += '@media (max-width:640px){.hero-cta a[href*="wa.me"]{display:inline-block;min-height:44px;padding:12px 8px;box-sizing:border-box}}'
MOVIL_TABLAS += '@media (max-width:640px){main a[style*="B8430A"]{display:inline-block;min-height:44px;padding:11px 0;box-sizing:border-box}}'
open(os.path.join(OUT, "estilos.css"), "w").write(_FF + CSS + MOVIL_TABLAS)
open(os.path.join(OUT, "web.js"), "w").write(JS)

# --- portada de ventanas-pvc: foto grande y luminosa (la anterior era de 272 px)
shutil.copy(os.path.join(_EX, "ventana-pvc-hero.webp"), os.path.join(OUT, "img", "ventana-pvc-hero.webp"))
_fp = os.path.join(OUT, "ventanas-pvc.html"); _t = open(_fp, encoding="utf-8").read()
shutil.copy(os.path.join(_EX, "ventana-pvc-luz.webp"), os.path.join(OUT, "img", "ventana-pvc-luz.webp"))
_t = _t.replace('width="448" height="481" src="/img/antes-despues-ventana.webp" alt="Antes y después: ventana antigua deteriorada y la misma ventana sustituida por una de PVC blanco"', 'width="1000" height="722" src="/img/ventana-pvc-luz.webp" alt="Vivienda con grandes ventanales de aluminio y cristal bajo el sol"')
_t = _t.replace('width="272" height="508" src="/img/ventana-pvc.webp" alt="Ventana de PVC blanca de dos hojas en un dormitorio"', 'width="1000" height="1086" src="/img/ventana-pvc-hero.webp" alt="Salón luminoso con un gran ventanal de PVC y vistas a los árboles"')
open(_fp, "w", encoding="utf-8").write(_t)
# --- aviso de cookies en todas las paginas (menos la guia privada)
shutil.copy(os.path.join(_EX, "cookies.js"), os.path.join(OUT, "cookies.js"))
shutil.copy(os.path.join(_EX, "medicion.js"), os.path.join(OUT, "medicion.js"))
shutil.copy(os.path.join(_EX, "barra.js"), os.path.join(OUT, "barra.js"))
import hashlib as _hl
_VER = lambda f: _hl.md5(open(os.path.join(OUT, f), "rb").read()).hexdigest()[:8]
shutil.copy(os.path.join(_EX, "salida.js"), os.path.join(OUT, "salida.js"))
shutil.copy(os.path.join(_EX, "reveal.js"), os.path.join(OUT, "reveal.js"))
from glosario_picto import P as _PP
os.makedirs(os.path.join(OUT, "pic"), exist_ok=True)
for _k, _v in _PP.items():
    open(os.path.join(OUT, "pic", _k + ".svg"), "w").write(_v[0])
open(os.path.join(OUT, "lazyvid.js"), "w").write("(function(){var v=[].slice.call(document.querySelectorAll('video[data-lazyv]'));if(!v.length)return;function go(e){var p=e.getAttribute('data-poster');if(p){e.poster=p;e.removeAttribute('data-poster')}[].forEach.call(e.querySelectorAll('source[data-src]'),function(s){s.src=s.getAttribute('data-src');s.removeAttribute('data-src')});e.load();var q=e.play();if(q&&q.catch)q.catch(function(){})}function late(e){var f=function(){setTimeout(function(){go(e)},600)};if(document.readyState==='complete')f();else window.addEventListener('load',f)}if(!('IntersectionObserver' in window)){v.forEach(function(e){e.hasAttribute('data-late')?late(e):go(e)});return}var o=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){o.unobserve(x.target);x.target.hasAttribute('data-late')?late(x.target):go(x.target)}})},{rootMargin:'400px'});v.forEach(function(e){o.observe(e)})})();\n")
import fotos_reales
print("fotos de la web antigua colocadas:", fotos_reales.aplicar(OUT))
import glob as _g
import financiacion_fix
print("financiacion corregida en", financiacion_fix.aplicar(OUT), "ficheros")
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "asistente")); import build_asistente; build_asistente.build(OUT, os.path.join(os.path.dirname(os.path.abspath(__file__)), "asistente"))
for _fp in _g.glob(os.path.join(OUT, "**", "*.html"), recursive=True):
    if os.path.basename(_fp) in ("guia-javi.html", "cuestionario.html", "fotos-web-antigua.html", "conversaciones.html", "panel.html", "panel-completo.html", "crm.html", "resumen.html", "lupa.html"): continue
    _t = open(_fp, encoding="utf-8").read()
    for _x, _y in (("Cortizo, Technal y Alugom en aluminio, y Kömmerling", "Alugom en aluminio y Kömmerling"), ("Perfiles de Cortizo, Technal y Alugom,", "Perfiles de Alugom,"), ("Cortizo, Technal y Alugom", "Alugom"), ("Cortizo o Technal", "Alugom"), (" o Cortizo.", ".")):
        _t = _t.replace(_x, _y)
    if "</body>" not in _t: continue
    if "/cookies.js" not in _t: _t = _t.replace("</body>", '<script src="/cookies.js?v=' + _VER("cookies.js") + '" defer></script></body>', 1)
    if "/medicion.js" not in _t: _t = _t.replace("</body>", '<script src="/medicion.js?v=' + _VER("medicion.js") + '" defer></script></body>', 1)
    if "/salida.js" not in _t: _t = _t.replace("</body>", '<script src="/salida.js" defer></script></body>', 1)
    if "/reveal.js" not in _t: _t = _t.replace("</body>", '<script src="/reveal.js" defer></script></body>', 1)
    if "/barra.js" not in _t and os.path.basename(_fp) not in ("guia-javi.html", "acceso-ficha.html", "conversaciones.html", "correos-ejemplo.html", "cuestionario.html", "fotos-web-antigua.html", "calculadora.html", "configurador.html", "visualizador.html") and "guia-javi" not in _fp: _t = _t.replace("</body>", '<script src="/barra.js" defer></script></body>', 1)
    if "/asistente.js" not in _t and os.path.basename(_fp) not in ("cookies.html", "simulador.html"): _t = _t.replace("</body>", '<script src="/asistente.js" defer></script></body>', 1)
    # rendimiento: los videos que no son la portada (con aria-label) se cargan al acercarse con el scroll
    def _lazyv(m):
        v = m.group(0)
        late = 'aria-label=' in v
        v = v.replace(' autoplay', ' data-lazyv' + (' data-late' if late else ''), 1).replace('<source src=', '<source data-src=')
        if not late: v = re.sub(r' poster="([^"]+)"', r' data-poster="\1"', v, count=1)
        return v
    _t2 = re.sub(r'<video class="vbg[^>]*>.*?</video>', _lazyv, _t, flags=re.S)
    _t2 = re.sub(r'<link rel="preconnect" href="https://fonts\.g[^>]*>\s*', '', _t2)
    _t2 = re.sub(r'<link href="https://fonts\.googleapis\.com/css2[^"]+" rel="stylesheet">\s*', '', _t2)
    if '/fonts/inter-400' not in _t2: _t2 = _t2.replace('</head>', '<link rel="preload" as="font" type="font/woff2" href="/fonts/inter-400.woff2" crossorigin><link rel="preload" as="font" type="font/woff2" href="/fonts/archivo-800.woff2" crossorigin></head>', 1)
    _hv = re.search(r'<video class="vbg[^>]*poster="([^"]+)"[^>]*aria-label=', _t)
    if _hv and '</head>' in _t and 'rel="preload" as="image"' not in _t: _t2 = _t2.replace('</head>', '<link rel="preload" as="image" href="' + _hv.group(1) + '" fetchpriority="high"></head>', 1)
    if _t2 != _t:
        _t = _t2.replace("</body>", '<script src="/lazyvid.js" defer></script></body>', 1)
    open(_fp, "w", encoding="utf-8").write(_t)

# bloque "Conócenos en 30 segundos" con el vídeo del anuncio (portada y contacto)
for _f, _blk, _anchor in (("index.html", "amsv_index.html", '<section style="background: #12202B; color: #FFFFFF">'), ("contacto.html", "amsv_contacto.html", '<section style="background: #FFFFFF">')):
    _fp = os.path.join(OUT, _f)
    if os.path.exists(_fp):
        _t = open(_fp, encoding="utf-8").read()
        if 'class="amsv"' not in _t and _anchor in _t:
            _t = _t.replace(_anchor, open(os.path.join(_EX, _blk), encoding="utf-8").read() + _anchor, 1)
            open(_fp, "w", encoding="utf-8").write(_t)
import pages_guia; pages_guia.build(OUT)
_pp = os.path.join(OUT, "api", "_asistente-prompt.js")
if os.path.exists(_pp):
    _tp = open(_pp, encoding="utf-8").read()
    for _x, _y in (("Cortizo, Technal y Alugom en aluminio, y Kömmerling", "Alugom en aluminio y Kömmerling"), ("Perfiles de Cortizo, Technal y Alugom,", "Perfiles de Alugom,"), ("Cortizo, Technal y Alugom", "Alugom"), ("Cortizo o Technal", "Alugom")):
        _tp = _tp.replace(_x, _y)
    open(_pp, "w", encoding="utf-8").write(_tp)
open(os.path.join(OUT, "robots.txt"), "w").write("User-agent: *\nAllow: /\n\nSitemap: " + seo.DOMAIN + "/sitemap.xml\n")
open(os.path.join(OUT, "sitemap.xml"), "w").write(seo.sitemap())
open(os.path.join(OUT, "llms.txt"), "w").write(seo.llms())
# vercel.json y next.config.js viven en el repositorio (Next.js); no se generan
print("ok")
