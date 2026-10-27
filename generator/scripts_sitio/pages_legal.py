import html as H
from pages_new import sec

EMP = "AMS Cerramientos y Servicios S.L."
DIR = "C/ Siete Picos 28, 28810 Villalbilla (Madrid)"
MAIL = "info@amscerramientos.es"
TEL = "639 78 82 20 / 91 883 35 12"
AVISO = '<div style="padding:14px 18px;border-left:4px solid #C2410C;background:#FDF1EA;border-radius:4px;font-size:15px;line-height:1.5"><b>Borrador pendiente de revisión.</b> Los datos mercantiles (CIF e inscripción) proceden de un directorio público de empresas y hay que confirmarlos con la escritura. Falta la revisión jurídica final antes de publicar la web con el dominio real.</div>'
ST = 'style="margin:0;font-size:16px;line-height:1.65"'
H2 = 'style="margin:18px 0 0;font-size:22px;font-weight:800"'

def pag(url, out, titulo, desc, h1, partes):
    cuerpo = "".join(f'<h2 {H2}>{a}</h2><div {ST}>{b}</div>' for a, b in partes)
    body = sec(f'<h1 style="margin:0;font-size:clamp(28px,6vw,40px);font-weight:800;line-height:1.1">{h1}</h1>{AVISO}{cuerpo}', pad="48px 24px 72px")
    body = body.replace('max-width: 1200px', 'max-width: 820px')
    return (url, out, titulo + " | AMS Cerramientos", desc, body)

def aviso():
    return pag("/aviso-legal", "aviso-legal.html", "Aviso legal", "Aviso legal de AMS Cerramientos.", "Aviso legal", [
        ("Titular de la web", f"<p>{EMP}<br>Domicilio: {DIR}<br>CIF: B86148772<br>Inscrita en el Registro Mercantil de Madrid, tomo 28604, folio 32, sección 8, hoja M-515046, inscripción 1<br>Correo: {MAIL}<br>Teléfono: {TEL}</p>"),
        ("Objeto", "<p>Esta web presenta los productos y servicios de la empresa (ventanas, cerramientos, rejas, cancelas, automatismos y otros) y permite solicitar presupuesto. Las informaciones y precios orientativos que aparecen en ella no constituyen una oferta vinculante: el presupuesto definitivo se da por escrito tras la medición.</p>"),
        ("Propiedad intelectual", "<p>Los textos, el diseño y el resto de contenidos de la web pertenecen al titular o se usan con licencia. No se pueden reproducir sin su permiso. Las marcas de terceros (por ejemplo Kömmerling) pertenecen a sus propietarios.</p>"),
        ("Responsabilidad", "<p>El titular procura que la información sea correcta y esté actualizada, pero no responde de errores u omisiones puntuales ni de los contenidos de webs de terceros a las que se enlace.</p>"),
        ("Ley aplicable", "<p>Este aviso se rige por la legislación española. Para cualquier controversia serán competentes los juzgados que correspondan conforme a la ley.</p>"),
    ])

def privacidad():
    return pag("/privacidad", "privacidad.html", "Política de privacidad", "Cómo trata AMS Cerramientos tus datos personales.", "Política de privacidad", [
        ("Quién es el responsable", f"<p>{EMP}, con domicilio en {DIR}. CIF: B86148772. Contacto para temas de privacidad: {MAIL}.</p>"),
        ("Qué datos recogemos y para qué", "<p>Cuando pides presupuesto por el formulario, por la calculadora, por el configurador o por WhatsApp, recogemos los datos que nos das (nombre, teléfono, correo, localidad y qué necesitas, incluidas las ventanas que has configurado) para <b>atender tu solicitud y prepararte el presupuesto</b>. No los usamos para publicidad ni los cedemos a nadie con otro fin.</p><p>Si subes la foto o el PDF de un presupuesto en la herramienta &laquo;Revisa tu presupuesto&raquo;, lo recibimos por correo electrónico solo para revisarlo y contestarte. Evita subir documentos con datos que no hagan falta (por ejemplo, tapa tu DNI o tu número de cuenta si aparecen).</p><p>Si en el futuro se activa el envío de correos con información útil después de tu consulta, solo se hará con tu consentimiento expreso y cada correo llevará un enlace para darte de baja.</p>"),
        ("Base legal", "<p>Tu consentimiento (la casilla que marcas al enviar tus datos) y la aplicación de medidas precontractuales a petición tuya, es decir, prepararte el presupuesto.</p>"),
        ("Cuánto tiempo los guardamos", "<p>El tiempo necesario para atender tu solicitud y, si hay contrato, durante los plazos que exijan las leyes. Después se borran o se bloquean.</p>"),
        ("Quién más puede tratar tus datos", "<p>Usamos proveedores que tratan datos por encargo nuestro y solo para prestarnos el servicio: el alojamiento de la web (Vercel), el envío de correos (Resend), el asistente del chat (Anthropic y Supabase), WhatsApp (Meta) y el mapa de Google Maps de la página de contacto. Algunos están fuera del Espacio Económico Europeo; se apoyan en las garantías previstas por la normativa.</p>"),
        ("Asistente de la web (chat con inteligencia artificial)", "<p>La web tiene un asistente que responde a tus preguntas con inteligencia artificial. <b>Guardamos la conversación</b> (lo que escribes y lo que responde el asistente, sin tu dirección IP) para atender mejor a quien nos escribe y mejorar la web y el propio asistente. Para generar las respuestas, tus mensajes se envían a un proveedor de inteligencia artificial (Anthropic), y las conversaciones se guardan en un servicio de base de datos (Supabase). Por favor, <b>no escribas datos personales sensibles</b> (DNI, datos bancarios, salud) en el chat. Si dejas tu nombre y teléfono con el botón &laquo;Que me llamen&raquo;, los usamos solo para llamarte. Base legal: nuestro interés legítimo en atender y mejorar el servicio y, para la llamada, tu consentimiento. Puedes pedirnos que borremos tu conversación escribiendo a info@amscerramientos.es.</p>"),
        ("Foto de tu ventana con inteligencia artificial", "<p>Esta función todavía no está activa. Cuando se active, la foto que subas se enviará a un proveedor de inteligencia artificial solo para generar la imagen, y se avisará aquí y en la propia herramienta antes de usarla.</p>"),
        ("Tus derechos", f"<p>Puedes pedirnos acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a {MAIL}. Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos (<a href=\"https://www.aepd.es\" style=\"font-weight:700;color:#B8430A\">aepd.es</a>).</p>"),
    ])

def cookies():
    return pag("/cookies", "cookies.html", "Política de cookies", "Cookies que usa la web de AMS Cerramientos.", "Política de cookies", [
        ("Qué son", "<p>Son pequeños archivos que una web guarda en tu dispositivo. Algunas son necesarias para que la web funcione y otras sirven para medir visitas o mostrar contenido de terceros.</p>"),
        ("Cuáles usa esta web", "<p>La web usa almacenamiento técnico de tu navegador para recordar, por ejemplo, el presupuesto que estás configurando. No usa cookies de publicidad. La página de contacto incluye un mapa de Google Maps, y Google puede instalar sus propias cookies al cargarlo: están sujetas a su política. Por eso el mapa <b>solo se carga si aceptas las cookies de terceros</b>. Al entrar por primera vez te preguntamos, y puedes cambiar tu elección cuando quieras con el enlace «Configurar cookies» del pie de página.</p><p>Para saber cuántas personas visitan la web y qué páginas ven, usamos la medición de Vercel, que <b>no instala cookies</b> ni identifica a nadie. Si más adelante se añaden herramientas de medición con cookies (como Google Analytics o mapas de calor), se pedirá tu consentimiento con un aviso antes de activarlas y se actualizará esta página.</p>"),
        ("Cómo cambiarlas o borrarlas", "<p>Puedes bloquear o borrar las cookies desde la configuración de tu navegador. Si lo haces, algunas partes de la web podrían no funcionar igual.</p>"),
        ("Contacto", f"<p>Para cualquier duda: {MAIL}.</p>"),
    ])

LEGAL = [aviso, privacidad, cookies]
