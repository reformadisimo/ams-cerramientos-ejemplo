# -*- coding: utf-8 -*-
# Paginas indice /productos y /servicios, y la franja de "cuatro pasos" de la portada.
from menu_iconos import icono, DESC

CSS = '''<style>
.ix{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));margin-top:28px}
.ix a{position:relative;display:flex;flex-direction:column;gap:6px;background:#fff;border:1px solid #D8E0E6;border-radius:18px;padding:22px 20px 18px;text-decoration:none;color:#12202B;transition:transform .15s,box-shadow .15s}
.ix a:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(18,32,43,.12)}
.ix .mi{width:54px;height:54px;border-radius:16px;margin-bottom:6px}.ix .mi svg{width:26px;height:26px}
.ix .nn{position:absolute;top:14px;right:18px;font-size:34px;font-weight:800;color:#E3E9EE}
.ix h3{margin:0;font-size:20px}.ix p{margin:0;color:#4B5B66;font-size:16px;line-height:1.45}
.ix .go{margin-top:8px;color:#B8430A;font-weight:700;font-size:15px}
.pasos4{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr));margin-top:28px}
.pasos4 div{position:relative;background:#fff;border:1px solid #D8E0E6;border-radius:20px;padding:22px 20px}
.pasos4 .mi{width:56px;height:56px;border-radius:17px;position:relative;margin-bottom:10px}.pasos4 .mi svg{width:26px;height:26px}
.pasos4 .mi:after{content:"\\2605";position:absolute;top:-8px;right:-8px;width:22px;height:22px;border-radius:50%;background:#FFC53D;color:#12202B;font-size:13px;display:flex;align-items:center;justify-content:center}
.pasos4 .nn{position:absolute;top:14px;right:20px;font-size:38px;font-weight:800;color:#E3E9EE}
.pasos4 h3{margin:0 0 4px;font-size:19px}.pasos4 p{margin:0;color:#4B5B66;font-size:16px;line-height:1.5}
</style>'''

def _hero(crumb, h1, intro):
    return ('<section style="background:#12202B;color:#fff"><div style="max-width:1200px;margin:0 auto;padding:40px 24px 48px;display:flex;flex-direction:column;gap:16px">'
            '<div style="font-size:14px;color:#B9C4CE"><a href="/" style="color:#B9C4CE">Inicio</a> / ' + crumb + '</div>'
            '<h1 style="margin:0;font-size:clamp(30px,7vw,46px);line-height:1.1;font-weight:800;max-width:820px">' + h1 + '</h1>'
            '<p style="margin:0;font-size:19px;line-height:1.55;color:#D3DBE2;max-width:760px">' + intro + '</p>'
            '<div style="display:flex;flex-wrap:wrap;gap:12px"><a href="/contacto" style="display:inline-flex;align-items:center;min-height:52px;padding:0 24px;border-radius:6px;background:#C2410C;color:#fff;text-decoration:none;font-weight:700;font-size:17px">Pedir presupuesto gratis</a>'
            '<a href="/configurador" style="display:inline-flex;align-items:center;min-height:52px;padding:0 24px;border-radius:6px;border:1px solid #5B6B78;color:#fff;text-decoration:none;font-weight:700;font-size:17px">Calcula tu precio</a></div>'
            '</div></section>')

def _cards(items):
    out = []
    for n, (u, t) in enumerate(items):
        out.append('<a href="%s">%s<span class="nn">%02d</span><h3>%s</h3><p>%s</p><span class="go">Ver más &rarr;</span></a>' % (u, icono(u, n), n + 1, t, DESC.get(u, "")))
    return '<div class="ix">' + "".join(out) + '</div>'

def _pagina(h, cards, extra=""):
    return CSS + h + '<section style="background:#F3F6F9"><div style="max-width:1200px;margin:0 auto;padding:16px 24px 56px">' + cards + extra + '</div></section>'

def p_productos(PRODUCTOS):
    def f():
        body = _pagina(_hero("Productos", "Todo lo que fabricamos e instalamos",
                        "Ventanas de aluminio y de PVC, cerramientos de terraza, techos, cancelas, pérgolas, toldos y persianas. Fabricamos en nuestro taller de Villalbilla y lo instala nuestro equipo."),
                       _cards(PRODUCTOS))
        return ("/productos", "productos.html", "Productos de aluminio y PVC a medida | AMS Cerramientos",
                "Ventanas, cerramientos de terraza, techos, cancelas, pérgolas, toldos y persianas, fabricados en Villalbilla e instalados por AMS.", body)
    return f

def p_servicios(SERVICIOS):
    def f():
        body = _pagina(_hero("Servicios", "Servicios para que todo funcione",
                        "Automatización de puertas y cancelas, rejas, mantenimiento para comunidades, reparaciones y opciones de financiación y ayudas."),
                       _cards(SERVICIOS))
        return ("/servicios", "servicios.html", "Servicios de automatización, rejas y reparaciones | AMS Cerramientos",
                "Automatización de puertas y cancelas, rejas, mantenimiento para comunidades, reparaciones y financiación.", body)
    return f

PASOS = [
    ("/_p1", "regla", "Visita y medición gratis", "Vamos a tu casa, medimos y vemos qué conviene a cada hueco. Sin compromiso."),
    ("/_p2", "doc", "Presupuesto cerrado por escrito", "Con serie, vidrio, plazos y todo lo que incluye. Sin sorpresas en la factura."),
    ("/_p3", "motor", "Fabricamos en nuestro taller", "En Villalbilla, sin intermediarios. Quien te atiende conoce tu obra."),
    ("/_p4", "check", "Instalamos y retiramos lo viejo", "Lo monta nuestro equipo y se lleva lo antiguo. Mínimo 2 años de garantía."),
]

def pasos_home():
    from menu_iconos import IC
    tiles = []
    for n, (_, k, t, d) in enumerate(PASOS):
        ic = '<i class="mi c%d" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">%s</svg></i>' % (n % 6, IC[k])
        tiles.append('<div>%s<span class="nn">%02d</span><h3>%s</h3><p>%s</p></div>' % (ic, n + 1, t, d))
    return (CSS + '<section style="background:#F3F6F9"><div style="max-width:1200px;margin:0 auto;padding:56px 24px">'
            '<h2 style="margin:0;font-size:clamp(26px,5.5vw,38px);font-weight:800;line-height:1.1">Cuatro pasos, y sin sorpresas</h2>'
            '<p style="margin:10px 0 0;font-size:18px;line-height:1.5;color:#4A5A68;max-width:640px">Así es trabajar con nosotros, de la primera visita a la obra terminada.</p>'
            '<div class="pasos4">' + "".join(tiles) + '</div></div></section>')
