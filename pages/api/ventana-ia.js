// "Mira como quedaria en tu casa": la persona sube la foto de su ventana y la IA (Nano Banana Pro, via fal.ai)
// la cambia por la que ha configurado. Mismo motor que el visualizador de Reformadisimo.
// Necesita FAL_KEY en las variables de entorno del proyecto de Vercel. Sin ella responde { ok:false, motivo:'sin-clave' }.
// POST { imagen: 'data:image/jpeg;base64,...', v: { mat, col, hojas, aper, pers, fijo, tipo } }  -> { ok, status_url, response_url }
// GET  ?s=<status_url>&r=<response_url>                                                     -> { ok, estado, url? }
// El prompt se construye aqui, solo con valores de una lista: el visitante no puede escribir instrucciones libres.
// Limites: FAL_LIMITE_VISITANTE (10 por dia y por conexion) y FAL_TOPE_DIA (40 al dia en total). Se guardan en memoria
// de la funcion: sirven de freno razonable, pero no son exactos. Para un tope exacto haria falta una base de datos (Vercel KV o similar).

const MODELO = process.env.FAL_MODELO_VENTANA || 'fal-ai/nano-banana-pro/edit';
const APP = MODELO.replace(/\/edit$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RE_STATUS = new RegExp('^https://queue\\.fal\\.run/' + APP + '/requests/[0-9a-f-]{36}/status$');
const RE_RESP = new RegExp('^https://queue\\.fal\\.run/' + APP + '/requests/[0-9a-f-]{36}$');
const POR_VISITANTE = Number(process.env.FAL_LIMITE_VISITANTE) || 10;
const TOPE_DIA = Number(process.env.FAL_TOPE_DIA) || 40;

const usos = new Map(); // clave "ip|dia" -> numero
let global = { dia: '', n: 0 };
const hoy = () => new Date().toISOString().slice(0, 10);

const MAT = { pvc: 'white-profile PVC (uPVC)', alu: 'slim aluminium' };
const COL = {
  blanco: 'pure white frames on both sides',
  color: 'matt anthracite grey frames on both sides',
  bicolor: 'white frames on the inside and matt anthracite grey frames on the outside',
  madera: 'warm wood-effect (oak) frames',
  negro: 'matt black frames',
};
const APER = { osc: 'tilt-and-turn (the sash opens like a door and also tilts)', practicable: 'casement (the sash opens like a door)', fija: 'fixed (does not open)' };
const en = (o, k, d) => (k && Object.prototype.hasOwnProperty.call(o, k) ? k : d);

function descripcion(v) {
  v = v || {};
  const mat = MAT[en(MAT, v.mat, 'pvc')];
  const col = COL[en(COL, v.col, 'blanco')];
  const hojas = Math.min(4, Math.max(1, Math.round(Number(v.hojas) || 1)));
  const ap = APER[en(APER, Array.isArray(v.aper) ? v.aper[0] : v.aper, 'osc')];
  const pers = ['manual', 'motor', 'radio', 'solar'].includes(v.pers)
    ? 'a slim, discreet roller shutter box integrated above the window, shutter lowered to about one quarter of the opening'
    : 'no roller shutter box';
  const fijo = v.fijo === 'sup' ? ' with a fixed glass panel above the sashes' : v.fijo === 'inf' ? ' with a fixed glass panel below the sashes' : '';
  return `a new ${mat} window with ${hojas} sash${hojas > 1 ? 'es' : ''}, ${ap}${fijo}, ${col}, double glazing with clear glass, ${pers}`;
}

function prompt(v) {
  return `Replace the existing window (or windows) in this photo with ${descripcion(v)}. This is a photorealistic before and after for a customer: they must recognise their own home. STRICT RULES: keep exactly the same camera position, angle, framing and crop; keep the wall, floor, ceiling, curtains, furniture, plants, lighting, shadows and the view through the glass exactly as they are; only the window frame, sashes, handles, glass reflections and (if requested) the roller shutter box change. Same opening size and position. New frames look clean, sharp and professionally installed, with neat sealing around them. Do not add or remove any other object. No people, no text, no watermark.`;
}

async function subeAFal(clave, dataUri) {
  const m = String(dataUri).match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return null;
  for (let i = 0; i < 3; i++) {
    try {
      const ini = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate?storage_type=fal-cdn-v3', {
        method: 'POST', headers: { Authorization: 'Key ' + clave, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_type: m[1], file_name: 'ventana.' + m[1].split('/')[1] }), signal: AbortSignal.timeout(15000),
      });
      const j = await ini.json().catch(() => ({}));
      if (ini.ok && j.upload_url && j.file_url) {
        const put = await fetch(j.upload_url, { method: 'PUT', headers: { 'Content-Type': m[1] }, body: Buffer.from(m[2], 'base64'), signal: AbortSignal.timeout(20000) });
        if (put.ok) return j.file_url;
      }
    } catch (e) { console.error('ventana-ia subida', String((e && e.message) || e)); }
    await new Promise((r) => setTimeout(r, 600 * (i + 1)));
  }
  return null;
}

const json = (res, code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(obj)); };
const ipDe = (req) => String((req.headers['x-forwarded-for'] || '').split(',')[0] || (req.socket && req.socket.remoteAddress) || 'x').trim();

module.exports = async (req, res) => {
  const clave = process.env.FAL_KEY;
  if (!clave) return json(res, 503, { ok: false, motivo: 'sin-clave' });

  if (req.method === 'GET') {
    const s = String((req.query && req.query.s) || ''), r = String((req.query && req.query.r) || '');
    if (!RE_STATUS.test(s) || !RE_RESP.test(r)) return json(res, 400, { ok: false, motivo: 'peticion' });
    try {
      const st = await (await fetch(s, { headers: { Authorization: 'Key ' + clave }, signal: AbortSignal.timeout(15000) })).json();
      if (st.status !== 'COMPLETED') return json(res, 200, { ok: true, estado: st.status === 'IN_QUEUE' ? 'cola' : 'trabajando' });
      const out = await (await fetch(r, { headers: { Authorization: 'Key ' + clave }, signal: AbortSignal.timeout(20000) })).json();
      const url = out && out.images && out.images[0] && out.images[0].url;
      if (!url) { console.error('ventana-ia sin imagen', JSON.stringify(out).slice(0, 300)); return json(res, 200, { ok: false, motivo: 'sin-imagen' }); }
      return json(res, 200, { ok: true, estado: 'listo', url });
    } catch (e) { console.error('ventana-ia estado', String((e && e.message) || e)); return json(res, 502, { ok: false, motivo: 'estado' }); }
  }

  if (req.method !== 'POST') return json(res, 405, { ok: false, motivo: 'metodo' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || typeof b.imagen !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(b.imagen) || b.imagen.length > 4_000_000) return json(res, 400, { ok: false, motivo: 'imagen' });

  const dia = hoy();
  if (global.dia !== dia) global = { dia, n: 0 };
  if (global.n >= TOPE_DIA) return json(res, 429, { ok: false, motivo: 'tope-dia' });
  const k = ipDe(req) + '|' + dia;
  if ((usos.get(k) || 0) >= POR_VISITANTE) return json(res, 429, { ok: false, motivo: 'limite' });

  const url = await subeAFal(clave, b.imagen);
  if (!url) return json(res, 502, { ok: false, motivo: 'subida' });
  try {
    const r = await fetch('https://queue.fal.run/' + MODELO, {
      method: 'POST', headers: { Authorization: 'Key ' + clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt(b.v), image_urls: [url], aspect_ratio: 'auto', resolution: '2K', output_format: 'jpeg', num_images: 1, safety_tolerance: '4' }),
      signal: AbortSignal.timeout(20000),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.status_url || !j.response_url) { console.error('ventana-ia envio', r.status, JSON.stringify(j).slice(0, 300)); return json(res, 502, { ok: false, motivo: 'envio' }); }
    if (!RE_STATUS.test(j.status_url) || !RE_RESP.test(j.response_url)) { console.error('ventana-ia urls inesperadas', j.status_url, j.response_url); return json(res, 502, { ok: false, motivo: 'envio' }); }
    usos.set(k, (usos.get(k) || 0) + 1); global.n++;
    if (usos.size > 5000) usos.clear();
    return json(res, 200, { ok: true, status_url: j.status_url, response_url: j.response_url, quedan: Math.max(0, POR_VISITANTE - (usos.get(k) || 0)) });
  } catch (e) { console.error('ventana-ia envio', String((e && e.message) || e)); return json(res, 502, { ok: false, motivo: 'envio' }); }
};
module.exports._prompt = prompt;

module.exports.config = { api: { bodyParser: { sizeLimit: "6mb" } } };

/* Next.js (pages/api) pide la función como exportación "default" */
module.exports.default = module.exports;
