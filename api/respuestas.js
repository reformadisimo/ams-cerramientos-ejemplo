// Recibe de la guía de Javi tres tipos de aviso y los manda por correo a Ignacio con Resend:
// visitas ("VISITA: ..."), reacciones a una sección ("REACCION de Javi a la sección N (Título): Me encanta")
// y las respuestas del cuestionario. Cada tipo llega con su propio asunto y en un correo fácil de leer.
// Necesita la variable RESEND_API_KEY (clave solo de envio). Sin ella responde 503 y la web usa el boton de correo.
const PARA = 'delarubiaignacio@gmail.com';
const DE = process.env.RESPUESTAS_DE || 'Guía de Javi (AMS) <guia@send.miestela.app>';
const GUIA = 'https://ams-cerramientos-ejemplo.vercel.app/guia-javi';
const visitas = {};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function preparar(texto) {
  const t = texto.trim();
  const caja = (titulo, cuerpo, enlace) =>
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#12202B;max-width:640px">` +
    `<h2 style="font-size:19px;margin:0 0 12px">${titulo}</h2>${cuerpo}` +
    `<p style="margin:22px 0 0"><a href="${enlace}" style="background:#12202B;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Abrir la guía</a></p>` +
    `<p style="color:#6B7A86;font-size:12px;margin-top:22px">Aviso automático de la guía de AMS Cerramientos.</p></div>`;

  const visita = t.match(/^VISITA: se ha abierto la guía \(([^)]+)\), (.+?)\.?$/);
  if (visita) {
    return {
      asunto: `AMS: Javi ha abierto la guía (${visita[1]}, ${visita[2].split(', ')[1] || visita[2]})`,
      html: caja('Javi ha abierto la guía', `<p>Desde el <b>${esc(visita[1])}</b>, el ${esc(visita[2])}.</p><p style="color:#4A5A68">Solo avisa una vez cada 4 horas por dispositivo. Si has sido tú, abre la guía una vez con <b>?yo=1</b> al final de la dirección en ese navegador y no volverá a avisarte.</p>`, GUIA),
    };
  }
  const reaccion = t.match(/^REACCION de Javi a la sección (\S+) \((.+)\): (.+)$/s);
  if (reaccion) {
    return {
      asunto: `AMS: Javi dice "${reaccion[3]}" en "${reaccion[2]}"`,
      html: caja(`Javi ha reaccionado a la sección ${esc(reaccion[1])}`, `<p style="font-size:17px"><b>${esc(reaccion[3])}</b></p><p>Sección: ${esc(reaccion[2])}</p>`, GUIA),
    };
  }
  // Respuestas del cuestionario: bloques "N. pregunta\n   respuesta".
  const bloques = t.split(/\n\s*\n/).slice(1);
  const total = bloques.length;
  const vacias = bloques.filter((b) => /\(sin respuesta\)/.test(b)).length;
  const cuerpo = bloques
    .map((b) => {
      const [p, ...r] = b.split('\n');
      const resp = r.join(' ').trim();
      const sin = /\(sin respuesta\)/.test(resp);
      return `<p style="margin:0 0 12px"><b>${esc(p)}</b><br><span style="color:${sin ? '#9AA7B2' : '#12202B'}">${esc(sin ? 'Sin contestar' : resp)}</span></p>`;
    })
    .join('');
  return {
    asunto: `AMS: respuestas de Javi al cuestionario (${total - vacias} de ${total} contestadas)`,
    html: caja('Respuestas de Javi', cuerpo || `<pre style="white-space:pre-wrap">${esc(t)}</pre>`, GUIA + '#s24'),
  };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const clave = process.env.RESEND_API_KEY;
  if (!clave) return res.status(503).json({ ok: false, motivo: 'sin-clave' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'x';
  const ahora = Date.now();
  visitas[ip] = (visitas[ip] || []).filter((t) => ahora - t < 3600000);
  if (visitas[ip].length >= 20) return res.status(429).json({ ok: false });
  visitas[ip].push(ahora);
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const texto = String((body && body.texto) || '').slice(0, 20000);
  if (texto.trim().length < 5) return res.status(400).json({ ok: false });
  const { asunto, html } = preparar(texto);
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: DE, to: [PARA], subject: asunto, html, text: texto }),
    });
    if (!r.ok) return res.status(502).json({ ok: false });
    return res.json({ ok: true });
  } catch (e) { return res.status(502).json({ ok: false }); }
};
