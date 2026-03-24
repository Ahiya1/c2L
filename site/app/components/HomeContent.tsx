'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight, Mail, Phone, Globe } from 'lucide-react';
import { LINKS, EMAIL, PHONE_NUMBER, PHONE_NUMBER_INTL } from '@/lib/constants';

type Lang = 'he' | 'en';

const content = {
  he: {
    headline: 'מערכות AI שנושאות אחריות',
    sub: 'אנחנו בונים מערכות שמחליפות תהליכי עבודה ידניים.\nלא כלים שעוזרים — מערכות שלוקחות אחריות על העבודה.',
    cta: 'לפרטים על ההצעה שלנו',
    proofTitle: 'הוכחת עבודה',
    proofDesc: 'StatViz היא פלטפורמת נתונים B2B שבנינו ומסרנו — כולל תמיכה מלאה בעברית, טיפול מאובטח במסמכים, ודיווח ברמה מוסדית.',
    founderTitle: 'נבנה על ידי אחיה',
    founderDesc: 'c2L היא פעילות של אדם אחד. אחיה מתכנן, בונה ומוסר כל מערכת באופן אישי. בלי צוות מכירות, בלי שכבות — מי שמדבר איתך הוא מי שבונה.',
    contactTitle: 'צרו קשר',
    contactDesc: 'מעוניינים לשמוע מה c2L יכול לבנות עבורכם? פנו ישירות.',
    toggleLabel: 'EN',
  },
  en: {
    headline: 'AI Systems That Carry Responsibility',
    sub: 'We build systems that replace manual workflows.\nNot tools that assist — systems that take ownership of the work.',
    cta: 'See our customs offer',
    proofTitle: 'Proof of Work',
    proofDesc: 'StatViz is a B2B data platform we built and shipped — complete with Hebrew support, secure document handling, and institutional-grade reporting.',
    founderTitle: 'Built by Ahiya',
    founderDesc: 'c2L is a one-person operation. Ahiya designs, builds, and delivers every system personally. No sales team, no layers — the person you talk to is the person who builds.',
    contactTitle: 'Get in Touch',
    contactDesc: 'Interested in what c2L can build for your business? Reach out directly.',
    toggleLabel: 'עב',
  },
} as const;

export function HomeContent() {
  const [lang, setLang] = useState<Lang>('he');
  const t = content[lang];
  const isHe = lang === 'he';

  return (
    <div dir={isHe ? 'rtl' : 'ltr'} lang={lang}>
      {/* Language Toggle */}
      <div className="language-toggle-wrapper">
        <button
          onClick={() => setLang(isHe ? 'en' : 'he')}
          className="language-toggle"
          aria-label={isHe ? 'Switch to English' : 'החלף לעברית'}
        >
          <Globe className="w-4 h-4" strokeWidth={1.5} />
          {t.toggleLabel}
        </button>
      </div>

      {/* Hero */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-headline">
              {isHe ? (
                <>מערכות AI שנושאות אחריות</>
              ) : (
                <>AI Systems That Carry Responsibility</>
              )}
            </h1>
            <p className="hero-sub">
              {t.sub.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
            <Link href="/customs" className="btn btn-primary hero-cta">
              {t.cta}
              <ArrowRight className="w-4 h-4" strokeWidth={2} style={isHe ? { transform: 'scaleX(-1)' } : undefined} />
            </Link>
          </div>
        </div>
      </section>

      {/* Proof of Work */}
      <section className="content-section">
        <div className="container">
          <div className="section-inner">
            <h2 className="section-heading">{t.proofTitle}</h2>
            <p className="section-body">{t.proofDesc}</p>
            <a
              href={LINKS.statviz}
              target="_blank"
              rel="noopener noreferrer"
              className="section-link"
            >
              StatViz
              <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="content-section">
        <div className="container">
          <div className="section-inner">
            <h2 className="section-heading">{t.founderTitle}</h2>
            <p className="section-body">
              {isHe ? (
                <><bdi>c2L</bdi> {t.founderDesc.replace('c2L ', '')}</>
              ) : (
                <>{t.founderDesc}</>
              )}
            </p>
            <a
              href={LINKS.ahiya}
              target="_blank"
              rel="noopener noreferrer"
              className="section-link"
            >
              ahiya.xyz
              <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="content-section contact-section">
        <div className="container">
          <div className="section-inner">
            <h2 className="section-heading">{t.contactTitle}</h2>
            <p className="section-body">{t.contactDesc}</p>
            <div className="contact-actions">
              <a href={`mailto:${EMAIL}`} className="btn btn-primary">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                {EMAIL}
              </a>
              <a href={`tel:${PHONE_NUMBER_INTL}`} className="btn btn-secondary">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                {PHONE_NUMBER}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
