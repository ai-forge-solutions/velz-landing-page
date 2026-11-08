# HTML inicial de portada y documentos legales

## Contrato

`npm run build` ejecuta `scripts/postbuild.cjs`, que invoca `scripts/render-home.mjs` también en Netlify. No requiere Chromium ni crawling. El renderer utiliza Vite y `renderToString` sobre el mismo árbol React que el cliente, sin instalar globals DOM ni ejecutar efectos o peticiones externas.

Se generan exclusivamente `/`, `/privacidad.html` y `/aviso-legal.html`. La allowlist no admite tools, tokens ni rutas desconocidas. Netlify y preview sirven los documentos legales desde sus rutas canónicas sin extensión. El cliente normaliza también los accesos directos `.html` para hidratar el árbol correcto, manteniendo título y canonical legales.

El renderer conserva los assets compilados del shell. Los documentos legales reciben sus propios metadatos y no heredan el JSON-LD comercial de portada. Los delimitadores de SSR permiten repetir la generación sin duplicar contenido. El bundle servidor se crea en un temporal privado de `node_modules/.cache` y se elimina al finalizar, incluso si falla; no se publica en `dist`.

## Visibilidad y contacto

La raíz está marcada con `data-prerendered`. En estos documentos se omiten las animaciones de entrada de hero, Reveal y tarjetas tanto en servidor como al hidratar, para que el contenido inicial sea visible sin JavaScript. No se reescriben el copy, el diseño ni la sección sobre Miguel. Las interacciones hover/tap conservan su política de reduced motion.

El formulario incluye `method="POST"` y su action Formspree, manteniendo el handler React existente. `VITE_FORMSPREE_FORM_ID` es obligatorio y debe coincidir con la configuración real del build cliente. Su ausencia hace fallar explícitamente SSR: no se incorpora ningún ID ficticio por defecto. Las pruebas utilizan un fixture solo en su proceso y los smoke tests interceptan los envíos; no generan leads reales.

## Verificación

```sh
node --test tests/*.test.mjs
npm run build
```

Las suites cubren el renderer real, allowlist, metadatos, assets, repetición, limpieza de temporales, ausencia de globals browser, errores de configuración, visibilidad inicial, contacto nativo y aliases legales. Las pruebas aisladas que compilan usan temporales propios.

Comprobación adicional en navegador: portada, servicios y documentos legales a 390 y 1440 px sin JavaScript; hidratación de rutas legales canónicas y `.html`; recorrido consentido guía → servicio → contacto con POST simulado y retirada de consentimiento. Esto no demuestra entrega real a GA4 o Formspree ni mejora de Core Web Vitals en producción.

El hosting debe aportar las variables reales. Miguel confirma que Formspree está configurado en producción; el build local se ha verificado con variables de prueba, no con credenciales de producción. La configuración/dependencia histórica de react-snap permanece, pero el lifecycle ya no la ejecuta.
