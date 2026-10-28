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
  const [abierto, setAbierto] = useState<string | null>(null); // cl·v932: cada logo explica qué es al pulsarlo
  return (
    <section className="mt-6" aria-label="Conectado con">
      <h2 className="font-serif text-[22px] italic text-ink">Conectado con</h2>
      <p className="mt-1 text-[14px] text-ink/60">De aquí salen los datos. Tú no tienes que hacer nada. Pulsa uno y te decimos qué es.</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {nombres.map((n) => (
          <li key={n}><button type="button" aria-expanded={abierto === n} onClick={() => setAbierto(abierto === n ? null : n)} className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border py-1 pl-2 pr-3.5 text-[14px] font-semibold ${abierto === n ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/80"}`}>
            <LogoMarca nombre={n} tam={24} />{n}
          </button></li>
        ))}
      </ul>
      {abierto && <QueTexto texto={`${abierto}: ${GLOSARIO[abierto] ?? "Una de las fuentes de datos de la mesa."}`} />}
      <Glosario />
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

/* ───────────────────────── Alegría en toda la mesa (cl·v915) ───────────────────────── */
/** Icono y color de cada caja de la vista completa, según su título. Si el título lleva el nombre de una plataforma, sale su logo. */
export function iconoDeTitulo(t: string): { n?: string; color: string; logo?: string } | null {
  const r: [RegExp, { n?: string; color: string; logo?: string }][] = [
    [/Ficha de Google/i, { color: "#2a6f86", logo: "Ficha de Google" }],
    [/Instagram/i, { color: "#d9822b", logo: "Instagram" }],
    [/Clarity/i, { n: "mapa", color: "#5b569c" }],
    [/Google/i, { color: "#2a6f86", logo: "Google" }],
    [/Rese/i, { n: "estrella", color: "#d9822b" }],
    [/WhatsApp/i, { n: "telefono", color: C.aviso }],
    [/De dónde vienen|Por origen/i, { n: "mapa", color: C.web }],
    [/destacado/i, { n: "estrella", color: C.dinero }],
    [/Recorrido|petición al trabajo/i, { n: "camino", color: C.camino }],
    [/Inversión/i, { n: "moneda", color: C.dinero }],
    [/Campañas/i, { n: "megafono", color: C.anuncios }],
    [/canal/i, { n: "red", color: C.ventas }],
    [/buscan/i, { n: "lupa", color: C.web }],
    [/Rebote/i, { n: "rayo", color: C.ia }],
    [/perdiendo clientes/i, { n: "campana", color: C.anuncios }],
    [/Por dónde entran|entrada|más vistas|cada página|Páginas/i, { n: "globo", color: C.web }],
  ];
  return r.find(([re]) => re.test(t))?.[1] ?? null;
}
/** Marca pequeña para el título de una caja: loseta de color o logo de la plataforma sobre blanco. */
export function MarcaTitulo({ titulo, tam = 40 }: { titulo: string; tam?: number }) {
  const i = iconoDeTitulo(titulo);
  if (!i) return null;
  if (i.logo) return <span aria-hidden="true" className="inline-grid shrink-0 place-items-center rounded-[14px] border border-line bg-white" style={{ width: tam, height: tam, boxShadow: "0 3px 0 #e9e2d4" }}><LogoMarca nombre={i.logo} tam={Math.round(tam * 0.62)} /></span>;
  return <Loseta n={i.n ?? "estrella"} color={i.color} tam={tam} />;
}
/** Icono y color de las tarjetas de cifras de la vista completa, por identificador de la medida. */
export const ICONO_MEDIDA: Record<string, [string, string]> = {
  peticiones: ["persona", C.mercado], visitas: ["casa", C.web], pulsaciones: ["telefono", C.aviso], inversion: ["moneda", C.dinero], cpl: ["moneda", C.dinero],
  sesiones: ["globo", C.web], organico: ["lupa", C.web], rebote: ["rayo", C.ia], conversion: ["embudo", C.camino], calculos: ["mando", C.ventas],
  comerciales: ["casa", C.ventas], firmados: ["documento", C.mercado], margen: ["escudo", C.noche],
};
/** Tinte suave del color de una tarjeta (para que no sea todo blanco). */
export const tinte = (color: string) => `${color}12`;

/** Logo de un canal de la tabla "Cada canal". */
export function LogoCanal({ canal }: { canal: string }) {
  const m: [RegExp, string | [string, string]][] = [
    [/Google Ads/i, "Google Ads"], [/Google/i, "Google"], [/Meta/i, "Meta"], [/ChatGPT|Asistentes de IA/i, "ChatGPT"], [/Redes/i, "Instagram"],
    [/Directo/i, ["casa", C.web]], [/Referidos|otros/i, ["red", C.ventas]],
  ];
  const x = m.find(([re]) => re.test(canal))?.[1];
  if (!x) return null;
  if (typeof x === "string") return <span aria-hidden="true" className="mr-2 inline-grid h-[26px] w-[26px] shrink-0 place-items-center rounded-[8px] border border-line bg-white align-middle"><LogoMarca nombre={x} tam={18} /></span>;
  return <span className="mr-2 inline-block align-middle"><Loseta n={x[0]} color={x[1]} tam={26} /></span>;
}
const MARCAS_FILA = /^(Google Ads|Ficha de Google|Instagram|Google|Meta|WhatsApp|ChatGPT|Gemini|Claude|Semrush)\b/;
/** Logo al principio de una fila de detalle si empieza por el nombre de una plataforma. */
export function LogoFila({ texto }: { texto: string }) {
  const m = texto.match(MARCAS_FILA);
  return m ? <LogoMarca nombre={m[1]} tam={20} /> : null;
}

/* ── Juegos: la mesa no solo se mira, también se juega. Todo se guarda solo en este navegador. ── */
const leer = (k: string): string | null => { try { return localStorage.getItem(k); } catch { return null; } };
const guardar = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };
const logro = () => { try { window.dispatchEvent(new Event("mesa-logro")); } catch {} };
const num0 = (n: number) => new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0, useGrouping: "always" } as Intl.NumberFormatOptions).format(Math.round(n));

/** Meta de contactos: la fijas tú con un deslizador y la mesa te dice cómo vas. Pintura pura, sin movimiento. */
export function MetaDelMes({ actual }: { actual: number }) {
  const tope = Math.max(60, Math.ceil((actual * 2) / 10) * 10);
  const [meta, setMeta] = useState<number | null>(null);
  useEffect(() => { const g = Number(leer("rd-mesa-meta")); if (g > 0) setMeta(Math.min(g, 10000)); }, []);
  const v = meta ?? Math.max(10, Math.round(actual * 1.2));
  const pct = Math.min(100, Math.round((actual / Math.max(1, v)) * 100));
  const hecho = actual >= v;
  return (
    <section className="rounded-[20px] border border-line p-4" style={{ background: tinte(C.mercado) }} aria-label="Tu meta de contactos">
      <div className="flex items-center gap-3"><Loseta n="estrella" color={C.mercado} tam={44} /><div><h3 className="font-serif text-[19px] italic leading-tight text-ink">Ponte una meta</h3><p className="text-[14px] text-ink/65">¿Cuántos contactos quieres cada 28 días?</p></div></div>
      <label className="mt-3 block text-[15px] font-semibold text-ink" htmlFor="mesa-meta">Mi meta: {num0(v)} contactos</label>
      <input id="mesa-meta" type="range" min={5} max={tope} step={1} value={Math.min(v, tope)} onChange={(e) => { const n = Number(e.target.value); setMeta(n); guardar("rd-mesa-meta", String(n)); logro(); }} className="mt-1 h-11 w-full cursor-pointer accent-[#1d6b3a]" aria-valuetext={`${v} contactos`} />
      <div className="mt-1 h-4 overflow-hidden rounded-full bg-white" role="img" aria-label={`Vas al ${pct} por ciento de tu meta`}><div className="h-full rounded-full" style={{ width: `${pct}%`, background: hecho ? C.aviso : C.mercado }} /></div>
      <p className="mt-2 text-[15px] leading-snug text-ink/80">{hecho ? `Meta cumplida: ${num0(actual)} de ${num0(v)}. Esto se celebra (con un café).` : `Vas al ${pct} %: ${num0(actual)} de ${num0(v)}. Te faltan ${num0(v - actual)}.`}</p>
    </section>
  );
}

/** Adivina la cifra: apuestas un número y la mesa te dice cuánto te has acercado. */
export type Pregunta = { texto: string; real: number; unidad: string; max: number };
export function Adivina({ preguntas }: { preguntas: Pregunta[] }) {
  const [i, setI] = useState(0);
  const [apuesta, setApuesta] = useState<number | null>(null);
  const [visto, setVisto] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  useEffect(() => { setAciertos(Number(leer("rd-mesa-aciertos")) || 0); }, []);
  if (!preguntas.length) return null;
  const p = preguntas[i % preguntas.length];
  const v = apuesta ?? Math.round(p.max / 3);
  const dif = Math.abs(v - p.real) / Math.max(1, p.real);
  const clavado = dif <= 0.1;
  const comprobar = () => { setVisto(true); if (clavado) { const n = aciertos + 1; setAciertos(n); guardar("rd-mesa-aciertos", String(n)); logro(); } };
  const otra = () => { setI(i + 1); setApuesta(null); setVisto(false); };
  return (
    <section className="rounded-[20px] border border-line p-4" style={{ background: tinte(C.camino) }} aria-label="Adivina la cifra">
      <div className="flex items-center gap-3"><Loseta n="mando" color={C.camino} tam={44} /><div><h3 className="font-serif text-[19px] italic leading-tight text-ink">Adivina la cifra</h3><p className="text-[14px] text-ink/65">Aciertos: {aciertos}. Se acierta con un margen del 10 %.</p></div></div>
      <p className="mt-3 text-[16px] font-semibold leading-snug text-ink">{p.texto}</p>
      <label className="mt-1 block text-[15px] text-ink/80" htmlFor="mesa-adivina">Mi apuesta: <b>{num0(v)} {p.unidad}</b></label>
      <input id="mesa-adivina" type="range" min={0} max={p.max} step={1} value={Math.min(v, p.max)} disabled={visto} onChange={(e) => setApuesta(Number(e.target.value))} className="h-11 w-full cursor-pointer accent-[#7a4fd0]" aria-valuetext={`${v} ${p.unidad}`} />
      {!visto ? (
        <button type="button" onClick={comprobar} className="min-h-[44px] rounded-full bg-yellow px-5 text-[15px] font-semibold text-ink">Comprobar</button>
      ) : (
        <div>
          <p className="text-[15.5px] leading-snug text-ink"><b>Eran {num0(p.real)} {p.unidad}.</b> {clavado ? "Casi clavado. Conoces tu negocio como la palma de tu mano." : v < p.real ? `Te has quedado corto por ${num0(p.real - v)}. Hay más movimiento del que creías.` : `Te has pasado por ${num0(v - p.real)}. Menos de lo que pensabas, pero con los datos en la mano.`}</p>
          <button type="button" onClick={otra} className="mt-2 min-h-[44px] rounded-full border border-line bg-white px-5 text-[15px] font-semibold text-ink hover:border-ink">Otra cifra</button>
        </div>
      )}
    </section>
  );
}

/** Insignias que se ganan usando la mesa. Sin presión: solo por gusto. */
export function Insignias() {
  const [d, setD] = useState({ dias: 0, aciertos: 0, meta: false, revisada: false });
  useEffect(() => {
    const hoy = new Date().toISOString().slice(0, 10);
    let dias: string[] = [];
    try { dias = JSON.parse(leer("rd-mesa-dias") || "[]"); } catch {}
    if (!Array.isArray(dias)) dias = [];
    if (!dias.includes(hoy)) { dias = [...dias, hoy].slice(-60); guardar("rd-mesa-dias", JSON.stringify(dias)); }
    const leerTodo = () => setD({ dias: dias.length, aciertos: Number(leer("rd-mesa-aciertos")) || 0, meta: Number(leer("rd-mesa-meta")) > 0, revisada: leer("rd-mesa-logro-revisar") === "1" });
    leerTodo();
    window.addEventListener("mesa-logro", leerTodo);
    return () => window.removeEventListener("mesa-logro", leerTodo);
  }, []);
  const lista: { t: string; como: string; n: string; color: string; ok: boolean }[] = [
    { t: "Primera visita", como: "Entrar en la mesa", n: "casa", color: C.web, ok: d.dias >= 1 },
    { t: "Constante", como: "Entrar 3 días distintos", n: "camino", color: C.camino, ok: d.dias >= 3 },
    { t: "De la casa", como: "Entrar 7 días distintos", n: "escudo", color: C.noche, ok: d.dias >= 7 },
    { t: "Ojo de lince", como: "Marcar una tarea como revisada", n: "lupa", color: C.ia, ok: d.revisada },
    { t: "Con meta", como: "Ponerte una meta de contactos", n: "estrella", color: C.mercado, ok: d.meta },
    { t: "Buen olfato", como: "Acertar una cifra", n: "mando", color: C.anuncios, ok: d.aciertos >= 1 },
  ];
  const ganadas = lista.filter((x) => x.ok).length;
  return (
    <section className="rounded-[20px] border border-line bg-white p-4" aria-label="Tus insignias">
      <div className="flex items-center gap-3"><Loseta n="estrella" color={C.dinero} tam={44} /><div><h3 className="font-serif text-[19px] italic leading-tight text-ink">Tus insignias</h3><p className="text-[14px] text-ink/65">{ganadas} de {lista.length} conseguidas. Se guardan en este dispositivo.</p></div></div>
      <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {lista.map((x) => (
          <li key={x.t} className={`flex items-center gap-2.5 rounded-[14px] border px-2.5 py-2 ${x.ok ? "border-line bg-[#fbf6ea]" : "border-dashed border-line bg-white"}`}>
            <Loseta n={x.n} color={x.ok ? x.color : "#c9c2b3"} tam={40} />
            <span className="min-w-0"><span className={`block text-[14.5px] font-semibold leading-tight ${x.ok ? "text-ink" : "text-ink/55"}`}>{x.t}</span><span className="block text-[12.5px] leading-snug text-ink/55">{x.ok ? "Conseguida" : x.como}</span></span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Bloque de juegos de la vista sencilla. */
export function JuegaConTusCifras({ contactos, preguntas }: { contactos?: number; preguntas: Pregunta[] }) {
  if (contactos === undefined && !preguntas.length) return null;
  return (
    <section className="mt-6" aria-label="Juega con tus cifras">
      <h2 className="font-serif text-[24px] italic text-ink">Juega con tus cifras</h2>
      <p className="mt-1 text-[14px] text-ink/60">Porque mirar números no tiene por qué ser un rollo.</p>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {contactos !== undefined && <MetaDelMes actual={contactos} />}
        <Adivina preguntas={preguntas} />
        <div className="lg:col-span-2"><Insignias /></div>
      </div>
    </section>
  );
}

/** Apartado plegado en una línea (cl·v921): icono, título y una pista; se abre al pulsar. Cerrado al entrar,
    para que la mesa se recorra en un vistazo y cada cosa se despliegue solo si se quiere. */
export function Plegable({ id, icono, color, titulo, pista, abiertoAlPrincipio, children }: { id: string; icono: string; color: string; titulo: string; pista?: string; abiertoAlPrincipio?: boolean; children: React.ReactNode }) {
  const [abierto, setAbierto] = useState(!!abiertoAlPrincipio);
  useEffect(() => {
    const f = () => { if (window.location.hash === "#" + id) setAbierto(true); };
    f(); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f);
  }, [id]);
  return (
    <section id={id} className="mt-3 scroll-mt-4 rounded-[18px] border border-line bg-white">
      <button type="button" aria-expanded={abierto} aria-controls={id + "-dentro"} onClick={() => setAbierto(!abierto)} className="flex min-h-[56px] w-full items-center gap-3 px-3 py-2 text-left">
        <Loseta n={icono} color={color} tam={36} />
        <span className="min-w-0 flex-1"><span className="block text-[16px] font-semibold leading-tight text-ink">{titulo}</span>{pista && <span className="block truncate text-[13px] leading-tight text-ink/60">{pista}</span>}</span>
        <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-[15px] text-ink/70">{abierto ? "–" : "+"}</span>
      </button>
      <div id={id + "-dentro"} hidden={!abierto} className="px-3 pb-3 [&>section]:mt-0 [&>section]:border-0 [&>section]:px-0 [&>section]:pt-0 [&>div]:mt-0">{children}<CerrarYVolver onClose={() => setAbierto(false)} a={id} /></div>
    </section>
  );
}

/** Rejilla de apartados compactos (cl·v925): casillas pequeñas con icono y pista; la que se abre se despliega debajo a todo el ancho.
    Se abre una cada vez; el ancla #id (barra del móvil, "Qué hago con esto") también la abre. */
export type Apartado = { id: string; icono: string; color: string; titulo: string; pista?: string; nodo: React.ReactNode };
export function Apartados({ items }: { items: Apartado[] }) {
  const [abierto, setAbierto] = useState<string | null>(null);
  useEffect(() => {
    const f = () => { const h = window.location.hash.slice(1); if (items.some((x) => x.id === h)) setAbierto(h); };
    f(); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f);
  }, [items]);
  const a = items.find((x) => x.id === abierto) ?? null;
  return (
    <div className="mt-3">
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3" role="list">
        {items.map((x) => {
          const on = abierto === x.id;
          return (
            <li key={x.id} id={x.id} className="scroll-mt-4">
              <button type="button" aria-expanded={on} aria-controls={x.id + "-dentro"} onClick={() => setAbierto(on ? null : x.id)} className={`flex min-h-[60px] w-full items-center gap-2.5 rounded-[14px] border bg-white px-2.5 py-2 text-left ${on ? "border-ink" : "border-line hover:border-ink/50"}`} style={on ? { boxShadow: `inset 0 0 0 1px ${x.color}` } : undefined}>
                <Loseta n={x.icono} color={x.color} tam={32} />
                <span className="min-w-0 flex-1"><span className="block text-[14.5px] font-semibold leading-tight text-ink">{x.titulo}</span>{x.pista && <span className="block truncate text-[12.5px] leading-tight text-ink/60">{x.pista}</span>}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {a && <div id={a.id + "-dentro"} className="mt-3 rounded-[18px] border border-line bg-white px-3 pb-3 [&>section]:mt-0 [&>section]:border-0 [&>section]:px-0 [&>section]:pt-2 [&>div]:mt-0">{a.nodo}<CerrarYVolver onClose={() => setAbierto(null)} a={a.id} /></div>}
    </div>
  );
}

/* ───────────────────────── Guía de uso (cl·v928) ───────────────────────── */
/** Pasos para alguien que no sabe nada. Para otro negocio se cambian aquí los textos y nada más. */
export const GUIA_PASOS: { icono: string; color: string; t: string; d: string; ancla?: string }[] = [
  { icono: "campana", color: "#a3505a", t: "Mira la primera línea", d: "Si es roja, hay algo que atender; si es verde, todo va bien. Pulsa el + para ver por qué.", ancla: "pl-conclusion" },
  { icono: "check", color: "#c79a00", t: "Haz lo primero de hoy", d: "En «Lo primero que haría hoy» tienes una sola cosa que hacer. Cuando la revises, pulsa «Ya lo he revisado».", ancla: "pl-hoy" },
  { icono: "grid", color: "#2a6f86", t: "Mira las baterías", d: "Cada parte del negocio tiene una batería: llena y verde, bien; naranja, mira esto; roja, importante. Pulsa una y verás el detalle.", ancla: "pl-temas" },
  { icono: "moneda", color: "#7a4fd0", t: "Lee las cuatro cifras", d: "Cuántas personas dejaron sus datos, cuántas piden visita, qué cuesta cada contacto y tu nota en Google. Si una no se entiende, pulsa el ?.", ancla: "pl-cifras" },
  { icono: "mando", color: "#7a4fd0", t: "Sueña y haz cuentas", d: "Arriba, en «Tus sueños y tus cuentas»: mueve la inversión, marca tu meta y ponnos a prueba. Son estimaciones, para pensar.", ancla: "mesa-suenos" },
  { icono: "catalejo", color: "#1d6b3a", t: "Baja a todas las cifras", d: "Las pestañas separan los temas: Ventas, Anuncios, La web, Google, Ficha y redes. En cada gráfica, la estrella es el mejor día.", ancla: "mesa-cifras-todas" },
  { icono: "chat", color: "#d9822b", t: "Pregunta lo que quieras", d: "Escribe o dicta una pregunta como se la harías a una persona. Contesta con tus cifras de 28 días.", ancla: "pl-pregunta" },
  { icono: "sobre", color: "#2f6fd0", t: "Recíbelo por correo", d: "En la línea verde de la pantalla principal puedes pedir el resumen cada día, cada lunes o cada mes, sin tener que entrar.", ancla: "pl-mas" },
  { icono: "escudo", color: "#25a244", t: "Si ves algo raro, avísanos", d: "Abajo del todo está «Avisar de un error». Nos encanta arreglarlos." },
];

/** Columna fija a la izquierda en pantallas grandes; en el móvil, una línea plegada arriba. */
export function GuiaDeUso({ pasos = GUIA_PASOS, nombre = "la mesa", modo = "lateral" }: { pasos?: typeof GUIA_PASOS; nombre?: string; modo?: "lateral" | "plegada" }) {
  const [abierta, setAbierta] = useState(false);
  /* cl·v933: la primera vez, la guía va paso a paso: resalta el paso actual, "Lo he visto, siguiente" avanza y se guarda
     en este navegador (rd-mesa-tutorial). "Saltar" la deja como lista normal; "Volver a empezar" la reinicia. */
  const [paso, setPaso] = useState<number | null>(null); // null = aún no leído; -1 = terminada o saltada
  useEffect(() => { try { const g = localStorage.getItem("rd-mesa-tutorial"); setPaso(g === null ? 0 : g === "fin" ? -1 : Math.min(Number(g) || 0, pasos.length - 1)); } catch { setPaso(-1); } }, [pasos.length]);
  const guardaPaso = (n: number) => { setPaso(n); try { localStorage.setItem("rd-mesa-tutorial", n < 0 ? "fin" : String(n)); } catch {} };
  const ir = (ancla?: string) => { if (!ancla) return; history.replaceState(null, "", "#" + ancla); window.dispatchEvent(new HashChangeEvent("hashchange")); setTimeout(() => { const el = document.getElementById(ancla); if (el) el.scrollIntoView({ behavior: "auto", block: "start" }); else window.scrollTo({ top: 0 }); }, 80); setAbierta(false); };
  const activa = paso !== null && paso >= 0;
  const siguiente = () => { if (paso === null) return; const n = paso + 1; if (n >= pasos.length) guardaPaso(-1); else { guardaPaso(n); ir(pasos[n].ancla); } };
  const lista = (
    <ol className="space-y-2.5">
      {pasos.map((p, i) => {
        const hecho = activa && i < paso!, actual = activa && i === paso;
        return (
          <li key={p.t} className={actual ? "rounded-[14px] border-2 border-yellow bg-[#fffbe6] p-1" : ""}>
            <button type="button" onClick={() => ir(p.ancla)} className={`flex w-full items-start gap-2.5 rounded-[12px] px-1.5 py-1.5 text-left hover:bg-cream ${hecho ? "opacity-55" : ""}`} disabled={!p.ancla}>
              <span className="relative shrink-0"><Loseta n={hecho ? "check" : p.icono} color={hecho ? "#2f9a62" : p.color} tam={34} /><span className="absolute -left-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">{i + 1}</span></span>
              <span className="min-w-0"><span className="block text-[14px] font-semibold leading-tight text-ink">{p.t}</span><span className="block text-[12.5px] leading-snug text-ink/65">{p.d}</span></span>
            </button>
            {actual && (
              <div className="mt-1 flex flex-wrap gap-1.5 px-1.5 pb-1">
                <button type="button" onClick={siguiente} className="min-h-[40px] rounded-full bg-yellow px-4 text-[13.5px] font-semibold text-ink">{paso === pasos.length - 1 ? "Terminar" : "Lo he visto, siguiente"}</button>
                <button type="button" onClick={() => guardaPaso(-1)} className="min-h-[40px] rounded-full border border-line bg-white px-3.5 text-[13.5px] font-semibold text-ink/70">Saltar la guía</button>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
  const cabecera = activa ? `Paso ${paso! + 1} de ${pasos.length}. Pulsa «siguiente» cuando lo hayas visto.` : `Cómo se usa ${nombre}, paso a paso. Pulsa un paso y te lleva.`;
  const reiniciar = !activa && paso !== null ? <button type="button" onClick={() => { guardaPaso(0); ir(pasos[0].ancla); }} className="mt-3 min-h-[44px] rounded-full border border-line bg-white px-3.5 text-[13px] font-semibold text-ink/70">Volver a hacer la guía paso a paso</button> : null;
  if (modo === "lateral") return (
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] overflow-y-auto border-r border-line bg-white px-3 py-4 xl:block" aria-label="Guía de uso">
        <p className="flex items-center gap-2 px-1.5 font-serif text-[20px] italic text-ink"><Loseta n="documento" color="#1a3d47" tam={30} />Guía de uso</p>
        <p className="mt-0.5 px-1.5 text-[12.5px] text-ink/60">{cabecera}</p>
        {activa && <div className="mx-1.5 mt-2 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-[#2f9a62]" style={{ width: `${(paso! / pasos.length) * 100}%` }} /></div>}
        <div className="mt-3">{lista}</div>
        <div className="px-1.5">{reiniciar}</div>
      </aside>
  );
  return (<>
      {activa && (
        <div className="sticky top-0 z-30 -mx-4 mb-2 flex items-center gap-2 border-b-2 border-yellow bg-[#fffbe6] px-4 py-2 xl:hidden sm:-mx-6 sm:px-6" role="status">
          <Loseta n={pasos[paso!].icono} color={pasos[paso!].color} tam={32} />
          <span className="min-w-0 flex-1"><span className="block text-[12px] font-bold uppercase tracking-wide text-ink/55">Guía · paso {paso! + 1} de {pasos.length}</span><span className="block truncate text-[14px] font-semibold leading-tight text-ink">{pasos[paso!].t}</span></span>
          <button type="button" onClick={siguiente} className="min-h-[40px] shrink-0 rounded-full bg-yellow px-3.5 text-[13.5px] font-semibold text-ink">{paso === pasos.length - 1 ? "Terminar" : "Siguiente"}</button>
          <button type="button" onClick={() => guardaPaso(-1)} aria-label="Saltar la guía" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-white text-[16px] text-ink/60">×</button>
        </div>
      )}
      <section className="mt-3 rounded-[18px] border border-line bg-white xl:hidden" aria-label="Guía de uso">
        <button type="button" aria-expanded={abierta} onClick={() => setAbierta(!abierta)} className="flex min-h-[52px] w-full items-center gap-3 px-3 py-2 text-left">
          <Loseta n="documento" color={activa ? "#c79a00" : "#1a3d47"} tam={34} />
          <span className="min-w-0 flex-1"><span className="block text-[15.5px] font-semibold leading-tight text-ink">Guía de uso{activa ? ` · paso ${paso! + 1} de ${pasos.length}` : ""}</span><span className="block truncate text-[12.5px] text-ink/60">{activa ? pasos[paso!].t : `${pasos.length} pasos, para empezar sin saber nada`}</span></span>
          <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-[15px] text-ink/70">{abierta ? "–" : "+"}</span>
        </button>
        <div hidden={!abierta} className="px-2 pb-3">{lista}{reiniciar}</div>
      </section>
  </>);
}

/** "Cerrar y volver" (cl·v936): al final de todo lo que se despliega, para que el dueño nunca se pierda. */
export function CerrarYVolver({ onClose, a }: { onClose: () => void; a?: string }) {
  return (
    <p className="mt-3 flex justify-end">
      <button type="button" onClick={() => { onClose(); setTimeout(() => { const el = a ? document.getElementById(a) : null; if (el) el.scrollIntoView({ behavior: "auto", block: "start" }); }, 30); }} className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-white px-4 text-[14px] font-semibold text-ink hover:border-ink">
        <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[12px] text-white">↑</span>Cerrar y volver arriba
      </button>
    </p>
  );
}

/* ───────────────────────── "¿Esto qué es?" (cl·v931) ───────────────────────── */
/** Botón redondo con "?" que abre una frase en llano. Para el dueño que no tiene por qué saber nada. */
export function Que({ texto, etiqueta, abierto, onToggle, tam = 28 }: { texto: string; etiqueta: string; abierto: boolean; onToggle: () => void; tam?: number }) {
  return <button type="button" aria-label={`Qué es: ${etiqueta}`} aria-expanded={abierto} onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`relative grid shrink-0 place-items-center rounded-full border text-[13px] font-bold before:absolute before:-inset-2 before:content-[''] ${abierto ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/70 hover:border-ink"}`} style={{ width: tam, height: tam }}>?</button>;
}
export function QueTexto({ texto }: { texto: string }) {
  return <p className="mt-2 rounded-[10px] bg-[#fbf6ea] px-3 py-2 text-[13.5px] leading-snug text-ink/85">{texto}</p>;
}
/** Explicaciones por nombre de columna, caja o cifra. Si una tabla no tiene su propia ayuda, se busca aquí por el título. */
export const EXPLICA: Record<string, string> = {
  // columnas
  "Clics": "Veces que alguien pulsa y entra. Un clic es una visita que llega.",
  "Veces que sale": "Cuántas veces ha aparecido el anuncio o la página en pantalla, aunque no pulsen.",
  "Por clic": "Lo que cuesta cada visita que llega del anuncio. Cuanto más bajo, mejor.",
  "Por contacto": "Lo que cuesta cada persona que deja sus datos. Es la cifra que manda en anuncios.",
  "Inversión": "Dinero gastado en anuncios en estas fechas.",
  "Contactos": "Personas que han dejado sus datos (formulario, WhatsApp, llamada).",
  "Visitas": "Veces que alguien entra. Una misma persona puede entrar varias veces.",
  "Con interés": "De cada 100 visitas, cuántas hacen algo (bajan, pulsan, se quedan más de 10 segundos) en vez de irse.",
  "Acciones clave": "Lo que de verdad queremos: pedir visita, enviar un formulario, pulsar WhatsApp o llamar.",
  "Posición": "El puesto medio en Google: 1 es el primero. Por debajo de 10 ya no sales en la primera página.",
  "Canal": "Por dónde ha llegado la visita: Google sin pagar, anuncios, redes, directo…",
  "Origen": "Por dónde nos conoció ese contacto, según se apuntó en el CRM.",
  "Página": "La página concreta de la web.",
  "Campaña": "Cada campaña de anuncios, con el logo de su plataforma.",
  "Firmadas": "Pedidos firmados por contactos de estas fechas.",
  "De contacto a trabajo": "De cada 100 contactos, cuántos acaban firmando el pedido.",
  "Firmado": "Suma del importe de los pedidos firmados.",
  "Facturado": "Lo que ya se ha facturado de esos trabajos.",
  "Presupuestos": "Contactos a los que se les ha entregado presupuesto.",
  "En móvil": "De cada 100 visitas a esa página, cuántas son desde el móvil.",
  "Bajan (mediana)": "Hasta qué parte de la página baja la mitad de la gente. Si pone 25 %, la mitad no pasa del primer cuarto.",
  "Llegan al final": "De cada 100, cuántos llegan al final de la página.",
  "Segundos activos": "Segundos que la persona está de verdad mirando o tocando (no con la pestaña abierta sin más).",
  "Se van en menos de 10 s": "De cada 100, cuántos se van casi nada más entrar. Si pasa de 50, la página no convence.",
  "Clics de rabia": "Cuando alguien pulsa varias veces seguidas en el mismo sitio porque no responde. Señal de algo roto o confuso.",
  "Clics sin respuesta": "Pulsan en algo que parece un botón y no lo es.",
  "Búsqueda": "Lo que la persona escribió en Google.",
  // cajas
  "Campañas": "Cada campaña de anuncios: cuánto gasta, cuántos clics y contactos trae y a qué precio. Toca una columna para ordenar; la primera fila lleva estrella.",
  "Inversión por día": "Cuánto se ha gastado en anuncios cada día, con la línea de puntos del periodo anterior para comparar.",
  "Inversión mes a mes": "Toda la historia de inversión en anuncios, mes a mes y por plataforma.",
  "Por dónde entran": "Por qué camino llega cada visita a la web, según Analytics.",
  "Páginas más vistas": "Las páginas de la web que más gente abre.",
  "Qué hace la gente en cada página": "La lupa mira, página a página, si bajan, si se quedan y si se van enseguida.",
  "Dónde pulsan WhatsApp y llamar": "En qué páginas la gente pulsa el botón de WhatsApp o de llamar.",
  "Páginas de entrada": "La primera página que ve cada visita al llegar.",
  "De dónde vienen las peticiones": "De cada persona que deja sus datos, por qué canal llegó: Google Ads, Google sin pagar, directo…",
  "Lo más destacado": "Las tres o cuatro cosas que más han cambiado o más pesan en estas fechas, en una frase cada una.",
  "Recorrido de la web": "De todas las visitas, cuántas dejan sus datos y cuántas piden la visita técnica. Cada paso dice el % sobre el anterior.",
  "Recorrido comercial total": "Del CRM: contactos, visitas en casa, presupuestos y firmas de la gente que entró en estas fechas.",
  "De la petición al trabajo": "El camino de un contacto hasta el trabajo firmado: cuántos llegan a cada paso.",
  "Por origen": "Lo mismo, separado por cómo nos conoció cada contacto.",
  "Cada canal, de un vistazo": "Cada camino por el que llega la gente (Google Ads, Google sin pagar…) con sus visitas, contactos e inversión juntos.",
  "Clics desde Google, sin pagar": "Cuánta gente entra desde Google sin que paguemos anuncios. Es el SEO.",
  "Qué buscan cuando nos encuentran": "Las palabras que escriben en Google cuando salimos nosotros.",
  "Páginas que traen visitas desde Google": "Qué páginas nuestras aparecen en Google y cuántos clics traen.",
  "¿Nos buscan para contratar o para informarse?": "Separa las búsquedas de quien quiere contratar («instalador de ventanas en Alcalá de Henares») de quien solo quiere información («cuánto cuesta una ventana de PVC»).",
  "Rebote: quién se va sin hacer nada": "De cada 100 visitas, cuántas se van sin tocar nada. Cuanto más bajo, mejor.",
  "Páginas que pueden estar perdiendo clientes": "Páginas de servicio donde la gente se va más de lo normal y casi nadie contacta.",
  "Dónde se atasca la gente (Clarity)": "Microsoft Clarity graba lo que hace la gente: aquí salen las páginas con clics de rabia o sin respuesta.",
  "Reseñas: lo que dicen de nosotros": "Nuestra nota en Google y cuántas opiniones nuevas hay.",
  "Instagram (sin anuncios)": "Nuestra cuenta de Instagram sin pagar: a cuánta gente llegamos cada día, cuántas veces ven lo que publicamos y cuántos seguidores nuevos hay.",
  "Ficha de Google (Google Maps y búsqueda)": "La ficha que sale a la derecha en Google y en el mapa: cuántos la ven y cuántos llaman o entran desde ahí.",
};

/* ───────────────────────── Glosario en llano (cl·v932) ───────────────────────── */
/** Palabras que un dueño no tiene por qué conocer. Salen con "?" junto a cada fuente y, enteras, en "Conectado con". */
export const GLOSARIO: Record<string, string> = {
  "Google Analytics": "El contador de Google: cuenta las visitas a la web, por dónde llegan y qué hacen. Solo cuenta a quien acepta las cookies.",
  "Analytics": "Google Analytics, el contador de visitas de Google.",
  "Search Console": "El informe de Google sobre nuestras búsquedas sin pagar: qué escriben, cuántas veces salimos y en qué puesto. Va 2-3 días por detrás.",
  "Google Ads": "Los anuncios de pago en Google (los que salen arriba con la etiqueta «Patrocinado»).",
  "Ficha de Google": "La tarjeta de la empresa que sale a la derecha en Google y en Google Maps, con reseñas, teléfono y fotos.",
  "Instagram": "Nuestra cuenta de Instagram sin pagar anuncios.",
  "WhatsApp": "Los toques al botón de WhatsApp de la web.",
  "Semrush": "Una herramienta que vigila a la competencia: su tráfico y sus puestos en Google.",
  "ChatGPT": "Comprobamos si ChatGPT nos recomienda cuando alguien le pregunta por ventanas o cerramientos en tu zona.",
  "Gemini": "La IA de Google. Comprobamos si nos recomienda.",
  "Claude": "Otra IA. Comprobamos si nos recomienda.",
  "Supermetrics": "El puente que cada mañana trae los datos de Google Ads, la ficha de Google e Instagram a esta mesa.",
  "Clarity": "Microsoft Clarity: graba cómo se mueve la gente por la web (sin saber quién es) y avisa de dónde se atasca.",
  "CRM": "La libreta de clientes: cada contacto, su visita, su presupuesto y si firmó.",
  "La lupa": "Nuestro propio medidor: mira, página a página, hasta dónde baja la gente y si se va enseguida.",
  "SEO": "Salir en Google sin pagar anuncios. Cuanto mejor el SEO, menos anuncios hacen falta.",
  "Rebote": "De cada 100 visitas, cuántas se van sin hacer nada (menos de 10 segundos, una sola página). Cuanto más bajo, mejor.",
  "Acciones clave": "Lo que de verdad queremos que haga una visita: pedir visita, enviar un formulario, pulsar WhatsApp o llamar.",
  "Remarketing": "Anuncios que se enseñan solo a quien ya visitó nuestra web, para que vuelva.",
  "Cookies": "El aviso de la web que pide permiso para medir. Quien no acepta no se cuenta en Analytics ni en la lupa (sí en nuestro contador propio).",
  "Mediana": "El valor del medio: la mitad de la gente está por encima y la otra mitad por debajo. Se usa para que un caso raro no lo cambie todo.",
  "Posición": "El puesto en Google: 1 es el primero. Por debajo de 10 ya no sales en la primera página.",
};
/** Qué términos del glosario aparecen en un texto (para poner el "?" solo cuando hace falta). */
export function terminosEn(texto: string): string[] {
  const t = texto.toLowerCase();
  return Object.keys(GLOSARIO).filter((k) => k !== "Analytics" || !t.includes("google analytics")).filter((k) => t.includes(k.toLowerCase()));
}
/** Glosario completo, para el apartado "Conectado con". */
export function Glosario() {
  const [abierto, setAbierto] = useState<string | null>(null);
  return (
    <div className="mt-4">
      <p className="text-[13px] font-semibold uppercase tracking-wide text-ink/55">Palabras que salen por la mesa, en llano</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {Object.keys(GLOSARIO).filter((k) => k !== "Analytics").map((k) => <li key={k}><button type="button" aria-expanded={abierto === k} onClick={() => setAbierto(abierto === k ? null : k)} className={`min-h-[44px] rounded-full border px-3 text-[13.5px] font-semibold ${abierto === k ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/80"}`}>{k}</button></li>)}
      </ul>
      {abierto && <QueTexto texto={`${abierto}: ${GLOSARIO[abierto]}`} />}
    </div>
  );
}
