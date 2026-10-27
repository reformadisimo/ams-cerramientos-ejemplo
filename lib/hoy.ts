/** Fecha de hoy en Madrid (AAAA-MM-DD), con un desplazamiento en días. */
export function diaMadrid(offset = 0): string {
  const base = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const d = new Date(`${base}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}
