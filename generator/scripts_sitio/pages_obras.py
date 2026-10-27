# Mapa de obras FICTICIO (ejemplo): unas 2 obras a la semana durante 20 años = unas 2.000.
import math, random, json
from pages_new import BTN, BTN2, sec

W, H = 1000, 690
LON0, LON1, LAT0, LAT1 = -3.80, -3.10, 40.33, 40.68
K = math.cos(math.radians(40.5))
SX = W / ((LON1 - LON0) * K)
SY = H / (LAT1 - LAT0)
S = min(SX, SY)

def xy(lat, lon):
    return round((lon - LON0) * K * S, 1), round((LAT1 - lat) * S, 1)

# (municipio, lat, lon, peso, etiqueta)
TOWNS = [
    ("Alcalá de Henares", 40.4820, -3.3640, 24, 1), ("Madrid", 40.4168, -3.7038, 12, 1), ("Guadalajara", 40.6326, -3.1669, 11, 1),
    ("Torrejón de Ardoz", 40.4558, -3.4787, 10, 1), ("Coslada", 40.4237, -3.5613, 6, 1), ("San Fernando de Henares", 40.4238, -3.5320, 6, 1),
    ("Villalbilla", 40.4585, -3.3053, 6, 1), ("Azuqueca de Henares", 40.5667, -3.2667, 6, 1), ("Meco", 40.5514, -3.3249, 5, 1),
    ("Mejorada del Campo", 40.3941, -3.4803, 4, 0), ("Camarma de Esteruelas", 40.5333, -3.3833, 4, 0), ("Paracuellos de Jarama", 40.5036, -3.5292, 3, 0),
    ("Velilla de San Antonio", 40.3667, -3.5000, 3, 0), ("Daganzo de Arriba", 40.5380, -3.4430, 3, 0), ("Cabanillas del Campo", 40.6333, -3.2333, 3, 0),
    ("Loeches", 40.3783, -3.4167, 3, 0), ("Santos de la Humosa", 40.5013, -3.2297, 2, 0), ("Anchuelo", 40.4833, -3.2967, 2, 0), ("Fuente el Saz", 40.6167, -3.4833, 2, 0),
    ("Rivas-Vaciamadrid", 40.3262, -3.5185, 4, 0), ("Arganda del Rey", 40.3007, -3.4373, 4, 0), ("Ajalvir", 40.5330, -3.4790, 2, 0),
    ("Algete", 40.5975, -3.4964, 3, 0), ("San Sebastián de los Reyes", 40.5500, -3.6270, 3, 0), ("Alcobendas", 40.5475, -3.6419, 3, 0),
    ("Alovera", 40.5972, -3.2417, 3, 0), ("Marchamalo", 40.6667, -3.2000, 2, 0), ("Villanueva de la Torre", 40.6167, -3.3500, 3, 0),
    ("Quer", 40.6200, -3.2900, 1, 0), ("Pezuela de las Torres", 40.4167, -3.2500, 1, 0), ("Corpa", 40.4500, -3.2050, 1, 0),
    ("Torres de la Alameda", 40.3600, -3.3500, 2, 0), ("Nuevo Baztán", 40.3667, -3.2500, 1, 0), ("Valdeavero", 40.5200, -3.4000, 1, 0),
    ("Valdilecha", 40.3000, -3.2833, 1, 0), ("Villar del Olmo", 40.3167, -3.3167, 1, 0), ("Pozuelo del Rey", 40.3333, -3.3000, 1, 0),
    ("Cobeña", 40.5000, -3.5333, 2, 0), ("Ribatejada", 40.5600, -3.4200, 1, 0), ("Los Hueros", 40.4600, -3.3600, 1, 0),
    ("Yunquera de Henares", 40.7167, -3.2833, 1, 0), ("Humanes", 40.7500, -3.1667, 1, 0), ("Chiloeches", 40.6500, -3.1000, 1, 0),
]
TOTAL = 1600


RECIENTES = [
    ("Calle de los Almendros, Villalbilla", "Cerramiento de terraza en aluminio", "Hace 3 semanas"),
    ("Avenida del Ferrocarril, Torrejón de Ardoz", "Cambio de 6 ventanas a PVC", "Hace 1 mes"),
    ("Calle Mayor, Alcalá de Henares", "Pérgola bioclimática", "Hace 1 mes"),
    ("Calle del Olivar, Meco", "Cancela corredera motorizada", "Hace 2 meses"),
    ("Paseo de los Plátanos, Azuqueca de Henares", "Cerramiento con cortina de cristal", "Hace 2 meses"),
    ("Calle Cervantes, Guadalajara", "Ventanas oscilobatientes y persianas", "Hace 3 meses"),
    ("Calle de la Fuente, Camarma de Esteruelas", "Reja y puerta de entrada", "Hace 3 meses"),
    ("Calle Sol, San Fernando de Henares", "Techo de aluminio para patio", "Hace 4 meses"),
]

def datos():
    rnd = random.Random(2026)
    tot = sum(t[3] for t in TOWNS)
    obras, resumen, resto = [], [], TOTAL
    for i, (n, la, lo, w, lab) in enumerate(TOWNS):
        c = round(TOTAL * w / tot) if i < len(TOWNS) - 1 else resto
        resto -= c
        resumen.append((n, la, lo, c, lab))
        sp = 0.03 if n == "Madrid" else (0.011 if n in ("Alcalá de Henares", "Guadalajara", "Torrejón de Ardoz") else 0.006)
        for _ in range(c):
            obras.append((round(la + rnd.gauss(0, sp), 5), round(lo + rnd.gauss(0, sp * 1.2), 5)))
    return obras, resumen


def svg():
    obras, res = datos()
    pts = []
    for la, lo in obras:
        x, y = xy(la, lo)
        if 0 <= x <= W and 0 <= y <= H: pts.append(f'<circle cx="{x}" cy="{y}" r="2.2"/>')
    lab = ""
    for n, la, lo, c, l in res:
        if not l: continue
        x, y = xy(la, lo)
        izq = x > 690 or n == "Coslada"
        dx, an = (-10, ' text-anchor="end"') if izq else (10, '')
        lab += f'<text x="{x + dx}" y="{y - 8}" class="mo-t"{an}>{n}</text><text x="{x + dx}" y="{y + 8}" class="mo-n"{an}>{c} obras</text>'
    return (f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="Mapa ilustrativo de obras de AMS en Madrid y Guadalajara (datos ficticios)" style="width:100%;height:auto;display:block;background:#EAF0F4;border-radius:10px">'
            '<style>.mo-t{font:700 15px Inter,sans-serif;fill:#12202B;paint-order:stroke;stroke:#EAF0F4;stroke-width:4px}.mo-n{font:600 13px Inter,sans-serif;fill:#4A5A68;paint-order:stroke;stroke:#EAF0F4;stroke-width:4px}</style>'
            f'<g fill="#C2410C" fill-opacity=".38">{"".join(pts)}</g>{lab}</svg>'), res



PIN = "data:image/svg+xml;utf8," + "%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='36' viewBox='0 0 26 36'%3E%3Cpath d='M13 0C5.8 0 0 5.8 0 13c0 9.7 13 23 13 23s13-13.3 13-23C26 5.8 20.2 0 13 0z' fill='%23C2410C' stroke='white' stroke-width='2'/%3E%3Ccircle cx='13' cy='13' r='5' fill='white'/%3E%3C/svg%3E"


def widget(pid="mo", auto=False):
    """Mapa interactivo (Leaflet + OpenStreetMap) con chinchetas y burbujas por localidad. auto=True lo carga solo."""
    obras, res = datos()
    pts = json.dumps([[a, b] for a, b in obras])
    tw = json.dumps([[n, la, lo, c] for n, la, lo, c, l in res], ensure_ascii=False)
    mapa, _ = svg()
    btn = "" if auto else (f'<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center"><button type="button" id="{pid}-btn" style="min-height:48px;padding:0 20px;border-radius:6px;border:1px solid #12202B;background:#fff;color:#12202B;font:600 15px Inter,sans-serif;cursor:pointer">Ver sobre mapa real (carga OpenStreetMap)</button></div>')
    html = (f'<div id="{pid}-svg" style="{"display:none" if auto else ""}">{mapa}</div>'
            f'<div id="{pid}-map" style="display:{"block" if auto else "none"};height:min(560px,80vh);border-radius:10px;overflow:hidden;background:#EAF0F4;position:relative;z-index:0"></div>{btn}')
    js = ('<script>(function(){var id="' + pid + '",AUTO=' + ("true" if auto else "false") + ',P=' + pts + ',T=' + tw + ',PIN="' + PIN + '",'
          'm=document.getElementById(id+"-map"),sv=document.getElementById(id+"-svg"),b=document.getElementById(id+"-btn"),ini=0;'
          'function ld(t,a,f){var e=document.createElement(t);for(var k in a)e[k]=a[k];if(f)e.onload=f;document.head.appendChild(e);}'
          'function start(){if(ini){return;}ini=1;sv.style.display="none";m.style.display="block";'
          'ld("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"});'
          'ld("script",{src:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"},function(){'
          'var mp=L.map(m,{scrollWheelZoom:false}).setView([40.50,-3.38],10);'
          'L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"&copy; OpenStreetMap"}).addTo(mp);'
          'var ic=L.icon({iconUrl:PIN,iconSize:[22,30],iconAnchor:[11,30],popupAnchor:[0,-26]});'
          'var pins=L.layerGroup(P.map(function(p){return L.marker(p,{icon:ic,keyboard:false});}));'
          'var bub=L.layerGroup(T.map(function(d){var r=Math.round(Math.max(30,Math.min(60,24+Math.sqrt(d[3])*3.4)));'
          'return L.marker([d[1],d[2]],{icon:L.divIcon({className:"",iconSize:[r,r],html:"<div style=\\"width:"+r+"px;height:"+r+"px;border-radius:50%;background:rgba(194,65,12,.9);border:3px solid #fff;color:#fff;display:flex;align-items:center;justify-content:center;font:700 14px Inter,sans-serif;box-shadow:0 2px 6px rgba(0,0,0,.35)\\">"+d[3]+"</div>"})}).bindTooltip(d[0]+": "+d[3]+" obras (ejemplo)");}));'
          'function sw(){if(mp.getZoom()>=12){if(mp.hasLayer(bub))mp.removeLayer(bub);if(!mp.hasLayer(pins))mp.addLayer(pins);}else{if(mp.hasLayer(pins))mp.removeLayer(pins);if(!mp.hasLayer(bub))mp.addLayer(bub);}}'
          'mp.on("zoomend",sw);sw();setTimeout(function(){mp.invalidateSize();},200);});}'
          'var ck=null;try{ck=JSON.parse(localStorage.getItem("ams-cookies")||"null");}catch(e){}'
          'if(AUTO||(ck&&ck.terceros)){start();if(b)b.style.display="none";}else if(b){b.addEventListener("click",start);}'
          '})();</script>')
    return html + js



def seccion(h2=True):
    mapa, res = svg()
    fila = "".join(f'<li><b>{n}</b>: {c}</li>' for n, la, lo, c, l in sorted(res, key=lambda r: -r[3]))
    js = json.dumps([[n, la, lo, c] for n, la, lo, c, l in res], ensure_ascii=False)
    inner = (
        '<div style="display:flex;flex-direction:column;gap:10px">'
        '<span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#B8430A">Ejemplo ilustrativo: datos ficticios</span>'
        + ('<h2 style="margin:0;font-size:clamp(26px,5vw,34px);font-weight:800">Más de 1.600 obras en más de 40 localidades</h2>' if h2 else '')
        + '<p style="margin:0;font-size:17px;line-height:1.6;max-width:820px">Así podría verse un mapa con las obras reales de AMS. Aquí hay 1.600 obras ficticias en más de 40 localidades, como si se hubieran hecho dos a la semana (ocho al mes, unas ochenta al año) durante veinte años. Cuando tengamos las fotos y las localidades reales, cada punto será una obra de verdad.</p></div>'
        + widget('mo')
        + '<p style="margin:0"><a href="/trabajos" style="color:#B8430A;font-weight:700">Ver trabajos realizados</a></p>'
        +
        '<h3 style="margin:8px 0 0;font-size:20px">Últimas obras (ejemplo, con calles inventadas)</h3><div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))">' + ''.join(f'<div style="padding:14px 16px;background:#F3F5F7;border-radius:8px;display:flex;flex-direction:column;gap:2px"><strong>{c}</strong><span style="font-size:15px">{o}</span><span style="font-size:13px;color:#4A5A68">{f}</span></div>' for c, o, f in RECIENTES) + '</div>'
        '<h3 style="margin:8px 0 0;font-size:20px">Obras por localidad</h3>'
        f'<ul style="margin:0;padding-left:20px;columns:3 200px;line-height:1.7;font-size:15px">{fila}</ul>'
        '<p style="margin:0;font-size:13px;color:#4A5A68">Ejemplo con datos inventados para mostrar cómo quedaría. Los puntos están repartidos de forma aproximada alrededor de cada localidad.</p>'
    )
    return sec(inner, bg="#FFFFFF", pad="56px 24px")


def p_mapa():
    hero = '''<section style="background: #12202B; color: #FFFFFF"><div style="max-width: 1200px; margin: 0 auto; padding: 40px 24px 56px; display: flex; flex-direction: column; gap: 18px">
<div style="font-size: 14px; color: #B9C4CE"><a href="/" style="color: #B9C4CE">Inicio</a> / Mapa de obras</div>
<h1 style="margin: 0; font-size: clamp(30px, 7vw, 46px); line-height: 1.1; font-weight: 800; max-width: 820px">Mapa de obras de AMS Cerramientos</h1>
<p style="margin: 0; font-size: 19px; line-height: 1.55; color: #D3DBE2; max-width: 780px">Dónde hemos instalado ventanas, cerramientos, cancelas y pérgolas. Si ves tu pueblo, ya sabes que trabajamos cerca de ti.</p>
</div></section>'''
    extra = sec('<div class="card" style="gap:12px"><h2 style="margin:0;font-size:22px">Por qué un mapa de obras ayuda</h2><ul style="margin:0;padding-left:20px;line-height:1.8"><li><b>Confianza:</b> ver que hemos trabajado en tu zona pesa más que cualquier texto.</li><li><b>Posicionamiento local:</b> cada localidad con obras reales refuerza las búsquedas «ventanas en [tu pueblo]».</li><li><b>Prueba social:</b> te lo creen más porque lo ven con sus propios ojos.</li></ul><p style="margin:0">Esta página es un ejemplo con datos inventados. Con las fotos y localidades reales de Javi será la versión definitiva.</p></div><div style="display:flex;flex-wrap:wrap;gap:12px"><a href="/contacto" style="' + BTN + '">Pedir visita gratis</a><a href="/trabajos" style="display:inline-flex;align-items:center;min-height:54px;padding:0 22px;border-radius:6px;border:1px solid #12202B;color:#12202B;text-decoration:none;font-weight:600">Ver trabajos</a></div>', bg="#F3F5F7", pad="40px 24px 72px")
    css = '<style>.card{background:#fff;border-radius:10px;padding:24px;display:flex;flex-direction:column}</style>'
    return ("/mapa-de-obras", "mapa-de-obras.html", "Mapa de obras de AMS Cerramientos en Madrid y Guadalajara (ejemplo) | AMS Cerramientos",
            "Mapa ilustrativo de las obras de AMS Cerramientos en Alcalá de Henares, Madrid, Guadalajara y el Corredor del Henares. Datos de ejemplo.", hero + seccion(h2=False) + extra + css)


def franja():
    # Franja de confianza con datos ya publicados en la web (a confirmar con AMS antes de salir a produccion).
    it = [("20+", "años fabricando e instalando"), ("Taller propio", "en Villalbilla (Madrid)"), ("Kömmerling", "instalador oficial de la marca"), ("2 años", "de garantía mínima en todos los trabajos")]
    c = "".join(f'<div style="display:flex;flex-direction:column;gap:2px;padding:6px 4px"><strong style="font-size:clamp(22px,4vw,30px);font-weight:800;color:#12202B">{a}</strong><span style="font-size:15px;color:#4A5A68;line-height:1.35">{b}</span></div>' for a, b in it)
    return ('<section style="background:#F3F5F7"><div style="max-width:1200px;margin:0 auto;padding:28px 24px;display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))">' + c +
            '</div><p style="max-width:1200px;margin:0 auto;padding:0 24px 24px;font-size:15px"><a href="/garantia-y-postventa" style="color:#B8430A;font-weight:700">Cómo te cuidamos antes, durante y después de la obra</a></p></section>')


def p_garantia():
    def card(t, d): return f'<div style="background:#fff;border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:8px"><h3 style="margin:0;font-size:20px">{t}</h3><p style="margin:0;line-height:1.6">{d}</p></div>'
    grid = lambda xs: '<div style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))">' + "".join(card(*x) for x in xs) + '</div>'
    hero = '''<section style="background: #12202B; color: #FFFFFF"><div style="max-width: 1200px; margin: 0 auto; padding: 40px 24px 56px; display: flex; flex-direction: column; gap: 18px">
<div style="font-size: 14px; color: #B9C4CE"><a href="/" style="color: #B9C4CE">Inicio</a> / Garantía y postventa</div>
<h1 style="margin: 0; font-size: clamp(30px, 7vw, 46px); line-height: 1.1; font-weight: 800; max-width: 820px">Una empresa que no te deja tirado</h1>
<p style="margin: 0; font-size: 19px; line-height: 1.55; color: #D3DBE2; max-width: 780px">Fabricamos nosotros, instalamos nosotros y, si algo falla, damos la cara nosotros. Así trabajamos antes, durante y después de la obra.</p>
<div style="display: flex; flex-wrap: wrap; gap: 12px"><a href="/contacto" style="''' + BTN + '''">Pedir visita gratis</a><a href="https://wa.me/34639788220" style="''' + BTN2 + '''">Escribir por WhatsApp</a></div></div></section>'''
    s1 = sec('<h2 style="margin:0;font-size:clamp(26px,5vw,34px);font-weight:800">Antes: te asesoramos y te lo dejamos claro</h2>' + grid([
        ("Visita y medición gratis", "Vamos a tu casa, medimos y vemos qué conviene a cada hueco. Sin compromiso."),
        ("Presupuesto cerrado", "Por escrito, con serie, vidrio, plazos y todo lo que incluye. Sin sorpresas en la factura."),
        ("Asesoramiento honesto", "Fabricamos aluminio y PVC, así que te recomendamos lo que conviene, no lo que más nos interesa vender."),
    ]), bg="#FFFFFF", pad="56px 24px 24px")
    s2 = sec('<h2 style="margin:0;font-size:clamp(26px,5vw,34px);font-weight:800">Durante: obra limpia y bien terminada</h2>' + grid([
        ("Fabricación propia", "Cortamos y montamos el perfil en nuestro taller de Villalbilla, sin intermediarios."),
        ("Instalación por nuestro equipo", "Medimos, fabricamos e instalamos nosotros. Quien te atiende conoce tu obra."),
        ("Retirada de lo viejo", "Nos llevamos las ventanas antiguas y los escombros y dejamos todo funcionando."),
    ]), bg="#FFFFFF", pad="24px 24px")
    s3 = sec('<h2 style="margin:0;font-size:clamp(26px,5vw,34px);font-weight:800">Después: garantía y servicio técnico</h2>' + grid([
        ("Mínimo 2 años en todos los trabajos", "Cualquier trabajo de AMS tiene al menos dos años de garantía."),
        ("10 años en perfiles Kömmerling", "Respaldo de la marca en los perfiles, con nosotros como instalador oficial."),
        ("5 años en cancelas soldadas", "En la estructura soldada de las cancelas de aluminio."),
        ("Si algo falla, nos avisas y lo vemos", "Mándanos una foto por WhatsApp o llámanos al 639 78 82 20. Lo miramos y, si está cubierto, lo arreglamos."),
    ]), bg="#FFFFFF", pad="24px 24px 56px")
    s4 = sec('<h2 style="margin:0;font-size:22px;font-weight:800">¿Quieres comprobarlo?</h2><p style="margin:0;line-height:1.6;max-width:760px">Mira nuestras <a href="/trabajos" style="color:#B8430A;font-weight:700">obras</a>, lee lo que dicen <a href="/empresa" style="color:#B8430A;font-weight:700">nuestros clientes</a> y calcula tu precio en la <a href="/configurador" style="color:#B8430A;font-weight:700">calculadora</a>. Y si tienes otro presupuesto, <a href="/revisa-tu-presupuesto" style="color:#B8430A;font-weight:700">revísalo aquí</a>: te decimos la verdad, aunque sea que el otro está bien.</p>', bg="#F3F5F7", pad="40px 24px 72px")
    return ("/garantia-y-postventa", "garantia-y-postventa.html", "Garantía y servicio postventa | AMS Cerramientos",
            "Garantía mínima de 2 años en todos los trabajos, 10 en perfiles Kömmerling, taller propio y servicio técnico. Así trabaja AMS Cerramientos en Madrid y Guadalajara.", hero + s1 + s2 + s3 + s4)
