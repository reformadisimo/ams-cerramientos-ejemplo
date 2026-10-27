# Panel de control de demostracion para Javi (datos de ejemplo, se dice en pantalla).
# Pagina independiente: /guia-javi/panel. Modelo: el panel de la guia de Jesus Tierno.
import json, os, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))

def _serie_suma(vals, total):
    vals = list(vals)
    vals[-1] += total - sum(vals)
    return vals

def _datos():
    cons = _serie_suma([1,1,2,1,0,1,3,2,2,3,2,1,0,3,4,2,4,3,1,1,4,4,3,5,4,1,1,4,5,3], 100)
    vis = [44,37,52,49,24,22,60,57,51,66,62,30,27,70,76,64,81,72,38,33,84,88,77,95,86,44,37,92,99,88]
    try:
        versiones = int(subprocess.check_output(["git", "-C", os.path.join(os.getcwd(), "site"), "rev-list", "--count", "HEAD"], text=True).strip())
    except Exception:
        versiones = 250
    return {
        "cons": cons, "vis": vis,
        "hoy": {"vis": 96, "cons": 4, "clics": 14},
        "pest": [["resumen","Resumen"],["clientes","Clientes"],["anuncios","Anuncios"],["google","Google e IA"],["redes","Redes"],["web","Tu web"],["gastos","Gastos"],["equipo","Nuestro trabajo"]],
        "conectado": [["Google Analytics","Visitas"],["Search Console","Búsquedas"],["Google Ads","Anuncios"],["Ficha de Google","Reseñas"],["Bing","Búsquedas y ficha"],["Instagram","Seguidores"],["Facebook","Anuncios y página"],["TikTok","Vídeos y anuncios"],["WhatsApp","Presupuestos"],["Resend","Correos"],["Semrush","Posiciones e IA"],["ChatGPT","Visibilidad IA"],["PageSpeed","Velocidad"],["Vercel","Web y copias"]],
        "origen": [["Google Ads",38,"#C2410C"],["Google (sin pagar)",24,"#1D6FB8"],["Chat de la web",12,"#17602f"],["WhatsApp directo",9,"#1f9d55"],["Instagram, Facebook y TikTok",7,"#7a4fb3"],["Recomendación y otros",10,"#8a96a3"]],
        "camp": [{"n":"Ventanas de PVC","inv":210,"clics":190,"cons":14,"tend":-8},{"n":"Ventanas de aluminio","inv":150,"clics":130,"cons":9,"tend":-5},{"n":"Cerramientos de terraza","inv":140,"clics":88,"cons":7,"tend":4},{"n":"Marca (AMS Cerramientos)","inv":60,"clics":96,"cons":8,"tend":-2}],
        "meta": {"inv":90,"alcance":9200,"clics":210,"cons":5},
        "tiktok": {"inv":50,"clics":120,"cons":2},
        "busq": [["ventanas pvc alcalá de henares",170,4,15],["cerramientos de terraza madrid",590,9,24],["ventanas aluminio color madera",320,7,19],["precio ventanas pvc",2900,18,41],["mosquiteras a medida",480,11,26],["ventanas pvc villalbilla",30,2,9]],
        "ia": [0,1,1,2,2,3,3,4],
        "redes": [
            {"red":"Instagram","serie":[1120,1131,1150,1172,1203,1241,1290,1332,1385,1430,1459,1486],"color":"#c13584","extra":"Vídeo más visto: «Terraza cerrada en un día», 6.800 reproducciones"},
            {"red":"Facebook","serie":[620,622,626,631,636,642,650,659,668,676,684,693],"color":"#1877f2","extra":"Anuncios: 9.200 personas alcanzadas en Alcalá y alrededores"},
            {"red":"TikTok","serie":[0,0,12,34,68,112,170,238,310,384,461,540],"color":"#111111","extra":"Cuenta nueva: 540 seguidores en 10 semanas"}],
        "correos": {"env":266,"cons":7,"lista":[["Hemos recibido tu petición",78],["Así es una visita nuestra",64],["PVC o aluminio",58],["Lo que dicen quienes ya cambiaron",61],["Ayudas y cuotas",55],["¿Te ayudo con algo?",52],["Tu presupuesto sigue guardado",49]]},
        "chat": {"conv":168,"llamar":12,"fuera":55,"preguntan":"cuánto cuesta cambiar las ventanas, PVC o aluminio, si se puede cerrar la terraza sin licencia y cuánto tardáis en instalar."},
        "herr": [["Calculadora de ventanas",210],["Configurador de ventanas",118],["Cerramiento de terraza",86],["Revisa tu presupuesto",44],["Comprobador de ayudas",27]],
        "leads": [
            ["L. M.","4 ventanas de PVC en Alcalá de Henares","Google Ads · Ventanas de PVC","Formulario","Hace 12 min","Nuevo"],
            ["J. R.","Cerramiento de terraza de 11 m²","Chat de la web, 23:40","Chat","Hoy, 08:05","Llamado"],
            ["A. G.","Ventanas de aluminio color madera","Google · guía PVC o aluminio","WhatsApp","Ayer","Visita reservada"],
            ["P. S.","Mosquiteras y persianas","Instagram · vídeo","WhatsApp","Ayer","Visita reservada"],
            ["M. T.","Cancela de aluminio","Correo de seguimiento n.º 5","Llamada","Lunes","Cliente"],
            ["R. D.","Presupuesto de otra empresa para revisar","Revisa tu presupuesto","Formulario","Lunes","Llamado"]],
        "act": [
            ["Hoy, 10:42","Web","Subido el botón de WhatsApp en la calculadora de ventanas: en Clarity vimos que costaba encontrarlo."],
            ["Hoy, 09:15","Anuncios","Pausada la palabra «ventanas baratas»: traía curiosos, no clientes. Ahorro estimado: 35 € al mes."],
            ["Ayer, 18:30","Reseñas","Publicada la respuesta a la reseña de Carmen, con tu visto bueno."],
            ["Ayer, 12:00","Blog","Publicado: «PVC o aluminio: cuál te conviene de verdad»."],
            ["Ayer, 10:00","Redes","Montado y programado tu vídeo de la terraza cerrada en un día."],
            ["Lunes, 08:00","Informe","Enviado el informe semanal a tu móvil."],
            ["Domingo, 20:10","Correos","Nueva serie para quien pide un cerramiento de terraza, lista para que la revises."],
            ["Viernes","Diseño","Nuevo anuncio para la campaña de ventanas de aluminio."],
            ["Jueves","IA","Actualizada la ficha para las IA con vuestras marcas y zonas de trabajo."]],
        "eventos": [
            ["visita","Nueva visita desde Google","Lee «PVC o aluminio: cuál te conviene»"],
            ["herramienta","Alguien usa la calculadora de ventanas","4 ventanas de PVC, oscilobatientes"],
            ["visita","Nueva visita desde un anuncio","Página de cerramientos de terraza"],
            ["whatsapp","Pulsación en WhatsApp","Desde la calculadora, en el móvil"],
            ["correo","Correo abierto","«Así es una visita nuestra»"],
            ["visita","Nueva visita desde Instagram","Vídeo «Terraza cerrada en un día»"],
            ["herramienta","Cálculo de cerramiento de terraza","11 m² en PVC"],
            ["llamada","Pulsación en llamar","Desde la página de contacto"],
            ["chat","Conversación en el chat","Pregunta si podéis medir esta semana"],
            ["visita","Nueva visita desde ChatGPT","Página de ventanas de PVC"],
            ["consulta","Nuevo presupuesto pedido","Formulario · Ventanas de PVC · Google Ads"]],
        "meses": ["May","Jun","Jul","Ago","Sep","Oct"],
        "gm": [[560,0,0,28],[560,90,0,41],[560,90,350,57],[500,60,0,39],[560,140,0,78],[560,140,0,100]],
        "versiones": versiones,
    }

def pagina_html():
    css = open(os.path.join(HERE, "panel.css"), encoding="utf-8").read()
    js = open(os.path.join(HERE, "panel.js"), encoding="utf-8").read().replace("__DATA__", json.dumps(_datos(), ensure_ascii=False))
    return f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Tu panel de control (demostración) | AMS Cerramientos</title>
<meta name="description" content="Así vería Javi sus presupuestos, anuncios, posiciones en Google, IA y reseñas en un solo panel. Datos de ejemplo.">
<style>
@font-face{{font-family:Inter;font-weight:400;font-display:swap;src:url(/fonts/inter-400.woff2) format("woff2")}}
@font-face{{font-family:Inter;font-weight:600;font-display:swap;src:url(/fonts/inter-600.woff2) format("woff2")}}
@font-face{{font-family:Inter;font-weight:700;font-display:swap;src:url(/fonts/inter-700.woff2) format("woff2")}}
*{{box-sizing:border-box}}body{{margin:0;background:#f3f6f9;font-family:Inter,system-ui,sans-serif;color:#1f2a36}}
.pn-barra{{background:#12202B;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}}
.pn-barra a{{color:#fff;font-weight:700;text-decoration:none;font-size:.92rem}}.pn-barra span{{color:#cfe0f2;font-size:.85rem}}
{css}
</style>
</head>
<body>
<div class="pn-barra"><a href="/guia-javi">&larr; Volver a la guía</a><span>AMS Cerramientos · Panel de control</span></div>
<main class="pn">
<div class="pn-aviso-demo"><b>Demostración con datos de ejemplo.</b> Así verías tu panel cuando conectemos tus cuentas. Ninguna cifra de esta página es real.</div>
<header class="pn-cabeza"><div><p class="pn-hola">Buenos días, Javi</p><h1>Tu panel de control</h1><p class="pn-actualizado"><span class="pn-punto"></span> En directo · actualizado hace <span id="seg">0</span> s</p></div>
<div class="pn-ahora"><b id="ahora">9</b><span>personas en tu web ahora mismo</span></div></header>
<div class="pn-conectado" aria-label="Herramientas conectadas"><span class="pn-conectado-t" id="conectado-t"></span><div class="pn-conectado-tira" id="conectado"></div></div>
<nav class="pn-pestanas" role="tablist" aria-label="Secciones del panel" id="pest"></nav>
<div id="vista"></div>
<section class="pn-pide"><div><b>¿Echas algún dato de menos? ¿Quieres otro informe?</b><span>Pídenoslo y lo añadimos a tu panel: lo que quieras medir, cada cuánto y cómo quieres verlo. También va incluido.</span></div>
<form class="pn-pide-form" id="pide-form"><input id="pide-in" placeholder="Por ejemplo: presupuestos de Torrejón, o un informe solo de terrazas" aria-label="Qué quieres añadir a tu panel"><button type="submit">Pedirlo</button></form></section>
<p class="pn-pie">Datos de ejemplo. Con tus accesos, cada bloque se conecta a su fuente: tu web (presupuestos, chat y herramientas, al momento), Google Analytics (al momento), Google Ads (cada 3 horas), Search Console (con 2 o 3 días de retraso, como da Google), Meta, Instagram, TikTok, tu ficha de Google, Resend, PageSpeed y Clarity.</p>
</main>
<script>
{js}
</script>
</body>
</html>'''
