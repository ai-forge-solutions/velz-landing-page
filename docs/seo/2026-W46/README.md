# Velz · W46: cuatro guías y auditoría original

## Alcance de la PR

Cuatro artículos completos integrados como documentos HTML estáticos de `/guias`, con el diseño existente, metadatos, datos estructurados, índice, sitemap, llms.txt y rutas explícitas. La quinta pieza no se ha generado. No modifica la portada, servicios, infraestructura ni producción. La autoría pública figura como organización **velz**, no atribuye una revisión experta a Miguel.

## Informe original del plugin

`FULL-AUDIT-REPORT.md` es una copia literal del artefacto generado por `claude-seo:seo-audit` (plugin 2.5.0), no un informe reconstruido por Hermes. El PDF no se generó.

- Auditoría: score **55/100 provisional**, calculado por el plugin con dimensiones no medidas excluidas; no es una puntuación de Google.
- Prioridades sugeridas: renderizado/HTML de portada y tools, canonicals de tools, páginas de servicio MMM/Momentum, pruebas de confianza y alineación de las herramientas con el comprador.
- Estas observaciones describen el snapshot auditado, no una verificación de la versión actual de develop. Algunas pueden estar desactualizadas o ser hipótesis; no se han aplicado automáticamente.
- No se midieron en esta reanudación render JS, capturas, Lighthouse/CrUX ni validación completa de schema. Se preservan explícitamente las limitaciones.
- Que exista este informe **no implica éxito del flujo entero**: Claude terminó con SIGABRT (`-6`) durante el quinto brief; no completó los módulos dedicados seo-geo y seo-drift. Hallazgos GEO dentro de la auditoría y módulo dedicado GEO son etapas distintas.

## Procedencia de los artículos

Claude generó cuatro briefs, auditoría, estrategia y clustering. El coordinador Hermes redactó las cuatro piezas desde esos briefs y fuentes guardadas después del fallo. No se presenta la redacción como salida directa final del plugin. Los mapas `01-sources.json` a `04-sources.json` conservan la evidencia documental asociada.

Los ejemplos son sintéticos, no resultados de clientes. La comparación de librerías es documental, no un benchmark ejecutado. La estimación de costes propone un marco de evaluación, no tarifas comerciales de velz. Las hipótesis, cálculos y enlaces requieren revisión editorial/experta antes del merge; abrir esta PR no constituye aprobación ni publicación.

## Validación técnica

- Build de producción con el camino usado en Netlify (`NETLIFY=true npm run build`); react-snap se omite deliberadamente igual que en Netlify.
- Suite Node de regresión y guías: se ejecuta después del build; cubre documentos emitidos, rutas preview 200, rutas desconocidas 404, metadatos, sitemap, llms y aislamiento del CSS.
- No se ha relanzado Claude ni consumido su suscripción para preparar esta PR.

## Pendientes fuera de esta PR

- Revisión comercial y experta; decisión de merge y publicación por Miguel.
- Reparar OAuth Drive (`invalid_grant`) si se requiere entrega allí. No se han modificado credenciales.
- Conciliar el ciclo semanal, que conserva un manifiesto obsoleto `running`, para que el avance parcial no se confunda con éxito completo.
- Diagnóstico del SIGABRT y del runtime de scripts, sin reintentos caros automáticos. El registro también contiene eventos de límite de tareas (pids), que son una pista y no prueba de causa exacta.
