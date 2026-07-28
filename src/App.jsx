import * as ReactRuntime from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
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

const steps = [
  {
    number: "01",
    title: "Conexión.",
    body: "Shopify, Meta, Google, tu inventario y tu banco. Una semana, sin trabajo de tu parte.",
  },
  {
    number: "02",
    title: "Modelo.",
    body: "Cruzo demanda esperada por canal con cobertura de stock y posición de caja.",
  },
  {
    number: "03",
    title: "Decisión.",
    body: "Reunión quincenal de 45 minutos. Sales con qué hacer, cuándo y con qué dinero.",
  },
];

const paraTi = ["Marca de 500K–5M €", "Shopify", "12+ meses de historial de ads", "Sin equipo de datos"];
const noParaTi = ["Buscas otro dashboard", "Acabas de lanzar", "Quieres delegar la ejecución de ads"];

const DS_NAMESPACE = "VeldDesignSystem_c12abb";
const CTA_LINK = "#lead-form";
const CONTACT_EMAIL = "miguel@velz.io";
const EMAIL_LINK = `mailto:${CONTACT_EMAIL}`;
const LEGAL_LINK = "/aviso-legal";
const PRIVACY_LINK = "/privacidad";
const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID;
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
    title: "velz — Tu negocio, visto desde arriba",
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
      body: "Este es el contenedor público del lead magnet. La entrega final se conectará al payload persistido en una tarea posterior.",
    };
  }

  if (status === LEAD_MAGNET_STATUSES.degraded) {
    return {
      label: "Degraded",
      title: "Tu diagnóstico está parcialmente listo.",
      body: "Algunas señales están disponibles y otras siguen pendientes. La página evita ejecutar enriquecimientos en tiempo real.",
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
    body: "El enlace es válido, pero el payload todavía no está marcado como listo. Vuelve a abrirlo más tarde.",
  };
}

function LeadMagnetPage({ route }) {
  const [apiState, setApiState] = useState({ status: LEAD_MAGNET_STATUSES.loading });

  useEffect(() => {
    let cancelled = false;

    const loadLeadMagnet = async () => {
      setApiState({ status: LEAD_MAGNET_STATUSES.loading });

      try {
        const response = await fetch(`/api/lead-magnets/${encodeURIComponent(route.token)}`, {
          headers: { Accept: "application/json" },
        });
        const payload = await response.json();

        if (!cancelled) {
          setApiState({
            status: response.ok ? payload.status : LEAD_MAGNET_STATUSES.error,
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

  const statusCopy = getStatusCopy(apiState.status);
  const tokenSuffix = apiState.payload?.token_suffix || route.token.slice(-6);

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
            <h1 className="lead-magnet-title">
              {apiState.status === LEAD_MAGNET_STATUSES.loading ? "Cargando diagnóstico..." : statusCopy.title}
            </h1>
            <p className="lead-magnet-intro">
              {apiState.status === LEAD_MAGNET_STATUSES.loading
                ? "Estoy comprobando el estado del entregable sin lanzar ETLs ni enriquecimientos síncronos."
                : statusCopy.body}
            </p>
            <dl className="lead-magnet-meta" aria-label="Detalles técnicos del lead magnet">
              <div>
                <dt>Tool</dt>
                <dd>{route.toolSlug}</dd>
              </div>
              <div>
                <dt>Token</dt>
                <dd>…{tokenSuffix}</dd>
              </div>
              <div>
                <dt>API</dt>
                <dd>/api/lead-magnets/:token</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </>
  );
}

export default function App() {
  const [dsReady, setDsReady] = useState(false);
  const [formState, handleFormspreeSubmit] = useForm(FORMSPREE_FORM_ID || "missing-formspree-id");
  const reduceMotion = useReducedMotion();
  const disableMotion =
    reduceMotion || (typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap");
  const pathname = typeof window === "undefined" ? HOME_LINK : window.location.pathname;
  const page = getPageConfig(pathname);

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
          Solicitar diagnóstico →
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
              Tu negocio,
              <br />
              visto desde arriba.
            </h1>
            <p className="hero-sub">
              Tus ads, tu inventario y tu caja ya generan datos.
              <br />
              Nadie los conecta en una decisión. Eso es lo que hago.
            </p>
            <motion.a
              href={CTA_LINK}
              className="btn"
                whileHover={disableMotion ? {} : { y: -1.5, scale: 1.01 }}
                whileTap={disableMotion ? {} : { scale: 0.99 }}
              transition={{ duration: 0.18 }}
            >
              Diagnóstico externo de 24h
            </motion.a>
            <p className="micro hero-micro">Entregable concreto. Sin llamada de venta previa.</p>
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

      <section className="sec" id="como">
        <Reveal className="wrap">
          <span className="ey">Cómo funciona</span>
          <div className="steps">
            {steps.map((step, index) => (
              <motion.div
                className="step"
                key={step.number}
                initial={disableMotion ? false : { opacity: 0.6, y: 18 }}
                animate={disableMotion ? {} : { opacity: 1, y: 0 }}
                whileInView={disableMotion ? {} : { opacity: 1, y: 0 }}
                viewport={revealViewport}
                transition={cardTransition(index)}
              >
                <span className="sn">{step.number}</span>
                <div>
                  <p className="st">{step.title}</p>
                  <p className="sb">{step.body}</p>
                </div>
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
              Durante casi cuatro años construí en Dentsu —el cuarto grupo de marketing más grande del mundo— los modelos bayesianos que optimizaban los presupuestos de marcas como Vodafone o Gillette: cuánto invertir en cada canal para maximizar ventas.
            </p>
            <p>
              Para optimizar un presupuesto, primero hay que predecir cuánto vas a vender. Y esa predicción es la misma que un ecommerce necesita para sus tres preguntas: cuánto venderé, cuánto stock pido y si mi caja lo aguanta. Las multinacionales pagan equipos enteros por esa respuesta. Yo hablo cada semana con founders que tienen las mismas preguntas — y nadie que las conecte.
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
          <h2>
            Empieza por ver tu negocio
            <br />
            desde arriba.
          </h2>
          <span className="cta-mc">
            5 plazas al mes. En 24h recibes un vídeo de 10 minutos con 3 hipótesis cuantificadas sobre tu
            marca, te quedes o no.
          </span>
          <form id="lead-form" className="lead-form" onSubmit={handleFormspreeSubmit}>
            <label className="lead-field">
              Nombre
              <input type="text" name="name" autoComplete="name" required />
              <ValidationError className="lead-error" field="name" errors={formState.errors} />
            </label>
            <label className="lead-field">
              Email
              <input type="email" name="email" autoComplete="email" required />
              <ValidationError className="lead-error" field="email" errors={formState.errors} />
            </label>
            <label className="lead-field">
              URL de la tienda
              <input type="url" name="storeUrl" placeholder="https://tu-tienda.com" required />
              <ValidationError className="lead-error" field="storeUrl" errors={formState.errors} />
            </label>
            <button type="submit" className="lead-submit" disabled={formState.submitting}>
              {formState.submitting ? "Enviando..." : "Enviar solicitud"}
            </button>
            <p className="lead-gdpr">
              Solo usaré estos datos para enviarte el diagnóstico. Sin listas, sin spam. Consulta la{" "}
              <a href={PRIVACY_LINK}>política de privacidad</a>.
            </p>
            <ValidationError className="lead-error" errors={formState.errors} />
            {formState.succeeded ? (
              <p className="lead-status success">Solicitud enviada. Te responderé por email en menos de 24h.</p>
            ) : null}
          </form>
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
