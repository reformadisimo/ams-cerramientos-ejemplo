// Baja de los correos de seguimiento (serie B). Enlace firmado que va al pie de cada correo.
// Un clic basta (también el botón «darse de baja» de Gmail, que llega por POST). No pide datos.
const SB_URL = process.env.CRM_SUPABASE_URL || 'https://jrfqllllhweswhvwylog.supabase.co';
const SB_KEY = process.env.CRM_SUPABASE_KEY || 'sb_publishable_6w-UFyFVPWAvq7OOr9F-BQ_8e7HMvuP';
const { firma } = require('../../lib/serieCorreos.js');

const pagina = (t, p) => '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>' + t + ' | AMS Cerramientos</title></head><body style="margin:0;background:#F3F5F7;font-family:Arial,Helvetica,sans-serif;color:#12202B"><div style="max-width:520px;margin:60px auto;background:#fff;border-radius:12px;padding:32px 28px;line-height:1.6"><h1 style="margin:0 0 12px;font-size:24px">' + t + '</h1><p style="margin:0 0 18px;font-size:17px">' + p + '</p><p style="margin:0"><a href="https://www.amscerramientos.es/" style="color:#C2410C;font-weight:700">Volver a la web de AMS Cerramientos</a></p></div></body></html>';

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  const id = String(req.query.i || ''), k = String(req.query.k || ''), sec = process.env.CRM_ADMIN_SECRET;
  const valido = sec && /^[0-9a-f-]{36}$/i.test(id) && k.length === 32 && k === firma(id);
  if (!valido) return res.status(400).send(pagina('Este enlace no es válido', 'Si quieres dejar de recibir nuestros correos, contesta a cualquiera de ellos diciéndolo y te quitamos de la lista.'));
  try {
    const r = await fetch(SB_URL + '/rest/v1/rpc/adm_serie_baja', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_secret: sec, p_id: id }) });
    if (!r.ok) throw new Error('supabase');
  } catch (e) {
    return res.status(502).send(pagina('No hemos podido darte de baja', 'Ha habido un fallo nuestro. Contesta a cualquiera de nuestros correos diciéndolo y te quitamos de la lista a mano.'));
  }
  if (req.method === 'POST') return res.status(200).json({ ok: true });
  return res.status(200).send(pagina('Ya está: no te escribimos más', 'Te hemos quitado de los correos de consejos y ofertas. Si algún día quieres retomar tu precio, estamos en el 639 78 82 20.'));
};
module.exports.default = module.exports;
