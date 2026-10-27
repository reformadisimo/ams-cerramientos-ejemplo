# La lupa de demostracion para Javi: mapa de calor sobre la propia web de AMS, con datos inventados.
# Pagina independiente: /guia-javi/lupa. Modelo: la lupa de otra web de Ignacio; aqui todo es de ejemplo.
import os
HERE = os.path.dirname(os.path.abspath(__file__))

def pagina_html():
    css = open(os.path.join(HERE, "lupa.css"), encoding="utf-8").read()
    js = open(os.path.join(HERE, "lupa.js"), encoding="utf-8").read()
    return '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>La lupa de tu web (demostración) | AMS Cerramientos</title>
<meta name="description" content="Así verías lo que hace la gente en tu web: dónde toca, dónde se para y dónde se va. Datos de ejemplo.">
<style>
@font-face{font-family:Inter;font-weight:400;font-display:swap;src:url(/fonts/inter-400.woff2) format("woff2")}
@font-face{font-family:Inter;font-weight:600;font-display:swap;src:url(/fonts/inter-600.woff2) format("woff2")}
@font-face{font-family:Inter;font-weight:700;font-display:swap;src:url(/fonts/inter-700.woff2) format("woff2")}
*{box-sizing:border-box}body{margin:0;background:#f3f6f9;font-family:Inter,system-ui,sans-serif;color:#1f2a36}
''' + css + '''
</style>
</head>
<body>
<div class="lp-barra"><a href="/guia-javi">&larr; Volver a la guía</a><span>AMS Cerramientos · La lupa</span></div>
<div class="lp-demo"><b>Datos de ejemplo sobre vuestra propia web.</b><span class="lp-largo"> Ninguna cifra ni toque de esta página es real: sirve para que veas cómo sería. Con tu web publicada y conectada, aquí aparecerá lo que haga la gente de verdad.</span></div>
<header class="lp-cab"><h1>La lupa <small>· tu web con lo que hace la gente encima</small></h1>
<div class="lp-seg" id="lp-dias" role="group" aria-label="Periodo"><button type="button" data-v="7">7 días</button><button type="button" data-v="28" class="on">28 días</button><button type="button" data-v="90">90 días</button></div>
<div class="lp-seg" id="lp-disp" role="group" aria-label="Dispositivo"><button type="button" data-v="movil" class="on">Móvil</button><button type="button" data-v="pc">Ordenador</button></div>
<select class="lp-sel" id="lp-fte" aria-label="Fuente del tráfico"><option value="todas">Todas las fuentes</option><option value="ads">Anuncios de Google</option><option value="google">Google normal</option><option value="directo">Directo</option><option value="redes">Instagram y Facebook</option></select></header>
<p class="lp-sub" id="lp-sub"></p>
<section class="lp-conc" id="lp-conc" aria-label="Conclusiones"></section>
<main class="lp-grid" id="lp-centro">
<aside class="lp-col"><h2>Páginas, de más a menos vistas</h2><div class="lp-pgs" id="lp-pgs"></div></aside>
<section class="lp-col"><div class="lp-cap" role="group" aria-label="Capas">
<button type="button" class="lp-chip" data-c="calor"><s style="background:linear-gradient(90deg,#2896e6,#3cc878,#fad228,#e6281e)"></s>Dónde tocan</button>
<button type="button" class="lp-chip" data-c="vano"><s style="background:#e03131;width:14px;height:14px;border-radius:50%"></s>Tocan y no pasa nada</button>
<button type="button" class="lp-chip" data-c="baja"><s style="background:#12202B"></s>Hasta dónde bajan</button></div>
<div class="lp-esc"><div class="lp-tel" id="lp-tel"><div class="lp-vent" id="lp-vent"><iframe id="lp-if" title="Tu web con la lupa encima" src="about:blank"></iframe></div></div></div>
<p class="lp-hint">Es vuestra web de verdad: puedes bajar y navegar dentro. Encima se pinta lo que hacen las visitas de ejemplo.</p></section>
<aside class="lp-col" id="lp-der"></aside>
</main>
<p class="lp-pie">Cómo funciona de verdad: solo se apunta a quien acepta las cookies de analítica; se guarda qué tocan y hasta dónde bajan, nunca lo que escriben; no hay datos personales y todo se borra solo a los 90 días. Los datos son tuyos. Las conclusiones salen de reglas fijas sobre los datos, y se vuelven más fiables con las visitas: menos de 100 son pistas, hasta 1.000 tendencias, y desde 1.000 son firmes.</p>
<script>
''' + js + '''
</script>
</body>
</html>'''
