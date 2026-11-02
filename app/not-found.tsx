/* 2-nov-2026: página de «no encontrada» con salida. Con la web nueva en amscerramientos.es, quien llegue por un
   enlace viejo que no tenga redirección (lib/redirecciones.json) no se queda en un callejón: ve las secciones
   principales, el precio al momento y el teléfono. */
export const metadata = { title: "Página no encontrada | AMS Cerramientos", robots: { index: false, follow: true } };

const AZUL = "#1f6fb2";
const enlaces: [string, string][] = [
  ["/ventanas-pvc", "Ventanas de PVC Kömmerling"],
  ["/ventanas-aluminio", "Ventanas de aluminio"],
  ["/cancelas-de-aluminio", "Cancelas de aluminio"],
  ["/cerramientos-terrazas", "Cerramientos de terrazas"],
  ["/persianas-cristales", "Persianas y cristales"],
  ["/trabajos", "Trabajos que hemos hecho"],
  ["/blog", "Blog"],
  ["/contacto", "Contacto"],
];

export default function NoEncontrada() {
  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", color: "#12202B", background: "#ffffff", minHeight: "100vh", padding: "40px 16px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <a href="/" style={{ display: "inline-block", marginBottom: 24 }}>
          <img src="/img/logo-cuadrado.png" alt="AMS Cerramientos" width={72} height={72} />
        </a>
        <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "0 0 10px", color: AZUL }}>Esta página ya no está aquí</h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, margin: "0 0 20px" }}>
          Hemos estrenado web y algunas direcciones han cambiado. Lo que buscabas sigue en AMS Cerramientos: elige por dónde seguir.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "0 0 24px" }}>
          <a href="/calculadora" style={{ background: AZUL, color: "#fff", padding: "12px 18px", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}>Calcula el precio de tus ventanas</a>
          <a href="/presupuesto-sin-visita" style={{ border: `2px solid ${AZUL}`, color: AZUL, padding: "10px 16px", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}>Precio con fotos</a>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
          {enlaces.map(([u, t]) => (
            <li key={u}>
              <a href={u} style={{ display: "block", padding: "12px 14px", border: "1px solid #DCE2E7", borderRadius: 10, color: "#12202B", textDecoration: "none", fontWeight: 700 }}>{t}</a>
            </li>
          ))}
        </ul>
        <p style={{ fontSize: 16, margin: 0 }}>
          ¿Prefieres hablar? Llámanos al <a href="tel:+34639788220" style={{ color: AZUL, fontWeight: 700 }}>639 78 82 20</a> o vuelve a la <a href="/" style={{ color: AZUL, fontWeight: 700 }}>portada</a>.
        </p>
      </div>
    </div>
  );
}
