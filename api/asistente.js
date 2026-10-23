// Asistente 24 h de AMS Cerramientos. Misma idea que el de Tierno Centella: responde con Claude en directo (streaming),
// con el contenido de la web + las notas de Javi como conocimiento, y recoge contactos para que Javi llame.
// Variables de Vercel: ANTHROPIC_API_KEY (obligatoria), RESEND_API_KEY (para avisos), ASISTENTE_PARA (destino de avisos;
// por defecto el correo de Ignacio mientras la web es un ejemplo), ASISTENTE_MODELO (opcional), ASISTENTE_DE (remitente).
// POST { mensajes:[{role,content}] }            -> texto en directo
// POST { accion:'contacto', nombre, telefono, consentimiento, mensajes } -> { ok }
// POST { accion:'duda', pregunta }               -> { ok }  (pregunta que el asistente no supo contestar)
const { promptAsistente, conocimientoWeb } = require('./_asistente-prompt.js');
const DESTINO = process.env.ASISTENTE_PARA || 'delarubiaignacio@gmail.com';
const DE = process.env.ASISTENTE_DE || process.env.RESPUESTAS_DE || 'Asistente AMS <guia@send.miestela.app>';
const MODELOS = [process.env.ASISTENTE_MODELO || 'claude-sonnet-5-5', 'claude-sonnet-4-5'];
const usos = {}, avisos = {};
const limpia = (v, n) => String(v || '').replace(/[\r\t]+/g, ' ').trim().slice(0, n);
function limite(ip, mapa, max, ms) {
  const t = Date.now();
  mapa[ip] = (mapa[ip] || []).filter(x => t - x < ms);
  if (mapa[ip].length >= max) return false;
  mapa[ip].push(t); return true;
}
async function correo(asunto, texto, responder) {
  const clave = process.env.RESEND_API_KEY;
  if (!clave) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: DE, to: [DESTINO], subject: asunto, text: texto, reply_to: responder || undefined })
    });
    return r.ok;
  } catch (e) { return false; }
}
// Guarda la conversación (solo escritura, tabla aislada en Supabase). Sin IP. Si falla, no afecta al chat.
async function guarda(cid, rol, contenido, pagina) {
  // Clave publicable (solo puede ESCRIBIR en la tabla ams_chat; no lee nada). Se puede sustituir con variables de entorno.
  const url = process.env.AMS_SUPABASE_URL || 'https://thzntlymcsazcjrddqjm.supabase.co';
  const key = process.env.AMS_SUPABASE_KEY || 'sb_publishable_rkrwbrgbW_ebOtWTSoY_mA_LZu8SsT5';
  if (!url || !key || typeof cid !== 'string' || cid.length < 8 || !contenido) return;
  try {
    await fetch(url.replace(/\/$/, '') + '/rest/v1/ams_chat', {
      method: 'POST',
      headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ conversacion: cid.slice(0, 64), rol, contenido: String(contenido).slice(0, 8000), pagina: pagina ? String(pagina).slice(0, 200) : null })
    });
  } catch (e) { console.error('No se pudo guardar la conversación:', e && e.message); }
}

function transcribe(m) {
  return (m || []).slice(-12).map(x => (x.role === 'user' ? 'Cliente: ' : 'Asistente: ') + limpia(x.content, 700)).join('\n');
}
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'x';

  if (b.accion === 'contacto') {
    if (!limite(ip, avisos, 4, 3600000)) return res.status(429).json({ ok: false, motivo: 'demasiados' });
    const nombre = limpia(b.nombre, 80), tel = limpia(b.telefono, 30).replace(/[^\d+ ]/g, '');
    if (tel.replace(/\D/g, '').length < 9) return res.status(400).json({ ok: false, motivo: 'telefono' });
    if (b.consentimiento !== true) return res.status(400).json({ ok: false, motivo: 'consentimiento' });
    const texto = ['Alguien ha pedido que le llamen desde el asistente de la web.', '', 'Nombre: ' + (nombre || '(sin nombre)'), 'Teléfono: ' + tel, '', 'Conversación:', transcribe(b.mensajes)].join('\n');
    const ok = await correo('Te piden una llamada (asistente web AMS)', texto);
    await guarda(b.cid, 'contacto', 'Nombre: ' + (nombre || '(sin nombre)') + ' · Teléfono: ' + tel, b.pagina);
    return res.status(ok ? 200 : 502).json({ ok });
  }
  if (b.accion === 'duda') {
    if (!limite(ip, avisos, 8, 3600000)) return res.json({ ok: true });
    await guarda(b.cid, 'duda', limpia(b.pregunta, 400), b.pagina);
    const ok = await correo('Pregunta sin respuesta del asistente (AMS)', 'El asistente no ha sabido contestar esto:\n\n' + limpia(b.pregunta, 400) + '\n\nAñádelo a las notas de Javi para que la próxima vez lo sepa.');
    return res.json({ ok });
  }

  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'El asistente aún no está activado en este servidor. Llámanos al 639 78 82 20.' });
  if (!limite(ip, usos, 30, 600000)) return res.status(429).json({ error: 'Has enviado muchos mensajes seguidos. Espera unos minutos o llámanos al 639 78 82 20.' });
  let m = Array.isArray(b.mensajes) ? b.mensajes : [];
  m = m.filter(x => x && (x.role === 'user' || x.role === 'assistant') && typeof x.content === 'string' && x.content.trim())
    .slice(-20).map(x => ({ role: x.role, content: x.content.slice(0, 4000) }));
  while (m.length && m[0].role === 'assistant') m.shift();
  if (!m.length || m[m.length - 1].role !== 'user') return res.status(400).json({ error: 'Falta tu mensaje.' });

  const hoy = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full', timeZone: 'Europe/Madrid' }).format(new Date());
  const hora = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }).format(new Date());
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('X-Accel-Buffering', 'no');
  let enviado = false, respuesta = '';
  await guarda(b.cid, 'user', m[m.length - 1].content, b.pagina);
  for (let i = 0; i < MODELOS.length; i++) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({
          model: MODELOS[i], max_tokens: 1200, stream: true, messages: m,
          system: [{ type: 'text', text: conocimientoWeb(), cache_control: { type: 'ephemeral' } }, { type: 'text', text: promptAsistente(hoy, hora) }]
        })
      });
      if (!r.ok || !r.body) throw new Error('HTTP ' + r.status);
      const lector = r.body.getReader(), dec = new TextDecoder();
      let resto = '';
      for (;;) {
        const { done, value } = await lector.read();
        if (done) break;
        resto += dec.decode(value, { stream: true });
        const lineas = resto.split('\n'); resto = lineas.pop();
        for (const l of lineas) {
          if (!l.startsWith('data:')) continue;
          try {
            const e = JSON.parse(l.slice(5));
            if (e.type === 'content_block_delta' && e.delta && e.delta.type === 'text_delta') { enviado = true; respuesta += e.delta.text; res.write(e.delta.text); }
          } catch (x) { /* línea incompleta */ }
        }
      }
      res.end();
      await guarda(b.cid, 'assistant', respuesta.replace(/\[\[DUDA:[\s\S]*?\]\]/g, '').trim(), b.pagina);
      return;
    } catch (e) {
      console.error('Modelo ' + MODELOS[i] + ' falló:', e && e.message);
      if (enviado || i === MODELOS.length - 1) break;
    }
  }
  res.write('\n\nAhora mismo no puedo responder. Llámanos al 639 78 82 20 o escríbenos por WhatsApp.');
  return res.end();
};
