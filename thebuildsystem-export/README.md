# thebuildsystem — sitio exportable con login real (Supabase) y pagos (PayPal)

Este es el sitio completo, listo para subir a un hosting propio (fuera de Claude) para que el login de clientes y los pagos funcionen de verdad con tu propio dominio.

## Qué incluye

- `index.html` — la landing page (misma que ya viste en Claude)
- `auth.html` — pantalla de login / crear cuenta
- `account.html` — área privada del cliente, solo visible una vez logueado
- `css/style.css` — todos los estilos
- `js/config.js` — acá pegás tus claves de Supabase
- `js/supabase-client.js` y `js/auth.js` — la lógica de login
- `sql/schema.sql` — la tabla de clientes que hay que crear en Supabase

## Paso 1 — Crear tu proyecto de Supabase (gratis)

1. Entrá a [supabase.com](https://supabase.com) y creá una cuenta.
2. Creá un nuevo proyecto (elegí una contraseña de base de datos y guardala).
3. Andá a **Project Settings → API**.
4. Copiá el **Project URL** y la clave **anon / public**.
5. Abrí `js/config.js` en este paquete y pegalas ahí:

   ```js
   const SUPABASE_URL = "https://tu-proyecto.supabase.co";
   const SUPABASE_ANON_KEY = "tu-clave-anon-publica";
   ```

   ⚠️ Nunca uses la clave `service_role` acá — esa es secreta y no debe estar en un archivo que corre en el navegador.

## Paso 2 — Crear la tabla de clientes

1. En el panel de Supabase, andá a **SQL Editor → New query**.
2. Pegá todo el contenido de `sql/schema.sql` y ejecutalo.
   Esto crea la tabla `profiles` (un registro por cliente) con seguridad a nivel de fila, para que cada uno solo vea sus propios datos.

## Paso 3 — Activar el login por email

1. En Supabase, andá a **Authentication → Providers** y confirmá que **Email** esté activado (viene activado por defecto).
2. En **Authentication → URL Configuration**, agregá la URL de tu sitio en producción (una vez que la tengas del Paso 4) en "Redirect URLs".

## Paso 4 — Publicar el sitio

Es un sitio estático (sin build), así que cualquiera de estas opciones sirve:

**Con Vercel (recomendado, gratis):**
1. Subí esta carpeta a un repositorio de GitHub.
2. Entrá a [vercel.com](https://vercel.com), "Add New Project" → importá el repo.
3. Vercel lo detecta como sitio estático y lo publica solo. Sin configuración de build.

**Con Netlify (alternativa, también gratis):**
1. Entrá a [app.netlify.com](https://app.netlify.com).
2. Arrastrá esta carpeta directamente a "Deploy manually".

## Paso 5 — Tu dominio propio

Una vez publicado, en Vercel o Netlify andá a **Domains** y conectá tu dominio (por ejemplo thebuildsystem.com), siguiendo las instrucciones de DNS que te muestran.

## Los links de pago de PayPal

En `index.html`, los tres botones de pago tienen estos placeholders para reemplazar por los links reales que generamos en Claude:

- `PAYPAL_LINK_SOLO` → Rutina Única, $50
- `PAYPAL_LINK_6MO` → primer mes del plan de 6 meses, $140
- `PAYPAL_LINK_12MO` → primer mes del plan de 12 meses, $115

Los cobros de los meses siguientes de coaching hay que armarlos manualmente desde tu cuenta de PayPal (o pedirle a Claude que arme un link nuevo cada mes), porque estos links son de pago único, no suscripción recurrente.

## Qué es real y qué no, hoy

- **Login y cuentas**: 100% real una vez que completes los pasos 1–3 y publiques el sitio (paso 4). Las contraseñas las maneja Supabase, no vos ni Claude.
- **`account.html`**: hoy es un placeholder. Decime qué querés que vea un cliente ahí (su plan, un check-in, un link a Kahunas, PDFs) y lo construimos.
- **Pagos**: los links de PayPal son reales y cobran de verdad apenas los reemplaces en `index.html`.
