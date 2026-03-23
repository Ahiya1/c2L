# CLAUDE.md -- Project Context for Claude Code

## What This Is

c2L is a customs brokerage automation business. Three systems: a marketing site, a dormant outreach engine, and a Claude Code workflow plugin for structured client engagements.

## Critical Constraint

**reach/ must NEVER be activated.** No emails sent, no external contact. The system is DORMANT. If you need to test reach, use `npm run preview` in DRY_RUN mode only. Never change `config.yaml` mode to LIVE.

## Architecture

- **site/** -- Next.js 15 static site, deployed to Vercel at c2l.dev. TypeScript, Tailwind CSS, Rubik font. Tests: vitest + @testing-library/react.
- **reach/** -- Node.js/TypeScript. CSV contacts + Markdown templates + compose engine. Tests: vitest. No send capability exists.
- **commands/** -- Markdown command files for the c2L Claude Code plugin. Each is a phase command (explore, plan, build, validate, heal, deliver, status).
- **clients/** -- Per-client engagement directories. `_templates/client.yaml` is the template. Active client dirs contain client.yaml + phase deliverables.
- **__tests__/** -- Bash validation scripts for the workflow system (structure, commands, templates, client YAML).

## Phase Model

4 customer-facing phases map to 6 internal phases:
- Customer "Exploration" = internal `explore` + `plan`
- Customer "Build" = internal `build`
- Customer "Validation" = internal `validate` + `heal`
- Customer "Delivery" = internal `deliver`

See `site/lib/constants.ts` for the customer-facing definition and `clients/_templates/client.yaml` for the internal phase list.

## Source of Truth

- Contact info: `site/lib/constants.ts` (phone, email, WhatsApp URL)
- Reach contact details: `reach/config.yaml` (must match site constants)
- Pricing: `site/lib/constants.ts` PHASES array and TOTAL_PRICE
- Reach templates: `reach/templates/*.md` (Hebrew, link to c2l.dev/customs)

## Running Tests

```bash
cd site && npm run test          # 42 tests (vitest)
cd reach && npm run test         # 58 tests (vitest)
bash __tests__/run-all.sh        # workflow validation suite
```

## Conventions

- Brand name is `c2L` (lowercase c, number 2, uppercase L). In package names: `c2l`.
- Hebrew pages use RTL (`dir="rtl"`). Use `<bdi>c2L</bdi>` to prevent RTL mangling of the brand name.
- The customs page is the primary offer page. Reach emails link to `https://c2l.dev/customs`.
- Commands are named `c2l-{phase}.md` in `commands/`.
- Client YAML tracks `current_phase` using internal phase names (explore, plan, build, validate, heal, deliver, complete).
