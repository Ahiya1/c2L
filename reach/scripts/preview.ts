// reach/scripts/preview.ts
import chalk from 'chalk';
import { loadConfig, assertCanCompose } from '../lib/config.js';
import { loadContacts, getContactByPriority, isPlaceholder } from '../lib/contacts.js';
import { composeEmail } from '../lib/compose.js';
import type { ComposedEmail, TemplateName } from '../lib/types.js';

const VALID_TEMPLATES: TemplateName[] = ['cold-outreach', 'follow-up', 'value-add'];

function printUsage(): void {
  console.log(`
Usage: npx tsx reach/scripts/preview.ts [options]

Options:
  --contact <priority>    Preview email for a specific contact (by priority number)
  --template <name>       Template to use: cold-outreach | follow-up | value-add
                          (default: cold-outreach)
  --subject <key>         Subject variant: subject_a | subject_b | subject_c
                          (default: subject_a)
  --all                   Preview emails for all contacts
  --list                  List all contacts with their status
  --help                  Show this help message

Examples:
  npx tsx reach/scripts/preview.ts --contact 1 --template cold-outreach
  npx tsx reach/scripts/preview.ts --all --template follow-up
  npx tsx reach/scripts/preview.ts --list
`);
}

function printEmail(email: ComposedEmail, isPlaceholderContact: boolean): void {
  const banner = chalk.bgYellow.black(' DRY-RUN ');
  const placeholderWarning = isPlaceholderContact
    ? chalk.bgRed.white(' PLACEHOLDER DATA ') + ' This contact has fake data. Replace before activation.\n'
    : '';

  console.log(`
${banner} Composed email preview
${placeholderWarning}
${chalk.gray('To:')}       ${email.to_name} <${email.to_email}>
${chalk.gray('Subject:')}  ${email.subject}
${chalk.gray('Template:')} ${email.template_used}
${chalk.gray('Priority:')} ${email.contact_priority}
${chalk.gray('---')}
${email.body}
${chalk.gray('---')}
${banner} ${chalk.yellow('EMAIL NOT SENT (preview only)')}
`);
}

function printContactList(contacts: ReturnType<typeof loadContacts>): void {
  console.log(chalk.bold('\nCustoms Broker Contacts:\n'));
  console.log(
    chalk.gray(
      'Pri  Status          Name                Company                  Email'
    )
  );
  console.log(chalk.gray('-'.repeat(90)));

  for (const contact of contacts) {
    const placeholder = isPlaceholder(contact) ? chalk.red(' [PLACEHOLDER]') : '';
    const statusColor =
      contact.status === 'pending'
        ? chalk.yellow
        : contact.status === 'closed_won'
          ? chalk.green
          : contact.status === 'closed_lost'
            ? chalk.red
            : chalk.blue;

    console.log(
      `${String(contact.priority).padStart(3)}  ${statusColor(contact.status.padEnd(15))} ${contact.contact_name.padEnd(20)} ${contact.company_name_he.padEnd(24)} ${contact.email}${placeholder}`
    );
  }
  console.log();
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    printUsage();
    process.exit(0);
  }

  try {
    // Load config and check mode
    const config = loadConfig();

    if (args.includes('--list')) {
      // Listing contacts is allowed in any mode
      const contacts = loadContacts();
      printContactList(contacts);
      return;
    }

    // Composition requires non-DORMANT mode
    assertCanCompose(config);

    const contacts = loadContacts();
    const templateArg = args[args.indexOf('--template') + 1] as TemplateName | undefined;
    const template: TemplateName = templateArg && VALID_TEMPLATES.includes(templateArg)
      ? templateArg
      : 'cold-outreach';
    const subjectKey = args.includes('--subject')
      ? args[args.indexOf('--subject') + 1]
      : undefined;

    if (args.includes('--all')) {
      console.log(chalk.bgYellow.black(' DRY-RUN ') + ` Previewing ${template} for all ${contacts.length} contacts\n`);
      for (const contact of contacts) {
        const email = composeEmail(contact, template, { subjectKey });
        printEmail(email, isPlaceholder(contact));
      }
      return;
    }

    if (args.includes('--contact')) {
      const priorityStr = args[args.indexOf('--contact') + 1];
      const priority = parseInt(priorityStr, 10);
      if (isNaN(priority)) {
        console.error(chalk.red(`Invalid priority number: ${priorityStr}`));
        process.exit(1);
      }
      const contact = getContactByPriority(contacts, priority);
      const email = composeEmail(contact, template, { subjectKey });
      printEmail(email, isPlaceholder(contact));
      return;
    }

    printUsage();
  } catch (error) {
    if (error instanceof Error) {
      // Check for known error types
      if (error.message.startsWith('[DORMANT]')) {
        console.error(chalk.bgRed.white(' BLOCKED ') + ' ' + error.message);
        process.exit(2);  // Exit code 2 = mode restriction
      }
      console.error(chalk.red(`Error: ${error.message}`));
    } else {
      console.error(chalk.red('An unexpected error occurred'));
    }
    process.exit(1);
  }
}

main();
