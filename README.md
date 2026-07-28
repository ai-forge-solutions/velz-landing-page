# velz-landing-page

Landing de Velz migrada a Vite + React con animaciones de Framer Motion, conservando el branding y el copy de la version original.

## Desarrollo

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
- Fixture de smoke test:
  - `test-ready-token` devuelve `status: "ready"`.
  - `test-not-ready-token` devuelve `status: "not_ready"`.
- El endpoint no ejecuta ETLs, scraping, conductor ni enriquecimientos en el request path; solo devuelve estado placeholder claim-safe.

## Nota

La migracion mantiene tipografias, paleta, iconografia SVG y narrativa del original. Si quieres cambiar enlaces (CTA, aviso legal, privacidad, email), edita los `href` en `src/App.jsx`.
