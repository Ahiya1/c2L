# Builder-1 Report: Home Page Transformation + CSS Polish

## Status
COMPLETE

## Summary
Rewrote the home page (`page.tsx`) into a bilingual, Hebrew-first experience with varied section layouts and improved visual flow. Updated the CSS design system (`globals.css`) with tighter section-sm spacing, a section-divider utility, a container-tight width class, and enhanced btn-primary styling. All existing CSS utilities preserved -- customs page unaffected.

## Files Modified

### Implementation
- `site/app/page.tsx` -- Major rewrite: bilingual hero (Hebrew h1 + English subtitle), bilingual section headings throughout, removed zebra-stripe bg-secondary alternation, replaced with section-divider flow, varied section widths (max-w-4xl hero, container-tight for Proof of Work and Founder, max-w-xl for Contact), strengthened Contact CTA (email as btn-primary, phone as btn-secondary with icon), bilingual CTA button on hero.
- `site/app/globals.css` -- Reduced section-sm padding from 4rem to 2.5rem, added section-divider utility (thin border-top), added container-tight utility (640px max-width), increased btn-primary padding (0.875rem 2rem) with subtle box-shadow, enhanced btn-primary hover shadow.

## Changes in Detail

### page.tsx Changes
1. **Hero Section:** Hebrew headline `h1` with `dir="rtl" lang="he"` wrapper, English subtitle below in text-secondary/text-subheading. CTA button is bilingual: Hebrew "ראו את ההצעה שלנו" with English "Our Offer" subtitle, ArrowRight icon preserved.
2. **Proof of Work Section:** Removed `bg-secondary`, added `section-divider`. Hebrew heading "הוכחת עבודה" with English "Proof of Work" subtitle. Uses `container-tight` for more intimate feel. StatViz link preserved.
3. **Founder Section:** Removed `bg-secondary` (was on bg-primary), added `section-divider`. Hebrew heading "נבנה על ידי אחיה" with English "Built by Ahiya" subtitle. Uses `container-tight`, left-aligned text (no text-center). Ahiya link preserved.
4. **Contact Section:** Removed `bg-secondary`, added `section-divider`. Hebrew heading "בואו נדבר" with English "Let's Talk" subtitle. Email promoted from btn-secondary to btn-primary with Mail icon. Phone promoted from naked text to btn-secondary with Phone icon. Stronger close.
5. **RTL handling:** All Hebrew blocks wrapped in `div[dir="rtl"][lang="he"]`. Brand name uses `<bdi>c2L</bdi>` in mixed-direction text.
6. **Imports:** Added `Phone` from lucide-react (for contact section). Removed unused `Mail` import was already there; kept it.

### globals.css Changes
1. `.section-sm` padding: `var(--c2l-space-2xl)` (4rem) changed to `2.5rem`
2. `.section-divider` added: `border-top: 1px solid var(--c2l-border)`
3. `.container-tight` added: `max-width: 640px` with standard padding
4. `.btn-primary` padding: `0.875rem 2rem` (was inheriting 0.75rem 1.5rem from .btn)
5. `.btn-primary` box-shadow: `0 1px 3px rgba(0, 0, 0, 0.08)` at rest, `0 2px 6px rgba(0, 0, 0, 0.12)` on hover
6. All existing utilities preserved (bg-secondary, section, section-sm, container, container-narrow, btn-whatsapp, card, etc.)

## Success Criteria Met
- [x] Hebrew-first bilingual hero section with RTL handling
- [x] `<bdi>c2L</bdi>` used to prevent RTL mangling
- [x] English subtitle below Hebrew headline (smaller, lighter weight)
- [x] Bilingual CTA on hero with ArrowRight icon
- [x] Bilingual headings on all sections (Hebrew primary, English subtitle)
- [x] Removed zebra-stripe bg-secondary alternation from home page
- [x] Replaced with section-divider flow (thin border-top)
- [x] Varied section widths (not all max-w-3xl)
- [x] Tighter section-sm spacing (2.5rem vs 4rem)
- [x] Container-tight utility for intimate sections
- [x] Strengthened Contact CTA (email as primary, phone as secondary button)
- [x] Enhanced btn-primary visual weight (larger padding, subtle shadow)
- [x] Customs page bg-secondary sections unaffected
- [x] Header and Footer components untouched
- [x] constants.ts untouched
- [x] All imports use existing constants

## Tests Summary
- **Customs tests:** 17/17 PASSING (unaffected)
- **Constants tests:** 12/12 PASSING
- **Header tests:** 4/4 PASSING
- **Footer tests:** 4/4 PASSING
- **Home tests:** 6/7 passing, 1 expected failure
  - The `contains the main headline` test looks for exact text `'AI Systems That Carry Responsibility'` which is now in a `<p>` subtitle (broken by `<bdi>` element), not in the `h1`. The h1 is now Hebrew. Builder 2 is explicitly tasked with updating this test.
- **TypeScript:** Compiles clean (`tsc --noEmit` passes)
- **Next.js build:** Succeeds, all 3 routes generate as static

## Dependencies Used
- `lucide-react`: Added `Phone` icon import (was already a project dependency, used on customs page)
- All constants imported from `@/lib/constants` (LINKS, EMAIL, PHONE_NUMBER, PHONE_NUMBER_INTL)

## Patterns Followed
- RTL handling: `dir="rtl" lang="he"` on Hebrew block wrappers, matching customs page pattern
- Brand name protection: `<bdi>c2L</bdi>` in mixed-direction text, per CLAUDE.md
- Design system: All new CSS utilities follow existing naming conventions (section-*, container-*, btn-*)
- Component structure: Same Header/Footer wrapper pattern as before

## Integration Notes

### For Builder 2
- The home test `contains the main headline` needs updating. The h1 is now Hebrew text "מערכות AI שנושאות אחריות". The English tagline "AI Systems That Carry Responsibility" is in a `<p>` subtitle, split across elements by `<bdi>c2L</bdi>`.
- New Hebrew content to test: "מערכות AI שנושאות אחריות" (h1), "הוכחת עבודה" (h2), "נבנה על ידי אחיה" (h2), "בואו נדבר" (h2).
- All existing links (customs, StatViz, Ahiya, email, phone) are preserved at same hrefs.
- Phone link is now a `btn btn-secondary` instead of naked text, but still has same `tel:` href.

### CSS Impact on Customs Page
- `.section-sm` padding reduction (4rem to 2.5rem) applies globally -- customs page uses section-sm in pain points, primary CTA, and trust sections. This is the intended tightening per the plan.
- `.btn-primary` enhanced padding/shadow applies globally -- customs page doesn't use btn-primary directly (uses btn-whatsapp and btn-secondary), so no visual change there.
- `.bg-secondary` class untouched -- customs page sections that use it will render identically.
- New `.section-divider` and `.container-tight` are additive only -- no existing classes changed.

### Exports
- No new exports. page.tsx is a page component (default export).

### Potential Conflicts
- If Builder 2 modifies section classes on customs page, they should be aware of the section-sm padding change from 4rem to 2.5rem.

## Challenges Overcome
- Balancing bilingual CTA button content: settled on Hebrew text + English subtitle + ArrowRight icon in a single button, using span elements with different sizes.
- Founder section left-alignment: used container-tight without text-center for a slightly different feel from other sections, while keeping the overall page flow cohesive.
- Ensuring the `&apos;` entity for "Let's Talk" renders correctly in JSX.

## Testing Notes
- Run `cd site && npm run test -- --run` to see test results (1 expected failure in home.test.tsx)
- Run `cd site && npm run build` to verify static generation
- Run `cd site && npm run dev` to visually inspect the bilingual layout
- Customs page should be visually identical except for slightly tighter section-sm padding
