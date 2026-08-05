---
name: velz-brand
description: "Apply Velz landing-page look & feel to visible UI, lead magnets, public pages, copy, and frontend components. Mandatory for Velz UI/copy work; overrides generic design skills when brand tokens, tone, layout, or claim-safety conflict."
---

# Velz Brand / Look & Feel

Use this repo-local skill before changing any visible UI, lead-magnet page, public landing copy, CTA, component styling, or marketing section in `velz-landing-page`.

This skill is the local Velz look-and-feel source of truth derived from the current repo files:

- `styles.css` — global design-system entry point and font imports.
- `tokens/colors.css` — canonical color tokens.
- `tokens/typography.css` — canonical font families and text-size aliases.
- `tokens/spacing.css` and `tokens/elevation.css` — spacing/elevation tokens.
- `src/styles.css` — production component/page styling.
- `landing-v2-contraste.html` — preserved original HTML reference.
- `assets/velz-symbol*.svg` — canonical symbol assets.

## Brand essence

Velz should feel like a sharp, founder-led ecommerce operations intelligence product: editorial, restrained, specific, and credible. It should not feel like a generic AI SaaS template.

Core signals:

- Dark editorial hero with precise green accent.
- Serif display headlines, neutral sans body, mono eyebrow/meta labels.
- Quiet confidence over hype.
- Operational specificity over generic growth language.
- Claim-safe language: public signals, proxies, caveats, and source-backed observations.

## Design tokens

Use existing CSS variables. Do not introduce ad-hoc brand colors or random Tailwind palettes unless the token set is intentionally extended.

### Colors

Canonical tokens live in `tokens/colors.css`:

| Purpose | Token | Value |
|---|---|---|
| Main dark ink | `--ink-900` / `--text-primary` | `#0f0f0f` |
| Strong text | `--ink-800` / `--text-strong` | `#1c1c1c` |
| Body text | `--ink-700` / `--text-body` | `#2e2e2e` |
| Muted text | `--ink-500` / `--text-muted` | `#6b6b6b` |
| Paper surface | `--ink-50` / `--surface-50` | `#f7f7f5` |
| White surface | `--white` / `--surface-0` | `#ffffff` |
| Border subtle | `--ink-150` / `--border-subtle` | `#e6e6e4` |
| Brand green | `--g500` / `--brand-500` | `#1a8f54` |
| Brand green hover | `--g600` / `--brand-600` | `#14723f` |
| Brand green light | `--g300` / `--brand-300` | `#79d3a3` |

Avoid purple/blue AI gradients, rainbow palettes, neon accents, or unrelated brand colors.

### Typography

Canonical tokens live in `tokens/typography.css` and `styles.css`:

- Display/headlines: `var(--serif)` / `Newsreader`, Georgia, serif.
- Body/UI: `var(--sans)` / `Hanken Grotesk`, system-ui, sans-serif.
- Labels/meta/code: `var(--mono)` / `IBM Plex Mono`, ui-monospace, monospace.

Use large, calm serif headlines with tight tracking for hero-level messaging. Use mono only for small eyebrow labels, metrics, source labels, or technical metadata.

## Layout patterns

Prefer existing classes and patterns in `src/styles.css`:

- Dark top bar/nav/hero using `--ink-900`.
- Centered hero shell around `760px` max width for the main landing promise.
- Wider content grids around `1056px` max width.
- Generous section padding around `108px` desktop, responsive reductions on mobile.
- Cards with subtle borders, low shadows, and `10px` radius; buttons around `6px` radius, not pill-shaped.
- Minimal motion; use Framer Motion/CSS transitions sparingly to support hierarchy, not decoration.

## Copy/tone rules

Velz copy should be specific, plain, and source-aware.

Prefer:

- “Señales públicas de catálogo…”
- “Observado en el snapshot público de Shopify…”
- “Podría indicar…” / “proxy de…” when interpreting.
- “Diagnóstico operativo” / “riesgo visible desde fuera” / “ventana de decisión”.
- Concrete ecommerce operations language: stock, paid search, descuentos, variantes, caja, margen, timing, catálogo.

Avoid:

- “AI-powered”, “unlock growth”, “revolutionary”, “next-gen”, “10x”, or vague hype.
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

This skill overrides generic imported skills such as `frontend-design`, `landing-page-design`, and `premium-landing-designer` for Velz-specific visual identity, tone, claim safety, and token usage.

Generic skills are additive for structure, conversion, polish, and performance only when they do not conflict with Velz tokens/copy/claim-safety rules.

## Verification checklist

Before finishing UI/copy work:

- [ ] Read this skill and checked `tokens/*.css` / `src/styles.css` for existing patterns.
- [ ] Used Velz tokens instead of ad-hoc colors/fonts.
- [ ] Preserved Velz symbol usage and editorial dark/green identity where applicable.
- [ ] Mobile layout is readable and primary CTA/diagnosis is visible.
- [ ] Copy is specific, founder-led, and claim-safe.
- [ ] No trujas/TURNO/barber branding, copy, colors, or product assumptions appear.
