"use client";
import type { Modulo, Reloj, Tarea, Resumen } from "@/lib/mesaTipos";
import { LUZ, TEMAS_RESUMEN, primeraFrase, frasesDe, fechaEnPalabras, type Luz } from "@/lib/mesaTextos";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Ludoteca } from "@/components/mesa/Suenos";
import type { CifrasBase } from "@/components/mesa/Suenos";
import { Plegable, Apartados, GuiaDeUso, LogoMarca, iconoDeTitulo, Que, QueTexto, EXPLICA, GLOSARIO, terminosEn, C as PALETA_ALEGRIA, Loseta, Icono, ICONO_AREA, ICONO_CIFRA, ICONO_BARRA, FranjaConectado, Despedida, MarcaTitulo, ICONO_MEDIDA, tinte, LogoCanal, LogoFila, useSaludo, elige, CHISPA_TODO_BIEN, CHISPA_HECHO, CHISPA_SIN_TAREAS, CHISPA_TODO_REVISADO } from "@/components/mesa/Alegria";

/* ── MESA DE CONTROL (26-oct, cl·v811) ──
   Todo se calcula aquí, en el navegador, a partir de las series diarias que manda el
   servidor: eliges el periodo (un día concreto, una semana, un mes, tres meses, un año o
   fechas a mano) y contra qué comparar (periodo anterior o el mismo del año pasado), y
   cada cifra, gráfico y tabla se recalcula al momento. Los rankings que no se pueden
   sumar día a día (páginas, búsquedas, mapas de calor) se piden a /api/mesa.
   Solo pintura en las animaciones (opacidad y color): nada se mueve. */

type DiaWeb = { peticiones: number; visitas: number; calculos: number; porCanal: Record<string, number>; whatsapp: number; llamadas: number; clicsPorFuente: Record<string, number>; vistas: number };
type FilaAds = [string, string, string, number, number, number, number];
type Ga = { dia: string; canal: string; sesiones: number; usuarios: number; interes: number; clave: number };
type GaTotal = { dia: string; sesiones: number; usuarios: number; interes: number; clave: number };
type Gsc = { dia: string; clics: number; impresiones: number; posicion: number };
export type DatosMesa = {
  hoy: string;
  web: Record<string, DiaWeb>;
  ga: Ga[];
  gaTotal?: GaTotal[]; // totales sin canal (cl·v838): los de verdad; las filas por canal solo sirven para el reparto
  gsc: Gsc[];
  anuncios: { actualizado: string; diario: FilaAds[]; mensual: FilaAds[] };
  redes?: Redes | null;
  google: boolean;
  fallos?: string[]; // fuentes que no se han podido leer en esta carga (cl·v904): "web", "analytics", "search console"
  clave: string;
};
type Redes = {
  actualizado: string;
  ficha: { diario: [string, number, number, number, number, number][] };
  instagram: { usuario?: string; seguidores: number; publicaciones: number; diario: [string, number, number, number | null][] };
  resenas: { fuente: string; nota: number; escala: number; total: number; fecha: string; auto: boolean }[];
  historial_resenas: [string, string, number, number][];
};
type FilaClarity = { clave: string; sesiones: number; rabia_pct: number | null; muertos_pct: number | null; vuelven_pct: number | null; vaiven_pct: number | null; scroll: number | null; activo: number | null };
type FilaRebote = { clave: string; sesiones: number; interes: number; eventos: number; segundos: number };
type Detalle = {
  paginas: { pagina: string; n: number; movil: number }[];
  clicsPagina: { pagina: string; canal: string; n: number }[];
  lupa: { pagina: string; visitas: number; movil: number; pc: number; scroll_mediano: number; llegan_al_final_pct: number; segundos_activos_mediana: number; se_van_en_menos_de_10s_pct: number; toques_sin_respuesta: [string, number][] }[];
  gsc: { totales: { clics: number; impresiones: number; ctr_pct: number; posicion: number } | null; busquedas: { busqueda: string; clics: number; impresiones: number; ctr_pct: number; posicion: number }[]; paginas: { pagina: string; clics: number; impresiones: number; posicion: number }[] } | null;
  entradas: { pagina: string; sesiones: number; interes_pct: number; clave: number }[];
  clarity?: { dias: number; desde: string | null; paginas: FilaClarity[]; dispositivos: FilaClarity[] } | null;
  rebote?: { dispositivo: FilaRebote[]; zona: FilaRebote[]; tipo: FilaRebote[]; paginas: FilaRebote[] } | null;
  personas?: number | null;
  crm: { origen: string; leads: number; visitas: number; presupuestos: number; firmados: number; firmado: number; facturado: number; descartados: number; respondidos?: number; horas_resp?: number; vencidas?: number }[];
};

/* ── utilidades de fechas (todo en texto AAAA-MM-DD, sin husos) ── */
const aD = (s: string) => new Date(`${s}T12:00:00Z`);
const aS = (d: Date) => d.toISOString().slice(0, 10);
const suma = (s: string, n: number) => { const d = aD(s); d.setUTCDate(d.getUTCDate() + n); return aS(d); };
const entre = (a: string, b: string) => Math.round((aD(b).getTime() - aD(a).getTime()) / 86400000) + 1;
const listaDias = (a: string, b: string) => { const o: string[] = []; for (let d = a; d <= b; d = suma(d, 1)) o.push(d); return o; };
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_L = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS_S = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const fechaCorta = (s: string) => `${Number(s.slice(8))} ${MESES[Number(s.slice(5, 7)) - 1]}`;
const fechaLarga = (s: string) => `${DIAS_S[aD(s).getUTCDay()]} ${Number(s.slice(8))} de ${MESES_L[Number(s.slice(5, 7)) - 1]}${s.slice(0, 4) !== new Date().getFullYear().toString() ? ` de ${s.slice(0, 4)}` : ""}`;
const textoRango = (a: string, b: string) => (a === b ? fechaLarga(a) : `${fechaCorta(a)}${a.slice(0, 4) !== b.slice(0, 4) ? ` ${a.slice(0, 4)}` : ""} – ${fechaCorta(b)} ${b.slice(0, 4)}`);
const finDeMes = (ym: string) => aS(new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), 0, 12)));

/** Desplazamiento suave, salvo que el móvil tenga activado "Reducir movimiento". */
const suave = (): ScrollBehavior => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"; } catch { return "smooth"; } };

/* ── números ── */
const nf = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0, useGrouping: "always" } as Intl.NumberFormatOptions);
const nf1 = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1, useGrouping: "always" } as Intl.NumberFormatOptions);
const num = (n: number) => nf.format(Math.round(n));
const eur = (n: number) => `${nf.format(Math.round(n))} €`;
const eur2 = (n: number) => `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(n)} €`;
const pct = (n: number) => `${nf1.format(n)} %`;
const delta = (a: number, b: number) => (b > 0 ? ((a - b) / b) * 100 : a > 0 ? null : 0);

const COLOR = { teal: "#2C7C98", ink: "#1a3d47", ambar: "#b8924a", rosa: "#b5646e", salvia: "#5f8458", pizarra: "#4b6c8f", terracota: "#b5643f", linea: "#e9e2d4" };
const PLATAFORMA: Record<string, { nombre: string; color: string }> = {
  google: { nombre: "Google Ads", color: COLOR.teal },
  meta: { nombre: "Meta (Facebook e Instagram)", color: COLOR.rosa },
  chatgpt: { nombre: "ChatGPT Ads", color: COLOR.salvia },
};
const PALETA = [COLOR.teal, COLOR.rosa, COLOR.ambar, COLOR.salvia, COLOR.pizarra, COLOR.terracota, "#8a96a3", "#7a5c99"];
const CANALES_PAGO: Record<string, string> = { "Google Ads": "google", "Meta / Instagram": "meta", "ChatGPT Ads": "chatgpt" };

/* ── agregados de un periodo ── */
type Totales = {
  dias: number;
  peticiones: number; visitas: number; calculos: number; whatsapp: number; llamadas: number; vistas: number;
  porCanal: Record<string, number>; clicsPorFuente: Record<string, number>;
  ads: { coste: number; clics: number; impr: number; conv: number; porPlat: Record<string, { coste: number; clics: number; impr: number; conv: number }>; porCamp: Record<string, { plat: string; coste: number; clics: number; impr: number; conv: number }>; parcial: boolean };
  ga: { sesiones: number; usuarios: number; interes: number; clave: number; porCanal: Record<string, { sesiones: number; interes: number; clave: number }> };
  gsc: { clics: number; impresiones: number; posicion: number };
};

function calcula(d: DatosMesa, a: string, b: string, recGsc = 0): Totales {
  const t: Totales = {
    dias: entre(a, b), peticiones: 0, visitas: 0, calculos: 0, whatsapp: 0, llamadas: 0, vistas: 0, porCanal: {}, clicsPorFuente: {},
    ads: { coste: 0, clics: 0, impr: 0, conv: 0, porPlat: {}, porCamp: {}, parcial: false },
    ga: { sesiones: 0, usuarios: 0, interes: 0, clave: 0, porCanal: {} },
    gsc: { clics: 0, impresiones: 0, posicion: 0 },
  };
  for (const dia of listaDias(a, b)) {
    const w = d.web[dia];
    if (!w) continue;
    t.peticiones += w.peticiones; t.visitas += w.visitas; t.calculos += w.calculos; t.whatsapp += w.whatsapp; t.llamadas += w.llamadas; t.vistas += w.vistas;
    for (const [k, v] of Object.entries(w.porCanal)) t.porCanal[k] = (t.porCanal[k] ?? 0) + v;
    for (const [k, v] of Object.entries(w.clicsPorFuente)) t.clicsPorFuente[k] = (t.clicsPorFuente[k] ?? 0) + v;
  }
  const mete = (r: FilaAds) => {
    const [, plat, camp, coste, clics, impr, conv] = r;
    t.ads.coste += coste; t.ads.clics += clics; t.ads.impr += impr; t.ads.conv += conv;
    const p = (t.ads.porPlat[plat] ??= { coste: 0, clics: 0, impr: 0, conv: 0 });
    p.coste += coste; p.clics += clics; p.impr += impr; p.conv += conv;
    const c = (t.ads.porCamp[`${plat}|${camp}`] ??= { plat, coste: 0, clics: 0, impr: 0, conv: 0 });
    c.coste += coste; c.clics += clics; c.impr += impr; c.conv += conv;
  };
  const inicioDiario = d.anuncios.diario[0]?.[0] ?? "9999";
  for (const r of d.anuncios.diario) if (r[0] >= a && r[0] <= b) mete(r);
  if (a < inicioDiario) {
    // Antes del diario solo hay meses: cuentan los meses enteros que caen dentro del periodo.
    for (const r of d.anuncios.mensual) {
      const ini = `${r[0]}-01`;
      const fin = r[0] === inicioDiario.slice(0, 7) ? suma(inicioDiario, -1) : finDeMes(r[0]);
      if (ini >= a && fin <= b) mete(r);
      else if (ini <= b && fin >= a) t.ads.parcial = true;
    }
  }
  // Totales: de la serie sin canal si existe (sumar canales infla visitas y personas, cl·v838).
  const conTotal = !!d.gaTotal?.length;
  for (const g of d.gaTotal ?? []) {
    if (g.dia < a || g.dia > b) continue;
    t.ga.sesiones += g.sesiones; t.ga.usuarios += g.usuarios; t.ga.interes += g.interes; t.ga.clave += g.clave;
  }
  for (const g of d.ga) {
    if (g.dia < a || g.dia > b) continue;
    if (!conTotal) { t.ga.sesiones += g.sesiones; t.ga.usuarios += g.usuarios; t.ga.interes += g.interes; t.ga.clave += g.clave; }
    const c = (t.ga.porCanal[g.canal] ??= { sesiones: 0, interes: 0, clave: 0 });
    c.sesiones += g.sesiones; c.interes += g.interes; c.clave += g.clave;
  }
  let pond = 0;
  const finGsc = recGsc > 0 ? suma(b, -recGsc) : b; // Search Console va por detrás: no se cuentan los días aún sin datos
  for (const g of d.gsc) {
    if (g.dia < a || g.dia > finGsc) continue;
    t.gsc.clics += g.clics; t.gsc.impresiones += g.impresiones; pond += g.posicion * g.impresiones;
  }
  t.gsc.posicion = t.gsc.impresiones ? pond / t.gsc.impresiones : 0;
  return t;
}

const peticionesPago = (t: Totales) => Object.entries(t.porCanal).filter(([k]) => CANALES_PAGO[k]).reduce((s, [, v]) => s + v, 0);

/* ── métricas para el gráfico ── */
type Metrica = { id: string; nombre: string; f: (t: Totales) => number; formato: (n: number) => string; menosEsMejor?: boolean; fuente: string; ayuda: string };
const METRICAS: Metrica[] = [
  { id: "peticiones", nombre: "Peticiones", f: (t) => t.peticiones, formato: num, fuente: "Web", ayuda: "Personas que nos han dejado sus datos en la web." },
  { id: "visitas", nombre: "Piden visita", f: (t) => t.visitas, formato: num, fuente: "Web", ayuda: "De ellas, las que piden la visita técnica gratis." },
  { id: "pulsaciones", nombre: "WhatsApp y llamar", f: (t) => t.whatsapp + t.llamadas, formato: num, fuente: "Web", ayuda: "Veces que pulsan el botón de WhatsApp o de llamar." },
  { id: "inversion", nombre: "Inversión en anuncios", f: (t) => t.ads.coste, formato: eur, fuente: "Supermetrics", ayuda: "Lo gastado en anuncios de Google." },
  // Coste por contacto según las propias plataformas: hoy casi todo el anuncio aterriza en la landing de la agencia,
  // así que la web solo ve una parte de esas peticiones. Cuando los anuncios lleven a la web, se mira también el de la web.
  { id: "cpl", nombre: "Coste por contacto de anuncios", f: (t) => (t.ads.conv ? t.ads.coste / t.ads.conv : NaN), formato: eur, menosEsMejor: true, fuente: "Anuncios · contactos que cuenta cada plataforma", ayuda: "Lo que nos cuesta cada contacto que traen los anuncios. Cuanto más bajo, mejor." },
  { id: "sesiones", nombre: "Visitas a la web", f: (t) => t.ga.sesiones, formato: num, fuente: "Analytics", ayuda: "Veces que alguien entra en la web (Analytics)." },
  { id: "organico", nombre: "Clics desde Google", f: (t) => t.gsc.clics, formato: num, fuente: "Search Console", ayuda: "Entran desde Google sin anuncio (lo que no se paga)." },
  { id: "rebote", nombre: "Rebote", f: (t) => (t.ga.sesiones ? (1 - t.ga.interes / t.ga.sesiones) * 100 : NaN), formato: (n) => `${nf1.format(n)} %`, menosEsMejor: true, fuente: "Analytics · sesiones sin interacción", ayuda: "De cada 100 visitas, cuántas se van sin hacer nada (menos de 10 segundos, una sola página y ninguna acción). Cuanto más bajo, mejor." },
  { id: "conversion", nombre: "Visitas que acaban en contacto", f: (t) => (t.ga.sesiones ? (t.peticiones / t.ga.sesiones) * 100 : NaN), formato: (n) => `${nf1.format(n)} %`, fuente: "Web y Analytics", ayuda: "De cada 100 visitas a la web, cuántas acaban dejando sus datos." },
  { id: "calculos", nombre: "Configurador", f: (t) => t.calculos, formato: num, fuente: "Web", ayuda: "Veces que alguien ha usado el configurador de ventanas para ver su presupuesto orientativo." },
];

/* ── piezas visuales ── */
function Delta({ a, b, menosEsMejor = false, compacta = false, antes }: { a: number; b: number; menosEsMejor?: boolean; compacta?: boolean; antes?: string }) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null; // un día sin visitas o sin contactos no tiene rebote ni coste: no se compara
  const v = delta(a, b);
  if (antes !== undefined) return <span className="inline-flex flex-wrap items-center gap-1.5"><Delta a={a} b={b} menosEsMejor={menosEsMejor} compacta={compacta} /><span className="text-[12.5px] text-ink/55">antes: {antes}</span></span>;
  if (v === null) return <span className="rounded-full bg-cream px-2 py-0.5 text-[12px] font-semibold text-ink/50">sin datos antes</span>;
  if (Math.abs(v) < 0.5) return <span className="rounded-full bg-cream px-2 py-0.5 text-[12px] font-bold text-ink/50">{compacta ? "=" : "= igual"}</span>;
  const bueno = menosEsMejor ? v < 0 : v > 0;
  return (
    <span className={`rounded-full px-2 py-0.5 text-[12px] font-bold ${bueno ? "bg-[#ebf1e8] text-[#4d7047]" : "bg-[#f8e8ea] text-[#a3505a]"}`}>
      {v > 0 ? "▲" : "▼"} {nf.format(Math.abs(v))} %{compacta ? "" : bueno ? " · mejor" : " · peor"}
    </span>
  );
}

function Mini({ serie: serie0, color }: { serie: number[]; color: string }) {
  const serie = serie0.map((v) => (Number.isFinite(v) ? v : 0));
  if (serie.length < 2) return null;
  const max = Math.max(...serie, 1);
  const w = 120, h = 32;
  const p = serie.map((v, i) => `${(i / (serie.length - 1)) * w},${h - 3 - (v / max) * (h - 6)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={`0,${h} ${p} ${w},${h}`} fill={color} opacity={0.1} />
      <polyline points={p} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

type Punto = { etq: string; etqLarga: string; v: number; c?: number; etqC?: string };
function Grafico({ puntos, formato, color = COLOR.teal, alto = 230, barras = false, menosEsMejor = false }: { puntos: Punto[]; formato: (n: number) => string; color?: string; alto?: number; barras?: boolean; menosEsMejor?: boolean }) {
  const [sel, setSel] = useState<number | null>(null);
  // En el móvil el dibujo es más estrecho para que las letras se lean
  const [estrecho, setEstrecho] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 640px)");
    const f = () => setEstrecho(m.matches);
    f();
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  const w = estrecho ? 380 : 760, h = estrecho ? Math.round(alto * 0.85) : alto, izq = 8, abajo = 26, arriba = 30;
  const fmt = (v: number) => (Number.isFinite(v) ? formato(v) : "sin dato");
  const ok = (v: number | undefined): v is number => v !== undefined && Number.isFinite(v);
  const hayC = puntos.some((p) => ok(p.c));
  const max = Math.max(1, ...puntos.map((p) => Math.max(ok(p.v) ? p.v : 0, ok(p.c) ? p.c : 0)));
  const n = puntos.length;
  const paso = (w - izq * 2) / Math.max(1, n);
  const x = (i: number) => izq + paso * i + paso / 2;
  const y = (v: number) => arriba + (h - abajo - arriba) * (1 - v / max);
  const linea = (k: "v" | "c") => puntos.map((p, i) => (ok(p[k]) ? `${x(i)},${y(p[k] as number)}` : null)).filter(Boolean).join(" ");
  const cada = Math.max(1, Math.ceil(n / (estrecho ? 4 : 8)));
  const usaBarras = barras || n <= 14;
  const s = sel ?? n - 1;
  /* cl·v927: alegría en la gráfica: mejor y peor punto marcados, números encima y casillas de color debajo */
  const validos = puntos.map((p, i) => ({ i, v: p.v })).filter((q) => ok(q.v));
  const mejor = validos.length ? validos.reduce((a, q) => (menosEsMejor ? q.v < a.v : q.v > a.v) ? q : a) : null;
  const peor = validos.length > 1 ? validos.reduce((a, q) => (menosEsMejor ? q.v > a.v : q.v < a.v) ? q : a) : null;
  const media = validos.length ? validos.reduce((a, q) => a + q.v, 0) / validos.length : 0;
  const etiquetaCada = Math.max(1, Math.ceil(n / (estrecho ? 7 : 16)));
  if (!n) return <p className="rounded-[12px] bg-cream px-3 py-3 text-[14px] text-ink/60">Todavía no hay datos para estas fechas.</p>;
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Gráfico" onMouseLeave={() => setSel(null)}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={izq} x2={w - izq} y1={y(max * f)} y2={y(max * f)} stroke={COLOR.linea} strokeDasharray="3 4" />
            <text x={w - izq} y={y(max * f) - 3} fontSize={12} fill="#6a7786" textAnchor="end">{fmt(max * f)}</text>
          </g>
        ))}
        <line x1={izq} x2={w - izq} y1={h - abajo} y2={h - abajo} stroke="#d9d2c4" />
        {usaBarras ? (
          puntos.map((p, i) => {
            const bw = Math.max(3, paso * (hayC ? 0.36 : 0.62));
            return (
              <g key={i}>
                {hayC && ok(p.c) && <rect x={x(i) - bw - 1} y={y(p.c)} width={bw} height={h - abajo - y(p.c)} rx={3} fill={COLOR.ambar} opacity={sel === null || sel === i ? 0.45 : 0.2} />}
                {ok(p.v) && <rect x={hayC ? x(i) + 1 : x(i) - bw / 2} y={y(p.v)} width={bw} height={h - abajo - y(p.v)} rx={3} fill={color} opacity={sel === null || sel === i ? 0.95 : 0.35} />}
              </g>
            );
          })
        ) : (
          <>
            {hayC && <polyline points={linea("c")} fill="none" stroke={COLOR.ambar} strokeWidth={2} strokeDasharray="5 5" strokeLinejoin="round" />}
            <polygon points={`${x(0)},${h - abajo} ${linea("v")} ${x(n - 1)},${h - abajo}`} fill={color} opacity={0.1} />
            <polyline points={linea("v")} fill="none" stroke={color} strokeWidth={2.6} strokeLinejoin="round" />
            {puntos.map((p, i) => ok(p.v) ? <circle key={i} cx={x(i)} cy={y(p.v)} r={sel === i ? 6 : 3.5} fill={color} stroke="#fff" strokeWidth={1.5} /> : null)}
            {puntos.map((p, i) => ok(p.v) && p.v > 0 && (i % etiquetaCada === 0 || i === n - 1 || i === mejor?.i) ? <text key={"t" + i} x={x(i)} y={y(p.v) - 9} fontSize={11.5} fontWeight={700} fill={color} textAnchor="middle">{fmt(p.v)}</text> : null)}
          </>
        )}
        {mejor && <g><circle cx={x(mejor.i)} cy={y(mejor.v)} r={11} fill="#FFDE00" stroke={COLOR.ink} strokeWidth={1.5} /><text x={x(mejor.i)} y={y(mejor.v) + 4} fontSize={12} textAnchor="middle" fill={COLOR.ink}>★</text></g>}
        {peor && peor.i !== mejor?.i && <circle cx={x(peor.i)} cy={y(peor.v)} r={8} fill="none" stroke="#a3505a" strokeWidth={2.5} />}
        {sel !== null && <line x1={x(sel)} x2={x(sel)} y1={arriba} y2={h - abajo} stroke={COLOR.ink} strokeOpacity={0.18} />}
        {puntos.map((p, i) =>
          i % cada === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={h - 8} fontSize={12} fill="#6a7786" textAnchor="middle">{p.etq}</text>
          ) : null
        )}
        {puntos.map((_, i) => (
          <rect key={i} x={izq + paso * i} y={0} width={paso} height={h} fill="transparent" onMouseEnter={() => setSel(i)} onClick={() => setSel(i)} />
        ))}
      </svg>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 rounded-[12px] bg-cream px-3 py-2 text-[13.5px] text-ink/80">
        <span>
          <b className="text-ink">{puntos[s]?.etqLarga}</b>: <b style={{ color }}>{fmt(puntos[s]?.v ?? NaN)}</b>
          {hayC && puntos[s]?.c !== undefined ? <> · antes ({puntos[s]?.etqC}): <b className="text-[#8c6d33]">{fmt(puntos[s].c ?? NaN)}</b></> : null}
        </span>
        <span className="text-[12px] text-ink/50">{sel === null ? "Pasa el ratón o toca un punto" : ""}</span>
      </div>
      {validos.length > 1 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button type="button" onClick={() => setSel(mejor!.i)} className="rounded-[14px] px-3 py-2 text-left text-white" style={{ background: "#2f9a62" }}><span className="block text-[11px] font-bold uppercase tracking-wide opacity-85">★ Mejor</span><span className="block font-serif text-[20px] italic leading-tight">{fmt(mejor!.v)}</span><span className="block truncate text-[12px] opacity-85">{puntos[mejor!.i].etq}</span></button>
          <div className="rounded-[14px] px-3 py-2 text-white" style={{ background: color }}><span className="block text-[11px] font-bold uppercase tracking-wide opacity-85">Media</span><span className="block font-serif text-[20px] italic leading-tight">{media < 100 && media % 1 !== 0 ? nf1.format(media) : fmt(media)}</span><span className="block truncate text-[12px] opacity-85">por {puntos.length >= 20 ? "día" : "tramo"}</span></div>
          {peor && peor.i !== mejor?.i && <button type="button" onClick={() => setSel(peor.i)} className="rounded-[14px] px-3 py-2 text-left text-white" style={{ background: "#a3505a" }}><span className="block text-[11px] font-bold uppercase tracking-wide opacity-85">Peor</span><span className="block font-serif text-[20px] italic leading-tight">{fmt(peor.v)}</span><span className="block truncate text-[12px] opacity-85">{puntos[peor.i].etq}</span></button>}
        </div>
      )}
    </div>
  );
}

function Rosco({ datos, centro, sub }: { datos: [string, number, string][]; centro: string; sub: string }) {
  const total = datos.reduce((a, [, v]) => a + v, 0) || 1;
  let acum = 0;
  const r = 54, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 150 150" className="h-40 w-40 shrink-0" role="img" aria-label={sub}>
      <circle cx={75} cy={75} r={r} fill="none" stroke="#f1ece2" strokeWidth={22} />
      {datos.map(([n, v, col]) => {
        const l = (v / total) * c;
        const el = <circle key={n} cx={75} cy={75} r={r} fill="none" stroke={col} strokeWidth={22} strokeDasharray={`${l} ${c - l}`} strokeDashoffset={-acum} transform="rotate(-90 75 75)" />;
        acum += l;
        return el;
      })}
      <text x={75} y={74} textAnchor="middle" fontSize={26} fontWeight={700} fill={COLOR.ink} fontFamily="var(--font-lora), Georgia, serif">{centro}</text>
      <text x={75} y={93} textAnchor="middle" fontSize={11} fill="#6a7786">{sub}</text>
    </svg>
  );
}

function Barras({ filas, formato = num, compara }: { filas: [string, number, string?][]; formato?: (n: number) => string; compara?: Record<string, number> }) {
  const max = Math.max(1, ...filas.map(([, v]) => v));
  if (!filas.length) return <p className="text-[14px] text-ink/50">Sin datos en este periodo.</p>;
  return (
    <ul className="space-y-2.5">
      {filas.map(([k, v, col], i) => (
        <li key={k}>
          <div className="flex items-center justify-between gap-3 text-[14px]">
            <span className="flex min-w-0 items-center truncate font-semibold text-ink"><LogoCanal canal={k} />{k}</span>
            <span className="flex shrink-0 items-center gap-2 font-semibold text-ink">
              {formato(v)}
              {compara ? <Delta a={v} b={compara[k] ?? 0} /> : null}
            </span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[#f1ece2]">
            <div className="h-full rounded-full" style={{ width: `${(v / max) * 100}%`, background: col ?? PALETA[i % PALETA.length] }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Caja({ titulo, fuente, children, className = "", accion, plegada, explica }: { titulo: string; fuente?: string; children: React.ReactNode; className?: string; accion?: React.ReactNode; plegada?: string; explica?: string }) {
  const [que, setQue] = useState(false); // cl·v931: "?" junto al título
  const [queFuente, setQueFuente] = useState(false); // cl·v932: "?" junto a la fuente si lleva jerga
  const texto = explica ?? EXPLICA[titulo];
  /* cl·v930: `plegada="pista"` convierte la caja en una línea cerrada con su icono (el de iconoDeTitulo) y esa pista; se abre con + */
  if (plegada !== undefined) {
    const ic = iconoDeTitulo(titulo);
    return (
      <Plegable id={"caja-" + titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-")} icono={ic?.n ?? "documento"} color={ic?.color ?? COLOR.ink} titulo={titulo} pista={plegada || fuente}>
        <div className="pt-2">{texto && <QueTexto texto={texto} />}{accion && <div className="mb-3 mt-2">{accion}</div>}{children}</div>
      </Plegable>
    );
  }
  return (
    <section className={`min-w-0 rounded-[22px] border border-line bg-white p-5 shadow-[0_22px_50px_-42px_rgba(17,52,61,0.55)] sm:p-6 ${className}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <MarcaTitulo titulo={titulo} tam={40} />
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 font-serif text-[21px] font-medium italic leading-tight text-ink">{titulo}{texto && <Que texto={texto} etiqueta={titulo} abierto={que} onToggle={() => setQue(!que)} />}</h2>
            {fuente ? <p className="mt-0.5 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/40">{fuente}{terminosEn(fuente).length > 0 && <Que texto="" etiqueta={`la fuente ${fuente}`} abierto={queFuente} onToggle={() => setQueFuente(!queFuente)} tam={20} />}</p> : null}
          </div>
        </div>
        {accion}
      </div>
      {que && texto && <div className="mb-3"><QueTexto texto={texto} /></div>}
      {queFuente && fuente && <div className="mb-3">{terminosEn(fuente).map((k) => <QueTexto key={k} texto={`${k}: ${GLOSARIO[k]}`} />)}</div>}
      {children}
    </section>
  );
}

type Col<T> = { k: string; t: string; v: (r: T) => number | string; f?: (r: T) => React.ReactNode; num?: boolean; ayuda?: string };
function Tabla<T>({ filas, cols, inicial, vacio = "Sin datos en este periodo.", color = COLOR.teal }: { filas: T[]; cols: Col<T>[]; inicial: string; vacio?: string; color?: string }) {
  const [orden, setOrden] = useState(inicial);
  const [asc, setAsc] = useState(false);
  const [que, setQue] = useState<string | null>(null); // cl·v931: "?" en cada columna
  const col = cols.find((c) => c.k === orden) ?? cols[0];
  /* cl·v929: la columna por la que ordenas lleva una barra proporcional, y la primera fila una estrella */
  const maxCol = col.num ? Math.max(1, ...filas.map((r) => Number(col.v(r)) || 0)) : 0;
  const ordenadas = [...filas].sort((a, b) => {
    const x = col.v(a), y = col.v(b);
    const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
    return asc ? r : -r;
  });
  if (!filas.length) return <p className="text-[14px] text-ink/50">{vacio}</p>;
  return (
    <div className="-mx-2 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-[14px]">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c.k} className={`border-b border-line px-2 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-ink/55 ${c.num ? "text-right" : "text-left"}`}>
                <button type="button" onClick={() => (orden === c.k ? setAsc(!asc) : (setOrden(c.k), setAsc(false)))} className={`inline-flex min-h-[44px] items-center gap-1 hover:text-ink ${orden === c.k ? "text-ink" : ""}`}>
                  {c.t}
                  {orden === c.k ? <span aria-hidden="true">{asc ? "▲" : "▼"}</span> : null}
                </button>
                {(c.ayuda ?? EXPLICA[c.t]) && <span className="ml-1 inline-block align-middle"><Que texto={c.ayuda ?? EXPLICA[c.t]} etiqueta={c.t} abierto={que === c.k} onToggle={() => setQue(que === c.k ? null : c.k)} tam={22} /></span>}
              </th>
            ))}
          </tr>
          {que && <tr><td colSpan={cols.length} className="px-2 pb-2"><QueTexto texto={`${cols.find((c) => c.k === que)?.t}: ${cols.find((c) => c.k === que)?.ayuda ?? EXPLICA[cols.find((c) => c.k === que)?.t ?? ""]}`} /></td></tr>}
        </thead>
        <tbody>
          {ordenadas.map((r, i) => (
            <tr key={i} className="hover:bg-cream/70">
              {cols.map((c, ci) => (
                <td key={c.k} className={`border-b border-line/60 px-2 py-2.5 ${c.num ? "text-right tabular-nums" : ""}`}>
                  {ci === 0 && i === 0 && !asc ? <span aria-hidden="true" className="mr-1.5 inline-grid h-5 w-5 place-items-center rounded-full bg-yellow text-[11px] text-ink">★</span> : null}
                  {c.f ? c.f(r) : c.num ? num(Number(c.v(r))) : String(c.v(r))}
                  {c.k === col.k && c.num && maxCol > 0 ? <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-[#f1ece2]"><span className="block h-full rounded-full" style={{ width: `${Math.max(2, ((Number(c.v(r)) || 0) / maxCol) * 100)}%`, background: color }} /></span> : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── periodos ── */
type Preset = "hoy" | "ayer" | "7" | "28" | "90" | "mes" | "mespasado" | "365" | "dia" | "libre";
const PRESETS: [Preset, string][] = [["hoy", "Hoy"], ["ayer", "Ayer"], ["7", "7 días"], ["28", "28 días"], ["90", "3 meses"], ["mes", "Este mes"], ["mespasado", "Mes pasado"], ["365", "12 meses"]];
function rangoDe(p: Preset, hoy: string): [string, string] {
  const ayer = suma(hoy, -1);
  switch (p) {
    case "hoy": return [hoy, hoy];
    case "ayer": return [ayer, ayer];
    case "7": return [suma(ayer, -6), ayer];
    case "28": return [suma(ayer, -27), ayer];
    case "90": return [suma(ayer, -89), ayer];
    case "mes": return [`${hoy.slice(0, 7)}-01`, hoy];
    case "mespasado": { const fin = suma(`${hoy.slice(0, 7)}-01`, -1); return [`${fin.slice(0, 7)}-01`, fin]; }
    case "365": return [suma(ayer, -364), ayer];
    default: return [suma(ayer, -27), ayer];
  }
}
type Compara = "anterior" | "anio" | "no";

type Pestana = "resumen" | "ventas" | "anuncios" | "web" | "google" | "redes";
const ICONO_PESTANA: Record<Pestana, [string, string]> = { resumen: ["estrella", "#c79a00"], ventas: ["persona", "#2f6fd0"], anuncios: ["megafono", "#d93f3f"], web: ["globo", "#2a6f86"], google: ["lupa", "#1d6b3a"], redes: ["chat", "#d9822b"] };
const PESTANAS: [Pestana, string][] = [["resumen", "Resumen"], ["ventas", "Ventas (CRM)"], ["anuncios", "Anuncios"], ["web", "La web"], ["google", "Google sin pagar"], ["redes", "Ficha de Google y redes"]];

export default function Mesa({ datos, temas, resumenHoy, tareas, relojes, base }: { datos: DatosMesa; temas?: Modulo[]; resumenHoy?: Resumen; tareas?: Tarea[]; relojes?: Reloj[]; base?: CifrasBase }) {
  /* Vista sencilla o completa (27-oct, cl·v890; Ig: "que lo entienda quien no sabe nada"). Se recuerda en este navegador. */
  const [vista, setVista] = useState<"sencilla" | "completa">("sencilla");
  const [guia, setGuia] = useState(false);
  useEffect(() => {
    try {
      const v = localStorage.getItem("rd-mesa-vista");
      if (v === "completa" || v === "sencilla") setVista(v);
      if (!localStorage.getItem("rd-mesa-guia-vista")) setGuia(true);
    } catch {}
  }, [datos.clave]);
  const cambiaVista = (v: "sencilla" | "completa") => { setVista(v); try { localStorage.setItem("rd-mesa-vista", v); } catch {} };
  const cierraGuia = () => { setGuia(false); try { localStorage.setItem("rd-mesa-guia-vista", "1"); } catch {} };
  const sencillaPosible = !!temas?.length;
  const [preset, setPreset] = useState<Preset>("28");
  const [rango, setRango] = useState<[string, string]>(() => rangoDe("28", datos.hoy));
  const [compara, setCompara] = useState<Compara>("anterior");
  const [pestana, setPestana] = useState<Pestana>("resumen");
  const [metrica, setMetrica] = useState("peticiones");
  const [detalle, setDetalle] = useState<Detalle | null>(null);
  const [cargando, setCargando] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState(false);
  const [intento, setIntento] = useState(0);

  const [a, b] = rango;
  const largo = entre(a, b);
  const [ca, cb] = useMemo<[string, string]>(() => {
    if (compara === "anio") return [suma(a, -364), suma(b, -364)]; // mismo día de la semana, un año antes
    return [suma(a, -largo), suma(a, -1)];
  }, [a, b, largo, compara]);

  // Search Console va 2-3 días por detrás: se corta en su último día con datos (y la comparación, igual)
  const ultGsc = useMemo(() => datos.gsc.reduce((m, g) => (g.impresiones > 0 && g.dia > m ? g.dia : m), ""), [datos.gsc]);
  const recGsc = ultGsc && b > ultGsc ? Math.min(largo - 1, entre(ultGsc, b) - 1) : 0;
  const T = useMemo(() => calcula(datos, a, b, recGsc), [datos, a, b, recGsc]);
  const C = useMemo(() => (compara === "no" ? null : calcula(datos, ca, cb, recGsc)), [datos, ca, cb, compara, recGsc]);

  // Agrupación del gráfico: por día hasta 45 días; por semana hasta 200; si no, por mes.
  const [agrupa, setAgrupa] = useState<"auto" | "dia" | "semana" | "mes">("auto");
  const grupo = agrupa !== "auto" ? agrupa : largo <= 45 ? "dia" : largo <= 200 ? "semana" : "mes";
  const tramos = useMemo(() => {
    const dias = listaDias(a, b);
    const out: [string, string][] = [];
    if (grupo === "dia") dias.forEach((d) => out.push([d, d]));
    else if (grupo === "semana") for (let i = 0; i < dias.length; i += 7) out.push([dias[i], dias[Math.min(i + 6, dias.length - 1)]]);
    else {
      let ini = a;
      while (ini <= b) {
        const fin = finDeMes(ini.slice(0, 7));
        out.push([ini, fin < b ? fin : b]);
        ini = suma(fin, 1);
      }
    }
    return out;
  }, [a, b, grupo]);

  const serieDe = (m: Metrica): Punto[] =>
    tramos.filter(([x]) => m.id !== "organico" || !ultGsc || x <= ultGsc).map(([x, y0]) => {
      const y = m.id === "organico" && ultGsc && y0 > ultGsc ? ultGsc : y0;
      const t = calcula(datos, x, y);
      const desp = compara === "no" ? null : compara === "anio" ? -364 : -largo;
      const c = desp === null ? undefined : m.f(calcula(datos, suma(x, desp), suma(y, desp)));
      const etq = grupo === "mes" ? `${MESES[Number(x.slice(5, 7)) - 1]}${x.slice(2, 4) !== b.slice(2, 4) ? ` ${x.slice(2, 4)}` : ""}` : fechaCorta(x);
      const etqLarga = x === y ? fechaLarga(x) : grupo === "mes" ? `${MESES_L[Number(x.slice(5, 7)) - 1]} ${x.slice(0, 4)}` : `semana del ${fechaCorta(x)}`;
      const etqC = desp === null ? undefined : suma(x, desp) === suma(y, desp) ? fechaCorta(suma(x, desp)) : `${fechaCorta(suma(x, desp))} – ${fechaCorta(suma(y, desp))}`;
      return { etq, etqLarga, v: m.f(t), c, etqC };
    });

  // Mini serie de 14 tramos para las tarjetas
  const minis = useMemo(() => {
    const o: Record<string, number[]> = {};
    const trozos = Math.min(14, largo);
    const tam = largo / trozos;
    const bloques: [string, string][] = [];
    for (let i = 0; i < trozos; i++) bloques.push([suma(a, Math.round(i * tam)), i === trozos - 1 ? b : suma(a, Math.round((i + 1) * tam) - 1)]);
    const ts = bloques.map(([x, y]) => calcula(datos, x, y));
    for (const m of METRICAS) o[m.id] = ts.map(m.f);
    return o;
  }, [datos, a, b, largo]);

  // Rankings del periodo (servidor)
  useEffect(() => {
    let vivo = true;
    setCargando(true); setDetalle(null); setErrorDetalle(false); // nada del periodo anterior mientras llega el nuevo
    fetch(datos.clave === "demo" ? `/api/mesa-demo?desde=${a}&hasta=${b}` : `/api/mesa?desde=${a}&hasta=${b}&k=${encodeURIComponent(datos.clave)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => { if (vivo) setDetalle(j); })
      .catch(() => { if (vivo) { setDetalle(null); setErrorDetalle(true); } })
      .finally(() => { if (vivo) setCargando(false); });
    return () => { vivo = false; };
  }, [a, b, datos.clave, intento]);

  const [crmC, setCrmC] = useState<Detalle["crm"] | null>(null);
  const [personasC, setPersonasC] = useState<number | null>(null);
  useEffect(() => {
    setCrmC(null); setPersonasC(null);
    if (compara === "no") return;
    let vivo = true;
    fetch(datos.clave === "demo" ? `/api/mesa-demo?desde=${ca}&hasta=${cb}&solo=crm` : `/api/mesa?desde=${ca}&hasta=${cb}&solo=crm&k=${encodeURIComponent(datos.clave)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null)).then((j) => { if (vivo) { setCrmC(j?.crm ?? null); setPersonasC(typeof j?.personas === "number" ? j.personas : null); } }).catch(() => null);
    return () => { vivo = false; };
  }, [ca, cb, compara, datos.clave, intento]);

  const elige = (p: Preset) => { setPreset(p); setRango(rangoDe(p, datos.hoy)); };
  const met = METRICAS.find((m) => m.id === metrica) ?? METRICAS[0];
  const pagoPet = peticionesPago(T);

  /* ── lo más destacado, calculado ── */
  const destacados = useMemo(() => {
    const o: string[] = [];
    if (C) {
      const dp = delta(T.peticiones, C.peticiones);
      if (dp !== null && Math.abs(dp) >= 5) o.push(`${dp > 0 ? "Suben" : "Bajan"} las peticiones un ${num(Math.abs(dp))} % (${num(T.peticiones)} frente a ${num(C.peticiones)}).`);
    }
    const canales = Object.entries(T.porCanal).sort((x, y) => y[1] - x[1]);
    if (canales[0]) o.push(`El canal que más peticiones trae es ${canales[0][0]}: ${num(canales[0][1])} de ${num(T.peticiones)}.`);
    const plat = Object.entries(T.ads.porPlat).sort((x, y) => y[1].coste - x[1].coste)[0];
    if (plat) o.push(`Donde más se invierte: ${PLATAFORMA[plat[0]]?.nombre ?? plat[0]}, ${eur(plat[1].coste)} (${num((plat[1].coste / Math.max(1, T.ads.coste)) * 100)} % del total).`);
    if (T.whatsapp + T.llamadas) o.push(`${num(T.whatsapp)} pulsaciones en WhatsApp y ${num(T.llamadas)} en llamar.`);
    if (T.ads.conv && pagoPet) o.push(`Coste por contacto de anuncios: ${eur(T.ads.coste / T.ads.conv)} según las plataformas (cuentan todos sus contactos) y ${eur(T.ads.coste / pagoPet)} contando solo los que llegan a nuestra web. Difieren porque casi todos los anuncios llevan a la página de la agencia, no a la web.`);
    return o.slice(0, 6);
  }, [T, C, pagoPet]);

  const M = (id: string) => METRICAS.find((x) => x.id === id)!;
  const kpis: { m: Metrica; extra?: string }[] = [
    { m: M("sesiones"), extra: datos.google ? (detalle?.personas != null ? `${num(detalle.personas)} personas distintas` : cargando ? "…" : `${num(T.ga.usuarios)} personas (suma por días)`) : "Analytics sin conectar" },
    { m: M("rebote"), extra: "Detalle por canal, móvil y página en «La web»" },
    { m: { ...M("peticiones"), nombre: "Contactos únicos", ayuda: "Personas distintas que nos dejan sus datos en la web (una persona cuenta una vez al día)." }, extra: `${T.peticiones / Math.max(1, largo) < 1 ? "menos de 1" : nf1.format(T.peticiones / Math.max(1, largo))} al día · ${num(T.whatsapp + T.llamadas)} pulsaciones de WhatsApp o llamar (no son conversaciones)` },
    { m: M("conversion") },
  ];
  const sumaCrm = (c: Detalle["crm"] | null | undefined) => (c ?? []).reduce((x, r) => ({ leads: x.leads + r.leads, visitas: x.visitas + r.visitas, pres: x.pres + r.presupuestos, firm: x.firm + r.firmados, imp: x.imp + r.firmado, desc: x.desc + r.descartados }), { leads: 0, visitas: 0, pres: 0, firm: 0, imp: 0, desc: 0 });
  const crmT = sumaCrm(detalle?.crm), crmA = crmC ? sumaCrm(crmC) : null;

  const canalesRosco: [string, number, string][] = Object.entries(T.porCanal).sort((x, y) => y[1] - x[1]).map(([k, v], i) => [k, v, PALETA[i % PALETA.length]]);
  const campanas = Object.entries(T.ads.porCamp).map(([k, v]) => ({ nombre: k.split("|")[1], ...v, antes: C?.ads.porCamp[k]?.coste ?? 0 }));

  // Historia mensual de anuncios (todos los meses con datos)
  const historia = useMemo(() => {
    const meses = new Map<string, Record<string, number>>();
    for (const r of [...datos.anuncios.mensual, ...datos.anuncios.diario]) {
      const ym = r[0].slice(0, 7);
      const m = meses.get(ym) ?? {};
      m[r[1]] = (m[r[1]] ?? 0) + r[3];
      meses.set(ym, m);
    }
    return [...meses.entries()].sort(([x], [y]) => x.localeCompare(y));
  }, [datos]);

  return (
    <div className="min-h-screen bg-cream pb-20 xl:pl-[272px]">
      {/* cl·v928: guía de uso fija a la izquierda en pantallas grandes (en el móvil va plegada bajo la cabecera) */}
      <GuiaDeUso />
      {/* Cabecera */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6">
          {sencillaPosible && vista === "sencilla" ? (
            <CabeceraSencilla resumen={resumenHoy} tareas={tareas ?? []} abreGuia={() => setGuia(true)} cambiarPeriodo={() => { cambiaVista("completa"); window.scrollTo({ top: 0 }); }} actualizado={datos.anuncios.actualizado} hoy={datos.hoy} />
          ) : (<>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-teal-deep">AMS Cerramientos · mesa de control</p>
              <h1 className="mt-1 font-serif text-[clamp(28px,4vw,40px)] font-medium italic leading-tight text-ink">Todo lo que pasa, en un sitio</h1>
              <p className="mt-1 text-[14px] text-ink/60">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#25D366] align-middle" />
                La web, al momento · anuncios actualizados el {datos.anuncios.actualizado ? fechaLarga(datos.anuncios.actualizado) : "(sin datos)"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-serif text-[20px] italic text-ink">{textoRango(a, b)}</p>
              <p className="text-[13px] text-ink/55">{compara === "no" ? "sin comparar" : `frente a ${textoRango(ca, cb)}`}</p>
            </div>
          </div>

          {sencillaPosible ? (
            <Ayudas vista={vista} cambiaVista={cambiaVista} abreGuia={() => setGuia(true)} resumen={resumenHoy} tareas={tareas ?? []} />
          ) : (
            <p className="mt-4 rounded-[14px] border border-[#e8d9b8] bg-[#fbf6ea] px-4 py-3 text-[15px] leading-snug text-ink">
              Ahora mismo no he podido preparar el resumen sencillo (la conclusión del día, las partes y las cifras en frases). Esto es la vista con todas las cifras. Recarga la página dentro de un minuto.
            </p>
          )}
          </>)}

          {sencillaPosible && vista === "sencilla" && (
            <Sencilla temas={temas!} resumen={resumenHoy} tareas={tareas ?? []} relojes={relojes ?? []} base={base} hoy={datos.hoy} realEntre={(x, y) => { const ds = listaDias(x, y); if (ds.some((q) => !datos.web[q])) return null; return ds.reduce((s, q) => s + datos.web[q].peticiones, 0); }} clave={datos.clave} irCompleta={() => cambiaVista("completa")} herramientas={<Accesos sinId demo={datos.clave === "demo"} irA={(p) => { cambiaVista("completa"); setPestana(p); setTimeout(() => document.querySelector('[role="tablist"]')?.scrollIntoView({ behavior: suave(), block: "start" }), 80); }} />} />
          )}
          {/* cl·v922: las cifras completas salen siempre debajo del resumen, sin botón; lo que ya está arriba no se repite */}
          {(() => { const soloCifras = sencillaPosible && vista === "sencilla"; return (<>
          {!soloCifras && <Ludoteca {...dolorYBien(relojes ?? [], temas ?? [])} contactos={relojes?.[0]?.n} preguntas={juegos(relojes ?? [])} base={base} hoy={datos.hoy} realEntre={(x, y) => { const ds = listaDias(x, y); if (ds.some((q) => !datos.web[q])) return null; return ds.reduce((t, q) => t + datos.web[q].peticiones, 0); }} demo={datos.clave === "demo"} nombreEmpresa="AMS Cerramientos" lineas={["Ventanas de piso", "Cerramiento de terraza", "Cerramiento de chalet", "Obra completa", "Comunidades de vecinos"]} capacidadTexto="¿Cuántos trabajos puedes instalar al mes?" notaPublico="Podemos montar la versión B de tu web: cerramientos de chalet, terrazas y obra completa, con su propia campaña. La de hoy sigue igual. Tú decides el reparto y lo medimos." />}
          {!soloCifras && <GuiaDeUso modo="plegada" />}
          {/* cl·v921: todo plegado en una línea; se abre lo que se quiera y las cifras quedan a un vistazo */}
          <Plegable id="pl-fechas" icono="historia" color={PALETA_ALEGRIA.camino} titulo="Fechas y comparación" pista={`${textoRango(a, b)} · ${compara === "no" ? "sin comparar" : compara === "anio" ? "frente al año pasado" : "frente al periodo anterior"}`}>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {PRESETS.map(([p, t]) => (
              <button key={p} type="button" onClick={() => elige(p)} className={`min-h-[44px] rounded-full border px-3.5 py-1.5 text-[14px] font-semibold transition-colors ${preset === p ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"}`}>
                {t}
              </button>
            ))}
            <label className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[13.5px] font-semibold ${preset === "dia" ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}>
              Un día
              <input type="date" max={datos.hoy} value={preset === "dia" ? a : ""} onChange={(e) => { if (e.target.value) { setPreset("dia"); setRango([e.target.value, e.target.value]); } }} className="bg-transparent text-[13px] outline-none [color-scheme:light]" />
            </label>
            <span className={`flex flex-wrap items-center gap-1.5 rounded-full border px-3 py-1 text-[13.5px] font-semibold ${preset === "libre" ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}>
              Desde
              <input type="date" max={b} value={a} onChange={(e) => { if (e.target.value) { setPreset("libre"); setRango([e.target.value, b < e.target.value ? e.target.value : b]); } }} className="bg-transparent text-[13px] outline-none" />
              hasta
              <input type="date" max={datos.hoy} min={a} value={b} onChange={(e) => { if (e.target.value) { setPreset("libre"); setRango([a, e.target.value]); } }} className="bg-transparent text-[13px] outline-none" />
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[13.5px]">
            <span className="font-semibold text-ink/55">Comparar con:</span>
            {([["anterior", "el periodo anterior"], ["anio", "el mismo periodo del año pasado"], ["no", "nada"]] as [Compara, string][]).map(([k, t]) => (
              <button key={k} type="button" onClick={() => setCompara(k)} className={`min-h-[44px] rounded-full border px-3.5 py-1 font-semibold transition-colors ${compara === k ? "bg-[#f7efe0] text-[#7c5e27]" : "border-line bg-white text-ink/70 hover:border-ink"}`} style={compara === k ? { borderColor: COLOR.ambar } : undefined}>
                {t}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-[16px] border border-[#e8d9b8] bg-[#fbf6ea] px-4 py-3 text-[15px] leading-relaxed text-ink">
            Estás viendo <b>del {textoRango(a, b)}</b> ({largo} {largo === 1 ? "día" : "días"}).{" "}
            {compara === "no" ? "No lo estás comparando con nada." : <>Cada flecha lo compara con <b>{compara === "anio" ? "las mismas fechas del año pasado" : `los ${largo} días justo anteriores`}</b>: del {textoRango(ca, cb)}.</>}
            <details className="mt-1 text-[14px] text-ink/75">
              <summary className="cursor-pointer font-semibold text-teal-deep">Cómo se lee esta pantalla</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><b>Arriba eliges las fechas</b> (7 días, 28 días, un mes, un día concreto…) y <b>con qué comparar</b>.</li>
                <li>La cifra grande es la de las fechas elegidas. Debajo, <b>"antes"</b> es la cifra de las fechas con las que comparas.</li>
                <li><b>Verde</b> es que va a mejor y <b>rojo</b> que va a peor. "Sin datos antes" quiere decir que entonces aún no lo medíamos.</li>
                <li>Las pestañas separan los temas: <b>Resumen</b>, <b>Ventas</b> (del CRM, la libreta de clientes), <b>Anuncios</b>, <b>La web</b>, <b>Google sin pagar</b> y <b>Ficha de Google y redes</b>. En el móvil, desliza la fila de pestañas hacia la izquierda para ver las últimas.</li>
                <li>La web y Analytics van al momento; Search Console, 2 o 3 días por detrás; los anuncios, la ficha de Google e Instagram se ponen al día cada mañana (la ficha de Google llega unos 3 días por detrás).</li>
              </ul>
            </details>
          </div>

          </Plegable>
          {!soloCifras && (
          <Plegable id="pl-temas" icono="grid" color={PALETA_ALEGRIA.web} titulo="Cómo está cada parte" pista={temas ? temas.map((m) => `${m.titulo}: ${m.estado ?? LUZ[m.luz].t}`).join(" · ") : undefined}>
          {temas && temas.length > 0 && <Temas temas={temas} resumen={resumenHoy} />}
          </Plegable>
          )}
          {!soloCifras && tareas && tareas.length > 0 && (
          <Plegable id="pl-hoy" icono="check" color={PALETA_ALEGRIA.dinero} titulo="Lo más importante hoy" pista={tareas[0]?.texto}>
          {tareas && tareas.length > 0 && <QueHagoHoy tareas={tareas} />}
          </Plegable>
          )}
          {!soloCifras && (
          <Plegable id="pl-mas" icono="ajustes" color={PALETA_ALEGRIA.ventas} titulo="Más herramientas" pista="CRM, lupa, plan, guía y más">
          {<Accesos demo={datos.clave === "demo"} irA={(p) => { setPestana(p); setTimeout(() => document.querySelector('[role="tablist"]')?.scrollIntoView({ behavior: suave(), block: "start" }), 50); }} />}
          </Plegable>
          )}
          {!soloCifras && (
          <Plegable id="pl-pregunta" icono="chat" color={PALETA_ALEGRIA.ia} titulo="Pregunta lo que quieras" pista="Escribe o dicta; contesta con las cifras de 28 días">
          <Pregunta clave={datos.clave} />
          </Plegable>
          )}
          {!soloCifras && (
          <Plegable id="pl-correo" icono="sobre" color={PALETA_ALEGRIA.mercado} titulo="Recibe un resumen por correo" pista="Cada día, cada lunes o cada mes">
          <Resumenes clave={datos.clave} />
          </Plegable>
          )}

          <nav className="relative mt-5 flex gap-1 overflow-x-auto pr-8 [mask-image:linear-gradient(to_right,black_calc(100%_-_36px),transparent)] sm:pr-0 sm:[mask-image:none]" role="tablist">
            {PESTANAS.map(([p, t]) => (
              <button key={p} role="tab" aria-selected={pestana === p} type="button" onClick={() => setPestana(p)} className={`whitespace-nowrap rounded-t-[14px] border-b-[3px] px-4 py-2.5 text-[15px] font-semibold transition-colors ${pestana === p ? "border-yellow text-ink" : "border-transparent text-ink/50 hover:text-ink"}`}>
                <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-[8px] text-white" style={{ background: ICONO_PESTANA[p][1], opacity: pestana === p ? 1 : 0.55 }}><Icono n={ICONO_PESTANA[p][0]} className="h-4 w-4" /></span>{t}</span>
              </button>
            ))}
          </nav>
          </>); })()}
        </div>
      </div>

      {(
      <div className="mx-auto max-w-[1240px] space-y-5 px-4 pt-6 sm:px-6">
        {!!datos.fallos?.length && (
          <p className="rounded-[16px] border-2 border-[#a3505a] bg-[#f8e8ea] px-4 py-3 text-[15px] leading-snug text-ink">
            <b className="text-[#a3505a]">Ojo:</b> ahora mismo no se ha podido leer {datos.fallos.join(" ni ")}. Las cifras que dependen de eso salen a cero, pero no es que no haya habido nada: recarga la página dentro de un rato.
          </p>
        )}
        {errorDetalle && (
          <p className="rounded-[16px] border border-[#e8d9b8] bg-[#fbf6ea] px-4 py-3 text-[15px] leading-snug text-ink">No se han podido cargar las cifras del CRM, la lupa y los rankings de estas fechas. <button type="button" onClick={() => setIntento((n) => n + 1)} className="font-semibold underline underline-offset-2">Volver a intentarlo</button></p>
        )}
        {/* cl·v936: dónde estoy y cómo vuelvo, siempre a la vista */}
        <p className="flex flex-wrap items-center gap-2 text-[14px] text-ink/70">
          <span>Estás viendo: <b className="text-ink">Todas las cifras › {PESTANAS.find(([p]) => p === pestana)?.[1]}</b></span>
          {pestana !== "resumen" && <button type="button" onClick={() => { setPestana("resumen"); setTimeout(() => document.querySelector('[role="tablist"]')?.scrollIntoView({ behavior: suave(), block: "start" }), 30); }} className="min-h-[44px] rounded-full border border-line bg-white px-3 text-[13px] font-semibold text-ink">← Volver al resumen de cifras</button>}
          <button type="button" onClick={() => { if (sencillaPosible && vista !== "sencilla") cambiaVista("sencilla"); window.scrollTo({ top: 0 }); }} className="min-h-[44px] rounded-full border border-line bg-white px-3 text-[13px] font-semibold text-ink">↑ Inicio de la mesa</button>
        </p>
        {pestana === "resumen" && (
          <>
            <TresPreguntas T={T} C={C} crm={detalle?.crm ?? null} cargando={cargando} largo={largo} />
            {!datos.fallos?.length && <Alertas T={T} C={C} datos={datos} largo={largo} b={b} />}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {kpis.map(({ m, extra }) => {
                const v = m.f(T);
                return (
                  <button key={m.id} type="button" onClick={() => setMetrica(m.id)} style={{ background: tinte((ICONO_MEDIDA[m.id] ?? ["estrella", "#1a3d47"])[1]) }} className={`rounded-[20px] border p-4 text-left transition-colors ${metrica === m.id ? "border-teal shadow-[0_18px_40px_-30px_rgba(28,140,170,0.9)]" : "border-line hover:border-ink/30"}`}>
                    <span className="flex items-center gap-2.5"><Loseta n={(ICONO_MEDIDA[m.id] ?? ["estrella", "#1a3d47"])[0]} color={(ICONO_MEDIDA[m.id] ?? ["estrella", "#1a3d47"])[1]} tam={36} /><span className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60">{m.nombre}</span></span>
                    <span className="mt-0.5 block text-[12.5px] leading-snug text-ink/55">{m.ayuda}</span>
                    <p className="mt-1.5 flex items-center gap-2 font-serif text-[clamp(26px,3.4vw,34px)] font-medium leading-none text-ink">{Number.isFinite(v) ? m.formato(v) : "-"}{(() => { const d = C && Number.isFinite(m.f(C)) ? delta(v, m.f(C)) : null; if (d === null || Math.abs(d) < 0.5) return null; const bueno = m.menosEsMejor ? d < 0 : d > 0; return <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full text-[16px] text-white" style={{ background: bueno ? "#2f9a62" : "#a3505a" }}>{d > 0 ? "▲" : "▼"}</span>; })()}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] text-ink/55">
                      {C ? <Delta a={v} b={m.f(C)} menosEsMejor={m.menosEsMejor} /> : null}
                      {C && Number.isFinite(m.f(C)) && delta(v, m.f(C)) !== null ? <span>antes {m.formato(m.f(C))}</span> : null}
                    </div>
                    <div className="mt-2"><Mini serie={minis[m.id] ?? []} color={metrica === m.id ? COLOR.teal : "#8a96a3"} /></div>
                    {extra ? <p className="mt-1 text-[12px] text-ink/50">{extra}</p> : null}
                  </button>
                );
              })}
              <CifraFija icono="comerciales" nombre="Visitas comerciales" ayuda="Visitas técnicas a casas de clientes, del CRM (clientes que entraron en estas fechas)." v={detalle ? num(crmT.visitas) : errorDetalle ? "-" : "…"} antes={crmA ? num(crmA.visitas) : undefined} a={crmT.visitas} b={crmA?.visitas} />
              <CifraFija icono="firmados" nombre="Contratos firmados" ayuda="Trabajos firmados de los clientes que entraron en estas fechas (CRM)." v={detalle ? num(crmT.firm) : errorDetalle ? "-" : "…"} antes={crmA && crmT.firm ? num(crmA.firm) : undefined} a={crmT.firm} b={crmT.firm ? crmA?.firm : undefined} extra={crmT.imp ? eur(crmT.imp) : crmT.leads ? "Un presupuesto tarda semanas en firmarse: los contactos de estas fechas aún están en marcha" : "Las firmas antiguas llegarán con la base de clientes"} />
              {(() => { const m = M("cpl"); const v = m.f(T); return <CifraFija icono="cpl" nombre="Coste por contacto" ayuda={m.ayuda} v={T.ads.conv ? m.formato(v) : T.ads.coste ? "Sin contactos medidos" : "-"} antes={C && C.ads.conv ? m.formato(m.f(C)) : undefined} a={v} b={C ? m.f(C) : undefined} menosEsMejor extra={`${nf1.format(T.ads.conv)} contactos según las plataformas · ${eur(T.ads.coste)} invertidos`} />; })()}
              <CifraFija icono="margen" nombre="Margen de los trabajos" ayuda="Margen previsto de los trabajos captados." v="Pendiente" extra="Falta apuntar el coste previsto y real de cada trabajo" pendiente />
            </div>

              <PorCanal T={T} C={C} />

            <Caja
              titulo={met.nombre}
              fuente={`${met.fuente} · por ${grupo === "dia" ? "días" : grupo === "semana" ? "semanas" : "meses"}`}
              accion={
                <div className="flex flex-wrap gap-1">
                  {(["auto", "dia", "semana", "mes"] as const).map((g) => (
                    <button key={g} type="button" onClick={() => setAgrupa(g)} className={`min-h-[44px] rounded-full px-3.5 py-1 text-[14px] font-semibold ${agrupa === g ? "bg-ink text-white" : "bg-cream text-ink/70 hover:text-ink"}`}>
                      {g === "auto" ? "Automático" : g === "dia" ? "Días" : g === "semana" ? "Semanas" : "Meses"}
                    </button>
                  ))}
                </div>
              }
            >
              <div className="-mx-5 mb-3 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:px-0">
                {METRICAS.map((m) => { const [ic, col] = ICONO_MEDIDA[m.id] ?? ["estrella", "#1a3d47"]; const on = metrica === m.id; return (
                  <button key={m.id} type="button" onClick={() => setMetrica(m.id)} aria-pressed={on} className="inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full border py-1 pl-1.5 pr-3.5 text-[14px] font-semibold transition-colors" style={on ? { background: col, borderColor: col, color: "#fff" } : { background: tinte(col), borderColor: `${col}55`, color: COLOR.ink }}>
                    <Loseta n={ic} color={on ? "#ffffff33" : col} tam={28} />{m.nombre}
                  </button>
                ); })}
              </div>
              <QueTexto texto={`${met.nombre}: ${met.ayuda}`} />
              <div className="mt-3" />
              <Grafico puntos={serieDe(met)} formato={met.formato} color={(ICONO_MEDIDA[metrica] ?? ["", COLOR.teal])[1]} menosEsMejor={met.menosEsMejor} />
              {C ? (
                <p className="mt-2 flex flex-wrap items-center gap-3 text-[12.5px] text-ink/60">
                  <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2.5 w-4 rounded-sm" style={{ background: (ICONO_MEDIDA[metrica] ?? ["", COLOR.teal])[1] }} /> {textoRango(a, b)}</span>
                  <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2.5 w-4 rounded-sm" style={{ background: COLOR.ambar, opacity: 0.6 }} /> {textoRango(ca, cb)}</span>
                </p>
              ) : null}
            </Caja>

            <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <Caja titulo="De dónde vienen las peticiones" fuente="Web · canal de llegada de cada persona">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <Rosco datos={canalesRosco} centro={num(T.peticiones)} sub="peticiones" />
                  <div className="w-full"><Barras filas={canalesRosco.map(([k, v, c]) => [k, v, c])} compara={C?.porCanal} /></div>
                </div>
              </Caja>
              <Caja titulo="Lo más destacado" fuente="Calculado con los datos del periodo">
                {destacados.length ? (
                  <ul className="space-y-2">
                    {destacados.map((t, i) => {
                      /* cl·v928: cada destacado con su icono, su color y su cifra grande */
                      const [ic, col] = /Suben/.test(t) ? ["rayo", "#2f9a62"] : /Bajan/.test(t) ? ["campana", "#a3505a"] : /canal/.test(t) ? ["mapa", PALETA_ALEGRIA.web] : /invierte/.test(t) ? ["megafono", PALETA_ALEGRIA.anuncios] : /WhatsApp/.test(t) ? ["telefono", PALETA_ALEGRIA.aviso] : ["moneda", PALETA_ALEGRIA.dinero];
                      const cifra = t.match(/\d[\d.,]*\s?(?:%|€)?/)?.[0];
                      return (
                        <li key={i} className="flex items-center gap-3 rounded-[14px] px-3 py-2.5" style={{ background: tinte(col) }}>
                          <Loseta n={ic} color={col} tam={36} />
                          <span className="min-w-0 flex-1 text-[14.5px] leading-snug text-ink/85">{t}</span>
                          {cifra && <span className="shrink-0 font-serif text-[22px] italic leading-none" style={{ color: col }}>{cifra.trim()}</span>}
                        </li>
                      );
                    })}
                  </ul>
                ) : <p className="text-[14px] text-ink/50">Aún no hay datos suficientes en este periodo.</p>}
              </Caja>
            </div>

            {/* 27-oct (cl·v896): web y CRM separados. Son grupos distintos (el CRM incluye teléfono, WhatsApp,
                Instagram y recomendación) y en una sola cadena salían porcentajes absurdos, como un 133 %. */}
            <Caja titulo="Recorrido de la web" fuente="Web y Analytics · el % es sobre el paso anterior">
              <Embudo pasos={[
                ["Visitas a la web", T.ga.sesiones, C?.ga.sesiones],
                ["Dejaron sus datos", T.peticiones, C?.peticiones],
                ["Solicitaron visita en la web", T.visitas, C?.visitas],
              ]} />
            </Caja>
            <Caja titulo="Recorrido comercial total" fuente="CRM · contactos que entraron en estas fechas por cualquier canal, y hasta dónde han llegado">
              <Embudo pasos={[
                ["Contactos registrados", crmT.leads, crmA?.leads],
                ["Visitas realizadas", crmT.visitas, crmA?.visitas],
                ["Presupuestos entregados", crmT.pres, crmA?.pres],
                ["Contratos firmados", crmT.firm, undefined],
              ]} />
              {!crmT.firm && crmT.leads > 0 && <p className="mt-3 text-[13.5px] leading-relaxed text-ink/70">Todavía no hay firmas de los contactos que entraron en este periodo: hay {num(crmT.visitas)} visitas y {num(crmT.pres)} presupuestos en curso. Un presupuesto tarda semanas en decidirse; la tasa de cierre se mira con contactos de hace 3 a 6 meses.</p>}
              <p className="mt-3 text-[13px] leading-relaxed text-ink/60">Los pasos de la web cuentan solo lo que pasa en la web. Los del CRM incluyen también a quien llega por teléfono, WhatsApp, Instagram o recomendación (por eso pueden ser más). Además, {num(T.whatsapp)} pulsaciones en WhatsApp y {num(T.llamadas)} en llamar: son pulsaciones del botón, no conversaciones; las conversaciones reales las apunta el equipo en el CRM.</p>
            </Caja>
          </>
        )}

        {pestana === "redes" && <BloqueRedes r={datos.redes ?? null} a={a} b={b} ca={ca} cb={cb} compara={compara} />}

        {pestana === "ventas" && <Ventas crm={detalle?.crm ?? []} cargando={cargando} inversion={T.ads.coste} />}

        {pestana === "anuncios" && (
          <>
            {T.ads.parcial ? (
              <p className="rounded-[14px] border border-line bg-white px-4 py-3 text-[13.5px] text-ink/70">
                Antes del {fechaLarga(datos.anuncios.diario[0]?.[0] ?? b)} los anuncios solo se guardan por meses: cuentan los meses enteros que caen dentro del periodo.
              </p>
            ) : null}
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(PLATAFORMA).map(([k, p]) => {
                const x = T.ads.porPlat[k] ?? { coste: 0, clics: 0, impr: 0, conv: 0 };
                const y = C?.ads.porPlat[k];
                const canal = Object.entries(CANALES_PAGO).find(([, v]) => v === k)?.[0] ?? "";
                const pet = T.porCanal[canal] ?? 0;
                return (
                  <section key={k} className="rounded-[22px] border p-5" style={{ borderColor: `${p.color}55`, background: tinte(p.color) }}>
                    <p className="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em]" style={{ color: p.color }}><span className="grid h-9 w-9 place-items-center rounded-[10px] border border-line bg-white"><LogoMarca nombre={k === "google" ? "Google Ads" : k === "meta" ? "Meta" : "ChatGPT"} tam={24} /></span>{p.nombre}</p>
                    <p className="mt-2 flex items-center gap-2 font-serif text-[32px] leading-none text-ink">{eur(x.coste)}{x.coste > 0 && (() => { const mediaPet = T.ads.coste && T.peticiones ? T.ads.coste / Math.max(1, Object.entries(CANALES_PAGO).reduce((t, [c]) => t + (T.porCanal[c] ?? 0), 0)) : 0; const cpp = pet ? x.coste / pet : 0; if (!cpp || !mediaPet) return null; const bueno = cpp <= mediaPet; return <span className="rounded-full px-2.5 py-1 text-[12px] font-bold text-white" style={{ background: bueno ? "#2f9a62" : "#a3505a" }}>{bueno ? "Rinde mejor que la media" : "Rinde peor que la media"}</span>; })()}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-[12.5px] text-ink/55">{y ? <><Delta a={x.coste} b={y.coste} /> antes {eur(y.coste)}</> : null}</div>
                    <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[13.5px]">
                      <dt className="text-ink/55">Clics</dt><dd className="text-right font-semibold">{num(x.clics)}</dd>
                      <dt className="text-ink/55">Coste por clic</dt><dd className="text-right font-semibold">{x.clics ? eur2(x.coste / x.clics) : "-"}</dd>
                      <dt className="text-ink/55">Contactos (según la plataforma)</dt><dd className="text-right font-semibold">{nf1.format(x.conv)}</dd>
                      <dt className="text-ink/55">Peticiones que llegan a la web</dt><dd className="text-right font-semibold">{num(pet)}</dd>
                      <dt className="font-semibold text-ink">Coste por petición</dt><dd className="text-right font-bold text-ink">{pet ? eur(x.coste / pet) : "-"}</dd>
                    </dl>
                  </section>
                );
              })}
            </div>

            <Caja titulo="Inversión por día" fuente="Supermetrics · Google Ads">
              <Grafico puntos={serieDe(M("inversion"))} formato={eur} color={COLOR.rosa} />
            </Caja>

            <Caja titulo="Campañas" fuente="Toca una columna para ordenar">
              <Tabla
                filas={campanas}
                inicial="coste"
                cols={[
                  { k: "nombre", t: "Campaña", v: (r) => r.nombre, f: (r) => <span className="flex items-center gap-2"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px] border border-line bg-white"><LogoMarca nombre={r.plat === "google" ? "Google Ads" : r.plat === "meta" ? "Meta" : "ChatGPT"} tam={18} /></span><span className="font-semibold">{r.nombre}</span></span> },
                  { k: "coste", t: "Inversión", v: (r) => r.coste, num: true, f: (r) => <span className="inline-flex items-center gap-2">{eur(r.coste)}{C ? <Delta a={r.coste} b={r.antes} /> : null}</span> },
                  { k: "clics", t: "Clics", v: (r) => r.clics, num: true },
                  { k: "cpc", t: "Por clic", v: (r) => (r.clics ? r.coste / r.clics : 0), num: true, f: (r) => (r.clics ? eur2(r.coste / r.clics) : "-") },
                  { k: "impr", t: "Veces que sale", v: (r) => r.impr, num: true },
                  { k: "conv", t: "Contactos", v: (r) => r.conv, num: true, f: (r) => nf1.format(r.conv) },
                  { k: "cpa", t: "Por contacto", v: (r) => (r.conv ? r.coste / r.conv : 0), num: true, f: (r) => (r.conv ? eur(r.coste / r.conv) : "-") },
                ]}
              />
              <p className="mt-3 text-[12.5px] text-ink/50">"Contactos" es lo que cuenta cada plataforma. Las peticiones reales, por canal, están arriba y en el Resumen.</p>
            </Caja>

            <Caja titulo="Inversión mes a mes" fuente="Toda la historia guardada" plegada="Cuánto se ha invertido cada mes desde el principio, por plataforma">
              <HistoriaMeses historia={historia} />
            </Caja>
          </>
        )}

        {pestana === "web" && (
          <>
            <BloqueRebote T={T} C={C} rebote={detalle?.rebote ?? null} cargando={cargando} conectado={datos.google} />
            <BloqueClarity c={detalle?.clarity ?? null} cargando={cargando} />
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["Visitas (Analytics)", T.ga.sesiones, C?.ga.sesiones],
                ["Personas", detalle?.personas ?? T.ga.usuarios, detalle?.personas != null && personasC != null ? personasC : undefined],
                ["Con interés", T.ga.interes, C?.ga.interes],
                ["Páginas vistas", T.vistas, C?.vistas],
              ].map(([t, v, c]) => (
                <div key={String(t)} className="rounded-[20px] border border-line bg-white p-4">
                  <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink/50">{t}</p>
                  <p className="mt-1 font-serif text-[30px] leading-none text-ink">{num(Number(v))}</p>
                  {c !== undefined ? <div className="mt-2"><Delta a={Number(v)} b={Number(c)} antes={num(Number(c))} /></div> : null}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
              <Caja titulo="Por dónde entran" fuente="Analytics · canal">
                <Tabla
                  filas={Object.entries(T.ga.porCanal).map(([canal, x]) => ({ canal, ...x, antes: C?.ga.porCanal[canal]?.sesiones ?? 0 }))}
                  inicial="sesiones"
                  vacio={datos.google ? "Sin datos en este periodo." : "Analytics no está conectado."}
                  cols={[
                    { k: "canal", t: "Canal", v: (r) => r.canal, f: (r) => <span className="flex items-center font-semibold"><LogoCanal canal={GRUPO_GA[r.canal] ?? r.canal} />{CANAL_GA_ES[r.canal] ?? r.canal}</span> },
                    { k: "sesiones", t: "Visitas", v: (r) => r.sesiones, num: true, f: (r) => <span className="inline-flex items-center gap-2">{num(r.sesiones)}{C ? <Delta a={r.sesiones} b={r.antes} /> : null}</span> },
                    { k: "int", t: "Con interés", v: (r) => (r.sesiones ? r.interes / r.sesiones : 0), num: true, f: (r) => (r.sesiones ? pct((r.interes / r.sesiones) * 100) : "-") },
                    { k: "clave", t: "Acciones clave", v: (r) => r.clave, num: true },
                  ]}
                />
              </Caja>
              <Caja titulo="Páginas más vistas" fuente={cargando ? "Cargando…" : "Web · contador propio, sin cookies"}>
                <Barras filas={(detalle?.paginas ?? []).slice(0, 12).map((p) => [p.pagina, p.n])} />
              </Caja>
            </div>
            <Caja titulo="Qué hace la gente en cada página" fuente={cargando ? "Cargando…" : "La lupa · solo quien acepta cookies de analítica"} plegada="Cuánto bajan, cuánto se quedan y quién se va enseguida, página a página">
              <Tabla
                filas={detalle?.lupa ?? []}
                inicial="visitas"
                cols={[
                  { k: "pagina", t: "Página", v: (r) => r.pagina, f: (r) => <span className="font-semibold">{r.pagina}</span> },
                  { k: "visitas", t: "Visitas", v: (r) => r.visitas, num: true },
                  { k: "movil", t: "En móvil", v: (r) => (r.visitas ? r.movil / r.visitas : 0), num: true, f: (r) => pct((r.movil / Math.max(1, r.visitas)) * 100) },
                  { k: "scroll", t: "Bajan (mediana)", v: (r) => r.scroll_mediano, num: true, f: (r) => <Medida v={r.scroll_mediano} /> },
                  { k: "final", t: "Llegan al final", v: (r) => r.llegan_al_final_pct, num: true, f: (r) => pct(r.llegan_al_final_pct) },
                  { k: "seg", t: "Segundos activos", v: (r) => r.segundos_activos_mediana, num: true },
                  { k: "rapido", t: "Se van en menos de 10 s", v: (r) => r.se_van_en_menos_de_10s_pct, num: true, f: (r) => <span className={r.se_van_en_menos_de_10s_pct >= 50 ? "font-bold text-[#a3505a]" : ""}>{pct(r.se_van_en_menos_de_10s_pct)}</span> },
                ]}
              />
            </Caja>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
              <Caja titulo="Dónde pulsan WhatsApp y llamar" fuente="Web" plegada="En qué páginas pulsan el botón de WhatsApp o de llamar">
                <Barras filas={(detalle?.clicsPagina ?? []).map((c) => [`${c.pagina} · ${({ whatsapp: "WhatsApp", llamada: "Llamar", llamar: "Llamar" } as Record<string, string>)[c.canal] ?? c.canal}`, c.n])} />
              </Caja>
              <Caja titulo="Páginas de entrada" fuente="Analytics" plegada="Por qué página llega cada visita">
                <Tabla
                  filas={detalle?.entradas ?? []}
                  inicial="sesiones"
                  cols={[
                    { k: "pagina", t: "Página", v: (r) => r.pagina, f: (r) => <span className="font-semibold">{r.pagina || "/"}</span> },
                    { k: "sesiones", t: "Visitas", v: (r) => r.sesiones, num: true },
                    { k: "int", t: "Con interés", v: (r) => r.interes_pct, num: true, f: (r) => pct(r.interes_pct) },
                    { k: "clave", t: "Acciones clave", v: (r) => r.clave, num: true },
                  ]}
                />
              </Caja>
            </div>
          </>
        )}

        {pestana === "google" && (
          <>
            {C && ca < "2026-03-26" ? (
              <p className="rounded-[16px] border border-[#e8d9b8] bg-[#fbf6ea] px-4 py-3 text-[14.5px] leading-relaxed text-ink">
                <b>Ojo al comparar con antes de abril de 2026.</b> El 26 de marzo de 2026 los clics desde Google cayeron de golpe (de unos 280 al día a unos 15), con la web antigua, coincidiendo con una actualización grande de Google. Casi todo lo que se perdió eran artículos de bricolaje del blog antiguo (enlucir paredes, goteras, tipos de ladrillo) que apenas traían clientes. Desde mayo la cifra está estable en unos 1.000-1.300 clics al mes.
              </p>
            ) : null}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["Clics desde Google", num(T.gsc.clics), C ? <Delta a={T.gsc.clics} b={C.gsc.clics} antes={num(C.gsc.clics)} /> : null, "Personas que nos encuentran en Google y entran, sin anuncio."],
                ["Veces que salimos", num(T.gsc.impresiones), C ? <Delta a={T.gsc.impresiones} b={C.gsc.impresiones} antes={num(C.gsc.impresiones)} /> : null, "Veces que aparecemos en una búsqueda, aunque no pinchen."],
                ["Porcentaje de clic", T.gsc.impresiones ? pct((T.gsc.clics / T.gsc.impresiones) * 100) : "-", C && C.gsc.impresiones ? <span className="text-[12.5px] text-ink/55">antes: {pct((C.gsc.clics / C.gsc.impresiones) * 100)}</span> : null, "De cada 100 veces que salimos, cuántos pinchan."],
                ["Posición media", T.gsc.posicion ? nf1.format(T.gsc.posicion) : "-", C && C.gsc.posicion ? <Posicion a={T.gsc.posicion} b={C.gsc.posicion} /> : null, "En qué puesto salimos de media. El 1 es el primero: cuanto más bajo el número, mejor."],
              ].map(([t, v, d, ay]) => (
                <div key={String(t)} className="rounded-[20px] border border-line bg-white p-4">
                  <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink/50">{t}</p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-ink/55">{ay}</p>
                  <p className="mt-1 font-serif text-[30px] leading-none text-ink">{v}</p>
                  {d ? <div className="mt-2">{d}</div> : null}
                </div>
              ))}
            </div>
            {ultGsc && b > ultGsc ? <p className="rounded-[14px] border border-[#e8d9b8] bg-[#fbf6ea] px-4 py-3 text-[14.5px] leading-snug text-ink">Google solo ha dado datos de Search Console hasta el <b>{fechaLarga(ultGsc)}</b> (siempre va 2 o 3 días por detrás).{recGsc > 0 ? " Las cifras de esta pestaña llegan hasta ese día y la comparación usa los mismos días del otro periodo." : " Para estas fechas todavía no hay datos: lo que ves a cero es por eso, no porque no haya habido clics."}</p> : null}
            <Intencion busquedas={detalle?.gsc?.busquedas ?? []} cargando={cargando} />
            <Caja titulo="Clics desde Google, sin pagar" fuente="Search Console · va 2-3 días por detrás">
              <Grafico puntos={serieDe(M("organico"))} formato={num} color={COLOR.salvia} />
            </Caja>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
              <Caja titulo="Qué buscan cuando nos encuentran" plegada="Las palabras que escriben en Google y por las que salimos" fuente={cargando ? "Cargando…" : "Search Console"}>
                <Tabla
                  filas={detalle?.gsc?.busquedas ?? []}
                  inicial="clics"
                  vacio={datos.google ? "Sin datos en este periodo." : "Search Console no está conectado."}
                  cols={[
                    { k: "b", t: "Búsqueda", v: (r) => r.busqueda, f: (r) => <span className="font-semibold">{r.busqueda}</span> },
                    { k: "i", t: "Tipo", v: (r) => intencionDe(r.busqueda), f: (r) => { const i = intencionDe(r.busqueda); return <span className="rounded-full px-2 py-0.5 text-[12px] font-bold" style={{ background: INTENCION[i][1], color: INTENCION[i][0] }}>{i}</span>; } },
                    { k: "clics", t: "Clics", v: (r) => r.clics, num: true },
                    { k: "impr", t: "Veces", v: (r) => r.impresiones, num: true },
                    { k: "pos", t: "Posición", v: (r) => r.posicion, num: true, f: (r) => nf1.format(r.posicion) },
                  ]}
                />
              </Caja>
              <Caja titulo="Páginas que traen visitas desde Google" plegada="Qué páginas nuestras aparecen en Google y cuántos clics traen" fuente={cargando ? "Cargando…" : "Search Console"}>
                <Tabla
                  filas={detalle?.gsc?.paginas ?? []}
                  inicial="clics"
                  cols={[
                    { k: "p", t: "Página", v: (r) => r.pagina, f: (r) => <span className="font-semibold">{r.pagina || "/"}</span> },
                    { k: "clics", t: "Clics", v: (r) => r.clics, num: true },
                    { k: "impr", t: "Veces", v: (r) => r.impresiones, num: true },
                    { k: "pos", t: "Posición", v: (r) => r.posicion, num: true, f: (r) => nf1.format(r.posicion) },
                  ]}
                />
              </Caja>
            </div>
          </>
        )}

        <Despedida demo={datos.clave === "demo"} />
        <p className="pt-4 text-center text-[12.5px] text-ink/45">
          Fuentes y su última actualización: la web y el CRM, al momento · Google Analytics, al momento (el día de hoy es provisional) · Search Console, datos hasta el {ultGsc ? fechaLarga(ultGsc) : "(sin datos)"} · Google Ads (Supermetrics), {datos.anuncios.actualizado ? `al ${fechaLarga(datos.anuncios.actualizado)}` : "sin datos"} · Ficha de Google e Instagram (Supermetrics), {datos.redes?.actualizado ? `al ${fechaLarga(datos.redes.actualizado)}` : "sin datos"}</p>
      </div>
      )}
      {sencillaPosible && <BarraMovil vista={vista} />}
      <VolverInicio irSencilla={() => { if (sencillaPosible && vista !== "sencilla") cambiaVista("sencilla"); history.replaceState(null, "", " "); window.scrollTo({ top: 0 }); }} />
      {guia && <Guia cerrar={cierraGuia} />}
    </div>
  );
}

function Medida({ v }: { v: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block h-1.5 w-14 overflow-hidden rounded-full bg-[#f1ece2]"><span className="block h-full rounded-full" style={{ width: `${Math.min(100, v)}%`, background: v >= 60 ? COLOR.salvia : v >= 35 ? COLOR.ambar : COLOR.rosa }} /></span>
      {pct(v)}
    </span>
  );
}

/* Las tres preguntas que el panel tiene que contestar nada más abrirlo (cl·v825). */
function TresPreguntas({ T, C, crm, cargando, largo }: { T: Totales; C: Totales | null; crm: Detalle["crm"] | null; cargando: boolean; largo: number }) {
  type Resp = { pregunta: string; color: "verde" | "ambar" | "rojo" | "gris"; frase: string; dato: string };
  const pv = T.peticiones ? (T.visitas / T.peticiones) * 100 : 0, pvC = C && C.peticiones ? (C.visitas / C.peticiones) * 100 : null;
  const dp = C ? delta(T.peticiones, C.peticiones) : null;
  let c1: Resp["color"] = "gris", f1 = "Aún hay pocos datos en este periodo.";
  if (T.peticiones >= 5) {
    const bajaProp = pvC !== null && pvC - pv >= 8, subeProp = pvC !== null && pv - pvC >= 8;
    if (bajaProp) { c1 = "ambar"; f1 = `Llegan ${dp !== null && dp > 0 ? "más contactos" : "contactos"}, pero piden menos la visita (${num(pv)} %, antes ${num(pvC ?? 0)} %).`; }
    else if (dp !== null && dp <= -20) { c1 = "rojo"; f1 = `Llegan menos contactos: ${num(T.peticiones)}, antes ${num(C!.peticiones)}.`; }
    else if (subeProp || (dp !== null && dp >= 10)) { c1 = "verde"; f1 = `Bien: ${num(T.peticiones)} contactos y el ${num(pv)} % pide la visita.`; }
    else { c1 = "verde"; f1 = `Estable: ${num(T.peticiones)} contactos y el ${num(pv)} % pide la visita.`; }
  }
  const t = (crm ?? []).reduce((a, r) => ({ leads: a.leads + r.leads, visitas: a.visitas + r.visitas, pres: a.pres + r.presupuestos, firm: a.firm + r.firmados, imp: a.imp + r.firmado }), { leads: 0, visitas: 0, pres: 0, firm: 0, imp: 0 });
  let c2: Resp["color"] = "gris", f2 = cargando ? "Cargando el CRM…" : "Sin datos del CRM en este periodo: se llenará cuando el equipo lo use.";
  if (t.leads >= 5) {
    const tasa = (t.firm / t.leads) * 100;
    if (t.firm === 0 && largo <= 60) { c2 = "gris"; f2 = `De ${num(t.leads)} contactos: ${num(t.visitas)} visitas y ${num(t.pres)} presupuestos. Aún no hay firmas: un presupuesto tarda semanas en decidirse, la tasa de cierre se mira con 3 a 6 meses.`; }
    else {
      c2 = t.firm === 0 ? "ambar" : tasa >= 8 ? "verde" : "ambar";
      f2 = `De ${num(t.leads)} contactos: ${num(t.visitas)} visitas, ${num(t.pres)} presupuestos y ${num(t.firm)} trabajos firmados (${eur(t.imp)}).`;
    }
  }
  const pagoPlat: Record<string, string> = { "Google Ads": "google", "Meta (anuncio)": "meta", "ChatGPT Ads": "chatgpt" };
  const porCanal = (crm ?? []).filter((r) => r.firmados > 0).map((r) => ({ ...r, coste: pagoPlat[r.origen] ? (T.ads.porPlat[pagoPlat[r.origen]]?.coste ?? 0) : 0 })).sort((a, b) => b.firmado - a.firmado);
  let c3: Resp["color"] = "gris", f3 = "Hará falta que el CRM tenga trabajos firmados en este periodo.";
  if (porCanal.length) {
    const mejor = porCanal[0];
    const pagos = porCanal.filter((r) => r.coste > 0).map((r) => `${r.origen}: ${eur(r.coste / r.firmados)} por trabajo`);
    c3 = "verde";
    f3 = `${mejor.origen} es el que más factura: ${num(mejor.firmados)} ${mejor.firmados === 1 ? "trabajo" : "trabajos"}, ${eur(mejor.firmado)}.${pagos.length ? ` En anuncios: ${pagos.join("; ")}.` : ""}`;
  }
  const filas: Resp[] = [
    { pregunta: "¿Nos llegan buenos contactos?", color: c1, frase: f1, dato: `${num(T.peticiones)} contactos · ${num(T.visitas)} piden visita` },
    { pregunta: "¿Los convertimos en trabajos?", color: c2, frase: f2, dato: t.leads ? `${num(t.leads ? (t.firm / t.leads) * 100 : 0)} % de contacto a trabajo` : "" },
    { pregunta: "¿Qué canal nos hace ganar más?", color: c3, frase: f3, dato: "" },
  ];
  const COL = { verde: ["#ebf1e8", "#3f6b39", "Todo bien"], ambar: ["#f7efe0", "#7c5e27", "Mira esto"], rojo: ["#f8e8ea", "#a3505a", "Importante"], gris: ["#f1efec", "#6b6b6b", "Sin datos aún"] } as const;
  const peor = filas.some((r) => r.color === "rojo") ? "rojo" : filas.some((r) => r.color === "ambar") ? "ambar" : filas.some((r) => r.color === "verde") ? "verde" : "gris";
  return (
    <Plegable id="pl-preguntas" icono="lupa" color={COL[peor][1]} titulo="Las tres preguntas del dueño" pista={filas.map((r) => `${r.pregunta.replace(/[¿?]/g, "")}: ${COL[r.color][2]}`).join(" · ")}>
    <div className="grid gap-3 pt-1 lg:grid-cols-3">
      {filas.map((r) => {
        const [bg, fg, txt] = COL[r.color];
        return (
          <div key={r.pregunta} className="rounded-[20px] border-2 p-4" style={{ background: bg, borderColor: fg }}>
            <p className="flex items-center justify-between gap-2"><span className="text-[16px] font-bold text-ink">{r.pregunta}</span><span className="shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-bold text-white" style={{ background: fg }}>{txt}</span></p>
            <p className="mt-2 text-[15px] leading-snug text-ink/85">{r.frase}</p>
            {r.dato ? <p className="mt-1.5 text-[13px] font-semibold" style={{ color: fg }}>{r.dato}</p> : null}
          </div>
        );
      })}
    </div>
    </Plegable>
  );
}

function Embudo({ pasos, sinPct = false }: { pasos: [string, number, number | undefined][]; sinPct?: boolean }) {
  const max = Math.max(1, ...pasos.map(([, v]) => v));
  return (
    <ol className="space-y-2.5">
      {pasos.map(([t, v, c], i) => (
        <li key={t} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:grid-cols-[230px_minmax(0,1fr)_auto]">
          <span className="flex items-center gap-2 text-[14px] font-semibold text-ink"><Loseta n={["globo", "persona", "casa", "documento", "check"][Math.min(i, 4)]} color={PALETA[i % PALETA.length]} tam={28} /><span>{t}{!sinPct && i > 0 && pasos[i - 1][1] ? <span className="block text-[12px] font-normal text-ink/50">{nf1.format((v / pasos[i - 1][1]) * 100)} % del paso anterior</span> : null}</span></span>
          <div className="order-3 col-span-2 h-7 overflow-hidden rounded-[10px] bg-[#f6f1e7] sm:order-none sm:col-span-1">
            <div className="h-full rounded-[10px]" style={{ width: `${Math.max(2, (v / max) * 100)}%`, background: PALETA[i % PALETA.length] }} />
          </div>
          <span className="flex items-center gap-2 text-right font-serif text-[20px] text-ink">{num(v)}{c !== undefined ? <Delta a={v} b={c} /> : null}</span>
        </li>
      ))}
    </ol>
  );
}

function HistoriaMeses({ historia }: { historia: [string, Record<string, number>][] }) {
  const [sel, setSel] = useState<number | null>(null);
  const max = Math.max(1, ...historia.map(([, m]) => Object.values(m).reduce((a, b) => a + b, 0)));
  const s = sel ?? historia.length - 1;
  const [ym, m] = historia[s] ?? ["", {}];
  return (
    <div>
      <div className="flex h-48 items-end gap-1" onMouseLeave={() => setSel(null)}>
        {historia.map(([k, v], i) => {
          const total = Object.values(v).reduce((a, b) => a + b, 0);
          return (
            <button key={k} type="button" onMouseEnter={() => setSel(i)} onClick={() => setSel(i)} className="flex h-full min-w-0 flex-1 flex-col justify-end" aria-label={`${k}: ${eur(total)}`}>
              <div className="flex w-full flex-col-reverse overflow-hidden rounded-t-[6px]" style={{ height: `${(total / max) * 100}%`, opacity: sel === null || sel === i ? 1 : 0.4 }}>
                {Object.entries(PLATAFORMA).map(([p, x]) => (v[p] ? <div key={p} style={{ height: `${(v[p] / total) * 100}%`, background: x.color }} /> : null))}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-1 flex gap-1 text-[12px] text-ink/55">
        {historia.map(([k], i) => <span key={k} className="min-w-0 flex-1 truncate text-center">{i % 2 === 0 ? `${MESES[Number(k.slice(5, 7)) - 1]} ${k.slice(2, 4)}` : ""}</span>)}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[12px] bg-cream px-3 py-2 text-[13.5px]">
        <b className="text-ink">{ym ? `${MESES_L[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}` : ""}</b>
        {Object.entries(PLATAFORMA).map(([p, x]) => (m[p] ? <span key={p} className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ background: x.color }} />{x.nombre}: <b>{eur(m[p])}</b></span> : null))}
        <span>Total: <b>{eur(Object.values(m).reduce((a, b) => a + b, 0))}</b></span>
      </div>
    </div>
  );
}

const PAGO = ["Google Ads", "Meta (anuncio)", "ChatGPT Ads", "Landing de anuncios"];
function Ventas({ crm, cargando, inversion }: { crm: Detalle["crm"]; cargando: boolean; inversion: number }) {
  const t = crm.reduce((a, r) => ({ leads: a.leads + r.leads, visitas: a.visitas + r.visitas, presupuestos: a.presupuestos + r.presupuestos, firmados: a.firmados + r.firmados, firmado: a.firmado + r.firmado, facturado: a.facturado + r.facturado }), { leads: 0, visitas: 0, presupuestos: 0, firmados: 0, firmado: 0, facturado: 0 });
  const pago = crm.filter((r) => PAGO.includes(r.origen)).reduce((a, r) => a + r.firmados, 0);
  const resp = crm.reduce((a, r) => ({ n: a.n + (r.respondidos ?? 0), h: a.h + (r.horas_resp ?? 0), v: a.v + (r.vencidas ?? 0) }), { n: 0, h: 0, v: 0 });
  const media = resp.n ? resp.h / resp.n : null;
  const tiempo = media === null ? "-" : media < 1 ? `${Math.round(media * 60)} min` : media < 48 ? `${num(Math.round(media * 10) / 10)} h` : `${num(Math.round(media / 24))} días`;
  const [ayudaAbierta, setAyudaAbierta] = useState<string | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([
          ["Contactos", num(t.leads), "persona", PALETA_ALEGRIA.ventas],
          ["Visitas", num(t.visitas), "casa", PALETA_ALEGRIA.web],
          ["Presupuestos", num(t.presupuestos), "documento", PALETA_ALEGRIA.camino],
          ["Trabajos firmados", num(t.firmados), "check", PALETA_ALEGRIA.mercado],
          ["Importe firmado", eur(t.firmado), "moneda", PALETA_ALEGRIA.dinero],
          ["Coste en anuncios por trabajo firmado", pago ? eur(inversion / pago) : "-", "megafono", PALETA_ALEGRIA.anuncios],
          ["Tiempo medio hasta la primera llamada", tiempo, "telefono", PALETA_ALEGRIA.aviso],
          ["Seguimientos atrasados", num(resp.v), "campana", resp.v >= 10 ? "#a3505a" : PALETA_ALEGRIA.ia],
        ] as [string, string, string, string][]).map(([k, v, ic, col]) => {
          const ayuda: Record<string, string> = {
            Contactos: "Personas que han entrado en el CRM en estas fechas, por cualquier canal (web, teléfono, WhatsApp, Instagram, recomendación).",
            Visitas: "De esos contactos, a cuántos se les ha hecho ya la visita técnica en casa.",
            Presupuestos: "A cuántos se les ha entregado presupuesto.",
            "Trabajos firmados": "Cuántos han firmado el pedido. Un presupuesto tarda semanas en decidirse: los contactos de estas fechas todavía pueden firmar.",
            "Importe firmado": "Suma de los contratos firmados por contactos de estas fechas.",
            "Coste en anuncios por trabajo firmado": "Lo invertido en anuncios dividido entre los trabajos firmados que vinieron de anuncios. Cuanto más bajo, mejor.",
            "Tiempo medio hasta la primera llamada": "Cuánto tardamos, de media, en llamar a un contacto nuevo. Cuanto antes, más probable que firme.",
            "Seguimientos atrasados": "Contactos con la fecha de seguimiento ya pasada en el CRM: alguien tiene que llamarlos.",
          };
          return (
          <div key={k} className="rounded-[20px] border border-line p-4" style={{ background: tinte(col) }}>
            <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/55"><Loseta n={ic} color={col} tam={30} /><span className="min-w-0 flex-1">{k}</span>{ayuda[k] && <Que texto={ayuda[k]} etiqueta={k} abierto={ayudaAbierta === k} onToggle={() => setAyudaAbierta(ayudaAbierta === k ? null : k)} />}</p>
            <p className="mt-2 font-serif text-[28px] leading-none" style={{ color: col }}>{v}</p>
            {ayudaAbierta === k && <p className="mt-2 rounded-[10px] bg-white/80 px-2.5 py-2 text-[13px] leading-snug text-ink/80">{ayuda[k]}</p>}
          </div>
          );
        })}
      </div>
      <Caja titulo="De la petición al trabajo" fuente={cargando ? "Cargando…" : "CRM · contactos que entraron en el periodo y hasta dónde han llegado"}>
        <Embudo pasos={[["Contactos", t.leads, undefined], ["Visita técnica", t.visitas, undefined], ["Presupuesto entregado", t.presupuestos, undefined], ["Firman el trabajo", t.firmados, undefined]]} />
      </Caja>
      <Caja titulo="Por origen" fuente="CRM (la libreta de clientes) · toca una columna para ordenar">
        <Tabla
          filas={crm}
          inicial="leads"
          vacio="El CRM aún no tiene contactos en este periodo."
          cols={[
            { k: "origen", t: "Origen", v: (r) => r.origen, f: (r) => <span className="flex items-center font-semibold"><LogoCanal canal={r.origen} />{r.origen}</span> },
            { k: "leads", t: "Contactos", v: (r) => r.leads, num: true },
            { k: "visitas", t: "Visitas", v: (r) => r.visitas, num: true },
            { k: "presupuestos", t: "Presupuestos", v: (r) => r.presupuestos, num: true },
            { k: "firmados", t: "Firmadas", v: (r) => r.firmados, num: true },
            { k: "conv", t: "De contacto a trabajo", v: (r) => (r.leads ? r.firmados / r.leads : 0), num: true, f: (r) => (r.leads ? pct((r.firmados / r.leads) * 100) : "-") },
            { k: "firmado", t: "Firmado", v: (r) => r.firmado, num: true, f: (r) => eur(r.firmado) },
            { k: "facturado", t: "Facturado", v: (r) => r.facturado, num: true, f: (r) => eur(r.facturado) },
          ]}
        />
        <p className="mt-3 text-[12.5px] text-ink/50">Sale del CRM, que rellena el equipo. Cuantos más estados y firmas apuntados, más fiel es esta pestaña.</p>
        <p className="mt-2 rounded-[12px] bg-[#fbf6ea] px-3 py-2 text-[13px] text-ink/70">Ojo con los contactos anteriores al 26 de octubre de 2026: vienen del CRM antiguo, que solo apuntaba a quien llegaba a la visita (por eso visitas y contactos casi coinciden). Desde entonces, todo contacto queda apuntado.</p>
      </Caja>
    </>
  );
}

/* ══ cl·v832: portada de dirección, rebote, canales, intención de búsqueda y alertas con criterio ══ */

/** Tarjeta de cifra sin serie diaria (CRM, coste, pendientes). */
function CifraFija({ icono, nombre, ayuda, v, antes, a, b, extra, menosEsMejor = false, pendiente = false }: { icono?: string; nombre: string; ayuda: string; v: string; antes?: string; a?: number; b?: number; extra?: string; menosEsMejor?: boolean; pendiente?: boolean }) {
  const [que, setQue] = useState(false); // cl·v931
  return (
    <div className={`rounded-[20px] border p-4 ${pendiente ? "border-dashed border-ink/25 bg-cream/60" : "border-line"}`} style={pendiente || !icono ? undefined : { background: tinte(ICONO_MEDIDA[icono][1]) }}>
      <span className="flex items-center gap-2.5">{icono && <Loseta n={ICONO_MEDIDA[icono][0]} color={pendiente ? "#a7a39a" : ICONO_MEDIDA[icono][1]} tam={36} />}<span className="min-w-0 flex-1 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60">{nombre}</span><Que texto={ayuda} etiqueta={nombre} abierto={que} onToggle={() => setQue(!que)} /></span>
      {que && <QueTexto texto={ayuda} />}
      <p className={`mt-1.5 font-serif leading-none ${pendiente ? "text-[24px] italic text-ink/45" : "text-[clamp(26px,3.4vw,34px)] font-medium text-ink"}`}>{v}</p>
      {antes !== undefined && a !== undefined && b !== undefined ? <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] text-ink/55"><Delta a={a} b={b} menosEsMejor={menosEsMejor} /><span>antes {antes}</span></div> : null}
      {extra ? <p className="mt-2 text-[12px] text-ink/50">{extra}</p> : null}
    </div>
  );
}

/** Posición media en palabras: en Google, un número más alto es peor. */
function Posicion({ a, b }: { a: number; b: number }) {
  const d = a - b;
  if (Math.abs(d) < 0.3) return <span className="rounded-full bg-cream px-2 py-0.5 text-[12.5px] font-bold text-ink/55">Igual (antes {nf1.format(b)})</span>;
  const mejor = d < 0;
  return <span className={`rounded-full px-2 py-0.5 text-[12.5px] font-bold ${mejor ? "bg-[#ebf1e8] text-[#4d7047]" : "bg-[#f8e8ea] text-[#a3505a]"}`}>{mejor ? "Mejor" : "Peor"}: puesto {nf1.format(a)} (antes {nf1.format(b)})</span>;
}

const CANAL_GA_ES: Record<string, string> = { "Organic Search": "Google sin pagar (y otros buscadores)", "Paid Search": "Anuncios de buscador", Direct: "Directo", "Paid Social": "Anuncios en redes", "Organic Social": "Redes sin pagar", Referral: "Otras webs que nos enlazan", Unassigned: "Sin asignar", "Paid Other": "Otros anuncios", Email: "Correo", Display: "Banners", "Cross-network": "Anuncios de varias redes" };
/* Canales: Analytics y la web los llaman distinto; aquí se juntan en seis grupos que entiende cualquiera */
const GRUPO_GA: Record<string, string> = { "Paid Search": "Google Ads", "Organic Search": "Google sin pagar", "Paid Social": "Meta (anuncios)", "Organic Social": "Redes sin pagar", Direct: "Directo", Referral: "Referidos y otros", "Paid Other": "Referidos y otros", Unassigned: "Referidos y otros", "Organic Shopping": "Referidos y otros", Email: "Referidos y otros", Display: "Referidos y otros", "Cross-network": "Google Ads" };
const grupoWeb = (c: string) => (c === "Google Ads" ? "Google Ads" : c === "Google (búsqueda)" || c === "Otros buscadores" ? "Google sin pagar" : c === "Meta / Instagram" ? "Meta (anuncios)" : c === "Directo o sin dato" ? "Directo" : c === "ChatGPT Ads" ? "ChatGPT Ads" : c === "Asistentes de IA" ? "Asistentes de IA (ChatGPT, etc.)" : "Referidos y otros");
const PLAT_GRUPO: Record<string, string> = { "Google Ads": "google", "Meta (anuncios)": "meta", "ChatGPT Ads": "chatgpt" };
function filasCanal(T: Totales) {
  const g: Record<string, { sesiones: number; interes: number; contactos: number; coste: number }> = {};
  const fila = (k: string) => (g[k] ??= { sesiones: 0, interes: 0, contactos: 0, coste: 0 });
  for (const [c, v] of Object.entries(T.ga.porCanal)) { const f = fila(GRUPO_GA[c] ?? "Referidos y otros"); f.sesiones += v.sesiones; f.interes += v.interes; }
  for (const [c, n] of Object.entries(T.porCanal)) fila(grupoWeb(c)).contactos += n;
  for (const [k, plat] of Object.entries(PLAT_GRUPO)) if (T.ads.porPlat[plat]) fila(k).coste += T.ads.porPlat[plat].coste;
  return Object.entries(g).filter(([, v]) => v.sesiones || v.contactos || v.coste).map(([canal, v]) => ({ canal, ...v, rebote: v.sesiones ? (1 - v.interes / v.sesiones) * 100 : null, conversion: v.sesiones ? (v.contactos / v.sesiones) * 100 : null, cpc: v.coste && v.contactos ? v.coste / v.contactos : null }));
}
function PorCanal({ T, C }: { T: Totales; C: Totales | null }) {
  const filas = filasCanal(T);
  const antes = C ? Object.fromEntries(filasCanal(C).map((r) => [r.canal, r])) : {};
  return (
    <Caja titulo="Cada canal, de un vistazo" fuente="Analytics, web y anuncios · toca una columna para ordenar">
      <Tabla
        filas={filas}
        inicial="sesiones"
        cols={[
          { k: "canal", t: "Canal", v: (r) => r.canal, f: (r) => <span className="inline-flex items-center font-semibold"><LogoCanal canal={r.canal} />{r.canal}</span> },
          { k: "sesiones", t: "Visitas", v: (r) => r.sesiones, num: true, f: (r) => (r.sesiones ? num(r.sesiones) : "-") },
          { k: "rebote", t: "Rebote", v: (r) => r.rebote ?? -1, num: true, f: (r) => (r.rebote === null ? "-" : <span>{pct(r.rebote)}{antes[r.canal]?.rebote != null ? <span className="ml-1 text-[12px] text-ink/45">(antes {pct(antes[r.canal].rebote!)})</span> : null}</span>) },
          { k: "contactos", t: "Contactos", v: (r) => r.contactos, num: true, f: (r) => <span>{num(r.contactos)}{antes[r.canal] ? <span className="ml-1 text-[12px] text-ink/45">(antes {num(antes[r.canal].contactos)})</span> : null}</span> },
          { k: "conversion", t: "Visita a contacto", v: (r) => r.conversion ?? -1, num: true, f: (r) => (r.conversion === null ? "-" : pct(r.conversion)) },
          { k: "coste", t: "Inversión", v: (r) => r.coste, num: true, f: (r) => (r.coste ? eur(r.coste) : "-") },
          { k: "cpc", t: "Coste por contacto en la web", v: (r) => r.cpc ?? 0, num: true, f: (r) => (r.cpc ? eur(r.cpc) : "-") },
        ]}
      />
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink/50">Los contactos son los que llegan a nuestra web. Casi todos los anuncios llevan aún a la página de la agencia, así que su coste por contacto aquí sale más alto que el que da cada plataforma. «Meta» junta anuncios e Instagram: la web no siempre puede distinguirlos.</p>
    </Caja>
  );
}

/* Intención de las búsquedas de Google: marca, comercial (quiere contratar) o informativa */
const INTENCION: Record<string, [string, string]> = { Marca: ["#236278", "#e7f2f5"], Comercial: ["#3f6b39", "#ebf1e8"], Informativa: ["#7c5e27", "#f7efe0"] };
function intencionDe(q: string): "Marca" | "Comercial" | "Informativa" {
  const t = q.toLowerCase();
  if (/ams cerramientos|amscerramientos|ams ventanas/.test(t)) return "Marca";
  // "madrid" solo no basta: "horario obras madrid" es una duda, no una búsqueda de empresa
  if (/(empresa|empresas|instalador|instaladores|presupuesto|precio|precios|cu[aá]nto cuesta|cuanto vale|coste|ventanas? (de )?(pvc|aluminio)|cerramientos?|cerrar (una |la )?terraza|cancelas?|pérgolas?|pergolas?|mosquiteras?|persianas?|contratar|comprar)/.test(t)) return "Comercial";
  return "Informativa";
}
function Intencion({ busquedas, cargando }: { busquedas: { busqueda: string; clics: number; impresiones: number }[]; cargando: boolean }) {
  const t: Record<string, { clics: number; impr: number }> = { Marca: { clics: 0, impr: 0 }, Comercial: { clics: 0, impr: 0 }, Informativa: { clics: 0, impr: 0 } };
  for (const b of busquedas) { const i = intencionDe(b.busqueda); t[i].clics += b.clics; t[i].impr += b.impresiones; }
  const total = Object.values(t).reduce((x, v) => x + v.clics, 0);
  return (
    <Caja titulo="¿Nos buscan para contratar o para informarse?" plegada="Reparto de las búsquedas entre quien quiere contratar y quien solo mira" fuente={cargando ? "Cargando…" : "Search Console · las 100 búsquedas con más clics"}>
      {total ? (
        <>
          <div className="flex h-8 overflow-hidden rounded-full">
            {(["Comercial", "Marca", "Informativa"] as const).map((k) => t[k].clics ? <div key={k} className="flex items-center justify-center text-[12px] font-bold" style={{ width: `${(t[k].clics / total) * 100}%`, background: INTENCION[k][1], color: INTENCION[k][0] }}>{(t[k].clics / total) * 100 >= 12 ? `${k} ${num((t[k].clics / total) * 100)} %` : ""}</div> : null)}
          </div>
          <ul className="mt-3 grid gap-2 text-[14px] sm:grid-cols-3">
            <li><b style={{ color: INTENCION.Comercial[0] }}>Comercial: {num(t.Comercial.clics)} clics.</b> Buscan empresa, precio o instalación: posibles clientes.</li>
            <li><b style={{ color: INTENCION.Marca[0] }}>Marca: {num(t.Marca.clics)} clics.</b> Ya nos conocen y nos buscan por el nombre.</li>
            <li><b style={{ color: INTENCION.Informativa[0] }}>Informativa: {num(t.Informativa.clics)} clics.</b> Dudas de bricolaje o definiciones: rara vez contratan.</li>
          </ul>
          <p className="mt-2 text-[12.5px] text-ink/50">Google no dice qué búsqueda acabó en contacto, así que esto no atribuye ventas a palabras concretas: solo separa el tipo de visita.</p>
        </>
      ) : <p className="text-[14px] text-ink/50">Sin búsquedas en este periodo.</p>}
    </Caja>
  );
}

/* Rebote: global, por canal, dispositivo, zona, nuevos/recurrentes y páginas que pierden clientes */
const reb = (f: { sesiones: number; interes: number }) => (f.sesiones ? (1 - f.interes / f.sesiones) * 100 : 0);
const NOMBRE_DISP: Record<string, string> = { mobile: "Móvil", desktop: "Ordenador", tablet: "Tableta" };
const esInformativa = (p: string) => /^\/(blog|glosario|revista\/lecturas)(\/|$)/.test(p);
function BloqueRebote({ T, C, rebote, cargando, conectado }: { T: Totales; C: Totales | null; rebote: Detalle["rebote"]; cargando: boolean; conectado: boolean }) {
  if (!conectado) return null;
  if (!T.ga.sesiones) return <Caja titulo="Rebote: quién se va sin hacer nada" fuente="Analytics"><p className="text-[14px] text-ink/60">Analytics aún no tiene visitas para estas fechas (el día de hoy llega con retraso).</p></Caja>;
  const r = reb({ sesiones: T.ga.sesiones, interes: T.ga.interes }), rC = C && C.ga.sesiones ? reb({ sesiones: C.ga.sesiones, interes: C.ga.interes }) : null;
  const canales = filasCanal(T).filter((x) => x.sesiones >= 20).sort((a, b) => b.sesiones - a.sesiones);
  const madrid = rebote?.zona.filter((z) => /madrid/i.test(z.clave)) ?? [];
  const resto = rebote?.zona.filter((z) => !/madrid/i.test(z.clave)) ?? [];
  const agrega = (l: FilaRebote[]) => l.reduce((x, f) => ({ sesiones: x.sesiones + f.sesiones, interes: x.interes + f.interes }), { sesiones: 0, interes: 0 });
  const filasMini: [string, { sesiones: number; interes: number }][] = [
    ...(rebote?.dispositivo ?? []).map((d) => [NOMBRE_DISP[d.clave] ?? d.clave, d] as [string, FilaRebote]),
    ...(madrid.length ? [["Madrid (comunidad)", agrega(madrid)] as [string, { sesiones: number; interes: number }]] : []),
    ...(resto.length ? [["Resto de España y fuera", agrega(resto)] as [string, { sesiones: number; interes: number }]] : []),
    ...(rebote?.tipo ?? []).map((t) => [t.clave === "new" ? "Visitantes nuevos" : t.clave === "returning" ? "Visitantes que repiten" : t.clave, t] as [string, FilaRebote]),
  ];
  const paginas = (rebote?.paginas ?? []).map((p) => ({ pagina: p.clave, tipo: esInformativa(p.clave) ? "Blog o consulta" : "Servicio", sesiones: p.sesiones, rebote: reb(p), contactos: p.eventos, conv: p.sesiones ? (p.eventos / p.sesiones) * 100 : 0, seg: p.interes ? p.segundos / p.interes : 0 }));
  const servicio = paginas.filter((p) => p.tipo === "Servicio" && p.sesiones >= 20);
  const mediaServ = servicio.length ? servicio.reduce((x, p) => x + p.rebote * p.sesiones, 0) / servicio.reduce((x, p) => x + p.sesiones, 0) : 0;
  const pierden = servicio.filter((p) => p.rebote >= mediaServ + 8 && p.conv < 1.5).sort((a, b) => b.sesiones - a.sesiones);
  return (
    <>
      <Caja titulo="Rebote: quién se va sin hacer nada" fuente={cargando ? "Cargando…" : "Analytics · sesiones sin interacción (menos de 10 s, una sola página y ninguna acción)"}>
        <div className="flex flex-wrap items-end gap-4">
          <p className="font-serif text-[40px] leading-none text-ink">{pct(r)}</p>
          <div className="pb-1 text-[14px] text-ink/65">
            {rC !== null ? <span className={r <= rC ? "font-bold text-[#4d7047]" : "font-bold text-[#a3505a]"}>{Math.abs(r - rC) < 1 ? "Igual que antes" : r < rC ? `Mejor: ${nf1.format(rC - r)} puntos menos` : `Peor: ${nf1.format(r - rC)} puntos más`}</span> : null}
            {rC !== null ? <span> (antes {pct(rC)})</span> : null}
            <span className="block">Interacción: {pct(100 - r)} de las visitas hacen algo en la web.</span>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-ink/55">No hay un rebote «bueno» universal: se compara cada grupo con su propio pasado y con los demás grupos. Un artículo del blog que resuelve una duda rápida puede rebotar mucho y estar bien; una página de servicio que rebota mucho está perdiendo clientes.</p>
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/45">Por canal</p>
            <ul className="space-y-1.5">{canales.map((c) => <li key={c.canal} className="flex items-center justify-between gap-3 text-[14px]"><span>{c.canal} <span className="text-ink/40">· {num(c.sesiones)} visitas</span></span><b className={c.rebote! > r + 8 ? "text-[#a3505a]" : "text-ink"}>{pct(c.rebote!)}</b></li>)}</ul>
          </div>
          <div>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/45">Por dispositivo, zona y tipo de visitante</p>
            {rebote ? <ul className="space-y-1.5">{filasMini.filter(([, f]) => f.sesiones >= 10).map(([k, f]) => <li key={k} className="flex items-center justify-between gap-3 text-[14px]"><span>{k} <span className="text-ink/40">· {num(f.sesiones)} visitas</span></span><b className={reb(f) > r + 8 ? "text-[#a3505a]" : "text-ink"}>{pct(reb(f))}</b></li>)}</ul> : <p className="text-[14px] text-ink/50">{cargando ? "Cargando…" : "Sin datos de Analytics para este periodo."}</p>}
          </div>
        </div>
      </Caja>
      <Caja titulo="Páginas que pueden estar perdiendo clientes" plegada="Páginas de servicio con más rebote que la media" fuente="Analytics · páginas de servicio con más rebote que la media y casi sin contactos">
        {pierden.length ? (
          <ul className="space-y-2">{pierden.map((p) => <li key={p.pagina} className="rounded-[14px] bg-[#f8e8ea] px-3 py-2 text-[14px] text-ink"><b>{p.pagina}</b>: {num(p.sesiones)} visitas, rebote {pct(p.rebote)} (la media de las páginas de servicio es {pct(mediaServ)}), {num(p.contactos)} acciones clave. Merece revisar qué ve la gente al llegar.</li>)}</ul>
        ) : <p className="text-[14px] text-[#3f6b39]">{rebote ? "Ninguna página de servicio destaca para mal en este periodo." : cargando ? "Cargando…" : "Sin datos."}</p>}
        <div className="mt-4">
          <Tabla
            filas={paginas}
            inicial="sesiones"
            cols={[
              { k: "p", t: "Página de entrada", v: (x) => x.pagina, f: (x) => <span className="font-semibold">{x.pagina}</span> },
              { k: "t", t: "Tipo", v: (x) => x.tipo },
              { k: "sesiones", t: "Visitas", v: (x) => x.sesiones, num: true },
              { k: "rebote", t: "Rebote", v: (x) => x.rebote, num: true, f: (x) => pct(x.rebote) },
              { k: "contactos", t: "Acciones clave", v: (x) => x.contactos, num: true },
              { k: "seg", t: "Segundos de interacción", v: (x) => x.seg, num: true, f: (x) => (x.seg ? num(x.seg) : "-") },
            ]}
          />
          <p className="mt-2 text-[12.5px] text-ink/50">Acciones clave: pedir visita, enviar un formulario, pulsar WhatsApp o llamar (los eventos clave de Analytics). Solo cuentan quienes aceptan las cookies de analítica.</p>
        </div>
      </Caja>
    </>
  );
}

/* Alertas con criterio: solo con volumen suficiente, comparando periodos equivalentes y con una acción propuesta */
function Alertas({ T, C, datos, largo, b }: { T: Totales; C: Totales | null; datos: DatosMesa; largo: number; b: string }) {
  const al: { tono: "rojo" | "ambar"; texto: string; accion: string }[] = [];
  if (C) {
    const pv = T.peticiones ? (T.visitas / T.peticiones) * 100 : 0, pvC = C.peticiones ? (C.visitas / C.peticiones) * 100 : 0;
    if (T.peticiones >= 10 && C.peticiones >= 10 && pvC - pv >= 10) al.push({ tono: "ambar", texto: `Llegan ${T.peticiones > C.peticiones ? "más contactos" : "contactos"}, pero piden menos la visita: ${num(pv)} % frente a ${num(pvC)} % antes.`, accion: "Mira en «Cada canal» de dónde vienen los que no la piden y revisa su calidad con el equipo." });
    const cpl = T.ads.conv >= 5 ? T.ads.coste / T.ads.conv : 0, cplC = C.ads.conv >= 5 ? C.ads.coste / C.ads.conv : 0;
    if (cpl && cplC && cpl >= cplC * 1.3 && T.ads.coste >= 300) al.push({ tono: "rojo", texto: `El coste por contacto de anuncios sube a ${eur(cpl)} (antes ${eur(cplC)}).`, accion: "Revisa en «Anuncios» qué campaña gasta más sin traer contactos." });
    const dp = delta(T.peticiones, C.peticiones);
    if (C.peticiones >= 15 && dp !== null && dp <= -30) al.push({ tono: "rojo", texto: `Bajan los contactos un ${num(Math.abs(dp))} %: ${num(T.peticiones)} frente a ${num(C.peticiones)}.`, accion: "Comprueba que los formularios funcionan y si ha bajado alguna campaña o la visibilidad en Google." });
    const r = T.ga.sesiones >= 200 ? reb({ sesiones: T.ga.sesiones, interes: T.ga.interes }) : 0, rC = C.ga.sesiones >= 200 ? reb({ sesiones: C.ga.sesiones, interes: C.ga.interes }) : 0;
    if (r && rC && r - rC >= 8) al.push({ tono: "ambar", texto: `El rebote sube ${nf1.format(r - rC)} puntos (${pct(r)}, antes ${pct(rC)}).`, accion: "En «La web» mira qué canal o página lo explica." });
  }
  // Días laborables seguidos sin ningún contacto, cuando lo normal es tener alguno
  const media = T.peticiones / Math.max(1, largo);
  if (media >= 1) {
    let seguidos = 0;
    const ultimoCompleto = b === datos.hoy ? suma(b, -1) : b;
    for (let i = 0; i < Math.min(largo, 10); i++) {
      const d = suma(ultimoCompleto, -i); const ds = new Date(`${d}T12:00:00Z`).getUTCDay();
      if (ds === 0 || ds === 6) continue;
      if ((datos.web[d]?.peticiones ?? 0) === 0) seguidos++; else break;
    }
    if (seguidos >= 2) al.push({ tono: "rojo", texto: `${seguidos} días laborables seguidos sin ningún contacto por la web (lo normal son unos ${nf1.format(media)} al día).`, accion: "Prueba a enviar el formulario y a pulsar WhatsApp desde el móvil: puede haber algo roto." });
  }
  // Ficha de Google: caída de veces que salimos en la búsqueda de Google (con volumen mínimo)
  const fr = datos.redes?.ficha.diario ?? [];
  if (fr.length) {
    const ult = fr.reduce((m, r) => (r[1] + r[2] > 0 && r[0] > m ? r[0] : m), "");
    const fin = ult && ult < b ? ult : b, n = Math.max(1, largo), ini = suma(fin, -(n - 1));
    const s = (x: string, y: string) => fr.filter((r) => r[0] >= x && r[0] <= y).reduce((t, r) => t + r[1], 0);
    const ahora = s(ini, fin), antes = s(suma(ini, -n), suma(ini, -1));
    if (antes >= 100 && ahora <= antes * 0.7) al.push({ tono: "rojo", texto: `La ficha de Google sale bastante menos en la búsqueda de Google: ${num(ahora)} veces frente a ${num(antes)} antes.`, accion: "Mira la pestaña «Ficha de Google, Instagram y reseñas»: publicar en la ficha, pedir reseñas a clientes y revisar que la ficha esté completa ayuda a recuperarlo." });
  }
  if (datos.redes?.actualizado && entre(datos.redes.actualizado, datos.hoy) > 3) al.push({ tono: "ambar", texto: `La ficha de Google e Instagram no se actualizan desde el ${fechaLarga(datos.redes.actualizado)}.`, accion: "Revisar la conexión de Supermetrics." });
  // Fuente de anuncios desactualizada
  if (datos.anuncios.actualizado && entre(datos.anuncios.actualizado, datos.hoy) > 3) al.push({ tono: "ambar", texto: `Los datos de anuncios no se actualizan desde el ${fechaLarga(datos.anuncios.actualizado)}.`, accion: "Revisar la conexión de Supermetrics." });
  if (!al.length) return null;
  /* cl·v925: una sola línea cerrada con el resumen de las alertas; "+" las abre */
  const rojas = al.filter((x) => x.tono === "rojo").length;
  const corto = (t: string) => t.replace(/^(El |La |Los |Las )/, "").split(/[:(]/)[0].trim().replace(/\.$/, "");
  return (
    <Plegable id="pl-alertas" icono="campana" color={rojas ? "#a3505a" : "#c9a36a"} titulo={`${al.length} ${al.length === 1 ? "alerta" : "alertas"}${rojas ? ` (${rojas} ${rojas === 1 ? "importante" : "importantes"})` : ""}`} pista={al.map((x) => corto(x.texto)).join(" · ")}>
      <div className="space-y-2 pt-1">
        {al.map((x, i) => (
          <div key={i} className={`rounded-[16px] border-2 px-4 py-3 text-[14.5px] ${x.tono === "rojo" ? "border-[#a3505a] bg-[#f8e8ea]" : "border-[#c9a36a] bg-[#f7efe0]"}`}>
            <b className={x.tono === "rojo" ? "text-[#a3505a]" : "text-[#7c5e27]"}>Alerta: </b><span className="text-ink">{x.texto}</span>
            <span className="block text-[13.5px] text-ink/65">Qué hacer: {x.accion}</span>
          </div>
        ))}
      </div>
    </Plegable>
  );
}

/* Clarity: dónde se atascan (clics de rabia, clics en lo que no responde, entran y se van) (cl·v835) */
function BloqueClarity({ c, cargando }: { c: Detalle["clarity"]; cargando: boolean }) {
  const p = (v: number | null) => (v === null ? "-" : `${nf1.format(v)} %`);
  const pags = (c?.paginas ?? []).filter((x) => x.sesiones >= 15);
  const peor = (k: "rabia_pct" | "muertos_pct" | "vuelven_pct") => [...pags].filter((x) => (x[k] ?? 0) > 0).sort((a, b) => (b[k] ?? 0) - (a[k] ?? 0))[0];
  const r = peor("rabia_pct"), m = peor("muertos_pct"), v = peor("vuelven_pct");
  return (
    <Caja titulo="Dónde se atasca la gente (Clarity)" plegada="Clics rabiosos, clics sin respuesta y scroll, según Microsoft Clarity" fuente={cargando ? "Cargando…" : c?.dias ? `Microsoft Clarity · ${c.dias} ${c.dias === 1 ? "día guardado" : "días guardados"} en este periodo · solo quien acepta cookies` : "Microsoft Clarity"}>
      {!c || !c.dias ? (
        <p className="text-[14px] text-ink/55">{cargando ? "Cargando…" : "No hay datos de Clarity guardados para estas fechas. Se guardan cada mañana desde el 11 de octubre de 2026 (Microsoft solo deja pedir los últimos días)."}</p>
      ) : (
        <>
          <ul className="mb-4 space-y-1.5 text-[14.5px] text-ink/85">
            {r ? <li><b>Más clics de rabia</b> (pulsan varias veces seguidas porque algo no va): <b>{r.clave}</b>, en el {p(r.rabia_pct)} de las visitas.</li> : null}
            {m ? <li><b>Más clics en cosas que no responden</b> (creen que es un botón y no lo es): <b>{m.clave}</b>, en el {p(m.muertos_pct)}.</li> : null}
            {v ? <li><b>Más gente que entra y se vuelve atrás enseguida</b>: <b>{v.clave}</b>, el {p(v.vuelven_pct)}.</li> : null}
            {!r && !m && !v ? <li>Ninguna página destaca por atascos en este periodo.</li> : null}
          </ul>
          <Tabla
            filas={c.paginas}
            inicial="sesiones"
            cols={[
              { k: "p", t: "Página", v: (x) => x.clave, f: (x) => <span className="font-semibold">{x.clave || "/"}</span> },
              { k: "sesiones", t: "Visitas", v: (x) => x.sesiones, num: true },
              { k: "rabia", t: "Clics de rabia", v: (x) => x.rabia_pct ?? -1, num: true, f: (x) => p(x.rabia_pct) },
              { k: "muertos", t: "Clics sin respuesta", v: (x) => x.muertos_pct ?? -1, num: true, f: (x) => p(x.muertos_pct) },
              { k: "vuelven", t: "Se vuelven enseguida", v: (x) => x.vuelven_pct ?? -1, num: true, f: (x) => p(x.vuelven_pct) },
              { k: "scroll", t: "Bajan (media)", v: (x) => x.scroll ?? -1, num: true, f: (x) => (x.scroll === null ? "-" : `${x.scroll} %`) },
            ]}
          />
          <p className="mt-2 text-[12.5px] text-ink/50">Para ver el porqué, abre las grabaciones de esa página en clarity.microsoft.com (se ve el ratón y los dedos de la gente, sin datos personales).</p>
        </>
      )}
    </Caja>
  );
}

/* ── Ficha de Google, Instagram y reseñas (cl·v836) ──
   La ficha de Google llega con unos 3 días de retraso: el periodo se corta en su último día con datos
   y la comparación se desplaza igual, para no comparar días vacíos con días llenos. */
function BloqueRedes({ r, a, b, ca, cb, compara }: { r: Redes | null; a: string; b: string; ca: string; cb: string; compara: Compara }) {
  if (!r) return <Caja titulo="Ficha de Google, Instagram y reseñas"><p className="text-[14px] text-ink/55">Aún no hay datos. Se cargan cada mañana.</p></Caja>;
  const n = entre(a, b);
  const sinC = compara === "no";
  // Ficha: recorte por retraso
  const fd = r.ficha.diario;
  const ultF = fd.reduce((m, x) => (x[1] + x[2] > 0 && x[0] > m ? x[0] : m), "");
  const recorte = ultF && b > ultF ? Math.min(n - 1, entre(ultF, b) - 1) : 0;
  const fb = suma(b, -recorte), fcb = suma(cb, -recorte);
  const sumaF = (x: string, y: string) => { const t = [0, 0, 0, 0, 0]; let dias = 0; for (const f of fd) if (f[0] >= x && f[0] <= y) { dias++; for (let i = 0; i < 5; i++) t[i] += Number(f[i + 1]); } return { t, dias }; };
  const F = sumaF(a, fb), FC = sinC ? null : sumaF(ca, fcb);
  const primeraF = fd[0]?.[0] ?? "";
  // Instagram
  const id = r.instagram.diario;
  const sumaI = (x: string, y: string) => { let alc = 0, vis = 0, nue = 0, nueDias = 0, dias = 0; for (const f of id) if (f[0] >= x && f[0] <= y) { dias++; alc += f[1]; vis += f[2]; if (f[3] !== null) { nue += f[3]; nueDias++; } } return { alcMedio: dias ? alc / dias : 0, vis, nue, nueDias, dias }; };
  const I = sumaI(a, b), IC = sinC ? null : sumaI(ca, cb);
  const primeraI = id[0]?.[0] ?? "";
  const hayC = (x: { dias: number } | null) => !!x && x.dias > 0;
  const filaF: [string, string, number][] = [
    ["Te ven en la búsqueda de Google", "Veces que la ficha sale al buscar en Google (por ejemplo «ventanas pvc Alcalá de Henares»).", 0],
    ["Te ven en Google Maps", "Veces que la ficha sale en el mapa.", 1],
    ["Pulsan «Sitio web»", "Desde la ficha, entran en la web.", 2],
    ["Pulsan «Llamar»", "Llamadas hechas desde la ficha.", 3],
    ["Piden «Cómo llegar»", "Piden la ruta a la oficina.", 4],
  ];
  // Reseñas: variación desde la anotación más antigua guardada
  const desde = (fuente: string) => r.historial_resenas.filter((h) => h[1] === fuente).sort((x, y) => (x[0] < y[0] ? -1 : 1))[0];
  return (
    <>
      <Caja titulo="Reseñas: lo que dicen de nosotros" fuente="Google, automático">
        <div className="grid gap-3 sm:grid-cols-3">
          {r.resenas.map((x) => {
            const h = desde(x.fuente);
            const nuevas = h && h[0] < x.fecha ? x.total - h[3] : null;
            /* cl·v934: cada reseña con su logo, estrellas pintadas y color según la nota */
            const sobre5 = x.escala === 10 ? x.nota / 2 : x.nota;
            const col = sobre5 >= 4.5 ? "#2f9a62" : sobre5 >= 4 ? "#c79a00" : "#a3505a";
            return (
              <div key={x.fuente} className="rounded-[20px] border border-line p-4" style={{ background: tinte(col) }}>
                <p className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-[10px] border border-line bg-white"><LogoMarca nombre={x.fuente} tam={24} /></span><span className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60">{x.fuente}</span></p>
                <p className="mt-2 flex items-end gap-2"><span className="font-serif text-[34px] leading-none" style={{ color: col }}>{nf1.format(x.nota)}</span><span className="pb-1 text-[13px] text-ink/55">{x.escala === 10 ? "sobre 10" : "sobre 5"}</span></p>
                <p className="mt-1.5 text-[18px] leading-none tracking-[2px]" aria-label={`${nf1.format(sobre5)} de 5 estrellas`} style={{ color: col }}>{"★".repeat(Math.round(sobre5))}<span className="text-ink/20">{"★".repeat(5 - Math.round(sobre5))}</span></p>
                <p className="mt-2 text-[13px] text-ink/70">{num(x.total)} opiniones{x.auto ? "" : " (apuntado a mano)"}{nuevas !== null ? ` · ${nuevas >= 0 ? "+" : ""}${num(nuevas)} desde el ${fechaLarga(h![0])}` : ""}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-ink/60">Instagram y Google son la prueba de confianza de la web. Si una nota cambia, hay que cambiarla también en la web para que coincida: díselo a Claude.</p>
      </Caja>

      <Caja titulo="Ficha de Google (Google Maps y búsqueda)" fuente={`Ficha de Google · datos hasta el ${ultF ? fechaLarga(ultF) : "(sin datos)"} · Google los da con unos 3 días de retraso`}>
        {recorte > 0 ? <p className="mb-3 rounded-[12px] bg-cream px-3 py-2 text-[13px] text-ink/65">Google aún no ha dado los últimos {recorte} {recorte === 1 ? "día" : "días"}: aquí se cuenta hasta el {fechaLarga(fb)}{sinC ? "" : ", y la comparación igual"}.</p> : null}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {filaF.map(([t, ayuda, i]) => (
            <CifraFija key={t} icono={["sesiones", "margen", "organico", "pulsaciones", "comerciales"][i]} nombre={t} ayuda={ayuda} v={num(F.t[i])} {...(hayC(FC) && FC!.t ? { a: F.t[i], b: FC!.t[i], antes: num(FC!.t[i]) } : {})} extra={!sinC && !hayC(FC) ? `Sin datos antes (se guardan desde el ${fechaLarga(primeraF)})` : undefined} />
          ))}
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-ink/60">Es la ficha que sale a la derecha en Google y en el mapa. Las llamadas y «Sitio web» desde aquí son clientes muy calientes: ya nos estaban buscando.</p>
      </Caja>

      <Caja titulo={`Instagram @${r.instagram.usuario ?? "amscerramientos"} (sin anuncios)`} explica={EXPLICA["Instagram (sin anuncios)"]} plegada={`${num(r.instagram.seguidores)} seguidores · alcance, visualizaciones y nuevos seguidores`} fuente={`Instagram · ${num(r.instagram.seguidores)} seguidores y ${num(r.instagram.publicaciones)} publicaciones al ${fechaLarga(r.actualizado)}`}>
        <div className="grid gap-3 sm:grid-cols-3">
          <CifraFija nombre="Personas alcanzadas al día" ayuda="Cuentas distintas que ven algo nuestro, de media cada día." v={num(I.alcMedio)} {...(hayC(IC) ? { a: I.alcMedio, b: IC!.alcMedio, antes: num(IC!.alcMedio) } : {})} extra={!sinC && !hayC(IC) ? `Sin datos antes (se guardan desde el ${fechaLarga(primeraI)})` : undefined} />
          <CifraFija nombre="Visualizaciones" ayuda="Veces que se ven nuestros reels, publicaciones e historias." v={num(I.vis)} {...(hayC(IC) ? { a: I.vis, b: IC!.vis, antes: num(IC!.vis) } : {})} />
          <CifraFija nombre="Nuevos seguidores" ayuda="Gente que empieza a seguirnos (Instagram solo da los últimos 30 días)." v={I.nueDias ? num(I.nue) : "Sin dato"} {...(IC && I.nueDias && IC.nueDias >= I.nueDias * 0.9 ? { a: I.nue, b: IC.nue, antes: num(IC.nue) } : {})} extra={I.nueDias && I.nueDias < I.dias ? `Contados ${I.nueDias} de ${I.dias} días` : !sinC && IC && IC.nueDias < I.nueDias * 0.9 ? "Sin comparar: antes no hay datos completos" : undefined} />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-ink/60">Esto es Instagram sin pagar. Lo que se paga en Instagram está en la pestaña «Anuncios» (Meta). Las visitas a la web que llegan desde Instagram salen en «Resumen» como «Redes sin pagar».</p>
      </Caja>
    </>
  );
}

/* Accesos (27-oct, cl·v882; Ig: "unas casillas con colores con los links del cuadro de mandos"):
   las herramientas privadas de marketing, a un toque. En la demo salen igual, pero sin abrir las direcciones privadas.
   Las que aún no existen salen apagadas con "Próximamente". */
type Acceso = { t: string; d: string; fondo: string; borde: string; icono: string; color: string; href?: string; pestana?: Pestana; tema?: string; fuera?: boolean };
/** Abre una parte (batería) de la mesa desde cualquier sitio: lo escuchan la vista sencilla y la completa. */
const abrirParte = (id: string) => window.dispatchEvent(new CustomEvent("mesa-tema", { detail: id }));
const ACCESOS: Acceso[] = [
  { t: "La lupa", icono: "lupa", color: "#2a6f86", d: "La web con lo que hace la gente encima: dónde tocan, hasta dónde bajan, conclusiones", fondo: "#e2f1f5", borde: "#1c8caa", href: "/lupa-m7q3x9k2" },
  { t: "Coste por cliente", icono: "moneda", color: "#c79a00", d: "Lo invertido frente a contactos, visitas y trabajos firmados", fondo: "#fbf3df", borde: "#b8924a", pestana: "ventas" },
  { t: "CRM", icono: "persona", color: "#2f6fd0", d: "Contactos, visitas y trabajos, de cada persona", fondo: "#e7efe6", borde: "#5d7a57", href: "/crm-rf2026-x7k2p9" },
  { t: "Plan de marketing", icono: "documento", color: "#7a4fd0", d: "La guía viva del plan, con lo hecho y lo pendiente", fondo: "#f3e6e2", borde: "#a8574a", href: "/plan-fk6o7n1hnhw1r8" },
  { t: "Clarity", icono: "mapa", color: "#1a3d47", d: "Grabaciones de visitas y mapas de Microsoft", fondo: "#e8e6f3", borde: "#5b569c", href: "https://clarity.microsoft.com/", fuera: true },
  { t: "Espejo de la IA", icono: "espejo", color: "#d9822b", d: "Qué dicen de nosotros ChatGPT, Gemini y Claude", fondo: "#f6eedc", borde: "#b8924a", tema: "dicen" },
  { t: "Vigía de la competencia", icono: "catalejo", color: "#1d6b3a", d: "Sus webs, reseñas y puestos en Google, cada semana", fondo: "#e8efe5", borde: "#5d7a57", tema: "mercado" },
];

function Accesos({ irA, sinId, demo }: { irA: (p: Pestana) => void; sinId?: boolean; demo?: boolean }) {
  return (
    <div className="mt-5 scroll-mt-4" id={sinId ? undefined : "mesa-herramientas"}>
      <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink/55">Herramientas</p>
      <ul className="mt-2 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {ACCESOS.map((x) => {
          const listo = !!(x.href || x.pestana || x.tema);
          const dentro = (
            <>
              <span className="flex items-start justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2.5"><Loseta n={x.icono} color={x.color} tam={40} /><span className="text-[16px] font-semibold leading-tight text-ink">{x.t}</span></span>
                <span className="text-[15px] text-ink/50" aria-hidden="true">{listo ? (x.fuera ? "↗" : "→") : ""}</span>
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-ink/60">{x.d}</span>
              {!listo && <span className="mt-2 inline-block rounded-full bg-white px-2.5 py-0.5 text-[11.5px] font-semibold text-ink/55">Próximamente</span>}
            </>
          );
          const clase = `flex h-full flex-col justify-start rounded-[16px] border-l-[5px] px-4 py-3 text-left transition-[filter,box-shadow] ${listo ? "hover:shadow-md hover:brightness-[1.02]" : "opacity-70"}`;
          const estilo = { backgroundColor: x.fondo, borderColor: x.borde };
          return (
            <li key={x.t}>
              {x.href && demo ? (
                <div className={clase} style={estilo}>{dentro}<span className="mt-2 inline-block whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-[12px] font-semibold text-ink/55">Ejemplo: aquí se abriría</span></div>
              ) : x.href ? (
                <a href={x.href} target="_blank" rel="noopener noreferrer" className={clase} style={estilo}>{dentro}<span className="mt-2 inline-block whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-[12px] font-semibold text-ink/55">Se abre aparte; la mesa se queda aquí</span></a>
              ) : x.pestana ? (
                <button type="button" onClick={() => irA(x.pestana!)} className={`${clase} w-full`} style={estilo}>{dentro}</button>
              ) : x.tema ? (
                <button type="button" onClick={() => abrirParte(x.tema!)} className={`${clase} w-full`} style={estilo}>{dentro}</button>
              ) : (
                <div className={clase} style={estilo}>{dentro}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* Temas (27-oct, cl·v889; Ig: "arriba Tu web, Lo que dicen de ti, Tu mercado, Tus anuncios, Lo tuyo,
   y que al tocar se despliegue su sección, bien completa"). Las luces y su detalle salen de
   lib/panelCliente.ts (últimos 28 días frente a los 28 anteriores, datos reales). */
function LuzTema({ luz, g = false }: { luz: Luz; g?: boolean }) {
  const s = g ? 14 : 9;
  return <span className="inline-block shrink-0 rounded-full" style={{ width: s, height: s, background: LUZ[luz].c, boxShadow: `0 0 0 ${g ? 4 : 3}px ${LUZ[luz].c}26, 0 0 ${g ? 12 : 7}px ${LUZ[luz].c}66` }} aria-hidden="true" />;
}
function Temas({ temas, resumen }: { temas: Modulo[]; resumen?: Resumen }) {
  const [abierto, setAbierto] = useState<string | null>(null);
  useEffect(() => {
    const f = (e: Event) => { setAbierto(String((e as CustomEvent).detail)); setTimeout(() => document.getElementById("mesa-temas")?.scrollIntoView({ behavior: suave(), block: "start" }), 50); };
    window.addEventListener("mesa-tema", f);
    return () => window.removeEventListener("mesa-tema", f);
  }, []);
  const m = temas.find((t) => t.id === abierto);
  return (
    <div className="mt-5 scroll-mt-4" id="mesa-temas">
      {resumen && (
        <p className="mb-3 text-[15px] leading-relaxed text-ink/80"><span className="font-serif text-[19px] italic text-ink">{resumen.titulo}.</span> {(resumen.puntos?.length ? resumen.puntos : [resumen.texto]).join(" ")}</p>
      )}
      <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0" aria-label="Cómo va cada tema">
        {temas.map((t) => (
          <li key={t.id} className="shrink-0">
            <button type="button" aria-expanded={abierto === t.id} onClick={() => setAbierto(abierto === t.id ? null : t.id)} className={`flex h-full w-full min-w-[150px] flex-col gap-1.5 rounded-[16px] border px-4 py-3 text-left transition-colors ${abierto === t.id ? "border-ink bg-[#fbf6ea]" : "border-line bg-white hover:border-ink/40"}`}>
              <span className="flex items-center gap-2.5"><Loseta n={(t.icono ?? ICONO_AREA[t.id]?.[0]) || "estrella"} color={t.color ?? ICONO_AREA[t.id]?.[1] ?? "#1a3d47"} tam={36} /><span className="text-[15.5px] font-semibold text-ink">{t.titulo}</span></span>
              <span className="flex items-center gap-1.5 text-[13px] leading-snug text-ink/65"><LuzTema luz={t.luz} />{t.estado ?? LUZ[t.luz].t} · {abierto === t.id ? "cerrar" : "ver"}</span>
            </button>
          </li>
        ))}
      </ul>
      {m && (
        <section className="mt-3 rounded-[20px] border border-line bg-white px-5 py-4" aria-label={m.titulo}>
          <div className="flex items-start justify-between gap-3">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1"><Loseta n={(m.icono ?? ICONO_AREA[m.id]?.[0]) || "estrella"} color={m.color ?? ICONO_AREA[m.id]?.[1] ?? "#1a3d47"} tam={40} /><span className="font-serif text-[21px] italic text-ink">{m.titulo}</span><span className="text-[13px] text-ink/50">{m.que} · últimos 28 días</span></p>
            <button type="button" onClick={() => setAbierto(null)} className="min-h-[44px] shrink-0 rounded-full border border-line px-4 text-[15px] font-semibold text-ink hover:border-ink">Cerrar</button>
          </div>
          <p className="mt-1 text-[15px] leading-snug text-ink/80">{m.conclusion}</p>
          <ul className="mt-3 divide-y divide-line">
            {m.filas.map((f, i) => (
              <li key={i} className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-2.5 text-[14.5px]">
                <span className="flex items-center gap-2 text-ink/70">{f.luz ? <LuzTema luz={f.luz} /> : null}<LogoFila texto={f.t} />{f.t}</span>
                <span className="max-w-[640px] text-right font-semibold text-ink">{f.v}</span>
              </li>
            ))}
          </ul>
          {m.enlaces.length > 0 && (
            <p className="mt-3 flex flex-wrap gap-2">
              {m.enlaces.filter((e) => !e.href.startsWith("/mesa-")).map((e) => <a key={e.href} href={e.href} {...(/^\/(crm|plan)-/.test(e.href) ? { target: "_blank", rel: "noopener" } : {})} className="inline-flex min-h-[40px] items-center rounded-full bg-yellow px-5 text-[14px] font-semibold text-ink">{e.t} →</a>)}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

/* ── Ayudas para quien no sabe nada (27-oct, cl·v890) ──
   Vista sencilla / completa, guía de cuatro pasos, 
   qué hago hoy, relojes con su "¿Qué es esto?", pregúntale a la mesa y barra fija en el móvil. */

function Ayudas({ vista, cambiaVista, abreGuia, resumen, tareas }: { vista: "sencilla" | "completa"; cambiaVista: (v: "sencilla" | "completa") => void; abreGuia: () => void; resumen?: Resumen; tareas: Tarea[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="inline-flex rounded-full border border-line bg-white p-0.5 text-[14px]">
        {(["sencilla", "completa"] as const).map((v) => (
          <button key={v} type="button" onClick={() => cambiaVista(v)} aria-pressed={vista === v} className={`min-h-[44px] rounded-full px-4 font-semibold transition-colors ${vista === v ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`}>
            {v === "sencilla" ? "Resumen" : "Todas las cifras"}
          </button>
        ))}
      </span>
      <button type="button" onClick={abreGuia} className="min-h-[44px] rounded-full border border-line bg-white px-4 text-[15px] font-semibold text-ink hover:border-ink">Ayuda</button>
    </div>
  );
}

/* "Ya lo he revisado" se guarda en este navegador y caduca a los 7 días: así una tarea que sigue viva
   (la medición, el espejo de la IA…) vuelve a salir la semana siguiente en vez de quedar tachada para siempre. */
const DIAS_REVISADO = 7;
function useHechas() {
  const [hechas, setHechas] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      const g = JSON.parse(localStorage.getItem("rd-mesa-hechas") || "{}") as Record<string, unknown>;
      const limite = new Date(Date.now() - DIAS_REVISADO * 864e5).toISOString().slice(0, 10);
      const vivas: Record<string, string> = {};
      for (const [k, d] of Object.entries(g)) if (typeof d === "string" && d >= limite) vivas[k] = d;
      setHechas(vivas);
    } catch {}
  }, []);
  const marca = (id: string) => setHechas((h) => {
    const n = { ...h }; if (n[id]) delete n[id]; else n[id] = new Date().toISOString().slice(0, 10);
    try { localStorage.setItem("rd-mesa-hechas", JSON.stringify(n)); if (n[id]) localStorage.setItem("rd-mesa-logro-revisar", "1"); } catch {}
    queueMicrotask(() => window.dispatchEvent(new Event("mesa-logro")));
    return n;
  });
  return { hechas, marca };
}

function QueHagoHoy({ tareas }: { tareas: Tarea[] }) {
  const { hechas, marca } = useHechas();
  const [todas, setTodas] = useState(false); // cl·v919: plegado, solo la primera; "Ver las N más" abre el resto
  const lista = todas ? tareas : tareas.slice(0, 1);
  return (
    <section id="mesa-hoy" className="mt-5 scroll-mt-4 rounded-[20px] border-2 border-yellow bg-white px-5 py-4">
      <h2 className="font-serif text-[22px] italic text-ink">Lo más importante hoy</h2>
      {tareas.length ? (<>
        <ol className="mt-2 space-y-2.5">
          {lista.map((t, i) => {
            const ok = !!hechas[t.id];
            return (
              <li key={t.id} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0"><Loseta n={ok ? "check" : (ICONO_AREA[t.ir ?? ""]?.[0] ?? "estrella")} color={ok ? "#2f9a62" : (ICONO_AREA[t.ir ?? ""]?.[1] ?? "#c79a00")} tam={34} /></span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[16px] font-semibold leading-snug ${ok ? "text-ink/45 line-through" : "text-ink"}`}>{t.texto}</span>
                  <span className="block text-[14px] leading-snug text-ink/65">{t.porque}{t.donde ? <span className="text-ink/45"> · Está en «{t.donde}»</span> : null}</span>
                </span>
                <button type="button" onClick={() => marca(t.id)} className={`min-h-[44px] shrink-0 rounded-full border px-3 py-1.5 text-[14px] font-semibold ${ok ? "border-[#2f9a62] bg-[#e7f4ec] text-[#1d6a42]" : "border-line text-ink/70 hover:border-ink"}`}>{ok ? "Revisado" : "Ya lo he revisado"}</button>
              </li>
            );
          })}
        </ol>
        {tareas.length > 1 && <button type="button" onClick={() => setTodas(!todas)} aria-expanded={todas} className="mt-3 inline-flex min-h-[44px] items-center text-[15px] font-semibold text-ink underline underline-offset-4">{todas ? "Plegar" : `Ver ${tareas.length - 1 === 1 ? "la otra" : `las ${tareas.length - 1} más`}`}</button>}
      </>) : <p className="mt-1 text-[15px] text-ink/70">Hoy no hay nada pendiente. Todo va bien.</p>}
    </section>
  );
}

function Pregunta({ clave }: { clave: string }) {
  const [q, setQ] = useState("");
  const [r, setRaw] = useState<{ q: string; a: string }[]>([]);
  useEffect(() => { try { const g = sessionStorage.getItem("rd-mesa-respuestas"); if (g) setRaw(JSON.parse(g)); } catch {} }, []);
  const setR = (f: (x: { q: string; a: string }[]) => { q: string; a: string }[]) => setRaw((x) => { const n = f(x); try { sessionStorage.setItem("rd-mesa-respuestas", JSON.stringify(n)); } catch {} return n; });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [oyendo, setOyendo] = useState(false);
  const [micro, setMicro] = useState(false);
  useEffect(() => { setMicro(typeof window !== "undefined" && !!((window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition)); }, []);
  const preguntar = async (texto = q) => {
    const t = texto.trim();
    if (!t || cargando) return;
    setCargando(true); setError("");
    if (clave === "demo") {
      setR((x) => [{ q: t, a: "Esto es una demostración: aquí Claude te contestaría en dos o tres frases con los datos reales de tu mesa. Por ejemplo: «La campaña que mejor funciona es Google Búsqueda: 20 contactos a 70 € cada uno.»" }, ...x].slice(0, 5));
      setQ(""); setCargando(false); return;
    }
    try {
      const res = await fetch("/api/mesa/pregunta", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ k: clave, pregunta: t }) });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "No he podido contestar.");
      setR((x) => [{ q: t, a: j.texto }, ...x].slice(0, 5)); setQ("");
    } catch (e) { setError(e instanceof Error ? e.message : "No he podido contestar."); }
    finally { setCargando(false); }
  };
  const dicta = () => {
    try {
      const W = window as unknown as { SpeechRecognition?: new () => { lang: string; interimResults: boolean; onresult: (e: { results: { 0: { transcript: string } }[] }) => void; onend: () => void; start: () => void } ; webkitSpeechRecognition?: new () => never };
      const SR = (W.SpeechRecognition || W.webkitSpeechRecognition) as unknown as new () => { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<{ 0: { transcript: string } }> }) => void; onend: () => void; onerror: () => void; start: () => void };
      const rec = new SR();
      rec.lang = "es-ES"; rec.interimResults = false;
      rec.onresult = (e) => { const t = e.results[0][0].transcript; setQ(t); preguntar(t); };
      rec.onend = () => setOyendo(false);
      rec.onerror = () => { setOyendo(false); setError("No he podido escucharte. Comprueba que el micrófono está permitido en los ajustes del móvil, o escribe la pregunta."); };
      setError(""); setOyendo(true); rec.start();
    } catch { setOyendo(false); setError("No he podido escucharte. Escribe la pregunta."); }
  };
  const ejemplos = ["¿Qué campaña funciona mejor?", "¿Cuántos contactos nos ha traído Instagram?", "¿Qué hago primero esta semana?"];
  return (
    <section id="mesa-pregunta" className="mt-5 scroll-mt-4 rounded-[20px] border border-line bg-white px-5 py-4">
      <h2 className="font-serif text-[22px] italic text-ink">Pregunta lo que quieras</h2>
      <p className="mt-1 text-[15px] leading-snug text-ink/70">Escribe o dicta tu pregunta como se la harías a una persona. Contesta con los datos de los últimos 28 días.</p>
      <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); preguntar(); }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Escribe aquí tu pregunta" aria-label="Tu pregunta" className="min-h-[50px] min-w-0 basis-full rounded-full border border-line bg-cream px-4 text-[16px] outline-none focus:border-ink sm:basis-0 sm:flex-1" />
        {micro && <button type="button" onClick={dicta} aria-label="Dictar la pregunta" className={`min-h-[46px] shrink-0 rounded-full border px-4 text-[14px] font-semibold ${oyendo ? "border-ink bg-ink text-white" : "border-line text-ink"}`}>{oyendo ? "Te escucho…" : "Dictar"}</button>}
        <button type="submit" disabled={cargando || !q.trim()} className="min-h-[46px] shrink-0 rounded-full bg-yellow px-5 text-[15px] font-semibold text-ink disabled:opacity-50">{cargando ? "Pensando…" : "Preguntar"}</button>
      </form>
      {!r.length && (<>
        <p className="mt-3 text-[14px] font-semibold text-ink/55">O pulsa una de estas:</p>
        <p className="mt-1.5 flex flex-wrap gap-2">
          {ejemplos.map((e) => <button key={e} type="button" onClick={() => preguntar(e)} className="min-h-[44px] rounded-full border border-line bg-cream px-3.5 py-1.5 text-left text-[15px] text-ink/80 hover:text-ink">{e}</button>)}
        </p>
      </>)}
      {error && <p className="mt-2 text-[14px] text-[#a3505a]">{error}</p>}
      <ul className="mt-3 space-y-3">
        {r.map((x, i) => (
          <li key={i} className="rounded-[14px] bg-[#fbf6ea] px-4 py-3">
            <p className="text-[13px] font-semibold text-ink/55">{x.q}</p>
            <p className="mt-1 whitespace-pre-wrap text-[16px] leading-relaxed text-ink">{x.a}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Sencilla({ temas, resumen, tareas, relojes, base, hoy, realEntre, clave, irCompleta, herramientas }: { temas: Modulo[]; resumen?: Resumen; tareas: Tarea[]; relojes: Reloj[]; base?: CifrasBase; hoy: string; realEntre: (a: string, b: string) => number | null; clave: string; irCompleta: () => void; herramientas: React.ReactNode }) {
  const [abierto, setAbierto] = useState<string | null>(null);
  const abreTema = useCallback((id: string) => { setAbierto(id); history.replaceState(null, "", "#pl-temas"); window.dispatchEvent(new HashChangeEvent("hashchange")); setTimeout(() => document.getElementById(`tema-${id}`)?.scrollIntoView({ behavior: suave(), block: "start" }), 120); }, []);
  useEffect(() => {
    const f = (e: Event) => abreTema(String((e as CustomEvent).detail));
    window.addEventListener("mesa-tema", f);
    const h = window.location.hash.replace("#tema-", "");
    if (h && h !== window.location.hash) abreTema(h);
    return () => window.removeEventListener("mesa-tema", f);
  }, [abreTema]);
  return (
    <div className="pb-6">
      <Ludoteca {...dolorYBien(relojes, temas)} contactos={relojes[0]?.n} preguntas={juegos(relojes)} base={base} hoy={hoy} realEntre={realEntre} demo={clave === "demo"} nombreEmpresa="AMS Cerramientos" lineas={["Ventanas de piso", "Cerramiento de terraza", "Cerramiento de chalet", "Obra completa", "Comunidades de vecinos"]} capacidadTexto="¿Cuántos trabajos puedes instalar al mes?" notaPublico="Podemos montar la versión B de tu web: cerramientos de chalet, terrazas y obra completa, con su propia campaña. La de hoy sigue igual. Tú decides el reparto y lo medimos." />
      <GuiaDeUso modo="plegada" />
      <Conclusion resumen={resumen} hayTarea={tareas.length > 0} />
      {/* cl·v925: apartados en rejilla compacta; el que se abre se despliega debajo. Las cifras completas vienen después, ya abiertas */}
      <ResumenLinea clave={clave} />
      <Apartados items={[
        { id: "pl-hoy", icono: "check", color: PALETA_ALEGRIA.dinero, titulo: "Lo primero que haría hoy", pista: tareas[0]?.texto ?? "Nada pendiente", nodo: <TareaPrincipal tareas={tareas} temas={temas} abreTema={abreTema} /> },
        { id: "pl-temas", icono: "grid", color: PALETA_ALEGRIA.web, titulo: "Cómo está cada parte", pista: temas.map((m) => `${m.titulo}: ${m.estado ?? LUZ[m.luz].t}`).join(" · "), nodo: <EstadoLista temas={temas} abierto={abierto} setAbierto={setAbierto} /> },
        ...(relojes.length > 0 ? [{ id: "pl-cifras", icono: "moneda", color: PALETA_ALEGRIA.camino, titulo: "Las cuatro cifras que importan", pista: relojes.map((r) => r.frase ?? r.t).join(" · "), nodo: <CifrasFrase relojes={relojes} /> }] : []),
        { id: "pl-pregunta", icono: "chat", color: PALETA_ALEGRIA.ia, titulo: "Pregunta lo que quieras", pista: "Escribe o dicta", nodo: <Pregunta clave={clave} /> },
        { id: "pl-mas", icono: "ajustes", color: PALETA_ALEGRIA.ventas, titulo: "Más herramientas", pista: "CRM, lupa, plan y más", nodo: <MasHerramientas clave={clave} herramientas={herramientas} /> },
        { id: "pl-conectado", icono: "red", color: PALETA_ALEGRIA.mercado, titulo: "Conectado con", pista: "Analytics, Ads, WhatsApp…", nodo: <FranjaConectado nombres={["Google Analytics", "Search Console", "Google Ads", "Ficha de Google", "Instagram", "WhatsApp", "Semrush", "ChatGPT", "Gemini", "Claude"]} /> },
      ]} />
      <p id="mesa-cifras-todas" className="mt-5 scroll-mt-4 font-serif text-[22px] italic text-ink">Todas las cifras</p>
    </div>
  );
}

/* Resumen por correo: una línea propia, ancha y a la vista (pedido de Ig, 28-oct). */
function ResumenLinea({ clave }: { clave: string }) {
  const [ab, setAb] = useState(false);
  useEffect(() => { const f = () => { if (window.location.hash === "#pl-resumen-correo") setAb(true); }; f(); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
  return (
    <section className="mt-3" aria-label="Recibe un resumen por correo" id="pl-resumen-correo">
      <button type="button" aria-expanded={ab} onClick={() => setAb(!ab)} className="flex min-h-[64px] w-full items-center gap-3 rounded-[18px] border-2 border-[#2e8b57] bg-[#eef8f1] px-3 py-2 text-left hover:border-ink">
        <Loseta n="sobre" color={PALETA_ALEGRIA.mercado} tam={40} />
        <span className="min-w-0 flex-1"><span className="block font-serif text-[19px] italic leading-tight text-ink">Recibe un resumen por correo</span><span className="block text-[14px] leading-tight text-ink/70">Cada día, cada lunes o cada mes, sin tener que entrar. Tú eliges de qué.</span></span>
        <span className="shrink-0 rounded-full bg-yellow px-3.5 py-2 text-[13.5px] font-semibold text-ink">{ab ? "Cerrar" : "Programarlo"}</span>
      </button>
      {ab && <div className="mt-2"><Resumenes clave={clave} /></div>}
    </section>
  );
}

/* "Más": lo que no hace falta para saber cómo va (herramientas y resumen por correo), plegado.
   El botón "Más" de la barra de abajo lo abre y baja hasta aquí. */
function MasHerramientas({ clave, herramientas }: { clave: string; herramientas: React.ReactNode }) {
  const [ab, setAb] = useState(false);
  useEffect(() => {
    const abre = () => setAb(true);
    window.addEventListener("mesa-mas", abre);
    return () => window.removeEventListener("mesa-mas", abre);
  }, []);
  return (
    <section id="mesa-herramientas" className="mt-8 scroll-mt-4 rounded-[20px] border border-line bg-white">
      <button type="button" onClick={() => setAb(!ab)} aria-expanded={ab} className="flex min-h-[56px] w-full items-center justify-between gap-3 px-5 text-left">
        <span><span className="block text-[17px] font-semibold text-ink">Más herramientas</span><span className="block text-[15px] text-ink/65">El CRM, la lupa, el plan y más</span></span>
        <span className="shrink-0 rounded-full bg-yellow px-4 py-2 text-[14px] font-semibold text-ink">{ab ? "Cerrar" : "Abrir"}</span>
      </button>
      {ab && <div className="border-t border-line px-4 pb-4">{herramientas}</div>}
    </section>
  );
}

/* ── Vista sencilla, versión 2 (27-oct, cl·v894, tras la revisión de ChatGPT) ──
   En diez segundos sé cómo va; en treinta sé qué hacer; solo después profundizo. */
function CabeceraSencilla({ resumen, tareas, abreGuia, cambiarPeriodo, actualizado, hoy }: { resumen?: Resumen; tareas: Tarea[]; abreGuia: () => void; cambiarPeriodo: () => void; actualizado?: string; hoy: string }) {
  const alDia = !!actualizado && entre(actualizado, hoy) <= 2;
  const saludo = useSaludo();
  return (
    <div>
      <p className="min-h-[26px] font-serif text-[20px] italic leading-tight text-teal-deep">{saludo}</p>
      <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-teal-deep">AMS Cerramientos · mesa de control</p>
      <h1 className="mt-1 font-serif text-[clamp(30px,5vw,42px)] font-medium italic leading-tight text-ink">Cómo va AMS</h1>
      <p className="mt-1 text-[15px] text-ink/65">Últimos 28 días, comparado con los 28 anteriores · {alDia ? "actualizado hoy" : actualizado ? `anuncios actualizados el ${fechaEnPalabras(actualizado)}` : "anuncios sin actualizar"}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={abreGuia} className="min-h-[44px] rounded-full border border-line bg-white px-4 text-[15px] font-semibold text-ink hover:border-ink">Ayuda</button>
        <button type="button" onClick={cambiarPeriodo} className="min-h-[44px] rounded-full border border-line bg-white px-4 text-[15px] font-semibold text-ink/75 hover:border-ink">Cambiar periodo</button>
      </div>
    </div>
  );
}

function Conclusion({ resumen, hayTarea }: { resumen?: Resumen; hayTarea: boolean }) {
  if (!resumen) return null;
  const urgente = /importante|atención/i.test(resumen.titulo);
  const puntos = resumen.puntos?.length ? resumen.puntos : [resumen.texto];
  /* cl·v926: también plegada: el titular dice lo que pasa; dentro, los motivos y el botón */
  return (
    <Plegable id="pl-conclusion" icono={urgente ? "campana" : "check"} color={urgente ? "#a3505a" : "#2f9a62"} titulo={resumen.titulo} pista={puntos.join(" · ")}>
      <div className={`rounded-[16px] px-4 py-3 ${urgente ? "bg-[#fbeceb]" : "bg-[#e7f4ec]"}`}>
        <ul className="space-y-1.5">
          {puntos.map((p, i) => <li key={i} className="flex gap-2.5 text-[15.5px] leading-snug text-ink/85"><span className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-ink/40" />{p}</li>)}
        </ul>
        {!urgente && !/^Para mirar/.test(resumen.texto) && <p className="mt-2 text-[15px] italic leading-snug text-ink/60">{elige(CHISPA_TODO_BIEN, resumen.titulo + resumen.texto)}</p>}
        {hayTarea && (
          <button type="button" onClick={() => { history.replaceState(null, "", "#pl-hoy"); window.dispatchEvent(new HashChangeEvent("hashchange")); setTimeout(() => document.getElementById("pl-hoy")?.scrollIntoView({ behavior: suave(), block: "start" }), 80); }} className="mt-3 min-h-[48px] rounded-full bg-yellow px-6 text-[15px] font-semibold text-ink">Ver lo más importante</button>
        )}
      </div>
    </Plegable>
  );
}

function TareaPrincipal({ tareas, temas, abreTema }: { tareas: Tarea[]; temas: Modulo[]; abreTema: (id: string) => void }) {
  const { hechas, marca } = useHechas();
  const [verMas, setVerMas] = useState(false);
  const pendientes = tareas.filter((t) => !hechas[t.id]);
  const principal = pendientes[0];
  const resto = tareas.filter((t) => t !== principal);
  const Fila = ({ t, grande }: { t: Tarea; grande?: boolean }) => {
    const ok = !!hechas[t.id];
    const tema = temas.find((m) => m.id === t.ir);
    return (
      <div className={grande ? "" : "border-t border-line pt-3"}>
        <p className={`${grande ? "text-[19px]" : "text-[16px]"} font-semibold leading-snug ${ok ? "text-ink/45 line-through" : "text-ink"}`}>{t.texto}</p>
        <p className="mt-1 text-[15px] leading-snug text-ink/70">{t.porque}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tema && <button type="button" onClick={() => abreTema(tema.id)} className="min-h-[44px] rounded-full bg-yellow px-5 text-[15px] font-semibold text-ink">{t.boton ?? `Abrir ${tema.titulo}`}</button>}
          <button type="button" onClick={() => marca(t.id)} className={`min-h-[44px] rounded-full border px-5 text-[15px] font-semibold ${ok ? "border-[#2f9a62] bg-[#e7f4ec] text-[#1d6a42]" : "border-line text-ink hover:border-ink"}`}>{ok ? "Revisado" : "Ya lo he revisado"}</button>
        </div>
        {ok && <p className="mt-2 flex items-center gap-2 text-[14.5px] font-semibold text-[#1d6a42]"><span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-[#2f9a62] text-white"><Icono n="check" className="h-4 w-4" /></span>{elige(CHISPA_HECHO, t.id)}</p>}
      </div>
    );
  };
  return (
    <section id="mesa-hoy" className="mt-4 scroll-mt-4 rounded-[22px] border-2 border-yellow bg-white px-5 py-4">
      <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink/55">Lo primero que haría hoy</h2>
      {principal ? <div className="mt-2"><Fila t={principal} grande /></div> : (
        <p className="mt-2 flex items-center gap-3 text-[17px] text-ink/80"><Loseta n="estrella" color="#c79a00" tam={44} />{tareas.length ? CHISPA_TODO_REVISADO : CHISPA_SIN_TAREAS}</p>
      )}
      {resto.length > 0 && (
        <div className="mt-4">
          <button type="button" onClick={() => setVerMas(!verMas)} aria-expanded={verMas} className="inline-flex min-h-[44px] items-center text-[15.5px] font-semibold text-ink underline underline-offset-4">{verMas ? "Ocultar" : `Hay ${resto.length === 1 ? "1 acción más" : `${resto.length} acciones más`}`}</button>
          {verMas && <div className="mt-3 space-y-3">{resto.map((t) => <Fila key={t.id} t={t} />)}</div>}
        </div>
      )}
    </section>
  );
}

const SEGMENTOS: Record<Luz, number> = { verde: 4, ambar: 2, rojo: 1, gris: 0, azul: 3 };
function Bateria({ luz }: { luz: Luz }) {
  const n = SEGMENTOS[luz];
  const c = LUZ[luz].c;
  return (
    <span className="inline-flex shrink-0 items-center" aria-hidden="true">
      <span className="flex gap-[3px] rounded-[6px] border-2 p-[3px]" style={{ borderColor: luz === "gris" ? "#c9c2b3" : c }}>
        {[0, 1, 2, 3].map((i) => <span key={i} className="block h-[18px] w-[9px] rounded-[2px]" style={{ background: i < n ? c : "#ece6da" }} />)}
      </span>
      <span className="ml-[2px] block h-[10px] w-[4px] rounded-r-[2px]" style={{ background: luz === "gris" ? "#c9c2b3" : c }} />
    </span>
  );
}

function EstadoLista({ temas, abierto, setAbierto }: { temas: Modulo[]; abierto: string | null; setAbierto: (id: string | null) => void }) {
  return (
    <section id="mesa-temas" className="mt-6 scroll-mt-4">
      <h2 className="font-serif text-[24px] italic text-ink">Cómo está cada parte</h2>
      <p className="mt-1 text-[14px] text-ink/60">Batería llena y verde, todo bien; naranja, mira esto; roja, importante. Pulsa cada una para ver el detalle.</p>
      <ul className="mt-3 space-y-3">
        {temas.map((m) => {
          const ab = abierto === m.id;
          return (
            <li key={m.id} id={`tema-${m.id}`} className={`scroll-mt-4 rounded-[20px] border bg-white ${ab ? "border-ink" : "border-line"}`}>
              <button type="button" onClick={() => setAbierto(ab ? null : m.id)} aria-expanded={ab} className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 gap-y-3 px-4 py-4 text-left sm:grid-cols-[auto_minmax(0,1fr)_auto]">
                <Loseta n={(m.icono ?? ICONO_AREA[m.id]?.[0]) || "estrella"} color={m.color ?? ICONO_AREA[m.id]?.[1] ?? "#1a3d47"} tam={52} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1"><span className="text-[18px] font-semibold text-ink">{m.titulo}</span><Bateria luz={m.luz} /><span className="text-[14px] font-semibold" style={{ color: LUZ[m.luz].c }}>{m.estado ?? LUZ[m.luz].t}</span></span>
                  <span className="mt-0.5 block text-[15px] leading-snug text-ink/70">{primeraFrase(m.conclusion)}</span>
                </span>
                <span className="col-start-2 inline-flex min-h-[44px] items-center justify-self-start rounded-full bg-yellow px-4 text-[14px] font-semibold text-ink sm:col-start-3 sm:justify-self-end">{ab ? "Cerrar" : m.ver ?? "Ver"}</span>
              </button>
              {ab && (
                <div className="border-t border-line px-4 pb-4 pt-2">
                  {primeraFrase(m.conclusion) !== m.conclusion && <p className="pt-2 text-[15px] leading-snug text-ink/80">{m.conclusion}</p>}
                  <ul className="mt-2 divide-y divide-line">
                    {m.filas.map((f, i) => (
                      <li key={i} className="flex flex-col gap-0.5 py-2.5 text-[15px] sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <span className="flex items-center gap-2 text-ink/70">{f.luz ? <LuzTema luz={f.luz} /> : null}<LogoFila texto={f.t} />{f.t}</span>
                        <span className="font-semibold text-ink sm:max-w-[60%] sm:text-right">{f.v}</span>
                      </li>
                    ))}
                  </ul>
                  {m.enlaces.filter((e) => !e.href.startsWith("/mesa-")).length > 0 && (
                    <p className="mt-3 flex flex-wrap gap-2">
                      {m.enlaces.filter((e) => !e.href.startsWith("/mesa-")).map((e) => <a key={e.href} href={e.href} {...(/^\/(crm|plan)-/.test(e.href) ? { target: "_blank", rel: "noopener" } : {})} className="inline-flex min-h-[44px] items-center rounded-full bg-yellow px-5 text-[15px] font-semibold text-ink">{e.t} →</a>)}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Las preguntas de "Adivina la cifra", hechas con las cifras de hoy (solo las que hay). */
const techo = (n: number) => Math.max(10, Math.ceil((n * 3) / 10) * 10);
/** Puntos de dolor y de satisfacción para "Tus sueños y tus cuentas" (cl·v923): salen de las cuatro cifras y de las partes. */
function dolorYBien(relojes: Reloj[], temas: Modulo[]) {
  const frase = (r: Reloj) => (r.frase ?? `${r.t}: ${r.v}`) + (r.detalle ? ` (${r.detalle.replace(/\.$/, "")})` : "");
  const temaDeCifra = ["web", "web", "anuncios", "dicen"]; // a qué parte lleva cada una de las cuatro cifras
  /* las partes solo añaden lo que las cifras no cuentan ya (anuncios ya va en el coste por contacto; ventas, en los contactos) */
  const partes = (luz: Luz[]) => temas.filter((m) => luz.includes(m.luz) && m.id !== "anuncios" && m.id !== "tuyo").map((m) => ({ texto: m.conclusion, ir: m.id }));
  const cifras = (luz: Luz[]) => relojes.map((r, i) => ({ r, i })).filter(({ r }) => luz.includes(r.luz)).map(({ r, i }) => ({ texto: frase(r), ir: temaDeCifra[i] }));
  const dolor = [...cifras(["rojo", "ambar"]), ...partes(["rojo"])].slice(0, 3);
  const bien = [...cifras(["verde"]), ...partes(["verde"])].slice(0, 3);
  return { dolor, bien };
}
function juegos(r: Reloj[]) {
  const o: { texto: string; real: number; unidad: string; max: number }[] = [];
  if (r[0]?.n) o.push({ texto: "¿Cuántas personas crees que han dejado sus datos en los últimos 28 días?", real: r[0].n, unidad: "personas", max: techo(r[0].n) });
  if (r[1]?.n) o.push({ texto: "¿Y cuántas han pedido una visita?", real: r[1].n, unidad: "visitas", max: techo(r[1].n) });
  if (r[2]?.n) o.push({ texto: "¿Cuánto crees que ha costado cada contacto de los anuncios?", real: r[2].n, unidad: "€", max: techo(r[2].n) });
  return o;
}
function CifrasFrase({ relojes }: { relojes: Reloj[] }) {
  const [info, setInfo] = useState<string | null>(null);
  return (
    <section className="mt-6">
      <h2 className="font-serif text-[24px] italic text-ink">Las cuatro cifras que importan</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {relojes.map((r, ri) => {
          const ab = info === r.t;
          return (
            <li key={r.t} className="rounded-[20px] border border-line bg-white px-4 py-4">
              <div className="flex items-start gap-3">
                <Loseta n={r.icono ?? ICONO_CIFRA[ri % ICONO_CIFRA.length][0]} color={r.color ?? ICONO_CIFRA[ri % ICONO_CIFRA.length][1]} tam={48} />
                <div className="min-w-0 flex-1">
                  <p className="text-[18px] font-semibold leading-snug text-ink">{r.frase ?? `${r.t}: ${r.v}`}</p>
                  {r.detalle && <p className="mt-0.5 text-[15px] text-ink/65">{r.detalle}</p>}
                  <p className="mt-1 flex items-center gap-2 text-[14px] font-semibold" style={{ color: LUZ[r.luz].c }}><LuzTema luz={r.luz} />{r.luz === "azul" ? "Dato" : r.luz === "gris" ? "Sin comparación todavía" : LUZ[r.luz].t}</p>
                </div>
                {r.ayuda && <button type="button" aria-label={`Qué significa: ${r.t}`} aria-expanded={ab} onClick={() => setInfo(ab ? null : r.t)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-[17px] font-bold text-ink/60 hover:border-ink">?</button>}
              </div>
              {ab && <p className="mt-3 rounded-[12px] bg-[#fbf6ea] px-3 py-2.5 text-[15px] leading-snug text-ink/85">{r.ayuda}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function BarraMovil({ vista }: { vista: "sencilla" | "completa" }) {
  /* cl·v922: los apartados van plegados; el botón pone el ancla (#pl-…) para que el Plegable se abra y baja hasta él */
  const ir = (id: string) => { const pl: Record<string, string> = { "mesa-hoy": "pl-hoy", "mesa-temas": "pl-temas", "mesa-pregunta": "pl-pregunta", "mesa-herramientas": "pl-mas" }; const dest = document.getElementById(pl[id]) ? pl[id] : id; history.replaceState(null, "", "#" + dest); window.dispatchEvent(new HashChangeEvent("hashchange")); setTimeout(() => document.getElementById(dest)?.scrollIntoView({ behavior: suave(), block: "start" }), 60); };
  const botones: [string, string][] = [["mesa-hoy", "Hoy"], ["mesa-temas", "Estado"], ["mesa-pregunta", "Preguntar"], ["mesa-herramientas", "Más"]];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur sm:hidden" aria-label="Ir a">
      <ul className="grid grid-cols-4 gap-1">
        {botones.map(([id, t]) => (
          <li key={id}><button type="button" onClick={() => { if (id === "mesa-herramientas") window.dispatchEvent(new Event("mesa-mas")); setTimeout(() => ir(id), 30); }} className="flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 rounded-[12px] text-[13px] font-semibold text-ink active:bg-cream"><span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-[9px] text-white" style={{ background: ICONO_BARRA[id][1] }}><Icono n={ICONO_BARRA[id][0]} className="h-4 w-4" /></span>{t}</button></li>
        ))}
      </ul>
    </nav>
  );
}

function Guia({ cerrar }: { cerrar: () => void }) {
  const [mas, setMas] = useState(false);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(17,52,61,0.55)] px-4" role="dialog" aria-modal="true" aria-label="Cómo funciona la mesa">
      <div className="max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-[22px] bg-white p-6 shadow-2xl">
        <h2 className="font-serif text-[27px] italic leading-tight text-ink">Esta mesa te cuenta tres cosas</h2>
        <ol className="mt-3 space-y-2 text-[17px] text-ink">
          <li className="flex items-center gap-3"><Loseta n="mando" color="#2a6f86" tam={34} />Cómo va todo.</li>
          <li className="flex items-center gap-3"><Loseta n="campana" color="#d93f3f" tam={34} />Qué necesita atención.</li>
          <li className="flex items-center gap-3"><Loseta n="estrella" color="#c79a00" tam={34} />Qué haría hoy.</li>
        </ol>
        <p className="mt-4 text-[16px] leading-relaxed text-ink/80">No necesitas entender de marketing. Pulsa cualquier apartado y te lo explicamos.</p>
        {mas && (
          <div className="mt-4 space-y-2 rounded-[14px] bg-[#fbf6ea] px-4 py-3 text-[15px] leading-relaxed text-ink/85">
            <p><b>Los colores</b> siempre dicen lo mismo: verde, todo bien; naranja, mira esto; rojo, importante; gris, sin datos aún; azul, datos de tu negocio.</p>
            <p><b>Las baterías</b> de cada parte (la web, reputación e IA, competencia, anuncios, ventas) se llenan cuando va bien y se vacían cuando algo falla. Pulsa "Ver" para el detalle.</p>
            <p><b>El "?"</b> de cada cifra te explica qué es y si está bien.</p>
            <p><b>Pregunta lo que quieras</b> con tus palabras o díctalo. Y si prefieres no entrar, pide que te mandemos el resumen por correo.</p>
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setMas(!mas)} className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-ink/65 underline underline-offset-4">{mas ? "Menos explicación" : "Ver una explicación más completa"}</button>
          <button type="button" onClick={cerrar} className="min-h-[48px] rounded-full bg-yellow px-6 text-[15.5px] font-semibold text-ink">Entrar en mi mesa</button>
        </div>
      </div>
    </div>
  );
}

/* En la vista completa, un botón fijo para volver al inicio de la mesa (27-oct, cl·v892). */
function VolverInicio({ irSencilla }: { irSencilla: () => void }) {
  const [ver, setVer] = useState(false);
  useEffect(() => {
    const f = () => setVer(window.scrollY > 500);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  if (!ver) return null;
  return (
    <div className="fixed bottom-[76px] right-3 z-40 sm:bottom-5 sm:right-5">
      {/* cl·v936: un solo botón, siempre que se haya bajado, en las dos vistas: para no perderse nunca */}
      <button type="button" onClick={irSencilla} className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink py-1 pl-1.5 pr-4 text-[14px] font-semibold text-white shadow-lg"><Loseta n="casa" color="#ffffff33" tam={34} />Volver al inicio</button>
    </div>
  );
}

/* Resúmenes por correo (27-oct, cl·v893; Ig: "programar un resumen diario, semanal, mensual o uno
   ahora, eligiendo de qué; pones el correo y te lo enviamos"). */
type SusR = { id: number; email: string; frecuencia: string; temas: string[]; ultimo: string | null };
function Resumenes({ clave }: { clave: string }) {
  const demo = clave === "demo";
  const [email, setEmail] = useState("");
  const [frec, setFrec] = useState<"ahora" | "diario" | "semanal" | "mensual">("semanal");
  const [temas, setTemas] = useState<string[]>(TEMAS_RESUMEN.map(([k]) => k));
  const [lista, setLista] = useState<SusR[]>([]);
  const [estado, setEstado] = useState<{ t: string; ok: boolean } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const cargar = useCallback(() => {
    if (demo) return;
    fetch(`/api/mesa/resumenes?k=${encodeURIComponent(clave)}`).then((r) => r.json()).then((j) => j.ok && setLista(j.lista)).catch(() => {});
  }, [clave, demo]);
  useEffect(() => { cargar(); try { const e = localStorage.getItem("rd-mesa-correo"); if (e) setEmail(e); } catch {} }, [cargar]);
  const alterna = (k: string) => setTemas((t) => (t.includes(k) ? t.filter((x) => x !== k) : [...t, k]));
  const enviarlo = async () => {
    setEstado(null);
    if (demo) {
      if (frec !== "ahora") setLista((l) => [...l, { id: Date.now(), email, frecuencia: frec, temas, ultimo: null }]);
      setEstado({ ok: true, t: frec === "ahora" ? `Esto es un ejemplo: en tu mesa, el resumen llegaría ahora a ${email}.` : `Esto es un ejemplo: en tu mesa, te llegaría ${frec === "diario" ? "cada mañana" : frec === "semanal" ? "cada lunes por la mañana" : "el día 1 de cada mes"} a ${email}.` });
      return;
    }
    setEnviando(true);
    try { localStorage.setItem("rd-mesa-correo", email); } catch {}
    try {
      const r = await fetch("/api/mesa/resumenes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ k: clave, accion: frec === "ahora" ? "ahora" : "crear", email, frecuencia: frec, temas }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "No se ha podido.");
      setEstado({ ok: true, t: frec === "ahora" ? `Enviado a ${email}. Míralo en tu correo en un minuto.` : `Programado: te llegará ${frec === "diario" ? "cada mañana" : frec === "semanal" ? "cada lunes por la mañana" : "el día 1 de cada mes"} a ${email}.` });
      cargar();
    } catch (e) { setEstado({ ok: false, t: e instanceof Error ? e.message : "No se ha podido." }); }
    finally { setEnviando(false); }
  };
  const quitar = async (id: number) => {
    if (demo) { setLista((l) => l.filter((x) => x.id !== id)); return; }
    await fetch("/api/mesa/resumenes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ k: clave, accion: "borrar", id }) }).catch(() => {});
    cargar();
  };
  const FREC: [typeof frec, string][] = [["ahora", "Solo una vez, ahora"], ["diario", "Cada día"], ["semanal", "Cada lunes"], ["mensual", "Cada mes (día 1)"]];
  return (
    <section id="mesa-resumenes" className="mt-5 scroll-mt-4 rounded-[20px] border border-line bg-white px-5 py-4">
      <h2 className="font-serif text-[22px] italic text-ink">Recibe un resumen por correo</h2>
      <p className="text-[15px] leading-snug text-ink/70">Elige cada cuánto y de qué. Pon tu correo y te lo mandamos solo, sin que tengas que entrar.</p>
      <p className="mt-3 text-[13.5px] font-semibold uppercase tracking-[0.1em] text-ink/60">1. Cada cuánto</p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {FREC.map(([k, t]) => (
          <button key={k} type="button" onClick={() => setFrec(k)} aria-pressed={frec === k} className={`min-h-[44px] rounded-full border px-4 text-[15px] font-semibold ${frec === k ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-ink"}`}>{t}</button>
        ))}
      </div>
      <p className="mt-4 text-[13.5px] font-semibold uppercase tracking-[0.1em] text-ink/60">2. De qué</p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {TEMAS_RESUMEN.map(([k, t]) => {
          const on = temas.includes(k);
          return (
            <button key={k} type="button" onClick={() => alterna(k)} aria-pressed={on} className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-[15px] font-semibold ${on ? "border-[#1c8caa] bg-[#e4f1f5] text-ink" : "border-line text-ink/55"}`}>
              <span className={`grid h-5 w-5 place-items-center rounded-full border-2 text-[11px] ${on ? "border-[#1c8caa] bg-[#1c8caa] text-white" : "border-line"}`} aria-hidden="true">{on ? "✓" : ""}</span>{t}
            </button>
          );
        })}
      </div>
      {!temas.length && <p className="mt-2 text-[14px] text-[#a3505a]">Elige al menos un tema para poder programarlo.</p>}
      <p className="mt-4 text-[13.5px] font-semibold uppercase tracking-[0.1em] text-ink/60">3. A qué correo</p>
      <form className="mt-1.5 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); enviarlo(); }}>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.es" className="min-h-[46px] min-w-[200px] flex-1 rounded-full border border-line bg-cream px-4 text-[16px] outline-none focus:border-ink" />
        <button type="submit" disabled={enviando || !temas.length || !email} className="min-h-[46px] rounded-full bg-yellow px-5 text-[15px] font-semibold text-ink disabled:opacity-50">{enviando ? "Un momento…" : frec === "ahora" ? "Enviármelo ahora" : "Programarlo"}</button>
      </form>
      {estado && <p className={`mt-2 text-[14px] ${estado.ok ? "text-[#1d6a42]" : "text-[#a3505a]"}`}>{estado.t}</p>}
      {lista.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="text-[13.5px] font-semibold uppercase tracking-[0.1em] text-ink/60">Resúmenes programados</p>
          <ul className="mt-2 space-y-2">
            {lista.map((x) => (
              <li key={x.id} className="flex flex-wrap items-center justify-between gap-2 text-[14px]">
                <span><b>{x.frecuencia === "diario" ? "Cada día" : x.frecuencia === "semanal" ? "Cada lunes" : "Cada mes"}</b> a {x.email}<span className="text-ink/50"> · {x.temas.map((k) => TEMAS_RESUMEN.find(([a]) => a === k)?.[1] ?? k).join(", ")}{x.ultimo ? ` · último envío: ${fechaLarga(x.ultimo)}` : ""}</span></span>
                <button type="button" onClick={() => quitar(x.id)} className="min-h-[44px] rounded-full border border-line px-4 text-[15px] font-semibold text-ink/75 hover:border-ink">Quitar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
