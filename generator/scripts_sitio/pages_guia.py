import re, os, shutil
from pages_cuestionario import partes

INF = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "informe")

def _css(raw):
    raw = re.sub(r'@page\{[^}]*\}', '', raw)
    raw = re.sub(r'(\d+(?:\.\d+)?)mm', lambda m: '%.1fpx' % (float(m.group(1)) * 4.2), raw)
    raw = re.sub(r'(\d+(?:\.\d+)?)pt', lambda m: '%.1fpx' % (float(m.group(1)) * 1.6), raw)
    raw = raw.replace('body{', '.g{', 1)
    return raw

HERO_CSS = """<style>
.gh{position:relative;color:#fff;background:#12202B;overflow:hidden}
.gh-bg{position:absolute;inset:0;background:url(/img/terraza-cristal.jpg) center 40%/cover}
.gh-ov{position:absolute;inset:0;background:linear-gradient(100deg,rgba(18,32,43,.94) 0%,rgba(18,40,60,.84) 48%,rgba(18,40,60,.45) 100%)}
.gh-in{position:relative;max-width:1180px;margin:0 auto;padding:54px 22px 28px}
.gh h1{margin:0 0 16px;font-size:clamp(34px,6.4vw,64px);line-height:1.04;letter-spacing:-1.5px;font-weight:800;max-width:900px}
.gh p{margin:0 0 12px;font-size:clamp(17px,2.2vw,22px);line-height:1.5;max-width:760px;color:#EAF0F5}
.gh b{color:#F5B27F}.gh .gh-for{font-size:16px;color:#C8D4DE}.gh .gh-web{font-size:19px;line-height:1.45;background:rgba(18,32,43,.55);border-left:4px solid #F5B27F;padding:10px 14px;border-radius:0 10px 10px 0;max-width:640px}
.gh-b{display:flex;flex-wrap:wrap;gap:12px;margin:22px 0 30px}
.gh-b a{font:800 18px Inter,sans-serif;text-decoration:none;padding:15px 24px;border-radius:10px;min-height:52px;display:inline-flex;align-items:center}
.gh-b .p{background:#F5B27F;color:#12202B}.gh-b .s{border:2px solid #fff;color:#fff}
.gh-k{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.gh-k div{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);border-radius:12px;padding:14px 16px}
.gh-k strong{display:block;font-size:40px;line-height:1;color:#F5B27F}.gh-k span{display:block;margin-top:6px;font-size:15px;line-height:1.35;color:#E4EAF0}
@media(max-width:600px){.gh-in{padding:36px 18px 22px}.gh-k{grid-template-columns:1fr 1fr}.gh-k strong{font-size:32px}.gh-k span{font-size:13.5px}}
@media print{.gh-b{display:none}}
.g{padding-top:26px}
.bsq{top:64px!important}
@media(min-width:1180px){#lat{display:none!important}body.lat-on #lat{display:block!important;top:84px!important;bottom:16px!important}}
</style>"""
HERO = """<div id="gbar" role="progressbar" aria-label="Apartados de la guía que has visto" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="gbt"><b id="gbp">0 %</b><span id="gbx">de la guía leído</span><em id="gbf">faltan 55 apartados</em></div><div class="gbb"><i></i></div></div><style>#gbar{position:fixed;top:0;left:0;right:0;height:32px;z-index:90;background:#12202B;color:#fff;font:600 13px/1 Inter,sans-serif}#gbar .gbt{display:flex;gap:6px;align-items:center;justify-content:center;height:26px;padding:0 10px;white-space:nowrap;overflow:hidden}#gbar b{color:#F5B27F;font-size:14px}#gbar em{font-style:normal;color:#C8D4DE;margin-left:6px}#gbar .gbb{height:6px;background:#2A3C4B}#gbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#F5B27F,#C2410C);border-radius:0 3px 3px 0;transition:width .4s}body{padding-top:32px}.site-header{top:32px!important}#hprog{display:none}@media(max-width:480px){#gbar{font-size:12px}#gbar .gbt{gap:4px}#gbar em{margin-left:2px}}@media print{#gbar{display:none}body{padding-top:0}}</style><section class="gh" id="gh"><div class="gh-bg"></div><div class="gh-ov"></div><div class="gh-in">
<h1>Javi, esta es tu web nueva. Te la contamos sin prisas.</h1>
<p class="gh-web"><b>Esta es tu nueva página web</b> (pulsa el primer botón para abrirla) <b>y, debajo, todo el plan de marketing</b> para que te encuentren y te llamen.</p>
<p>Hoy te encuentran en Google unas <b>230 personas al mes</b> (estimación de Semrush). Te contamos por qué, lo que ya hemos hecho y todo lo que podemos mejorar juntos.</p>
<p class="gh-for">Para Javi, con cariño. Octubre de 2026.</p>
<div class="gh-b"><a class="p" href="/">Abrir tu nueva página web</a><a class="s" href="/guia-javi/resumen">Ver el resumen en una página</a><a class="s" href="#indice">Ver el índice de la guía</a><a class="s" href="#empieza">Empezar a leer</a></div>
<div class="gh-k"><div><strong>94</strong><span>velocidad de la web nueva en móvil (la de hoy, 56)</span></div><div><strong>45</strong><span>páginas en la web nueva, con vídeos de ambiente</span></div><div><strong>8</strong><span>zonas, cada una con su página: Alcalá, Torrejón, Villalbilla...</span></div><div><strong>36</strong><span>artículos del blog previstos en 3 meses</span></div></div>
</div></section><script>(function(){var h=document.getElementById('gh');function f(){document.body.classList.toggle('lat-on',h.getBoundingClientRect().bottom<90)}addEventListener('scroll',f,{passive:true});f()})();</script>"""

def _integrar(OUT, page, body):
    """Mete la guia dentro de la web: cabecera y pie de AMS, portada con foto y cifras, y el chat."""
    import re, os
    base = os.path.join(OUT, "cuestionario.html")
    if not os.path.exists(base): return page
    s = open(base, encoding="utf8").read()
    style = re.search(r'<style>(.*?)</style></head>', page, re.S).group(1)
    s = re.sub(r'<title>.*?</title>', '<title>Guía para Javi | AMS Cerramientos</title>', s, 1, flags=re.S)
    s = re.sub(r'<meta name="description"[^>]*>|<link rel="canonical"[^>]*>|<meta property="og:[^>]*>|<meta name="twitter:[^>]*>|<script type="application/ld\+json">.*?</script>', '', s, flags=re.S)
    s = s.replace('</head>', '<style>' + style + '</style>' + HERO_CSS + '</head>', 1)
    s = re.sub(r'<main>.*?</main>', lambda m: '<main>' + HERO + '<div class="g">' + body_final(page) + '</div></main>', s, 1, flags=re.S)
    s = re.sub(r'<a href="https://wa\.me/[^"]*" class="wa".*?</a>', '', s, 1, flags=re.S)
    s = s.replace('</body>', '<script src="/asistente.js" defer></script></body>', 1)
    return s

def body_final(page):
    import re
    m = re.search(r'<body><div class="g">(.*)</div></body></html>\s*$', page, re.S)
    return m.group(1)

def build(OUT):
    h = open(os.path.join(INF, "informe.html"), encoding="utf8").read()
    style = re.search(r'<style>(.*?)</style>', h, re.S).group(1)
    body = h[h.index('<div class="cover">'):h.index('</body>')]
    body = re.sub(r'<div class="cover">.*?</div>\s*', '', body, count=1, flags=re.S)
    # imagenes
    used = set(re.findall(r'src="img/([^"]+)"', body))
    dst = os.path.join(OUT, "img", "guia"); os.makedirs(dst, exist_ok=True)
    for f in used:
        shutil.copy(os.path.join(INF, "img", f), os.path.join(dst, f))
    body = body.replace('src="img/', 'src="/img/guia/')
    # videos que se reproducen en la version web
    def _v(m):
        n = m.group(1)
        if not os.path.exists(os.path.join(OUT, "img", n + ".mp4")): return m.group(0)
        return ('<div class="vid"><video controls playsinline preload="none" poster="/img/guia/%s.jpg"><source src="/img/%s.mp4" type="video/mp4"><source src="/img/%s.webm" type="video/webm"></video></div>' % (n, n, n))
    body = re.sub(r'<div class="vid"><a href="[^"]*"><img src="/img/guia/([a-z0-9-]+)\.jpg"></a><div class="pl">[^<]*</div></div>', _v, body)
    body = body.replace('Pulsa en la imagen para verlos en movimiento', 'Pulsa el triángulo para verlos')
    from pages_obras import widget as _wmapa
    body = re.sub(r'<!--mapa-guia-ini-->.*?<!--mapa-guia-fin-->', lambda m: '<div style="margin:3mm 0">' + _wmapa('mg', auto=True) + '<p style="font-size:13px;color:#4A5A68">Ejemplo con datos ficticios. Pulsa y arrastra para moverte; con la rueda del ratón, o con dos dedos en el móvil, haces zoom.</p></div>', body, flags=re.S)
    # caja "como leerlo" para web
    body = re.sub(r'<div class="how">.*?</div>', '<div class="how"><b>Cómo leerlo:</b> todo lo que está en <span style="color:#C2410C;text-decoration:underline">naranja y subrayado</span> se puede pulsar: el índice, los enlaces a la web nueva y a las páginas de los competidores. En cada apartado hay un "↑ índice" para volver. Las respuestas al final se guardan solas en este móvil o en este ordenador. <a href="/AMS-guia-para-Javi.pdf"><b>Descargar esta guía en PDF</b></a> (siempre la última versión). Cada parte tiene un botón para abrir el detalle y, debajo, unos botones para decirnos qué te ha parecido: nos llega a nosotros.</div>', body, count=1, flags=re.S)
    _viva = ('<div class="how" style="border-left:4px solid #C2410C"><b>Esta guía está viva.</b> Al estar en internet, la vamos actualizando según vamos mejorando la web: cada herramienta o idea nueva aparece aquí, con su explicación.</div>')
    body = body.replace('<h2 id="indice">', _viva + '<h2 id="indice">', 1)
    # cuestionario interactivo
    n, css, bloques, js = partes()
    a = body.index('<h2 class="pb" id="s') if False else None
    m = re.search(r'<h2[^>]*id="(s\d+)">\d+\. Preguntas para ti.*?</h2>', body)
    start = m.end()
    nxt = re.search(r'<h2', body[start:])
    end = start + nxt.start()
    inter = f'''<div class="box"><h3>Contesta aquí mismo</h3><p style="margin:0"><b>Perdona que sea tan largo:</b> sabemos que son muchas preguntas, pero este trabajo es muy importante y queremos que lo conozcas todo y que la web diga solo lo que es verdad. Son {n} preguntas cortas. Pulsa las opciones o escribe. Contesta todas; si no sabes algo, escribe "No sé". Tus respuestas se guardan solas en este dispositivo mientras las escribes y, cuando termines, las mandas a Ignacio por WhatsApp o por correo con los botones de abajo. También puedes ir a <a href="/cuestionario">esta misma página solo con las preguntas</a>.</p></div>
{css}{bloques}
<div class="acts"><button id="b-send" type="button">Enviar mis respuestas a Ignacio</button><button id="b-share" class="sec" type="button">Enviar (elige WhatsApp)</button><button id="b-mail" type="button">Enviar por correo</button><button id="b-copy" class="sec" type="button">Copiar respuestas</button></div>
<div id="estado" role="status"></div>
{js}
'''
    body = body[:start] + "\n" + inter + body[end:]
    # tablas con scroll en movil
    body = body.replace('<table', '<div class="tw"><table').replace('</table>', '</table></div>')

    # ---- version web: mas visual y menos texto ----
    GRUPOS = [
      ("Dónde estamos", "#C2410C", ["s1","s44","s3","s4","s5","s6","s7","s8","s9","s31","s32"]),
      ("Lo que incluye la web", "#1D6FB8", ["s10","s11","s12","s15","s16","s27","s33","s34","s35","s36","s37","s38","s39","s40","s41","s42","s43","s45","s46","s47","s48","s49","s50","s51","s52","s54","s55","s53","s28","s29","s30"]),
      ("Cómo lo ponemos en marcha", "#2E8B57", ["s13","s14","s17","s18","s19","s20","s21","s22"]),
      ("Tu parte", "#7B3FA0", ["s23","s24"]),
      ("Para consultar", "#5B6B78", ["s2","s25","s26"]),
    ]
    G_DE = {i: (n, c) for n, c, ids in GRUPOS for i in ids}
    FOTOS = {
     's1':('terraza-cristal','Todo lo que necesitas saber, en un minuto.'),
     's3':('mujer-movil','Todo cliente empieza con una búsqueda. Vamos a hacer que os encuentre.'),
     's4':('taller-hombre','Veinte años de trabajo bien hecho: esa base no se compra.'),
     's5':('ventana-cortina','Todo tiene arreglo, y es más sencillo de lo que parece.'),
     's6':('lapiz-medicion','Mirar a los demás sirve para saber dónde brillar.'),
     's7':('llamada-sonrisa','Los portales, bien usados, también suman.'),
     's8':('sonrisa-luces','Una foto de una obra vale más que mil anuncios.'),
     's9':('llamada-risa','Cada cliente que se pierde es uno que se puede recuperar.'),
     's10':('reforma-ventanal','Así puede verse vuestra casa en internet.'),
     's11':('villa-cristal','Vuestro nombre, bien puesto.'),
     's12':('vista-exterior','Cada dirección, una puerta de entrada.'),
     's13':('obra-balcon','Un cambio hecho con calma y sin riesgo.'),
     's14':('salon-ventanal','Tú eliges el camino y el ritmo.'),
     's15':('mujer-libro','Contestar rápido, sin esfuerzo.'),
     's16':('arquitecto-mesa','Herramientas que trabajan aunque no estéis delante.'),
     's17':('hombre-sonriendo','Paso a paso, de uno en uno.'),
     's18':('mujer-luz','Un artículo cada semana, y la web se va llenando de vida.'),
     's19':('cliente-obrero','Del primer clic a la obra, sin perder a nadie.'),
     's20':('terraza-cristal','Treinta días para arrancar con buen pie.'),
     's21':('techo-buhardilla','Las cosas buenas llevan su tiempo, y merecen la pena.'),
     's22':('villa-cristal','Lo que viene después depende de ti.'),
     's23':('vista-exterior','Pocos accesos, muchas posibilidades.'),
     's24':('llamada-sonrisa','Tus respuestas lo cambian todo.'),
     's27':('arquitecto-mesa','Mirar a los demás para saber dónde brillamos.'),
     's28':('mujer-movil','Que no se nos escape nada de lo que pasa en la web.'),
     's32':('ventana-cortina','Cada euro, trabajando para ti.'),
     's31':('llamada-sonrisa','Gracias por contárnoslo: así empezamos mejor.'),
     's30':('hombre-sonriendo','Cada visita es una puerta abierta.'),
     's29':('mujer-luz','Que cuando alguien pregunte, salgáis vosotros.'),
     's25':('ventana-cortina','Las fotos que ya tenéis valen oro.'),
     's45':('arquitecto-mesa','Las calculadoras son las que más presupuestos traen.'),
     's46':('llamada-sonrisa','Tus respuestas lo cambian todo.'),
     's47':('mujer-movil','Que nadie se vaya sin dejar su contacto.'),
     's48':('llamada-risa','Un WhatsApp que ya viene escrito.'),
     's49':('hombre-sonriendo','Un mensaje listo para pedir el informe.'),
     's50':('vista-exterior','Con tu permiso vemos qué pasó de verdad.'),
     's51':('lapiz-medicion','Mirar los anuncios con lupa.'),
     's52':('ventana-cortina','Una imagen vale más que mil palabras.'),
     's54':('mujer-luz','Todo lo que hacemos, bien ordenado.'),
     's55':('hombre-sonriendo','Casi cualquier cosa que se te ocurra.'),
     's53':('arquitecto-mesa','Lo que cuesta de verdad, con números.'),
    }
    COLAPSA = {'s1','s2','s3','s4','s8','s10','s11','s23','s5','s6','s7','s9','s12','s13','s14','s15','s16','s17','s18','s19','s20','s21','s22','s25','s45','s47','s48','s49','s50','s51'}
    partes_h = re.split(r'(?=<h2[ >])', body)
    nuevo = []
    for ch in partes_h:
        m = re.match(r'<h2[^>]*id="(s\d+)"', ch)
        if not m or m.group(1) not in FOTOS:
            if m and m.group(1) in G_DE:
                gn, gc = G_DE[m.group(1)]
                ch = '<span class="gt" style="background:%s">%s</span>' % (gc, gn) + ch
            nuevo.append(ch); continue
        sid = m.group(1); img, frase = FOTOS[sid]
        e = ch.index('</h2>') + 5
        cab, resto = ch[:e], ch[e:]
        ban = '<div class="sb"><img loading="lazy" alt="" src="/img/%s.jpg"><p>%s</p></div>' % (img, frase)
        if sid == 's10':
            ban += '<div class="vid"><video controls playsinline preload="none" poster="/img/reforma-ventanal.jpg"><source src="/img/reforma-ventanal.mp4" type="video/mp4"><source src="/img/reforma-ventanal.webm" type="video/webm"></video></div>'
        if sid == 's1':
            _e = resto.find('</ul>\n</div>')
            _e = _e + len('</ul>\n</div>') if _e >= 0 else 0
            resto = resto[:_e] + '<details class="dt"><summary></summary>' + resto[_e:] + '</details>'
        elif '<!--MAS-->' in resto:
            _a, _b = resto.split('<!--MAS-->', 1)
            resto = _a + '<details class="dt"><summary></summary>' + _b + '</details>'
        elif sid in COLAPSA:
            resto = '<details class="dt"><summary></summary>' + resto + '</details>'
        gn, gc = G_DE.get(sid, ('', '#5B6B78'))
        chip = '<span class="gt" style="background:%s">%s</span>' % (gc, gn) if gn else ''
        nuevo.append(chip + cab + ban + resto)
    body = ''.join(nuevo)

    _cards = [
      ("1", "Dónde estamos", "Casi no entran contactos por la web. No es culpa tuya: es que no se os ve donde mira el cliente.", "#s1", "Verlo", "#C2410C"),
      ("2", "Lo que ya tienes", "Más de 20 años, taller propio, instaladores oficiales de Kömmerling y buenas reseñas. Lo difícil ya está hecho.", "#s4", "Verlo", "#C2410C"),
      ("3", "Lo que incluye la web", "Una web nueva con calculadora, configurador, herramientas y un mapa de obras.", "#s10", "Verlo", "#1D6FB8"),
      ("4", "Míralo tú mismo", "La web nueva ya se puede abrir y tocar. Es un ejemplo, con fotos y datos provisionales.", "https://ams-cerramientos-ejemplo.vercel.app/", "Abrir la web nueva", "#1D6FB8"),
      ("5", "Lo que te pedimos", "Tres costumbres que no cuestan dinero: contestar el mismo día, cuidar la ficha de Google y enseñar obras reales.", "#s17", "Verlo", "#2E8B57"),
      ("6", "Tiempos y costes", "Google tarda entre 3 y 6 meses en notarse. Lo que cuesta cada cosa, claro y sin letra pequeña.", "#s14", "Verlo", "#2E8B57"),
    ]
    _emp = ('<div class="emp"><h2 id="empieza" style="margin:26px 0 6px;border:0;padding:0">Empieza aquí: tu guía en 5 minutos</h2>'
            '<p style="margin:0 0 14px;font-size:18px">Si solo tienes un rato, lee esto. El resto de la guía es para cuando quieras mirar el detalle de algo, sin ninguna prisa.</p>'
            '<div class="emp-g">' + ''.join(
              '<a class="emp-c" href="%s" style="--c:%s"%s><b class="emp-n">%s</b><b class="emp-t">%s</b><span>%s</span><em>%s</em></a>' % (h, c, ' target="_blank" rel="noopener"' if h.startswith('http') else '', n, t, d, b)
              for n, t, d, h, b, c in _cards) + '</div>'
            '<p style="margin:14px 0 0;font-size:16px;background:#EAF5EE;border-radius:8px;padding:12px 14px"><b>Una tranquilidad:</b> la web nueva que ves es solo un ejemplo y <b>no está publicada</b>: no está en tu dominio, Google no la lista y solo la ve quien tiene el enlace. No hemos tocado nada de tu web actual, ni de tu ficha de Google, ni de tus redes.</p>'
            '<div id="control" style="scroll-margin-top:170px;margin:18px 0 0;background:#FFFDF8;border:2px solid #12202B;border-radius:16px;padding:20px 18px"><style>#control h2{margin:0 0 6px;border:0;padding:0;font-size:clamp(22px,5vw,28px);line-height:1.2}#control .ct-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px;margin:12px 0}#control .ct-g>div{background:#fff;border:1px solid #DCE2E7;border-top:5px solid #2E8B57;border-radius:12px;padding:12px 14px}#control .ct-g b{display:block;font-size:17px;margin:0 0 4px}#control .ct-g span{font-size:15px;line-height:1.4;color:#33495C}#control table{width:100%;border-collapse:collapse;font-size:15px;margin:8px 0}#control th,#control td{border:1px solid #DCE2E7;padding:8px 10px;text-align:left;vertical-align:top}#control th{background:#EAF2FB}@media(max-width:560px){#control table,#control tbody,#control tr,#control td,#control th{display:block;width:100%}#control thead{display:none}#control tr{margin:0 0 10px;border:1px solid #DCE2E7;border-radius:10px;overflow:hidden}#control td{border:0;border-bottom:1px solid #EEF1F4}#control td:first-child{background:#EAF2FB;font-weight:700}}</style><h2>Tuyo es el control. Siempre.</h2><p style="margin:0 0 8px;font-size:18px">Nuestro objetivo es muy sencillo: que el día que quieras dejarlo, cambiar de equipo o mandarnos a paseo, lo puedas hacer <b>con total tranquilidad</b>, sin pedirnos permiso, sin perder nada y sin darnos explicaciones. Si algún día nos dices que ya no nos necesitas, te lo llevas todo y punto. Sin enfados.</p><div class="ct-g"><div><b>1. Todo a tu nombre</b><span>Dominio, Google Ads, Analytics, Search Console, Tag Manager, ficha de Google y redes: cada cuenta a nombre de AMS, con tu correo como propietario. Nosotros entramos como usuarios invitados por ti.</span></div><div><b>2. Tú decides quién entra</b><span>Puedes quitar el acceso a quien quieras, incluidos nosotros, en un minuto y sin avisar. Nada depende de que nosotros digamos que sí.</span></div><div><b>3. Tu dinero va a tus anuncios</b><span>Lo que inviertes en Google Ads se paga con tu tarjeta en tu cuenta y va entero a los anuncios. Cero comisión por nuestra parte.</span></div><div><b>4. La web es tuya</b><span>Cuando la web definitiva esté publicada, quedará en una cuenta a tu nombre, o te entregaremos una copia completa (textos, fotos, formularios y código) para que la lleves donde quieras.</span></div><div><b>5. Tus clientes son tuyos</b><span>Todos los contactos y presupuestos que entren por la web y por el CRM son tuyos. Si los quieres en una hoja de Excel, te los damos cuando los pidas.</span></div><div><b>6. Sin permanencia</b><span>No hay contrato que te ate. Nos quedamos mientras te sirvamos, y nada más.</span></div></div><h3 style="margin:16px 0 6px;font-size:18px">Tus cuentas: cómo deben quedar y cómo están hoy</h3><p style="margin:0 0 6px;font-size:15px;color:#33495C">Esta tabla la iremos rellenando contigo. Solo pone lo que sabemos con seguridad; lo demás figura como «por comprobar».</p><table><thead><tr><th>Cuenta</th><th>Cómo debe quedar</th><th>Situación hoy</th></tr></thead><tbody><tr><td>Google Ads</td><td>Tú, con info@amscerramientos.es, como Administrador. Nosotros, como usuarios.</td><td data-e="ads">La gestiona tu agencia actual. Ya se lo has pedido (26 de octubre) y esperamos su respuesta. Si la cuenta es de la agencia y no se puede traspasar, la solución es abrir una cuenta nueva a tu nombre, con tu tarjeta.</td></tr><tr><td>Google Analytics</td><td>Tú como Administrador. Nosotros, como usuarios.</td><td data-e="analytics">Tu agencia te ha dado acceso con info@amscerramientos.es. Falta confirmar que es de Administrador.</td></tr><tr><td>Dominio y correo</td><td>A nombre de AMS, en tu cuenta de DonDominio.</td><td data-e="dominio">El correo está alojado en DonDominio. Por comprobar a nombre de quién figura el dominio.</td></tr><tr><td>Search Console y Tag Manager</td><td>Tú como propietario. Nosotros, como usuarios.</td><td data-e="search">Por comprobar.</td></tr><tr><td>Ficha de Google (Maps)</td><td>Tú como propietario. Nosotros, como administradores invitados.</td><td data-e="ficha">Por comprobar.</td></tr><tr><td>Web nueva</td><td>En una cuenta a tu nombre, o con copia completa para ti.</td><td data-e="web">Ahora es solo una demostración privada y no está publicada. Lo dejaremos hecho antes de publicarla.</td></tr></tbody></table><p style="margin:10px 0 0;font-size:16px"><b>Si algo de esto no te cuadra, dínoslo.</b> Cuanto más claro lo tengas tú, mejor trabajamos nosotros.</p></div>'
            '<p style="margin:12px 0 0;font-size:17px;background:#FFF6DD;border-radius:8px;padding:14px 16px">Esto es lo que hemos preparado: úsalo si te sirve, y si no, no cambia nada.</p>'
            '<p style="margin:14px 0 0;font-size:16px"><b>Cuando termines:</b> contesta las <a href="#s24">preguntas del final</a>, o cuéntanos qué te ha parecido con los botones que hay al pie de cada parte.</p></div>')
    _vis = '<div class="vis"><style>.vis{margin:26px 0;border:2px solid #12202B;border-radius:18px;padding:20px 18px;background:#FFFDF8}.vis h2{margin:0 0 6px!important;border:0!important;padding:0!important}.vis h3{margin:22px 0 8px;font-size:19px}.vis-t{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}.vis-t>div{background:#fff;border:1px solid #DCE2E7;border-top:5px solid var(--c);border-radius:12px;padding:12px}.vis-t strong{display:block;font-size:30px;line-height:1.1;color:var(--c)}.vis-t em{display:block;font-style:normal;font-weight:700;font-size:15px;margin:3px 0}.vis-t span{font-size:14px;color:#4A5A68;line-height:1.35}.vis-r{display:flex;flex-wrap:wrap;gap:14px;align-items:center;background:#fff;border:1px solid #DCE2E7;border-radius:12px;padding:12px 14px}.vis-r .st{font-size:26px;letter-spacing:2px;color:#F59E0B;line-height:1}.vis-r .rt b{font-size:30px}.vis-l{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}.vis-l>div{display:grid;justify-items:center;text-align:center;gap:5px;background:#fff;border:1px solid #DCE2E7;border-radius:12px;padding:12px 8px}.vis-l img{width:40px;height:40px;object-fit:contain}.vis-l b{font-size:15px}.vis-l span{font-size:13px;color:#4A5A68;line-height:1.35}.vis-3{display:grid;gap:8px}.vis-3>div{background:#EAF5EE;border-radius:12px;padding:12px 14px;font-size:16px}@media(max-width:420px){.vis-t{grid-template-columns:1fr 1fr}.vis-l{grid-template-columns:1fr 1fr}.vis-t strong{font-size:26px}}</style><h2 id="sinrollo">La guía sin rollo: todo en 2 minutos y con dibujos</h2><p style="margin:0 0 6px;font-size:17px">Sabemos que la guía es larga. Esto es lo mismo, pero <b>de un vistazo</b>. Si algo te llama la atención, tocas y vas al detalle. Sin examen.</p><h3>Cinco números que lo cuentan todo</h3><div class="vis-t"><div style="--c:#B45309"><strong>230</strong><em>visitas al mes desde Google</em><span>Una tienda con la persiana a medio bajar (estimación de Semrush).</span></div><div style="--c:#B45309"><strong>3 de 5</strong><em>reseñas de una estrella</em><span>No dicen que el trabajo sea malo: dicen que nadie les contestó.</span></div><div style="--c:#2E8B57"><strong>56 → 94</strong><em>velocidad en móvil</em><span>Web de hoy frente a la nueva. De caracol a liebre.</span></div><div style="--c:#B45309"><strong>11</strong><em>anuncios, todos de «barato»</em><span>Y ninguno habla de quién eres ni de tu zona.</span></div><div style="--c:#B45309"><strong>0</strong><em>informes de tus campañas</em><span>Sin informe vamos a ciegas. Por eso lo pedimos.</span></div></div><h3>Tu reputación: lo difícil ya lo tienes</h3><div class="vis-r"><div class="rt"><div class="st" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9734;</div><b>4,5</b></div><div style="font-size:15px;line-height:1.4"><b>44 reseñas en Google.</b> La gente que os conoce os quiere. Lo único que baja la nota: 3 de las 5 reseñas de una estrella son de gente a la que <b>no se contestó a tiempo</b>. Eso se arregla con una costumbre, no con dinero.</div></div><h3>Las herramientas, en una frase cada una</h3><div class="vis-l"><div><img src="/img/gl-gbp.png" alt="Logotipo de Ficha de Google" width="40" height="40"><b>Ficha de Google</b><span>Tu escaparate en Maps. Ahora, con las luces apagadas: 5 meses sin reseñas nuevas.</span></div><div><img src="/img/gl-analytics.png" alt="Logotipo de Analytics" width="40" height="40"><b>Analytics</b><span>El contador de visitas: cuánta gente entra y por dónde.</span></div><div><img src="/img/gl-searchconsole.png" alt="Logotipo de Search Console" width="40" height="40"><b>Search Console</b><span>Cómo te ve Google: con qué búsquedas sales y en qué puesto.</span></div><div><img src="/img/gl-tagmanager.svg" alt="Logotipo de Tag Manager" width="40" height="40"><b>Tag Manager</b><span>La regleta donde se enchufan Analytics y los anuncios.</span></div><div><img src="/img/gl-ads.png" alt="Logotipo de Google Ads" width="40" height="40"><b>Google Ads</b><span>Los anuncios de arriba. Pagas por clic, no por salir.</span></div><div><img src="/img/gl-semrush.svg" alt="Logotipo de Semrush" width="40" height="40"><b>Semrush</b><span>El espía legal: qué busca la gente y qué hace la competencia.</span></div><div><img src="/img/gl-pagespeed.svg" alt="Logotipo de PageSpeed" width="40" height="40"><b>PageSpeed</b><span>La nota de Google a la velocidad de tu web.</span></div><div><img src="/img/gl-vercel.svg" alt="Logotipo de Vercel" width="40" height="40"><b>Vercel</b><span>Donde vive la web nueva: rápida y segura.</span></div><div><img src="/img/gl-resend.svg" alt="Logotipo de Resend" width="40" height="40"><b>Resend</b><span>El cartero: avisa en cuanto entra una petición.</span></div><div><img src="/img/gl-whatsapp.png" alt="Logotipo de WhatsApp Business" width="40" height="40"><b>WhatsApp Business</b><span>Respuestas rápidas y el mensaje ya escrito.</span></div><div><img src="/img/gl-instagram.png" alt="Logotipo de Instagram" width="40" height="40"><b>Instagram</b><span>Tus obras, en fotos que se ven.</span></div><div><img src="/img/gl-facebook.png" alt="Logotipo de Facebook" width="40" height="40"><b>Facebook</b><span>Tu página, limpia y al día.</span></div><div><img src="/img/gl-x.png" alt="Logotipo de X (Twitter)" width="40" height="40"><b>X (Twitter)</b><span>Parada desde 2018: la dejamos descansar.</span></div></div><h3>Tu parte: tres cosas que no cuestan nada</h3><div class="vis-3"><div><b>1. Contestar el mismo día.</b> Un presupuesto contestado en horas gana a uno mejor contestado en días.</div><div><b>2. Una foto de obra por semana.</b> Para la ficha de Google, Instagram y la web. Con el móvil vale.</div><div><b>3. Pedir reseña al terminar cada obra.</b> Con un enlace y un WhatsApp. Cinco segundos.</div></div><p style="margin:14px 0 0;font-size:16px"><b>Y lo que más nos ayuda ahora:</b> <a href="#s46">contesta las preguntas</a>, aunque sea con «no sé».</p></div>'
    MSG_IG = ('<p>Javi, una cosa clara antes de seguir: <b>no te puedo garantizar resultados</b>. Nadie puede; yo he visto éxitos que no lo fueron y fracasos que acabaron bien.</p>'
      '<p>Lo que sí te digo, por experiencia, es que con este plan, que además <b>con nosotros, por ahora, no te cuesta nada y libera lo que hoy pagas sin resultados</b>, lo normal sería que consiguieras más contactos y más trabajo. Es difícil plantearlo mejor de lo que está.</p>'
      '<p>Los anuncios dan resultados en días o semanas; el posicionamiento natural tarda entre 3 y 12 meses. Lanzarlo o no lo decides tú, cuando quieras. Para afinar las campañas viene bien la información de tu proveedor (Analytics y Google Ads), pero se puede empezar sin ella.</p>'
      '<p><b>Una petición:</b> lee la guía con calma y, si hace falta, varias veces, aunque se te haga pesada. Es larga porque hace falta, y que la entiendas bien es lo más importante de todo. Ojalá tengamos tanto trabajo que haya que rechazar clientes, pero una cosa es lo bonito que se ve en el papel y otra conseguirlos en la realidad, y cuesta. Aunque la web y todo esto te parezca mucho, es la mejor manera de asegurarte el trabajo.</p>'
      '<p style="margin:0">Un abrazo, Ignacio.</p>')
    ULT_FECHA = "27 de octubre de 2026"
    ULT_QUE = 'Lo nuevo de hoy: tu <a href="/guia-javi/lupa"><b>lupa de demostración</b></a>, para ver en tu web dónde toca la gente, hasta dónde baja y dónde se va (así la mejoramos con datos y no a ojo), y <b>tus tarifas ya metidas en la calculadora</b>, con precios reales. Sigues teniendo <a href="#pendientes"><b>preguntas pendientes</b></a> que solo puedes contestar tú, y <a href="#control"><b>tuyo es el control</b></a>, siempre.'
    PREG = '<div id="preg" style="margin:12px 0 14px;background:#E6F4EC;border:2px solid #8CC9A5;border-radius:12px;padding:14px 16px"><p style="margin:0;font-size:15px"><b>Recibidas tus siete respuestas, gracias.</b> Las tienes contestadas abajo, en «Tus respuestas a las siete preguntas». Si quieres añadir algo, usa el cuadro de dudas de cualquier sección.</p></div>'
    _dudas = ('<div id="pendientes" style="scroll-margin-top:170px;margin:0 0 16px;background:#FFF6DD;border:2px solid #E8C04A;border-radius:12px;padding:16px 18px">'
      '<h2 style="margin:0 0 6px;border:0;padding:0;font-size:21px">Tienes preguntas pendientes de contestar, Javi</h2>'
      '<p style="margin:0 0 10px;font-size:15px;color:#33495C">Esto es lo único que nos falta de tu parte. Empieza por las tres primeras; el resto, cuando puedas. No hace falta contestar todo hoy ni en orden: puedes responder por WhatsApp, por audio o usando el cuadro de «Tengo una duda» de cualquier sección. Cuando una esté resuelta, la tacharemos aquí.</p>'
      '<h3 style="margin:14px 0 6px;font-size:17px;color:#9A3412">Primero estas tres (unos 2 minutos, por audio vale)</h3><ol start="1" style="margin:0 0 6px;padding-left:22px;font-size:16px;line-height:1.5"><li data-p="1" style="margin:0 0 9px"><b>Ventana sin cajón de persiana.</b> Tus precios incluyen el cajón. Si el cliente no quiere persiana, o ya tiene el cajón y no hay que cambiarlo, ¿cuánto menos cuesta la misma ventana?</li><li data-p="2" style="margin:0 0 9px"><b>El IVA.</b> ¿Los precios de las tablas llevan el IVA incluido? ¿Y los del montaje y los de las cancelas?</li><li data-p="3" style="margin:0 0 9px"><b>Fotos de cancelas.</b> Sí: de cuatro a cinco de cada modelo, cuantas más mejor. Por WhatsApp al 639 78 82 20; si pesan mucho, te pasamos un enlace.</li></ol><h3 style="margin:16px 0 6px;font-size:17px;color:#33495C">Cuando puedas</h3><ol start="4" style="margin:0 0 6px;padding-left:22px;font-size:16px;line-height:1.5"><li data-p="4" style="margin:0 0 9px"><b>Ventanas de aluminio y correderas.</b> Una tarifa como la de PVC, o precios por medidas. Hoy ahí usamos una fórmula provisional nuestra.</li><li data-p="5" style="margin:0 0 9px"><b>Extras y medidas.</b> Precio del vidrio acústico o de seguridad, mosquitera y motor de persiana; y qué haces con medidas mayores que las de tus tablas. ¿Aplicas descuento si son más de tres ventanas?</li><li data-p="6" style="margin:0 0 9px"><b>Cancelas.</b> ¿Los 400 euros el metro cuadrado valen para los siete modelos? ¿Cuánto cuesta el motor?</li><li data-p="7" style="margin:0 0 9px"><b>Tu garantía.</b> En la web ponemos «mínimo 2 años de garantía». ¿Es correcto? Si das más (por ejemplo en cancelas o motores), dinos cuánto y en qué.</li><li data-p="8" style="margin:0 0 9px"><b>Las fotos de tus trabajos.</b> En la <a href="/fotos-web-antigua">página de fotos</a>, marca cada una como Usar, Quizá o No, y pulsa enviar al final.</li><li data-p="9" style="margin:0 0 9px"><b>Instagram.</b> ¿La cuenta que ya tenéis es de la empresa o es personal? Dinos el nombre de usuario.</li><li data-p="10" style="margin:0 0 9px"><b>Financiación con Cetelem.</b> ¿Cuál de las tres formas te encaja: ofrecerla con intereses y que el cliente vea su cuota, absorber parte del coste, o no ofrecerla de momento?</li><li data-p="11" style="margin:0 0 9px"><b>Tu cuenta de Vercel.</b> Cuando puedas, crea tu cuenta gratuita con el correo de la empresa (te guiamos paso a paso) y así la web queda a tu nombre.</li><li data-p="12" style="margin:0 0 9px"><b>Datos que aún no están confirmados.</b> ¿Cuál es el plazo habitual de fabricación y hasta dónde sirves (zonas)?</li></ol><div id="est-nv" style="display:none"><h3 style="margin:16px 0 6px;font-size:17px;color:#9A3412">Preguntas nuevas</h3><ol id="est-nl" style="margin:0 0 6px;padding-left:22px;font-size:16px;line-height:1.5"></ol></div><p style="margin:12px 0 0;font-size:14px;color:#33495C"><b>Ya contestadas, gracias:</b> tu tarifa (recibida), el correo de la empresa (está en tu alojamiento actual; lo movemos nosotros) y las reseñas. Y las de ayer: el cajón de persiana, si los precios son de venta, la marca del aluminio (solo Alugom), el dominio cancelasdealuminio.com, la foto de la puerta marrón y los accesos (hoy se los vuelves a pedir a quien lleva tu web). Abajo, lo que hacemos con cada una.</p></div>'
      '<div id="dudas" style="margin:12px 0 0;background:#EAF2FB;border:1px solid #B9D2EC;border-radius:12px;padding:16px 18px">'
      '<h2 style="margin:0 0 6px;border:0;padding:0;font-size:21px">Respuestas a tus dudas</h2>'
      '<p style="margin:0 0 12px;font-size:15px;color:#33495C">Has marcado «Tengo una duda» en la sección 6 (competidores), en la 12 (direcciones de la web nueva) y en la 27 (comparación con otras 25 webs), pero no sabemos cuál es exactamente. Respondemos a las que suelen surgir. Si la tuya es otra, escríbela en el cuadro que sale al pulsar «Tengo una duda» y la contestamos aquí mismo.</p>'
      + PREG +
      '<p style="margin:14px 0 2px;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#C2410C"><b>Nuevo · Hoy, 26 de octubre · Tus respuestas, tu informe de Google Ads y tu CRM</b></p><p style="margin:10px 0 2px"><b>Lo que nos contestaste ayer y qué hacemos con ello</b></p><p style="margin:0">Gracias, Javi, claro y rápido. Esto es lo que nos quedamos:</p><p style="margin:6px 0 0">• <b>El cajón de persiana.</b> Entendido: el precio de tu tabla lleva el cajón, pero la altura de la tabla es la de la ventana sin él. Si un cliente nos dice la medida total (por ejemplo 1.400 mm de alto), restamos el cajón (16,5 cm) y buscamos 1.235 mm, subiendo siempre a la casilla superior, como dicen tus notas. Cuando el cajón sea antiguo y grande (hasta 40 cm en los de madera), se mide en la visita.<br>• <b>Los precios.</b> Son de venta (PVP) y llevan unos 60 € por unidad por los despuntes. La calculadora los dará siempre como <b>precio aproximado</b>, avisando de que el real depende de las medidas, los herrajes y la dificultad. Por ahora cubren ventanas de PVC de dos hojas oscilobatientes, en blanco y en gris 7016. Lo demás sigue con nuestra fórmula provisional hasta que nos mandes más tarifas. Las tuyas ya las tenemos preparadas y las estamos comprobando antes de activarlas; te avisamos en cuanto estén en marcha.<br>• <b>Aluminio.</b> Solo trabajas con Alugom: quitamos Cortizo y Technal de las ventanas de aluminio y de la portada.<br>• <b>El dominio cancelasdealuminio.com.</b> Perfecto: es tuyo y está en DonDominio, así que no hay que comprar nada. Cuando la página de cancelas esté terminada, lo apuntamos a ella y te guiamos paso a paso.<br>• <b>Las fotos.</b> La de la puerta marrón es vuestra: ya la usamos. De las cancelas, sí: de cuatro a cinco de cada modelo, por WhatsApp.<br>• <b>Los accesos.</b> Bien, hoy se los vuelves a pedir a quien lleva tu web. Pídele solo los accesos, los informes y la factura de Google Ads, y los datos de conversiones.</p><p style="margin:12px 0 2px"><b>Tu informe de Google Ads, explicado fácil</b></p><p style="margin:0">Recibido, gracias. Es del 1 al 26 de octubre y dice, en cristiano:</p><p style="margin:6px 0 0">• Se han gastado <b>420 €</b> en anuncios. Se han visto 1.460 veces y <b>169 personas</b> han pinchado. Cada clic ha costado unos 2,50 €.<br>• <b>Ocho de cada diez euros</b> (el 77 %) se han gastado en clics desde el móvil, y quien más los ve son hombres de 45 a 65 años o más. Por eso la web nueva está pensada primero para el móvil, con botones grandes y textos fáciles de leer.<br>• Parte del dinero se ha ido en búsquedas que no te traen clientes, como «leroy merlin», «cortizo» o «aislamiento térmico». Se evita con una lista de palabras prohibidas (palabras negativas).<br>• Los anuncios de cancelas casi no se han usado. Las pocas veces que se han visto han funcionado bien, pero son solo 4 clics: es buena señal, no una conclusión.<br>• La mayoría de las visitas llegan de lunes a viernes, de 12 a 18 h.</p><p style="margin:8px 0 0"><b>Lo que falta:</b> el informe no dice cuántas de esas 169 personas llamaron o pidieron presupuesto (las conversiones). Sin ese dato no se puede saber si los 420 € han funcionado, y es lo primero que necesitamos ver. Y hay dos cosas que se pueden hacer mejor: <b>a dónde llevan los anuncios</b> (si alguien pincha y llega a una página lenta en el móvil, o que no deja claro qué hacer, se va) y <b>a dónde va el dinero</b> (según el propio informe, la gestión es el 30 % de lo que se invierte: si pagas 130 €, 100 son anuncios y 30 son gestión).</p><p style="margin:8px 0 0"><b>Lo que te proponemos:</b> montar nosotros las campañas. Tú pagas directamente a Google con tu tarjeta y todo lo que inviertes va entero a anuncios, sin ninguna comisión por nuestra parte; con el mismo dinero, un 30 % más de anuncios. Y tienes siempre el control de la cuenta. No cambies nada hasta tener los accesos y los datos.</p><p style="margin:12px 0 2px"><b>Tu CRM de demostración: <a href="/guia-javi/crm">ábrelo aquí</a></b></p><p style="margin:0">Un CRM es donde apuntas a cada persona que te pide presupuesto y ves en qué punto está, hasta que se instala. Sirve para <b>no perder ningún cliente por olvido</b> y para saber <b>de dónde vienen los que compran</b> y cuánto cuesta cada uno. El de la demostración tiene datos inventados, pero funciona: prueba a mover un cliente de fase, a pulsar «Escríbeme el mensaje» o a añadir uno nuevo.</p><p style="margin:6px 0 0">• <b>Tu día:</b> al entrar ves qué toca hoy: a quién llamar, qué seguimientos están vencidos (en rojo), las visitas de la semana y las instalaciones que piden atención.<br>• <b>Cada cliente lleva su siguiente paso con fecha</b>, y un botón prepara el WhatsApp de seguimiento. Tú lo lees, lo cambias y lo envías; nada se manda solo.<br>• <b>Informe de visita</b> antes de pasar a presupuesto, y <b>motivo</b> cuando un trabajo no sale (aplazado, no firmó, descartado), para aprender de por qué se pierde.<br>• <b>Entras por internet</b>, con tu correo, tu contraseña y un código que te llega al correo. Nadie más entra sin tu visto bueno, y cada persona ve solo lo suyo.<br>• <b>Se actualiza cada día:</b> lo que llega por la web, el chat y la calculadora entra solo y al momento; los datos de anuncios, cada mañana. Y cada domingo se guarda una copia de seguridad.<br>• Está conectado a tu <a href="/guia-javi/panel">panel de control</a>. Es opcional: no se monta nada sin tu sí.</p>'
      '<p style="margin:14px 0 2px;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#C2410C"><b>Nuevo · Hoy, 24 de octubre · Reseñas y la agencia de anuncios</b></p>'
      '<p style="margin:10px 0 2px"><b>«Prefiero pedir las reseñas yo mismo» (sección 48)</b></p>'
      '<p style="margin:0">Tienes razón en lo importante: <b>nada se manda solo</b>. El WhatsApp lo envías tú, cliente por cliente y cuando tú decides; solo te ahorra escribirlo y que el cliente tenga el enlace directo. Pedirlo en persona, quien se ha ganado su confianza, es lo mejor, y el mensaje es solo el recordatorio para que no tenga que buscar la ficha. Y el caso de la puerta de garaje lo demuestra: hay cosas que no dependen de ti, y por eso conviene llamar al cliente antes de que se enfade.</p>'
      '<p style="margin:8px 0 0">Un matiz importante: <b>pedir la reseña solo a los clientes que han quedado contentos no está permitido por Google</b> (lo llaman «filtrar reseñas»). Si lo detecta, puede quitar reseñas o castigar la ficha. Lo que sí funciona y sí se puede: <b>1)</b> al terminar, preguntar a todos «¿todo bien?»; <b>2)</b> si algo ha ido mal, arreglarlo primero, que muchas veces cambia la opinión; <b>3)</b> mandar el enlace a todos, sin condicionarlo a lo que respondan. Y si aun así llega una mala por algo que no fue tuyo, como el panel del proveedor, <b>se contesta con calma y se cuenta lo ocurrido</b>: quien la lee valora más cómo respondes que la estrella.</p>'
      '<p style="margin:8px 0 0">Propuesta: tú sigues pidiéndolo a tu manera; nosotros te preparamos las respuestas a las reseñas, que tú apruebas, y el WhatsApp queda como un toque más cuando tú quieras.</p>'
      '<p style="margin:12px 0 2px"><b>«Ya le he pedido el informe de Google Ads» (sección 49)</b></p>'
      '<p style="margin:0">Bien hecho. Un consejo sobre el orden, para que no te quedes sin contactos ni un día: <b>1)</b> espera a tener el informe antes de decirle nada más. <b>2)</b> Antes de decirle que dejas de trabajar con él, <b>pregúntale con normalidad a nombre de quién está la cuenta de Google Ads</b>. Si está a nombre de AMS, es tuya y puedes dar acceso a quien quieras. Si está a nombre de la agencia, el historial de campañas se queda con ella, y conviene saberlo ya. <b>3)</b> Mira si hay <b>permanencia o aviso previo</b> en lo que firmaste; Ignacio, que es licenciado en Derecho, te lo revisa sin coste. <b>4)</b> <b>No pares los anuncios</b> hasta que las campañas estén montadas por nosotros. <b>5)</b> Pide los accesos con tono cordial: administrador de Google Ads, Analytics, Tag Manager y Search Console, más la lista de campañas, palabras clave y facturas. Si te contesta con evasivas, cuéntanoslo y lo miramos juntos.</p>'
      '<p style="margin:8px 0 0">Y si lo que no veías claro del mensaje era el texto, dinos qué cambiarías y lo reescribimos.</p>'
      '<p style="margin:12px 0 2px"><b>«El lunes le escribo a quien me lleva la web y le pido todos los accesos» (sección 50)</b></p>'
      '<p style="margin:0">Perfecto, y no hace falta tener prisa: con lo que te conteste nos basta. Para que te lo ponga fácil, pídele <b>«acceso de administrador»</b> (no solo «un usuario») a: <b>1)</b> el dominio, que debe figurar a nombre de AMS; <b>2)</b> el alojamiento o servidor de la web; <b>3)</b> el panel de la web actual y una copia de seguridad; <b>4)</b> Google Analytics, Tag Manager y Search Console, si los hay; <b>5)</b> Google Ads, si la cuenta la lleva él. Dos cosas que ayudan: si el dominio está a su nombre y no al tuyo, pídele que lo ponga al tuyo, que es lo importante; y <b>no hace falta que nos pases contraseñas</b>: en cada herramienta se puede invitar a otra persona con un correo, y te explicamos cómo, paso a paso, cuando lo tengas. Si te manda contraseñas, guárdalas tú y no las reenvíes por WhatsApp.</p>'
      '<p style="margin:12px 0 2px"><b>Tu correo del sábado: ventanas y cancelas, precios, fotos y reseñas antiguas</b></p>'
      '<p style="margin:0">Recibido todo, incluidas las dos facturas. Respondemos por partes:</p>'
      '<p style="margin:6px 0 0">• <b>Prioridad: ventanas y cancelas de aluminio soldado, antes que los cerramientos.</b> Entendido y nos viene bien saberlo: pondremos primero ventanas y cancelas en la web, en los anuncios y en las fotos. Los cerramientos de terraza se quedan, pero en segundo plano.<br>• <b>Reseñas antiguas:</b> mejor contestarlas <b>ya</b> que más adelante, porque cada día sin respuesta pesa. No hace falta pedir disculpas si no fue culpa vuestra: una respuesta cordial, breve y con la versión de lo ocurrido. Te las dejamos escritas, una a una, para que las apruebes o las cambies; no se publica ninguna sin tu visto bueno.<br>• <b>Precios:</b> la matriz de ventanas de PVC por medidas cada 10 cm, en blanco y en otro color, nos sirve perfectamente: una tabla de Excel con el alto en las filas y el ancho en las columnas. Para color, con una columna de «recargo» por color vale. Para terrazas, bien: se queda como «presupuesto a medida», pidiendo medidas y fotos, sin dar precio. El montaje (250 € por ventana) y las cancelas de aluminio soldado (400 € el metro cuadrado) los cargamos en cuanto nos digas si son con o sin IVA.<br>• <b>Fotos que pesan:</b> lo más fácil es enviarlas por WhatsApp como <b>«documento»</b> (se mantiene la calidad), o te creamos una carpeta compartida y te pasamos el enlace para que las subas desde el móvil. Dinos cuál prefieres.<br>• <b>Mensajes de la web:</b> «fabricamos e instalamos lo nuestro, de principio a fin, presupuesto en 24 a 48 horas y garantía por escrito» es justo lo que hay que decir. Lo ponemos tal cual, si nos confirmas que la garantía por escrito es para todo.</p>'
      '<p style="margin:8px 0 0"><b>Antes del lunes, mira esto de las facturas (importante):</b><br>• <b>Permanencia del SEO.</b> Según nos cuentas, son 250 € + IVA al mes desde abril y no firmasteis contrato: solo hablasteis por WhatsApp. Eso nos viene bien: sin documento firmado, lo de «12 meses» de la factura es mucho más fácil de discutir. Ignacio, que es licenciado en Derecho, te lo revisa sin coste y te dice cómo plantearlo. Guarda esa conversación de WhatsApp (precio y qué iba a hacer) y no la borres. Puedes llamarle el lunes para pedirle los datos y los accesos sin hablar todavía de dejarlo.<br>• <b>El correo está en ese alojamiento.</b> La factura incluye el mantenimiento del servidor de correo de amscerramientos.es. Si se da de baja el alojamiento sin más, se pierde el correo. Primero lo movemos nosotros a un servicio aparte, y después se da de baja.<br>• <b>Otro dominio.</b> iluminaciondenavidad.com es de vuestra otra empresa de iluminación navideña, no de AMS. Lo hablamos aparte: puede quedarse donde está o pasarlo a un alojamiento más barato, pero es decisión tuya y no hay prisa.<br>• Hemos corregido arriba, en <a href="#s53">la parte de costes</a>, lo que pagas hoy con los importes reales de tus facturas.</p>'
      '<p style="margin:12px 0 2px"><b>Tus respuestas del cuestionario, de hoy (24 de octubre)</b></p>'
      '<p style="margin:0">Gracias por contestarlas. Lo que nos quedamos:</p>'
      '<p style="margin:6px 0 0">• <b>Dominio:</b> en DonDominio y con tus claves: perfecto, no hay que mover nada y el control es tuyo. Hemos corregido en la guía que antes lo dábamos por supuesto en otro proveedor. El correo, dinos dónde lo tienes (puede ser el mismo sitio u otro).<br>• <b>Presupuestos:</b> unos 15 pedidos y 3 cerrados es cerca de uno de cada cinco, una buena proporción. Con más peticiones y esa misma proporción, saldrían más obras.<br>• <b>Google Ads:</b> entre 500 y 700 € con IVA y comisión incluidos (nos lo has confirmado por WhatsApp), y lo lleva quien te hace la web. Lo tomamos como referencia, y con la factura lo vemos exacto.<br>• <b>Analytics y Search Console («no sé»):</b> no te preocupes: cuando tu proveedor te pase los accesos lo comprobamos nosotros.<br>• <b>Instagram:</b> usaremos la cuenta que ya tenéis; no hace falta crear otra. Solo necesitaremos que nos des acceso.<br>• <b>Vídeos:</b> solo de obras, sin salir tú: así se hace. <b>Tarifa de precios:</b> la hablamos cuando quieras, por teléfono o por audio. <b>Financiación:</b> tienes la respuesta más arriba.<br>• <b>Fotos web antigua:</b> si aún no te deja marcarlas, dínoslo en un audio y lo miramos.</p>'
      '<p style="margin:12px 0 2px"><b>Tus respuestas a las siete preguntas (24 de octubre)</b></p>'
      '<p style="margin:0">Gracias, Javi. Esto aclara mucho. Lo que nos quedamos:</p>'
      '<p style="margin:6px 0 0">• <b>De dónde vienen los 15 presupuestos:</b> 5 clientes nuevos, 4 por recomendación, 2 por buzoneo y 4 por la web. Es un dato muy útil: la web ya te trae algo y las recomendaciones pesan mucho, por eso las reseñas importan tanto.<br>• <b>SEO:</b> 250 € + IVA al mes desde abril, sin contrato firmado. Queda confirmado que es mensual y lo hemos corregido en los costes. Ignacio revisa lo de la permanencia (ver arriba).<br>• <b>Correo:</b> está en el servidor de Blázquez Bros, el mismo del alojamiento. Lo movemos nosotros antes de darlo de baja, sin perder ni un correo.<br>• <b>Hosting:</b> la factura cubre dos webs, amscerramientos.es y iluminaciondenavidad.com.<br>• <b>Experiencia:</b> empezaste con el aluminio y el hierro en el año 2000 y AMS se constituyó en 2011. Así que «más de 20 años de experiencia» es correcto. Lo que no pondremos es «empresa fundada hace más de 20 años».<br>• <b>Campañas:</b> Google, Facebook e Instagram, las que te aconsejemos. Tomamos nota: empezaremos por Google, que es donde ya hay gente buscando.<br>• <b>Iluminación de Navidad:</b> entendido, tienes 4 clientes en centros comerciales. No tocamos nada de eso, es otra empresa.</p>'
      '<p style="margin:12px 0 2px"><b>Sección 51 (tus anuncios bajo la lupa): Vidrio Cristal, tus competidores reales y Google Ads</b></p>'
      '<p style="margin:0">Gracias, esto nos ayuda mucho. Tres cosas:</p>'
      '<p style="margin:6px 0 0"><b>1) Vidrio Cristal.</b> Entendido: es un fabricante grande que vende sobre todo a profesionales, no a quien quiere cambiar sus ventanas. Que salga en las mismas búsquedas no significa que te quite clientes; en lo que sí pesa es en lo que cuesta cada clic. Lo tendremos en cuenta y no lo trataremos como competidor directo.</p>'
      '<p style="margin:6px 0 0"><b>2) Tus competidores de verdad.</b> Apuntamos los que nos dices para Alcalá y alrededores: Julio Fernández, Aluminios Alcalá, Aluminios Meco, Aluminio Rubio, Allupa, Alcalá Ventanas y Hermanos Orozco. Los vamos a mirar uno a uno: qué ofrecen, cómo se presentan, qué reseñas tienen y en qué búsquedas salen. Y para las <b>cancelas de aluminio soldado</b>, que quieres que sean tu producto estrella, tomamos como referencia a Industrias Marver. Una vez lo hayamos estudiado, proponemos una página y una campaña pensadas solo para cancelas, con fotos y ejemplos de vuestros trabajos.</p>'
      '<p style="margin:6px 0 0"><b>3) Google Ads.</b> Si hoy lo paga el informático y te pasa la factura, lo normal es que la cuenta de anuncios esté a su nombre. Eso da más motivos para lo que te contábamos arriba: pídele, con tranquilidad, la factura de los últimos meses (para ver cuánto es de Google y cuánto es de gestión) y a nombre de quién está la cuenta. Si no está a nombre de AMS, lo más limpio es <b>abrir una cuenta nueva a nombre de AMS</b>, con tu tarjeta, para que el dinero vaya directo a Google y tú lo veas todo. Y sí: <b>lo gestionamos nosotros</b>, tú no tienes que tocar nada de Google. Nosotros no cobramos por ello; lo único que pagas es lo que se gasta en anuncios.</p>'
      '<p style="margin:16px 0 2px;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#C2410C"><b>Nuevo · Tus respuestas al cuestionario</b></p>'
      '<p style="margin:10px 0 2px"><b>«No puedo marcar en las fotos»</b></p>'
      '<p style="margin:0">Tenías razón: estaba fallando y no dejaba pulsar ningún botón. Ya está arreglado: en la <a href="/fotos-web-antigua">página de fotos</a> puedes marcar cada una como Usar, Quizá o No, y al final enviarnos la lista. Perdona la molestia y gracias por avisar.</p>'
      '<p style="margin:12px 0 2px"><b>Financiación con intereses (Cetelem): «queremos repercutírselo al cliente y no sabemos cómo»</b></p>'
      '<p style="margin:0">Gracias por contarlo con claridad: quitamos de la web lo de «sin intereses». Hay tres formas de plantearlo, de más a menos recomendable: <b>1)</b> ofrecer «financiación disponible con Cetelem, con intereses y sujeta a aprobación» y mostrar al cliente la cuota real; no cuesta nada a AMS y es lo más transparente. <b>2)</b> Absorber parte del coste y decirlo («te financiamos y nos hacemos cargo de parte de los intereses») para ganar presupuestos. <b>3)</b> Incluir el coste dentro del precio. La opción 1 es la que mejor encaja con la transparencia. Los datos exactos (cuota, TAE) los da Cetelem. Lo hablamos cuando quieras.</p>'
      '<p style="margin:12px 0 2px"><b>Tarifa de precios («prefiero hablarlo»)</b></p>'
      '<p style="margin:0">Perfecto, sin problema: lo hablamos por teléfono o por audio cuando quieras. Y que quede claro: <b>tu tarifa es sagrada y solo la conocerás tú</b>. No te pedimos tu margen ni tus costes, solo el precio final que cobras al cliente, y solo para que la calculadora dé una cifra orientativa. Se puede programar como quieras: un rango en vez de un precio exacto, un pequeño margen de desviación para que nunca coincida con tu tarifa real, o «desde X €». Siempre se muestra como «precio orientativo, el presupuesto final lo confirma AMS». Los precios que ves ahora en la web son provisionales y no se publica ninguno sin que tú lo revises.</p>'
      '<p style="margin:12px 0 2px"><b>Instagram: «ya tenemos una cuenta, no sé si valdría»</b></p>'
      '<p style="margin:0">Vale, y es mejor aprovecharla que abrir otra: ya tiene nombre y seguidores. La revisamos contigo, la dejamos con foto, descripción y enlace a la web nueva, y desde ahí vamos publicando tus obras. Solo haría falta una cuenta nueva si la actual fuera personal y no de la empresa.</p>'
      '<p style="margin:12px 0 2px"><b>Alojar la web en tu propia cuenta de Vercel</b></p>'
      '<p style="margin:0">Buena elección: así la web es tuya y no depende de nadie. Vercel tiene un plan gratuito y la cuenta la creas tú con tu correo; nosotros te guiamos paso a paso y dejamos la web montada en ella. El dominio amscerramientos.es se queda en DonDominio, con tus claves, y solo hay que apuntarlo a la web nueva cuando todo esté revisado.</p>'
      '<p style="margin:14px 0 2px;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#1D6FB8"><b>Sección 6 · Competidores</b></p>'
      '<p style="margin:10px 0 2px"><b>¿De dónde sale lo que se cuenta de los competidores?</b></p>'
      '<p style="margin:0">De páginas públicas: la web de cada empresa, Habitissimo, la lista oficial de Kömmerling y la herramienta de Google PageSpeed. No hay nada privado. Se ve cuántas reseñas, fotos y herramientas tiene cada una, pero no cuántas obras hacen.</p>'
      '<p style="margin:12px 0 2px"><b>¿Quiere decir que ellos trabajan más que vosotros?</b></p>'
      '<p style="margin:0">No. Solo que se ven más. Que una empresa tenga 774 opiniones en un portal no dice cuánto factura. Y vosotros tenéis una nota de 4,5, mejor que la de esa empresa.</p>'
      '<p style="margin:12px 0 2px"><b>¿Hay que copiar todo lo que hacen?</b></p>'
      '<p style="margin:0">No. Lo que se señala como copiable es lo que no cuesta dinero: fotos de obras, reseñas, contestar rápido. Lo demás, como la financiación sin intereses, solo tendría sentido si podéis ofrecerlo de verdad. Si no, no se anuncia.</p>'
      '<p style="margin:12px 0 2px"><b>¿Guadalajara tiene menos competencia?</b></p>'
      '<p style="margin:0">En Habitissimo hay 12 profesionales de carpintería de aluminio en toda la provincia, frente a 159 solo en Alcalá. No significa que haya más trabajo, solo que hay menos empresas haciéndose notar en ese portal.</p>'
      '<p style="margin:16px 0 2px;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#1D6FB8"><b>Sección 12 · Direcciones de la web nueva</b></p>'
      '<p style="margin:6px 0 2px"><b>¿Por qué las direcciones son tan raras?</b></p>'
      '<p style="margin:0">Porque la web nueva está en una dirección de prueba (ams-cerramientos-ejemplo.vercel.app), solo para que puedas verla. Cuando se publique, pasaría a vuestro dominio, amscerramientos.es, con las mismas páginas.</p>'
      '<p style="margin:12px 0 2px"><b>¿Se pierde algo de lo que hay en la web actual?</b></p>'
      '<p style="margin:0">No. Las 36 direcciones antiguas pasarían a las nuevas automáticamente, para que Google y quien tenga guardado un enlace sigan llegando. Y es reversible: si algo no te convence, se vuelve a apuntar el dominio a la web antigua y todo queda como estaba.</p>'
      '<p style="margin:12px 0 2px"><b>¿Todo lo que pone en esas páginas es definitivo?</b></p>'
      '<p style="margin:0">No. Es un ejemplo con textos, fotos y datos provisionales. Antes de publicar se revisaría contigo página por página: precios, plazos, garantía, financiación y cualquier cosa que no sea como vosotros trabajáis. Lo que no encaje, se cambia o se quita.</p>'
      '<p style="margin:12px 0 2px"><b>¿Por qué no está la tienda de mamparas?</b></p>'
      '<p style="margin:0">En la web actual el menú ofrece una «tienda» que parece abandonada, y en el ejemplo la hemos quitado para centrarnos en ventanas, cerramientos y puertas. Si quieres mantenerla, se puede volver a poner.</p>'
      '<p style="margin:16px 0 2px;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#1D6FB8"><b>Sección 27 · Comparación con otras 25 webs</b></p>'
      '<p style="margin:6px 0 2px"><b>¿Cómo sabéis que ninguna web junta tantas herramientas?</b></p>'
      '<p style="margin:0">No lo sabemos seguro. Hemos mirado 25 webs de ventanas y cerramientos (Alcalá, el Corredor, Madrid y tiendas online de toda España) y no hemos visto ninguna que las junte todas. Quedaron una docena sin mirar, así que «no lo hemos visto» no significa «no existe».</p>'
      '<p style="margin:12px 0 2px"><b>¿Qué es eso de «revisa tu presupuesto»?</b></p>'
      '<p style="margin:0">Es una herramienta para que quien ya tiene un presupuesto de otra empresa lo compare con una referencia y con una lista de 10 puntos, y pueda subir una foto o un PDF para que lo mire una persona de AMS. Es una idea, no un compromiso: se decidiría contigo si la queréis ofrecer y con qué límites, para que no os dé trabajo de más.</p>'
      '<p style="margin:12px 0 2px"><b>¿Todo eso funciona ya?</b></p>'
      '<p style="margin:0">En la web de ejemplo se puede probar, pero con precios y datos provisionales. Antes de publicar se probaría todo en un navegador real y se ajustaría a vuestros precios y a lo que de verdad ofrecéis.</p>'
      '<p style="margin:12px 0 2px"><b>¿Entonces la competencia no hace nada mejor?</b></p>'
      '<p style="margin:0">Sí hacen cosas mejor. Donde van por delante: precios orientativos publicados, cita online y financiación explícita. En reseñas no vais por detrás.</p>'
      '<p style="margin:16px 0 2px;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#1D6FB8"><b>Velocidad</b></p>'
      '<p style="margin:12px 0 2px"><b>¿Y las notas de velocidad de las otras webs?</b></p>'
      '<p style="margin:0">Están en la <a href="#s33">sección de velocidad</a>. La mayoría de webs del sector, incluida la actual, está en naranja; la web nueva sale en verde en casi todo.</p></p>'
      '<p style="margin:12px 0 2px"><b>¿Y si tienes otras dudas?</b></p>'
      '<p style="margin:0">Cualquier cosa, por pequeña que sea, la podemos resolver por correo (<a href="mailto:delarubiaignacio@gmail.com">delarubiaignacio@gmail.com</a>) e ir avanzando. Es la forma más rápida y la que menos trabajo te da. Y cuando quieras, hablamos. Lo que buscamos es que sea lo más sencillo posible, para que puedas dedicarte a lo tuyo, que es hacer unos trabajos estupendos.</p></div>')
    _bus = ('<style>.bsq{position:sticky;top:0;z-index:30;background:#fff;padding:10px 0 8px;margin:0 0 6px}.bsq form{display:flex;gap:8px}'
            '.bsq input{flex:1;min-width:0;font:16px Inter,sans-serif;padding:12px 14px;border:2px solid #C9D3DB;border-radius:10px;background:#fff;color:#12202B}'
            '.bsq input:focus{outline:none;border-color:#C2410C}.bsq button{font:700 15px Inter,sans-serif;padding:0 16px;border:0;border-radius:10px;background:#C2410C;color:#fff;cursor:pointer}'
            '#bsr{display:none;margin-top:8px;max-height:60vh;overflow:auto;border:1px solid #D8E0E6;border-radius:10px;background:#fff;box-shadow:0 8px 24px rgba(18,32,43,.14)}'
            '#bsr a{display:block;padding:11px 14px;border-bottom:1px solid #EDF1F4;color:#12202B;text-decoration:none}#bsr a:hover,#bsr a:focus{background:#FFF3EA}'
            '#bsr b{display:block;font-size:15px}#bsr span{display:block;font-size:13.5px;color:#4A5A68;margin-top:2px}#bsr mark{background:#FFE08A;color:inherit;padding:0 1px;border-radius:2px}#bsr p{margin:0;padding:12px 14px;color:#4A5A68}'
            'h2[id]{scroll-margin-top:86px}::highlight(bsq){background-color:#FFE08A}@media print{.bsq{display:none}}</style>'
            '<div class="bsq"><form role="search" onsubmit="return false"><input id="bsq" type="search" placeholder="Buscar en la guía: por ejemplo, precio, financiación, Google…" aria-label="Buscar en la guía" autocomplete="off"><button type="button" id="bsx" aria-label="Borrar búsqueda">Borrar</button></form><div id="bsr" role="listbox"></div></div>'
            '<a href="#pendientes" style="display:flex;align-items:center;gap:12px;margin:6px 0 10px;padding:14px 16px;background:#FFF1C7;border:2px solid #E8C04A;border-radius:12px;color:#12202B;text-decoration:none;font-weight:700;font-size:17px"><span style="flex:none;width:30px;height:30px;border-radius:50%;background:#C2410C;color:#fff;display:grid;place-items:center">!</span><span>Tienes preguntas pendientes de contestar. Toca aquí para verlas.</span></a>' + '<div class="how" style="border-left:4px solid #1D6FB8;margin-top:6px"><b>Última actualización: <span id="est-f">' + ULT_FECHA + '</span>.</b> ' + ULT_QUE + '</div>' + '<div id="est-n" style="display:none;margin:10px 0 0;background:#E6F4EC;border:2px solid #8CC9A5;border-radius:12px;padding:14px 16px"><b style="font-size:17px">Lo último, al día</b><ul id="est-l" style="margin:8px 0 0;padding-left:20px;font-size:16px;line-height:1.5"></ul></div>' + '<details style="margin:10px 0 0;background:#FFF6DD;border-radius:10px;padding:12px 16px"><summary style="cursor:pointer;font-weight:700">Un mensaje de Ignacio, por si quieres releerlo</summary><div style="margin-top:8px;font-size:16px;line-height:1.5">' + MSG_IG + '</div></details>' + _dudas)
    body = body.replace('<div class="how">', _bus + _emp + _vis + '<div class="how">', 1)

    _items = [
      ("Herramientas que el cliente usa solo", "Calcula su precio, revisa otro presupuesto (incluso subiéndolo), averigua si le compensa cambiar, calcula cuánto ahorraría y qué ayudas hay. En lo que hemos visto, casi ninguna web del sector tiene algo así."),
      ("Pensada para el móvil", "Casi todos los clientes miran desde el móvil: se ve rápida, clara, con fotos y vídeo, y pedir presupuesto es un toque."),
      ("Preparada para Google y para las inteligencias artificiales", "Por dentro está ordenada para que Google la entienda y para que ChatGPT y otras IA puedan citaros cuando alguien pregunte por ventanas o terrazas."),
      ("Con alma", "No habla solo de perfiles y cristales: habla de hogares, de menos frío en invierno y menos calor en verano, de la comida en familia. Eso es lo que se recuerda."),
      ("Confianza a la vista", "Garantía, postventa, taller propio, instaladores oficiales y un mapa con las obras (ahora de ejemplo, luego reales)."),
    ]
    _mejor = ('<div class="mej"><span class="mej-k">Antes de seguir, una cosa importante</span>'
              '<h2 id="mejor" style="margin:6px 0 10px;border:0;padding:0;color:#fff;font-size:clamp(24px,5vw,34px);line-height:1.15">Lo que hemos preparado, contado con sencillez</h2>'
              '<p style="margin:0 0 12px;font-size:18px;color:#E4EAF0">Aquí tienes, en resumen, lo que lleva la web por dentro.</p>'
              '<div class="mej-g">' + ''.join('<div><b>%s</b><span>%s</span></div>' % (t, d) for t, d in _items) + '</div>'
              '<p style=\"margin:14px 0 0;font-size:16px;color:#D3DBE2\"><b style=\"color:#fff\">Lo que importa de esto:</b> una web así reúne varios oficios: diseño, programación, experiencia de usuario, posicionamiento en Google (SEO), redacción y análisis. Para igualarla, un competidor necesitaría reunirlos todos. Es muy probable que nadie en vuestra zona lo tenga, y tú lo tienes a tu disposición. La hemos hecho con herramientas de inteligencia artificial.</p>'
              '<p style="margin:14px 0 0;font-size:16px;color:#D3DBE2"><b style="color:#fff">Con los pies en el suelo:</b> una web así abre muchas puertas, pero no vende sola. Lo que la llena son vuestras costumbres: contestar el mismo día, cuidar la ficha de Google, pedir reseñas y enseñar obras reales. Ahí es donde se nota el trabajo de años. Y empezamos desde cero, así que las posibilidades están todas por delante.</p></div>')
    _OF = [("Diseño gráfico", "Que se vea moderna, clara y con vuestro estilo, en móvil y en ordenador."),
      ("Experiencia de usuario (UX)", "Que el cliente encuentre lo que busca en dos clics y llegue a pedir presupuesto sin perderse."),
      ("Programación web", "Que cargue rápido, funcione en cualquier aparato y esté protegida."),
      ("Herramientas a medida", "Calculadora, configurador, diagnóstico, simulador de ahorro y comprobador de ayudas."),
      ("Redacción", "Textos claros, sin jerga, con el tono de una empresa cercana."),
      ("SEO de la propia web", "Títulos, descripciones, estructura y preguntas frecuentes pensadas para lo que la gente busca."),
      ("SEO técnico", "Datos para Google, mapa de la web, direcciones limpias y redirecciones de las páginas antiguas."),
      ("SEO local", "Zonas, ficha de Google, directorios y opiniones, para aparecer cerca de quien os necesita."),
      ("Contenido y blog", "Artículos que responden a dudas reales y atraen visitas desde Google."),
      ("Fotografía y vídeo", "Selección y tratamiento de imágenes y vídeos de ambiente."),
      ("Análisis y medición", "Saber cuánta gente entra, qué mira y dónde se va, para ir mejorando."),
      ("Estudio de la competencia", "Mirar cómo lo hacen otros para saber dónde sois mejores."),
      ("Textos legales y cookies", "Privacidad, cookies y avisos, que revisa Ignacio, licenciado en Derecho, sin coste."),
      ("Automatización", "WhatsApp con mensajes ya escritos, correos y avisos que trabajan solos."),
      ("Pruebas y control de calidad", "Probarlo todo en móvil, tableta y ordenador, y corregir lo que falle."),
      ("Dirección del proyecto", "Que todo encaje, con un orden y un criterio, y no se pierda por el camino."),
      ("Seguridad y mantenimiento", "Alojamiento, copias y versiones guardadas para volver atrás si algo falla.")]
    _detras = ('<details class="of" open><summary>Lo que haría falta para hacer una web así: 17 oficios distintos</summary>'
                              '<p style="margin:10px 0 6px">Una web que atraiga clientes no es solo una página bonita: reúne varios oficios. Esto es lo que lleva (en esta web se ha tenido en cuenta cada punto; algunos, como los textos legales, están pendientes de revisión final):</p>'
               '<div class="of-g">' + ''.join('<div><b>%s</b><span>%s</span></div>' % (t, d) for t, d in _OF) + '</div>'
               '<p style="margin:14px 0 0;font-size:16px"><b>Y la competencia, ¿qué hace?</b> En las 25 webs que hemos revisado, casi ninguna de las locales reúne todo esto: la mayoría es una página con un formulario y un teléfono, y las que más tienen se quedan en una o dos herramientas. Para igualarla, un competidor necesitaría reunir diseño, experiencia de usuario, programación, SEO, redacción y análisis. Si algún día usas esta web, tendrías una ventaja sobre la competencia. Eso sí, una web es la puerta: el resto lo ponéis vosotros con vuestro trabajo.</p></details>')
    body = body.replace('<div class="how">', _mejor + _detras + '<div class="how">', 1)
    # indice agrupado
    _tit = dict(re.findall(r'<a href="#(s\d+)">([^<]*)</a>', body[body.index('<div class="toc">'):body.index('</div>\n</div>', body.index('<div class="toc">'))+20])) if '<div class="toc">' in body else {}
    if _tit:
        _ix = '<div class="ixg">' + ''.join(
            '<div class="ixc" style="--c:%s"><b><i>%d</i>%s</b>%s</div>' % (c, _k + 1, n, ''.join('<a href="#%s">%s</a>' % (i, re.sub(r'^\d+\.\s*', '', _tit.get(i, i))) for i in ids))
            for _k, (n, c, ids) in enumerate(GRUPOS)) + '</div>'
        _ix = ('<div class="ixw"><h2 id="indice">Índice de la guía</h2><p class="ixs">%d apartados en %d bloques. Empieza por el primero y salta a lo que más te interese; los que ya has visto se marcan en verde.</p>' % (sum(len(g[2]) for g in GRUPOS), len(GRUPOS))) + _ix + '</div>'
        a = body.index('<div class="toc">'); b = body.index('</div>\n</div>', a) + len('</div>\n</div>')
        body = body[:a] + _ix + body[b:]
        body = body.replace('<h2 id="indice">Índice</h2>', '', 1)
    # ---- lateral con progreso (mismo formato que la guia de Jesus) ----
    _ttl = {}
    for _m in re.finditer(r'<h2[^>]*id="(s\d+)"[^>]*>(.*?)</h2>', body, re.S):
        _ttl[_m.group(1)] = re.sub(r'^\d+\.\s*', '', re.sub(r'<[^>]+>|↑ .ndice', '', _m.group(2)).strip())
    _lat_g = ''
    _n_tot = 0
    for _gn, _gc, _ids in GRUPOS:
        _li = [i for i in _ids if i in _ttl]
        if not _li: continue
        _n_tot += len(_li)
        _lat_g += '<div class="lgr" style="--c:%s"><span>%s <small data-g></small></span>%s</div>' % (_gc, _gn, ''.join('<a href="#%s" data-s="%s">%s</a>' % (i, i, _ttl[i]) for i in _li))
    _lat = ('<aside id="lat" aria-label="Índice y progreso"><div class="lpr"><div><b>Tu lectura</b><span id="lpn">0 de %d apartados</span></div><div class="lbr"><i id="lpb"></i></div></div>'
            '<button type="button" id="lpdf">Descargar en PDF o imprimir</button><a class="lbus" href="#bsq" id="lbus">Buscar en la guía</a>'
            '<strong class="lir">Índice</strong>%s</aside>') % (_n_tot, _lat_g)
    _lat_css = ('<style>#lat{display:none}.visto:before{content:"\\2713  ";color:#16A34A;font-weight:700}'
      '.ixc b small{float:right;font-weight:600;color:#5B6B78;font-size:13px}'
      '@media(min-width:1180px){#lat{display:block;position:fixed;left:16px;top:16px;bottom:16px;width:292px;overflow:auto;background:#fff;border:1px solid #DCE2E7;border-radius:14px;padding:14px;z-index:25;font-size:14.5px;line-height:1.35;box-shadow:0 8px 28px rgba(18,32,43,.08)}'
      '.g{margin-left:max(330px,calc(50vw - 290px))!important;margin-right:auto}.fl{display:none}'
      '#lat .lpr{background:#F7F9FA;border:1px solid #DCE2E7;border-radius:12px;padding:10px 12px;margin-bottom:10px}#lat .lpr>div:first-child{display:flex;justify-content:space-between;gap:8px;font-size:14px}'
      '#lat .lbr{height:7px;background:#E3E9EE;border-radius:9px;margin-top:8px;overflow:hidden}#lat .lbr i{display:block;height:100%;width:0;background:#C2410C;border-radius:9px;transition:width .4s}'
      '#lat button,#lat .lbus{display:block;width:100%;box-sizing:border-box;text-align:center;font:700 14px Inter,sans-serif;padding:10px 12px;border-radius:10px;margin-bottom:8px;cursor:pointer;text-decoration:none}'
      '#lat button{background:#fff;border:2px solid #12202B;color:#12202B}#lat .lbus{background:#12202B;color:#fff;border:2px solid #12202B}'
      '#lat .lir{display:block;margin:12px 0 4px;font-size:16px}#lat .lgr{margin:10px 0;border-top:3px solid var(--c);padding-top:6px}#lat .lgr>span{display:block;font-weight:800;color:var(--c);font-size:12.5px;letter-spacing:.05em;text-transform:uppercase;margin-bottom:3px}'
      '#lat .lgr small{float:right;font-weight:600;color:#5B6B78;letter-spacing:0}#lat .lgr a{display:block;padding:4px 0;color:#12202B;text-decoration:none;border-bottom:1px solid #EEF2F5}#lat .lgr a:hover{color:#C2410C}#lat .lgr a.on{font-weight:700;color:#C2410C}}'
      '@media(max-width:1179px){.fl{right:auto;left:14px}.fq{position:fixed;right:14px;bottom:14px;z-index:20;background:#12202B;color:#fff!important;text-decoration:none;font-weight:700;font-size:14px;padding:10px 16px;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.25)}}'
      '@media(min-width:1180px){.fq{display:none}}@media print{#lat,.fq{display:none!important}.g{margin:0 auto!important}}</style>')
    _lat_js = """<script>(function(){var K='ams-vistos',v={};try{v=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
var hs=[].slice.call(document.querySelectorAll('#lat [data-s]')).map(function(a){return a.getAttribute('data-s')});
function paint(){var n=0;hs.forEach(function(i){if(v[i])n++;document.querySelectorAll('a[href="#'+i+'"]').forEach(function(a){if(a.closest('#lat,.ixc')){a.classList.toggle('visto',!!v[i])}})});
var p=document.getElementById('lpn');if(p)p.textContent=n+' de '+hs.length+' apartados';var gb=document.getElementById('gbar');if(gb){var pc=Math.round(100*n/hs.length);gb.querySelector('i').style.width=pc+'%';gb.setAttribute('aria-valuenow',pc);document.getElementById('gbp').textContent=pc+' %';var fa=hs.length-n;document.getElementById('gbf').textContent=fa>0?(fa===1?'te falta 1 apartado':'te faltan '+fa+' apartados'):'¡lo has visto todo!'}var b=document.getElementById('lpb');if(b)b.style.width=Math.round(100*n/hs.length)+'%';
document.querySelectorAll('#lat .lgr').forEach(function(g){var l=g.querySelectorAll('[data-s]'),c=0;l.forEach(function(a){if(v[a.getAttribute('data-s')])c++});g.querySelector('small').textContent=c+'/'+l.length});
document.querySelectorAll('.ixc').forEach(function(g){var l=g.querySelectorAll('a'),c=0;l.forEach(function(a){if(a.classList.contains('visto'))c++});var b=g.querySelector('b');var s=b.querySelector('small');if(!s){s=document.createElement('small');b.appendChild(s)}s.textContent=c+'/'+l.length});
var fl=document.querySelector('.fl');if(fl){fl.textContent='Índice '+n+'/'+hs.length;fl.setAttribute('href','#indice')}}
paint();document.addEventListener('DOMContentLoaded',paint);
if('IntersectionObserver' in window){var cur=null,io=new IntersectionObserver(function(es){var ch=false;es.forEach(function(e){if(e.isIntersecting){var i=e.target.id;if(!v[i]){v[i]=1;ch=true}document.querySelectorAll('#lat a.on').forEach(function(a){a.classList.remove('on')});var a=document.querySelector('#lat a[data-s="'+i+'"]');if(a)a.classList.add('on')}});
if(ch){try{localStorage.setItem(K,JSON.stringify(v))}catch(e){}paint()}},{rootMargin:'0px 0px -45% 0px',threshold:0});
hs.forEach(function(i){var e=document.getElementById(i);if(e)io.observe(e)})}
var pd=document.getElementById('lpdf');if(pd)pd.addEventListener('click',function(){document.querySelectorAll('details').forEach(function(d){d.open=true});setTimeout(function(){window.print()},80)});
var lb=document.getElementById('lbus');if(lb)lb.addEventListener('click',function(e){e.preventDefault();var i=document.getElementById('bsq');if(i){i.scrollIntoView({block:'center'});i.focus()}});
})();</script>"""
    body += _lat_css + _lat + '<a class="fq" href="#s46">Tus preguntas</a>' + _lat_js
    body += '<a class="fl" href="#empieza">Inicio de la guía</a>'
    body += """<p style="margin:30px 0 10px;font-size:13px;color:#6B7A86;text-align:center">Esta guía nos avisa de que se ha abierto. No guarda nada más.</p><script>(function(){try{var q=location.search;if(/[?&]yo=1/.test(q)){localStorage.setItem('ams-yo','1');return}
if(/[?&]yo=0/.test(q)){localStorage.removeItem('ams-yo')}
if(localStorage.getItem('ams-yo'))return;var u=+localStorage.getItem('ams-v')||0;if(Date.now()-u<4*3600000)return;localStorage.setItem('ams-v',String(Date.now()));
var d=/Mobi|Android|iPhone/i.test(navigator.userAgent)?'móvil':'ordenador';
fetch('/api/respuestas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({texto:'VISITA: se ha abierto la guía ('+d+'), '+new Date().toLocaleString('es-ES',{timeZone:'Europe/Madrid'})+'.'}),keepalive:true}).catch(function(){})}catch(e){}})();</script>"""
    _pos = ('<div class="pos"><h2 id="posibilidades" style="margin-top:28px">De dónde partimos y hasta dónde se puede llegar</h2>'
            '<p style="font-size:18px;margin:0 0 12px">Hoy casi no entran contactos por la web. Eso significa que hay mucho margen: todo lo que se construya suma. Son posibilidades, no promesas: las marcan las ganas y el ritmo.</p>'
            '<div class="pos-g">'
            '<div><b>Hoy</b><span>Web nueva, ficha de Google cuidada y contestar el mismo día.</span></div>'
            '<div><b>Primeros meses</b><span>Google empieza a conoceros y pueden llegar las primeras peticiones.</span></div>'
            '<div><b>El primer año</b><span>Reseñas nuevas, obras publicadas y el blog funcionando.</span></div>'
            '<div><b>Dentro de unos años</b><span>Un mapa lleno de obras propias, como el de ejemplo.</span></div>'
            '</div></div>')
    body = body.replace('<h2 id="indice">', _pos + '<h2 id="indice">', 1)
    body += """<script>(function(){function ab(el){while(el&&(el=el.parentElement)){if(el.tagName==='DETAILS')el.open=true}}
function go(){var h=location.hash.slice(1);if(!h)return;var t=document.getElementById(h);if(t){ab(t);setTimeout(function(){t.scrollIntoView()},30)}}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;var t=document.getElementById(a.getAttribute('href').slice(1));if(t)ab(t)});
window.addEventListener('hashchange',go);go();})();</script>"""

    # ---- reacciones por seccion, carta y cierre ----
    def _rx(ch):
        m = re.match(r'<h2[^>]*id="s(\d+)"[^>]*>(.*?)</h2>', ch, re.S)
        if not m or int(m.group(1)) > 24 and int(m.group(1)) not in (27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52): return ch
        n = m.group(1); t = re.sub(r'<[^>]+>|↑ .ndice', '', m.group(2)).strip()
        t = re.sub(r'^\d+\.\s*', '', t).replace('"', "'")
        _m = re.search(r'<span class="gt"[^>]*>[^<]*</span>$', ch)
        _tail = ch[_m.start():] if _m else ''
        if _m: ch = ch[:_m.start()]
        return ch + ('<div class="rx" data-n="%s" data-t="%s"><span>¿Qué te ha parecido esta parte?</span>'
                     '<button type="button" data-r="Me encanta">Me encanta</button>'
                     '<button type="button" data-r="Tengo una duda">Tengo una duda</button>'
                     '<button type="button" data-r="No lo veo claro">No lo veo claro</button>'
                     '<em role="status"></em></div>') % (n, t) + _tail
    body = ''.join(_rx(c) for c in re.split(r'(?=<h2[ >])', body))
    _cierre = ('<div class="carta" id="gracias"><h2 style="margin:0 0 10px;border:0;padding:0">Lo que de verdad importa</h2>'
               '<p>Detrás de cada ventana hay una familia que va a tener más luz, menos ruido y menos frío. Eso es lo que hacéis, y es mucho. Ojalá más gente lo sepa.</p>'
               '</div>')
    body = re.sub(r'(<h2[^>]*id="s25")', lambda m: _cierre + m.group(1), body, 1)
    GUIA_VER = "20261027a"
    POP_TXT = "Hoy hay dos novedades: tu lupa de demostración, para ver lo que hace la gente en tu web y mejorarla con datos, y tus tarifas ya metidas en la calculadora de la web. Te lo contamos en la sección de informes y panel de control."
    body += '<script>(function(){function k(t){return "ams_tarea_"+t}try{document.querySelectorAll("input.tk").forEach(function(c){try{c.checked=!!localStorage.getItem(k(c.dataset.t))}catch(e){}c.addEventListener("change",function(){try{if(c.checked)localStorage.setItem(k(c.dataset.t),"1");else localStorage.removeItem(k(c.dataset.t))}catch(e){}})})}catch(e){}})()</script>'
    body += '<script>(function(){try{fetch(\'/estado-guia.json?v=\'+Date.now(),{cache:\'no-store\'}).then(function(r){return r.ok?r.json():null}).then(function(d){if(!d)return;var q=function(i){return document.getElementById(i)};if(d.fecha&&q(\'est-f\'))q(\'est-f\').textContent=d.fecha;if(d.ultimo&&d.ultimo.length&&q(\'est-l\')){var ul=q(\'est-l\');ul.innerHTML=\'\';d.ultimo.slice(0,6).forEach(function(x){var li=document.createElement(\'li\');var b=document.createElement(\'b\');b.textContent=(x.f||\'\')+\': \';li.appendChild(b);li.appendChild(document.createTextNode(x.t||\'\'));ul.appendChild(li)});q(\'est-n\').style.display=\'block\'}if(d.cuentas){Object.keys(d.cuentas).forEach(function(k){var e=document.querySelector(\'td[data-e="\'+k+\'"]\');if(e&&d.cuentas[k])e.textContent=d.cuentas[k]})}(d.resueltas||[]).forEach(function(n){var e=document.querySelector(\'li[data-p="\'+n+\'"]\');if(e&&!e.dataset.ok){e.dataset.ok=\'1\';e.style.opacity=\'.55\';e.style.textDecoration=\'line-through\';var t=document.createElement(\'em\');t.style.cssText=\'display:inline-block;margin-left:6px;font-style:normal;font-weight:700;color:#2E8B57;text-decoration:none\';t.textContent=\'(resuelta, gracias)\';e.appendChild(t)}});if(d.nuevas&&d.nuevas.length&&q(\'est-nl\')){var ol=q(\'est-nl\');ol.innerHTML=\'\';d.nuevas.forEach(function(x){var li=document.createElement(\'li\');li.style.margin=\'0 0 9px\';li.textContent=x;ol.appendChild(li)});q(\'est-nv\').style.display=\'block\'}var K=\'ams-est-v\',vv=d.version||\'\';var seen=\'\';try{seen=localStorage.getItem(K)||\'\'}catch(e){}if(d.aviso&&vv&&seen!==vv){var pop=q(\'gpop\');if(pop){pop.querySelector(\'b\').textContent=\'La guía se ha actualizado\';pop.querySelector(\'p\').textContent=d.aviso;var a=q(\'gpop-ver\');if(a){a.textContent=\'Verlo\';a.setAttribute(\'href\',\'#est-n\');a.onclick=function(){try{localStorage.setItem(K,vv)}catch(e){}pop.style.display=\'none\'}}var x=q(\'gpop-x\');if(x)x.addEventListener(\'click\',function(){try{localStorage.setItem(K,vv)}catch(e){}});pop.style.display=\'block\'}}}).catch(function(){})}catch(e){}})();</script>'
    body += '<span id="gver" data-v="' + GUIA_VER + '" hidden></span><div id="gpop" role="dialog" aria-live="polite" style="display:none"><b>La guía se ha actualizado</b><p>' + POP_TXT + '</p><div><a id="gpop-ver" href="/guia-javi/resumen">Ver el resumen</a><button type="button" id="gpop-x">Cerrar</button></div></div><style>#gpop{position:fixed;left:12px;right:12px;bottom:76px;z-index:60;max-width:440px;margin:0 auto;background:#12202B;color:#fff;border-radius:14px;padding:16px 18px;box-shadow:0 10px 36px rgba(0,0,0,.35)}#gpop b{font-size:17px}#gpop p{margin:6px 0 12px;font-size:15px;line-height:1.45}#gpop div{display:flex;gap:10px;align-items:center}#gpop a{background:#C2410C;color:#fff;text-decoration:none;font-weight:700;padding:10px 14px;border-radius:8px;font-size:15px}#gpop button{background:none;border:1px solid #5B6B78;color:#fff;border-radius:8px;padding:9px 14px;font-size:15px;cursor:pointer}@media print{#gpop{display:none!important}}</style>'
    body += '<div id="gmsg" role="dialog" aria-modal="true" aria-labelledby="gmsg-t"><div class="gm-c"><h2 id="gmsg-t">Una cosa, Javi</h2><div class="gm-t">' + MSG_IG + '</div><button type="button" id="gmsg-x">Entendido, seguir con la guía</button></div></div><style>#gmsg{position:fixed;inset:0;z-index:2147483000;background:rgba(18,32,43,.72);display:none;align-items:center;justify-content:center;padding:14px}#gmsg.on{display:flex}#gmsg .gm-c{background:#fff;color:#1f2a36;border-radius:16px;max-width:560px;width:100%;max-height:92vh;overflow:auto;padding:22px 22px 18px;box-shadow:0 14px 48px rgba(0,0,0,.4)}#gmsg h2{margin:0 0 10px;font-size:22px;color:#12202B;border:0;padding:0}#gmsg .gm-t p{margin:0 0 10px;font-size:16px;line-height:1.5}#gmsg button{background:#C2410C;color:#fff;border:0;border-radius:10px;padding:13px 18px;font-size:16px;font-weight:700;cursor:pointer;width:100%;margin-top:6px}@media print{#gmsg{display:none!important}}</style>'
    body += r"""<script>(function(){var m=document.getElementById('gmsg');if(!m)return;var K='ams-msg-ig-2',yo=false,visto=false;try{yo=!!localStorage.getItem('ams-yo');visto=!!localStorage.getItem(K)}catch(e){}
if(yo||visto)return;setTimeout(function(){m.classList.add('on');document.getElementById('gmsg-x').focus()},900);
function cierra(){m.classList.remove('on');try{localStorage.setItem(K,'1')}catch(e){}}
document.getElementById('gmsg-x').addEventListener('click',cierra);document.addEventListener('keydown',function(e){if(e.key==='Escape')cierra()})})();</script>"""
    body += '<div id="gpend" role="dialog" aria-modal="true" aria-labelledby="gpend-t"><div class="gp-c"><h2 id="gpend-t">Tienes preguntas pendientes de contestar</h2><p>Son tres y se contestan en unos 2 minutos, incluso por audio de WhatsApp. Con ellas terminamos de preparar tus precios en la web.</p><div class="gp-b"><a id="gpend-ver" href="#pendientes">Ver las preguntas</a><button type="button" id="gpend-x">Más tarde</button></div></div></div><style>#gpend{position:fixed;inset:0;z-index:2147483001;background:rgba(18,32,43,.72);display:none;align-items:center;justify-content:center;padding:14px}#gpend.on{display:flex}#gpend .gp-c{background:#fff;color:#1f2a36;border-radius:16px;max-width:460px;width:100%;padding:24px 22px;box-shadow:0 20px 50px rgba(0,0,0,.35);border-top:6px solid #E8C04A}#gpend h2{margin:0 0 10px;border:0;padding:0;font-size:23px;line-height:1.2}#gpend p{margin:0 0 18px;font-size:17px;line-height:1.5}#gpend .gp-b{display:flex;flex-wrap:wrap;gap:10px}#gpend .gp-b a,#gpend .gp-b button{flex:1 1 150px;min-height:52px;border-radius:10px;font:700 17px Inter,sans-serif;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer}#gpend .gp-b a{background:#C2410C;color:#fff;border:0}#gpend .gp-b button{background:#fff;color:#12202B;border:2px solid #12202B}</style>'
    body += r"""<script>(function(){var m=document.getElementById('gpend');if(!m)return;var yo=false,seen=false,vm=false;try{yo=!!localStorage.getItem('ams-yo');seen=!!sessionStorage.getItem('ams-pend');vm=!!localStorage.getItem('ams-msg-ig-2')}catch(e){}
if(yo)return;try{var gv=document.getElementById('gver');if(gv)localStorage.setItem('ams-ver',gv.getAttribute('data-v'))}catch(e){}if(seen)return;function show(){m.classList.add('on');try{sessionStorage.setItem('ams-pend','1')}catch(e){}document.getElementById('gpend-ver').focus()}
function close(){m.classList.remove('on')}
document.getElementById('gpend-x').addEventListener('click',close);document.getElementById('gpend-ver').addEventListener('click',close);document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
if(vm)setTimeout(show,600);else{var g=document.getElementById('gmsg-x');if(g)g.addEventListener('click',function(){setTimeout(show,300)});else setTimeout(show,600)}})();</script>"""
    body += r"""<script>(function(){var el=document.getElementById('gver'),pop=document.getElementById('gpop');if(!el||!pop)return;var V=el.getAttribute('data-v'),K='ams-ver',yo=false,last=null;try{yo=!!localStorage.getItem('ams-yo');last=localStorage.getItem(K)}catch(e){}
function done(){pop.style.display='none';try{localStorage.setItem(K,V)}catch(e){}}
document.getElementById('gpop-x').addEventListener('click',done);document.getElementById('gpop-ver').addEventListener('click',done);
if(!yo&&last!==V)setTimeout(function(){pop.style.display='block'},1500);
function chk(){fetch(location.pathname+'?v='+Date.now(),{cache:'no-store'}).then(function(r){return r.text()}).then(function(t){var m=t.match(/id="gver" data-v="([^"]+)"/);if(m&&m[1]!==V){pop.querySelector('b').textContent='Hay una versión nueva de la guía';pop.querySelector('p').textContent='Hemos añadido cosas nuevas. Recarga la página para verlas.';var a=document.getElementById('gpop-ver');a.textContent='Recargar ahora';a.setAttribute('href',location.pathname);a.onclick=function(e){e.preventDefault();try{localStorage.removeItem(K)}catch(x){}location.reload()};pop.style.display='block'}}).catch(function(){})}
setInterval(chk,120000);})();</script>"""
    body += r"""<script>(function(){var q=document.getElementById('bsq'),r=document.getElementById('bsr'),x=document.getElementById('bsx');if(!q)return;var IDX=null;
function nz(t){return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
function build(){IDX=[];var hs=[].slice.call(document.querySelectorAll('h2[id]'));hs.forEach(function(h,i){var g=document.createRange();g.setStartBefore(h);var nx=hs[i+1];if(nx)g.setEndBefore(nx);else g.setEndAfter(document.body.lastChild);var t=g.toString().replace(/\s+/g,' ').replace(/¿Qué te ha parecido esta parte\?.*?(No lo veo claro)/,' ').replace(/↑ índice/g,'');var ti=h.textContent.replace(/↑ índice/,'').trim();IDX.push({id:h.id,ti:ti,t:t,n:nz(t),nt:nz(ti),r:g})})}
function esc(s){return s.replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function ab(el){while(el&&(el=el.parentElement)){if(el.tagName==='DETAILS')el.open=true}}
function clearH(){try{if(window.CSS&&CSS.highlights)CSS.highlights.delete('bsq')}catch(e){}}
function mark(sec,w){clearH();var fr=null;try{if(!(window.CSS&&CSS.highlights&&window.Highlight))return null;var rs=[],tw=document.createTreeWalker(sec.r.commonAncestorContainer,NodeFilter.SHOW_TEXT),n;while(n=tw.nextNode()){if(!sec.r.intersectsNode(n))continue;var tx=nz(n.nodeValue),i=0;while((i=tx.indexOf(w,i))>-1&&rs.length<200){var rr=document.createRange();rr.setStart(n,i);rr.setEnd(n,i+w.length);rs.push(rr);if(!fr)fr=rr;ab(n);i+=w.length}}if(rs.length)CSS.highlights.set('bsq',new Highlight(...rs))}catch(e){}return fr}
function snip(s,w){var i=s.n.indexOf(w);if(i<0)return '';var a=Math.max(0,i-60),b=Math.min(s.t.length,i+w.length+90);return (a?'… ':'')+esc(s.t.slice(a,i))+'<mark>'+esc(s.t.slice(i,i+w.length))+'</mark>'+esc(s.t.slice(i+w.length,b))+(b<s.t.length?' …':'')}
function run(){var v=q.value.trim();if(v.length<2){r.style.display='none';r.innerHTML='';clearH();return}if(!IDX)build();var w=nz(v),out=[];IDX.forEach(function(s){var c=s.n.split(w).length-1,ct=s.nt.indexOf(w)>-1;if(c||ct)out.push({s:s,c:c+(ct?50:0)})});out.sort(function(a,b){return b.c-a.c});r.style.display='block';var bb=q.closest('.bsq');if(bb.getBoundingClientRect().top>80||bb.getBoundingClientRect().top<-5)bb.scrollIntoView({block:'start'});if(!out.length){r.innerHTML='<p>No hay resultados para &laquo;'+esc(v)+'&raquo;. Prueba con otra palabra más corta.</p>';return}
r.innerHTML=out.slice(0,12).map(function(o){return '<a href="#'+o.s.id+'" data-w="'+esc(w)+'"><b>'+esc(o.s.ti)+'</b><span>'+snip(o.s,w)+'</span></a>'}).join('')}
q.addEventListener('input',run);q.addEventListener('focus',function(){if(q.value.trim().length>1)run()});
r.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;e.preventDefault();var id=a.getAttribute('href').slice(1),t=document.getElementById(id),w=a.getAttribute('data-w');ab(t);r.style.display='none';var sec=IDX.filter(function(s){return s.id===id})[0];setTimeout(function(){var fr=sec?mark(sec,w):null;var el=fr&&fr.startContainer.parentElement;if(el&&el.scrollIntoView)el.scrollIntoView({block:'center'});else t.scrollIntoView({block:'start'})},40);history.replaceState(null,'','#'+id)});
x.addEventListener('click',function(){q.value='';run();clearH();q.focus()});
q.addEventListener('keydown',function(e){if(e.key==='Escape'){r.style.display='none';clearH()}});
document.addEventListener('click',function(e){if(!e.target.closest('.bsq'))r.style.display='none'});})();</script>"""
    body += """<script>(function(){var K='ams-rx';var S={};try{S=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
function mark(b,r){var bs=b.querySelectorAll('button');for(var i=0;i<bs.length;i++)bs[i].classList.toggle('on',bs[i].getAttribute('data-r')===r)}
var all=document.querySelectorAll('.rx');for(var i=0;i<all.length;i++){var n=all[i].getAttribute('data-n');if(S[n])mark(all[i],S[n])}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.rx button[data-r]');if(!b)return;var box=b.parentElement,n=box.getAttribute('data-n'),t=box.getAttribute('data-t'),r=b.getAttribute('data-r'),m=box.querySelector('em');
mark(box,r);S[n]=r;try{localStorage.setItem(K,JSON.stringify(S))}catch(x){}
m.textContent='Enviando...';if((r==='Tengo una duda'||r==='No lo veo claro')&&!box.querySelector('.dq')){var d=document.createElement('div');d.className='dq';d.style.cssText='flex:1 0 100%;margin-top:8px';d.innerHTML='<textarea rows="3" placeholder="Si quieres, cuéntanos cuál es tu duda (se la enviamos a Ignacio y la contestamos aquí arriba)" style="width:100%;box-sizing:border-box;font:16px Inter,sans-serif;padding:10px;border:2px solid #C9D3DB;border-radius:8px"></textarea><button type="button" style="margin-top:6px;font:700 15px Inter,sans-serif;padding:10px 16px;border:0;border-radius:8px;background:#C2410C;color:#fff;cursor:pointer">Enviar mi duda</button><em style="display:block;margin-top:4px;font-size:13px;color:#4A5A68"></em>';box.appendChild(d);d.querySelector('button').addEventListener('click',function(){var tx=d.querySelector('textarea').value.trim(),em=d.querySelector('em');if(!tx){em.textContent='Escribe tu duda y pulsa enviar.';return}em.textContent='Enviando...';fetch('/api/respuestas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({texto:'DUDA de Javi en la sección '+n+' ('+t+'): '+tx})}).then(function(x){return x.json().catch(function(){return{ok:false}})}).then(function(j){em.textContent=(j&&j.ok)?'Enviada. Gracias, Javi: la contestamos en «Respuestas a tus dudas», al principio de la guía.':'No se ha podido enviar. Cuéntanosla por WhatsApp, por favor.'}).catch(function(){em.textContent='No se ha podido enviar. Cuéntanosla por WhatsApp, por favor.'})})}
fetch('/api/respuestas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({texto:'REACCION de Javi a la sección '+n+' ('+t+'): '+r})}).then(function(x){return x.json().catch(function(){return{ok:false}})}).then(function(j){m.textContent=(j&&j.ok)?'Gracias, Javi. Ignacio lo verá.':'Apuntado en tu navegador. Cuando puedas, cuéntanoslo por WhatsApp.'}).catch(function(){m.textContent='Apuntado en tu navegador. Cuando puedas, cuéntanoslo por WhatsApp.'})});})();</script>"""

    extra = '''
.g{font-size:17px;line-height:1.6;max-width:880px;margin:0 auto;padding:16px 18px 80px;font-family:Inter,system-ui,sans-serif;color:#12202B;background:#fff}
.g img{max-width:100%;height:auto}
.g .cover img{height:56px;width:auto}
.g .logos img{height:72px;width:auto}
.tw{overflow-x:auto;-webkit-overflow-scrolling:touch}
.g table{min-width:560px}
.g h2{scroll-margin-top:12px}
.g .cover h1{font-size:clamp(26px,6vw,44px)}
.g .grid,.g .grid4,.g .flow,.g .two,.g .logos{grid-template-columns:1fr 1fr}
.g .phones{flex-wrap:wrap}.g .phones figure{flex:1 1 40%}
.g .journey{flex-direction:column}.g .journey div{clip-path:none;margin:0 0 4px}
.g .diag{flex-wrap:wrap}.g .diag .n{flex:1 1 120px}
.g .acts{margin-bottom:8px}
.g .vid video{width:100%;display:block;border-radius:5px;border:1px solid #DCE2E7;background:#12202B}
.g .qb{margin-top:10px}
.g .q{display:none}
@media(max-width:600px){.g{font-size:16px}.g .grid,.g .grid4,.g .flow,.g .two,.g .logos{grid-template-columns:1fr}.g .diag .ar{display:none}.g .cover{padding:36px 22px}.g .up{display:none}}
@media print{.acts,#estado{display:none}}
a{color:#B8430A}
.rx{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:18px 0 6px;padding:10px 14px;background:#F3F5F7;border-radius:12px;font-size:15px}
.rx span{font-weight:700;margin-right:4px}
.rx button{font:inherit;font-size:14px;cursor:pointer;background:#fff;border:1px solid #C9D2D9;color:#12202B;border-radius:999px;padding:7px 14px}
.rx button.on{background:#C2410C;border-color:#C2410C;color:#fff;font-weight:700}
.rx em{font-style:normal;color:#4A5A68;font-size:14px}
.carta{background:linear-gradient(160deg,#FFF1E8,#FFFFFF);border:1px solid #F2C9AE;border-radius:14px;padding:22px 24px;margin:22px 0;font-size:18px}
.carta p{margin:0 0 10px}
@media print{.rx{display:none}}
.gt{display:inline-block;color:#fff;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:4px 12px;border-radius:999px;margin:26px 0 -14px}
.emp-g{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.emp-c{position:relative;display:flex;flex-direction:column;gap:6px;padding:18px 16px 16px;background:#fff;border:2px solid var(--c);border-radius:14px;text-decoration:none;color:#12202B;box-shadow:0 4px 14px rgba(18,32,43,.08)}
.emp-c:hover{transform:translateY(-2px)}
.emp-n{width:32px;height:32px;border-radius:50%;background:var(--c);color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px}
.emp-t{font-size:20px;line-height:1.2}.emp-c span{font-size:16px;line-height:1.45;color:#3D5163}.emp-c em{font-style:normal;font-weight:800;color:var(--c);margin-top:auto;padding-top:6px}
@media(max-width:800px){.emp-g{grid-template-columns:1fr 1fr}}@media(max-width:520px){.emp-g{grid-template-columns:1fr}}
.ixg{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:10px 0 20px}
.ixc{border-top:5px solid var(--c);background:#F7F9FA;border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:4px}
.ixc b{color:var(--c);font-size:16px;margin-bottom:4px}.ixw{background:#fff;border:1px solid #DCE2E7;border-top:6px solid #12202B;border-radius:18px;padding:22px 22px 14px;margin:26px 0;box-shadow:0 8px 28px rgba(18,32,43,.07)}.ixw h2{margin:0 0 6px;font-size:clamp(26px,4vw,34px);border:0;padding:0}.ixs{margin:0 0 14px;color:#5B6B78;font-size:16px}.ixc b i{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--c);color:#fff;font-style:normal;font-size:14px;margin-right:9px}.ixc{background:#fff;border:1px solid #E3E9EE;border-top:5px solid var(--c)}.ixc a{color:#12202B;text-decoration:none;font-size:15.5px;line-height:1.35;padding:3px 0}.ixc a:hover{text-decoration:underline}
.dn>summary{cursor:pointer;display:inline-block;background:#FFF1E8;color:#B8430A;font-weight:700;padding:10px 18px;border-radius:999px;margin:4px 0 12px;border:1px solid #F2C9AE}
.fl{position:fixed;right:14px;bottom:14px;z-index:20;background:#C2410C;color:#fff!important;text-decoration:none;font-weight:700;font-size:14px;padding:10px 16px;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.25)}
@media print{.fl{display:none}}
.mej{background:linear-gradient(135deg,#12202B 0%,#1E3A52 100%);color:#fff;border-radius:16px;padding:26px 24px;margin:28px 0}
.mej-k{display:inline-block;background:#C2410C;color:#fff;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:4px 12px;border-radius:999px}
.of{margin:12px 0 22px;background:#fff;border:1px solid #D9E1E8;border-radius:12px;padding:14px 16px}.of summary{cursor:pointer;font-weight:700;font-size:18px;color:#12202B}.of-n{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 12px}.of-n div{flex:1 1 90px;background:#12202B;color:#D3DBE2;border-radius:10px;padding:10px;text-align:center;font-size:14px}.of-n b{display:block;font-size:26px;color:#fff;line-height:1.1}.of-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}.of-g div{background:#F3F6F9;border-radius:8px;padding:10px 12px}.of-g b{display:block;font-size:16px;color:#12202B}.of-g span{font-size:15px;color:#3B4A57}.mej-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}
.mej-g div{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:6px}
.mej-g b{font-size:17px;line-height:1.25;color:#F5B27F}.mej-g span{font-size:15px;line-height:1.45;color:#E4EAF0}
.sb{position:relative;margin:14px 0 16px;border-radius:12px;overflow:hidden;aspect-ratio:16/6;background:#12202B}
.g .sb img{width:100%;height:100%;object-fit:cover;display:block}
.sb p{position:absolute;left:0;right:0;bottom:0;margin:0;padding:34px 20px 16px;color:#fff;font-weight:800;font-size:clamp(18px,3.2vw,26px);line-height:1.25;background:linear-gradient(transparent,rgba(18,32,43,.9))}
@media(max-width:600px){.sb{aspect-ratio:16/9}}
.dt>summary{cursor:pointer;display:inline-block;background:#FFF1E8;color:#B8430A;font-weight:700;padding:10px 18px;border-radius:999px;margin:4px 0 16px;list-style:none;border:1px solid #F2C9AE}
.dt>summary::-webkit-details-marker{display:none}
.dt>summary::before{content:"Haz clic para ver el detalle de esta sección"}
.dt[open]>summary::before{content:"Ocultar el detalle"}
.pos-g{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;counter-reset:p}
.pos-g div{background:linear-gradient(160deg,#FFF1E8,#FFFFFF);border:1px solid #F2C9AE;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:6px;position:relative}
.pos-g div::before{counter-increment:p;content:counter(p);position:absolute;top:-10px;left:12px;background:#C2410C;color:#fff;font-weight:800;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:14px}
.pos-g b{color:#B8430A;margin-top:6px}.pos-g span{font-size:15px;line-height:1.4}
@media(max-width:700px){.pos-g{grid-template-columns:1fr 1fr}}
.g a:focus-visible,.g button:focus-visible{outline:3px solid #C2410C;outline-offset:2px}
'''
    page = f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Guía para Javi | AMS Cerramientos</title><style>body{{margin:0}}{_css(style)}{extra}</style></head><body><div class="g">{body}</div></body></html>'''
    page = _integrar(OUT, page, body)
    open(os.path.join(OUT, "guia-javi.html"), "w", encoding="utf8").write(page)
    pdf = os.path.join(INF, "AMS-guia-completa-para-Javi.pdf")
    # PDF antiguo ya no se publica: no refleja los textos actuales
