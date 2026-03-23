# Builder Task Breakdown

## Overview

2 primary builders will work in sequence (Builder 2 depends on Builder 1's scaffold).
Neither builder is expected to need splitting -- both are MEDIUM complexity.

## Builder Assignment Strategy

- **Builder 1:** Project scaffold + shared components + main page + CI/CD + test infrastructure
- **Builder 2:** Customs offer page with full Hebrew content, RTL layout, deal structure, CTAs

Builder 2 depends on Builder 1 completing the scaffold (package.json, configs, globals.css, root layout, shared components). Once the scaffold exists, Builder 2 can work on the customs page independently.

---

## Builder-1: Project Scaffold + Main Page

### Scope

Create the entire Next.js project from scratch in the `site/` directory, including all configuration files, the design system, shared components, the main page, test infrastructure, CI/CD workflow, and error/404 pages.

### Complexity Estimate
**MEDIUM**

The work is straightforward -- mostly copying proven patterns from selahlabs with c2L-specific content. The main page is simpler than selahlabs (fewer sections, no fleet indicator). The bulk of the work is getting all config files right.

### Success Criteria

- [ ] `cd site && npm install` succeeds
- [ ] `npm run dev` starts the dev server without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes with zero warnings
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run test` passes -- all tests green
- [ ] Main page (`/`) renders with: c2L headline, description, link to `/customs`, link to StatViz, link to Ahiya, link to selahlabs
- [ ] Header component renders with c2L brand and nav link to customs page
- [ ] Footer component renders with copyright and contact email
- [ ] 404 page renders
- [ ] Error page renders
- [ ] CI workflow file exists at `.github/workflows/ci.yml`
- [ ] Rubik font loads for both Hebrew and Latin subsets

### Files to Create

**Configuration files:**
- `site/package.json` -- Dependencies (see patterns.md)
- `site/tsconfig.json` -- TypeScript config (see patterns.md)
- `site/next.config.ts` -- Next.js config with `poweredByHeader: false`
- `site/postcss.config.mjs` -- PostCSS with `@tailwindcss/postcss`
- `site/eslint.config.mjs` -- ESLint 9 flat config
- `site/vitest.config.ts` -- Vitest configuration
- `site/.gitignore` -- Git ignore rules

**Design system and layout:**
- `site/app/globals.css` -- Tailwind import + c2L design system tokens + utility classes
- `site/app/layout.tsx` -- Root layout: Rubik font, LTR, metadata, structured data

**Shared components:**
- `site/app/components/Header.tsx` -- Fixed header with c2L brand + nav
- `site/app/components/Footer.tsx` -- Footer with copyright + email
- `site/app/components/index.ts` -- Barrel export

**Pages:**
- `site/app/page.tsx` -- Main page (English-primary)
- `site/app/not-found.tsx` -- 404 page
- `site/app/error.tsx` -- Error boundary page

**Constants and utilities:**
- `site/lib/constants.ts` -- Contact info, URLs, deal structure data, external links

**Placeholder assets:**
- `site/public/favicon.ico` -- Placeholder (can be empty or a simple generated icon)

**Test infrastructure:**
- `site/__tests__/setup.ts` -- Test setup with jest-dom
- `site/__tests__/components/Header.test.tsx` -- Header render tests
- `site/__tests__/components/Footer.test.tsx` -- Footer render tests
- `site/__tests__/pages/home.test.tsx` -- Main page render tests
- `site/__tests__/lib/constants.test.ts` -- Constants validation tests

**CI/CD:**
- `.github/workflows/ci.yml` -- GitHub Actions workflow (typecheck, lint, test, build)

### Dependencies

**Depends on:** Nothing -- Builder 1 starts from scratch
**Blocks:** Builder 2 (needs the scaffold to exist before creating the customs page)

### Implementation Notes

1. **Start by creating `package.json` and running `npm install`** -- everything else depends on dependencies being available.

2. **Copy the selahlabs design system but rename the CSS variable prefix** from `--sl-` to `--c2l-`. Keep the same colors, spacing, and typography scale. The visual identity is intentionally similar to selahlabs -- both are Ahiya's projects.

3. **The root layout uses `lang="en"`** because the main page is English-primary. The customs page will override this with its own layout wrapper (`dir="rtl" lang="he"`).

4. **Rubik font is the ONLY font** -- it handles both English and Hebrew. Do NOT add Inter as a second font. One font family for the entire site.

5. **The main page content should include:**
   - Hero section: c2L identity headline ("AI Systems That Carry Responsibility" or similar)
   - Brief description: what c2L does (builds systems that replace manual workflows)
   - CTA: link to `/customs` offer page ("See our customs brokerage offer")
   - Proof of work section: link to StatViz with brief description
   - Founder section: Ahiya's name + link to ahiya.xyz (follow selahlabs Founder component pattern)
   - Contact section: email + WhatsApp link (follow selahlabs Contact component pattern)

6. **Run `npm install` after creating `package.json`** so that `npm run build` and `npm run test` work for validation.

7. **The `.github/workflows/ci.yml` file goes in the repo root**, not in `site/`. The workflow uses `working-directory: site` for all commands.

8. **Test infrastructure uses Vitest** not Jest. The vitest.config.ts uses `@vitejs/plugin-react` for JSX support and `jsdom` environment for DOM testing.

### Patterns to Follow

Reference patterns from `patterns.md`:
- Use **Root Layout Pattern** for `app/layout.tsx`
- Use **CSS Design System Pattern** for `app/globals.css`
- Use **Shared Component Pattern** for Header and Footer
- Use **Page Composition Pattern** for `app/page.tsx`
- Use **External Link Pattern** for StatViz/Ahiya links
- Use **Constants Pattern** for `lib/constants.ts`
- Use **Not Found Page** and **Error Boundary** patterns
- Use **CI/CD Pattern** for GitHub Actions workflow
- Use **Vitest Configuration** for test setup
- Use **Component Render Test Pattern** and **Constants Validation Test Pattern** for tests

### Testing Requirements

- Unit tests for `lib/constants.ts` (validate WhatsApp URL format, phase sum = total, all links HTTPS)
- Render tests for `Header` component (brand name present, nav link to customs)
- Render tests for `Footer` component (copyright present, email present)
- Render test for main page (renders without crash, contains link to customs, contains link to StatViz)
- All tests must pass with `npm run test`
- Coverage target: 70%+ for components, 90%+ for constants

---

## Builder-2: Customs Offer Page

### Scope

Create the customs brokerage offer page at `/customs` with full Hebrew content, RTL layout, deal structure presentation, pain point narrative, ROI argument, trust signals, and WhatsApp/phone/email CTAs. This is the revenue-generating page -- the single most important asset in iteration 1.

### Complexity Estimate
**MEDIUM**

The page structure follows the selahlabs pattern (section-based composition). The RTL layout is handled by a route-level layout wrapper. The main challenge is crafting compelling Hebrew content, but the structure and data (phases, pricing, pain points) are well-defined by the explorer reports.

### Success Criteria

- [ ] `/customs` page renders without errors
- [ ] Page is fully in Hebrew with correct RTL layout
- [ ] RTL text direction is correct (text flows right-to-left)
- [ ] "c2L" brand name renders correctly within Hebrew text (using `<bdi>` wrapper)
- [ ] Hero section names the specific pain (clerk costs, port delays, errors)
- [ ] 4-phase engagement model is visible with pricing per phase
- [ ] Exit ramps are explicitly stated for phases 1-3
- [ ] ROI comparison is visible (clerk cost vs. system cost)
- [ ] WhatsApp CTA button works (correct URL with pre-filled Hebrew message)
- [ ] Phone number is displayed and clickable
- [ ] Email is displayed and clickable
- [ ] Link to StatViz as proof of work
- [ ] Link to Ahiya
- [ ] CTA appears at least twice on the page (after pain section and after pricing)
- [ ] Mobile responsive (works at 375px width)
- [ ] All tests pass

### Files to Create

**Layout:**
- `site/app/customs/layout.tsx` -- RTL wrapper with Hebrew metadata

**Page:**
- `site/app/customs/page.tsx` -- Full customs offer page

**Tests:**
- `site/__tests__/pages/customs.test.tsx` -- Customs page render tests

### Dependencies

**Depends on:** Builder 1 (needs scaffold: package.json, node_modules, configs, globals.css, root layout, shared components, lib/constants.ts)
**Blocks:** Nothing -- this is the final builder

### Implementation Notes

1. **The customs page layout (`app/customs/layout.tsx`) wraps content in `<div dir="rtl" lang="he">`**. It also overrides the metadata with Hebrew title and description. See the Customs Route Layout Pattern in patterns.md.

2. **The page MUST use the Header and Footer components** from `app/components/`. The Header will appear in LTR (inherited from root layout), which is acceptable -- the nav bar has English content. The customs page content inside the `<div dir="rtl">` will be RTL.

3. **Page section order (based on explorer analysis of effective offer pages):**
   1. Header (shared component, from Builder 1)
   2. Hero: Problem headline + pain numbers (clerk costs, error rates, port delays)
   3. Primary CTA: WhatsApp button (for brokers who already know they want this)
   4. Process: "How it works" -- 4-phase grid with deliverables and exit ramps
   5. ROI: Cost comparison table (annual clerk cost vs. one-time system cost)
   6. Trust: Link to StatViz, mention Ahiya by name, "no ongoing contract" callout
   7. Final CTA: WhatsApp + phone + email options
   8. Footer (shared component, from Builder 1)

4. **Hebrew content guidelines:**
   - Write in Hebrew first, not translated English
   - Tone: professional-direct, not corporate marketing
   - Use terminology customs brokers actually use (see domain terminology in explorer-2 report)
   - Be specific: name exact numbers (500K-1.4M NIS, 5K for Phase 1)
   - Key Hebrew phrases from explorer-2:
     - "עמילי מכס מעסיקים 3-8 פקידי הקלדה" (opening pain)
     - "לא כלי שעוזר — מערכת שנושאת אחריות" (value prop)
     - "תיקון רשימון עולה זמן, כסף, ולפעמים קנס" (error pain)
     - "מכולה שעומדת בנמל עולה 500-1,000 ש״ח ליום" (port delay pain)
     - "אין חוזה תחזוקה שנתי" (no lock-in)

5. **Use the PHASES constant from `lib/constants.ts`** to render the phase/pricing table. Do not hardcode phase data in the page.

6. **WhatsApp CTA uses `WHATSAPP_URL` from constants.** Phone uses `tel:` link with `PHONE_NUMBER_INTL`. Email uses `mailto:` link with `EMAIL`.

7. **Bidirectional text handling:** Wrap "c2L" in `<bdi>` tags when it appears within Hebrew text. Wrap "SHAAR" and other English acronyms in `<span dir="ltr">`. Numbers do not need wrappers.

8. **The Shekel symbol (&#8362;) should be used** instead of the abbreviation. In Hebrew text, prices read naturally as "5,000 &#8362;" (shekel sign after the number).

9. **Mobile responsive considerations:**
   - Phase cards stack vertically on mobile (use `grid` that collapses)
   - CTA buttons are full-width on mobile
   - Text sizes use `clamp()` (inherited from the design system)
   - Test at 375px width

### Patterns to Follow

Reference patterns from `patterns.md`:
- Use **Customs Route Layout Pattern** for `app/customs/layout.tsx`
- Use **Phase/Deal Structure Pattern** for rendering the engagement model
- Use **WhatsApp CTA Pattern** for the primary CTA button
- Use **Bidirectional Text Pattern** for mixing Hebrew and English
- Use **External Link Pattern** for StatViz proof-of-work link
- Use **Page Composition Pattern** for overall page structure
- Use **Page Render Test Pattern** for tests

### Testing Requirements

- Render test: customs page renders without crashing
- Render test: page contains WhatsApp CTA link with correct URL format
- Render test: page contains all 4 phase names in Hebrew
- Render test: page contains pricing numbers
- Render test: page contains StatViz link
- All tests must pass with `npm run test`
- Coverage target: 60%+ for the page component

### Content Reference

The builder should use the domain knowledge from the explorer-2 report for Hebrew content:

**Pain points (in priority order for the page):**
1. Cost: 3-8 clerks at 8K-15K NIS/month = 500K-1.4M NIS/year
2. Errors: 5-15% of declarations need amendment (costly, time-consuming)
3. Port delays: 500-1,000 NIS/day for containers sitting at port
4. Training: 3-6 months to train a new clerk, then they leave

**Trust signals:**
1. StatViz as proof of prior work (working B2B platform with Hebrew support)
2. Structured 4-phase approach with exit ramps (no upfront risk)
3. Ahiya's direct involvement (person, not faceless company)
4. No ongoing maintenance contract (system runs independently)

**ROI argument:**
- Annual clerk cost: 500,000-1,400,000 NIS
- One-time system cost: 150,000 NIS
- Payback period: 2-4 months
- Year 1 savings: 350,000-1,250,000 NIS

---

## Builder Execution Order

### Parallel Group 1 (No dependencies)
- **Builder-1:** Project scaffold + main page

### Parallel Group 2 (Depends on Group 1)
- **Builder-2:** Customs offer page

### Integration Notes

Integration is minimal because:
1. Builder 1 owns all shared files (configs, design system, shared components, constants)
2. Builder 2 only adds new files (`app/customs/layout.tsx`, `app/customs/page.tsx`, `__tests__/pages/customs.test.tsx`)
3. There are no conflicting file edits between builders
4. Both builders use the same design system tokens from `globals.css`

**Potential conflict area:** If Builder 2 needs to modify `lib/constants.ts` (e.g., adjust phase content), this would conflict with Builder 1's version. To prevent this: Builder 1 should create `constants.ts` with the complete PHASES data as specified in the patterns.md Constants Pattern. Builder 2 should use it as-is. If Builder 2 needs changes, they should note them in their report rather than modifying the file.

**Shared files that need coordination:**
- `lib/constants.ts` -- Created by Builder 1, consumed by Builder 2 (read-only for Builder 2)
- `app/globals.css` -- Created by Builder 1, consumed by Builder 2 (read-only for Builder 2)
- `app/components/Header.tsx` and `Footer.tsx` -- Created by Builder 1, imported by Builder 2

**Validation after integration:**
1. `cd site && npm run build` -- must succeed
2. `npm run test` -- all tests pass
3. `npm run lint` -- no warnings
4. `npx tsc --noEmit` -- no type errors
5. Manual check: both pages render correctly in browser
6. Manual check: customs page RTL layout is correct
7. Manual check: WhatsApp CTA opens WhatsApp with pre-filled message
