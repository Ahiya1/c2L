import { EMAIL } from '@/lib/constants';

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
