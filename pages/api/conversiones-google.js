// Conversiones sin conexión para Google Ads (subida programada desde una URL).
// Cuando la cuenta de Javi esté vinculada: en Google Ads, Objetivos > Conversiones > Subidas > Programar,
// fuente HTTPS con esta URL y ?k=CRM_CONVERSIONES_CLAVE. Crear antes las acciones de conversión
// «AMS Visita hecha», «AMS Presupuesto dado» y «AMS Contratado» (tipo importación, clics).
// Valor: relativo (100 = trabajo medio). Ningún euro real sale del móvil de Javi.
const SB_URL = process.env.CRM_SUPABASE_URL || 'https://jrfqllllhweswhvwylog.supabase.co';
const SB_KEY = process.env.CRM_SUPABASE_KEY || 'sb_publishable_6w-UFyFVPWAvq7OOr9F-BQ_8e7HMvuP';

function fechaGoogle(iso) {
  // yyyy-MM-dd HH:mm:ss en hora de Madrid (la zona va en la cabecera)
  const d = new Date(iso);
  const p = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(d);
  return p.replace('T', ' ');
}
const csv = v => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };

module.exports = async (req, res) => {
  const clave = process.env.CRM_CONVERSIONES_CLAVE, sec = process.env.CRM_ADMIN_SECRET;
  if (!clave || !sec || req.query.k !== clave) return res.status(404).send('');
  try {
    const r = await fetch(SB_URL + '/rest/v1/rpc/adm_conversiones_google', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_secret: sec }) });
    if (!r.ok) return res.status(502).send('');
    const filas = await r.json();
    const out = ['Parameters:TimeZone=Europe/Madrid', 'Google Click ID,GBRAID,WBRAID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency'];
    filas.forEach(f => out.push([f.gclid || '', f.gclid ? '' : (f.gbraid || ''), f.gclid || f.gbraid ? '' : (f.wbraid || ''), f.accion, fechaGoogle(f.cuando), f.valor == null ? '' : f.valor, f.valor == null ? '' : 'EUR'].map(csv).join(',')));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.send(out.join('\n') + '\n');
  } catch (e) { return res.status(502).send(''); }
};
module.exports.default = module.exports;
