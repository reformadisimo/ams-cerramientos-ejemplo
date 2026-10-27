# Guías nuevas del blog, rehechas a partir de las entradas de la web antigua.
from pages_new import table

AH2 = "margin: 16px 0 0; font-size: clamp(24px, 5.5vw, 30px); font-weight: 800; line-height: 1.2"
AH3 = "margin: 0; font-size: 20px"
BTN_A = "display: inline-flex; align-items: center; min-height: 50px; padding: 0 22px; border-radius: 6px; background: #C2410C; color: #FFFFFF; text-decoration: none; font-weight: 700"
BTN_B = "display: inline-flex; align-items: center; min-height: 50px; padding: 0 22px; border-radius: 6px; border: 1px solid #5B6B78; color: #FFFFFF; text-decoration: none; font-weight: 600"


def h2(t): return f'<h2 style="{AH2}">{t}</h2>'
def h3(t): return f'<h3 style="{AH3}">{t}</h3>'
def p(t): return f'<p style="margin: 0">{t}</p>'
def note(t): return f'<p style="margin: 0; font-size: 15px; color: #4A5A68">{t}</p>'
def ul(items): return '<ul style="margin: 0; padding-left: 22px; display: flex; flex-direction: column; gap: 8px">' + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def art(crumb, h1, minutes, img, alt, quick, inner, cta_h, cta_p):
    return f'''<article style="max-width: 760px; margin: 0 auto; padding: 48px 24px 72px; display: flex; flex-direction: column; gap: 22px; font-size: 18px; line-height: 1.7">
<div style="font-size: 14px; color: #4A5A68"><a href="/">Inicio</a> / <a href="/blog">Blog</a> / {crumb}</div>
<h1 style="margin: 0; font-size: clamp(30px, 7vw, 44px); line-height: 1.1; font-weight: 800">{h1}</h1>
<div style="font-size: 15px; color: #4A5A68">Por el equipo de AMS Cerramientos · Revisado en octubre de 2026 · {minutes} minutos de lectura</div>
<img src="{img}" alt="{alt}" style="width: 100%; height: 380px; object-fit: cover; border-radius: 10px; display: block">
<div style="padding: 24px; background: #F3F5F7; border-radius: 10px; font-size: 17px; line-height: 1.6"><strong>Respuesta rápida:</strong> {quick}</div>
{inner}
<div style="margin-top: 16px; padding: 32px; background: #12202B; color: #FFFFFF; border-radius: 10px; display: flex; flex-direction: column; gap: 14px">
<h2 style="margin: 0; font-size: 26px; font-weight: 800; color: #FFFFFF">{cta_h}</h2>
<p style="margin: 0; font-size: 16px; color: #D3DBE2">{cta_p}</p>
<div style="display: flex; flex-wrap: wrap; gap: 12px"><a href="https://wa.me/34639788220" style="{BTN_A}">Pedir presupuesto por WhatsApp</a><a href="tel:+34639788220" style="{BTN_B}">639 78 82 20</a></div>
</div>
</article>'''


def faq(items):
    return "".join(h3(q) + p(a) for q, a in items)


def a_cancelas():
    inner = (
        h2("Por qué soldado y no atornillado")
        + p("Un bastidor atornillado o con escuadras depende de que los tornillos y los ingletes aguanten años de uso, golpes y dilataciones. Cuando se aflojan, la hoja se descuadra y empieza a rozar con el suelo o con el poste. Es la avería más habitual en cancelas baratas.")
        + p("En una cancela soldada con soldadura TIG las uniones se funden: el bastidor es una sola pieza. El cordón de soldadura se pule antes de lacar, así que no se ve y no hay rendijas donde se acumule el agua.")
        + h2("Aluminio frente a hierro")
        + table(
            ["", "Aluminio soldado", "Hierro"],
            [
                ["Peso", "Aproximadamente un tercio que el hierro: menos carga en bisagras, guías y motor", "Pesado: exige herrajes y motor más robustos"],
                ["Corrosión", "No se oxida", "Se oxida si falla la pintura o se golpea"],
                ["Mantenimiento", "Limpiar y engrasar guías", "Repintar cada cierto tiempo"],
                ["Resistencia a impactos", "Buena con perfil de 3 mm de pared", "La más alta, sobre todo en macizo"],
                ["Precio inicial", "Algo mayor", "Suele ser más barato de partida"],
            ],
        )
        + p("Si buscas la máxima resistencia a golpes, el hierro sigue siendo válido. Para una vivienda donde pesa más no tener que repintar, el aluminio sale a cuenta con los años.")
        + h2("Corredera, batiente o seccional: cómo elegir")
        + ul([
            "<strong>Corredera:</strong> necesita pared libre al lado del hueco. Es la mejor si la entrada tiene poco espacio de giro o hay pendiente hacia fuera.",
            "<strong>Batiente (una o dos hojas):</strong> necesita espacio para abrir hacia dentro y un suelo sin mucha pendiente. Es la más sencilla de mantener y suele ser la más económica.",
            "<strong>Seccional:</strong> sube en vertical y no ocupa espacio delante ni a los lados. Es la habitual en garajes con poco fondo.",
        ])
        + p("Mide con calma el espacio lateral, la pendiente de la entrada y cómo llegan los coches. Si lo dudas, mándanos una foto de la entrada y te decimos cuál encaja.")
        + h2("Diseño y color")
        + p("Se hacen con lamas horizontales o verticales, paneles ciegos, paneles perforados o vidrio de seguridad, y se combinan en una misma cancela. El lacado se hace en cualquier color de la carta RAL; el antracita mate es el más pedido porque disimula el polvo y combina con casi cualquier fachada. <a href=\"/acabados\" style=\"color: #B8430A\">Ver acabados</a>.")
        + h2("Seguridad")
        + p("Una buena cancela lleva cerradura multipunto y bulones antipalanca, y un diseño sin puntos donde meter una palanca. Es lo que se mira en una cancela de entrada a un chalet, y es lo primero que se recorta en las baratas.")
        + h2("Si la vas a motorizar")
        + p("Una cancela motorizada tiene que cumplir el marcado CE (norma UNE-EN 13241) y las normas de seguridad de uso (UNE-EN 12453). En la práctica significa fotocélulas, bandas antiaplastamiento y un motor dimensionado al peso de la hoja. Si te ofrecen un motor sin fotocélulas ni bandas, desconfía. <a href=\"/automatismos\" style=\"color: #B8430A\">Ver automatismos</a>.")
        + h2("Cuánto cuesta")
        + table(
            ["Cancela", "Medida de referencia", "Precio de referencia (2026)"],
            [
                ["Peatonal soldada", "1,5 × 2,2 m", "Desde 1.800 € + IVA"],
                ["Puerta de garaje motorizada, diseño mixto", "3,5 × 2,5 m", "Desde 4.200 € + IVA"],
                ["Automatismos con domótica", "Según motor y puerta", "A consultar"],
            ],
        )
        + p("Lo que más mueve el precio: la medida, el diseño (un panel ciego cuesta distinto que unas lamas o un vidrio de seguridad), el motor, los accesorios (mandos, domótica) y la preparación del suelo y los anclajes. Pide siempre el presupuesto por escrito, con medidas, perfil, lacado y motor detallados, para poder comparar.")
        + note("Precios de referencia orientativos; el presupuesto definitivo se da tras medir.")
        + h2("Mantenimiento")
        + ul([
            "Lávala con agua y jabón neutro; no uses disolventes ni estropajos abrasivos.",
            "Engrasa guías, rodamientos y bisagras al menos una vez al año.",
            "Revisa fotocélulas y bandas de seguridad con regularidad, aunque funcione bien.",
            "Si es de comunidad, conviene un plan de mantenimiento con revisiones periódicas. <a href=\"/comunidades\" style=\"color: #B8430A\">Ver planes</a>.",
        ])
        + h2("Errores que salen caros")
        + ul([
            "Elegir solo por precio sin comparar perfil, soldadura y lacado.",
            "Motorizar sin fotocélulas ni bandas de seguridad.",
            "No tener en cuenta la pendiente ni el espacio lateral antes de elegir corredera o batiente.",
            "No consultar las normas estéticas de la urbanización o de la comunidad.",
        ])
        + faq([
            ("¿Se puede automatizar una cancela soldada?", "Sí, y conviene decidirlo antes de fabricarla para dejar preparados los anclajes y el espacio del motor."),
            ("¿Hace falta algún permiso?", "Depende de dónde se coloque y del ayuntamiento, y las urbanizaciones suelen tener normas propias. Te ayudamos a comprobarlo antes de presupuestar."),
            ("¿Qué plazo tiene?", "Se fabrica a medida en el taller. Te damos el plazo exacto por escrito en el presupuesto."),
            ("¿En qué colores se hacen?", "En cualquiera de la carta RAL, y también en imitación madera. Te llevamos muestras para que las veas con tu luz."),
        ])
    )
    return (
        "/blog/cancelas-aluminio-soldado", "blog/cancelas-aluminio-soldado.html",
        "Cancelas de aluminio soldado: lo que debes saber antes de comprar | AMS Cerramientos",
        "Guía de cancelas de aluminio soldado: diferencias con el hierro, corredera o batiente, seguridad, normativa del motor, precios de referencia y mantenimiento.",
        art("Cancelas de aluminio soldado",
            "Cancelas de aluminio soldado: lo que debes saber antes de comprar", 6,
            "/img/cancela.webp", "Cancela corredera de aluminio gris antracita en la entrada de un chalet",
            "una cancela de aluminio soldado es lo que recomendamos para la mayoría de viviendas. Pesa aproximadamente un tercio que una de hierro, no se oxida y, al ir soldada, no se descuadra con el uso. Como referencia de 2026, una peatonal de 1,5 × 2,2 m parte de <strong>1.800 € + IVA</strong> y una puerta de garaje motorizada de 3,5 × 2,5 m, de <strong>4.200 € + IVA</strong>.",
            inner,
            "¿Quieres una cancela a medida?",
            "Te medimos la entrada gratis y te damos el presupuesto por escrito, con medidas, perfil, lacado y motor detallados."),
    )


def a_oscilobatientes():
    inner = (
        h2("Cómo funciona una oscilobatiente")
        + p("Tiene una sola manilla con tres posiciones. En vertical, la ventana está cerrada. Girada a la horizontal, se abre como una puerta, hacia dentro. Girada hacia arriba, se inclina desde la parte superior y queda entreabierta para ventilar.")
        + h2("Ventajas y límites")
        + ul([
            "<strong>Ventila sin abrir del todo.</strong> Inclinada, entra aire aunque llueva, y no hay riesgo de portazos ni de caídas con niños pequeños.",
            "<strong>Cierra por varios puntos.</strong> El herraje sujeta la hoja en todo su perímetro, lo que mejora la estanqueidad y dificulta el forzado.",
            "<strong>Se limpia desde dentro.</strong> Abierta del todo, alcanzas el cristal exterior.",
            "<strong>Cuesta más que una practicable simple</strong> por el herraje. Es la pieza que más define cuánto dura la ventana.",
            "<strong>La hoja abierta ocupa espacio dentro.</strong> Hay que contar con cortinas, muebles y radiadores.",
        ])
        + p("En huecos muy anchos o con hojas muy pesadas, a veces conviene otra solución: una corredera o dividir el hueco en dos hojas.")
        + h2("Aluminio o PVC")
        + table(
            ["", "Aluminio con rotura de puente térmico", "PVC"],
            [
                ["Aislamiento", "Muy bueno con vidrio adecuado", "El mejor de partida"],
                ["Perfiles", "Finos, con más cristal", "Más anchos"],
                ["Huecos grandes", "Es su punto fuerte", "Posible, con refuerzos"],
                ["Mantenimiento", "Mínimo", "Mínimo"],
                ["Precio", "Algo mayor", "Suele ser menor en vivienda estándar"],
            ],
        )
        + p("No hay una respuesta única: depende de tu casa y del presupuesto. Lo explicamos con casos en la guía <a href=\"/blog/pvc-o-aluminio\" style=\"color: #B8430A\">PVC o aluminio</a>.")
        + h2("El vidrio importa tanto como el marco")
        + table(
            ["Configuración (120 × 120 cm)", "Uw (W/m²K)", "Ruido Rw (dB)", "Precio 2026"],
            [
                ["RPT + doble vidrio 4/12/4", "1,9", "31", "420 €"],
                ["RPT + doble vidrio 4/16/4 con argón", "1,5", "33", "480 €"],
                ["RPT + doble bajo emisivo y control solar", "1,4", "34", "510 €"],
                ["RPT + triple vidrio 4/12/4/12/4", "1,1", "37", "580 €"],
            ],
        )
        + note("Precios de la tabla de ventanas de aluminio con instalación incluida. El herraje oscilobatiente se detalla aparte en el presupuesto. Cuanto más bajo el Uw, menos calor pierde la ventana; cuanto más alto el Rw, más ruido frena.")
        + p("Si vives junto a una calle con tráfico, el vidrio con cámara y los vidrios laminados para ruido marcan más diferencia que el material del marco.")
        + h2("Errores que salen caros")
        + ul([
            "<strong>Ahorrar en el herraje.</strong> Un herraje flojo hace que la hoja se descuelgue y roce en pocos años.",
            "<strong>Medir a ojo.</strong> Medimos con láser para que la ventana entre al milímetro.",
            "<strong>Instalar sin sellar bien.</strong> Una buena ventana mal sellada pierde buena parte de su aislamiento.",
            "<strong>Elegir el vidrio por precio.</strong> Es lo que determina el confort térmico y el ruido.",
            "<strong>Olvidar el cajón de persiana.</strong> Si es antiguo, conviene cambiarlo a la vez: por ahí se escapa calor.",
            "<strong>Comparar presupuestos que no son comparables.</strong> Mira que incluyan la misma serie, el mismo vidrio, la instalación y la retirada de las ventanas viejas.",
        ])
        + h2("Plazos y proceso")
        + p("Medimos gratis con láser, fabricamos en nuestro taller en 2 o 3 semanas y montamos con fijación mecánica y sellado. La instalación suele llevar uno o dos días. <a href=\"/ventanas-aluminio\" style=\"color: #B8430A\">Ver ventanas de aluminio</a>.")
        + h2("En Alcalá de Henares")
        + p("Si vives en una comunidad, el color y el tipo de ventana suelen estar fijados por los estatutos o por acuerdo de la junta: pregunta antes de decidir. Para pisos cerca de vías con tráfico, prioriza el vidrio y el sellado. Cubrimos Alcalá y todo el Corredor del Henares. <a href=\"/alcala-de-henares\" style=\"color: #B8430A\">Ver Alcalá de Henares</a>.")
        + faq([
            ("¿Oscilobatiente o practicable?", "Si quieres ventilar con seguridad y que la ventana se cierre por varios puntos, oscilobatiente. Si buscas lo más económico y no necesitas la posición de ventilación, practicable."),
            ("¿Se puede poner mosquitera?", "Sí, con mosquitera enrollable o fija. Te recomendamos el modelo según cómo abra la ventana."),
            ("¿Cuánto dura?", "Con buen herraje y un mantenimiento mínimo, muchos años. Conviene engrasar el herraje de vez en cuando."),
            ("¿Vale para todas las habitaciones?", "Sí. Es especialmente cómoda en dormitorios y baños, donde interesa ventilar sin abrir del todo."),
        ])
    )
    return (
        "/blog/ventanas-oscilobatientes", "blog/ventanas-oscilobatientes.html",
        "Ventanas oscilobatientes en Alcalá de Henares: precios y materiales | AMS Cerramientos",
        "Guía de ventanas oscilobatientes: cómo funcionan, ventajas y límites, aluminio o PVC, vidrio, precios de referencia y errores que salen caros.",
        art("Ventanas oscilobatientes",
            "Ventanas oscilobatientes en Alcalá de Henares: guía de precios y materiales para no equivocarte", 7,
            "/img/mujer-luz.jpg", "Mujer abriendo una ventana en un salón con mucha luz",
            "una oscilobatiente es la ventana que se abre como una puerta y también se inclina desde arriba para ventilar. Es la más cómoda para dormitorios y la que mejor equilibra ventilación y seguridad. Como referencia de 2026, una ventana de aluminio con rotura de puente térmico de 120 × 120 cm, instalada, va de <strong>420 €</strong> (doble vidrio básico) a <strong>580 €</strong> (triple vidrio).",
            inner,
            "¿Cambias las ventanas de casa?",
            "Te medimos gratis con láser y te damos el presupuesto por escrito, con serie, vidrio e instalación detallados."),
    )


def a_instalacion_pvc():
    inner = (
        h2("Qué incluye una buena instalación")
        + ul([
            "<strong>Medición con láser en obra</strong>, hueco a hueco, antes de fabricar.",
            "<strong>Retirada de la ventana vieja</strong> y de los escombros.",
            "<strong>Colocación del marco</strong> nivelado y a plomo, con fijación mecánica.",
            "<strong>Sellado perimetral</strong> con espuma y silicona adecuada, por dentro y por fuera.",
            "<strong>Ajuste de herrajes</strong> y comprobación de apertura y cierre.",
            "<strong>Remates</strong> y limpieza de la zona de trabajo.",
        ])
        + h2("Paso a paso y cuánto se tarda")
        + table(
            ["Fase", "Qué ocurre", "Tiempo orientativo"],
            [
                ["Visita y medición", "Medimos con láser y revisamos el estado del hueco", "Sin compromiso, en tu casa"],
                ["Fabricación", "Se fabrican las ventanas a medida", "2 a 3 semanas"],
                ["Instalación", "Desmontaje, colocación, sellado y ajuste", "Uno o dos días en una vivienda estándar"],
                ["Revisión", "Comprobamos el cierre y los remates", "El mismo día"],
            ],
        )
        + note("Los plazos dependen del número de ventanas y de la obra. Te los confirmamos por escrito en el presupuesto.")
        + h2("Por qué el sellado importa tanto")
        + p("Una ventana de PVC excelente mal sellada pierde buena parte de su aislamiento: el aire pasa por la junta entre el marco y la pared. Un buen sellado evita corrientes, humedades y condensaciones, y es lo que más se nota en la factura de la calefacción.")
        + h2("Errores frecuentes al instalar")
        + ul([
            "Fijar solo con espuma, sin tornillería en el marco.",
            "No dejar holgura para la dilatación del PVC.",
            "Olvidar sellar por el exterior.",
            "Dejar el cajón de persiana antiguo sin tratar.",
            "No comprobar el ajuste de los herrajes antes de irse.",
        ])
        + h2("Antes de instalar, ten en cuenta")
        + p("Si vives en una comunidad, consulta si hay normas sobre color o diseño de ventanas. Si buscas ayudas, revisa las <a href=\"/blog/ayudas-cambiar-ventanas-madrid\" style=\"color: #B8430A\">ayudas para cambiar ventanas en Madrid</a> antes de firmar. Más información en <a href=\"/ventanas-pvc\" style=\"color: #B8430A\">ventanas de PVC Kömmerling</a>.")
        + faq([
            ("¿Hay que hacer obra?", "Normalmente no: se retira la ventana vieja y se coloca la nueva en el mismo hueco, con remates mínimos."),
            ("¿Tengo que estar en casa?", "Conviene que alguien esté al inicio para indicar las ventanas y al final para revisar el trabajo."),
            ("¿Se puede instalar en invierno?", "Sí. El trabajo por ventana es corto, así que la casa queda poco tiempo con el hueco abierto."),
        ])
    )
    return (
        "/blog/instalacion-ventanas-pvc", "blog/instalacion-ventanas-pvc.html",
        "Cómo se instala bien una ventana de PVC y cuánto se tarda | AMS Cerramientos",
        "Cómo es una instalación correcta de ventanas de PVC: pasos, plazos, sellado y errores que conviene evitar.",
        art("Instalación de ventanas de PVC",
            "Cómo se instala bien una ventana de PVC y cuánto se tarda", 5,
            "/img/lapiz-medicion.jpg", "Manos marcando una medida con lápiz y regla antes de cortar",
            "una instalación bien hecha incluye medición con láser, retirada de la ventana vieja, colocación con fijación mecánica y sellado completo. Suele llevar <strong>uno o dos días</strong>, tras 2 o 3 semanas de fabricación.",
            inner,
            "¿Quieres cambiar tus ventanas?",
            "Te medimos gratis y te damos el presupuesto por escrito, con la instalación incluida."),
    )


def a_cajones():
    inner = (
        h2("Por qué se escapa el calor por el cajón")
        + p("El cajón de persiana es un hueco en la pared, a menudo con paredes finas y sin aislar. En viviendas antiguas es un puente térmico: entra frío en invierno, calor en verano, ruido de la calle y corrientes. Puedes tener ventanas nuevas excelentes y seguir perdiendo confort por ahí.")
        + h2("Señales de que tu cajón es un problema")
        + ul([
            "Notas aire frío al acercar la mano a la tapa.",
            "Aparecen manchas de condensación o moho encima de la ventana.",
            "Oyes la calle con la persiana bajada.",
            "La pared junto al cajón está más fría que el resto.",
            "La cinta o el eje de la persiana tienen holguras.",
        ])
        + h2("Soluciones, de menos a más completa")
        + table(
            ["Solución", "Qué se hace", "Cuándo conviene"],
            [
                ["Aislar el cajón existente", "Se coloca aislante dentro y se sellan las juntas", "Cuando el cajón está en buen estado y solo hay que mejorarlo"],
                ["Cajón nuevo aislado", "Se sustituye por un cajón de PVC o aluminio con aislamiento integrado", "Al cambiar las ventanas: es el momento ideal"],
                ["Cajón exterior o monoblock", "Se integra en el conjunto de la ventana", "Obra nueva o reformas con ventanas nuevas"],
            ],
        )
        + p("Hay sistemas de cajón aislado de fabricantes como Kömmerling, que ofrece los suyos para su gama de PVC. Te recomendamos el modelo según tu hueco y tu presupuesto.")
        + h2("El mejor momento: cuando cambias las ventanas")
        + p("Si vas a cambiar las ventanas, cambia también el cajón: se hace en el mismo trabajo, sin repetir obra ni remates. Si lo dejas para después, tendrás que desmontar parte de lo ya instalado. <a href=\"/persianas-cristales\" style=\"color: #B8430A\">Ver persianas</a> y <a href=\"/ventanas-pvc\" style=\"color: #B8430A\">ventanas de PVC</a>.")
        + faq([
            ("¿Se puede aislar sin cambiar la ventana?", "Sí, si el cajón está accesible y en buen estado. Te decimos tras verlo si compensa."),
            ("¿Se puede motorizar la persiana a la vez?", "Sí. Es buen momento, porque el cajón queda abierto. Lo vemos en el presupuesto."),
            ("¿Cuánto se ahorra?", "Depende de la vivienda y del estado del cajón. Si el cajón no está aislado, es una de las mejoras que más se nota en confort."),
        ])
    )
    return (
        "/blog/cajones-persiana-aislados", "blog/cajones-persiana-aislados.html",
        "Cajones de persiana: por qué se escapa el calor y cómo evitarlo | AMS Cerramientos",
        "Por qué el cajón de persiana pierde calor, cómo detectarlo y qué soluciones hay: aislarlo o cambiarlo junto a las ventanas.",
        art("Cajones de persiana",
            "Cajones de persiana: por qué por ahí se escapa el calor y cómo evitarlo", 5,
            "/img/arquitecto-mesa.jpg", "Técnico trabajando sobre un tablero de dibujo con planos",
            "el cajón de persiana suele ser un hueco sin aislar y es un puente térmico. Se soluciona aislándolo o, mejor, <strong>sustituyéndolo por uno aislado al cambiar las ventanas</strong>.",
            inner,
            "¿Notas frío o ruido por la persiana?",
            "Revisamos tu cajón sin compromiso y te decimos si compensa aislarlo o cambiarlo."),
    )


def a_rpt():
    inner = (
        h2("Qué es la rotura de puente térmico")
        + p("El aluminio conduce muy bien el calor. Una ventana de aluminio normal, de una sola pieza, transmite el frío de la calle hasta el perfil interior en invierno y el calor en verano. Eso es un puente térmico.")
        + p("La rotura de puente térmico (RPT) corta ese camino. El perfil se fabrica en dos mitades, una exterior y otra interior, unidas por barras de poliamida, un material plástico que apenas conduce el calor. Así el frío no llega al interior y el marco sigue siendo de aluminio.")
        + h2("Para qué sirve en casa")
        + ul([
            "<strong>Menos pérdida de calor y de frío.</strong> La ventana aísla mucho más que una de aluminio sin rotura.",
            "<strong>Menos condensación.</strong> El marco interior no se enfría tanto, así que se forma menos humedad en el perfil y menos moho en las esquinas.",
            "<strong>Más confort cerca de la ventana.</strong> No notas esa pared fría junto al cristal.",
            "<strong>Perfiles finos y más cristal.</strong> Mantienes las ventajas del aluminio: estructura fuerte y líneas delgadas.",
        ])
        + h2("Con RPT, sin RPT y PVC")
        + table(
            ["", "Aluminio sin RPT", "Aluminio con RPT", "PVC"],
            [
                ["Aislamiento térmico", "Bajo", "Muy bueno con el vidrio adecuado", "El mejor de partida"],
                ["Condensación en el marco", "Habitual", "Mucho menor", "Muy baja"],
                ["Perfiles", "Finos", "Finos", "Más anchos"],
                ["Huecos grandes", "Sí", "Sí, es su punto fuerte", "Posible, con refuerzos"],
                ["Uso recomendado", "Interiores y locales sin necesidad de aislar", "Fachada de vivienda", "Fachada de vivienda"],
            ],
        )
        + p("Para una vivienda en el Corredor del Henares, donde hay inviernos fríos y veranos calurosos, nuestra recomendación es no instalar nunca ventanas sin rotura de puente térmico en fachada. Si dudas entre aluminio con RPT y PVC, lo explicamos en la guía <a href=\"/blog/pvc-o-aluminio\" style=\"color: #B8430A\">PVC o aluminio</a>.")
        + h2("El vidrio manda tanto como el marco")
        + p("Una ventana con rotura de puente térmico y un vidrio sencillo sigue perdiendo calor por el cristal, que es la mayor parte de la superficie. Como referencia para una ventana de 120 × 120 cm con RPT, la transmitancia térmica (Uw) baja de 1,9 con doble vidrio básico a 1,1 con triple vidrio. Cuanto más baja, mejor aísla. Tienes la tabla completa, con precios, en la guía de <a href=\"/blog/ventanas-oscilobatientes\" style=\"color: #B8430A\">ventanas oscilobatientes</a>.")
        + h2("Cómo comprobar que tu ventana tiene rotura de puente térmico")
        + ul([
            "Mira el canto del perfil con la ventana abierta: verás dos partes de aluminio separadas por una franja negra o gris de plástico.",
            "En invierno, toca el marco interior: si está casi tan frío como la calle, probablemente no tiene rotura.",
            "Si aparece agua o moho en el marco por dentro cada invierno, es otra señal.",
            "Pide siempre que el presupuesto indique la serie del perfil y el vidrio, no solo \"ventana de aluminio\".",
        ])
        + h2("Qué ofrecemos en AMS")
        + p("Fabricamos ventanas de aluminio con rotura de puente térmico en nuestro taller de Villalbilla, con la serie y el vidrio que más se ajustan a tu casa. Medimos gratis y te damos el presupuesto por escrito. <a href=\"/ventanas-aluminio\" style=\"color: #B8430A\">Ver ventanas de aluminio</a>.")
        + faq([
            ("¿Es lo mismo RPT que doble vidrio?", "No. La rotura de puente térmico está en el marco; el doble vidrio, en el cristal. Una buena ventana necesita las dos cosas."),
            ("¿Se puede añadir la rotura a una ventana que ya tengo?", "No. Va dentro del perfil, así que hay que cambiar la ventana."),
            ("¿Cuesta mucho más que sin rotura?", "Cuesta algo más, y se compensa con el ahorro en calefacción y aire acondicionado y con más confort. Te damos las dos opciones si quieres compararlas."),
            ("¿PVC o aluminio con RPT?", "El PVC aísla algo más de partida y suele ser más económico. El aluminio con RPT permite perfiles más finos y grandes superficies de cristal."),
        ])
    )
    return (
        "/blog/rotura-puente-termico", "blog/rotura-puente-termico.html",
        "Qué es la rotura de puente térmico y para qué sirve | AMS Cerramientos",
        "Qué es la rotura de puente térmico en ventanas de aluminio, para qué sirve, cómo se compara con el PVC y cómo saber si tu ventana la tiene.",
        art("Rotura de puente térmico",
            "¿Qué es la rotura de puente térmico y para qué sirve?", 6,
            "/img/taller-hombre.jpg", "Operario en un taller de carpintería de aluminio junto a una ventana",
            "es una barra de poliamida que separa el perfil de aluminio en una mitad exterior y otra interior para que el frío y el calor no pasen. Una ventana de aluminio <strong>con rotura de puente térmico</strong> aísla mucho mejor y condensa menos que una sin ella. En fachada de vivienda es lo mínimo que recomendamos.",
            inner,
            "¿Quieres ventanas que aíslen de verdad?",
            "Te medimos gratis y te damos el presupuesto por escrito, con la serie y el vidrio detallados."),
    )



def _ret(url, titulo_seo, desc, crumb, h1, minutes, img, alt, quick, inner, cta_h, cta_p):
    return (url, url.lstrip("/") + ".html", titulo_seo + " | AMS Cerramientos", desc, art(crumb, h1, minutes, img, alt, quick, inner, cta_h, cta_p))


def a_epoca():
    inner = (
        h2("Se pueden cambiar todo el año, pero hay meses mejores")
        + p("Una ventana se instala en uno o dos días por vivienda, así que el tiempo importa menos de lo que parece. Aun así, durante ese tiempo los huecos quedan abiertos o protegidos solo con medios provisionales. Cuanto más suave el día, menos lo notas.")
        + table(
            ["Época", "Ventajas", "Inconvenientes"],
            [
                ["Primavera (marzo a mayo)", "Temperaturas suaves, días largos, poca lluvia. Llegas al verano con la casa ya aislada.", "Es temporada alta: conviene pedir con tiempo."],
                ["Otoño (septiembre a noviembre)", "Clima templado y casa lista antes del frío. Es el momento ideal para empezar a medir.", "Si esperas a diciembre, los plazos se aprietan."],
                ["Invierno", "Menos demanda, más disponibilidad de fecha. Notas la mejora desde la primera noche.", "Hay que usar espumas y selladores de invierno (los normales no curan bien con frío) y elegir días sin lluvia fuerte ni heladas."],
                ["Verano", "Se puede trabajar sin problema de lluvia.", "Calor en obra y en casa mientras dura el cambio."],
            ],
        )
        + h2("Lo que de verdad marca el calendario: la fabricación")
        + p("Las ventanas se fabrican a medida en el taller, normalmente en 2 o 3 semanas desde que se confirma el presupuesto. Si quieres tenerlas puestas antes de las primeras heladas, lo sensato es pedir presupuesto y que midan a finales de verano o principios de otoño.")
        + h2("Cómo se organiza el cambio para que molesten lo mínimo")
        + ul([
            "Se mide antes, con láser, y se confirma por escrito la serie, el vidrio y el color.",
            "El día de montaje se trabaja por habitaciones: no se abren todos los huecos a la vez.",
            "Se retiran las ventanas viejas y los escombros el mismo día.",
            "Se sella el perímetro por dentro y por fuera para que no haya filtraciones ni puentes de frío.",
        ])
        + p("Si vives en comunidad, comprueba antes si hay normas de color o de aspecto exterior. Lo contamos con más detalle en la guía de <a href=\"/blog/instalacion-ventanas-pvc\" style=\"color: #B8430A\">cómo se instala bien una ventana de PVC</a>.")
        + h2("Y las ayudas, ¿condicionan la fecha?")
        + p("Algunas ayudas o deducciones exigen presentar documentación antes de empezar la obra. Si piensas pedir una, consúltalo antes de firmar. Repasamos qué hay y cómo gestionarlo en <a href=\"/blog/ayudas-cambiar-ventanas-madrid\" style=\"color: #B8430A\">la guía de ayudas para cambiar ventanas en Madrid</a>.")
        + faq([
            ("¿Cuál es la mejor época para cambiar las ventanas?", "Primavera y otoño, por el clima suave. Pero puede hacerse en cualquier estación: el montaje dura uno o dos días."),
            ("¿Cuánto se tarda desde que pido presupuesto?", "Medición y presupuesto, unos días; fabricación a medida, 2 o 3 semanas; montaje, uno o dos días según el número de ventanas."),
            ("¿Se puede cambiar en invierno?", "Sí. Se planifica por habitaciones y se evitan los días de lluvia fuerte o helada. Es una época con más disponibilidad de fecha."),
            ("¿Tengo que estar en casa?", "Conviene que alguien esté para abrir y para revisar el resultado al terminar. Lo hablamos al fijar el día."),
        ])
    )
    return _ret("/blog/mejor-epoca-cambiar-ventanas", "¿Cuál es la mejor época del año para cambiar las ventanas?",
        "Cuál es la mejor época para cambiar las ventanas en Madrid: ventajas por estación, plazos de fabricación y cómo planificar el montaje para molestar lo mínimo.",
        "Mejor época para cambiar ventanas", "¿Cuál es la mejor época del año para cambiar las ventanas de casa?", 5,
        "/img/obra-balcon.jpg", "Vivienda en obra con una puerta de balcón recién colocada",
        "primavera y otoño, por el clima suave y porque llegas al verano o al invierno con la casa ya aislada. Pero se puede cambiar en cualquier época: el montaje dura uno o dos días y lo que de verdad marca el calendario es la fabricación a medida, de 2 o 3 semanas.",
        inner, "¿Quieres tus ventanas antes del frío?", "Te medimos gratis y te decimos fechas reales de fabricación y montaje, por escrito.")


def a_mantenimiento():
    inner = (
        p("Una ventana de PVC o de aluminio lacado no se pinta ni se barniza, y esa es su ventaja. Pero \"sin mantenimiento\" no existe: hay cuatro cosas que conviene hacer de vez en cuando y varias que no hay que hacer nunca. Lo que sigue sale de la guía de mantenimiento del propio fabricante de los perfiles (Kömmerling) y de nuestra experiencia reparando ventanas ajenas.")
        + h2("Los perfiles: agua tibia y jabón neutro")
        + ul([
            "Limpia marcos y hojas, por dentro y por fuera, con agua tibia, un poco de jabón neutro y un paño suave. Aclara con agua y seca.",
            "<strong>Nunca</strong> uses lejía, amoníaco, alcohol, disolventes ni productos concentrados, ni estropajos: atacan la superficie del perfil y lo rayan. Es el error más habitual y el que más se nota después.",
            "Si el PVC blanco ha cogido tono, existen limpiadores específicos de perfil (el fabricante recomienda Koraclean). Pruébalo antes en una esquina.",
            "El cristal, con limpiacristales o agua y jabón, procurando no mojar de más los perfiles.",
        ])
        + h2("Lo que casi nadie hace y evita averías")
        + table(
            ["Qué", "Cuándo", "Para qué"],
            [
                ["Desagües del marco (canaletas y orificios inferiores)", "Cada limpieza, dos o tres veces al año", "Si se tapan, el agua de lluvia no sale y acaba en la pared o en el suelo"],
                ["Juntas de goma", "Limpiar con agua y jabón; producto de cuidado de juntas una vez al año", "Que no se resequen ni se agrieten; son las que sellan"],
                ["Herrajes (bisagras, cierres, manilla)", "Una o dos veces al año", "Que la ventana cierre bien y no se descuelgue"],
                ["Raíles de las correderas", "Cada limpieza", "La arenilla desgasta las ruedas y la hoja se atasca"],
            ],
        )
        + p("Para los herrajes, usa grasa en spray apropiada o aceite fino sin ácidos (los aceites ácidos oxidan el metal). Unas gotas en cada punto de giro y cierre, y abrir y cerrar varias veces para repartir. No fuerces nunca una manilla dura: casi siempre es herraje seco o desajustado, y se arregla en minutos si no se rompe antes.")
        + h2("Un detalle de obra nueva: quita el plástico protector")
        + p("Los perfiles nuevos llegan con una película protectora. Hay que quitarla cuanto antes y, como máximo, a los tres meses de la instalación: con el sol se endurece y acaba pegada, y luego cuesta muchísimo sacarla sin dejar restos.")
        + h2("Cuándo no es mantenimiento, sino avería")
        + ul([
            "La hoja roza con el marco o cuesta cerrarla: se ha descolgado. Se reajusta con las bisagras; cuanto antes, mejor.",
            "Notas corriente por una zona concreta: junta deformada o rota.",
            "Humedad o moho persistentes en el marco: mira la guía de <a href=\"/blog/condensacion-ventanas\" style=\"color: #B8430A\">condensación</a> para distinguir si es ventilación o es la ventana.",
            "Agua entre los dos cristales: se ha roto el sellado de la cámara y hay que cambiar el vidrio.",
        ])
        + faq([
            ("¿Cada cuánto hay que limpiar las ventanas de PVC?", "A fondo, dos o tres veces al año; el fabricante habla de limpiar los perfiles con regularidad, y algunas guías de consumo recomiendan hacerlo cada mes. En zonas con polvo de obra o tráfico, más a menudo."),
            ("¿Puedo usar lejía para blanquear el PVC?", "No. Ni lejía ni alcohol ni disolventes: dañan la superficie. Usa jabón neutro o un limpiador específico de perfil."),
            ("¿Cada cuánto se engrasan los herrajes?", "Una vez al año según el fabricante de los perfiles; dos veces, según otras guías. Si la ventana se usa mucho (cocina, baño), dos."),
            ("¿Las ventanas de aluminio se oxidan?", "El aluminio no se oxida como el hierro, pero el lacado se puede dañar por productos agresivos o golpes. Mismo cuidado: agua, jabón neutro y paño."),
            ("¿Qué hago con el plástico protector que no sale?", "Cuanto más tiempo lleva, peor sale. Prueba con calor suave y tirando despacio; si deja restos, pregunta a quien instaló antes de usar disolventes."),
        ])
    )
    return _ret("/blog/mantenimiento-limpieza-ventanas", "Mantenimiento y limpieza de ventanas de PVC y aluminio",
        "Cómo limpiar y mantener ventanas de PVC y aluminio según el fabricante: productos permitidos y prohibidos, desagües, juntas, herrajes, correderas y el film protector.",
        "Mantenimiento y limpieza de ventanas", "Cómo limpiar y mantener ventanas de PVC y aluminio sin estropearlas", 6,
        "/img/villa-cristal.jpg", "Fachada de una casa con grandes ventanales de aluminio y cristal",
        "agua tibia con jabón neutro y un paño suave, nunca lejía, alcohol, disolventes ni estropajos. Además, una vez o dos al año: limpiar desagües y raíles, cuidar las juntas y engrasar los herrajes con aceite sin ácidos. Y quitar el film protector antes de los tres meses.",
        inner, "¿Tus ventanas ya no cierran como antes?", "Mándanos una foto o una descripción y te decimos si basta con un reajuste o conviene cambiarlas.")


def a_kommerling():
    inner = (
        p("Si has pedido presupuesto de ventanas de PVC en la zona, es probable que te hayan hablado de Kömmerling 76 AD o 76 MD, a veces con el apellido \"Xtrem\". Suenan a lo mismo y casi lo son: los dos son sistemas de 76 mm de profundidad de la misma familia. Pero no son iguales, y la diferencia se nota en el catálogo y, según el caso, en la factura. Esto es lo que dicen las fichas técnicas del fabricante, sin adornos.")
        + h2("La comparación, con datos de las fichas del fabricante")
        + table(
            ["", "Kömmerling 76 AD", "Kömmerling 76 MD Xtrem"],
            [
                ["Profundidad del perfil", "76 mm", "76 mm"],
                ["Cámaras estancas", "5", "6"],
                ["Juntas", "Doble junta", "Triple junta central y una cuarta junta en la hoja"],
                ["Uf (marco)", "Desde 1,10 W/m²K", "Desde 1,00 W/m²K"],
                ["Uw (ventana completa)", "Desde 0,83 W/m²K con vidrio Ug 0,6 (el fabricante cita hasta 0,76 en otras configuraciones)", "Desde 0,73 W/m²K"],
                ["Aislamiento acústico", "Hasta 47 dB", "Hasta 47 dB"],
                ["Permeabilidad al aire", "Clase 4 (la máxima)", "Clase 4 (la máxima)"],
                ["Estanqueidad al agua", "E1950", "E1350"],
                ["Resistencia al viento", "Clase C5", "Clase C5"],
                ["Profundidad de galce (vidrio)", "16 a 50 mm", "16 a 50 mm"],
                ["Refuerzo", "Acero zincado de alta inercia", "Acero zincado de alta inercia"],
            ],
        )
        + note("Fuente: fichas técnicas de Kömmerling España (<a href=\"https://documentacion.generadordeprecios.info/documentaciontecnica/kommerling/komm_76ad.pdf\" rel=\"noopener\" style=\"color: #B8430A\">76 AD</a> y <a href=\"https://www.kommerling.es/sites/default/files/document/ficha_tecnica_kommerling76_md_xtrem.pdf\" rel=\"noopener\" style=\"color: #B8430A\">76 MD Xtrem</a>). Son valores de laboratorio con el vidrio indicado en cada ficha: los de tu ventana dependen del vidrio, del tamaño y de la instalación.")
        + h2("Qué significan esos números en tu casa")
        + ul([
            "<strong>Uf y Uw:</strong> miden cuánto calor se escapa; cuanto más bajo, mejor. Casi todo el valor lo pone el vidrio. Pasar de un Uw de 0,83 a 0,73 es una mejora real pero pequeña; pasar de un doble vidrio normal a uno con cámara de argón y baja emisividad es un salto mucho mayor.",
            "<strong>Cámaras y juntas:</strong> el MD añade una cámara y una junta más. En la práctica sella algo mejor, aunque con la clase 4 de permeabilidad al aire ambos ya están en el nivel más alto que mide la norma.",
            "<strong>47 dB:</strong> es el máximo con vidrio laminado acústico de gran espesor. Con un doble vidrio estándar el resultado es bastante menor. Si el motivo del cambio es el ruido, pregunta por el vidrio antes que por la serie.",
            "<strong>E1950 frente a E1350:</strong> es la resistencia a la lluvia con viento. Son clases altas las dos; la del AD figura algo más alta en su ficha. Para una vivienda en el Corredor del Henares, las dos sobran.",
            "<strong>Galce de 16 a 50 mm:</strong> es el grosor de vidrio que admite el perfil, lo que permite desde un doble vidrio normal hasta uno triple.",
        ])
        + h2("Entonces, ¿cuál elegir?")
        + p("Para la mayoría de viviendas, cualquiera de los dos cumple con holgura. Nuestro criterio, que puedes discutirnos:")
        + ul([
            "<strong>76 AD:</strong> cuando quieres una estética más recta y limpia, buen aislamiento y el mejor ajuste de precio. Es la opción razonable para un piso o una casa estándar.",
            "<strong>76 MD Xtrem:</strong> cuando buscas el mejor aislamiento posible (casa muy expuesta, obra de eficiencia energética, objetivo de consumo casi nulo) y el presupuesto lo permite.",
        ])
        + p("Y recuerda que la ventana es un conjunto: perfil, vidrio, herraje e instalación. Una serie excelente mal instalada rinde menos que una serie correcta bien montada. Por eso importa quién la coloca. Si quieres comparar con el aluminio, tienes la guía <a href=\"/blog/pvc-o-aluminio\" style=\"color: #B8430A\">PVC o aluminio</a>, y toda la gama en <a href=\"/ventanas-pvc\" style=\"color: #B8430A\">ventanas de PVC Kömmerling</a>.")
        + h2("Garantía")
        + p("El fabricante da 10 años de garantía en la resistencia al impacto de los perfiles, según su ficha de sistema. La instalación la cubrimos nosotros: te lo ponemos por escrito en el presupuesto.")
        + faq([
            ("¿Qué diferencia hay entre Kömmerling 76 AD y 76 MD?", "Los dos tienen 76 mm de profundidad. El 76 AD tiene 5 cámaras y doble junta; el 76 MD Xtrem, 6 cámaras y triple junta central más una cuarta junta en la hoja. El MD llega a un Uw desde 0,73 W/m²K frente a 0,83 del AD."),
            ("¿Cuál aísla más del ruido?", "Sobre el papel, los dos llegan hasta 47 dB. Lo que decide es el vidrio: laminado acústico de más espesor, no la serie."),
            ("¿Valen para una casa pasiva?", "El fabricante ofrece versiones certificadas Passivhaus dentro de la familia 76. Para un proyecto de ese tipo hay que cerrar perfil, vidrio e instalación con el proyectista."),
            ("¿Se pueden poner en otro color que el blanco?", "Sí: blanco y varios foliados, y otros colores bajo consulta."),
            ("¿Cuánto más cuesta el MD que el AD?", "Depende de las medidas y del vidrio; te damos las dos opciones en el mismo presupuesto para que veas la diferencia en tu caso."),
        ])
    )
    return _ret("/blog/kommerling-76-ad-md-xtrem", "Kömmerling 76 AD y 76 MD Xtrem: diferencias y cuál elegir",
        "Kömmerling 76 AD frente a 76 MD Xtrem con datos de las fichas del fabricante: cámaras, juntas, Uf, Uw, ruido y estanqueidad. Qué significan y cuál elegir.",
        "Kömmerling 76 AD y 76 MD", "Kömmerling 76 AD o 76 MD Xtrem: qué cambia de verdad entre los dos", 7,
        "/img/ventana-pvc-hero.webp", "Ventana de PVC Kömmerling blanca en un salón luminoso",
        "los dos son de 76 mm. El 76 AD tiene 5 cámaras y doble junta (Uw desde 0,83); el 76 MD Xtrem, 6 cámaras y triple junta central más una cuarta en la hoja (Uw desde 0,73). Ambos alcanzan la clase 4 de permeabilidad al aire y hasta 47 dB con el vidrio adecuado. Para la mayoría de viviendas basta el AD; el MD compensa si buscas el mejor aislamiento posible.",
        inner, "¿Quieres ver las dos opciones con tu vidrio y tus medidas?", "Te medimos gratis y te damos el AD y el MD en el mismo presupuesto, para comparar precio y prestaciones.")


def a_condensacion():
    inner = (
        h2("Por qué se empañan las ventanas")
        + p("La condensación aparece cuando el aire caliente y húmedo de dentro toca una superficie fría y el vapor de agua se convierte en gotas. Casi nunca es un defecto de la ventana: suele ser una mezcla de humedad alta en casa y superficies frías.")
        + h2("Dónde aparece y qué significa")
        + table(
            ["Dónde", "Qué suele significar", "Qué hacer"],
            [
                ["En el cristal, por dentro", "Mucha humedad en casa o vidrio sencillo y frío", "Ventilar, controlar humedad; valorar doble vidrio con cámara"],
                ["En el marco, sobre todo en aluminio", "Perfil sin rotura de puente térmico: está frío y condensa", "Cambiar a perfil con RPT o PVC (<a href=\"/blog/rotura-puente-termico\" style=\"color: #B8430A\">qué es la RPT</a>)"],
                ["Entre los dos cristales", "La cámara ha perdido el sellado y entra humedad", "Sustituir el acristalamiento"],
                ["En el cristal, por fuera, por la mañana", "Es normal en vidrios muy aislantes: el exterior queda frío", "Nada: indica que el vidrio aísla bien"],
                ["Moho en la esquina o en el cajón de persiana", "Puente térmico en el hueco o el cajón", "Revisar el cajón y el sellado (<a href=\"/blog/cajones-persiana-aislados\" style=\"color: #B8430A\">guía de cajones de persiana</a>)"],
            ],
        )
        + h2("Qué puedes hacer ya, sin obras")
        + ul([
            "Ventila 5 a 10 minutos al día con corriente, aunque haga frío. La oscilobatiente (<a href=\"/blog/ventanas-oscilobatientes\" style=\"color: #B8430A\">te contamos cómo funciona</a>) permite ventilar con seguridad.",
            "Usa la campana al cocinar y ventila el baño después de ducharte.",
            "No seques la ropa dentro sin ventilación ni dejes radiadores cubiertos.",
            "Mantén la humedad de casa en torno al 40 a 60 %: un higrómetro barato te lo dice.",
            "Limpia el moho con productos adecuados y seca la zona.",
        ])
        + h2("Cuándo la solución es cambiar la ventana")
        + p("Si la condensación aparece cada invierno en el marco, hay moho recurrente, el vidrio es sencillo o la cámara está empañada por dentro, ventilar no basta: el problema es la ventana. Una ventana con perfil de rotura de puente térmico o de PVC y doble vidrio con cámara eleva la temperatura de la superficie interior y reduce mucho la condensación. Lo vemos en la guía <a href=\"/blog/pvc-o-aluminio\" style=\"color: #B8430A\">PVC o aluminio</a>.")
        + p("Una nota importante: unas ventanas muy estancas sin ventilación pueden aumentar la humedad interior. Por eso, al cambiar ventanas conviene acordar cómo se ventilará la casa (microventilación, aireadores o ventilación diaria).")
        + faq([
            ("¿Por qué se empañan mis ventanas por dentro?", "Porque el aire húmedo de casa toca una superficie fría. Es más frecuente con vidrio sencillo, marcos sin rotura de puente térmico y poca ventilación."),
            ("¿Es normal que se empañen por fuera?", "Sí, a primera hora, en ventanas muy aislantes. Indica que el vidrio no pierde calor hacia fuera."),
            ("¿Qué hago si hay agua entre los dos cristales?", "El sellado de la cámara ha fallado. No tiene arreglo por dentro: hay que sustituir el acristalamiento."),
            ("¿Cambiar a ventanas nuevas elimina la condensación?", "La reduce mucho si el problema es el frío del marco o del vidrio, pero hay que ventilar bien la vivienda para controlar la humedad."),
        ])
    )
    return _ret("/blog/condensacion-ventanas", "Condensación y moho en ventanas: causas y soluciones",
        "Por qué se empañan las ventanas, qué significa dónde aparece la condensación, qué hacer sin obras y cuándo conviene cambiar la ventana.",
        "Condensación en ventanas", "Condensación y moho en las ventanas: por qué aparecen y cómo evitarlos", 6,
        "/img/ventana-cortina.jpg", "Ventana de dos hojas con cortinas y vistas a un jardín",
        "la condensación aparece cuando el aire húmedo de dentro toca una superficie fría. Se reduce ventilando a diario y controlando la humedad; si se repite cada invierno en el marco o hay moho, el problema suele ser el perfil o el vidrio y la solución es una ventana con rotura de puente térmico o de PVC y doble vidrio con cámara.",
        inner, "¿Tienes humedad o moho en las ventanas?", "Mándanos una foto y te decimos si basta con ventilar o si conviene cambiar la ventana.")


def a_precio_ventanas():
    inner = (
        h2("De qué depende el precio")
        + p("No hay un precio único por ventana, porque dos ventanas que parecen iguales pueden costar muy distinto. Lo que más pesa:")
        + ul([
            "<b>El tamaño y el número de ventanas:</b> cuantas más, mejor sale cada una; una balconera grande no cuesta como una ventana pequeña.",
            "<b>El material:</b> PVC o aluminio con rotura de puente térmico. Tienen precios y prestaciones distintos (mira la guía <a href=\"/blog/pvc-o-aluminio\" style=\"color: #B8430A\">PVC o aluminio</a>).",
            "<b>El vidrio:</b> doble o triple, con cámara, bajo emisivo o de seguridad.",
            "<b>Cómo se abre:</b> corredera, practicable u oscilobatiente.",
            "<b>El color y el acabado:</b> blanco, gris, madera o negro.",
            "<b>La persiana y el cajón:</b> si se cambian, se aíslan o se dejan.",
            "<b>Los remates y la obra:</b> si hay que arreglar el hueco, el alféizar o el revestimiento al terminar.",
        ])
        + h2("Qué preguntar para comparar dos presupuestos")
        + p("Un presupuesto más barato puede dejar fuera cosas que otro incluye. Antes de decidir, pregunta siempre si incluye: medición, fabricación, instalación, desmontaje y retirada de la ventana antigua, remates, IVA y garantía. Tienes una lista de 10 puntos en <a href=\"/revisa-tu-presupuesto\" style=\"color: #B8430A\">revisa tu presupuesto</a>.")
        + h2("Cómo saber cuánto te costaría a ti")
        + p("Lo fiable es medir en tu casa. Para tener una idea antes, la <a href=\"/calculadora\" style=\"color: #B8430A\">calculadora</a> te da una horquilla en un minuto, y con el <a href=\"/configurador\" style=\"color: #B8430A\">configurador</a> eliges modelo, color y medidas.")
        + faq([
            ("¿Cuánto cuesta cambiar una ventana?", "Depende de la medida, el material, el vidrio y los remates. Por eso se da el precio después de medir, o de forma orientativa con la calculadora."),
            ("¿Cuánto cuesta cambiar las ventanas de una casa entera?", "Se suma cada ventana, con el descuento habitual por cantidad. Lo más práctico es una visita para medir todas a la vez y un único presupuesto."),
            ("¿Cuánto tarda el cambio?", "Una vivienda suele hacerse en uno o dos días de instalación. La fabricación a medida va antes."),
            ("¿Hay ayudas o deducciones?", "A veces sí, si la mejora cumple requisitos de eficiencia energética. Compruébalo en la <a href=\"/blog/ayudas-cambiar-ventanas-madrid\" style=\"color: #B8430A\">guía de ayudas</a> o con el <a href=\"/comprobador-ayudas\" style=\"color: #B8430A\">comprobador</a>."),
        ])
    )
    return _ret("/blog/cuanto-cuesta-cambiar-ventanas", "Cuánto cuesta cambiar las ventanas de una casa",
        "De qué depende el precio de cambiar ventanas, qué preguntar para comparar presupuestos y cómo calcular el tuyo.",
        "Cuánto cuesta cambiar ventanas", "¿Cuánto cuesta cambiar las ventanas de una casa?", 5,
        "/img/ventana-cortina.jpg", "Ventana de dos hojas con cortinas y vistas a un jardín",
        "depende del tamaño, el material (PVC o aluminio), el vidrio, la apertura, el color y los remates. Por eso lo fiable es medir en tu casa; para tener una idea antes, la calculadora de esta web te da una horquilla en un minuto.",
        inner, "¿Quieres saber cuánto sería en tu casa?", "Cuéntanos cuántas ventanas son y de qué tipo, o pasa la calculadora, y te decimos una cifra clara.")


def a_licencia_ventanas():
    inner = (
        h2("Depende del ayuntamiento y de lo que cambies")
        + p("No hay una única respuesta para toda España ni para todos los municipios. Lo habitual es que sustituir las ventanas por otras del mismo tamaño se considere una obra menor, que según el ayuntamiento puede no necesitar trámite o pedir una comunicación previa o una declaración responsable. Si se cambia el hueco, se agranda la ventana o se modifica el aspecto de la fachada, el trámite puede ser mayor.")
        + h2("Si vives en una comunidad de propietarios")
        + p("La fachada y los elementos que se ven desde fuera suelen ser comunes. Aunque la ventana sea tuya, cambiar su color, su diseño o su despiece puede necesitar el acuerdo de la comunidad. Lo más sencillo es comprobar los estatutos y hablar con el administrador antes de pedir el presupuesto.")
        + h2("Qué hacer antes de empezar")
        + ul([
            "Llama o consulta la web de tu ayuntamiento y pregunta si cambiar ventanas iguales requiere algún trámite.",
            "Si hay comunidad, pregunta qué color y qué diseño están permitidos.",
            "Pide el presupuesto indicando que quieres una ventana del mismo tamaño y aspecto, si es el caso.",
            "Si quieres cerrar una terraza, el trámite suele ser distinto: lo tienes explicado en <a href=\"/permisos-cerrar-terraza\" style=\"color: #B8430A\">permisos para cerrar una terraza</a>.",
        ])
        + note("Esta guía es orientativa y no sustituye el consejo de un técnico ni la respuesta de tu ayuntamiento, que es quien decide.")
        + faq([
            ("¿Es necesario pedir licencia de obras para cambiar ventanas?", "Depende del municipio y de si cambia el tamaño o el aspecto. Sustituir por otras iguales suele ser obra menor; lo seguro es preguntar en el ayuntamiento."),
            ("¿Para cambiar las ventanas hace falta permiso de la comunidad?", "Si se ve desde fuera, normalmente sí hay que respetar lo que haya acordado la comunidad sobre color y diseño."),
            ("¿Quién hace el trámite?", "Lo habitual es que lo gestione el propietario. Si necesitas orientación sobre qué pedir, consúltanoslo."),
        ])
    )
    return _ret("/blog/licencia-obras-cambiar-ventanas", "¿Hace falta licencia de obras para cambiar ventanas?",
        "Cuándo hace falta trámite o permiso para cambiar ventanas, qué cambia si vives en comunidad y qué preguntar antes de empezar.",
        "Licencia para cambiar ventanas", "¿Hace falta licencia de obras para cambiar las ventanas?", 4,
        "/img/ventana-cortina.jpg", "Ventana de dos hojas con cortinas y vistas a un jardín",
        "depende del ayuntamiento y de lo que cambies. Sustituir ventanas por otras del mismo tamaño suele ser obra menor, pero si cambias el hueco o el aspecto de la fachada, o vives en comunidad, puede haber más requisitos. Lo seguro es preguntar antes en el ayuntamiento.",
        inner, "¿Dudas sobre qué pedir?", "Cuéntanos tu caso y te orientamos sobre qué conviene preguntar antes de empezar.")


ARTICLES = [a_precio_ventanas, a_licencia_ventanas, a_cancelas, a_oscilobatientes, a_instalacion_pvc, a_cajones, a_rpt, a_epoca, a_mantenimiento, a_kommerling, a_condensacion]
