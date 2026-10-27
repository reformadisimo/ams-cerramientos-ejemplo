/* Web de AMS: la web estática de siempre vive en public/ (se sirve tal cual) y la mesa de control
   es una página de Next.js. Este fichero hace que las direcciones limpias (/contacto) sigan
   funcionando igual que antes, con las mismas redirecciones y cabeceras que tenía vercel.json. */
const fs = require("fs");
const path = require("path");

function paginasEstaticas(dir = path.join(__dirname, "public"), base = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...paginasEstaticas(path.join(dir, e.name), `${base}/${e.name}`));
    else if (e.name.endsWith(".html")) out.push(`${base}/${e.name}`);
  }
  return out;
}
const html = paginasEstaticas();
const rewrites = html.map((f) => {
  if (f === "/index.html") return { source: "/", destination: "/index.html" };
  if (f.endsWith("/index.html")) return { source: f.slice(0, -"/index.html".length), destination: f };
  return { source: f.slice(0, -".html".length), destination: f };
});

/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  async rewrites() { return { beforeFiles: rewrites, afterFiles: [], fallback: [] }; },
  async redirects() {
    const viejas = require("./lib/redirecciones.json");
    return [
      ...viejas,
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:dir*/index.html", destination: "/:dir*", permanent: true },
      { source: "/:ruta*.html", destination: "/:ruta*", permanent: true },
    ];
  },
  async headers() {
    const larga = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/((?!opinion|img/resena-og).*)", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/fonts/:path*", headers: larga },
      { source: "/img/:path*", headers: larga },
      { source: "/:path*.js", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
      { source: "/:path*.css", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
    ];
  },
};
