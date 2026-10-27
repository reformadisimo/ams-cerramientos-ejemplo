#!/usr/bin/env python3
"""Copia la mesa de control de Reformadísimo (solo lectura) y le cambia SOLO la marca y el sector
(obras -> trabajos, Sonia, eKomi y Trustpilot...). Se puede repetir cuando el original cambie.
Uso: python3 generator/copia_mesa.py /ruta/a/reformadisimo-web  (desde la raíz del repositorio)"""
import sys, re, shutil, pathlib
R = pathlib.Path(sys.argv[1]); H = pathlib.Path(__file__).resolve().parent.parent
for rel in ["components/mesa/Mesa.tsx", "components/mesa/Alegria.tsx", "lib/mesaTextos.ts", "lib/mesaTipos.ts"]:
    shutil.copy(R / rel, H / rel)
for f in R.glob("app/fuentes/*.woff2"):
    if f.name.startswith(("roboto-", "lora-")): shutil.copy(f, H / "app/fuentes" / f.name)
shutil.copy(R / "app/globals.css", H / "app/globals.css")
shutil.copytree(R / "public/logos/herramientas", H / "public/logos/herramientas", dirs_exist_ok=True)

CAMBIOS = [
 # (archivo, antes, despues)
 ("Mesa", 'nombre: "Reformímetro", f: (t) => t.calculos, formato: num, fuente: "Web", ayuda: "Personas que calculan su reforma y reciben el informe."',
          'nombre: "Configurador", f: (t) => t.calculos, formato: num, fuente: "Web", ayuda: "Veces que alguien ha usado el configurador de ventanas para ver su presupuesto orientativo."'),
 ("Mesa", "Reformadísimo · mesa de control", "AMS Cerramientos · mesa de control"),
 ("Mesa", "Cómo va Reformadísimo", "Cómo va AMS"),
 ("Mesa", 'ayuda="Obras firmadas de los clientes que entraron en estas fechas (CRM)."', 'ayuda="Trabajos firmados de los clientes que entraron en estas fechas (CRM)."'),
 ("Mesa", "Una reforma tarda semanas en firmarse: los contactos de estas fechas aún están en marcha", "Un presupuesto tarda semanas en firmarse: los contactos de estas fechas aún están en marcha"),
 ("Mesa", 'nombre="Margen de las obras" ayuda="Margen previsto de las obras captadas." v="Pendiente" extra="Falta apuntar el coste previsto y real de cada obra"',
          'nombre="Margen de los trabajos" ayuda="Margen previsto de los trabajos captados." v="Pendiente" extra="Falta apuntar el coste previsto y real de cada trabajo"'),
 ("Mesa", "Una reforma tarda semanas en decidirse; la tasa de cierre", "Un presupuesto tarda semanas en decidirse; la tasa de cierre"),
 ("Mesa", "las conversaciones reales las apunta Sonia en el CRM", "las conversaciones reales las apunta el equipo en el CRM"),
 ("Mesa", "una reforma tarda semanas en decidirse, la tasa de cierre", "un presupuesto tarda semanas en decidirse, la tasa de cierre"),
 ("Mesa", "presupuestos y ${num(t.firm)} obras firmadas (", "presupuestos y ${num(t.firm)} trabajos firmados ("),
 ("Mesa", '"Hará falta que el CRM tenga obras firmadas en este periodo."', '"Hará falta que el CRM tenga trabajos firmados en este periodo."'),
 ("Mesa", "${eur(r.coste / r.firmados)} por obra`", "${eur(r.coste / r.firmados)} por trabajo`"),
 ("Mesa", '${num(mejor.firmados)} ${mejor.firmados === 1 ? "obra" : "obras"}, ', '${num(mejor.firmados)} ${mejor.firmados === 1 ? "trabajo" : "trabajos"}, '),
 ("Mesa", '"¿Los convertimos en obras?"', '"¿Los convertimos en trabajos?"'),
 ("Mesa", "% de contacto a obra`", "% de contacto a trabajo`"),
 ("Mesa", '["Obras firmadas", num(t.firmados)]', '["Trabajos firmados", num(t.firmados)]'),
 ("Mesa", '"Coste en anuncios por obra firmada"', '"Coste en anuncios por trabajo firmado"'),
 ("Mesa", 'titulo="De la petición a la obra"', 'titulo="De la petición al trabajo"'),
 ("Mesa", '["Firman la obra", t.firmados, undefined]', '["Firman el trabajo", t.firmados, undefined]'),
 ("Mesa", 't: "De contacto a obra"', 't: "De contacto a trabajo"'),
 ("Mesa", "Sale del CRM, que rellenan Sonia y el equipo.", "Sale del CRM, que rellena el equipo."),
 ("Mesa", "Buscan empresa, precio o reforma: posibles clientes.", "Buscan empresa, precio o instalación: posibles clientes."),
 ("Mesa", "revisa su calidad con Sonia.", "revisa su calidad con el equipo."),
 ("Mesa", 'r.instagram.usuario ?? "reformadisimo"', 'r.instagram.usuario ?? "amscerramientos"'),
 ("Mesa", 'fuente="Google automático · eKomi y Trustpilot, apuntados a mano"', 'fuente="Google, automático"'),
 ("Mesa", "Las cuatro juntas (Instagram, eKomi, Google y Trustpilot) son la prueba de confianza de la web.", "Instagram y Google son la prueba de confianza de la web."),
 ("Mesa", "(por ejemplo «reformas integrales Madrid»)", "(por ejemplo «ventanas pvc Alcalá de Henares»)"),
 ("Mesa", '"Lo invertido frente a contactos, visitas y obras firmadas"', '"Lo invertido frente a contactos, visitas y trabajos firmados"'),
 ("Mesa", '"Contactos, visitas y obras, de cada persona"', '"Contactos, visitas y trabajos, de cada persona"'),
 ("Mesa", "if (/reformad[ií]simo/.test(t)) return \"Marca\";", "if (/ams cerramientos|amscerramientos|ams ventanas/.test(t)) return \"Marca\";"),
]
CAMBIOS += [
 ("Mesa", "Google Ads, Meta y ChatGPT Ads (Supermetrics),", "Google Ads (Supermetrics),"),
 ("Mesa", 'ayuda: "Lo gastado en Google, Meta y ChatGPT."', 'ayuda: "Lo gastado en anuncios de Google."'),
 ("Mesa", 'fuente="Supermetrics · Google Ads, Meta y ChatGPT Ads"', 'fuente="Supermetrics · Google Ads"'),
]
# la expresión de intención comercial y la lista de logos
REG_VIEJA = re.compile(r'if \(/\^reformas\?\$/\.test\(t\) \|\| /\(empresa.*?\.test\(t\)\) return "Comercial";')
REG_NUEVA = 'if (/(empresa|empresas|instalador|instaladores|presupuesto|precio|precios|cu[aá]nto cuesta|cuanto vale|coste|ventanas? (de )?(pvc|aluminio)|cerramientos?|cerrar (una |la )?terraza|cancelas?|pérgolas?|pergolas?|mosquiteras?|persianas?|contratar|comprar)/.test(t)) return "Comercial";'
LOGOS_VIEJO = '["Google Analytics", "Search Console", "Google Ads", "Meta", "Ficha de Google", "Instagram", "WhatsApp", "Semrush", "ChatGPT", "Gemini", "Claude"]'
LOGOS_NUEVO = '["Google Analytics", "Search Console", "Google Ads", "Ficha de Google", "Instagram", "WhatsApp", "Semrush", "ChatGPT", "Gemini", "Claude"]'

ruta = H / "components/mesa/Mesa.tsx"
t = ruta.read_text()
for arch, a, b in CAMBIOS:
    if arch != "Mesa": continue
    assert a in t, f"No encuentro: {a[:80]}"
    t = t.replace(a, b)
assert REG_VIEJA.search(t), "No encuentro la expresión de intención comercial"
t = REG_VIEJA.sub(lambda m: REG_NUEVA, t)
assert LOGOS_VIEJO in t; t = t.replace(LOGOS_VIEJO, LOGOS_NUEVO)
# fuentes: quitar eKomi/Trustpilot de la lista de fuentes
t = re.sub(r" · eKomi y Trustpilot, a mano[^<`]*", "", t, count=1)
ruta.write_text(t)
ruta.write_text(t)
ale = H / "components/mesa/Alegria.tsx"
a = ale.read_text()
assert 'CORREO_ERRORES = "info@reformadisimo.es"' in a
ale.write_text(a.replace('CORREO_ERRORES = "info@reformadisimo.es"', 'CORREO_ERRORES = "info@amscerramientos.es"'))
print("Mesa.tsx copiada y adaptada a AMS")
