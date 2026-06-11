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

## Nota

La migracion mantiene tipografias, paleta, iconografia SVG y narrativa del original. Si quieres cambiar enlaces (CTA, aviso legal, privacidad, email), edita los `href` en `src/App.jsx`.
