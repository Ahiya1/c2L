// reach/__tests__/preview.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

const REACH_DIR = resolve(import.meta.dirname, '..');
const CONFIG_PATH = resolve(REACH_DIR, 'config.yaml');

function runPreview(args: string, expectFailure = false): string {
  try {
    const result = execSync(
      `npx tsx ${resolve(REACH_DIR, 'scripts', 'preview.ts')} ${args}`,
      {
        cwd: REACH_DIR,
        encoding: 'utf-8',
        env: { ...process.env, FORCE_COLOR: '0' },
      }
    );
    return result;
  } catch (error: any) {
    if (expectFailure) {
      return error.stderr || error.stdout || error.message;
    }
    throw error;
  }
}

describe('preview.ts CLI (DORMANT mode)', () => {
  it('should block composition with DORMANT error', () => {
    const output = runPreview('--contact 1 --template cold-outreach', true);
    expect(output).toContain('DORMANT');
  });

  it('should allow --list in DORMANT mode', () => {
    const output = runPreview('--list');
    expect(output).toContain('Customs Broker Contacts');
    expect(output).toContain('ישראל ישראלי');
  });

  it('should list all 10 contacts', () => {
    const output = runPreview('--list');
    expect(output).toContain('example1@example.co.il');
    expect(output).toContain('example10@example.co.il');
  });
});

describe('preview.ts CLI (DRY_RUN mode)', () => {
  let originalConfig: string;

  // Save original config and switch to DRY_RUN
  beforeAll(() => {
    originalConfig = readFileSync(CONFIG_PATH, 'utf-8');
    const dryRunConfig = originalConfig.replace('mode: DORMANT', 'mode: DRY_RUN');
    writeFileSync(CONFIG_PATH, dryRunConfig, 'utf-8');
  });

  // Restore original config
  afterAll(() => {
    writeFileSync(CONFIG_PATH, originalConfig, 'utf-8');
  });

  it('should compose and preview an email for contact 1', () => {
    const output = runPreview('--contact 1 --template cold-outreach');
    expect(output).toContain('DRY-RUN');
    expect(output).toContain('ישראל ישראלי');
    expect(output).toContain('example1@example.co.il');
    expect(output).toContain('פקידי הקלדה');
    expect(output).toContain('EMAIL NOT SENT');
  });

  it('should warn about placeholder data', () => {
    const output = runPreview('--contact 1 --template cold-outreach');
    expect(output).toContain('PLACEHOLDER DATA');
  });

  it('should compose follow-up template', () => {
    const output = runPreview('--contact 2 --template follow-up');
    expect(output).toContain('דוד דוידוב');
    expect(output).toContain('c2l.dev/customs');
  });

  it('should compose value-add template', () => {
    const output = runPreview('--contact 3 --template value-add');
    expect(output).toContain('שרה כהן');
    expect(output).toContain('רשימונות');
  });

  it('should preview all contacts', () => {
    const output = runPreview('--all --template cold-outreach');
    expect(output).toContain('Previewing cold-outreach for all 10 contacts');
    expect(output).toContain('ישראל ישראלי');
    expect(output).toContain('עמית שפירא');
  });
});
