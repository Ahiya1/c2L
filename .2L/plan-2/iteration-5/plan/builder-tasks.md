# Builder Tasks — Iteration 5

## Builder 1: Home Page Transformation + CSS Polish
**Scope:** Core visual transformation
**Files:** `site/app/page.tsx`, `site/app/globals.css`

### Home Page (page.tsx)
1. **Bilingual hero section:**
   - Hebrew headline large/prominent (dir="rtl" lang="he" on the block)
   - English version below, smaller weight/size
   - Use `<bdi>c2L</bdi>` in Hebrew text to prevent RTL mangling
   - Hebrew first — this is the primary audience

2. **Break visual monotony:**
   - Vary section max-widths (not all max-w-3xl)
   - Not everything centered — some sections can be left/right weighted
   - Hero should be wider (max-w-4xl already, good)
   - Proof of Work can be narrower, more intimate
   - Founder section: consider asymmetric or left-aligned

3. **Bilingual key sections:**
   - Each section gets Hebrew headline + English subtitle (or vice versa)
   - Keep body text in whatever language is natural for that section
   - Don't over-translate — natural bilingual flow

4. **Strengthen CTAs:**
   - Primary CTA: larger padding, more visual weight
   - Contact section: structured hierarchy (WhatsApp primary, phone secondary, email tertiary)
   - Use bilingual CTA text

5. **Section flow:**
   - Remove zebra-stripe bg-secondary alternation
   - Use subtle separators or gradient transitions between sections
   - Create visual flow that guides the eye down

### CSS (globals.css)
1. **Section transitions:** Add subtle divider styles instead of hard bg swaps
2. **Tighten section-sm:** Reduce padding from 4rem to 2.5-3rem
3. **Add width variations:** `container-tight` for intimate sections
4. **CTA enhancements:** Slightly larger btn-primary padding, subtle shadow
5. **Section separator utility class** for smooth transitions

## Builder 2: Customs Page Polish + Tests
**Scope:** Light polish + test maintenance
**Files:** `site/app/customs/page.tsx`, `site/__tests__/pages/home.test.tsx`

### Customs Page (customs/page.tsx)
1. **Alignment consistency:** Apply same section flow patterns from CSS changes
2. **Tighten spacing** where sections feel floaty (same spacing fixes)
3. **Do NOT change:** Content, pricing, phase model, CTA structure, Hebrew text
4. **Allowed:** Section flow improvements, padding adjustments, subtle separators

### Tests (home.test.tsx)
1. Update headline test for bilingual content (Hebrew headline now primary)
2. Verify links still work (customs, StatViz, Ahiya, email, phone)
3. Add test for Hebrew content presence on home page
4. Keep all existing test patterns — only modify what changed
5. **Customs tests must pass unchanged**
