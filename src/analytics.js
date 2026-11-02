// GA4 with Google Consent Mode v2 (basic mode): gtag.js only loads after the
// visitor accepts. Shared by the SPA and the static guide documents, so it has
// no React dependency and injects its own banner styles from the Velz tokens.
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const CONSENT_KEY = "velz_consent_v1";
const AI_SESSION_KEY = "velz_ai_referral_sent";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 395; // ~13 months

// Hosts and utm_source values used by AI assistants and answer engines.
const AI_SOURCES = [
  ["chatgpt", /(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$|^openai$|^chatgpt(\.com)?$/],
  ["perplexity", /(^|\.)perplexity\.ai$|^perplexity(\.ai)?$/],
  ["gemini", /^gemini\.google\.com$|^bard\.google\.com$|^gemini$/],
  ["copilot", /^copilot\.microsoft\.com$|(^|\.)copilot\.cloud\.microsoft$|^copilot$/],
  ["claude", /(^|\.)claude\.ai$|^claude$/],
  ["deepseek", /(^|\.)deepseek\.com$/],
  ["meta_ai", /(^|\.)meta\.ai$/],
  ["grok", /(^|\.)grok\.com$/],
  ["mistral", /^chat\.mistral\.ai$/],
  ["you", /(^|\.)you\.com$/],
  ["poe", /(^|\.)poe\.com$/],
];

const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
const isPrerender = isBrowser && navigator.userAgent === "ReactSnap";
const enabled = Boolean(MEASUREMENT_ID) && isBrowser && !isPrerender;

let gtagLoaded = false;

function readConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function writeConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Without storage the banner simply reappears on the next page.
  }
}

function gtag() {
  window.dataLayer = window.dataLayer || [];
  // gtag.js requires the arguments object itself, not an array copy.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

// Private diagnostic tokens must never reach GA in page_location or page_referrer.
function sanitizeUrl(url) {
  const { origin, pathname, search } = url;
  const path = pathname.replace(/^(\/tools\/[^/]+\/)[^/]+\/?$/, "$1[token]");
  return `${origin}${path}${path === pathname ? search : ""}`;
}

function sanitizedReferrer() {
  try {
    const referrer = new URL(document.referrer);
    return referrer.origin === window.location.origin ? sanitizeUrl(referrer) : document.referrer;
  } catch {
    return undefined;
  }
}

function contentGroup(pathname = window.location.pathname) {
  if (pathname === "/") return "landing";
  if (pathname === "/guias" || pathname === "/guias/") return "guides_index";
  if (pathname.startsWith("/guias/")) return "guide";
  if (/^\/tools\/[^/]+\/[^/]+\/?$/.test(pathname)) return "lead_magnet";
  if (pathname.startsWith("/tools/")) return "tool";
  if (pathname === "/aviso-legal" || pathname === "/privacidad") return "legal";
  return "other";
}

function detectAiSource() {
  const params = new URLSearchParams(window.location.search);
  const candidates = [params.get("utm_source")];
  try {
    if (document.referrer) candidates.push(new URL(document.referrer).hostname);
  } catch {
    // Malformed referrer: ignore.
  }
  for (const candidate of candidates) {
    if (!candidate) continue;
    const value = candidate.toLowerCase();
    const match = AI_SOURCES.find(([, pattern]) => pattern.test(value));
    if (match) return { ai_source: match[0], ai_referrer: value };
  }
  return null;
}

function loadGtag() {
  gtag("consent", "update", { analytics_storage: "granted" });
  if (gtagLoaded) {
    // Re-accepting after a withdrawal on the same page.
    window[`ga-disable-${MEASUREMENT_ID}`] = false;
    return;
  }
  gtagLoaded = true;

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, {
    page_location: sanitizeUrl(window.location),
    page_referrer: sanitizedReferrer(),
    content_group: contentGroup(),
    cookie_expires: COOKIE_MAX_AGE_SECONDS,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  const aiReferral = detectAiSource();
  let alreadySent = false;
  try {
    alreadySent = window.sessionStorage.getItem(AI_SESSION_KEY) === "1";
  } catch {
    // Without sessionStorage, send at most once per page load.
  }
  if (aiReferral && !alreadySent) {
    gtag("event", "ai_referral", { ...aiReferral, content_group: contentGroup() });
    try {
      window.sessionStorage.setItem(AI_SESSION_KEY, "1");
    } catch {
      // Best effort.
    }
  }
  startWebVitals();
  startGuideReadingDepth();
}

// Field Core Web Vitals; web-vitals reads buffered entries, so loading it after
// consent still captures the page load.
function startWebVitals() {
  import("web-vitals")
    .then(({ onCLS, onINP, onLCP }) => {
      const send = (metric) =>
        track(metric.name, {
          value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
          metric_id: metric.id,
          metric_value: metric.value,
          metric_delta: metric.delta,
          metric_rating: metric.rating,
          non_interaction: true,
        });
      onCLS(send);
      onINP(send);
      onLCP(send);
    })
    .catch(() => {
      // Best effort.
    });
}

// Reading depth through the guide body, not the whole page (footer, references).
function startGuideReadingDepth() {
  const article = document.querySelector("main article");
  if (contentGroup() !== "guide" || !article) return;

  const milestones = [25, 50, 75, 100];
  let ticking = false;
  const check = () => {
    ticking = false;
    const rect = article.getBoundingClientRect();
    const read = ((window.innerHeight - rect.top) / rect.height) * 100;
    while (milestones.length && read >= milestones[0]) {
      track("guide_read_progress", { percent_read: milestones.shift() });
    }
    if (!milestones.length) window.removeEventListener("scroll", onScroll);
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(check);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  check();
}

function clearGaCookies() {
  const domains = ["", window.location.hostname, `.${window.location.hostname.replace(/^www\./, "")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^_ga(_|$)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/** Sends a GA4 event when analytics consent was granted; otherwise a no-op. */
export function track(eventName, params = {}) {
  if (!enabled || !gtagLoaded) return;
  gtag("event", eventName, { content_group: contentGroup(), ...params });
}

const BANNER_ID = "velz-consent";

const BANNER_STYLES = `
#${BANNER_ID} { position: fixed; z-index: 1000; left: 16px; right: 16px; bottom: 16px; max-width: 520px; margin-left: auto; padding: 20px 24px; background: var(--white, #fff); color: var(--ink-700, #2e2e2e); border: 1px solid var(--ink-150, #e6e6e4); border-radius: var(--radius-md, 10px); box-shadow: var(--shadow-md, 0 6px 20px rgba(15,15,15,.07)); font-family: var(--sans, system-ui, sans-serif); font-size: 15px; line-height: 1.5; }
#${BANNER_ID} p { margin: 0 0 16px; }
#${BANNER_ID} a { color: inherit; text-underline-offset: .2em; }
#${BANNER_ID} .velz-consent-actions { display: flex; gap: 12px; flex-wrap: wrap; }
#${BANNER_ID} button { flex: 1 1 140px; min-height: 44px; padding: 10px 16px; border-radius: var(--radius-sm, 6px); font: inherit; font-weight: 500; cursor: pointer; border: 1px solid var(--ink-900, #0f0f0f); background: var(--white, #fff); color: var(--ink-900, #0f0f0f); }
#${BANNER_ID} button:hover { background: var(--ink-50, #f7f7f5); }
#${BANNER_ID} button:focus-visible { outline: 3px solid var(--green-500, #1a8f54); outline-offset: 2px; }
@media print { #${BANNER_ID} { display: none; } }
`;

function closeBanner() {
  document.getElementById(BANNER_ID)?.remove();
}

function showBanner() {
  if (document.getElementById(BANNER_ID)) return;

  if (!document.getElementById(`${BANNER_ID}-styles`)) {
    const style = document.createElement("style");
    style.id = `${BANNER_ID}-styles`;
    style.textContent = BANNER_STYLES;
    document.head.appendChild(style);
  }

  const banner = document.createElement("section");
  banner.id = BANNER_ID;
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Preferencias de cookies");
  banner.innerHTML = `
    <p>Uso Google Analytics para saber qué páginas y guías resultan útiles. Solo se activa si aceptas. Más detalle en la <a href="/privacidad">política de privacidad</a>.</p>
    <div class="velz-consent-actions">
      <button type="button" data-consent="denied">Rechazar</button>
      <button type="button" data-consent="granted">Aceptar</button>
    </div>
  `;
  banner.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-consent]")?.dataset.consent;
    if (!choice) return;
    writeConsent(choice);
    closeBanner();
    if (choice === "granted") {
      loadGtag();
    } else if (gtagLoaded) {
      // Withdrawal: stop collection now and drop existing GA cookies.
      gtag("consent", "update", { analytics_storage: "denied" });
      window[`ga-disable-${MEASUREMENT_ID}`] = true;
      clearGaCookies();
    }
  });
  document.body.appendChild(banner);
}

function linkLocation(link) {
  return link.dataset.ctaLocation || link.closest("[id]")?.id || link.closest("nav, header, footer, main")?.tagName.toLowerCase() || "page";
}

function onDocumentClick(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  if (target.closest("[data-cookie-settings]")) {
    event.preventDefault();
    showBanner();
    return;
  }

  const link = target.closest("a[href]");
  if (!link) return;
  const href = link.getAttribute("href");
  const text = link.textContent.trim().replace(/\s+/g, " ").slice(0, 100);

  if (href === "#cta" || href === "/#cta") {
    track("cta_click", { cta_text: text, cta_location: linkLocation(link) });
  } else if (href.startsWith("mailto:")) {
    track("contact_email_click", { cta_location: linkLocation(link) });
  }
}

function init() {
  if (!enabled) return;

  window.dataLayer = window.dataLayer || [];
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });

  document.addEventListener("click", onDocumentClick);

  const consent = readConsent();
  if (consent === "granted") loadGtag();
  else if (consent !== "denied") showBanner();
}

if (isBrowser && document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else if (isBrowser) {
  init();
}
