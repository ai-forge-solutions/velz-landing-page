# Medición consentida: guía → servicio → contacto

## Alcance e integración

Implementación en `src/analytics.js`, compartida por los documentos estáticos y la SPA. Las páginas deben cargar **una sola vez** ese módulo (el padre verifica la integración HTML/Vite y el artefacto desplegado). Requiere `VITE_GA_MEASUREMENT_ID`; no se activa durante ReactSnap.

Contrato de navegación, sin alterar destinos:

| Servicio | Página | CTA a contacto |
|---|---|---|
| `mmm` | `/servicios/marketing-mix-modeling` | `/?servicio=mmm#cta` |
| `momentum` | `/servicios/momentum` | `/?servicio=momentum#cta` |

Se admite barra final en páginas de servicio. Solo enlaces del mismo origen participan. Un parámetro `servicio` duplicado o no permitido no identifica un servicio. Nunca se guardan URLs completas ni querystrings para asociar páginas.

## Eventos y objetivos GA4 propuestos

| Evento | Disparo | Lectura / objetivo recomendado |
|---|---|---|
| `service_view` | Página de servicio con consentimiento, una vez por documento | Interés: visita, **no lead** |
| `service_click` | Clic delegado en enlace a servicio o CTA de servicio a contacto | Interés: avance, **no lead** |
| `contact_form_start` | Primer `focusin` o `input` en INPUT/TEXTAREA/SELECT de `form#lead-form`, una vez por documento / ciclo de consentimiento | Interés: inicio, **no lead** |
| `generate_lead` | Llamada existente desde `App` cuando `formState.succeeded` de `useForm` es verdadero | Objetivo principal propuesto: contacto confirmado por el flujo existente |

**No hay listener de `submit` ni emisión DOM de `generate_lead`.** Un envío fallido o pulsar Enviar no se convierte en lead por esta instrumentación. No se modifica App ni se añade otra llamada de éxito. Tampoco se añade deduplicación global que altere la semántica existente de éxito de App.

`cta_click` sigue midiendo `#cta` y `/#cta`; también reconoce los dos CTAs con servicio. `contact_email_click` conserva `mailto:` sin recoger su dirección. Se conservan `ai_referral`, profundidad de lectura y Web Vitals. Las páginas nuevas tienen `content_group=service`; landing y guías conservan sus grupos.

### Dimensiones de atribución

- `service`: únicamente `mmm` o `momentum`.
- `source_type`: únicamente `guide`, `service` o `landing`.
- La asociación se guarda tras aceptar en `sessionStorage.velz_service_funnel_v1` como `{service, source_type}`; se reconstruye el objeto validando ambos valores, sin propagar claves adicionales.
- Se conserva el origen del recorrido para el mismo servicio: guía → servicio → landing → éxito mantiene `source_type=guide`. No es una dimensión de la página actual ni una atribución multitoque de GA4.
- Un clic a otro servicio cambia la asociación al nuevo servicio y al tipo de página del clic. La visita directa usa el tipo del referrer interno reconocido; sin él, el tipo de página actual. Una visita directa a servicio cae en `service`; entrada directa a la landing con `servicio` válido cae en `landing`.
- La última asociación válida de la pestaña se mantiene hasta sustituirla, cerrar sesión de pestaña o revocar. No prueba causalidad, identidad ni relación comercial. Sin contexto válido se omiten las dimensiones; no se inventa un servicio.
- Si sessionStorage está bloqueado, el documento funciona con estado en memoria; la continuidad entre documentos puede perderse. El referrer interno o el bucket permitido de la CTA ofrecen recuperación limitada, nunca identidad persistente.

## Consentimiento, privacidad y revocación

Consent Mode v2 básico: se encola localmente el estado inicial `denied` (analytics y publicidad). No se carga gtag.js, no se leen/escriben sesiones analíticas ni cookies y no se emiten eventos antes de aceptar. La preferencia de consentimiento sigue en la clave localStorage existente; no es almacenamiento de atribución.

Los listeners se delegan al documento para soportar elementos anidados, formularios montados después por React y documentos estáticos. No interceptan navegación ni leen valores, nombres, mensajes o direcciones del formulario. Las interacciones rechazadas no se almacenan ni se reproducen al aceptar; la visita de servicio se registra al aceptar en esa página.

Al revocar se bloquea inmediatamente `track()` (incluidos callbacks tardíos), se envía la actualización de consentimiento `denied`, se activa `ga-disable-*`, se eliminan las claves de sesión analítica y se conserva la limpieza previa de cookies `_ga*` sin borrar cookies ajenas. La retirada por evento `storage` desde otra pestaña también detiene el documento. Aceptar de nuevo no duplica el script ni la vista del documento. No se pueden retirar eventos ya enviados; la limpieza de almacenamiento es best effort si el navegador la bloquea.

Los metadatos `page_location` y `page_referrer` eliminan **toda query y fragmento**, incluidos referrers externos. Se mantiene la redacción de `/tools/:slug/:token` a `/tools/:slug/[token]`. `servicio` solo se convierte a los dos buckets permitidos; no se envía la URL original. La detección AI existente sigue comprobando su allowlist de origen, sin conservar UTM arbitraria. Los dos parámetros de atribución no pueden inyectarse a través de `track()`.

Este módulo no añade recogida de PII ni campos. Los parámetros existentes de eventos ajenos al funnel y texto/ubicación de CTAs públicos conservan su contrato: no deben interpolarse datos personales en ellos.

## Verificación local y comprobaciones pendientes del padre

Pruebas sin red, build ni credenciales:

```sh
node --test tests/funnel-analytics.test.mjs
node --test tests/funnel-analytics.test.mjs tests/contact-fragment.test.mjs tests/tool-document-alias.test.mjs
```

La suite ejecuta **el módulo real** transformado con esbuild en VM y DOM mínimo; no copia helpers. Cubre recorrido entre documentos, consentimiento inicial/revocación/reaceptación, retirada entre pestañas, campos con lectura prohibida, ausencia de lead en submit, origen externo, buckets inválidos/duplicados, sesión malformada/bloqueada, consentimiento v2, AI y URLs privadas. No carga gtag real ni prueba entrega a servidores GA4/Formspree.

Antes de producción, el padre/operador debe verificar:

1. Las páginas, las guías y la landing cargan el módulo una sola vez, con el ID correcto, y los enlaces cumplen el contrato. Verificar SSR/prerender y build en su integración, fuera del alcance de este cambio.
2. En navegador real: sin aceptar no hay solicitudes de GA; aceptar permite el recorrido; retirar impide nuevas emisiones; el payload no contiene campos, queries o tokens. No se ha realizado aquí esta inspección de red.
3. En GA4, comprobar recepción y definir `service` y `source_type` como dimensiones de evento si se necesitan en informes. Proponer `generate_lead` como evento clave principal; mantener las tres etapas de interés como eventos de diagnóstico, no leads equivalentes.
4. Revisar medición mejorada de GA4 (especialmente formularios, clics, búsqueda e historial): no debe recoger automáticamente datos que el módulo excluye ni duplicar la conversión. Su configuración remota no se puede garantizar desde esta prueba local.
5. Crear una exploración propuesta `service_click` (origen guía) → `service_view` → `contact_form_start` → `generate_lead`, segmentada por servicio, contemplando entradas directas y pérdida de atribución sin consentimiento. No interpretar sesiones no consentidas como abandonos medidos.

**Estado:** instrumentación local verificada; ningún dashboard, dimensión personalizada, evento clave, propiedad ni configuración administrativa GA4 se ha activado o verificado en esta tarea. No hay pruebas de resultados comerciales ni casos reales asociados a estos eventos.
