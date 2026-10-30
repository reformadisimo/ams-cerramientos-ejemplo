# Enlazado interno y externo de la web de AMS. Idempotente: se puede pasar varias veces.
import os, re, glob

A = lambda h, t: f'<a href="{h}">{t}</a>'

BLOG = {
 'cerrar-terraza-antes-de-navidad': f'Si quieres verlo en tu casa, mira nuestros {A("/cerramientos-terrazas","cerramientos de terraza")} y, antes de empezar, repasa los {A("/permisos-cerrar-terraza","permisos para cerrar la terraza")}.',
 'condensacion-ventanas': f'Si la culpa es de la ventana, unas {A("/ventanas-pvc","ventanas de PVC")} con buen doble acristalamiento suelen resolverlo. Te lo contamos en {A("/blog/ventanas-ahorro-energia-calor-frio","cómo ahorrar con las ventanas")}.',
 'cuanto-cuesta-cambiar-ventanas': f'Para un precio orientativo de tu caso, usa la {A("/calculadora","calculadora de ventanas")} o mira nuestras {A("/ventanas-pvc","ventanas de PVC")} y {A("/ventanas-aluminio","de aluminio")}.',
 'licencia-obras-cambiar-ventanas': f'Si vas a cambiarlas, mira nuestras {A("/ventanas-pvc","ventanas de PVC")}. Y si además quieres cerrar la terraza, aquí tienes los {A("/permisos-cerrar-terraza","permisos para cerrar la terraza")}.',
 'mantenimiento-limpieza-ventanas': f'Si alguna ya no cierra bien, en {A("/reparaciones","reparaciones")} te la miramos; y si toca cambiarla, mira nuestras {A("/ventanas-pvc","ventanas de PVC")}.',
 'mejor-epoca-cambiar-ventanas': f'Antes de decidir, mira {A("/blog/cuanto-cuesta-cambiar-ventanas","cuánto cuesta cambiar las ventanas")} y nuestras {A("/ventanas-pvc","ventanas de PVC")}.',
 'no-hacemos-ventanas-hacemos-hogares': f'Lo que más fabricamos son {A("/ventanas-pvc","ventanas de PVC")} y {A("/cancelas-de-aluminio","cancelas de aluminio soldado")}. Seguimos con esta idea en {A("/blog/una-ventana-no-es-solo-una-ventana","una ventana no es solo una ventana")}.',
 'ventanas-ahorro-energia-calor-frio': f'Si quieres dar el paso, mira nuestras {A("/ventanas-pvc","ventanas de PVC")}, las {A("/blog/ayudas-cambiar-ventanas-madrid","ayudas para cambiar ventanas en Madrid")} y {A("/blog/cuanto-cuesta-cambiar-ventanas","cuánto cuesta cambiarlas")}.',
 'cancelas-aluminio-soldado': f'Mira todos los modelos y el precio de referencia de nuestras {A("/cancelas-de-aluminio","cancelas de aluminio soldado")}.',
 'mas-que-una-ventana': f'Seguimos con esta idea en {A("/blog/una-ventana-no-es-solo-una-ventana","una ventana no es solo una ventana")}.',
 'pvc-o-aluminio': f'¿Y cuánto cuesta? Te lo contamos en {A("/blog/cuanto-cuesta-cambiar-ventanas","cuánto cuesta cambiar las ventanas")}, o calcúlalo en la {A("/calculadora","calculadora")}.',
 'instalacion-ventanas-pvc': f'Para pedir presupuesto con las medidas bien tomadas, mira {A("/como-medir-ventanas","cómo medir tus ventanas")}.',
 'precio-cerrar-terraza': f'Antes de cerrarla, repasa los {A("/permisos-cerrar-terraza","permisos para cerrar la terraza")}.',
}

# Fuentes externas de autoridad por artículo (solo organismos y fabricantes; nunca competidores)
EXT = {
 'ayudas-cambiar-ventanas-madrid': [('https://www.idae.es','IDAE (Instituto para la Diversificación y Ahorro de la Energía)'),('https://www.comunidad.madrid','Comunidad de Madrid')],
 'ventanas-ahorro-energia-calor-frio': [('https://www.idae.es','IDAE'),('https://www.codigotecnico.org','Código Técnico de la Edificación')],
 'condensacion-ventanas': [('https://www.codigotecnico.org','Código Técnico de la Edificación')],
 'rotura-puente-termico': [('https://www.codigotecnico.org','Código Técnico de la Edificación')],
 'licencia-obras-cambiar-ventanas': [('https://www.ayto-alcaladehenares.es','Ayuntamiento de Alcalá de Henares')],
 'cuanto-cuesta-cambiar-ventanas': [('https://www.idae.es','IDAE')],
 'pvc-o-aluminio': [('https://www.kommerling.es','Kömmerling')],
 'instalacion-ventanas-pvc': [('https://www.kommerling.es','Kömmerling')],
}

SERV_EXTRA = {
 '/ventanas-pvc': [('/blog/cuanto-cuesta-cambiar-ventanas','Cuánto cuesta cambiar las ventanas'),('/calculadora','Calcula el precio de tus ventanas'),('/como-medir-ventanas','Cómo medir tus ventanas'),('/blog/licencia-obras-cambiar-ventanas','¿Necesito licencia para cambiar ventanas?')],
 '/ventanas-aluminio': [('/blog/cuanto-cuesta-cambiar-ventanas','Cuánto cuesta cambiar las ventanas'),('/calculadora','Calcula el precio de tus ventanas'),('/como-medir-ventanas','Cómo medir tus ventanas')],
 '/cerramientos-terrazas': [('/permisos-cerrar-terraza','Permisos para cerrar la terraza'),('/blog/precio-cerrar-terraza','Cuánto cuesta cerrar la terraza'),('/blog/cerrar-terraza-antes-de-navidad','Cierra la terraza antes de Navidad')],
 '/cancelas-puertas': [('/cancelas-de-aluminio','Cancelas de aluminio soldado: modelos y precio'),('/rejas','Rejas de seguridad'),('/automatismos','Motores para tu cancela')],
 '/automatismos': [('/cancelas-de-aluminio','Cancelas de aluminio soldado'),('/rejas','Rejas de seguridad')],
 '/comunidades': [('/cancelas-de-aluminio','Cancelas de aluminio soldado'),('/rejas','Rejas de seguridad')],
 '/persianas-cristales': [('/rejas','Rejas de seguridad'),('/blog/cajones-persiana-aislados','Cajones de persiana aislados')],
 '/': [('/cancelas-de-aluminio','Cancelas de aluminio soldado'),('/blog/cuanto-cuesta-cambiar-ventanas','Cuánto cuesta cambiar las ventanas'),('/calculadora','Calcula tu precio'),('/mapa-de-obras','Mapa de obras'),('/empresa','Quiénes somos')],
 '/trabajos': [('/mapa-de-obras','Mapa de obras'),('/empresa','Quiénes somos'),('/cancelas-de-aluminio','Cancelas de aluminio soldado')],
}
ZONAS = ['/alcala-de-henares','/torrejon-de-ardoz','/villalbilla','/coslada','/meco','/azuqueca-de-henares','/guadalajara','/madrid']
for z in ZONAS:
    SERV_EXTRA[z] = [('/cancelas-de-aluminio','Cancelas de aluminio soldado'),('/blog/cuanto-cuesta-cambiar-ventanas','Cuánto cuesta cambiar las ventanas'),('/calculadora','Calcula tu precio')]

GLOS = [
 (r'cancela|corredera de garaje|batiente', '/cancelas-de-aluminio', 'Cancelas de aluminio'),
 (r'motor|automat|mando|fotoc', '/automatismos', 'Automatismos'),
 (r'persiana|cajón|cajon|mosquiter|lama', '/persianas-cristales', 'Persianas y cristales'),
 (r'pérgola|pergola', '/pergolas', 'Pérgolas'),
 (r'toldo|lona', '/toldos', 'Toldos'),
 (r'techo|policarbonato|panel sándwich|panel sandwich', '/techos', 'Techos de aluminio'),
 (r'reja', '/rejas', 'Rejas'),
 (r'cortina de cristal|cerramiento|terraza|porche', '/cerramientos-terrazas', 'Cerramientos de terraza'),
 (r'pvc|kömmerling|kommerling|cámaras|camaras|refuerzo de acero', '/ventanas-pvc', 'Ventanas de PVC'),
 (r'aluminio|rotura de puente|rpt|anodiz|lacad', '/ventanas-aluminio', 'Ventanas de aluminio'),
 (r'vidrio|cristal|acristal|low|bajo emisivo|transmitancia|aislamiento|oscilobat|herraje|manilla|junta|hoja|marco|ventana|condensac', '/ventanas-pvc', 'Ventanas de PVC'),
]

def _url(out, f):
    u = '/' + os.path.relpath(f, out)[:-5]
    return (u[:-6] or '/') if u.endswith('/index') else u

def _box(links, titulo='Te puede interesar'):
    chips = ''.join(f'<a href="{h}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 14px;border:1px solid #DCE2E7;border-radius:999px;background:#fff;color:#12202B;font-weight:600;text-decoration:none;font-size:15px">{t}</a>' for h, t in links)
    return f'<section class="ams-int" style="background:#F3F6F9"><div style="max-width:1200px;margin:0 auto;padding:36px 24px"><h2 style="margin:0 0 14px;font-size:22px;font-weight:800">{titulo}</h2><div>{chips}</div></div></section>\n'

def aplicar(out):
    n = {'blog': 0, 'ext': 0, 'serv': 0, 'glos': 0, 'pie': 0, 'otros': 0}
    files = [f for f in glob.glob(os.path.join(out, '**', '*.html'), recursive=True)]
    for f in files:
        u = _url(out, f)
        s = open(f, encoding='utf-8').read(); s0 = s
        # Blog: enlace en el texto a servicio / artículos relacionados, y fuentes externas
        if u.startswith('/blog/'):
            slug = u[6:]
            ia = s.find('<article'); ja = s.find('</article>', ia)
            if ia > 0 and ja > 0:
                pst = re.search(r'<p style="[^"]*"', s[ia:ja])
                pstyle = pst.group(0)[3:] if pst else 'style="margin:0;font-size:17px;line-height:1.65"'
                cta = s.find('color: #FFFFFF">', ia)
                ins = s.rfind('<div', ia, cta) if 0 < cta < ja else ja
                add = ''
                if slug in BLOG and 'data-int="1"' not in s:
                    add += f'<p data-int="1" {pstyle}>{BLOG[slug]}</p>'
                    n['blog'] += 1
                if slug in EXT and 'data-ext="1"' not in s:
                    lk = ', '.join(f'<a href="{h}" target="_blank" rel="noopener">{t}</a>' for h, t in EXT[slug])
                    add += f'<p data-ext="1" {pstyle.replace("17px", "15px")}><span style="color:#4A5A68">Fuentes y más información: {lk}.</span></p>'
                    n['ext'] += 1
                if add: s = s[:ins] + add + s[ins:]
        # Servicios, portada, zonas y trabajos: bloque de enlaces útiles
        if u in SERV_EXTRA and 'class="ams-int"' not in s:
            blk = _box([(h, t) for h, t in SERV_EXTRA[u] if h != u])
            anchor = s.find('<section class="vsec2"')
            if anchor < 0: anchor = s.find('<footer')
            if anchor > 0: s = s[:anchor] + blk + s[anchor:]; n['serv'] += 1
        # Glosario: cada término que encaje lleva a su servicio
        if u == '/glosario':
            def gl(m):
                art = m.group(0)
                if 'gl-srv' in art: return art
                low = re.sub('<[^>]+>', ' ', art).lower()
                h3 = (re.search(r'<h3>(.*?)</h3>', art) or [None, ''])[1].lower()
                for rx, href, name in GLOS:
                    if re.search(rx, h3) or (re.search(rx, low) and rx.startswith('cancela')):
                        if f'href="{href}"' in art: return art
                        n['glos'] += 1
                        return art.replace('</div></article>', f'<div class="gl-ver gl-srv">Esto lo hacemos: <a href="{href}">{name}</a></div></div></article>', 1)
                return art
            s = re.sub(r'<article class="gl-term".*?</article>', gl, s, flags=re.S)
        # Pie: crédito discreto a Casiopea 360 (solo el nombre)
        if '<div class="foot-bottom">' in s and 'casiopea360.es' not in s:
            s = s.replace('<a href="#" data-ck-open>Configurar cookies</a></span></div>', '<a href="#" data-ck-open>Configurar cookies</a> · <span style="color:#7F8C97">Web: <a href="https://casiopea360.es" target="_blank" rel="noopener" style="color:#7F8C97">Casiopea 360</a></span></span></div>', 1)
            if 'casiopea360.es' in s: n['pie'] += 1
        # Arreglos
        if u == '/privacidad':
            s = s.replace('<a href="https://www.aepd.es" style=', '<a href="https://www.aepd.es" target="_blank" rel="noopener" style=')
        if u == '/trabajos':
            s = s.replace('https://amscerramientos.es/wp-content/uploads/2018/10/Cerramiento-de-aluminio-en-Alcala-de-Henares.jpg', '/img/web-antigua/02-cerramientos-galeria.webp')
            s = s.replace('https://amscerramientos.es/wp-content/uploads/2015/02/Cerramiento_AL_6.jpg', '/img/web-antigua/26-cerramientos-terrazas.webp')
            s = s.replace('alt="Porche cerrado con aluminio blanco y cristal junto a una escalera de ladrillo"', 'alt="Cerramiento de aluminio y cristal en una terraza de chalet"')
            s = s.replace('https://amscerramientos.es/wp-content/uploads/2019/05/cancela-aluminio-soldado-efecto-gris.jpeg', '/img/web-antigua/10-cancela-efecto-gris.webp')
        if u.startswith('/guia-javi'):
            s = s.replace('href="/guia-javi/panel"', 'href="/guia-javi#s44"')
        if u == '/guia-javi/resumen':
            def ver(m):
                row = m.group(1); first = re.search(r'<td>(.*?)</td>', row)
                t = re.sub('<[^>]+>', '', first.group(1)).strip() if first else ''
                t = (t[:40] + '…') if len(t) > 41 else t
                return m.group(0).replace('>Ver</a>', f'>Ver: {t}</a>' if t else '>Ver en la guía</a>')
            s = re.sub(r'<tr>(.*?)</tr>', lambda m: ver(m) if '>Ver</a>' in m.group(0) else m.group(0), s, flags=re.S)
        if s != s0:
            open(f, 'w', encoding='utf-8').write(s); n['otros'] += 1
    return n

if __name__ == '__main__':
    import sys; print(aplicar(sys.argv[1]))
