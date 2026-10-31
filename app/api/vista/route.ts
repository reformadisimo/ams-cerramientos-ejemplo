import { NextRequest, NextResponse } from "next/server";
import { asegurarTablas, hayBaseDeDatos, INTERNAS, sql } from "@/lib/db";
import { ROBOT, superaLimite } from "@/lib/contador";

export const dynamic = "force-dynamic";

/* Páginas vistas — /api/vista. Contador anónimo (public/contador.js).
   Ni IP guardada, ni cookies, ni datos de la persona. Sin base de datos, no hace nada. */

const limpio = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[^\p{L}\p{N}/._:-]/gu, "").slice(0, n) : "");

export async function POST(req: NextRequest) {
  const nada = new NextResponse(null, { status: 204 });
  if (!hayBaseDeDatos()) return nada;
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || ROBOT.test(ua)) return nada;
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "sin-ip";
  if (superaLimite(ip)) return nada;
  try {
    const b = JSON.parse((await req.text()).slice(0, 2000) || "{}");
    const pagina = limpio(b.pagina, 150);
    if (!pagina.startsWith("/") || INTERNAS.test(pagina)) return nada;
    const fuente = limpio(b.fuente, 60) || "directo";
    const disp = b.disp === "pc" ? "pc" : "movil";
    await asegurarTablas();
    await sql()`INSERT INTO vistas (pagina, fuente, disp, entrada, nuevo) VALUES (${pagina}, ${fuente}, ${disp}, ${b.entrada === true}, ${b.nuevo === true})`;
  } catch (e) {
    console.error("[vista] no apuntada:", e);
  }
  return nada;
}
