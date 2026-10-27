# Pagina de ejemplo: serie de correos automaticos para alguien interesado en ventanas.
from pages_new import BTN, BTN2

WA = "https://wa.me/34639788220"

# (dia, etiqueta, asunto, preheader, porque, que_buscamos, foto, titular, [parrafos], [puntos], boton, boton2, ps, por_confirmar)
CORREOS = [
    ("En el momento", "Confirmación inmediata",
     "Marta, hemos recibido tu petición de presupuesto",
     "Esto es lo que nos has pedido y lo que pasa ahora",
     "Quien deja sus datos y no recibe nada se pone nervioso: ¿les habrá llegado? Este correo lo calma en segundos y deja claro qué ocurre después. Es además la primera vez que ve el nombre de AMS en su bandeja.",
     "Que el cliente sepa que su petición ha llegado y cuándo le llamaremos. Se envía solo, en cuanto pulsa «enviar». El botón la anima a mandar una foto, lo que acelera el presupuesto.",
     "ventana-pvc-hero.webp", "Hemos recibido tu petición, Marta",
     ["Gracias por confiar en AMS Cerramientos. Esto es lo que nos has contado:"],
     ["<b>Lo que has pedido:</b> 4 ventanas de PVC oscilobatientes, blancas, con doble vidrio bajo emisivo",
      "<b>Dónde:</b> piso en Alcalá de Henares",
      "<b>Precio orientativo:</b> desde 1.980 € + IVA, instalado (ejemplo; el precio final lo confirmamos tras medir)",
      "<b>Lo que pasa ahora:</b> Javi te llamará o te escribirá en menos de 24 horas laborables para proponerte un día de visita, sin compromiso"],
     "Mandar una foto de mis ventanas", "O llámanos al 639 78 82 20",
     "Con una foto de tus ventanas actuales podemos orientarte mejor sin esperar a la visita.", False),
    ("Día 1", "Cómo trabajamos",
     "Marta, así es una visita nuestra (y qué incluye el precio)",
     "Medimos, fabricamos, instalamos y nos llevamos lo viejo",
     "Quien pide presupuesto a varias empresas compara precios, pero casi nunca compara <i>qué incluye</i> cada uno. Este correo explica lo que va dentro del precio y quita el miedo a la visita.",
     "Que vea la diferencia entre una oferta de «solo la ventana» y un servicio completo, y que la visita sea fácil de aceptar: el botón propone un día por WhatsApp.",
     "lapiz-medicion.jpg", "Qué incluye nuestro precio, para que compares bien",
     ["Una duda muy habitual: «¿qué me va a costar de verdad?». Por eso te contamos lo que va incluido, para que puedas comparar con cualquier otra oferta con los mismos criterios."],
     ["<b>Visita y medición</b> en tu casa, sin compromiso",
      "<b>Fabricación propia</b>, en nuestro taller y a tu medida",
      "<b>Instalación</b> con nuestro propio equipo",
      "<b>Retirada</b> de las ventanas viejas y remates al terminar"],
     "Elegir un día para la visita", "Ver cómo medimos",
     "Sin compromiso: la visita y el presupuesto son gratis.", True),
    ("Día 3", "Resolver la duda más típica",
     "PVC o aluminio: cuál te conviene de verdad",
     "Una guía corta, sin tecnicismos, para decidir con calma",
     "La duda de fondo de casi todos es «¿PVC o aluminio?». Si nadie se la resuelve, la resuelve Google (o un competidor). Aquí la resolvemos nosotros, con una guía honesta, y damos una razón para volver a la web.",
     "Que nos vea como quien le ayuda a decidir bien y no solo a vender. Se mide el clic hacia la guía.",
     "ventana-aluminio.webp", "PVC o aluminio: cuál te conviene",
     ["Si aún estás decidiendo el material, esto te lo pone fácil. En cristiano:"],
     ["<b>PVC:</b> aísla muy bien del frío, del calor y del ruido, y casi no pide mantenimiento. Suele ser lo más rentable en un piso",
      "<b>Aluminio:</b> perfiles más finos, más luz y muy resistente. Ideal para ventanales y terrazas, y con rotura de puente térmico también aísla",
      "<b>Lo mejor:</b> depende de dónde va la ventana. Cuéntanos y te recomendamos, sin compromiso"],
     "Leer la guía completa", "O pregúntanos por WhatsApp",
     "¿Tienes dudas del tipo «mi comunidad pide…»? Escríbenos y las resolvemos.", False),
    ("Día 6", "Prueba social",
     "Lo que dicen quienes ya cambiaron sus ventanas con nosotros",
     "4,5 sobre 5 en Google, con 44 reseñas de clientes",
     "Antes de gastar varios miles de euros, el cliente busca confirmación de que otros quedaron contentos. Mostramos reseñas reales de Google, con nombre abreviado, y un antes y después.",
     "Dar confianza justo cuando el cliente duda. Con el plan de reseñas, la nota y la cantidad irán subiendo.",
     "antes-despues-ventana.webp", "Mejor que lo cuenten ellos",
     ["Sabemos que es una decisión importante, así que dejamos hablar a quienes ya pasaron por esto."],
     ["<i>«Encantados con su trabajo. El mejor presupuesto con diferencia, muy profesionales, cumplieron con los tiempos y en la instalación se fijaron en cada detalle para que quedara como queríamos.»</i> <span style=\"color:#5B6B78\">— Laura D., reseña de Google, 5 de 5</span>",
      "<i>«Excelente trabajo, materiales y acabados, muy profesionales, sin duda los mejores de toda la zona y con precios muy competitivos.»</i> <span style=\"color:#5B6B78\">— Rafael O., reseña de Google, 5 de 5</span>",
      "<b>Hoy: 4,5 sobre 5 en Google con 44 reseñas.</b>"],
     "Ver trabajos realizados", "Pedir que me llamen",
     "Cada obra que terminamos acaba con una reseña de quien la vive. Nos importa más que cualquier anuncio.", False),
    ("Día 10", "Dinero: ayudas y pago",
     "¿Sabías que puedes ahorrar con ayudas o pagar en cuotas?",
     "Comprueba en 1 minuto si te corresponde alguna ayuda",
     "El precio suele ser la última barrera. Quitarla con información útil (ayudas, deducciones, pago en cuotas) cambia muchas decisiones. Es contenido que ayuda, no presión.",
     "Que el cliente vea que el precio tiene salida y use el comprobador de ayudas de la web, otra herramienta que le recuerda quiénes somos.",
     "ventana-pvc-luz.webp", "Cambiar ventanas, sin que se note en tu bolsillo",
     ["El precio no tiene por qué ser un freno. Hay dos cosas que mucha gente no sabe:"],
     ["<b>Ayudas y deducciones:</b> según tu caso y tu comunidad pueden existir ayudas para mejorar el aislamiento. Tenemos un comprobador gratuito: lo rellenas en un minuto y te dice si te puede interesar",
      "<b>Pago a plazos:</b> te enseñamos opciones de pago en cuotas en el propio presupuesto",
      "<b>Y ahorras después:</b> unas ventanas que aíslan bien notan en la factura de luz y gas"],
     "Comprobar si me corresponde una ayuda", "Revisar mi presupuesto con Javi",
     "Si ya tienes otro presupuesto, mándanoslo y te decimos, sin compromiso, qué incluye cada uno.", True),
    ("Día 14", "El correo personal de Javi",
     "Marta, ¿te ayudo con algo?",
     "Una pregunta sencilla, de persona a persona",
     "Pasadas dos semanas, lo que mejor funciona es un correo corto, sin imágenes ni botones de colores, con la firma de una persona real. Parece escrito a mano, y se contesta.",
     "Abrir conversación. Es el correo con más respuestas de toda la serie. Va en texto plano, a propósito.",
     None, None,
     ["Hola, Marta:",
      "Soy Javi, de AMS Cerramientos. Hace unas semanas nos pediste presupuesto para cambiar las ventanas de tu piso y no queríamos dejarlo en el aire.",
      "¿Te quedó alguna duda? ¿Prefieres que te lo cuente por teléfono? ¿O todavía no es el momento? Cualquiera de las tres respuestas me vale, de verdad.",
      "Contesta a este correo o escríbeme por WhatsApp al 639 78 82 20.",
      "Un saludo,<br>Javi<br>AMS Cerramientos"],
     [], None, None, None, False),
    ("Día 30", "Dejar la puerta abierta",
     "Marta, lo dejamos aquí, pero tu presupuesto sigue guardado",
     "Si lo retomas más adelante, aquí estamos",
     "Insistir sin parar cansa y da mala imagen. El último correo cierra con elegancia, ahorra trabajo al cliente (su presupuesto sigue guardado) y le da una razón para volver más adelante, por ejemplo cuando llegue el frío.",
     "Cerrar la serie con buena imagen. Quien no está listo hoy lo recordará mañana.",
     "vista-exterior.jpg", "Tu presupuesto sigue guardado",
     ["No queremos agobiarte, así que este es nuestro último correo sobre tu presupuesto. Cuando quieras retomarlo, aquí lo tienes."],
     ["<b>Tu presupuesto:</b> guardado, con tus medidas y tus elecciones",
      "<b>Cuando quieras:</b> nos escribes por WhatsApp o abres el enlace, y seguimos donde lo dejaste",
      "<b>Si cambian los planes:</b> no pasa nada. Y si prefieres no recibir más correos, tienes un enlace de baja al final"],
     "Retomar mi presupuesto", "Escribir a Javi por WhatsApp",
     "Gracias por habernos dado la oportunidad de presupuestarte.", False),
]

RULES = [
    ("Se para solo", "En cuanto el cliente contesta, reserva una visita o compra, la serie se detiene. Nadie recibe «¿sigues interesado?» después de haber firmado."),
    ("Una baja en un clic", "Todos los correos llevan al final un enlace para darse de baja. Es lo que exige la ley y lo que hace que quien se queda quiera quedarse."),
    ("Nunca de noche", "Los correos salen entre semana, por la mañana, en horario de oficina. Cuando se pueda, se afina con lo que muestren los datos."),
    ("Un solo mensaje por correo", "Cada correo tiene una idea y un botón. Los correos largos con cinco enlaces no los lee nadie."),
    ("Sin inventar nada", "Solo se dice lo que es verdad. Lo marcado en naranja como «por confirmar» se revisa con Javi antes de activar nada."),
]

CSS = """<style>
.cx{max-width:1000px;margin:0 auto;padding:40px 24px 72px;display:flex;flex-direction:column;gap:26px;color:#12202B}
.cx h2{margin:0;font-size:clamp(24px,5vw,32px);font-weight:800}
.cx .tl{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
.cx .tl div{background:#fff;border:1px solid #DCE2E7;border-top:5px solid #C2410C;border-radius:10px;padding:12px;font-size:14px;line-height:1.35}
.cx .tl b{display:block;font-size:17px;color:#C2410C;margin-bottom:2px}
.cx .em{background:#fff;border:1px solid #DCE2E7;border-radius:16px;overflow:hidden;box-shadow:0 8px 28px rgba(18,32,43,.07)}
.cx .eh{background:#12202B;color:#fff;padding:12px 18px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.cx .eh .n{width:34px;height:34px;border-radius:50%;background:#C2410C;display:flex;align-items:center;justify-content:center;font-weight:800}
.cx .eh .d{font-weight:800;font-size:18px}.cx .eh .t{font-size:14px;color:#C9D3DB}
.cx .meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:0;border-bottom:1px solid #DCE2E7}
.cx .meta div{padding:14px 18px;font-size:15px;line-height:1.5}.cx .meta div+div{border-left:1px solid #DCE2E7}
.cx .meta b{display:block;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:#C2410C;margin-bottom:3px}
.cx .mail{background:#EEF1F4;padding:22px 14px}
.cx .mb{max-width:560px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #D4DBE1;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#1C2A35}
.cx .mf{padding:12px 18px;border-bottom:1px solid #E6EBEF;font-size:13px;color:#5B6B78;line-height:1.5}
.cx .mf b{color:#12202B}
.cx .mlogo{background:#12202B;padding:16px 18px;text-align:left}.cx .mlogo img{height:34px;width:auto;display:block}
.cx .mb img.ph{width:100%;height:auto;display:block;max-height:260px;object-fit:cover}
.cx .mbody{padding:20px 22px 22px}.cx .mbody p{margin:0 0 12px}
.cx .mbtn{display:inline-block;background:#C2410C;color:#fff!important;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:6px;margin:6px 0 4px}
.cx .mfoot{padding:14px 22px;background:#F6F8FA;font-size:12px;color:#6B7A86;line-height:1.5;border-top:1px solid #E6EBEF}
.cx .mlogo{display:flex;align-items:center;justify-content:space-between;gap:10px}.cx .mlogo span{color:#B9C4CE;font-size:12px}
.cx .mhero{height:230px;background-size:cover;background-position:center;display:flex;align-items:flex-end}
.cx .mhero h3{margin:0;padding:18px 22px;color:#fff;font-size:26px;line-height:1.2;font-weight:800;text-shadow:0 2px 12px rgba(0,0,0,.4)}
.cx .chk{list-style:none;margin:6px 0 14px;padding:0}.cx .chk li{position:relative;padding:9px 0 9px 30px;border-bottom:1px solid #EEF1F4}
.cx .chk li:before{content:"";position:absolute;left:2px;top:13px;width:16px;height:16px;border-radius:50%;background:#C2410C}
.cx .chk li:after{content:"";position:absolute;left:7px;top:16px;width:4px;height:8px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}
.cx .cta{text-align:center;margin:18px 0 6px}.cx .cta .mbtn{font-size:17px;padding:15px 30px;box-shadow:0 4px 0 #9A3412}
.cx .sec{text-align:center;margin:0 0 14px}.cx .sec a{color:#B8430A;font-weight:700;font-size:15px}
.cx .ps{background:#FFF8EE;border-left:4px solid #C2410C;padding:10px 14px;font-size:14.5px;border-radius:0 8px 8px 0}
.cx .firma{display:flex;gap:12px;align-items:center;margin-top:14px;padding-top:14px;border-top:1px solid #E6EBEF}
.cx .firma img{width:54px;height:54px;border-radius:50%;object-fit:cover}.cx .firma b{display:block}.cx .firma span{font-size:13px;color:#5B6B78}
.cx .plain{font-family:Georgia,serif}.cx .plain .mbody p{font-size:17px}
.cx .pc{display:inline-block;background:#FFF1E6;color:#9A3412;border:1px solid #F5C9A3;border-radius:999px;font-size:12px;font-weight:700;padding:2px 10px;margin-left:8px}
.cx .box{background:#fff;border:1px solid #DCE2E7;border-radius:14px;padding:18px 20px}
.cx .box ul{margin:8px 0 0;padding-left:20px}.cx .box li{margin:6px 0}
.cx .why{background:#EAF6EF;border:1px solid #A9DDC0;border-radius:14px;padding:18px 20px}
@media(max-width:640px){.cx .meta div+div{border-left:0;border-top:1px solid #DCE2E7}}
</style>"""


def _correo(i, c):
    dia, etiqueta, asunto, pre, porque, busca, foto, titular, parrafos, puntos, boton, boton2, ps, pc = c
    pcx = '<span class="pc">Por confirmar con Javi</span>' if pc else ""
    if foto is None:
        # correo personal: texto plano, sin diseno
        cuerpo = "".join(f"<p>{p}</p>" for p in parrafos)
        mail = f'''<div class="mb plain"><div class="mf"><b>De:</b> Javi (AMS Cerramientos)<br><b>Asunto:</b> {asunto}<br><b>Vista previa:</b> {pre}</div>
<div class="mbody" style="padding:22px">{cuerpo}</div>
<div class="mfoot">Recibes este correo porque pediste un presupuesto en nuestra web. <u>Darme de baja</u></div></div>'''
    else:
        lis = "".join(f"<li>{p}</li>" for p in puntos)
        cuerpo = "".join(f"<p>{p}</p>" for p in parrafos)
        b2 = f'<p class="sec"><a href="{WA}">{boton2}</a></p>' if boton2 else ""
        psx = f'<p class="ps"><b>P. D.</b> {ps}</p>' if ps else ""
        mail = f'''<div class="mb">
<div class="mf"><b>De:</b> AMS Cerramientos<br><b>Asunto:</b> {asunto}<br><b>Vista previa:</b> {pre}</div>
<div class="mlogo"><img src="/img/logo-blanco.png" alt="AMS Cerramientos"><span>Fabricantes e instaladores · Alcalá de Henares</span></div>
<div class="mhero" style="background-image:linear-gradient(180deg,rgba(18,32,43,.05) 30%,rgba(18,32,43,.82)),url(/img/{foto})"><h3>{titular}</h3></div>
<div class="mbody">{cuerpo}<ul class="chk">{lis}</ul>
<p class="cta"><a class="mbtn" href="{WA}">{boton}</a></p>{b2}{psx}
<div class="firma"><img src="/img/equipo-ams.webp" alt=""><div><b>Javi y el equipo de AMS</b><span>639 78 82 20 · info@amscerramientos.es</span></div></div></div>
<div class="mfoot">AMS Cerramientos · Villalbilla (Madrid)<br>Recibes este correo porque pediste un presupuesto en nuestra web. <u>Darme de baja</u> · <u>Política de privacidad</u></div>
</div>'''
    return f'''<article class="em" id="correo-{i}">
<div class="eh"><span class="n">{i}</span><span class="d">{dia}</span><span class="t">{etiqueta}</span>{pcx}</div>
<div class="meta"><div><b>Por qué lo enviamos</b>{porque}</div><div><b>Qué buscamos</b>{busca}</div></div>
<div class="mail">{mail}</div>
</article>'''


def pagina():
    tl = "".join(f'<div><b>{c[0]}</b>{c[1]}</div>' for c in CORREOS)
    emails = "".join(_correo(i + 1, c) for i, c in enumerate(CORREOS))
    reglas = "".join(f"<li><b>{t}.</b> {d}</li>" for t, d in RULES)
    body = f'''<section style="background: #12202B; color: #FFFFFF">
<div style="max-width: 1000px; margin: 0 auto; padding: 40px 24px 52px; display: flex; flex-direction: column; gap: 16px">
<div style="font-size: 14px; color: #B9C4CE">Ejemplo preparado para la guía de Javi</div>
<h1 style="margin: 0; font-size: clamp(30px, 6.5vw, 44px); line-height: 1.1; font-weight: 800">Los correos que le enviaríamos a alguien interesado en ventanas</h1>
<p style="margin: 0; font-size: 19px; line-height: 1.55; color: #D3DBE2; max-width: 780px">Una persona deja sus datos en el configurador o en el formulario. A partir de ahí, siete correos cortos repartidos en un mes, uno cada pocos días, que la acompañan hasta que decide. Cada uno responde a una duda real y le recuerda, sin agobiar, quién eres. Aquí los tienes tal y como los vería ella.</p>
</div>
</section>
<section style="background: #F3F5F7"><div class="cx">
<div class="why"><h2 style="font-size:22px">Por qué funcionan</h2><p style="margin:8px 0 0;line-height:1.6">Casi nadie decide una obra el primer día. Lo normal es pedir presupuesto a tres empresas y quedarse con la que le dio más confianza y se acordó de él. Esta serie hace exactamente eso, sola y a la hora justa: confirma, explica, resuelve dudas, enseña reseñas reales, ayuda con el precio y pregunta con cariño. Sin que Javi tenga que acordarse de cada cliente. Y <b>el nombre de AMS aparece en su bandeja de entrada durante todo el proceso de decisión</b>.</p></div>
<h2>El calendario de un vistazo</h2>
<div class="tl">{tl}</div>
{emails}
<div class="why"><h2 style="font-size:22px">Cómo se hace, paso a paso</h2>
<ol style="margin:10px 0 0;padding-left:22px;line-height:1.6">
<li><b>El cliente deja sus datos</b> en el formulario, en la calculadora o en el configurador (y marca la casilla para recibir correos).</li>
<li><b>Se guarda su contacto</b> con lo que ha pedido (ventanas, terraza, cancela), para saber qué serie le toca.</li>
<li><b>Resend, la herramienta de envío, lanza la serie sola</b>: el primer correo en el acto y los siguientes a los 1, 3, 6, 10, 14 y 30 días.</li>
<li><b>Javi recibe un aviso</b> en cuanto entra una petición nueva, para llamar o escribir el mismo día.</li>
<li><b>La serie se para sola</b> cuando el cliente contesta, reserva visita o compra, o si se da de baja.</li>
<li><b>Vemos qué funciona:</b> cuánta gente abre cada correo y pulsa cada botón, y mejoramos lo que no tire.</li></ol></div>
<div class="box"><h2 style="font-size:22px">Todo se puede cambiar, cuando quieras</h2>
<ul>
<li><b>Los textos:</b> cada frase de cada correo. Más corto, más cercano, con tu forma de hablar, con otras preguntas.</li>
<li><b>Las fotos:</b> se sustituyen por obras reales de AMS en cuanto las tengamos. Cada correo puede llevar la suya.</li>
<li><b>Los días y el número de correos:</b> si siete son muchos, se reducen a cinco; si hace falta, se espacian más o se adelantan.</li>
<li><b>Los botones:</b> a dónde llevan (WhatsApp, llamada, configurador, comprobador de ayudas) y qué dicen.</li>
<li><b>El precio y las condiciones:</b> se ponen solo cuando tú los confirmes, y se actualizan cuando cambien.</li>
<li><b>Una serie para cada servicio:</b> ventanas, terrazas, cancelas, pérgolas… cada una con sus dudas.</li>
<li><b>Antes de activar nada,</b> te enviamos los correos a tu correo para que los veas en el móvil, como los vería el cliente, y los ajustamos juntos.</li></ul>
<p style="margin:12px 0 0;line-height:1.6"><b>¿Cómo se pide un cambio?</b> Escribes qué quieres cambiar (por WhatsApp, por correo o en la propia guía) y lo cambiamos nosotros, sin coste. Si algún día prefieres tocar los textos tú, el editor de Resend es visual y se puede dar acceso; es opcional, no hace falta.</p></div>
<div class="box"><h2 style="font-size:22px">Las reglas de la serie</h2><ul>{reglas}</ul></div>
<div class="box"><h2 style="font-size:22px">Qué hace falta para ponerla en marcha</h2><ul>
<li><b>Un servicio de envío de correos</b> (Resend). El plan gratuito de Resend incluye 3.000 correos al mes, de sobra para empezar.</li>
<li><b>El correo de AMS como remitente</b> (por ejemplo, info@amscerramientos.es), verificado en el servicio.</li>
<li><b>Una casilla de consentimiento</b> en el formulario y en el configurador: «Acepto recibir correos sobre mi presupuesto». Para los correos que no sean la confirmación inmediata, hace falta ese permiso. La confirmación sí puede enviarse siempre.</li>
<li><b>Los datos de Javi:</b> qué se incluye de verdad en el precio, plazos, garantía y las condiciones de pago. Lo marcado como «por confirmar» se revisa con él antes de activarlo.</li>
<li><b>Fotos reales de obras de AMS</b> para sustituir las de ejemplo.</li></ul></div>
<div class="box"><h2 style="font-size:22px">Lo mismo, para otros servicios</h2><p style="margin:8px 0 0;line-height:1.6">Esta serie es para quien pide <b>ventanas</b>, que es lo que más hacéis. Para cerramientos de terraza, cancelas o pérgolas se haría una distinta, con sus propias dudas (permisos, materiales, plazos) y sus fotos. Se preparan igual, cuando quieras.</p></div>
<div style="padding: 28px; background: #12202B; color: #FFFFFF; border-radius: 14px; display: flex; flex-direction: column; gap: 12px">
<h2 style="color:#fff;font-size:24px">¿Cambiarías algo?</h2>
<p style="margin: 0; color: #D3DBE2; line-height: 1.55">Los textos, las fotos, los días y el tono se pueden cambiar como quieras. Dinos qué te chirría o qué añadirías y lo ajustamos.</p>
<div style="display: flex; flex-wrap: wrap; gap: 12px"><a href="{WA}" style="{BTN}">Escribirnos por WhatsApp</a><a href="/guia-javi#s19" style="{BTN2}">Volver a la guía</a></div>
</div>
</div></section>
{CSS}'''
    return ("/correos-ejemplo", "correos-ejemplo.html",
            "Serie de correos de ejemplo para quien pide presupuesto de ventanas | AMS Cerramientos",
            "Ejemplo de los siete correos automáticos que recibiría una persona interesada en ventanas: cuándo, por qué, con qué texto y qué imágenes.",
            body)
