// Envía al cliente la respuesta de «Comparar presupuesto» SOLO cuando una persona la aprueba (2-nov-2026).
// El enlace del informe lleva un token firmado (lib/analisisPresupuesto.js) con el correo del cliente y el borrador;
// la página /aprobar-respuesta deja cambiar el texto y lo manda aquí. Una vez por token (Idempotency-Key de Resend).
const crypto = require('crypto');
const { verifica } = require('../../lib/analisisPresupuesto.js');
const DE = require('../../lib/remitente').DE;
const RESPONDER = process.env.RESPONDER_A || 'info@amscerramientos.es';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  const t = verifica(req.method === 'GET' ? req.query.t : b.t);
  if (!t) return res.status(403).json({ ok: false, motivo: 'enlace' });
  if (req.method === 'GET') return res.json({ ok: true, to: t.to, nombre: t.nombre || '', asunto: t.asunto, texto: t.texto });
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const clave = require('../../lib/remitente').CLAVE;
  if (!clave) return res.status(503).json({ ok: false, motivo: 'sin-clave' });
  const texto = String(b.texto || '').trim().slice(0, 4000);
  if (texto.length < 20) return res.status(400).json({ ok: false, motivo: 'texto' });
  const html = '<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.55;color:#1F2A36;max-width:600px">' +
    esc(texto).split(/\n{2,}/).map(p => '<p style="margin:0 0 14px">' + p.replace(/\n/g, '<br>') + '</p>').join('') + '</div>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json', 'Idempotency-Key': 'aprobar-' + crypto.createHash('sha256').update(String(b.t)).digest('hex').slice(0, 40) },
    body: JSON.stringify({ from: DE, to: [t.to], reply_to: RESPONDER, subject: t.asunto || 'Tu presupuesto, comparado', text: texto, html })
  });
  if (!r.ok) return res.status(502).json({ ok: false, motivo: 'envio', detalle: (await r.text()).slice(0, 200) });
  return res.json({ ok: true });
};

/* Next.js (pages/api) pide la función como exportación "default" */
module.exports.default = module.exports;
