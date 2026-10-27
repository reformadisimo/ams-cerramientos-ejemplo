/* Tipos de lo que pinta la mesa de control (27-oct, cl·v910). Sin importaciones de servidor: la pantalla (Mesa.tsx) solo
   necesita este fichero y mesaTextos.ts, de modo que el conjunto se puede copiar a otro proyecto tal cual. */
import type { Luz } from "@/lib/mesaTextos";
export type { Luz };

export type Modulo = {
  id: string; titulo: string; que: string; luz: Luz; conclusion: string;
  estado?: string; // palabra de estado si no vale la del color (p. ej. "Medición incompleta", "En curso")
  ver?: string;    // texto del botón de la batería (p. ej. "Ver con la lupa")
  icono?: string; color?: string; // dibujo y color de su loseta (si no, los de ICONO_AREA según el id)
  filas: { t: string; v: string; luz?: Luz }[];
  enlaces: { t: string; href: string }[];
};
export type Reloj = { n?: number; icono?: string; color?: string; t: string; v: string; sub: string; lleno: number; luz: Luz; ayuda?: string; frase?: string; detalle?: string };
export type Tarea = { id: string; texto: string; porque: string; donde?: string; ir?: string; titular?: string; boton?: string };
export type Resumen = { titulo: string; texto: string; puntos?: string[] };
/** Cifras base de 28 días para los juegos de "Aquí mandas tú" (cl·v916); la forma completa está en components/mesa/Suenos.tsx. */
export type { CifrasBase } from "@/components/mesa/Suenos";
