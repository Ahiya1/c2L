// reach/__tests__/config.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadConfig, canCompose, assertCanCompose } from '../lib/config.js';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const TEST_DIR = resolve(import.meta.dirname, '.fixtures');
const TEST_CONFIG = resolve(TEST_DIR, 'config.yaml');

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

function writeTestConfig(content: string): void {
  writeFileSync(TEST_CONFIG, content, 'utf-8');
}

describe('loadConfig', () => {
  it('should load a valid DORMANT config', () => {
    writeTestConfig(`
mode: DORMANT
pipeline_stages:
  - id: pending
    label_he: ממתין
    description: Not yet contacted
campaign:
  max_touches: 3
  touch_sequence:
    - cold-outreach
  days_between_touch_1_and_2: 5
  days_between_touch_2_and_3: 10
contact_details:
  sender_name: Test
  sender_email: test@example.com
  sender_phone: "050-0000000"
  offer_url: https://c2l.dev/customs
`);
    const config = loadConfig(TEST_CONFIG);
    expect(config.mode).toBe('DORMANT');
  });

  it('should load a valid DRY_RUN config', () => {
    writeTestConfig(`
mode: DRY_RUN
pipeline_stages:
  - id: pending
    label_he: ממתין
    description: Not yet contacted
campaign:
  max_touches: 3
  touch_sequence:
    - cold-outreach
  days_between_touch_1_and_2: 5
  days_between_touch_2_and_3: 10
contact_details:
  sender_name: Test
  sender_email: test@example.com
  sender_phone: "050-0000000"
  offer_url: https://c2l.dev/customs
`);
    const config = loadConfig(TEST_CONFIG);
    expect(config.mode).toBe('DRY_RUN');
  });

  it('should reject an invalid mode', () => {
    writeTestConfig(`
mode: INVALID_MODE
pipeline_stages: []
campaign:
  max_touches: 3
  touch_sequence: []
  days_between_touch_1_and_2: 5
  days_between_touch_2_and_3: 10
contact_details:
  sender_name: Test
  sender_email: test@example.com
  sender_phone: "050-0000000"
  offer_url: https://c2l.dev/customs
`);
    expect(() => loadConfig(TEST_CONFIG)).toThrow();
  });

  it('should throw if config file is missing', () => {
    expect(() => loadConfig('/nonexistent/config.yaml')).toThrow();
  });

  it('should reject config with invalid email format', () => {
    writeTestConfig(`
mode: DORMANT
pipeline_stages:
  - id: pending
    label_he: ממתין
    description: Not yet contacted
campaign:
  max_touches: 3
  touch_sequence:
    - cold-outreach
  days_between_touch_1_and_2: 5
  days_between_touch_2_and_3: 10
contact_details:
  sender_name: Test
  sender_email: not-an-email
  sender_phone: "050-0000000"
  offer_url: https://c2l.dev/customs
`);
    expect(() => loadConfig(TEST_CONFIG)).toThrow();
  });
});

describe('canCompose', () => {
  it('should return false for DORMANT mode', () => {
    expect(canCompose({ mode: 'DORMANT' } as any)).toBe(false);
  });

  it('should return true for DRY_RUN mode', () => {
    expect(canCompose({ mode: 'DRY_RUN' } as any)).toBe(true);
  });

  it('should return true for LIVE mode', () => {
    expect(canCompose({ mode: 'LIVE' } as any)).toBe(true);
  });
});

describe('assertCanCompose', () => {
  it('should throw with clear message in DORMANT mode', () => {
    expect(() => assertCanCompose({ mode: 'DORMANT' } as any)).toThrow(
      '[DORMANT] System is in DORMANT mode'
    );
  });

  it('should include instructions for enabling in error message', () => {
    try {
      assertCanCompose({ mode: 'DORMANT' } as any);
    } catch (error) {
      expect((error as Error).message).toContain('DRY_RUN');
      expect((error as Error).message).toContain('config.yaml');
    }
  });

  it('should not throw in DRY_RUN mode', () => {
    expect(() => assertCanCompose({ mode: 'DRY_RUN' } as any)).not.toThrow();
  });

  it('should not throw in LIVE mode', () => {
    expect(() => assertCanCompose({ mode: 'LIVE' } as any)).not.toThrow();
  });
});
