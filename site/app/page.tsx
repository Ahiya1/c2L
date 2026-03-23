import Link from 'next/link';
import { ExternalLink, ArrowRight, Mail } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LINKS, EMAIL, PHONE_NUMBER } from '@/lib/constants';

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
                AI Systems That Carry Responsibility
              </h1>
              <p className="text-subheading text-secondary mb-8 max-w-2xl mx-auto">
                c2L builds systems that replace manual workflows — not tools that
                assist, systems that take ownership of the work.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/customs" className="btn btn-primary">
                  See our customs brokerage offer
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Proof of Work Section */}
        <section className="section-sm bg-secondary">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-heading text-primary mb-4">
                Proof of Work
              </h2>
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
        <section className="section-sm">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-heading text-primary mb-4">
                Built by Ahiya
              </h2>
              <p className="text-body text-secondary mb-6">
                c2L is a one-person operation. Ahiya designs, builds, and
                delivers every system personally. No sales team, no layers —
                the person you talk to is the person who builds.
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
        <section className="section-sm bg-secondary">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-heading text-primary mb-4">
                Get in Touch
              </h2>
              <p className="text-body text-secondary mb-6">
                Interested in what c2L can build for your business? Reach out
                directly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`mailto:${EMAIL}`}
                  className="btn btn-secondary"
                >
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                  {EMAIL}
                </a>
                <a
                  href={`tel:${PHONE_NUMBER.replace(/-/g, '')}`}
                  className="text-body text-secondary link-hover"
                >
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
