import { createHash } from "node:crypto";
import { asegurarTablas, sql } from "@/lib/db";

/* Datos REALES de la mesa de AMS (31-oct-2026), con la misma forma que la mesa de Reformadísimo y Casiopea.
   - Contador propio sin cookies (Neon): páginas vistas, visitas, personas, tiempo, rebote, origen y móvil u ordenador.
   - Contactos y clics de WhatsApp y llamar: del CRM (Supabase, función adm_mesa con la clave de administración).
     Sin importes: los euros no salen nunca del móvil de Javi.
   Analytics, Search Console, anuncios, ficha y redes se rellenarán cuando estén conectadas esas cuentas. */

/** Origen guardado por el contador a los nombres de canal que usa la mesa. */
export function canalMesa(f: string | null | undefined): string {
  const v = (f ?? "").toLowerCase();
  if (v === "google-ads") return "Google Ads";
  if (v === "meta") return "Meta / Instagram";
  if (v === "chatgpt") return "ChatGPT Ads";
  if (!v || v === "directo" || /amscerramientos|ams-cerramientos/.test(v)) return "Directo o sin dato";
  if (/google\.|^google$|bing\.|^bing$|duckduckgo|yahoo|ecosia/.test(v)) return "Google (búsqueda)";
  if (/chatgpt\.com|openai|perplexity|gemini|claude\.ai|copilot/.test(v)) return "Asistentes de IA";
  if (/instagram|facebook|^fb$|^ig$|tiktok|linkedin|youtube/.test(v)) return "Redes sin pagar";
  return "Referidos y otras webs";
}

/** Origen tal como lo guarda el CRM (función _origen o la casilla de Javi) a los mismos nombres de canal. */
export function canalCrm(o: string | null | undefined): string {
  const v = (o ?? "").toLowerCase();
  if (/anuncio de google/.test(v)) return "Google Ads";
  if (/facebook|instagram/.test(v)) return /sin anuncio/.test(v) ? "Redes sin pagar" : "Meta / Instagram";
  if (/chatgpt/.test(v)) return "ChatGPT Ads";
  if (/google \(sin anuncio\)|bing/.test(v)) return "Google (búsqueda)";
  if (/entró directo|calculadora|configurador|chat de la web/.test(v)) return "Directo o sin dato";
  if (/^web \(/.test(v)) return "Referidos y otras webs";
  return o?.trim() ? o.trim().slice(0, 40) : "Directo o sin dato"; // las de Javi a mano: buzoneo, recomendación, cartel...
}

/** Llave para que la mesa pida sus datos a /api/mesa sin volver a pedir la contraseña. Sale de MESA_CLAVE y no la revela. */
export function llaveMesa(): string {
  const c = (process.env.MESA_CLAVE ?? "").trim();
  return c ? createHash("sha256").update(`ams-mesa:${c}`).digest("hex").slice(0, 40) : "";
}

const hoyMadrid = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Madrid" });
const suma = (s: string, n: number) => { const d = new Date(`${s}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

type DiaWeb = { peticiones: number; visitas: number; calculos: number; porCanal: Record<string, number>; whatsapp: number; llamadas: number; clicsPorFuente: Record<string, number>; vistas: number; entradas: number; personas: number; segundos: number };
type CrmMesa = { dias: { dia: string; origen: string; canal: string; n: number; pide_visita: number }[]; clics: { dia: string; tipo: string; n: number }[]; crm: { origen: string; leads: number; visitas: number; presupuestos: number; firmados: number; descartados: number }[] };

/** Contactos y clics del CRM (Supabase). Si falta la clave o falla, la mesa sigue sin ellos. */
async function delCrm(desde: string, hasta: string): Promise<CrmMesa | null> {
  const sec = (process.env.CRM_ADMIN_SECRET ?? "").trim();
  if (!sec) return null;
  const url = process.env.CRM_SUPABASE_URL || "https://jrfqllllhweswhvwylog.supabase.co";
  const key = process.env.CRM_SUPABASE_KEY || "sb_publishable_6w-UFyFVPWAvq7OOr9F-BQ_8e7HMvuP";
  try {
    const r = await fetch(`${url}/rest/v1/rpc/adm_mesa`, { method: "POST", cache: "no-store", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ p_secret: sec, p_desde: desde, p_hasta: hasta }) });
    if (!r.ok) { console.error("[mesa] CRM:", r.status); return null; }
    return (await r.json()) as CrmMesa;
  } catch (e) {
    console.error("[mesa] CRM:", e);
    return null;
  }
}

export async function datosReales() {
  await asegurarTablas();
  const q = sql();
  const hoy = hoyMadrid();
  const desde = suma(hoy, -400);
  const [vistas, tiempos, crm] = await Promise.all([
    q`SELECT to_char((creado AT TIME ZONE 'Europe/Madrid')::date, 'YYYY-MM-DD') AS dia, count(*)::int AS n,
             count(*) FILTER (WHERE entrada)::int AS e, count(*) FILTER (WHERE nuevo)::int AS u
      FROM vistas WHERE (creado AT TIME ZONE 'Europe/Madrid')::date >= ${desde}::date GROUP BY 1`,
    q`SELECT to_char((creado AT TIME ZONE 'Europe/Madrid')::date, 'YYYY-MM-DD') AS dia, sum(segundos)::int AS s
      FROM tiempos WHERE (creado AT TIME ZONE 'Europe/Madrid')::date >= ${desde}::date GROUP BY 1`,
    delCrm(desde, hoy),
  ]);
  const web: Record<string, DiaWeb> = {};
  const dia = (d: string) => (web[d] ??= { peticiones: 0, visitas: 0, calculos: 0, porCanal: {}, whatsapp: 0, llamadas: 0, clicsPorFuente: {}, vistas: 0, entradas: 0, personas: 0, segundos: 0 });
  for (const r of vistas) { const w = dia(String(r.dia)); w.vistas = Number(r.n); w.entradas = Number(r.e); w.personas = Number(r.u); }
  for (const r of tiempos) dia(String(r.dia)).segundos = Number(r.s ?? 0);
  for (const r of crm?.dias ?? []) {
    if (r.canal === "manual") continue; // en la web solo cuenta lo que llega por la web; lo de Javi a mano sale en Ventas
    const w = dia(r.dia); const k = canalCrm(r.origen); const n = Number(r.n);
    w.peticiones += n; w.visitas += Number(r.pide_visita); w.porCanal[k] = (w.porCanal[k] ?? 0) + n;
    if (r.canal === "calculadora" || r.canal === "configurador") w.calculos += n;
  }
  for (const r of crm?.clics ?? []) { const w = dia(r.dia); if (r.tipo === "whatsapp") w.whatsapp += Number(r.n); else if (r.tipo === "llamada") w.llamadas += Number(r.n); }
  return {
    hoy, web, ga: [], gsc: [],
    anuncios: { actualizado: "", diario: [], mensual: [] },
    redes: null, google: false,
    nombre: "AMS Cerramientos",
    // Primer día con el contador en marcha: el primer día con alguna visita apuntada (o hoy, si aún no hay ninguna).
    inicioVisitas: Object.keys(web).filter((d) => web[d].vistas > 0).sort()[0] ?? hoy,
    // Mientras no haya ningún día anterior con visitas contadas, la mesa arranca en «Hoy» (si no, saldría todo a cero).
    presetInicial: Object.entries(web).some(([d, w]) => d < hoy && w.vistas > 0) ? ("28" as const) : ("hoy" as const),
  };
}

export async function detalleReal(desde: string, hasta: string, soloCrm = false) {
  const crmDatos = await delCrm(desde, hasta);
  const crmPor: Record<string, { leads: number; visitas: number; presupuestos: number; firmados: number; descartados: number }> = {};
  for (const r of crmDatos?.crm ?? []) {
    const k = canalCrm(r.origen); const x = (crmPor[k] ??= { leads: 0, visitas: 0, presupuestos: 0, firmados: 0, descartados: 0 });
    x.leads += Number(r.leads); x.visitas += Number(r.visitas); x.presupuestos += Number(r.presupuestos); x.firmados += Number(r.firmados); x.descartados += Number(r.descartados);
  }
  const crm = Object.entries(crmPor).map(([origen, x]) => ({ origen, ...x, firmado: 0, facturado: 0 }));
  if (soloCrm) return { crm };

  await asegurarTablas();
  const q = sql();
  const [pags, ori, pers, tf] = await Promise.all([
    q`SELECT pagina, count(*)::int AS n, count(*) FILTER (WHERE disp = 'movil')::int AS movil FROM vistas
      WHERE (creado AT TIME ZONE 'Europe/Madrid')::date BETWEEN ${desde}::date AND ${hasta}::date
      GROUP BY pagina ORDER BY n DESC LIMIT 30`,
    q`SELECT fuente, disp, count(*)::int AS n, count(*) FILTER (WHERE entrada)::int AS e, count(*) FILTER (WHERE nuevo)::int AS u FROM vistas
      WHERE (creado AT TIME ZONE 'Europe/Madrid')::date BETWEEN ${desde}::date AND ${hasta}::date GROUP BY fuente, disp`,
    q`SELECT count(*) FILTER (WHERE nuevo)::int AS u FROM vistas WHERE (creado AT TIME ZONE 'Europe/Madrid')::date BETWEEN ${desde}::date AND ${hasta}::date`,
    q`SELECT fuente, sum(segundos)::int AS s, count(*) FILTER (WHERE rebote)::int AS r FROM tiempos
      WHERE (creado AT TIME ZONE 'Europe/Madrid')::date BETWEEN ${desde}::date AND ${hasta}::date GROUP BY fuente`,
  ]);
  const seg: Record<string, number> = {}, reb: Record<string, number> = {};
  for (const r of tf) { const k = canalMesa(r.fuente); seg[k] = (seg[k] ?? 0) + Number(r.s ?? 0); reb[k] = (reb[k] ?? 0) + Number(r.r ?? 0); }
  const o: Record<string, { n: number; movil: number; visitas: number; personas: number }> = {};
  for (const r of ori) {
    const k = canalMesa(r.fuente);
    const x = (o[k] ??= { n: 0, movil: 0, visitas: 0, personas: 0 });
    x.n += Number(r.n); x.visitas += Number(r.e); x.personas += Number(r.u);
    if (r.disp === "movil") x.movil += Number(r.n);
  }
  return {
    paginas: pags.map((r) => ({ pagina: String(r.pagina), n: Number(r.n), movil: Number(r.movil) })),
    clicsPagina: [],
    lupa: [],
    gsc: null,
    entradas: [],
    personas: Number(pers[0]?.u ?? 0),
    origenes: Object.entries(o).map(([origen, x]) => ({ origen, ...x, segundos: seg[origen] ?? 0, rebotes: reb[origen] ?? 0 })).sort((a, b) => b.n - a.n),
    crm,
  };
}
