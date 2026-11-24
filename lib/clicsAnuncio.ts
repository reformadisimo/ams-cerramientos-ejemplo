import { sql } from "@/lib/db";

/* Ayudas de la tabla clics_anuncio (24-nov-2026, copiado del modelo de Reformadísimo del 3-nov). Ver app/api/clic-anuncio/route.ts. */

let tablaLista = false;
let ultimaLimpieza = 0;
export const limpio = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[^\p{L}\p{N}/._:|-]/gu, "").slice(0, n) : "");
export const PLATAFORMAS = new Set(["google", "meta", "tiktok", "microsoft", "linkedin", "chatgpt", "otra"]);

export async function asegurarTabla() {
  if (tablaLista) return;
  const q = sql();
  await q`CREATE TABLE IF NOT EXISTS clics_anuncio (id BIGSERIAL PRIMARY KEY, creado TIMESTAMPTZ NOT NULL DEFAULT now(), ip TEXT NOT NULL, plataforma TEXT, campana TEXT, landing TEXT, disp TEXT, contacto BOOLEAN NOT NULL DEFAULT false)`;
  await q`CREATE INDEX IF NOT EXISTS clics_anuncio_fecha ON clics_anuncio (creado)`;
  await q`CREATE INDEX IF NOT EXISTS clics_anuncio_ip ON clics_anuncio (ip, creado)`;
  tablaLista = true;
}

/** Borra lo de más de 30 días. Como mucho una vez cada 6 horas por instancia (no despierta la base por sí sola). */
export async function borrarViejos(forzar = false) {
  if (!forzar && Date.now() - ultimaLimpieza < 6 * 3600 * 1000) return 0;
  ultimaLimpieza = Date.now();
  const r = await sql()`DELETE FROM clics_anuncio WHERE creado < now() - interval '30 days' RETURNING id`;
  return r.length;
}
