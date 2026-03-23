# Explorer 2 Report: Customs Brokerage Domain & Deal Structure

## Executive Summary

Israeli customs brokerage is a concentrated, reachable market of 200-300 licensed brokers who are currently spending 500K-1.4M NIS/year on document entry clerks. The deal structure should be a 4-phase engagement with clear exit ramps, totaling ~150K NIS against annual clerk cost savings of 3-10x. The CTA should be WhatsApp-first (standard for Israeli B2B), and the offer page should be in Hebrew with a direct, professional-but-warm tone that names specific pain points a broker will immediately recognize.

## Discoveries

### 1. Customs Brokerage Workflow in Israel

#### Document Types (per shipment, typically 10-20 documents)

**Core documents that every shipment requires:**
- **Bill of Lading (B/L) / שטר מטען** — Issued by shipping line. Contains: shipper, consignee, vessel name, port of loading/discharge, container numbers, weight, description of goods. Format: PDF, sometimes scanned paper.
- **Commercial Invoice / חשבונית מסחרית** — From the seller. Contains: item descriptions, quantities, unit prices, total value, currency, Incoterms, buyer/seller details. Critical for customs valuation.
- **Packing List / רשימת אריזה** — Details of how goods are packed. Contains: number of packages, weights (gross/net), dimensions, content per package.
- **Certificate of Origin / תעודת מקור** — Proves where goods were manufactured. Determines duty rates (especially important for EU, US, FTA countries). Format varies by issuing country.
- **Import Declaration / רשימון יבוא** — The actual customs declaration filed in SHAAR. This is what clerks BUILD from all the other documents. Contains: 40+ fields including HS codes, values, quantities, duties.

**Additional documents (depending on goods type):**
- **Phytosanitary Certificate** — For food/agricultural products. From exporting country's agriculture ministry.
- **Health Certificate** — For medical devices, pharmaceuticals.
- **Standards Institute Approval / אישור מכון התקנים** — Required for many consumer goods.
- **Insurance Certificate** — Proof of cargo insurance.
- **Dangerous Goods Declaration** — For hazmat shipments.
- **EUR.1 / תעודת תנועה** — Preferential origin certificate for EU/EFTA trade agreements (reduces duty).
- **Free Zone Documents** — For goods passing through Eilat Free Trade Zone.

#### Systems Used

**SHAAR (שע"ר) — Customs Authority Information System:**
- Full name: שע"ר — שירות ענף רשות המסים (Tax Authority Branch Service)
- The primary system where import/export declarations are filed
- Web-based system operated by Israel Tax Authority (רשות המסים)
- All customs brokers must file through this system
- Requires digital signature (חתימה דיגיטלית) for submissions
- Produces the official customs declaration (רשימון)
- Filing involves entering: HS classification codes, declared values, quantities, weights, origin country, consignee details, duty calculations

**MASLUL (מסל"ל) — Cargo Management System:**
- Full name: מערכת סליקת לוגיסטיקה (Logistics Clearance System)
- Manages the physical movement of cargo at ports
- Interfaces with SHAAR for release authorization
- Used by port authorities (Ashdod, Haifa), airports (Ben Gurion cargo terminal)
- Contains: container tracking, release status, storage billing

**TAMAN (תמ"נ) — Terminal Management:**
- Used at specific port terminals
- Tracks container arrival, positioning, release

**Other systems:**
- **Traceability systems** for food imports (Ministry of Health)
- **Standards Institute portal** for testing/approval tracking
- **Shipping line portals** (Maersk, MSC, ZIM, etc.) for B/L retrieval
- **Freight forwarder internal systems** — varies by company, often Excel-based or legacy software

#### The Clerk Workflow (What c2L Replaces)

A typical customs clerk performs these steps per shipment:

1. **Receive documents** — Email attachments (PDFs, scans) from importer, freight forwarder, or shipping agent
2. **Open each document** — Identify document type, language (English, Chinese, Turkish, etc.)
3. **Extract data manually** — Read through each document, identify relevant fields
4. **Cross-reference** — Match bill of lading to commercial invoice to packing list. Verify consistency (quantities match, values make sense)
5. **Classify goods** — Determine HS tariff code for each line item (requires domain expertise)
6. **Calculate duties** — Apply correct duty rates based on HS code, origin, and trade agreements
7. **Enter into SHAAR** — Fill 40+ fields in the customs declaration form
8. **Review** — Senior broker reviews before filing
9. **Submit and track** — File declaration, wait for release or additional queries from customs

**Time per shipment:** 30-90 minutes depending on complexity
**Shipments per clerk per day:** 8-15
**Error rate:** Industry estimates 5-15% of declarations require amendment (תיקון רשימון), which is costly and time-consuming

#### Pain Points (Ranked by Severity)

1. **Cost of clerks** — 3-8 clerks at 8K-15K NIS/month each = 500K-1.4M NIS/year. This is the single biggest operational cost for most brokerage firms.
2. **Errors and amendments** — Each amendment (תיקון רשימון) costs time and sometimes fines. Wrong HS classification can mean overpaying duty or triggering an audit.
3. **Port storage fees** — When declarations are delayed, containers sit at port. Storage fees: 500-1,000+ NIS/day after free days expire. A 3-day delay on 50 containers/month = significant losses.
4. **Training and turnover** — New clerks take 3-6 months to become productive. Turnover is high because the work is repetitive and low-status.
5. **Document chaos** — Documents arrive in inconsistent formats, multiple languages, varying quality (scanned vs. digital PDF). No standardization.
6. **Peak load handling** — Import volumes fluctuate. Staff hired for peak can't be laid off easily; staff at minimum can't handle peaks.
7. **Broker liability** — The customs broker is personally liable for declarations. Errors by clerks become the broker's legal problem.

### 2. Deal Structure Design

#### Rationale for Pricing

The vision states 150K NIS as a target price point. This needs to be justified against:
- **Annual clerk cost:** 500K-1.4M NIS/year for a mid-size brokerage
- **c2L total engagement cost:** ~150K NIS (one-time)
- **ROI period:** System pays for itself in 2-4 months of clerk cost savings
- **Ongoing cost:** Near-zero (system runs independently, Ahiya fixes bugs only)

This is a strong value proposition: pay 150K once, save 300K-1M per year.

#### Phase Structure

**Phase 1: Exploration (חקירה)**
- **What happens:** Ahiya visits the brokerage (physically or via screen share). Observes the actual workflow. Collects sample documents. Maps systems used, volume per month, document types, error patterns, and current costs.
- **Duration:** 1-2 weeks
- **Deliverable:** Structured exploration report. Contains: document inventory with samples, current workflow map, identified automation opportunities, feasibility assessment, cost-benefit projection specific to this client.
- **Price:** 5,000 NIS
- **Why this price:** Low enough that it's a no-brainer for a broker spending 50K+/month on clerks. High enough to signal professionalism and filter out tire-kickers. The deliverable (exploration report) has standalone value even if the client stops here.
- **Exit ramp:** Client receives the report. They can stop. No obligation. The report is theirs.

**Phase 2: Build (בנייה)**
- **What happens:** Ahiya + c2L build the document processing pipeline on the client's real documents. Ingest -> Interpret -> Structure -> Validate -> Output. Iterative process: build, test on samples, refine.
- **Duration:** 4-6 weeks
- **Deliverable:** Working pipeline that processes the client's specific document types and produces structured data ready for SHAAR entry.
- **Price:** 80,000 NIS
- **Why this price:** This is the bulk of the work. Building a custom pipeline that handles the client's specific document formats, languages, and edge cases. The price reflects weeks of specialized work.
- **Exit ramp:** If the pipeline doesn't meet agreed accuracy targets after reasonable iteration, client can stop and owes nothing for this phase (or a reduced fee — negotiate before starting). The exploration report from Phase 1 remains theirs.

**Phase 3: Validation (אימות)**
- **What happens:** Run the pipeline on a real batch of the client's daily workload (e.g., 50-100 shipments). Compare output to what clerks would produce. Measure accuracy, speed, and error types. Client observes.
- **Duration:** 2-3 weeks
- **Deliverable:** Validation report with accuracy metrics. Clear pass/fail against agreed criteria (e.g., 95%+ field-level accuracy on standard documents, 90%+ on complex ones).
- **Price:** 35,000 NIS
- **Why this price:** This phase proves the system works in production conditions. The validation report is the "proof" that justifies the client's investment and their decision to deploy.
- **Exit ramp:** If validation doesn't meet agreed criteria, client can stop. They keep the exploration report and validation report (showing what worked and what didn't). Partial refund of this phase is negotiable.

**Phase 4: Delivery (מסירה)**
- **What happens:** Deploy the pipeline for production use. Train the client's team on how to use it. Handover documentation. 30-day support window for bugs.
- **Duration:** 1-2 weeks
- **Deliverable:** Deployed, running system. Usage documentation. 30-day bug-fix commitment.
- **Price:** 30,000 NIS
- **Why this price:** Deployment and handoff. After this, the system runs independently. Client doesn't pay ongoing fees. Ahiya fixes bugs within the 30-day window at no extra cost.
- **Exit ramp:** N/A — this is the final phase. Delivery = done.

#### Pricing Summary

| Phase | Name | Duration | Price (NIS) | Cumulative |
|-------|------|----------|-------------|------------|
| 1 | Exploration | 1-2 weeks | 5,000 | 5,000 |
| 2 | Build | 4-6 weeks | 80,000 | 85,000 |
| 3 | Validation | 2-3 weeks | 35,000 | 120,000 |
| 4 | Delivery | 1-2 weeks | 30,000 | 150,000 |
| **Total** | | **8-13 weeks** | **150,000** | |

**vs. Annual clerk cost:** 500K-1.4M NIS/year
**Payback period:** 2-4 months
**Year 1 net savings:** 350K-1.25M NIS

#### Important: The Exit Ramp Story

The exit ramps are not just risk mitigation — they are the sales pitch. Israeli business owners are skeptical of big upfront commitments. The structure says: "Start with 5,000 NIS. See exactly what we're dealing with. Then decide." This removes the risk of buying something that doesn't work.

On the offer page, the exit ramps should be prominent. Each phase should explicitly say: "After this phase, you have [deliverable]. You can stop here."

### 3. CTA Mechanism

#### Israeli B2B Communication Norms

Israeli business culture has specific communication preferences that differ significantly from US/EU norms:

**WhatsApp — The de facto B2B channel in Israel:**
- Nearly universal adoption among Israeli business owners (99%+ smartphone penetration, WhatsApp is the default messaging app)
- Business deals, quotes, and negotiations routinely happen on WhatsApp
- Voice messages are common and accepted (not considered unprofessional)
- Israeli business owners check WhatsApp faster than email
- A WhatsApp link with a pre-filled message reduces friction to nearly zero

**Phone call:**
- Israelis are comfortable with cold calls more than most markets
- But customs brokers are busy people — calling during work hours may be intrusive
- Best as a second touchpoint after initial contact via WhatsApp

**Email:**
- Necessary for formal documentation (quotes, proposals)
- But response rates for cold emails are lower than WhatsApp
- Works better as part of the c2L Reach outreach than as the CTA on the site

**Contact form:**
- Lowest conversion mechanism for Israeli B2B
- Feels impersonal and bureaucratic
- Israeli business owners want to talk to a person, not fill out a form

#### Recommendation: WhatsApp CTA (Primary) + Phone (Secondary)

**Primary CTA: WhatsApp link with pre-filled message**
- URL format: `https://wa.me/972XXXXXXXXX?text=שלום%20אחיה%2C%20ראיתי%20את%20ההצעה%20לעמילי%20מכס...`
- This opens WhatsApp with a pre-filled message: "שלום אחיה, ראיתי את ההצעה לעמילי מכס..."
- Broker just presses send — instant connection
- Ahiya can respond in real-time or within minutes

**Secondary CTA: Phone number displayed**
- Display Ahiya's phone number directly on the page
- Format: clickable `tel:` link
- Some brokers will prefer to call directly, especially older generation

**Why NOT a form:**
- Israeli customs brokers are practical, no-nonsense people
- A form says "we'll get back to you" — WhatsApp says "let's talk now"
- The offer is personal (Ahiya builds it cooperatively) — the CTA should be personal too

### 4. Content Strategy

#### Language and Tone

**Hebrew-primary, with English as secondary:**
- The /customs offer page should be entirely in Hebrew
- The main page (/) can be bilingual or English-primary (since c2L as a brand may have international reach later)
- Technical terms can stay in English where that's standard (e.g., "Bill of Lading" alongside "שטר מטען")

**Tone: Professional-direct, not corporate:**
- Israeli business communication is direct. No fluff, no "we leverage synergies."
- The tone should be: a competent professional explaining what they do and why it saves money
- Think: "the way a senior broker would explain something to a peer"
- Avoid: marketing-speak, superlatives ("revolutionary," "cutting-edge"), vague promises

**Example tone for the hero section (Hebrew):**
```
עמילי מכס מעסיקים 3-8 פקידי הקלדה בעלות של חצי מיליון עד מיליון וחצי שקל בשנה.
אנחנו בונים מערכת שמחליפה את העבודה הזו — לא כלי שעוזר, מערכת שנושאת אחריות.
```

Translation: "Customs brokers employ 3-8 data entry clerks costing half a million to 1.5 million NIS per year. We build a system that replaces this work — not a tool that helps, a system that carries responsibility."

#### Key Pain Points to Highlight (in order)

1. **The cost headline** — "כמה אתה מוציא על פקידי הקלדה בשנה?" (How much do you spend on data entry clerks per year?) Open with the money. Everyone knows the number.

2. **The error problem** — "כל תיקון רשימון עולה זמן, כסף, ולפעמים קנס" (Every declaration amendment costs time, money, and sometimes a fine). This hits a nerve because brokers are personally liable.

3. **Port delays** — "מכולה שעומדת בנמל עולה 500-1,000 ₪ ליום" (A container sitting at port costs 500-1,000 NIS/day). Tangible, daily cost they experience.

4. **Training cycle** — "מאמנים פקיד חדש 3-6 חודשים, ואז הוא עוזב" (Training a new clerk takes 3-6 months, then they leave). This is the frustration that money alone doesn't solve.

#### How to Present the ROI Argument

**Simple, direct comparison:**

```
עלות שנתית של פקידים:     500,000 - 1,400,000 ₪
עלות המערכת (חד-פעמי):    150,000 ₪
המערכת מחזירה את עצמה תוך: 2-4 חודשים
חיסכון בשנה הראשונה:      350,000 - 1,250,000 ₪
```

**Important:** Don't promise "replacing all clerks." Promise replacing the repetitive data entry work. Some broker judgment (HS classification review, complex cases) may still need human oversight. Being honest about this builds trust.

#### Trust Signals

1. **StatViz as proof of work** — "כבר בנינו מערכת דומה." Link to StatViz (statviz.xyz) — a working B2B platform with Hebrew support. Shows: this is not vaporware. The builder has shipped real systems.

2. **The structured approach itself** — Showing the 4-phase model with exit ramps IS a trust signal. It says: "We don't ask you to trust us upfront. We earn it phase by phase."

3. **Ahiya's direct involvement** — "אחיה בוטמן בונה את המערכת יחד איתך." This is not a faceless company. The person building it has a name and is accessible via WhatsApp.

4. **No ongoing maintenance contract** — "אין חוזה תחזוקה שנתי. המערכת עובדת באופן עצמאי." This is counter-intuitive and therefore memorable. It also removes a common objection ("I don't want to be locked in").

### 5. Technology Dependencies for the Site

#### Hebrew Font Considerations

**Recommended font: Heebo (Google Fonts)**
- Designed specifically for Hebrew
- Available in multiple weights (300, 400, 500, 600, 700)
- Clean, modern, professional appearance
- Pairs well with Inter (used on selahlabs)
- Free, no licensing issues

**Alternative: Rubik**
- Also a good Hebrew font on Google Fonts
- Slightly rounder, warmer feel
- May be better for the conversational tone

**Implementation:**
```typescript
import { Heebo } from 'next/font/google';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heebo',
});
```

**For the main page (English-primary):** Continue using Inter (matches selahlabs)
**For the /customs page (Hebrew-primary):** Use Heebo as primary, Inter as fallback for English text

#### RTL Layout Patterns

**HTML-level direction:**
```html
<!-- Main page -->
<html lang="en" dir="ltr">

<!-- Customs page layout -->
<div dir="rtl" lang="he">
```

**Tailwind RTL support:**
- Tailwind v4 has built-in `rtl:` modifier
- Use logical properties: `ps-4` (padding-start) instead of `pl-4` (padding-left)
- `text-start` instead of `text-left`
- Flexbox `flex-row` reverses automatically in RTL context

**Key RTL considerations:**
1. **Text alignment** — Hebrew text should be right-aligned (default in RTL)
2. **Layout flow** — Flex/grid items flow right-to-left
3. **Icons with directional meaning** — Arrows, chevrons need to flip
4. **Numbers** — Arabic numerals (0-9) are used in Hebrew text, they read left-to-right even in RTL context (the browser handles this natively via Unicode BiDi algorithm)
5. **Mixed content** — Hebrew text with English technical terms (e.g., "Bill of Lading") — the browser's BiDi algorithm handles this, but test carefully
6. **Phone numbers, URLs** — These stay LTR within RTL text (handled automatically)

**Pattern for the /customs page:**

The /customs page should use a separate layout or wrap its content in a RTL container. The approach should be:
- The root layout stays LTR (for the main page)
- The /customs route group gets its own layout with RTL direction
- This allows the two pages to have completely different text directions without conflict

```
app/
  layout.tsx          # LTR, Inter font
  page.tsx            # Main page (English)
  customs/
    layout.tsx        # RTL wrapper, Heebo font
    page.tsx          # Customs offer page (Hebrew)
```

#### External Integrations

**WhatsApp CTA link:**
- No API needed — just a formatted URL: `https://wa.me/972XXXXXXXXX?text=...`
- Pre-filled message text should be URL-encoded Hebrew

**Analytics (optional but recommended):**
- Vercel Analytics (built-in, zero config on Vercel deploy)
- Tracks page views and CTA clicks
- Helps Ahiya know if anyone is actually visiting the page before activating Reach

**No other external integrations needed:**
- No payment processing
- No form backend
- No CRM
- No chat widget
- The site is fully static

#### OG/SEO for Hebrew Content

**Open Graph for /customs page:**
```typescript
export const metadata: Metadata = {
  title: 'c2L — אוטומציה למסמכי מכס',
  description: 'מערכת שמחליפה את עבודת ההקלדה של פקידים — לא כלי שעוזר, מערכת שנושאת אחריות.',
  openGraph: {
    locale: 'he_IL',
    // ... standard OG fields
  },
};
```

**Separate OG image for Hebrew page** — Should include Hebrew text, not just the English c2L brand.

## Patterns Identified

### Pattern: Phase-Gated Engagement with Exit Ramps

**Description:** Each phase is a standalone engagement with its own deliverable, price, and exit point. The client pays per phase and can stop at any boundary.

**Use Case:** Selling high-value custom software to skeptical B2B buyers who have been burned by vendors before.

**Example:**
```
Phase 1 (5K) → Deliverable: Exploration Report → Exit: Keep report, stop here
Phase 2 (80K) → Deliverable: Working Pipeline → Exit: Keep report + pipeline, stop here
Phase 3 (35K) → Deliverable: Validation Report → Exit: Keep everything, stop here
Phase 4 (30K) → Deliverable: Deployed System → Done
```

**Recommendation:** Strongly recommend. This removes the #1 objection (risk of wasting money on something that doesn't work) and turns the sales conversation from "trust me" to "try the first phase for 5,000 NIS."

### Pattern: Bilingual Site with Route-Level Language Switching

**Description:** Main page in English (c2L brand), specific offer page in Hebrew (target market). Language/direction set at the route layout level, not globally.

**Use Case:** Sites that serve multiple audiences where different pages need completely different languages and text directions.

**Recommendation:** Use this. It's simpler than full i18n, matches the actual need (2 pages, 2 languages), and avoids the complexity of translation frameworks.

### Pattern: WhatsApp as Primary B2B CTA in Israel

**Description:** Israeli businesses conduct much of their B2B communication through WhatsApp. A pre-filled WhatsApp link as the primary CTA has the lowest friction for conversion.

**Recommendation:** Implement as primary CTA. Display phone number as secondary. Skip contact forms entirely.

## Complexity Assessment

### High Complexity Areas

- **Hebrew RTL offer page content** — Writing compelling Hebrew copy that names specific pain points, presents the ROI argument correctly, and sounds like a competent professional (not a marketing department) requires careful crafting. The content itself is the product of this page. Estimated: needs dedicated builder attention, possibly review/iteration.

### Medium Complexity Areas

- **RTL layout** — Tailwind v4 has good RTL support, but mixed LTR/RTL content (Hebrew text with English terms, numbers) needs testing. The route-level layout approach keeps it contained.
- **Two-font system** — Heebo for Hebrew, Inter for English. Needs proper CSS variable setup and font loading optimization.
- **Deal structure presentation** — The 4-phase model with pricing table, exit ramps, and ROI comparison needs clean visual design to be scannable.

### Low Complexity Areas

- **WhatsApp CTA** — Just a formatted URL, no integration needed.
- **StatViz proof-of-work link** — Just an external link to statviz.xyz.
- **Vercel deployment** — Standard Next.js on Vercel, identical to selahlabs pattern.
- **Main page (/)** — Simpler than selahlabs (fewer sections, no fleet indicator), straightforward English content.

## Technology Recommendations

### Primary Stack (Matches selahlabs pattern)

- **Framework:** Next.js 16 with App Router — same as selahlabs, proven pattern, static export on Vercel
- **Styling:** Tailwind CSS v4 — same as selahlabs, built-in RTL support
- **Fonts:** Inter (English/main page) + Heebo (Hebrew/customs page) via next/font/google
- **Icons:** lucide-react — same as selahlabs
- **Deployment:** Vercel at c2l.dev

### Supporting Libraries

- **No additional libraries needed** — The site is fully static with no backend, no forms, no animations beyond what CSS provides.

## Integration Points

### External Links
- **StatViz (statviz.xyz):** Proof-of-work link from main page. External link, no integration.
- **Selah Labs (selahlabs.xyz):** Context link from main page. External link.
- **Ahiya personal (ahiya.xyz):** Founder link. External link.
- **WhatsApp:** CTA link to `wa.me/972XXXXXXXXX`. Pre-filled message in Hebrew.

### Internal Links
- **Main page (/) -> Customs offer (/customs):** Internal Next.js link. The primary navigation path.
- **Customs offer (/customs) -> Main page (/):** Back link / header nav.

### Future Integration (Iteration 2)
- **c2L Reach emails -> c2l.dev/customs:** Reach emails will link to the customs offer page. The page URL must be stable and correct before Reach is built.

## Risks & Challenges

### Technical Risks

- **Hebrew text rendering on various devices:** Hebrew with mixed English terms can sometimes have BiDi rendering issues on older browsers or specific mobile devices. Mitigation: test on real Israeli-market phones (Samsung, iPhone with Hebrew locale).
- **Font loading for Hebrew:** Heebo has more glyphs than Inter, which means larger font files. Mitigation: use `next/font` which handles subsetting and optimization automatically.

### Content Risks

- **Hebrew copy quality:** The offer page lives or dies on the quality of the Hebrew text. If it sounds like translated English or generic marketing, it will fail with the target audience. Mitigation: write in Hebrew first (not translate), use terminology customs brokers actually use.
- **Pricing sensitivity:** 150K NIS is significant even if the ROI is clear. If Phase 1 (5K) doesn't feel like good value on its own, brokers won't start. Mitigation: make the Phase 1 deliverable genuinely useful — a real analysis they can use even without proceeding.

### Market Risks

- **Small market size:** 200-300 licensed brokers. If conversion rate is low, the addressable market is thin. Mitigation: Phase 1 at 5K NIS is low-risk entry that can convert even skeptics.
- **Existing relationships:** Some brokers may already have arrangements with software vendors or prefer "their way." Mitigation: the offer explicitly says "no lock-in, no ongoing contract" — this differentiates from typical vendor relationships.

## Recommendations for Planner

1. **Build the /customs page first, main page second.** The customs offer page is the revenue-generating asset. The main page is supporting infrastructure. Builders should prioritize the Hebrew content page.

2. **Use route-level layout separation for RTL/LTR.** Don't try to make a single layout handle both directions. Give /customs its own layout.tsx with `dir="rtl"` and Heebo font. The main page keeps the selahlabs pattern with Inter.

3. **The deal structure table should be a visual centerpiece of the /customs page.** Design it as a clear, scannable progression: Phase -> What Happens -> What You Get -> Price -> "You can stop here." This visual is the single most important conversion element.

4. **WhatsApp CTA button should appear at least twice on the /customs page** — once after the pain point section (for brokers who already know they want this) and once after the pricing table (for those who needed convincing).

5. **Content builder should write Hebrew directly, not translate.** The Hebrew text on /customs should be authored in Hebrew. Key phrases and idioms should feel natural to an Israeli business owner, not like translated English.

6. **Include Ahiya's name and face (or at least name) on the offer page.** This is a personal service. The broker needs to know there's a real person behind it. Link to ahiya.xyz.

7. **Keep the pricing numbers explicit on the page.** Israeli business culture values directness. "Contact us for pricing" is a red flag. Showing 5,000 NIS for Phase 1 on the page removes uncertainty and makes the CTA feel lower-risk.

## Resource Map

### Critical Reference Files
- `/home/ahiya/Ahiya/2L/Prod/selahlabs/` — Complete reference implementation for site structure, design system, Vercel deployment pattern
- `/home/ahiya/Ahiya/2L/Prod/selahlabs/app/globals.css` — Design system tokens (colors, typography, spacing, components)
- `/home/ahiya/Ahiya/2L/Prod/selahlabs/package.json` — Exact dependency versions (Next.js 16, Tailwind v4, React 19)
- `/home/ahiya/Ahiya/2L/Prod/selahlabs/app/layout.tsx` — Root layout pattern with metadata, structured data, font setup
- `/home/ahiya/Ahiya/2L/Prod/selahlabs/app/components/` — Component architecture pattern (Hero, Contact, ExecutionModel, etc.)
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/.2L/plan-1/vision.md` — Full project vision with success criteria

### Key Dependencies
- **Next.js 16** — Framework, same version as selahlabs
- **Tailwind CSS v4** — Styling with RTL support
- **Heebo font** — Hebrew typography (Google Fonts, free)
- **Inter font** — English typography (matches selahlabs)
- **lucide-react** — Icons
- **Vercel** — Deployment platform
- **c2l.dev domain** — Must be registered/accessible for DNS configuration

### Domain-Specific Terminology Reference

| Hebrew | English | Context |
|--------|---------|---------|
| עמיל מכס | Customs broker | The target client |
| רשימון | Customs declaration | The document clerks create |
| שע"ר | SHAAR | Customs authority system |
| מסל"ל | MASLUL | Cargo logistics system |
| שטר מטען | Bill of Lading | Core shipping document |
| חשבונית מסחרית | Commercial Invoice | Core trade document |
| רשימת אריזה | Packing List | Packaging details |
| תעודת מקור | Certificate of Origin | Origin proof |
| תיקון רשימון | Declaration amendment | Error correction (costly) |
| סיווג | HS Classification | Tariff code assignment |
| מכולה | Container | Shipping container |
| נמל | Port | Ashdod, Haifa |
| חתימה דיגיטלית | Digital signature | Required for SHAAR |

## Questions for Planner

1. **What is Ahiya's phone number for the WhatsApp CTA?** The pre-filled message needs his actual number.
2. **Is the c2l.dev domain already registered?** If not, this is a blocking dependency for deployment.
3. **Should Phase 1 pricing (5,000 NIS) appear explicitly on the offer page, or just the structure without numbers?** My recommendation is to show numbers, but Ahiya may have a different view.
4. **Does Ahiya want his last name (Butman) on the offer page, or just "Ahiya"?** The selahlabs site uses just "Ahiya."
5. **Is there a preferred color scheme for c2L that differs from selahlabs?** The selahlabs palette (warm beige/teal) works but c2L may want its own identity.
6. **Should the main page (/) reference Selah Labs or present c2L as independent?** The vision mentions linking to Ahiya and StatViz but doesn't specify the relationship framing.
