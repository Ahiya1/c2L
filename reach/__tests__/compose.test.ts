// reach/__tests__/compose.test.ts
import { describe, it, expect } from 'vitest';
import { parseTemplate, replaceTokens, composeEmail } from '../lib/compose.js';
import type { Contact } from '../lib/types.js';

const mockContact: Contact = {
  priority: 1,
  company_name: 'Test Broker Co',
  company_name_he: 'טסט שילוח בע״מ',
  contact_name: 'ישראל כהן',
  role: 'בעלים',
  email: 'israel@testbroker.co.il',
  phone: '050-1234567',
  location: 'אשדוד',
  company_size: '10-20',
  specialization: 'ייבוא כללי',
  website: 'https://testbroker.co.il',
  linkedin: '',
  status: 'pending',
  last_contact: '',
  next_action: 'לשלוח מייל ראשון',
  notes: '',
};

describe('parseTemplate', () => {
  it('should parse front matter and body', () => {
    const content = `---
subject_a: Test subject
subject_b: Another subject
---

Hello {contact_name}, this is the body.`;

    const result = parseTemplate(content);
    expect(result.subjects.subject_a).toBe('Test subject');
    expect(result.subjects.subject_b).toBe('Another subject');
    expect(result.body).toContain('Hello {contact_name}');
  });

  it('should throw if front matter is missing', () => {
    expect(() => parseTemplate('No front matter here')).toThrow(
      'Template must have YAML front matter'
    );
  });

  it('should throw if only one --- marker exists', () => {
    expect(() => parseTemplate('---\nsubject_a: test\nBody without closing')).toThrow(
      'Template must have YAML front matter'
    );
  });

  it('should throw if no subject lines in front matter', () => {
    const content = `---
not_a_subject: value
---

Body text.`;

    expect(() => parseTemplate(content)).toThrow('must have at least one subject line');
  });

  it('should handle quoted subject lines with tokens', () => {
    const content = `---
subject_a: "{company_name_he} — test"
---

Body.`;

    const result = parseTemplate(content);
    expect(result.subjects.subject_a).toBe('{company_name_he} — test');
  });

  it('should parse multiple subject variants', () => {
    const content = `---
subject_a: First option
subject_b: Second option
subject_c: Third option
---

Body.`;

    const result = parseTemplate(content);
    expect(Object.keys(result.subjects)).toHaveLength(3);
    expect(result.subjects.subject_c).toBe('Third option');
  });

  it('should trim the body content', () => {
    const content = `---
subject_a: Test
---

   Body with leading space.

`;

    const result = parseTemplate(content);
    expect(result.body).toBe('Body with leading space.');
  });
});

describe('replaceTokens', () => {
  it('should replace {contact_name} with contact name', () => {
    const result = replaceTokens('שלום {contact_name},', mockContact);
    expect(result).toBe('שלום ישראל כהן,');
  });

  it('should replace {company_name_he} with Hebrew company name', () => {
    const result = replaceTokens('חברת {company_name_he}', mockContact);
    expect(result).toBe('חברת טסט שילוח בע״מ');
  });

  it('should replace {company_name} with English company name', () => {
    const result = replaceTokens('Company: {company_name}', mockContact);
    expect(result).toBe('Company: Test Broker Co');
  });

  it('should replace multiple tokens in the same string', () => {
    const result = replaceTokens(
      'שלום {contact_name}, מחברת {company_name_he}',
      mockContact
    );
    expect(result).toBe('שלום ישראל כהן, מחברת טסט שילוח בע״מ');
  });

  it('should leave unknown tokens unchanged', () => {
    const result = replaceTokens('{unknown_token}', mockContact);
    expect(result).toBe('{unknown_token}');
  });

  it('should handle Hebrew text with RTL correctly', () => {
    const template = 'הפניה אליך {contact_name} מ{company_name_he}';
    const result = replaceTokens(template, mockContact);
    expect(result).toContain('ישראל כהן');
    expect(result).toContain('טסט שילוח בע״מ');
  });

  it('should replace the same token multiple times', () => {
    const result = replaceTokens('{contact_name} says hi to {contact_name}', mockContact);
    expect(result).toBe('ישראל כהן says hi to ישראל כהן');
  });
});

describe('composeEmail', () => {
  it('should compose email with correct fields using parseTemplate and replaceTokens', () => {
    const content = `---
subject_a: Test subject for {contact_name}
---

שלום {contact_name},

This is a test email for {company_name_he}.`;

    // For unit testing, test parseTemplate + replaceTokens directly
    const { subjects, body } = parseTemplate(content);
    const composedSubject = replaceTokens(subjects.subject_a, mockContact);
    const composedBody = replaceTokens(body, mockContact);

    expect(composedSubject).toBe('Test subject for ישראל כהן');
    expect(composedBody).toContain('שלום ישראל כהן,');
    expect(composedBody).toContain('טסט שילוח בע״מ');
  });

  it('should use the real templates directory for integration', () => {
    // Test with actual template files
    const email = composeEmail(mockContact, 'cold-outreach');
    expect(email.to_name).toBe('ישראל כהן');
    expect(email.to_email).toBe('israel@testbroker.co.il');
    expect(email.template_used).toBe('cold-outreach');
    expect(email.contact_priority).toBe(1);
    expect(email.subject).toContain('פקידי הקלדה');
    expect(email.body).toContain('ישראל כהן');
    expect(email.body).toContain('058-778-9019');
    expect(email.body).toContain('ahiya.butman@gmail.com');
    expect(email.body).toContain('https://c2l.dev/customs');
  });

  it('should compose follow-up template', () => {
    const email = composeEmail(mockContact, 'follow-up');
    expect(email.template_used).toBe('follow-up');
    expect(email.body).toContain('ישראל כהן');
    expect(email.body).toContain('https://c2l.dev/customs');
  });

  it('should compose value-add template', () => {
    const email = composeEmail(mockContact, 'value-add');
    expect(email.template_used).toBe('value-add');
    expect(email.body).toContain('ישראל כהן');
    expect(email.body).toContain('https://c2l.dev/customs');
  });

  it('should use subject_a by default', () => {
    const email = composeEmail(mockContact, 'cold-outreach');
    expect(email.subject).toBe('כמה אתה מוציא על פקידי הקלדה בשנה?');
  });

  it('should support alternate subject keys', () => {
    const email = composeEmail(mockContact, 'cold-outreach', { subjectKey: 'subject_b' });
    expect(email.subject).toBe('מערכת שמחליפה את עבודת ההקלדה — בלי חוזה תחזוקה');
  });

  it('should replace tokens in subject_c with company name', () => {
    const email = composeEmail(mockContact, 'cold-outreach', { subjectKey: 'subject_c' });
    expect(email.subject).toContain('טסט שילוח בע״מ');
  });

  it('should throw for invalid subject key', () => {
    expect(() =>
      composeEmail(mockContact, 'cold-outreach', { subjectKey: 'subject_z' })
    ).toThrow('Subject key "subject_z" not found');
  });
});
