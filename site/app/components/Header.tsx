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
