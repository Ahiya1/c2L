import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomsPage from '@/app/customs/page';

describe('CustomsPage', () => {
  it('renders without crashing', () => {
    render(<CustomsPage />);
  });

  it('contains the hero headline about clerk costs', () => {
    render(<CustomsPage />);
    expect(
      screen.getByText(/עמילי מכס משלמים חצי מיליון/)
    ).toBeInTheDocument();
  });

  it('contains WhatsApp CTA links', () => {
    render(<CustomsPage />);
    const links = screen.getAllByRole('link');
    const whatsappLinks = links.filter((link) =>
      link.getAttribute('href')?.includes('wa.me')
    );
    expect(whatsappLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('contains all 4 phase names in Hebrew', () => {
    render(<CustomsPage />);
    expect(screen.getByText('חקירה')).toBeInTheDocument();
    expect(screen.getByText('בנייה')).toBeInTheDocument();
    expect(screen.getByText('אימות')).toBeInTheDocument();
    expect(screen.getByText('מסירה')).toBeInTheDocument();
  });

  it('contains pricing numbers for each phase', () => {
    render(<CustomsPage />);
    // Phase prices formatted with locale
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('80,000')).toBeInTheDocument();
    expect(screen.getByText('35,000')).toBeInTheDocument();
    expect(screen.getByText('30,000')).toBeInTheDocument();
  });

  it('contains the total price', () => {
    render(<CustomsPage />);
    const totalElements = screen.getAllByText(/150,000/);
    // Appears in both the process section total and the ROI comparison
    expect(totalElements.length).toBeGreaterThanOrEqual(2);
  });

  it('contains exit ramp text for phases 1-3', () => {
    render(<CustomsPage />);
    expect(screen.getByText(/הדוח שלך\. אפשר לעצור כאן\./)).toBeInTheDocument();
    expect(screen.getByText(/הדוח והמערכת שלך\. אפשר לעצור כאן\./)).toBeInTheDocument();
    expect(screen.getByText(/כל המסמכים והמערכת שלך\. אפשר לעצור כאן\./)).toBeInTheDocument();
  });

  it('contains a link to StatViz as proof of work', () => {
    render(<CustomsPage />);
    const links = screen.getAllByRole('link');
    const statvizLink = links.find((link) =>
      link.getAttribute('href')?.includes('statviz.xyz')
    );
    expect(statvizLink).toBeDefined();
  });

  it('contains a link to Ahiya', () => {
    render(<CustomsPage />);
    const links = screen.getAllByRole('link');
    const ahiyaLink = links.find((link) =>
      link.getAttribute('href')?.includes('ahiya.xyz')
    );
    expect(ahiyaLink).toBeDefined();
  });

  it('contains the phone number', () => {
    render(<CustomsPage />);
    expect(screen.getByText('058-778-9019')).toBeInTheDocument();
  });

  it('contains the email address in the CTA section', () => {
    render(<CustomsPage />);
    const emailElements = screen.getAllByText('ahiya.butman@gmail.com');
    // At least 2: one in CTA section, one in footer
    expect(emailElements.length).toBeGreaterThanOrEqual(2);
  });

  it('contains ROI comparison data', () => {
    render(<CustomsPage />);
    expect(screen.getByText(/500,000 - 1,400,000/)).toBeInTheDocument();
    expect(screen.getByText(/350,000 - 1,250,000/)).toBeInTheDocument();
    expect(screen.getByText('2-4 חודשים')).toBeInTheDocument();
  });

  it('contains pain point sections', () => {
    render(<CustomsPage />);
    expect(screen.getByText('עלות כוח אדם')).toBeInTheDocument();
    expect(screen.getByText('טעויות ותיקוני רשימון')).toBeInTheDocument();
    expect(screen.getByText('עיכובים בנמל')).toBeInTheDocument();
    expect(screen.getByText('הכשרה ותחלופה')).toBeInTheDocument();
  });

  it('contains trust signals', () => {
    render(<CustomsPage />);
    expect(screen.getByText('בלי חוזה תחזוקה')).toBeInTheDocument();
    expect(screen.getByText('ניסיון מוכח')).toBeInTheDocument();
    expect(screen.getByText(/בן אדם, לא חברה/)).toBeInTheDocument();
  });

  it('all external links have rel="noopener noreferrer"', () => {
    render(<CustomsPage />);
    const links = screen.getAllByRole('link');
    const externalLinks = links.filter(
      (link) => link.getAttribute('target') === '_blank'
    );
    externalLinks.forEach((link) => {
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  it('phone link uses tel: protocol', () => {
    render(<CustomsPage />);
    const links = screen.getAllByRole('link');
    const phoneLink = links.find((link) =>
      link.getAttribute('href')?.startsWith('tel:')
    );
    expect(phoneLink).toBeDefined();
    expect(phoneLink?.getAttribute('href')).toContain('+972');
  });

  it('email link uses mailto: protocol', () => {
    render(<CustomsPage />);
    const links = screen.getAllByRole('link');
    const mailtoLinks = links.filter((link) =>
      link.getAttribute('href')?.startsWith('mailto:')
    );
    // At least 2: one in CTA section, one in footer
    expect(mailtoLinks.length).toBeGreaterThanOrEqual(2);
  });
});
