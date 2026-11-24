import { NextRequest, NextResponse } from "next/server";
import { hayBaseDeDatos, sql } from "@/lib/db";
import { llaveMesa } from "@/lib/mesaReal";
import { asegurarTabla, borrarViejos } from "@/lib/clicsAnuncio";

export const dynamic = "force-dynamic";

/* ── IPs SOSPECHOSAS — /api/ips-sospechosas?k=<llave de la mesa> (24-nov-2026, chat de Ig) ──
   IPs con 3 o más clics de anuncio en los últimos N días (por defecto 7) y ningún contacto. Lo lee la revisión
   semanal de campañas para PROPONER exclusiones de IP en Google Ads (las añade Ig; máximo 500 por campaña; no se
   excluye nada solo). Parámetros: dias (1-30), min (2-20). Con ?resumen=1 solo devuelve el número, sin IPs.
   De paso borra lo de más de 30 días. */

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const llave = llaveMesa();
  if (!llave || p.get("k") !== llave) return NextResponse.json({ ok: false, error: "no-autorizado" }, { status: 401 });
  if (!hayBaseDeDatos()) return NextResponse.json({ ok: false, error: "sin-base-de-datos" }, { status: 503 });
  const dias = Math.min(30, Math.max(1, Number(p.get("dias")) || 7));
  const min = Math.min(20, Math.max(2, Number(p.get("min")) || 3));
  try {
    await asegurarTabla();
    const borradas = await borrarViejos(true);
    const q = sql();
    const lista = await q`
      SELECT ip, count(*)::int AS clics,
             array_agg(DISTINCT plataforma) AS plataformas,
             array_agg(DISTINCT coalesce(campana, '-')) AS campanas,
             array_agg(DISTINCT landing) AS landings,
             array_agg(DISTINCT disp) AS dispositivos,
             array_agg(to_char(creado AT TIME ZONE 'Europe/Madrid', 'DD-MM HH24:MI') ORDER BY creado) AS horas
      FROM clics_anuncio
      WHERE creado > now() - make_interval(days => ${dias})
      GROUP BY ip
      HAVING count(*) >= ${min} AND NOT bool_or(contacto)
      ORDER BY count(*) DESC
      LIMIT 100`;
    const total = await q`SELECT count(*)::int AS clics, count(DISTINCT ip)::int AS ips FROM clics_anuncio WHERE creado > now() - make_interval(days => ${dias})`;
    const base = { ok: true, dias, minimo: min, clics_anuncio: total[0]?.clics ?? 0, ips_distintas: total[0]?.ips ?? 0, sospechosas: lista.length, borradas_30_dias: borradas };
    if (p.get("resumen") === "1") return NextResponse.json(base);
    return NextResponse.json({ ...base, lista });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e).slice(0, 200) }, { status: 500 });
  }
}
