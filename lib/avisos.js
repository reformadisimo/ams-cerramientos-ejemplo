// A quién llegan los avisos de la web (2-nov-2026): a Javi en info@amscerramientos.es (no al de la cerrajería),
// con copia oculta a Ig. Nombres de variable nuevos para que no los pise un valor viejo de CRM_AVISOS_PARA en Vercel.
const lista = s => String(s || '').split(',').map(x => x.trim()).filter(Boolean);
const PARA = lista(process.env.AVISOS_PARA_AMS || 'info@amscerramientos.es');
const COPIA = lista(process.env.AVISOS_COPIA_AMS || 'delarubiaignacio@gmail.com');
module.exports = { PARA, COPIA, PARA_TXT: PARA.join(','), bcc: COPIA.length ? COPIA : undefined };
