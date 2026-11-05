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


/* Páginas privadas de Javi (todo-es-tuyo, conoce-tu-cliente...): con PRIV_RUTA puesta en Vercel solo se abren en
   /<nombre>-<PRIV_RUTA> (dirección larga, difícil de adivinar); /<nombre> a secas da 404. Los enlaces de la guía van a
   /ir/<nombre>, que solo reenvía si ese navegador ya pasó por la guía (cookie ams_g). Sin PRIV_RUTA todo sigue como
   antes (no se rompe nada). PRIV_RUTA vive SOLO en Vercel: el repositorio es público. Más adelante, pasarlas a clave. */
const PRIV = ["todo-es-tuyo", "conoce-tu-cliente", "correos-ejemplo", "linkedin-ams", "fotos-web-antigua", "conversaciones", "mapa-de-obras"];
const COOKIE_G = "ams_g";
/* Descarga de la web (ZIP de la última versión + LEEME con las instrucciones para otro proveedor). Mismo trato que
   las privadas: /ir/descargar-web desde la guía -> /descargar-web-<PRIV_RUTA> -> ZIP. Nunca indexada. */
const ZIP_WEB = "https://github.com/reformadisimo/ams-cerramientos-ejemplo/archive/refs/heads/main.zip";
function zipWeb() {
  const r = NextResponse.redirect(ZIP_WEB, 302);
  r.headers.set("X-Robots-Tag", "noindex, nofollow");
  r.headers.set("Referrer-Policy", "no-referrer");
  return r;
}

async function privadas(req: NextRequest): Promise<NextResponse | null> {
  const ruta = (process.env.PRIV_RUTA ?? "").trim();
  const p = req.nextUrl.pathname.replace(/\/+$/, "");
  if (ruta.length < 12) {
    /* Sin PRIV_RUTA: /ir/<nombre> lleva a la dirección de siempre, para que los enlaces de la guía no se rompan. */
    if (p === "/ir/descargar-web") return zipWeb();
    if (p.startsWith("/ir/") && PRIV.includes(p.slice(4))) { const u = req.nextUrl.clone(); u.pathname = p.slice(3); return NextResponse.redirect(u, 307); }
    return null;
  }
  const h = await huella(`priv:${ruta}`);
  if (p === "/guia-javi" || p === "/guia-javi.html" || p.startsWith("/guia-javi/")) {
    const r = NextResponse.next();
    r.cookies.set(COOKIE_G, h, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
    return r;
  }
  if (p === `/descargar-web-${ruta}`) return zipWeb();
  if (p === "/descargar-web" || p.startsWith("/descargar-web/")) return new NextResponse("No encontrada.", { status: 404 });
  if (p === "/ir/descargar-web") {
    if (req.cookies.get(COOKIE_G)?.value === h) { const u = req.nextUrl.clone(); u.pathname = `/descargar-web-${ruta}`; return NextResponse.redirect(u, 307); }
    return new NextResponse("Entra por la guía.", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  if (p.startsWith("/ir/")) {
    const n = p.slice(4);
    if (PRIV.includes(n) && req.cookies.get(COOKIE_G)?.value === h) {
      const u = req.nextUrl.clone();
      u.pathname = `/${n}-${ruta}`;
      const r = NextResponse.redirect(u, 307);
      r.headers.set("Referrer-Policy", "no-referrer");
      return r;
    }
    return new NextResponse("Entra por la guía.", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  for (const n of PRIV) {
    if (p === `/${n}-${ruta}`) {
      const u = req.nextUrl.clone();
      u.pathname = `/${n}.html`;
      const r = NextResponse.rewrite(u);
      r.headers.set("X-Robots-Tag", "noindex, nofollow");
      r.headers.set("Referrer-Policy", "no-referrer");
      return r;
    }
    if (p === `/${n}` || p === `/${n}.html` || p.startsWith(`/${n}/`)) return new NextResponse("No encontrada.", { status: 404 });
  }
  return null;
}

export async function middleware(req: NextRequest) {
  const pv = await privadas(req);
  if (pv) return pv;
  /* Dirección secreta, como la de Reformadísimo: /mesa-<MESA_RUTA> abre la mesa sin pedir nada.
     MESA_RUTA vive solo en Vercel (el repositorio es público: nunca escribirla en el código). */
  const ruta = (process.env.MESA_RUTA ?? "").trim();
  if (ruta.length >= 8 && req.nextUrl.pathname === `/mesa-${ruta}`) {
    const u = req.nextUrl.clone();
    u.pathname = "/mesa";
    const r = NextResponse.rewrite(u);
    r.headers.set("X-Robots-Tag", "noindex, nofollow");
    r.headers.set("Referrer-Policy", "no-referrer");
    return r;
  }
  if (!req.nextUrl.pathname.startsWith("/mesa")) return NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/mesa-")) return new NextResponse("No encontrada.", { status: 404 });
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

export const config = { matcher: ["/mesa", "/mesa/:path*", "/mesa-:ruta", "/ir/:n", "/guia-javi", "/guia-javi.html", "/guia-javi/:path*", "/(todo-es-tuyo|conoce-tu-cliente|correos-ejemplo|linkedin-ams|fotos-web-antigua|conversaciones|mapa-de-obras|descargar-web)(.*)"] };
