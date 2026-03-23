// reach/lib/compose.ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Contact, ComposedEmail, TemplateName } from './types.js';

/** Tokens that can be replaced in templates */
const TEMPLATE_TOKENS = ['contact_name', 'company_name_he', 'company_name'] as const;

interface TemplateParts {
  subjects: Record<string, string>;
  body: string;
}

/**
 * Parse a template file into its subject lines and body.
 * Subject lines are in the YAML front matter (between --- markers).
 * Body is everything after the second --- marker.
 */
export function parseTemplate(templateContent: string): TemplateParts {
  const lines = templateContent.split('\n');

  // Find front matter boundaries
  let firstDash = -1;
  let secondDash = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (firstDash === -1) {
        firstDash = i;
      } else {
        secondDash = i;
        break;
      }
    }
  }

  if (firstDash === -1 || secondDash === -1) {
    throw new Error('Template must have YAML front matter between --- markers');
  }

  // Parse subject lines from front matter
  const subjects: Record<string, string> = {};
  for (let i = firstDash + 1; i < secondDash; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const match = line.match(/^(subject_\w+):\s*"?(.+?)"?\s*$/);
    if (match) {
      subjects[match[1]] = match[2];
    }
  }

  if (Object.keys(subjects).length === 0) {
    throw new Error('Template must have at least one subject line (subject_a, subject_b, etc.)');
  }

  // Body is everything after the second ---
  const body = lines
    .slice(secondDash + 1)
    .join('\n')
    .trim();

  return { subjects, body };
}

/**
 * Replace all {token} placeholders in a string with values from a contact.
 */
export function replaceTokens(text: string, contact: Contact): string {
  let result = text;
  for (const token of TEMPLATE_TOKENS) {
    const value = contact[token as keyof Contact];
    if (typeof value === 'string') {
      result = result.replaceAll(`{${token}}`, value);
    }
  }
  return result;
}

/**
 * Load a template file by name.
 * Template names correspond to files in reach/templates/ (without .md extension).
 */
export function loadTemplate(templateName: TemplateName, templatesDir?: string): string {
  const dir = templatesDir ?? resolve(import.meta.dirname, '..', 'templates');
  const path = resolve(dir, `${templateName}.md`);
  return readFileSync(path, 'utf-8');
}

/**
 * Compose an email from a template and a contact.
 * Uses subject_a by default. Pass subjectKey to use a different subject variant.
 */
export function composeEmail(
  contact: Contact,
  templateName: TemplateName,
  options?: { subjectKey?: string; templatesDir?: string }
): ComposedEmail {
  const content = loadTemplate(templateName, options?.templatesDir);
  const { subjects, body } = parseTemplate(content);

  const subjectKey = options?.subjectKey ?? 'subject_a';
  const rawSubject = subjects[subjectKey];
  if (!rawSubject) {
    throw new Error(
      `Subject key "${subjectKey}" not found in template "${templateName}". ` +
        `Available: ${Object.keys(subjects).join(', ')}`
    );
  }

  return {
    to_name: contact.contact_name,
    to_email: contact.email,
    subject: replaceTokens(rawSubject, contact),
    body: replaceTokens(body, contact),
    template_used: templateName,
    contact_priority: contact.priority,
  };
}
