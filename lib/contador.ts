/* Filtro de robots y freno por conexión del contador propio (/api/vista y /api/tiempo). Igual que Reformadísimo y Casiopea. */

export const ROBOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|inspectiontool|preview|python|curl|wget|httpclient|java\/|go-http|node-fetch|axios|phantom|puppeteer|playwright|selenium|facebookexternalhit|mediapartners|adsbot|gptbot|chatgpt-user|oai-searchbot|bytespider|ahrefs|semrush|mj12|dataforseo|yandex|baidu|petal/i;

// Freno por conexión (en memoria de cada instancia): por defecto, 200 por hora.
const cuenta = new Map<string, { n: number; desde: number }>();
export function superaLimite(ip: string, max = 200) {
  const ahora = Date.now();
  const x = cuenta.get(ip);
  if (!x || ahora - x.desde > 3600_000) { cuenta.set(ip, { n: 1, desde: ahora }); if (cuenta.size > 5000) cuenta.clear(); return false; }
  x.n += 1;
  return x.n > max;
}

