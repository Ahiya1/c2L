# Explorer 1 Report: Cross-System Alignment Audit

## Executive Summary

c2L's three systems (Site, Reach, Workflow) are well-built individually and share consistent contact information. The primary alignment gap is a **phase model mismatch**: the site's offer page shows 4 customer-facing phases (Exploration, Build, Validation, Delivery) while the workflow plugin implements 6 internal phases (explore, plan, build, validate, heal, deliver). This is actually correct -- the customer-facing model intentionally collapses plan into exploration and heal into validation -- but it is undocumented, creating confusion for anyone maintaining the system. The other significant gaps are missing root-level documentation (no README.md, no CLAUDE.md), a missing `apple-touch-icon.png` referenced in metadata, a broken `tel:` link on the home page, missing CI coverage for the workflow system, and no root `.gitignore`.

---

## Issue 1: Phase Model Mismatch Between Site and Workflow

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/lib/constants.ts` (lines 21-58) -- PHASES array defines 4 phases
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/commands/` -- 6 phase commands (explore, plan, build, validate, heal, deliver)
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/clients/_templates/client.yaml` (line 18) -- `current_phase: explore | plan | build | validate | heal | deliver | complete`

**What's wrong:**
The site presents 4 phases to customers:
1. Exploration (5,000 NIS)
2. Build (80,000 NIS)
3. Validation (35,000 NIS)
4. Delivery (30,000 NIS)

The workflow plugin implements 6 phases:
1. explore
2. plan
3. build
4. validate
5. heal
6. deliver

The customer-facing model collapses "plan" into "exploration" and "heal" into "validation." This mapping is reasonable but **nowhere is it documented**. When a client is in the "plan" phase internally, what phase are they in from the client's perspective? When the system enters "heal," the client should understand they are still in "validation."

**What it should be:**
A mapping document or comment in `site/lib/constants.ts` that explicitly maps the 4 client-facing phases to the 6 internal phases:
- Client Phase 1 (Exploration) = internal `explore` + `plan`
- Client Phase 2 (Build) = internal `build`
- Client Phase 3 (Validation) = internal `validate` + `heal`
- Client Phase 4 (Delivery) = internal `deliver`

**Priority:** MEDIUM -- Does not break user experience but creates maintainability risk and potential confusion when communicating with clients about phase status.

---

## Issue 2: Reach Email Templates Missing Email in Follow-Up and Value-Add Signatures

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/reach/templates/cold-outreach.md` (lines 24-26) -- has BOTH phone AND email
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/reach/templates/follow-up.md` (lines 18-19) -- has phone ONLY
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/reach/templates/value-add.md` (lines 18-19) -- has phone ONLY

**What's wrong:**
The cold-outreach template includes both phone (058-778-9019) and email (ahiya.butman@gmail.com) in the signature. The follow-up and value-add templates include only the phone number and first name "אחיה" -- no email address, no last name. This was previously flagged during iteration 2 validation and accepted as "standard email follow-up practice," but it creates an inconsistency: a broker who wants to reply by email to a follow-up has to go back to the original email or the website to find the address.

**What it should be:**
This is a judgment call. The current approach (shorter follow-up signatures) is defensible for B2B email. If it stays as-is, document it as intentional in the reach README under "Template Editing Guide." If changed, add `ahiya.butman@gmail.com` to the follow-up and value-add signatures.

**Priority:** LOW -- Intentional design choice, but should be documented as such.

---

## Issue 3: Home Page `tel:` Link Uses Local Format Without Country Code

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/app/page.tsx` (line 103)

**What's wrong:**
The home page phone link uses:
```tsx
href={`tel:${PHONE_NUMBER.replace(/-/g, '')}`}
```
This produces `tel:0587789019` (local Israeli format without country code). On mobile devices outside Israel, this will not dial correctly.

The customs offer page correctly uses `PHONE_NUMBER_INTL`:
```tsx
href={`tel:${PHONE_NUMBER_INTL}`}
```
This produces `tel:+972587789019` (international format).

**What it should be:**
The home page should use `PHONE_NUMBER_INTL` for the `tel:` href, just like the customs page does:
```tsx
href={`tel:${PHONE_NUMBER_INTL}`}
```

**Priority:** HIGH -- Breaks the phone call CTA for any user outside Israel. The home page is in English and more likely to be viewed by international visitors.

---

## Issue 4: Missing `apple-touch-icon.png` in public/

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/app/layout.tsx` (line 30) -- references `/apple-touch-icon.png`
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/public/` -- contains only `favicon.ico` and `og-image.png`

**What's wrong:**
The root layout metadata declares:
```tsx
apple: '/apple-touch-icon.png',
```
But no such file exists in `site/public/`. When an iOS user adds the site to their home screen, they will see a generic icon or a blank.

**What it should be:**
Either:
1. Create an `apple-touch-icon.png` (180x180px) in `site/public/`, or
2. Remove the `apple` line from the metadata if there is no icon to serve.

**Priority:** LOW -- Minor cosmetic issue for iOS users who bookmark the site, but it is a 404 asset reference.

---

## Issue 5: Missing Root README.md

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/README.md` -- does not exist

**What's wrong:**
There is no README.md at the repository root. The `reach/` directory has its own README.md, but the top-level repository has nothing. Anyone visiting the GitHub repo or cloning it sees no explanation of what c2L is, how the three systems relate, or how to get started.

**What it should be:**
A root README.md that covers:
- What c2L is (one paragraph)
- The three systems (site, reach, workflow) and what each does
- Directory structure overview
- How to run each system locally
- Deployment information (Vercel for site, dormant for reach)
- Link to the plugin commands

**Priority:** MEDIUM -- Does not break functionality but essential for project onboarding and GitHub presentation.

---

## Issue 6: Missing CLAUDE.md at Root

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/CLAUDE.md` -- does not exist

**What's wrong:**
There is no CLAUDE.md at the repository root. This file helps Claude Code understand the project context, coding conventions, and important constraints (like "reach must NEVER be activated"). Without it, each Claude Code session starts from scratch.

**What it should be:**
A CLAUDE.md that covers:
- Project overview and the three-system architecture
- Key constraint: reach system must NEVER send emails without explicit approval
- Phase model mapping (4 customer-facing to 6 internal)
- Contact information source of truth: `site/lib/constants.ts`
- Where commands live and how the plugin system works
- Testing: `site/` and `reach/` have vitest suites; workflow has bash validation scripts

**Priority:** MEDIUM -- Improves every future Claude Code interaction with this repo.

---

## Issue 7: Missing Root `.gitignore`

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/.gitignore` -- does not exist

**What's wrong:**
There is no root-level `.gitignore`. The `site/` and `reach/` subdirectories have their own `.gitignore` files, and `clients/.gitignore` covers client data. But root-level patterns (`.DS_Store`, `.env`, editor files, etc.) are not covered.

**What it should be:**
A root `.gitignore` with:
```
.DS_Store
.env
.env.*
*.swp
*.swo
*~
.vscode/
.idea/
```

**Priority:** LOW -- The subdirectory `.gitignore` files cover the main concerns, but a root file prevents accidental commits of editor/OS files.

---

## Issue 8: CI Does Not Cover Workflow System Tests

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/.github/workflows/ci.yml` -- covers site and reach only

**What's wrong:**
The CI pipeline runs quality checks and tests for `site/` and `reach/` but completely ignores the workflow system. The `__tests__/` directory at the root contains bash validation scripts (`validate-commands.sh`, `validate-structure.sh`, `validate-templates.sh`, `validate-client-yaml.sh`) and a runner (`run-all.sh`), but none of these are executed in CI.

**What it should be:**
Add a `workflow-test` job to `.github/workflows/ci.yml`:
```yaml
workflow-test:
  name: Workflow - Validation
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run validation suite
      run: bash __tests__/run-all.sh
```

**Priority:** MEDIUM -- These tests exist and pass locally but are not enforced on push/PR. Changes to commands or templates could break without CI catching it.

---

## Issue 9: Reach Templates Reference "Phase 1" Pricing Correctly but Inconsistently

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/reach/templates/cold-outreach.md` (line 16) -- "שלב ראשון (חקירה) עולה 5,000 ₪"
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/reach/templates/follow-up.md` (line 12) -- "שלב ראשון — חקירת התהליך שלך — עולה 5,000 ₪ בלבד"
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/lib/constants.ts` (line 27) -- Phase 1 price: 5,000

**What's wrong:**
The pricing is consistent (5,000 NIS for Phase 1 across all files). However, the cold-outreach template calls it "שלב ראשון (חקירה)" (Phase 1 - Exploration) while the follow-up calls it "שלב ראשון — חקירת התהליך שלך" (Phase 1 - exploring your process). The site calls it "חקירה" (Exploration). These are not bugs -- they are natural variation in how you describe the same thing. But the cold-outreach template additionally references the total price implicitly ("500,000 עד 1,400,000 שקל בשנה" for clerk costs), while the reach README explicitly says "Do NOT mention pricing beyond Phase 1" and "Do NOT quote 150,000 NIS in a cold email."

**What it should be:**
This is actually fine -- the templates follow the README guidance. The 500K-1.4M figure is the client's CURRENT cost, not c2L's price. No change needed, but this was worth verifying.

**Priority:** NONE -- No issue found. Contact details and pricing are consistent.

---

## Issue 10: `selahlabs` Link in constants.ts Is Unused

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/lib/constants.ts` (line 16) -- `selahlabs: 'https://selahlabs.xyz'`
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/app/page.tsx` -- no reference to `LINKS.selahlabs`
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/app/customs/page.tsx` -- no reference to `LINKS.selahlabs`

**What's wrong:**
The `LINKS` object in constants.ts includes a `selahlabs` URL (`https://selahlabs.xyz`) but it is never referenced in any page component. The Header, Footer, home page, and customs page all use `LINKS.statviz` and `LINKS.ahiya` but never `LINKS.selahlabs`. This is dead code.

**What it should be:**
Either remove the `selahlabs` entry from `LINKS` (if it is not needed) or use it somewhere on the site. Given the vision says "links to Ahiya Butman" and "links to StatViz as proof of work," selahlabs may be intentional for future use but is currently unused.

**Priority:** LOW -- Dead code, no functional impact.

---

## Issue 11: `tsconfig.tsbuildinfo` Committed Despite `.gitignore` Rule

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/tsconfig.tsbuildinfo` -- exists in repo
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/.gitignore` (line 35) -- `*.tsbuildinfo`

**What's wrong:**
The site's `.gitignore` correctly lists `*.tsbuildinfo` as ignored, but `site/tsconfig.tsbuildinfo` exists in the file listing. This means it was committed before the `.gitignore` rule was added, or the `.gitignore` rule uses a different pattern. Once a file is tracked by git, adding it to `.gitignore` does not remove it from tracking.

**What it should be:**
Run `git rm --cached site/tsconfig.tsbuildinfo` to untrack the file. The `.gitignore` rule will then prevent it from being committed again.

**Priority:** LOW -- No functional impact but pollutes the repository with a build artifact.

---

## Issue 12: `next-env.d.ts` Committed Despite `.gitignore` Rule

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/next-env.d.ts` -- exists in repo
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/.gitignore` (line 36) -- `next-env.d.ts`

**What's wrong:**
Same issue as Issue 11. The file was committed before the `.gitignore` rule was in effect and is still tracked.

**What it should be:**
Run `git rm --cached site/next-env.d.ts` to untrack the file.

**Priority:** LOW -- No functional impact.

---

## Issue 13: Reach Coverage Directory Committed

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/reach/coverage/` -- entire directory with `lcov.info`, `lcov-report/` etc.
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/reach/.gitignore` (line 8) -- `coverage/`

**What's wrong:**
The reach `.gitignore` correctly lists `coverage/` but the directory and its contents are in the repo. This is a build artifact from running `vitest run --coverage`.

**What it should be:**
Run `git rm -r --cached reach/coverage/` to untrack the directory.

**Priority:** LOW -- No functional impact but adds unnecessary files to the repo.

---

## Issue 14: Plugin Manifest Does Not Reference Command Paths

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/.claude-plugin/plugin.json`

**What's wrong:**
The plugin manifest is minimal:
```json
{
  "name": "c2l",
  "version": "1.0.0",
  "description": "c2L - Cooperative client engagement tooling for document processing solutions",
  "author": { "name": "Ahiya" },
  "keywords": ["engagement", "workflow", "customs", "document-processing", "cooperative"]
}
```
It does not include a `commands` field pointing to the command directory, nor does it specify `agents` or any other plugin structure. Claude Code's plugin system typically looks for a `commands` field or auto-discovers `.md` files in `commands/`, but the manifest should be explicit about what the plugin provides.

**What it should be:**
Add a `commands` field (or verify that Claude Code auto-discovers commands from the `commands/` directory adjacent to the plugin manifest). If explicit registration is needed:
```json
{
  "name": "c2l",
  "version": "1.0.0",
  "description": "c2L - Cooperative client engagement tooling for document processing solutions",
  "author": { "name": "Ahiya" },
  "commands_dir": "../commands"
}
```

**Priority:** LOW -- Commands appear to work via directory convention, but the manifest should document the relationship explicitly.

---

## Issue 15: Offer Page Terminology "דברו איתנו" (Talk to Us) vs. Solo Operation

**Files affected:**
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/app/customs/page.tsx` (lines 98, 264) -- "דברו איתנו בווטסאפ" (Talk to US on WhatsApp)
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/app/customs/page.tsx` (line 27) -- `c2L` used with <bdi> tag
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/site/app/page.tsx` (lines 66-68) -- "c2L is a one-person operation. Ahiya designs, builds, and delivers every system personally."

**What's wrong:**
The home page emphasizes that c2L is a one-person operation ("the person you talk to is the person who builds"). But the customs offer page uses plural language: "דברו איתנו" (talk to US), "בנינו פלטפורמת B2B" (WE built a B2B platform), "אחיה בונה את המערכת יחד איתך" (Ahiya builds the system with you). The plural forms are standard business Hebrew (royal "we") and may be intentional, but they create a subtle tension with the "one person, no layers" message.

**What it should be:**
This is a judgment call. In Hebrew business communication, using "אנחנו" (we) even for a solo operator is normal and does not necessarily imply a team. The WhatsApp CTA "דברו איתנו" is a common business pattern. However, for maximum consistency with the "one person" positioning, consider "דברו איתי" (talk to ME) instead of "דברו איתנו" (talk to US). This is a branding decision, not a bug.

**Priority:** LOW -- Cultural/linguistic judgment call, not a technical issue.

---

## Verified: No Issues Found

### Contact Information Consistency: PASS
- Phone `058-778-9019` is identical in: `site/lib/constants.ts`, `reach/config.yaml`, all 3 reach templates
- Email `ahiya.butman@gmail.com` is identical in: `site/lib/constants.ts`, `reach/config.yaml`, cold-outreach template
- WhatsApp URL correctly constructed from `+972587789019` in `site/lib/constants.ts`
- Reach `contact_details.offer_url` correctly set to `https://c2l.dev/customs`

### Offer Page Links in Emails: PASS
- All 3 templates link to `https://c2l.dev/customs`
- The URL matches the site's actual route (`site/app/customs/page.tsx`)

### Branding Capitalization "c2L": PASS
- `c2L` is consistently used in: site layout metadata (`c2L`), Header component (`c2L`), Footer (`c2L`), plugin manifest name (`c2l` lowercase -- this is a package name, lowercase is correct)
- The customs page uses `<bdi>c2L</bdi>` to prevent RTL from mangling the brand name -- this is correct

### External Links: PASS
- `https://statviz.xyz` -- referenced in site constants and used on both pages
- `https://ahiya.xyz` -- referenced in site constants and used in founder section
- `https://github.com/Ahiya1` -- referenced in site constants (not visibly used on any page, but available)

### Reach System Dormancy: PASS
- `config.yaml` mode is `DORMANT`
- `canCompose()` returns false in DORMANT mode
- Preview script blocks composition in DORMANT mode with exit code 2
- No send function exists anywhere in the codebase
- README has extensive dormancy warnings and activation checklist
- All contacts in CSV are placeholder data with clear markers

### Client Template Structure: PASS
- `client.yaml` template phase values (`explore | plan | build | validate | heal | deliver | complete`) match the 6 commands plus a terminal state
- Templates are well-structured with placeholder tokens
- `.gitignore` in `clients/` correctly excludes sample documents and binary files while preserving `.md` and `.yaml` files

---

## Summary of Issues by Priority

### HIGH (1 issue)
| # | Issue | Files | Fix Effort |
|---|-------|-------|------------|
| 3 | Home page `tel:` link uses local format | `site/app/page.tsx:103` | 1 min -- change to `PHONE_NUMBER_INTL` |

### MEDIUM (4 issues)
| # | Issue | Files | Fix Effort |
|---|-------|-------|------------|
| 1 | Phase model mismatch undocumented | `site/lib/constants.ts`, commands, `client.yaml` | 15 min -- add mapping comment/doc |
| 5 | Missing root README.md | (new file) | 30 min -- write comprehensive README |
| 6 | Missing CLAUDE.md | (new file) | 20 min -- write project context doc |
| 8 | CI does not cover workflow tests | `.github/workflows/ci.yml` | 10 min -- add job |

### LOW (7 issues)
| # | Issue | Files | Fix Effort |
|---|-------|-------|------------|
| 2 | Follow-up/value-add missing email in signature | `reach/templates/*.md` | 2 min or document as intentional |
| 4 | Missing `apple-touch-icon.png` | `site/public/`, `site/app/layout.tsx` | 5 min -- create or remove reference |
| 7 | Missing root `.gitignore` | (new file) | 2 min |
| 10 | Unused `selahlabs` link in constants | `site/lib/constants.ts` | 1 min -- remove or use |
| 11 | `tsconfig.tsbuildinfo` tracked despite gitignore | `site/tsconfig.tsbuildinfo` | 1 min -- `git rm --cached` |
| 12 | `next-env.d.ts` tracked despite gitignore | `site/next-env.d.ts` | 1 min -- `git rm --cached` |
| 13 | Reach `coverage/` tracked despite gitignore | `reach/coverage/` | 1 min -- `git rm -r --cached` |
| 14 | Plugin manifest lacks command path reference | `.claude-plugin/plugin.json` | 5 min |
| 15 | "דברו איתנו" vs solo operation messaging | `site/app/customs/page.tsx` | Branding decision |

### Total estimated fix time: ~90 minutes

---

## Recommendations for Planner

1. **Fix the HIGH issue first** -- the `tel:` link on the home page is a one-line change that directly affects user experience for international visitors.

2. **Write README.md and CLAUDE.md together** -- these two documents serve different audiences (humans and Claude Code) but share overlapping content. Writing them together avoids duplication.

3. **Add the CI workflow job before any other changes** -- this ensures all subsequent changes in this iteration are validated by CI.

4. **Document the phase mapping explicitly** -- add a comment block in `site/lib/constants.ts` above the PHASES array that maps the 4 client phases to the 6 internal phases. This is the kind of implicit knowledge that causes confusion months later.

5. **Clean up tracked-but-ignored files in a single commit** -- the `tsconfig.tsbuildinfo`, `next-env.d.ts`, and `coverage/` issues can all be fixed with `git rm --cached` in one commit.

6. **The reach email signature style is a branding decision, not a bug** -- do not prioritize it as a fix. If Ahiya wants to add email to follow-up signatures, that is a content choice.

7. **Builder split recommendation**: All fixes are small enough for a single builder. No subdivision needed. Estimated total effort: 90 minutes.
