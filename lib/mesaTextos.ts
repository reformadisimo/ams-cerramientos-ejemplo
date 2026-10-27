/* ── Textos y colores compartidos de la mesa de control (27-oct, cl·v904) ──
   Un solo sitio para las palabras que ven las socias, de modo que la mesa, el panel y los correos
   digan siempre lo mismo. Sin importaciones de servidor: lo usa también el navegador. */

export type Luz = "verde" | "ambar" | "rojo" | "gris" | "azul";

/** Color y palabra de cada luz. Siempre las mismas palabras en toda la mesa. */
export const LUZ: Record<Luz, { c: string; t: string }> = {
  verde: { c: "#2f9a62", t: "Todo bien" },
  ambar: { c: "#d68a1c", t: "Mira esto" },
  rojo: { c: "#cf3f3a", t: "Importante" },
  gris: { c: "#a7a39a", t: "Sin datos aún" },
  azul: { c: "#1c8caa", t: "Datos de tu negocio" },
};

/** Los temas que se pueden elegir para el resumen por correo (clave, etiqueta). */
export const TEMAS_RESUMEN: [string, string][] = [
  ["hoy", "Lo más importante hoy"],
  ["cifras", "Las cuatro cifras"],
  ["web", "La web"],
  ["dicen", "Reputación e IA"],
  ["mercado", "Competencia"],
  ["anuncios", "Anuncios"],
  ["tuyo", "Ventas"],
];

/** Cada parte, con su artículo, para meterla en una frase ("mira la web y los anuncios"). */
export const EN_FRASE: Record<string, string> = { web: "la web", dicen: "la reputación y las IAs", mercado: "la competencia", anuncios: "los anuncios", tuyo: "las ventas" };

/** La primera frase de un texto, sin "lookbehind" (Safari anterior a 16.4 no lo entiende y dejaría la mesa en blanco). */
export function primeraFrase(s: string): string {
  const i = s.search(/\.\s/);
  return i === -1 ? s : s.slice(0, i + 1);
}

/** Un texto partido en frases, para leerlo en voz alta de una en una. */
export function frasesDe(s: string): string[] {
  return s.split(/([.:;!?])\s+/).reduce<string[]>((out, trozo, i) => {
    if (i % 2 === 0) { if (trozo.trim()) out.push(trozo.trim()); }
    else if (out.length) out[out.length - 1] += trozo;
    return out;
  }, []);
}

/** "1 contacto", "2 contactos". */
export const plural = (n: number, uno: string, varios: string) => `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0, useGrouping: "always" } as Intl.NumberFormatOptions).format(Math.round(n))} ${n === 1 ? uno : varios}`;

/** Fecha "AAAA-MM-DD" en palabras: "27 de octubre" (con año si no es el actual). */
export function fechaEnPalabras(s: string): string {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return s;
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const anio = new Date().getFullYear().toString() !== m[1] ? ` de ${m[1]}` : "";
  return `${Number(m[3])} de ${MESES[Number(m[2]) - 1]}${anio}`;
}
