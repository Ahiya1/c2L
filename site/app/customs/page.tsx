import { MessageCircle, Phone, Mail, ExternalLink, ShieldCheck, Users, AlertTriangle, Clock } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import {
  WHATSAPP_URL,
  PHONE_NUMBER,
  PHONE_NUMBER_INTL,
  EMAIL,
  PHASES,
  TOTAL_PRICE,
  LINKS,
} from '@/lib/constants';

export default function CustomsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen main-with-header" dir="rtl" lang="he">
        {/* ===== Hero ===== */}
        <section className="customs-hero">
          <div className="container">
            <div className="customs-hero-inner">
              <h1 className="customs-headline">
                עמילי מכס משלמים חצי מיליון עד מיליון וחצי שקל בשנה על פקידי הקלדה.
              </h1>
              <p className="customs-sub">
                <bdi>c2L</bdi> בונה מערכת שמחליפה את העבודה הזו — לא כלי שעוזר, מערכת שנושאת אחריות.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Pain Points ===== */}
        <section className="customs-section customs-section-border">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
              <div className="card flex items-start gap-4">
                <Users className="w-6 h-6 text-accent flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <h3 className="text-subheading text-primary mb-1">עלות כוח אדם</h3>
                  <p className="text-body text-secondary">
                    3-8 פקידים, כל אחד 8,000-15,000 &#8362; בחודש.
                    בשנה זה 500,000 עד 1,400,000 &#8362;.
                  </p>
                </div>
              </div>

              <div className="card flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <h3 className="text-subheading text-primary mb-1">טעויות ותיקוני רשימון</h3>
                  <p className="text-body text-secondary">
                    5-15% מהרשימונות דורשים תיקון.
                    כל תיקון עולה זמן, כסף, ולפעמים קנס.
                  </p>
                </div>
              </div>

              <div className="card flex items-start gap-4">
                <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <h3 className="text-subheading text-primary mb-1">עיכובים בנמל</h3>
                  <p className="text-body text-secondary">
                    מכולה שעומדת בנמל עולה 500-1,000 &#8362; ליום.
                    עיכוב של שלושה ימים על 50 מכולות בחודש — חשבו על המספרים.
                  </p>
                </div>
              </div>

              <div className="card flex items-start gap-4">
                <Users className="w-6 h-6 text-accent flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <h3 className="text-subheading text-primary mb-1">הכשרה ותחלופה</h3>
                  <p className="text-body text-secondary">
                    מאמנים פקיד חדש 3-6 חודשים, ואז הוא עוזב.
                    העבודה שחיקתית ובלתי נמנעת — עד עכשיו.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Process: How It Works ===== */}
        <section className="customs-section customs-section-border">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="customs-section-heading">
                איך זה עובד?
              </h2>
              <p className="text-body text-secondary text-center mb-8 max-w-2xl mx-auto">
                ארבעה שלבים, כל אחד עם תוצר ברור. אחרי כל שלב אפשר לעצור — בלי התחייבות קדימה.
              </p>
              <div className="grid gap-5">
                {PHASES.map((phase) => (
                  <div key={phase.number} className="card">
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <span className="text-small text-accent font-medium">
                          שלב {phase.number}
                        </span>
                        <h3 className="text-subheading text-primary font-bold">
                          {phase.nameHe}
                        </h3>
                      </div>
                      <span className="text-body text-secondary font-medium">
                        {phase.price.toLocaleString('he-IL')} &#8362;
                      </span>
                    </div>
                    <p className="text-body text-secondary mb-1">
                      {phase.deliverable}
                    </p>
                    <p className="text-small text-secondary">
                      {phase.duration}
                    </p>
                    {phase.exitRamp && (
                      <p className="text-small text-accent mt-2 font-medium">
                        {phase.exitRamp}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <p className="text-subheading text-primary font-bold">
                  סה&quot;כ: {TOTAL_PRICE.toLocaleString('he-IL')} &#8362;
                </p>
                <p className="text-small text-secondary mt-1">
                  8-13 שבועות מתחילה ועד מערכת פעילה
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ROI ===== */}
        <section className="customs-section customs-section-border">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <h2 className="customs-section-heading">
                החשבון פשוט
              </h2>
              <div className="card">
                <div className="flex flex-col">
                  <div className="customs-roi-row customs-roi-border">
                    <span className="text-body text-secondary">עלות שנתית של פקידים</span>
                    <span className="text-subheading text-primary font-medium">500,000 - 1,400,000 &#8362;</span>
                  </div>
                  <div className="customs-roi-row customs-roi-border">
                    <span className="text-body text-secondary">עלות המערכת (חד-פעמי)</span>
                    <span className="text-subheading text-primary font-medium">{TOTAL_PRICE.toLocaleString('he-IL')} &#8362;</span>
                  </div>
                  <div className="customs-roi-row customs-roi-border">
                    <span className="text-body text-secondary">המערכת מחזירה את עצמה תוך</span>
                    <span className="text-subheading text-accent font-medium">2-4 חודשים</span>
                  </div>
                  <div className="customs-roi-row">
                    <span className="text-body text-secondary">חיסכון בשנה הראשונה</span>
                    <span className="text-subheading text-accent font-medium">350,000 - 1,250,000 &#8362;</span>
                  </div>
                </div>
              </div>
              <p className="text-small text-secondary text-center mt-4">
                המערכת מחליפה את עבודת ההקלדה החוזרת. סיווג מורכב ובדיקות חריגות עדיין דורשים שיקול דעת אנושי — אנחנו לא מבטיחים להחליף את כל הצוות, אלא את העבודה שאפשר לבצע בצורה מדויקת יותר עם מערכת.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Trust ===== */}
        <section className="customs-section customs-section-border">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="customs-section-heading">
                למה לסמוך עלינו?
              </h2>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="text-center">
                  <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-3" strokeWidth={1.5} />
                  <h3 className="text-subheading text-primary mb-2">בלי חוזה תחזוקה</h3>
                  <p className="text-small text-secondary">
                    אין חוזה תחזוקה שנתי. המערכת עובדת באופן עצמאי. אתה לא נעול.
                  </p>
                </div>
                <div className="text-center">
                  <a
                    href={LINKS.statviz}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent link-hover mb-3"
                  >
                    <span className="text-subheading font-medium">StatViz</span>
                    <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                  <h3 className="text-subheading text-primary mb-2">ניסיון מוכח</h3>
                  <p className="text-small text-secondary">
                    כבר בנינו פלטפורמת <bdi>B2B</bdi> עובדת עם תמיכה בעברית. לא מדובר בתיאוריה.
                  </p>
                </div>
                <div className="text-center">
                  <a
                    href={LINKS.ahiya}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent link-hover mb-3"
                  >
                    <span className="text-subheading font-medium">אחיה בוטמן</span>
                    <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                  <h3 className="text-subheading text-primary mb-2">בן אדם, לא חברה</h3>
                  <p className="text-small text-secondary">
                    אחיה בונה את המערכת יחד איתך. תקשורת ישירה, לא דרך מחלקת מכירות.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="customs-cta">
          <div className="container">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="section-heading mb-4" style={{ color: 'var(--c2l-bg-primary)' }}>
                בואו נדבר
              </h2>
              <p className="text-body mb-8" style={{ color: 'rgba(248, 247, 244, 0.75)' }}>
                שלב ראשון — חקירה — עולה 5,000 &#8362;. אתם מקבלים דוח מפורט שלכם, ויכולים להחליט אם להמשיך.
              </p>
              <div className="flex flex-col items-center gap-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp text-lg px-8 py-4"
                >
                  <MessageCircle className="w-6 h-6" strokeWidth={2} />
                  דברו איתנו בווטסאפ
                </a>
                <div className="flex items-center gap-4">
                  <a
                    href={`tel:${PHONE_NUMBER_INTL}`}
                    className="customs-cta-alt"
                  >
                    <Phone className="w-4 h-4" strokeWidth={1.5} />
                    {PHONE_NUMBER}
                  </a>
                  <span style={{ color: 'rgba(248, 247, 244, 0.3)' }}>|</span>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="customs-cta-alt"
                  >
                    <Mail className="w-4 h-4" strokeWidth={1.5} />
                    {EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
