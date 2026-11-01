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
- **JSON-LD `Organization` + `WebSite`** en la landing, para que los buscadores y los LLM identifiquen la entidad velz.
- **`<lastmod>`** en el sitemap. Actualízalo cuando cambie una URL.

## 1. Netlify

Añade `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` en *Site configuration → Environment variables* (con alcance de build) y vuelve a desplegar. Si no lo añades, producción seguirá sin analítica.

## 2. GA4 (Admin)

1. **Propiedad y data stream web** de `https://velz.io`. Zona horaria Europe/Madrid, moneda EUR.
2. **Enhanced measurement**: mantén activados las páginas vistas, el scroll, los clics salientes y las descargas de archivos. Desactiva las interacciones con formularios: el envío real ya se mide con `generate_lead`.
3. **Key events**: marca `generate_lead`, y opcionalmente `cta_click` y `contact_email_click` como microconversiones.
4. **Dimensiones personalizadas** (ámbito evento): `cta_location`, `cta_text`, `ai_source`, `ai_referrer`.
5. **Canal de asistentes de IA**: GA4 ya trae el canal «AI Assistant» en el grupo predeterminado, pero lo evalúa después de Referral. En **velz channels** va antes de Referral y también recoge cualquier *Source* que coincida parcialmente con la regex
   `chatgpt\.com|chat\.openai\.com|openai|perplexity|gemini\.google\.com|bard\.google\.com|copilot\.microsoft\.com|copilot\.cloud\.microsoft|claude\.ai|deepseek|meta\.ai|grok\.com|chat\.mistral\.ai|you\.com|poe\.com`
6. **Retención de datos**: 14 meses. Así se pueden comparar periodos de un año con otro.
7. **Filtro de tráfico interno**: define tu IP en *Data streams → Configure tag settings → Define internal traffic* y activa el filtro.
8. **Vincula Search Console** (*Product links → Search Console links*) para ver en GA las consultas orgánicas junto a las landing pages.

## 3. Google Search Console

- Usa la propiedad de dominio `velz.io` verificada por DNS. Envía `https://velz.io/sitemap.xml`.
- Cuando publiques una guía, pide la indexación con *URL inspection → Request indexing*.
- Revisa cada semana *Performance → Search results*, filtrando por la página `/guias/` y comparando consultas e impresiones con el CTR. La URL de una guía con muchas impresiones y CTR bajo indica que hay que reescribir su title y su description.

## 4. Bing Webmaster Tools (importante para GEO)

ChatGPT Search y Copilot se apoyan en el índice de Bing. Importa el sitio desde Search Console, envía el sitemap y revisa el informe *AI Performance / Copilot*, que muestra citas en respuestas de IA. Opcional: IndexNow para avisar a Bing al publicar.

## 5. Medir AEO / GEO

- **Tráfico**: en GA, mira el canal «AI assistants» y el evento `ai_referral` por `ai_source` y por landing page. El tráfico de IA es pequeño pero suele convertir más, así que compara su tasa de `generate_lead`.
- **Citas sin clic**: los asistentes muchas veces citan sin enviar visita. Haz cada mes una batería fija de 15–20 preguntas objetivo (p. ej. «qué datos necesito para un marketing mix modeling») en ChatGPT, Perplexity, Gemini y Copilot. Anota si se cita velz y qué URL aparece.
- **Rastreo de bots de IA**: `robots.txt` permite todos los user agents. Si se quiere medir el rastreo de GPTBot, OAI-SearchBot, PerplexityBot o ClaudeBot, haría falta una Netlify Edge Function que registre el user agent. Está pendiente.
