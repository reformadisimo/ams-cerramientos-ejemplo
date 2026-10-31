# AMS Cerramientos (web de ejemplo y mesa de control)

- La web pública son páginas estáticas en `public/`. Las genera `scripts/site2.py` (fuera del repo), que va POR DETRÁS de lo publicado: no regenerar a ciegas; los cambios se hacen en `public/` directamente.
- La mesa de control es la misma pantalla que la de Reformadísimo y Casiopea (`components/mesa/`). De ejemplo, con cifras inventadas, en `/guia-javi/panel`; la real, con clave (MESA_CLAVE), en `/mesa`.
- Contactos y CRM: Supabase (proyecto ams-cerramientos-crm). Los euros nunca salen del móvil de Javi.
- Contador propio sin cookies: `public/contador.js` -> `/api/vista` y `/api/tiempo` -> Neon (tablas `vistas` y `tiempos`). Sin base de datos se queda quieto.
- Versión: `lib/version.ts` (pildorita abajo a la izquierda). Subirla en cada cambio.
- Antes de subir: `git pull --rebase`, `npx tsc --noEmit` limpio. Commits como Ignacio de la Rubia. Cero emojis, tuteo, sin guiones largos.

## Avisos

- 2026-10-31 (ams·v2): mesa igual que Reformadísimo y Casiopea. Fechas siempre a la vista en el recuadro morado, panel «Quién entra de verdad en la web» con 7 cifras (personas, visitas, páginas, tiempo, rebote, páginas por persona y Analytics) lo primero del resumen, textos de ayuda cortos con «Ver más». Contador propio sin cookies en las 66 páginas y mesa real en `/mesa`, quietos hasta que se conecte Neon (Vercel > Storage) y se ponga MESA_CLAVE. La mesa real lee los contactos del CRM con la función `adm_mesa` de Supabase (solo cuentas, sin euros) y arranca en «Hoy» mientras no haya días anteriores.
