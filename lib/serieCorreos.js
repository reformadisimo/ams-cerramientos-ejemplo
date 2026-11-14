// Serie de correos de seguimiento, camino B (14-nov-2026): quien ve su precio, deja su correo y marca
// «Quiero recibir por correo consejos y ofertas», y todavía no ha pedido visita.
// B2 día 2 (qué incluye), B3 día 5 (antes y después), B4 día 9 (reseñas), B5 día 14 (ventana completa),
// B6 día 21 (Javi, en texto normal) y B7 día 45 (despedida). Quién recibe cada uno lo decide la base
// (función adm_serie_pendientes de Supabase). APAGADA mientras no exista SERIE_CORREOS=1 en Vercel.
// Reglas de los textos: tuteo, sin emojis, sin guiones largos, sin plazos de obra ni fechas,
// PVC Kömmerling sin «fabricación propia», cristal doble bajo emisivo con control solar de serie.
const crypto = require('crypto');
const WEB = process.env.WEB_BASE || 'https://www.amscerramientos.es';
const SECRETO = () => process.env.CRM_ADMIN_SECRET || '';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const firma = id => crypto.createHmac('sha256', SECRETO()).update('baja:' + id).digest('hex').slice(0, 32);
const enlaceBaja = id => WEB + '/api/baja-correo?i=' + encodeURIComponent(id) + '&k=' + firma(id);
const utm = (ruta, codigo) => WEB + ruta + (ruta.indexOf('?') === -1 ? '?' : '&') + 'utm_source=correo&utm_medium=email&utm_campaign=serie-' + codigo.toLowerCase();
const nombreDe = n => { const s = String(n || '').trim().split(/\s+/)[0] || ''; return /^[\p{L}'-]{2,20}$/u.test(s) ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''; };

const WA = 'https://wa.me/34639788220?text=' + encodeURIComponent('Hola, AMS Cerramientos. Me habéis escrito por correo y quiero comentaros una cosa de mis ventanas.');
const boton = (txt, url, claro) => '<p style="margin:18px 0 0"><a href="' + url + '" style="display:inline-block;background:' + (claro ? '#ffffff' : '#C2410C') + ';color:' + (claro ? '#12202B' : '#ffffff') + ';border:2px solid ' + (claro ? '#12202B' : '#C2410C') + ';padding:13px 22px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">' + txt + '</a></p>';
const lista = items => '<table cellpadding="0" cellspacing="0" style="margin:6px 0 4px">' + items.map(t => '<tr><td valign="top" style="padding:6px 10px 6px 0;color:#1B6B3A;font-weight:700;font-size:17px">&#10003;</td><td style="padding:6px 0;font-size:16px;line-height:1.5;color:#12202B">' + t + '</td></tr>').join('') + '</table>';
const img = (src, alt, url) => '<p style="margin:16px 0 0">' + (url ? '<a href="' + url + '">' : '') + '<img src="' + WEB + src + '" alt="' + esc(alt) + '" width="560" style="display:block;width:100%;max-width:560px;height:auto;border-radius:10px;border:0">' + (url ? '</a>' : '') + '</p>';
const p = t => '<p style="margin:14px 0 0;font-size:16px;line-height:1.6;color:#12202B">' + t + '</p>';

function marco(titulo, cuerpo, id) {
  return '<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#F3F5F7" style="background:#F3F5F7;padding:18px 0;font-family:Arial,Helvetica,sans-serif"><tr><td align="center">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #D9E1E9">' +
    '<tr><td bgcolor="#12202B" style="background:#12202B;padding:18px 24px"><img src="' + WEB + '/img/logo-blanco.png" alt="AMS Cerramientos" height="34" style="height:34px;width:auto;border:0;display:block"><div style="color:#C9D6E0;font-size:13px;margin-top:6px">Instaladores oficiales K&ouml;mmerling</div></td></tr>' +
    '<tr><td style="padding:26px 24px 8px"><div style="font-size:24px;line-height:1.25;font-weight:700;color:#12202B">' + titulo + '</div>' + cuerpo + '</td></tr>' +
    '<tr><td style="padding:22px 24px 6px;font-size:15px;line-height:1.5;color:#12202B"><b>Javi y el equipo de AMS</b><br>639 78 82 20 &middot; info@amscerramientos.es</td></tr>' +
    '<tr><td style="padding:14px 24px 22px;font-size:12.5px;line-height:1.5;color:#5B6B79;border-top:1px solid #E3E8ED">AMS Cerramientos &middot; Corredor del Henares y norte de Madrid<br>Recibes este correo porque pediste un precio en nuestra web y marcaste que quer&iacute;as recibir consejos y ofertas. <a href="' + enlaceBaja(id) + '" style="color:#5B6B79">Darme de baja</a> &middot; <a href="' + WEB + '/privacidad" style="color:#5B6B79">Pol&iacute;tica de privacidad</a></td></tr>' +
    '</table></td></tr></table>';
}

const PLANTILLAS = {
  B2: c => {
    const n = nombreDe(c.nombre);
    return {
      asunto: (n ? n + ', qué' : 'Qué') + ' va dentro de tu precio (para que compares bien)',
      html: marco('Qué va dentro de tu precio',
        p('Si estás comparando precios, haces bien. Solo te pedimos una cosa: compara también lo que incluye cada uno. El nuestro lleva todo esto:') +
        lista(['Ventana de PVC <b>Kömmerling</b>, hecha a la medida de tu hueco', 'Cristal doble, <b>bajo emisivo y con control solar</b>, de serie', 'Quitar las ventanas viejas y llevarnos los escombros', 'Montaje con sellado y remates de yeso o tapajuntas', 'Medición con láser en tu casa, gratis', '<b>3 años de garantía</b>']) +
        p('No hacemos alicatado ni pintura. Si quieres, en la misma obra te ponemos cajón aislado, persiana y mosquitera.') +
        boton('Ver otra vez mi precio', utm('/presupuesto-sin-visita', 'B2')) +
        p('P. D. ¿Tienes un presupuesto de otra empresa? <a href="' + utm('/revisa-tu-presupuesto', 'B2') + '" style="color:#C2410C;font-weight:700">Súbelo aquí y te lo comparamos</a>, punto por punto.'), c.id),
    };
  },
  B3: c => {
    const n = nombreDe(c.nombre);
    return {
      asunto: 'Así quedan: antes y después de cambiar las ventanas',
      html: marco('Así quedan' + (n ? ', ' + n : ''),
        p('Mejor que contártelo, mira estas obras nuestras. Son fotos reales, hechas con el móvil y sin retocar: las mismas ventanas, antes y después del cambio.') +
        img('/img/correos/ad-1.jpg', 'Antes y después de cambiar una ventana', utm('/ventanas-pvc#antes-despues', 'B3')) +
        img('/img/correos/ad-2.jpg', 'Antes y después de cambiar otra ventana', utm('/ventanas-pvc#antes-despues', 'B3')) +
        boton('Ver las 12 obras de antes y después', utm('/ventanas-pvc#antes-despues', 'B3')) +
        p('Cuando lo tengas decidido, pide la visita y vamos a medir en 1 o 2 días.') +
        boton('Pedir la visita para medir', utm('/contacto', 'B3'), true), c.id),
    };
  },
  B4: c => ({
    asunto: 'Lo que dicen quienes ya cambiaron sus ventanas con nosotros',
    html: marco('Mejor que lo cuenten ellos',
      p('Antes de gastar en ventanas, es normal querer saber si otros quedaron contentos. Nuestras reseñas están en Google, a la vista de todos, las buenas y las que no lo son tanto.') +
      '<table cellpadding="0" cellspacing="0" style="margin:18px 0 0;width:100%"><tr><td style="background:#FFF1E2;border-radius:10px;padding:18px 20px"><div style="color:#E8A100;font-size:22px;letter-spacing:2px">&#9733;&#9733;&#9733;&#9733;&#9733;</div><div style="font-size:22px;font-weight:700;color:#12202B;margin-top:4px">4,5 sobre 5 en Google</div><div style="font-size:15px;color:#3D5163;margin-top:4px">Con las opiniones de clientes que ya han hecho su obra con nosotros.</div></td></tr></table>' +
      boton('Leer las reseñas en Google', 'https://www.google.com/maps/place/?q=place_id:ChIJqT5J-TdJQg0ROP7-LXLWJv0') +
      boton('Ver nuestros trabajos', utm('/trabajos', 'B4'), true), c.id),
  }),
  B5: c => {
    const n = nombreDe(c.nombre);
    return {
      asunto: (n ? n + ', ya' : 'Ya') + ' que cambias las ventanas, ¿y la persiana?',
      html: marco('Déjalo todo hecho, de una vez',
        p('Cambiar las ventanas es la ocasión para dejar la ventana completa, sin volver a hacer obra más adelante:') +
        lista(['<b>Cajón de persiana nuevo y aislado</b>: por el cajón viejo es por donde más frío y ruido se cuelan', '<b>Persiana con motor</b>: sube y baja con un botón. Unos 120 a 140 € más por ventana que la manual', '<b>Mosquitera</b>: ventanas abiertas en verano, sin bichos']) +
        boton('Ver mi precio con persiana y mosquitera', utm('/presupuesto-sin-visita', 'B5')) +
        p('P. D. Si prefieres hablarlo, <a href="' + WA + '" style="color:#C2410C;font-weight:700">escríbenos por WhatsApp</a> y te lo contamos.'), c.id),
    };
  },
  B6: c => {
    const n = nombreDe(c.nombre);
    return {
      de: 'Javi (AMS Cerramientos)',
      asunto: (n ? n + ', ¿te' : '¿Te') + ' ayudo con algo?',
      html: '<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#12202B;max-width:600px">' +
        '<p>Hola' + (n ? ', ' + esc(n) : '') + ':</p>' +
        '<p>Soy Javi, de AMS Cerramientos. Hace unas semanas viste el precio de tus ventanas en nuestra web y no quería dejarlo en el aire.</p>' +
        '<p>¿Te quedó alguna duda? ¿Prefieres que te lo cuente por teléfono? ¿O todavía no es el momento? Cualquiera de las tres respuestas me vale, de verdad.</p>' +
        '<p>Contesta a este correo o escríbeme por WhatsApp al 639 78 82 20.</p>' +
        '<p>Un saludo,<br>Javi<br>AMS Cerramientos</p>' +
        '<p style="font-size:12.5px;color:#5B6B79;margin-top:28px">Recibes este correo porque pediste un precio en nuestra web y marcaste que querías recibir consejos y ofertas. <a href="' + enlaceBaja(c.id) + '" style="color:#5B6B79">Darme de baja</a></p></div>',
    };
  },
  B7: c => {
    const n = nombreDe(c.nombre);
    return {
      asunto: (n ? n + ', lo' : 'Lo') + ' dejamos aquí, pero tu precio sigue guardado',
      html: marco('Tu precio sigue guardado',
        p('No queremos agobiarte, así que este es nuestro último correo. Tu precio lo tienes en el correo que te mandamos el primer día, y cuando quieras lo retomamos donde lo dejaste.') +
        lista(['<b>Cuando lo tengas decidido</b>: pide la visita y vamos a medir en 1 o 2 días', '<b>Si han cambiado las medidas o lo que quieres</b>: vuelve a calcularlo en un minuto', '<b>Si te surge una duda</b>: contesta a este correo o escríbenos por WhatsApp']) +
        boton('Pedir la visita para medir', utm('/contacto', 'B7')) +
        boton('Volver a calcular mi precio', utm('/presupuesto-sin-visita', 'B7'), true) +
        p('P. D. Gracias por habernos tenido en cuenta.'), c.id),
    };
  },
};

function correoDe(codigo, c) { const f = PLANTILLAS[codigo]; return f ? f(c) : null; }
module.exports = { correoDe, firma, enlaceBaja, CODIGOS: Object.keys(PLANTILLAS) };
