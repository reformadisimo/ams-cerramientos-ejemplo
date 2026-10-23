// Recibe las respuestas del cuestionario de Javi y las manda por correo a Ignacio con Resend.
// Necesita la variable RESEND_API_KEY (clave solo de envio). Sin ella responde 503 y la web usa el boton de correo.
const PARA = 'delarubiaignacio@gmail.com';
const DE = process.env.RESPUESTAS_DE || 'Guia AMS <guia@send.miestela.app>';
const visitas = {};
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const clave = process.env.RESEND_API_KEY;
  if (!clave) return res.status(503).json({ ok: false, motivo: 'sin-clave' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'x';
  const ahora = Date.now();
  visitas[ip] = (visitas[ip] || []).filter(t => ahora - t < 3600000);
  if (visitas[ip].length >= 20) return res.status(429).json({ ok: false });
  visitas[ip].push(ahora);
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const texto = String((body && body.texto) || '').slice(0, 20000);
  if (texto.trim().length < 5) return res.status(400).json({ ok: false });
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: DE, to: [PARA], subject: 'Respuestas de Javi - AMS Cerramientos', text: texto })
    });
    if (!r.ok) return res.status(502).json({ ok: false });
    return res.json({ ok: true });
  } catch (e) { return res.status(502).json({ ok: false }); }
};
