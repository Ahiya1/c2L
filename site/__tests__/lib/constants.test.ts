import { describe, it, expect } from 'vitest';
import {
  PHONE_NUMBER_INTL,
  WHATSAPP_URL,
  PHASES,
  TOTAL_PRICE,
  LINKS,
  EMAIL,
  PHONE_NUMBER,
} from '@/lib/constants';

describe('constants', () => {
  it('WhatsApp URL contains the correct phone number', () => {
    expect(WHATSAPP_URL).toContain('972587789019');
  });

  it('WhatsApp URL contains pre-filled message text', () => {
    expect(WHATSAPP_URL).toContain('text=');
    expect(WHATSAPP_URL).toMatch(/^https:\/\/wa\.me\//);
  });

  it('phone number is in international format', () => {
    expect(PHONE_NUMBER_INTL).toMatch(/^\+972/);
  });

  it('local phone number is in Israeli format', () => {
    expect(PHONE_NUMBER).toMatch(/^0\d{2}-\d{3}-\d{4}$/);
  });

  it('email is valid format', () => {
    expect(EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('phases sum to total price', () => {
    const sum = PHASES.reduce((acc, phase) => acc + phase.price, 0);
    expect(sum).toBe(TOTAL_PRICE);
  });

  it('has exactly 4 phases', () => {
    expect(PHASES).toHaveLength(4);
  });

  it('only the last phase has no exit ramp', () => {
    const phasesWithoutExit = PHASES.filter((p) => p.exitRamp === null);
    expect(phasesWithoutExit).toHaveLength(1);
    expect(phasesWithoutExit[0].number).toBe(4);
  });

  it('all external links are HTTPS', () => {
    Object.values(LINKS).forEach((url) => {
      expect(url).toMatch(/^https:\/\//);
    });
  });

  it('total price is 150,000 NIS', () => {
    expect(TOTAL_PRICE).toBe(150_000);
  });

  it('phases are numbered sequentially starting from 1', () => {
    PHASES.forEach((phase, index) => {
      expect(phase.number).toBe(index + 1);
    });
  });

  it('customer-facing phases match expected names for workflow mapping', () => {
    // These names must stay aligned with the internal workflow phases:
    //   Exploration = explore + plan
    //   Build = build
    //   Validation = validate + heal
    //   Delivery = deliver
    expect(PHASES[0].nameEn).toBe('Exploration');
    expect(PHASES[1].nameEn).toBe('Build');
    expect(PHASES[2].nameEn).toBe('Validation');
    expect(PHASES[3].nameEn).toBe('Delivery');
  });
});
