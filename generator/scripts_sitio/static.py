import re, sys, os, glob, shutil

S = sys.argv[1]
out = os.path.join(S, "site")
shutil.rmtree(out, ignore_errors=True)
os.makedirs(os.path.join(out, "img"))
os.makedirs(os.path.join(out, "landing"))

fotos = os.path.join(S, "fotos")
for f in os.listdir(fotos):
    shutil.copy(os.path.join(fotos, f), os.path.join(out, "img", f))

blobs = {
    # landing (artifact original)
    "1a910bba35c5897bcb02de8f42bbfb4f": "terraza.jpg",
    "d914ca88dde6596ee42f0d133f83e99d": "ventana-aluminio.jpg",
    "98e02c52f597a9d724d33dd0abe8e6c6": "ventana-pvc.jpg",
    "2a7932893467318db26350e79d1bc93c": "pergola.jpg",
    "3619e37693c41631ad43cfdb2461186f": "cancela.jpg",
    "1505c48ddfe66939733f58f351480ab8": "antes-despues-terraza.jpg",
    "53843af7689c3f22684aa68fc625f4c6": "antes-despues-ventana.jpg",
    "bab2b9b224ed2152c3010f24665d6224": "antes-despues-pergola.jpg",
    # web (artifact nuevo)
    "3d9f7fd0eeeb8a5abe6ffe1d67bdc556": "terraza.jpg",
    "39fcf6a6eb33584c9dfe1e663e94fc61": "ventana-aluminio.jpg",
    "2286e95b33bf6286073bb764cd21f1eb": "ventana-pvc.jpg",
    "7200b6a7ae095935994ddcdbcf65a8d3": "pergola.jpg",
    "52d00de40288ebef8bdfa1b8470e0f66": "cancela.jpg",
    "7e22e967e5ff27cac07acadfbe4d5a57": "antes-despues-terraza.jpg",
    "4045efba2559a007b96ceace023c2d1f": "antes-despues-ventana.jpg",
    "6122aeafb43326ae1622bd60bacad3c1": "antes-despues-pergola.jpg",
}

MENU_JS = """<script>
function amsMenu(btn){var m=document.getElementById('menu');var open=m.hasAttribute('hidden');
if(open){m.removeAttribute('hidden');}else{m.setAttribute('hidden','');}
btn.setAttribute('aria-expanded',open?'true':'false');btn.querySelector('span').textContent=open?'Cerrar':'Menú';}
document.addEventListener('submit',function(e){e.preventDefault();alert('Esto es un ejemplo: en la web real, este formulario enviaría la petición a AMS Cerramientos.');});
</script>"""

def convert(src, dst, page_map):
    s = open(src, encoding="utf-8").read()
    title = re.search(r"<title>(.*?)</title>", s, re.S).group(1)
    helmet = re.search(r"<helmet>(.*?)</helmet>", s, re.S).group(1)
    body = re.search(r"<x-dc>(.*?)</x-dc>", s, re.S).group(1)
    body = re.sub(r"<helmet>.*?</helmet>", "", body, flags=re.S)
    body = body.replace("{{accent}}", "#C2410C")
    body = body.replace('onClick="{{toggleMenu}}"', 'onclick="amsMenu(this)"')
    body = body.replace('{{menuOpenStr}}', 'false').replace('{{menuLabel}}', 'Menú')
    body = re.sub(r'<sc-if value="\{\{menuOpen\}\}"[^>]*>\s*<nav ', '<nav id="menu" hidden ', body)
    body = body.replace("</nav>\n</sc-if>", "</nav>")
    for bid, name in blobs.items():
        body = body.replace(f"/_blob/{bid}", page_map["img"] + name)
    def link(m):
        name = m.group(1)
        return 'href="' + page_map.get(name, name.replace(".dc.html", ".html")) + '"'
    body = re.sub(r'href="([A-Za-z]+\.dc\.html)"', link, body)
    if "{{" in body or "sc-if" in body or "dc-import" in body:
        print("AVISO restos de plantilla en", src)
    html = (
        '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '<meta name="robots" content="noindex, nofollow">\n'
        f"<title>{title} (ejemplo)</title>\n{helmet}\n"
        "<style>[hidden]{display:none !important}img{max-width:100%}</style>\n"
        "</head>\n<body>\n"
        '<div style="background:#F5C9A8;color:#12202B;text-align:center;font:600 13px Inter,system-ui,sans-serif;padding:8px 12px">Ejemplo de diseño para AMS Cerramientos. Fotos y datos provisionales.</div>\n'
        f"{body}\n{MENU_JS}\n</body>\n</html>\n"
    )
    open(dst, "w", encoding="utf-8").write(html)

web = os.path.join(S, "web2", "project")
web_map = {"img": "/img/", "Main.dc.html": "/"}
for f in glob.glob(os.path.join(web, "*.dc.html")):
    name = os.path.basename(f)
    dst = "index.html" if name == "Main.dc.html" else name.replace(".dc.html", ".html")
    convert(f, os.path.join(out, dst), web_map)

convert(os.path.join(S, "ams", "project", "Main.dc.html"), os.path.join(out, "landing", "index.html"), {"img": "/img/"})

open(os.path.join(out, "robots.txt"), "w").write("User-agent: *\nDisallow: /\n")
open(os.path.join(out, "vercel.json"), "w").write('{"cleanUrls": true, "headers": [{"source": "/(.*)", "headers": [{"key": "X-Robots-Tag", "value": "noindex, nofollow"}]}]}\n')
print("\n".join(sorted(os.listdir(out))))
