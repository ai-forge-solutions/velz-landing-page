import * as ReactRuntime from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import velzSymbolSvg from "../assets/velz-symbol.svg?raw";
import miguelHeadshot from "../assets/miguel-headshot.webp";

const pasIntro = [
  "¿Te has fijado en que el panorama se ha vuelto extremadamente competitivo? Eso trae consigo muchos inconvenientes hoy en día. Los CPMs suben cada vez más. Los algoritmos de las redes sociales y las tendencias cambian de un mes para otro.",
  "Para colmo, la privacidad y la pérdida de señales hacen cada vez más difícil medir. Y no es trivial. Las plataformas no tienen en cuenta el resto de tu inversión ni ven lo que pasa en tu negocio. Se apuntan todas tus ventas. ¡Qué listas! ¿Cómo pueden las agencias o las plataformas medir su propia eficacia? ¿Te imaginas que en el colegio los niños se corrigiesen ellos mismos los exámenes? ¿Qué nota crees que se iban a poner? No tiene sentido.",
];

const services = [
  {
    key: "mmm",
    name: "MMM",
    kicker: "Marketing Mix Modeling",
    lead: "¿Quieres entender…",
    items: [
      "El impacto que han tenido tus medios (offline y online)",
      "El impacto de los medios de branding en tu caja",
      "El impacto de la competencia sobre tu negocio",
      "El impacto del precio de tu producto en tus ventas",
    ],
    more: [
      "Hacer un presupuesto con escenarios respaldados por evidencia matemática.",
      "Dónde escalar más porque todavía queda eficiencia desaprovechada.",
      "¿Qué momentos del año son los más interesantes?",
    ],
    closing: "Este es tu sitio.",
    note: "Mínimo 1M€ gastado al año.",
  },
  {
    key: "momentum",
    name: "Momentum",
    kicker: "Para el día a día.",
    items: [
      "Distingue entre tus ventas y las que te traen los canales.",
      "El antiscam de las plataformas.",
      "Optimiza por medio/campaña/anuncio para maximizar tu KPI.",
      "Se conecta directamente a tus canales y se actualiza de manera diaria.",
      "Capacidad de optimización automática.",
    ],
  },
];

const DS_NAMESPACE = "VeldDesignSystem_c12abb";
const CTA_LINK = "#cta";
const CONTACT_EMAIL = "miguel@velz.io";
const EMAIL_LINK = `mailto:${CONTACT_EMAIL}`;
const LEGAL_LINK = "/aviso-legal";
const PRIVACY_LINK = "/privacidad";
const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID;
const revealViewport = { once: true, amount: 0.2 };
const HOME_LINK = "/";

const DEFAULT_META_TITLE = "velz — Tus datos de marketing, en respuestas claras";
const DEFAULT_META_DESCRIPTION =
  "Convierte tus datos en respuestas claras y prácticas para escalar tu negocio con confianza.";

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
      "La finalidad de este sitio es informar sobre los servicios de medición y análisis de marketing ofrecidos por Velz.",
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
      "A través del formulario de esta web se recogen únicamente los datos que el usuario facilita de forma directa: nombre, email, web de la empresa y, opcionalmente, un mensaje.",
      "No se solicitan categorías especiales de datos personales.",
    ],
  },
  {
    title: "Finalidad",
    paragraphs: [
      "Los datos se utilizan exclusivamente para revisar la solicitud, agendar una llamada y responder por email al usuario interesado.",
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
    title: DEFAULT_META_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    canonical: "https://velz.io/",
  };
}

// Transparent header at the top of the page; gains a light backdrop once content scrolls under it.
function useNavScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrolled;
}

function LegalLayout({ eyebrow, title, intro, sections }) {
  const navScrolled = useNavScrolled();

  return (
    <>
      <nav className={navScrolled ? "is-scrolled" : undefined}>
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

export default function App() {
  const [dsReady, setDsReady] = useState(false);
  const navScrolled = useNavScrolled();
  const [formState, handleFormspreeSubmit] = useForm(FORMSPREE_FORM_ID);
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
        intro="Aquí se explica qué datos recoge esta web, para qué se usan y qué derechos tienes sobre ellos cuando te pones en contacto con Velz."
        sections={privacySections}
      />
    );
  }

  return (
    <>
      <nav className={navScrolled ? "is-scrolled" : undefined}>
        <span className="nav-brand">
          <BrandSymbol className="nav-sym" width={30} />
          <span className="wm">velz</span>
        </span>
        <a href={CTA_LINK} className="nav-a">
          Agenda una llamada →
        </a>
      </nav>

      <div>
        <AuroraBackground className="h-auto" id="hero">
          <motion.div
            className="relative z-10 hero-shell"
            initial={disableMotion ? false : { opacity: 0, y: 18 }}
            animate={disableMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="hero-title">
              Convierte tus datos en respuestas claras y prácticas para escalar tu negocio con confianza
            </h1>
            <p className="hero-sub">
              Aumenta tus presupuestos y optimiza tus campañas de marketing de nuestra mano en días, no meses, gracias a nuestra
              infraestructura AI‑native.
            </p>
            <motion.a
              href={CTA_LINK}
             
              className="btn"
              whileHover={disableMotion ? {} : { y: -1.5, scale: 1.01 }}
              whileTap={disableMotion ? {} : { scale: 0.99 }}
              transition={{ duration: 0.18 }}
            >
              Agenda una llamada
            </motion.a>
          </motion.div>
        </AuroraBackground>
      </div>

      <section className="sec paper" id="medir">
        <Reveal className="wrap">
          <figure className="kelvin">
            <blockquote className="big-q">“Lo que no se mide no se puede mejorar”</blockquote>
            <figcaption className="q-close">— Lord Kelvin</figcaption>
          </figure>
        </Reveal>
      </section>

      <section className="sec" id="problema">
        <Reveal className="wrap prose">
          {pasIntro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <p className="prose-lead">Lo que no se mide no se puede mejorar... pero tampoco se puede respaldar.</p>
          <p>
            Puedes tener éxito. Tu campaña puede haber ido muy bien, o no. Pero... ¿cómo lo demuestras? ¿Cómo
            argumentas la importancia de hacer publicidad de branding? ¿O cómo rebates los recortes en presupuestos
            cuando intuyes que eso puede ser un error?
          </p>

          <div className="prose-turn">
            <p>
              Todo eso cambia cuando comprendes el verdadero impacto de tus medios. No solo tienes éxito, lo
              demuestras. Tus presupuestos no se presentan, se aprueban. Descubres oportunidades invisibles que
              consiguen obtener el máximo retorno por tu dinero. Así se gana el respaldo del resto de departamentos.
              Así es como podemos ser competitivos en nuestro sector.
            </p>
          </div>

          <p className="prose-close">
            Puede ser con nosotros, o con otros, pero es crucial medir. Si te interesa,{" "}
            <a href={CTA_LINK}>
              agenda una llamada aquí
            </a>
            .
          </p>
        </Reveal>
      </section>

      <section className="sec paper" id="servicios">
        <Reveal className="wrap">
          <p className="svc-intro">
            Si estás planteándote hacerlo con nosotros, a continuación tienes los dos servicios base que ofrecemos.
          </p>
        </Reveal>
        <Reveal className="grid-wrap">
          <div className="svc-grid">
            {services.map((service, index) => (
              <motion.article
                className={`svc svc-${service.key}`}
                key={service.key}
                initial={disableMotion ? false : { opacity: 0.6, y: 16 }}
                animate={disableMotion ? {} : { opacity: 1, y: 0 }}
                whileInView={disableMotion ? {} : { opacity: 1, y: 0 }}
                viewport={revealViewport}
                transition={cardTransition(index)}
              >
                <header className="svc-head">
                  <span className="svc-num">0{index + 1}</span>
                  <h3 className="svc-name">{service.name}</h3>
                  <p className="svc-kicker">{service.kicker}</p>
                </header>
                <div className="svc-body">
                  {service.lead ? <p className="svc-lead">{service.lead}</p> : null}
                  <ul className="svc-list">
                    {service.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {service.more ? (
                    <ul className="svc-list svc-list-more">
                      {service.more.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {service.closing || service.note ? (
                  <div className="svc-foot">
                    {service.closing ? <p className="svc-closing">{service.closing}</p> : null}
                    {service.note ? <span className="svc-note">{service.note}</span> : null}
                  </div>
                ) : null}
              </motion.article>
            ))}
          </div>
          <div className="svc-cta">
            <a href={CTA_LINK} className="btn">
              Agenda una llamada
            </a>
          </div>
        </Reveal>
      </section>

      <section className="sec" id="nosotros">
        <Reveal className="about">
          <span className="ey">Sobre nosotros</span>
          <div className="about-grid">
            <div className="about-photo">
              <img
                src={miguelHeadshot}
                alt="Miguel Carmona"
                width="440"
                height="440"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="carta">
              <p>
                No era un gran estudiante, hablaba mucho con mis compañeros y me costaba estar sentado 6 horas en
                esos fríos pupitres verdes. Aun así... arrasaba en mates. Así que eso fue lo que estudié. Después de
                varios años de trabajo en una agencia de medios me di cuenta de que la empresa es muy distinta al
                instituto. Ser social. Ser (pro)activo. Ser enérgico. Ser colaborador. Es positivo. Muy positivo.
                Estoy seguro de que existe algún estudio estadístico que confirma la mejora en el rendimiento de los
                equipos cuando existe esta camaradería. No lo he visto, pero estoy seguro. Hay estudios de
                absolutamente todo. ¿Por qué no de esto?
              </p>
              <p>
                Cierto día, después de presentar un análisis para cierta empresa de telefonía cuyo logo es rojo, me
                detuve. Paré en el arcén a mirar el mapa que tenía preparado, inocentemente, para mi vida. Las paradas
                que quería hacer y que, por supuesto, estaban siendo olvidadas en un oscuro altillo de un desván a la
                penumbra con alguna repugnante araña ocasional como única compañía. Ese día las rescaté. Les quité las
                telarañas y observé que había una de esas paradas que estaba solamente a un desvío. Un desvío que, si
                no cogía pronto, me habría saltado la salida. No lo dudé durante mucho tiempo. Porque no decidir es
                una decisión en sí misma.
              </p>
              <p>Así que dejé mi vida y me fui a vivir al extranjero.</p>
              <p className="carta-beats">
                <span>Pasé por dos etapas.</span>
                <span>Dos experiencias.</span>
                <span>Dos países.</span>
                <span>Australia e Indonesia.</span>
              </p>
              <p>Ambas igual de enriquecedoras.</p>
              <p>
                Especialmente, cuando me encontraba en la exótica Indonesia, entre coco y coco, entablé amistades con
                fundadores de grandes empresas que me inspiraron enormemente. A mejorar. A crecer. A atreverte a dar
                pasos que pueden tener cierto riesgo, pero donde detrás se esconde un gran beneficio.
              </p>
              <p className="carta-close">
                Y ese es mi trabajo, que sepas dónde merece la pena dar el próximo paso.
              </p>
              <div className="firma">
                <div>
                  <p className="fnm">Miguel Carmona</p>
                  <p className="frl">Fundador, Velz</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="cta">
        <Reveal className="cta-shell">
          <p className="cta-copy">
            Dado que queremos dar un trato especializado, solo aceptamos un máximo de 6 clientes por trimestre,
            dependiendo del tamaño de la cuenta. Si estás interesado, solo tienes que rellenar el siguiente
            formulario. Si hay algún punto que te preocupa en particular, te invito a que nos lo compartas en el
            mensaje.
          </p>
          <form id="lead-form" className="lead-form" onSubmit={handleFormspreeSubmit}>
            <label className="lead-field">
              Nombre
              <input type="text" name="name" autoComplete="name" required />
              <ValidationError className="lead-error" field="name" errors={formState.errors} />
            </label>
            <label className="lead-field">
              Email (corporativo)
              <input type="email" name="email" autoComplete="email" required />
              <ValidationError className="lead-error" field="email" errors={formState.errors} />
            </label>
            <label className="lead-field">
              Web de tu empresa
              <input type="url" name="website" placeholder="https://tu-empresa.com" required />
              <ValidationError className="lead-error" field="website" errors={formState.errors} />
            </label>
            <label className="lead-field">
              Mensaje (opcional)
              <textarea name="message" rows={4} />
              <ValidationError className="lead-error" field="message" errors={formState.errors} />
            </label>
            <button type="submit" className="lead-submit" disabled={formState.submitting}>
              {formState.submitting ? "Enviando..." : "Agenda una llamada"}
            </button>
            <p className="lead-gdpr">
              Solo usaré estos datos para responderte y agendar la llamada. Sin listas, sin spam. Consulta la{" "}
              <a href={PRIVACY_LINK}>política de privacidad</a>.
            </p>
            <ValidationError className="lead-error" errors={formState.errors} />
            {formState.succeeded ? (
              <p className="lead-status success">Solicitud enviada. Te escribiré por email para agendar la llamada.</p>
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
