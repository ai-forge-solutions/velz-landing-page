---
name: velz-brand
description: "Apply Velz landing-page look & feel to visible UI, lead magnets, public pages, copy, and frontend components. Mandatory for Velz UI/copy work; overrides generic design skills when brand tokens, tone, layout, or claim-safety conflict."
---

# Velz Brand / Look & Feel

Use this repo-local skill before changing any visible UI, lead-magnet page, public landing copy, CTA, component styling, or marketing section in `velz-landing-page`.

This skill is the local Velz look-and-feel source of truth. It incorporates the supplied `Velz Design System.zip`, but uses this repo's single repo-local skill loading convention: agents read `.github/skills/<skill>/SKILL.md` plus any linked `references/` files. Do not install a second Claude-Code-style brand skill elsewhere.

Read these files when doing substantial design/copy work:

- `references/design-system.md` — complete Velz brand/design-system guide from the supplied kit.
- `references/integration.md` — portable kit installation notes, adapted here into repo-local tokens and skill references.
- `tokens/colors.css` — canonical color tokens plus compatibility aliases used by the current landing.
- `tokens/typography.css` — canonical font families, type scale, and compatibility aliases.
- `tokens/spacing.css` and `tokens/elevation.css` — spacing/elevation/motion tokens.
- `styles.css` — global design-system entry point and font imports.
- `src/styles.css` — production component/page styling.
- `landing-v2-contraste.html` — preserved original HTML reference.
- `assets/velz-symbol*.svg` — canonical symbol assets.

## Brand essence

Velz should feel like a sharp, founder-led ecommerce operations intelligence product: editorial, restrained, specific, and credible. It should not feel like a generic AI SaaS template.

The brand is not “a data tool”; it is the **moment of clarity** where attribution, inventory, and cashflow converge into one operational decision.

Core signals:

- 90% black & white; green only when something requires action.
- Dark editorial hero with precise green accent.
- Serif display headlines, neutral sans body, mono eyebrow/meta labels.
- Quiet confidence over hype.
- Operational specificity over generic growth language.
- Short, decisive copy: lead with the decision, not the data.
- Claim-safe language: public signals, proxies, caveats, and source-backed observations.

Brand naming/casing:

- Wordmark/name in UI copy is lowercase `velz` unless grammar/context requires sentence-start capitalization.
- Sentence case by default. Avoid Title Case and ALL CAPS except very small tracked UI labels used sparingly.
- No emoji in product, decks, lead magnets, or marketing copy.

## Design tokens

Use existing CSS variables. Do not introduce ad-hoc brand colors or random Tailwind palettes unless the token set is intentionally extended.

### Colors

Canonical tokens live in `tokens/colors.css`:

| Purpose | Token | Value |
|---|---|---|
| Main dark ink | `--ink-900` / `--velz-ink` / `--text-primary` | `#0f0f0f` |
| Body text | `--ink-700` | `#2e2e2e` |
| Muted text | `--ink-500` / `--text-secondary` | `#6b6b6b` |
| Paper surface | `--ink-50` / `--surface-sunken` | `#f7f7f5` |
| White surface | `--white` / `--velz-paper` / `--surface-page` | `#ffffff` |
| Border subtle | `--ink-150` / `--border-hairline` | `#e6e6e4` |
| Signal green | `--green-500` / `--g500` | `#1a8f54` |
| Green hover/pressed | `--green-600` / `--g600` | `#14723f` |
| Green on dark | `--green-400` / `--g400` | `#2fb36b` |

Green rules:

- Use green for actionable data, CTAs, primary chart lines, and decision points.
- Do not use green for the symbol/wordmark, large decorative fills, backgrounds under running body copy, or random decoration.
- Use functional data-state colors only for charts/alerts: positive, negative, warning, neutral.

Avoid purple/blue AI gradients, rainbow palettes, neon accents, or unrelated brand colors.

### Typography

Canonical tokens live in `tokens/typography.css` and `styles.css`:

- Display/headlines: `var(--serif)` / `Newsreader`, Georgia, serif.
- Body/UI: `var(--sans)` / `Hanken Grotesk`, system-ui, sans-serif.
- Labels/meta/code: `var(--mono)` / `IBM Plex Mono`, ui-monospace, monospace.

Use large, calm serif headlines with tight tracking for hero-level messaging. Use mono only for small eyebrow labels, metrics, source labels, or technical metadata.

## Layout patterns

Prefer existing classes and patterns in `src/styles.css`:

- Dark top bar/nav/hero using `--ink-900` / `.velz-inverse` style semantics.
- Measured containers: prose around `68ch`, narrow around `720px`, wide around `1200px` where appropriate.
- Generous whitespace; section gaps around `--gap-section` / large desktop padding, with responsive reductions on mobile.
- Hairline dividers and rules over heavy boxes.
- Cards with subtle borders, low/optional shadows, and `10px` radius; buttons around `6px` radius, not pill-shaped.
- Symbol is horizon + meridian + point; always monochrome, never green, and never used as a generic list icon.
- Minimal motion; calm fades/short translates only. No bounce, overshoot, infinite decorative loops, glassmorphism, or scale-y hovers.

## Copy/tone rules

Velz copy should be specific, plain, and source-aware. It should sound calm, precise, accompanying: someone who knows the business and points to the one decision that matters.

Prefer:

- “Señales públicas de catálogo…”
- “Observado en el snapshot público de Shopify…”
- “Podría indicar…” / “proxy de…” when interpreting.
- “Diagnóstico operativo” / “riesgo visible desde fuera” / “ventana de decisión”.
- Concrete ecommerce operations language: stock, paid search, descuentos, variantes, caja, margen, timing, catálogo.
- Short decision-led lines: “Tres números cambiaron. Dos importan.” / “Place the reorder before Thursday.”

Avoid:

- “AI-powered”, “unlock growth”, “revolutionary”, “next-gen”, “10x”, or vague hype.
- Dense methodology walls; MMM/Bayesian/attribution terms are allowed only when they clarify a decision.
- Exact revenue, margin, demand, inventory quantity, or cashflow claims unless backed by source data.
- Any phrasing that implies access to private ad accounts, internal sales, internal stock quantity, or real cash position.

## Lead-magnet UI rules

For `/tools/:tool_slug/:token` pages and lead-magnet previews:

1. Keep the page deterministic from server payloads; do not run enrichment/scraping from the public request path.
2. Render `ready`, `degraded`, and `not_ready` states clearly and calmly.
3. Show caveats/source refs when claims are proxies or public observations.
4. Keep cards readable on mobile first; do not hide the primary diagnosis behind animation or dense charts.
5. Use charts/tables to clarify evidence, not to manufacture precision.

## Precedence

This skill overrides generic imported skills such as `frontend-design`, `landing-page-design`, and `premium-landing-designer` for Velz-specific visual identity, tone, claim safety, token usage, and production integration.

Generic skills are additive for structure, conversion, polish, and performance only when they do not conflict with Velz tokens/copy/claim-safety rules.

The supplied design kit's original `SKILL.md` is preserved as `references/claude-code-skill.md` for provenance only. In this repo, future workers must load Velz branding the same way as every other repo-local skill: read `.github/skills/velz-brand/SKILL.md` and then its `references/` files when needed.

## Verification checklist

Before finishing UI/copy work:

- [ ] Read this skill and checked `tokens/*.css` / `src/styles.css` for existing patterns.
- [ ] Used Velz tokens instead of ad-hoc colors/fonts.
- [ ] Preserved Velz symbol usage and editorial dark/green identity where applicable.
- [ ] Mobile layout is readable and primary CTA/diagnosis is visible.
- [ ] Copy is specific, founder-led, and claim-safe.
- [ ] No trujas/TURNO/barber branding, copy, colors, or product assumptions appear.
