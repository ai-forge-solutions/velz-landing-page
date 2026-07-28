const FIXTURE_STATUSES = new Map([
  ["test-ready-token", "ready"],
  ["test-not-ready-token", "not_ready"],
]);

const VALID_STATUSES = new Set(["ready", "degraded", "not_ready"]);

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

function getFixtureStatus(token) {
  if (FIXTURE_STATUSES.has(token)) {
    return FIXTURE_STATUSES.get(token);
  }

  return "not_ready";
}

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "method_not_allowed" });
  }

  const token = getToken(event).trim();

  if (!token) {
    return json(400, { error: "missing_token" });
  }

  const status = getFixtureStatus(token);

  if (!VALID_STATUSES.has(status)) {
    return json(500, { error: "invalid_fixture_status" });
  }

  return json(200, {
    status,
    tool_slug: null,
    token_suffix: token.slice(-6),
    generated_at: null,
    payload: null,
    fixture: true,
  });
}
