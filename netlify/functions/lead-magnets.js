const FIXTURE_PAYLOADS = new Map([
  [
    "test-ready-token",
    {
      status: "ready",
      tool_key: "stockout_leak_score",
      tool_slug: "stockout-leak-score",
      token_suffix: "-token",
      generated_at: "2026-07-28T00:00:00.000Z",
      brand: {
        name: "Tanline",
        domain: "tanline.example",
      },
      headline: "Tu curva de tallas tiene una fuga visible de conversión.",
      intro:
        "Detectamos productos con demanda potencial donde parte de la curva aparece agotada. Es una señal externa, no inventario interno.",
      summary_blocks: [
        {
          title: "Dónde se ve el problema",
          body: "Hay productos con variantes agotadas mientras el resto del catálogo sigue disponible.",
          claim_safety: "hard_fact",
        },
        {
          title: "Qué decisión desbloquea",
          body: "Priorizar reposición o pausar campañas hacia productos donde la talla clave no está disponible.",
          claim_safety: "proxy",
        },
      ],
      evidence: [
        {
          label: "Fuente",
          value: "Snapshot público de catálogo Shopify",
          source_ref: "shopify_catalog_scrapes.fixture",
        },
        {
          label: "Seguridad del claim",
          value: "Solo disponibilidad pública; no estima unidades internas.",
          source_ref: "claim_safety.fixture",
        },
      ],
      limitations: [
        "La disponibilidad pública no prueba stock interno exacto.",
        "No se ejecuta scraping en tiempo real al abrir esta página.",
      ],
      cta: {
        label: "Ver la hipótesis completa con Velz",
        href: "mailto:miguel@velz.io?subject=Quiero%20ver%20mi%20diagnóstico%20Velz",
      },
      fixture: true,
    },
  ],
  [
    "test-degraded-token",
    {
      status: "degraded",
      tool_key: "discount_depth_analyzer",
      tool_slug: "discount-depth-analyzer",
      token_suffix: "-token",
      generated_at: "2026-07-28T00:00:00.000Z",
      brand: {
        name: "Demo Brand",
        domain: "demo.example",
      },
      headline: "Hay una señal útil, pero faltan fuentes para cerrar el diagnóstico.",
      intro:
        "Mostramos solo los bloques soportados y omitimos cualquier conclusión que necesite una fuente pendiente.",
      summary_blocks: [
        {
          title: "Disponible ahora",
          body: "El catálogo público permite ver descuentos visibles y productos disponibles.",
          claim_safety: "hard_fact",
        },
      ],
      evidence: [
        {
          label: "Fuente disponible",
          value: "Catálogo público",
          source_ref: "shopify_catalog_scrapes.fixture",
        },
      ],
      limitations: [
        "Falta una fuente opcional para cuantificar la señal completa.",
        "Se han ocultado claims no soportados.",
      ],
      cta: {
        label: "Responder al email con contexto",
        href: "mailto:miguel@velz.io?subject=Contexto%20sobre%20mi%20diagnóstico%20Velz",
      },
      fixture: true,
    },
  ],
  [
    "test-not-ready-token",
    {
      status: "not_ready",
      tool_key: "stockout_leak_score",
      tool_slug: "stockout-leak-score",
      token_suffix: "-token",
      generated_at: null,
      brand: {
        name: "Tu marca",
        domain: null,
      },
      headline: "Tu diagnóstico todavía no está listo.",
      intro:
        "El enlace es válido, pero aún no hay un payload público seguro para enseñar. No mostramos errores internos ni datos sensibles.",
      summary_blocks: [],
      evidence: [],
      limitations: ["Estamos preparando las fuentes necesarias antes de enseñar cualquier conclusión."],
      cta: {
        label: "Responder al email de Velz",
        href: "mailto:miguel@velz.io?subject=Mi%20diagnóstico%20Velz%20aún%20no%20está%20listo",
      },
      fixture: true,
    },
  ],
]);

const VALID_STATUSES = new Set(["ready", "degraded", "not_ready"]);
const VALID_EVENTS = new Set(["viewed", "clicked"]);

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function getToken(event) {
  if (event.queryStringParameters?.token) {
    return event.queryStringParameters.token;
  }

  const pathMatch = event.path?.match(/\/api\/lead-magnets\/([^/?#]+)/);
  return pathMatch ? decodeURIComponent(pathMatch[1]) : "";
}

function isEventRequest(event) {
  return event.path?.includes("/events") || event.queryStringParameters?.event === "1";
}

function getPayload(token) {
  if (FIXTURE_PAYLOADS.has(token)) {
    return FIXTURE_PAYLOADS.get(token);
  }

  return {
    ...FIXTURE_PAYLOADS.get("test-not-ready-token"),
    token_suffix: token.slice(-6),
    fixture: true,
  };
}

async function readJsonBody(event) {
  if (!event.body) {
    return {};
  }

  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
}

export async function handler(event) {
  const token = getToken(event).trim();

  if (!token) {
    return json(400, { error: "missing_token" });
  }

  if (isEventRequest(event)) {
    if (event.httpMethod !== "POST") {
      return json(405, { error: "method_not_allowed" });
    }

    const body = await readJsonBody(event);
    const eventType = body.event_type || body.eventType;

    if (!VALID_EVENTS.has(eventType)) {
      return json(400, { error: "invalid_event_type" });
    }

    return json(202, {
      accepted: true,
      event_type: eventType,
      token_suffix: token.slice(-6),
      persisted: false,
      fixture: true,
    });
  }

  if (event.httpMethod !== "GET") {
    return json(405, { error: "method_not_allowed" });
  }

  const payload = getPayload(token);

  if (!VALID_STATUSES.has(payload.status)) {
    return json(500, { error: "invalid_fixture_status" });
  }

  return json(200, payload);
}
