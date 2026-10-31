import type { Metadata } from "next";
import Mesa from "@/components/mesa/Mesa";
import { hayBaseDeDatos } from "@/lib/db";
import { datosReales, llaveMesa } from "@/lib/mesaReal";

/* MESA DE AMS (real, 31-oct-2026). Con clave (middleware.ts, MESA_CLAVE), fuera de Google.
   La misma pantalla que la de Reformadísimo y Casiopea. Lee el contador propio sin cookies (Neon)
   y los contactos del CRM (Supabase). Analytics, Google Ads y Meta se añadirán cuando estén conectados. */

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mesa de AMS Cerramientos", robots: { index: false, follow: false, nocache: true } };

export default async function MesaAms() {
  if (!hayBaseDeDatos()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-[22px] border border-line bg-white p-6">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-teal-deep">AMS Cerramientos · mesa de control</p>
          <h1 className="mt-1 font-serif text-[30px] italic text-ink">Falta conectar la base de datos</h1>
          <p className="mt-2 text-[16px] text-ink/70">En cuanto la crees en Vercel (proyecto ams-cerramientos-ejemplo, pestaña Storage, Neon gratis), esta mesa empieza a contar sola: personas, visitas, tiempo, rebote y de dónde vienen.</p>
        </div>
      </div>
    );
  }
  const d = await datosReales();
  return <Mesa datos={{ ...(d as unknown as Parameters<typeof Mesa>[0]["datos"]), clave: llaveMesa() }} />;
}
