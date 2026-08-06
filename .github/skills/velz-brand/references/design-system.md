# Velz — Design System

> *Del afrikáans: terreno abierto desde el que ves todo.*
> Velz helps small-to-mid ecommerce founders **see their business from above** — the moment attribution, inventory, and cashflow converge into a single decision.

**The brand is not a data tool. It is the moment of clarity.** The client doesn't pay for dashboards — they pay because someone told them exactly what to do. The design system exists to make that calm, editorial, decisive feeling tangible across every surface.

---

## 1. Company context

**Velz** is a boutique data & analytics agency for ecommerce brands in the **€300K–€5M** revenue band — a segment no integrated provider serves today. It connects three things nobody else links for brands this size:

> **Cross-channel attribution → Inventory forecasting → Cashflow projection.**

The value in one line: *"I tell you how much stock to order, when, and whether you have the cash to do it — based on how your marketing channels are actually performing."*

- **The real differentiator** is the flow, not the dashboard: MMM → demand forecast → PO recommendation. A founder doesn't pay for a good R² — they pay because they didn't run out of stock on Black Friday.
- **Methodology:** Bayesian MMM via PyMC-Marketing / Robyn. Clean digital data (Shopify, Meta, Google APIs). ~2 weeks setup vs. 2 months enterprise.
- **Delivery model:** auto-updated dashboard + automatic alerts ("SKU-3 has 11 days of stock at current pace") + a 45-minute bi-weekly meeting (3 numbers that changed, 1 budget recommendation, 1 inventory/cashflow decision). *The dashboard is what keeps the client from cancelling. The product is the decision.*
- **Pricing:** €500–800 setup, €1.5K–3.5K/month retainer. Continuous value, never a one-off deliverable.

### Products / surfaces this system dresses
1. **Velz dashboard** — the client-facing analytics product (attribution, inventory, cashflow, alerts). → `ui_kits/dashboard/`
2. **Brand & proposal slides** — editorial decks for pitches and bi-weekly reviews. → `slides/`
3. **Marketing / proposal web** — covered by the same tokens and components (no dedicated kit yet).

### Sources provided
- `uploads/logo-black-background.webp` — symbol on transparent (low-res raster). Copied to `assets/logo-symbol-original.webp`.
- `uploads/logo-whiteBackground.png` — symbol, black, baked checkerboard bg. Copied to `assets/logo-symbol-original-white.png`.
- **Brand Identity Decisions, June 2026, v1.0** — pasted brief (name, symbol, wordmark, palette, type, accent rules, principles). This README encodes it.
- No font binaries, no exact green hex, and no codebase/Figma were provided — see **Open questions** at the end.

---

## 2. Content fundamentals — how Velz writes

The voice is **calm, precise, and accompanying**. *No grita. No explica. Acompaña.* It sounds like someone who knows your business better than you do and tells you the one thing that matters.

- **Casing:** **Sentence case, always.** Never ALL CAPS, never Title Case. The only exception is small tracked UI eyebrow-labels (e.g. `INVENTORY`), used sparingly. The wordmark is **always lowercase** — `velz`.
- **Person:** Speaks to the founder as **"you" / "tú"** ("te digo cuánto stock pedir"). Velz refers to itself sparingly and never boasts. First-person is rare and quiet.
- **Brevity is the format.** The bi-weekly meeting is *3 numbers, 1 budget call, 1 inventory call.* Copy mirrors that: short declarative lines, one idea each. Cut every word that doesn't change a decision.
- **Lead with the decision, not the data.** ❌ "Your ROAS on Meta is 2.1." ✅ "Shift €800 from Meta to Google this week." Numbers support the instruction; they don't open it.
- **Actionable, specific, time-bound.** "SKU-3 has 11 days of stock at current pace." Concrete SKU, concrete number, concrete horizon.
- **No hype, no jargon walls.** MMM, attribution, Bayesian — used only when precise, never to impress. A founder reads it and knows what to do.
- **Emoji:** none. Not in product, not in decks, not in copy. The restraint *is* the brand.
- **Bilingual (ES/EN).** Primary working language is Spanish; the name and UI travel cleanly in English. Keep the same terse register in both.

**Example lines, in voice:**
- "You have cash for the reorder. Place it before Thursday."
- "Meta is carrying Google's conversions. Don't cut Google."
- "Three numbers changed this week. Two of them matter."

---

## 3. Visual foundations

The system is **90% black & white**. The green accent appears *only* when something requires action — and because it appears with restraint, it carries weight. *Cuanto menos se use, más señala.*

### Color
- **Black `#0f0f0f` (ink) and white `#ffffff`** are the brand. A cool-neutral gray ramp (`--ink-50…900`) handles hierarchy.
- **Signal green** (`--green-500 #1a8f54`, flagged — see open questions) is the single accent. Allowed: actionable data in reports, CTAs, primary lines in charts, title sections in documents. **Forbidden:** the symbol, the wordmark, large color fills/backgrounds, running body copy.
- A small **functional data-state palette** (positive green, negative `#c0473a`, warning `#c2882f`) exists strictly for data viz and inventory/cashflow alerts — not decorative, never brand color.
- Backgrounds are **white or a near-white paper `#f7f7f5`** (`--surface-sunken`). Dark sections use ink `#0f0f0f` via the `.velz-inverse` scope, where green brightens to `--green-400` to stay legible.

### Type
- **Display / titles:** Newsreader (serif) — for personality, impact, editorial moments. Mostly weight 400, occasionally 300 at large sizes.
- **Body / UI / wordmark:** Hanken Grotesk (neutral grotesque). Two weights for general use — **400 and 500 only.** Never heavy bold; it reads aggressive against the brand register.
- **Data / metrics:** IBM Plex Mono with tabular figures (`tnum`) so columns align.
- **The wordmark:** `velz`, lowercase, Hanken **Light 300**, tracking **0.18em**. In bold or medium it loses its character.

### Symbol
Horizon + meridian + intersection point. **Low horizon** (more space above the line than below). **Filled** point. **Always monochrome** — black on white, white on black — **never the accent green.** Three elements: the horizontal line (the terrain, the business), the vertical line (the axis of perspective / decision), the point (the founder, in that moment of clarity). Vectorized in `assets/velz-symbol.svg` (uses `currentColor` for inline tinting; `-black`/`-white` variants for `<img>`).

### Surfaces, borders, elevation
- **Cards** are white with a **1px hairline border (`--border-hairline #e6e6e4`)** and `--radius-md (10px)`. Shadow is *optional and soft* — most cards rely on the hairline alone. Elevation is reserved for what truly floats (menus `--shadow-md`, dialogs/toasts `--shadow-lg`).
- **Radii are modest and precise:** controls `6px`, cards `10px`, panels `14px`, pills/avatars/switches full. Nothing is bubbly.
- **Lines over boxes.** Hairline dividers and rules structure layouts more than filled containers — it echoes the meridian/horizon motif.
- **No gradients** as decoration. The only acceptable gradient is a functional protection gradient (e.g. legibility scrim over an image), never a colored brand gradient. Never bluish-purple anything.

### Motion & states
- **Motion accompanies, never announces.** Calm fades, short transl/​opacity eases. `--ease-out` (calm settle), durations `140–380ms`. **No bounce, no overshoot,** no infinite decorative loops.
- **Hover:** darken (green → `--green-600`) or a light `--surface-hover (#f7f7f5)` wash; subtle, no scale-up.
- **Press:** a further step darker. The brand is precise, so prefer **color shift over shrink**; if scale is used it is minimal (≥0.98).
- **Focus:** a green ring — `--shadow-focus` (3px, green at 28% alpha). Accessibility is never sacrificed to minimalism.
- **Transparency / blur:** used rarely — a faint scrim behind overlays. Not a glassmorphism brand.

### Layout
- Generous whitespace is the medium (`--gap-section: 96px`). Content sits in measured containers (`--container-wide 1200px`, prose `68ch`).
- Imagery, when present, is **restrained and un-tinted** — clean product or neutral editorial photography, no heavy filters, no warm/cool color grade. The brand color comes from ink, paper, and the single green — not from images.

---

## 4. Iconography

Velz has **no proprietary icon font**. The system uses **[Lucide](https://lucide.dev)** (`lucide@latest` via CDN) as the substitute icon set — its **thin, precise, geometric 2px-stroke line icons** match the hairline, line-driven character of the brand (and the meridian/horizon symbol itself). *This is a substitution — flagged; swap for a brand set if one is commissioned.*

Rules:
- **Line icons only**, stroke ~1.75–2px, default `--ink-600`; use `--ink-900` for emphasis, `--green-600` only when the icon marks an action.
- **No filled icons, no duotone, no emoji, no Unicode glyphs as icons.** The restraint matches the wordmark.
- Common product icons: `trending-up`, `trending-down`, `package`, `wallet`, `bell`, `arrow-right`, `arrow-up-right`, `circle-dot` (echoes the symbol), `chevron-right`.
- The **Velz symbol is not an icon** — never inline it in a list of UI icons. It is logo only.

---

## 5. Index / manifest

**Root**
- `styles.css` — global entry point (import list only); link this one file.
- `readme.md` — this guide.
- `SKILL.md` — portable Agent-Skill manifest.

**Tokens** (`tokens/`)
- `colors.css` — ink/neutral ramp, signal green, data-state palette, semantic aliases, `.velz-inverse` scope
- `typography.css` — font families, scale, weights, line heights, tracking
- `spacing.css` — 8px grid, semantic gaps, container widths, radii, control heights
- `elevation.css` — shadow scale, motion durations/easings, z-index scale

**Assets** (`assets/`)
- `velz-symbol.svg` (currentColor — inline for tinting) · `velz-symbol-black.svg` · `velz-symbol-white.svg`
- `logo-symbol-original.webp` · `logo-symbol-original-white.png` (provided raster originals)

**Foundation cards** (`guidelines/` — Design System tab)
- Colors: `color-absolutes` · `color-neutrals` · `color-green` · `color-data-states`
- Type: `type-display` · `type-body` · `type-mono` · `type-scale`
- Spacing: `spacing-scale` · `radii` · `elevation`
- Brand: `brand-wordmark` · `brand-symbol` · `brand-lockup`

**Components** (`components/` — `window.VelzDesignSystem_c12abb`)
- `brand/` — `Symbol`, `Wordmark`, `Logo` — the mark, always monochrome
- `core/` — `Button` (primary/solid/secondary/ghost), `Badge`, `Card`, `StatCard`, `AlertRow`
- `forms/` — `Input`, `Switch`

**UI kits** (`ui_kits/`)
- `dashboard/index.html` — interactive Velz client analytics product; 4 screens: Overview · Attribution · Inventory · Cashflow

**Slides** (`slides/index.html`) — 5 editorial brand/bi-weekly review slide templates: Title · Key insight · Metrics · Attribution · Recommendation

---

## 6. Open questions / flags for the user

1. **Green accent hex** — the exact value was an image in the brief and didn't come through as text. I chose **`#1a8f54`** (a refined signal green). Please confirm or send the official hex.
2. **Fonts** — no brand binaries were provided. I selected **Newsreader** (serif display), **Hanken Grotesk** (UI/wordmark), **IBM Plex Mono** (data), loaded from Google Fonts. Confirm, or send the intended families/files.
3. **Iconography** — substituted **Lucide** (thin line icons) as the closest match to the line-driven mark. Confirm or specify a set.
4. **No codebase or Figma** was attached, so the dashboard UI kit is a faithful interpretation of the described product (attribution → inventory → cashflow → alerts), not a recreation of existing screens. If real product screens exist, share them and I'll align pixel-for-pixel.
