# c2L

c2L builds AI systems that replace manual workflows for customs brokerages. One-person operation by Ahiya Butman. The name stands for "cooperative to Lean" -- structured human-AI engagement that produces real working systems.

## Systems

### site/ -- c2l.dev
Next.js static site deployed on Vercel. English home page + Hebrew customs brokerage offer page (`/customs`). The offer presents 4 phases with exit ramps after each.

```bash
cd site && npm install && npm run dev    # localhost:3000
npm run build                            # production build
npm run test                             # 42 vitest tests
```

### reach/ -- Outreach Engine
Dormant email outreach system for customs broker leads. CSV contacts, Hebrew Markdown templates, preview CLI. **There is no send function. The system cannot send emails.** Activation requires explicit approval.

```bash
cd reach && npm install
npm run test                             # 58 vitest tests
npm run preview -- --list                # list placeholder contacts
```

### commands/ + clients/ -- Workflow Plugin
Claude Code plugin for structured client engagements. 6 internal phases (explore, plan, build, validate, heal, deliver) map to 4 customer-facing phases on the site. Per-client state lives in `clients/{slug}/client.yaml`.

```bash
bash __tests__/run-all.sh                # validation suite
```

## Directory Structure

```
c2L/
  site/           Next.js site (c2l.dev)
  reach/          Dormant outreach engine
  commands/       Claude Code plugin commands (c2l-explore, c2l-build, etc.)
  clients/        Per-client engagement data (templates + active clients)
  __tests__/      Workflow validation scripts
  .claude-plugin/ Plugin manifest
  .github/        CI workflow
```

## Customer-Facing vs Internal Phases

The site shows 4 phases; the workflow plugin uses 6. This is intentional:

| Customer Phase | Internal Phases | Price |
|---|---|---|
| 1. Exploration | explore + plan | 5,000 NIS |
| 2. Build | build | 80,000 NIS |
| 3. Validation | validate + heal | 35,000 NIS |
| 4. Delivery | deliver | 30,000 NIS |

Total: 150,000 NIS. Each phase has an exit ramp (except Delivery).

## Contact

- Phone: 058-778-9019
- Email: ahiya.butman@gmail.com
- Site: https://c2l.dev
