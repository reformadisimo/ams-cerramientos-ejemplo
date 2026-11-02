// Remitente y clave de todos los correos de la web de AMS (2-nov-2026): dominio propio verificado en Resend
// (avisos.amscerramientos.es, subdominio solo para envíos; el correo normal de info@ no se toca).
// La clave vieja de Vercel (RESEND_API_KEY) solo puede enviar desde send.miestela.app, así que el remitente
// nuevo va SIEMPRE con su propia clave (AMS_RESEND_KEY). Si esa clave falta, se sigue usando el remitente viejo
// para que ningún aviso a Javi se pierda.
const CLAVE_AMS = process.env.AMS_RESEND_KEY || '';
const CLAVE = CLAVE_AMS || process.env.RESEND_API_KEY || '';
const DE = CLAVE_AMS
  ? (process.env.AMS_REMITENTE || 'AMS Cerramientos <avisos@avisos.amscerramientos.es>')
  : 'AMS Cerramientos <guia@send.miestela.app>';
module.exports = { DE, CLAVE };
