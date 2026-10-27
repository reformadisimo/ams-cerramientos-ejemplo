# Capa SEO: canonical, Open Graph, Twitter, JSON-LD (LocalBusiness, WebSite, BreadcrumbList, Article, FAQPage),
# sitemap.xml y llms.txt. El dominio final es www.amscerramientos.es; mientras tanto la web está en noindex.
import re, json, html as H

DOMAIN = "https://www.amscerramientos.es"
LASTMOD = "2026-10-22"
PAGES = []  # (url, titulo, descripcion)

NEGOCIO = {
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": DOMAIN + "/#negocio",
    "name": "AMS Cerramientos y Servicios S.L.",
    "alternateName": "AMS Cerramientos",
    "url": DOMAIN + "/",
    "logo": DOMAIN + "/img/logo-color.png",
    "image": DOMAIN + "/img/og-ams.jpg",
    "description": "Fabricantes e instaladores de ventanas de aluminio y PVC, cerramientos de terraza, pérgolas, cancelas y automatismos en Alcalá de Henares, el Corredor del Henares, Madrid y Guadalajara.",
    "telephone": ["+34639788220", "+34918833512"],
    "email": "info@amscerramientos.es",
    "address": {"@type": "PostalAddress", "streetAddress": "C/ Siete Picos 28", "postalCode": "28810", "addressLocality": "Villalbilla", "addressRegion": "Madrid", "addressCountry": "ES"},
    "areaServed": [{"@type": "City", "name": n} for n in ["Alcalá de Henares", "Torrejón de Ardoz", "Villalbilla", "Coslada", "Meco", "Azuqueca de Henares", "Guadalajara", "Madrid"]],
    "knowsAbout": ["ventanas de aluminio", "ventanas de PVC Kömmerling", "cerramientos de terraza", "pérgolas", "cancelas", "automatismos de puertas"],
}

NOMBRES = {"/": "Inicio", "/blog": "Blog"}


def _txt(s):
    return H.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).strip())


def faqs(body):
    out = []
    for q, a in re.findall(r"<summary[^>]*>(.*?)</summary><p[^>]*>(.*?)</p></details>", body, re.S):
        out.append((_txt(q), _txt(a)))
    for q, a in re.findall(r'<h3 style="margin: 0; font-size: 18px">(.*?)</h3><p style="margin: 0; font-size: 15px[^"]*">(.*?)</p>', body, re.S):
        out.append((_txt(q), _txt(a)))
    for q, a in re.findall(r'<h3 style="margin: 0; font-size: 20px">(.*?)</h3><p style="margin: 0">(.*?)</p>', body, re.S):
        out.append((_txt(q), _txt(a)))
    return out


def head_extra(cur, title, desc, body):
    url = DOMAIN + ("/" if cur == "/" else cur)
    PAGES.append((cur, title, desc))
    t, d = H.escape(title, quote=True), H.escape(desc, quote=True)
    og_type = "article" if cur.startswith("/blog/") else "website"
    meta = f'''<link rel="canonical" href="{url}">
<meta property="og:locale" content="es_ES">
<meta property="og:site_name" content="AMS Cerramientos">
<meta property="og:type" content="{og_type}">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{DOMAIN}/img/og-ams.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{t}">
<meta name="twitter:description" content="{d}">
<meta name="twitter:image" content="{DOMAIN}/img/og-ams.jpg">'''
    graph = [dict(NEGOCIO)]
    if cur == "/":
        graph.append({"@type": "WebSite", "@id": DOMAIN + "/#web", "url": DOMAIN + "/", "name": "AMS Cerramientos", "inLanguage": "es-ES", "publisher": {"@id": DOMAIN + "/#negocio"}})
    else:
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", body, re.S)
        nombre = _txt(h1.group(1)) if h1 else title.split("|")[0].strip()
        items = [{"@type": "ListItem", "position": 1, "name": "Inicio", "item": DOMAIN + "/"}]
        if cur.startswith("/blog/"):
            items.append({"@type": "ListItem", "position": 2, "name": "Blog", "item": DOMAIN + "/blog"})
            items.append({"@type": "ListItem", "position": 3, "name": nombre, "item": url})
        else:
            items.append({"@type": "ListItem", "position": 2, "name": nombre, "item": url})
        graph.append({"@type": "BreadcrumbList", "itemListElement": items})
        if cur.startswith("/blog/"):
            graph.append({"@type": "Article", "headline": nombre, "description": desc, "mainEntityOfPage": url, "image": DOMAIN + "/img/og-ams.jpg",
                          "dateModified": LASTMOD, "inLanguage": "es-ES",
                          "author": {"@id": DOMAIN + "/#negocio"}, "publisher": {"@id": DOMAIN + "/#negocio"}})
    if cur == "/glosario":
        _t = re.findall(r'<h3>(.*?)</h3><p>(.*?)</p>(?:<div class="gl-ver">.*?</div>)?</div></article>', body, re.S)
        graph.append({"@type": "DefinedTermSet", "name": "Glosario de ventanas, cerramientos y cerrajería", "url": url, "inLanguage": "es-ES",
                      "hasDefinedTerm": [{"@type": "DefinedTerm", "name": _txt(a), "description": _txt(b), "url": url + "#" + re.sub(r"[^a-z0-9]+", "-", __import__("unicodedata").normalize("NFKD", _txt(a)).encode("ascii", "ignore").decode().lower()).strip("-")} for a, b in _t]})
    qa = faqs(body)
    if qa:
        graph.append({"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in qa]})
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":"))
    ld = ld.replace("</", "<\\/")
    return meta + f'\n<script type="application/ld+json">{ld}</script>'


def sitemap():
    rows = "".join(f"<url><loc>{DOMAIN}{'/' if u == '/' else u}</loc><lastmod>{LASTMOD}</lastmod></url>\n" for u, _, _ in sorted(PAGES) if u not in ("/landing", "/cuestionario", "/fotos-web-antigua"))
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{rows}</urlset>\n'


def llms():
    grupos = [
        ("Productos", ["/ventanas-aluminio", "/ventanas-pvc", "/cerramientos-terrazas", "/techos", "/cancelas-puertas", "/pergolas", "/toldos", "/persianas-cristales", "/acabados"]),
        ("Servicios", ["/automatismos", "/comunidades", "/reparaciones", "/financiacion"]),
        ("Empresa", ["/empresa", "/trabajos", "/contacto", "/blog", "/glosario", "/diagnostico", "/simulador", "/revisa-tu-presupuesto", "/comprobador-ayudas", "/permisos-cerrar-terraza", "/como-medir-ventanas", "/visualizador", "/mapa-de-obras", "/garantia-y-postventa"]),
        ("Zonas", ["/alcala-de-henares", "/torrejon-de-ardoz", "/villalbilla", "/coslada", "/meco", "/azuqueca-de-henares", "/guadalajara", "/madrid"]),
        ("Guías del blog", sorted(u for u, _, _ in PAGES if u.startswith("/blog/"))),
    ]
    d = {u: (t, ds) for u, t, ds in PAGES if u not in ("/landing", "/cuestionario", "/fotos-web-antigua")}
    out = ["# AMS Cerramientos", "",
           "> Fabricantes e instaladores de ventanas de aluminio y PVC, cerramientos de terraza, pérgolas, cancelas y automatismos. Taller propio en Villalbilla (Madrid). Trabajan en Alcalá de Henares, el Corredor del Henares, Madrid y Guadalajara. Medición y presupuesto gratis.", "",
           "Datos de contacto: teléfono 639 78 82 20 y 91 883 35 12; correo info@amscerramientos.es; C/ Siete Picos 28, 28810 Villalbilla (Madrid).", ""]
    for g, us in grupos:
        out.append(f"## {g}")
        for u in us:
            if u in d:
                t, ds = d[u]
                out.append(f"- [{t.split('|')[0].strip()}]({DOMAIN}{u}): {ds}")
        out.append("")
    return "\n".join(out)
