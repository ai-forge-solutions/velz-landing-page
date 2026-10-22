# velz-landing-page

Landing de Velz migrada a Vite + React con animaciones de Framer Motion, conservando el branding y el copy de la version original.

## Desarrollo

### CTA de agenda Cal.com

La landing usa `VITE_CAL_BOOKING_URL` para los CTAs de reserva. Configura esa variable con la URL pública del evento de Cal.com (por ejemplo `https://cal.com/<usuario>/<evento>`) en Netlify y en `.env.local` para pruebas locales.

Si la variable no está configurada, el CTA no apunta a una URL de Cal.com rota: cae a `mailto:miguel@velz.io` y mantiene un enlace secundario de email.

1. Instalar dependencias:

```bash
npm install
```

2. Levantar entorno local:

```bash
npm run dev
```

3. Generar build de produccion:

```bash
npm run build
```

4. Previsualizar build:

```bash
npm run preview
```

## Estructura

- `landing-v2-contraste.html`: version HTML original (referencia preservada).
- `src/App.jsx`: version React de la landing con copy y estructura migrados.
- `src/styles.css`: estilos base y tokens visuales de marca.
- `netlify/functions/lead-magnets.js`: endpoint server-side placeholder para `GET /api/lead-magnets/:token`.

## Hosting / repo actual

- Dominio público confirmado: `https://velz.io` sirve esta landing de Velz.
- Repo de la app pública: `ai-forge-solutions/velz-landing-page`.
- Stack: Vite + React como SPA estática.
- Hosting: Netlify, confirmado por `netlify.toml` (`publish = "dist"`) y redirects de SPA. Esta tarea añade Netlify Functions para soportar API routes server-side sin exponer secretos al frontend.

## Lead magnets

- Ruta pública SPA: `/tools/:tool_slug/:token`.
- API read thin: `GET /api/lead-magnets/:token`.
- Real-data preview examples (server-side Supabase reads, no browser Supabase access):
  - `example-susmies-discount` devuelve `discount_depth_analyzer` ensamblado desde `shopify_signal_analyses`, `shopify_products` y `shopify_signal_items` para `susmies.com`.
  - `example-northdeco-stockout` devuelve `stockout_leak_score` ensamblado desde datos Shopify persistidos para `northdeco.com`.
  - `example-northdeco-discount` devuelve `discount_depth_analyzer` con productos reales de `northdeco.com`.
  - `example-munkombucha-discount` devuelve `discount_depth_analyzer` con productos reales de `munkombucha.com`.
- Fixture de smoke test:
  - `test-stockout-token` / `test-ready-token` devuelve `stockout_leak_score` con contrato `inventory_lead_magnet_payload_v1` en `degraded`.
  - `test-discount-token` devuelve `discount_depth_analyzer` en `ready`.
  - `test-low-discount-token` devuelve un caso de descuento bajo.
  - `test-not-ready-token` devuelve `status: "not_ready"`.
  - `test-expired-token` devuelve `410 expired_token`; cualquier token desconocido devuelve `404 invalid_token`.
- El endpoint no ejecuta ETLs, scraping, conductor ni enriquecimientos en el request path. Los ejemplos `example-*` leen hechos ya persistidos en Supabase y ensamblan el render payload en la función cuando el entorno tiene credenciales Supabase; si el deploy preview no tiene esas variables, devuelven una exportación real de esos mismos registros de Supabase incluida en la PR. Los tokens `test-*` siguen siendo fixtures de smoke/local.

## Worker skills / agent context

- `AGENTS.md`: instrucciones de repo para Hermes/Codex/Claude-style workers.
- `.github/skills/velz-brand/SKILL.md`: look & feel de Velz; obligatorio antes de tocar UI, copy, landing, lead magnets o componentes visibles. Incorpora el kit de diseño entregado y referencia `.github/skills/velz-brand/references/design-system.md` / `integration.md` para trabajos de marca sustanciales.
- `.github/skills/README.md`: mapa de skills repo-locales importadas para diseño, landing y performance. Todas se cargan igual: `.github/skills/<skill>/SKILL.md` + `references/` si aplica.

## Nota

La migracion mantiene tipografias, paleta, iconografia SVG y narrativa del original. Si quieres cambiar enlaces (CTA, aviso legal, privacidad, email), edita los `href` en `src/App.jsx`.
