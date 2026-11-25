// Baja de los avisos de contactos pendientes (25-nov-2026, ams·v220). Enlace firmado del pie de «X persona espera tu llamada»
// y de «Toca preguntar». GET enseña un botón de confirmar (para que un escáner de correo no dé de baja por error);
// POST (el botón, o el «darse de baja» de Gmail) apaga los avisos. No toca el resumen del lunes ni los correos a clientes.
const SB_URL = process.env.CRM_SUPABASE_URL || 'https://jrfqllllhweswhvwylog.supabase.co';
const SB_KEY = process.env.CRM_SUPABASE_KEY || 'sb_publishable_6w-UFyFVPWAvq7OOr9F-BQ_8e7HMvuP';
const { firma } = require('../../lib/serieCorreos.js');

const pagina = (t, p, boton) => '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>' + t + ' | AMS Cerramientos</title></head><body style="margin:0;background:#F3F5F7;font-family:Arial,Helvetica,sans-serif;color:#12202B"><div style="max-width:520px;margin:48px auto;background:#fff;border-radius:12px;padding:28px 26px"><h1 style="margin:0 0 12px;font-size:24px">' + t + '</h1><p style="margin:0;font-size:16px;line-height:1.55">' + p + '</p>' + (boton || '') + '</div></body></html>';

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  const k = String(req.query.k || ''), sec = process.env.CRM_ADMIN_SECRET;
  if (!sec || k.length !== 32 || k !== firma('aviso-pendientes')) return res.status(400).send(pagina('Este enlace no es válido', 'Pide uno nuevo en el próximo aviso.'));
  if (req.method !== 'POST') {
    return res.status(200).send(pagina('¿Dejar de recibir estos avisos?', 'Son los correos que te dicen que hay contactos sin llamar o clientes pendientes de respuesta. Seguirás pudiendo ver todo en tu lista de contactos.',
      '<form method="post" style="margin:20px 0 0"><button type="submit" style="background:#C2410C;color:#fff;border:0;border-radius:10px;padding:13px 20px;font-size:16px;font-weight:700;cursor:pointer">Sí, no quiero recibir más este aviso</button></form>'));
  }
  try {
    const r = await fetch(SB_URL + '/rest/v1/rpc/adm_aviso_baja', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_secret: sec }) });
    if (!r.ok) throw new Error('supabase');
  } catch (e) {
    return res.status(502).send(pagina('No hemos podido apagarlo', 'Ha habido un fallo nuestro. Díselo a quien te lleva la web y lo apaga a mano.'));
  }
  if ((req.headers.accept || '').indexOf('json') !== -1) return res.status(200).json({ ok: true });
  return res.status(200).send(pagina('Hecho: no te enviaremos más este aviso', 'Si algún día quieres volver a recibirlo, díselo a quien te lleva la web.'));
};
module.exports.default = module.exports;
