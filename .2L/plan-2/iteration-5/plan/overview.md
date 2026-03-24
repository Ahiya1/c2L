# Iteration 5: Site Polish — Overview

## Vision
Transform c2l.dev from "stacked blocks" into a cohesive, bilingual, professional presence.

## Key Problems (from exploration)
1. **Visual monotony**: Every section uses identical `max-w-3xl mx-auto text-center`
2. **Floaty spacing**: `section-sm` puts 64px padding around ~100px content
3. **Stacked blocks**: Zebra-striped bg-secondary creates hard horizontal boundaries
4. **Zero bilingual**: Home page is 100% English, customs is 100% Hebrew
5. **Weak hierarchy**: All post-hero sections have identical visual weight
6. **Weak contact CTA**: Email as secondary button, phone as naked text

## Approach
- Hebrew-first bilingual hero (Hebrew large, English smaller/lighter below)
- Break visual monotony with varied section widths and asymmetric layouts
- Replace hard bg alternation with subtler section separation
- Tighten spacing on smaller sections
- Strengthen CTA visual weight
- Light customs page alignment polish (no content changes)
- Update tests for bilingual content

## Files Changed
- `site/app/page.tsx` — major rewrite (bilingual, layout, CTAs)
- `site/app/globals.css` — section flow, spacing, new utilities
- `site/app/customs/page.tsx` — light alignment polish
- `site/__tests__/pages/home.test.tsx` — update for bilingual content
