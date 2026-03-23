# Explorer 2 Report: Customs Broker Lead Research & Email Template Strategy

## Executive Summary

This report provides the complete intelligence needed to build c2L-Reach: a dormant outreach system for 10 Israeli customs broker leads. The system follows the proven pattern from StatViz's college outreach (CSV-based contact tracking, Hebrew email templates, priority-ordered workflow) but adapted for customs broker decision-makers. The report includes three Hebrew email templates aligned with the live offer page at c2l.dev/customs, a lead data structure with sourcing guidance for Ahiya to fill manually, a 3-touch campaign cadence, and safety mechanisms that make accidental sends impossible.

## Discoveries

### 1. Reference Implementation: StatViz Outreach Pattern

The StatViz college outreach at `/home/ahiya/Ahiya/2L/Prod/biz/StatViz/outreach/colleges/` provides a proven, lightweight pattern that c2L-Reach should mirror:

**What StatViz uses:**
- `college-targets.csv` -- flat CSV with columns: priority, institution, department, contact_name, role, email, phone, website, status, last_contact, next_action, notes
- `email-template.md` -- Markdown file with Hebrew templates (main + short follow-up), including explicit "what NOT to say" guidance
- `README.md` -- Workflow documentation with status values, priority tiers, and step-by-step process

**Key pattern elements that work:**
- CSV over database: simple, editable in any text editor or spreadsheet, version-controlled in git, zero infrastructure
- Status pipeline: `pending` -> `contacted` -> `in_progress` -> `meeting_scheduled` -> `pilot` -> `active` -> `closed_lost`
- Priority tiers: contacts ranked by readiness (1 = warmest, highest = needs more research)
- Explicit workflow: what to do before contacting, what to do after, when to follow up
- "What NOT to say" section: crucial for domain-specific outreach (StatViz warns against saying "AI" in academic context)

**What needs adaptation for customs brokers:**
- Different status values (customs brokers have a different sales cycle than colleges)
- Different contact fields (company size, location, specialization matter for customs brokers)
- Different "what NOT to say" (customs brokers have different sensitivities than academics)
- Different template tone (peer-to-peer professional vs. service provider to institution)

### 2. The Offer Page as Email Anchor

The live offer page at `/customs` (built in iteration 1) contains the exact content emails must reference. Critical alignment points:

**From `lib/constants.ts`:**
- Phase 1 price: 5,000 NIS (this is the email's primary call-to-action anchor)
- Total price: 150,000 NIS
- WhatsApp URL: `https://wa.me/972587789019?text=...` (emails should link to the page, not directly to WhatsApp)
- Email: ahiya.butman@gmail.com
- Phone: 058-778-9019

**From `/customs` page content -- key phrases emails should echo:**
- "עמילי מכס משלמים חצי מיליון עד מיליון וחצי שקל בשנה על פקידי הקלדה" (the headline)
- "לא כלי שעוזר, מערכת שנושאת אחריות" (the differentiator)
- "שלב ראשון — חקירה — עולה 5,000 שקל" (the low-risk entry)
- "אחרי כל שלב אפשר לעצור — בלי התחייבות קדימה" (the exit ramp story)
- "אין חוזה תחזוקה שנתי" (the anti-lock-in)

**The email-to-page flow:**
1. Email names the broker's specific pain
2. Email mentions the low-risk first step (5,000 NIS)
3. Email links to `https://c2l.dev/customs` for full details
4. Page has WhatsApp/phone/email CTAs
5. Broker contacts Ahiya through their preferred channel

### 3. Israeli Customs Broker Lead Sourcing

**Where to find contacts (for Ahiya to research manually):**

**Tier 1 -- Highest quality sources:**
- **Israel Customs Brokers & Freight Forwarders Association (לשכת סוכני מכס ומשלחים בינלאומיים בישראל)**: The professional association. Has a member directory. Website: isfa.org.il. Members are licensed, active brokers.
- **Israel Tax Authority licensed broker list**: The customs authority (רשות המסים) maintains a public register of licensed customs brokers (עמילי מכס מורשים). This is the authoritative source.
- **LinkedIn search**: "עמיל מכס" OR "customs broker" location:Israel. Filter for Owner, Managing Director, CEO. Many Israeli customs brokers have LinkedIn profiles.

**Tier 2 -- Good supplementary sources:**
- **Israeli Yellow Pages (דפי זהב)**: Search category "עמילי מכס" in Ashdod, Haifa, Tel Aviv area. Gives company name, phone, sometimes email.
- **Google Maps**: Search "עמיל מכס" in Ashdod port area, Haifa port area, Ben Gurion cargo area. Business listings include websites and phone numbers.
- **Shipping industry directories**: ZIM's agent directory, port authority business directories.
- **Chamber of Commerce directories**: Ashdod and Haifa chambers of commerce.

**Tier 3 -- Research validation:**
- **Company websites**: Once a company is identified, its website often lists the managing broker and contact details.
- **Companies Registrar (רשם החברות)**: For verifying company details and active status.

### 4. Lead Data Structure Design

Based on the StatViz pattern and customs broker specifics:

**CSV columns for `customs-broker-targets.csv`:**

```
priority,company_name,company_name_he,contact_name,role,email,phone,location,company_size,specialization,website,linkedin,status,last_contact,next_action,notes
```

**Column definitions:**
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| priority | number | 1=warmest lead, 10=coldest | 3 |
| company_name | string | Company name in English | Amit Customs |
| company_name_he | string | Company name in Hebrew | עמית עמילות מכס |
| contact_name | string | Decision maker's full name | ישראל כהן |
| role | string | Their role (Hebrew) | בעלים / מנהל |
| email | string | Verified email address | israel@amitcustoms.co.il |
| phone | string | Direct phone or mobile | 050-1234567 |
| location | string | City/area | אשדוד |
| company_size | string | Estimated employee count | 10-20 |
| specialization | string | Import focus if known | ייבוא סחורות כלליות |
| website | string | Company website URL | https://amitcustoms.co.il |
| linkedin | string | Contact's LinkedIn URL | linkedin.com/in/... |
| status | string | Pipeline status | pending |
| last_contact | string | Date of last outreach | |
| next_action | string | What to do next | לשלוח מייל ראשון |
| notes | string | Free-form notes | הגיע דרך לינקדאין, חברה ותיקה |

**Status values (adapted from StatViz for customs broker sales cycle):**

| Status | Hebrew | Meaning |
|--------|--------|---------|
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

### 5. Email Verification Strategy

Since we are NOT scraping data -- Ahiya fills in contacts manually -- verification happens during the manual research process:

**Pre-send verification checklist (per contact):**
1. Email format looks correct (not generic info@, not bounced-looking)
2. Company website is active (confirms the business is operating)
3. Contact name matches a real person findable on LinkedIn or company website
4. Phone number format is valid Israeli mobile (05X) or landline (0X-XXXXXXX)
5. Role confirms decision-making authority (owner, managing director, not a clerk)

**Email validation patterns:**
- Israeli customs broker emails typically follow: `name@company.co.il` or `name@company.com`
- Avoid info@, office@, contact@ -- these go to secretaries, not decision makers
- If only a general email is available, note it in `notes` column and try to find a direct email via LinkedIn

## Email Template Design

### Template 1: Cold Outreach (מייל ראשון)

**Subject line options (pick one per send -- A/B test across contacts):**
- **A:** `כמה אתה מוציא על פקידי הקלדה בשנה?`
- **B:** `מערכת שמחליפה את עבודת ההקלדה — בלי חוזה תחזוקה`
- **C:** `{company_name_he} — חיסכון של מאות אלפי שקלים בשנה`

**Body:**

```
שלום {contact_name},

אני אחיה בוטמן. אני בונה מערכות שמחליפות עבודת הקלדה ידנית — לא כלים שעוזרים, מערכות שנושאות אחריות על התוצאה.

הפניה אליך כי אני יודע מה עולה להפעיל צוות פקידי הקלדה בעמילות מכס: 500,000 עד 1,400,000 שקל בשנה. וזה לפני שמחשבים טעויות, תיקוני רשימון, ועיכובים בנמל.

בניתי כבר פלטפורמת B2B עובדת (StatViz — statviz.xyz). עכשיו אני מתמחה באוטומציה של מסמכי מכס — שטר מטען, חשבונית מסחרית, רשימת אריזה → נתונים מוכנים לשע"ר.

המודל שלי פשוט:
• שלב ראשון (חקירה) עולה 5,000 ₪ — אני בודק את המסמכים והתהליכים שלך ומחזיר דוח מפורט
• אחרי כל שלב אפשר לעצור — בלי התחייבות קדימה
• אין חוזה תחזוקה שנתי

הפרטים המלאים כאן: https://c2l.dev/customs

אשמח לשיחה קצרה של 10 דקות לשמוע איך העבודה נראית אצלכם.

אחיה בוטמן
058-778-9019
ahiya.butman@gmail.com
```

**Design rationale:**
- Opens with "I know what this costs you" -- names the exact pain range from the offer page
- Uses customs-specific terminology (שע"ר, רשימון, שטר מטען) to signal domain knowledge
- StatViz as proof of work (mirrors offer page's trust section)
- Anchors on the 5,000 NIS entry point -- low risk, concrete
- Links to offer page for full details -- does not dump everything in the email
- Asks for "10 minutes" -- specific, small time commitment
- Signature matches the offer page's contact details exactly

### Template 2: Follow-up (תזכורת — 4-5 days after Template 1)

**Subject line options:**
- **A:** `Re: {original_subject}` (threading)
- **B:** `לגבי האוטומציה של מסמכי מכס`

**Body:**

```
שלום {contact_name},

שלחתי לך מייל לפני כמה ימים על אוטומציה של עבודת ההקלדה בעמילות מכס.

אני מבין שיום העבודה עמוס. רק רציתי לוודא שהמייל הגיע.

הרעיון בקצרה: מערכת שקולטת את המסמכים שלך (B/L, חשבונית, רשימת אריזה) ומוציאה נתונים מובנים מוכנים להזנה. שלב ראשון — חקירת התהליך שלך — עולה 5,000 ₪ בלבד ומחזיר דוח שלך גם אם לא ממשיכים.

https://c2l.dev/customs

אשמח לשיחה קצרה כשנוח לך.

אחיה
058-778-9019
```

**Design rationale:**
- Short -- respects the broker's time
- Does not repeat the full pitch -- summarizes in one sentence
- Repeats the 5,000 NIS anchor and the "the report is yours even if you stop" value proposition
- Drops the last name from signature -- warmer, more personal (Israeli B2B norm)
- Still links to offer page

### Template 3: Value-Add (ערך מוסף — 7-10 days after Template 2, only if no response)

**Subject line options:**
- **A:** `נתון שאולי מעניין אותך`
- **B:** `מה עולה תיקון רשימון?`

**Body:**

```
שלום {contact_name},

מספר שאולי מוכר לך: 5-15% מהרשימונות דורשים תיקון. כל תיקון עולה זמן, ולפעמים קנס.

חלק גדול מהטעויות האלה קורה בשלב ההקלדה — שדה שהועתק לא נכון, מספר מכולה שהתחלף, ערך שנרשם במטבע לא נכון.

מערכת שקוראת את המסמך המקורי ומייצרת את הנתונים אוטומטית מורידה את שיעור הטעויות בצורה משמעותית. וזה עוד לפני שמדברים על חיסכון בכוח אדם.

אם זה מעניין — כל הפרטים כאן: https://c2l.dev/customs
ואם לא — אני מבין לגמרי, ולא אפנה שוב.

בהצלחה,
אחיה
058-778-9019
```

**Design rationale:**
- Does NOT repeat the sales pitch. Leads with a specific pain point (declaration errors) and a specific insight
- Positions the system's value from an error-reduction angle rather than cost-reduction -- a different mental frame
- Explicitly promises to stop contacting if not interested -- builds respect, removes pressure
- This is the final email in the sequence. If no response, the contact moves to `dormant` status

### "What NOT to say" in emails (critical guidance for Ahiya)

Following the StatViz pattern of explicit anti-patterns:

1. **Do NOT say "AI" or "בינה מלאכותית" prominently** -- Israeli business owners associate AI with hype. The page says "מערכת" (system), not "AI." Keep it that way in emails. If asked directly, be honest, but do not lead with the AI angle.

2. **Do NOT say "replaces your employees"** -- This triggers defensiveness. Say "replaces the repetitive typing work" (מחליף את עבודת ההקלדה החוזרת). The offer page is careful about this too: "לא מבטיחים להחליף את כל הצוות."

3. **Do NOT promise specific accuracy numbers in emails** -- The offer page does not commit to specific accuracy percentages. Keep emails consistent with this. Validation phase exists for exactly this purpose.

4. **Do NOT use English marketing buzzwords** -- No "leverage," "scalable," "disruption," "game-changer." Hebrew business communication is direct. Talk like a professional, not a salesperson.

5. **Do NOT attach files to cold emails** -- They trigger spam filters and look like phishing. Link to the offer page only.

6. **Do NOT mention pricing beyond Phase 1** -- The 5,000 NIS entry point is the only price to mention in emails. Full pricing is on the offer page. Do not quote 150,000 NIS in a cold email -- it is a big number without context.

## Campaign Structure

### 3-Touch Sequence Per Contact

| Touch | Template | Timing | Purpose |
|-------|----------|--------|---------|
| 1 | Cold Outreach | Day 0 | Introduce the problem and solution, link to offer page |
| 2 | Follow-up | Day 4-5 | Gentle reminder, condensed pitch |
| 3 | Value-Add | Day 11-14 | Different angle (errors), explicit opt-out, final touch |

**After 3 touches with no response:** Contact status moves to `dormant`. No further emails for at least 60 days. Ahiya may revisit dormant contacts with a completely different angle later (e.g., after landing first client and having a case study).

### Timing Rules

- **Between Touch 1 and Touch 2:** 4-5 business days. Not 3 (feels pushy), not 7+ (they've forgotten).
- **Between Touch 2 and Touch 3:** 7-10 business days. Give them time. The value-add email works better with distance.
- **Day of week:** Sunday through Thursday (Israeli business week). Best send times: 09:00-10:00 or 14:00-15:00 Israel time.
- **Avoid:** Friday (short day), Saturday (Shabbat), Jewish holidays, Ramadan (if contacting Arab Israeli brokers).

### Batch Strategy

With only 10 contacts, batching is straightforward:
- **Wave 1 (contacts 1-5):** Send first, learn from responses (or lack thereof), adjust before Wave 2
- **Wave 2 (contacts 6-10):** Incorporate learnings from Wave 1
- **Gap between waves:** 3-5 business days

This means the full campaign for all 10 contacts takes approximately 4-5 weeks from first send to last follow-up.

### Response Handling

| Response Type | Action |
|---------------|--------|
| Positive reply ("interested, tell me more") | Move to `responded`. Schedule call. Stop email sequence. |
| Question ("how does it work?") | Move to `responded`. Answer directly. Link to offer page. |
| Negative reply ("not interested") | Move to `closed_lost`. Respond politely: "תודה על התגובה, בהצלחה." |
| Out of office | Note return date. Resume sequence after they're back. |
| Bounce / invalid email | Note in `notes`. Try to find correct email. |
| No response after all 3 touches | Move to `dormant`. |

## Safety Mechanisms

### Critical Constraint: DORMANT System

The master plan states: "c2L-Reach must NEVER be activated. Zero external contact until explicit approval."

The system must make accidental sends **structurally impossible**, not just "be careful."

### Safety Mechanism 1: No Send Capability in Code

The reach system should be built without any actual email-sending code. Specifically:

- **No SMTP configuration** -- no host, no port, no credentials anywhere in the codebase
- **No email API keys** -- no Resend key, no SES credentials, no Gmail MCP configuration
- **No `send()` function** -- the code should compose and preview emails, but have no function that actually transmits

The architecture should be:
```
compose(contact, template) -> PreviewEmail  // EXISTS
preview(PreviewEmail) -> console output     // EXISTS
send(PreviewEmail) -> void                  // DOES NOT EXIST
```

When Ahiya is ready to activate, he adds the send capability. Until then, it physically cannot send.

### Safety Mechanism 2: Dry-Run Mode (Default and Only Mode)

Every operation that touches contacts or composes emails should output to the console/terminal, not to any external service:

```
[DRY-RUN] Would send to: ישראל כהן <israel@amitcustoms.co.il>
[DRY-RUN] Subject: כמה אתה מוציא על פקידי הקלדה בשנה?
[DRY-RUN] Body preview (first 3 lines):
  שלום ישראל,
  אני אחיה בוטמן. אני בונה מערכות שמחליפות עבודת הקלדה ידנית...
[DRY-RUN] Link: https://c2l.dev/customs
[DRY-RUN] === EMAIL NOT SENT (dry-run mode) ===
```

### Safety Mechanism 3: DORMANT Flag in Configuration

The reach system's configuration file should have:

```yaml
# reach/config.yaml
mode: DORMANT  # DORMANT | DRY_RUN | LIVE
# DORMANT: No email operations at all. Only contact management.
# DRY_RUN: Compose and preview emails, but do not send.
# LIVE: Actually send emails. REQUIRES explicit activation.

# To activate, change to LIVE and set:
# smtp_configured: true
# confirmed_by_ahiya: true
# activation_date: YYYY-MM-DD
```

Even in the LIVE mode, the system should require `confirmed_by_ahiya: true` as a separate flag.

### Safety Mechanism 4: Git-Based Approval Trail

Before any mode change from DORMANT:
1. The configuration change must be committed to git
2. The commit message must include "ACTIVATION:" prefix
3. This creates an auditable trail of when outreach was activated

### Safety Mechanism 5: Preview Before Send Workflow

When Ahiya eventually activates the system, the workflow should be:

1. `reach preview --contact 1` -- Show the composed email for contact #1
2. `reach preview --all` -- Show all composed emails
3. `reach approve --contact 1` -- Mark contact #1 as approved for send
4. `reach send --approved-only` -- Send only approved emails

This means even in LIVE mode, no email goes out without explicit per-contact approval.

## Patterns Identified

### Pattern: CSV-First Contact Management

**Description:** Use a flat CSV file as the single source of truth for contacts, following the StatViz college outreach pattern. No database, no CRM, no external tools.

**Use Case:** Small-scale outreach (10-50 contacts) where the operator (Ahiya) needs to see, edit, and track contacts with zero infrastructure overhead.

**Example structure:**
```
reach/
  contacts/
    customs-broker-targets.csv    # The 10 leads
  templates/
    cold-outreach.md              # Template 1
    follow-up.md                  # Template 2
    value-add.md                  # Template 3
  config.yaml                     # Mode: DORMANT
  README.md                       # Workflow, status definitions, safety rules
```

**Recommendation:** Strongly recommended. This worked for StatViz and matches the scale. Ahiya can edit the CSV in any editor, track it in git, and never worry about database migrations. When the contact list grows beyond 50+, upgrade to a proper CRM -- but not now.

### Pattern: Template Composition with Personalization Tokens

**Description:** Markdown templates with `{token}` placeholders that get replaced from CSV row data at compose time.

**Tokens available:**
- `{contact_name}` -- from CSV `contact_name` column
- `{company_name_he}` -- from CSV `company_name_he` column
- `{company_name}` -- from CSV `company_name` column

**Recommendation:** Keep tokens minimal. Over-personalization in cold emails feels creepy ("I noticed you've been in business for 12 years..."). The three tokens above are sufficient.

### Pattern: Escalating Value, Decreasing Pressure

**Description:** The 3-email sequence moves from direct pitch (email 1) to reminder (email 2) to value-add with explicit opt-out (email 3). Each subsequent email is shorter and applies less pressure.

**Recommendation:** This matches Israeli B2B norms. Israelis respect directness but dislike being nagged. The explicit "I won't contact you again" in email 3 is culturally appropriate and practically useful (it closes the loop cleanly).

## Complexity Assessment

### High Complexity Areas

- **Hebrew email copy quality:** The templates must sound natural in Hebrew, use correct customs terminology, and strike the right tone (professional-direct, not salesy). This is content work, not code work. The templates provided in this report are a strong starting point but Ahiya should review and adjust to his voice before any activation.

### Medium Complexity Areas

- **Contact data collection:** Finding 10 real customs broker contacts with verified emails requires manual research by Ahiya. The system provides the structure (CSV columns, sourcing guidance, verification checklist) but the data itself must be gathered by a human with industry access.
- **Template composition engine:** Building the code that reads CSV + template, replaces tokens, and outputs a preview. Straightforward string manipulation but needs to handle Hebrew/RTL correctly in output.

### Low Complexity Areas

- **CSV file creation:** Creating the CSV with placeholder data for Ahiya to fill in. Trivial.
- **Config/safety layer:** A YAML config file and mode checks. Simple conditional logic.
- **README/workflow docs:** Markdown documentation following the StatViz pattern. Straightforward.
- **Directory structure:** Creating the reach/ directory with the right folder hierarchy. Trivial.

## Technology Recommendations

### Primary Approach: File-Based System (No Framework)

The reach system should be file-based, matching the StatViz pattern:

- **Contact storage:** CSV file, not a database
- **Templates:** Markdown files with token placeholders
- **Configuration:** YAML file
- **Composition logic:** TypeScript/Node.js script that reads CSV + template and outputs preview
- **No web framework needed** -- this is a CLI/script tool, not a web app

**Rationale:** The vision mentions deploying reach on Railway with Node.js, but for 10 contacts the simplest viable approach is a local script that Ahiya runs from Claude Code. No deployment needed for MVP. Railway can come later if the system needs to run automated sequences.

### Supporting Tools

- **csv-parse** (npm): For parsing the CSV file in Node.js. Handles quoted fields, commas in values.
- **yaml** (npm): For parsing config.yaml.
- **Gmail MCP** (mentioned in master plan scope): For eventual send capability through Claude Code. NOT configured in this iteration -- just documented as future integration point.

### File Location

The reach system should live at:
```
/home/ahiya/Ahiya/2L/Prod/biz/c2L/reach/
```

Sibling to the existing `site/` directory, following the project's pattern of top-level subsystems.

## Integration Points

### Email -> Offer Page Flow

- Every email links to `https://c2l.dev/customs`
- The offer page is already built and live (iteration 1)
- Emails reference the same 5,000 NIS Phase 1 price that appears on the page
- Emails use the same terminology as the page (מערכת, not AI; הקלדה, not automation)
- The signature email (ahiya.butman@gmail.com) matches the page's EMAIL constant
- The signature phone (058-778-9019) matches the page's PHONE_NUMBER constant

### Contact Data -> Template Composition

- CSV columns map directly to template tokens
- `{contact_name}` -> CSV `contact_name`
- `{company_name_he}` -> CSV `company_name_he`
- Template files use Markdown for readability but composition strips Markdown and outputs plain text email

### Safety Config -> All Operations

- config.yaml `mode` field gates every operation
- DORMANT: only CSV read/write, no email composition
- DRY_RUN: compose and preview, no send
- LIVE: compose, preview, send (with per-contact approval)

## Risks & Challenges

### Technical Risks

- **Hebrew text in email clients:** Hebrew emails can render incorrectly in some email clients (especially Outlook) if Content-Type and charset are not set correctly. Mitigation: when send capability is eventually added, ensure `Content-Type: text/plain; charset=UTF-8` and proper MIME headers for Hebrew.
- **Spam filter triggers:** Cold emails from a personal Gmail account (ahiya.butman@gmail.com) to business domains may trigger spam filters. Mitigation: (a) limit to 2-3 emails per day, (b) personalize each email (not identical), (c) include unsubscribe intent in email 3, (d) consider warming up a dedicated sending domain later.

### Content Risks

- **Template tone mismatch:** If the emails sound too formal, too casual, or too salesy, they will fail. Mitigation: Ahiya reviews and adjusts templates to match his natural voice. The templates in this report are a framework, not final copy.
- **Incorrect terminology:** Using the wrong Hebrew term for a customs concept would immediately signal "this person doesn't know the industry." Mitigation: the terminology reference from Explorer 2 iteration 1 is comprehensive. Cross-reference all Hebrew terms in templates against that reference.

### Process Risks

- **Ahiya doesn't fill in the CSV:** The system is useless without real contact data. The CSV ships with placeholder/example data that Ahiya must replace with real contacts before activation. Mitigation: make the placeholder data obviously fake (e.g., "ישראל ישראלי" as name, "example@example.co.il" as email) so it cannot be mistaken for real contacts.
- **Accidental activation:** Someone or something changes the config to LIVE mode. Mitigation: (a) no send code exists, (b) DORMANT is default, (c) activation requires both config change AND SMTP credentials which don't exist.

### Compliance Risks

- **Israeli anti-spam law (חוק התקשורת):** Israel's Spam Law (Amendment 40) requires consent for commercial emails sent to individuals. However, B2B emails to business addresses regarding services relevant to their business are generally permitted under the "legitimate interest" exception. Mitigation: (a) send only to business email addresses, (b) include clear opt-out in email 3, (c) respect any "stop" request immediately, (d) limit total emails per contact to 3.

## Recommendations for Planner

1. **Follow the StatViz outreach structure exactly.** CSV for contacts, Markdown for templates, README for workflow. The pattern is proven, simple, and requires zero infrastructure. Do not over-engineer this for 10 contacts.

2. **Build the reach system as a sibling directory to site/ at `/home/ahiya/Ahiya/2L/Prod/biz/c2L/reach/`.** This keeps the project structure clean: `site/` is the face, `reach/` is the outreach, both under the c2L repo root.

3. **Ship with placeholder data in the CSV.** The builder creates the CSV structure with 10 rows of clearly fake placeholder data. Ahiya fills in real contacts manually. The system should have a `reach validate` or similar check that flags placeholder data so Ahiya knows which contacts still need real data.

4. **Do NOT build send capability.** The builder implements compose and preview only. No SMTP, no API keys, no send function. This is the strongest safety guarantee. Send capability is a future iteration task.

5. **Templates should be editable Markdown files, not hardcoded in code.** Ahiya needs to adjust the tone and wording to match his voice. Templates as separate files make this easy without touching code.

6. **Include the "what NOT to say" guidance in the reach README.** Following the StatViz pattern, this is as important as the templates themselves.

7. **One builder can handle this entire iteration.** The work is: create directory structure, write CSV with columns and placeholder data, write 3 template files, write config.yaml, write README with workflow docs, write a simple TypeScript compose/preview script. Total estimated: 3-4 hours for one builder. If splitting into two builders, split as: Builder A = structure + docs (CSV, config, README), Builder B = templates + compose script.

8. **The compose/preview script should be runnable via `npx tsx reach/preview.ts` or similar.** Keep it simple -- a single TypeScript file that reads the CSV and templates, does token replacement, and prints the result. No complex CLI framework needed.

## Resource Map

### Critical Reference Files

- `/home/ahiya/Ahiya/2L/Prod/biz/StatViz/outreach/colleges/` -- Complete reference implementation (CSV + templates + README)
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/lib/constants.ts` -- Ahiya's contact details, WhatsApp URL, phase pricing (emails must match these exactly)
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/app/customs/page.tsx` -- Offer page content (emails must align with this messaging)
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/.2L/plan-1/iteration-1/exploration/explorer-2-report.md` -- Hebrew terminology reference, domain knowledge, tone guidance

### Key Dependencies

- **csv-parse** (npm): CSV parsing for the compose script
- **yaml** (npm): YAML parsing for config
- **TypeScript + tsx** (npm): For running the compose script without a build step
- **No deployment dependencies** -- this runs locally in Ahiya's dev environment

### Domain Terminology for Templates

From Explorer 2 iteration 1 -- the email templates use these terms and they must be used correctly:

| Hebrew | English | Used in Template |
|--------|---------|-----------------|
| עמיל מכס | Customs broker | "Cold outreach": context |
| פקידי הקלדה | Data entry clerks | "Cold outreach": pain point |
| רשימון | Customs declaration | "Value-add": error context |
| תיקון רשימון | Declaration amendment | "Value-add": pain point |
| שע"ר | SHAAR (customs system) | "Cold outreach": domain signal |
| שטר מטען | Bill of Lading | "Cold outreach": document type |
| חשבונית מסחרית | Commercial Invoice | "Cold outreach": document type |
| רשימת אריזה | Packing List | "Cold outreach": document type |
| מכולה | Container | Used in page, not in emails |

## Questions for Planner

1. **Should the reach system have its own `package.json` or share the site's?** Recommendation: own `package.json` in `reach/` directory. The site and reach have different dependencies and purposes.

2. **Is Gmail MCP available and configured?** The master plan mentions Gmail MCP for sending. If not configured, this is fine for iteration 2 (we are building dormant), but should be noted for future iterations.

3. **Does Ahiya want the compose/preview script to output HTML-formatted email or plain text?** Recommendation: plain text for now. HTML email is complex to render correctly across clients, and for personal-feeling B2B outreach, plain text is actually better (looks like a real person wrote it, not a marketing tool).

4. **How should the reach directory relate to git?** Should it be in the same repo as the site, or a separate repo? Recommendation: same repo (`c2L/reach/` alongside `c2L/site/`). The CSV with placeholder data is safe to commit. When Ahiya adds real contact data, he can add `reach/contacts/customs-broker-targets.csv` to `.gitignore` if he wants to keep real contacts private.

5. **Should there be a test suite for the compose/preview script?** Recommendation: yes, minimal tests that verify token replacement works correctly with Hebrew text and that DORMANT mode prevents composition. This can be 5-10 tests total.
