# Master Exploration Report

## Explorer ID
master-explorer-1

## Focus Area
Architecture & Complexity Analysis

## Vision Summary
c2L is a commercial AI-driven system comprising three components: (1) a Claude Code plugin for cooperative client solution building, (2) a static marketing site at c2l.dev with a targeted customs brokerage offer, and (3) an email outreach system for reaching Israeli customs brokers -- all aimed at landing the first paying client.

---

## Requirements Analysis

### Scope Assessment
- **Total must-have features identified:** 6 (Explore Phase Plugin, Build Phase Plugin, Validate/Heal Phase Plugin, Main Site Page, Customs Offer Page, Email Reach System)
- **User stories/acceptance criteria:** 25 acceptance criteria across 6 features
- **Estimated total work:** 14-20 hours

### Complexity Rating
**Overall Complexity: MEDIUM**

**Rationale:**
- 3 distinct systems (plugin, site, reach) but each is individually straightforward
- No shared database or complex inter-system dependencies -- only the site URL links them
- Strong precedent exists: selahlabs (static site pattern), selahreach (reach/CRM pattern), 2L itself (plugin pattern)
- Greenfield repo but follows well-established patterns from Ahiya's existing projects
- No authentication, no real-time features, no complex data pipelines in the MVP itself

---

## Architectural Analysis

### Major Components Identified

1. **c2L Plugin (Claude Code Plugin)**
   - **Purpose:** Commands and agents that help Ahiya conduct structured client engagements -- explore, plan, build, validate, heal, deliver phases
   - **Complexity:** MEDIUM
   - **Why critical:** This is the operational engine. Without it, Ahiya has no structured way to deliver client solutions cooperatively with AI. However, for the MVP, only the Explore phase needs to be fully functional.
   - **Architecture:** Markdown-based commands and agents following exact 2L plugin conventions. No compiled code, no build step. Commands are `.md` files in a `commands/` directory. Agents are `.md` files in an `agents/` directory. A `.claude-plugin/plugin.json` manifest registers them.
   - **Key distinction from 2L:** c2L commands are domain-specific (client workflow discovery, document processing) rather than generic software development. The phase names (Explore, Plan, Build, Validate, Heal, Deliver) map to client engagement stages, not code iteration stages.

2. **c2L Site (Static Website at c2l.dev)**
   - **Purpose:** Public face of c2L -- presents the business, links to proof of work (StatViz), and hosts the customs brokerage offer page
   - **Complexity:** LOW
   - **Why critical:** This is the landing page that outreach emails link to. Without it, there is no destination for the CTA. Must be professional and specific enough that a customs broker understands the offer.
   - **Architecture:** Next.js static site deployed on Vercel. Two pages: main (`/`) and customs offer (`/customs`). No backend, no database, no API routes. Hebrew support required for the customs page (RTL layout, Hebrew text). Following selahlabs pattern exactly.

3. **c2L Reach (Email Outreach System)**
   - **Purpose:** Send targeted emails to Israeli customs broker owners, linking them to the offer page on c2l.dev
   - **Complexity:** LOW-MEDIUM
   - **Why critical:** This is the outreach mechanism -- the thing that puts the offer in front of potential clients. Built but NOT activated (dormant until site and plugin are ready).
   - **Architecture:** Next.js + SQLite (Drizzle ORM) following the selahreach pattern exactly. Contact management, email templates, campaign tracking. tRPC API for Claude Code operation. Deployed on Railway (dormant).

### Technology Stack Implications

**c2L Plugin**
- **Technology:** Pure markdown files (commands + agents) + plugin manifest JSON
- **No build step required:** Files are read by Claude Code directly
- **Pattern:** Follows 2L plugin architecture exactly -- `commands/`, `agents/`, `.claude-plugin/`
- **Recommendation:** Mirror 2L structure but rename prefix from `2l-` to `c2l-`

**c2L Site**
- **Options:** Next.js (like selahlabs), plain HTML/CSS, Astro, or similar
- **Recommendation:** Next.js 16 + Tailwind CSS 4 + Vercel deployment (mirrors selahlabs exactly)
- **Rationale:** Ahiya has deployed selahlabs on this exact stack. Zero learning curve. Static export works perfectly for a no-backend site. Hebrew/RTL support is straightforward with CSS `dir="rtl"`.

**c2L Reach**
- **Options:** Next.js + SQLite (like selahreach), standalone Node.js script, or serverless functions
- **Recommendation:** Next.js 15 + SQLite (better-sqlite3) + Drizzle ORM + tRPC (mirrors selahreach exactly)
- **Rationale:** selahreach is a proven, working system for this exact use case. Copy the architecture, customize the data model for customs broker contacts instead of agency contacts. Deploy on Railway.

**Email Sending**
- **Options:** Resend, AWS SES, Gmail MCP, Nodemailer
- **Recommendation:** Gmail MCP (same as selahreach) for initial sends; Resend for programmatic sending later
- **Rationale:** Gmail MCP is already configured and working in the selahreach flow. For 10 emails, no need for a dedicated email service.

---

## System Boundaries and Relationships

```
c2L Plugin (this repo)          c2L Site (separate repo)         c2L Reach (separate repo)
========================        =========================        =========================
commands/c2l-explore.md         c2l.dev/                         Railway (dormant)
commands/c2l-plan.md            c2l.dev/customs                  Contact DB (customs brokers)
commands/c2l-build.md                                            Email templates
commands/c2l-validate.md        Links to:                        Campaign tracking
commands/c2l-heal.md            - StatViz
agents/c2l-explorer.md          - Ahiya
agents/c2l-builder.md           - Customs offer CTA              Links to:
.claude-plugin/                                                  - c2l.dev/customs
                                                                 - Contact list

        |                               |                               |
        v                               v                               v
  Operates in Claude Code         Deployed on Vercel            Deployed on Railway
  No external infra               Static, no backend            Local dev + Railway
```

**Cross-system dependencies are minimal:**
- c2L Reach emails link to c2L Site URL (just a URL string)
- c2L Site links to StatViz (just a URL string)
- c2L Plugin operates independently in Claude Code
- No shared database, no shared API, no shared authentication

---

## Iteration Breakdown Recommendation

### Recommendation: MULTI-ITERATION (3 iterations)

**Rationale:**
The three systems are architecturally independent. They share no code, no database, no API contracts. The only connections are URL references. This means they can be built in any order. However, there is a logical dependency: the Reach system needs the Site URL to link to, and the Site needs to exist before outreach begins. The Plugin is the operational tool for after a client responds.

The natural ordering is:
1. Site first (creates the destination for outreach)
2. Reach second (creates the mechanism to drive traffic to the site)
3. Plugin third (creates the tools for when a client engages)

However, from a priority standpoint, the vision's success criteria emphasize: "c2l.dev is live with customs offer page" and "c2L Reach is built and ready to send" as the most important deliverables. The plugin's explore phase is third priority.

Each system is a self-contained project with its own repo, its own deployment target, and its own tech stack. Building them as separate iterations provides clean separation, independent validation, and the ability to stop after any phase with something deployable.

### Suggested Iteration Phases

**Iteration 1: c2L Site (The Destination)**
- **Vision:** Build and deploy c2l.dev with main page and customs brokerage offer page
- **Scope:**
  - Next.js 16 static site scaffold with Tailwind CSS 4
  - Main page (`/`): c2L identity, link to StatViz, link to Ahiya, link to customs offer
  - Customs offer page (`/customs`): Hebrew-primary, explains the problem (document processing costs, clerk expenses, port delays), presents the solution (step-by-step engagement model), clear CTA
  - Mobile responsive, professional minimal design
  - Vercel deployment configuration
  - Open Graph / SEO metadata
- **Why first:** This is the landing destination. Everything else points here. Must exist before outreach.
- **Estimated duration:** 4-6 hours
- **Risk level:** LOW
- **Success criteria:** c2l.dev loads, customs offer page communicates the problem and solution clearly, mobile responsive, Hebrew text renders correctly with RTL layout

**Iteration 2: c2L Reach (The Outreach Engine)**
- **Vision:** Build the email outreach system for customs broker leads, ready to send but dormant
- **Scope:**
  - Next.js + SQLite + Drizzle ORM scaffold (following selahreach pattern)
  - Contact schema: customs broker contacts (name, company, email, role, stage, tracking fields)
  - Email template system with customs-specific templates
  - Campaign management (link to c2l.dev/customs)
  - tRPC API for Claude Code operation
  - Seed data: 10 customs broker contacts researched and pre-loaded
  - Railway deployment configuration (dormant)
- **Dependencies from Iteration 1:**
  - c2l.dev/customs URL must be known (but site does not need to be live yet -- URL is predictable)
- **Estimated duration:** 5-7 hours
- **Risk level:** LOW-MEDIUM
- **Success criteria:** System can send personalized emails via Claude Code, 10 contacts loaded, emails link to c2l.dev/customs, built and tested but NOT sending live

**Iteration 3: c2L Plugin (The Explore Phase)**
- **Vision:** Build the c2L Claude Code plugin with commands and agents for the Explore phase of client engagement
- **Scope:**
  - Plugin manifest (`.claude-plugin/plugin.json`)
  - Core commands: `c2l-explore`, `c2l-plan`, `c2l-status`
  - Explore phase agent: `c2l-explorer` -- guides structured discovery of client workflow
  - Exploration report template: document types, volumes, formats, workflow steps, pain points, expected outputs, accuracy requirements
  - Project structure for per-client engagements
  - Stub commands for future phases: `c2l-build`, `c2l-validate`, `c2l-heal`, `c2l-deliver`
- **Dependencies from Iterations 1-2:**
  - None (operates entirely within Claude Code)
- **Estimated duration:** 4-6 hours
- **Risk level:** LOW
- **Success criteria:** Ahiya can run `/c2l-explore` in Claude Code and produce a structured exploration report for a client's workflow. Stub commands exist for future phases.

---

## Dependency Graph

```
Iteration 1: c2L Site
├── Main page (/)
├── Customs offer page (/customs)
└── Vercel deployment
    ↓ (URL reference only)
Iteration 2: c2L Reach
├── Contact management (customs brokers)
├── Email templates (link to c2l.dev/customs)
├── Campaign tracking
└── Railway deployment (dormant)
    ↓ (no technical dependency)
Iteration 3: c2L Plugin
├── c2l-explore command + agent
├── Exploration report template
├── Stub commands (plan, build, validate, heal, deliver)
└── .claude-plugin manifest
```

**Key insight:** These iterations have minimal technical dependencies. The only real dependency is that Reach emails need to reference the Site URL. The Plugin is completely independent. All three could theoretically be built in parallel, but sequential ordering provides a logical narrative: destination -> traffic -> tools.

---

## Risk Assessment

### Medium Risks

- **Hebrew/RTL layout complexity:** The customs offer page needs proper Hebrew rendering with RTL text direction. Mixed Hebrew/English content can cause layout issues.
  - **Impact:** Page looks broken or unprofessional to the target audience
  - **Mitigation:** Use CSS `dir="rtl"` on Hebrew sections, test thoroughly with real Hebrew text. Next.js handles this well natively.
  - **Recommendation:** Handle in Iteration 1

- **Customs broker contact research quality:** The 10 contacts need to be real, reachable customs broker owners/managers. Poor research means wasted outreach.
  - **Impact:** 0/10 response rate if contacts are wrong
  - **Mitigation:** This is a human task (Ahiya) not a system task. The system just needs to support the data model.
  - **Recommendation:** Contact research happens in parallel with Iteration 2 build

- **Plugin design without real client feedback:** The c2l-explore agent is designed before any actual client engagement. It may need significant revision after the first real use.
  - **Impact:** Wasted effort on plugin features that do not match reality
  - **Mitigation:** Build minimal explore phase only. Stub everything else. Iterate after first real engagement.
  - **Recommendation:** Keep Iteration 3 deliberately minimal

### Low Risks

- **Vercel deployment:** Well-understood, Ahiya has deployed multiple sites. Domain configuration for c2l.dev is straightforward.
- **selahreach pattern reuse:** The reach system is a direct adaptation of a working system. Low novelty risk.
- **Plugin structure:** Follows established 2L convention. Markdown commands are simple to create and iterate on.

---

## Integration Considerations

### Cross-Phase Integration Points

- **URL consistency:** The c2l.dev/customs URL must be decided in Iteration 1 and referenced in Iteration 2 email templates. This is just a string, not a code dependency.
- **Brand consistency:** All three systems represent c2L. Visual language (if any) should be consistent between the site and email templates.
- **StatViz link:** The main site page links to StatViz as proof of work. Need to ensure StatViz is in a presentable state.

### Potential Integration Challenges

- **Repo structure decision:** The vision says "c2L (this repo)" for the plugin, but the site and reach system need their own repos (separate deployment targets). Need to decide: monorepo with three directories, or three separate repos?
  - **Recommendation:** Three separate repos. The plugin lives in this repo (`c2L`). The site gets a new repo (`c2l-site`). The reach system gets a new repo (`c2l-reach`). Each deploys independently. This matches the existing pattern: StatViz is its own repo, selahreach is its own repo.

- **Per-iteration repo switching:** Each iteration works on a different repo. The 2L/MVP system operates on a single project directory. The master plan needs to account for this -- each iteration is essentially an independent project build.

---

## Recommendations for Master Plan

1. **Three iterations, three repos, three independent builds**
   - Each iteration produces a standalone, deployable artifact
   - Iteration 1 (Site) and Iteration 2 (Reach) follow proven patterns from selahlabs and selahreach
   - Iteration 3 (Plugin) is the most novel but also the most forgiving (markdown files, easy to iterate)

2. **Iteration 1 (Site) should be fast and focused**
   - Two pages. No backend. No complexity. Follow selahlabs template.
   - The key challenge is content quality (Hebrew copy, pain-point specificity), not technical difficulty.
   - 2-3 builders maximum.

3. **Iteration 2 (Reach) should clone selahreach's architecture directly**
   - Same stack, same patterns, different data model
   - Customize schema for customs broker contacts instead of agency contacts
   - Customize email templates for customs-specific pain points
   - 3-4 builders following exact selahreach structure.

4. **Iteration 3 (Plugin) should be deliberately minimal**
   - Only the Explore phase needs to work
   - Build/Validate/Heal/Deliver are stubs -- they will be built after first real client engagement
   - The real test of the plugin is using it on a real client, not building it in advance
   - 1-2 builders.

5. **Consider combining Iterations 1 and 2 if time is a constraint**
   - The Site is so simple (4-6 hours) that it could be combined with the Reach system into a single larger iteration
   - However, keeping them separate allows validation after each: "Is the site good enough?" before building outreach

---

## Technology Recommendations

### Existing Codebase Findings

- **c2L repo is greenfield:** No code exists yet, only `.2L/config.yaml` and the vision document
- **Strong precedent projects exist:**
  - `selahlabs`: Static Next.js site on Vercel -- exact pattern for c2L Site
  - `selahreach`: Next.js + SQLite CRM on Railway -- exact pattern for c2L Reach
  - `2L` itself: Claude Code plugin with commands/agents -- exact pattern for c2L Plugin

### Stack Decisions (Per System)

**c2L Site (Iteration 1):**
- Next.js 16 + React 19 + Tailwind CSS 4
- Static export (no server-side logic)
- Deployed on Vercel at c2l.dev
- Hebrew font support (system fonts or Google Fonts with Hebrew subset)
- Lucide icons (like selahlabs)

**c2L Reach (Iteration 2):**
- Next.js 15 + React 19 + Tailwind CSS
- SQLite (better-sqlite3) + Drizzle ORM
- tRPC for API layer
- Gmail MCP for email sending (through Claude Code)
- Deployed on Railway (dormant)

**c2L Plugin (Iteration 3):**
- Pure markdown (`.md` files)
- Plugin manifest JSON
- No dependencies, no build step
- Deployed by pushing to GitHub (Claude Code reads from repo)

---

## Notes & Observations

- The vision document is exceptionally well-structured and specific. It names the target market, the pain points, the pricing logic, and the engagement model. This reduces ambiguity for planning.

- The three systems have been deliberately designed to be independently deployable with minimal cross-dependencies. This is a strength -- it means any single system can be rebuilt or replaced without affecting the others.

- The Plugin (Iteration 3) is the most strategically important long-term but the least urgent for MVP. The immediate goal is to get the offer in front of customs brokers (Site + Reach). The Plugin becomes critical only after someone says "yes."

- The "built but NOT activated" requirement for Reach is important. The system should be fully functional in dev/test but have a clear guard against accidental live sending.

- Hebrew RTL support is a non-trivial UX concern. The customs offer page should feel native to Israeli customs brokers, not like a translated English page. This means RTL layout, Hebrew-first content, and culturally appropriate design (professional, direct, no-nonsense).

- The selahreach pattern of operating through Claude Code (tRPC API + Gmail MCP) is exactly what c2L Reach should follow. This means Ahiya sends emails through Claude Code conversations, maintaining the cooperative human-AI workflow that defines c2L.

---

*Exploration completed: 2026-03-23*
*This report informs master planning decisions*
