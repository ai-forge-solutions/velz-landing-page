# Analítica y medición SEO / AEO / GEO

Qué hace el código y qué hay que configurar a mano en GA4, Search Console y Bing.

## Dónde vive la propiedad

- GA4: cuenta **velz** (`414264483`), propiedad **velz.io** (`561805505`), flujo web **velz.io web**, ID de medición `G-K8Y6LZEYXN`. Creada con la cuenta de Google de Miguel en `ai-forges.com`. Para dar acceso a más personas: *Admin → Account access management → +*.
- Netlify: `VITE_GA_MEASUREMENT_ID` existe solo en el contexto *Production*. Las Deploy Previews y los branch deploys no miden.
- Ya configurado en GA4 (1 nov 2026):
  - Zona horaria Europe/Madrid y EUR.
  - Retención de 14 meses.
  - Medición mejorada sin interacciones de formulario.
  - Dimensiones personalizadas `cta_location`, `cta_text`, `ai_source` y `ai_referrer`.
  - Grupo de canales **velz channels** como grupo principal. Es una copia del predeterminado, con «AI Assistant» antes de Referral y ampliado con la regex de fuentes de IA.
- Ya configurado en Search Console (2 nov 2026): propiedad de dominio `velz.io` (propietaria verificada: Gmail de Miguel), sitemap reenviado y `miguel.carmona@ai-forges.com` con permiso *Full*.
- Pendiente: marcar `generate_lead` como key event con la estrella en *Admin → Events* cuando llegue el primer lead. Esta versión de GA4 no permite crearlo antes por nombre. Los key events `purchase`, `qualify_lead` y `close_convert_lead` los creó GA4 automáticamente por el objetivo «Generar leads»; se pueden ignorar.

## Lo que ya hace el código (`src/analytics.js`)

- **GA4 con Consent Mode v2 en modo básico.** Todo empieza denegado y `gtag.js` solo se carga después de que el visitante pulse «Aceptar». «Rechazar» tiene el mismo peso visual que «Aceptar», como pide la AEPD. Desde el enlace «Cookies» del pie de página se puede cambiar la elección; si se retira el consentimiento, se paran las mediciones y se borran las cookies `_ga*`.
- **Mismo módulo en la SPA y en las guías estáticas** (`/guias/*`). Es el único script que cargan las guías.
- **Sin `VITE_GA_MEASUREMENT_ID` no hace nada**: no sale banner ni hay seguimiento. Así está en desarrollo local, y lo mismo pasa en el prerender de react-snap.
- **Los tokens privados nunca llegan a GA**: `/tools/:slug/:token` se envía como `/tools/:slug/[token]` tanto en `page_location` como en `page_referrer`.
- **`content_group`** en cada página: `landing`, `guides_index`, `guide`, `tool`, `lead_magnet`, `legal`, `other`.
- **Eventos**

  | Evento | Cuándo | Parámetros |
  |---|---|---|
  | `generate_lead` | El formulario de Formspree se envía correctamente | `form_id`, `cta_location` |
  | `cta_click` | Clic en cualquier enlace a `#cta` o `/#cta` (landing y guías) | `cta_text`, `cta_location` |
  | `contact_email_click` | Clic en un `mailto:` | `cta_location` |
  | `ai_referral` | La sesión llega desde un asistente de IA (por referrer o `utm_source`), una vez por sesión | `ai_source`, `ai_referrer` |

  `cta_location` es el `id` de la sección más cercana (`hero`, `cta`…) o `nav`/`header`/`footer`/`main`.
  | `guide_read_progress` | El lector pasa el 25/50/75/100 % del cuerpo de una guía | `percent_read` |
  | `LCP`, `INP`, `CLS` | Core Web Vitals de visitantes reales (librería `web-vitals`) | `value`, `metric_value`, `metric_rating`, `metric_id` |

## SEO técnico, AEO y GEO (en el código)

- **Landing**: title y description orientados a «Marketing Mix Modeling». JSON-LD con `Organization` + `ProfessionalService` (servicios MMM y Momentum, descritos solo con lo que dice la página), `Person` (Miguel Carmona, fundador), `WebSite` y `WebPage`. El pie enlaza a `/guias`.
- **Guías**: JSON-LD `Article` (autor, `datePublished` y `dateModified`, editor y temas) y `BreadcrumbList`. Firma visible con la misma fecha, Open Graph y Twitter cards, y el bloque «Más guías» fuera del `<article>` congelado. El índice lleva `CollectionPage` + `ItemList`.
  - **Al revisar una guía**, actualiza `dateModified` en su JSON-LD, `article:modified_time`, la fecha visible si cambia el contenido y su `<lastmod>` en el sitemap.
- **Favicons** (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, iconos 192/512 y `site.webmanifest`). Google y los asistentes muestran el favicon junto al resultado. Se generan con un script sin dependencias a partir del símbolo; no los edites a mano.
- **404 de verdad**: las rutas de la SPA (`/`, `/aviso-legal`, `/privacidad`, `/tools/*`) devuelven 200 y cualquier otra devuelve 404, para que Google no indexe URLs inventadas. Si añades una ruta nueva a la SPA, añádela también en `netlify.toml`.
- **Caché**: `/assets/*` (nombres con hash de Vite) se sirve con `max-age=31536000, immutable`.
- **`/llms.txt`**: resumen de velz, sus servicios y guías para asistentes de IA. Actualízalo al publicar una guía (lo comprueba un test).
- **IndexNow**: la clave está en `public/<clave>.txt`. El plugin local `netlify/plugins/indexnow` envía todas las URLs del sitemap a Bing, Yandex y otros tras cada deploy de producción. Si falla, no rompe el deploy.

## 1. Netlify

`VITE_GA_MEASUREMENT_ID` ya está configurado en Production. La Edge Function `ai-crawlers` usa `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, que ya existían.

## 2. GA4 (Admin)

1. **Propiedad y data stream web** de `https://velz.io`. Zona horaria Europe/Madrid, moneda EUR.
2. **Enhanced measurement**: mantén activados las páginas vistas, el scroll, los clics salientes y las descargas de archivos. Desactiva las interacciones con formularios: el envío real ya se mide con `generate_lead`.
3. **Key events**: marca `generate_lead`, y opcionalmente `cta_click` y `contact_email_click` como microconversiones.
4. **Dimensiones personalizadas** (ámbito evento): `cta_location`, `cta_text`, `ai_source`, `ai_referrer` (hechas). Pendientes: `percent_read` y `metric_rating`.
5. **Canal de asistentes de IA**: GA4 ya trae el canal «AI Assistant» en el grupo predeterminado, pero lo evalúa después de Referral. En **velz channels** va antes de Referral y también recoge cualquier *Source* que coincida parcialmente con la regex
   `chatgpt\.com|chat\.openai\.com|openai|perplexity|gemini\.google\.com|bard\.google\.com|copilot\.microsoft\.com|copilot\.cloud\.microsoft|claude\.ai|deepseek|meta\.ai|grok\.com|chat\.mistral\.ai|you\.com|poe\.com`
6. **Retención de datos**: 14 meses. Así se pueden comparar periodos de un año con otro.
7. **Filtro de tráfico interno**: define tu IP en *Data streams → Configure tag settings → Define internal traffic* y activa el filtro.
8. **Vincula Search Console** (*Product links → Search Console links*) para ver en GA las consultas orgánicas junto a las landing pages. Solo puede hacerlo una cuenta que sea propietaria verificada en Search Console (el Gmail de Miguel) y administradora en GA4:
   1. Con `miguel.carmona@ai-forges.com`, en *Admin → Account access management → + → Add users*, añade `miguelcarmonar@gmail.com` como **Administrator**.
   2. Con el Gmail, en *Admin → Product links → Search Console links → Link*, elige `sc-domain:velz.io` y el flujo «velz.io web».

## 3. Google Search Console

- Usa la propiedad de dominio `velz.io` verificada por DNS. Envía `https://velz.io/sitemap.xml`.
- Cuando publiques una guía, pide la indexación con *URL inspection → Request indexing*.
- Revisa cada semana *Performance → Search results*, filtrando por la página `/guias/` y comparando consultas e impresiones con el CTR. La URL de una guía con muchas impresiones y CTR bajo indica que hay que reescribir su title y su description.

## 4. Bing Webmaster Tools (importante para GEO)

ChatGPT Search y Copilot se apoyan en el índice de Bing. Pasos:
1. Entra en [bing.com/webmasters](https://www.bing.com/webmasters) con el Gmail (el que es propietario en Search Console).
2. Elige *Import from Google Search Console* y selecciona `velz.io`. Importa la verificación y el sitemap.
3. Revisa el informe *AI Performance*, que muestra las citas de velz en las respuestas de Copilot.

IndexNow ya está activo.

## 5. Medir AEO / GEO

- **Tráfico**: en GA, mira el canal «AI assistants» y el evento `ai_referral` por `ai_source` y por landing page. El tráfico de IA es pequeño pero suele convertir más, así que compara su tasa de `generate_lead`.
- **Citas sin clic**: los asistentes muchas veces citan sin enviar visita. Haz cada mes una batería fija de 15–20 preguntas objetivo (p. ej. «qué datos necesito para un marketing mix modeling») en ChatGPT, Perplexity, Gemini y Copilot. Anota si se cita velz y qué URL aparece.
- **Rastreo de bots de IA**: la Edge Function `netlify/edge-functions/ai-crawlers.js` registra cada visita de un bot conocido en `public.crawler_hits`, en el proyecto Supabase **velz-outreach**. Los humanos pasan sin tocar. Los tokens se redactan, no se guardan IPs y la tabla tiene RLS activada sin políticas, así que solo escribe el servidor.
  - `bot_purpose`: `training` (entrenamiento), `search` (índice de búsqueda con IA), `user_request` (la IA lee la página **para responder a una persona en ese momento**) y `search_engine` (Googlebot, Bingbot).
  - La identificación es por user agent y no está verificada por IP, así que tómalo como indicativo.
  - Consultas útiles:

    ```sql
    -- Qué bots de IA leen qué páginas, por semana
    select * from crawler_hits_weekly where bot_purpose <> 'search_engine' order by week desc, hits desc;

    -- Visitas en tiempo real para responder a usuarios (la señal más cercana a una cita)
    select date_trunc('day', created_at) as day, bot, path, count(*)
    from crawler_hits where bot_purpose = 'user_request'
    group by 1, 2, 3 order by 1 desc;
    ```
