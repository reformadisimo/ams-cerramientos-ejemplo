// Precio con fotos (1-nov-2026). El cliente manda una foto de cada ventana (con un folio A4 pegado al cristal, la web
// ya ha calculado la medida aproximada), cómo se abre, persiana y mosquitera, su código postal y sus datos.
// Aquí se calcula el precio con la misma tarifa que la calculadora (precio.js) y:
//  - en las urbanizaciones del norte de Madrid (por código postal) se aplica un 25 % más y solo obras de 6 ventanas o más;
//  - en el resto de Madrid capital no se da precio (no trabajamos allí);
//  - se devuelve el precio para enseñarlo en pantalla, se manda a AMS con las fotos y al cliente por correo.
// Necesita RESEND_API_KEY para los correos; sin ella devuelve el precio igualmente.
const { deDonde } = require('../../lib/deDonde.js');
const { calcula } = require('./precio.js');
const PARA = process.env.CRM_AVISOS_PARA || 'delarubiaignacio@gmail.com';
const DE = process.env.CRM_AVISOS_DE || process.env.RESPUESTAS_DE || 'AMS Cerramientos <guia@send.miestela.app>';
const RESPONDER_A = process.env.RESPONDER_A || 'info@amscerramientos.es';
const MAX_TOTAL = 4200000; // base64; el límite de Vercel para el cuerpo es 4,5 MB
const MAX_FOTOS = 15;
const NORTE_CP = { '28109': 'La Moraleja y El Soto (Alcobendas)', '28050': 'El Encinar de los Reyes', '28043': 'Conde Orgaz y Piovera', '28042': 'Alameda de Osuna', '28860': 'Paracuellos de Jarama', '28120': 'Santo Domingo (Algete)', '28707': 'Ciudalcampo y Fuente del Fresno' };
const RECARGO_NORTE = Number(process.env.RECARGO_NORTE || 1.25);
const MIN_NORTE = 6;
const visitas = {};
const limpia = (v, n) => String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, n);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const esJpeg = b64 => { const h = Buffer.from(b64.slice(0, 8), 'base64'); return h[0] === 0xff && h[1] === 0xd8 && h[2] === 0xff; };
const eur = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
const r10 = n => Math.round(n / 10) * 10;
const APERTURAS = { oscilobatiente: 1, practicable: 1, corredera: 1 };
const PERSIANAS = { motor: 1, manual: 1, no: 1 };

// Zonas de Javi (1-nov-2026): unos 35 km alrededor de Villalbilla, norte (Alcobendas, San Sebastián de los Reyes,
// La Moraleja, Algete, San Agustín) y Guadalajara si hay mercado. No trabaja en Madrid capital ni en el sur y el oeste.
const CP_NO = /^(2890\d|2892[0-5]|28320|2898[0-4]|2894[0-6]|28760|28770|2823[0-2]|28290|2822[0-4])$/;
const CP_SI = /^(288\d\d|2810[08]|2870\d|28750|28110|192\d\d|1917\d)$/;
function zonaDe(cp) {
  if (NORTE_CP[cp]) return { tipo: 'norte', nombre: NORTE_CP[cp] };
  if (/^280[0-5]\d$/.test(cp)) return { tipo: 'centro', nombre: 'Madrid capital' };
  if (CP_NO.test(cp)) return { tipo: 'no', nombre: '' };
  if (!/^(28|19)/.test(cp)) return { tipo: 'fuera', nombre: '' };
  if (CP_SI.test(cp)) return { tipo: 'si', nombre: '' };
  return { tipo: 'normal', nombre: '' };
}
const ZONAS_TXT = 'Trabajamos en el Corredor del Henares, en el norte de Madrid (Alcobendas, San Sebastián de los Reyes, La Moraleja, Algete...) y en Guadalajara.';

function precioVentanas(ventanas, zona) {
  const lineas = [];
  let low = 0, high = 0, iva = false;
  ventanas.forEach((v, i) => {
    const w = Number(v.ancho) || 0, h = Number(v.alto) || 0;
    if (!w || !h) { lineas.push(null); return; }
    const p = calcula({ svc: 'ventanas', ventanas: [{ n: 1, w, h }], material: 'pvc', apertura: APERTURAS[v.apertura] ? v.apertura : 'oscilobatiente', vidrio: 'termico', color: 'blanco', persiana: PERSIANAS[v.per] ? v.per : 'no', mosquitera: !!v.mosquitera });
    if (!p) { lineas.push(null); return; }
    const f = zona.tipo === 'norte' ? RECARGO_NORTE : 1;
    const l = { low: r10(p.low * f), high: r10(p.high * f) };
    low += l.low; high += l.high; iva = iva || p.iva_incluido;
    lineas.push(l);
  });
  return { lineas, low, high, iva };
}

function describe(v, i, l) {
  const an = Math.round(Number(v.ancho) || 0), al = Math.round(Number(v.alto) || 0);
  return 'Ventana ' + (i + 1) + ': ' + (an && al ? an + ' × ' + al + ' cm' : 'sin medida') + ', ' + limpia(v.tipo, 60).split(' (')[0].toLowerCase() +
    (v.per && v.per !== 'no' ? ', persiana ' + limpia(v.persiana, 30).toLowerCase() : '') + (v.mosquitera ? ', mosquitera' : '') + (l ? ': ' + eur(l.low) + ' a ' + eur(l.high) : '');
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'x';
  const ahora = Date.now();
  visitas[ip] = (visitas[ip] || []).filter(t => ahora - t < 3600000);
  if (visitas[ip].length >= 8) return res.status(429).json({ ok: false, motivo: 'demasiados' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  const nombre = limpia(b.nombre, 80), tel = limpia(b.telefono, 30), mail = limpia(b.correo, 120), pueblo = limpia(b.zona, 80), msg = limpia(b.mensaje, 600);
  const cp = limpia(b.cp, 5).replace(/\D/g, '');
  const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  if (!/^\d{5}$/.test(cp)) return res.status(400).json({ ok: false, motivo: 'cp' });
  if (!mailOk) return res.status(400).json({ ok: false, motivo: 'correo' });
  if (b.consentimiento !== true) return res.status(400).json({ ok: false, motivo: 'consentimiento' });
  const ventanas = Array.isArray(b.ventanas) ? b.ventanas.slice(0, 40) : [];
  if (!ventanas.length) return res.status(400).json({ ok: false, motivo: 'ventanas' });
  visitas[ip].push(ahora);

  // ---------- precio ----------
  const zona = zonaDe(cp);
  let precio = null, aviso = '';
  if (zona.tipo === 'centro') aviso = 'En el centro de Madrid no trabajamos: con el tráfico y el aparcamiento no podemos darte el servicio que queremos. ' + ZONAS_TXT;
  else if (zona.tipo === 'no' || zona.tipo === 'fuera') aviso = 'Lo sentimos: tu zona nos queda lejos y no podríamos darte el servicio que queremos. ' + ZONAS_TXT;
  else if (zona.tipo === 'norte' && ventanas.length < MIN_NORTE) aviso = 'En ' + zona.nombre + ' hacemos obras completas, de ' + MIN_NORTE + ' ventanas o más. Para menos, te atendería mejor un instalador más cercano. Si más adelante cambias el resto, aquí estamos.';
  else precio = precioVentanas(ventanas, zona);
  const nivel = zona.tipo === 'centro' ? 'No encaja (Madrid capital)' : zona.tipo === 'no' || zona.tipo === 'fuera' ? 'No encaja (zona donde no trabajamos)' : zona.tipo === 'si' ? 'Interesa (su zona)' : zona.tipo === 'norte' ? (ventanas.length >= MIN_NORTE ? 'Interesa (zona norte, +' + Math.round((RECARGO_NORTE - 1) * 100) + ' %)' : 'No encaja (zona norte, menos de ' + MIN_NORTE + ' ventanas)') : 'Su zona o por confirmar';

  // ---------- fotos ----------
  const adjuntos = [];
  let total = 0;
  ventanas.forEach((v, i) => {
    const d = String((v && v.foto) || '').replace(/^data:[^,]*,/, '').replace(/\s+/g, '');
    if (!d || adjuntos.length >= MAX_FOTOS || !/^[A-Za-z0-9+/=]+$/.test(d) || !esJpeg(d) || total + d.length > MAX_TOTAL) return;
    total += d.length;
    adjuntos.push({ filename: 'ventana-' + (i + 1) + '.jpg', content: d });
  });

  const respuesta = { ok: true, zona: zona.tipo, zonaNombre: zona.nombre, aviso, precio: precio && { low: precio.low, high: precio.high, iva: precio.iva, lineas: precio.lineas } };
  const clave = process.env.RESEND_API_KEY;
  if (!clave) return res.json(Object.assign(respuesta, { correo: false }));

  const lineasTxt = ventanas.map((v, i) => describe(v || {}, i, precio && precio.lineas[i]));
  const totalTxt = precio && precio.low ? eur(precio.low) + ' a ' + eur(precio.high) + (precio.iva ? ' (IVA incluido)' : ' (más IVA)') : (aviso ? 'sin precio: ' + aviso.split('.')[0] : 'sin precio');
  const htmlAms = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#222;max-width:720px">' +
    '<h2 style="color:#1f6fb2;margin:0 0 8px">Precio con fotos: ' + ventanas.length + ' ventana' + (ventanas.length === 1 ? '' : 's') + '</h2>' +
    '<p style="margin:0 0 12px"><b>Encaje:</b> ' + esc(nivel) + '<br><b>Precio que ha visto el cliente:</b> ' + esc(totalTxt) + '</p>' +
    '<table style="border-collapse:collapse;margin:0 0 14px">' +
    [['Nombre', nombre || '(sin nombre)'], ['Teléfono', tel || '(no lo ha puesto)'], ['Correo', mail], ['Acepta correos de ofertas', b.publicidad === true ? 'Sí' : 'No'], ['Código postal', cp + (zona.nombre ? ' (' + zona.nombre + ')' : '')], ['Pueblo o urbanización', pueblo || '-'], ['Mensaje', msg || '-'], ['De dónde viene', deDonde(b.origen)]].map(([k, v]) => '<tr><td style="padding:3px 12px 3px 0;color:#666">' + k + '</td><td style="padding:3px 0"><b>' + esc(v) + '</b></td></tr>').join('') +
    '</table><ul style="margin:0 0 12px;padding-left:20px">' + lineasTxt.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>' +
    '<p style="margin:0;color:#666;font-size:13px">Medidas aproximadas, calculadas con la foto y el folio (o escritas por el cliente). Se confirman en la visita. ' + adjuntos.length + ' foto' + (adjuntos.length === 1 ? '' : 's') + ' adjunta' + (adjuntos.length === 1 ? '' : 's') + '.</p></div>';
  const htmlCliente = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#222;max-width:620px">' +
    '<p>Hola' + (nombre ? ' ' + esc(nombre.split(' ')[0]) : '') + ':</p>' +
    (precio && precio.low
      ? '<p>Gracias por usar el precio con fotos de AMS Cerramientos. Este es tu <b>precio orientativo</b>:</p>' +
        '<p style="font-size:26px;font-weight:bold;color:#12202B;margin:8px 0">' + eur(precio.low) + ' a ' + eur(precio.high) + '</p>' +
        '<p style="color:#555;margin:0 0 10px">' + (precio.iva ? 'IVA incluido. ' : 'Más IVA. ') + 'PVC de calidad, montaje y remates incluidos.</p>' +
        '<ul style="padding-left:20px">' + lineasTxt.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>' +
        '<p><b>¿Y ahora?</b> Te contestamos el mismo día y vamos a medir con láser en 1 o 2 días, para darte el presupuesto definitivo por escrito, sin compromiso.</p>'
      : '<p>Gracias por usar el precio con fotos de AMS Cerramientos.</p><p>' + esc(aviso || 'Te contestamos el mismo día para darte el precio.') + '</p>') +
    '<p>Si lo prefieres, llámanos o escríbenos por WhatsApp al <b>639 78 82 20</b>.</p><p>Un saludo,<br>AMS Cerramientos<br>Villalbilla (Madrid)</p></div>';

  const manda = (body) => fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.ok).catch(() => false);
  const [okAms, okCli] = await Promise.all([
    manda({ from: DE, to: PARA.split(',').map(s => s.trim()).filter(Boolean), reply_to: mail, subject: (zona.tipo === 'norte' ? 'Zona norte · ' : '') + 'Precio con fotos: ' + ventanas.length + ' ventanas · ' + cp + ' (' + deDonde(b.origen).split(' · ')[0].slice(0, 60) + ')', html: htmlAms, attachments: adjuntos }),
    manda({ from: DE, to: [mail], reply_to: RESPONDER_A, subject: precio && precio.low ? 'Tu precio orientativo de ventanas: ' + eur(precio.low) + ' a ' + eur(precio.high) : 'Tu consulta de ventanas en AMS Cerramientos', html: htmlCliente })
  ]);
  return res.json(Object.assign(respuesta, { correo: okCli, avisado: okAms }));
};

module.exports.config = { api: { bodyParser: { sizeLimit: '6mb' } } };
module.exports.default = module.exports;
