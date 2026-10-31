import { NextRequest, NextResponse } from "next/server";

/* La mesa real de AMS (/mesa) enseña datos de verdad: va con clave, no basta con una dirección escondida.
   La clave la pone Ig en Vercel (variable MESA_CLAVE); el navegador la pide una vez y la recuerda.
   Sin MESA_CLAVE, la mesa no se abre a nadie. (Igual que en Casiopea.) */
export function middleware(req: NextRequest) {
  const clave = (process.env.MESA_CLAVE ?? "").trim();
  if (!clave) return new NextResponse("La mesa está cerrada: falta poner la clave MESA_CLAVE en Vercel.", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } });
  const auth = req.headers.get("authorization") ?? "";
  if (auth.startsWith("Basic ")) {
    try {
      const [, pass] = atob(auth.slice(6)).split(":");
      if (pass && pass === clave) return NextResponse.next();
    } catch {}
  }
  return new NextResponse("Clave necesaria.", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Mesa de AMS Cerramientos", charset="UTF-8"', "content-type": "text/plain; charset=utf-8" } });
}

export const config = { matcher: ["/mesa", "/mesa/:path*"] };
