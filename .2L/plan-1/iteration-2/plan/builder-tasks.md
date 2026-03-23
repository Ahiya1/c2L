# Builder Task Breakdown

## Overview

1 primary builder handles the entire iteration. Both explorers agree: the work is a flat-file system with ~15 files total. Splitting into multiple builders would add coordination overhead with no benefit.

The builder does NOT split into sub-builders.

## Builder Assignment Strategy

- Single builder creates the entire `reach/` directory: structure, config, contacts CSV, templates, TypeScript compose/preview script, tests, and documentation.
- No cross-builder coordination needed.
- No dependencies on other builders.

---

## Builder-1: c2L-Reach Outreach Engine (Complete System)

### Scope

Create the entire dormant outreach system at `reach/` as a sibling to the existing `site/` directory. This includes: project configuration, contact CSV with placeholder data, 3 Hebrew email templates, a TypeScript compose/preview script with library modules, comprehensive tests, safety mechanisms, and workflow documentation.

### Complexity Estimate

**MEDIUM**

The work is straightforward: directory structure, flat files, and a simple TypeScript script. No web framework, no database, no deployment. The volume of files is moderate (~15 files) but each file is small and well-defined. The Hebrew email templates are provided in full by the explorers. The compose/preview script is straightforward string manipulation and CSV parsing.

No split recommended.

### Success Criteria

- [ ] `reach/` directory exists at project root with correct structure
- [ ] `reach/package.json` exists with correct dependencies
- [ ] `cd reach && npm install` succeeds
- [ ] `reach/tsconfig.json` exists and `npx tsc --noEmit` passes
- [ ] `reach/config.yaml` has `mode: DORMANT` with all pipeline stages
- [ ] `reach/contacts/customs-broker-targets.csv` has 10 rows of obviously fake placeholder data
- [ ] `reach/.gitignore` ignores `contacts/*-real.csv` and `node_modules/`
- [ ] 3 template files exist in `reach/templates/`: `cold-outreach.md`, `follow-up.md`, `value-add.md`
- [ ] All templates have YAML front matter with subject line variants
- [ ] All templates use `{contact_name}` and `{company_name_he}` tokens
- [ ] All templates link to `https://c2l.dev/customs`
- [ ] All template signatures match site constants: phone 058-778-9019, email ahiya.butman@gmail.com
- [ ] `reach/lib/types.ts` defines Contact, ReachConfig, ComposedEmail, PipelineStage types
- [ ] `reach/lib/config.ts` loads and validates config.yaml with Zod
- [ ] `reach/lib/contacts.ts` parses CSV and validates contacts with Zod
- [ ] `reach/lib/compose.ts` handles template parsing and token replacement
- [ ] `reach/scripts/preview.ts` is the CLI entry point with `--contact`, `--template`, `--all`, `--list` flags
- [ ] Preview script refuses to compose in DORMANT mode (throws with clear error message)
- [ ] Preview script composes and displays emails in DRY_RUN mode
- [ ] Preview script warns when contact has placeholder data
- [ ] `npx tsx reach/scripts/preview.ts --list` outputs all contacts
- [ ] No `send()` function exists anywhere in the codebase
- [ ] No SMTP configuration, API keys, or sending code exists
- [ ] `reach/README.md` documents workflow, pipeline stages, safety rules, and "what NOT to say"
- [ ] `npm run test` passes all tests (minimum 15 test cases)
- [ ] `reach/batches/.gitkeep` exists (empty dir for future batch logs)

### Files to Create

**Project configuration:**
- `reach/package.json` -- Dependencies and scripts (see patterns.md Package.json Pattern)
- `reach/tsconfig.json` -- TypeScript config (see patterns.md tsconfig.json Pattern)
- `reach/vitest.config.ts` -- Test configuration (see patterns.md Test Configuration)
- `reach/.gitignore` -- Ignores real contacts, node_modules, coverage

**System configuration:**
- `reach/config.yaml` -- DORMANT mode, pipeline stages, campaign settings, contact details

**Contact data:**
- `reach/contacts/customs-broker-targets.csv` -- 10 rows of placeholder data with correct schema

**Email templates:**
- `reach/templates/cold-outreach.md` -- Template 1: initial contact email (Hebrew)
- `reach/templates/follow-up.md` -- Template 2: 4-5 day follow-up (Hebrew)
- `reach/templates/value-add.md` -- Template 3: error-angle final touch (Hebrew)

**TypeScript library:**
- `reach/lib/types.ts` -- All type definitions (Contact, ReachConfig, ComposedEmail, etc.)
- `reach/lib/config.ts` -- Config loading and validation, DORMANT mode checking
- `reach/lib/contacts.ts` -- CSV parsing, validation, placeholder detection
- `reach/lib/compose.ts` -- Template parsing, token replacement, email composition

**CLI script:**
- `reach/scripts/preview.ts` -- Main entry point with CLI argument parsing

**Tests:**
- `reach/__tests__/config.test.ts` -- Config loading, mode validation, DORMANT enforcement
- `reach/__tests__/contacts.test.ts` -- CSV parsing, Hebrew content, sorting, placeholder detection
- `reach/__tests__/compose.test.ts` -- Template parsing, token replacement, subject variants
- `reach/__tests__/preview.test.ts` -- CLI integration (optional, lower priority)

**Documentation:**
- `reach/README.md` -- Comprehensive workflow documentation with safety warnings

**Directory structure:**
- `reach/batches/.gitkeep` -- Empty directory for future batch tracking

### Dependencies

**Depends on:** Nothing. The reach system is fully independent of the site. It references `https://c2l.dev/customs` as a URL string in templates, not as a code dependency.

**Blocks:** Nothing. This is the only builder in iteration 2.

### Implementation Notes

1. **Start with `package.json` and `npm install`.** Everything else depends on dependencies being available. Run `npm install` immediately after creating `package.json`.

2. **Create types.ts first.** All other TypeScript files import from types.ts. Build bottom-up: types -> config -> contacts -> compose -> preview.

3. **The package.json must have `"type": "module"`.** All imports use `.js` extensions (TypeScript convention for ESM). The `tsx` runner handles this transparently.

4. **The CSV must have exactly 10 placeholder rows.** Each row uses obviously fake data: names like "ישראל ישראלי", "דוד דוידוב", "שרה כהן"; emails like "example1@example.co.il"; phones like "050-0000001". Include variety in location (Ashdod, Haifa, Ben Gurion area) and company_size to make the CSV structurally realistic.

5. **Email templates are provided in full by Explorer 2.** Copy the three templates (cold outreach, follow-up, value-add) from the explorer-2-report, wrapping them in the front matter format defined in patterns.md. The content is Hebrew and should not be modified -- Ahiya will personalize later.

6. **The compose/preview script must be runnable as `npx tsx reach/scripts/preview.ts`.** Also add the npm script `"preview": "tsx scripts/preview.ts"` so it can be run as `npm run preview -- --contact 1 --template cold-outreach`.

7. **DORMANT mode must be the default.** When the builder creates `config.yaml`, it ships with `mode: DORMANT`. The preview script must refuse to compose emails in DORMANT mode and print a clear error explaining how to switch to DRY_RUN.

8. **The `--list` command should work in ANY mode**, including DORMANT. Listing contacts is not an email operation and should never be blocked.

9. **Signature contact details in templates MUST match `site/lib/constants.ts`:**
   - Phone: `058-778-9019`
   - Email: `ahiya.butman@gmail.com`
   - Offer URL: `https://c2l.dev/customs`

10. **The README is important.** It is the primary documentation for Ahiya when he returns to activate the system. Include: DORMANT warning banner, directory structure, quick-start commands, pipeline stages, campaign cadence, template editing guide, "what NOT to say" section, contact verification checklist, activation checklist, and response handling guide. Follow the README Pattern in patterns.md.

11. **The "what NOT to say" guidance goes in the README.** This is critical anti-pattern documentation from Explorer 2:
    - Do NOT say "AI" prominently
    - Do NOT say "replaces your employees"
    - Do NOT promise specific accuracy numbers
    - Do NOT use English marketing buzzwords
    - Do NOT attach files to cold emails
    - Do NOT mention pricing beyond Phase 1 (5,000 NIS)

12. **Tests should be comprehensive.** Minimum 15 test cases covering:
    - Config loading (valid DORMANT, valid DRY_RUN, invalid mode, missing file)
    - DORMANT mode enforcement (canCompose returns false, assertCanCompose throws)
    - CSV parsing (valid Hebrew content, sort by priority, invalid status, invalid email)
    - Placeholder detection (fake name, fake email, fake phone, real data)
    - Template parsing (front matter, missing front matter, subject variants)
    - Token replacement (single token, multiple tokens, Hebrew text, unknown token)
    - Contact lookup by priority (found, not found)

13. **Do NOT create any send functionality.** Not even a placeholder, not even a TODO comment about where send code would go. The absence of send capability is a deliberate safety feature.

### Patterns to Follow

Reference patterns from `patterns.md`:
- Use **Type Definitions** pattern for `lib/types.ts`
- Use **Config Pattern** for `config.yaml` and `lib/config.ts`
- Use **CSV Contact Pattern** for `contacts/customs-broker-targets.csv` and `lib/contacts.ts`
- Use **Template Composition Pattern** for templates and `lib/compose.ts`
- Use **Preview Script Pattern** for `scripts/preview.ts`
- Use **Safety Patterns** for DORMANT enforcement throughout
- Use **Testing Patterns** for all test files
- Use **Package.json Pattern** for `package.json`
- Use **tsconfig.json Pattern** for `tsconfig.json`
- Use **README Pattern** for documentation structure
- Use **Error Handling Patterns** for script error handling
- Use **Security Patterns** for input validation and data protection

### Testing Requirements

- Unit tests for `lib/config.ts`: load valid config, reject invalid mode, reject missing file, canCompose/assertCanCompose behavior
- Unit tests for `lib/contacts.ts`: parse Hebrew CSV, sort by priority, reject invalid data, placeholder detection
- Unit tests for `lib/compose.ts`: parse template front matter, token replacement with Hebrew text, subject variant selection, error on missing template
- Integration test (optional): preview script outputs correct format with test fixtures
- All tests must pass with `npm run test`
- Coverage target: 85%+ for lib/ modules

### Potential Split Strategy

**NOT RECOMMENDED.** The task is MEDIUM complexity with ~15 files. Splitting would create unnecessary coordination overhead. However, if the builder encounters unexpected complexity, the natural split would be:

**Sub-builder 1A: Structure + Config + Data**
- package.json, tsconfig.json, vitest.config.ts, .gitignore
- config.yaml
- contacts/customs-broker-targets.csv
- README.md
- batches/.gitkeep
- Estimate: LOW

**Sub-builder 1B: TypeScript Code + Tests + Templates**
- lib/types.ts, lib/config.ts, lib/contacts.ts, lib/compose.ts
- scripts/preview.ts
- templates/ (all 3)
- __tests__/ (all test files)
- Estimate: MEDIUM

This split is only recommended if the builder determines the task is taking significantly longer than expected.

---

## Builder Execution Order

### Parallel Group 1 (Single builder, no dependencies)
- **Builder-1:** Complete c2L-Reach system

### Integration Notes

No integration needed -- single builder creates all files.

**Cross-iteration reference checks (manual, done during validation):**
1. Template phone number matches `site/lib/constants.ts` PHONE_NUMBER (058-778-9019)
2. Template email matches `site/lib/constants.ts` EMAIL (ahiya.butman@gmail.com)
3. Template offer URL is `https://c2l.dev/customs`
4. Template Phase 1 price matches `site/lib/constants.ts` PHASES[0].price (5,000)

**Validation after build:**
1. `cd reach && npm install` -- must succeed
2. `npx tsc --noEmit` -- no type errors
3. `npm run test` -- all tests pass
4. `npx tsx scripts/preview.ts --list` -- outputs 10 contacts
5. `npx tsx scripts/preview.ts --contact 1 --template cold-outreach` -- fails with DORMANT error (correct!)
6. Manually change config.yaml to `mode: DRY_RUN`, then re-run step 5 -- outputs composed email
7. Change config.yaml back to `mode: DORMANT`
8. Verify no `send` function exists: `grep -r "send" reach/lib/ reach/scripts/` should find zero send-related functions
9. Verify real contacts are gitignored: `cat reach/.gitignore` shows `contacts/*-real.csv`
