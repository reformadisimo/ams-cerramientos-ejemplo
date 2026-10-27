import type { Metadata } from "next";
import Mesa from "@/components/mesa/Mesa";
import { datosDemo } from "@/lib/mesaDemo";
import { panelDemo } from "@/lib/panelDemo";
import { diaMadrid } from "@/lib/hoy";

/* Mesa de control de EJEMPLO para AMS. Privada (no sale en Google), cifras inventadas.
   Es la misma pantalla que la de Reformadísimo; cuando conectemos las cuentas reales,
   solo cambian los datos. */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mesa de control de AMS (ejemplo)", robots: { index: false, follow: false, nocache: true } };

export default function Page() {
  const hoy = diaMadrid(0);
  const d = datosDemo(hoy);
  const p = panelDemo(hoy);
  return (
    <>
      <div className="bg-[#11343d] px-4 py-2 text-center text-[14px] leading-snug text-white">
        Mesa de control de AMS, <b>de ejemplo, con cifras inventadas</b>. Lo que todavía no está conectado (ventas, lupa, plan, espejo de la IA, vigía, preguntar y resumen por correo) se muestra como ejemplo.
      </div>
      <Mesa datos={{ ...(d as Parameters<typeof Mesa>[0]["datos"]), hoy, clave: "demo" }} temas={p.temas} resumenHoy={p.resumen} tareas={p.tareas} relojes={p.relojes} base={p.base} />
    </>
  );
}
