// Presupuesto sin visita (1-nov-2026): el cliente manda una foto de cada ventana (con un folio A4 pegado al cristal
// para calcular la medida aproximada), el tipo, persiana y mosquitera. Llega a Javi por correo con las fotos adjuntas.
// El contacto se guarda además en el CRM desde la propia página (window.amsLead, como el resto de formularios).
// Necesita RESEND_API_KEY. Destino: CRM_AVISOS_PARA (el mismo que los avisos de contacto).
const { deDonde } = require('../../lib/deDonde.js');
const PARA = process.env.CRM_AVISOS_PARA || 'delarubiaignacio@gmail.com';
const DE = process.env.CRM_AVISOS_DE || process.env.RESPUESTAS_DE || 'Contactos AMS <guia@send.miestela.app>';
const MAX_TOTAL = 4200000; // base64; el límite de Vercel para el cuerpo es 4,5 MB
const MAX_FOTOS = 15;
const visitas = {};
const limpia = (v, n) => String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, n);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const esJpeg = b64 => { const h = Buffer.from(b64.slice(0, 8), 'base64'); return h[0] === 0xff && h[1] === 0xd8 && h[2] === 0xff; };

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const clave = process.env.RESEND_API_KEY;
  if (!clave) return res.status(503).json({ ok: false, motivo: 'sin-clave' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'x';
  const ahora = Date.now();
  visitas[ip] = (visitas[ip] || []).filter(t => ahora - t < 3600000);
  if (visitas[ip].length >= 5) return res.status(429).json({ ok: false, motivo: 'demasiados' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  const nombre = limpia(b.nombre, 80), tel = limpia(b.telefono, 30), mail = limpia(b.correo, 120), zona = limpia(b.zona, 80), msg = limpia(b.mensaje, 600);
  const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  if (tel.replace(/\D/g, '').length < 9 && !mailOk) return res.status(400).json({ ok: false, motivo: 'contacto' });
  if (b.consentimiento !== true) return res.status(400).json({ ok: false, motivo: 'consentimiento' });
  const ventanas = Array.isArray(b.ventanas) ? b.ventanas.slice(0, 40) : [];
  if (!ventanas.length) return res.status(400).json({ ok: false, motivo: 'ventanas' });
  const adjuntos = [];
  let total = 0;
  ventanas.forEach((v, i) => {
    const d = String((v && v.foto) || '').replace(/^data:[^,]*,/, '').replace(/\s+/g, '');
    if (!d || adjuntos.length >= MAX_FOTOS || !/^[A-Za-z0-9+/=]+$/.test(d) || !esJpeg(d)) return;
    if (total + d.length > MAX_TOTAL) return;
    total += d.length;
    adjuntos.push({ filename: 'ventana-' + (i + 1) + '.jpg', content: d });
  });
  visitas[ip].push(ahora);
  const filas = ventanas.map((v, i) => {
    v = v || {};
    const an = Math.round(Number(v.ancho) || 0), al = Math.round(Number(v.alto) || 0);
    const medida = an && al ? an + ' × ' + al + ' cm' + (v.como === 'foto' ? ' (calculada con el folio)' : v.como === 'mano' ? ' (escrita por el cliente)' : '') : 'sin medida';
    return '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee"><b>' + (i + 1) + '</b></td><td style="padding:6px 10px;border-bottom:1px solid #eee">' + esc(limpia(v.tipo, 40) || 'ventana') + '</td><td style="padding:6px 10px;border-bottom:1px solid #eee">' + esc(medida) + '</td><td style="padding:6px 10px;border-bottom:1px solid #eee">' + esc(limpia(v.persiana, 30) || '-') + '</td><td style="padding:6px 10px;border-bottom:1px solid #eee">' + (v.mosquitera ? 'Sí' : 'No') + '</td><td style="padding:6px 10px;border-bottom:1px solid #eee">' + esc(limpia(v.nota, 120)) + '</td></tr>';
  }).join('');
  const html = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#222;max-width:720px">' +
    '<h2 style="color:#1f6fb2;margin:0 0 8px">Presupuesto sin visita: ' + ventanas.length + ' ventana' + (ventanas.length === 1 ? '' : 's') + '</h2>' +
    '<p style="margin:0 0 12px">Las medidas son <b>aproximadas</b>: sirven para dar un precio orientativo. Si el cliente acepta, se confirman en la visita.</p>' +
    '<table style="border-collapse:collapse;margin:0 0 14px">' +
    [['Nombre', nombre || '(sin nombre)'], ['Teléfono', tel || '(no indicado)'], ['Correo', mailOk ? mail : '(no indicado)'], ['Zona', zona || '(no indicada)'], ['Mensaje', msg || '-'], ['De dónde viene', deDonde(b.origen)]].map(([k, v]) => '<tr><td style="padding:3px 12px 3px 0;color:#666">' + k + '</td><td style="padding:3px 0"><b>' + esc(v) + '</b></td></tr>').join('') +
    '</table>' +
    '<table style="border-collapse:collapse;width:100%;font-size:14px"><tr style="background:#f2f7fc;text-align:left"><th style="padding:6px 10px">#</th><th style="padding:6px 10px">Tipo</th><th style="padding:6px 10px">Medida</th><th style="padding:6px 10px">Persiana</th><th style="padding:6px 10px">Mosquitera</th><th style="padding:6px 10px">Nota</th></tr>' + filas + '</table>' +
    '<p style="margin:14px 0 0;color:#666;font-size:13px">' + adjuntos.length + ' foto' + (adjuntos.length === 1 ? '' : 's') + ' adjunta' + (adjuntos.length === 1 ? '' : 's') + '. El cliente ha aceptado que veamos las fotos y sus datos para darle el presupuesto.</p></div>';
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: DE, to: PARA.split(',').map(s => s.trim()).filter(Boolean), reply_to: mailOk ? mail : undefined, subject: 'Presupuesto sin visita: ' + ventanas.length + ' ventanas · ' + (zona || 'sin zona') + ' (' + deDonde(b.origen).split(' · ')[0].slice(0, 60) + ')', html, attachments: adjuntos })
    });
    if (!r.ok) return res.status(502).json({ ok: false });
    return res.json({ ok: true, fotos: adjuntos.length });
  } catch (e) { return res.status(502).json({ ok: false }); }
};

module.exports.config = { api: { bodyParser: { sizeLimit: '6mb' } } };
module.exports.default = module.exports;
