import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'c2L - אוטומציה למסמכי מכס',
  description:
    'מערכת שמחליפה את עבודת ההקלדה של פקידים. לא כלי שעוזר — מערכת שנושאת אחריות.',
  openGraph: {
    locale: 'he_IL',
    title: 'c2L - אוטומציה למסמכי מכס',
    description:
      'מערכת שמחליפה את עבודת ההקלדה של פקידים. לא כלי שעוזר — מערכת שנושאת אחריות.',
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
