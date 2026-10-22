# Velz Design Kit — instalación

## Qué contiene
- `styles.css` — punto de entrada único. Importa las fuentes (Google Fonts) y los 4 archivos de tokens.
- `tokens/` — variables CSS: `colors.css`, `typography.css`, `spacing.css`, `elevation.css`. Autocontenidas, sin dependencias externas.
- `assets/` — símbolo/logo de marca en SVG (negro, blanco, a color) y PNG/WebP.
- `readme.md` — guía de marca completa: voz, paleta, tipografía, uso del logo, principios de layout.
- `SKILL.md` — manifiesto original del skill (contexto de por qué existe el sistema; útil como referencia, no se instala como código).

## Qué NO incluye
- Componentes React (`components/*.jsx`) — dependen del bundle compilado de este proyecto y no son portables tal cual. Si el repo destino usa React y quieres los componentes reales, pide un export aparte (paquete npm o copia manual adaptando los imports).
- Slides, lead magnets, UI kits — son entregables de este proyecto, no parte del sistema de diseño.

## Cómo instalarlo en otro repo
1. Copia toda la carpeta `velz-design-kit/` a algún lugar del repo destino, p. ej. `src/design-system/velz/` o `public/velz/`.
2. Enlaza `styles.css` en el `<head>` de tu HTML/app:
   ```html
   <link rel="stylesheet" href="/design-system/velz/styles.css">
   ```
   (ajusta la ruta a donde lo copiaste)
3. Usa las variables CSS directamente en tu código, p. ej.:
   ```css
   color: var(--velz-color-ink);
   font-family: var(--velz-font-display);
   ```
   Abre cada archivo en `tokens/` para ver los nombres exactos de variables disponibles.
4. Usa `assets/velz-symbol*.svg` para el logo — elige la variante (negro/blanco/color) según el fondo.
5. Lee `readme.md` para reglas de uso: qué combinaciones de color están permitidas, jerarquía tipográfica, tono de voz, espaciado.

## Si el repo destino no es HTML/CSS plano
- **React/Vue/etc con CSS-in-JS o Tailwind:** igual puedes importar `styles.css` una vez al bootstrap de la app; las variables CSS funcionan igual. Para Tailwind, puedes mapear los tokens a `theme.extend` en `tailwind.config` manualmente.
- **Design tokens en JSON (Style Dictionary, Figma Tokens, etc):** este kit es CSS puro, no JSON. Si necesitas ese formato, hay que generarlo aparte a partir de estos archivos.
