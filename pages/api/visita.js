// Agenda de la visita (2-nov-2026). Lo que manda public/agenda.js después de ver el precio:
//  - tipo 'cuando': solo cuándo quiere hacer la obra (se apunta en la libreta, sin correo);
//  - tipo 'visita': pide visita para medir (día, hora, código postal y calle). Avisa a AMS, escribe al cliente
//    («te la confirmamos») y lo apunta en la libreta (si ya estaba, se suma a su ficha).
const { deDonde } = require('../../lib/deDonde.js');
const SB_URL = process.env.CRM_SUPABASE_URL || 'https://jrfqllllhweswhvwylog.supabase.co';
const SB_KEY = process.env.CRM_SUPABASE_KEY || 'sb_publishable_6w-UFyFVPWAvq7OOr9F-BQ_8e7HMvuP';
const AV = require('../../lib/avisos.js');
const PARA = AV.PARA_TXT;
const DE = require('../../lib/remitente').DE;
const RESPONDER_A = process.env.RESPONDER_A || 'info@amscerramientos.es';
const CRM_URL = process.env.CRM_URL || 'https://www.amscerramientos.es/mis-contactos/';
const visitas = {};
const limpia = (v, n) => String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, n);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const HORAS = ['9:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00'];
const CUANDO = ['Lo antes posible', 'En un mes', 'De 1 a 3 meses', 'Más adelante'];
const FASES = { decidido: 'Decidido, quiere confirmar medidas', comparando: 'Comparando presupuestos', precio: 'Solo quería saber el precio' };
// Encaje por código postal (mismas zonas que /api/fotos)
const NORTE_CP = /^(28109|28050|28043|28042|28860|28120|28707)$/;
const CP_NO = /^(2890\d|2892[0-5]|28320|2898[0-4]|2894[0-6]|28760|28770|2823[0-2]|28290|2822[0-4])$/;
const CP_SI = /^(288\d\d|2810[08]|2870\d|28750|28110|192\d\d|1917\d)$/;
function encajeCp(cp) {
  if (NORTE_CP.test(cp)) return 'Interesa, zona norte (+25 %, 6 ventanas o más)';
  if (/^280[0-5]\d$/.test(cp)) return 'No encaja, Madrid capital';
  if (CP_NO.test(cp) || !/^(28|19)/.test(cp)) return 'No encaja, zona donde no trabajas';
  if (CP_SI.test(cp)) return 'Interesa, tu zona';
  return 'A valorar, zona por confirmar';
}
const CANALES = { 'revisa-presupuesto': 'Comparar presupuesto', calculadora: 'Calculadora', configurador: 'Configurador', 'sin-visita': 'Precio con fotos', formulario: 'Formulario', web: 'Web' };

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
  const fase = FASES[b.fase] || '';
  const telOk = tel.replace(/\D/g, '').length >= 9, mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  let pide, hora = '', diaTxt = '', cp = '', calle = '';
  if (tipo === 'visita') {
    hora = HORAS.includes(b.hora) ? b.hora : '';
    diaTxt = limpia(b.diaTxt, 60);
    cp = limpia(b.cp, 5).replace(/\D/g, '');
    calle = limpia(b.calle, 120);
    if (!hora || !diaTxt || !/^\d{4}-\d{2}-\d{2}$/.test(String(b.dia || '')) || !telOk || !/^\d{5}$/.test(cp)) return res.status(400).json({ ok: false });
    pide = 'PIDE VISITA: ' + diaTxt + ' a las ' + hora + ' (confirmar). CP ' + cp + (calle ? ', ' + calle : '') + (cuando ? '. Quiere hacerlo: ' + cuando.toLowerCase() : '') + (fase ? '. Está: ' + fase.toLowerCase() : '');
  } else {
    if (!(cuando || fase) || !(telOk || mailOk)) return res.status(400).json({ ok: false });
    pide = [cuando ? 'Quiere hacerlo: ' + cuando.toLowerCase() : '', fase ? 'Está: ' + fase.toLowerCase() : ''].filter(Boolean).join('. ');
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
  const filas = [['Encaje', encajeCp(cp)], ['Día preferido', diaTxt], ['Hora', hora + (Number(hora.split(':')[0]) < 14 ? ' (mañana)' : ' (tarde)')], ['Nombre', nombre], ['Teléfono', tel], ['Correo', mail || '-'], ['Código postal', cp], ['Calle', calle || '-'], ['En qué punto está', fase || '-'], ['Quiere hacerlo', cuando || '-'], ['Lo que ha visto', limpia(b.resumen, 400) || '-'], ['De dónde viene', deDonde(o)]];
  const enc = encajeCp(cp), herr = CANALES[canal] || 'Web';
  const prisa = (cuando === 'Lo antes posible' || !cuando) && b.fase !== 'comparando';
  const htmlAms = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1F2A36;max-width:600px">' +
    '<div style="border-left:5px solid #1B6B3A;background:#E8F5EC;border-radius:8px;padding:12px 14px;margin:0 0 14px">' +
    '<b style="color:#14532D">Llamar ya</b> · Pide la visita: llama en menos de 5 minutos si se puede, y confírmale la hora (si no te cuadra, proponle otra).<br>' +
    '<span style="color:#14532D;font-size:14px">' + esc(enc) + ' · ' + esc((fase || 'no dice en qué punto está').toLowerCase()) + ' · quiere hacerlo: ' + esc((cuando || 'no lo dice').toLowerCase()) + ' · deja teléfono</span></div>' +
    '<p style="font-size:18px;font-weight:700;margin:0 0 10px">PIDE VISITA · ' + esc(herr) + '</p>' +
    '<table cellpadding="6" style="border-collapse:collapse">' + filas.map(f => '<tr><td style="color:#5B6B79;vertical-align:top">' + esc(f[0]) + '</td><td><b>' + esc(f[1]) + '</b></td></tr>').join('') + '</table>' +
    (telD ? '<p style="margin:18px 0 6px"><a href="tel:' + telD + '" style="background:#1B3247;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Llamar</a> &nbsp; <a href="https://wa.me/34' + telD.slice(-9) + '" style="background:#1FA855;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">WhatsApp</a></p>' : '') +
    '<p style="color:#5B6B79;font-size:13px;margin-top:18px">Ya está apuntado en <a href="' + CRM_URL + '">tus contactos</a>.</p></div>';
  const htmlCli = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#222;max-width:600px">' +
    '<p>Hola' + (nombre && nombre !== '(sin nombre)' ? ' ' + esc(nombre.split(' ')[0]) : '') + ':</p>' +
    '<p>Hemos recibido tu petición de visita para el <b>' + esc(diaTxt) + ' a las ' + esc(hora) + '</b>.</p>' +
    '<p>Te llamamos o te escribimos por WhatsApp para <b>confirmártela</b>. Si a esa hora no podemos, te proponemos otra muy cerca.</p>' +
    '<p>En la visita medimos con láser, te enseñamos los modelos y te damos el presupuesto definitivo por escrito, gratis y sin compromiso. Como ya conoces tu precio, el definitivo sale prácticamente igual.</p>' +
    '<p>Te pedimos un favor: si cambian tus planes o todavía no lo tienes decidido, avísanos y la movemos sin problema. Así podemos atender antes a quien está listo para empezar, y cuando seas tú, iremos igual de rápido a tu casa.</p>' +
    '<p>Un saludo,<br>AMS Cerramientos<br>639 78 82 20</p></div>';
  const manda = body => fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(x => x.ok).catch(() => false);
  const envios = [manda({ from: DE, to: PARA.split(',').map(s => s.trim()).filter(Boolean), bcc: AV.bcc, reply_to: mailOk ? mail : undefined, subject: (prisa ? '[Llamar ya] ' : '') + 'PIDE VISITA · ' + (CANALES[canal] || 'Web') + ': ' + nombre + ' · ' + diaTxt + ' a las ' + hora + ' · ' + cp, html: htmlAms })];
  if (mailOk) envios.push(manda({ from: DE, to: [mail], reply_to: RESPONDER_A, subject: 'Tu visita con AMS Cerramientos: ' + diaTxt + ' a las ' + hora + ' (te la confirmamos)', html: htmlCli }));
  const [okAms] = await Promise.all(envios);
  return res.json({ ok: true, avisado: okAms, libreta: !!(r && r.ok) });
};
module.exports.default = module.exports;
