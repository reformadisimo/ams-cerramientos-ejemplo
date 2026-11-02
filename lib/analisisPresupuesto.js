// Análisis con IA del presupuesto de OTRA empresa que sube un visitante en /revisa-tu-presupuesto (2-nov-2026).
// Lee la foto o el PDF, saca los datos, lo compara con la tarifa de AMS (calcula de pages/api/precio.js),
// busca en internet las opiniones de esa empresa y prepara un informe interno y un BORRADOR de respuesta al cliente.
// Nada sale al cliente sin aprobación: el informe llega a PRESUPUESTO_DESTINO con un botón para revisar y enviar
// (/aprobar-respuesta, firmado con APROBAR_SECRETO). Necesita ANTHROPIC_API_KEY y RESEND_API_KEY.
const crypto = require('crypto');
const { calcula } = require('../pages/api/precio.js');

const MODELOS = [process.env.ANALISIS_MODELO || 'claude-sonnet-5-5', 'claude-sonnet-4-5'];
const BASE = process.env.WEB_BASE || 'https://ams-cerramientos-ejemplo.vercel.app';
const BONITO = { pvc: 'PVC', aluminio: 'Aluminio', doble: 'Doble acristalamiento', termico: 'Térmico (bajo emisivo)', acustico: 'Acústico', seguridad: 'De seguridad' };
const bon = v => BONITO[v] || v;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const eur = n => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';

function secreto() { return process.env.APROBAR_SECRETO || process.env.CRM_ADMIN_SECRET || process.env.RESEND_API_KEY || ''; }
function firma(obj) {
  const p = Buffer.from(JSON.stringify(obj)).toString('base64url');
  const s = crypto.createHmac('sha256', secreto()).update(p).digest('base64url');
  return p + '.' + s;
}
function verifica(t) {
  const [p, s] = String(t || '').split('.');
  if (!p || !s || !secreto()) return null;
  const ok = crypto.createHmac('sha256', secreto()).update(p).digest('base64url');
  if (ok.length !== s.length || !crypto.timingSafeEqual(Buffer.from(ok), Buffer.from(s))) return null;
  try { const o = JSON.parse(Buffer.from(p, 'base64url').toString()); if (o.exp && Date.now() > o.exp) return null; return o; } catch (e) { return null; }
}

const INSTRUCCIONES = `Eres el asistente comercial de AMS Cerramientos (ventanas de PVC Kömmerling, aluminio y cancelas; Corredor del Henares y norte de Madrid). Un cliente nos ha mandado el presupuesto de OTRA empresa para que se lo comparemos. Trabaja con rigor y honestidad: nunca inventes datos; si algo no se lee o no se encuentra, dilo.

1. Lee el presupuesto adjunto y saca: empresa, fecha, número de ventanas y medidas de cada una si vienen, material y serie del perfil, vidrio, apertura, persiana y cajón, color, si incluye medición, desmontaje y retirada, remates, IVA, garantía, plazo, forma de pago y precio total.
2. Busca en internet (máximo 3 búsquedas) las opiniones de esa empresa: nota media en Google u otras webs de opiniones, número de reseñas y las quejas o elogios que se repiten. Cita las fuentes con su enlace. Si no la encuentras o hay varias con el mismo nombre, dilo y no adivines.
3. Escribe un BORRADOR de respuesta para el cliente. Reglas: tuteo, cercano y serio, frases cortas, sin emojis, sin guiones largos, 120 a 220 palabras. Firma «El equipo de AMS Cerramientos». Di con sinceridad si el precio parece razonable para lo que incluye, qué falta o no está claro y conviene preguntar, y cómo queda frente a nuestra horquilla (te la doy calculada; no la cambies). Si el suyo es mejor o equivalente, dilo. De la otra empresa habla solo de hechos y en tono neutro (por ejemplo, «en Google tiene una nota de 4,2 con 35 opiniones»); nunca la critiques, ni uses adjetivos negativos, ni repitas quejas concretas en el borrador al cliente. Termina ofreciendo ir a medir gratis en 1 o 2 días si le encaja. No prometas descuentos ni plazos que no estén aquí.

Responde SOLO con un objeto JSON entre <json> y </json>, sin nada más, con estas claves:
{"empresa": "", "legible": true, "datos": {"fecha": "", "ventanas": [{"n": 1, "ancho_cm": 0, "alto_cm": 0, "tipo": "", "apertura": "corredera|practicable|oscilobatiente|", "persiana": "no|manual|motor|"}], "material": "pvc|aluminio|", "serie": "", "vidrio": "doble|termico|acustico|seguridad|", "color": "blanco|color|madera|", "mosquitera": false, "precio_total": 0, "iva": "incluido|aparte|no_dice", "incluye": [""], "falta_o_dudoso": [""], "garantia": "", "plazo": "", "pago": ""}, "precio_m2": 0, "opiniones": {"encontrada": true, "nota": 0, "num_resenas": 0, "resumen": "", "quejas_repetidas": [""], "elogios_repetidos": [""], "fuentes": [{"titulo": "", "url": ""}]}, "veredicto_interno": "", "borrador_cliente": ""}`;

async function llamaIA(contenido, sistema) {
  const clave = process.env.ANTHROPIC_API_KEY;
  if (!clave) throw new Error('sin ANTHROPIC_API_KEY');
  let ultimo;
  for (const model of MODELOS) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': clave, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: 3000, system: sistema, tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }], messages: [{ role: 'user', content: contenido }] })
      });
      if (!r.ok) { ultimo = new Error('IA ' + r.status + ' ' + (await r.text()).slice(0, 200)); continue; }
      const j = await r.json();
      const txt = (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n');
      const m = txt.match(/<json>([\s\S]*?)<\/json>/) || txt.match(/\{[\s\S]*\}/);
      if (!m) { ultimo = new Error('IA sin JSON'); continue; }
      return JSON.parse(m[1] || m[0]);
    } catch (e) { ultimo = e; }
  }
  throw ultimo || new Error('IA sin respuesta');
}

function nuestraHorquilla(d) {
  const vs = (d && Array.isArray(d.ventanas) ? d.ventanas : []).filter(v => Number(v.ancho_cm) > 20 && Number(v.alto_cm) > 20);
  if (!vs.length) return null;
  const grupos = {};
  for (const v of vs) {
    const k = [v.apertura || 'oscilobatiente', v.persiana || 'no'].join('|');
    (grupos[k] = grupos[k] || []).push({ n: Number(v.n) || 1, w: Number(v.ancho_cm), h: Number(v.alto_cm), label: v.tipo || 'Ventana' });
  }
  let low = 0, high = 0;
  for (const k of Object.keys(grupos)) {
    const [apertura, persiana] = k.split('|');
    const out = calcula({ svc: 'ventanas', material: d.material || 'pvc', apertura, vidrio: d.vidrio || 'termico', color: d.color || 'blanco', persiana, mosquitera: !!d.mosquitera, ventanas: grupos[k] });
    if (out) { low += out.low; high += out.high; }
  }
  return low ? { low, high, iva: !!(calcula({ svc: 'ventanas', ventanas: [] }) || {}).iva_incluido } : null;
}

async function analiza({ tipo, datos, nombre, tel, mail, empresa, msg, destino, copia, de, responderA, resendKey }) {
  const bloque = tipo === 'application/pdf'
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: datos } }
    : { type: 'image', source: { type: 'base64', media_type: tipo, data: datos } };
  // Primero los datos, luego nuestra horquilla, y con ella el borrador (dos pasos para que la IA no invente nuestro precio).
  const paso1 = await llamaIA([bloque, { type: 'text', text: 'Empresa según el cliente: ' + (empresa || 'no lo dice') + '. Mensaje del cliente: ' + (msg || 'ninguno') + '.\nDe momento NO escribas el borrador (déjalo vacío): solo los datos, la búsqueda de opiniones y el veredicto interno.' }], INSTRUCCIONES);
  const hq = nuestraHorquilla(paso1.datos);
  const contexto = 'Datos ya extraídos del presupuesto y de las opiniones (JSON): ' + JSON.stringify(paso1).slice(0, 6000) +
    '\nNuestra horquilla para las mismas ventanas (PVC Kömmerling, vidrio térmico, montaje y retirada incluidos): ' + (hq ? eur(hq.low) + ' a ' + eur(hq.high) + (hq.iva ? ' con IVA' : ' MÁS IVA (compara siempre los dos con o sin IVA, nunca mezclados)') : 'no se puede calcular porque el presupuesto no trae las medidas; dilo y ofrece medir gratis') + '.' +
    '\nNombre del cliente: ' + (nombre || 'no lo dice') + '. Ahora escribe SOLO el borrador al cliente, con las reglas de antes, y devuélvelo como {"borrador_cliente": "..."} entre <json> y </json>. No hagas búsquedas nuevas.';
  let borrador = '';
  try { borrador = (await llamaIA([{ type: 'text', text: contexto }], INSTRUCCIONES)).borrador_cliente || ''; } catch (e) { borrador = ''; }

  const d = paso1.datos || {}, op = paso1.opiniones || {};
  const fila = (k, v) => v ? '<tr><td style="color:#5B6B79;vertical-align:top;padding:4px 8px">' + esc(k) + '</td><td style="padding:4px 8px"><b>' + esc(v) + '</b></td></tr>' : '';
  const lista = a => (a || []).filter(Boolean).map(x => '<li>' + esc(x) + '</li>').join('');
  const exp = Date.now() + 14 * 864e5;
  let accion = '';
  if (borrador && mail) {
    const t = firma({ to: mail, nombre, asunto: 'Tu presupuesto de ventanas, comparado' + (paso1.empresa ? ' (' + paso1.empresa + ')' : ''), texto: borrador, exp, id: crypto.randomBytes(6).toString('hex') });
    accion = '<p style="margin:18px 0"><a href="' + BASE + '/aprobar-respuesta#t=' + t + '" style="background:#1B6B3A;color:#fff;padding:13px 20px;border-radius:10px;text-decoration:none;font-weight:700">Revisar y enviar al cliente</a></p><p style="font-size:13px;color:#5B6B79">Se abre el borrador para que lo cambies si quieres. No se envía nada hasta que pulses «Enviar».</p>';
  } else if (borrador && tel) {
    const telD = tel.replace(/\D/g, '');
    accion = '<p style="margin:18px 0"><a href="https://wa.me/34' + telD.slice(-9) + '?text=' + encodeURIComponent(borrador) + '" style="background:#1FA855;color:#fff;padding:13px 20px;border-radius:10px;text-decoration:none;font-weight:700">Revisar y enviar por WhatsApp</a></p><p style="font-size:13px;color:#5B6B79">Se abre WhatsApp con el texto escrito: revísalo antes de enviarlo.</p>';
  }
  const html = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1F2A36;max-width:640px">' +
    '<div style="border-left:5px solid #1f6fb2;background:#EEF5FB;border-radius:8px;padding:12px 14px;margin:0 0 14px"><b>Informe listo, preparado con IA.</b> Revísalo antes de contestar: la IA puede equivocarse al leer un presupuesto o al buscar opiniones.</div>' +
    '<p style="font-size:18px;font-weight:700;margin:0 0 6px">Presupuesto de ' + esc(paso1.empresa || empresa || 'otra empresa') + '</p>' +
    '<p style="margin:0 0 10px">Cliente: <b>' + esc(nombre || '(sin nombre)') + '</b> · ' + esc(tel || '') + ' ' + esc(mail || '') + '</p>' +
    (paso1.legible === false ? '<p style="color:#B42318"><b>La IA no ha podido leer bien el presupuesto.</b> Míralo en el correo anterior, que lleva el archivo.</p>' : '') +
    '<table style="border-collapse:collapse">' + fila('Precio total', d.precio_total ? eur(d.precio_total) + (d.iva === 'incluido' ? ' con IVA' : d.iva === 'aparte' ? ' + IVA' : ' (no dice el IVA)') : '') + fila('Precio por m²', paso1.precio_m2 ? eur(paso1.precio_m2) : '') + fila('Nuestra horquilla', hq ? eur(hq.low) + ' a ' + eur(hq.high) + (hq.iva ? ' con IVA' : ' más IVA') + ' (misma tarifa que la calculadora)' : 'sin medidas en el presupuesto') + fila('Material y serie', [bon(d.material), d.serie].filter(Boolean).join(', ')) + fila('Vidrio', bon(d.vidrio)) + fila('Ventanas', (d.ventanas || []).map(v => (v.n || 1) + ' × ' + (v.ancho_cm || '?') + 'x' + (v.alto_cm || '?') + ' ' + (v.tipo || '')).join('; ')) + fila('Garantía', d.garantia) + fila('Plazo', d.plazo) + fila('Pago', d.pago) + '</table>' +
    '<p style="margin:14px 0 4px"><b>Incluye:</b></p><ul style="margin:0">' + lista(d.incluye) + '</ul>' +
    '<p style="margin:12px 0 4px"><b>Falta o no está claro:</b></p><ul style="margin:0">' + lista(d.falta_o_dudoso) + '</ul>' +
    '<p style="margin:14px 0 4px"><b>Opiniones de esa empresa:</b> ' + (op.encontrada ? esc((op.nota ? op.nota + ' sobre 5' : 'sin nota') + (op.num_resenas ? ', ' + op.num_resenas + ' reseñas' : '')) + '. ' + esc(op.resumen || '') : 'no se ha encontrado con claridad.') + '</p>' +
    (op.quejas_repetidas && op.quejas_repetidas.length ? '<p style="margin:6px 0 2px">Quejas que se repiten:</p><ul style="margin:0">' + lista(op.quejas_repetidas) + '</ul>' : '') +
    (op.elogios_repetidos && op.elogios_repetidos.length ? '<p style="margin:6px 0 2px">Lo que más valoran:</p><ul style="margin:0">' + lista(op.elogios_repetidos) + '</ul>' : '') +
    ((op.fuentes || []).length ? '<p style="margin:6px 0 2px;font-size:13px">Fuentes: ' + op.fuentes.slice(0, 5).map(f => '<a href="' + esc(f.url) + '">' + esc(f.titulo || f.url) + '</a>').join(' · ') + '</p>' : '') +
    '<p style="margin:14px 0 4px"><b>Qué opina la IA (solo para ti):</b> ' + esc(paso1.veredicto_interno || '') + '</p>' +
    '<div style="border:2px solid #9bb8d3;border-radius:10px;padding:12px 14px;margin:16px 0 0;white-space:pre-wrap"><b>Borrador para el cliente</b>\n\n' + esc(borrador || 'No se ha podido preparar el borrador. Contéstale tú con este informe.') + '</div>' +
    accion + '</div>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: de, to: [destino], bcc: copia ? [copia] : undefined, reply_to: mail || undefined, subject: '[Informe listo] Comparar presupuesto: ' + (paso1.empresa || empresa || 'otra empresa') + ' · ' + (nombre || tel || mail || 'sin nombre'), html })
  });
  return r.ok;
}

module.exports = { analiza, firma, verifica };
