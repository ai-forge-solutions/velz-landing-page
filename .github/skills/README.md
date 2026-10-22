# Velz worker skills

Repo-local skills for Hermes/Codex/Claude-style workers. Read the relevant `SKILL.md` before implementing related work in this repository.

## Mandatory project skill

| Skill | Use when |
|---|---|
| `velz-brand` | Mandatory for every visible UI, public landing, lead-magnet page, copy, design, CTA, or frontend component change. This is the Velz look-and-feel and claim-safety source of truth. Read `.github/skills/velz-brand/SKILL.md`; for substantial design work also read its `references/design-system.md` and `references/integration.md`. |

## Additional reusable skills

| Skill | Use when |
|---|---|
| `premium-landing-designer` | Creating or substantially reworking premium/conversion-focused marketing pages. |
| `landing-page-design` | Optimizing landing structure, hero, above-the-fold content, CTA hierarchy, and conversion flow. |
| `frontend-design` | Building or polishing production-grade frontend components/pages. |
| `core-web-vitals` | Fixing or auditing LCP, INP, CLS, or page-experience issues. |
| `performance` | Speeding up loading/runtime performance or reducing page weight. |

## Precedence

These skills are additive. If generic imported guidance conflicts with `velz-brand`, follow `velz-brand` and keep Velz's exact palette, typography, visual tone, claim-safety rules, and mobile readability constraints.

The supplied Claude-Code-style `velz-design` manifest is preserved inside `velz-brand/references/claude-code-skill.md` for provenance only. Do not load it through a separate convention or copy it as another top-level skill; this repo uses one convention for all skills: `.github/skills/<skill>/SKILL.md` plus optional `references/` files.

Do not import or apply trujas/TURNO/barber-specific branding in this repository.
