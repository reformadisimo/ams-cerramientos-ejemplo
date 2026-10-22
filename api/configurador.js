// Precio en vivo del configurador profesional. Calcula en el servidor para que el
// preciario no se vea en la pagina. POST { items: [...], probe: indice opcional }.
const base = require('./_preciario.js');

function mezcla(a, b) {
  if (!b || typeof b !== 'object' || Array.isArray(b)) return b === undefined ? a : b;
  const out = Array.isArray(a) ? a.slice() : Object.assign({}, a);
  for (const k of Object.keys(b)) out[k] = (a && typeof a[k] === 'object' && !Array.isArray(a[k])) ? mezcla(a[k], b[k]) : b[k];
  return out;
}
function tabla() {
  let P = base;
  try { if (process.env.PRECIARIO) P = mezcla(base, JSON.parse(process.env.PRECIARIO)); } catch (e) {}
  return P.configurador;
}

const num = (v, min, max, def) => { const n = Number(v); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def; };
const en = (obj, k, def) => (obj && Object.prototype.hasOwnProperty.call(obj, k) ? k : def);
const r5 = (n) => Math.round(n / 5) * 5;
const TIPOS = ['ventana', 'balconera', 'corredera', 'fijo', 'techo', 'claraboya'];

// Normaliza un item: todo lo que llega se acota a valores conocidos.
function limpia(it, C) {
  const t = en({ ventana: 1, balconera: 1, corredera: 1, fijo: 1, techo: 1, claraboya: 1 }, it && it.tipo, 'ventana');
  const o = { tipo: t, n: Math.round(num(it.n, 1, 50, 1)) };
  if (t === 'techo') {
    o.talla = en(C.techo.talla, it.talla, '78x118');
    o.aper = it.aper === 'proyectante' ? 'proyectante' : 'giratoria';
    o.acc = en({ manual: 1, electrica: 1, solar: 1 }, it.acc, 'manual');
    o.estor = !!it.estor; o.persext = !!it.persext; o.mosq = !!it.mosq;
    o.obra = it.obra === 'nuevo' ? 'nuevo' : 'sustitucion';
    return o;
  }
  if (t === 'claraboya') {
    o.talla = en(C.claraboya.talla, String(it.talla), '80');
    o.acc = it.acc === 'electrica' ? 'electrica' : 'fija';
    o.estor = !!it.estor; o.obra = it.obra === 'nuevo' ? 'nuevo' : 'sustitucion';
    return o;
  }
  const maxW = t === 'corredera' ? 600 : 400, maxH = t === 'balconera' || t === 'corredera' ? 280 : 260;
  o.w = num(it.w, 30, maxW, 120); o.h = num(it.h, 30, maxH, 120);
  o.hojas = Math.round(num(it.hojas, 1, t === 'corredera' ? 4 : 3, t === 'corredera' ? 2 : 1));
  if (t === 'corredera' && o.hojas < 2) o.hojas = 2;
  o.mat = it.mat === 'alu' ? 'alu' : 'pvc';
  o.gama = en({ eco: 1, confort: 1, premium: 1 }, it.gama, 'confort');
  o.col = en(C.color, it.col, 'blanco');
  o.vid = en(C.vidrio_m2, it.vid, 'bajoe');
  o.pers = en({ no: 1, manual: 1, motor: 1, radio: 1, solar: 1 }, it.pers, 'no');
  o.mosq = en({ no: 1, enrollable: 1, plisada: 1 }, it.mosq, 'no');
  o.fijo = t === 'fijo' || t === 'corredera' ? 'no' : en({ no: 1, sup: 1, inf: 1 }, it.fijo, 'no');
  o.umbral = t === 'balconera' && !!it.umbral;
  o.elev = t === 'corredera' && !!it.elev;
  const ap = Array.isArray(it.aper) ? it.aper : [];
  o.aper = [];
  for (let i = 0; i < o.hojas; i++) {
    if (t === 'fijo') o.aper.push('fija');
    else if (t === 'corredera') o.aper.push('corredera');
    else o.aper.push(en({ fija: 1, practicable: 1, osc: 1 }, ap[i], i === 0 ? 'osc' : 'practicable'));
  }
  return o;
}

function precioUnidad(o, C) {
  if (o.tipo === 'techo') {
    const T = C.techo;
    let p = T.talla[o.talla];
    if (o.aper === 'proyectante') p += T.proyectante;
    if (o.acc === 'electrica') p += T.electrica;
    if (o.acc === 'solar') p += T.solar;
    if (o.estor) p += T.estor;
    if (o.persext) p += T.persiana_ext;
    if (o.mosq) p += T.mosquitera;
    if (o.obra === 'nuevo') p += T.hueco_nuevo;
    return p;
  }
  if (o.tipo === 'claraboya') {
    const K = C.claraboya;
    let p = K.talla[o.talla];
    if (o.acc === 'electrica') p += K.electrica;
    if (o.estor) p += K.estor;
    if (o.obra === 'nuevo') p += K.hueco_nuevo;
    return p;
  }
  const m2 = o.w * o.h / 10000;
  let marco = 0;
  for (const a of o.aper) marco += C.hoja[a] + (o.tipo === 'balconera' ? C.hoja_balconera_extra : 0);
  marco += m2 * C.m2[o.mat][o.gama];
  if (o.fijo !== 'no') marco += C.fijo_extra;
  let p = marco * C.color[o.col] + m2 * C.vidrio_m2[o.vid];
  const I = C.instalacion;
  p += o.tipo === 'corredera' ? (o.h >= 160 ? I.corredera_grande : I.corredera) : I[o.tipo];
  if (o.umbral) p += C.umbral_rebajado;
  if (o.elev) p += C.corredera_elevadora;
  if (o.pers !== 'no') p += C.persiana.fijo[o.pers] + C.persiana.m2 * (o.w * (o.h + 20) / 10000);
  if (o.mosq !== 'no') p += C.mosquitera[o.mosq][0] + C.mosquitera[o.mosq][1] * m2;
  return p;
}
const total = (o, C) => r5(precioUnidad(o, C)) * o.n;

// Cuanto sumaria o restaria cada opcion al item que se esta configurando.
function variantes(o, C) {
  const out = {}, actual = total(o, C);
  const prueba = (k, vals, set) => {
    out[k] = {};
    for (const v of vals) { const c = JSON.parse(JSON.stringify(o)); set(c, v); out[k][v] = total(limpia(c, C), C) - actual; }
  };
  if (o.tipo === 'techo') {
    prueba('talla', Object.keys(C.techo.talla), (c, v) => { c.talla = v; });
    prueba('aper', ['giratoria', 'proyectante'], (c, v) => { c.aper = v; });
    prueba('acc', ['manual', 'electrica', 'solar'], (c, v) => { c.acc = v; });
    for (const k of ['estor', 'persext', 'mosq']) prueba(k, ['0', '1'], (c, v) => { c[k] = v === '1'; });
    prueba('obra', ['sustitucion', 'nuevo'], (c, v) => { c.obra = v; });
    return out;
  }
  if (o.tipo === 'claraboya') {
    prueba('talla', Object.keys(C.claraboya.talla), (c, v) => { c.talla = v; });
    prueba('acc', ['fija', 'electrica'], (c, v) => { c.acc = v; });
    prueba('estor', ['0', '1'], (c, v) => { c.estor = v === '1'; });
    prueba('obra', ['sustitucion', 'nuevo'], (c, v) => { c.obra = v; });
    return out;
  }
  prueba('mat', ['pvc', 'alu'], (c, v) => { c.mat = v; });
  prueba('gama', ['eco', 'confort', 'premium'], (c, v) => { c.gama = v; });
  prueba('col', Object.keys(C.color), (c, v) => { c.col = v; });
  prueba('vid', Object.keys(C.vidrio_m2), (c, v) => { c.vid = v; });
  prueba('pers', ['no', 'manual', 'motor', 'radio', 'solar'], (c, v) => { c.pers = v; });
  prueba('mosq', ['no', 'enrollable', 'plisada'], (c, v) => { c.mosq = v; });
  if (o.tipo === 'ventana' || o.tipo === 'balconera') {
    prueba('fijo', ['no', 'sup', 'inf'], (c, v) => { c.fijo = v; });
    out.aper = {};
    o.aper.forEach((a, i) => {
      for (const v of ['fija', 'practicable', 'osc']) {
        const c = JSON.parse(JSON.stringify(o)); c.aper[i] = v;
        out.aper[i + ':' + v] = total(limpia(c, C), C) - actual;
      }
    });
  }
  if (o.tipo === 'balconera') prueba('umbral', ['0', '1'], (c, v) => { c.umbral = v === '1'; });
  if (o.tipo === 'corredera') prueba('elev', ['0', '1'], (c, v) => { c.elev = v === '1'; });
  return out;
}

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(JSON.stringify({ error: 'Usa POST' })); }
  let d = req.body;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { d = {}; } }
  d = d || {};
  const C = tabla();
  const items = (Array.isArray(d.items) ? d.items.slice(0, 60) : []).map((it) => limpia(it || {}, C));
  const lineas = items.map((o) => ({ unidad: r5(precioUnidad(o, C)), total: total(o, C) }));
  const base_ = lineas.reduce((s, l) => s + l.total, 0);
  // La misma casa en el otro material, para comparar lado a lado.
  const alt = { pvc: 0, alu: 0 };
  let hayCarpinteria = false;
  for (const o of items) {
    if (o.tipo === 'techo' || o.tipo === 'claraboya') { const t = total(o, C); alt.pvc += t; alt.alu += t; continue; }
    hayCarpinteria = true;
    for (const m of ['pvc', 'alu']) alt[m] += total(Object.assign({}, o, { mat: m }), C);
  }
  const out = { lineas, base: base_, iva_pct: C.iva, iva: Math.round(base_ * C.iva) / 100, total: Math.round(base_ * (100 + C.iva)) / 100, comparar: hayCarpinteria ? alt : null };
  const pi = Number(d.probe);
  if (Number.isInteger(pi) && items[pi]) out.variantes = variantes(items[pi], C);
  res.end(JSON.stringify(out));
};
module.exports._limpia = limpia;
