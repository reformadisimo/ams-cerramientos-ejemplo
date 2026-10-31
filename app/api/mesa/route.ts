import { NextRequest, NextResponse } from "next/server";
import { hayBaseDeDatos } from "@/lib/db";
import { detalleReal, llaveMesa } from "@/lib/mesaReal";

export const dynamic = "force-dynamic";

/* Detalle de un periodo para la mesa real de AMS. Solo responde con la llave que da /mesa (que va con contraseña). */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const llave = llaveMesa();
  if (!llave || p.get("k") !== llave) return NextResponse.json({ error: "sin permiso" }, { status: 401 });
  const ok = (d: string | null) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? "");
  const desde = p.get("desde"), hasta = p.get("hasta");
  if (!ok(desde) || !ok(hasta)) return NextResponse.json({ error: "fechas" }, { status: 400 });
  if (p.get("solo") !== "crm" && !hayBaseDeDatos()) return NextResponse.json({ error: "sin base de datos" }, { status: 503 });
  try {
    return NextResponse.json(await detalleReal(desde!, hasta!, p.get("solo") === "crm"), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[mesa] detalle:", e);
    return NextResponse.json({ error: "fallo" }, { status: 500 });
  }
}
