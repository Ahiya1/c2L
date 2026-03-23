# c2L-Reach: Customs Broker Outreach

> **STATUS: DORMANT** -- This system is built but NOT activated.
> Zero emails have been sent. Zero external contact has been made.
> Activation requires explicit approval from Ahiya.

## What This Is

A dormant outreach engine for customs broker leads. The system manages contacts in a CSV file, composes personalized Hebrew emails from Markdown templates, and previews them in the terminal. It follows the proven StatViz college outreach pattern (flat-file CSV + markdown templates) adapted for customs brokerage cold outreach. **There is no send function. The system cannot send emails.**

## Directory Structure

```
reach/
  README.md                  # This file
  config.yaml                # Mode: DORMANT, pipeline stages, campaign settings
  package.json               # Dependencies
  tsconfig.json              # TypeScript configuration
  vitest.config.ts           # Test configuration
  .gitignore                 # Ignores real contact data
  contacts/
    customs-broker-targets.csv       # Placeholder data (committed)
    customs-broker-targets-real.csv  # Real data (GITIGNORED -- create when ready)
  templates/
    cold-outreach.md         # Template 1: initial contact
    follow-up.md             # Template 2: 4-5 day reminder
    value-add.md             # Template 3: error-angle, final touch
  scripts/
    preview.ts               # Compose/preview CLI script
  lib/
    types.ts                 # TypeScript type definitions
    config.ts                # Config loading and validation
    contacts.ts              # CSV parsing and validation
    compose.ts               # Template composition (token replacement)
  __tests__/
    config.test.ts           # Config loading tests
    contacts.test.ts         # CSV parsing tests
    compose.test.ts          # Template composition tests
    preview.test.ts          # Preview script integration tests
  batches/
    .gitkeep                 # Empty dir for future batch logs
```

## Quick Start

```bash
# Install dependencies
cd reach && npm install

# List all contacts (works in DORMANT mode)
npm run validate-contacts

# Preview an email (requires DRY_RUN mode -- see Activation Checklist below)
# First change config.yaml mode to DRY_RUN, then:
npm run preview -- --contact 1 --template cold-outreach

# Preview all emails
npm run preview -- --all --template cold-outreach

# Run tests
npm run test

# Type check
npm run typecheck
```

### CLI Options

```
--contact <priority>    Preview email for a specific contact (by priority number)
--template <name>       Template to use: cold-outreach | follow-up | value-add
                        (default: cold-outreach)
--subject <key>         Subject variant: subject_a | subject_b | subject_c
                        (default: subject_a)
--all                   Preview emails for all contacts
--list                  List all contacts with their status
--help                  Show this help message
```

## Pipeline Stages

| Stage | Hebrew | Meaning |
|-------|--------|---------|
| `pending` | ממתין | Lead identified, not yet contacted |
| `contacted` | נוצר קשר | First email sent |
| `follow_up_1` | פולואפ 1 | First follow-up sent |
| `follow_up_2` | פולואפ 2 | Value-add email sent |
| `responded` | הגיב | Broker replied (any reply) |
| `call_scheduled` | נקבעה שיחה | Phone/video call scheduled |
| `exploring` | בתהליך חקירה | Phase 1 (Exploration) started |
| `closed_won` | סגירה | Engagement began |
| `closed_lost` | לא רלוונטי | Not interested / not a fit |
| `dormant` | רדום | No response after full sequence, revisit later |

## Campaign Cadence

### 3-Touch Sequence Per Contact

| Touch | Template | Timing | Purpose |
|-------|----------|--------|---------|
| 1 | `cold-outreach` | Day 0 | Introduce the problem and solution, link to offer page |
| 2 | `follow-up` | Day 4-5 | Gentle reminder, condensed pitch |
| 3 | `value-add` | Day 11-14 | Different angle (errors), explicit opt-out, final touch |

**After 3 touches with no response:** Move contact status to `dormant`. No further emails for at least 60 days.

### Timing Rules

- **Between Touch 1 and Touch 2:** 4-5 business days
- **Between Touch 2 and Touch 3:** 7-10 business days
- **Day of week:** Sunday through Thursday (Israeli business week)
- **Best send times:** 09:00-10:00 or 14:00-15:00 Israel time
- **Avoid:** Friday (short day), Saturday (Shabbat), Jewish holidays

### Batch Strategy

- **Wave 1 (contacts 1-5):** Send first, learn from responses
- **Wave 2 (contacts 6-10):** Incorporate learnings from Wave 1
- **Gap between waves:** 3-5 business days

## Template Editing Guide

Templates are in `templates/`. Each template has:

1. **Front matter** (between `---` markers): Subject line variants
2. **Body**: The email text with `{token}` placeholders

### Available Tokens

| Token | Source | Example |
|-------|--------|---------|
| `{contact_name}` | CSV `contact_name` column | ישראל כהן |
| `{company_name_he}` | CSV `company_name_he` column | עמית עמילות מכס |
| `{company_name}` | CSV `company_name` column | Amit Customs |

### How to Edit

1. Open the template file in any text editor
2. Edit the Hebrew text as needed
3. Keep `{token}` placeholders intact
4. Add/modify subject line variants in the front matter
5. Run `npm run preview -- --contact 1 --template <name>` to verify (requires DRY_RUN mode)

## What NOT to Say

**Critical anti-patterns for email content. Do NOT include these in any outreach.**

1. **Do NOT say "AI" prominently** -- Israeli business owners associate AI with hype. Use "מערכת" (system), not "בינה מלאכותית". If asked directly, be honest, but do not lead with the AI angle.

2. **Do NOT say "replaces your employees"** -- Triggers defensiveness. Say "replaces the repetitive typing work" (מחליף את עבודת ההקלדה החוזרת).

3. **Do NOT promise specific accuracy numbers** -- The offer page does not commit to specific accuracy percentages. Keep emails consistent.

4. **Do NOT use English marketing buzzwords** -- No "leverage," "scalable," "disruption," "game-changer." Hebrew business communication is direct. Talk like a professional, not a salesperson.

5. **Do NOT attach files to cold emails** -- They trigger spam filters and look like phishing. Link to the offer page only.

6. **Do NOT mention pricing beyond Phase 1** -- The 5,000 NIS entry point is the only price to mention in emails. Full pricing is on the offer page. Do not quote 150,000 NIS in a cold email.

## Contact Verification Checklist

Before activating, verify each contact row:

- [ ] Email format is correct (not generic info@, not bounced-looking)
- [ ] Company website is active (confirms the business is operating)
- [ ] Contact name matches a real person findable on LinkedIn or company website
- [ ] Phone number format is valid Israeli mobile (05X) or landline (0X-XXXXXXX)
- [ ] Role confirms decision-making authority (owner, managing director, not a clerk)
- [ ] Location is accurate
- [ ] Specialization is accurate
- [ ] Notes field has been updated from placeholder text

## Activation Checklist

### Step 1: Fill in Real Contacts

1. Create `contacts/customs-broker-targets-real.csv` with real contact data
2. Replace the placeholder CSV with real data, OR keep placeholder as reference
3. Verify each contact against the checklist above
4. Run `npm run validate-contacts` to check for remaining placeholder data

### Step 2: Review Templates

1. Read each template aloud in Hebrew -- does it sound natural?
2. Check that all links point to `https://c2l.dev/customs`
3. Verify phone (058-778-9019) and email (ahiya.butman@gmail.com) are correct
4. Choose subject line variants for each template

### Step 3: Switch to DRY_RUN Mode

1. Edit `config.yaml`: change `mode: DORMANT` to `mode: DRY_RUN`
2. Run `npm run preview -- --contact 1 --template cold-outreach`
3. Review the composed email carefully
4. Run `npm run preview -- --all --template cold-outreach` to see all emails
5. Commit the config change with message: "ACTIVATION: switch reach to DRY_RUN mode"

### Step 4: Compose and Send (Manual Process)

When ready to send (not through this system -- via Gmail MCP):

1. Preview the email: `npm run preview -- --contact N --template cold-outreach`
2. Copy the composed email
3. Send through Gmail MCP or manually through Gmail
4. Update the CSV: change status to `contacted`, set `last_contact` date
5. Set `next_action` to follow-up date

## Response Handling Guide

| Response Type | Action |
|---------------|--------|
| Positive reply ("interested, tell me more") | Move to `responded`. Schedule call. Stop email sequence. |
| Question ("how does it work?") | Move to `responded`. Answer directly. Link to offer page. |
| Negative reply ("not interested") | Move to `closed_lost`. Respond politely. |
| Out of office | Note return date. Resume sequence after they return. |
| Bounce / invalid email | Note in `notes`. Try to find correct email. |
| No response after all 3 touches | Move to `dormant`. |
