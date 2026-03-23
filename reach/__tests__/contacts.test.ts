// reach/__tests__/contacts.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadContacts, isPlaceholder, getContactByPriority } from '../lib/contacts.js';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Contact } from '../lib/types.js';

const TEST_DIR = resolve(import.meta.dirname, '.fixtures');
const TEST_CSV = resolve(TEST_DIR, 'test-contacts.csv');

const CSV_HEADER =
  'priority,company_name,company_name_he,contact_name,role,email,phone,location,company_size,specialization,website,linkedin,status,last_contact,next_action,notes';

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('loadContacts', () => {
  it('should parse a valid CSV with Hebrew content', () => {
    const csv = `${CSV_HEADER}
1,Test Co,טסט בע״מ,ישראל כהן,בעלים,israel@test.co.il,050-1234567,אשדוד,10-20,ייבוא כללי,https://test.co.il,,pending,,לשלוח מייל,הערה`;
    writeFileSync(TEST_CSV, csv, 'utf-8');

    const contacts = loadContacts(TEST_CSV);
    expect(contacts).toHaveLength(1);
    expect(contacts[0].contact_name).toBe('ישראל כהן');
    expect(contacts[0].location).toBe('אשדוד');
    expect(contacts[0].status).toBe('pending');
  });

  it('should sort contacts by priority', () => {
    const csv = `${CSV_HEADER}
3,C Co,ג בע״מ,גד,בעלים,c@test.co.il,050-3,חיפה,5,ייבוא,,,pending,,,
1,A Co,א בע״מ,אבי,בעלים,a@test.co.il,050-1,אשדוד,10,ייבוא,,,pending,,,
2,B Co,ב בע״מ,בני,בעלים,b@test.co.il,050-2,אשדוד,8,ייבוא,,,pending,,,`;
    writeFileSync(TEST_CSV, csv, 'utf-8');

    const contacts = loadContacts(TEST_CSV);
    expect(contacts[0].priority).toBe(1);
    expect(contacts[1].priority).toBe(2);
    expect(contacts[2].priority).toBe(3);
  });

  it('should reject invalid status values', () => {
    const csv = `${CSV_HEADER}
1,Test,טסט,Name,Role,test@test.co.il,050-1,City,5,Spec,,,INVALID_STATUS,,,`;
    writeFileSync(TEST_CSV, csv, 'utf-8');

    expect(() => loadContacts(TEST_CSV)).toThrow('Invalid contact at row 2');
  });

  it('should reject invalid email format', () => {
    const csv = `${CSV_HEADER}
1,Test,טסט,Name,Role,not-an-email,050-1,City,5,Spec,,,pending,,,`;
    writeFileSync(TEST_CSV, csv, 'utf-8');

    expect(() => loadContacts(TEST_CSV)).toThrow('Invalid contact at row 2');
  });

  it('should handle multiple valid rows', () => {
    const csv = `${CSV_HEADER}
1,A Co,א בע״מ,אבי,בעלים,a@test.co.il,050-1,אשדוד,10,ייבוא,,,pending,,,
2,B Co,ב בע״מ,בני,מנהל,b@test.co.il,050-2,חיפה,5,ייבוא,,,contacted,,,`;
    writeFileSync(TEST_CSV, csv, 'utf-8');

    const contacts = loadContacts(TEST_CSV);
    expect(contacts).toHaveLength(2);
    expect(contacts[0].status).toBe('pending');
    expect(contacts[1].status).toBe('contacted');
  });
});

describe('isPlaceholder', () => {
  const realContact: Contact = {
    priority: 1,
    company_name: 'Real Customs Ltd',
    company_name_he: 'עמילות מכס אמיתית',
    contact_name: 'דני לוי',
    role: 'בעלים',
    email: 'dani@realcustoms.co.il',
    phone: '050-9876543',
    location: 'אשדוד',
    company_size: '15',
    specialization: 'ייבוא',
    website: 'https://realcustoms.co.il',
    linkedin: '',
    status: 'pending',
    last_contact: '',
    next_action: '',
    notes: 'Real contact',
  };

  const placeholderContact: Contact = {
    ...realContact,
    contact_name: 'ישראל ישראלי',
    email: 'example1@example.co.il',
    notes: 'נתון לדוגמא - להחליף בנתון אמיתי',
  };

  it('should return false for real contact data', () => {
    expect(isPlaceholder(realContact)).toBe(false);
  });

  it('should return true for placeholder name', () => {
    expect(isPlaceholder(placeholderContact)).toBe(true);
  });

  it('should detect example.co.il email as placeholder', () => {
    expect(isPlaceholder({ ...realContact, email: 'test@example.co.il' })).toBe(true);
  });

  it('should detect 050-0000 phone as placeholder', () => {
    expect(isPlaceholder({ ...realContact, phone: '050-0000001' })).toBe(true);
  });

  it('should detect placeholder notes', () => {
    expect(isPlaceholder({ ...realContact, notes: 'נתון לדוגמא - צריך להחליף' })).toBe(true);
  });

  it('should detect test@ email as placeholder', () => {
    expect(isPlaceholder({ ...realContact, email: 'test@something.co.il' })).toBe(true);
  });

  it('should detect דוד דוידוב as placeholder name', () => {
    expect(isPlaceholder({ ...realContact, contact_name: 'דוד דוידוב' })).toBe(true);
  });

  it('should detect placeholder in company_name', () => {
    expect(isPlaceholder({ ...realContact, company_name: 'Placeholder Shipping' })).toBe(true);
  });
});

describe('getContactByPriority', () => {
  const contacts: Contact[] = [
    { priority: 1, contact_name: 'First' } as Contact,
    { priority: 2, contact_name: 'Second' } as Contact,
    { priority: 3, contact_name: 'Third' } as Contact,
  ];

  it('should find contact by priority', () => {
    expect(getContactByPriority(contacts, 2).contact_name).toBe('Second');
  });

  it('should throw if priority not found', () => {
    expect(() => getContactByPriority(contacts, 99)).toThrow('No contact found with priority 99');
  });

  it('should find the first contact', () => {
    expect(getContactByPriority(contacts, 1).contact_name).toBe('First');
  });
});
