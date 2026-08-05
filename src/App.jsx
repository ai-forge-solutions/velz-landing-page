import * as ReactRuntime from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import velzSymbolSvg from "../assets/velz-symbol.svg?raw";
import miguelHeadshot from "../assets/miguel-headshot.webp";

const cardsProblema = [
  {
    title: '"Mis ads no escalan"',
    body: "Tu herramienta de atribución no sabe si hay stock para vender lo que generan.",
  },
  {
    title: '"Me quedo sin stock"',
    body: "Tu forecast de inventario no sabe que vas a escalar Meta un 40% la semana que viene.",
  },
  {
    title: '"No sé si tengo caja"',
    body: "Tu contabilidad llega tarde para decidir el pedido de hoy.",
  },
];

const cardsVs = [
  {
    title: "Vs. tus herramientas",
    body: "Triple Whale, Prediko y tu contable resuelven su silo. Ninguno habla con los otros dos.",
  },
  {
    title: "Vs. fractional CFO",
    body: "Empiezan en 4.000 €/mes y no tocan atribución de marketing.",
  },
  {
    title: "Vs. tu agencia",
    body: "Optimiza ROAS sin saber si hay stock ni caja. Yo no vendo ads: soy independiente.",
  },
];

const mechanismSteps = [
  {
    key: "ventas",
    number: "01",
    eyebrow: "Ventas históricas",
    title: "Primero miro la línea real, no el dashboard aislado.",
    body: "Parto de las ventas históricas por producto para ver qué demanda ya existe antes de tocar presupuesto, stock o caja.",
  },
  {
    key: "prediccion",
    number: "02",
    eyebrow: "Predicción",
    title: "Después proyecto qué pasaría si empujas Meta.",
    body: "La predicción marca el rango de demanda futura y señala qué producto puede quedarse corto si el impulso funciona.",
  },
  {
    key: "palancas",
    number: "03",
    eyebrow: "Palancas",
    title: "Luego convierto esa demanda en rango correcto de stock.",
    body: "No es “pide más”. Es cuánto pedir, qué SKU priorizar y dónde está el margen de seguridad antes de inmovilizar dinero.",
  },
  {
    key: "datos",
    number: "04",
    eyebrow: "Origen de dato",
    title: "Cada recomendación queda conectada a su fuente.",
    body: "Ads, inventario y ventas no se sustituyen entre sí: se conectan para que veas de dónde sale cada hipótesis.",
  },
  {
    key: "caja",
    number: "05",
    eyebrow: "Caja",
    title: "Y solo entonces cierro el loop con caja.",
    body: "Escalar y pedir stock solo tiene sentido si hay caja para ejecutarlo sin asfixiar el mes siguiente.",
  },
];

const paraTi = ["Marca de 500K–5M €", "Shopify", "12+ meses de historial de ads", "Sin equipo de datos"];
const noParaTi = ["Buscas otro dashboard", "Acabas de lanzar", "Quieres delegar la ejecución de ads"];

const DS_NAMESPACE = "VeldDesignSystem_c12abb";
const CONTACT_EMAIL = "miguel@velz.io";
const EMAIL_LINK = `mailto:${CONTACT_EMAIL}`;
const CAL_BOOKING_LINK = import.meta.env.VITE_CAL_BOOKING_URL || "https://cal.com/velz/15min";
const DIAGNOSTIC_FALLBACK_LINK = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Diagnóstico externo Velz")}`;
const LEGAL_LINK = "/aviso-legal";
const PRIVACY_LINK = "/privacidad";
const revealViewport = { once: true, amount: 0.2 };
const HOME_LINK = "/";

const DEFAULT_META_DESCRIPTION =
  "Conecto tus ads, tu inventario y tu caja en una decisión operativa quincenal. Para ecommerce de 500K–5M €.";

const legalSections = [
  {
    title: "Titular del sitio",
    paragraphs: [
      "Titular: Miguel Carmona Rodríguez, responsable de la marca Velz.",
      "NIF: 48118500Q.",
      "Domicilio: A Coruña, España.",
      "Email de contacto: miguel@velz.io.",
    ],
  },
  {
    title: "Objeto",
    paragraphs: [
      "La finalidad de este sitio es informar sobre los servicios de análisis y diagnóstico operativo ofrecidos por Velz para marcas ecommerce.",
      "El acceso al sitio atribuye la condición de usuario e implica la aceptación de este aviso legal y del resto de textos legales publicados aquí.",
    ],
  },
  {
    title: "Propiedad intelectual",
    paragraphs: [
      "Los contenidos de este sitio, incluyendo textos, diseño, símbolo de marca, estructura visual y materiales gráficos, están protegidos por la normativa de propiedad intelectual e industrial.",
      "No se permite su reproducción, distribución, transformación o comunicación pública sin autorización previa y por escrito del titular, salvo los usos permitidos por ley.",
    ],
  },
  {
    title: "Uso del sitio",
    paragraphs: [
      "El usuario se compromete a utilizar este sitio de forma lícita y a no realizar actuaciones que puedan dañar, sobrecargar o inutilizar la web o interferir con su funcionamiento normal.",
      "Velz podrá modificar, suspender o actualizar los contenidos del sitio en cualquier momento y sin previo aviso.",
    ],
  },
  {
    title: "Responsabilidad",
    paragraphs: [
      "Velz no garantiza la disponibilidad permanente del sitio ni la ausencia absoluta de errores, aunque aplicará medidas razonables para mantenerlo actualizado y operativo.",
      "La información publicada tiene carácter informativo y no constituye por sí sola asesoramiento jurídico, fiscal o financiero individualizado.",
    ],
  },
  {
    title: "Enlaces externos",
    paragraphs: [
      "Este sitio puede incluir enlaces a páginas de terceros. Velz no se responsabiliza de sus contenidos, políticas o prácticas una vez el usuario abandona esta web.",
    ],
  },
  {
    title: "Ley aplicable",
    paragraphs: [
      "Este aviso legal se interpreta conforme a la legislación española. Para cualquier controversia, las partes se someterán a los juzgados y tribunales que resulten competentes conforme a la normativa aplicable.",
    ],
  },
];

const privacySections = [
  {
    title: "Responsable del tratamiento",
    paragraphs: [
      "Responsable: Miguel Carmona, como titular de Velz.",
      "Contacto: miguel@velz.io.",
    ],
  },
  {
    title: "Qué datos se recogen",
    paragraphs: [
      "A través del formulario de esta web se recogen únicamente los datos que el usuario facilita de forma directa: nombre, email y URL de la tienda.",
      "No se solicitan categorías especiales de datos personales.",
    ],
  },
  {
    title: "Finalidad",
    paragraphs: [
      "Los datos se utilizan exclusivamente para revisar la solicitud, preparar el diagnóstico externo de 24 horas y responder por email al usuario interesado.",
      "No se usarán para listas de difusión, newsletters ni comunicaciones comerciales no solicitadas.",
    ],
  },
  {
    title: "Base jurídica",
    paragraphs: [
      "La base jurídica del tratamiento es la aplicación de medidas precontractuales a petición del interesado y, en su caso, el consentimiento implícito al enviar voluntariamente el formulario de contacto.",
    ],
  },
  {
    title: "Conservación",
    paragraphs: [
      "Los datos se conservarán durante el tiempo necesario para atender la solicitud y hacer seguimiento de la conversación iniciada por el usuario.",
      "Si no existe relación posterior, se eliminarán o anonimizarán en un plazo razonable de gestión interna.",
    ],
  },
  {
    title: "Encargados y terceros",
    paragraphs: [
      "El formulario puede apoyarse en proveedores técnicos necesarios para su funcionamiento, como servicios de hosting o procesamiento del formulario.",
      "No se cederán datos a terceros para finalidades comerciales propias, salvo obligación legal.",
    ],
  },
  {
    title: "Derechos del usuario",
    paragraphs: [
      "El usuario puede solicitar el acceso, rectificación, supresión, oposición, limitación del tratamiento o portabilidad de sus datos escribiendo a miguel@velz.io.",
      "Si considera que el tratamiento no es correcto, también puede presentar una reclamación ante la Agencia Española de Protección de Datos.",
    ],
  },
  {
    title: "Cookies y analítica",
    paragraphs: [
      "Esta página no publica aquí una política de cookies independiente. Si se incorporan herramientas de analítica, medición o cookies no técnicas, deberá añadirse el correspondiente aviso y gestión de consentimiento antes de publicarlo.",
    ],
  },
];

const LEAD_MAGNET_STATUSES = {
  loading: "loading",
  ready: "ready",
  degraded: "degraded",
  notReady: "not_ready",
  manualReviewRequired: "manual_review_required",
  invalid: "invalid_token",
  expired: "expired_token",
  error: "error",
};

const INVENTORY_TOOL_COPY = {
  stockout_leak_score: {
    slug: "stockout-leak-score",
    title: "Dónde tu catálogo visible está filtrando demanda por falta de disponibilidad.",
    intro:
      "Miramos disponibilidad pública, variantes y patrones de stockout ya persistidos. No estimamos unidades internas ni ventas perdidas.",
    chartTitle: "Stockouts por producto observado",
    productTitle: "Productos con señal de stockout",
    metricLabels: {
      product_count: "Productos",
      variant_count: "Variantes",
      fully_out_of_stock_count: "Productos 100% agotados",
      partial_stockout_count: "Stockouts parciales",
      functional_stockout_count: "Stockouts funcionales",
      variant_stockout_pct: "% variantes agotadas",
      sample_size: "Muestra",
    },
  },
  discount_depth_analyzer: {
    slug: "discount-depth-analyzer",
    title: "Cuánto stock rebajado sigue visible en tu catálogo.",
    intro:
      "Separamos descuentos superficiales, medios y profundos usando precios públicos ya persistidos. No inferimos margen, cashflow ni velocidad real de venta.",
    chartTitle: "Profundidad de descuento",
    productTitle: "Productos rebajados que siguen disponibles",
    metricLabels: {
      catalog_product_count: "Productos",
      discounted_product_count: "Productos rebajados",
      discounted_products_pct: "% catálogo rebajado",
      average_discount_pct: "Descuento medio",
      min_discount_pct: "Descuento mínimo",
      max_discount_pct: "Descuento máximo",
      deep_discount_product_count: "Descuento profundo",
      discounted_and_available_count: "Rebajados disponibles",
    },
  },
};

function parseLeadMagnetPath(pathname) {
  const match = pathname.match(/^\/tools\/([^/]+)\/([^/]+)\/?$/);

  if (!match) {
    return null;
  }

  return {
    toolSlug: decodeURIComponent(match[1]),
    token: decodeURIComponent(match[2]),
  };
}

function parseToolHomePath(pathname) {
  const match = pathname.match(/^\/tools\/([^/]+)\/?$/);

  if (!match) {
    return null;
  }

  const toolSlug = decodeURIComponent(match[1]);
  const knownTool = Object.values(INVENTORY_TOOL_COPY).some((tool) => tool.slug === toolSlug);

  return knownTool ? { toolSlug } : null;
}

const symbolMarkup = velzSymbolSvg
  .replace('role="img"', "")
  .replace('aria-label="velz symbol"', 'aria-hidden="true" focusable="false"');

function BrandSymbol({ className, width = 72 }) {
  return (
    <span
      className={className}
      style={{ width }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: symbolMarkup }}
    />
  );
}

function Reveal({ children, className }) {
  const reduceMotion = useReducedMotion();
  const disableMotion =
    reduceMotion || (typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap");

  if (disableMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.56, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function getPageConfig(pathname) {
  const leadMagnetRoute = parseLeadMagnetPath(pathname);
  const toolHomeRoute = parseToolHomePath(pathname);

  if (leadMagnetRoute) {
    return {
      key: "lead-magnet",
      title: "velz — Diagnóstico operativo",
      description: "Diagnóstico operativo privado de Velz para ecommerce.",
      canonical: `https://velz.io/tools/${encodeURIComponent(leadMagnetRoute.toolSlug)}/${encodeURIComponent(
        leadMagnetRoute.token,
      )}`,
      leadMagnetRoute,
    };
  }

  if (toolHomeRoute) {
    const tool = Object.values(INVENTORY_TOOL_COPY).find((item) => item.slug === toolHomeRoute.toolSlug);
    return {
      key: "tool-home",
      title: `velz — ${tool?.slug || "tool"}`,
      description: "Busca una URL con Shopify Signals para abrir su lead magnet público.",
      canonical: `https://velz.io/tools/${encodeURIComponent(toolHomeRoute.toolSlug)}`,
      toolHomeRoute,
    };
  }

  if (pathname === LEGAL_LINK) {
    return {
      key: "legal",
      title: "velz — Aviso legal",
      description: "Aviso legal de Velz y condiciones de uso del sitio web.",
      canonical: `https://velz.io${LEGAL_LINK}`,
    };
  }

  if (pathname === PRIVACY_LINK) {
    return {
      key: "privacy",
      title: "velz — Privacidad",
      description: "Política de privacidad de Velz para solicitudes enviadas desde la web.",
      canonical: `https://velz.io${PRIVACY_LINK}`,
    };
  }

  return {
    key: "landing",
    title: "velz — Decisión operativa para ads, stock y caja",
    description: DEFAULT_META_DESCRIPTION,
    canonical: "https://velz.io/",
  };
}

function LegalLayout({ eyebrow, title, intro, sections }) {
  return (
    <>
      <nav>
        <a href={HOME_LINK} className="wm nav-home">
          velz
        </a>
        <a href={HOME_LINK} className="nav-a">
          Volver al inicio →
        </a>
      </nav>

      <main className="legal-page">
        <section className="legal-hero">
          <div className="wrap legal-wrap">
            <span className="ey">{eyebrow}</span>
            <h1 className="legal-title">{title}</h1>
            <p className="legal-intro">{intro}</p>
          </div>
        </section>

        <section className="legal-body">
          <div className="wrap legal-wrap legal-stack">
            {sections.map((section) => (
              <article className="legal-section" key={section.title}>
                <h2 className="legal-section-title">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p className="legal-copy" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <a href={HOME_LINK} className="wm footer-wm">
          velz
        </a>
        <div className="fr">
          <a href={EMAIL_LINK} className="fe">
            {CONTACT_EMAIL}
          </a>
          <a href={LEGAL_LINK} className="fl">
            Aviso legal
          </a>
          <a href={PRIVACY_LINK} className="fl">
            Privacidad
          </a>
        </div>
      </footer>
    </>
  );
}

function getStatusCopy(status) {
  if (status === LEAD_MAGNET_STATUSES.ready) {
    return {
      label: "Ready",
      title: "Tu diagnóstico está listo.",
      body: "Estos bloques están respaldados por fuentes disponibles y limitaciones explícitas.",
    };
  }

  if (status === LEAD_MAGNET_STATUSES.degraded) {
    return {
      label: "Degraded",
      title: "Tu diagnóstico está parcialmente listo.",
      body: "Mostramos solo las señales soportadas y ocultamos cualquier claim que necesite una fuente pendiente.",
    };
  }

  if (status === LEAD_MAGNET_STATUSES.manualReviewRequired) {
    return {
      label: "Manual review",
      title: "Este diagnóstico necesita revisión antes de publicarse.",
      body: "Hay ambigüedades que no deben convertirse en claims automáticos sin revisión humana.",
    };
  }

  if (status === LEAD_MAGNET_STATUSES.invalid) {
    return {
      label: "Token inválido",
      title: "Este enlace no es válido.",
      body: "Comprueba que has abierto el enlace completo o responde al email desde el que recibiste el diagnóstico.",
    };
  }

  if (status === LEAD_MAGNET_STATUSES.expired) {
    return {
      label: "Token expirado",
      title: "Este diagnóstico ha caducado.",
      body: "El snapshot público ya no debería enseñarse sin refrescar datos y contexto.",
    };
  }

  if (status === LEAD_MAGNET_STATUSES.error) {
    return {
      label: "Error",
      title: "No he podido cargar este diagnóstico.",
      body: "Prueba de nuevo en unos minutos o responde al email desde el que recibiste el enlace.",
    };
  }

  return {
    label: "Not ready",
    title: "Tu diagnóstico aún se está preparando.",
    body: "El enlace es válido, pero todavía no hay un payload público seguro para enseñar.",
  };
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function toPercent(value) {
  return typeof value === "number" ? `${value.toFixed(value % 1 === 0 ? 0 : 1)}%` : value;
}

function formatLeadMetric(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? value.toLocaleString("es-ES") : value.toLocaleString("es-ES", { maximumFractionDigits: 1 });
  }

  return String(value).replaceAll("_", " ");
}

function claimLevel(claimSafety) {
  return claimSafety?.level || claimSafety || "hard_fact";
}

function normalizeInventoryPayload(payload) {
  if (payload?.version !== "inventory_lead_magnet_payload_v1") {
    return payload;
  }

  const toolCopy = INVENTORY_TOOL_COPY[payload.tool_key] || INVENTORY_TOOL_COPY.stockout_leak_score;
  const summaryMetrics = payload.summary_metrics || {};
  const metricBlocks = Object.entries(summaryMetrics)
    .filter(([, value]) => !Array.isArray(value) && value !== null && value !== undefined)
    .slice(0, 4)
    .map(([key, value]) => ({
      title: toolCopy.metricLabels?.[key] || key.replaceAll("_", " "),
      body: key.endsWith("_pct") ? toPercent(value) : formatLeadMetric(value),
      claim_safety: "hard_fact",
    }));
  const sectionBlocks = asArray(payload.sections).flatMap((section) =>
    asArray(section.cards)
      .filter((card) => card.public !== false)
      .map((card) => ({
        title: card.title,
        body: card.body,
        claim_safety: claimLevel(card.claim_safety),
      })),
  );
  const discountBuckets = asArray(payload.discount_depth?.buckets).map((bucket) => ({
    label: bucket.label,
    value: bucket.product_count,
    subvalue: `${bucket.available_product_count || 0} disponibles`,
  }));
  const stockoutRows = asArray(payload.stockout?.product_cards).map((product) => ({
    label: product.title,
    value:
      asArray(product.variant_availability).filter((variant) => variant.available === false).length ||
      (product.partial_stockout ? 1 : 0),
    subvalue: product.availability_status?.replaceAll("_", " "),
  }));
  const productRows =
    payload.tool_key === "discount_depth_analyzer"
      ? asArray(payload.discount_depth?.deep_discount_products).map((product) => ({
          title: product.title,
          meta: `${toPercent(product.discount_pct)} descuento · ${product.available ? "disponible" : "sin disponibilidad pública"}`,
          href: product.url,
          claim_safety: claimLevel(product.claim_safety),
        }))
      : asArray(payload.stockout?.product_cards).map((product) => ({
          title: product.title,
          meta: `${product.availability_status?.replaceAll("_", " ")} · patrón ${product.pattern_scope?.replaceAll("_", " ")}`,
          href: product.url,
          claim_safety: claimLevel(product.claim_safety),
        }));

  return {
    ...payload,
    tool_slug: toolCopy.slug,
    headline: toolCopy.title,
    intro: toolCopy.intro,
    summary_blocks: [...metricBlocks, ...sectionBlocks].slice(0, 6),
    evidence: asArray(payload.evidence_items).map((item) => ({
      label: item.title,
      value: item.body,
      claim_safety: claimLevel(item.claim_safety),
    })),
    limitations: asArray(payload.public_limitations).map((limitation) => limitation.message || limitation),
    render_chart: {
      title: toolCopy.chartTitle,
      rows: payload.tool_key === "discount_depth_analyzer" ? discountBuckets : stockoutRows,
    },
    render_products: {
      title: toolCopy.productTitle,
      rows: productRows,
    },
    cta: {
      label: "Responder a Velz →",
      href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Diagnóstico Velz ${payload.brand?.domain || ""}`)}`,
    },
  };
}

function getLeadMagnetStatus(payload, fallbackStatus) {
  if (payload?.status && Object.values(LEAD_MAGNET_STATUSES).includes(payload.status)) {
    return payload.status;
  }

  return fallbackStatus;
}

function getLandingCtaHook(search = "") {
  const params = new URLSearchParams(search);
  const source = `${params.get("tool") || ""} ${params.get("utm_content") || ""} ${params.get("utm_campaign") || ""}`.toLowerCase();

  if (source.includes("atrib") || source.includes("roas") || source.includes("meta")) {
    return "¿Sabes si el ROAS que ves es el que de verdad te vendió, o el que Meta se atribuye a sí misma?";
  }

  if (source.includes("invent") || source.includes("sku") || source.includes("stock")) {
    return "¿Pedirías 500 unidades del SKU-3 a ojo, o con dato real?";
  }

  return "¿Escalaste Meta este mes sin saber si había stock detrás?";
}

function ProductPhoto({ product, className = "report-product-photo" }) {
  const src = product?.image_url || product?.image || product?.featured_image || product?.featured_image_url;

  if (src) {
    return <img className={className} src={src} alt={product?.title || "Foto del producto"} loading="lazy" />;
  }

  return (
    <div className={`${className} report-product-photo-placeholder`} aria-label="Foto del producto no disponible">
      <span>foto del<br />producto</span>
    </div>
  );
}

function ReportShell({ children, toolLabel = "Nuevo análisis" }) {
  return (
    <main className="report-page">
      <button className="report-print" type="button" onClick={() => window.print()}>
        Print
      </button>
      <header className="lead-nav" aria-label="Velz report header">
        <a href={HOME_LINK} className="lead-logo" aria-label="Velz home">
          <span className="lead-logo-plus" aria-hidden="true">+</span>
          <span>velz</span>
        </a>
        <p className="lead-nav-right">{toolLabel}</p>
      </header>
      {children}
    </main>
  );
}

function SectionEyebrow({ children, tone }) {
  return <div className={`report-eyebrow ${tone ? `report-eyebrow-${tone}` : ""}`}>{children}</div>;
}

function normalizeToolLabel(toolKey) {
  return (toolKey || "diagnóstico").replaceAll("_", " ").toUpperCase();
}

function getPrimaryProduct(payload) {
  const discountProduct = asArray(payload.discount_depth?.deep_discount_products)[0];
  const stockoutProduct = asArray(payload.stockout?.product_cards)[0];
  const evidenceProduct = asArray(payload.evidence_items).find((item) => item.image_url || item.title);
  return discountProduct || stockoutProduct || evidenceProduct || {};
}

function metricValue(metrics, key, fallback = 0) {
  const value = metrics?.[key];
  return typeof value === "number" ? value : fallback;
}

function SeverityBadge({ children, tone = "warning" }) {
  return <span className={`report-severity report-severity-${tone}`}>{children}</span>;
}

function InsightMetricCard({ eyebrow, value, children, tone = "neutral" }) {
  return (
    <article className={`report-insight-card report-insight-${tone}`}>
      <span>{eyebrow}</span>
      <strong>{value}</strong>
      <p>{children}</p>
    </article>
  );
}

function formatCohortLabel(label = "") {
  return label
    .replace("<30 days", "<30 días")
    .replace("1-3 months", "1–3 meses")
    .replace("3-6 months", "3–6 meses")
    .replace("6-12 months", "6–12 meses")
    .replace(">12 months", ">12 meses")
    .replace(" months", " meses");
}

function ReportFooter({ limitations = [], variantCoverage = 40 }) {
  return (
    <footer className="report-footer">
      <SectionEyebrow>Hipótesis</SectionEyebrow>
      <p className="report-hypothesis">
        "Esto apunta a una oportunidad operativa visible en tu catálogo público. No es una predicción de ventas: es una señal para priorizar qué mirar primero."
      </p>

      {limitations.length > 0 ? (
        <>
          <SectionEyebrow>Qué no vemos</SectionEyebrow>
          <ul className="report-limitations">
            {limitations.slice(0, 4).map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </>
      ) : null}

      <SectionEyebrow>Cuánto vemos de la foto completa <span className="report-info">i</span></SectionEyebrow>
      <div className="report-coverage" aria-label={`Cobertura aproximada ${variantCoverage}%`}>
        <span style={{ width: `${Math.max(Math.min(variantCoverage, 100), 4)}%` }} />
        <strong>{variantCoverage}%</strong>
      </div>

      <div className="report-made-by">
        <div>
          <BrandSymbol className="report-made-symbol" width={44} />
          <strong>Hecho por Velz. Miramos tiendas online y contamos lo que vemos.</strong>
        </div>
        <p>Datos de catálogo público. No tocamos nada privado tuyo.</p>
        <p>
          ¿Quieres cruzar esto con tus ventas y tu caja de verdad? <a href={EMAIL_LINK}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </footer>
  );
}

function DiscountDepthReport({ payload, apiState, route }) {
  const metrics = payload.summary_metrics || {};
  const detail = payload.discount_depth || {};
  const product = getPrimaryProduct(payload);
  const buckets = asArray(detail.buckets);
  const cohorts = asArray(detail.age_cohorts);
  const products = asArray(detail.deep_discount_products);
  const maxDiscount = metricValue(metrics, "max_discount_pct", product.discount_pct || 0);
  const discountedPct = metricValue(metrics, "discounted_products_pct", 0);
  const deepCount = metricValue(metrics, "deep_discount_product_count", products.length);
  const availableCount = metricValue(metrics, "discounted_and_available_count", detail.discounted_available_product_count || 0);
  const oldPrice = product.compare_at_price ? `${formatLeadMetric(product.compare_at_price)}€` : "";
  const price = product.price ? `${formatLeadMetric(product.price)}€` : "";
  const primaryAge = product.product_age_months || product.age_months || 14;

  return (
    <ReportShell toolLabel="Nuevo análisis">
      <div className="report-wrap">
        <header className="report-tool-hero">
          <SectionEyebrow>{normalizeToolLabel(payload.tool_key)}</SectionEyebrow>
          <h1>¿Cuánto stock rebajado lleva meses sin moverse?</h1>
          <p>
            Miramos el catálogo público de {payload.brand?.domain || payload.brand?.name || "tu tienda"} y separamos el descuento que funciona del que no.
            Sin registrarte, sin tocar nada privado.
          </p>
        </header>

        <section className="report-card report-product-hero report-product-hero-v2">
          <ProductPhoto product={product} />
          <div className="report-product-copy">
            <div className="report-title-line">
              <h1>{product.title || "Producto con descuento profundo"}</h1>
              <span className="report-pill report-pill-muted">disponible</span>
            </div>
            <p className="report-muted">Listado hace {primaryAge} meses · entre los productos más longevos aún disponibles.</p>
            <div className="report-hero-metric-row">
              <span className="report-hero-discount">{toPercent(product.discount_pct || maxDiscount)} off</span>
              <p>Señal de stock que no rota sin cambiar el contenido del diagnóstico.</p>
            </div>
            <p className="report-price-line"><span>{oldPrice}</span> <strong>{price}</strong></p>
          </div>
        </section>

        <SectionEyebrow>Qué tipo de problema tienes</SectionEyebrow>
        <section className="report-card report-problem-card report-problem-card-gold">
          <div>
            <SectionEyebrow tone="gold">Problema de catálogo</SectionEyebrow>
            <h2>Parte del catálogo no está validando demanda.</h2>
            <p>Del catálogo con más de 6 meses, una parte sigue con descuento — el problema no es solo el precio, es que el producto no encontró demanda.</p>
          </div>
          <div className="report-health">
            <span>Inventory Health</span>
            <strong>{Math.max(0, Math.round(100 - discountedPct))}</strong><em>/100</em>
          </div>
        </section>

        <SectionEyebrow>Qué está pasando en tu catálogo</SectionEyebrow>
        <div className="report-two-col report-analysis-grid">
          <section className="report-card report-depth-card">
            <h3>Descuento por profundidad</h3>
            <div className="report-stacked-bar">
              {buckets.map((bucket) => {
                const total = buckets.reduce((sum, item) => sum + (item.product_count || 0), 0) || 1;
                const pct = ((bucket.product_count || 0) / total) * 100;
                return <span key={bucket.key} className={`bucket-${bucket.key}`} style={{ width: `${pct}%` }} />;
              })}
            </div>
            <div className="report-bucket-legend">
              {buckets.map((bucket) => (
                <span key={bucket.key} className={`bucket-label bucket-${bucket.key}`}>{bucket.label.replace(/[()]/g, "")} · {bucket.product_count || 0}</span>
              ))}
            </div>
            <div className="report-mini-meter">
              <span>&gt;6 meses en catálogo</span>
              <strong>{Math.min(100, Math.max(0, Math.round(availableCount / Math.max(metricValue(metrics, "catalog_product_count", availableCount || 1), 1) * 100)))}%</strong>
              <div><i style={{ width: `${Math.min(100, Math.max(8, availableCount / Math.max(metricValue(metrics, "catalog_product_count", availableCount || 1), 1) * 100))}%` }} /></div>
            </div>
          </section>

          <section className="report-card report-narrative-card report-insight-grid">
            <InsightMetricCard eyebrow="Catálogo rebajado" value={toPercent(discountedPct)} tone="neutral">
              Tiene precio por debajo de su ancla pública.
            </InsightMetricCard>
            <InsightMetricCard eyebrow="Problema real" value={deepCount} tone="critical">
              Productos están en descuento profundo.
            </InsightMetricCard>
            <InsightMetricCard eyebrow="Warning" value={availableCount} tone="warning">
              Productos rebajados todavía se pueden comprar.
            </InsightMetricCard>
          </section>
        </div>

        <div className="report-black-callout"><span>!</span><p>Descuento profundo + disponible: revisa si es liquidación táctica o stock que no rota.</p></div>

        {cohorts.length > 0 ? (
          <>
            <SectionEyebrow>Por antigüedad · % disponible y descuento medio</SectionEyebrow>
            <section className="report-card report-monthly-chart" aria-label="Descuento medio por antigüedad">
              <div className="report-gradient-scale"><span>0%</span><span>medio</span><span>profundo</span></div>
              <div className="report-bars-vertical">
                {cohorts.slice(0, 10).map((cohort) => {
                  const total = cohort.product_count || 1;
                  const discounted = cohort.discounted_product_count || 0;
                  const deep = cohort.deep_discount_product_count || 0;
                  const pct = Math.round((discounted / total) * 100);
                  const height = Math.min(100, Math.max(8, pct));
                  const hot = deep >= 7 || pct >= 80;
                  return (
                    <article className="report-vbar-item" key={cohort.key}>
                      <strong>{pct}%</strong>
                      <span className={hot ? "hot" : ""} style={{ height: `${height}%` }} />
                      <em>{formatCohortLabel(cohort.label)}</em>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        ) : null}

        {products.length > 0 ? (
          <>
            <SectionEyebrow>Productos a eliminar · por dónde empezar</SectionEyebrow>
            <section className="report-card report-product-list">
              {products.slice(0, 8).map((item, index) => (
                <article className="report-product-row" key={`${item.product_id || item.title}-${index}`}>
                  <div className="report-row-identity">
                    <span className={`report-rank ${index < 3 ? "critical" : ""}`}>{index + 1}</span>
                    <ProductPhoto product={item} className="report-row-photo" />
                    <div className="report-row-main">
                      <h3>{item.title}</h3>
                      <p>mismo lote · {item.product_age_cohort?.replaceAll("_", " ") || "antigüedad desconocida"}</p>
                      <SeverityBadge tone={index < 3 ? "critical" : "warning"}>{index < 3 ? "Crítico" : "Alto"}</SeverityBadge>
                    </div>
                  </div>
                  <div className="report-row-metrics"><span>{toPercent(item.discount_pct)}</span><em>Disponible</em>{item.compare_at_price ? <small>{formatLeadMetric(item.compare_at_price)}€ ancla</small> : null}</div>
                </article>
              ))}
            </section>
          </>
        ) : null}

        <div className="report-black-callout report-conclusion"><SectionEyebrow>Conclusión</SectionEyebrow><p>Tu catálogo parece depender de descuentos para mover productos que no están rotando.</p></div>
        <ReportFooter limitations={payload.limitations} variantCoverage={40} />
      </div>
    </ReportShell>
  );
}

function stockoutOptionLabel(variant, index) {
  const optionName = variant?.option_name && variant.option_name !== "unknown" ? String(variant.option_name).trim() : "Opción";
  const optionValue = variant?.option_value || variant?.normalized_option || variant?.normalized_size;

  if (!optionValue || optionValue === "unknown") {
    return `${optionName} ${index + 1}`;
  }

  return `${optionName} ${optionValue}`;
}

function getStockoutColumns(products, primaryProduct) {
  const sourceProducts = [primaryProduct, ...products].filter(Boolean);
  const labels = [];

  for (const item of sourceProducts) {
    for (const [index, variant] of asArray(item.variant_availability).entries()) {
      const label = stockoutOptionLabel(variant, index);
      if (!labels.includes(label)) {
        labels.push(label);
      }
    }
  }

  return labels.slice(0, 11).length > 0 ? labels.slice(0, 11) : ["Variante 1", "Variante 2"];
}

function productUnavailableLabels(product) {
  return new Set(
    asArray(product?.variant_availability)
      .map((variant, index) => ({ label: stockoutOptionLabel(variant, index), available: variant.available }))
      .filter((variant) => variant.available === false)
      .map((variant) => variant.label),
  );
}

function stockoutProductCategory(product) {
  return product?.product_type || product?.category || product?.type || "Sin categoría en el payload";
}

function getStockoutCategoryGroups(stockout) {
  const providedGroups = asArray(stockout?.category_groups)
    .map((group) => ({
      ...group,
      category: group.category || group.product_type || group.type || "Otros productos",
      products: asArray(group.products),
    }))
    .filter((group) => group.products.length > 0);

  if (providedGroups.length > 0) {
    return combineSmallStockoutGroups(providedGroups);
  }

  const grouped = new Map();
  for (const product of asArray(stockout?.product_cards)) {
    const category = stockoutProductCategory(product);
    const current = grouped.get(category) || {
      category,
      product_count: 0,
      affected_product_count: 0,
      fully_out_of_stock_count: 0,
      products: [],
    };
    current.product_count += 1;
    current.affected_product_count += 1;
    if (product.fully_out_of_stock) current.fully_out_of_stock_count += 1;
    current.products.push(product);
    grouped.set(category, current);
  }

  return combineSmallStockoutGroups(Array.from(grouped.values()));
}

function combineSmallStockoutGroups(groups) {
  const largeGroups = groups.filter((group) => Number(group.product_count || group.products?.length || 0) >= 6);
  const smallGroups = groups.filter((group) => Number(group.product_count || group.products?.length || 0) < 6);

  if (smallGroups.length === 0) {
    return largeGroups;
  }

  return [
    ...largeGroups,
    {
      category: "Otros productos",
      product_count: smallGroups.reduce((sum, group) => sum + Number(group.product_count || group.products?.length || 0), 0),
      affected_product_count: smallGroups.reduce((sum, group) => sum + Number(group.affected_product_count || group.products?.length || 0), 0),
      fully_out_of_stock_count: smallGroups.reduce((sum, group) => sum + Number(group.fully_out_of_stock_count || 0), 0),
      products: smallGroups.flatMap((group) => asArray(group.products)),
      combined_from: smallGroups.map((group) => group.category).filter(Boolean),
    },
  ];
}

function stockoutProductUnavailableCount(product) {
  const explicit = Number(product?.oos_variants);
  if (Number.isFinite(explicit)) return explicit;
  return productUnavailableLabels(product).size;
}

function stockoutStatusLabel(product) {
  if (product?.fully_out_of_stock) return "agotado total";
  if (product?.functional_stockout) return "agotado funcional";
  if (product?.partial_stockout) return "stockout parcial";
  return "sin señal";
}

function StockoutCategoryBlock({ group, index }) {
  const [expanded, setExpanded] = useState(false);
  const products = asArray(group.products);
  const optionLabels = getStockoutColumns(products, products[0]);
  const visibleProducts = expanded ? products : products.slice(0, 10);
  const affectedCount = group.affected_product_count || products.filter((item) => item.fully_out_of_stock || item.partial_stockout || item.functional_stockout).length;
  const productCount = group.product_count || products.length || affectedCount;
  const systemicCategory = productCount >= 6 && affectedCount >= 3 && Math.round((affectedCount / Math.max(productCount, 1)) * 100) >= 50;
  const fullyOut = group.fully_out_of_stock_count || products.filter((product) => product.fully_out_of_stock).length;
  const remaining = Math.max(0, products.length - visibleProducts.length);
  const gridTemplate = `minmax(210px, 1.45fr) repeat(${optionLabels.length}, minmax(42px, 1fr))`;

  return (
    <article className="report-stockout-type-block">
      <header className="report-stockout-type-head">
        <div>
          <h3>{group.category}</h3>
          {systemicCategory ? <span className="report-pill report-pill-red">sistémico</span> : null}
        </div>
        <p><strong>{affectedCount}</strong> señales en esta línea</p>
      </header>

      <div className="report-category-denominator">
        <span>{productCount} producto{productCount === 1 ? "" : "s"} revisado{productCount === 1 ? "" : "s"} en esta línea</span>
        <em>{fullyOut} agotado{fullyOut === 1 ? "" : "s"} total{fullyOut === 1 ? "" : "es"}</em>
      </div>

      <div className="report-size-summary report-size-summary-dynamic" style={{ gridTemplateColumns: gridTemplate }}>
        <span>Fugas claras por variante</span>
        {optionLabels.map((label) => {
          const unavailableCount = products.filter((item) => productUnavailableLabels(item).has(label)).length;
          const pct = productCount ? Math.round((unavailableCount / productCount) * 100) : 0;
          return (
            <strong
              key={label}
              className={pct > 0 ? "hot" : ""}
              title={`${label}: no disponible en ${unavailableCount} de ${productCount} productos de ${group.category}`}
            >
              {pct}%
            </strong>
          );
        })}
      </div>

      <div className="report-matrix-grid report-matrix-grid-dynamic" style={{ gridTemplateColumns: gridTemplate }}>
        <span />
        {optionLabels.map((label) => <b key={label}>{label}</b>)}
        {visibleProducts.map((item, rowIndex) => {
          const unavailableSet = productUnavailableLabels(item);
          return (
            <ReactRuntime.Fragment key={item.product_id || item.title || `${index}-${rowIndex}`}>
              <em title={item.title}>{item.title || `Producto ${rowIndex + 1}`}</em>
              {optionLabels.map((label) => (
                <i
                  key={`${rowIndex}-${label}`}
                  className={unavailableSet.has(label) ? "out" : ""}
                  title={`${item.title || "Producto"} · ${label}: ${unavailableSet.has(label) ? "agotada/no disponible" : "disponible"}`}
                />
              ))}
            </ReactRuntime.Fragment>
          );
        })}
      </div>

      <div className="report-stockout-products-row">
        {visibleProducts.slice(0, 12).map((product) => (
          <a href={product.url} key={product.product_id || product.title} target="_blank" rel="noreferrer" title={product.title}>
            {product.title}
          </a>
        ))}
      </div>

      {remaining > 0 && !expanded ? (
        <div className="report-stockout-expand-row">
          <span>…y el mismo patrón en otros {remaining} modelos.</span>
          <button type="button" onClick={() => setExpanded(true)}>Ver los {products.length} modelos</button>
        </div>
      ) : null}
      {expanded ? (
        <button className="report-stockout-collapse" type="button" onClick={() => setExpanded(false)}>Ocultar</button>
      ) : null}
    </article>
  );
}

function StockoutLeakReport({ payload }) {
  const metrics = payload.summary_metrics || {};
  const stockout = payload.stockout || {};
  const products = asArray(stockout.product_cards);
  const groups = getStockoutCategoryGroups(stockout);
  const product = getPrimaryProduct(payload);
  const optionLabels = getStockoutColumns(products, product);
  const primaryUnavailableSet = productUnavailableLabels(product);
  const catalogProductCount = metricValue(metrics, "product_count", stockout.all_product_count || products.length);
  const variantCount = metricValue(metrics, "variant_count", metrics.sample_size || 0);
  const fullyOutCount = metricValue(metrics, "fully_out_of_stock_count", products.filter((item) => item.fully_out_of_stock).length);
  const affectedCount = stockout.affected_product_count || products.length;
  const statusText = stockoutStatusLabel(product);

  return (
    <ReportShell toolLabel="Nuevo análisis">
      <div className="report-wrap report-stockout-wrap">
        <SectionEyebrow>{normalizeToolLabel(payload.tool_key)} · {payload.brand?.domain || payload.brand?.name || "catálogo"}</SectionEyebrow>

        <section className="report-card report-stockout-hero report-stockout-hero-v2 report-stockout-draft-hero">
          <div className="report-stockout-title-row">
            <ProductPhoto product={product} />
            <div>
              <h1>{fullyOutCount > 0 ? `Tienes ${formatLeadMetric(fullyOutCount)} productos 100% agotados en el catálogo observado.` : "Tienes disponibilidad incompleta en el catálogo observado."}</h1>
              <p className="report-muted">
                Hemos revisado {formatLeadMetric(catalogProductCount)} productos del catálogo público y hemos encontrado {formatLeadMetric(fullyOutCount)} sin ninguna variante disponible.
              </p>
            </div>
            <span className="report-pill report-pill-gold">warning</span>
          </div>
          <div className="report-size-row report-option-row">
            {optionLabels.map((label) => {
              const unavailable = primaryUnavailableSet.has(label);
              return <span key={label} className={unavailable ? "size-unavailable size-hot" : ""}>{label}</span>;
            })}
          </div>
          <div className="report-stockout-legend"><span className="legend-out" /> agotada/no disponible <span /> disponible</div>
        </section>

        <SectionEyebrow>Los tres ejes</SectionEyebrow>
        <div className="report-two-col report-kpi-row report-insight-grid report-stockout-metrics-grid">
          <InsightMetricCard eyebrow="Catálogo analizado" value={formatLeadMetric(catalogProductCount)} tone="neutral">
            Productos revisados en la tienda.
          </InsightMetricCard>
          <InsightMetricCard eyebrow="Variantes observadas" value={formatLeadMetric(variantCount)} tone="neutral">
            Formatos/opciones visibles en el catálogo.
          </InsightMetricCard>
          <InsightMetricCard eyebrow="Productos 100% agotados" value={formatLeadMetric(fullyOutCount)} tone="critical">
            Productos sin ninguna variante disponible.
          </InsightMetricCard>
        </div>

        <SectionEyebrow>Dónde está tu problema, por categoría de producto</SectionEyebrow>
        <section className="report-card report-stockout-matrix report-stockout-by-category">
          <h2>
            {affectedCount} productos con señal dentro de {formatLeadMetric(catalogProductCount)} productos analizados.
          </h2>
          <p className="report-muted report-stockout-denominator-note">
            Primero miramos el tamaño de la foto completa; después señalamos dónde se concentra el problema para que sepas por dónde empezar.
          </p>

          {groups.length > 0 ? groups.map((group, index) => (
            <StockoutCategoryBlock group={group} index={index} key={`${group.category}-${index}`} />
          )) : (
            <p className="report-muted">No hay categorías con señal pública suficiente para pintar la matriz.</p>
          )}

          <div className="report-matrix-legend"><span className="out" /> agotada/no disponible <span /> disponible</div>
        </section>

        <SectionEyebrow>El caso más claro de tu catálogo</SectionEyebrow>
        <section className="report-card report-product-hero report-stockout-product-proof">
          <ProductPhoto product={product} />
          <div className="report-product-copy">
            <div className="report-title-line">
              <h1>{product.title || "Producto con señal de stockout"}</h1>
              <span className="report-pill report-pill-red">{statusText}</span>
            </div>
            <p className="report-muted">
              {stockoutProductCategory(product)} · {stockoutProductUnavailableCount(product)} de {product.total_variants || asArray(product.variant_availability).length || 1} variantes no disponibles.
            </p>
          </div>
        </section>

        <ReportFooter limitations={payload.limitations} variantCoverage={Math.min(100, Math.max(4, Math.round((variantCount / Math.max(variantCount, 1)) * 40)))} />
      </div>
    </ReportShell>
  );
}

function toolCopyFromSlug(toolSlug) {
  return Object.entries(INVENTORY_TOOL_COPY).find(([, config]) => config.slug === toolSlug) || ["stockout_leak_score", INVENTORY_TOOL_COPY.stockout_leak_score];
}

function ToolHomePage({ route }) {
  const [toolKey, toolCopy] = useMemo(() => toolCopyFromSlug(route.toolSlug), [route.toolSlug]);
  const [query, setQuery] = useState("");
  const [state, setState] = useState({ status: LEAD_MAGNET_STATUSES.loading, results: [] });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setState((current) => ({ ...current, status: LEAD_MAGNET_STATUSES.loading }));
      try {
        const response = await fetch(
          `/api/lead-magnets/search?tool=${encodeURIComponent(route.toolSlug)}&q=${encodeURIComponent(query)}`,
          { headers: { Accept: "application/json" }, signal: controller.signal },
        );
        const payload = await response.json();
        if (!cancelled) {
          setState({
            status: response.ok ? LEAD_MAGNET_STATUSES.ready : LEAD_MAGNET_STATUSES.error,
            results: Array.isArray(payload.results) ? payload.results : [],
            source: payload.source,
            warning: payload.warning,
          });
        }
      } catch (error) {
        if (!cancelled && error.name !== "AbortError") {
          setState({ status: LEAD_MAGNET_STATUSES.error, results: [] });
        }
      }
    }, query ? 180 : 0);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query, route.toolSlug]);

  return (
    <ReportShell toolLabel="Tools">
      <div className="report-wrap tool-home-wrap">
        <header className="report-tool-hero tool-home-hero">
          <SectionEyebrow>{normalizeToolLabel(toolKey)}</SectionEyebrow>
          <h1>{toolCopy.title}</h1>
          <p>Busca por URL. Solo aparecen marcas con Shopify Signals ya analizado y suficiente dato para poblar esta tool.</p>
        </header>

        <section className="report-card tool-search-card">
          <label className="tool-search-label" htmlFor="tool-search-input">URL de la marca</label>
          <input
            id="tool-search-input"
            className="tool-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="empieza a escribir: northdeco.com, occre.com..."
            autoComplete="off"
          />

          <div className="tool-search-meta">
            <span>{state.status === LEAD_MAGNET_STATUSES.loading ? "Buscando..." : `${state.results.length} URLs disponibles`}</span>
            {state.source ? <span>{state.source === "live_supabase_shopify_signals" ? "live Supabase" : "fallback export"}</span> : null}
          </div>

          <div className="tool-result-list">
            {state.results.map((result) => (
              <a className="tool-result-row" href={result.lead_magnet_url} key={`${result.tool_key}-${result.brand_id}`}>
                <strong>{result.domain || result.url}</strong>
                <span>{result.url}</span>
              </a>
            ))}
            {state.status !== LEAD_MAGNET_STATUSES.loading && state.results.length === 0 ? (
              <p className="tool-empty-state">No hay URLs pobladas para esa búsqueda todavía. Ejecuta Shopify Signals para esa marca y vuelve a buscarla.</p>
            ) : null}
          </div>
        </section>
      </div>
    </ReportShell>
  );
}

function LeadMagnetPage({ route }) {
  const [apiState, setApiState] = useState({ status: LEAD_MAGNET_STATUSES.loading });
  const trackedViewRef = ReactRuntime.useRef(false);

  useEffect(() => {
    let cancelled = false;
    trackedViewRef.current = false;

    const loadLeadMagnet = async () => {
      setApiState({ status: LEAD_MAGNET_STATUSES.loading });

      try {
        const response = await fetch(`/api/lead-magnets/${encodeURIComponent(route.token)}`, {
          headers: { Accept: "application/json" },
        });
        const payload = normalizeInventoryPayload(await response.json());

        if (!cancelled) {
          const failedStatus = payload.error === "expired_token" ? LEAD_MAGNET_STATUSES.expired : LEAD_MAGNET_STATUSES.invalid;
          setApiState({
            status: response.ok ? getLeadMagnetStatus(payload, LEAD_MAGNET_STATUSES.notReady) : failedStatus,
            payload,
          });
        }
      } catch {
        if (!cancelled) {
          setApiState({ status: LEAD_MAGNET_STATUSES.error });
        }
      }
    };

    loadLeadMagnet();

    return () => {
      cancelled = true;
    };
  }, [route.token]);

  const postLeadMagnetEvent = async (eventType) => {
    try {
      await fetch(`/api/lead-magnets/${encodeURIComponent(route.token)}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          event_type: eventType,
          tool_slug: route.toolSlug,
          path: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
    } catch {
      // Tracking is best-effort and must never break the public page.
    }
  };

  useEffect(() => {
    if (trackedViewRef.current || apiState.status === LEAD_MAGNET_STATUSES.loading) {
      return;
    }

    trackedViewRef.current = true;
    postLeadMagnetEvent("viewed");
  }, [apiState.status]);

  const payload = apiState.payload || {};
  const statusCopy = getStatusCopy(apiState.status);

  if (apiState.status === LEAD_MAGNET_STATUSES.loading || !payload.version) {
    return (
      <ReportShell toolLabel="Nuevo análisis">
        <div className="report-wrap report-state-card">
          <SectionEyebrow>{route.toolSlug}</SectionEyebrow>
          <section className="report-card">
            <h1>Cargando diagnóstico...</h1>
            <p>Estoy comprobando el estado del entregable sin lanzar ETLs ni enriquecimientos síncronos.</p>
          </section>
        </div>
      </ReportShell>
    );
  }

  if (![LEAD_MAGNET_STATUSES.ready, LEAD_MAGNET_STATUSES.degraded, LEAD_MAGNET_STATUSES.notReady].includes(apiState.status)) {
    return (
      <ReportShell toolLabel="Nuevo análisis">
        <div className="report-wrap report-state-card">
          <SectionEyebrow>{statusCopy.label}</SectionEyebrow>
          <section className="report-card">
            <h1>{statusCopy.title}</h1>
            <p>{statusCopy.body}</p>
          </section>
        </div>
      </ReportShell>
    );
  }

  if (payload.tool_key === "discount_depth_analyzer") {
    return <DiscountDepthReport payload={payload} apiState={apiState} route={route} />;
  }

  return <StockoutLeakReport payload={payload} apiState={apiState} route={route} />;
}

function MicroMechanismSection() {
  const leverRows = [
    { label: "Meta", attributed: 88, real: 52 },
    { label: "Contenido orgánico", attributed: 24, real: 62 },
    { label: "Email", attributed: 52, real: 46 },
  ];

  return (
    <section className="sec mechanism-sec micro-mechanism-sec" id="mecanismo">
      <div className="micro-mechanism-wrap">
        <span className="ey">Cómo se monta la decisión</span>

        <article className="micro-mechanism-block">
          <div className="micro-mechanism-copy">
            <span className="micro-mechanism-number">01</span>
            <h2>El mismo tipo de modelo que usan las grandes multinacionales para repartir su presupuesto</h2>
            <p>
              Entrenado con tu histórico y tu mercado, no con una media de sector. Proyecta cuánto vas a vender las próximas 8–12 semanas, producto a producto.
            </p>
          </div>
          <svg className="micro-forecast" viewBox="0 0 360 180" role="img" aria-labelledby="micro-forecast-title">
            <title id="micro-forecast-title">Proyección con banda de incertidumbre</title>
            <line x1="20" y1="150" x2="345" y2="150" />
            <line className="micro-today-line" x1="180" y1="30" x2="180" y2="150" />
            <text x="180" y="166" textAnchor="middle">hoy</text>
            <text x="345" y="166" textAnchor="end">+12 sem</text>
            <path className="micro-band" d="M182.5,109.0L196.0,103.8L209.6,96.7L223.1,91.3L236.7,84.3L250.2,79.8L263.8,75.0L277.3,72.7L290.8,74.7L304.4,77.2L317.9,82.0L331.5,85.8L345.0,88.0L345.0,100.0L331.5,108.2L317.9,112.0L304.4,114.8L290.8,117.3L277.3,119.3L263.8,119.0L250.2,120.2L236.7,121.7L223.1,122.7L209.6,125.3L196.0,128.2L182.5,127.0Z" />
            <path className="micro-history" d="M20.0,140.0L33.5,132.0L47.1,142.0L60.6,128.0L74.2,134.0L87.7,120.0L101.2,126.0L114.8,114.0L128.3,120.0L141.9,108.0L155.4,114.0L169.0,102.0L182.5,106.0" />
            <path className="micro-projection" d="M182.5,106.0L196.0,102.0L209.6,96.0L223.1,91.0L236.7,85.0L250.2,81.0L263.8,78.0L277.3,77.0L290.8,80.0L304.4,84.0L317.9,90.0L331.5,95.0L345.0,99.0" />
          </svg>
        </article>

        <article className="micro-mechanism-block">
          <div className="micro-mechanism-copy">
            <span className="micro-mechanism-number">02</span>
            <h2>Qué palanca mueve más por cada euro</h2>
            <p>
              Con tu presupuesto actual, el modelo separa lo que empuja ventas de lo que solo se lleva el crédito. La recomendación de dónde ponerlo la firmo yo, no un panel.
            </p>
          </div>
          <div className="micro-levers" aria-label="Comparación entre atribución de panel y empuje real">
            <div className="micro-lever-legend">
              <span><i className="panel" />lo que el panel le atribuye</span>
              <span><i className="real" />lo que empuja de verdad</span>
            </div>
            {leverRows.map((row) => (
              <div className="micro-lever-row" key={row.label}>
                <span>{row.label}</span>
                <i className="micro-bar micro-bar-panel" style={{ width: `${row.attributed * 0.9}%` }} />
                <i className="micro-bar micro-bar-real" style={{ width: `${row.real * 0.9}%` }} />
              </div>
            ))}
          </div>
        </article>

        <article className="micro-mechanism-block">
          <div className="micro-mechanism-copy">
            <span className="micro-mechanism-number">03</span>
            <h2>Y cuánto stock necesitas para recogerlo</h2>
            <p>
              Ni más, ni menos. El stock justo para no dejar ventas fuera ni inmovilizar caja en algo que tardará meses en salir.
            </p>
          </div>
          <svg className="micro-stock" viewBox="0 0 360 130" role="img" aria-labelledby="micro-stock-title">
            <title id="micro-stock-title">Punto justo de stock entre rotura y exceso</title>
            <rect x="20" y="55" width="150" height="14" rx="7" className="micro-shortage" />
            <rect x="190" y="55" width="150" height="14" rx="7" className="micro-excess" />
            <rect x="20" y="55" width="320" height="14" rx="7" className="micro-stock-frame" />
            <text x="95" y="92" textAnchor="middle" className="micro-shortage-label">te quedas corto · ventas fuera</text>
            <text x="265" y="92" textAnchor="middle" className="micro-excess-label">te pasas · caja inmovilizada</text>
            <g className="micro-stock-marker">
              <line x1="180" y1="38" x2="180" y2="86" />
              <circle cx="180" cy="62" r="5.5" />
              <text x="180" y="26" textAnchor="middle" className="micro-stock-title">el pedido justo</text>
              <text x="180" y="116" textAnchor="middle" className="micro-stock-note">con semanas de antelación, no a última hora</text>
            </g>
          </svg>
        </article>
      </div>
    </section>
  );
}

export default function App() {
  const [dsReady, setDsReady] = useState(false);
  const [activeMechanismStep, setActiveMechanismStep] = useState(0);
  const mechanismRefs = useRef([]);
  const reduceMotion = useReducedMotion();
  const disableMotion =
    reduceMotion || (typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap");
  const pathname = typeof window === "undefined" ? HOME_LINK : window.location.pathname;
  const page = getPageConfig(pathname);
  const ctaHook = getLandingCtaHook(typeof window === "undefined" ? "" : window.location.search);

  useEffect(() => {
    let mounted = true;

    const loadBundle = async () => {
      if (typeof window === "undefined") {
        return;
      }

      if (!window.React) {
        window.React = ReactRuntime;
      }

      try {
        await import("../_ds_bundle.js");
      } catch {
        // Keep fallback rendering if the optional bundle fails to load.
      }

      if (mounted) {
        setDsReady(true);
      }
    };

    loadBundle();

    return () => {
      mounted = false;
    };
  }, []);

  const ds = useMemo(() => {
    if (typeof window === "undefined") {
      return {};
    }

    return window[DS_NAMESPACE] || {};
  }, [dsReady]);

  const DsCard = ds.Card;
  const DsLogo = ds.Logo;

  const cardTransition = (index) => ({
    duration: 0.45,
    delay: index * 0.08,
    ease: [0.22, 1, 0.36, 1],
  });

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = page.title;

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute("content", page.description);
    }

    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute("content", page.title);
    }

    const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionTag) {
      ogDescriptionTag.setAttribute("content", page.description);
    }

    const ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) {
      ogUrlTag.setAttribute("content", page.canonical);
    }

    const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleTag) {
      twitterTitleTag.setAttribute("content", page.title);
    }

    const twitterDescriptionTag = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescriptionTag) {
      twitterDescriptionTag.setAttribute("content", page.description);
    }

    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute("href", page.canonical);
    }
  }, [page.canonical, page.description, page.title]);

  useEffect(() => {
    if (page.key !== "landing") {
      return undefined;
    }

    if (disableMotion) {
      setActiveMechanismStep(mechanismSteps.length - 1);
      return undefined;
    }

    const entriesByIndex = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-mechanism-index"));
          entriesByIndex.set(index, entry);
        });

        const visible = [...entriesByIndex.entries()]
          .filter(([, entry]) => entry.isIntersecting)
          .sort(([, a], [, b]) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveMechanismStep(visible[0][0]);
        }
      },
      { root: null, rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.2, 0.55, 1] },
    );

    mechanismRefs.current.filter(Boolean).forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [disableMotion, page.key]);

  if (page.key === "legal") {
    return (
      <LegalLayout
        eyebrow="Aviso legal"
        title="Condiciones de uso y titularidad del sitio"
        intro="Este texto regula el acceso y uso de velz.io y resume el marco básico de titularidad, uso permitido y responsabilidad de la web."
        sections={legalSections}
      />
    );
  }

  if (page.key === "privacy") {
    return (
      <LegalLayout
        eyebrow="Privacidad"
        title="Cómo trato los datos que me envías"
        intro="Aquí se explica qué datos recoge esta web, para qué se usan y qué derechos tienes sobre ellos cuando solicitas un diagnóstico a Velz."
        sections={privacySections}
      />
    );
  }

  if (page.key === "tool-home") {
    return <ToolHomePage route={page.toolHomeRoute} />;
  }

  if (page.key === "lead-magnet") {
    return <LeadMagnetPage route={page.leadMagnetRoute} />;
  }

  return (
    <>
      <nav>
        <span className="wm">velz</span>
        <a href="#cta" className="nav-a">
          Reservar 15 minutos →
        </a>
      </nav>

      <div className="dark">
        <AuroraBackground className="h-auto" id="hero" showRadialGradient={false}>
          <motion.div
            className="relative z-10 hero-shell"
            initial={disableMotion ? false : { opacity: 0, y: 18 }}
            animate={disableMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandSymbol className="h-sym" width={76} />
            <h1>
              toma la decisión que maximiza el revenue de tu ecommerce
            </h1>
            <p className="hero-sub">
              optimiza tus acciones publicitarias y anticipa tu stock con la metodologia que emplean los grandes players, by velz
            </p>
            <motion.a
              href={CAL_BOOKING_LINK}
              className="btn"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={disableMotion ? {} : { y: -1.5, scale: 1.01 }}
              whileTap={disableMotion ? {} : { scale: 0.99 }}
              transition={{ duration: 0.18 }}
            >
              Reservar 15 minutos
            </motion.a>
            <p className="micro hero-micro">Una llamada corta para decidir con el dato real delante.</p>
          </motion.div>
        </AuroraBackground>
      </div>

      <section className="sec" id="problema">
        <Reveal className="wrap">
          <span className="ey">El problema</span>
        </Reveal>
        <Reveal className="grid-wrap">
          <div className="cards">
            {cardsProblema.map((card, index) => (
              <motion.div
                className="card-shell"
                key={card.title}
                initial={disableMotion ? false : { opacity: 0.6, y: 16 }}
                animate={disableMotion ? {} : { opacity: 1, y: 0 }}
                whileInView={disableMotion ? {} : { opacity: 1, y: 0 }}
                viewport={revealViewport}
                transition={cardTransition(index)}
              >
                {DsCard ? (
                  <DsCard className="card ds-card" padding="28px 22px" elevated>
                    <p className="ct">{card.title}</p>
                    <p className="cb">{card.body}</p>
                  </DsCard>
                ) : (
                  <div className="card">
                    <p className="ct">{card.title}</p>
                    <p className="cb">{card.body}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Reveal>
        <Reveal className="wrap">
          <p className="sec-close">
            No son tres problemas. Es uno: nadie conecta los tres datos antes de que tomes la decisión.
          </p>
        </Reveal>
      </section>

      <section className="sec paper" id="decision">
        <Reveal className="wrap">
          <span className="ey">Lo que recibes cada dos semanas</span>
          <p className="big-q">
            "Escala Meta un 30% esta semana, pide 500 unidades del SKU-3 el jueves, y tienes caja para hacerlo si retrasas el pago al proveedor B quince días."
          </p>
          <p className="q-close">Una decisión operativa, no un dashboard más.</p>
        </Reveal>
      </section>

      <MicroMechanismSection />

      <section className="sec" id="vs">
        <Reveal className="wrap">
          <span className="ey">Por qué no es lo que ya tienes</span>
        </Reveal>
        <Reveal className="grid-wrap">
          <div className="cards">
            {cardsVs.map((card, index) => (
              <motion.div
                className="card-shell"
                key={card.title}
                initial={disableMotion ? false : { opacity: 0.6, y: 16 }}
                animate={disableMotion ? {} : { opacity: 1, y: 0 }}
                whileInView={disableMotion ? {} : { opacity: 1, y: 0 }}
                viewport={revealViewport}
                transition={cardTransition(index)}
              >
                {DsCard ? (
                  <DsCard className="card ds-card" padding="28px 22px" elevated>
                    <p className="ct">{card.title}</p>
                    <p className="cb">{card.body}</p>
                  </DsCard>
                ) : (
                  <div className="card">
                    <p className="ct">{card.title}</p>
                    <p className="cb">{card.body}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>


      <section className="sec" id="para-quien">
        <Reveal className="wrap">
          <span className="ey">Para quién</span>
          <div className="fw">
            <div>
              <span className="clbl clbl-y">Es para ti si</span>
              <ul className="crl crl-y">
                {paraTi.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={disableMotion ? false : { opacity: 0.7, x: -12 }}
                    animate={disableMotion ? {} : { opacity: 1, x: 0 }}
                    whileInView={disableMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={revealViewport}
                    transition={cardTransition(index)}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <span className="clbl clbl-n">No es para ti si</span>
              <ul className="crl crl-n">
                {noParaTi.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={disableMotion ? false : { opacity: 0.7, x: 12 }}
                    animate={disableMotion ? {} : { opacity: 1, x: 0 }}
                    whileInView={disableMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={revealViewport}
                    transition={cardTransition(index)}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="sec paper" id="quien">
        <Reveal className="wrap">
          <span className="ey">Quién está detrás</span>
          <div className="carta">
            <p>
              Durante casi cuatro años en Dentsu —el cuarto grupo de marketing más grande del mundo— construí los modelos que le decían a marcas como Vodafone o Gillette dónde estaban tirando presupuesto de marketing sin saberlo, en cualquier canal, y dónde ponerlo para que generara nuevas ventas. Nuevas ventas hoy y en el futuro.
            </p>
            <p>
              Esa misma lógica de largo plazo es la que le falta a cualquier founder que escala Meta mirando solo el ROAS de hoy: no sabe si ese cliente nuevo le compensará dentro de seis meses, o si le costó más de lo que va a devolverle. Las multinacionales pagan equipos enteros para no tener ese punto ciego. Yo hablo cada semana con founders que lo sufren solos, sin ese equipo.
            </p>
            <p>
              Velz existe para eso. No vendo ads, no vendo software, no cobro comisión de nadie. Mi único incentivo es que tu próxima decisión sea mejor que la anterior.
            </p>
          </div>
          <div className="firma">
            <img className="fph" src={miguelHeadshot} alt="Miguel Carmona" width="68" height="68" loading="lazy" decoding="async" />
            <div>
              <p className="fnm">Miguel Carmona</p>
              <p className="frl">Fundador, Velz · Ex–Senior Data Scientist, Dentsu (2022–2025)</p>
              <a
                className="flink"
                href="https://www.linkedin.com/in/miguel-carmona-rodriguez/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn →
              </a>
            </div>
          </div>
          <div className="brands-block">
            <p className="brands-eyebrow">TRAYECTORIA</p>
            <div className="brands-row">
              <div className="brand-box">
                <img
                  className="brand-logo"
                  src="/og/vodafone.png"
                  alt="Vodafone"
                  width="246"
                  height="121"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="brand-box">
                <img
                  className="brand-logo"
                  src="/og/gillete.png"
                  alt="Gillette"
                  width="246"
                  height="121"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="brand-box">
                <img
                  className="brand-logo"
                  src="/og/adevinta.png"
                  alt="Adevinta"
                  width="246"
                  height="121"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <p className="brands-disclaimer">
              Marcas para las que desarrollé modelos durante mi etapa en Dentsu. No son clientes de Velz.
            </p>
          </div>
        </Reveal>
      </section>

      <section id="cta">
        <Reveal className="cta-shell">
          <BrandSymbol className="cta-sym" width={76} />
          <h2>{ctaHook}</h2>
          <div className="booking-cta-card" id="lead-form">
            <a className="booking-primary" href={CAL_BOOKING_LINK} target="_blank" rel="noopener noreferrer">
              Reservar 15 minutos
            </a>
          </div>
        </Reveal>
      </section>

      <footer>
        {DsLogo ? (
          <DsLogo size={24} color="var(--ink-400)" className="footer-logo" />
        ) : (
          <span className="wm footer-wm">velz</span>
        )}
        <div className="fr">
          <a href={EMAIL_LINK} className="fe">
            {CONTACT_EMAIL}
          </a>
          <a href={LEGAL_LINK} className="fl">
            Aviso legal
          </a>
          <a href={PRIVACY_LINK} className="fl">
            Privacidad
          </a>
        </div>
      </footer>
    </>
  );
}
