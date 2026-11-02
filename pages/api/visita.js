// Agenda de la visita (2-nov-2026). Lo que manda public/agenda.js después de ver el precio:
//  - tipo 'cuando': solo cuándo quiere hacer la obra (se apunta en la libreta, sin correo);
//  - tipo 'visita': pide visita para medir (día, hora, código postal y calle). Avisa a AMS, escribe al cliente
//    («te la confirmamos») y lo apunta en la libreta (si ya estaba, se suma a su ficha).
const { deDonde } = require('../../lib/deDonde.js');
const SB_URL = process.env.CRM_SUPABASE_URL || 'https://jrfqllllhweswhvwylog.supabase.co';
const SB_KEY = process.env.CRM_SUPABASE_KEY || 'sb_publishable_6w-UFyFVPWAvq7OOr9F-BQ_8e7HMvuP';
const PARA = process.env.CRM_AVISOS_PARA || 'delarubiaignacio@gmail.com';
const DE = process.env.CRM_AVISOS_DE || process.env.RESPUESTAS_DE || 'AMS Cerramientos <guia@send.miestela.app>';
const RESPONDER_A = process.env.RESPONDER_A || 'info@amscerramientos.es';
const CRM_URL = process.env.CRM_URL || 'https://ams-cerramientos-ejemplo.vercel.app/mis-contactos/';
const visitas = {};
const limpia = (v, n) => String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, n);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const HORAS = ['9:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00'];
const CUANDO = ['Lo antes posible', 'En un mes', 'De 1 a 3 meses', 'Más adelante'];

async function rpc(fn, args) {
  const r = await fetch(SB_URL + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args) });
  if (!r.ok) throw new Error('supabase ' + r.status);
  return r.json();
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'x';
  const ahora = Date.now();
  visitas[ip] = (visitas[ip] || []).filter(t => ahora - t < 3600000);
  if (visitas[ip].length >= 12) return res.status(429).json({ ok: false });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  const tipo = b.tipo === 'visita' ? 'visita' : 'cuando';
  const nombre = limpia(b.nombre, 80) || '(sin nombre)', tel = limpia(b.telefono, 30), mail = limpia(b.correo, 120);
  const cuando = CUANDO.includes(b.cuando) ? b.cuando : '';
  const canal = limpia(b.canal, 20) || 'web';
  const telOk = tel.replace(/\D/g, '').length >= 9, mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  let pide, hora = '', diaTxt = '', cp = '', calle = '';
  if (tipo === 'visita') {
    hora = HORAS.includes(b.hora) ? b.hora : '';
    diaTxt = limpia(b.diaTxt, 60);
    cp = limpia(b.cp, 5).replace(/\D/g, '');
    calle = limpia(b.calle, 120);
    if (!hora || !diaTxt || !/^\d{4}-\d{2}-\d{2}$/.test(String(b.dia || '')) || !telOk || !/^\d{5}$/.test(cp)) return res.status(400).json({ ok: false });
    pide = 'PIDE VISITA: ' + diaTxt + ' a las ' + hora + ' (confirmar). CP ' + cp + (calle ? ', ' + calle : '') + (cuando ? '. Quiere hacerlo: ' + cuando.toLowerCase() : '');
  } else {
    if (!cuando || !(telOk || mailOk)) return res.status(400).json({ ok: false });
    pide = 'Quiere hacerlo: ' + cuando.toLowerCase();
  }
  visitas[ip].push(ahora);

  // Libreta: si ya está (mismo teléfono o correo en la última media hora), se suma a su ficha
  const o = b.origen && typeof b.origen === 'object' ? b.origen : {};
  let r = null;
  try {
    r = await rpc('web_contacto', { d: Object.assign({}, o, { nombre, telefono: tel, correo: mail, zona: limpia(b.zona, 60) || cp, trabajo: 'ventanas', pide: pide + (b.resumen ? '. ' + limpia(b.resumen, 300) : ''), canal, tipo: 'contacto' }) });
  } catch (e) { r = null; }
  if (tipo === 'cuando') return res.json({ ok: true });

  const clave = process.env.RESEND_API_KEY;
  if (!clave) return res.json({ ok: true, correo: false });
  const telD = tel.replace(/\D/g, '');
  const filas = [['Día', diaTxt + ' a las ' + hora], ['Nombre', nombre], ['Teléfono', tel], ['Correo', mail || '-'], ['Código postal', cp], ['Calle', calle || '-'], ['Quiere hacerlo', cuando || '-'], ['Lo que ha visto', limpia(b.resumen, 400) || '-'], ['De dónde viene', deDonde(o)]];
  const htmlAms = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1F2A36;max-width:600px">' +
    '<p style="font-size:19px;font-weight:700;margin:0 0 4px;color:#C2410C">Pide visita para medir</p>' +
    '<p style="margin:0 0 12px">Llámale o escríbele para <b>confirmarle la hora</b>. Si no te cuadra, proponle otra.</p>' +
    '<table cellpadding="6" style="border-collapse:collapse">' + filas.map(f => '<tr><td style="color:#5B6B79;vertical-align:top">' + esc(f[0]) + '</td><td><b>' + esc(f[1]) + '</b></td></tr>').join('') + '</table>' +
    (telD ? '<p style="margin:18px 0 6px"><a href="tel:' + telD + '" style="background:#1B3247;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Llamar</a> &nbsp; <a href="https://wa.me/34' + telD.slice(-9) + '" style="background:#1FA855;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">WhatsApp</a></p>' : '') +
    '<p style="color:#5B6B79;font-size:13px;margin-top:18px">Ya está apuntado en <a href="' + CRM_URL + '">tus contactos</a>.</p></div>';
  const htmlCli = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#222;max-width:600px">' +
    '<p>Hola' + (nombre && nombre !== '(sin nombre)' ? ' ' + esc(nombre.split(' ')[0]) : '') + ':</p>' +
    '<p>Hemos recibido tu petición de visita para el <b>' + esc(diaTxt) + ' a las ' + esc(hora) + '</b>.</p>' +
    '<p>Te llamamos o te escribimos por WhatsApp para <b>confirmártela</b>. Si a esa hora no podemos, te proponemos otra muy cerca.</p>' +
    '<p>En la visita medimos con láser, te enseñamos los modelos y te damos el presupuesto definitivo por escrito, gratis y sin compromiso.</p>' +
    '<p>Un saludo,<br>AMS Cerramientos<br>639 78 82 20</p></div>';
  const manda = body => fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(x => x.ok).catch(() => false);
  const envios = [manda({ from: DE, to: PARA.split(',').map(s => s.trim()).filter(Boolean), reply_to: mailOk ? mail : undefined, subject: 'Pide visita: ' + diaTxt + ' a las ' + hora + ' · ' + nombre + ' · ' + cp, html: htmlAms })];
  if (mailOk) envios.push(manda({ from: DE, to: [mail], reply_to: RESPONDER_A, subject: 'Tu visita con AMS Cerramientos: ' + diaTxt + ' a las ' + hora + ' (te la confirmamos)', html: htmlCli }));
  const [okAms] = await Promise.all(envios);
  return res.json({ ok: true, avisado: okAms, libreta: !!(r && r.ok) });
};
module.exports.default = module.exports;
