# Code Patterns & Conventions

## File Structure

```
c2L/
├── site/                          # Iteration 1 output (c2l.dev website)
│   └── ...
├── reach/                         # Iteration 2 output (outreach engine)
│   ├── README.md                  # Workflow docs, safety rules, "what NOT to say"
│   ├── config.yaml                # Mode: DORMANT, pipeline stage definitions
│   ├── package.json               # Minimal dependencies
│   ├── tsconfig.json              # TypeScript config
│   ├── vitest.config.ts           # Test configuration
│   ├── .gitignore                 # Ignores real contact data
│   ├── contacts/
│   │   ├── customs-broker-targets.csv       # Placeholder data (committed)
│   │   └── customs-broker-targets-real.csv  # Real data (GITIGNORED)
│   ├── templates/
│   │   ├── cold-outreach.md       # Template 1: initial contact
│   │   ├── follow-up.md           # Template 2: 4-5 day reminder
│   │   └── value-add.md           # Template 3: error-angle, final touch
│   ├── scripts/
│   │   └── preview.ts             # Compose/preview script
│   ├── lib/
│   │   ├── config.ts              # Config loading and validation
│   │   ├── contacts.ts            # CSV parsing and validation
│   │   ├── compose.ts             # Template composition (token replacement)
│   │   └── types.ts               # TypeScript type definitions
│   ├── __tests__/
│   │   ├── config.test.ts         # Config loading tests
│   │   ├── contacts.test.ts       # CSV parsing tests
│   │   ├── compose.test.ts        # Template composition tests
│   │   └── preview.test.ts        # Preview script integration tests
│   └── batches/                   # Empty dir, future batch logs
│       └── .gitkeep
├── .github/
│   └── workflows/
│       └── ci.yml                 # Existing CI (may extend for reach)
└── .2L/                           # 2L project management
    └── ...
```

## Naming Conventions

- **Files:** kebab-case (`cold-outreach.md`, `customs-broker-targets.csv`)
- **TypeScript source:** camelCase (`compose.ts`, `config.ts`)
- **Types/Interfaces:** PascalCase (`Contact`, `ReachConfig`, `PipelineStage`)
- **Functions:** camelCase (`composeEmail()`, `loadContacts()`, `loadConfig()`)
- **Constants:** SCREAMING_SNAKE_CASE (`VALID_STAGES`, `PLACEHOLDER_INDICATORS`)
- **CSV columns:** snake_case (`contact_name`, `company_name_he`)
- **Template tokens:** snake_case in braces (`{contact_name}`, `{company_name_he}`)

## Import Order Convention

```typescript
// 1. Node.js built-ins
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// 2. External packages
import { parse } from 'csv-parse/sync';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import chalk from 'chalk';

// 3. Local modules
import { loadConfig } from '../lib/config.js';
import { loadContacts } from '../lib/contacts.js';
import { composeEmail } from '../lib/compose.js';

// 4. Types (type-only imports)
import type { Contact, ReachConfig } from '../lib/types.js';
```

---

## Type Definitions

### types.ts -- All shared types

```typescript
// reach/lib/types.ts

/** Valid pipeline stages for a customs broker contact */
export const VALID_STAGES = [
  'pending',
  'contacted',
  'follow_up_1',
  'follow_up_2',
  'responded',
  'call_scheduled',
  'exploring',
  'closed_won',
  'closed_lost',
  'dormant',
] as const;

export type PipelineStage = (typeof VALID_STAGES)[number];

/** Operational modes for the reach system */
export const VALID_MODES = ['DORMANT', 'DRY_RUN', 'LIVE'] as const;
export type ReachMode = (typeof VALID_MODES)[number];

/** A single customs broker contact from the CSV */
export interface Contact {
  priority: number;
  company_name: string;
  company_name_he: string;
  contact_name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  company_size: string;
  specialization: string;
  website: string;
  linkedin: string;
  status: PipelineStage;
  last_contact: string;
  next_action: string;
  notes: string;
}

/** The reach system configuration from config.yaml */
export interface ReachConfig {
  mode: ReachMode;
  pipeline_stages: Array<{
    id: PipelineStage;
    label_he: string;
    description: string;
  }>;
  campaign: {
    max_touches: number;
    touch_sequence: string[];
    days_between_touch_1_and_2: number;
    days_between_touch_2_and_3: number;
  };
  contact_details: {
    sender_name: string;
    sender_email: string;
    sender_phone: string;
    offer_url: string;
  };
}

/** A composed email ready for preview */
export interface ComposedEmail {
  to_name: string;
  to_email: string;
  subject: string;
  body: string;
  template_used: string;
  contact_priority: number;
}

/** Available template names (matches filenames without extension) */
export type TemplateName = 'cold-outreach' | 'follow-up' | 'value-add';
```

---

## Config Pattern

### config.yaml structure

```yaml
# reach/config.yaml
# ===========================================================
# WARNING: This system is DORMANT. It does NOT send emails.
# To activate, change mode to DRY_RUN (preview only) or LIVE.
# LIVE mode requires send capability to be added (not built).
# ===========================================================

mode: DORMANT  # DORMANT | DRY_RUN | LIVE

pipeline_stages:
  - id: pending
    label_he: ממתין
    description: Lead identified, not yet contacted
  - id: contacted
    label_he: נוצר קשר
    description: First email sent
  - id: follow_up_1
    label_he: פולואפ 1
    description: First follow-up sent (4-5 days after initial)
  - id: follow_up_2
    label_he: פולואפ 2
    description: Value-add email sent (7-10 days after follow-up)
  - id: responded
    label_he: הגיב
    description: Broker replied (any reply)
  - id: call_scheduled
    label_he: נקבעה שיחה
    description: Phone or video call scheduled
  - id: exploring
    label_he: בתהליך חקירה
    description: Phase 1 (Exploration) started
  - id: closed_won
    label_he: סגירה
    description: Engagement began
  - id: closed_lost
    label_he: לא רלוונטי
    description: Not interested or not a fit
  - id: dormant
    label_he: רדום
    description: No response after full sequence, revisit later

campaign:
  max_touches: 3
  touch_sequence:
    - cold-outreach
    - follow-up
    - value-add
  days_between_touch_1_and_2: 5
  days_between_touch_2_and_3: 10

contact_details:
  sender_name: אחיה בוטמן
  sender_email: ahiya.butman@gmail.com
  sender_phone: "058-778-9019"
  offer_url: https://c2l.dev/customs
```

### Config loading and validation (config.ts)

```typescript
// reach/lib/config.ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { VALID_MODES, VALID_STAGES } from './types.js';

const configSchema = z.object({
  mode: z.enum(VALID_MODES),
  pipeline_stages: z.array(
    z.object({
      id: z.enum(VALID_STAGES),
      label_he: z.string().min(1),
      description: z.string().min(1),
    })
  ),
  campaign: z.object({
    max_touches: z.number().int().positive(),
    touch_sequence: z.array(z.string().min(1)),
    days_between_touch_1_and_2: z.number().int().positive(),
    days_between_touch_2_and_3: z.number().int().positive(),
  }),
  contact_details: z.object({
    sender_name: z.string().min(1),
    sender_email: z.string().email(),
    sender_phone: z.string().min(1),
    offer_url: z.string().url(),
  }),
});

export type ValidatedConfig = z.infer<typeof configSchema>;

/**
 * Load and validate the reach configuration from config.yaml.
 * Throws if the file is missing or the content is invalid.
 */
export function loadConfig(configPath?: string): ValidatedConfig {
  const path = configPath ?? resolve(import.meta.dirname, '..', 'config.yaml');
  const raw = readFileSync(path, 'utf-8');
  const parsed = parseYaml(raw);
  return configSchema.parse(parsed);
}

/**
 * Check if the system is in a mode that allows email composition.
 * DORMANT mode does NOT allow composition.
 */
export function canCompose(config: ValidatedConfig): boolean {
  return config.mode !== 'DORMANT';
}

/**
 * Assert that the system is in a mode that allows email composition.
 * Throws with a clear error if the system is DORMANT.
 */
export function assertCanCompose(config: ValidatedConfig): void {
  if (!canCompose(config)) {
    throw new Error(
      `[DORMANT] System is in DORMANT mode. Email composition is disabled.\n` +
        `To enable preview, change mode to DRY_RUN in config.yaml.`
    );
  }
}
```

---

## CSV Contact Pattern

### CSV file structure

```csv
priority,company_name,company_name_he,contact_name,role,email,phone,location,company_size,specialization,website,linkedin,status,last_contact,next_action,notes
1,Example Customs Ltd,דוגמא עמילות מכס בע״מ,ישראל ישראלי,בעלים,example1@example.co.il,050-0000001,אשדוד,10-20,ייבוא כללי,https://example.co.il,,pending,,לשלוח מייל ראשון,נתון לדוגמא - להחליף בנתון אמיתי
2,Test Broker Co,טסט שילוח בינלאומי,דוד דוידוב,מנהל,example2@example.co.il,050-0000002,חיפה,5-10,ייבוא מזון,https://example2.co.il,,pending,,לשלוח מייל ראשון,נתון לדוגמא - להחליף בנתון אמיתי
```

### Contact parsing and validation (contacts.ts)

```typescript
// reach/lib/contacts.ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { VALID_STAGES } from './types.js';
import type { Contact } from './types.js';

/** Indicators that a contact row contains placeholder data */
const PLACEHOLDER_INDICATORS = [
  'example.co.il',
  'example.com',
  'ישראל ישראלי',
  'דוד דוידוב',
  '050-0000',
  'נתון לדוגמא',
  'placeholder',
  'test@',
] as const;

const contactSchema = z.object({
  priority: z.coerce.number().int().positive(),
  company_name: z.string().min(1),
  company_name_he: z.string().min(1),
  contact_name: z.string().min(1),
  role: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  location: z.string().min(1),
  company_size: z.string(),
  specialization: z.string(),
  website: z.string(),
  linkedin: z.string(),
  status: z.enum(VALID_STAGES),
  last_contact: z.string(),
  next_action: z.string(),
  notes: z.string(),
});

/**
 * Load and validate contacts from a CSV file.
 * Returns an array of validated Contact objects sorted by priority.
 */
export function loadContacts(csvPath?: string): Contact[] {
  const path =
    csvPath ?? resolve(import.meta.dirname, '..', 'contacts', 'customs-broker-targets.csv');
  const raw = readFileSync(path, 'utf-8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  const contacts: Contact[] = records.map((record: unknown, index: number) => {
    try {
      return contactSchema.parse(record);
    } catch (error) {
      throw new Error(
        `Invalid contact at row ${index + 2}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });

  return contacts.sort((a, b) => a.priority - b.priority);
}

/**
 * Check if a contact row contains placeholder data.
 * Returns true if any field matches a known placeholder indicator.
 */
export function isPlaceholder(contact: Contact): boolean {
  const fields = [
    contact.email,
    contact.contact_name,
    contact.phone,
    contact.notes,
    contact.company_name,
  ];
  return fields.some((field) =>
    PLACEHOLDER_INDICATORS.some((indicator) =>
      field.toLowerCase().includes(indicator.toLowerCase())
    )
  );
}

/**
 * Get a single contact by priority number (1-based).
 * Throws if not found.
 */
export function getContactByPriority(contacts: Contact[], priority: number): Contact {
  const contact = contacts.find((c) => c.priority === priority);
  if (!contact) {
    throw new Error(`No contact found with priority ${priority}`);
  }
  return contact;
}
```

---

## Template Composition Pattern

### Template file structure (Markdown)

Template files are plain Markdown with `{token}` placeholders. The first line is the subject line(s), separated by `---` from the body.

```markdown
<!-- reach/templates/cold-outreach.md -->
---
subject_a: כמה אתה מוציא על פקידי הקלדה בשנה?
subject_b: מערכת שמחליפה את עבודת ההקלדה — בלי חוזה תחזוקה
subject_c: "{company_name_he} — חיסכון של מאות אלפי שקלים בשנה"
---

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

### Template composition logic (compose.ts)

```typescript
// reach/lib/compose.ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Contact, ComposedEmail, TemplateName } from './types.js';

/** Tokens that can be replaced in templates */
const TEMPLATE_TOKENS = ['contact_name', 'company_name_he', 'company_name'] as const;

interface TemplateParts {
  subjects: Record<string, string>;
  body: string;
}

/**
 * Parse a template file into its subject lines and body.
 * Subject lines are in the YAML front matter (between --- markers).
 * Body is everything after the second --- marker.
 */
export function parseTemplate(templateContent: string): TemplateParts {
  const lines = templateContent.split('\n');

  // Find front matter boundaries
  let firstDash = -1;
  let secondDash = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (firstDash === -1) {
        firstDash = i;
      } else {
        secondDash = i;
        break;
      }
    }
  }

  if (firstDash === -1 || secondDash === -1) {
    throw new Error('Template must have YAML front matter between --- markers');
  }

  // Parse subject lines from front matter
  const subjects: Record<string, string> = {};
  for (let i = firstDash + 1; i < secondDash; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const match = line.match(/^(subject_\w+):\s*"?(.+?)"?\s*$/);
    if (match) {
      subjects[match[1]] = match[2];
    }
  }

  if (Object.keys(subjects).length === 0) {
    throw new Error('Template must have at least one subject line (subject_a, subject_b, etc.)');
  }

  // Body is everything after the second ---
  const body = lines
    .slice(secondDash + 1)
    .join('\n')
    .trim();

  return { subjects, body };
}

/**
 * Replace all {token} placeholders in a string with values from a contact.
 */
export function replaceTokens(text: string, contact: Contact): string {
  let result = text;
  for (const token of TEMPLATE_TOKENS) {
    const value = contact[token as keyof Contact];
    if (typeof value === 'string') {
      result = result.replaceAll(`{${token}}`, value);
    }
  }
  return result;
}

/**
 * Load a template file by name.
 * Template names correspond to files in reach/templates/ (without .md extension).
 */
export function loadTemplate(templateName: TemplateName, templatesDir?: string): string {
  const dir = templatesDir ?? resolve(import.meta.dirname, '..', 'templates');
  const path = resolve(dir, `${templateName}.md`);
  return readFileSync(path, 'utf-8');
}

/**
 * Compose an email from a template and a contact.
 * Uses subject_a by default. Pass subjectKey to use a different subject variant.
 */
export function composeEmail(
  contact: Contact,
  templateName: TemplateName,
  options?: { subjectKey?: string; templatesDir?: string }
): ComposedEmail {
  const content = loadTemplate(templateName, options?.templatesDir);
  const { subjects, body } = parseTemplate(content);

  const subjectKey = options?.subjectKey ?? 'subject_a';
  const rawSubject = subjects[subjectKey];
  if (!rawSubject) {
    throw new Error(
      `Subject key "${subjectKey}" not found in template "${templateName}". ` +
        `Available: ${Object.keys(subjects).join(', ')}`
    );
  }

  return {
    to_name: contact.contact_name,
    to_email: contact.email,
    subject: replaceTokens(rawSubject, contact),
    body: replaceTokens(body, contact),
    template_used: templateName,
    contact_priority: contact.priority,
  };
}
```

---

## Preview Script Pattern

### The main preview script (scripts/preview.ts)

```typescript
// reach/scripts/preview.ts
import chalk from 'chalk';
import { loadConfig, assertCanCompose } from '../lib/config.js';
import { loadContacts, getContactByPriority, isPlaceholder } from '../lib/contacts.js';
import { composeEmail } from '../lib/compose.js';
import type { ComposedEmail, TemplateName } from '../lib/types.js';

const VALID_TEMPLATES: TemplateName[] = ['cold-outreach', 'follow-up', 'value-add'];

function printUsage(): void {
  console.log(`
Usage: npx tsx reach/scripts/preview.ts [options]

Options:
  --contact <priority>    Preview email for a specific contact (by priority number)
  --template <name>       Template to use: cold-outreach | follow-up | value-add
                          (default: cold-outreach)
  --subject <key>         Subject variant: subject_a | subject_b | subject_c
                          (default: subject_a)
  --all                   Preview emails for all contacts
  --list                  List all contacts with their status
  --help                  Show this help message

Examples:
  npx tsx reach/scripts/preview.ts --contact 1 --template cold-outreach
  npx tsx reach/scripts/preview.ts --all --template follow-up
  npx tsx reach/scripts/preview.ts --list
`);
}

function printEmail(email: ComposedEmail, isPlaceholderContact: boolean): void {
  const banner = chalk.bgYellow.black(' DRY-RUN ');
  const placeholderWarning = isPlaceholderContact
    ? chalk.bgRed.white(' PLACEHOLDER DATA ') + ' This contact has fake data. Replace before activation.\n'
    : '';

  console.log(`
${banner} Composed email preview
${placeholderWarning}
${chalk.gray('To:')}       ${email.to_name} <${email.to_email}>
${chalk.gray('Subject:')}  ${email.subject}
${chalk.gray('Template:')} ${email.template_used}
${chalk.gray('Priority:')} ${email.contact_priority}
${chalk.gray('---')}
${email.body}
${chalk.gray('---')}
${banner} ${chalk.yellow('EMAIL NOT SENT (preview only)')}
`);
}

function printContactList(contacts: ReturnType<typeof loadContacts>): void {
  console.log(chalk.bold('\nCustoms Broker Contacts:\n'));
  console.log(
    chalk.gray(
      'Pri  Status          Name                Company                  Email'
    )
  );
  console.log(chalk.gray('-'.repeat(90)));

  for (const contact of contacts) {
    const placeholder = isPlaceholder(contact) ? chalk.red(' [PLACEHOLDER]') : '';
    const statusColor =
      contact.status === 'pending'
        ? chalk.yellow
        : contact.status === 'closed_won'
          ? chalk.green
          : contact.status === 'closed_lost'
            ? chalk.red
            : chalk.blue;

    console.log(
      `${String(contact.priority).padStart(3)}  ${statusColor(contact.status.padEnd(15))} ${contact.contact_name.padEnd(20)} ${contact.company_name_he.padEnd(24)} ${contact.email}${placeholder}`
    );
  }
  console.log();
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    printUsage();
    process.exit(0);
  }

  // Load config and check mode
  const config = loadConfig();

  if (args.includes('--list')) {
    // Listing contacts is allowed in any mode
    const contacts = loadContacts();
    printContactList(contacts);
    return;
  }

  // Composition requires non-DORMANT mode
  assertCanCompose(config);

  const contacts = loadContacts();
  const templateArg = args[args.indexOf('--template') + 1] as TemplateName | undefined;
  const template: TemplateName = templateArg && VALID_TEMPLATES.includes(templateArg)
    ? templateArg
    : 'cold-outreach';
  const subjectKey = args.includes('--subject')
    ? args[args.indexOf('--subject') + 1]
    : undefined;

  if (args.includes('--all')) {
    console.log(chalk.bgYellow.black(' DRY-RUN ') + ` Previewing ${template} for all ${contacts.length} contacts\n`);
    for (const contact of contacts) {
      const email = composeEmail(contact, template, { subjectKey });
      printEmail(email, isPlaceholder(contact));
    }
    return;
  }

  if (args.includes('--contact')) {
    const priorityStr = args[args.indexOf('--contact') + 1];
    const priority = parseInt(priorityStr, 10);
    if (isNaN(priority)) {
      console.error(chalk.red(`Invalid priority number: ${priorityStr}`));
      process.exit(1);
    }
    const contact = getContactByPriority(contacts, priority);
    const email = composeEmail(contact, template, { subjectKey });
    printEmail(email, isPlaceholder(contact));
    return;
  }

  printUsage();
}

main();
```

---

## Safety Patterns (DORMANT Enforcement)

### Pattern 1: No send function exists

The codebase has exactly three email operations:
1. `composeEmail()` -- creates a `ComposedEmail` object
2. `parseTemplate()` -- reads a template file
3. `printEmail()` -- outputs to stdout

There is NO `sendEmail()`, NO SMTP connection, NO API call. The architecture makes sending structurally impossible.

```
compose(contact, template) -> ComposedEmail   // EXISTS
preview(ComposedEmail) -> console output      // EXISTS
send(ComposedEmail) -> void                   // DOES NOT EXIST
```

### Pattern 2: Config-gated composition

Every operation that composes emails must check the config mode first:

```typescript
// CORRECT: Always check mode before composing
const config = loadConfig();
assertCanCompose(config); // Throws if DORMANT
const email = composeEmail(contact, template);

// WRONG: Never compose without checking mode
const email = composeEmail(contact, template); // Missing mode check!
```

### Pattern 3: Placeholder data detection

The system warns when operating on placeholder data:

```typescript
// In preview output
if (isPlaceholder(contact)) {
  console.log(chalk.bgRed.white(' PLACEHOLDER DATA '));
  console.log('This contact has fake data. Replace before activation.');
}
```

### Pattern 4: Gitignore for real contacts

```gitignore
# reach/.gitignore
# Real contact data -- NEVER commit
contacts/customs-broker-targets-real.csv
contacts/*-real.csv

# Node
node_modules/

# Test coverage
coverage/
```

### Pattern 5: Bold warnings in every sensitive file

Every file that touches email or contacts must include a warning header:

```yaml
# config.yaml header
# ===========================================================
# WARNING: This system is DORMANT. It does NOT send emails.
# ===========================================================
```

```markdown
<!-- README.md header -->
# c2L-Reach: Customs Broker Outreach

> **STATUS: DORMANT** -- This system is built but NOT activated.
> Zero emails have been sent. Zero external contact has been made.
> Activation requires explicit approval from Ahiya.
```

```csv
# CSV header row comment is not standard -- instead, use obviously fake data:
1,Example Customs Ltd,דוגמא עמילות מכס בע״מ,ישראל ישראלי,...
```

---

## Testing Patterns

### Test File Naming Conventions

- Unit tests: `__tests__/{module}.test.ts` (in `reach/__tests__/` directory)
- Each library module gets one test file
- Test files mirror the `lib/` directory structure

### Test Configuration (vitest.config.ts)

```typescript
// reach/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['lib/**/*.ts', 'scripts/**/*.ts'],
    },
  },
});
```

### Test File Structure

```typescript
// reach/__tests__/compose.test.ts
import { describe, it, expect } from 'vitest';
import { parseTemplate, replaceTokens, composeEmail } from '../lib/compose.js';
import type { Contact } from '../lib/types.js';

const mockContact: Contact = {
  priority: 1,
  company_name: 'Test Broker Co',
  company_name_he: 'טסט שילוח בע״מ',
  contact_name: 'ישראל כהן',
  role: 'בעלים',
  email: 'israel@testbroker.co.il',
  phone: '050-1234567',
  location: 'אשדוד',
  company_size: '10-20',
  specialization: 'ייבוא כללי',
  website: 'https://testbroker.co.il',
  linkedin: '',
  status: 'pending',
  last_contact: '',
  next_action: 'לשלוח מייל ראשון',
  notes: '',
};

describe('parseTemplate', () => {
  it('should parse front matter and body', () => {
    const content = `---
subject_a: Test subject
subject_b: Another subject
---

Hello {contact_name}, this is the body.`;

    const result = parseTemplate(content);
    expect(result.subjects.subject_a).toBe('Test subject');
    expect(result.subjects.subject_b).toBe('Another subject');
    expect(result.body).toContain('Hello {contact_name}');
  });

  it('should throw if front matter is missing', () => {
    expect(() => parseTemplate('No front matter here')).toThrow(
      'Template must have YAML front matter'
    );
  });

  it('should throw if no subject lines in front matter', () => {
    const content = `---
not_a_subject: value
---

Body text.`;

    expect(() => parseTemplate(content)).toThrow('must have at least one subject line');
  });

  it('should handle quoted subject lines with tokens', () => {
    const content = `---
subject_a: "{company_name_he} — test"
---

Body.`;

    const result = parseTemplate(content);
    expect(result.subjects.subject_a).toBe('{company_name_he} — test');
  });
});

describe('replaceTokens', () => {
  it('should replace {contact_name} with contact name', () => {
    const result = replaceTokens('שלום {contact_name},', mockContact);
    expect(result).toBe('שלום ישראל כהן,');
  });

  it('should replace {company_name_he} with Hebrew company name', () => {
    const result = replaceTokens('חברת {company_name_he}', mockContact);
    expect(result).toBe('חברת טסט שילוח בע״מ');
  });

  it('should replace {company_name} with English company name', () => {
    const result = replaceTokens('Company: {company_name}', mockContact);
    expect(result).toBe('Company: Test Broker Co');
  });

  it('should replace multiple tokens in the same string', () => {
    const result = replaceTokens(
      'שלום {contact_name}, מחברת {company_name_he}',
      mockContact
    );
    expect(result).toBe('שלום ישראל כהן, מחברת טסט שילוח בע״מ');
  });

  it('should leave unknown tokens unchanged', () => {
    const result = replaceTokens('{unknown_token}', mockContact);
    expect(result).toBe('{unknown_token}');
  });

  it('should handle Hebrew text with RTL correctly', () => {
    const template = 'הפניה אליך {contact_name} מ{company_name_he}';
    const result = replaceTokens(template, mockContact);
    expect(result).toContain('ישראל כהן');
    expect(result).toContain('טסט שילוח בע״מ');
  });
});

describe('composeEmail', () => {
  // Note: This test requires template files to exist.
  // Use a custom templatesDir pointing to test fixtures.

  it('should compose email with correct fields', () => {
    // Create a test template inline by mocking loadTemplate
    // Or use a test fixtures directory
    const content = `---
subject_a: Test subject for {contact_name}
---

שלום {contact_name},

This is a test email for {company_name_he}.`;

    // For unit testing, test parseTemplate + replaceTokens directly
    const { subjects, body } = parseTemplate(content);
    const composedSubject = replaceTokens(subjects.subject_a, mockContact);
    const composedBody = replaceTokens(body, mockContact);

    expect(composedSubject).toBe('Test subject for ישראל כהן');
    expect(composedBody).toContain('שלום ישראל כהן,');
    expect(composedBody).toContain('טסט שילוח בע״מ');
  });
});
```

### Config Test Pattern

```typescript
// reach/__tests__/config.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadConfig, canCompose, assertCanCompose } from '../lib/config.js';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const TEST_DIR = resolve(import.meta.dirname, '.fixtures');
const TEST_CONFIG = resolve(TEST_DIR, 'config.yaml');

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

function writeTestConfig(content: string): void {
  writeFileSync(TEST_CONFIG, content, 'utf-8');
}

describe('loadConfig', () => {
  it('should load a valid DORMANT config', () => {
    writeTestConfig(`
mode: DORMANT
pipeline_stages:
  - id: pending
    label_he: ממתין
    description: Not yet contacted
campaign:
  max_touches: 3
  touch_sequence:
    - cold-outreach
  days_between_touch_1_and_2: 5
  days_between_touch_2_and_3: 10
contact_details:
  sender_name: Test
  sender_email: test@example.com
  sender_phone: "050-0000000"
  offer_url: https://c2l.dev/customs
`);
    const config = loadConfig(TEST_CONFIG);
    expect(config.mode).toBe('DORMANT');
  });

  it('should reject an invalid mode', () => {
    writeTestConfig(`
mode: INVALID_MODE
pipeline_stages: []
campaign:
  max_touches: 3
  touch_sequence: []
  days_between_touch_1_and_2: 5
  days_between_touch_2_and_3: 10
contact_details:
  sender_name: Test
  sender_email: test@example.com
  sender_phone: "050-0000000"
  offer_url: https://c2l.dev/customs
`);
    expect(() => loadConfig(TEST_CONFIG)).toThrow();
  });

  it('should throw if config file is missing', () => {
    expect(() => loadConfig('/nonexistent/config.yaml')).toThrow();
  });
});

describe('canCompose', () => {
  it('should return false for DORMANT mode', () => {
    expect(canCompose({ mode: 'DORMANT' } as any)).toBe(false);
  });

  it('should return true for DRY_RUN mode', () => {
    expect(canCompose({ mode: 'DRY_RUN' } as any)).toBe(true);
  });

  it('should return true for LIVE mode', () => {
    expect(canCompose({ mode: 'LIVE' } as any)).toBe(true);
  });
});

describe('assertCanCompose', () => {
  it('should throw with clear message in DORMANT mode', () => {
    expect(() => assertCanCompose({ mode: 'DORMANT' } as any)).toThrow(
      '[DORMANT] System is in DORMANT mode'
    );
  });

  it('should not throw in DRY_RUN mode', () => {
    expect(() => assertCanCompose({ mode: 'DRY_RUN' } as any)).not.toThrow();
  });
});
```

### Contact Validation Test Pattern

```typescript
// reach/__tests__/contacts.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadContacts, isPlaceholder, getContactByPriority } from '../lib/contacts.js';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Contact } from '../lib/types.js';

const TEST_DIR = resolve(import.meta.dirname, '.fixtures');
const TEST_CSV = resolve(TEST_DIR, 'test-contacts.csv');

const CSV_HEADER =
  'priority,company_name,company_name_he,contact_name,role,email,phone,location,company_size,specialization,website,linkedin,status,last_contact,next_action,notes';

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('loadContacts', () => {
  it('should parse a valid CSV with Hebrew content', () => {
    const csv = `${CSV_HEADER}
1,Test Co,טסט בע״מ,ישראל כהן,בעלים,israel@test.co.il,050-1234567,אשדוד,10-20,ייבוא כללי,https://test.co.il,,pending,,לשלוח מייל,הערה`;
    writeFileSync(TEST_CSV, csv, 'utf-8');

    const contacts = loadContacts(TEST_CSV);
    expect(contacts).toHaveLength(1);
    expect(contacts[0].contact_name).toBe('ישראל כהן');
    expect(contacts[0].location).toBe('אשדוד');
    expect(contacts[0].status).toBe('pending');
  });

  it('should sort contacts by priority', () => {
    const csv = `${CSV_HEADER}
3,C Co,ג בע״מ,גד,בעלים,c@test.co.il,050-3,חיפה,5,ייבוא,,,pending,,,
1,A Co,א בע״מ,אבי,בעלים,a@test.co.il,050-1,אשדוד,10,ייבוא,,,pending,,,
2,B Co,ב בע״מ,בני,בעלים,b@test.co.il,050-2,אשדוד,8,ייבוא,,,pending,,,`;
    writeFileSync(TEST_CSV, csv, 'utf-8');

    const contacts = loadContacts(TEST_CSV);
    expect(contacts[0].priority).toBe(1);
    expect(contacts[1].priority).toBe(2);
    expect(contacts[2].priority).toBe(3);
  });

  it('should reject invalid status values', () => {
    const csv = `${CSV_HEADER}
1,Test,טסט,Name,Role,test@test.co.il,050-1,City,5,Spec,,,INVALID_STATUS,,,`;
    writeFileSync(TEST_CSV, csv, 'utf-8');

    expect(() => loadContacts(TEST_CSV)).toThrow('Invalid contact at row 2');
  });

  it('should reject invalid email format', () => {
    const csv = `${CSV_HEADER}
1,Test,טסט,Name,Role,not-an-email,050-1,City,5,Spec,,,pending,,,`;
    writeFileSync(TEST_CSV, csv, 'utf-8');

    expect(() => loadContacts(TEST_CSV)).toThrow('Invalid contact at row 2');
  });
});

describe('isPlaceholder', () => {
  const realContact: Contact = {
    priority: 1,
    company_name: 'Real Customs Ltd',
    company_name_he: 'עמילות מכס אמיתית',
    contact_name: 'דני לוי',
    role: 'בעלים',
    email: 'dani@realcustoms.co.il',
    phone: '050-9876543',
    location: 'אשדוד',
    company_size: '15',
    specialization: 'ייבוא',
    website: 'https://realcustoms.co.il',
    linkedin: '',
    status: 'pending',
    last_contact: '',
    next_action: '',
    notes: 'Real contact',
  };

  const placeholderContact: Contact = {
    ...realContact,
    contact_name: 'ישראל ישראלי',
    email: 'example1@example.co.il',
    notes: 'נתון לדוגמא - להחליף בנתון אמיתי',
  };

  it('should return false for real contact data', () => {
    expect(isPlaceholder(realContact)).toBe(false);
  });

  it('should return true for placeholder name', () => {
    expect(isPlaceholder(placeholderContact)).toBe(true);
  });

  it('should detect example.co.il email as placeholder', () => {
    expect(isPlaceholder({ ...realContact, email: 'test@example.co.il' })).toBe(true);
  });

  it('should detect 050-0000 phone as placeholder', () => {
    expect(isPlaceholder({ ...realContact, phone: '050-0000001' })).toBe(true);
  });
});

describe('getContactByPriority', () => {
  const contacts: Contact[] = [
    { priority: 1, contact_name: 'First' } as Contact,
    { priority: 2, contact_name: 'Second' } as Contact,
    { priority: 3, contact_name: 'Third' } as Contact,
  ];

  it('should find contact by priority', () => {
    expect(getContactByPriority(contacts, 2).contact_name).toBe('Second');
  });

  it('should throw if priority not found', () => {
    expect(() => getContactByPriority(contacts, 99)).toThrow('No contact found with priority 99');
  });
});
```

### Coverage Expectations

| Module | Minimum Coverage | Target Coverage |
|--------|------------------|-----------------|
| lib/config.ts | 90% | 95% |
| lib/contacts.ts | 90% | 95% |
| lib/compose.ts | 85% | 90% |
| scripts/preview.ts | 70% | 80% |

### Test Data Factories

```typescript
// Use inline in tests -- no separate factory file needed for this small system.
// The mockContact pattern shown in compose.test.ts is the standard.

const createMockContact = (overrides: Partial<Contact> = {}): Contact => ({
  priority: 1,
  company_name: 'Test Broker Co',
  company_name_he: 'טסט שילוח בע״מ',
  contact_name: 'ישראל כהן',
  role: 'בעלים',
  email: 'israel@testbroker.co.il',
  phone: '050-1234567',
  location: 'אשדוד',
  company_size: '10-20',
  specialization: 'ייבוא כללי',
  website: 'https://testbroker.co.il',
  linkedin: '',
  status: 'pending',
  last_contact: '',
  next_action: 'לשלוח מייל ראשון',
  notes: '',
  ...overrides,
});
```

---

## Error Handling Patterns

### Script Errors

```typescript
// In scripts/preview.ts -- top-level error handling
function main(): void {
  try {
    // ... script logic
  } catch (error) {
    if (error instanceof Error) {
      // Check for known error types
      if (error.message.startsWith('[DORMANT]')) {
        console.error(chalk.bgRed.white(' BLOCKED ') + ' ' + error.message);
        process.exit(2);  // Exit code 2 = mode restriction
      }
      console.error(chalk.red(`Error: ${error.message}`));
    } else {
      console.error(chalk.red('An unexpected error occurred'));
    }
    process.exit(1);
  }
}
```

### Validation Errors

```typescript
// Zod validation errors are caught and re-thrown with context
try {
  return contactSchema.parse(record);
} catch (error) {
  throw new Error(
    `Invalid contact at row ${index + 2}: ${error instanceof Error ? error.message : String(error)}`
  );
}
```

---

## Security Patterns

### Input Validation

All external data (CSV files, YAML config) is validated through Zod schemas before use:

```typescript
// CSV rows validated through contactSchema
const contactSchema = z.object({
  priority: z.coerce.number().int().positive(),
  email: z.string().email(),
  status: z.enum(VALID_STAGES),
  // ...
});

// Config validated through configSchema
const configSchema = z.object({
  mode: z.enum(VALID_MODES),
  // ...
});
```

### No Secrets in Code

The reach system has ZERO secrets:
- No API keys
- No SMTP credentials
- No OAuth tokens
- No environment variables
- The sending mechanism lives entirely outside this repository

### Real Data Protection

```gitignore
# reach/.gitignore
# Real contact data -- NEVER commit to version control
contacts/customs-broker-targets-real.csv
contacts/*-real.csv
```

---

## Package.json Pattern

```json
{
  "name": "c2l-reach",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "preview": "tsx scripts/preview.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit",
    "validate-contacts": "tsx scripts/preview.ts --list"
  },
  "dependencies": {
    "chalk": "^5.4.1",
    "csv-parse": "^5.6.0",
    "yaml": "^2.7.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@types/node": "^22",
    "tsx": "^4.19.0",
    "typescript": "^5",
    "vitest": "^3"
  }
}
```

---

## tsconfig.json Pattern

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": ".",
    "declaration": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["lib/**/*.ts", "scripts/**/*.ts", "__tests__/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

---

## README Pattern

The README must include these sections in this order:

1. **Header with DORMANT warning banner** (bold, unmissable)
2. **What this is** (one paragraph)
3. **Directory structure** (tree view)
4. **Quick start** (how to preview an email)
5. **Pipeline stages table** (with Hebrew labels)
6. **Campaign cadence** (3-touch sequence with timing)
7. **Template editing guide** (how to modify templates, token reference)
8. **What NOT to say** (critical anti-patterns for email content)
9. **Contact verification checklist** (for when Ahiya fills in real data)
10. **Activation checklist** (steps to move from DORMANT to DRY_RUN to LIVE)
11. **Response handling guide** (what to do when brokers reply)

---

## CI/CD Pattern (Optional Extension)

If extending the existing CI workflow to include reach tests:

```yaml
# Addition to .github/workflows/ci.yml

  reach-test:
    name: Reach Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: reach
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: reach/package-lock.json
      - run: npm ci
      - name: TypeScript Check
        run: npx tsc --noEmit
      - name: Run Tests
        run: npm run test
```
