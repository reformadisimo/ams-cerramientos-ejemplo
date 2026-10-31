import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/* Base de datos del contador propio de AMS (Neon gratis, conectada desde Vercel > Storage).
   Mientras no exista, todo lo que la usa se queda quieto sin dar error: el contador no apunta y la mesa real lo dice.
   Los contactos NO van aquí: siguen en el CRM (Supabase). */

const cadena = () => (process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "").trim();
export const hayBaseDeDatos = () => cadena().length > 0;

let _sql: NeonQueryFunction<false, false> | null = null;
export function sql(): NeonQueryFunction<false, false> {
  if (!_sql) _sql = neon(cadena());
  return _sql;
}

let tablasListas = false;
/** Crea las tablas la primera vez (idempotente). */
export async function asegurarTablas() {
  if (tablasListas) return;
  const q = sql();
  await q`CREATE TABLE IF NOT EXISTS vistas (id BIGSERIAL PRIMARY KEY, pagina TEXT NOT NULL, fuente TEXT, disp TEXT, entrada BOOLEAN, nuevo BOOLEAN, creado TIMESTAMPTZ NOT NULL DEFAULT now())`;
  await q`ALTER TABLE vistas ADD COLUMN IF NOT EXISTS entrada BOOLEAN`;
  await q`ALTER TABLE vistas ADD COLUMN IF NOT EXISTS nuevo BOOLEAN`;
  await q`CREATE INDEX IF NOT EXISTS vistas_por_fecha ON vistas (creado)`;
  await q`CREATE TABLE IF NOT EXISTS tiempos (id BIGSERIAL PRIMARY KEY, pagina TEXT NOT NULL, fuente TEXT, disp TEXT, segundos INT NOT NULL, rebote BOOLEAN, creado TIMESTAMPTZ NOT NULL DEFAULT now())`;
  await q`CREATE INDEX IF NOT EXISTS tiempos_por_fecha ON tiempos (creado)`;
  tablasListas = true;
}

/** Páginas internas que no cuentan (mesa, CRM, guía de Javi, panel...). */
export const INTERNAS = /^\/(mesa|crm|mis-contactos|guia-javi|panel|lupa|api)(\/|\.|$)/;
