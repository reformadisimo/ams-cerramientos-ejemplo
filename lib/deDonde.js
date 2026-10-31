// De dónde viene la persona, en una línea legible para los avisos de contacto (31-oct-2026).
// Recibe lo que manda window.amsOrigen() de public/origen.js. Si no hay nada, «sin dato».
const DIRECTO = 'directo o sin dato (escribió la dirección, un favorito, un buscador sin anuncio o una app que no dice de dónde viene)';
function deDonde(o) {
  if (!o || typeof o !== 'object') return 'sin dato';
  const c = (k) => String(o[k] || '').replace(/[\r\n\t<>]+/g, ' ').trim().slice(0, 120);
  let t;
  if (c('gclid') || c('gbraid') || c('wbraid')) t = 'Anuncio de Google';
  else if (c('fbclid')) t = 'Facebook / Instagram';
  else if (c('utm_source')) t = c('utm_source') + (c('utm_medium') ? ' / ' + c('utm_medium') : '') + (c('utm_campaign') ? ' (' + c('utm_campaign') + ')' : '');
  else if (c('referente')) { try { t = 'desde ' + new URL(c('referente')).hostname.replace(/^www\./, ''); } catch (e) { t = 'desde otra web'; } }
  else if (c('pagina_entrada')) t = DIRECTO;
  else return 'sin dato';
  if (c('pagina_entrada')) t += ' · entró por ' + c('pagina_entrada');
  return t;
}
module.exports = { deDonde, DIRECTO };
