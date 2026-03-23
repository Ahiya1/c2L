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
