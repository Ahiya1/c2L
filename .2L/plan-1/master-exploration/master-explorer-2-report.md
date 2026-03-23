# Master Exploration Report

## Explorer ID
master-explorer-2

## Focus Area
Dependencies & Risk Assessment

## Vision Summary
c2L is a three-system commercial offering: (1) a Claude Code plugin for cooperative client engagement, (2) a static website at c2l.dev for presenting the customs brokerage automation offer, and (3) an email outreach system modeled on the existing selahreach CRM. The MVP targets 10 Israeli customs brokers with a clear offer and the tooling to deliver if they respond.

---

## Requirements Analysis

### Scope Assessment
- **Total must-have features identified:** 6 (Plugin Explore, Plugin Build, Plugin Validate/Heal, Site Main Page, Site Customs Offer Page, Reach Email System)
- **User stories/acceptance criteria:** 24 distinct acceptance criteria across 6 features
- **Estimated total work:** 14-22 hours

### Complexity Rating
**Overall Complexity: MEDIUM**

**Rationale:**
- Three distinct systems but each is relatively simple (plugin = markdown commands, site = static pages, reach = adapted CRM)
- Strong precedent exists: selahreach (the reach system) and selahlabs (the static site) provide direct structural templates
- No complex backend infrastructure needed -- the site is static and the reach system uses SQLite locally
- The c2L plugin is the most novel component but follows established 2L plugin patterns (commands + agents in markdown)
- Hebrew/RTL support adds moderate complexity to the site component

---

## Dependency Analysis

### System-Level Dependencies

#### System 1: c2L Plugin (Claude Code Plugin)
**External Dependencies:**
- Claude Code plugin system (already working for 2L -- proven pattern)
- GitHub repo (already exists at `/home/ahiya/Ahiya/2L/Prod/biz/c2L`)

**Internal Dependencies:**
- None -- this is a standalone plugin that runs in Claude Code
- Commands and agents are markdown files, no npm packages required

**Assessment:** LOW risk. Direct adaptation of existing 2L patterns.

#### System 2: c2L Site (Static Website)
**External Dependencies:**
- **Vercel account:** Active, authenticated (`vercel whoami` returns `ahiya1`)
- **Domain c2l.dev:** Registered and resolves to IPs (216.150.1.193, 216.150.16.193) but NOT currently pointing to Vercel. Returns HTTP 404/connection-refused. DNS reconfiguration needed.
- **Next.js framework:** Proven in selahlabs, StatViz, ahiya-xyz
- **Tailwind CSS:** Standard across all Ahiya projects

**Internal Dependencies:**
- Link to StatViz (statviz.dev or wherever deployed) -- must verify StatViz is live
- Link to ahiya.xyz -- confirmed live
- CTA mechanism (contact form, email, or WhatsApp link) -- design decision required

**Assessment:** LOW-MEDIUM risk. Main risk is DNS setup for c2l.dev.

#### System 3: c2L Reach (Email Outreach CRM)
**External Dependencies:**
- **Railway account:** Active, authenticated (`railway whoami` returns `ahiya.butman@gmail.com`). Two existing projects: `statviz-outreach`, `bob-hands`.
- **Gmail MCP:** Configured and working for selahreach at `ahiya.butman@gmail.com`. OAuth keys present at `/home/ahiya/Ahiya/2L/Prod/biz/StatViz/.gmail-mcp/gcp-oauth.keys.json`.
- **Email sending:** Uses Gmail MCP (`mcp__gmail__send_email`) -- no external email service (Resend, SES) needed for 10-email scale
- **SQLite + Drizzle ORM:** Proven pattern from selahreach (local SQLite database, zero infrastructure cost)
- **tRPC:** API layer from selahreach -- can be directly adapted

**Internal Dependencies:**
- Requires c2L site offer page to be live (outreach emails link to it)
- Contact list of 10 Israeli customs brokers (data gathering required)

**Assessment:** LOW risk. Nearly direct fork of selahreach with new templates and contacts.

### Feature-Level Dependency Chain

```
c2L Plugin (independent)
    |
    | (no dependency)
    v

c2L Site - Main Page
    |
    | (main page links to offer page)
    v
c2L Site - Customs Offer Page
    |
    | (emails link to offer page)
    v
c2L Reach - Email System (requires offer page URL)
    |
    | (emails are sent only after system is ready)
    v
ACTIVATION (send 10 emails)
```

**Critical Path:** Site Offer Page must be live before Reach can be tested end-to-end.
**Plugin is independent** -- can be built in parallel with everything else.

---

## Third-Party Dependencies & Service Inventory

### Already Configured & Working
| Service | Status | Account | Evidence |
|---------|--------|---------|----------|
| Vercel | Active | ahiya1 | Multiple projects deployed (StatViz, selahlabs, ahiya-xyz) |
| Railway | Active | ahiya.butman@gmail.com | 2 existing projects |
| GitHub | Active | Ahiya1 | SSH authenticated, 20+ repos |
| Gmail MCP | Configured | ahiya.butman@gmail.com | OAuth keys present, used for selahreach outreach |
| Claude Code | Active | -- | 2L plugin system running |

### Needs Configuration
| Service | What's Needed | Risk Level | Notes |
|---------|---------------|------------|-------|
| c2l.dev DNS | Point domain to Vercel | LOW | Domain is registered, currently points elsewhere. Standard Vercel domain setup. |
| New Vercel project | Create project for c2L site | LOW | Standard `vercel` CLI flow |
| New Railway project | Create project for c2L Reach | LOW | Standard `railway` CLI flow |
| New GitHub repo | Create repo for c2L site (separate from plugin) | LOW | Or deploy from monorepo subfolder |

### NOT Needed (Vision Clarification)
| Service | Why Not Needed |
|---------|---------------|
| Supabase | No database needed for static site; Reach uses SQLite locally |
| Resend/SES | Gmail MCP sufficient for 10 emails |
| Stripe/PayPal | No payment processing in MVP |
| Sentry | Low-touch systems, not needed for MVP |
| Redis/Vercel KV | No caching needed |

---

## Risk Assessment

### High Risks

**None identified.** This project benefits from strong precedent across all three systems.

### Medium Risks

1. **c2l.dev Domain DNS Configuration**
   - **Description:** The domain c2l.dev is registered but currently resolves to non-Vercel IPs (216.150.1.193). DNS must be reconfigured to point to Vercel.
   - **Impact:** Site cannot go live until DNS propagates (up to 48 hours, typically 1-4 hours)
   - **Mitigation:** Configure DNS early in iteration 1. Verify domain registrar access before starting. Can develop against Vercel preview URL while DNS propagates.
   - **Recommendation:** Handle in iteration 1 as a prerequisite task.

2. **Hebrew/RTL Content for Customs Offer Page**
   - **Description:** Target market is Israeli customs brokers. Vision specifies Hebrew support. RTL layout requires specific CSS and content strategy.
   - **Impact:** If done poorly, the offer page looks unprofessional to the target audience. Content must be authentic Hebrew, not translated.
   - **Mitigation:** Use Next.js `dir="rtl"` support. Ahiya writes Hebrew content directly. Test on mobile (Israeli business owners often read on mobile).
   - **Recommendation:** Ahiya should draft Hebrew content as input to the build phase. Do not auto-translate.

3. **Customs Broker Contact List Acquisition**
   - **Description:** c2L Reach needs 10 customs broker contacts (name, email, company). These don't exist yet and must be researched.
   - **Impact:** Without contacts, the outreach system is ready but cannot be tested end-to-end.
   - **Mitigation:** Ahiya researches contacts manually (Israeli customs brokers are a small, known community). Can start with public directory of licensed brokers.
   - **Recommendation:** This is a human task, not a build task. Should happen in parallel with development.

### Low Risks

1. **Gmail MCP Authentication Scope**
   - **Description:** Gmail MCP is configured for selahreach. It sends from ahiya.butman@gmail.com. For c2L, Ahiya may want to send from a c2l.dev address.
   - **Impact:** Minor -- can start with ahiya.butman@gmail.com and switch later.
   - **Mitigation:** Use personal email for MVP. If c2l.dev email is needed, configure Google Workspace or use a separate SMTP relay later.

2. **Selahreach Fork Divergence**
   - **Description:** c2L Reach is modeled on selahreach but targets a different market with different templates, pipeline stages, and contact fields.
   - **Impact:** If forked carelessly, might inherit agency-specific logic that doesn't apply.
   - **Mitigation:** Start fresh using selahreach as a structural reference, not a direct fork. Adapt the schema for customs brokers (different stages, different fields).

3. **c2L Plugin Novelty**
   - **Description:** While the 2L plugin pattern is established, c2L is oriented toward client workflows (not software development). The Explore/Build/Validate phases need to be designed for document processing discovery.
   - **Impact:** Plugin commands may need iteration to be genuinely useful (vs. just templates).
   - **Mitigation:** Start with Explore phase only (MVP requirement). Build/Validate phases are post-MVP refinements.

---

## Existing Code Reuse Analysis

### What Already Exists & Can Be Directly Reused

| Asset | Location | Reuse For | Adaptation Needed |
|-------|----------|-----------|-------------------|
| 2L plugin structure | `/home/ahiya/Ahiya/2L/.claude-plugin/` | c2L plugin manifest | Rename, new commands |
| 2L commands pattern | `/home/ahiya/Ahiya/2L/commands/*.md` | c2L plugin commands | Rewrite for client workflows |
| selahreach CRM | `/home/ahiya/Ahiya/2L/Prod/selahreach/` | c2L Reach architecture | New schema, templates, contacts |
| selahreach DB schema | `selahreach/lib/db/schema.ts` | c2L Reach data model | Adapt fields for customs domain |
| selahreach tRPC API | `selahreach/lib/trpc/` | c2L Reach API layer | Adapt routes for new schema |
| selahreach outreach guide | `selahreach/OUTREACH-GUIDE.md` | c2L Reach operations | Rewrite for customs market |
| selahlabs site | `/home/ahiya/Ahiya/2L/Prod/selahlabs/` | c2L Site structure | New content, add RTL |
| selahlabs layout/metadata | `selahlabs/app/layout.tsx` | c2L Site layout pattern | Adapt metadata |

### What Must Be Built From Scratch

| Component | Why New | Estimated Effort |
|-----------|---------|------------------|
| c2L plugin commands (Explore phase) | New domain (client workflows, not dev) | 3-4 hours |
| c2L site content (main page + customs offer) | Domain-specific, Hebrew content | 3-5 hours |
| c2L Reach templates (Hebrew customs emails) | New market, new pitch | 2-3 hours |
| Customs broker contact research | Human task, manual research | 2-3 hours (Ahiya) |

---

## Iteration Breakdown Recommendation

### Recommendation: MULTI-ITERATION (2 iterations)

**Rationale:**
- Three distinct systems with a clear sequential dependency (site must be live before reach makes sense)
- The plugin is independent and can be in either iteration
- Natural split: infrastructure + site (iteration 1), then reach + plugin (iteration 2)
- Each iteration is 8-12 hours, manageable in focused sessions

### Suggested Iteration Phases

**Iteration 1: Site & Foundation**
- **Vision:** Get c2l.dev live with the customs offer page -- the public face of the business.
- **Scope:**
  - Create Next.js static site project
  - Configure Vercel deployment + c2l.dev DNS
  - Build main page (who is c2L, what it does, links to StatViz and offer)
  - Build customs offer page (Hebrew, RTL, specific pain, structured approach, CTA)
  - Mobile responsive design
- **Why first:** The offer page is a prerequisite for outreach (emails link to it). It's also the lowest-risk component with highest visibility.
- **Dependencies:** None (greenfield)
- **Estimated duration:** 6-8 hours
- **Risk level:** LOW
- **Success criteria:** c2l.dev loads, offer page clearly communicates the customs automation offer in Hebrew

**Iteration 2: Reach System & Plugin**
- **Vision:** Build the outreach engine and the cooperative tooling for client engagement.
- **Scope:**
  - c2L Reach: Adapt selahreach for customs broker outreach
    - New SQLite schema (customs-specific contact fields)
    - tRPC API adapted from selahreach
    - Contact management UI (pipeline board)
    - Hebrew email templates for customs brokers
    - Gmail MCP integration for sending
  - c2L Plugin: Explore phase commands
    - `c2l-explore` command for structured client workflow discovery
    - `c2l-plan` command for solution design
    - Structured exploration report template
  - Deploy Reach to Railway (dormant)
- **Dependencies:**
  - Requires: c2l.dev offer page URL (from iteration 1) for email template links
  - Requires: Customs broker contact list (Ahiya's parallel research)
- **Estimated duration:** 8-12 hours
- **Risk level:** MEDIUM (more components, adaptation from selahreach)
- **Success criteria:** Reach system can send a test email linking to offer page; Plugin produces exploration report structure

---

## Dependency Graph

```
Iteration 1: Site & Foundation
├── DNS: Point c2l.dev to Vercel
├── Project: Create Next.js static site
├── Page: Main page (c2L identity, links)
└── Page: Customs offer page (Hebrew, RTL, CTA)
    ↓ (offer page URL needed for email templates)
Iteration 2: Reach & Plugin
├── c2L Reach
│   ├── Schema: Customs broker contacts DB
│   ├── API: tRPC routes (adapted from selahreach)
│   ├── UI: Pipeline board + contact management
│   ├── Templates: Hebrew outreach emails
│   ├── Integration: Gmail MCP for sending
│   └── Deploy: Railway (dormant)
├── c2L Plugin
│   ├── Manifest: .claude-plugin/plugin.json
│   ├── Command: c2l-explore (workflow discovery)
│   └── Template: Exploration report structure
└── Data: 10 customs broker contacts (Ahiya research)
```

---

## Integration Considerations

### Cross-Phase Integration Points

- **Offer Page URL:** c2L Reach email templates must contain the exact c2l.dev offer page URL. If URL changes, templates must update.
- **Gmail MCP Configuration:** May need to configure Gmail MCP in the c2L project context (not just StatViz/selahreach). Check if MCP config is per-project or global.
- **StatViz Link:** Main page links to StatViz as proof of work. Must verify StatViz is publicly accessible and the URL is correct.

### Potential Integration Challenges

- **Gmail MCP Project Scope:** The Gmail MCP OAuth keys currently live in the StatViz project. c2L Reach will need its own reference to these keys or a shared MCP configuration. This is a minor configuration step but should not be overlooked.
- **Railway Deployment for SQLite:** selahreach runs SQLite locally. Railway deployments with SQLite require persistent storage (Railway volumes). Without this, the database resets on each deploy. For a dormant system with 10 contacts, this is manageable but needs attention at deploy time.
- **Hebrew Content Quality:** The email templates and offer page must be natural Hebrew. Machine-translated Hebrew is immediately recognizable to native speakers and would undermine credibility. Ahiya must write or closely review all Hebrew content.

---

## Recommendations for Master Plan

1. **Start with the site (iteration 1)**
   - The static site is the lowest-risk, highest-impact component. It unblocks the reach system and gives c2L a public presence immediately. DNS should be configured on day 1.

2. **Treat the plugin as a lightweight addition in iteration 2**
   - The c2L plugin (explore phase) is important but minimal in scope for MVP. It's markdown commands and a report template. It can share iteration 2 with the reach system without conflict.

3. **Do NOT over-engineer the reach system**
   - For 10 contacts, a local SQLite database with a simple UI is sufficient. Do not add Supabase, authentication, or complex infrastructure. Follow the selahreach pattern exactly -- it works.

4. **Ahiya must research contacts in parallel with iteration 1**
   - The customs broker contact list is the only non-technical blocker. It requires manual research (Israeli customs broker directory, LinkedIn, port authority listings). This should happen while the site is being built.

5. **Consider building the reach system as a local-first tool, not a deployed service**
   - The vision says "Deployed: Railway (dormant)" but selahreach runs perfectly as a local Next.js app. For 10 contacts, local operation with Gmail MCP is simpler and cheaper. Deploy to Railway only if remote access is genuinely needed.

6. **Domain DNS is the earliest action item**
   - c2l.dev DNS propagation can take hours. Initiate the Vercel domain configuration before any code is written.

---

## Technology Recommendations

### Existing Codebase Findings

- **Stack detected:** Next.js (across all projects), Tailwind CSS, TypeScript, SQLite + Drizzle (selahreach), tRPC (selahreach), Vercel (deployment), Railway (backend services)
- **Patterns observed:**
  - Static sites use Next.js with Tailwind (selahlabs pattern)
  - CRM/outreach tools use Next.js + tRPC + Drizzle + SQLite (selahreach pattern)
  - Email sending uses Gmail MCP through Claude Code (not a programmatic email service)
  - Plugins use markdown commands and agents (2L pattern)
- **Opportunities:** Direct pattern reuse from selahreach and selahlabs reduces build time significantly
- **Constraints:** Must use existing accounts (Vercel, Railway, GitHub). Must minimize infrastructure cost.

### Recommended Stack per System

| System | Stack | Reasoning |
|--------|-------|-----------|
| c2L Site | Next.js + Tailwind, Vercel | Matches selahlabs pattern exactly. Static export possible. |
| c2L Reach | Next.js + tRPC + Drizzle + SQLite, Railway (optional) | Matches selahreach pattern exactly. Proven for this use case. |
| c2L Plugin | Markdown commands + agents | Matches 2L plugin pattern exactly. No build system needed. |

---

## Notes & Observations

- The c2l.dev domain is registered but currently resolves to non-Vercel IPs. Ahiya likely purchased it recently but hasn't configured DNS yet. This is a 5-minute task once Vercel project is created.

- selahreach is a remarkably close architectural match for c2L Reach. The schema, API, UI patterns, email sending flow, and outreach guide can all be adapted. This is not a "start from scratch" component -- it's a "customize for new market" component.

- The vision explicitly says c2L Reach should be "Built but NOT activated." This means iteration 2 ends with a tested-but-dormant system. Activation (actually sending to real brokers) is a separate human decision.

- The c2L plugin's Build and Validate phases are listed as MVP but are intentionally vague ("Can ingest documents, can interpret and extract structured data"). These are aspirational for the first client engagement. For the MVP, having the Explore phase working is what matters -- it enables the first real conversation with a broker.

- The project has an unusually clear "stop after any phase" philosophy. This extends to the build itself: iteration 1 (site) has standalone value even if iteration 2 never happens.

---

*Exploration completed: 2026-03-23*
*This report informs master planning decisions*
