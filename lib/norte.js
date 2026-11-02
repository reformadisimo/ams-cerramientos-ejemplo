// Zona norte de Madrid (urbanizaciones de chalets): precio con un 25 % más (Javi, 1 y 2-nov-2026: ventanas y también cancelas).
// Lo usan /api/fotos (precio con fotos) y /api/precio (calculadora).
const NORTE_CP = { '28109': 'La Moraleja y El Soto (Alcobendas)', '28050': 'El Encinar de los Reyes', '28043': 'Conde Orgaz y Piovera', '28042': 'Alameda de Osuna', '28860': 'Paracuellos de Jarama', '28120': 'Santo Domingo (Algete)', '28707': 'Ciudalcampo y Fuente del Fresno' };
const RECARGO_NORTE = Number(process.env.RECARGO_NORTE || 1.25);
const quita = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const PALABRAS = ['moraleja', 'encinar de los reyes', 'conde orgaz', 'piovera', 'alameda de osuna', 'santo domingo', 'ciudalcampo', 'fuente del fresno', 'paracuellos'];
function esNorte(cp, texto) {
  const c = String(cp || '').replace(/\D/g, '').slice(0, 5);
  if (NORTE_CP[c]) return true;
  const m = quita(texto).match(/\b(28\d{3})\b/);
  if (m && NORTE_CP[m[1]]) return true;
  const t = quita(texto);
  return PALABRAS.some(p => t.includes(p));
}
module.exports = { NORTE_CP, RECARGO_NORTE, esNorte };
