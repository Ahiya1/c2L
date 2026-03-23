# Technology Stack

## Resolved Explorer Disagreements

Before detailing the stack, here are the explicit resolutions where explorers disagreed:

| Decision | Explorer 1 | Explorer 2 | Resolution | Rationale |
|----------|-----------|-----------|------------|-----------|
| Tailwind version | v3 (to match StatViz) | v4 (to match selahlabs) | **v4** | selahlabs is the correct reference. It uses `tailwindcss: "^4"` with `@tailwindcss/postcss`. StatViz is a legacy codebase on v3. |
| Hebrew font | Rubik (StatViz uses it) | Heebo | **Rubik** | Rubik is proven for Hebrew+Latin in StatViz. Selahlabs uses Inter (English-only). For c2L we need Hebrew support, and Rubik covers both scripts well. Sticking with what has been tested in the codebase family. |
| Next.js version | 14 (StatViz) | 16 (selahlabs) | **16** | selahlabs is the current reference. It uses `next: "^16.0.7"` with React 19. No reason to use an older version. |
| Styling approach | CVA + clsx + tailwind-merge (StatViz) | Plain CSS | **Plain CSS classes in globals.css** | selahlabs uses zero utility libraries for styling. Just Tailwind + CSS custom properties + utility classes defined in globals.css. This is simpler and proven. |
| Site direction | Explorer 1: RTL globally (like StatViz) | Explorer 2: LTR root, RTL per-route | **LTR root, RTL for /customs route** | The main page is English-primary. The customs page is Hebrew-primary. Route-level layout separation is cleaner than global RTL with LTR overrides. |
| Component libraries | Explorer 1: copy shadcn Button component | Explorer 2: no additional libraries | **No component libraries** | selahlabs uses `.btn`, `.btn-primary`, `.btn-secondary` CSS classes. No CVA, no shadcn. Copy this pattern. |

## Core Framework

**Decision:** Next.js 16 (App Router) with React 19

**Rationale:**
- Matches selahlabs exactly -- proven pattern for this team
- App Router enables per-route layouts (critical for LTR main page + RTL customs page)
- Built-in font optimization via `next/font/google`
- Metadata API for per-page SEO
- Zero-config Vercel deployment
- Turbopack for fast dev experience (`next dev --turbopack`)

**Version:** `next: "^16.0.7"`, `react: "^19.0.0"`, `react-dom: "^19.0.0"`

## Styling

**Decision:** Tailwind CSS v4 with CSS custom properties design system

**Rationale:**
- Matches selahlabs exactly
- Tailwind v4 uses CSS-native configuration (no `tailwind.config.ts` file)
- Import via `@import "tailwindcss"` in globals.css
- PostCSS plugin: `@tailwindcss/postcss`
- RTL support works naturally with CSS logical properties and flexbox

**Configuration approach:**
- `globals.css` contains `@import "tailwindcss"` plus all design tokens as CSS custom properties
- Utility classes (`.btn`, `.card`, `.section`, etc.) defined in globals.css
- No `tailwind.config.ts` file -- Tailwind v4 does not use one

**PostCSS config:**
```javascript
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

## Typography

**Decision:** Rubik font (Hebrew + Latin) via `next/font/google`

**Rationale:**
- Rubik is proven for Hebrew content in the StatViz codebase
- Covers both Hebrew and Latin subsets in a single font family
- Available in weights 300, 400, 500, 700 -- sufficient range
- Clean, professional, slightly warm -- fits the direct-but-approachable tone
- Loaded via `next/font/google` with `display: 'swap'` for performance

**Implementation:**
```typescript
import { Rubik } from 'next/font/google';

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-rubik',
  display: 'swap',
});
```

**For English content on the main page:** Rubik handles Latin characters well. No need for a second font. One font family for the entire site keeps things simple.

## Icons

**Decision:** lucide-react

**Rationale:**
- Matches selahlabs exactly
- Lightweight, tree-shakeable (only imports used icons)
- Consistent design language
- Has all icons needed (Mail, Phone, MessageCircle, ExternalLink, ArrowLeft, Shield, etc.)

**Version:** `lucide-react: "^0.517.0"` (match selahlabs)

## Database

**Decision:** None

**Rationale:**
- Fully static site. No backend, no data fetching, no server-side logic.
- Content is hardcoded in page components (same pattern as selahlabs).

## Authentication

**Decision:** None

**Rationale:**
- No user accounts, no admin panel, no protected routes.

## API Layer

**Decision:** None

**Rationale:**
- No API routes. Fully static site. All external interactions are simple links (WhatsApp URL, mailto, tel).

## Frontend Architecture

**Decision:** Section-based page composition with CSS design system

**UI approach:** No component library. Use CSS utility classes defined in `globals.css` following the selahlabs pattern exactly.

**Component strategy:**
- Each page is composed of sections (`<section>` elements)
- Shared components extracted only when used on multiple pages (Header, Footer)
- Page-specific content stays inline in the page component
- No premature abstraction

**Styling strategy:**
- CSS custom properties for design tokens (colors, spacing, typography)
- Tailwind utility classes for layout and responsive behavior
- Custom CSS classes for reusable patterns (`.btn`, `.card`, `.section`)
- No `cn()` utility, no CVA, no tailwind-merge

## External Integrations

### WhatsApp CTA
**Purpose:** Primary contact mechanism for Israeli B2B
**Library:** None -- just a formatted URL
**Implementation:** `https://wa.me/972XXXXXXXXX?text=<URL-encoded Hebrew message>`
The phone number will be a constant in the code. Pre-filled message text will be URL-encoded.

### StatViz Link
**Purpose:** Proof of prior work
**Library:** None -- external `<a>` link to `https://statviz.xyz`
**Implementation:** Standard link with `target="_blank" rel="noopener noreferrer"`

### Ahiya Personal Link
**Purpose:** Founder credibility
**Library:** None -- external `<a>` link to `https://ahiya.xyz`

## Development Tools

### Testing
- **Framework:** Vitest (fast, native ESM, works with React/Next.js)
- **React Testing:** `@testing-library/react` + `@testing-library/jest-dom`
- **Coverage target:** 70% for components, 90% for utilities
- **Strategy:** Unit tests for utility functions. Render tests for components (verify they render without crashing, key content appears). No E2E for MVP static site.

### Code Quality
- **Linter:** ESLint 9 with flat config (`eslint.config.mjs`)
- **Config:** `next/core-web-vitals` + `next/typescript` (matches selahlabs)
- **Type Checking:** TypeScript strict mode

### Build & Deploy
- **Build tool:** Next.js built-in (Turbopack for dev, Webpack for production build)
- **Deployment target:** Vercel (zero-config for Next.js)
- **CI/CD:** GitHub Actions -- lint, typecheck, test, build on every push/PR

## Environment Variables

No environment variables are needed. The site is fully static. All contact information (phone number, email, WhatsApp link) is hardcoded as constants.

If Vercel Analytics is added later:
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`: Provided automatically by Vercel

## Dependencies Overview

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `next` | `^16.0.7` | Framework |
| `react` | `^19.0.0` | UI runtime |
| `react-dom` | `^19.0.0` | DOM rendering |
| `lucide-react` | `^0.517.0` | Icons |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | `^4` | Styling |
| `@tailwindcss/postcss` | `^4` | PostCSS plugin for Tailwind |
| `typescript` | `^5` | Type safety |
| `@types/node` | `^22` | Node type definitions |
| `@types/react` | `^19` | React type definitions |
| `@types/react-dom` | `^19` | ReactDOM type definitions |
| `eslint` | `^9` | Linting |
| `eslint-config-next` | `^16` | Next.js ESLint rules |
| `vitest` | `^3` | Test runner |
| `@testing-library/react` | `^16` | React component testing |
| `@testing-library/jest-dom` | `^6` | DOM assertions |
| `jsdom` | `^26` | DOM environment for tests |

**Total: 4 production + 12 dev dependencies.** Minimal surface area.

## Performance Targets

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Bundle size:** < 100KB (gzipped) -- fully static site with no data fetching
- **Lighthouse Performance:** 90+
- **Lighthouse Accessibility:** 90+
- **Lighthouse SEO:** 90+
- **Font loading:** No visible FOUT (Flash of Unstyled Text) thanks to `display: 'swap'`

## Security Considerations

- **No secrets in code:** The site has no API keys, no database credentials, no auth tokens. Contact info (phone, email) is intentionally public for B2B outreach.
- **`poweredByHeader: false`:** Disable the X-Powered-By header in next.config.ts (copy from StatViz pattern).
- **External link safety:** All external links use `rel="noopener noreferrer"` and `target="_blank"`.
- **No user input:** No forms, no text inputs, no file uploads. Zero attack surface from user input.
- **CSP headers:** Not critical for MVP (no scripts from external sources, no inline scripts beyond Next.js hydration). Can add in next.config.ts headers if desired.
- **HTTPS:** Enforced by Vercel automatically.
