// Cada mañana (Vercel Cron): aviso de los contactos que llevan casi un día sin llamar.
// Los lunes, además, el resumen de la semana por origen y por campaña (sin euros: solo valor relativo, 100 = trabajo medio).
// Necesita CRM_ADMIN_SECRET y RESEND_API_KEY. Destino: CRM_AVISOS_PARA (de momento, Ig; cuando la web sea la de Javi, Javi).
const SB_URL = process.env.CRM_SUPABASE_URL || 'https://jrfqllllhweswhvwylog.supabase.co';
const SB_KEY = process.env.CRM_SUPABASE_KEY || 'sb_publishable_6w-UFyFVPWAvq7OOr9F-BQ_8e7HMvuP';
const AV = require('../../lib/avisos.js');
const PARA = AV.PARA;
const RESUMEN_PARA = AV.COPIA; // el resumen de la semana es para nosotros (Ig)
const DE = require('../../lib/remitente').DE;
const CRM_URL = process.env.CRM_URL || 'https://www.amscerramientos.es/mis-contactos/';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function rpc(fn, args) {
  const r = await fetch(SB_URL + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args) });
  if (!r.ok) throw new Error('supabase ' + r.status);
  return r.json();
}
async function correo(to, subject, html) {
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + require('../../lib/remitente').CLAVE, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: DE, to, bcc: to === PARA ? AV.bcc : undefined, subject, html }) });
  return r.ok;
}
const caja = h => '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1F2A36;max-width:600px">' + h + '</div>';
const pct = (a, b) => b ? Math.round(a / b * 100) + ' %' : '—';

module.exports = async (req, res) => {
  const cron = process.env.CRON_SECRET;
  if (cron && req.headers.authorization !== 'Bearer ' + cron) return res.status(401).json({ ok: false });
  const sec = process.env.CRM_ADMIN_SECRET;
  if (!sec || !require('../../lib/remitente').CLAVE) return res.status(503).json({ ok: false, motivo: 'faltan claves' });
  const out = {};
  try {
    // 1. Sin llamar
    const L = await rpc('adm_sin_llamar', { p_secret: sec });
    if (L.length) {
      const filas = L.map(c => '<tr><td style="padding:8px 6px"><b>' + esc(c.nombre) + '</b><br><span style="color:#5B6B79;font-size:13px">' + esc(c.origen || '') + ' · entró el ' + new Date(c.f).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) + '</span></td><td style="padding:8px 6px">' + (c.tel ? '<a href="tel:' + esc(String(c.tel).replace(/\D/g, '')) + '">' + esc(c.tel) + '</a>' : '') + '</td></tr>').join('');
      out.sin_llamar = await correo(PARA, (L.length === 1 ? '1 persona espera' : L.length + ' personas esperan') + ' tu llamada',
        caja('<p style="font-size:18px;font-weight:700">' + (L.length === 1 ? 'Una persona lleva casi un día esperando' : L.length + ' personas llevan casi un día esperando') + '</p><p>Cuanto antes se llama, más trabajos se cierran.</p><table style="border-collapse:collapse">' + filas + '</table><p style="margin-top:18px"><a href="' + CRM_URL + '" style="background:#C2410C;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Abrir tus contactos</a></p>'));
    }
    // 1b. Seguimiento: visitas sin presupuesto (3 días) y presupuestos sin respuesta (7 y 14 días)
    const SG = await rpc('adm_seguimiento', { p_secret: sec });
    const lin = (c, txt) => '<tr><td style="padding:8px 6px"><b>' + esc(c.nombre) + '</b><br><span style="color:#5B6B79;font-size:13px">' + txt + '</span></td><td style="padding:8px 6px">' + (c.tel ? '<a href="tel:' + esc(String(c.tel).replace(/\D/g, '')) + '">' + esc(c.tel) + '</a>' : '') + '</td></tr>';
    const filasS = (SG.visitas || []).map(c => lin(c, 'Fuiste a verle hace 3 días. ¿Le has pasado ya el presupuesto?')).concat((SG.presupuestos || []).map(c => lin(c, 'Le pasaste el presupuesto hace ' + Math.round((Date.now() - c.fp) / 864e5) + ' días. ¿Qué te ha dicho?')));
    if (filasS.length) out.seguimiento = await correo(PARA, filasS.length === 1 ? 'Un cliente pendiente de respuesta' : filasS.length + ' clientes pendientes de respuesta',
      caja('<p style="font-size:18px;font-weight:700">Toca preguntar</p><p>Una llamada a tiempo cierra muchos trabajos que se quedan en el aire.</p><table style="border-collapse:collapse">' + filasS.join('') + '</table><p style="margin-top:18px"><a href="' + CRM_URL + '" style="background:#C2410C;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Apuntar cómo ha ido</a></p>'));
    // 1c. Serie de correos de seguimiento al cliente (camino B). ENCENDIDA desde el 14-nov-2026 (OK de Ig). Para apagarla: SERIE_CORREOS=0 en Vercel.
    // Solo a quien dio su correo y marcó «Acepta recibir correos». Con ?serie=mirar dice a quién le tocaría hoy, sin enviar.
    const serieOn = process.env.SERIE_CORREOS !== '0';
    if (serieOn || req.query.serie === 'mirar') {
      const S = require('../../lib/serieCorreos.js'), R = require('../../lib/remitente');
      const pend = await rpc('adm_serie_pendientes', { p_secret: sec });
      if (req.query.serie === 'mirar' || !serieOn) out.serie = { tocaria: pend.map(c => c.codigo) };
      else {
        const hechos = [], fallos = [];
        for (const c of pend.slice(0, 25)) {
          const m = S.correoDe(c.codigo, c); if (!m) continue;
          const baja = S.enlaceBaja(c.id);
          const de = m.de ? R.DE.replace(/^[^<]*</, m.de + ' <') : R.DE;
          const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + R.CLAVE, 'Content-Type': 'application/json', 'Idempotency-Key': 'serie-' + c.id + '-' + c.codigo },
            body: JSON.stringify({ from: de, to: [c.correo], reply_to: 'info@amscerramientos.es', subject: m.asunto, html: m.html, headers: { 'List-Unsubscribe': '<' + baja + '>', 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } }) });
          if (r.ok) { await rpc('adm_serie_marcar', { p_secret: sec, p_id: c.id, p_codigo: c.codigo }); hechos.push(c.codigo); } else fallos.push(c.codigo);
        }
        out.serie = { enviados: hechos, fallos };
        if (hechos.length || fallos.length) await correo(RESUMEN_PARA, 'AMS: correos de seguimiento de hoy (' + hechos.length + ' enviados' + (fallos.length ? ', ' + fallos.length + ' con fallo' : '') + ')', caja('<p>Enviados: ' + (hechos.join(', ') || 'ninguno') + '</p>' + (fallos.length ? '<p>Con fallo: ' + fallos.join(', ') + '</p>' : '')));
      }
    }
    // 2. Lunes: resumen semanal para nosotros
    const lunes = new Date().toLocaleDateString('es-ES', { weekday: 'long', timeZone: 'Europe/Madrid' }) === 'lunes';
    if (lunes || req.query.resumen === '1') {
      const r = await rpc('adm_resumen', { p_secret: sec, p_dias: 7 });
      const t = (cab, filas) => '<table cellpadding="6" style="border-collapse:collapse;font-size:14px;margin:8px 0 18px"><tr style="background:#EEF2F6">' + cab.map(c => '<th align="left">' + c + '</th>').join('') + '</tr>' + filas.join('') + '</table>';
      const fo = (r.por_origen || []).map(o => '<tr><td>' + esc(o.origen) + '</td><td>' + o.n + '</td><td>' + o.visitas + '</td><td>' + o.presupuestos + '</td><td>' + o.si + '</td><td>' + pct(o.si, o.n) + '</td><td>' + (o.rel_medio || '—') + '</td></tr>');
      const fc = (r.por_campana || []).map(o => '<tr><td>' + esc(o.campana) + '</td><td>' + o.n + '</td><td>' + o.si + '</td><td>' + (o.rel_medio || '—') + '</td></tr>');
      const fk = (r.clics || []).map(o => '<tr><td>' + esc(o.tipo) + '</td><td>' + esc(o.origen) + '</td><td>' + o.n + '</td></tr>');
      const fm = (r.motivos || []).map(o => '<tr><td>' + esc(o.motivo) + '</td><td>' + o.n + '</td></tr>');
      out.resumen = await correo(RESUMEN_PARA, 'AMS: resumen de la semana (' + r.total + ' contactos)',
        caja('<p style="font-size:18px;font-weight:700">Resumen de los últimos 7 días</p><p>' + r.total + ' contactos nuevos. ' + r.sin_llamar + ' sin llamar desde hace casi un día.</p>' +
          '<p style="font-weight:700;margin-bottom:0">Por origen</p>' + t(['Origen', 'Entran', 'Visitas', 'Presup.', 'Sí', 'Cierre', 'Valor'], fo) +
          (fc.length ? '<p style="font-weight:700;margin-bottom:0">Por campaña</p>' + t(['Campaña', 'Entran', 'Sí', 'Valor'], fc) : '') +
          (fk.length ? '<p style="font-weight:700;margin-bottom:0">Clics en WhatsApp y llamar</p>' + t(['Tipo', 'Origen', 'Clics'], fk) : '') +
          (fm.length ? '<p style="font-weight:700;margin-bottom:0">Por qué no salen</p>' + t(['Motivo', 'Cuántos'], fm) : '') +
          '<p style="color:#5B6B79;font-size:13px">Valor: lo que facturan los trabajos contratados frente a la media de Javi (100 = trabajo medio). Las cifras en euros no salen de su móvil.</p>'));
    }
    return res.json({ ok: true, out });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
};
module.exports.default = module.exports;
