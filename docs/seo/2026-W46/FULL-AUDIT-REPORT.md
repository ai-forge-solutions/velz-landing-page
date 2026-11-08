# Auditoría SEO completa — https://velz.io/ (2026-11-08)

Flujo: claude-seo:seo-audit (plugin 2.5.0), ejecución reanudada. Técnico y backlinks: ejecución anterior con scripts originales
(reutilizados). Contenido, schema, sitemap, performance, visual, GEO, agentic y SXO: agentes originales, uno a uno, 2026-11-08.

**Bloqueo transversal:** `claude-seo run render_page.py` → exit 3 "Claude SEO runtime is not ready. Run `/seo setup`". `doctor` denegado
por permisos; `setup` = instalación (no autorizada). Por ello no hubo render JS, capturas, Lighthouse ni scripts de parseo en esta
reanudación. Los especialistas trabajaron con `raw/evidence-webfetch-2026-11-08.md` (WebFetch público, sin `<head>` ni JS) y hallazgos previos.

## Resumen ejecutivo

- **SEO Health Score: 55/100 (provisional)** — media ponderada renormalizada de Técnico 72, Contenido 48, On-Page 50 (derivado), IA 47
  (75 % del peso). Schema, Performance e Imágenes sin puntuar (NO MEDIDO). SXO 39/100 informativo.
- **Tipo de negocio:** servicios profesionales B2B de medición de marketing y crecimiento (MMM para empresas ≥1 M€/año en medios;
  Momentum: incrementalidad y optimización diaria por medio/campaña/anuncio), guías editoriales y herramientas lead-magnet para Shopify.
  Español; España/LATAM. No es ecommerce (no se lanzó seo-ecommerce) ni negocio local (no seo-local/maps).

### Top 5 problemas
1. **Alta** — Portada y `/tools/*` renderizadas en cliente: HTML bruto = `<div id="root">` vacío. La oferta solo existe tras JS y en `/llms.txt`.
2. **Alta** — `/tools/*` en bruto llevan title/canonical/og:url de la portada y JSON-LD WebPage `url: "/"`.
3. **Alta** — No hay páginas de servicio MMM ni Momentum; llms.txt y guías enlazan a `/#servicios` en un shell vacío. Las SERP de servicio
   observadas premian páginas de servicio dedicadas (adsmurai, hispavista, cirentis, nielsen).
4. **Alta** — Sin prueba de confianza B2B: sin casos, about/autor, logos, precios ni metodología; ambigüedad de entidad (Wikidata "Velz" Q138566061, empresa italiana ajena).
5. **Media/Alta** — Herramientas finas (caja de búsqueda), slugs en inglés, title = slug, descripción = nota interna; desalineadas con el comprador de MMM.

### Top 5 quick wins
Sacar `/tools/*` del sitemap hasta prerender · Repuntar llms.txt a URLs estáticas · BlogPosting+Person en guías · 404 real con noindex · Cabeceras de seguridad.

## Técnico (72) — findings/technical.md
Pasa: sitemap válido, HTTPS+HSTS, guías estáticas correctas, lang=es, 404 de estado. Problemas: CSR, conflicto canonical en tools,
cuerpo soft-404, cabeceras de seguridad, 2 saltos de redirección http://www → apex, fuentes Google render-blocking.

## Contenido / E-E-A-T (48; E-E-A-T 42) — findings/content.md
Guía `interpretar-resultados-mmm` sólida (~1.900 palabras, autor, fecha, fuentes primarias). Faltan experiencia de primera mano,
páginas de servicio, autoridad externa; índice /guias fino; sin LATAM. NO MEDIDO: legibilidad, 2 guías (medidas después por GEO: ~1.700–2.400 palabras), páginas legales.

## On-Page (50, derivado)
Guías con titles/H1 únicos y enlazado entre sí. Portada titulada con término informativo de cabecera; tools rotas; enlaces internos a anclas.

## Schema (sin puntuar) — findings/schema.md
Tipos presentes (Organization/ProfessionalService, Person, WebSite, WebPage; CollectionPage, BreadcrumbList). Falta Article/BlogPosting y Service;
WebPage url "/" en tools. Plantillas propuestas con `{{TO_FILL}}`. Validación de propiedades NO MEDIDO.

## Sitemap — findings/sitemap.md
9 URLs válidas; tools en conflicto de canonical (retirar hasta corregir); faltan servicio/about/casos; lastmod parecen fechas de despliegue.

## Performance (NO MEDIDO) — findings/performance.md
Riesgo LCP medio-alto en páginas CSR, CLS medio (banner, fuentes), INP bajo-medio. Sin PSI/CrUX.

## Visual / Imágenes (NO MEDIDO) — findings/visual.md
Captura bloqueada; `screenshots/` vacío.

## IA: GEO (47) + Agentic — findings/geo.md, findings/agentic.md
Todos los bots permitidos; sin Content-Signal; llms.txt correcto pero enlaza a anclas. Guías citables; pocas H2 en forma de pregunta, sin
bloque resumen. Sin menciones de terceros encontradas (Reddit/LinkedIn/YouTube/Bing NO MEDIDO). Lighthouse agentic, árbol a11y, WebMCP, /.well-known NO MEDIDO.

## SXO (39) — findings/sxo.md
10 consultas en WebSearch (orientado a EE. UU.; sin posiciones/PAA/AIO/volúmenes). Incrementalidad: 9/9 guías, velz sin página. "Meridian vs Robyn" sin competencia en español.
Personas más débiles: ecommerce (29), RevOps B2B (31). Confianza es la dimensión más débil.

## Backlinks (sin datos suficientes) — findings/backlinks.md
No en Common Crawl; Moz/Bing/DataForSEO NO MEDIDO. No implica cero backlinks.

## Módulos condicionales
- seo-google: `google_auth.py --check` no ejecutado (runtime bloqueado; OAuth/credenciales fuera de alcance). Agregados autorizados en `approved-metrics.json` se interpretan en el paso seo-google del flujo.
- seo-drift: `drift_history.py` bloqueado; se trata en el paso drift del flujo.
- seo-cluster: señales de estrategia de contenido presentes; se ejecuta como paso dedicado.
- seo-local, seo-maps, seo-ecommerce, seo-matomo, seo-dataforseo: no aplican o sin credenciales/MCP.
- Google Update Correlation (`seo_updates.py`): no ejecutado (runtime bloqueado); no se atribuye ningún cambio a actualizaciones.
- PDF (`google_report.py`): no generado (runtime bloqueado).

Heurísticas del plugin; no son reglas de Google ni garantías.
