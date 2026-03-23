# 2L Iteration Plan - c2L Deal & Site

## Project Vision

Build the c2l.dev website and define the customs brokerage offer. This is the revenue-generating face of c2L: a static website that presents who c2L is, what it offers, and gives Israeli customs brokers a clear path to engage. The customs offer page is the single most important asset in iteration 1 -- it is what converts interest into conversation.

## Success Criteria

Specific, measurable criteria for iteration 1 completion:

- [ ] `next build` completes without errors
- [ ] Main page (`/`) loads and presents c2L identity, links to StatViz, links to Ahiya, links to customs offer
- [ ] Customs offer page (`/customs`) renders fully in Hebrew with correct RTL layout
- [ ] Customs page names specific pain points (clerk costs, port delays, errors, turnover)
- [ ] 4-phase engagement model with pricing (5K, 80K, 35K, 30K) is visible and scannable
- [ ] Exit ramps are explicitly stated per phase
- [ ] WhatsApp CTA button works with pre-filled Hebrew message
- [ ] Phone and email CTAs work as secondary options
- [ ] Both pages are mobile responsive (tested at 375px and 390px widths)
- [ ] OG metadata and SEO tags present on both pages
- [ ] Lighthouse scores: Performance 90+, Accessibility 90+, SEO 90+
- [ ] All tests pass (`npm run test`)
- [ ] Lint passes (`npm run lint`)
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] CI workflow runs green on push

## MVP Scope

**In Scope:**
- Next.js 16 static site scaffolding (matching selahlabs pattern exactly)
- Main page (`/`) -- English-primary, c2L identity, links to offer/StatViz/Ahiya
- Customs offer page (`/customs`) -- Hebrew-primary, RTL, full sales content
- Deal structure definition: 4 phases, pricing, exit ramps, ROI argument
- WhatsApp + phone + email CTA
- Mobile responsive design
- OG/SEO metadata per page
- GitHub Actions CI workflow
- Unit tests for utility functions and component rendering
- Vercel deployment configuration

**Out of Scope (Post-MVP / Later Iterations):**
- Vercel deployment execution and DNS configuration (manual step)
- c2L Reach email system (iteration 2)
- c2L plugin/workflow tooling (iteration 3)
- Analytics integration (nice-to-have, not required)
- Favicon and OG image asset creation (placeholder acceptable)
- Contact forms
- Blog or content marketing
- Payment processing
- Testimonials (no clients yet)

## Development Phases

1. **Exploration** -- Complete
2. **Planning** -- Current
3. **Building** -- ~3 hours (2 parallel builders)
4. **Integration** -- ~20 minutes
5. **Validation** -- ~20 minutes
6. **Deployment** -- Manual (Vercel connect + DNS)

## Timeline Estimate

- Exploration: Complete
- Planning: Complete
- Building: 3 hours (parallel builders)
- Integration: 20 minutes
- Validation: 20 minutes
- Total: ~4 hours

## Risk Assessment

### High Risks

- **Hebrew content quality**: The offer page lives or dies on the Hebrew copy. If it reads like translated English or generic marketing, it will fail. Mitigation: content should be written in Hebrew first, using terminology customs brokers actually use (see domain terminology in explorer-2 report). Builders should include placeholder Hebrew that is real and directionally correct, understanding that Ahiya will refine it.

### Medium Risks

- **Bidirectional text rendering**: The brand name "c2L" within Hebrew sentences can produce unexpected rendering. Mitigation: use `<bdi>` or `<span dir="ltr">` wrappers around English brand names embedded in Hebrew text. Test thoroughly.

- **Font loading for Hebrew subsets**: Rubik with Hebrew subset can be slow if misconfigured. Mitigation: use `next/font/google` with `display: 'swap'` and explicit `subsets: ['hebrew', 'latin']`. Verify on slow network (DevTools throttling).

### Low Risks

- **Tailwind v4 RTL**: Tailwind v4 handles RTL well with CSS logical properties. The route-level layout approach isolates RTL to `/customs` only.

- **Deployment**: Zero-config Vercel for Next.js. No environment variables needed (fully static).

## Integration Strategy

Two builders work in parallel:

- **Builder 1** creates the project scaffold (package.json, configs, layouts, globals.css, design system) and the main page. This is the foundation.
- **Builder 2** creates the customs offer page with all Hebrew content, deal structure, and CTAs. Builder 2 depends on Builder 1's scaffold being complete.

Integration is straightforward because:
1. Builder 1 owns the root layout and shared files
2. Builder 2 owns only `app/customs/layout.tsx` and `app/customs/page.tsx`
3. No shared state, no shared components beyond what Builder 1 provides
4. Builder 2 uses the CSS design system Builder 1 establishes

The only integration point is ensuring Builder 2's customs page correctly uses the design tokens from `globals.css` and the Rubik font from the root layout.

## Deployment Plan

1. Builders create the site in `site/` directory within the c2L repo
2. After validation, Ahiya connects the `site/` directory to Vercel
3. Ahiya configures c2l.dev DNS to point to Vercel
4. Vercel auto-deploys from the main branch

No environment variables are needed. The site is fully static.
