# Genera api/_asistente-prompt.js: el prompt del asistente + el conocimiento (texto de la web publicada + notas de Javi).
# Se ejecuta en cada publicación, así el asistente siempre sabe lo último que hay en la web.
import os, re, json, glob, html
def build(OUT, AQUI):
    excluir = {"guia-javi", "cuestionario", "fotos-web-antigua", "cookies", "privacidad", "aviso-legal", "simulador-privado", "conversaciones"}
    piezas = []
    for fp in sorted(glob.glob(os.path.join(OUT, "**", "*.html"), recursive=True)):
        rel = os.path.relpath(fp, OUT)[:-5]
        if rel.split(os.sep)[-1] in excluir and os.sep not in rel: continue
        t = open(fp, encoding="utf-8").read()
        mt = re.search(r"<title>(.*?)</title>", t, re.S)
        m = re.search(r"<main[^>]*>(.*?)</main>", t, re.S)
        if not m: continue
        cuerpo = re.sub(r"<(script|style|svg|video|iframe|form)\b.*?</\1>", " ", m.group(1), flags=re.S)
        cuerpo = re.sub(r"<(br|/p|/li|/h[1-6]|/div|/tr)[^>]*>", "\n", cuerpo)
        cuerpo = html.unescape(re.sub(r"<[^>]+>", " ", cuerpo))
        cuerpo = re.sub(r"[ \t\r\f\v]+", " ", cuerpo); cuerpo = re.sub(r"\n\s*\n+", "\n", cuerpo).strip()
        tope = 4200 if rel.startswith("blog") else (1400 if rel in ("simulador", "diagnostico", "configurador", "calculadora") else 3200)
        ruta = "/" if rel == "index" else "/" + rel.replace(os.sep, "/").replace("/index", "")
        piezas.append("=== %s (%s) ===\n%s" % (html.unescape(mt.group(1)).strip() if mt else ruta, ruta, cuerpo[:tope]))
    notas = open(os.path.join(AQUI, "notas-javi.md"), encoding="utf-8").read()
    rutas = sorted({re.search(r"\((/[^)]*)\)", p.split("\n")[0]).group(1) for p in piezas} | {"/calculadora", "/configurador", "/contacto"})
    conocimiento = ("CONTENIDO DE LA WEB DE AMS Y NOTAS DE JAVI. Úsalo para responder y para enlazar la página adecuada con su ruta.\n\n"
        "RUTAS QUE EXISTEN: " + ", ".join(rutas) + "\n\nNOTAS DE JAVI (lo que él nos ha contado; lo marcado PENDIENTE no se afirma nunca)\n" + notas + "\n\nTEXTO DE LA WEB\n" + "\n\n".join(piezas))
    extra = open(os.path.join(AQUI, "conocimiento-extra.md"), encoding="utf-8").read()
    conocimiento += "\n\n" + extra
    prompt = open(os.path.join(AQUI, "prompt.txt"), encoding="utf-8").read()
    js = "module.exports.conocimientoWeb = function(){ return %s; };\nconst P = %s;\nmodule.exports.promptAsistente = function(hoy, hora){ return P.replace('{{HOY}}', hoy).replace('{{HORA}}', hora); };\nmodule.exports.rutas = %s;\n" % (json.dumps(conocimiento, ensure_ascii=False), json.dumps(prompt, ensure_ascii=False), json.dumps(rutas))
    os.makedirs(os.path.join(OUT, "api"), exist_ok=True)
    open(os.path.join(OUT, "api", "_asistente-prompt.js"), "w", encoding="utf-8").write(js)
    open(os.path.join(OUT, "api", "asistente.js"), "w", encoding="utf-8").write(open(os.path.join(AQUI, "asistente-api.js"), encoding="utf-8").read())
    # Foto de la cara de Javi/equipo: si existen javi-avatar.webp y equipo-ams.webp en scripts/asistente/img se usan; si no, el logo.
    import shutil
    av, eq = "/img/logo-cuadrado.png", ""
    for src, dst, var in (("javi-avatar.webp", "javi-avatar.webp", "av"), ("equipo-ams.webp", "equipo-ams.webp", "eq")):
        fp = os.path.join(AQUI, "img", src)
        if os.path.exists(fp):
            shutil.copy(fp, os.path.join(OUT, "img", dst))
            if var == "av": av = "/img/" + dst
            else: eq = "/img/" + dst
    open(os.path.join(OUT, "asistente.css"), "w", encoding="utf-8").write(open(os.path.join(AQUI, "widget-asistente.css"), encoding="utf-8").read())
    open(os.path.join(OUT, "asistente.js"), "w", encoding="utf-8").write(open(os.path.join(AQUI, "widget-asistente.js"), encoding="utf-8").read().replace("__RUTAS__", json.dumps(rutas)).replace("__AVATAR__", json.dumps(av)).replace("__EQUIPO__", json.dumps(eq)))
    open(os.path.join(OUT, "conversaciones.html"), "w", encoding="utf-8").write(open(os.path.join(AQUI, "conversaciones.html"), encoding="utf-8").read())
    return len(conocimiento)
