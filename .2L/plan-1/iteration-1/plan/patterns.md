# Code Patterns & Conventions

## File Structure

```
site/
  app/
    layout.tsx              # Root layout: LTR, Rubik font, base metadata
    page.tsx                # Main page (/) -- English-primary
    globals.css             # Tailwind import + design system tokens + utility classes
    customs/
      layout.tsx            # Customs layout: RTL wrapper, Hebrew metadata
      page.tsx              # Customs offer page (/customs) -- Hebrew-primary
    components/
      Header.tsx            # Shared sticky header
      Footer.tsx            # Shared footer
      index.ts              # Barrel export
  public/
    favicon.ico             # c2L favicon (placeholder OK for MVP)
    apple-touch-icon.png    # Apple touch icon (placeholder OK)
    og-image.png            # OG image for social sharing (placeholder OK)
  lib/
    constants.ts            # Contact info, URLs, phone numbers
    utils.ts                # Utility functions (if any)
  __tests__/
    components/
      Header.test.tsx       # Header render test
      Footer.test.tsx       # Footer render test
    pages/
      home.test.tsx         # Main page render test
      customs.test.tsx      # Customs page render test
    lib/
      constants.test.ts     # Constants validation test
  next.config.ts            # Next.js config (poweredByHeader: false)
  postcss.config.mjs        # PostCSS with @tailwindcss/postcss
  tsconfig.json             # TypeScript strict config
  eslint.config.mjs         # ESLint 9 flat config
  vitest.config.ts          # Vitest configuration
  package.json              # Dependencies
  .gitignore                # Git ignore rules
```

## Naming Conventions

- **Components:** PascalCase files and exports (`Header.tsx`, `Footer.tsx`)
- **Pages:** `page.tsx` (Next.js convention)
- **Layouts:** `layout.tsx` (Next.js convention)
- **Utilities/Constants:** camelCase files (`constants.ts`, `utils.ts`)
- **Test files:** `{name}.test.tsx` or `{name}.test.ts`
- **CSS classes (custom):** kebab-case (`.btn-primary`, `.header-fixed`, `.text-display`)
- **CSS variables:** kebab-case with prefix (`--c2l-bg-primary`, `--c2l-accent`)
- **TypeScript types:** PascalCase (`NavLink`, `PhaseInfo`)
- **Constants:** camelCase for objects, SCREAMING_SNAKE_CASE for primitive values (`WHATSAPP_NUMBER`, `contactInfo`)

## Import Order Convention

```typescript
// 1. Next.js imports
import Link from 'next/link';
import type { Metadata } from 'next';

// 2. React imports (if needed)
import { type ReactNode } from 'react';

// 3. Third-party imports
import { Mail, Phone, MessageCircle } from 'lucide-react';

// 4. Local imports (absolute paths with @/ alias)
import { WHATSAPP_URL, PHONE_NUMBER } from '@/lib/constants';

// 5. Type imports
import type { NavLink } from '@/lib/types';
```

## Root Layout Pattern

**File:** `app/layout.tsx`

```typescript
import './globals.css';
import { Rubik } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-rubik',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://c2l.dev'),
  title: {
    template: '%s | c2L',
    default: 'c2L - AI Systems That Carry Responsibility',
  },
  description: 'c2L builds AI systems that replace manual workflows. Not tools that assist — systems that carry responsibility.',
  authors: [{ name: 'c2L' }],
  creator: 'c2L',
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://c2l.dev',
    siteName: 'c2L',
    title: 'c2L - AI Systems That Carry Responsibility',
    description: 'c2L builds AI systems that replace manual workflows. Not tools that assist — systems that carry responsibility.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'c2L',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'c2L - AI Systems That Carry Responsibility',
    description: 'c2L builds AI systems that replace manual workflows.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'c2L',
  url: 'https://c2l.dev',
  description: 'AI systems that carry responsibility',
  founder: {
    '@type': 'Person',
    name: 'Ahiya',
    url: 'https://ahiya.xyz',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={rubik.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {children}
      </body>
    </html>
  );
}
```

**Key points:**
- `lang="en"` on root -- English is the default language
- Rubik font loaded with both Hebrew and Latin subsets
- Font exposed as CSS variable `--font-rubik`
- Structured data (JSON-LD) for SEO
- No providers, no context -- fully static

## Customs Route Layout Pattern (RTL)

**File:** `app/customs/layout.tsx`

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'c2L - אוטומציה למסמכי מכס',
  description: 'מערכת שמחליפה את עבודת ההקלדה של פקידים. לא כלי שעוזר — מערכת שנושאת אחריות.',
  openGraph: {
    locale: 'he_IL',
    title: 'c2L - אוטומציה למסמכי מכס',
    description: 'מערכת שמחליפה את עבודת ההקלדה של פקידים. לא כלי שעוזר — מערכת שנושאת אחריות.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'c2L - אוטומציה למסמכי מכס',
      },
    ],
  },
};

export default function CustomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" lang="he">
      {children}
    </div>
  );
}
```

**Key points:**
- RTL direction set at the route layout level, not globally
- Hebrew metadata overrides English defaults
- `lang="he"` for accessibility and SEO
- The root `<html>` stays `lang="en"` -- the customs wrapper provides the Hebrew context

## CSS Design System Pattern

**File:** `app/globals.css`

```css
@import "tailwindcss";

/* ===================================
   c2L DESIGN SYSTEM
   =================================== */

/* Design Tokens */
:root {
  /* Colors - Professional, trustworthy palette */
  --c2l-bg-primary: #f8f7f4;
  --c2l-bg-secondary: #f0eeea;
  --c2l-text-primary: #1e293b;
  --c2l-text-secondary: #475569;
  --c2l-accent: #4a7c7e;
  --c2l-border: #e2e0db;

  /* Typography */
  --c2l-font-sans: var(--font-rubik), system-ui, sans-serif;

  /* Motion - Measured transitions */
  --c2l-transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Spacing scale */
  --c2l-space-xs: 0.5rem;
  --c2l-space-sm: 1rem;
  --c2l-space-md: 1.5rem;
  --c2l-space-lg: 2rem;
  --c2l-space-xl: 3rem;
  --c2l-space-2xl: 4rem;
  --c2l-space-3xl: 6rem;
}

/* Base styles */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--c2l-bg-primary);
  color: var(--c2l-text-primary);
  font-family: var(--c2l-font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Typography scale */
.text-display {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.text-heading {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.text-subheading {
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  font-weight: 500;
  line-height: 1.4;
}

.text-body {
  font-size: 1rem;
  line-height: 1.7;
}

.text-small {
  font-size: 0.875rem;
  line-height: 1.6;
}

/* Color utilities */
.text-primary { color: var(--c2l-text-primary); }
.text-secondary { color: var(--c2l-text-secondary); }
.text-accent { color: var(--c2l-accent); }
.bg-primary { background-color: var(--c2l-bg-primary); }
.bg-secondary { background-color: var(--c2l-bg-secondary); }

/* Layout utilities */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--c2l-space-md);
}

.container-narrow {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--c2l-space-md);
}

.section {
  padding: var(--c2l-space-3xl) 0;
}

.section-sm {
  padding: var(--c2l-space-2xl) 0;
}

/* Interactive elements */
a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all var(--c2l-transition);
}

.btn-primary {
  background-color: var(--c2l-text-primary);
  color: var(--c2l-bg-primary);
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  border: 1px solid var(--c2l-border);
  color: var(--c2l-text-primary);
}

.btn-secondary:hover {
  background-color: var(--c2l-bg-secondary);
  border-color: var(--c2l-text-secondary);
}

.btn-whatsapp {
  background-color: #25D366;
  color: #ffffff;
  font-weight: 600;
}

.btn-whatsapp:hover {
  background-color: #1DA851;
}

/* Card style */
.card {
  background-color: var(--c2l-bg-secondary);
  border: 1px solid var(--c2l-border);
  border-radius: 0.75rem;
  padding: var(--c2l-space-lg);
  transition: all var(--c2l-transition);
}

.card:hover {
  border-color: var(--c2l-text-secondary);
}

/* Link hover */
.link-hover {
  transition: color var(--c2l-transition);
}

.link-hover:hover {
  color: var(--c2l-accent);
}

/* Header */
.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background-color: rgba(248, 247, 244, 0.9);
  border-bottom: 1px solid var(--c2l-border);
}

.main-with-header {
  padding-top: 4rem;
}

/* Focus states for accessibility */
:focus-visible {
  outline: 2px solid var(--c2l-accent);
  outline-offset: 2px;
}

/* Selection color */
::selection {
  background-color: var(--c2l-accent);
  color: var(--c2l-bg-primary);
}
```

**Key points:**
- Prefixed with `--c2l-` instead of `--sl-` to distinguish from selahlabs
- Same structure and approach as selahlabs globals.css
- Added `.btn-whatsapp` for the WhatsApp CTA button
- No Tailwind config file needed -- Tailwind v4 is CSS-native

## Constants Pattern

**File:** `lib/constants.ts`

```typescript
// Contact information -- intentionally public for B2B outreach
export const PHONE_NUMBER = '058-778-9019';
export const PHONE_NUMBER_INTL = '+972587789019';
export const EMAIL = 'ahiya.butman@gmail.com';

// WhatsApp CTA
export const WHATSAPP_MESSAGE = encodeURIComponent(
  'שלום אחיה, ראיתי את ההצעה לאוטומציה של מסמכי מכס ואשמח לשמוע פרטים.'
);
export const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER_INTL.replace('+', '')}?text=${WHATSAPP_MESSAGE}`;

// External links
export const LINKS = {
  statviz: 'https://statviz.xyz',
  ahiya: 'https://ahiya.xyz',
  selahlabs: 'https://selahlabs.xyz',
  github: 'https://github.com/Ahiya1',
} as const;

// Deal structure
export const PHASES = [
  {
    number: 1,
    nameHe: 'חקירה',
    nameEn: 'Exploration',
    duration: '1-2 שבועות',
    price: 5_000,
    deliverable: 'דוח חקירה מובנה — מלאי מסמכים, מפת עבודה, הערכת עלות-תועלת',
    exitRamp: 'הדוח שלך. אפשר לעצור כאן.',
  },
  {
    number: 2,
    nameHe: 'בנייה',
    nameEn: 'Build',
    duration: '4-6 שבועות',
    price: 80_000,
    deliverable: 'צינור עיבוד עובד שמייצר נתונים מובנים מהמסמכים שלך',
    exitRamp: 'הדוח והמערכת שלך. אפשר לעצור כאן.',
  },
  {
    number: 3,
    nameHe: 'אימות',
    nameEn: 'Validation',
    duration: '2-3 שבועות',
    price: 35_000,
    deliverable: 'דוח אימות עם מדדי דיוק — הוכחה שהמערכת עובדת',
    exitRamp: 'כל המסמכים והמערכת שלך. אפשר לעצור כאן.',
  },
  {
    number: 4,
    nameHe: 'מסירה',
    nameEn: 'Delivery',
    duration: '1-2 שבועות',
    price: 30_000,
    deliverable: 'מערכת פעילה + תיעוד + 30 יום תיקון תקלות',
    exitRamp: null,
  },
] as const;

export const TOTAL_PRICE = 150_000;
```

**Key points:**
- All contact info in one place -- easy to update
- Deal structure as typed data -- used by the customs page for rendering the phase table
- Hebrew content in constants where it is structured data (phases). Free-form Hebrew content stays in the page component.
- Price numbers as integers for formatting flexibility

## Page Composition Pattern

**File:** `app/page.tsx` (Main page example structure)

```typescript
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LINKS } from '@/lib/constants';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen main-with-header">
        {/* Hero Section */}
        <section className="section">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-display text-primary mb-6">
                {/* Main headline */}
              </h1>
              <p className="text-subheading text-secondary mb-8 max-w-2xl mx-auto">
                {/* Subtitle */}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/customs" className="btn btn-primary">
                  {/* CTA to offer page */}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content sections follow the same pattern */}
        <section className="section bg-secondary">
          <div className="container">
            {/* Section content */}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

**Key points:**
- Server component (no `'use client'` directive) -- static rendering
- Section-based composition with semantic HTML
- Consistent use of `.container`, `.section`, `.text-*` classes
- No state management, no hooks, no effects

## Shared Component Pattern

**File:** `app/components/Header.tsx`

```typescript
import Link from 'next/link';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/customs', label: 'Customs Offer' },
];

export function Header() {
  return (
    <header className="header-fixed">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center">
            <span className="font-bold text-lg text-primary">c2L</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-small text-secondary link-hover"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
```

**File:** `app/components/Footer.tsx`

```typescript
import { LINKS, EMAIL } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t" style={{ borderColor: 'var(--c2l-border)' }}>
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-primary">c2L</span>

          <p className="text-small text-secondary">
            &copy; {currentYear} c2L. All rights reserved.
          </p>

          <a
            href={`mailto:${EMAIL}`}
            className="text-small text-secondary link-hover"
          >
            {EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
```

**File:** `app/components/index.ts` (Barrel export)

```typescript
export { Header } from './Header';
export { Footer } from './Footer';
```

## Bidirectional Text Pattern

When embedding English text (like "c2L" or "SHAAR") within Hebrew content:

```tsx
{/* Wrap English brand names in bdi or span with dir="ltr" */}
<p className="text-body text-primary">
  <bdi>c2L</bdi> בונה מערכות שנושאות אחריות
</p>

{/* For inline technical terms */}
<p className="text-body text-primary">
  הגשת רשימון במערכת <span dir="ltr">SHAAR</span> דורשת מילוי 40+ שדות
</p>

{/* Numbers in Hebrew text -- browser handles automatically, no wrapper needed */}
<p className="text-body text-primary">
  עלות שנתית: 500,000 - 1,400,000 ש&quot;ח
</p>
```

**Key points:**
- Use `<bdi>` for brand names within Hebrew text
- Use `<span dir="ltr">` for longer English phrases
- Numbers render correctly without wrappers (Unicode BiDi algorithm handles them)
- Test all mixed-direction text on real devices

## External Link Pattern

```tsx
import { ExternalLink } from 'lucide-react';

{/* External link with security attributes */}
<a
  href="https://statviz.xyz"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-1 text-accent link-hover"
>
  StatViz
  <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
</a>
```

**Key points:**
- Always use `target="_blank"` with `rel="noopener noreferrer"` for external links
- Include the ExternalLink icon to indicate the link leaves the site
- Use `text-accent` and `link-hover` for visual consistency

## WhatsApp CTA Pattern

```tsx
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/constants';

{/* WhatsApp CTA button -- primary action */}
<a
  href={WHATSAPP_URL}
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-whatsapp text-lg px-8 py-4"
>
  <MessageCircle className="w-6 h-6" strokeWidth={2} />
  דברו איתנו בווטסאפ
</a>
```

**Key points:**
- WhatsApp URL from constants (single source of truth for phone number and message)
- Green WhatsApp brand color via `.btn-whatsapp` class
- Larger size (`text-lg px-8 py-4`) for primary CTA prominence
- MessageCircle icon from lucide-react

## Phase/Deal Structure Pattern (Customs Page)

```tsx
import { PHASES, TOTAL_PRICE } from '@/lib/constants';

{/* Phase progression table */}
<section className="section">
  <div className="container">
    <h2 className="text-heading text-primary text-center mb-8">
      איך זה עובד?
    </h2>
    <div className="grid gap-6 max-w-3xl mx-auto">
      {PHASES.map((phase) => (
        <div key={phase.number} className="card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-small text-accent font-medium">
                שלב {phase.number}
              </span>
              <h3 className="text-subheading text-primary">
                {phase.nameHe}
              </h3>
            </div>
            <div className="text-left">
              <span className="text-heading text-primary">
                {phase.price.toLocaleString('he-IL')}
              </span>
              <span className="text-small text-secondary mr-1">&#8362;</span>
            </div>
          </div>
          <p className="text-body text-secondary mb-2">
            {phase.deliverable}
          </p>
          <p className="text-small text-secondary">
            {phase.duration}
          </p>
          {phase.exitRamp && (
            <p className="text-small text-accent mt-3 font-medium">
              {phase.exitRamp}
            </p>
          )}
        </div>
      ))}
    </div>
    <div className="text-center mt-8">
      <p className="text-subheading text-primary">
        סה&quot;כ: {TOTAL_PRICE.toLocaleString('he-IL')} &#8362;
      </p>
    </div>
  </div>
</section>
```

**Key points:**
- Phase data from constants -- structured and typed
- Each phase card shows name, price, deliverable, duration, and exit ramp
- Exit ramps are highlighted in accent color -- they are a sales feature
- Price formatted with Hebrew locale
- Shekel symbol using HTML entity `&#8362;`

## Next.js Configuration Pattern

**File:** `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
```

## PostCSS Configuration Pattern

**File:** `postcss.config.mjs`

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

## TypeScript Configuration Pattern

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

## ESLint Configuration Pattern

**File:** `eslint.config.mjs`

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

## Package.json Pattern

**File:** `package.json`

```json
{
  "name": "c2l-site",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^16.0.7",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.517.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "typescript": "^5",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^16",
    "@eslint/eslintrc": "^3",
    "vitest": "^3",
    "@vitejs/plugin-react": "^4",
    "@testing-library/react": "^16",
    "@testing-library/jest-dom": "^6",
    "jsdom": "^26"
  }
}
```

## .gitignore Pattern

**File:** `.gitignore`

```
# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

## Testing Patterns

### Vitest Configuration

**File:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['app/**/*.tsx', 'lib/**/*.ts'],
      exclude: ['app/layout.tsx', 'app/customs/layout.tsx'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
});
```

### Test Setup

**File:** `__tests__/setup.ts`

```typescript
import '@testing-library/jest-dom/vitest';
```

### Component Render Test Pattern

**File:** `__tests__/components/Header.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/app/components/Header';

describe('Header', () => {
  it('renders the c2L brand name', () => {
    render(<Header />);
    expect(screen.getByText('c2L')).toBeInTheDocument();
  });

  it('renders navigation link to customs page', () => {
    render(<Header />);
    const link = screen.getByRole('link', { name: /customs/i });
    expect(link).toHaveAttribute('href', '/customs');
  });

  it('has the fixed header class', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('header-fixed');
  });
});
```

### Constants Validation Test Pattern

**File:** `__tests__/lib/constants.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import {
  PHONE_NUMBER_INTL,
  WHATSAPP_URL,
  PHASES,
  TOTAL_PRICE,
  LINKS,
} from '@/lib/constants';

describe('constants', () => {
  it('WhatsApp URL contains the correct phone number', () => {
    expect(WHATSAPP_URL).toContain('972587789019');
  });

  it('WhatsApp URL contains pre-filled message text', () => {
    expect(WHATSAPP_URL).toContain('text=');
    expect(WHATSAPP_URL).toMatch(/^https:\/\/wa\.me\//);
  });

  it('phone number is in international format', () => {
    expect(PHONE_NUMBER_INTL).toMatch(/^\+972/);
  });

  it('phases sum to total price', () => {
    const sum = PHASES.reduce((acc, phase) => acc + phase.price, 0);
    expect(sum).toBe(TOTAL_PRICE);
  });

  it('has exactly 4 phases', () => {
    expect(PHASES).toHaveLength(4);
  });

  it('only the last phase has no exit ramp', () => {
    const phasesWithoutExit = PHASES.filter((p) => p.exitRamp === null);
    expect(phasesWithoutExit).toHaveLength(1);
    expect(phasesWithoutExit[0].number).toBe(4);
  });

  it('all external links are HTTPS', () => {
    Object.values(LINKS).forEach((url) => {
      expect(url).toMatch(/^https:\/\//);
    });
  });
});
```

### Page Render Test Pattern

**File:** `__tests__/pages/home.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
  });

  it('contains a link to the customs offer page', () => {
    render(<HomePage />);
    const links = screen.getAllByRole('link');
    const customsLink = links.find(
      (link) => link.getAttribute('href') === '/customs'
    );
    expect(customsLink).toBeDefined();
  });

  it('contains a link to StatViz', () => {
    render(<HomePage />);
    const links = screen.getAllByRole('link');
    const statvizLink = links.find((link) =>
      link.getAttribute('href')?.includes('statviz.xyz')
    );
    expect(statvizLink).toBeDefined();
  });
});
```

### Coverage Expectations by Module Type

| Module Type | Minimum Coverage | Target Coverage |
|-------------|------------------|-----------------|
| Utils/Constants | 90% | 95% |
| Shared Components (Header, Footer) | 70% | 80% |
| Page Components | 60% | 70% |
| Layouts | 0% (excluded) | 0% |

---

## Security Patterns

### No Secrets in Code

This site has no secrets. All contact information is intentionally public for B2B outreach. There are no API keys, database credentials, or auth tokens.

```typescript
// CORRECT -- public contact info as constants
export const PHONE_NUMBER = '058-778-9019';
export const EMAIL = 'ahiya.butman@gmail.com';

// NEVER do this in any project (not applicable here, but for reference):
// const API_KEY = "sk-secret-key-here";  // SECURITY RISK
```

### Secure External Links

```typescript
// ALWAYS use rel="noopener noreferrer" with target="_blank"
<a
  href="https://statviz.xyz"
  target="_blank"
  rel="noopener noreferrer"
>
  StatViz
</a>

// NEVER do this:
// <a href="https://example.com" target="_blank">Link</a>  // Missing rel
```

### Security Headers in Next.js Config

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,  // Don't expose X-Powered-By header
  reactStrictMode: true,
};

export default nextConfig;
```

### Meta Tags for Security

```typescript
// Included in root layout metadata
export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
  // No sensitive information in metadata
};
```

---

## Error Handling Patterns

### Page-Level Error Boundary

**File:** `app/error.tsx`

```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-heading text-primary mb-4">Something went wrong</h2>
        <p className="text-body text-secondary mb-6">
          Please try refreshing the page.
        </p>
        <button onClick={reset} className="btn btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}
```

### Not Found Page

**File:** `app/not-found.tsx`

```typescript
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-display text-primary mb-4">404</h2>
        <p className="text-body text-secondary mb-6">
          Page not found.
        </p>
        <Link href="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
```

### Build-Time Error Prevention

Since this is a fully static site, most errors are caught at build time:
- TypeScript strict mode catches type errors
- ESLint catches code quality issues
- `next build` catches rendering errors

There are no runtime data fetching errors, no API failures, no database connection issues.

---

## CI/CD Patterns

### GitHub Actions Workflow

**File:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    working-directory: site

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: site/package-lock.json

      - run: npm ci

      - name: TypeScript Check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

  test:
    name: Tests
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: site/package-lock.json

      - run: npm ci

      - name: Run Tests
        run: npm run test

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [quality, test]
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: site/package-lock.json

      - run: npm ci

      - name: Build
        run: npm run build
```

**Key points:**
- `working-directory: site` -- the Next.js project lives in the `site/` subdirectory
- Node 22 (current LTS)
- Three sequential jobs: quality (typecheck + lint) -> test -> build
- Concurrency group prevents parallel runs on same branch
- Cache npm dependencies for speed
- No deployment job -- Vercel handles deployment automatically on push to main

### Branch Strategy

- `main` -- Production branch. Vercel deploys from here automatically.
- Feature work happens directly on `main` for this small project. Branches are optional.
- If branches are used: `feature/*` naming convention, merge via PR.

---

## Performance Patterns

### Font Loading

```typescript
// next/font/google handles font optimization:
// - Downloads font files at build time
// - Self-hosts them (no external request to Google Fonts at runtime)
// - Generates CSS with font-display: swap
// - Subsets to only Hebrew + Latin characters

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-rubik',
  display: 'swap',  // Show fallback font immediately, swap when Rubik loads
});
```

### Image Optimization

For MVP, placeholder images are acceptable. When real images are added:

```tsx
import Image from 'next/image';

{/* Next.js Image component for automatic optimization */}
<Image
  src="/og-image.png"
  alt="c2L"
  width={1200}
  height={630}
  priority  // Use priority for above-the-fold images
/>
```

### Static Rendering

All pages in this site are statically rendered at build time. There is no `'use client'` directive, no `useState`, no `useEffect`, no data fetching. This means:
- Zero JavaScript hydration needed for content (only Next.js router)
- Fastest possible page loads
- Full SEO indexability

Do NOT add `'use client'` unless absolutely necessary (the only case would be `app/error.tsx` which requires it by Next.js convention).
