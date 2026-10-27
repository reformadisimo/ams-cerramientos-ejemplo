// Calcula la horquilla de precio en el servidor, para que el preciario no se vea en la página.
const base = require('../../lib/preciario.js');

function mezcla(a, b) {
  if (!b || typeof b !== 'object' || Array.isArray(b)) return b === undefined ? a : b;
  const out = Array.isArray(a) ? a.slice() : Object.assign({}, a);
  for (const k of Object.keys(b)) out[k] = (a && typeof a[k] === 'object' && !Array.isArray(a[k])) ? mezcla(a[k], b[k]) : b[k];
  return out;
}

function preciario() {
  try { return process.env.PRECIARIO ? mezcla(base, JSON.parse(process.env.PRECIARIO)) : base; }
  catch (e) { return base; }
}

const num = (v, min, max, def) => { const n = Number(v); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def; };
const r10 = (n) => Math.round(n / 10) * 10;
const elige = (tabla, k, def) => (tabla && Object.prototype.hasOwnProperty.call(tabla, k) ? k : def);

function ventanas(d, P) {
  const v = P.ventana, lineas = [];
  const mat = elige(v.material, d.material, 'aluminio');
  const ap = elige(v.apertura, d.apertura, 'corredera');
  const vid = elige(v.vidrio, d.vidrio, 'doble');
  const col = elige(v.color, d.color, 'blanco');
  const per = elige(v.persiana, d.persiana, 'no');
  const f = v.material[mat] * v.apertura[ap] * v.vidrio[vid] * v.color[col];
  let total = 0;
  for (const it of (Array.isArray(d.ventanas) ? d.ventanas.slice(0, 40) : [])) {
    const n = Math.round(num(it.n, 0, 60, 0));
    if (!n) continue;
    const w = num(it.w, 30, 600, 120), h = num(it.h, 30, 300, 120);
    const lo = (v.fijo + v.m2 * (w * h / 10000)) * f;
    let a = lo, b = lo * v.margen_alto;
    a += v.persiana[per][0]; b += v.persiana[per][1];
    if (d.mosquitera) { a += v.mosquitera[0]; b += v.mosquitera[1]; }
    lineas.push({ t: `${n} × ${String(it.label || 'Ventana').slice(0, 60)} (${Math.round(w)} × ${Math.round(h)} cm)`, low: r10(a * n), high: r10(b * n) });
    total += n;
  }
  return { lineas, unidades: total };
}

function terraza(d, P) {
  const t = P.terraza;
  const sis = elige({ pvc: 1, aluminio: 1, cortina: 1 }, d.sistema, 'aluminio');
  const m2 = num(d.m2, 1, 80, 10);
  const nombre = { pvc: 'PVC', aluminio: 'aluminio con rotura de puente térmico', cortina: 'cortina de cristal' }[sis];
  const lineas = [{ t: `Cerramiento en ${nombre}, ${m2.toFixed(1).replace('.', ',')} m²`, low: r10(t[sis][0] * m2), high: r10(t[sis][1] * m2) }];
  if (d.persiana && sis !== 'cortina') lineas.push({ t: 'Cajón y persiana', low: r10(t.persiana_m2[0] * m2), high: r10(t.persiana_m2[1] * m2) });
  return { lineas };
}

function cerrajeria(d, P) {
  const c = P.cerrajeria, lineas = [];
  const tipo = elige({ peatonal: 1, batiente: 1, corredera: 1, reja: 1 }, d.tipo, 'peatonal');
  if (tipo === 'reja') {
    const n = Math.round(num(d.n, 1, 40, 1));
    const m2 = num(d.ancho, 0.3, 4, 1.2) * num(d.alto, 0.3, 3, 1.2);
    const a = Math.max(c.reja_minimo, c.reja_m2[0] * m2), b = Math.max(c.reja_minimo * 1.3, c.reja_m2[1] * m2);
    lineas.push({ t: `${n} × reja de ventana`, low: r10(a * n), high: r10(b * n) });
    return { lineas };
  }
  const ancho = num(d.ancho, 0.6, 8, tipo === 'peatonal' ? 1 : 3.5), alto = num(d.alto, 1, 3, 2);
  const dis = elige(c.diseno, d.diseno, 'lamas');
  let lo = (c.cancela.fijo + c.cancela.m2 * ancho * alto) * c.diseno[dis];
  if (tipo === 'corredera') lo *= c.corredera;
  const nombre = { peatonal: 'Cancela peatonal', batiente: 'Cancela de coches batiente', corredera: 'Cancela de coches corredera' }[tipo];
  lineas.push({ t: `${nombre} de aluminio soldado (${ancho.toFixed(2).replace('.', ',')} × ${alto.toFixed(2).replace('.', ',')} m)`, low: r10(lo), high: r10(lo * c.cancela.margen_alto) });
  if (d.extra) {
    const e = tipo === 'peatonal' ? c.cerradura_electrica : (tipo === 'corredera' ? c.motor_corredera : c.motor_batiente);
    lineas.push({ t: tipo === 'peatonal' ? 'Cerradura eléctrica' : 'Motor y dos mandos', low: e[0], high: e[1] });
  }
  return { lineas };
}

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(JSON.stringify({ error: 'Usa POST' })); }
  let d = req.body;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { d = {}; } }
  d = d || {};
  const P = preciario();
  const calc = { ventanas, terraza, cerrajeria }[d.svc];
  if (!calc) { res.statusCode = 400; return res.end(JSON.stringify({ error: 'Servicio no válido' })); }
  const out = calc(d, P);
  out.low = out.lineas.reduce((s, l) => s + l.low, 0);
  out.high = out.lineas.reduce((s, l) => s + l.high, 0);
  out.iva_incluido = !!P.iva_incluido;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(out));
};

/* Next.js (pages/api) pide la función como exportación "default" */
module.exports.default = module.exports;
