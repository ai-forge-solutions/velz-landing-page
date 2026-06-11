import * as ReactRuntime from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import velzSymbolSvg from "../assets/velz-symbol.svg?raw";

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
const CTA_LINK = "mailto:hola@velz.ai?subject=Auditoria%20gratuita%20de%2024h";
const EMAIL_LINK = "mailto:hola@velz.ai";
const LEGAL_LINK = "/aviso-legal";
const PRIVACY_LINK = "/privacidad";

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

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [dsReady, setDsReady] = useState(false);
  const reduceMotion = useReducedMotion();

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
  const DsButton = ds.Button;
  const DsLogo = ds.Logo;

  const cardTransition = (index) => ({
    duration: 0.45,
    delay: index * 0.08,
    ease: [0.22, 1, 0.36, 1],
  });

  return (
    <>
      <nav>
        <span className="wm">velz</span>
        <a href="#cta" className="nav-a">
          Solicitar auditoría →
        </a>
      </nav>

      <section id="hero">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <BrandSymbol className="h-sym" width={72} />
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
            href="#cta"
            className="btn"
            whileHover={reduceMotion ? {} : { y: -1.5, scale: 1.01 }}
            whileTap={reduceMotion ? {} : { scale: 0.99 }}
            transition={{ duration: 0.18 }}
          >
            Auditoría gratuita de 24h
          </motion.a>
          <p className="micro hero-micro">Entregable concreto. Sin llamada de venta previa.</p>
        </motion.div>
      </section>

      <section className="sec" id="problema">
        <Reveal className="wrap">
          <span className="ey">El problema</span>
          <div className="cards">
            {cardsProblema.map((card, index) => (
              <motion.div
                key={card.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
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
          <div className="cards">
            {cardsVs.map((card, index) => (
              <motion.div
                key={card.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
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
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
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
                    initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                    whileInView={reduceMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
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
                    initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                    whileInView={reduceMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
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
            <div className="fph">M</div>
            <div>
              <p className="fnm">Miguel Carmona</p>
              <p className="frl">Fundador, Velz · Ex–Senior Data Scientist, Dentsu (2022–2025)</p>
            </div>
          </div>
          <div className="brands">
            <div className="brow">
              <span className="bn">Vodafone</span>
              <span className="bn">Gillette</span>
            </div>
            <p className="bnote">
              Marcas para las que desarrollé modelos durante mi etapa en Dentsu. No son clientes de Velz.
            </p>
          </div>
        </Reveal>
      </section>

      <section id="cta">
        <Reveal>
          <BrandSymbol className="cta-sym" width={48} />
          <h2>
            Empieza por ver tu negocio
            <br />
            desde arriba.
          </h2>
          {DsButton ? (
            <DsButton variant="primary" size="md" onClick={() => window.location.assign(CTA_LINK)}>
              Auditoría gratuita de 24h
            </DsButton>
          ) : (
            <motion.a
              href={CTA_LINK}
              className="btn"
              whileHover={reduceMotion ? {} : { y: -1.5, scale: 1.01 }}
              whileTap={reduceMotion ? {} : { scale: 0.99 }}
              transition={{ duration: 0.18 }}
            >
              Auditoría gratuita de 24h
            </motion.a>
          )}
          <span className="cta-mc">
            <span className="tag">por definir</span> plazas al mes. Recibes un diagnóstico con decisiones
            concretas para tu marca, te quedes o no.
          </span>
        </Reveal>
      </section>

      <footer>
        {DsLogo ? <DsLogo size={20} className="footer-logo" /> : <span className="wm footer-wm">velz</span>}
        <div className="fr">
          <a href={EMAIL_LINK} className="fe">
            hola@velz.ai
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
