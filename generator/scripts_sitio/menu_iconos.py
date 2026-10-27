# -*- coding: utf-8 -*-
# Iconos y descripciones del menu y de las paginas indice.
IC = {
 "ventana": '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M4 12h16"/>',
 "pvc": '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M4 12h16M7.5 7.5h1M15.5 7.5h1"/>',
 "terraza": '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
 "techo": '<path d="M2 12l10-8 10 8"/><path d="M6 12v8M12 12v8M18 12v8"/>',
 "cancela": '<path d="M3 20V6M21 20V6"/><path d="M3 9h18M3 15h18M8 9v6M12 9v6M16 9v6"/>',
 "pergola": '<path d="M3 8h18M5 8v12M19 8v12"/><path d="M6 4l-3 4M12 4l-3 4M18 4l-3 4M21 4l-3 4"/>',
 "toldo": '<path d="M3 5h18l-1.5 6h-15z"/><path d="M6 11a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/><path d="M5 11v9M19 11v9"/>',
 "persiana": '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M4 7.5h16M4 12h16M4 16.5h16"/>',
 "motor": '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
 "reja": '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M8 4v16M12 4v16M16 4v16"/>',
 "edificio": '<path d="M5 21V4h9v17M14 9h5v12M3 21h18"/><path d="M8 8h3M8 12h3M8 16h3"/>',
 "llave": '<path d="M14.5 6.5a4 4 0 1 0 3 3L21 6l-2-2-3.5 3.5"/><path d="M13 11L4 20l2 1 9-9"/>',
 "euro": '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5a4.5 4.5 0 1 0 0 7M7 11h6M7 14h6"/>',
 "doc": '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
 "calc": '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/>',
 "lupa": '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
 "regla": '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
 "libro": '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 8h6"/>',
 "check": '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
}
URLIC = {"/ventanas-aluminio":"ventana","/ventanas-pvc":"pvc","/cerramientos-terrazas":"terraza","/techos":"techo","/cancelas-puertas":"cancela","/pergolas":"pergola","/toldos":"toldo","/persianas-cristales":"persiana","/automatismos":"motor","/rejas":"reja","/comunidades":"edificio","/reparaciones":"llave","/financiacion":"euro",
 "/acabados":"persiana","/trabajos":"terraza","/alcala-de-henares":"edificio","/empresa":"edificio","/garantia-y-postventa":"check","/revisa-tu-presupuesto":"check","/diagnostico":"lupa","/simulador":"calc","/comprobador-ayudas":"euro","/permisos-cerrar-terraza":"doc","/como-medir-ventanas":"regla","/visualizador":"lupa","/glosario":"libro","/blog":"libro","/configurador":"calc"}
DESC = {"/ventanas-aluminio":"Perfiles finos y mucha luz","/ventanas-pvc":"Aislamiento y silencio","/cerramientos-terrazas":"Gana una estancia para todo el año","/techos":"Cubre patios y porches","/cancelas-puertas":"A medida, fabricación propia","/pergolas":"Sombra y vida al aire libre","/toldos":"Sombra a tu gusto","/persianas-cristales":"Persianas, mosquiteras y cristales","/automatismos":"Puertas y cancelas con mando","/rejas":"Seguridad y diseño","/comunidades":"Plan de mantenimiento","/reparaciones":"Arreglamos lo que falla","/financiacion":"Ayudas y opciones de pago"}
def icono(u, n=0):
    k = URLIC.get(u, "doc")
    return '<i class="mi c%d" aria-hidden="true">' % (n % 6) + '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + IC[k] + '</svg></i>'
