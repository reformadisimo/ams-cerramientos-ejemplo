// Recibe la foto o el PDF de un presupuesto que sube un visitante y lo manda por correo (Resend) para que lo revise una persona.
// Necesita RESEND_API_KEY. Destino: variable PRESUPUESTO_DESTINO (por defecto, el correo de Ignacio mientras la web es un ejemplo).
const { deDonde } = require('../../lib/deDonde.js');
const DESTINO = process.env.PRESUPUESTO_DESTINO || 'delarubiaignacio@gmail.com';
const DE = process.env.RESPUESTAS_DE || 'Guia AMS <guia@send.miestela.app>';
const TIPOS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' };
const MAX_B64 = 4300000; // unos 3,2 MB reales; el limite de Vercel para el cuerpo es 4,5 MB
const visitas = {};
function firmaOk(b64, tipo) {
  const h = Buffer.from(b64.slice(0, 24), 'base64');
  if (tipo === 'image/jpeg') return h[0] === 0xff && h[1] === 0xd8 && h[2] === 0xff;
  if (tipo === 'image/png') return h[0] === 0x89 && h[1] === 0x50 && h[2] === 0x4e && h[3] === 0x47;
  if (tipo === 'image/webp') return h.slice(0, 4).toString() === 'RIFF' && h.slice(8, 12).toString() === 'WEBP';
  if (tipo === 'application/pdf') return h.slice(0, 4).toString() === '%PDF';
  return false;
}
const limpia = (v, n) => String(v || '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, n);
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
  const tipo = limpia(b.tipo, 40);
  const datos = String(b.datos || '').replace(/^data:[^,]*,/, '').replace(/\s+/g, '');
  if (!TIPOS[tipo] || !datos || datos.length > MAX_B64 || !/^[A-Za-z0-9+/=]+$/.test(datos) || !firmaOk(datos, tipo)) return res.status(400).json({ ok: false, motivo: 'archivo' });
  const nombre = limpia(b.nombre, 80), tel = limpia(b.telefono, 30), mail = limpia(b.correo, 120), msg = limpia(b.mensaje, 600);
  const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  if (!tel && !mailOk) return res.status(400).json({ ok: false, motivo: 'contacto' });
  if (b.consentimiento !== true) return res.status(400).json({ ok: false, motivo: 'consentimiento' });
  visitas[ip].push(ahora);
  const texto = ['Presupuesto subido desde la web para que lo revisemos.', '', 'Nombre: ' + (nombre || '(sin nombre)'), 'Teléfono: ' + (tel || '(no indicado)'), 'Correo: ' + (mailOk ? mail : '(no indicado)'), 'Mensaje: ' + (msg || '(sin mensaje)'), 'De dónde viene: ' + deDonde(b.origen), '', 'El visitante ha aceptado que revisemos el archivo para contestarle.'].join('\n');
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: DE, to: [DESTINO], reply_to: mailOk ? mail : undefined, subject: 'Presupuesto para revisar (web AMS)', text: texto, attachments: [{ filename: 'presupuesto.' + TIPOS[tipo], content: datos }] })
    });
    if (!r.ok) return res.status(502).json({ ok: false });
    return res.json({ ok: true });
  } catch (e) { return res.status(502).json({ ok: false }); }
};

module.exports.config = { api: { bodyParser: { sizeLimit: "6mb" } } };

/* Next.js (pages/api) pide la función como exportación "default" */
module.exports.default = module.exports;
