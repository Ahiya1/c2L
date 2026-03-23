# Technology Stack

## Core Framework

**Decision:** Claude Code Plugin System (markdown command files)

**Rationale:**
- c2L is a Claude Code plugin, identical in mechanism to 2L
- Commands are markdown files that Claude reads and follows as instructions
- No application framework needed -- the "runtime" is Claude Code itself
- Proven pattern: 2L has been running successfully with this architecture

**Alternatives Considered:**
- Custom CLI tool (Node.js/TypeScript): Rejected. Adds unnecessary complexity. Claude Code already provides the CLI interface. Commands as markdown are simpler, more maintainable, and can be iterated without recompilation.
- Skills directory format (`skills/*/SKILL.md`): Explorer 1 recommended this as the "newer official format." Decision: **Use `commands/*.md` instead.** Reason: 2L already uses `commands/` and Ahiya is familiar with it. The skills format adds directory nesting without clear benefit for c2L's simple command set. Consistency with 2L outweighs novelty. If the skills format proves necessary later, migration is trivial (move files into subdirectories).

## Plugin Registration

**Decision:** `.claude-plugin/plugin.json` at the c2L repo root

**Rationale:**
- Standard Claude Code plugin discovery mechanism
- When Ahiya runs `claude` from the c2L repo directory, all `/c2l-*` commands are automatically available
- No symlink management needed (unlike 2L's `~/.claude/commands` symlink approach)
- The plugin.json is metadata only; commands are discovered from the `commands/` directory by convention

**Implementation Notes:**
- The manifest file is minimal JSON: name, version, description, author
- Commands are not explicitly listed in plugin.json -- Claude Code discovers them from the `commands/` directory at the repo root
- No `marketplace.json` needed (c2L is private, not a marketplace plugin)

## State Management

**Decision:** Filesystem-as-state using YAML and markdown files

**Rationale:**
- Follows 2L's proven pattern
- No database, no external services, no infrastructure costs
- Human-readable and manually editable
- Each client engagement is a directory under `clients/`
- `client.yaml` is the single source of truth per engagement

**Schema Strategy:**
- `client.yaml` at each client directory root tracks engagement state
- Phase artifacts (reports, specs, results) are markdown files in phase subdirectories
- State transitions are determined by artifact existence AND explicit phase tracking in client.yaml
- Both must agree: client.yaml says "plan" phase AND exploration artifacts exist

## Command File Format

**Decision:** Markdown with YAML frontmatter, following 2L conventions

**Frontmatter fields:**
```yaml
---
description: Short description shown in /help
argument-hint: <client-slug> or "new"
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---
```

**Rationale:**
- `description`: Required by Claude Code for `/help` display
- `argument-hint`: Shows users what arguments the command accepts
- `allowed-tools`: Reduces permission prompts during execution. All c2L commands need filesystem access (Read, Write, Edit, Glob, Grep) and shell access (Bash for directory creation)
- No `model` override: Use whatever model the session is running (Ahiya chooses)

## Template System

**Decision:** Markdown template files in `clients/_templates/` with placeholder syntax

**Rationale:**
- Templates define the structure of client-facing deliverables
- Copied into new client directories on project initialization
- Placeholders use `{PLACEHOLDER_NAME}` syntax for human replacement
- No template engine needed -- Claude fills in the content cooperatively with Ahiya

**Template files:**
- `exploration-report.md` -- The primary deliverable (client-shareable)
- `document-inventory.md` -- Catalog of document types
- `workflow-map.md` -- Current manual process documentation
- `client.yaml` -- Client configuration template

## Client Configuration

**Decision:** `client.yaml` per client directory

**Schema fields (structured YAML):**
- `client`: name, name_he, slug, contact, phone, email, location, size, created
- `engagement`: current_phase, phase_started, phases_completed (array with dates and deliverable paths)
- `volumes`: shipments_per_month, documents_per_shipment, clerks, estimated_annual_clerk_cost
- `pipeline`: document_types (array), accuracy_targets (field_level, document_level), current_accuracy
- `notes`: Free-form text for observations

**Rationale:**
- Human-readable, manually editable
- Structured enough for programmatic reading by c2l-status
- Flexible enough to accommodate different client scenarios
- No schema validation library needed at this stage -- commands validate by checking field presence

## Testing

**Decision:** Shell-based validation scripts (Bash)

**Rationale:**
- The deliverables are markdown and YAML files, not TypeScript code
- Tests validate file structure, frontmatter syntax, required sections, and schema completeness
- Bash scripts with `grep`, `test`, and basic YAML parsing are sufficient
- No test framework dependency needed
- Tests are run as part of the 2L validation phase

**Test categories:**
- Command frontmatter validation (required fields present, valid syntax)
- Template completeness (required sections present, placeholders consistent)
- client.yaml schema validation (required fields, valid phase values)
- Directory structure validation (expected directories and files exist)

## External Integrations

### Reach System Cross-Reference
**Purpose:** When a contact moves to `exploring` stage in reach, a corresponding client project should exist
**Implementation:** Manual cross-reference via client slug. No automated integration.
**Key detail:** The reach system's `PipelineStage` type includes `'exploring'` and `'closed_won'` stages that map to c2L engagement phases. Ahiya updates reach status manually when creating a c2L client project.

## Development Tools

### Testing
- **Framework:** Bash scripts (no external framework)
- **Coverage target:** 100% of command files validated for frontmatter, 100% of templates validated for required sections
- **Strategy:** Structural validation, not behavioral testing (commands are prompts, not executable code)

### Code Quality
- **Linter:** N/A (markdown files, not source code)
- **Formatter:** N/A
- **Type Checking:** N/A (no TypeScript in this iteration's output)

### Validation
- **Frontmatter parser:** `grep` and `sed` for extracting YAML frontmatter from markdown files
- **YAML validation:** `python3 -c "import yaml; yaml.safe_load(open('file'))"` or equivalent for validating client.yaml structure
- **Section checker:** `grep` for verifying required markdown sections exist in templates

## Environment Variables

None required. c2L is a local plugin with no external service dependencies.

## Dependencies Overview

No package dependencies. All deliverables are markdown and YAML files. The only runtime dependency is Claude Code itself.

## File Structure

```
c2L/                                    # repo root
  .claude-plugin/
    plugin.json                         # Plugin manifest
  commands/                             # All 7 command files
    c2l-explore.md
    c2l-plan.md
    c2l-build.md
    c2l-validate.md
    c2l-heal.md
    c2l-deliver.md
    c2l-status.md
  clients/                              # Client engagements root
    .gitignore                          # Exclude samples, include reports
    _templates/                         # Shared templates
      exploration-report.md
      document-inventory.md
      workflow-map.md
      client.yaml
    {client-slug}/                      # Per-client directory (created by c2l-explore)
      client.yaml
      samples/                          # Real client documents (gitignored)
      exploration/
      plan/
      pipeline/
      build/
      validation/
      healing/
      delivery/
  site/                                 # (existing) c2l.dev website
  reach/                                # (existing) outreach system
  .2L/                                  # 2L orchestration metadata
```

## Security Considerations

- **Client documents are NEVER committed to git**: `clients/.gitignore` excludes `*/samples/` and all binary files (PDFs, images, scans)
- **Client contact information**: `client.yaml` contains names, emails, and phone numbers. The c2L repo should remain private on GitHub. If it ever becomes public, client directories must be excluded.
- **No secrets or API keys**: c2L plugin has no external service dependencies, so no secrets management is needed for this iteration

## Performance Targets

Not applicable. c2L commands are markdown prompts read by Claude Code. There is no application to benchmark.
