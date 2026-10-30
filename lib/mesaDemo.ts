/* Mesa de control de EJEMPLO para AMS Cerramientos: cifras INVENTADAS, con forma creíble.
   Una sola fuente: de aquí salen tanto la pantalla principal (lib/panelDemo.ts) como la vista
   completa (detalleDemo), así que los totales de los últimos 28 días coinciden en las dos.
   Siempre dan lo mismo para el mismo día (generador con semilla). */

const semilla = (t: string) => { let h = 2166136261; for (const c of t) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; };
const suma = (s: string, n: number) => { const d = new Date(`${s}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dias = (desde: string, hasta: string) => { const o: string[] = []; for (let d = desde; d <= hasta; d = suma(d, 1)) o.push(d); return o; };
const poisson = (r: () => number, media: number) => { let k = 0, p = 1; const L = Math.exp(-media); do { k++; p *= r(); } while (p > L); return k - 1; };
const finde = (d: string) => [0, 6].includes(new Date(`${d}T12:00:00Z`).getUTCDay());
const peso = (d: string) => (finde(d) ? 0.5 : 1) * (Number(d.slice(5, 7)) === 8 ? 0.6 : 1);
const ritmo = (d: string) => { const meses = Date.parse(d) / (30 * 86400000) - 668; return (1 + 0.012 * meses) * (Number(d.slice(5, 7)) === 8 ? 0.6 : Number(d.slice(5, 7)) === 12 ? 0.8 : 1) * (finde(d) ? 0.55 : 1); };

/** Reparte `total` unidades enteras entre los días, al azar pero con el total EXACTO. */
function reparteAzar(r: () => number, total: number, ds: string[]): number[] {
  const w = ds.map(peso), S = w.reduce((a, b) => a + b, 0), o = ds.map(() => 0);
  for (let i = 0; i < total; i++) { let x = r() * S, j = 0; while (j < w.length - 1 && x > w[j]) { x -= w[j]; j++; } o[j]++; }
  return o;
}
/** Igual para totales grandes: reparto proporcional con variación y total EXACTO (restos mayores). */
function reparteGrande(r: () => number, total: number, ds: string[], variacion = 0.35): number[] {
  const w = ds.map((d) => peso(d) * (1 - variacion / 2 + variacion * r())), S = w.reduce((a, b) => a + b, 0);
  const ideal = w.map((x) => (x / S) * total), o = ideal.map(Math.floor);
  let falta = total - o.reduce((a, b) => a + b, 0);
  ideal.map((x, i) => [x - Math.floor(x), i] as [number, number]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (falta > 0) { o[i]++; falta--; } });
  return o;
}

/* ── lo que se quiere enseñar en los últimos 28 días y en los 28 anteriores ── */
export const CANALES = ["Google Ads", "Google (búsqueda)", "Directo o sin dato", "Asistentes de IA", "Meta / Instagram"] as const;
type Canal = (typeof CANALES)[number];
const CANALES_GA = ["Organic Search", "Paid Search", "Direct", "Referral", "Organic Social"] as const;
type Ventana = {
  leads: number[]; visitas: number[]; pres: number[]; firm: number[]; desc: number[]; tickets: number[][];
  whatsapp: number; llamadas: number; calculos: number; sesiones: number[]; vistas: number; clave: number;
  gscClics: number; gscImp: number; gscPos: number;
  camp: [string, number, number][]; // nombre, euros, conversiones
  ficha: number[]; // búsqueda, mapas, sitio web, llamar, cómo llegar
};
const ACTUAL: Ventana = {
  leads: [4, 10, 16, 3, 5], visitas: [2, 5, 6, 1, 2], pres: [2, 3, 4, 1, 1], firm: [1, 1, 2, 0, 0], desc: [1, 2, 2, 0, 1],
  tickets: [[4900], [3600], [6200, 5100], [], []],
  whatsapp: 26, llamadas: 8, calculos: 142, sesiones: [1250, 640, 560, 190, 300], vistas: 5590, clave: 33,
  gscClics: 410, gscImp: 18600, gscPos: 11.8,
  camp: [["PVC Alcalá de Henares", 330, 6], ["Ventanas de aluminio", 200, 4], ["Cerramiento de terrazas", 190, 3], ["Cancelas y puertas", 60, 1], ["Mosquiteras", 60, 0]],
  ficha: [1480, 920, 210, 21, 34],
};
const ANTES: Ventana = {
  leads: [3, 9, 12, 2, 5], visitas: [1, 4, 4, 1, 2], pres: [1, 3, 3, 1, 1], firm: [0, 1, 1, 0, 1], desc: [1, 1, 2, 0, 1],
  tickets: [[], [4100], [7300], [], [2800]],
  whatsapp: 20, llamadas: 6, calculos: 118, sesiones: [1110, 590, 500, 170, 250], vistas: 4980, clave: 27,
  gscClics: 370, gscImp: 17200, gscPos: 12.4,
  camp: [["PVC Alcalá de Henares", 310, 5], ["Ventanas de aluminio", 180, 3], ["Cerramiento de terrazas", 150, 2], ["Cancelas y puertas", 70, 1], ["Mosquiteras", 70, 1]],
  ficha: [1358, 860, 190, 17, 29],
};

type Unidad = { d: string; c: Canal; visita: boolean; pres: boolean; firm: boolean; importe: number; desc: boolean; resp: number | null };
type Todo = {
  hoy: string; desde: string; ds: string[];
  pet: Record<string, Record<string, number>>; unidades: Unidad[];
  visitas: Record<string, number>; whatsapp: Record<string, number>; llamadas: Record<string, number>; calculos: Record<string, number>; vistas: Record<string, number>;
  clics: Record<string, Record<string, number>>;
  ga: { dia: string; canal: string; sesiones: number; usuarios: number; interes: number; clave: number }[];
  gsc: { dia: string; clics: number; impresiones: number; posicion: number }[];
  diario: [string, string, string, number, number, number, number][];
  mensual: [string, string, string, number, number, number, number][];
  ficha: [string, number, number, number, number, number][];
  ig: [string, number, number, number | null][];
};
const memo = new Map<string, Todo>();

function construye(hoy: string): Todo {
  const desde = suma(hoy, -400), ds = dias(desde, hoy);
  const cur = dias(suma(hoy, -28), suma(hoy, -1)), prev = dias(suma(hoy, -56), suma(hoy, -29));
  const enCur = (d: string) => d >= cur[0] && d <= cur[27], enPrev = (d: string) => d >= prev[0] && d <= prev[27];
  const pet: Todo["pet"] = {}, unidades: Unidad[] = [], visitas: Todo["visitas"] = {}, whatsapp: Todo["whatsapp"] = {}, llamadas: Todo["llamadas"] = {}, calculos: Todo["calculos"] = {}, vistas: Todo["vistas"] = {}, clics: Todo["clics"] = {};
  for (const d of ds) { pet[d] = {}; clics[d] = {}; visitas[d] = 0; whatsapp[d] = 0; llamadas[d] = 0; calculos[d] = 0; vistas[d] = 0; }

  const r0 = semilla(`ams${hoy.slice(0, 7)}`);
  const ventanas: [string[], Ventana][] = [[cur, ACTUAL], [prev, ANTES]];
  const k0 = (d: string) => ritmo(d) / ritmo(suma(hoy, -14));
  // ── ventanas exactas ──
  for (const [vd, V] of ventanas) {
    const r = semilla(`v${vd[0]}`);
    CANALES.forEach((c, ci) => {
      const porDia = reparteAzar(r, V.leads[ci], vd);
      const lista: Unidad[] = [];
      vd.forEach((d, i) => { if (porDia[i]) pet[d][c] = porDia[i]; for (let n = 0; n < porDia[i]; n++) lista.push({ d, c, visita: false, pres: false, firm: false, importe: 0, desc: false, resp: Math.round((0.5 + 7 * r()) * 10) / 10 }); });
      const mezcla = [...lista].sort(() => r() - 0.5);
      mezcla.slice(0, V.visitas[ci]).forEach((u) => (u.visita = true));
      const vis = mezcla.filter((u) => u.visita), pres = vis.slice(0, V.pres[ci]);
      pres.forEach((u) => (u.pres = true));
      pres.slice(0, V.firm[ci]).forEach((u, i) => { u.firm = true; u.importe = V.tickets[ci][i] ?? 4000; });
      mezcla.filter((u) => !u.visita).slice(0, V.desc[ci]).forEach((u) => (u.desc = true));
      unidades.push(...lista);
    });
    reparteAzar(r, V.whatsapp, vd).forEach((n, i) => (whatsapp[vd[i]] = n));
    reparteAzar(r, V.llamadas, vd).forEach((n, i) => (llamadas[vd[i]] = n));
    reparteGrande(r, V.calculos, vd, 0.6).forEach((n, i) => (calculos[vd[i]] = n));
    reparteGrande(r, V.vistas, vd, 0.3).forEach((n, i) => (vistas[vd[i]] = n));
  }
  // Dos contactos esperando respuesta en los últimos 28 días (se ven como «pendientes»)
  for (const c of ["Directo o sin dato", "Google (búsqueda)"] as Canal[]) {
    const u = unidades.filter((x) => enCur(x.d) && x.c === c && !x.visita && !x.desc).sort((a, b) => (a.d < b.d ? 1 : -1))[0];
    if (u) u.resp = null;
  }
  // ── resto de la historia: más flojo, con la misma forma ──
  for (const d of ds) {
    if (enCur(d) || enPrev(d)) continue;
    const r = semilla(`h${d}`), k = k0(d) * 0.88;
    CANALES.forEach((c, ci) => {
      const n = poisson(r, (ANTES.leads[ci] / 28) * k);
      if (n) pet[d][c] = n;
      for (let i = 0; i < n; i++) {
        const visita = r() < 0.38, pres = visita && r() < 0.75, firm = pres && r() < 0.33;
        unidades.push({ d, c, visita, pres, firm, importe: firm ? Math.round((2400 + 4600 * r()) / 50) * 50 : 0, desc: !visita && r() < 0.3, resp: Math.round((0.5 + 7 * r()) * 10) / 10 });
      }
    });
    whatsapp[d] = poisson(r, (ANTES.whatsapp / 28) * k); llamadas[d] = poisson(r, (ANTES.llamadas / 28) * k);
    calculos[d] = Math.round((ANTES.calculos / 28) * k * (0.6 + 0.8 * r())); vistas[d] = Math.round((ANTES.vistas / 28) * k * (0.75 + 0.5 * r()));
  }
  for (const d of ds) {
    const r = semilla(`c${d}`);
    visitas[d] = unidades.filter((u) => u.d === d && u.visita).length;
    const total = whatsapp[d] + llamadas[d];
    const pesos = CANALES.map((c, i) => (ACTUAL.leads[i] || 1) * (c === "Directo o sin dato" ? 1.3 : 1));
    const sp = pesos.reduce((a, b) => a + b, 0);
    for (let i = 0; i < total; i++) { let x = r() * sp, j = 0; while (j < pesos.length - 1 && x > pesos[j]) { x -= pesos[j]; j++; } clics[d][CANALES[j]] = (clics[d][CANALES[j]] ?? 0) + 1; }
  }

  // ── Analytics y Search Console ──
  const ga: Todo["ga"] = [], gsc: Todo["gsc"] = [];
  const sesCanal: Record<string, number> = {}; // "canal|dia"
  const claveDia: Record<string, number> = {};
  for (const [vd, V] of ventanas) {
    const r = semilla(`g${vd[0]}`);
    CANALES_GA.forEach((c, ci) => reparteGrande(r, V.sesiones[ci], vd, 0.4).forEach((n, i) => (sesCanal[`${c}|${vd[i]}`] = n)));
    reparteAzar(r, V.clave, vd).forEach((n, i) => (claveDia[vd[i]] = n));
    const imp = reparteGrande(r, V.gscImp, vd, 0.3), cl = reparteGrande(r, V.gscClics, vd, 0.5);
    vd.forEach((d, i) => gsc.push({ dia: d, clics: cl[i], impresiones: imp[i], posicion: Math.round((V.gscPos + 1.2 * (r() - 0.5)) * 10) / 10 }));
  }
  for (const d of ds) {
    if (enCur(d) || enPrev(d)) continue;
    const r = semilla(`gh${d}`), k = k0(d) * 0.9;
    CANALES_GA.forEach((c, ci) => (sesCanal[`${c}|${d}`] = Math.round((ANTES.sesiones[ci] / 28) * k * (0.7 + 0.6 * r()))));
    claveDia[d] = poisson(r, (ANTES.clave / 28) * k);
    const imp = Math.round((ANTES.gscImp / 28) * k * (0.8 + 0.4 * r()));
    gsc.push({ dia: d, clics: Math.round(imp * (0.019 + 0.006 * r())), impresiones: imp, posicion: Math.round((14 - 0.004 * dias(desde, d).length + 1.5 * r()) * 10) / 10 });
  }
  gsc.sort((a, b) => (a.dia < b.dia ? -1 : 1));
  for (const d of ds) {
    const r = semilla(`gi${d}`);
    CANALES_GA.forEach((c, ci) => {
      const s = sesCanal[`${c}|${d}`] ?? 0;
      const clave = ci === 0 ? Math.round((claveDia[d] ?? 0) * 0.4) : ci === 2 ? Math.round((claveDia[d] ?? 0) * 0.4) : ci === 1 ? Math.round((claveDia[d] ?? 0) * 0.2) : 0;
      ga.push({ dia: d, canal: c, sesiones: s, usuarios: Math.round(s * 0.86), interes: Math.round(s * (0.5 + 0.12 * r())), clave });
    });
  }

  // ── Anuncios (solo Google Ads) ──
  const diario: Todo["diario"] = [], mensual: Todo["mensual"] = [];
  const cpc = [0.95, 1.1, 0.8, 0.7, 0.4];
  for (const [vd, V] of ventanas) {
    const r = semilla(`a${vd[0]}`);
    V.camp.forEach(([nombre, euros, conv], ci) => {
      const cent = reparteGrande(r, euros * 100, vd, 0.7), cl = reparteGrande(r, Math.round(euros / cpc[ci]), vd, 0.5), cv = reparteAzar(r, conv, vd);
      vd.forEach((d, i) => diario.push([d, "google", nombre, cent[i] / 100, cl[i], cl[i] * (11 + Math.round(r() * 5)), cv[i]]));
    });
  }
  for (const d of dias(suma(hoy, -60), suma(hoy, -57))) {
    const r = semilla(`ax${d}`);
    ANTES.camp.forEach(([nombre, euros, conv], ci) => { const c = Math.round((euros / 28) * (0.5 + r()) * 100) / 100; const cl = Math.round(c / cpc[ci]); diario.push([d, "google", nombre, c, cl, cl * 12, poisson(r, conv / 28)]); });
  }
  diario.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const primero = diario[0]?.[0].slice(0, 7) ?? "";
  for (const d of ds) if (d.endsWith("-15") && d.slice(0, 7) < primero) {
    const r = semilla(`m${d}`), k = ritmo(d) / ritmo(suma(hoy, -14));
    mensual.push([d.slice(0, 7), "google", "Todas las campañas", Math.round(760 * k * (0.8 + 0.4 * r())), Math.round(790 * k), Math.round(9800 * k), Math.round(11 * k)]);
  }

  // ── Ficha de Google (llega con 3 días de retraso) e Instagram ──
  const ficha: Todo["ficha"] = [];
  const corte = suma(hoy, -3);
  const fDias = dias(desde, corte).filter((d) => d < suma(hoy, -58));
  for (const d of [...fDias, suma(hoy, -30), suma(hoy, -29)]) { const r = semilla(`f${d}`), k = k0(d) * 0.9; ficha.push([d, poisson(r, (ANTES.ficha[0] / 28) * k * 0.9), poisson(r, (ANTES.ficha[1] / 28) * k * 0.9), poisson(r, (ANTES.ficha[2] / 28) * k), poisson(r, (ANTES.ficha[3] / 28) * k), poisson(r, (ANTES.ficha[4] / 28) * k)]); }
  // Ventana de la ficha: [hoy-28, hoy-3] y su comparación desplazada [hoy-58, hoy-31]
  const fAct = dias(suma(hoy, -28), corte), fAnt = dias(suma(hoy, -58), suma(hoy, -31));
  const rf = semilla(`fw${hoy}`);
  for (const [vd, V] of [[fAct, ACTUAL], [fAnt, ANTES]] as [string[], Ventana][]) {
    const cols = V.ficha.map((t) => reparteGrande(rf, t, vd, 0.5));
    vd.forEach((d, i) => ficha.push([d, cols[0][i], cols[1][i], cols[2][i], cols[3][i], cols[4][i]]));
  }
  ficha.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const ig: Todo["ig"] = [];
  for (const d of dias(suma(hoy, -119), hoy)) { const r = semilla(`i${d}`); ig.push([d, Math.round(520 * (0.6 + 0.8 * r())), Math.round(38 * (0.6 + 0.8 * r())), dias(d, hoy).length <= 30 ? poisson(r, 0.9) : null]); }
  void r0;
  return { hoy, desde, ds, pet, unidades, visitas, whatsapp, llamadas, calculos, vistas, clics, ga, gsc, diario, mensual, ficha, ig };
}
function todo(hoy: string): Todo { let t = memo.get(hoy); if (!t) { t = construye(hoy); memo.clear(); memo.set(hoy, t); } return t; }

export function datosDemo(hoy: string) {
  const T = todo(hoy);
  const web: Record<string, unknown> = {};
  for (const d of T.ds) {
    const peticiones = Object.values(T.pet[d]).reduce((a, b) => a + b, 0);
    web[d] = { peticiones, visitas: T.visitas[d], calculos: T.calculos[d], porCanal: T.pet[d], whatsapp: T.whatsapp[d], llamadas: T.llamadas[d], clicsPorFuente: T.clics[d], vistas: T.vistas[d], entradas: Math.round(T.vistas[d] / 2), personas: Math.round(T.vistas[d] / 2.45) };
  }
  const redes = {
    actualizado: hoy, ficha: { diario: T.ficha },
    instagram: { usuario: "amscerramientos", seguidores: 1486, publicaciones: 214, diario: T.ig },
    resenas: [{ fuente: "Google", nota: 4.8, escala: 5, total: 63, fecha: hoy, auto: true }],
    historial_resenas: [[suma(hoy, -35), "Google", 4.8, 61]] as [string, string, number, number][],
  };
  return { web, ga: T.ga, gsc: T.gsc, anuncios: { actualizado: hoy, diario: T.diario, mensual: T.mensual }, redes, google: true };
}

/* ── totales de un periodo, para la pantalla principal y para el detalle ── */
const entre = (x: string, a: string, b: string) => x >= a && x <= b;
export function totales(hoy: string, a: string, b: string) {
  const T = todo(hoy);
  const u = T.unidades.filter((x) => entre(x.d, a, b));
  const por = (c: Canal) => u.filter((x) => x.c === c).length;
  const sum = (f: Record<string, number>) => T.ds.filter((d) => entre(d, a, b)).reduce((s, d) => s + (f[d] ?? 0), 0);
  const adsFilas = T.diario.filter((f) => entre(f[0], a, b));
  const camp = new Map<string, { coste: number; clics: number; conv: number }>();
  for (const f of adsFilas) { const c = camp.get(f[2]) ?? { coste: 0, clics: 0, conv: 0 }; c.coste += f[3]; c.clics += f[4]; c.conv += f[6]; camp.set(f[2], c); }
  const campanas = [...camp.entries()].map(([nombre, v]) => ({ nombre, coste: Math.round(v.coste), clics: v.clics, conv: v.conv })).sort((x, y) => y.coste - x.coste);
  const gsc = T.gsc.filter((x) => entre(x.dia, a, b));
  const ses = T.ga.filter((x) => entre(x.dia, a, b)).reduce((s, x) => s + x.sesiones, 0);
  return {
    contactos: u.length, visitas: u.filter((x) => x.visita).length, presupuestos: u.filter((x) => x.pres).length, firmas: u.filter((x) => x.firm).length,
    importeFirmado: u.reduce((s, x) => s + x.importe, 0), descartados: u.filter((x) => x.desc).length, sinRespuesta: u.filter((x) => x.resp === null).length,
    canales: Object.fromEntries(CANALES.map((c) => [c, por(c)])) as Record<Canal, number>,
    whatsapp: sum(T.whatsapp), llamadas: sum(T.llamadas), calculos: sum(T.calculos), vistas: sum(T.vistas), sesiones: ses,
    gscClics: gsc.reduce((s, x) => s + x.clics, 0), gscImp: gsc.reduce((s, x) => s + x.impresiones, 0),
    inversion: Math.round(adsFilas.reduce((s, f) => s + f[3], 0)), adsConv: adsFilas.reduce((s, f) => s + f[6], 0), campanas,
  };
}
export function ventanasDe(hoy: string) {
  return { act: totales(hoy, suma(hoy, -28), suma(hoy, -1)), ant: totales(hoy, suma(hoy, -56), suma(hoy, -29)), fichaAct: fichaTot(hoy, suma(hoy, -28), suma(hoy, -3)), fichaAnt: fichaTot(hoy, suma(hoy, -58), suma(hoy, -31)) };
}
export function fichaTot(hoy: string, a: string, b: string) {
  const f = todo(hoy).ficha.filter((x) => entre(x[0], a, b));
  return [1, 2, 3, 4, 5].map((i) => f.reduce((s, x) => s + Number(x[i]), 0));
}

/* ── detalle de la vista completa ── */
export const PAGINAS = ["/", "/ventanas-pvc", "/ventanas-aluminio", "/cerramientos-terrazas", "/cancelas-puertas", "/configurador", "/alcala-de-henares", "/contacto", "/blog/pvc-o-aluminio", "/empresa", "/blog/cuanto-cuesta-cambiar-ventanas", "/guadalajara"];
const reparteFijo = (total: number, pesos: number[]): number[] => {
  const S = pesos.reduce((a, b) => a + b, 0), ideal = pesos.map((p) => (p / S) * total), o = ideal.map(Math.floor);
  let falta = total - o.reduce((a, b) => a + b, 0);
  ideal.map((x, i) => [x - Math.floor(x), i] as [number, number]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (falta > 0) { o[i]++; falta--; } });
  return o;
};
export function detalleDemo(desde: string, hasta: string, hoy: string) {
  const T = todo(hoy);
  const tot = totales(hoy, desde, hasta);
  const r = semilla(`d${desde}${hasta}`);
  const n = Math.max(1, dias(desde, hasta).length);
  const W = PAGINAS.map((_, i) => 0.62 ** i);
  const vp = reparteFijo(tot.vistas, W);
  const paginas = PAGINAS.map((p, i) => ({ pagina: p, n: vp[i], movil: Math.round(vp[i] * 0.66) }));
  const top8 = W.slice(0, 8);
  const wa = reparteFijo(tot.whatsapp, top8.map((w, i) => (i === 7 ? w * 4 : w))), ll = reparteFijo(tot.llamadas, top8.map((w, i) => (i === 7 ? w * 4 : w)));
  const clicsPagina = PAGINAS.slice(0, 8).flatMap((p, i) => [{ pagina: p, canal: "whatsapp", n: wa[i] }, { pagina: p, canal: "llamar", n: ll[i] }]);
  const lv = reparteFijo(Math.round(tot.sesiones * 0.17), top8);
  const lupa = PAGINAS.slice(0, 8).map((p, i) => ({ pagina: p, visitas: lv[i], movil: Math.round(lv[i] * 0.68), pc: lv[i] - Math.round(lv[i] * 0.68), scroll_mediano: Math.round(30 + 45 * r()), llegan_al_final_pct: Math.round(10 + 30 * r()), segundos_activos_mediana: Math.round(25 + 70 * r()), se_van_en_menos_de_10s_pct: Math.round(15 + 25 * r()), toques_sin_respuesta: [["foto de la ventana", Math.round(lv[i] * 0.03 + 2 * r())], ["botón de precio", Math.round(lv[i] * 0.015 + r())]] as [string, number][] }));
  const gscDias = T.gsc.filter((x) => entre(x.dia, desde, hasta));
  const pos = gscDias.reduce((s, x) => s + x.impresiones, 0) ? gscDias.reduce((s, x) => s + x.posicion * x.impresiones, 0) / gscDias.reduce((s, x) => s + x.impresiones, 0) : 0;
  const bq = ["ams cerramientos", "ventanas pvc alcalá de henares", "cerramiento terraza alcalá de henares", "precio ventanas pvc", "cancelas de aluminio", "cambiar ventanas ayudas comunidad de madrid", "ventanas aluminio corredera precio", "cuánto cuesta cerrar una terraza"];
  const qw = [0.9, 1.2, 0.8, 1.4, 0.5, 1.1, 0.9, 1.0].map((w, i) => w * 0.72 ** i * 3);
  const qi = reparteFijo(Math.round(tot.gscImp * 0.62), qw), qctr = [38, 4.2, 5.1, 1.4, 4.8, 1.2, 1.9, 1.6];
  const busquedas = bq.map((b, i) => { const cl = Math.round((qi[i] * qctr[i]) / 100); return { busqueda: b, clics: cl, impresiones: qi[i], ctr_pct: qi[i] ? Math.round((cl / qi[i]) * 1000) / 10 : 0, posicion: i === 0 ? 1.2 : Math.round((4 + 14 * r()) * 10) / 10 }; });
  const gp = reparteFijo(Math.round(tot.gscImp * 0.8), top8), gpc = reparteFijo(Math.round(tot.gscClics * 0.8), top8);
  const gscPag = PAGINAS.slice(0, 8).map((p, i) => ({ pagina: `https://www.amscerramientos.es${p === "/" ? "/" : p}`, clics: gpc[i], impresiones: gp[i], posicion: Math.round((5 + 12 * r()) * 10) / 10 }));
  const es = reparteFijo(tot.sesiones, PAGINAS.slice(0, 10).map((_, i) => 0.7 ** i));
  const entradas = PAGINAS.slice(0, 10).map((p, i) => ({ pagina: p, sesiones: es[i], interes_pct: Math.round(42 + 30 * r()), clave: Math.round(es[i] * (i === 5 || i === 7 ? 0.09 : 0.012)) }));
  const claveTot = T.ga.filter((x) => entre(x.dia, desde, hasta)).reduce((s, x) => s + x.clave, 0);
  const fr = (clave: string, ses: number, ip: number, ev: number) => ({ clave, sesiones: Math.round(ses), interes: Math.round(ses * ip), eventos: Math.round(ev), segundos: Math.round(ses * ip * (40 + 50 * r())) });
  const sd = reparteFijo(tot.sesiones, [0.66, 0.31, 0.03]), sz = reparteFijo(tot.sesiones, [0.74, 0.14, 0.06, 0.04, 0.02]), st = reparteFijo(tot.sesiones, [0.8, 0.2]);
  const cd = reparteFijo(claveTot, [0.7, 0.28, 0.02]), cz = reparteFijo(claveTot, [0.78, 0.18, 0.02, 0.01, 0.01]), ct = reparteFijo(claveTot, [0.7, 0.3]);
  const pw = [30, 14, 11, 9, 7, 8, 6, 5, 4, 3], pe = reparteFijo(Math.round(tot.sesiones * 0.8), pw);
  const rebote = {
    dispositivo: [fr("mobile", sd[0], 0.5 + 0.06 * r(), cd[0]), fr("desktop", sd[1], 0.6 + 0.06 * r(), cd[1]), fr("tablet", sd[2], 0.55, cd[2])],
    zona: [fr("Community of Madrid", sz[0], 0.58, cz[0]), fr("Castile-La Mancha", sz[1], 0.5, cz[1]), fr("Andalusia", sz[2], 0.35, cz[2]), fr("Catalonia", sz[3], 0.38, cz[3]), fr("Valencian Community", sz[4], 0.36, cz[4])],
    tipo: [fr("new", st[0], 0.5, ct[0]), fr("returning", st[1], 0.7, ct[1])],
    paginas: PAGINAS.slice(0, 10).map((p, i) => fr(p, pe[i], [0.55, 0.52, 0.5, 0.56, 0.45, 0.72, 0.5, 0.78, 0.3, 0.6][i], i === 5 || i === 7 ? pe[i] * 0.09 : pe[i] * 0.01)),
  };
  // CRM: sale de los mismos contactos de la serie diaria
  const u = T.unidades.filter((x) => entre(x.d, desde, hasta));
  const crm = CANALES.map((c) => {
    const l = u.filter((x) => x.c === c);
    const firmado = l.reduce((s, x) => s + x.importe, 0), resp = l.filter((x) => x.resp !== null);
    return { origen: c as string, leads: l.length, visitas: l.filter((x) => x.visita).length, presupuestos: l.filter((x) => x.pres).length, firmados: l.filter((x) => x.firm).length, firmado, facturado: Math.round((firmado * 0.6) / 10) * 10, descartados: l.filter((x) => x.desc).length, respondidos: resp.length, horas_resp: Math.round(resp.reduce((s, x) => s + (x.resp ?? 0), 0) * 10) / 10, vencidas: l.length - resp.length };
  }).filter((x) => x.leads > 0);
  // De dónde vienen (contador propio, sin cookies): reparte las páginas vistas por origen. Los clics de Google Ads salen de la serie de anuncios.
  const adsClics = T.diario.filter((f) => entre(f[0], desde, hasta) && f[1] === "google").reduce((s, f) => s + f[4], 0);
  const pvAds = Math.min(tot.vistas, Math.round(adsClics * 1.7));
  const resto = reparteFijo(Math.max(0, tot.vistas - pvAds), [0.36, 0.3, 0.2, 0.09, 0.05]);
  const ORIG: [string, number, number][] = [["Google (búsqueda)", resto[0], 0.62], ["Directo", resto[1], 0.55], ["Meta / Instagram", resto[2], 0.9], ["Asistentes de IA", resto[3], 0.48], ["Otras webs", resto[4], 0.5]];
  const base0: { origen: string; n: number; movil: number; clics?: number }[] = [{ origen: "Google Ads", n: pvAds, movil: Math.round(pvAds * 0.72), clics: adsClics }, ...ORIG.map(([o, v, m]) => ({ origen: o, n: v, movil: Math.round(v * m) }))].filter((x) => x.n > 0).sort((x, y) => y.n - x.n);
  // visitas y personas: los mismos totales que la serie diaria, repartidos como las páginas vistas (los anuncios traen visitas más cortas)
  const ds0 = dias(desde, hasta), totE = ds0.reduce((s0, d) => s0 + Math.round((T.vistas[d] ?? 0) / 2), 0), totU = ds0.reduce((s0, d) => s0 + Math.round((T.vistas[d] ?? 0) / 2.45), 0);
  const pesoV = base0.map((x) => x.n * (x.origen === "Google Ads" ? 1.25 : 1)), ve = reparteFijo(totE, pesoV), vu = reparteFijo(totU, pesoV);
  const origenes = base0.map((x, i) => ({ ...x, visitas: ve[i], personas: vu[i] }));
  void n;
  return { origenes, rebote, paginas, clicsPagina, lupa, gsc: { totales: { clics: tot.gscClics, impresiones: tot.gscImp, ctr_pct: tot.gscImp ? Math.round((tot.gscClics / tot.gscImp) * 1000) / 10 : 0, posicion: Math.round(pos * 10) / 10 }, busquedas, paginas: gscPag }, entradas, crm };
}
