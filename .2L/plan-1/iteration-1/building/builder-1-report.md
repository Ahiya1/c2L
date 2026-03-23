# Builder-1 Report: Project Scaffold + Main Page

## Status
COMPLETE

## Summary
Created the entire Next.js 16 project scaffold in `site/` from scratch, including all configuration files (package.json, tsconfig.json, next.config.ts, postcss, ESLint, Vitest), the design system (globals.css with c2L tokens), shared components (Header, Footer), the main page with hero/proof-of-work/founder/contact sections, error and 404 pages, constants (contact info, deal structure, external links), a full test infrastructure with 25 passing tests, and the CI/CD GitHub Actions workflow. All four quality gates pass: tests, lint, typecheck, and build.

## Files Created

### Configuration Files
- `site/package.json` - Dependencies, scripts (Next.js 16, React 19, Tailwind v4, Vitest)
- `site/tsconfig.json` - TypeScript strict mode config with `@/*` path alias
- `site/next.config.ts` - Next.js config with `poweredByHeader: false`, `reactStrictMode: true`
- `site/postcss.config.mjs` - PostCSS with `@tailwindcss/postcss` plugin
- `site/eslint.config.mjs` - ESLint 9 flat config using `eslint-config-next` native flat export
- `site/vitest.config.ts` - Vitest with jsdom, React plugin, `@/` alias, coverage config
- `site/.gitignore` - Standard Next.js gitignore rules

### Design System and Layout
- `site/app/globals.css` - Tailwind v4 import + full c2L design system: CSS variables (`--c2l-*` prefix), typography scale (`text-display` through `text-small`), layout utilities (`.container`, `.section`), button styles (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-whatsapp`), card styles, header fixed positioning, focus states, selection color
- `site/app/layout.tsx` - Root layout: Rubik font (Hebrew + Latin), `lang="en"`, viewport config, full metadata with OG/Twitter cards, JSON-LD structured data for Organization schema

### Shared Components
- `site/app/components/Header.tsx` - Fixed header with frosted glass effect, c2L brand link, nav link to /customs
- `site/app/components/Footer.tsx` - Footer with c2L brand, copyright year, mailto link
- `site/app/components/index.ts` - Barrel export for Header and Footer

### Pages
- `site/app/page.tsx` - Main page: Hero (headline + subtitle + CTA to /customs), Proof of Work section (StatViz link), Founder section (Ahiya link), Contact section (email + phone)
- `site/app/not-found.tsx` - 404 page with heading, message, and home link
- `site/app/error.tsx` - Client-side error boundary with reset button

### Constants and Utilities
- `site/lib/constants.ts` - Phone number (local + international), email, WhatsApp URL with pre-filled Hebrew message, external links (StatViz, Ahiya, selahlabs, GitHub), PHASES array (4 phases with Hebrew/English names, prices, deliverables, exit ramps), TOTAL_PRICE

### Placeholder Assets
- `site/public/favicon.ico` - Empty placeholder

### Test Infrastructure
- `site/__tests__/setup.ts` - Test setup importing `@testing-library/jest-dom/vitest`
- `site/__tests__/components/Header.test.tsx` - 4 tests: brand name, nav link to customs, fixed header class, home link
- `site/__tests__/components/Footer.test.tsx` - 4 tests: brand name, copyright year, email text, mailto link
- `site/__tests__/pages/home.test.tsx` - 6 tests: renders without crash, headline, customs link, StatViz link, Ahiya link, contact email
- `site/__tests__/lib/constants.test.ts` - 11 tests: WhatsApp URL format, phone format, email format, phase sum, phase count, exit ramps, HTTPS links, total price, sequential numbering

### CI/CD
- `.github/workflows/ci.yml` - GitHub Actions: quality (typecheck + lint) -> test -> build, Node 22, `working-directory: site`, concurrency groups

## Success Criteria Met
- [x] `cd site && npm install` succeeds
- [x] `npm run build` completes without errors
- [x] `npm run lint` passes with zero warnings
- [x] `npx tsc --noEmit` passes
- [x] `npm run test` passes -- all 25 tests green
- [x] Main page (`/`) renders with: c2L headline, description, link to `/customs`, link to StatViz, link to Ahiya, contact email
- [x] Header component renders with c2L brand and nav link to customs page
- [x] Footer component renders with copyright and contact email
- [x] 404 page file exists with proper structure
- [x] Error page file exists with proper structure
- [x] CI workflow file exists at `.github/workflows/ci.yml`
- [x] Rubik font configured for both Hebrew and Latin subsets

## Tests Summary
- **Unit tests (constants):** 11 tests - WhatsApp URL, phone format, email format, phase data, external links
- **Component tests (Header):** 4 tests - brand, nav, class, home link
- **Component tests (Footer):** 4 tests - brand, copyright, email text, mailto
- **Page tests (HomePage):** 6 tests - render, headline, customs link, StatViz link, Ahiya link, email
- **Total:** 25 tests, ALL PASSING
- **Test duration:** ~700ms

## Dependencies Used
- `next@16.2.1` - Framework
- `react@19.1.0` / `react-dom@19.1.0` - UI runtime
- `lucide-react@0.517.0` - Icons (ExternalLink, ArrowRight, Mail)
- `tailwindcss@4.1.11` / `@tailwindcss/postcss@4.1.11` - Styling
- `vitest@3.2.4` / `@testing-library/react@16.3.0` / `@testing-library/jest-dom@6.6.3` - Testing
- `eslint@9.39.4` / `eslint-config-next@16.2.1` - Linting

## Patterns Followed
- **Root Layout Pattern** from patterns.md: Rubik font, LTR, metadata, structured data - applied exactly
- **CSS Design System Pattern** from patterns.md: `--c2l-*` variables, typography scale, utility classes - copied verbatim
- **Shared Component Pattern** from patterns.md: Header (fixed, nav links), Footer (brand, copyright, email) - matched exactly
- **Page Composition Pattern** from patterns.md: Section-based layout with `.container`, `.section`, `.text-*` classes
- **External Link Pattern** from patterns.md: `target="_blank"` with `rel="noopener noreferrer"` and ExternalLink icon
- **Constants Pattern** from patterns.md: All contact info, PHASES array, LINKS object - copied exactly
- **Not Found Page** and **Error Boundary** patterns from patterns.md - copied exactly
- **CI/CD Pattern** from patterns.md: Three-stage workflow with `working-directory: site`
- **Vitest Configuration** from patterns.md: jsdom, React plugin, `@/` alias, setup file
- **Component Render Test Pattern** and **Constants Validation Test Pattern** from patterns.md - followed exactly

## Deviations from Plan

### 1. ESLint Configuration (Minor)
**Plan specified:** `@eslint/eslintrc` FlatCompat approach with `compat.extends("next/core-web-vitals", "next/typescript")`
**Actual:** Direct import of `eslint-config-next` as flat config array

**Reason:** `eslint-config-next@16.2.1` (installed by `^16` range) now exports a native flat config array, making `FlatCompat` unnecessary and actually causing a circular reference error. The new approach is simpler and correct for the installed version.

### 2. Lint Script (Minor)
**Plan specified:** `"lint": "next lint"`
**Actual:** `"lint": "eslint ."`

**Reason:** Next.js 16.2.x removed the `next lint` subcommand. Direct `eslint .` invocation is the correct approach for this version.

### 3. Footer Component Import (Minor)
**Plan specified (patterns.md):** `import { LINKS, EMAIL } from '@/lib/constants'`
**Actual:** `import { EMAIL } from '@/lib/constants'`

**Reason:** The Footer component only uses `EMAIL`. Importing unused `LINKS` would require a workaround to suppress lint warnings. Keeping imports minimal.

## Integration Notes

### Exports for Builder 2
- **Shared components:** `Header` and `Footer` from `@/app/components` (barrel export via `index.ts`)
- **Constants:** All phase data (`PHASES`, `TOTAL_PRICE`), contact info (`WHATSAPP_URL`, `PHONE_NUMBER`, `PHONE_NUMBER_INTL`, `EMAIL`), external links (`LINKS`) from `@/lib/constants`
- **Design system:** All `--c2l-*` CSS variables and utility classes from `globals.css`

### What Builder 2 Needs to Do
- Create `site/app/customs/layout.tsx` (RTL wrapper with Hebrew metadata)
- Create `site/app/customs/page.tsx` (customs offer page)
- Create `site/__tests__/pages/customs.test.tsx` (customs page tests)
- Import Header/Footer from `@/app/components`
- Import PHASES, WHATSAPP_URL, etc. from `@/lib/constants`
- Use the CSS design system classes established in `globals.css`
- **Do NOT modify** any Builder 1 files (constants, globals.css, shared components)

### Potential Conflicts
None expected. Builder 2 only adds new files in `app/customs/` and `__tests__/pages/customs.test.tsx`.

## Test Generation Summary (Production Mode)

### Test Files Created
- `site/__tests__/setup.ts` - Test setup with jest-dom matchers
- `site/__tests__/components/Header.test.tsx` - Header component render tests
- `site/__tests__/components/Footer.test.tsx` - Footer component render tests
- `site/__tests__/pages/home.test.tsx` - Main page render tests
- `site/__tests__/lib/constants.test.ts` - Constants validation tests

### Test Statistics
- **Unit tests:** 11 tests (constants validation)
- **Component tests:** 8 tests (Header: 4, Footer: 4)
- **Page tests:** 6 tests (HomePage render)
- **Total tests:** 25
- **All tests:** PASSING

### Test Verification
```
npm run test        # 25/25 pass in ~700ms
npx tsc --noEmit    # No type errors
npm run lint        # Zero warnings
npm run build       # Successful production build
```

## CI/CD Status
- **Workflow existed:** No
- **Workflow created:** Yes
- **Workflow path:** `.github/workflows/ci.yml`
- **Pipeline stages:** Quality (typecheck + lint) -> Test -> Build
- **Working directory:** `site` (since Next.js project is in a subdirectory)

## Security Checklist
- [x] No hardcoded secrets (all contact info is intentionally public for B2B)
- [x] `poweredByHeader: false` in next.config.ts
- [x] All external links use `rel="noopener noreferrer"` with `target="_blank"`
- [x] No user input (no forms, no text inputs)
- [x] Error messages don't expose internals (error.tsx shows generic message)
- [x] Robots meta allows indexing (intentional for public site)

## Challenges Overcome

### ESLint Compatibility
`eslint-config-next@16.2.1` changed its export format to native flat config arrays, making the `FlatCompat` approach from the plan incompatible. The `next lint` CLI command was also removed in Next.js 16.2.x. Resolved by importing `eslint-config-next` directly and using `eslint .` as the lint command.

### Duplicate Email in Tests
The home page renders the email address twice (once in the Contact section and once in the Footer). The test originally used `getByText` which throws on multiple matches. Fixed by using `getAllByText` and checking length.
