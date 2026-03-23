# Technology Stack

## Core Architecture

**Decision:** Flat-file system with a single TypeScript compose/preview script. No web framework, no server, no database.

**Rationale:**
- The system manages 10 contacts. A database is orders of magnitude more infrastructure than needed.
- The StatViz college outreach uses this exact pattern and it works.
- CSV files are editable in any text editor, versionable in git, and readable by humans.
- Markdown templates are readable and editable without tooling.
- A single TypeScript script handles all composition logic -- no framework overhead.

**Alternatives Considered:**
- **Express/Fastify server with SQLite**: Rejected. There is no reason to run a server for 10 contacts with no automation.
- **Railway-deployed Node.js app**: Rejected. The master plan mentioned Railway, but both explorers agree local-only is correct for MVP. Railway adds deployment complexity with zero benefit at this scale.
- **Resend SDK for email**: Rejected. Resend is used by StatViz for transactional emails (payment confirmations). Cold outreach from a personal Gmail account has better deliverability and builds trust. The sending mechanism (Gmail MCP) already exists outside this repo.

## Storage

**Decision:** Flat files -- CSV for contacts, Markdown for templates, YAML for configuration.

**Rationale:**
- 10 contacts do not need a database
- CSV is the universal data exchange format -- editable in VS Code, Excel, Google Sheets
- Git tracks changes to contacts and templates
- Zero infrastructure: no migrations, no ORM, no connection strings

**File Formats:**
| File Type | Format | Parser |
|-----------|--------|--------|
| Contacts | CSV (UTF-8) | `csv-parse` npm package |
| Templates | Markdown (UTF-8) | Raw string read + token replacement |
| Configuration | YAML | `yaml` npm package |
| Batch logs | Markdown | Written by operator (future) |

## Email Templates

**Decision:** Plain-text Markdown files with `{token}` placeholder syntax.

**Rationale:**
- Plain text emails perform better for cold B2B outreach (they look like a real person wrote them, not a marketing tool)
- Markdown is human-readable and editable without tooling
- Token syntax `{contact_name}` is simple and unambiguous
- Templates as separate files (not embedded in code) allow Ahiya to edit tone and wording without touching TypeScript

**Token Syntax:**
- `{contact_name}` -- replaced from CSV `contact_name` column
- `{company_name_he}` -- replaced from CSV `company_name_he` column
- `{company_name}` -- replaced from CSV `company_name` column

**Template Language:** Hebrew primary (matching target market). File names and code are in English.

## TypeScript Runtime

**Decision:** TypeScript files executed via `tsx` (no build step).

**Rationale:**
- `tsx` runs TypeScript directly without compilation -- ideal for scripts
- The site already uses TypeScript, maintaining consistency across the project
- Type safety for CSV parsing and template composition catches errors early
- No build configuration needed

**Version:** TypeScript 5.x (same as `site/`)

## Dependencies

**Decision:** Minimal dependency set -- 4 runtime packages, 2 dev packages.

### Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `csv-parse` | ^5.6 | Parse CSV contact files. Handles quoted fields, commas in values, UTF-8 Hebrew text. |
| `yaml` | ^2.7 | Parse `config.yaml` configuration file. |
| `chalk` | ^5.4 | Colored terminal output for preview display (DRY_RUN banners, field highlighting). |
| `zod` | ^3.24 | Validate CSV row data, config structure, and template tokens at runtime. |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `tsx` | ^4.19 | Run TypeScript files directly without compilation. |
| `vitest` | ^3 | Test framework (same as site/ for consistency). |
| `typescript` | ^5 | Type checking. |
| `@types/node` | ^22 | Node.js type definitions. |

## Configuration

**Decision:** YAML configuration file at `reach/config.yaml` with three operational modes.

**Modes:**

| Mode | Behavior |
|------|----------|
| `DORMANT` | Default. Contact management only. Preview script refuses to compose emails. |
| `DRY_RUN` | Compose and preview emails to stdout. No send capability exists. |
| `LIVE` | Future mode. Requires send capability to be added (not built in this iteration). |

**Rationale:**
- YAML is human-readable and editable
- Three modes provide a clear escalation path
- DORMANT is the default -- the system starts locked down
- Mode changes are visible in git history

## Email Sending (NOT Built -- Future Integration Point)

**Decision:** Gmail MCP via the existing `send_email.py` helper at `/home/ahiya/.mcp-gsuite/send_email.py`. NOT configured or integrated in this iteration.

**Rationale:**
- The sending mechanism already exists and works for StatViz
- It lives outside this repo (structural safety -- the reach system cannot accidentally trigger it)
- When activated, Ahiya will compose emails using the preview script, review them, and send through Gmail MCP manually
- Personal Gmail (ahiya.butman@gmail.com) has better deliverability than marketing platforms for cold B2B outreach at this volume

**What is NOT included in this iteration:**
- No SMTP configuration
- No API keys or credentials
- No `send()` function in any file
- No Gmail MCP integration code
- No automation of any kind

## Pipeline Stages

**Decision:** 10-stage pipeline adapted from StatViz college outreach for customs broker sales cycle.

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

**Rationale:**
- Mirrors the StatViz college pipeline with adjustments for the customs broker sales cycle
- Includes the 3-touch email sequence stages (contacted, follow_up_1, follow_up_2)
- Includes post-email engagement stages (responded through closed_won)
- `dormant` status allows revisiting contacts later (e.g., after landing a case study)

## Testing

**Decision:** Vitest (same as `site/` for project consistency).

**Configuration:** Standalone `vitest.config.ts` in `reach/` directory (no React/JSdom needed -- pure Node.js tests).

**Coverage Targets:**

| Module | Minimum | Target |
|--------|---------|--------|
| compose/preview script | 85% | 90% |
| CSV parsing/validation | 90% | 95% |
| Config loading/validation | 90% | 95% |

## Environment Variables

**Decision:** None. The reach system has zero environment variables.

**Rationale:**
- No API keys (no sending capability)
- No database connection strings (flat files)
- No deployment configuration (runs locally)
- Contact data is in CSV files, not environment variables
- This is a deliberate safety choice: there is nothing to accidentally configure that could trigger external communication

## Security Considerations

- **No credentials in repo**: No API keys, no SMTP passwords, no OAuth tokens. The sending mechanism (Gmail MCP) lives entirely outside this repository.
- **Real contacts gitignored**: `contacts/customs-broker-targets-real.csv` is in `.gitignore`. Only placeholder data is committed.
- **No send function**: The most important security measure. You cannot accidentally send what you cannot send.
- **DORMANT by default**: The config file ships in DORMANT mode. Changing it requires an explicit edit that is visible in git.
- **Israeli anti-spam compliance**: The 3-touch maximum, explicit opt-out in the final email, and B2B-only targeting align with Israel's Spam Law (Amendment 40).

## Performance Targets

Not applicable. This is a local CLI script that processes 10 CSV rows and 3 template files. Performance is not a concern.

## Build and Deploy

**Build:** None. TypeScript files run directly via `tsx`.
**Deploy:** None. The system runs locally in Ahiya's development environment.
**CI:** Tests can be added to the existing `.github/workflows/ci.yml` as a separate job. This is optional for iteration 2 but recommended.
