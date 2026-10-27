# Landing de cancelas de aluminio soldado (encargo de Javi, 25/10/2026). Vive dentro del proyecto, en /cancelas-de-aluminio.
WA = "https://wa.me/34639788220?text=" + "Hola%2C%20AMS%20Cerramientos.%20He%20visto%20vuestra%20web%20de%20cancelas%20y%20quiero%20presupuesto.%20Mi%20entrada%20mide%20aproximadamente%3A%20"

C1, C2, C3 = "#5B3A29", "#7A5240", "#C9B8A8"   # marron, marron claro, borde


import json as _json, os as _os
_DIMS = _json.load(open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "extra", "cancelas", "dims.json")))
# (clave de archivo, nombre, subtitulo, descripcion, portada, alt)
MODELOS = [
    ("01-henares", "Henares", "Vanguardia horizontal", "El diseño más pedido. Lamas anchas y ciegas: privacidad total y estilo moderno. Con puerta peatonal integrada si la quieres.", 1, "Cancela de aluminio soldado modelo Henares"),
    ("02-henares-celosia", "Henares con celosía", "Lama ciega y remate decorativo", "El Henares con una celosía en la parte alta: aligera la cancela y le da un toque clásico sin perder privacidad.", 2, "Cancela de aluminio soldado modelo Henares con celosía"),
    ("03-claridad", "Claridad", "Lama ciega y barrote", "Lama ciega abajo y barrote vertical arriba: privacidad a la altura de la vista y luz por encima.", 1, "Cancela de aluminio soldado modelo Claridad, lama ciega con barrotes verticales"),
    ("04-brisa", "Brisa", "Lama ovalada", "Lama ovalada que deja pasar el aire y reduce la resistencia al viento, pero protege la intimidad del interior de la parcela.", 5, "Cancela de aluminio soldado modelo Brisa, lama ovalada"),
    ("05-chapa-perforada", "Chapa perforada", "Visibilidad y privacidad", "Más visibilidad sin perder privacidad. Un acabado limpio y actual.", 1, "Cancela de aluminio soldado modelo chapa perforada"),
    ("06-forja", "Forja", "Elegancia clásica en aluminio", "Toda la elegancia de la forja de hierro, con puntas de lanza o adornos, pero en aluminio soldado: no se oxida jamás.", 1, "Cancela de aluminio soldado modelo forja"),
    ("07-lama-perfil-plata", "Élite", "Lama con perfil plata", "Lama con perfil de aluminio en plata entre lamas: el acabado más cuidado de la gama.", 2, "Cancela de aluminio soldado modelo Élite, lama con perfil plata"),
    ("08-alcarria", "Alcarria", "Lama con huecos", "Lama horizontal con hueco entre lamas: deja pasar la luz y el aire y estiliza la fachada de chalets y fincas.", 2, "Cancela de aluminio soldado modelo Alcarria, lama con huecos entre lamas"),
]


def _fotos(clave):
    return sorted(k for k in _DIMS if k.startswith(clave + "-"))


CSS = """<style>
.cl{font-family:Inter,sans-serif;color:#12202B}.cl *{box-sizing:border-box}
.cl-hero{position:relative;overflow:hidden;min-height:min(86vh,680px);display:flex;align-items:flex-end;color:#fff;background:#2a1b13}
.cl-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:60% 50%}
.cl-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,32,43,.2) 0%,rgba(18,32,43,.55) 55%,rgba(18,32,43,.92) 100%)}
.cl-hi{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:120px 20px 36px;width:100%}
.cl-hi h1{margin:0;font-family:Archivo,sans-serif;font-weight:800;font-size:clamp(34px,8vw,64px);line-height:1.04;max-width:760px}
.cl-hi p{margin:14px 0 0;font-size:clamp(17px,3.6vw,21px);line-height:1.5;max-width:620px;color:#F1E9E2}
.cl-btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
.cl-b{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:54px;padding:0 24px;border-radius:8px;font-weight:700;font-size:17px;text-decoration:none}
.cl-b1{background:#25D366;color:#0B2A17}.cl-b2{background:#C2410C;color:#fff}.cl-b3{background:transparent;color:#fff;border:1px solid #fff9}
.cl-chips{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 0;padding:0;list-style:none}.cl-chips li{background:#ffffff26;border:1px solid #ffffff40;border-radius:999px;padding:8px 14px;font-weight:600;font-size:14px;backdrop-filter:blur(4px)}
.cl-w{max-width:1100px;margin:0 auto;padding:56px 20px}.cl-w h2{margin:0 0 8px;font-family:Archivo,sans-serif;font-weight:800;font-size:clamp(26px,5.5vw,38px);line-height:1.1}
.cl-sub{margin:0 0 26px;font-size:17px;line-height:1.55;color:#4A5A68;max-width:640px}
.cl-g4{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr));gap:16px}
.cl-c{background:#fff;border:1px solid #EADFD3;border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:8px;box-shadow:0 6px 18px rgba(18,32,43,.05)}
.cl-c h3{margin:0;font-size:19px}.cl-c p{margin:0;font-size:15px;line-height:1.55;color:#3B4C5A}
.cl-n{width:42px;height:42px;border-radius:12px;background:#F3E8DF;color:#7A3F1D;display:grid;place-items:center;font-weight:800;font-family:Archivo,sans-serif}
.cl-band{background:#F7F1EA}.cl-dark{background:#12202B;color:#fff}.cl-dark .cl-sub{color:#D3DBE2}
.cl-mod{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(260px,100%),1fr));gap:16px}
.cl-mi{width:100%;height:auto;display:block;border-radius:12px;background:#F7F1EA}.cl-mod .cl-c small{color:#7A3F1D;font-weight:700;font-size:13px;letter-spacing:.03em;text-transform:uppercase}
.cl-foto{width:100%;height:auto;aspect-ratio:160/110;object-fit:cover;border-radius:12px;display:block}.cl-mod .cl-c .cl-b{margin-top:auto}
.cl-ph{font-size:12px;color:#6B7A87;margin:4px 0 0}
.cl-price{display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between}.cl-price strong{font-family:Archivo,sans-serif;font-size:clamp(34px,8vw,54px);color:#F2C14E;line-height:1}
.cl-rev{border:2px dashed #CBB9A4;border-radius:16px;padding:22px;background:#FFFBF6;line-height:1.55}
.cl-st{display:flex;gap:2px;color:#E0A100;font-size:22px}
.cl-faq details{background:#fff;border:1px solid #EADFD3;border-radius:12px;padding:14px 18px;margin-bottom:10px}.cl-faq summary{cursor:pointer;font-weight:700;font-size:17px}.cl-faq p{margin:10px 0 0;line-height:1.6;color:#3B4C5A}
.cl-hero img{animation:clz 18s ease-out both}@keyframes clz{from{transform:scale(1.12)}to{transform:scale(1)}}
.cl-rv{opacity:0;transform:translateY(22px);transition:opacity .6s,transform .6s}.cl-rv.on{opacity:1;transform:none}
.cl-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-top:-34px;position:relative;z-index:2;max-width:1060px;margin-left:auto;margin-right:auto;padding:0 20px}
.cl-st1{background:#fff;border:1px solid #EADFD3;border-radius:16px;padding:16px;text-align:center;box-shadow:0 10px 26px rgba(18,32,43,.12)}.cl-st1 b{display:block;font-family:Archivo,sans-serif;font-size:clamp(26px,6vw,36px);color:#C2410C;line-height:1}.cl-st1 span{font-size:13px;color:#4A5A68;font-weight:600}
.cl-ico{width:48px;height:48px;border-radius:14px;background:#F3E8DF;color:#7A3F1D;display:grid;place-items:center;transition:transform .25s}.cl-c:hover .cl-ico{transform:rotate(-6deg) scale(1.08)}
.cl-c{transition:transform .25s,box-shadow .25s}.cl-c:hover{transform:translateY(-4px);box-shadow:0 14px 30px rgba(18,32,43,.12)}
.cl-sw{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 22px;align-items:center}.cl-sw b{font-size:15px;margin-right:4px}
.cl-sw button{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 14px 0 8px;border-radius:999px;border:2px solid #E3D6C8;background:#fff;font:600 14px Inter,sans-serif;color:#12202B;cursor:pointer}
.cl-sw button i{width:26px;height:26px;border-radius:50%;border:1px solid #0003;display:block}.cl-sw button[aria-pressed=true]{border-color:#C2410C;background:#FFF3EA}
.cl-fb{position:relative;display:block;width:100%;padding:0;border:0;background:none;cursor:pointer;border-radius:12px;overflow:hidden}.cl-fb .cl-foto{aspect-ratio:4/3;transition:transform .35s}.cl-fb:hover .cl-foto{transform:scale(1.04)}
.cl-cnt{position:absolute;left:10px;bottom:10px;background:#12202Bcc;color:#fff;font:700 13px Inter,sans-serif;padding:6px 10px;border-radius:999px}
.cl-lb{border:0;padding:0;background:transparent;max-width:min(96vw,1100px);width:100%}.cl-lb::backdrop{background:rgba(0,0,0,.88)}
.cl-lb figure{margin:0;text-align:center}.cl-lb img{display:block;max-width:96vw;max-height:78vh;width:auto;height:auto;margin:0 auto;border-radius:8px}
.cl-lb figcaption{margin:10px 0 0;color:#fff;font:600 15px Inter,sans-serif}
.cl-lbb{position:absolute;min-height:48px;min-width:48px;border:0;border-radius:8px;background:#ffffffee;color:#12202B;font:700 15px Inter,sans-serif;cursor:pointer}
.cl-lbx{top:8px;right:8px;padding:0 14px}.cl-lbp,.cl-lbn{top:44%;font-size:22px}.cl-lbp{left:6px}.cl-lbn{right:6px}
.cl-calc{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px}.cl-calc label{display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:14px}
.cl-calc input{min-height:52px;border-radius:10px;border:1px solid #ffffff55;background:#ffffff14;color:#fff;font-size:20px;padding:0 14px}.cl-calc input::placeholder{color:#ffffff88}
.cl-res{grid-column:1/-1;background:#ffffff14;border-radius:14px;padding:16px;line-height:1.5;min-height:74px}.cl-res b{font-family:Archivo,sans-serif;font-size:clamp(28px,7vw,40px);color:#F2C14E}
.cl-bar{position:fixed;left:0;right:0;bottom:0;z-index:900;display:none;gap:8px;padding:10px 12px;background:#12202Bee;backdrop-filter:blur(6px);transform:translateY(110%);transition:transform .3s}.cl-bar.on{transform:none}.cl-bar .cl-b{flex:1;min-height:48px;font-size:15px;width:auto}
@media(max-width:700px){.cl-bar{display:flex}.cl-calc{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.cl-hero img{animation:none}.cl-rv{opacity:1;transform:none;transition:none}}
@media(max-width:600px){.cl-b{width:100%}.cl-hi{padding-top:90px}}
</style>"""


def p_landing_cancelas():
    ben = [("1", "Sin oxidación", "El aluminio no se oxida como el hierro. Olvídate de lijar, decapar y volver a pintar cada pocos años."),
           ("2", "Fabricación a medida", "Se hace a la medida exacta de las mochetas de tu parcela, con un ajuste milimétrico."),
           ("3", "Instalación rápida", "La fabricamos en nuestro taller y la instalamos nosotros, sin intermediarios."),
           ("4", "Ligera y rígida", "Pesa aproximadamente un tercio que el hierro: menos carga en bisagras, pilares y motor. Soldada pieza a pieza, forma un bloque que no se descuadra.")]
    from menu_iconos import IC
    ik = {"1": "check", "2": "regla", "3": "llave", "4": "cancela"}
    cb = "".join(f'<div class="cl-c cl-rv"><span class="cl-ico"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{IC[ik[a]]}</svg></span><h3>{b}</h3><p>{c}</p></div>' for a, b, c in ben)
    mods = ""
    gal = {}
    for clave, n, sub, d, cov, alt in MODELOS:
        fs = _fotos(clave)
        gal[clave] = [{"s": "/img/cancelas/" + k + ".webp", "w": _DIMS[k][0], "h": _DIMS[k][1]} for k in fs]
        c = clave + "-" + str(cov).zfill(2)
        w, h = _DIMS[c]
        mods += (f'<div class="cl-c cl-rv"><button type="button" class="cl-fb" data-g="{clave}" data-m="{n}" aria-label="Ver las {len(fs)} fotos del modelo {n}">'
                 f'<img class="cl-foto" src="/img/cancelas/{c}.webp" alt="{alt}" width="{w}" height="{h}" loading="lazy"><span class="cl-cnt">{len(fs)} fotos</span></button>'
                 f'<small>{sub}</small><h3>Modelo {n}</h3><p>{d}</p>'
                 f'<a class="cl-b cl-b2" style="min-height:46px;font-size:15px" href="{WA}Modelo%20{n}.%20">Quiero este modelo</a></div>')
    galjs = _json.dumps(gal, ensure_ascii=False)
    pasos = [("Te medimos", "Vamos a tu casa, medimos la entrada y te damos un precio cerrado. Sin compromiso."), ("La fabricamos", "En nuestro taller de Villalbilla, soldada a mano y lacada en el color que elijas."), ("La instalamos", "La colocamos nosotros, con motor y mando si lo quieres, y te la dejamos funcionando.")]
    ps = "".join(f'<div class="cl-c cl-rv"><span class="cl-n">{i+1}</span><h3>{a}</h3><p>{b}</p></div>' for i, (a, b) in enumerate(pasos))
    faq = [("¿Cuánto cuesta una cancela de aluminio soldado?", "Parte de unos 400 euros el metro cuadrado, sin IVA, con lama ciega acanalada. El precio final depende del modelo, la medida y el acabado. Motor y montaje se presupuestan aparte."),
           ("¿Qué colores hay?", "Cualquier color en lacado, incluidos acabados texturizados e imitación madera."),
           ("¿Puede llevar puerta peatonal?", "Sí. El modelo Henares, por ejemplo, se hace con la puerta peatonal integrada en la misma cancela."),
           ("¿Se puede automatizar?", "Sí. Instalamos motor y mando para cancelas correderas y batientes, con fotocélulas de seguridad."),
           ("¿Dónde trabajáis?", "En Alcalá de Henares, el Corredor del Henares, Madrid y Guadalajara.")]
    fq = "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in faq)
    body = f"""{CSS}<div class="cl">
<section class="cl-hero"><img fetchpriority="high" src="/img/cancela-marron.jpg" alt="Cancela de aluminio soldado marrón con puerta peatonal integrada en una vivienda" width="1600" height="1200">
<div class="cl-hi"><h1>Cancelas de aluminio soldado</h1><p>Llegar a casa y que la entrada se abra sola, sin óxido ni pintura que repasar. Cancelas y puertas de aluminio soldado a medida, fabricadas e instaladas por nosotros. Más de 20 años en el aluminio.</p>
<div class="cl-btns"><a class="cl-b cl-b1" href="{WA}">Pedir presupuesto por WhatsApp</a><a class="cl-b cl-b3" href="/contacto">Pedir presupuesto</a></div>
<ul class="cl-chips"><li>Sin mantenimiento de pintura</li><li>Fabricación a medida</li><li>Instalación rápida</li></ul></div></section>
<div class="cl-stats"><div class="cl-st1"><b data-n="20" data-p="+">0</b><span>años en el aluminio</span></div><div class="cl-st1"><b data-n="8">0</b><span>modelos</span></div><div class="cl-st1"><b data-n="400" data-s=" €">0</b><span>el m&sup2;, desde</span></div><div class="cl-st1"><b>100 %</b><span>hecha en nuestro taller</span></div></div>
<section class="cl-band" style="margin-top:-34px;padding-top:34px"><div class="cl-w"><h2>Por qué aluminio soldado y no hierro</h2><p class="cl-sub">Una cancela que no te dé guerra cada pocos años.</p><div class="cl-g4">{cb}</div></div></section>
<section><div class="cl-w"><h2>Ocho modelos</h2><p class="cl-sub">Elige el diseño que más te guste. Se lacan en el color que quieras. Pulsa en una foto para ver más obras reales de ese modelo.</p>
<div class="cl-mod" id="clmod">{mods}</div><p class="cl-ph">Fotografías de cancelas reales fabricadas e instaladas por AMS.</p></div></section>
<section class="cl-dark"><div class="cl-w"><h2>¿Cuánto costaría la tuya?</h2><p class="cl-sub">Pon lo que mide tu entrada y te damos una idea del precio. Es orientativo: desde 400 euros el metro cuadrado, con lama ciega acanalada, sin IVA. Motor y montaje, aparte.</p>
<div class="cl-calc"><label>Ancho (metros)<input id="cla" type="text" inputmode="decimal" autocomplete="off" placeholder="3,5"></label><label>Alto (metros)<input id="clh" type="text" inputmode="decimal" autocomplete="off" placeholder="1,8"></label><div class="cl-res" id="clr" aria-live="polite">Escribe el ancho y el alto y verás el precio aproximado.</div></div>
<div class="cl-btns"><a class="cl-b cl-b1" id="clwa" href="{WA}">Mandar mis medidas por WhatsApp</a></div></div></section>
<section><div class="cl-w"><h2>Clientes contentos</h2><p class="cl-sub">Aquí irán las opiniones reales de Google de nuestros clientes.</p><div class="cl-rev"><div class="cl-st" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p style="margin:6px 0 0">Espacio para las reseñas reales de la ficha de Google de AMS. Solo se mostrarán opiniones verdaderas, sin inventar ninguna.</p></div></div></section>
<section class="cl-band"><div class="cl-w"><h2>Así trabajamos</h2><p class="cl-sub">De la primera visita a la cancela funcionando.</p><div class="cl-g4">{ps}</div></div></section>
<section><div class="cl-w cl-faq"><h2>Preguntas frecuentes</h2><p class="cl-sub">Lo que más nos preguntan.</p>{fq}</div></section>
<section class="cl-dark"><div class="cl-w" style="text-align:center"><h2>Te medimos la entrada sin compromiso</h2><p class="cl-sub" style="margin:0 auto 22px">Mándanos una foto de tu entrada y te damos un precio orientativo.</p><div class="cl-btns" style="justify-content:center"><a class="cl-b cl-b1" href="{WA}">Escribir por WhatsApp</a><a class="cl-b cl-b3" href="tel:+34639788220">Llamar al 639 78 82 20</a></div></div></section>
</div>
<dialog class="cl-lb" id="cllb" aria-label="Galería de fotos"><figure><img src="" alt=""><figcaption></figcaption></figure><button type="button" class="cl-lbb cl-lbx">Cerrar</button><button type="button" class="cl-lbb cl-lbp" aria-label="Foto anterior">&lsaquo;</button><button type="button" class="cl-lbb cl-lbn" aria-label="Foto siguiente">&rsaquo;</button></dialog>
<div class="cl-bar" id="clbar"><a class="cl-b cl-b1" href="{WA}">WhatsApp</a><a class="cl-b cl-b2" href="tel:+34639788220">Llamar</a></div>
<script>(function(){{
var rv=document.querySelectorAll('.cl-rv'),mq=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(mq||!('IntersectionObserver' in window)){{rv.forEach(function(e){{e.classList.add('on')}});}}else{{var io=new IntersectionObserver(function(a){{a.forEach(function(x){{if(x.isIntersecting){{x.target.classList.add('on');io.unobserve(x.target)}}}})}},{{threshold:.12}});rv.forEach(function(e,i){{e.style.transitionDelay=(i%4)*70+'ms';io.observe(e)}});}}
var ns=document.querySelectorAll('[data-n]');function run(e){{var n=+e.dataset.n,p=e.dataset.p||'',s=e.dataset.s||'',t=0;if(mq){{e.textContent=p+n+s;return}}var id=setInterval(function(){{t+=Math.max(1,Math.round(n/30));if(t>=n){{t=n;clearInterval(id)}}e.textContent=p+t+s}},30)}}
if('IntersectionObserver' in window){{var i2=new IntersectionObserver(function(a){{a.forEach(function(x){{if(x.isIntersecting){{run(x.target);i2.unobserve(x.target)}}}})}});ns.forEach(function(e){{i2.observe(e)}});}}else{{ns.forEach(run)}}
var G={galjs},dlg=document.getElementById('cllb'),li=dlg.querySelector('img'),cap=dlg.querySelector('figcaption'),cg=null,ci=0,cn='';
function show(){{var f=G[cg][ci];li.src=f.s;li.width=f.w;li.height=f.h;li.alt='Cancela de aluminio soldado, modelo '+cn;cap.textContent='Modelo '+cn+' \u00b7 '+(ci+1)+' de '+G[cg].length}}
function go(d){{var n=G[cg].length;ci=(ci+d+n)%n;show()}}
document.querySelectorAll('.cl-fb').forEach(function(b){{b.addEventListener('click',function(){{cg=b.dataset.g;cn=b.dataset.m;ci=0;show();dlg.showModal()}})}});
dlg.querySelector('.cl-lbx').addEventListener('click',function(){{dlg.close()}});dlg.querySelector('.cl-lbp').addEventListener('click',function(){{go(-1)}});dlg.querySelector('.cl-lbn').addEventListener('click',function(){{go(1)}});
dlg.addEventListener('click',function(e){{if(e.target===dlg)dlg.close()}});
dlg.addEventListener('keydown',function(e){{if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1)}});
var tx=0;dlg.addEventListener('touchstart',function(e){{tx=e.changedTouches[0].clientX}},{{passive:true}});dlg.addEventListener('touchend',function(e){{var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)go(d<0?1:-1)}},{{passive:true}});
var A=document.getElementById('cla'),H=document.getElementById('clh'),R=document.getElementById('clr'),W=document.getElementById('clwa'),base=W.getAttribute('href');
function calc(){{var a=parseFloat((A.value||'').replace(',','.')),h=parseFloat((H.value||'').replace(',','.'));if(!(a>0&&h>0)){{R.textContent='Escribe el ancho y el alto y verás el precio aproximado.';W.href=base;return}}
var m=a*h,pr=Math.round(m*400/10)*10;R.innerHTML='<b>desde '+pr.toLocaleString('es-ES')+' &euro;</b><br>'+m.toFixed(1).replace('.',',')+' m&sup2; &middot; sin IVA, sin motor ni montaje. Te lo confirmamos midiendo gratis.';
W.href=base+encodeURIComponent(a+' x '+h+' m. ')}}
A.addEventListener('input',calc);H.addEventListener('input',calc);
var bar=document.getElementById('clbar'),hero=document.querySelector('.cl-hero');addEventListener('scroll',function(){{bar.classList.toggle('on',scrollY>hero.offsetHeight*.7)}},{{passive:true}});
}})();</script>"""
    return ("/cancelas-de-aluminio", "cancelas-de-aluminio.html", "Cancelas de aluminio soldado a medida | AMS Cerramientos",
            "Cancelas y puertas de aluminio soldado a medida en Alcalá de Henares, Madrid y Guadalajara. Ocho modelos, desde 400 euros el metro cuadrado. Fabricadas e instaladas por nosotros.", body)
