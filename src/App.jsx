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
  error: "error",
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
        const payload = await response.json();

        if (!cancelled) {
          setApiState({
            status: response.ok ? getLeadMagnetStatus(payload, LEAD_MAGNET_STATUSES.notReady) : LEAD_MAGNET_STATUSES.error,
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
  const tokenSuffix = payload.token_suffix || route.token.slice(-6);
  const brandName = payload.brand?.name || "Tu marca";
  const headline = payload.headline || statusCopy.title;
  const intro = payload.intro || statusCopy.body;
  const summaryBlocks = asArray(payload.summary_blocks);
  const evidence = asArray(payload.evidence);
  const limitations = asArray(payload.limitations);
  const cta = payload.cta || {
    label: "Responder al email de Velz",
    href: EMAIL_LINK,
  };
  const showContent = apiState.status !== LEAD_MAGNET_STATUSES.loading && apiState.status !== LEAD_MAGNET_STATUSES.error;

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

      <main className="lead-magnet-page">
        <section className="lead-magnet-hero">
          <div className="wrap lead-magnet-wrap">
            <BrandSymbol className="lead-magnet-symbol" width={72} />
            <span className={`lead-magnet-status lead-magnet-status-${apiState.status}`}>
              {apiState.status === LEAD_MAGNET_STATUSES.loading ? "Loading" : statusCopy.label}
            </span>
            <p className="lead-magnet-brand">{brandName}</p>
            <h1 className="lead-magnet-title">
              {apiState.status === LEAD_MAGNET_STATUSES.loading ? "Cargando diagnóstico..." : headline}
            </h1>
            <p className="lead-magnet-intro">
              {apiState.status === LEAD_MAGNET_STATUSES.loading
                ? "Estoy comprobando el estado del entregable sin lanzar ETLs ni enriquecimientos síncronos."
                : intro}
            </p>

            {showContent && summaryBlocks.length > 0 ? (
              <div className="lead-magnet-blocks" aria-label="Resumen del diagnóstico">
                {summaryBlocks.map((block) => (
                  <article className="lead-magnet-card" key={`${block.title}-${block.claim_safety}`}>
                    <span className="lead-magnet-card-safety">{block.claim_safety || "claim_safe"}</span>
                    <h2>{block.title}</h2>
                    <p>{block.body}</p>
                  </article>
                ))}
              </div>
            ) : null}

            {showContent && evidence.length > 0 ? (
              <section className="lead-magnet-panel" aria-labelledby="lead-magnet-evidence-title">
                <h2 id="lead-magnet-evidence-title">Evidencia usada</h2>
                <ul className="lead-magnet-list">
                  {evidence.map((item) => (
                    <li key={`${item.label}-${item.value}`}>
                      <strong>{item.label}:</strong> {item.value}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {limitations.length > 0 ? (
              <section className="lead-magnet-panel lead-magnet-limitations" aria-labelledby="lead-magnet-limitations-title">
                <h2 id="lead-magnet-limitations-title">Limitaciones</h2>
                <ul className="lead-magnet-list">
                  {limitations.map((limitation) => (
                    <li key={limitation}>{limitation}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {showContent ? (
              <a
                className="lead-magnet-cta"
                href={cta.href || EMAIL_LINK}
                onClick={() => postLeadMagnetEvent("clicked")}
              >
                {cta.label || "Responder al email de Velz"}
              </a>
            ) : null}

            <dl className="lead-magnet-meta" aria-label="Detalles técnicos del lead magnet">
              <div>
                <dt>Tool</dt>
                <dd>{payload.tool_key || route.toolSlug}</dd>
              </div>
              <div>
                <dt>Token</dt>
                <dd>…{tokenSuffix}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{apiState.status}</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </>
  );
}

function MechanismGraphic({ activeIndex }) {
  const showLayer = (index) => activeIndex >= index;

  return (
    <div className="mechanism-visual" aria-hidden="true">
      <div className="mechanism-frame">
        <div className="mechanism-kicker">Velz mechanism</div>
        <div className="mechanism-chart">
          <svg viewBox="0 0 520 360" role="presentation" focusable="false">
            <defs>
              <linearGradient id="velzForecast" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(26, 143, 84, 0.08)" />
                <stop offset="100%" stopColor="rgba(26, 143, 84, 0.28)" />
              </linearGradient>
              <filter id="velzSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line className="mechanism-axis" x1="58" y1="294" x2="478" y2="294" />
            <line className="mechanism-axis" x1="58" y1="62" x2="58" y2="294" />
            <path
              className={`mechanism-layer ${showLayer(0) ? "is-visible" : ""}`}
              d="M58 258 C102 238 124 260 160 222 S228 168 270 184 S340 216 382 156"
              fill="none"
              stroke="var(--ink-900)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              className={`mechanism-layer ${showLayer(1) ? "is-visible" : ""}`}
              d="M270 184 C324 154 372 136 462 98 L462 188 C382 210 328 200 270 184 Z"
              fill="url(#velzForecast)"
            />
            <path
              className={`mechanism-layer ${showLayer(1) ? "is-visible" : ""}`}
              d="M270 184 C332 166 384 150 462 128"
              fill="none"
              stroke="var(--g500)"
              strokeWidth="3"
              strokeDasharray="7 7"
              strokeLinecap="round"
            />
            <g className={`mechanism-layer ${showLayer(1) ? "is-visible" : ""}`} filter="url(#velzSoftGlow)">
              <circle cx="392" cy="140" r="7" fill="var(--g500)" />
              <text x="404" y="135" className="mechanism-svg-label">SKU-3</text>
            </g>
            <g className={`mechanism-layer ${showLayer(2) ? "is-visible" : ""}`}>
              <rect className="mechanism-range" x="330" y="226" width="112" height="34" rx="17" />
              <rect className="mechanism-bar" x="326" y="238" width="22" height="56" rx="4" />
              <rect className="mechanism-bar" x="360" y="214" width="22" height="80" rx="4" />
              <rect className="mechanism-bar" x="394" y="228" width="22" height="66" rx="4" />
              <text x="318" y="321" className="mechanism-svg-small">rango stock</text>
            </g>
            <g className={`mechanism-layer ${showLayer(3) ? "is-visible" : ""}`}>
              <path className="mechanism-source-line" d="M112 96 C146 118 160 150 174 204" />
              <path className="mechanism-source-line" d="M238 74 C254 106 274 122 318 150" />
              <path className="mechanism-source-line" d="M434 74 C418 98 404 112 392 140" />
              <circle className="mechanism-source" cx="112" cy="96" r="6" />
              <circle className="mechanism-source" cx="238" cy="74" r="6" />
              <circle className="mechanism-source" cx="434" cy="74" r="6" />
              <text x="82" y="84" className="mechanism-svg-small">Shopify</text>
              <text x="218" y="62" className="mechanism-svg-small">Meta</text>
              <text x="404" y="62" className="mechanism-svg-small">Inventario</text>
            </g>
            <g className={`mechanism-layer ${showLayer(4) ? "is-visible" : ""}`}>
              <rect className="mechanism-cash" x="86" y="220" width="110" height="54" rx="12" />
              <path className="mechanism-cash-line" d="M196 247 C244 266 286 264 336 244" />
              <text x="112" y="252" className="mechanism-svg-cash">Caja</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
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
        <AuroraBackground className="h-auto" id="hero">
          <motion.div
            className="relative z-10 hero-shell"
            initial={disableMotion ? false : { opacity: 0, y: 18 }}
            animate={disableMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandSymbol className="h-sym" width={76} />
            <h1>
              La decisión operativa que conecta tus ads, tu stock y tu caja, antes de que decidas a ciegas.
            </h1>
            <p className="hero-sub">
              Tus ads, tu inventario y tu caja ya generan datos.
              <br />
              Nadie los conecta en una decisión. Eso es lo que hago.
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

      <section className="sec mechanism-sec" id="mecanismo">
        <div className="mechanism-layout">
          <MechanismGraphic activeIndex={activeMechanismStep} />
          <div className="mechanism-copy" aria-label="Cómo Velz monta la decisión operativa">
            <span className="ey">Cómo se monta la decisión</span>
            {mechanismSteps.map((step, index) => (
              <article
                className={`mechanism-beat ${activeMechanismStep === index ? "is-active" : ""}`}
                key={step.key}
                data-mechanism-index={index}
                ref={(node) => {
                  mechanismRefs.current[index] = node;
                }}
              >
                <span className="mechanism-number">{step.number}</span>
                <div>
                  <p className="mechanism-eyebrow">{step.eyebrow}</p>
                  <h2 className="mechanism-title">{step.title}</h2>
                  <p className="mechanism-body">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

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
          <span className="cta-mc">
            Si vienes de un lead magnet, ya viste el mecanismo sin fricción. La llamada añade lo que falta:
            reaccionar en vivo con tu dato real delante.
          </span>
          <div className="booking-cta-card" id="lead-form">
            <a className="booking-primary" href={CAL_BOOKING_LINK} target="_blank" rel="noopener noreferrer">
              Reservar 15 minutos
            </a>
            <p className="booking-note">
              Cal.com directo. Sin formulario intermedio, sin comisión de agencia y sin venderte otro dashboard.
            </p>
            <a className="booking-secondary" href={DIAGNOSTIC_FALLBACK_LINK}>
              ¿No vienes de un lead magnet? Pedir diagnóstico de 24h por email →
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
