# Explorer 1 Report: StatViz Outreach Architecture Analysis for c2L-Reach

## Executive Summary

StatViz has TWO distinct email systems: (1) a **transactional email service** (`lib/email/`) using Resend SDK for payment confirmations and report delivery, and (2) a **manual outreach system** (`outreach/colleges/`) that is a flat-file CSV + markdown template approach with no automation whatsoever -- emails are composed from templates and sent manually through Gmail MCP. The c2L-Reach system should replicate the outreach/colleges pattern (contact CSV, markdown templates, batch tracking, pipeline stages) while using the Gmail MCP sending mechanism from the stat-deliver agent. The system MUST be built dormant with multiple safety layers preventing accidental sends.

## Discoveries

### 1. StatViz Has Two Completely Separate Email Systems

**Transactional Email (lib/email/):**
- Uses **Resend SDK** (`resend` npm package) with API key (`RESEND_API_KEY`)
- Sends payment confirmations and report delivery emails
- Has HTML templates, error handling, status tracking (pending/sent/failed/resent)
- Integrated with Prisma DB for invoice records
- Professional error class hierarchy
- Full test suite with vitest mocks
- Sends from `noreply@statviz.xyz` (verified domain in Resend)

**Outreach System (outreach/colleges/):**
- Pure flat files -- CSV for contacts, markdown for templates
- NO code, NO automation, NO server
- Emails are manually composed using the template and sent through Gmail
- Contact tracking is done by editing the CSV directly
- Batch tracking by date-named directories (e.g., `batches/2026-01-14/`)
- The batch directory for 2026-01-14 is empty -- batches were planned but seem unused

**Key insight:** The outreach system is NOT a software system at all. It is a manual workflow documented in files. The "stat-reach" referenced in the vision is this manual CSV + template approach, not a coded application.

### 2. Gmail MCP Is the Actual Sending Mechanism for Outreach

The `2l-stat-deliver` agent reveals the real sending mechanism:
- **Primary:** `/home/ahiya/.mcp-gsuite/send_email.py` -- a Python script using `mcp_gsuite.gmail.GmailService`
- **Fallback:** `mcp__gsuite__create_gmail_draft` MCP tool (creates draft, manual send)
- **Accounts configured:** `ahiya.butman@gmail.com` (personal), `statviz.reports@gmail.com` (business)
- OAuth2 credentials stored at `/home/ahiya/.mcp-gsuite/.oauth2.{email}.json`
- The script accepts `--html`, `--file`, `--cc` flags
- There is also a `send_email_with_attachment.py` for emails with file attachments

**For c2L-Reach:** Emails would be sent through `ahiya.butman@gmail.com` (personal, since there is no c2L-specific Gmail account yet), or a new email could be configured.

### 3. Contact Schema Pattern from StatViz

The `college-targets.csv` has this schema:
```
priority, college, department, contact_name, role, email, phone, website, status, last_contact, next_action, notes
```

Pipeline stages defined in `README.md`:
| Status | Meaning |
|--------|---------|
| `pending` | No contact yet |
| `contacted` | First email/message sent |
| `in_progress` | In conversation |
| `meeting_scheduled` | Meeting set |
| `pilot` | In pilot |
| `active` | Active client |
| `closed_lost` | Not relevant |

Workflow documented:
1. Pre-contact research (find email, check LinkedIn, read website)
2. First contact (send email from template, update status to `contacted`, set `last_contact`)
3. Follow-up (4 days: reminder, 1 week: try phone)
4. After conversation (update notes, set next_action)

### 4. Email Template Pattern

The outreach email template (`email-template.md`) follows a pattern:
- Hebrew-primary (RTL)
- Personal greeting with name placeholder `[שם]`
- Establishes credibility with existing client reference (Herzog College)
- Names the specific pain (end-of-semester crunch, volume, speed)
- Offers zero-risk pilot (free, one project)
- Clear contact info (phone + email)
- Short LinkedIn/follow-up version included
- "What NOT to say" section (avoid AI, automation terminology)

**Critical patterns for c2L customs broker emails:**
- Reference StatViz success as credibility signal
- Name the specific customs pain (clerks, costs, port delays, data entry errors)
- Offer zero-risk first step (free exploration call)
- Hebrew primary, professional but personal tone
- Avoid "AI" or "automation" framing -- focus on outcomes

### 5. HTML Email Template Design System

StatViz has a consistent branded HTML email template pattern used across:
- Payment confirmation (`templates.ts`)
- Report delivery (`report-delivery-template.ts`)
- Institutional one-pager (`conversion/institutional.html`)

Common design elements:
- Blue gradient header (`#3b82f6` to `#1d4ed8`)
- RTL Hebrew (`dir="rtl"`)
- Light blue info cards with rounded corners
- White cards with subtle borders for data fields
- Green accent for success/money values (`#059669`)
- CTA button with blue gradient and shadow
- Professional footer
- Font: Arial/Segoe UI for email, Rubik for web pages
- Max width: 600px (standard email width)

### 6. Campaign Management is Manual

There is no automated campaign management in StatViz. The approach is:
- CSV file is the single source of truth for contacts
- Priority column drives outreach order
- Status updates are manual edits to the CSV
- Batch directories were created but remain unused
- No open/click tracking
- No automated follow-up sequences
- No scheduling or queuing

This is appropriate for c2L's scale (10 contacts) -- overengineering a campaign system would be waste.

## Patterns Identified

### Pattern 1: Flat-File Contact Management
**Description:** CSV file as the contact database, edited directly
**Use Case:** Small-scale outreach (10-50 contacts) where a database is overkill
**Example:** `contacts.csv` with columns for contact info, stage, and tracking
**Recommendation:** Yes -- replicate this exactly for c2L. 10 customs broker contacts do not need a database.

### Pattern 2: Markdown Email Templates with Placeholders
**Description:** Email templates as markdown files with `[name]`, `[company]` placeholders
**Use Case:** Personalized outreach emails where the template is reviewed before each send
**Example:** `email-template.md` with Hebrew body, greeting placeholders, and pitch points
**Recommendation:** Yes -- create c2L-specific templates with customs broker pain points and c2l.dev links.

### Pattern 3: Gmail MCP for Sending
**Description:** Using the `send_email.py` helper or GSuite MCP to send via Gmail API
**Use Case:** Sending emails through Claude Code workflow with human approval
**Example:** `send_email.py ahiya.butman@gmail.com broker@company.com "Subject" body.html --file --html`
**Recommendation:** Yes, but with DORMANCY ENFORCEMENT. The sending mechanism exists and works. For c2L-Reach, we document how it would be used but include explicit blockers.

### Pattern 4: Approval Gate Before Sending
**Description:** The stat-deliver agent shows a "Request Approval" step -- email is drafted, shown to operator, and only sent on explicit approval
**Use Case:** Any email that goes to a real person
**Example:** Step 3 in stat-deliver: "Return draft to orchestrator for operator approval"
**Recommendation:** Critical for c2L-Reach. Every email must pass through human approval, especially since the system is dormant.

### Pattern 5: Batch Tracking by Date
**Description:** `batches/YYYY-MM-DD/` directories to track when outreach was sent
**Use Case:** Recording which contacts were reached in which batch
**Example:** `batches/2026-01-14/` (empty in StatViz but structure exists)
**Recommendation:** Include the structure. When c2L-Reach is activated, each send session creates a batch directory with send logs.

## Complexity Assessment

### Low Complexity Areas
- **Contact CSV creation**: Straightforward file with columns for customs broker data. Just need to define the right schema.
- **Email template creation**: Markdown file with placeholders. Hebrew copy requires thought but not code.
- **Directory structure**: Flat-file approach means no database, no migrations, no ORM.
- **README/workflow docs**: Document the manual process.

### Medium Complexity Areas
- **Dormancy enforcement**: Multiple layers needed to prevent accidental sends. This requires careful design of safeguards.
- **Preview/compose command**: A Claude Code command that reads the template and a contact, personalizes the email, and shows a preview without sending. Needs template interpolation logic.
- **Campaign tracking schema**: Deciding the right columns and stages for customs broker pipeline. Different from colleges.

### High Complexity Areas (None)
- At 10 contacts with flat files, there is nothing genuinely complex here. The risk is not complexity but accidental activation.

## Technology Recommendations

### Primary Stack
- **Storage:** Flat files (CSV + YAML + Markdown) -- no database needed for 10 contacts
- **Email Sending (when activated):** Gmail MCP via `send_email.py` helper script at `/home/ahiya/.mcp-gsuite/send_email.py`
- **Templates:** Markdown with placeholder syntax (`{{name}}`, `{{company}}`) for programmatic interpolation, or `[name]` for manual use (matching StatViz pattern)
- **Language:** Hebrew primary (matching target market), file structure in English

### Supporting Libraries
- None needed for the flat-file approach
- If a preview/compose helper is built: simple Node.js/TypeScript script that reads CSV + template, interpolates, and outputs HTML to stdout
- The existing `send_email.py` at `/home/ahiya/.mcp-gsuite/` handles the actual Gmail integration

### What NOT to Use
- **Resend SDK:** StatViz uses this for transactional emails (payment confirmations). c2L-Reach is cold outreach -- sending through a personal Gmail account is more appropriate and builds trust (real person, not a platform)
- **Database (Prisma, Supabase):** Overkill for 10 contacts
- **Email marketing platforms (Mailchimp, SendGrid):** Overkill and adds deliverability concerns for cold outreach

## Integration Points

### External APIs
- **Gmail API (via MCP GSuite):** Used for sending when activated. Complexity: LOW (already working for StatViz). Consideration: May need a new Gmail account for c2L outreach, or use `ahiya.butman@gmail.com`.

### Internal Integrations
- **c2L-Reach emails** link to **c2l.dev/customs** (offer page from iteration 1)
- **Contact CSV** references companies found via customs broker directories
- **Batch logs** record which contacts were reached

### Cross-System References
- Email templates must contain the correct URL to c2l.dev/customs
- CTA in emails must match CTA on the offer page (phone, email, WhatsApp -- whatever was decided in iteration 1)

## Risks & Challenges

### Critical Risk: Accidental Email Sends
**Impact:** CATASTROPHIC -- sending unfinished emails to real brokers before the system is ready
**Mitigation:** Multi-layer dormancy enforcement:

1. **DORMANT flag in config:** `reach/config.yaml` with `status: DORMANT` and `send_enabled: false`
2. **No real email addresses in active files:** Store real broker emails in a separate `contacts-real.csv` that is gitignored. Working templates use `test@example.com`
3. **Preview-only command:** The Claude Code workflow only previews -- never sends
4. **send_email.py is NOT in this repo:** The sending mechanism lives at `/home/ahiya/.mcp-gsuite/`, completely outside c2L
5. **README with bold warnings:** Every file touching email includes a warning about dormancy
6. **No automation:** Everything is manual -- there is no code that can accidentally batch-send

### Medium Risk: Email Content Quality
**Impact:** Poor emails get zero responses (wasted contacts)
**Mitigation:** Multiple template versions, review cycle, study of StatViz templates that worked
**Likelihood:** Medium -- the StatViz template pattern is proven but customs brokerage is a different market

### Low Risk: Gmail Deliverability
**Impact:** Emails go to spam
**Mitigation:** Send from personal Gmail (better deliverability than marketing tools for cold B2B), keep volume low (10 emails)
**Likelihood:** Low at this volume

## Recommendations for Planner

1. **Replicate the StatViz flat-file pattern exactly.** The outreach/colleges structure is the right model: CSV for contacts, markdown for templates, batch directories for tracking, README for workflow docs. No database, no server, no automation. This is a 10-contact system.

2. **Create a `reach/` directory at the c2L repo root** with this structure:
   ```
   reach/
     README.md              # Workflow docs, DORMANCY WARNING
     config.yaml            # status: DORMANT, pipeline stages definition
     contacts.csv           # Schema only (test data), real contacts gitignored
     contacts-real.csv      # GITIGNORED -- actual broker contacts
     templates/
       outreach-v1.md       # Hebrew email template
       outreach-v1.html     # HTML version for rich email
       follow-up-v1.md      # Follow-up template
     batches/               # Empty, will hold send logs when activated
     scripts/
       preview.ts           # Optional: reads CSV + template, outputs preview
   ```

3. **Define customs broker pipeline stages** adapted from StatViz:
   | Stage | Meaning |
   |-------|---------|
   | `lead` | Identified, needs research |
   | `researched` | Email verified, background checked |
   | `ready` | Email composed, ready for review |
   | `contacted` | First email sent |
   | `responded` | Broker replied |
   | `call_scheduled` | Discovery call set |
   | `exploring` | In explore phase with c2L |
   | `closed_won` | Engagement started |
   | `closed_lost` | Not interested |

4. **Enforce dormancy through architecture, not discipline.** Five concrete measures:
   - `config.yaml` with `status: DORMANT`
   - Real contacts in gitignored file
   - No send commands built -- only preview
   - Sending mechanism lives outside the repo
   - Bold warnings in every file

5. **Email template should follow StatViz patterns that worked.** Hebrew primary, personal tone, name their specific pain, offer zero-risk first step, include social proof (reference StatViz/Herzog College), avoid "AI" and "automation" terminology, clear CTA.

6. **Contact schema for customs brokers** should include location (Ashdod/Haifa/Ben Gurion), company size estimate, and source where they were found -- these are critical for personalization.

7. **Builder scope is small and should NOT be split.** This is a flat-file system with ~10 files. One builder can handle the full reach directory, templates, and contact schema. A second builder could handle lead research (finding 10 real brokers), but that is a research task, not a coding task.

## Resource Map

### Critical Files to Study (StatViz Reference)
- `/home/ahiya/Ahiya/2L/Prod/biz/StatViz/outreach/colleges/README.md` -- workflow docs, pipeline stages
- `/home/ahiya/Ahiya/2L/Prod/biz/StatViz/outreach/colleges/email-template.md` -- email template pattern
- `/home/ahiya/Ahiya/2L/Prod/biz/StatViz/outreach/colleges/college-targets.csv` -- contact CSV schema
- `/home/ahiya/Ahiya/2L/Prod/biz/StatViz/lib/email/report-delivery-template.ts` -- branded HTML email template
- `/home/ahiya/Ahiya/2L/Prod/biz/StatViz/conversion/onepager-v3.md` -- conversion copy patterns
- `/home/ahiya/Ahiya/2L/Prod/biz/StatViz/.claude/agents/2l-stat-deliver.md` -- Gmail sending workflow

### Sending Infrastructure (External to c2L)
- `/home/ahiya/.mcp-gsuite/send_email.py` -- Gmail sending script
- `/home/ahiya/.mcp-gsuite/send_email_with_attachment.py` -- Gmail with attachments
- `/home/ahiya/.mcp-gsuite/.accounts.json` -- configured Gmail accounts
- `/home/ahiya/.mcp-gsuite/.oauth2.ahiya.butman@gmail.com.json` -- OAuth2 credentials

### c2L Context
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/.2L/plan-1/vision.md` -- full vision including reach requirements
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/.2L/plan-1/master-plan.yaml` -- iteration-2 scope definition
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/` -- iteration-1 output (c2l.dev site)

### Key Dependencies
- **Gmail MCP (mcp-gsuite):** Already installed and configured with OAuth2 credentials for `ahiya.butman@gmail.com`
- **c2l.dev/customs page:** Must exist before outreach emails link to it (iteration-1 dependency)

## Questions for Planner

1. **Which Gmail account for c2L outreach?** `ahiya.butman@gmail.com` is personal and already configured. Should a new account (e.g., `reach@c2l.dev` or `ahiya@c2l.dev`) be created? This affects OAuth2 setup.

2. **Should the HTML email template reuse StatViz's blue gradient design system, or should c2L have its own brand colors?** The StatViz templates are proven and professional, but c2L is a separate brand.

3. **Is lead research (finding 10 real customs brokers) in scope for builders, or is that a manual task for Ahiya?** The master plan says "Research and find 10 real customs broker leads with verified emails" -- this may require browsing customs broker directories, LinkedIn research, etc. which is better suited to a human or a research-focused agent.

4. **Should the preview/compose helper script be a TypeScript file in `reach/scripts/`, or a Claude Code command/agent?** A Claude Code agent that reads the CSV and template, personalizes, and shows a preview for approval would be more aligned with how c2L operates.

5. **What CTA was decided in iteration 1?** The email template needs to match the offer page CTA. Need to check iteration-1 outputs.
