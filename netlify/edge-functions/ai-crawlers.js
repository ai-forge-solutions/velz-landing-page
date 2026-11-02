// Logs requests from AI and search crawlers to Supabase (public.crawler_hits).
// GA4 never sees these bots because they don't run JavaScript. Identification is
// by user agent only; humans pass straight through untouched.

// [pattern, bot, operator, purpose]. Purposes: training, search, user_request
// (fetched live to answer someone's prompt) and search_engine.
const BOTS = [
  [/OAI-SearchBot/i, "OAI-SearchBot", "OpenAI", "search"],
  [/ChatGPT-User/i, "ChatGPT-User", "OpenAI", "user_request"],
  [/GPTBot/i, "GPTBot", "OpenAI", "training"],
  [/Perplexity-User/i, "Perplexity-User", "Perplexity", "user_request"],
  [/PerplexityBot/i, "PerplexityBot", "Perplexity", "search"],
  [/Claude-SearchBot/i, "Claude-SearchBot", "Anthropic", "search"],
  [/Claude-User/i, "Claude-User", "Anthropic", "user_request"],
  [/ClaudeBot/i, "ClaudeBot", "Anthropic", "training"],
  [/MistralAI-User/i, "MistralAI-User", "Mistral", "user_request"],
  [/DuckAssistBot/i, "DuckAssistBot", "DuckDuckGo", "user_request"],
  [/meta-externalfetcher/i, "Meta-ExternalFetcher", "Meta", "user_request"],
  [/meta-externalagent/i, "Meta-ExternalAgent", "Meta", "training"],
  [/Amazonbot/i, "Amazonbot", "Amazon", "search"],
  [/Applebot/i, "Applebot", "Apple", "search"],
  [/YouBot/i, "YouBot", "You.com", "search"],
  [/Bytespider/i, "Bytespider", "ByteDance", "training"],
  [/CCBot/i, "CCBot", "Common Crawl", "training"],
  [/cohere-ai/i, "cohere-ai", "Cohere", "training"],
  [/Googlebot/i, "Googlebot", "Google", "search_engine"],
  [/bingbot/i, "Bingbot", "Microsoft", "search_engine"],
];

async function record(hit) {
  const url = Netlify.env.get("SUPABASE_URL");
  const key = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return;

  try {
    await fetch(`${url.replace(/\/$/, "")}/rest/v1/crawler_hits`, {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "return=minimal",
      },
      body: JSON.stringify(hit),
    });
  } catch {
    // Logging is best effort and must never affect the response.
  }
}

export default async (request, context) => {
  const userAgent = request.headers.get("user-agent") || "";
  const match = BOTS.find(([pattern]) => pattern.test(userAgent));
  if (!match || !["GET", "HEAD"].includes(request.method)) return;

  const response = await context.next();
  const [, bot, operator, purpose] = match;
  // Private diagnostic tokens never leave the request.
  const path = new URL(request.url).pathname.replace(/^(\/tools\/[^/]+\/)[^/]+\/?$/, "$1[token]");

  const pending = record({
    bot,
    bot_operator: operator,
    bot_purpose: purpose,
    path,
    status: response.status,
    country: context.geo?.country?.code || null,
    user_agent: userAgent.slice(0, 500),
  });
  if (typeof context.waitUntil === "function") context.waitUntil(pending);
  else await pending;

  return response;
};

export const config = {
  path: "/*",
  excludedPath: ["/assets/*", "/og/*", "/api/*", "/*.png", "/*.svg", "/*.ico", "/*.webmanifest", "/*.css", "/*.js"],
  onError: "bypass",
};
