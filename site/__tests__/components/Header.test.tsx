import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/app/components/Header';

describe('Header', () => {
  it('renders the c2L brand name', () => {
    render(<Header />);
    expect(screen.getByText('c2L')).toBeInTheDocument();
  });

  it('renders navigation link to customs page', () => {
    render(<Header />);
    const link = screen.getByRole('link', { name: /customs/i });
    expect(link).toHaveAttribute('href', '/customs');
  });

  it('has the fixed header class', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('header-fixed');
  });

  it('renders the home link with c2L brand', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: /c2l/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
