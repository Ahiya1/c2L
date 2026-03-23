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
