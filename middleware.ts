import { NextRequest, NextResponse } from "next/server";

/* La mesa real de AMS (/mesa) enseña datos de verdad: va con clave, no basta con una dirección escondida.
   La clave la pone Ig en Vercel (variable MESA_CLAVE). Dos formas de entrar:
   1) Enlace directo de Ig: /mesa?k=<MESA_CLAVE>. Deja en ese navegador una cookie (solo una huella de la clave,
      no la clave) durante un año y quita la clave de la dirección. Después basta con /mesa.
   2) Usuario y contraseña del navegador (la contraseña es MESA_CLAVE).
   Sin MESA_CLAVE, la mesa no se abre a nadie. (Igual que en Casiopea.) */
const COOKIE = "ams_mesa";

async function huella(clave: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`ams-mesa-cookie:${clave}`));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 48);
}

export async function middleware(req: NextRequest) {
  const clave = (process.env.MESA_CLAVE ?? "").trim();
  if (!clave) return new NextResponse("La mesa está cerrada: falta poner la clave MESA_CLAVE en Vercel.", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } });
  const h = await huella(clave);

  const k = req.nextUrl.searchParams.get("k");
  if (k !== null) {
    const limpia = req.nextUrl.clone();
    limpia.searchParams.delete("k");
    if (k.trim() === clave) {
      const r = NextResponse.redirect(limpia);
      r.cookies.set(COOKIE, h, { httpOnly: true, secure: true, sameSite: "lax", path: "/mesa", maxAge: 60 * 60 * 24 * 365 });
      r.headers.set("Referrer-Policy", "no-referrer");
      return r;
    }
  }
  if (req.cookies.get(COOKIE)?.value === h) return NextResponse.next();

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
