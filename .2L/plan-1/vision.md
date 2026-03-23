# Project Vision: c2L — Commercial 2L

**Created:** 2026-03-23
**Plan:** plan-1

---

## Problem Statement

Real-world business workflows — especially in logistics-heavy domains — rely on humans to manually transform unstructured documents into structured, system-ready data. This is expensive, error-prone, and soul-crushing work.

c2L replaces these workflows with accountable, AI-driven systems. Not tools that assist. Systems that carry responsibility for outcomes within clearly defined boundaries.

**Current pain points (first target: customs brokerage):**
- Customs brokers employ 3-8 clerks just for document data entry (500K-1.4M NIS/year)
- Each shipment involves 10-20 documents in different formats from different sources
- Errors cause containers to sit at port — storage fees of 500-1,000 NIS/day
- Training new clerks takes months, turnover is high
- No existing solution fits their specific document formats and systems

---

## Target Users

**Primary user (builder side):** Ahiya Butman — operates c2L cooperatively with the system to build, deliver, and support client solutions.

**Primary user (client side, first offer):** Israeli customs brokers and freight forwarders — small-to-mid operations (5-30 employees) where the owner is the decision maker.

- ~200-300 licensed customs brokers in Israel
- Concentrated in Ashdod, Haifa, Ben Gurion area
- Reachable directly — no enterprise gatekeepers
- Currently spending 3-10x what c2L costs on the manual workflow

---

## Core Value Proposition

c2L builds systems that carry specific, bounded responsibilities — replacing one workflow end-to-end, reliably.

**Key benefits:**
1. The client gets a working system, not a tool they need to maintain
2. Step-by-step engagement — pay per phase, stop anytime
3. Responsibility transfers gradually from Ahiya to the system
4. No ongoing maintenance contracts — just bug responsibility

---

## System Architecture

c2L is three systems:

### 1. c2L (this repo) — The Engine

A Claude Code plugin that cooperates with Ahiya to build custom solutions for clients. Similar to 2L but oriented toward real client workflows.

**Phases (cooperative, human-AI):**
- **Explore** — Understand the client's real workflow. What documents come in? What systems do they enter data into? What errors occur? What does it cost them?
- **Plan** — Design the solution. Define input types, expected outputs, acceptable accuracy, failure modes.
- **Build** — Implement the pipeline. Ingest → Interpret → Structure → Validate → Output.
- **Validate** — Test on real client data. Measure accuracy against defined criteria.
- **Heal** — Fix issues found in validation.
- **Deliver** — Hand off working system. Transfer responsibility in stages.

Each phase involves direct contact with the client's real workflow — real documents, real systems, real data.

**Deployed:** GitHub (public repo)

### 2. c2L Site — The Face

A static website at **c2l.dev** that:
- Presents c2L and links to Ahiya Butman
- Links to StatViz as proof of prior work
- Hosts the specific offer for the current target market at a dedicated path
- Main page is simple — links to the current active offer

**Structure:**
- `/` — Main page. Who is c2L, what it does, link to current offer, link to StatViz
- `/customs` (or similar) — The specific offer page for customs brokers. Explains their problem with specificity, presents the solution, shows the structured approach, has a CTA

**Deployed:** Vercel (c2l.dev)
**Backend:** None — fully static

### 3. c2L Reach — The Outreach

A mailing system that sends targeted offer emails to potential clients. Similar to stat-reach.

- Finds the right contacts (customs broker owners/managers)
- Sends personalized emails that name the specific pain
- Links to the offer page on c2l.dev
- **Built but NOT activated** — dormant until the offer page and system are ready

**Deployed:** Railway (dormant)

---

## Feature Breakdown

### Must-Have (MVP)

1. **c2L Plugin — Explore Phase**
   - Description: Commands/agents that help Ahiya conduct structured discovery of a client's workflow
   - Acceptance criteria:
     - [ ] Can document input types, volumes, and formats
     - [ ] Can map current workflow steps and pain points
     - [ ] Can define expected outputs and accuracy requirements
     - [ ] Produces structured exploration report

2. **c2L Plugin — Build Phase**
   - Description: Commands/agents that help Ahiya build the document processing pipeline cooperatively
   - Acceptance criteria:
     - [ ] Can ingest documents (PDFs, scans, emails)
     - [ ] Can interpret and extract structured data
     - [ ] Can validate output against defined criteria
     - [ ] Produces working pipeline for the specific workflow

3. **c2L Plugin — Validate & Heal Phases**
   - Description: Test on real data, measure accuracy, fix issues
   - Acceptance criteria:
     - [ ] Can run pipeline on real client documents
     - [ ] Can measure and report accuracy
     - [ ] Can identify and categorize failures
     - [ ] Healing produces measurable improvement

4. **c2L Site — Main Page**
   - Description: Simple static page at c2l.dev
   - Acceptance criteria:
     - [ ] Presents c2L clearly — what it is, what it does
     - [ ] Links to Ahiya Butman
     - [ ] Links to StatViz as proof of work
     - [ ] Links to current offer page
     - [ ] Professional, minimal design — no fluff

5. **c2L Site — Customs Offer Page**
   - Description: Dedicated page explaining the customs brokerage automation offer
   - Acceptance criteria:
     - [ ] Names the specific problem with pain (document processing, clerk costs, port delays)
     - [ ] Presents the solution clearly
     - [ ] Shows the structured approach (explore → build → validate → deliver)
     - [ ] Step-by-step engagement model visible
     - [ ] Clear CTA (contact/schedule call)
     - [ ] Hebrew support (target market is Israeli)

6. **c2L Reach — Email System**
   - Description: Mailing system for outreach to customs brokers
   - Acceptance criteria:
     - [ ] Can send personalized emails
     - [ ] Email mentions their specific pain
     - [ ] Links to offer page on c2l.dev
     - [ ] Built and tested but NOT activated
     - [ ] Contact list management

### Should-Have (Post-First-Client)

1. **c2L Plugin — Delivery Phase** — Structured handoff tooling, responsibility transfer documentation
2. **Additional offer pages** — For next target workflow/industry
3. **Case study on c2l.dev** — Results from first engagement (with client permission)

### Could-Have (Future)

1. **Client dashboard** — Client can see pipeline status, accuracy metrics
2. **Multiple concurrent engagements** — c2L handles several clients in parallel
3. **Self-service pipeline builder** — Clients describe workflow, c2L generates solution with minimal human involvement

---

## User Flows

### Flow 1: Outreach → Client Engagement

1. c2L Reach sends email to customs broker owner
2. Email names their specific pain (clerks, costs, errors, port delays)
3. Broker clicks link to offer page on c2l.dev
4. Offer page explains problem, solution, and structured approach
5. Broker contacts Ahiya (form/email/phone)
6. Ahiya conducts discovery call — real workflow exploration
7. Both agree to proceed (or don't — clean exit)

### Flow 2: Building the Solution (cooperative, per-client)

1. **Explore:** Ahiya + c2L study the client's real documents, systems, and workflow
2. **Plan:** Define what the system will do, what accuracy is acceptable, what happens on failure
3. **Build:** Ahiya + c2L build the pipeline on real document samples
4. **Validate:** Run on real data, measure accuracy, share results with client
5. **Heal:** Fix issues, iterate until criteria are met
6. **Deliver:** Deploy working system, transfer responsibility gradually

**Exit ramps:** Client can stop after any phase. Pays only for completed phases.

### Flow 3: Post-Delivery

1. System runs independently
2. Client contacts Ahiya only if something breaks
3. Ahiya fixes bugs — no ongoing maintenance contract
4. System does not require Ahiya to operate

---

## Data Model Overview

### c2L Site
- Static — no database needed
- Content managed as files in the repo

### c2L Reach
- **Contacts:** name, company, email, role, status (new/contacted/responded/converted)
- **Campaigns:** offer reference, email template, send date, tracking
- **Emails:** contact reference, campaign reference, sent timestamp, opened, clicked

### c2L Plugin
- Project-based — each client engagement is a project
- Follows 2L-like plan/iteration structure
- Artifacts: exploration reports, pipeline code, validation results

---

## Technical Requirements

**c2L Plugin (this repo):**
- Claude Code plugin (like 2L)
- Commands and agents for each phase
- Works cooperatively with Ahiya
- No external infrastructure needed — runs in Claude Code

**c2L Site:**
- Static site (HTML/CSS/JS or lightweight framework)
- Deployed on Vercel at c2l.dev
- No backend, no database
- Hebrew + English support
- Mobile responsive

**c2L Reach:**
- Node.js / TypeScript
- Email sending (SMTP or service like Resend)
- Contact management
- Deployed on Railway
- NOT activated — build and test only

**Constraints:**
- Minimal infrastructure costs (Ahiya has limited runway)
- Everything must be deployable on existing accounts (Vercel, Railway, GitHub)
- No ongoing maintenance burden — systems should be low-touch

---

## Success Criteria

**The MVP is successful when:**

1. **c2l.dev is live with the customs offer page**
   - Metric: Site loads, offer page clearly communicates the problem and solution
   - Target: A customs broker reading it understands what's being offered and how

2. **c2L Reach is built and ready to send**
   - Metric: System can send personalized emails to a list of contacts
   - Target: 10 emails ready to send, linking to offer page

3. **c2L plugin can support the explore phase**
   - Metric: Ahiya can use c2L to conduct structured discovery of a client's workflow
   - Target: Produces actionable exploration report from a real engagement

4. **First response from outreach**
   - Metric: At least one customs broker engages (replies, clicks, calls)
   - Target: 1 out of 10 emails leads to a conversation

---

## Out of Scope

**Explicitly not included in MVP:**
- Pricing details and offer structure (determined during 2l-prod)
- The actual customs document processing pipeline (built per-client, not in advance)
- Client-facing dashboard
- Multiple offer pages for different industries
- Automated follow-up sequences
- Payment processing on the site
- Blog, content marketing, SEO

**Why:** The MVP is about reaching 10 people with a clear offer and having the tools to deliver if they say yes. Everything else comes after the first engagement.

---

## Assumptions

1. Israeli customs brokers are reachable by email and will read an email that names their specific pain
2. 150K NIS is a price point where brokers spending 500K+/year on clerks will see obvious ROI
3. The document processing workflow (shipping docs → customs declaration data) is automatable with current AI capabilities
4. StatViz serves as credible proof that Ahiya can deliver this kind of solution
5. A static offer page + direct email is sufficient to start a conversation — no need for a full marketing site

---

## Open Questions

1. What specific document types do customs brokers process most? (Bill of lading, commercial invoice, packing list — need to verify)
2. What systems do they enter data into? (שע"ר/SHAAR, מסל"ל — need to research)
3. What's the right CTA on the offer page — schedule a call? Reply to email? WhatsApp?
4. Should the offer page be in Hebrew only, or bilingual?
5. What email sending service to use for c2L Reach? (Resend? SES? Something else?)

---

## Evolution Path

### Phase 1: First Client (Now)
- Build c2L site + offer page
- Build c2L Reach
- Send 10 emails
- Land first engagement
- Build first solution cooperatively

### Phase 2: Prove & Repeat (Months 2-4)
- Deliver first solution
- Document what worked
- Refine c2L plugin based on real experience
- Second offer (same industry or adjacent)

### Phase 3: Systematize (Months 4-12)
- c2L plugin becomes genuinely useful tooling
- Multiple completed engagements
- Revenue sustains operations
- StatViz matures in parallel

### Phase 4: Scale (Year 2+)
- Patterns emerge across engagements
- c2L becomes less "Ahiya + AI" and more "system that produces systems"
- New offers become faster to create and deliver
- c2L approaches independence

---

**Vision Status:** VISIONED
**Ready for:** Master Planning
