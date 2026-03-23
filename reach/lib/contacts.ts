// reach/lib/contacts.ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { VALID_STAGES } from './types.js';
import type { Contact } from './types.js';

/** Indicators that a contact row contains placeholder data */
const PLACEHOLDER_INDICATORS = [
  'example.co.il',
  'example.com',
  'ישראל ישראלי',
  'דוד דוידוב',
  '050-0000',
  'נתון לדוגמא',
  'placeholder',
  'test@',
] as const;

const contactSchema = z.object({
  priority: z.coerce.number().int().positive(),
  company_name: z.string().min(1),
  company_name_he: z.string().min(1),
  contact_name: z.string().min(1),
  role: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  location: z.string().min(1),
  company_size: z.string(),
  specialization: z.string(),
  website: z.string(),
  linkedin: z.string(),
  status: z.enum(VALID_STAGES),
  last_contact: z.string(),
  next_action: z.string(),
  notes: z.string(),
});

/**
 * Load and validate contacts from a CSV file.
 * Returns an array of validated Contact objects sorted by priority.
 */
export function loadContacts(csvPath?: string): Contact[] {
  const path =
    csvPath ?? resolve(import.meta.dirname, '..', 'contacts', 'customs-broker-targets.csv');
  const raw = readFileSync(path, 'utf-8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  const contacts: Contact[] = records.map((record: unknown, index: number) => {
    try {
      return contactSchema.parse(record);
    } catch (error) {
      throw new Error(
        `Invalid contact at row ${index + 2}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });

  return contacts.sort((a, b) => a.priority - b.priority);
}

/**
 * Check if a contact row contains placeholder data.
 * Returns true if any field matches a known placeholder indicator.
 */
export function isPlaceholder(contact: Contact): boolean {
  const fields = [
    contact.email,
    contact.contact_name,
    contact.phone,
    contact.notes,
    contact.company_name,
  ];
  return fields.some((field) =>
    PLACEHOLDER_INDICATORS.some((indicator) =>
      field.toLowerCase().includes(indicator.toLowerCase())
    )
  );
}

/**
 * Get a single contact by priority number (1-based).
 * Throws if not found.
 */
export function getContactByPriority(contacts: Contact[], priority: number): Contact {
  const contact = contacts.find((c) => c.priority === priority);
  if (!contact) {
    throw new Error(`No contact found with priority ${priority}`);
  }
  return contact;
}
