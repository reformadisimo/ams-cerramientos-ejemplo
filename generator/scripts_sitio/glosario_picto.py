# Pictogramas SVG propios para los terminos del glosario que se entienden mejor con un dibujo.
N, C, A, V = "#12202B", "#D9694D", "#E8F1F8", "#FCEBE4"


def _svg(nombre, cuerpo, alt):
    return ('<svg class="gl-svg" viewBox="0 0 120 90" role="img" aria-label="%s" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round">'
            '<title>%s</title>%s</svg>') % (alt, alt, cuerpo)


MARCO = '<rect x="22" y="10" width="76" height="70" rx="3" fill="#fff" stroke="%s" stroke-width="3"/><rect x="29" y="17" width="62" height="56" fill="%s" stroke="%s" stroke-width="1.5"/>' % (N, A, N)
SW = 'stroke="%s" stroke-width="2.2" stroke-dasharray="5 4"' % C
TL = 'stroke="%s" stroke-width="2.2" stroke-dasharray="1.5 3.5"' % C


def _l(x1, y1, x2, y2, extra=SW):
    return '<line x1="%s" y1="%s" x2="%s" y2="%s" %s/>' % (x1, y1, x2, y2, extra)


def _t(x, y, s, a="middle", sz=8.5, col=None):
    return '<text x="%s" y="%s" text-anchor="%s" font-family="Inter,Arial,sans-serif" font-size="%s" font-weight="700" fill="%s" stroke="none">%s</text>' % (x, y, a, sz, col or N, s)


def _hand(x, y): return '<circle cx="%s" cy="%s" r="2.6" fill="%s" stroke="none"/>' % (x, y, N)


def _arrow(x1, y1, x2, y2):
    import math
    a = math.atan2(y2 - y1, x2 - x1); s = 6
    p = "%.1f,%.1f %.1f,%.1f %.1f,%.1f" % (x2, y2, x2 - s * math.cos(a - .5), y2 - s * math.sin(a - .5), x2 - s * math.cos(a + .5), y2 - s * math.sin(a + .5))
    return '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="2.6"/><polygon points="%s" fill="%s" stroke="%s" stroke-width="1"/>' % (x1, y1, x2, y2, C, p, C, C)


P = {}
P["practicable-abatible"] = _svg("p", MARCO + _l(91, 17, 29, 45) + _l(91, 73, 29, 45) + _hand(86, 45) + _t(60, 88, "bisagras a un lado"), "Ventana practicable: gira sobre bisagras laterales")
P["oscilobatiente"] = _svg("o", MARCO + _l(91, 17, 29, 45) + _l(91, 73, 29, 45) + _l(29, 17, 60, 73, TL) + _l(91, 17, 60, 73, TL) + _hand(86, 45) + _t(60, 88, "se abre o se inclina"), "Ventana oscilobatiente: se abre de lado o se inclina hacia dentro")
P["oscilante"] = _svg("os", MARCO + _l(29, 17, 60, 73, TL) + _l(91, 17, 60, 73, TL) + _hand(60, 24) + _t(60, 88, "solo se inclina"), "Ventana oscilante: solo se inclina desde arriba")
P["proyectante"] = _svg("pr", MARCO + _l(29, 73, 60, 17) + _l(91, 73, 60, 17) + _hand(60, 67) + _t(60, 88, "bisagra arriba, sale hacia fuera"), "Ventana proyectante: bisagra arriba y se abre hacia fuera")
P["pivotante"] = _svg("pi", MARCO + _l(60, 12, 60, 78, 'stroke="%s" stroke-width="2.4"' % N) + '<circle cx="60" cy="17" r="3" fill="%s" stroke="none"/><circle cx="60" cy="73" r="3" fill="%s" stroke="none"/>' % (N, N)
                 + _arrow(46, 52, 46, 36) + _arrow(74, 38, 74, 54) + _t(60, 88, "gira sobre un eje central"), "Ventana pivotante: gira sobre un eje vertical en el centro")
P["corredera"] = _svg("c", MARCO.replace(A, "#fff") + '<rect x="29" y="17" width="36" height="56" fill="%s" stroke="%s" stroke-width="1.5"/><rect x="55" y="21" width="36" height="52" fill="%s" stroke="%s" stroke-width="1.5"/>' % (A, N, A, N)
                 + _arrow(40, 46, 78, 46) + _t(60, 88, "las hojas se deslizan"), "Ventana corredera: las hojas se deslizan una sobre otra")
P["plegable-o-de-librillo"] = _svg("pl", MARCO + ''.join(_l(x, y1, x, y2, 'stroke="%s" stroke-width="1.6"' % N) for x, y1, y2 in [(29, 24, 66), (45, 17, 73), (60, 24, 66), (75, 17, 73), (91, 24, 66)])
                 + '<polyline points="29,24 45,17 60,24 75,17 91,24" stroke="%s" stroke-width="2"/><polyline points="29,66 45,73 60,66 75,73 91,66" stroke="%s" stroke-width="2"/>' % (C, C) + _t(60, 88, "se pliega como un acordeón"), "Ventana plegable o de librillo: las hojas se pliegan como un acordeón")
P["marco"] = _svg("m", '<path fill-rule="evenodd" d="M22 10h76v70H22z M31 19h58v52H31z" fill="%s" stroke="%s" stroke-width="2"/><rect x="31" y="19" width="58" height="52" fill="%s" stroke="%s" stroke-width="1.5"/>' % (C, N, A, N) + _t(60, 88, "el marco: la parte fija"), "El marco es la parte fija que rodea la ventana, pegada a la pared")
P["hoja"] = _svg("h", MARCO.replace('fill="#fff"', 'fill="#fff"') + '<path fill-rule="evenodd" d="M29 17h62v56H29z M36 24h48v42H36z" fill="%s" stroke="%s" stroke-width="2"/>' % (C, N) + _hand(80, 45) + _t(60, 88, "la hoja: la parte que se mueve"), "La hoja es la parte móvil, con su vidrio")
P["hoja-fija"] = _svg("hf", MARCO + '<line x1="62" y1="17" x2="62" y2="73" stroke="%s" stroke-width="3"/>' % N + _l(91, 17, 66, 45) + _l(91, 73, 66, 45) + _t(45, 48, "fija") + _t(60, 88, "una hoja no se abre"), "Ventana con una hoja fija, que no se abre, y otra practicable")
P["travesano-y-montante"] = _svg("tm", MARCO + '<line x1="29" y1="38" x2="91" y2="38" stroke="%s" stroke-width="4.5"/><line x1="60" y1="38" x2="60" y2="73" stroke="%s" stroke-width="4.5"/>' % (C, C)
                 + _t(60, 32, "travesaño", "middle", 7.5) + _t(55, 62, "montante", "end", 7.5) , "Travesaño (barra horizontal) y montante (barra vertical) dentro del marco")
SECC = ('<rect x="28" y="62" width="64" height="22" fill="#E5E7EB" stroke="%s" stroke-width="1.5"/><rect x="55" y="8" width="7" height="52" fill="%s" stroke="%s" stroke-width="1.5"/>' % (N, A, N)
        + _t(14, 30, "dentro", "middle", 7.5) + _t(108, 30, "fuera", "middle", 7.5))
P["alfeizar"] = _svg("a", SECC + '<rect x="28" y="56" width="27" height="6" fill="%s" stroke="%s" stroke-width="1.8"/><polygon points="62,54 96,60 96,62 62,60" fill="#fff" stroke="%s" stroke-width="1.5"/>' % (C, N, N) + _t(60, 89, "alféizar: el borde interior", "middle", 8), "Alféizar: borde interior bajo la ventana")
P["vierteaguas"] = _svg("v", SECC + '<rect x="28" y="56" width="27" height="6" fill="#fff" stroke="%s" stroke-width="1.5"/><polygon points="62,52 98,59 98,63 62,60" fill="%s" stroke="%s" stroke-width="1.8"/>' % (N, C, N) + _t(60, 89, "vierteaguas: saca el agua fuera", "middle", 8), "Vierteaguas: pieza inclinada exterior que desvía el agua de lluvia")
PERF = '<rect x="26" y="44" width="68" height="30" fill="#fff" stroke="%s" stroke-width="2"/><rect x="54" y="44" width="22" height="16" fill="%s" stroke="none"/><rect x="60" y="10" width="7" height="48" fill="%s" stroke="%s" stroke-width="1.5"/>' % (N, A + "", A, N)
P["junquillo"] = _svg("j", PERF + '<rect x="67" y="40" width="9" height="12" fill="%s" stroke="%s" stroke-width="1.8"/>' % (C, N) + _t(60, 88, "junquillo: sujeta el vidrio", "middle", 8), "Junquillo: listón que sujeta el vidrio en la hoja")
P["galce"] = _svg("g", PERF + '<rect x="54" y="44" width="22" height="16" fill="none" stroke="%s" stroke-width="2.2" stroke-dasharray="4 3"/>' % C + _t(60, 88, "galce: el hueco del vidrio", "middle", 8), "Galce: hueco del perfil donde se coloca el vidrio")
P["composicion-del-vidrio-4-16-4"] = _svg("v4", '<rect x="30" y="12" width="9" height="62" fill="%s" stroke="%s" stroke-width="1.6"/><rect x="39" y="12" width="42" height="62" fill="%s" stroke="none"/><rect x="81" y="12" width="9" height="62" fill="%s" stroke="%s" stroke-width="1.6"/>' % (A, N, V, A, N)
                 + _l(39, 44, 81, 44, 'stroke="%s" stroke-width="1.6"' % C) + _t(34.5, 84, "4", "middle", 9) + _t(60, 84, "16", "middle", 9) + _t(85.5, 84, "4", "middle", 9) + _t(60, 38, "cámara", "middle", 8, C), "Doble vidrio 4/16/4: cristal de 4 mm, cámara de 16 mm y otro cristal de 4 mm")
P["cancela-corredera"] = _svg("cc", '<line x1="8" y1="76" x2="112" y2="76" stroke="%s" stroke-width="2.4"/><rect x="12" y="16" width="5" height="60" fill="%s"/><rect x="103" y="16" width="5" height="60" fill="%s"/>' % (N, N, N)
                 + '<rect x="32" y="26" width="56" height="46" fill="#fff" stroke="%s" stroke-width="2.4"/>' % N + ''.join(_l(x, 26, x, 72, 'stroke="%s" stroke-width="1.5"' % N) for x in (46, 60, 74)) + _arrow(40, 14, 84, 14) + _t(60, 88, "se desliza por un carril"), "Cancela corredera: la hoja se desliza en paralelo a la valla")
P["cancela-batiente"] = _svg("cb", '<rect x="25" y="66" width="7" height="7" fill="%s"/><rect x="88" y="66" width="7" height="7" fill="%s"/><line x1="32" y1="70" x2="58" y2="70" stroke="%s" stroke-width="3.2"/><line x1="62" y1="70" x2="88" y2="70" stroke="%s" stroke-width="3.2"/>' % (N, N, N, N)
                 + '<path d="M58 70 C58 55.6 46.4 44 32 44" %s/><path d="M62 70 C62 55.6 73.6 44 88 44" %s/><line x1="32" y1="70" x2="32" y2="44" stroke="%s" stroke-width="2"/><line x1="88" y1="70" x2="88" y2="44" stroke="%s" stroke-width="2"/>' % (SW, SW, N, N) + _t(60, 88, "vista desde arriba: las hojas giran"), "Cancela batiente: dos hojas que giran sobre bisagras")

import re as _re
CAP = {"composicion-del-vidrio-4-16-4": "4 mm de cristal, 16 mm de cámara y 4 mm de cristal"}
_out = {}
for _k, _v in P.items():
    _m = _re.search(r'<text x="60" y="(?:88|89)"[^>]*>(.*?)</text>', _v)
    if _m:
        _cap = _m.group(1); _v = _v.replace(_m.group(0), "").replace('viewBox="0 0 120 90"', 'viewBox="0 0 120 84"')
    else:
        _cap = CAP.get(_k, "")
    _out[_k] = (_v, _cap)
P = _out
