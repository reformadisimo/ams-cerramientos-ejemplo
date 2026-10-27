# Páginas nuevas de AMS Cerramientos, basadas en el contenido real de la web antigua
# (amscerramientos.es), reescrito y ordenado. Cada página devuelve (url, salida, titulo, descripcion, cuerpo).

BTN = "display: inline-flex; align-items: center; min-height: 54px; padding: 0 26px; border-radius: 6px; background: #C2410C; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 17px"
BTN2 = "display: inline-flex; align-items: center; min-height: 54px; padding: 0 22px; border-radius: 6px; border: 1px solid #5B6B78; color: #FFFFFF; text-decoration: none; font-weight: 600"
CARD = "padding: 24px; background: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 8px"
H2 = "margin: 0; font-size: clamp(26px, 5.5vw, 36px); font-weight: 800"
P = "margin: 0; font-size: 16px; line-height: 1.6"
PS = "margin: 0; font-size: 15px; line-height: 1.55; color: #4A5A68"
LINK = "font-weight: 700; color: #B8430A"


def hero(crumb, h1, lead, visual, wa_label="Mandar una foto"):
    return f'''<section style="background: #12202B; color: #FFFFFF">
<div style="max-width: 1200px; margin: 0 auto; padding: 40px 24px 60px; display: flex; flex-wrap: wrap; gap: 40px; align-items: center">
<div style="flex: 999 1 520px; min-width: 0; display: flex; flex-direction: column; gap: 18px">
<div style="font-size: 14px; color: #B9C4CE"><a href="/" style="color: #B9C4CE">Inicio</a> / {crumb}</div>
<h1 style="margin: 0; font-size: clamp(30px, 7vw, 46px); line-height: 1.1; font-weight: 800">{h1}</h1>
<p style="margin: 0; font-size: 19px; line-height: 1.55; color: #D3DBE2">{lead}</p>
<div style="display: flex; flex-wrap: wrap; gap: 12px"><a href="/contacto" style="{BTN}">Presupuesto gratis</a><a href="https://wa.me/34639788220" style="{BTN2}">{wa_label}</a></div>
</div>
<div style="flex: 1 1 380px; min-width: 0; aspect-ratio: 4 / 3; max-height: 420px; border-radius: 10px; overflow: hidden; background: #1C2F3F">{visual}</div>
</div>
</section>'''


def photo(src, alt):
    return f'<img src="{src}" alt="{alt}" style="width: 100%; height: 100%; object-fit: cover; display: block">'


def sec(inner, bg=None, pad="72px 24px"):
    st = f' style="background: {bg}"' if bg else ""
    return f'''<section{st}>
<div style="max-width: 1200px; margin: 0 auto; padding: {pad}; display: flex; flex-direction: column; gap: 28px">
{inner}
</div>
</section>'''


def head(h2, sub=None):
    s = f'<p style="margin: 0; font-size: 17px; line-height: 1.55; color: #4A5A68">{sub}</p>' if sub else ""
    return f'<div style="display: flex; flex-direction: column; gap: 10px; max-width: 780px"><h2 style="{H2}">{h2}</h2>{s}</div>'


def cards(items, minw=260):
    out = []
    for it in items:
        h3, p = it[0], it[1]
        link = f'<a href="{it[2]}" style="{LINK}">{it[3]}</a>' if len(it) > 2 else ""
        out.append(f'<div style="{CARD}"><h3 style="margin: 0; font-size: 20px">{h3}</h3><p style="{PS}">{p}</p>{link}</div>')
    return f'<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax({minw}px, 1fr)); gap: 20px">' + "".join(out) + "</div>"


def table(headers, rows):
    th = "".join(f'<th style="text-align: left; padding: 12px 14px; background: #12202B; color: #FFFFFF; font-size: 14px; white-space: nowrap">{h}</th>' for h in headers)
    trs = ""
    for i, r in enumerate(rows):
        bg = "#FFFFFF" if i % 2 == 0 else "#F3F5F7"
        tds = "".join(
            f'<td style="padding: 12px 14px; font-size: 15px; line-height: 1.45; border-top: 1px solid #E3E8EC; {"font-weight: 700;" if j == 0 else ""}">{c}</td>'
            for j, c in enumerate(r)
        )
        trs += f'<tr style="background: {bg}">{tds}</tr>'
    return f'<div style="overflow-x: auto; border-radius: 10px; border: 1px solid #E3E8EC"><table style="border-collapse: collapse; width: 100%; min-width: 620px"><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table></div>'


def faq(items):
    out = "".join(
        f'<div style="{CARD}"><h3 style="margin: 0; font-size: 18px">{q}</h3><p style="{PS}">{a}</p></div>' for q, a in items
    )
    return f'<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px">{out}</div>'


def steps(items):
    out = "".join(
        f'<div style="{CARD}"><span style="font: 800 14px Archivo, sans-serif; color: #C2410C; letter-spacing: .06em">PASO {i}</span><h3 style="margin: 0; font-size: 19px">{h}</h3><p style="{PS}">{t}</p></div>'
        for i, (h, t) in enumerate(items, 1)
    )
    return f'<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 20px">{out}</div>'


def cta(h2, label="Pedir presupuesto"):
    return f'''<section style="background: #12202B; color: #FFFFFF">
<div style="max-width: 1200px; margin: 0 auto; padding: 56px 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px">
<h2 style="margin: 0; font-size: clamp(26px, 5.5vw, 32px); font-weight: 800; flex: 999 1 400px">{h2}</h2>
<div style="display: flex; flex-wrap: wrap; gap: 12px"><a href="tel:+34639788220" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 6px; background: #C2410C; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 18px">639 78 82 20</a><a href="/contacto" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 22px; border-radius: 6px; border: 1px solid #5B6B78; color: #FFFFFF; text-decoration: none; font-weight: 600">{label}</a></div>
</div>
</section>'''


# ---------- ilustraciones (sin fotos de stock) ----------

def svg_toldo():
    cols = ["#C2410C", "#F6EFE6"] * 5
    w = 52
    stripes = "".join(f'<rect x="{30 + i * w}" y="70" width="{w}" height="120" fill="{c}"/>' for i, c in enumerate(cols))
    scallops = "".join(f'<path d="M{30 + i * w} 190 a{w / 2} {w / 2} 0 0 0 {w} 0z" fill="{c}"/>' for i, c in enumerate(cols))
    return f'''<svg viewBox="0 0 580 435" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustración de un toldo a rayas sobre una terraza">
<defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC3E4"/><stop offset="1" stop-color="#E6F0F7"/></linearGradient></defs>
<rect width="580" height="435" fill="url(#cielo)"/>
<rect x="0" y="330" width="580" height="105" fill="#D9A27C"/>
<rect x="10" y="52" width="560" height="22" rx="4" fill="#12202B"/>
{stripes}{scallops}
</svg>'''


def svg_reja():
    bars = ""
    for i in range(9):
        x = 62 + i * 34
        bars += f'<rect x="{x}" y="40" width="7" height="260" fill="#E6ECF1"/>'
        bars += f'<circle cx="{x + 3.5}" cy="170" r="11" fill="none" stroke="#F5C9A8" stroke-width="3"/>'
        bars += f'<path d="M{x + 3.5} 40 l-6 -12 l12 0z" fill="#E6ECF1"/>'
    return f'''<svg viewBox="0 0 420 335" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustración de una reja de hierro con barrotes macizos y adornos de forja">
<rect width="420" height="335" fill="#24384A"/>
<rect x="40" y="28" width="340" height="285" rx="6" fill="#0B151D"/>
<rect x="50" y="40" width="320" height="262" fill="#9CC3E4" opacity=".35"/>
{bars}
<rect x="50" y="80" width="320" height="8" fill="#E6ECF1"/><rect x="50" y="252" width="320" height="8" fill="#E6ECF1"/>
<rect x="40" y="28" width="340" height="285" rx="6" fill="none" stroke="#C2410C" stroke-width="5"/>
</svg>'''


def svg_techos():
    def panel(x, label, fill, inner):
        return f'<g transform="translate({x} 0)"><rect x="0" y="70" width="120" height="150" rx="6" fill="#0B151D"/>{inner}<text x="60" y="250" text-anchor="middle" font-family="Inter,sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">{label}</text></g>'
    poli = "".join(f'<rect x="{14 + i * 14}" y="84" width="6" height="122" fill="#BFE3F2" opacity=".85"/>' for i in range(7)) + '<rect x="10" y="80" width="100" height="6" fill="#BFE3F2"/><rect x="10" y="204" width="100" height="6" fill="#BFE3F2"/>'
    cris = '<rect x="12" y="84" width="96" height="122" fill="#9CC3E4" opacity=".6"/><path d="M26 206 L74 84 M52 206 L100 84" stroke="#FFFFFF" stroke-width="5" opacity=".55"/>'
    sand = '<rect x="12" y="84" width="96" height="14" fill="#E6ECF1"/><rect x="12" y="98" width="96" height="94" fill="#F5C9A8"/><rect x="12" y="192" width="96" height="14" fill="#E6ECF1"/>'
    return f'''<svg viewBox="0 0 420 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Esquema de tres tipos de cubierta: policarbonato, cristal y panel sándwich">
<rect width="420" height="300" fill="#24384A"/>
{panel(10, "Policarbonato", "", poli)}{panel(150, "Cristal", "", cris)}{panel(290, "Sándwich", "", sand)}
<text x="210" y="42" text-anchor="middle" font-family="Archivo,sans-serif" font-size="20" font-weight="800" fill="#F5C9A8">Tres cubiertas, tres usos</text>
</svg>'''


# ---------- páginas ----------

def p_toldos():
    swatch = lambda bg, name, txt: (
        f'<div style="{CARD}"><div style="height: 64px; border-radius: 6px; background: {bg}"></div>'
        f'<h3 style="margin: 4px 0 0; font-size: 19px">{name}</h3><p style="{PS}">{txt}</p></div>'
    )
    rayas = "repeating-linear-gradient(90deg, #C2410C 0 18px, #F6EFE6 18px 36px)"
    fino = "repeating-linear-gradient(90deg, #1E4E79 0 9px, #F6EFE6 9px 18px)"
    plus = "repeating-linear-gradient(90deg, #2F5D3A 0 24px, #E9E2D0 24px 48px)"
    lisos = "linear-gradient(90deg, #F6EFE6 0 20%, #E3C9A1 20% 40%, #7FA6C9 40% 60%, #2F5D3A 60% 80%, #C2410C 80%)"
    jacq = "radial-gradient(circle at 12px 12px, #F6EFE6 5px, transparent 6px) 0 0 / 24px 24px, #1E4E79"
    imper = "linear-gradient(135deg, #12202B, #2A4257)"
    soltis = "radial-gradient(circle, #12202B 1.5px, transparent 2px) 0 0 / 8px 8px, #C9D3DB"
    screen = "repeating-linear-gradient(0deg, #DDE3E8 0 3px, #F3F5F7 3px 8px)"
    estamp = "linear-gradient(135deg, #2F5D3A 0 50%, #F5C9A8 50%)"
    body = hero(
        "Toldos y tejidos",
        "Toldos cofre, minicofre y de brazos extensibles, con más de 200 colores de lona",
        "Sombra en verano y una terraza que se puede usar a cualquier hora. Los fabricamos a medida, los motorizamos si quieres y los instalamos nosotros.",
        svg_toldo(),
        "Mandar foto de la terraza",
    )
    body += sec(
        head("Qué tipo de toldo necesitas")
        + cards(
            [
                ("Toldo cofre", "Brazos y lona se recogen dentro de un cofre cerrado. La tela queda a salvo de lluvia, polvo y sol cuando no se usa, y dura más. Es el que recomendamos para terrazas muy expuestas."),
                ("Toldo minicofre", "La misma idea en versión compacta, para balcones, ventanas y huecos donde un cofre grande no cabe."),
                ("Toldo de brazos extensibles", "Sin guías laterales y con mucha proyección: se despliega sobre la terraza y se recoge contra la pared. Puede llevar cofre o ir abierto, según presupuesto."),
                ("Lona de PVC transparente", "Cierra la terraza del viento y la lluvia sin perder las vistas, para disfrutarla también en invierno."),
            ]
        )
        + table(
            ["Tipo", "Ideal para", "Lo mejor", "A tener en cuenta"],
            [
                ["Cofre", "Terrazas y áticos expuestos", "Tela protegida cuando está recogido", "Algo más caro que uno abierto"],
                ["Minicofre", "Balcones y huecos pequeños", "Compacto y discreto", "Menos proyección que un cofre grande"],
                ["Brazos extensibles", "Terrazas amplias", "Mucha proyección, sin guías", "Sin cofre, la tela queda a la vista"],
            ],
        )
    )
    body += sec(
        head("Tejidos: más de 200 colores, ordenados por calidad", "Elige la lona según tu fachada y el uso que le vas a dar. Te llevamos el muestrario a casa para que la veas con tu luz.")
        + '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px">'
        + swatch(lisos, "Lisos", "48 colores. Blancos y beiges dan amplitud, los azules y negros aportan sobriedad y los verdes recuerdan a un jardín.")
        + swatch(rayas, "Listados", "Diseños de fantasía, con rayas atrevidas en tonos pastel o intensos.")
        + swatch(fino, "Listados clásicos", "Rayas estrechas de color liso y sin degradado, de 9 cm en casi todos los modelos. El toldo de toda la vida.")
        + swatch(plus, "Listados gama Plus", "Lona de alta resistencia con tejido de doble hilo, inspirada en el algodón de antes. Para quien quiere que dure.")
        + swatch(jacq, "Jacquard", "Tejidos decorativos para protección solar, disponibles en cuatro tonalidades.")
        + swatch(imper, "Impermeables (Sunrain)", "Lona resinada por el reverso para que no pase el agua. Exclusiva de Sauleda, con un sobrecoste pequeño.")
        + swatch(soltis, "Gama Soltis", "PVC microperforado con refuerzo de poliéster. Mantiene la tela tensa, aguanta viento e intemperie y deja pasar algo de aire.")
        + swatch(screen, "Gama Screen", "Tamiza la luz y evita el deslumbramiento sin oscurecer la estancia. Colores pensados para decoración minimalista.")
        + swatch(estamp, "Estampados", "Colección a doble cara: el exterior en verde y el interior con el diseño que elijas del catálogo.")
        + "</div>",
        bg="#FFFFFF",
    )
    body += sec(
        head("Toldo con motor y mando", "Que se abra y se cierre con un botón, o solo cuando tú quieras.")
        + f'<p style="{P}">Motorizamos toldos nuevos y los que ya tienes instalados. Pregúntanos por sensores de viento y de sol, para que el toldo se recoja solo si se levanta el aire.</p>'
        + f'<a href="/automatismos" style="{LINK}">Ver automatismos</a>'
    )
    body += sec(
        head("Preguntas frecuentes")
        + faq(
            [
                ("¿Necesito permiso de la comunidad?", "Si vives en un edificio y el toldo se ve desde la fachada, normalmente hay que avisar o pedir autorización a la comunidad. Te ayudamos con la documentación."),
                ("¿Cofre o brazos extensibles?", "Si tu terraza está muy expuesta al sol y a la lluvia, cofre. Si buscas mucha proyección sin guías y no te importa que la tela quede a la vista, brazos extensibles."),
                ("¿Cuánto dura una lona?", "Depende de la calidad del tejido y de cuánto sol reciba. Las gamas de mayor calidad, como Plus o Soltis, aguantan mejor sol y limpiezas."),
                ("¿Hacéis toldos y pérgolas juntos?", "Sí. Si el espacio es grande o lo vas a usar todo el año, una pérgola puede darte más. Lo vemos contigo en la visita."),
            ]
        )
        + f'<a href="/pergolas" style="{LINK}">Ver pérgolas</a>'
    , bg="#FFFFFF")
    body += cta("Cuéntanos tu terraza y te asesoramos sin compromiso")
    return (
        "/toldos", "toldos.html",
        "Toldos cofre, minicofre y de brazos extensibles | AMS Cerramientos",
        "Toldos a medida en Alcalá de Henares, Madrid y Guadalajara: cofre, minicofre y brazos extensibles, con más de 200 colores de lona y motorización.",
        body,
    )


def p_rejas():
    body = hero(
        "Rejas y enrejados",
        "Rejas de hierro, forja y aluminio para puertas y ventanas",
        "Seguridad que también queda bien en la fachada. Las fabricamos a medida en nuestro taller y te las instalamos: elige un modelo de catálogo o mándanos el tuyo.",
        svg_reja(),
        "Mandar foto de la ventana",
    )
    body += sec(
        head("Modelos de reja")
        + cards(
            [
                ("Reja modelo Forja", "Estilo clásico, con pletinas y adornos de forja. Aporta carácter a fachadas de ladrillo, chalets y casas de pueblo."),
                ("Reja modelo inglés", "Líneas sobrias y limpias, para quien quiere seguridad sin protagonismo."),
                ("Reja modelo Mallorquina", "Diseño de lamas que protege del sol y de las miradas sin renunciar a la ventilación."),
                ("Tu propio diseño", "Si ya tienes un modelo en mente, una foto o un dibujo, lo valoramos y lo fabricamos."),
            ]
        )
    )
    body += sec(
        head("Macizo o tubo: qué elegir")
        + f'<p style="{P}; max-width: 780px">En vivienda recomendamos barrote macizo. Cuesta poco más que el tubo hueco y resiste mucho mejor un intento de forzado y el paso del tiempo. El tubo tiene sentido en zonas donde importa más el peso o el coste.</p>'
        + table(
            ["Material", "Cuándo elegirlo", "Lo mejor", "A tener en cuenta"],
            [
                ["Hierro macizo", "Plantas bajas, puertas y accesos", "Máxima resistencia", "Necesita pintura de calidad contra la oxidación"],
                ["Forja", "Fachadas con carácter, adornos", "Diseño a medida y pletinas decorativas", "Trabajo artesano y totalmente a medida"],
                ["Aluminio", "Zonas húmedas, mantenimiento mínimo", "No se oxida y pesa poco", "Resistencia algo menor que el hierro macizo"],
            ],
        ),
        bg="#FFFFFF",
    )
    body += sec(
        head("Cómo trabajamos")
        + steps(
            [
                ("Medición", "Vamos a ver el hueco, la fachada y el tipo de anclaje que admite."),
                ("Diseño y presupuesto", "Elegimos modelo y material, y te damos un precio cerrado."),
                ("Fabricación", "La hacemos en taller: soldadura, tratamiento y lacado en el color que quieras."),
                ("Instalación", "La anclamos y la dejamos nivelada, con la obra limpia."),
            ]
        )
    )
    body += sec(
        head("Preguntas frecuentes")
        + faq(
            [
                ("¿Puedo mandar mi propio diseño?", "Sí. Una foto o un dibujo nos vale para valorarlo y decirte qué se puede hacer."),
                ("¿Hierro o aluminio?", "Hierro si priorizas resistencia; aluminio si quieres cero mantenimiento. En zonas húmedas o con salitre suele ganar el aluminio."),
                ("¿En qué colores se hacen?", "En cualquiera de la carta de lacados. Te enseñamos las muestras antes de decidir."),
                ("¿Trabajáis para comunidades?", "Sí, rejas de portal, patios, garajes y ventanas de planta baja. Podemos incluirlo en un plan de mantenimiento."),
            ]
        )
        + f'<a href="/cancelas-puertas" style="{LINK}">Ver cancelas y puertas</a>',
        bg="#FFFFFF",
    )
    body += cta("Mándanos una foto de la ventana o la puerta y te damos precio")
    return (
        "/rejas", "rejas.html",
        "Rejas de hierro, forja y aluminio a medida | AMS Cerramientos",
        "Rejas a medida para puertas y ventanas en Alcalá de Henares, Madrid y Guadalajara: forja, inglés y mallorquina, en hierro macizo o aluminio.",
        body,
    )


def p_automatismos():
    body = hero(
        "Automatismos",
        "Automatización de puertas y cancelas: silenciosa, segura y a tu medida",
        "Motorizamos cancelas correderas, batientes, basculantes y seccionales, de vivienda o de empresa, y te las dejamos funcionando con mandos y seguridad homologada.",
        photo("/img/cancela.webp", "Cancela corredera de aluminio gris antracita en la entrada de un chalet"),
        "Mandar foto de la entrada",
    )
    body += sec(
        head("Un motor para cada tipo de puerta", "Elegimos el motor según el peso, el tamaño y el uso, para que no se queme ni se quede corto.")
        + table(
            ["Puerta", "Modelo de referencia", "Capacidad", "Alimentación"],
            [
                ["Corredera", "Motorreductor ONDA-400", "Hasta 400 kg (hasta 3.500 kg con otros equipos)", "Según modelo"],
                ["Batiente de una o dos hojas", "Operador XT2500", "Hojas de hasta 3 m", "230 V"],
                ["Basculante", "Operador ALZO 55", "Hasta 10 m²", "230 V"],
                ["Seccional", "APRIBOX 700", "Según tamaño de la puerta", "Según modelo"],
            ],
        )
        + f'<p style="{PS}">Los modelos son ejemplos de lo que instalamos con más frecuencia. Te proponemos el que corresponde tras ver tu puerta.</p>'
    )
    body += sec(
        head("Seguridad que se nota")
        + cards(
            [
                ("Fotocélulas", "La puerta se detiene sola si detecta un coche, una persona o una mascota en su recorrido."),
                ("Bandas antiaplastamiento", "Bandas de polímero homologadas según la normativa vigente, en los cantos de la hoja."),
                ("Arranque y frenado suaves", "Sin tirones ni golpes: menos desgaste y menos ruido."),
                ("Mando a distancia y domótica", "Mandos, llavero o móvil. Apertura a derecha o izquierda en correderas."),
            ]
        ),
        bg="#FFFFFF",
    )
    body += sec(
        head("También motorizamos")
        + cards(
            [
                ("Persianas y toldos", "Motores mecánicos con interruptor o por radiofrecuencia, con control de toda la vivienda o por canales.", "/persianas-cristales", "Ver persianas"),
                ("Barreras y bolardos", "Control de paso de vehículos en garajes de comunidad, empresas y parkings."),
                ("Control de accesos", "Pulsadores, teclados y lectores para vivienda, comunidades e industria."),
                ("Ventanas y techos móviles", "Apertura motorizada en ventanas de difícil acceso y techos de pérgolas."),
            ]
        )
    )
    body += sec(
        head("Cómo lo hacemos")
        + steps(
            [
                ("Visita", "Vemos tu puerta, su estado y cómo se usa."),
                ("Propuesta", "Elegimos motor, seguridad y mandos, con precio cerrado."),
                ("Instalación", "Montaje, programación y prueba de los sistemas de seguridad."),
                ("Mantenimiento", "Revisiones periódicas si lo quieres, para que no falle cuando más lo necesitas."),
            ]
        ),
        bg="#FFFFFF",
    )
    body += sec(
        head("Preguntas frecuentes")
        + faq(
            [
                ("¿Puedo automatizar la cancela que ya tengo?", "Normalmente sí, si está en buen estado y bien equilibrada. La revisamos y te decimos si merece la pena o si conviene cambiarla."),
                ("¿Qué pasa si se va la luz?", "Los operadores llevan desbloqueo manual para abrir la puerta a mano. Te explicamos cómo usarlo."),
                ("¿Trabajáis para comunidades y empresas?", "Sí. Atendemos particulares, comunidades, empresas y puertas industriales."),
                ("¿Cada cuánto hay que revisarla?", "Recomendamos una revisión periódica. Puedes contratarla dentro de un plan de mantenimiento."),
            ]
        )
        + f'<div style="display: flex; flex-wrap: wrap; gap: 24px"><a href="/cancelas-puertas" style="{LINK}">Ver cancelas y puertas</a><a href="/comunidades" style="{LINK}">Ver mantenimiento para comunidades</a></div>'
    )
    body += cta("Cuéntanos qué puerta quieres automatizar")
    return (
        "/automatismos", "automatismos.html",
        "Automatización de puertas y cancelas | AMS Cerramientos",
        "Automatismos para cancelas correderas, batientes, basculantes y seccionales en Alcalá de Henares, Madrid y Guadalajara, con fotocélulas y seguridad homologada.",
        body,
    )


def p_techos():
    body = hero(
        "Techos de aluminio",
        "Techos de aluminio: policarbonato, cristal o panel sándwich",
        "Cubre el patio, el porche o el ático con una estructura de aluminio a medida. Elige la cubierta según la luz, el aislamiento y el presupuesto.",
        svg_techos(),
        "Mandar foto del patio",
    )
    body += sec(
        head("Qué cubierta elegir")
        + table(
            ["Cubierta", "Luz", "Aislamiento", "Precio", "Mejor para"],
            [
                ["Policarbonato", "Mucha luz natural; bloquea los rayos UV", "Medio", "El más económico", "Porches, patios y terrazas en general"],
                ["Cristal", "Máxima luz y mejor aspecto", "Alto, con cámara (Climalit) y capa de control solar", "El más alto", "Áticos, jardines de invierno y casas de cristal"],
                ["Panel sándwich", "Opaco", "Muy bueno térmicamente", "Económico", "Cubrir una zona que no necesita luz: trasteros, cocheras, porches cerrados"],
            ],
        )
        + f'<p style="{PS}">El policarbonato es la opción más usada: rígido, duradero y barato. El cristal se ofrece en distintos espesores y acabados: laminado, templado, reflectante o con cámara.</p>'
    )
    body += sec(
        head("Techos fijos y techos móviles")
        + cards(
            [
                ("Techo fijo", "Una cubierta permanente en policarbonato, cristal o panel sándwich, para convertir un patio abierto en un espacio utilizable todo el año."),
                ("Techo móvil", "Se recoge de forma manual o automática para abrir el espacio cuando hace buen tiempo. Lleva más trabajo de ingeniería, y se nota en el presupuesto."),
                ("Pérgola bioclimática", "Lamas orientables para regular sol y ventilación. Es la opción más cómoda si quieres controlar la luz.", "/pergolas", "Ver pérgolas"),
                ("Jardín de invierno", "Cubierta y cerramientos de cristal para un espacio luminoso en cualquier estación.", "/cerramientos-terrazas", "Ver cerramientos"),
            ]
        ),
        bg="#FFFFFF",
    )
    body += sec(
        head("Cómo lo hacemos")
        + steps(
            [
                ("Visita y medición", "Vemos el espacio, la orientación, la pendiente y cómo evacuará el agua."),
                ("Propuesta", "Estructura, cubierta y color, con precio cerrado."),
                ("Fabricación e instalación", "Estructura de aluminio lacada en el color que elijas, montada por nuestro equipo."),
                ("Permisos", "Te decimos si hace falta licencia o comunicación previa y qué permite tu comunidad."),
            ]
        )
    )
    body += sec(
        head("Preguntas frecuentes")
        + faq(
            [
                ("¿Hace falta licencia para cubrir un patio?", "Depende del ayuntamiento y de si la cubierta es abierta o cerrada. Te lo comprobamos antes de presupuestar."),
                ("¿Se oye la lluvia?", "Más en policarbonato fino que en cristal con cámara o panel sándwich. Si te importa el ruido, te recomendamos la cubierta adecuada."),
                ("¿Qué mantenimiento necesita?", "Aluminio lacado y cubiertas se limpian con agua y jabón neutro. No se pinta ni se barniza."),
                ("¿Puedo ponerle cerramientos laterales?", "Sí. Se combina con cortinas de cristal o cerramientos de aluminio y PVC para cerrar el espacio por completo."),
            ]
        ),
        bg="#FFFFFF",
    )
    body += cta("Mándanos una foto del patio y te decimos qué cubierta te conviene")
    return (
        "/techos", "techos.html",
        "Techos de aluminio: policarbonato, cristal y panel sándwich | AMS Cerramientos",
        "Techos de aluminio fijos y móviles en Alcalá de Henares, Madrid y Guadalajara: policarbonato, cristal y panel sándwich, a medida.",
        body,
    )


def p_reparaciones():
    body = hero(
        "Reparaciones",
        "Reparaciones de persianas, cerraduras, motores y puertas",
        "Si algo no abre, no cierra o hace ruido, lo miramos. Reparamos en viviendas, comunidades, locales y naves, y te decimos con franqueza si compensa arreglar o cambiar.",
        photo("/img/antes-despues-ventana.webp", "Ventana antigua con persiana junto a la misma ventana renovada"),
        "Mandar foto de la avería",
    )
    body += sec(
        head("Qué reparamos")
        + cards(
            [
                ("Persianas", "Cinta, eje, lamas, cajón y motor. También cambio de persiana completa si compensa."),
                ("Cerraduras y bombines", "Sustitución y puesta a punto de cerraduras de seguridad, bombines y cerraduras de puertas de hierro."),
                ("Motores de puertas y cancelas", "Revisión, reparación y sustitución de motores y de los elementos de seguridad.", "/automatismos", "Ver automatismos"),
                ("Puertas metálicas y de aluminio", "Ajuste de hojas, herrajes, soldaduras, rodamientos y guías."),
                ("Ventanas y cristales", "Herrajes, gomas, cierres y cambio de vidrios, con ventana de aluminio o PVC."),
                ("Comunidades", "Puertas de portal, cierrapuertas, muelles y cerradores eléctricos de interfono.", "/comunidades", "Ver mantenimiento"),
            ]
        )
    )
    body += sec(
        head("Cómo funciona")
        + steps(
            [
                ("Cuéntanos qué pasa", "Mándanos una foto o un vídeo por WhatsApp o llámanos."),
                ("Diagnóstico", "Te decimos qué ocurre y si conviene reparar o cambiar."),
                ("Presupuesto claro", "Con el precio antes de empezar, sin sorpresas."),
                ("Reparación", "La hacemos y comprobamos que todo funciona y es seguro."),
            ]
        ),
        bg="#FFFFFF",
    )
    body += sec(
        head("Reparar o cambiar: cómo lo decidimos")
        + f'<p style="{P}; max-width: 780px">Reparamos cuando el arreglo es duradero y su coste razonable. Si la pieza ya no se fabrica, si el mismo fallo se repite o si la reparación sale casi al precio de una nueva, te lo decimos y te damos las dos opciones.</p>'
        + f'<p style="{P}; max-width: 780px">Con puertas automáticas de garaje, además comprobamos que tengan fotocélulas y bandas de seguridad. Si faltan, te las proponemos para cumplir la normativa.</p>'
    )
    body += cta("Cuéntanos qué se ha estropeado")
    return (
        "/reparaciones", "reparaciones.html",
        "Reparaciones de persianas, cerraduras, motores y puertas | AMS Cerramientos",
        "Reparamos persianas, cerraduras, motores de puertas de garaje, puertas metálicas y de aluminio en Alcalá de Henares, Madrid y Guadalajara.",
        body,
    )


NEW_PAGES = [p_toldos, p_automatismos, p_techos, p_reparaciones]
