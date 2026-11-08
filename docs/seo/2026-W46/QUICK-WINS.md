# Quick wins de la auditoría W46

Ampliación autorizada de la PR #28, manteniendo `develop` como destino y sin merge ni promoción a producción.

## Cambios y propósito

| Área | Antes | Cambio |
|---|---|---|
| Sitemap | Dos tools CSR con metadatos iniciales de portada | Retiradas temporalmente; se mantienen guías y URLs existentes válidas |
| Tools públicas | Head de portada en HTML inicial; tras JS title era el slug y description una nota interna | Dos entradas HTML con title/description/canonical/OG/schema de su propia ruta, compartiendo la misma app React; noindex temporal también tras JS |
| Diagnósticos con token | Heredaban head y schema de portada antes de JS | Documento genérico privado sin canonical ni schema de portada; sigue sin indexación y no se genera ningún informe durante la petición |
| llms.txt | Servicios enlazados a anclas de landing CSR; cuatro nuevas guías en Optional | Guías estáticas prioritarias, oferta comercial diferenciada del contexto editorial y contacto por email |
| Schema de guías | Existía `Article` con autoría, publisher, fechas y entidades ya incluidas | Tipo más específico `BlogPosting` en las siete guías; pruebas de coherencia con contenido visible y entidades, preservando autores y fechas existentes |
| 404 general | HTTP 404 devolvía el shell de portada sin noindex inicial | Documento 404 real con navegación útil y noindex; guías conservan su 404 específica |
| Seguridad | Cabeceras básicas ausentes | nosniff, DENY, strict-origin-when-cross-origin y restricciones camera/microphone/geolocation; API emite noindex/nosniff directamente |

No se añade una CSP bloqueante sin un allowlist probado. No se cambia HSTS, DNS, infraestructura de pago, OAuth, DB, contenidos comerciales ni el diseño de portada.

## Límites deliberados

- Son metadatos iniciales correctos para las tools, **no prerender de su contenido ni garantía de indexación**. Su exclusión del sitemap y noindex se mantienen hasta trabajar la siguiente fase.
- No se crean páginas MMM/Momentum ni casos; los ejemplos editoriales siguen siendo sintéticos y no se transforman en casos de clientes.
- El informe original se conserva sin alteración: las correcciones actuales se explican aquí, no se reescribe retrospectivamente la auditoría.
- No se vuelve a ejecutar Claude Code.

## Resultado local

- Build de hosting correcto; suite **105/105** (baseline **37/37**).
- Navegador real a **390 y 1440 px**: tools, aliases `index.html`, 404, CTA entre páginas y formulario con éxito simulado. **Cero envíos reales**.
- Schema de las siete guías idéntico entre fuente y build; texto de portada y campos del formulario preservados.
- Comparación móvil con cinco pares alternados antes/después, Chrome 158, CPU ×4, 1,6 Mbps y latencia 150 ms; caché desactivada. Medianas:

| Métrica de laboratorio | Antes | Después |
|---|---:|---:|
| FCP | 3.072 ms | 3.048 ms |
| LCP | 3.160 ms | 3.144 ms |
| CLS observado | 0,00891 | 0,00891 |
| Transferencia de recursos | 504.192 bytes | 504.685 bytes |

La diferencia es pequeña y variable: **no se presenta como mejora de velocidad demostrada**, Lighthouse ni Core Web Vitals de campo. La portada sigue siendo CSR y su LCP de laboratorio supera 2,5 s bajo esta emulación; se reserva para la siguiente fase. No se mide INP aquí.

## Verificación

La evidencia local se incorpora a `quickwins-verification.json`; la comprobación del preview público y su SHA se anexan en un comentario de la PR después del push. Se distingue build de hosting (omite react-snap por configuración existente), prueba local con un identificador de formulario ficticio y envío simulado, preview real y métricas de laboratorio. No se envían formularios reales ni se atribuyen resultados de negocio a estos cambios.

El primer intento local sin `VITE_FORMSPREE_FORM_ID` no renderizó React: la dependencia Formspree exige esa configuración ya antes de este cambio. Se excluye de la comparación de rendimiento. Baseline y candidato se reconstruyen con el mismo identificador ficticio `local-smoke-only`; el despliegue usa la configuración existente de Netlify, sin cambiar secretos ni entorno remoto.
