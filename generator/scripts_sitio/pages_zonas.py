# Páginas por zona. Contenido propio de cada zona, sin datos inventados: lo que cambia es el tipo de vivienda
# y los servicios que más se piden. Los datos locales concretos (obras hechas, barrios) se añadirán con material de AMS.
from pages_new import hero, sec, head, cards, faq, steps, cta, P, PS, LINK, CARD

ZONAS = [
    ("alcala-de-henares", "Alcalá de Henares"),
    ("torrejon-de-ardoz", "Torrejón de Ardoz"),
    ("villalbilla", "Villalbilla"),
    ("coslada", "Coslada"),
    ("meco", "Meco"),
    ("azuqueca-de-henares", "Azuqueca de Henares"),
    ("guadalajara", "Guadalajara"),
    ("madrid", "Madrid capital"),
]

DATA = {
    "torrejon-de-ardoz": dict(
        nombre="Torrejón de Ardoz", prep="en", kw="Ventanas y cerramientos de aluminio y PVC",
        lead="Fabricamos y montamos ventanas, cerramientos de terraza, puertas y rejas en Torrejón de Ardoz. Estamos a pocos minutos por la A-2, así que medimos pronto y atendemos cualquier incidencia sin esperas.",
        ctx="Torrejón es una ciudad grande del Corredor del Henares, con mucha vivienda en bloque y en comunidades. Por eso lo que más nos piden es cambiar ventanas, cerrar terrazas y reparar persianas, y en comunidades, puertas de portal y garajes.",
        servicios=[("Ventanas de aluminio y PVC", "Mejoran el aislamiento y el ruido en pisos de bloque.", "/ventanas-aluminio", "Ver ventanas"), ("Cerramientos de terraza", "Con acristalamiento a medida y tramitación del permiso.", "/cerramientos-terrazas", "Ver cerramientos"), ("Comunidades", "Puertas de portal, cancelas y mantenimiento de garajes.", "/comunidades", "Ver comunidades")],
        faq=[("¿Necesito licencia para cerrar la terraza en Torrejón?", "En la mayoría de los casos sí, y además suele hacer falta el visto bueno de la comunidad. Te decimos qué documentación pide el ayuntamiento y te preparamos el presupuesto que hay que presentar."), ("¿Medís sin compromiso?", "Sí. La medición con láser es gratuita y el presupuesto es por escrito."), ("¿Cuánto tardáis?", "La fabricación lleva 2 o 3 semanas y el montaje de las ventanas de una vivienda suele ocupar uno o dos días.")],
    ),
    "villalbilla": dict(
        nombre="Villalbilla", prep="en", kw="Ventanas, cerramientos y puertas",
        lead="Nuestro taller está en Villalbilla. Si vives aquí, puedes venir a ver perfiles, vidrios y acabados antes de decidir, y te medimos en tu casa sin desplazamientos largos.",
        ctx="En Villalbilla abunda la vivienda unifamiliar y las urbanizaciones. Lo habitual son cancelas y puertas de garaje, pérgolas y cerramientos de porche, ventanas de aluminio o PVC y rejas.",
        servicios=[("Cancelas y puertas de garaje", "Aluminio soldado, correderas y batientes, con motor.", "/cancelas-puertas", "Ver cancelas"), ("Pérgolas y toldos", "Para terraza, porche y jardín.", "/pergolas", "Ver pérgolas"), ("Ventanas", "Aluminio con rotura de puente térmico y PVC Kömmerling.", "/ventanas-aluminio", "Ver ventanas")],
        faq=[("¿Puedo ir al taller?", "Sí. Llámanos o escríbenos por WhatsApp y te decimos cuándo pasarte."), ("¿Hacéis mantenimiento de puertas automáticas?", "Sí, revisamos motores, fotocélulas y elementos de seguridad."), ("¿Hacéis reparaciones urgentes?", "Miramos primero la avería con una foto o un vídeo y te decimos cómo actuar.")],
    ),
    "coslada": dict(
        nombre="Coslada", prep="en", kw="Ventanas, aislamiento y cerramientos",
        lead="Cambiamos ventanas y cerramos terrazas en Coslada. Nos centramos en el aislamiento térmico y acústico, que es lo que más pesa en una ciudad con tanto tráfico y cerca del aeropuerto.",
        ctx="Coslada es una ciudad densa, de bloques y comunidades, junto a grandes vías y bajo rutas de aviones. Por eso, más que el marco, importa el vidrio y el sellado: con vidrio laminado y cámara se nota mucho la diferencia de ruido.",
        servicios=[("Ventanas para reducir ruido", "Vidrios con cámara y laminados, y sellado a conciencia.", "/ventanas-pvc", "Ver ventanas de PVC"), ("Persianas y cajones aislados", "Donde más calor y ruido se escapa.", "/blog/cajones-persiana-aislados", "Leer la guía"), ("Cerramientos de terraza", "Para ganar espacio y confort en el piso.", "/cerramientos-terrazas", "Ver cerramientos")],
        faq=[("¿Qué ventana va mejor para el ruido?", "Depende de cuánto ruido y de dónde viene. Vidrio con cámara más laminado y un buen sellado suelen dar el mayor cambio. Te lo recomendamos tras ver tu casa."), ("¿Hacéis también persianas?", "Sí, cambiamos persianas y cajones y motorizamos si lo quieres."), ("¿Hay ayudas?", "Puede haberlas. Revisa nuestra guía de ayudas para cambiar ventanas en Madrid.")],
    ),
    "meco": dict(
        nombre="Meco", prep="en", kw="Pérgolas, cancelas, rejas y ventanas",
        lead="Trabajamos en Meco con soluciones para casas y parcelas: cancelas y puertas de garaje, pérgolas y toldos, rejas a medida y ventanas de aluminio o PVC.",
        ctx="En Meco predominan las viviendas unifamiliares y adosadas con jardín y parcela. Lo que más encaja es cerrar y proteger el exterior: cancela, reja, pérgola o techo de aluminio, además de las ventanas.",
        servicios=[("Cancelas y automatismos", "Para entrada de coches y peatonal.", "/automatismos", "Ver automatismos"), ("Cancelas de aluminio soldado", "Fabricadas a medida para tu parcela, desde 400 euros el metro cuadrado.", "/cancelas-puertas", "Ver cancelas"), ("Pérgolas y techos de aluminio", "Para disfrutar del jardín todo el año.", "/pergolas", "Ver pérgolas")],
        faq=[("¿Os desplazáis a Meco?", "Sí. Medimos en tu vivienda sin coste."), ("¿Hacéis rejas y cancelas a medida?", "Sí, las fabricamos nosotros según tu parcela y tu fachada."), ("¿Instaláis motor en una cancela ya existente?", "Normalmente sí. Lo vemos con una foto de la cancela.")],
    ),
    "azuqueca-de-henares": dict(
        nombre="Azuqueca de Henares", prep="en", kw="Ventanas y cerramientos en Guadalajara",
        lead="Atendemos Azuqueca de Henares y el resto del Corredor de Guadalajara con la misma fabricación propia: ventanas, cerramientos de terraza, puertas y cancelas.",
        ctx="Azuqueca está en la provincia de Guadalajara, a poca distancia de Alcalá. Hay vivienda adosada y en bloque, y las peticiones más habituales son cambiar ventanas y cerrar terrazas o porches.",
        servicios=[("Ventanas de aluminio y PVC", "Con medición gratuita y presupuesto por escrito.", "/ventanas-aluminio", "Ver ventanas"), ("Cerramientos de terraza y porche", "A medida y con acabados a tu gusto.", "/cerramientos-terrazas", "Ver cerramientos"), ("Cancelas y puertas", "Con motor y mantenimiento.", "/cancelas-puertas", "Ver cancelas")],
        faq=[("¿Cubrís Guadalajara?", "Sí. Trabajamos en Madrid y en Guadalajara."), ("¿Los trámites son distintos?", "Cada ayuntamiento tiene sus normas. Te decimos qué pide el tuyo antes de empezar."), ("¿Cuándo podéis venir a medir?", "Normalmente en pocos días. Escríbenos por WhatsApp y lo cuadramos.")],
    ),
    "guadalajara": dict(
        nombre="Guadalajara", prep="en", kw="Ventanas, cerramientos y automatismos",
        lead="Trabajamos en Guadalajara capital con ventanas de aluminio y PVC, cerramientos de terraza, rejas y puertas automáticas, fabricados en nuestro taller de Villalbilla.",
        ctx="En Guadalajara capital hay comunidades de vecinos, viviendas antiguas y nuevas urbanizaciones. Cambiar ventanas, aislar cajones de persiana y cerrar terrazas son los trabajos más frecuentes.",
        servicios=[("Ventanas", "Aluminio con rotura de puente térmico y PVC.", "/ventanas-aluminio", "Ver ventanas"), ("Comunidades", "Portales, garajes y mantenimiento.", "/comunidades", "Ver comunidades"), ("Reparaciones", "Persianas, cerraduras y motores.", "/reparaciones", "Ver reparaciones")],
        faq=[("¿Medís en Guadalajara capital?", "Sí, sin coste y sin compromiso."), ("¿Hacéis mantenimiento a comunidades?", "Sí. Visitas periódicas y un teléfono de aviso para las averías."), ("¿Dais garantía?", "Sí, 2 años en todos los trabajos.")],
    ),
    "madrid": dict(
        nombre="Madrid capital", prep="en", kw="Ventanas y cerramientos",
        lead="Fabricamos y montamos ventanas, cerramientos de terraza y puertas en Madrid capital. Medimos gratis y te damos el presupuesto por escrito, sin intermediarios.",
        ctx="En Madrid trabajamos sobre todo con pisos y comunidades: cambio de ventanas, cerramientos de terraza que exigen permiso de la comunidad y reformas con plazo. Te decimos qué documentación necesitas y qué ayudas puedes pedir.",
        servicios=[("Ventanas de aluminio y PVC", "A medida y con vidrio según ruido y orientación.", "/ventanas-aluminio", "Ver ventanas"), ("Cerramientos de terraza", "Con proyecto y trámites si hacen falta.", "/cerramientos-terrazas", "Ver cerramientos"), ("Ayudas", "Guía de ayudas para cambiar ventanas en Madrid.", "/blog/ayudas-cambiar-ventanas-madrid", "Leer la guía")],
        faq=[("¿Os desplazáis a toda Madrid?", "Sí. Lo vemos al darte cita para medir."), ("¿Hace falta permiso de la comunidad?", "Para cerrar una terraza o cambiar la fachada, normalmente sí. Te ayudamos a preparar el presupuesto que hay que presentar."), ("¿Cuánto cuesta una ventana?", "Como referencia de 2026, una ventana de aluminio de 120 × 120 cm instalada va de 420 a 580 €, según el vidrio.")],
    ),
}


def pagina(slug):
    d = DATA[slug]
    n = d["nombre"]
    otras = "".join(
        f'<a href="/{s}" style="padding: 8px 14px; border-radius: 999px; background: #FFFFFF; border: 1px solid #DCE2E7; font-size: 14px; color: #12202B; text-decoration: none">{t}</a>'
        for s, t in ZONAS if s != slug
    )
    body = hero(n, f"{d['kw']} {d['prep']} {n}", d["lead"],
                '<img src="/img/ventana-aluminio.webp" alt="Ventana de aluminio instalada" style="width: 100%; height: 100%; object-fit: cover; display: block">')
    body += sec(head(f"Qué hacemos {d['prep']} {n}") + f'<p style="{P}; max-width: 780px">{d["ctx"]}</p>' + cards(d["servicios"]))
    body += sec(head("Cómo trabajamos") + steps([
        ("Medición gratis", "Vamos a tu casa y medimos con láser."),
        ("Presupuesto por escrito", "Con serie, vidrio e instalación detallados."),
        ("Fabricación propia", "En nuestro taller de Villalbilla, en 2 o 3 semanas."),
        ("Montaje y garantía", "Instalación limpia y 2 años de garantía."),
    ]), bg="#FFFFFF")
    body += sec(head(f"Preguntas frecuentes {d['prep']} {n}") + faq(d["faq"]))
    body += sec(head("También trabajamos en") + f'<div style="display: flex; flex-wrap: wrap; gap: 8px">{otras}</div>')
    body += cta(f"Pide presupuesto {d['prep']} {n}")
    return (
        f"/{slug}", f"{slug}.html",
        f"{d['kw']} {d['prep']} {n} | AMS Cerramientos",
        f"{d['kw']} {d['prep']} {n}: fabricación propia, medición gratis, presupuesto por escrito y 2 años de garantía. AMS Cerramientos, Villalbilla.",
        body,
    )


ZONA_PAGES = [(lambda s=s: pagina(s)) for s, _ in ZONAS if s != "alcala-de-henares"]
