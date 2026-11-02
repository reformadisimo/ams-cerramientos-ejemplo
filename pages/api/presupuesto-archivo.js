// Recibe la foto o el PDF de un presupuesto que sube un visitante y lo manda por correo (Resend) para que lo revise una persona.
// Necesita RESEND_API_KEY. Destino: PRESUPUESTO_DESTINO (por defecto info@amscerramientos.es, el correo de Javi, desde el 2-nov-2026) y copia oculta a PRESUPUESTO_COPIA (Ig).
const { deDonde } = require('../../lib/deDonde.js');
const { waitUntil } = require('@vercel/functions');
const { analiza } = require('../../lib/analisisPresupuesto.js');
const AV = require('../../lib/avisos.js');
const DESTINO = AV.PARA_TXT;
const COPIA = AV.COPIA.join(',');
const DE = process.env.RESPUESTAS_DE || 'Guia AMS <guia@send.miestela.app>';
const SB_URL = process.env.CRM_SUPABASE_URL || 'https://jrfqllllhweswhvwylog.supabase.co';
const SB_KEY = process.env.CRM_SUPABASE_KEY || 'sb_publishable_6w-UFyFVPWAvq7OOr9F-BQ_8e7HMvuP';
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
  const nombre = limpia(b.nombre, 80), tel = limpia(b.telefono, 30), mail = limpia(b.correo, 120), msg = limpia(b.mensaje, 600), empresa = limpia(b.empresa, 120);
  const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  if (!tel && !mailOk) return res.status(400).json({ ok: false, motivo: 'contacto' });
  if (b.consentimiento !== true) return res.status(400).json({ ok: false, motivo: 'consentimiento' });
  visitas[ip].push(ahora);
  const texto = ['Presupuesto de OTRA EMPRESA subido desde la web para que se lo comparemos.', '', 'Qué hay que contestarle (por teléfono o WhatsApp, con sinceridad):', '1. Si el precio es razonable para lo que lleva (precio por metro cuadrado).', '2. Qué falta o no está claro: serie y marca del perfil, vidrio, cajón de persiana, remates, retirada de lo viejo, garantía, plazo y forma de pago.', '3. Cómo queda al lado del nuestro con lo mismo (hacer nuestro precio en la calculadora con sus medidas).', '4. Qué opinan de esa empresa en Google: nota, número de reseñas y quejas que se repitan.', '5. Si el suyo es mejor, decírselo. Y si le encaja el nuestro, proponerle la visita.', '', 'Empresa que se lo ha dado: ' + (empresa || '(no lo dice)'), 'Nombre: ' + (nombre || '(sin nombre)'), 'Teléfono: ' + (tel || '(no indicado)'), 'Correo: ' + (mailOk ? mail : '(no indicado)'), 'Mensaje: ' + (msg || '(sin mensaje)'), 'De dónde viene: ' + deDonde(b.origen), '', 'El visitante ha aceptado que revisemos el archivo para contestarle.'].join('\n');
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: DE, to: [DESTINO], bcc: COPIA ? COPIA.split(',') : undefined, reply_to: mailOk ? mail : undefined, subject: '[Comparar] Presupuesto de otra empresa' + (empresa ? ': ' + empresa : '') + ' · ' + (nombre || tel || mail || 'sin nombre'), text: texto, attachments: [{ filename: 'presupuesto.' + TIPOS[tipo], content: datos }] })
    });
    if (!r.ok) return res.status(502).json({ ok: false });
    // Libreta de clientes: se apunta como contacto (canal revisa-presupuesto). Si falla, el correo ya ha salido.
    try {
      await fetch(SB_URL + '/rest/v1/rpc/web_contacto', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ d: Object.assign({}, (b.origen && typeof b.origen === 'object') ? b.origen : {}, { nombre: nombre || '(sin nombre)', telefono: tel, correo: mailOk ? mail : '', trabajo: 'ventanas', pide: 'Sube el presupuesto de otra empresa' + (empresa ? ' (' + empresa + ')' : '') + ' para que se lo comparemos' + (msg ? '. ' + msg : ''), canal: 'revisa-presupuesto', tipo: 'contacto' }) }) });
    } catch (e) {}
    // Informe con IA (2-nov-2026): lee el presupuesto, lo compara con nuestra tarifa, mira sus opiniones y deja un borrador.
    // Va por detrás (waitUntil) y llega a DESTINO como segundo correo; al cliente no le sale nada sin aprobarlo.
    if (process.env.ANTHROPIC_API_KEY && process.env.ANALISIS_IA !== '0') {
      waitUntil(analiza({ tipo, datos, nombre, tel, mail: mailOk ? mail : '', empresa, msg, destino: DESTINO, copia: COPIA, de: DE, resendKey: clave }).catch(e => console.error('analisis', e && e.message)));
    }
    return res.json({ ok: true });
  } catch (e) { return res.status(502).json({ ok: false }); }
};

module.exports.config = { api: { bodyParser: { sizeLimit: "6mb" } } };

/* Next.js (pages/api) pide la función como exportación "default" */
module.exports.default = module.exports;
