# 2L Iteration Plan - c2L-Reach (Outreach Engine)

## Project Vision

Build a dormant outreach engine for customs broker leads. The system manages contacts, composes personalized Hebrew emails, and previews them -- but NEVER sends. It replicates the proven StatViz college outreach pattern (flat-file CSV + markdown templates) adapted for customs brokerage cold outreach. The reach system lives at `reach/` as a sibling to the existing `site/` directory.

This is NOT a web application. It is a file-based system with a single TypeScript compose/preview script.

## Success Criteria

Specific, measurable criteria for iteration 2 completion:

- [ ] `reach/` directory exists at project root with correct structure
- [ ] `reach/config.yaml` has `mode: DORMANT` and documents all three modes
- [ ] `reach/contacts/customs-broker-targets.csv` has correct schema with 10 rows of placeholder data
- [ ] Placeholder data is obviously fake (names like "ישראל ישראלי", emails like "example@example.co.il")
- [ ] 3 Hebrew email templates exist: cold outreach, follow-up, value-add
- [ ] All templates link to `https://c2l.dev/customs`
- [ ] All templates use `{contact_name}` and `{company_name_he}` tokens
- [ ] Template contact details match `site/lib/constants.ts` exactly (phone: 058-778-9019, email: ahiya.butman@gmail.com)
- [ ] `reach/scripts/preview.ts` reads CSV + template and outputs composed email to stdout
- [ ] Preview script respects DORMANT mode (refuses to compose when DORMANT)
- [ ] Preview script works in DRY_RUN mode (composes and displays, never sends)
- [ ] NO send function exists anywhere in the codebase
- [ ] NO SMTP credentials, API keys, or sending configuration exists
- [ ] `reach/README.md` documents workflow, pipeline stages, safety rules, and "what NOT to say"
- [ ] `npx tsx reach/scripts/preview.ts --contact 1 --template cold-outreach` outputs a composed email
- [ ] `npm run test` passes all reach tests
- [ ] `npx tsc --noEmit` passes for reach TypeScript files
- [ ] `.gitignore` at reach root ignores `contacts/customs-broker-targets-real.csv`

## MVP Scope

**In Scope:**
- Directory structure for reach system (`reach/` at project root)
- Contact CSV schema with 10 placeholder rows
- 3 Hebrew email templates (cold outreach, follow-up, value-add)
- "What NOT to say" guidance document
- Config YAML with DORMANT/DRY_RUN/LIVE modes
- TypeScript compose/preview script (reads CSV + template, outputs to stdout)
- Pipeline stage definitions adapted from StatViz
- Batch tracking directory structure (empty, for future use)
- README with workflow documentation and safety warnings
- Tests for the compose/preview script
- `.gitignore` for real contact data

**Out of Scope (Post-MVP / Later Iterations):**
- Actual lead research (Ahiya fills in real contacts manually)
- Send capability (no send function, no SMTP, no API keys)
- Gmail MCP integration (documented as future integration point only)
- HTML-formatted email templates (plain text for authenticity)
- Automated follow-up sequences
- Open/click tracking
- Campaign analytics
- Railway deployment (unnecessary for a local script)

## Development Phases

1. **Exploration** -- Complete
2. **Planning** -- Current
3. **Building** -- ~2 hours (1 builder)
4. **Integration** -- ~10 minutes (single builder, minimal integration)
5. **Validation** -- ~15 minutes
6. **Deployment** -- None (local system, no deployment needed)

## Timeline Estimate

- Exploration: Complete
- Planning: Complete
- Building: 2 hours (single builder)
- Integration: 10 minutes
- Validation: 15 minutes
- Total: ~2.5 hours

## Risk Assessment

### High Risks

- **Accidental email sends**: The single catastrophic risk. If unfinished emails reach real brokers before the system is ready, those contacts are burned forever. Mitigation: multi-layer dormancy enforcement through architecture (no send function exists, no credentials exist, DORMANT config flag, real contacts gitignored, preview-only script). The system is structurally incapable of sending email.

### Medium Risks

- **Hebrew template tone**: Cold outreach templates must sound natural in Hebrew and use correct customs terminology. If they read like translated English or generic marketing, they fail. Mitigation: templates follow the StatViz pattern that worked, use domain-specific terminology from explorer reports, and are designed for Ahiya to review and personalize before activation.

- **Contact data never gets filled in**: The system ships with placeholder data. If Ahiya does not replace it with real contacts, the system is useless. Mitigation: placeholder data is obviously fake, the preview script warns when placeholder data is detected, and the README includes a checklist for Ahiya to complete before activation.

### Low Risks

- **Script tooling issues**: The compose/preview script uses `tsx` to run TypeScript directly. This is well-established tooling. Risk of breakage is minimal.

- **CSV parsing edge cases**: Hebrew text in CSV can have encoding issues. Mitigation: use `csv-parse` library, enforce UTF-8, test with Hebrew content.

## Integration Strategy

Single builder creates the entire `reach/` directory. No cross-builder integration needed.

Integration with iteration 1 (site) is limited to:
1. Email templates reference `https://c2l.dev/customs` (the URL)
2. Signature contact details match `site/lib/constants.ts` values
3. These are reference checks, not code dependencies

The existing `.github/workflows/ci.yml` may need updating to include reach tests. This is noted for the builder but is not blocking -- CI currently only covers `site/`.

## Deployment Plan

No deployment. The reach system runs locally in Ahiya's development environment. The master plan originally mentioned Railway deployment, but both explorers agree this is unnecessary for a 10-contact flat-file system. When the system is eventually activated, Ahiya runs the preview script from Claude Code and sends emails through Gmail MCP manually.
