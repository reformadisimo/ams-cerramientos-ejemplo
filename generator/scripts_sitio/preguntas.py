# Preguntas para Javi: se usan en el PDF y en la página /cuestionario.
# (id, bloque, pregunta, opciones, texto_libre)  - opciones: lista de respuestas rápidas o []
PREGUNTAS = [
 ("Sobre el día a día", [
  ("¿Os llegan los mensajes del formulario de la web actual?", ["Sí", "No", "No sé"], "¿A qué correo llegan y quién los lee?"),
  ("¿Quién contesta a los presupuestos y cuánto tardáis de media?", [], "Quién y en cuántas horas o días"),
  ("Más o menos, ¿cuántos presupuestos pedís al mes y cuántos se cierran?", [], "Cifras aproximadas"),
  ("¿Qué horario tenéis y atendéis los sábados?", [], "Horario"),
  ("¿En qué año se fundó AMS?", [], "Año (para ajustar el \"más de 20 años\")"),
 ]),
 ("Datos que ponemos en la web", [
  ("¿Sois instaladores oficiales de Kömmerling?", ["Sí", "No", "No sé"], ""),
  ("¿Ofrecéis financiación en 3, 6 o 12 meses sin intereses?", ["Sí", "No", "Varía"], "Con qué entidad y qué condiciones"),
  ("¿Todas las ventanas de aluminio que fabricáis llevan rotura de puente térmico?", ["Sí", "No", "Según la serie"], ""),
 ]),
 ("Accesos que necesitamos (te explicamos cómo en el informe)", [
  ("¿Tenéis Google Analytics y nos podéis dar acceso?", ["Sí", "No", "No sé"], ""),
  ("¿Tenéis Google Search Console y nos podéis dar acceso?", ["Sí", "No", "No sé"], ""),
  ("¿Sois propietarios de la ficha de Google de la empresa (Perfil de Empresa) y nos podéis hacer administradores?", ["Sí", "No", "No sé"], ""),
  ("¿Habéis usado alguna vez Google Ads?", ["Sí", "No"], "Cuándo y con qué presupuesto"),
  ("¿Quién administra la página de Facebook?", [], "Y si hay alguna herramienta conectada que publique sola"),
  ("¿Dónde está contratado el dominio amscerramientos.es y quién tiene la clave?", [], "Proveedor (IONOS, GoDaddy, Dinahosting...) y persona"),
 ]),
 ("Lo que haríamos contigo: tú eliges", [
  ("Ficha de Google: ¿quieres que la trabajemos (fotos, publicaciones, reseñas) si le das acceso de administrador?", ["Sí, le doy acceso", "Prefiero que me diga qué hacer y lo hago yo", "No por ahora"], ""),
  ("¿Puede usar las fotos que le pases (y las de la web actual) en la ficha de Google y en la web?", ["Sí", "Solo algunas", "Lo pienso"], "Si hay fotos que no quieras que se usen, dilo aquí"),
  ("Instagram: ¿te gustaría abrir una cuenta que llevaría tu equipo, guiado paso a paso por nosotros?", ["Sí", "No", "Lo pienso"], "Quién haría las fotos de obras con el móvil"),
  ("Vídeos cortos de obras con el móvil (15 a 30 segundos): ¿estás dispuesto a grabarlos?", ["Sí", "Solo obras, sin dar la cara", "Mejor no"], ""),
  ("Calendario editorial: ¿te parece bien que se publiquen 3 artículos por semana durante 30 días, revisados por ti antes?", ["Sí", "Menos artículos", "Prefiero verlos primero"], "Si quieres quitar o añadir algún tema, dilo aquí"),
  ("Publicidad: ¿te interesaría probar una campaña pequeña?", ["Google (búsquedas)", "Instagram", "Las dos", "Ninguna por ahora"], "Cuánto al mes estarías dispuesto a invertir"),
  ("Seguimiento automático por correo al cliente (con su permiso): ¿te gusta la idea?", ["Sí", "No", "Quiero verlo antes"], ""),
  ("Foto con inteligencia artificial en el configurador: ¿la activamos más adelante?", ["Sí, cuando esté todo listo", "Dejarla como ejemplo", "Quitarla"], ""),
  ("¿Podrías pasarme tu tarifa de precios (por producto y medida) para cargarla en el configurador y la calculadora?", ["Sí", "Prefiero hablarlo", "No por ahora"], ""),
 ]),
 ("Hasta dónde queréis llegar", [
  ("¿Nos podéis pasar fotos y vídeos de obras (cancelas, rejas, terrazas, ventanas)?", ["Sí, os las paso", "Necesito pedir permiso"], ""),
  ("¿Estáis dispuestos a responder las reseñas y a pedir reseñas a los clientes contentos?", ["Sí", "No", "Con ayuda"], ""),
  ("¿Estáis dispuestos a dar la cara: salir vosotros o vuestro equipo en fotos o vídeos cortos?", ["Sí", "Mejor no", "Lo pienso"], ""),
  ("¿Dónde preferís alojar la web?", ["En nuestro servidor", "Que lo llevéis vosotros", "Quiero que me lo expliquéis"], ""),
  ("¿Algo más que queráis contarnos o preguntarnos?", [], "Lo que quieras"),
 ]),
]

def todas():
    n = 0
    for bloque, qs in PREGUNTAS:
        for q in qs:
            n += 1
            yield n, bloque, q
