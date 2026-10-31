import { NextRequest, NextResponse } from "next/server";
import { asegurarTablas, hayBaseDeDatos, INTERNAS, sql } from "@/lib/db";
import { ROBOT, superaLimite } from "@/lib/contador";

export const dynamic = "force-dynamic";

/* Tiempo de permanencia y rebote — /api/tiempo (como en Reformadísimo, 31-oct-2026).
   Segundos con una página a la vista, mandados por public/contador.js. Ni IP guardada, ni cookies,
   ni datos de la persona. Sin robots. Cada trozo, como mucho 30 minutos. */

const limpio = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[^\p{L}\p{N}/._:-]/gu, "").slice(0, n) : "");

export async function POST(req: NextRequest) {
  const nada = new NextResponse(null, { status: 204 });
  if (!hayBaseDeDatos()) return nada;
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || ROBOT.test(ua)) return nada;
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "sin-ip";
  if (superaLimite(`t:${ip}`, 300)) return nada;
  try {
    const b = JSON.parse((await req.text()).slice(0, 2000) || "{}");
    const pagina = limpio(b.pagina, 150);
    if (!pagina.startsWith("/") || INTERNAS.test(pagina)) return nada;
    const s = Math.round(Number(b.s));
    const rebote = b.rebote === true;
    if (!Number.isFinite(s) || (s < 1 && !rebote)) return nada;
    const segundos = Math.max(0, Math.min(s, 1800));
    const fuente = limpio(b.fuente, 60) || "directo";
    const disp = b.disp === "pc" ? "pc" : "movil";
    await asegurarTablas();
    await sql()`INSERT INTO tiempos (pagina, fuente, disp, segundos, rebote) VALUES (${pagina}, ${fuente}, ${disp}, ${segundos}, ${rebote})`;
  } catch (e) {
    console.error("[tiempo] no apuntado:", e);
  }
  return nada;
}
