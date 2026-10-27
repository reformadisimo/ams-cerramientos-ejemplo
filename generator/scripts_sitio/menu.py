import re, sys, glob, os

root = sys.argv[1]
landing = sys.argv[2]

links = [
    ("Main.dc.html", "Inicio"),
    ("Terrazas.dc.html", "Cerramientos de terrazas"),
    ("VentanasAluminio.dc.html", "Ventanas de aluminio"),
    ("VentanasPVC.dc.html", "Ventanas de PVC Kömmerling"),
    ("Pergolas.dc.html", "Pérgolas, toldos y techos"),
    ("Cancelas.dc.html", "Cancelas y puertas"),
    ("Persianas.dc.html", "Persianas, mosquiteras y cristales"),
    ("Comunidades.dc.html", "Comunidades y empresas"),
    ("Acabados.dc.html", "Acabados y colores"),
    ("Financiacion.dc.html", "Financiación"),
    ("Galeria.dc.html", "Trabajos realizados"),
    ("Empresa.dc.html", "Quiénes somos"),
    ("Blog.dc.html", "Blog y guías"),
    ("Alcala.dc.html", "Alcalá de Henares"),
]

def header(current):
    items = []
    for href, label in links:
        color = "#F5C9A8" if href == current else "#FFFFFF"
        items.append(
            f'<a href="{href}" style="display: flex; align-items: center; min-height: 52px; '
            f'border-bottom: 1px solid #24384A; color: {color}; text-decoration: none; '
            f'font-size: 17px; font-weight: 600">{label}</a>'
        )
    items.append(
        '<a href="Contacto.dc.html" style="display: flex; align-items: center; justify-content: center; '
        'min-height: 52px; margin-top: 12px; border-radius: 6px; background: #C2410C; color: #FFFFFF; '
        'text-decoration: none; font-size: 17px; font-weight: 700">Pedir presupuesto gratis</a>'
    )
    burger = (
        '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" '
        'stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>'
    )
    phone = (
        '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" '
        'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path></svg>'
    )
    return (
        '<header style="background: #12202B; color: #FFFFFF">\n'
        '<div style="max-width: 1200px; margin: 0 auto; padding: 12px 16px; display: flex; flex-wrap: wrap; '
        'align-items: center; justify-content: space-between; gap: 10px">\n'
        '<button type="button" onClick="{{toggleMenu}}" aria-expanded="{{menuOpenStr}}" '
        'style="display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 12px; '
        'border: 1px solid #5B6B78; border-radius: 6px; background: #1C2F3F; color: #FFFFFF; '
        'font-family: Inter, sans-serif; font-weight: 700; font-size: 16px; cursor: pointer">'
        f'{burger}<span>{{{{menuLabel}}}}</span></button>\n'
        '<a href="Main.dc.html" style="font-family: Archivo, sans-serif; font-weight: 800; font-size: 17px; '
        'letter-spacing: 0.02em; color: #FFFFFF; text-decoration: none">AMS CERRAMIENTOS</a>\n'
        '<a href="tel:+34639788220" aria-label="Llamar al 639 78 82 20" style="display: inline-flex; '
        'align-items: center; gap: 8px; min-height: 44px; padding: 0 14px; border-radius: 6px; '
        f'background: #C2410C; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 15px">{phone}<span>Llamar</span></a>\n'
        '</div>\n'
        '<sc-if value="{{menuOpen}}" hint-placeholder-val="{{ false }}">\n'
        '<nav aria-label="Menú principal" style="background: #0B151D; border-top: 1px solid #24384A">\n'
        '<div style="max-width: 1200px; margin: 0 auto; padding: 4px 16px 20px; display: grid; '
        'grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); column-gap: 32px">\n'
        + "\n".join(items) +
        '\n</div>\n</nav>\n</sc-if>\n</header>'
    )

state_vals = (
    "menuOpen: !!(this.state && this.state.menuOpen), "
    "menuOpenStr: (this.state && this.state.menuOpen) ? 'true' : 'false', "
    "menuLabel: (this.state && this.state.menuOpen) ? 'Cerrar' : 'Menú', "
    "toggleMenu: () => this.setState({ menuOpen: !(this.state && this.state.menuOpen) })"
)

def shrink_titles(s):
    s = re.sub(r'(<h1 style="margin: 0; font-size: )(\d+)px',
               lambda m: f'{m.group(1)}clamp(30px, 7vw, {m.group(2)}px)', s)
    s = re.sub(r'(<h2 style="margin: 0; font-size: )(\d+)px',
               lambda m: f'{m.group(1)}clamp(26px, 5.5vw, {m.group(2)}px)', s)
    s = re.sub(r'(<h2 style="margin: 16px 0 0; font-size: )(\d+)px',
               lambda m: f'{m.group(1)}clamp(24px, 5.5vw, {m.group(2)}px)', s)
    return s

for path in sorted(glob.glob(os.path.join(root, "*.dc.html"))):
    name = os.path.basename(path)
    s = open(path, encoding="utf-8").read()
    s, n = re.subn(r'<header style="background: #12202B; color: #FFFFFF">.*?</header>', lambda m: header(name), s, count=1, flags=re.S)
    if n != 1:
        print("SIN CABECERA", name); continue
    if "renderVals() { return {}; }" in s:
        s = s.replace("renderVals() { return {}; }", "renderVals() {\nreturn { " + state_vals + " };\n}")
    elif "return { accent: this.props.accent ?? '#C2410C' };" in s:
        s = s.replace("return { accent: this.props.accent ?? '#C2410C' };", "return { accent: this.props.accent ?? '#C2410C', " + state_vals + " };")
    else:
        print("SIN SCRIPT", name); continue
    s = shrink_titles(s)
    open(path, "w", encoding="utf-8").write(s)
    print("ok", name)

s = open(landing, encoding="utf-8").read()
s = shrink_titles(s)
s = s.replace('font-size: 56px; line-height: 1.05', 'font-size: clamp(32px, 8vw, 56px); line-height: 1.05')
s = s.replace('<h2 style="margin: 0; font-size: 44px', '<h2 style="margin: 0; font-size: clamp(28px, 6vw, 44px)')
open(landing, "w", encoding="utf-8").write(s)
print("ok landing")
