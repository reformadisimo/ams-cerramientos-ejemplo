import { NextRequest, NextResponse } from "next/server";
import { asegurarTablas, hayBaseDeDatos, sql } from "@/lib/db";
import { ROBOT, superaLimite } from "@/lib/contador";
import { asegurarTabla, borrarViejos, limpio, PLATAFORMAS } from "@/lib/clicsAnuncio";

export const dynamic = "force-dynamic";

/* ── CLICS DE ANUNCIO — /api/clic-anuncio (24-nov-2026, chat de Ig; modelo de Reformadísimo) ──
   Para detectar IPs que pinchan una y otra vez en los anuncios sin pedir nada (competidores, curiosos, robots)
   y excluirlas en Google Ads. SOLO se guarda la IP de las visitas que llegan desde un anuncio (gclid, gbraid, wbraid,
   fbclid, ttclid, msclkid o utm_medium de pago), una vez por visita y en su primera página. Las demás visitas no
   pasan nunca por aquí. Las filas se borran solas a los 30 días. Política de privacidad, apartado nuevo.
   Dos llamadas desde public/contador.js:
     { tipo: "clic", plataforma, campana, landing, disp }  -> nueva fila
     { tipo: "contacto" }                                  -> marca contacto=true en la última fila de esa IP (2 h)
   Mismo filtro de robots que /api/vista. Sin base de datos, no hace nada. */

export async function POST(req: NextRequest) {
  const nada = () => new NextResponse(null, { status: 204 });
  if (!hayBaseDeDatos()) return nada();
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || ROBOT.test(ua)) return nada();
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  if (!ip || superaLimite("clic:" + ip, 30)) return nada();
  try {
    const b = JSON.parse((await req.text()).slice(0, 1000) || "{}");
    await asegurarTablas();
    await asegurarTabla();
    if (b.tipo === "contacto") {
      await sql()`UPDATE clics_anuncio SET contacto = true WHERE id = (SELECT id FROM clics_anuncio WHERE ip = ${ip} AND creado > now() - interval '2 hours' ORDER BY creado DESC LIMIT 1)`;
      return nada();
    }
    if (b.tipo !== "clic") return nada();
    const plataforma = PLATAFORMAS.has(String(b.plataforma)) ? String(b.plataforma) : "otra";
    const landing = limpio(b.landing, 150);
    if (!landing.startsWith("/")) return nada();
    const campana = limpio(b.campana, 80) || null;
    const disp = b.disp === "pc" ? "pc" : "movil";
    await sql()`INSERT INTO clics_anuncio (ip, plataforma, campana, landing, disp) VALUES (${ip}, ${plataforma}, ${campana}, ${landing}, ${disp})`;
    await borrarViejos();
  } catch (e) {
    console.error("[clic-anuncio] no apuntado:", e);
  }
  return nada();
}
