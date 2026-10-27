# Interlinkado interno: enlaces automaticos al glosario y a las guias, y bloque "Sigue leyendo".
import re
from pages_new import sec

G = "/glosario#"
# (patron, destino). Se enlaza la primera aparicion en cada pagina.
TERMINOS = [
    (r"rotura de puente t[eé]rmico", "/blog/rotura-puente-termico"),
    (r"(?<!rotura de )puentes? t[eé]rmicos?", G + "puente-termico"),
    (r"oscilobatientes?", "/blog/ventanas-oscilobatientes"),
    (r"doble acristalamiento|doble vidrio|Climalit", G + "doble-acristalamiento"),
    (r"triple acristalamiento|triple vidrio", G + "triple-acristalamiento"),
    (r"bajo emisivo", G + "vidrio-bajo-emisivo"),
    (r"vidrio laminado", G + "vidrio-laminado"),
    (r"vidrio templado", G + "vidrio-templado"),
    (r"vidrio ac[uú]stico", G + "vidrio-acustico"),
    (r"gas arg[oó]n", G + "gas-argon"),
    (r"intercalario", G + "intercalario"),
    (r"caj(?:ón|ones) de persiana", "/blog/cajones-persiana-aislados"),
    (r"monoblock", G + "monoblock"),
    (r"premarco", G + "premarco"),
    (r"microventilaci[oó]n", G + "microventilacion"),
    (r"aireadores?", G + "aireador-rejilla-de-ventilacion"),
    (r"condensaci[oó]n", "/blog/condensacion-ventanas"),
    (r"factor solar", G + "factor-solar-g"),
    (r"transmitancia t[eé]rmica", G + "transmitancia-termica-u"),
    (r"lacado", G + "lacado"),
    (r"anodizado", G + "anodizado"),
    (r"foliado", G + "foliado-imitacion-madera"),
    (r"p[eé]rgolas? bioclim[aá]ticas?", G + "pergola-bioclimatica"),
    (r"cortinas? de cristal", G + "cortina-de-cristal"),
    (r"aluminio soldado", "/blog/cancelas-aluminio-soldado"),
    (r"fotoc[eé]lulas?", G + "fotocelula"),
    (r"cierre multipunto", G + "cierre-multipunto"),
    (r"sellado perimetral", G + "sellado-perimetral"),
    (r"marcado CE", G + "marcado-ce"),
    (r"corredera elevable", G + "corredera-elevable"),
    (r"cerco", None),
]
TERMINOS = [t for t in TERMINOS if t[1]]
SKIP = {"a", "h1", "h2", "h3", "h4", "button", "script", "style", "svg", "select", "label", "option", "summary", "textarea", "title", "head", "figcaption", "strong", "b", "th"}
EXCL = {"/glosario", "/aviso-legal", "/privacidad", "/cookies", "/guia-javi", "/cuestionario", "/fotos-web-antigua", "/landing", "/contacto", "/configurador", "/calculadora", "/diagnostico", "/simulador", "/revisa-tu-presupuesto", "/comprobador-ayudas", "/como-medir-ventanas", "/permisos-cerrar-terraza", "/visualizador"}
MAXL = 10


import unicodedata
from pages_glosario import T as _GT, slug as _slug

_DEF = {}
for _t in _GT:
    _d = _t[2]
    _m = re.match(r"(.+?[.!?])(\s|$)", _d)
    _f = _m.group(1) if _m else _d
    if len(_f) < 70 and _m:
        _m2 = re.match(r"(.+?[.!?])(\s|$)", _d[len(_f):].strip())
        if _m2: _f = _f + " " + _m2.group(1)
    if len(_f) > 190: _f = _f[:187].rsplit(" ", 1)[0] + "..."
    _DEF[_slug(_t[0])] = _f
BLOGDEF = {"/blog/rotura-puente-termico": "rotura-de-puente-termico-rpt", "/blog/ventanas-oscilobatientes": "oscilobatiente",
           "/blog/cajones-persiana-aislados": "cajon-de-persiana", "/blog/condensacion-ventanas": "condensacion",
           "/blog/cancelas-aluminio-soldado": "aluminio-soldado"}

# Términos de una sola palabra que sí se enlazan (el resto de una palabra es demasiado ambiguo).
UNA = {"Premarco", "Junquillo", "Galce", "Alféizar", "Vierteaguas", "Monoblock", "Mosquitera", "Proyectante", "Pivotante", "Mallorquina",
       "Falleba", "Cremona", "Microventilación", "Climalit", "Intercalario", "Lacado", "Anodizado", "Texturado", "Bombín", "Antibumping",
       "Fotocélula", "Electrocerradura", "Qualicoat", "Veranda", "Moho", "Butiral", "Claraboya", "Passivhaus", "Cerradero", "Sobrecalentamiento",
       "Policarbonato", "Screen", "Tapajuntas", "Antepecho", "Celosía"}
NOLINK = {"Cerramiento de terraza", "Techo de aluminio", "Cancela corredera", "Cancela batiente", "Pérgola bioclimática", "Cortina de cristal",
          "Hoja fija", "Cámara de aire", "Garantía", "Financiación", "Comunidad de propietarios", "Ayudas y deducciones", "Reja de seguridad",
          "Reja de forja", "Persiana de seguridad", "Medición (toma de medidas)", "Zona climática", "Presupuesto orientativo", "Presupuesto cerrado"}


def _rx(nombre):
    n = re.sub(r"\s*\(.*?\)", "", nombre).strip()
    out = []
    for ch in n:
        base = unicodedata.normalize("NFD", ch)[0]
        if base.lower() in "aeiou" and base.isalpha(): out.append("[" + base.lower() + unicodedata.normalize("NFC", base + "́").lower() + "]")
        elif ch == " ": out.append(r"\s+")
        else: out.append(re.escape(ch))
    r = "".join(out)
    if not n.endswith("s"): r += "(?:e?s)?"
    return r


_GEN = []
for _t in _GT:
    _n = re.sub(r"\s*\(.*?\)", "", _t[0]).strip()
    if _t[0] in NOLINK or _n in NOLINK: continue
    if " " not in _n and _n not in UNA: continue
    if len(_n) < 5: continue
    _GEN.append((_rx(_t[0]), G + _slug(_t[0])))
TERMINOS = TERMINOS + _GEN

TIP_CSS = ('<style>a.tgl{color:inherit;text-decoration:underline dotted #D9694D;text-decoration-thickness:2px;text-underline-offset:4px;cursor:help}'
           'a.tgl:hover,a.tgl:focus{background:#FCEBE4;border-radius:3px}'
           '#gt-tip{position:fixed;z-index:9999;max-width:300px;background:#12202B;color:#fff;border-radius:12px;padding:12px 14px;font:14px/1.45 Inter,sans-serif;'
           'box-shadow:0 10px 28px rgba(18,32,43,.3);display:none}#gt-tip b{display:block;color:#F2C14E;font-size:12px;letter-spacing:.05em;text-transform:uppercase;margin-bottom:3px}'
           '#gt-tip img{float:left;margin:0 10px 4px 0;background:#fff;border-radius:8px;padding:3px}#gt-tip:after{content:"";display:block;clear:both}#gt-tip i{display:block;margin-top:6px;font-style:normal;color:#F4A261;font-weight:700}</style>')
TIP_JS = ('<script>(function(){var t=document.createElement("div");t.id="gt-tip";t.setAttribute("role","tooltip");document.body.appendChild(t);var cur=null,tch=matchMedia("(pointer:coarse)").matches;document.addEventListener("touchstart",function(){tch=true},{passive:true});'
          'function show(a){cur=a;var pc=a.getAttribute("data-pic");t.innerHTML=(pc?"<im"+"g src=\'/pic/"+pc+".svg\' alt=\'\' width=\'84\' height=\'59\'>":"")+"<b>"+a.textContent+"</b>"+a.getAttribute("data-def")+"<i>"+a.getAttribute("data-go")+" &rarr;</i>";t.style.display="block";'
          'var r=a.getBoundingClientRect(),w=t.offsetWidth,h=t.offsetHeight,x=Math.max(8,Math.min(r.left,innerWidth-w-8)),y=r.top-h-8;if(y<8)y=r.bottom+8;t.style.left=x+"px";t.style.top=y+"px"}'
          'function hide(){t.style.display="none";cur=null}'
          'document.querySelectorAll("a.tgl").forEach(function(a){a.addEventListener("mouseenter",function(){if(!tch)show(a)});a.addEventListener("mouseleave",function(){if(!tch)hide()});'
          'a.addEventListener("focus",function(){if(!tch)show(a)});a.addEventListener("blur",hide);'
          'a.addEventListener("click",function(e){if(tch&&cur!==a){e.preventDefault();show(a)}})});'
          'document.addEventListener("click",function(e){if(!e.target.closest||!e.target.closest("a.tgl"))hide()});addEventListener("scroll",hide,{passive:true});'
          'document.addEventListener("keydown",function(e){if(e.key==="Escape")hide()})})();</script>')


def _pic(dest):
    sl = BLOGDEF.get(dest) or (dest.split("#")[1] if dest.startswith(G) else None)
    try:
        from glosario_picto import P
        return sl if sl in P else None
    except Exception:
        return None


def _tip(dest, texto):
    sl = BLOGDEF.get(dest) or (dest.split("#")[1] if dest.startswith(G) else None)
    d = _DEF.get(sl)
    if not d: return None
    ir = "Leer la guía" if dest.startswith("/blog") else "Ver en el glosario"
    return d.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;"), ir


def autolink(cur, body):
    usados, n, vistos = set(), 0, 0
    partes = re.split(r"(<[^>]+>)", body)
    pila = []
    for i, seg in enumerate(partes):
        if seg.startswith("<"):
            m = re.match(r"<(/?)([a-zA-Z0-9]+)", seg)
            if not m or seg.endswith("/>"): continue
            tag = m.group(2).lower()
            if tag in ("br", "img", "input", "meta", "link", "hr", "source"): continue
            if m.group(1): 
                if tag in SKIP and pila and tag in pila:
                    while pila and pila.pop() != tag: pass
            elif tag in SKIP: pila.append(tag)
            continue
        if pila or n >= MAXL or len(seg.strip()) < 25 or seg.strip().startswith("/"): continue
        cand = []
        for pat, dest in TERMINOS:
            if dest in usados or dest.split("#")[0] == cur or n + len(cand) >= MAXL: continue
            m = re.search(r"(?<![\w-])(" + pat + r")(?![\w-])", seg, re.I)
            if not m: continue
            if any(m.start() < e and m.end() > b0 for b0, e, _, _ in cand): continue
            cand.append((m.start(), m.end(), dest, m.group(1)))
        for st, en, dest, txt in sorted(cand, reverse=True):
            tp = _tip(dest, txt)
            if tp:
                pc = _pic(dest)
                a = f'<a class="tgl" href="{dest}" data-def="{tp[0]}" data-go="{tp[1]}"' + (f' data-pic="{pc}"' if pc else '') + f'>{txt}</a>'
            else:
                a = f'<a href="{dest}" style="color: inherit; text-decoration: underline dotted #B8430A; text-underline-offset: 3px">{txt}</a>'
            seg = seg[:st] + a + seg[en:]
            usados.add(dest); n += 1
        partes[i] = seg
    out = "".join(partes)
    if 'class="tgl"' in out: out += TIP_CSS + TIP_JS
    return out


ART = {
    "/blog/ayudas-cambiar-ventanas-madrid": "Ayudas para cambiar ventanas en Madrid en 2026",
    "/blog/cajones-persiana-aislados": "Cajones de persiana: por qué se escapa el calor",
    "/blog/cancelas-aluminio-soldado": "Cancelas de aluminio soldado: qué saber antes de comprar",
    "/blog/cerrar-terraza-antes-de-navidad": "Cerrar la terraza antes de Navidad: plazos reales",
    "/blog/condensacion-ventanas": "Condensación y moho en las ventanas",
    "/blog/instalacion-ventanas-pvc": "Cómo se instala bien una ventana de PVC",
    "/blog/kommerling-76-ad-md-xtrem": "Kömmerling 76 AD o 76 MD Xtrem",
    "/blog/mantenimiento-limpieza-ventanas": "Cómo limpiar y mantener las ventanas",
    "/blog/mejor-epoca-cambiar-ventanas": "La mejor época para cambiar las ventanas",
    "/blog/precio-cerrar-terraza": "Cuánto cuesta cerrar una terraza en 2026",
    "/blog/pvc-o-aluminio": "PVC o aluminio: cuál te conviene",
    "/blog/rotura-puente-termico": "Qué es la rotura de puente térmico",
    "/blog/ventanas-oscilobatientes": "Ventanas oscilobatientes: precios y materiales",
    "/blog/ventanas-ahorro-energia-calor-frio": "Ventanas y ahorro de energía",
    "/blog/mas-que-una-ventana": "Más que una ventana",
    "/blog/una-ventana-no-es-solo-una-ventana": "Una ventana no es solo una ventana",
    "/blog/no-hacemos-ventanas-hacemos-hogares": "No hacemos ventanas, hacemos hogares",
}
REL = {
    "/blog/una-ventana-no-es-solo-una-ventana": ["/blog/no-hacemos-ventanas-hacemos-hogares", "/blog/mas-que-una-ventana", "/blog/ventanas-oscilobatientes"],
    "/blog/no-hacemos-ventanas-hacemos-hogares": ["/blog/mas-que-una-ventana", "/blog/ventanas-ahorro-energia-calor-frio", "/blog/instalacion-ventanas-pvc"],
    "/blog/ventanas-ahorro-energia-calor-frio": ["/blog/mas-que-una-ventana", "/blog/rotura-puente-termico", "/blog/ayudas-cambiar-ventanas-madrid"],
    "/blog/mas-que-una-ventana": ["/blog/ventanas-ahorro-energia-calor-frio", "/blog/condensacion-ventanas", "/blog/precio-cerrar-terraza"],
    "/blog/ayudas-cambiar-ventanas-madrid": ["/blog/mejor-epoca-cambiar-ventanas", "/blog/pvc-o-aluminio", "/blog/instalacion-ventanas-pvc"],
    "/blog/cajones-persiana-aislados": ["/blog/condensacion-ventanas", "/blog/rotura-puente-termico", "/blog/instalacion-ventanas-pvc"],
    "/blog/cancelas-aluminio-soldado": ["/blog/mantenimiento-limpieza-ventanas", "/blog/pvc-o-aluminio", "/blog/precio-cerrar-terraza"],
    "/blog/cerrar-terraza-antes-de-navidad": ["/blog/precio-cerrar-terraza", "/blog/mejor-epoca-cambiar-ventanas", "/blog/ayudas-cambiar-ventanas-madrid"],
    "/blog/condensacion-ventanas": ["/blog/rotura-puente-termico", "/blog/cajones-persiana-aislados", "/blog/mantenimiento-limpieza-ventanas"],
    "/blog/instalacion-ventanas-pvc": ["/blog/kommerling-76-ad-md-xtrem", "/blog/mejor-epoca-cambiar-ventanas", "/blog/ayudas-cambiar-ventanas-madrid"],
    "/blog/kommerling-76-ad-md-xtrem": ["/blog/pvc-o-aluminio", "/blog/condensacion-ventanas", "/blog/instalacion-ventanas-pvc"],
    "/blog/mantenimiento-limpieza-ventanas": ["/blog/condensacion-ventanas", "/blog/pvc-o-aluminio", "/blog/kommerling-76-ad-md-xtrem"],
    "/blog/mejor-epoca-cambiar-ventanas": ["/blog/ayudas-cambiar-ventanas-madrid", "/blog/instalacion-ventanas-pvc", "/blog/pvc-o-aluminio"],
    "/blog/precio-cerrar-terraza": ["/blog/cerrar-terraza-antes-de-navidad", "/blog/pvc-o-aluminio", "/blog/rotura-puente-termico"],
    "/blog/pvc-o-aluminio": ["/blog/kommerling-76-ad-md-xtrem", "/blog/rotura-puente-termico", "/blog/ventanas-oscilobatientes"],
    "/blog/rotura-puente-termico": ["/blog/condensacion-ventanas", "/blog/pvc-o-aluminio", "/blog/kommerling-76-ad-md-xtrem"],
    "/blog/ventanas-oscilobatientes": ["/blog/pvc-o-aluminio", "/blog/instalacion-ventanas-pvc", "/blog/kommerling-76-ad-md-xtrem"],
}
PROD = {
    "/": ["/blog/ventanas-ahorro-energia-calor-frio", "/blog/mas-que-una-ventana", "/blog/precio-cerrar-terraza"],
    "/ventanas-pvc": ["/blog/ventanas-ahorro-energia-calor-frio", "/blog/pvc-o-aluminio", "/blog/instalacion-ventanas-pvc"],
    "/ventanas-aluminio": ["/blog/ventanas-ahorro-energia-calor-frio", "/blog/pvc-o-aluminio", "/blog/ventanas-oscilobatientes"],
    "/cerramientos-terrazas": ["/blog/precio-cerrar-terraza", "/blog/cerrar-terraza-antes-de-navidad", "/blog/pvc-o-aluminio"],
    "/pergolas": ["/blog/precio-cerrar-terraza", "/blog/mantenimiento-limpieza-ventanas", "/blog/pvc-o-aluminio"],
    "/toldos": ["/blog/precio-cerrar-terraza", "/blog/mantenimiento-limpieza-ventanas", "/blog/cerrar-terraza-antes-de-navidad"],
    "/techos": ["/blog/precio-cerrar-terraza", "/blog/condensacion-ventanas", "/blog/rotura-puente-termico"],
    "/cancelas-puertas": ["/blog/cancelas-aluminio-soldado", "/blog/mantenimiento-limpieza-ventanas", "/blog/pvc-o-aluminio"],
    "/rejas": ["/blog/cancelas-aluminio-soldado", "/blog/mantenimiento-limpieza-ventanas", "/blog/ventanas-oscilobatientes"],
    "/automatismos": ["/blog/cancelas-aluminio-soldado", "/blog/mantenimiento-limpieza-ventanas", "/blog/instalacion-ventanas-pvc"],
    "/persianas-cristales": ["/blog/cajones-persiana-aislados", "/blog/condensacion-ventanas", "/blog/rotura-puente-termico"],
    "/acabados": ["/blog/pvc-o-aluminio", "/blog/mantenimiento-limpieza-ventanas", "/blog/kommerling-76-ad-md-xtrem"],
    "/comunidades": ["/blog/mantenimiento-limpieza-ventanas", "/blog/ayudas-cambiar-ventanas-madrid", "/blog/instalacion-ventanas-pvc"],
    "/financiacion": ["/blog/ayudas-cambiar-ventanas-madrid", "/blog/mejor-epoca-cambiar-ventanas", "/blog/precio-cerrar-terraza"],
    "/reparaciones": ["/blog/mantenimiento-limpieza-ventanas", "/blog/condensacion-ventanas", "/blog/cajones-persiana-aislados"],
    "/empresa": ["/blog/ventanas-ahorro-energia-calor-frio", "/blog/instalacion-ventanas-pvc", "/blog/kommerling-76-ad-md-xtrem"],
    "/trabajos": ["/blog/precio-cerrar-terraza", "/blog/pvc-o-aluminio", "/blog/instalacion-ventanas-pvc"],
}
ZONAS = ["/alcala-de-henares", "/torrejon-de-ardoz", "/villalbilla", "/coslada", "/meco", "/azuqueca-de-henares", "/guadalajara", "/madrid"]
HERR = [("/revisa-tu-presupuesto", "Revisa tu presupuesto", "¿Tienes otro presupuesto? Mira qué incluye y si el precio es razonable."),
        ("/diagnostico", "Diagnóstico de tus ventanas", "Seis preguntas para saber si cambiar o solo arreglar."),
        ("/comprobador-ayudas", "Comprobador de ayudas", "Qué ayudas existen de verdad y cuánto podrías recuperar."),
        ("/simulador", "Simulador de ahorro y ruido", "Cuánto ahorrarías y cuántos decibelios te quitarías."),
        ("/glosario", "Glosario", "Más de cien términos explicados sin jerga.")]
A = "color: #12202B; text-decoration: none"


def bloque(cur):
    if cur in EXCL or cur.startswith("/blog") and cur == "/blog": return ""
    if cur in ART: rel = REL.get(cur, [])
    elif cur in PROD: rel = PROD[cur]
    elif cur in ZONAS: rel = ["/blog/precio-cerrar-terraza", "/blog/pvc-o-aluminio", "/blog/ayudas-cambiar-ventanas-madrid"]
    else: return ""
    guias = "".join(f'<a href="{u}" style="display:flex;align-items:center;min-height:56px;padding:12px 18px;background:#fff;border-radius:8px;{A};font-weight:600;line-height:1.35">{ART[u]}</a>' for u in rel if u != cur)
    herr = "".join(f'<a href="{u}" style="display:flex;flex-direction:column;gap:4px;padding:16px 18px;background:#12202B;border-radius:8px;text-decoration:none;color:#fff"><strong style="font-size:17px">{t}</strong><span style="font-size:14px;color:#D3DBE2;line-height:1.4">{d}</span></a>' for u, t, d in HERR if u != cur)
    inner = ('<h2 style="margin: 0; font-size: 26px; font-weight: 800">Sigue leyendo</h2>'
             f'<div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))">{guias}<a href="/blog" style="display:flex;align-items:center;min-height:56px;padding:12px 18px;background:#fff;border-radius:8px;{A};font-weight:700;color:#B8430A">Todas las guías del blog</a></div>'
             '<h2 style="margin: 12px 0 0; font-size: 26px; font-weight: 800">Herramientas gratuitas</h2>'
             f'<div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))">{herr}</div>')
    return sec(inner, bg="#F3F5F7", pad="56px 24px")


def interlink(cur, body):
    if cur in EXCL: return body
    return autolink(cur, body) + bloque(cur)
