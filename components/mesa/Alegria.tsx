/* ── La parte alegre de la mesa de control (27-oct, cl·v913) ──
   Iconos de color, logos de las plataformas y pequeñas chispas de simpatía. Sin importaciones de servidor
   ni de otros ficheros de la mesa: se copia tal cual a otro proyecto. Todo es decorativo: el nombre y el estado
   van siempre escritos al lado, y nada se mueve (solo cambia el color o la opacidad). */
"use client";
import { useEffect, useState } from "react";

/** Dibujos propios, trazo de 24x24, grosor 1,8, extremos redondeados. Para otro negocio se añade aquí el que falte. */
const TRAZOS: Record<string, string> = {
  lupa: "M11 5a6 6 0 100 12 6 6 0 000-12zM16 16l5 5",
  escudo: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z",
  camino: "M5 18c3-9 11-3 14-11M5 18m-1.5 0a1.5 1.5 0 103 0 1.5 1.5 0 10-3 0M19 7m-1.5 0a1.5 1.5 0 103 0 1.5 1.5 0 10-3 0",
  espejo: "M12 3c3.3 0 6 3 6 7s-2.7 7-6 7-6-3-6-7 2.7-7 6-7zM12 17v4M8 21h8",
  catalejo: "M3 15l11-6 2 4-11 6zM16 9l4-2 1 2-4 2z",
  persona: "M12 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM5 20c0-4 3-6 7-6s7 2 7 6",
  moneda: "M12 4a8 8 0 100 16 8 8 0 000-16zM12 7v10M9.5 9.5c0-1.5 5-1.5 5 0s-5 1.5-5 3 5 1.5 5 0",
  embudo: "M4 5h16l-6 8v6l-4-2v-4z",
  globo: "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  documento: "M7 3h7l4 4v14H7zM14 3v4h4M9.5 12h5M9.5 16h5",
  historia: "M4 19V5M4 19h16M7 15l4-4 3 3 5-6",
  mapa: "M12 21s-6-5.5-6-10a6 6 0 0112 0c0 4.5-6 10-6 10zM12 9a2 2 0 100 4 2 2 0 000-4z",
  chat: "M4 5h16v11H9l-5 4z",
  caja: "M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8",
  ajustes: "M4 8h10M18 8h2M4 16h2M10 16h10M16 6v4M8 14v4",
  estrella: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z",
  megafono: "M4 10v4h3l7 4V6L7 10zM17 9c1.5 1 1.5 5 0 6",
  campana: "M6 17V11a6 6 0 0112 0v6l2 2H4zM10 21h4",
  sobre: "M4 6h16v12H4zM4 7l8 6 8-6",
  mando: "M12 3v4M12 17v4M3 12h4M17 12h4M12 8a4 4 0 100 8 4 4 0 000-8z",
  rayo: "M13 3L5 14h6l-1 7 8-11h-6z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  casa: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  telefono: "M6 3h4l2 5-2.5 1.5a11 11 0 005 5L16 12l5 2v4a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z",
  red: "M6 7a2 2 0 100-4 2 2 0 000 4zM18 21a2 2 0 100-4 2 2 0 000 4zM18 7a2 2 0 100-4 2 2 0 000 4zM6 7v4a4 4 0 004 4h6M18 7v10",
  check: "M5 12.5l4.5 4.5L19 7.5",
};

export function Icono({ n, className = "h-6 w-6" }: { n: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={TRAZOS[n] ?? TRAZOS.estrella} />
    </svg>
  );
}

/** Cuadrado de color con el dibujo en blanco y una sombra plana debajo, como un botón. Solo decorativo. */
export function Loseta({ n, color, tam = 44 }: { n: string; color: string; tam?: number }) {
  return (
    <span aria-hidden="true" className="inline-grid shrink-0 place-items-center text-white" style={{ width: tam, height: tam, borderRadius: tam * 0.34, background: color, boxShadow: `0 4px 0 ${color}55` }}>
      <Icono n={n} className="h-[56%] w-[56%]" />
    </span>
  );
}

/** Un color por significado, siempre el mismo en toda la pantalla. La luz de estado no se toca: el icono dice qué es, la luz dice cómo va. */
export const C = { web: "#2a6f86", ia: "#d9822b", mercado: "#1d6b3a", anuncios: "#d93f3f", ventas: "#2f6fd0", dinero: "#c79a00", camino: "#7a4fd0", aviso: "#25a244", noche: "#1a3d47" };

/** Icono y color de cada parte de la mesa, por su identificador. Se cambia aquí y se lee desde todas partes. */
export const ICONO_AREA: Record<string, [string, string]> = {
  web: ["globo", C.web], dicen: ["espejo", C.ia], mercado: ["catalejo", C.mercado], anuncios: ["megafono", C.anuncios], tuyo: ["casa", C.ventas],
};
/** Icono y color de cada una de las cuatro cifras, por orden. */
export const ICONO_CIFRA: [string, string][] = [["persona", C.mercado], ["casa", C.web], ["moneda", C.dinero], ["estrella", C.ia]];
/** Icono de cada botón de la barra de abajo. */
export const ICONO_BARRA: Record<string, [string, string]> = { "mesa-hoy": ["estrella", C.dinero], "mesa-temas": ["mando", C.web], "mesa-pregunta": ["chat", C.ventas], "mesa-herramientas": ["grid", C.noche] };

/* ── Logos reales de las plataformas. Si no hay fichero, una insignia con las iniciales. Nunca se redibujan ni se inventan. ── */
const LOGO: Record<string, string> = {
  Google: "google.svg", "Google Analytics": "google-analytics-icono.png", "Search Console": "google-search-console.png", "Tag Manager": "googletagmanager.svg",
  "Google Ads": "google-ads-icono.png", "Ficha de Google": "google-business-profile-icono.png", "Google Maps": "googlemaps.svg", Meta: "meta.svg",
  Facebook: "facebook.png", Instagram: "instagram.jpg", LinkedIn: "linkedin.svg", TikTok: "tiktok.png", YouTube: "youtube.svg", WhatsApp: "whatsapp-business.jpg",
  Gmail: "gmail.svg", Resend: "resend.svg", Semrush: "semrush.svg", PageSpeed: "pagespeedinsights.svg", Vercel: "vercel.svg", ChatGPT: "openai.svg",
  Gemini: "googlegemini.svg", Claude: "claude.svg",
};
export function LogoMarca({ nombre, tam = 24 }: { nombre: string; tam?: number }) {
  const f = LOGO[nombre];
  if (!f) {
    return <span aria-hidden="true" className="grid shrink-0 place-items-center rounded-lg font-extrabold" style={{ width: tam, height: tam, fontSize: tam * 0.4, background: "#11343d", color: "#FFDE00" }}>{nombre.slice(0, 2)}</span>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/logos/herramientas/${f}`} alt="" width={tam} height={tam} className="shrink-0 rounded-md object-contain" loading="lazy" />;
}

/** "Conectado con": un chip por plataforma de la que lee la mesa. Solo las que de verdad están conectadas. */
export function FranjaConectado({ nombres }: { nombres: string[] }) {
  return (
    <section className="mt-6" aria-label="Conectado con">
      <h2 className="font-serif text-[22px] italic text-ink">Conectado con</h2>
      <p className="mt-1 text-[14px] text-ink/60">De aquí salen los datos. Tú no tienes que hacer nada.</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {nombres.map((n) => (
          <li key={n} className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-line bg-white py-1 pl-2 pr-3.5 text-[14px] font-semibold text-ink/80">
            <LogoMarca nombre={n} tam={24} />{n}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Chispa de simpatía. Humor solo en paréntesis y solo cuando todo va bien; nunca con un problema delante. ── */
/** "Buenos días", "Buenas tardes" o "Buenas noches", según la hora de Madrid. Vacío hasta que carga en el navegador (así no choca con el servidor). */
export function useSaludo(): string {
  const [s, setS] = useState("");
  useEffect(() => {
    const h = Number(new Intl.DateTimeFormat("es-ES", { hour: "numeric", hour12: false, timeZone: "Europe/Madrid" }).format(new Date())) % 24;
    setS(h >= 6 && h < 14 ? "Buenos días" : h >= 14 && h < 21 ? "Buenas tardes" : "Buenas noches");
  }, []);
  return s;
}
export const CHISPA_TODO_BIEN = ["Disfrútalo, que no pasa todos los días.", "Puedes volver a tu vida (la mesa vigila por ti).", "Hoy tu única tarea es sonreír un poco."];
export const CHISPA_HECHO = ["Hecho. Una menos.", "Revisado. Qué buen ojo tienes.", "Listo. Y sin sudar.", "Apuntado. Gracias por ocuparte."];
export const CHISPA_SIN_TAREAS = "Hoy no hay nada pendiente. Aprovecha para tomarte un café (los datos se vigilan solos).";
export const CHISPA_TODO_REVISADO = "Ya has revisado todo lo de hoy. Bien hecho (te mereces ese café).";
/** Una frase de la lista, siempre la misma para el mismo texto (así no cambia al recargar). */
export const elige = (lista: string[], clave: string) => lista[[...clave].reduce((a, c) => a + c.charCodeAt(0), 0) % lista.length];

/* ── "Avisar de un error": siempre a mano. Abre el correo ya escrito, sin formularios ni cuentas. En el ejemplo no envía nada. ── */
/** Cambia esta dirección por la del negocio de cada mesa. */
export const CORREO_ERRORES = "delarubiaignacio@gmail.com";
export function AvisarError({ demo }: { demo?: boolean }) {
  const clase = "inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-line bg-white py-1 pl-1.5 pr-4 text-[15px] font-semibold text-ink hover:border-ink";
  const dentro = (<><Loseta n="campana" color={C.anuncios} tam={32} />Avisar de un error</>);
  if (demo) return <span className="inline-flex flex-col items-center gap-1.5"><span className={clase} role="note">{dentro}</span><span className="text-[12.5px] font-semibold text-ink/55">Ejemplo: aquí se abriría tu correo</span></span>;
  const asunto = encodeURIComponent("Error en la mesa de control");
  const cuerpo = encodeURIComponent("Hola. He visto un error en la mesa.\n\nQué ha pasado:\n\n\nEn qué parte estaba:\n\n\n(Gracias por avisar.)");
  return <a href={`mailto:${CORREO_ERRORES}?subject=${asunto}&body=${cuerpo}`} className={clase}>{dentro}</a>;
}

/** Despedida de la vista sencilla: cierra con simpatía y deja a mano el aviso de errores. */
export function Despedida({ demo }: { demo?: boolean }) {
  return (
    <section className="mt-8 rounded-[22px] bg-[#fbf6ea] px-5 py-5 text-center" aria-label="Despedida">
      <div className="flex justify-center"><Loseta n="estrella" color={C.dinero} tam={48} /></div>
      <p className="mt-3 font-serif text-[22px] italic leading-tight text-ink">Eso es todo por hoy</p>
      <p className="mt-1 text-[15.5px] leading-snug text-ink/70">Ya puedes volver a lo tuyo (la mesa sigue vigilando). Si ves algo raro, dínoslo: nos encanta encontrar errores para arreglarlos.</p>
      <p className="mt-3"><AvisarError demo={demo} /></p>
    </section>
  );
}
