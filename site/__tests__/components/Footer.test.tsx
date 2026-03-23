import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/app/components/Footer';

describe('Footer', () => {
  it('renders the c2L brand name', () => {
    render(<Footer />);
    expect(screen.getByText('c2L')).toBeInTheDocument();
  });

  it('renders copyright text with the current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it('renders the contact email', () => {
    render(<Footer />);
    expect(screen.getByText('ahiya.butman@gmail.com')).toBeInTheDocument();
  });

  it('renders the email as a mailto link', () => {
    render(<Footer />);
    const emailLink = screen.getByRole('link', { name: /ahiya\.butman@gmail\.com/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:ahiya.butman@gmail.com');
  });
});
