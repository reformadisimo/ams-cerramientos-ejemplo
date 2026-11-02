// Remitente de todos los correos de la web de AMS (2-nov-2026): dominio propio verificado en Resend
// (avisos.amscerramientos.es, subdominio solo para envíos; el correo normal de info@ no se toca).
// Variable nueva para que no la pise un valor viejo de CRM_AVISOS_DE / RESPUESTAS_DE en Vercel.
const DE = process.env.AMS_REMITENTE || 'AMS Cerramientos <avisos@avisos.amscerramientos.es>';
module.exports = { DE };
