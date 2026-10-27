# Mensaje de hogar y confort (menos calor en verano, menos frio en invierno, familia) + dos entradas del blog.
from articles_new import h2, p, ul, faq, note, _ret
from pages_new import table

LKS = 'style="color: #B8430A"'
def L(u, t): return f'<a href="{u}" {LKS}>{t}</a>'


def a_ahorro():
    inner = (
        h2("Por dónde se escapa el calor en una casa")
        + p("Una ventana pierde energía por tres sitios: el <b>vidrio</b>, el <b>marco</b> y las <b>rendijas</b> (juntas gastadas, mala instalación, el cajón de la persiana). En una vivienda antigua, las ventanas suelen ser de los puntos más débiles de toda la envolvente, y por eso mejorarlas se nota tanto en el día a día. El porcentaje exacto depende de cada casa: no hay una cifra mágica.")
        + h2("Cuánto aísla cada tipo de ventana")
        + p("La medida que lo resume es la transmitancia térmica (Uw): cuanto más baja, menos calor deja pasar. Estos son valores típicos, no de un modelo concreto; el de tu ventana viene en su ficha técnica.")
        + table(
            ["Tipo de ventana", "Uw típico (W/m²K)", "Cómo se siente en casa"],
            [
                ["Aluminio antiguo con un solo cristal", "5,7", "Pared fría junto a la ventana, corriente y condensación"],
                ["Aluminio antiguo con doble cristal", "3,8", "Mejor, pero el marco sigue frío"],
                ["Aluminio con rotura de puente térmico y doble vidrio bajo emisivo", "1,7", "Marco templado, buen confort"],
                ["PVC con doble vidrio bajo emisivo", "1,4", "Muy buen aislamiento, el marco no se enfría"],
                ["PVC con triple vidrio", "1,0", "Lo más aislante; compensa en climas fríos y en fachadas expuestas"],
            ],
        )
        + note("Valores orientativos. Con el " + L("/simulador", "simulador de ahorro y ruido") + " puedes ver cuánto cambiaría en tu caso. El ahorro real depende de tu casa, de cómo la usas y de lo que pagues por la energía.")
        + h2("Menos frío en invierno")
        + ul([
            "Un <b>vidrio bajo emisivo</b> devuelve el calor a la habitación en lugar de dejarlo escapar.",
            "Un <b>marco con buena rotura de puente térmico</b> o de PVC no se enfría, así que no hay pared helada ni condensación (" + L("/blog/condensacion-ventanas", "por qué se empañan las ventanas") + ").",
            "Una <b>buena instalación</b> sella el hueco: de nada sirve la mejor ventana si se cuela el aire por el contorno (" + L("/blog/instalacion-ventanas-pvc", "cómo se instala bien una ventana de PVC") + ").",
            "El <b>cajón de persiana</b> es un puente frío habitual: revísalo (" + L("/blog/cajones-persiana-aislados", "cajones de persiana aislados") + ").",
        ])
        + h2("Menos calor en verano")
        + p("En verano el enemigo es el sol que entra por el cristal. Lo que más ayuda, de más a menos eficaz en general:")
        + ul([
            "Que el sol <b>no llegue al cristal</b>: persianas, toldos o lamas exteriores frenan el calor mucho mejor que una cortina por dentro.",
            "Un <b>vidrio de control solar</b> en las ventanas más expuestas (sur y oeste), con un factor solar bajo.",
            "<b>Ventilar de noche y a primera hora</b>, cuando fuera hace más fresco que dentro, y cerrar durante el día.",
            "Un buen aislamiento también ayuda en verano: mantiene fuera el calor de la calle igual que mantiene dentro el de la calefacción.",
        ])
        + h2("Y lo que no sale en la factura")
        + p("Una ventana buena no solo ahorra: se vive mejor. Menos ruido de la calle, ninguna corriente en el sofá, una habitación que se puede usar entera todo el año. Es lo que más agradece la gente cuando cambia las ventanas, y se explica en " + L("/blog/mas-que-una-ventana", "Más que una ventana") + ".")
        + h2("Antes de decidir")
        + ul([
            L("/diagnostico", "Haz el diagnóstico de tus ventanas") + ": seis preguntas para saber si conviene cambiar o solo arreglar.",
            "Mira " + L("/comprobador-ayudas", "qué ayudas existen de verdad") + " y la guía de " + L("/blog/ayudas-cambiar-ventanas-madrid", "ayudas para cambiar ventanas en Madrid") + ".",
            "Compara materiales en " + L("/blog/pvc-o-aluminio", "PVC o aluminio") + ".",
        ])
        + faq([
            ("¿Cuánto se ahorra cambiando las ventanas?", "Depende de la casa, de las ventanas que tengas ahora y de cómo uses la calefacción y el aire acondicionado. Se nota más cuanto peores sean las actuales. El simulador te da una estimación orientativa."),
            ("¿Son mejores las ventanas con triple vidrio?", "Aíslan más, pero también pesan y cuestan más. En Madrid y el Corredor del Henares, un buen doble vidrio bajo emisivo suele ser el punto de equilibrio; el triple compensa en fachadas muy expuestas o si te importa el ruido."),
            ("¿Me ayudan en verano o solo en invierno?", "En los dos. Aíslan del frío y del calor, y con vidrio de control solar y persianas exteriores se frena el sol antes de que entre."),
            ("¿Hay ayudas?", "Hay deducciones fiscales por mejora de eficiencia energética y algunas ayudas autonómicas según la convocatoria. Mira el comprobador de ayudas, que se revisa periódicamente."),
        ])
    )
    return _ret("/blog/ventanas-ahorro-energia-calor-frio", "Ventanas y ahorro de energía: menos frío en invierno y menos calor en verano",
        "Cómo influyen las ventanas en el frío de invierno y el calor de verano: tipos de vidrio y marco, valores de aislamiento, persianas y qué esperar de la factura.",
        "Ahorro de energía", "Ventanas y ahorro de energía: menos frío en invierno, menos calor en verano", 6,
        "/img/salon-ventanal.jpg", "Salón luminoso con un gran ventanal",
        "unas ventanas bien elegidas y bien instaladas reducen las pérdidas de calor en invierno y la entrada de calor en verano. En una vivienda antigua suelen ser uno de los puntos más débiles, y mejorarlas se nota en el confort desde el primer invierno y el primer verano.",
        inner, "¿Quieres saber cuánto cambiaría en tu casa?", "Cuéntanos qué ventanas tienes y te decimos con honestidad si te compensa cambiarlas.")


def a_hogar():
    inner = (
        h2("Una ventana es donde pasa la vida")
        + p("Cuando alguien cambia sus ventanas, casi nunca habla de perfiles. Habla de que ya no pasa frío en el sofá, de que por fin se oye la tele y no la calle, de que la terraza se usa todo el año. De la comida de domingo con toda la familia, de la sobremesa sin chaqueta, de la siesta tranquila. Eso es lo que hay detrás de unas buenas ventanas.")
        + h2("Los momentos que cambian")
        + ul([
            "<b>La mesa grande.</b> Una terraza cerrada con cristal se convierte en otra habitación: comidas, cumpleaños, reuniones. Sin viento, sin lluvia, sin el calor de agosto de lleno.",
            "<b>Los inviernos.</b> Sin pared helada junto a la ventana ni corrientes, la casa se calienta antes y se mantiene. Se gasta menos en calefacción, pero lo que se agradece es el confort.",
            "<b>Los veranos.</b> Con persianas exteriores y un buen vidrio, entra menos sol y la casa aguanta más fresca. Menos aire acondicionado y noches mejores.",
            "<b>El silencio.</b> Un buen cierre y un vidrio adecuado bajan mucho el ruido de la calle. Se duerme mejor y se conversa mejor.",
            "<b>Los mayores y los niños.</b> Una casa sin frío ni corrientes es una casa más sana y más cómoda para quien más tiempo pasa en ella.",
        ])
        + h2("Cómo elegir según cómo vives")
        + table(
            ["Tu situación", "Qué suele convenir"],
            [
                ["Vives en una calle ruidosa", "Vidrio laminar acústico, doble cámara y buena instalación"],
                ["Sufres frío en invierno", "PVC o aluminio con rotura de puente térmico y vidrio bajo emisivo"],
                ["Te asas en verano", "Vidrio de control solar en las ventanas al sol y persianas o toldos exteriores"],
                ["Quieres ganar una habitación", "Cerramiento de terraza acristalado, a medida (" + L("/cerramientos-terrazas", "ver cerramientos de terraza") + ")"],
                ["No sabes por dónde empezar", "El " + L("/diagnostico", "diagnóstico de tus ventanas") + " te orienta en cinco minutos"],
            ],
        )
        + p("Para los números, lee " + L("/blog/ventanas-ahorro-energia-calor-frio", "ventanas y ahorro de energía") + " o prueba el " + L("/simulador", "simulador de ahorro y ruido") + ". Y si quieres ver las opciones y el precio en directo, el " + L("/configurador", "configurador") + " te lo dice al momento.")
        + h2("Lo que nos importa")
        + p("Fabricamos e instalamos nosotros, y por eso sabemos que detrás de cada hueco hay una casa y una familia. Por eso medimos bien, instalamos con cuidado y estamos después, si algo falla (" + L("/garantia-y-postventa", "cómo te cuidamos antes, durante y después") + ").")
        + faq([
            ("¿Merece la pena cambiar las ventanas aunque funcionen?", "Depende de cómo funcionen. Si hay corrientes, frío junto al cristal, condensación o ruido, probablemente sí. Si no notas nada de eso, quizá basta con un buen mantenimiento."),
            ("¿Puedo cambiar solo algunas?", "Sí. Se suele empezar por las habitaciones donde más se vive o más se sufre, como el salón o el dormitorio, y completar después."),
        ])
    )
    return _ret("/blog/mas-que-una-ventana", "Más que una ventana: luz, silencio y una casa donde apetece quedarse",
        "Lo que cambian unas buenas ventanas en el día a día: menos frío, menos calor, más silencio y más luz, y cómo elegirlas según cómo vives.",
        "Más que una ventana", "Más que una ventana: luz, silencio y una casa donde apetece quedarse", 5,
        "/img/terraza-cristal.jpg", "Terraza acristalada con luz natural",
        "unas buenas ventanas cambian cómo se vive en casa: menos frío en invierno, menos calor en verano, más silencio y más luz. Elegirlas según cómo vives, y no solo por el precio, es lo que marca la diferencia.",
        inner, "Cuéntanos cómo vives y te aconsejamos", "Sin compromiso y sin presión: te decimos lo que de verdad te conviene.")


HOGAR_ARTS = [a_ahorro, a_hogar]


def franja_hogar():
    c = ('<div style="display:flex;flex-direction:column;gap:6px"><b style="font-size:19px">Menos frío en invierno</b><span style="line-height:1.5;color:#3D5163">Casa templada, sin paredes heladas ni corrientes.</span></div>'
         '<div style="display:flex;flex-direction:column;gap:6px"><b style="font-size:19px">Menos calor en verano</b><span style="line-height:1.5;color:#3D5163">El sol se frena antes de entrar y la casa aguanta más fresca.</span></div>'
         '<div style="display:flex;flex-direction:column;gap:6px"><b style="font-size:19px">Más silencio y más luz</b><span style="line-height:1.5;color:#3D5163">Para comer, charlar y descansar a gusto.</span></div>')
    return ('<section style="background:linear-gradient(135deg,#FFF1E2 0%,#EAF4FC 100%)"><div style="max-width:1200px;margin:0 auto;padding:44px 24px;display:flex;flex-direction:column;gap:20px">'
            '<h2 style="margin:0;font-size:clamp(26px,5.5vw,38px);font-weight:800;line-height:1.15;max-width:820px">Una ventana es mucho más que una ventana</h2>'
            '<p style="margin:0;font-size:19px;line-height:1.55;max-width:820px;color:#3D5163">Es la comida con toda la familia, la sobremesa sin chaqueta, la tarde de verano sin pasar calor. Por eso cuidamos cada detalle: para que en tu casa se esté mejor todo el año.</p>'
            '<div style="display:grid;gap:22px;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))">' + c + '</div>'
            '<p style="margin:0;font-size:16px"><a href="/blog/mas-que-una-ventana" style="color:#B8430A;font-weight:700">Más que una ventana</a> &nbsp;·&nbsp; <a href="/blog/ventanas-ahorro-energia-calor-frio" style="color:#B8430A;font-weight:700">Ahorro de energía</a> &nbsp;·&nbsp; <a href="/simulador" style="color:#B8430A;font-weight:700">Calcula cuánto ahorrarías</a></p>'
            '</div></section>')


def a_hogares():
    inner = (
        h2("Lo que se ve y lo que no se ve")
        + p("De una ventana se ve el marco, el cristal y poco más. Lo que no se ve es lo que hace que funcione: que el hueco esté bien medido, que el marco esté a plomo, que el sellado no deje pasar el aire, que alguien conteste si dentro de unos años algo falla. Casi todo lo importante está en eso.")
        + h2("Lo que hay al otro lado del cristal")
        + p("Una ventana no es una pieza de catálogo. Es la mesa donde alguien desayuna antes de ir a trabajar. Es el salón donde se junta la familia el domingo. Es el cuarto donde un niño hace los deberes y el dormitorio donde alguien quiere dormir sin oír la calle. Es la terraza donde, en cuanto llega el buen tiempo, se alarga la sobremesa.")
        + p("Nosotros solo vemos el hueco. Pero sabemos qué hay detrás, y por eso lo hacemos como si fuera para nuestra casa.")
        + h2("Cómo trabajamos cuando entramos en una casa")
        + ul([
            "<b>Vamos a verla.</b> Medimos en tu casa, con calma, y escuchamos cómo vives antes de proponer nada.",
            "<b>Hablamos de tú a tú.</b> Sin tecnicismos y sin prisas. Si algo no te hace falta, te lo decimos.",
            "<b>Fabricamos nosotros.</b> En nuestro taller de Villalbilla, para que cada pieza salga como se ha pensado.",
            "<b>Instalamos nosotros.</b> Con cuidado, y dejando la casa recogida y limpia.",
            "<b>Y volvemos si hace falta.</b> El trabajo no termina cuando nos vamos (" + L("/garantia-y-postventa", "así te cuidamos después") + ").",
        ])
        + h2("Por qué lo hacemos así")
        + p("Porque una obra en casa es algo personal. Entramos en un sitio donde alguien vive, y eso merece respeto, cuidado y buenas formas. Con los años hemos aprendido que lo que se agradece no es solo la ventana: es que todo haya salido como se dijo, sin sorpresas, y que haya alguien al otro lado del teléfono.")
        + p("Una buena ventana se nota en lo bien que se vive: menos frío en invierno, menos calor en verano, más silencio y más luz. Puedes leer cómo en " + L("/blog/mas-que-una-ventana", "Más que una ventana") + " y " + L("/blog/ventanas-ahorro-energia-calor-frio", "Ventanas y ahorro de energía") + ".")
        + h2("Si quieres hablar de tu casa")
        + p("Cuéntanos qué te pasa en casa: frío, ruido, una terraza que no usas. Te decimos con sinceridad qué te conviene, aunque sea menos de lo que pensabas.")
    )
    return _ret("/blog/no-hacemos-ventanas-hacemos-hogares", "No hacemos ventanas, hacemos hogares",
        "Cómo trabajamos en AMS Cerramientos: medimos en tu casa, fabricamos e instalamos nosotros y estamos después. Lo que hay detrás de cada ventana.",
        "No hacemos ventanas, hacemos hogares", "No hacemos ventanas, hacemos hogares", 4,
        "/img/hombre-sonriendo.jpg", "Instalador de AMS sonriendo",
        "detrás de cada ventana hay una familia, una mesa y una vida. Por eso medimos en tu casa, fabricamos e instalamos nosotros y volvemos si hace falta: para que lo que cambie sea cómo se vive, no solo el cristal.",
        inner, "Hablemos de tu casa", "Sin compromiso y sin presión.")


HOGAR_ARTS.append(a_hogares)

FRASES = {
    "/": ("Detrás de cada ventana hay una mesa, una familia y una tarde cualquiera.", "Por eso la hacemos como si fuera para nuestra casa.", "salon-ventanal"),
    "/ventanas-pvc": ("El invierno se queda fuera. El hogar, dentro.", "Ventanas que se notan en cómo se vive, no solo en la factura.", "ventana-cortina"),
    "/ventanas-aluminio": ("Más luz, más casa.", "Marcos finos para ver más cielo y menos perfil.", "reforma-ventanal"),
    "/cerramientos-terrazas": ("No cerramos una terraza. Abrimos una habitación.", "Para las comidas de domingo, las cenas de verano y los cumpleaños.", "terraza-cristal"),
    "/empresa": ("No hacemos ventanas. Hacemos hogares.", "Y trabajamos en el tuyo como si fuera el nuestro.", "hombre-sonriendo"),
    "/trabajos": ("Cada foto es una casa. Cada casa, una familia.", "", "obra-balcon"),
    "/pergolas": ("Las tardes largas de verano también se construyen.", "Sombra, brisa y buena compañía.", "villa-cristal"),
    "/cancelas-puertas": ("Llegar a casa y que todo esté en su sitio.", "Puertas y cancelas que se abren y se cierran sin pensar en ellas.", "vista-exterior"),
    "/persianas-cristales": ("Los detalles que no se ven son los que más se notan.", "", "lapiz-medicion"),
}


def frase(url):
    t, sub, img = FRASES[url]
    s = f'<p style="margin:14px 0 0;font-size:clamp(16px,2.6vw,21px);color:#F1E4D8;max-width:640px">{sub}</p>' if sub else ''
    return ('<section style="position:relative;background:#12202B;color:#fff;overflow:hidden">'
            f'<img src="/img/{img}.jpg" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55">'
            '<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,32,43,.88) 0%,rgba(18,32,43,.45) 100%)"></div>'
            '<div style="position:relative;max-width:1200px;margin:0 auto;padding:clamp(56px,10vw,110px) 24px">'
            f'<p style="margin:0;font-size:clamp(28px,5.6vw,52px);line-height:1.1;font-weight:800;max-width:860px;color:#fff">{t}</p>{s}'
            '</div></section>')


def a_filosofia():
    cita = lambda t, a: f'<blockquote style="margin:0;padding:18px 22px;border-left:4px solid #C2410C;background:#FFF4EA;border-radius:0 10px 10px 0;font-size:19px;line-height:1.6;font-style:italic">{t}<footer style="margin-top:8px;font-size:14px;font-style:normal;color:#4A5A68">{a}</footer></blockquote>'
    inner = (
        h2("Por donde miras")
        + p("Una ventana es, antes que nada, un marco. Dentro de ese marco cabe un trozo de mundo: un árbol, un patio, la calle un martes por la tarde, el cielo cambiando de color. Cada ventana es un cuadro que nadie pintó y que cambia con la hora y con la estación. Quien vive en una casa lo sabe: tiene su ventana favorita, la que mira sin darse cuenta cuando piensa en otra cosa.")
        + h2("Por donde te comunicas")
        + p("Una ventana es también la frontera entre lo tuyo y lo de todos. Por ella entra la luz, el aire de la mañana, el ruido de los niños de abajo, el olor a comida del vecino. Por ella sales tú, aunque no te muevas: saludas, miras quién llega, dejas que el verano entre o lo mantienes fuera.")
        + p("Es una frontera que tú decides cuánto abres. Y eso es lo que la hace distinta de un muro: una ventana no separa, <b>regula</b>. Deja pasar lo que quieres y frena lo que no.")
        + cita("Se abren puertas y ventanas para hacer una habitación; es el vacío lo que la hace habitable.", "Lao Tse, Tao Te Ching, capítulo 11 (la redacción cambia según la traducción)")
        + p("Lo que cuenta de una ventana no es el marco, sino el hueco: lo que deja ver, lo que deja pasar, lo que deja sentir. El marco solo está para que ese hueco funcione bien.")
        + cita("Quizá estamos aquí para decir: casa, puente, fuente, puerta, jarra, árbol frutal, ventana.", "Rainer Maria Rilke, Elegías de Duino (Novena), en versión libre")
        + h2("Más allá del hueco")
        + p("Por eso no empezamos midiendo. Empezamos hablando. Antes de proponer un perfil o un cristal queremos saber quién vive ahí, a qué hora se levanta, qué le molesta, qué mira, qué echa de menos. Dos casas con el mismo hueco no necesitan la misma ventana.")
        + table(
            ["Lo que nos cuentas", "Lo que hacemos con ello"],
            [
                ["«No duermo por el ruido de la calle»", "Vidrio laminar acústico y un sellado cuidado, sobre todo en el dormitorio"],
                ["«En invierno se me hiela el salón»", "Marco que no se enfría y vidrio bajo emisivo (" + L("/blog/ventanas-ahorro-energia-calor-frio", "cómo ahorra una buena ventana") + ")"],
                ["«Quiero que entre la luz y no el calor»", "Vidrio de control solar y persiana o toldo exterior en las ventanas al sol"],
                ["«Tengo niños pequeños»", "Oscilobatiente, para ventilar sin abrir del todo, y herrajes seguros (" + L("/blog/ventanas-oscilobatientes", "ventanas oscilobatientes") + ")"],
                ["«Mis padres ya no pueden con las persianas»", "Persianas motorizadas y ventanas fáciles de manejar"],
                ["«Quiero otra habitación»", "Cerramiento de terraza a medida (" + L("/cerramientos-terrazas", "cerramientos de terraza") + ")"],
            ],
        )
        + p("No hay una ventana correcta. Hay la que encaja con cómo vives, y encontrarla es nuestro trabajo.")
        + h2("Así empezamos")
        + ul([
            "<b>Hablamos.</b> Por teléfono, por WhatsApp o en tu casa. Tú cuentas, nosotros escuchamos.",
            "<b>Vemos.</b> Medimos en tu casa y miramos lo que no se ve en una foto: la orientación, el ruido, la luz.",
            "<b>Nos adaptamos.</b> Te proponemos lo que encaja contigo, aunque a veces sea menos de lo que pensabas.",
        ])
        + p("Si quieres ir pensándolo, el " + L("/diagnostico", "diagnóstico de tus ventanas") + " te orienta en cinco minutos y el " + L("/configurador", "configurador") + " te enseña opciones y precio al momento. Y si prefieres hablar, estamos al otro lado del teléfono. Lo leerás mejor junto a " + L("/blog/no-hacemos-ventanas-hacemos-hogares", "No hacemos ventanas, hacemos hogares") + ".")
    )
    return _ret("/blog/una-ventana-no-es-solo-una-ventana", "Una ventana no es solo una ventana: por dónde miras y por dónde te comunicas",
        "Una reflexión sobre la ventana como forma de mirar y de comunicarse con el exterior, y cómo escuchamos a cada persona para adaptar la solución a su casa.",
        "Una ventana no es solo una ventana", "Una ventana no es solo una ventana: es por donde miras y por donde te comunicas", 5,
        "/img/ventana-cortina.jpg", "Ventana con cortinas y vistas a un jardín",
        "una ventana es el marco por donde miras el mundo y la frontera por la que te comunicas con él. Por eso empezamos escuchando cómo vives y adaptamos la ventana a ti, no al revés.",
        inner, "Cuéntanos cómo vives", "Hablamos, vemos y nos adaptamos. Sin compromiso.")


HOGAR_ARTS.append(a_filosofia)


TOOLS = [
    ("/configurador", "Calcula tu precio", "Diseña tus ventanas y mira el precio al momento."),
    ("/revisa-tu-presupuesto", "Revisa tu presupuesto", "¿Tienes otro presupuesto? Mira qué incluye y si el precio es razonable."),
    ("/diagnostico", "Diagnóstico de tus ventanas", "Seis preguntas para saber si cambiar o solo arreglar."),
    ("/simulador", "Simulador de ahorro y ruido", "Cuánto ahorrarías y cuántos decibelios te quitarías."),
    ("/comprobador-ayudas", "Comprobador de ayudas", "Qué ayudas existen de verdad y cuánto podrías recuperar."),
    ("/permisos-cerrar-terraza", "Permisos para cerrar tu terraza", "Qué pedir a la comunidad y al ayuntamiento, paso a paso."),
    ("/como-medir-ventanas", "Cómo medir tus ventanas", "Una guía sencilla para medir bien, sin errores."),
    ("/mapa-de-obras", "Mapa de obras", "Dónde hemos trabajado. Si ves tu pueblo, estamos cerca."),
    ("/glosario", "Glosario", "Más de cien términos explicados sin jerga."),
]


def herramientas_sec():
    c = "".join(
        f'<a href="{u}" style="display:flex;flex-direction:column;gap:6px;padding:20px;background:#fff;border:1px solid #DCE2E7;border-radius:12px;text-decoration:none;color:#12202B;box-shadow:0 2px 10px rgba(18,32,43,.05)"><b style="font-size:18px;line-height:1.25">{t}</b><span style="font-size:15px;line-height:1.45;color:#4A5A68">{d}</span><span style="margin-top:auto;padding-top:6px;font-weight:700;color:#B8430A;font-size:15px">Abrir</span></a>'
        for u, t, d in TOOLS)
    return ('<section id="herramientas" style="background:#F3F5F7"><div style="max-width:1200px;margin:0 auto;padding:56px 24px;display:flex;flex-direction:column;gap:22px">'
            '<h2 style="margin:0;font-size:clamp(26px,5.5vw,38px);font-weight:800;line-height:1.15">Herramientas gratis para decidir con calma</h2>'
            '<p style="margin:0;font-size:18px;line-height:1.55;max-width:760px;color:#3D5163">Sin compromiso y sin dar tus datos. Úsalas antes de pedir presupuesto, o en lugar de pedirlo.</p>'
            '<div style="display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))">' + c + '</div></div></section>')
