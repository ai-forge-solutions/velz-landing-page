# Velz Landing Page agent instructions

This repo is `ai-forge-solutions/velz-landing-page`, the public Velz landing and lead-magnet frontend served at `https://velz.io`.

## Stack and commands

- Stack: Vite + React SPA, Tailwind/CSS tokens, Netlify hosting/functions.
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## Worker skills

Repo-local worker skills live under `.github/skills/`. Read the relevant `SKILL.md` before making changes.

Before changing visible UI, copy, public landing pages, lead-magnet pages, CTAs, or frontend components, read and apply `.github/skills/velz-brand/SKILL.md`. It is the strict Velz look-and-feel and claim-safety source of truth and overrides generic design advice. For substantial design or brand work, also read `.github/skills/velz-brand/references/design-system.md` and `.github/skills/velz-brand/references/integration.md`.

All repo-local skills are loaded the same way: read `.github/skills/<skill>/SKILL.md` first, then any `references/` files named by that skill. Do not install or load the supplied Claude-Code-style `velz-design` manifest as a separate top-level skill; it is preserved only as `.github/skills/velz-brand/references/claude-code-skill.md` for provenance.

Additional reusable worker skills:

| Skill | Use when |
|---|---|
| `premium-landing-designer` | Creating or substantially reworking premium/conversion-focused marketing pages. |
| `landing-page-design` | Optimizing landing structure, hero, above-the-fold content, CTA hierarchy, and conversion flow. |
| `frontend-design` | Building or polishing production-grade frontend components/pages. |
| `core-web-vitals` | Fixing or auditing LCP, INP, CLS, or page-experience issues. |
| `performance` | Speeding up loading/runtime performance or reducing page weight. |

Use these skills additively with the Velz brand skill. Do not introduce colors, fonts, radii, tone, claim styles, or UI patterns that violate `.github/skills/velz-brand/SKILL.md`.

## Brand/source rules

- Do not use trujas/TURNO/barber branding, product assumptions, colors, copy, or design rules in this repo.
- Current Velz design tokens live in `tokens/*.css`; production patterns live in `src/styles.css`; the preserved original reference is `landing-v2-contraste.html`; the supplied full design-system guide lives in `.github/skills/velz-brand/references/design-system.md`.
- Lead-magnet pages must remain claim-safe: public observations and proxies need source refs/caveats; do not imply private account access or exact revenue/stock/cashflow unless explicitly backed by data.

## Lead magnet architecture

- Public route: `/tools/:tool_slug/:token`.
- API route: `GET /api/lead-magnets/:token`.
- The public request path should read existing payload/state; it must not run ETLs, scraping, conductor jobs, or enrichment services inline.
