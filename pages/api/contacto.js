// Recibe los contactos y los clics de la web y los guarda en el CRM de AMS (Supabase).
// Si es un contacto nuevo, manda un aviso por correo (Resend) a CRM_AVISOS_PARA.
// La clave publicable de Supabase es pública por diseño: la base de datos solo deja usar las funciones permitidas.
const SB_URL = process.env.CRM_SUPABASE_URL || 'https://jrfqllllhweswhvwylog.supabase.co';
const SB_KEY = process.env.CRM_SUPABASE_KEY || 'sb_publishable_6w-UFyFVPWAvq7OOr9F-BQ_8e7HMvuP';
const AVISO_PARA = process.env.CRM_AVISOS_PARA || 'delarubiaignacio@gmail.com';
const DE = process.env.CRM_AVISOS_DE || process.env.RESPUESTAS_DE || 'Contactos AMS <guia@send.miestela.app>';
const CRM_URL = process.env.CRM_URL || 'https://ams-cerramientos-ejemplo.vercel.app/mis-contactos/';
const visitas = {};

async function rpc(fn, args) {
  const r = await fetch(SB_URL + '/rest/v1/rpc/' + fn, {
    method: 'POST',
    headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
  if (!r.ok) throw new Error('supabase ' + r.status);
  return r.json();
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));


// Filtro para que Javi vaya primero a las visitas que le compensan (reglas que él nos ha contado, 31-oct-2026).
// Interesa: su zona (Corredor del Henares) y ventanas o cancelas normales. No encaja: Madrid capital, áticos, piezas enormes.
const ZONA_SI = /alcal[aá]|villalbilla|torrej[oó]n|meco|azuqueca|guadalajara|camarma|daganzo|santos de la humosa|anchuelo|corpa|santorcaz|pezuela|nuevo bazt[aá]n|loeches|torres de la alameda|valverde|ajalvir|cabanillas|alovera|chiloeches|marchamalo|villanueva de la torre|quer|yunquera|fontanar|el casar|valdeavero|fresno de torote|serracines|ribatejada|campo real|pozuelo del rey|olmeda/;
const ZONA_DUDA = /coslada|san fernando|mejorada|velilla|paracuellos|arganda|rivas|alcobendas|san sebasti[aá]n de los reyes|algete|cobe[ñn]a|fuente el saz/;
const quitaAcentos = t => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function encaje(d) {
  const z = quitaAcentos(d.zona), t = quitaAcentos(d.trabajo + ' ' + d.pide);
  if (/\batico\b/.test(t) && /cerramiento|terraza|cerrar/.test(t)) return ['No encaja', 'cerramiento de ático'];
  if (/^madrid( capital)?$|madrid capital|\b280[0-5]\d\b/.test(z) && !ZONA_SI.test(z)) return ['No encaja', 'Madrid capital'];
  if (ZONA_SI.test(z)) return /ventana|pvc|cancela|puerta|cerramiento|terraza|persiana|mosquitera/.test(t) || !t.trim() ? ['Interesa', 'su zona'] : ['A valorar', 'trabajo poco habitual'];
  if (ZONA_DUDA.test(z)) return ['A valorar', 'zona algo lejos'];
  return ['A valorar', z ? 'zona por confirmar' : 'sin pueblo'];
}

async function aviso(d, res) {
  const clave = process.env.RESEND_API_KEY;
  if (!clave || !res || !res.ok || res.repetido) return;
  const tel = String(d.telefono || '').replace(/\D/g, '');
  const filas = [
    ['Encaje', d.encaje], ['Nombre', d.nombre], ['Teléfono', d.telefono], ['Correo', d.correo], ['Pueblo', d.zona],
    ['Qué pide', d.pide], ['De dónde viene', res.origen], ['Campaña', d.utm_campaign], ['Palabra buscada', d.utm_term],
    ['Desde', (d.canal || 'formulario') + ' · ' + (d.pagina_envio || '') + ' · ' + (d.dispositivo || '')]
  ].filter(f => f[1]);
  const html = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1F2A36;max-width:560px">' +
    '<p style="font-size:18px;font-weight:700;margin:0 0 12px">Nuevo contacto desde la web</p>' +
    '<table cellpadding="6" style="border-collapse:collapse">' + filas.map(f => '<tr><td style="color:#5B6B79;vertical-align:top">' + esc(f[0]) + '</td><td><b>' + esc(f[1]) + '</b></td></tr>').join('') + '</table>' +
    (tel ? '<p style="margin:18px 0 6px"><a href="tel:' + tel + '" style="background:#1B3247;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Llamar</a> &nbsp; ' +
      '<a href="https://wa.me/34' + tel.slice(-9) + '" style="background:#1FA855;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">WhatsApp</a></p>' : '') +
    '<p style="color:#5B6B79;font-size:13px;margin-top:18px">Ya está apuntado en <a href="' + CRM_URL + '">tus contactos</a>.</p></div>';
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: DE, to: AVISO_PARA.split(',').map(s => s.trim()).filter(Boolean), subject: (d.encaje ? d.encaje.split(' (')[0] + ' · ' : '') + 'Nuevo contacto: ' + String(d.nombre).slice(0, 40) + (res.origen ? ' (' + res.origen + ')' : ''), html })
    });
  } catch (e) { /* el aviso no puede tumbar el guardado */ }
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'x';
  const ahora = Date.now();
  visitas[ip] = (visitas[ip] || []).filter(t => ahora - t < 600000);
  if (visitas[ip].length >= 30) return res.status(429).json({ ok: false });
  visitas[ip].push(ahora);
  let d = req.body;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { d = {}; } }
  d = d && typeof d === 'object' ? d : {};
  try {
    if (d.tipo === 'clic') {
      const r = await rpc('web_clic', { d: { tipo: d.clic, pagina: d.pagina, utm_source: d.utm_source, utm_medium: d.utm_medium, utm_campaign: d.utm_campaign, utm_term: d.utm_term, gclid: d.gclid, fbclid: d.fbclid, referente: d.referente, dispositivo: d.dispositivo } });
      return res.json(r);
    }
    if (d.tipo === 'contacto') {
      const [nivel, motivo] = encaje(d);
      d.encaje = nivel + ' (' + motivo + ')';
      d.pide = '[' + nivel + '] ' + String(d.pide || '');
      const r = await rpc('web_contacto', { d });
      await aviso(d, r);
      return res.json({ ok: !!(r && r.ok) });
    }
    return res.status(400).json({ ok: false });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
};
module.exports.default = module.exports;
