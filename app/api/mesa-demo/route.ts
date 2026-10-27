import { NextRequest, NextResponse } from "next/server";
import { detalleDemo } from "@/lib/mesaDemo";
import { diaMadrid } from "@/lib/hoy";

/* Detalle inventado de la mesa de EJEMPLO de AMS. No lee ningún dato real. */
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const ok = (d: string | null) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? "");
  if (!ok(q.get("desde")) || !ok(q.get("hasta"))) return NextResponse.json({ error: "fechas" }, { status: 400 });
  const d = detalleDemo(q.get("desde")!, q.get("hasta")!, diaMadrid(0));
  return NextResponse.json(q.get("solo") === "crm" ? { crm: d.crm } : d, { headers: { "Cache-Control": "no-store" } });
}
