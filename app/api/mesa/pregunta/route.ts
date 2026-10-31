import { NextResponse } from "next/server";
import { llaveMesa } from "@/lib/mesaReal";

/* «Pregunta lo que quieras» en la mesa real de AMS: se activará cuando haya Analytics y anuncios conectados. */
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!llaveMesa() || b?.k !== llaveMesa()) return NextResponse.json({ ok: false, error: "Sin permiso." }, { status: 401 });
  return NextResponse.json({ ok: false, error: "Esta parte se activa cuando conectemos Analytics y los anuncios. De momento, las cifras están todas aquí abajo." });
}
