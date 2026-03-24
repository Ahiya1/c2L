import Link from 'next/link';
import { ExternalLink, ArrowRight, Mail, Phone } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LINKS, EMAIL, PHONE_NUMBER, PHONE_NUMBER_INTL } from '@/lib/constants';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen main-with-header">
        {/* Hero Section */}
        <section className="section">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div dir="rtl" lang="he" className="mb-4">
                <h1 className="text-display text-primary">
                  מערכות AI שנושאות אחריות
                </h1>
              </div>
              <p className="text-subheading text-secondary mb-8 max-w-2xl mx-auto">
                AI Systems That Carry Responsibility — <bdi>c2L</bdi> builds
                systems that replace manual workflows. Not tools that assist,
                systems that take ownership.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/customs" className="btn btn-primary">
                  <span dir="rtl" lang="he">ראו את ההצעה שלנו</span>
                  <span className="text-small opacity-75">Our Offer</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Proof of Work Section */}
        <section className="section-sm section-divider">
          <div className="container">
            <div className="container-tight text-center">
              <div dir="rtl" lang="he" className="mb-1">
                <h2 className="text-heading text-primary">
                  הוכחת עבודה
                </h2>
              </div>
              <p className="text-small text-secondary mb-4">
                Proof of Work
              </p>
              <p className="text-body text-secondary mb-6">
                StatViz is a B2B data platform we built and shipped — complete
                with Hebrew support, secure document handling, and
                institutional-grade reporting.
              </p>
              <a
                href={LINKS.statviz}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent link-hover text-subheading"
              >
                StatViz
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="section-sm section-divider">
          <div className="container">
            <div className="container-tight">
              <div dir="rtl" lang="he" className="mb-1">
                <h2 className="text-heading text-primary">
                  נבנה על ידי אחיה
                </h2>
              </div>
              <p className="text-small text-secondary mb-4">
                Built by Ahiya
              </p>
              <p className="text-body text-secondary mb-6">
                <bdi>c2L</bdi> is a one-person operation. Ahiya designs, builds,
                and delivers every system personally. No sales team, no layers
                — the person you talk to is the person who builds.
              </p>
              <a
                href={LINKS.ahiya}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent link-hover"
              >
                ahiya.xyz
                <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-sm section-divider">
          <div className="container">
            <div className="max-w-xl mx-auto text-center">
              <div dir="rtl" lang="he" className="mb-1">
                <h2 className="text-heading text-primary">
                  בואו נדבר
                </h2>
              </div>
              <p className="text-small text-secondary mb-4">
                Let&apos;s Talk
              </p>
              <p className="text-body text-secondary mb-8">
                Interested in what <bdi>c2L</bdi> can build for your business?
                Reach out directly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`mailto:${EMAIL}`}
                  className="btn btn-primary"
                >
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                  {EMAIL}
                </a>
                <a
                  href={`tel:${PHONE_NUMBER_INTL}`}
                  className="btn btn-secondary"
                >
                  <Phone className="w-4 h-4" strokeWidth={1.5} />
                  {PHONE_NUMBER}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
