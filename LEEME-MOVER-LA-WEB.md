# Web de AMS Cerramientos: cómo ponerla donde quieras

Este archivo es para quien se haga cargo de la web (otro proveedor, o el propio Javi). Con esta carpeta y los accesos del cliente no hace falta preguntar nada a nadie.

## Qué es esto

- Una web hecha con Next.js 15 (Node 20 o superior). Las páginas públicas son HTML estático en `public/`; las funciones (formularios, precio, asistente, avisos por correo, contador de visitas) están en `pages/api/`.
- `middleware.ts` protege las páginas privadas y la mesa de control. `vercel.json` define el límite de tiempo de algunas funciones y una tarea diaria (`/api/crm-cron`).
- La carpeta `public/` contiene todo lo visible: páginas, fotos, vídeos y `sitemap.xml`.
- `CLAUDE.md` es el diario técnico: cada cambio importante, con fecha y motivo. Léelo antes de tocar nada.

## Poner la web en marcha en 6 pasos

1. Descomprime la carpeta y, dentro, ejecuta `npm install`.
2. Para probarla en tu ordenador: `npm run dev` y abre `http://localhost:3000`.
3. Crea una cuenta en vercel.com (el plan gratuito vale para empezar) y sube la carpeta: instala la CLI (`npm i -g vercel`) y ejecuta `vercel` dentro de la carpeta, o conéctala a un repositorio de GitHub propio. Cualquier otro alojamiento que admita Next.js 15 también sirve.
4. Carga las claves del apartado siguiente en la configuración del proyecto (Settings > Environment Variables). Sin ellas la parte estática funciona; fallan los formularios, correos y avisos.
5. Añade el dominio `amscerramientos.es` y `www.amscerramientos.es` al proyecto. En el panel del dominio (DonDominio) cambia solo los registros `A` de la raíz y `CNAME` de `www` por los que te indique el alojamiento. No toques los registros de correo (MX, SPF, DKIM): el correo no se interrumpe.
6. Comprueba: portada, `/calculadora`, `/presupuesto-sin-visita` (enviando una prueba), el asistente y que llega el aviso por correo.

## Claves y cuentas que necesita (se piden al cliente, no van en la carpeta)

La carpeta NO lleva ninguna clave. Cada una se crea en una cuenta del cliente:

- Correo de avisos y respuestas al cliente: cuenta de Resend con el dominio `avisos.amscerramientos.es` verificado (`AMS_RESEND_KEY`, `AMS_REMITENTE`) y destinos de avisos (`AVISOS_PARA_AMS`, `AVISOS_COPIA_AMS`, `RESPONDER_A`).
- Libreta de contactos (CRM) y mesa: proyecto de Supabase (`CRM_SUPABASE_URL`, `CRM_SUPABASE_KEY`, `AMS_SUPABASE_URL`, `AMS_SUPABASE_KEY`, `CRM_ADMIN_SECRET`, `CRM_CONVERSIONES_CLAVE`).
- Contador de visitas propio sin cookies: base de datos Neon (`DATABASE_URL` o `POSTGRES_URL`; tablas `vistas`, `tiempos`, `pasos_visita`).
- Asistente y comparador de presupuestos con inteligencia artificial: una cuenta de IA propia (`ANTHROPIC_API_KEY`, y opcionalmente `ASISTENTE_MODELO`, `ANALISIS_MODELO`, `ANALISIS_IA=0` para apagar el análisis). Es la única pieza que hasta ahora estaba en cuenta de Casiopea: quien se haga cargo abre la suya.
- Mesa de control: `MESA_CLAVE` y `MESA_RUTA`; páginas privadas: `PRIV_RUTA` (mínimo 12 caracteres); aprobación de respuestas: `APROBAR_SECRETO`; tarea diaria: `CRON_SECRET`.
- Precios: `RECARGO_NORTE` (por defecto 1.25), `PRECIARIO` (opcional, tarifa).
- Opcionales: `FAL_KEY` y `FAL_*` (visualizador de ventanas, en construcción), `WEB_BASE` y `CRM_URL` (dirección de la web).

## Cosas que NO hay que perder

- `lib/redirecciones.json` (255 reglas de la web antigua): mantienen el posicionamiento en Google.
- `public/sitemap.xml`: toda página pública nueva lleva `index, follow` y entrada en el sitemap.
- Los tres datos de empresa en el pie, el aviso legal y el JSON-LD (nombre, CIF, dirección): son obligatorios por ley y para la ficha de Google.
- Analytics, Search Console, Clarity y la ficha de Google son cuentas del cliente: no dependen de dónde esté alojada la web.

## Si algo no encaja

El diario `CLAUDE.md` explica el porqué de cada decisión. Quien lleve la web hasta ahora (Casiopea 360 / Ignacio de la Rubia) facilita el traspaso cuando se le pida, pero esta carpeta y los accesos del cliente bastan para hacerlo sin ayuda.
