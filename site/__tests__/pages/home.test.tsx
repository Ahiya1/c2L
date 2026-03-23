import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
  });

  it('contains the main headline', () => {
    render(<HomePage />);
    expect(screen.getByText('AI Systems That Carry Responsibility')).toBeInTheDocument();
  });

  it('contains a link to the customs offer page', () => {
    render(<HomePage />);
    const links = screen.getAllByRole('link');
    const customsLink = links.find(
      (link) => link.getAttribute('href') === '/customs'
    );
    expect(customsLink).toBeDefined();
  });

  it('contains a link to StatViz', () => {
    render(<HomePage />);
    const links = screen.getAllByRole('link');
    const statvizLink = links.find((link) =>
      link.getAttribute('href')?.includes('statviz.xyz')
    );
    expect(statvizLink).toBeDefined();
  });

  it('contains a link to Ahiya', () => {
    render(<HomePage />);
    const links = screen.getAllByRole('link');
    const ahiyaLink = links.find((link) =>
      link.getAttribute('href')?.includes('ahiya.xyz')
    );
    expect(ahiyaLink).toBeDefined();
  });

  it('contains the contact email', () => {
    render(<HomePage />);
    const emailElements = screen.getAllByText('ahiya.butman@gmail.com');
    expect(emailElements.length).toBeGreaterThanOrEqual(1);
  });

  it('phone link uses international format with country code', () => {
    render(<HomePage />);
    const links = screen.getAllByRole('link');
    const telLink = links.find((link) =>
      link.getAttribute('href')?.startsWith('tel:')
    );
    expect(telLink).toBeDefined();
    expect(telLink!.getAttribute('href')).toBe('tel:+972587789019');
  });
});
