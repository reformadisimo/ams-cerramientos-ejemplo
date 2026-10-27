# Javi confirmo (23/10/2026): la financiacion es con Cetelem, CON intereses y sujeta a aprobacion.
# Se corrigen aqui, al final de la generacion, todas las frases de "sin intereses" de la web publica.
import os, re

FIN = "financiación disponible (con intereses, sujeta a aprobación)"
REEMPLAZOS = [
    ("Cambia tus ventanas hoy y págalas en 12 meses sin intereses", "Cambia tus ventanas hoy y fínancialas en cómodos plazos"),
    ("Financiamos tu obra de aluminio o PVC en cómodos plazos, sin pagar ni un euro de más.", "Financiamos tu obra de aluminio o PVC en cómodos plazos, con financiación de Cetelem sujeta a aprobación y con intereses."),
    ("Financiamos tu obra en 3, 6 o 12 meses sin intereses", "Financiamos tu obra en cómodos plazos (financiación con intereses, sujeta a aprobación)"),
    ("financiado hasta 12 meses sin intereses", "con financiación disponible, sujeta a aprobación"),
    ("[Confirmar condiciones, entidad financiera y requisitos]", "Cifra orientativa sin incluir intereses; las condiciones y la cuota exacta las confirma la entidad financiera (Cetelem), sujeta a aprobación."),
    ("Sí, en 3, 6 o 12 meses sin intereses", "Sí, con financiación disponible (con intereses, sujeta a aprobación)"),
    ("Financiación en 3, 6 o 12 meses sin intereses ('+eur(r.total/12)+' al mes a 12 meses)", "Financiación disponible, con intereses y sujeta a aprobación (a 12 meses, unos '+eur(r.total/12)+' al mes sin contar intereses)"),
    ("financiación en 3, 6 o 12 meses sin intereses", FIN),
    ("Financiación en 3, 6 o 12 meses sin intereses", "Financiación disponible (con intereses, sujeta a aprobación)"),
    ("en 3, 6 o 12 meses sin intereses", "con " + FIN),
    ("Financiación sin intereses", "Financiación disponible"),
    ("cuota para pagarlo en 12 meses sin intereses", "cuota orientativa para financiarlo (con intereses, sujeta a aprobación)"),
    ("Pagándolo en 12 meses sin intereses. También en 3 o 6.", "A 12 meses, sin contar intereses (la financiación tiene intereses y está sujeta a aprobación)."),
    ("Precio de fábrica, fecha de montaje y cuota sin intereses", "Precio de fábrica, fecha de montaje y cuota orientativa"),
    ("meses sin intereses</span>", "meses, sin contar intereses</span>"),
    ('<span style="font-size: 15px; color: #4A5A68">sin intereses</span>', '<span style="font-size: 15px; color: #4A5A68">plazo orientativo</span>'),
    ('Sin intereses</div>', 'Financiación</div>'),
    ('financiación en 3, 6 o 12 meses</div>', 'con Cetelem, sujeta a aprobación</div>'),
]
SALTAR = ("guia-javi", "cuestionario", "conversaciones", "fotos-web-antigua", "_asistente-prompt")

def aplicar(out):
    n = 0
    for d, _, fs in os.walk(out):
        for f in fs:
            if not f.endswith((".html", ".js")) or any(k in f for k in SALTAR) or f.startswith("_"):
                continue
            p = os.path.join(d, f)
            t = open(p, encoding="utf-8").read(); o = t
            for a, b in REEMPLAZOS:
                t = t.replace(a, b)
            if t != o:
                open(p, "w", encoding="utf-8").write(t); n += 1
    return n
