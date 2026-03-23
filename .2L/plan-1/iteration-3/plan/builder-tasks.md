# Builder Task Breakdown

## Overview

2 primary builders work in parallel. Neither is expected to need splitting -- the deliverables are markdown and YAML files with no runtime dependencies.

## Builder Assignment Strategy

- **Builder 1 (Infrastructure):** Plugin manifest, directory structure, templates, gitignore, and tests
- **Builder 2 (Commands):** All 7 command markdown files

Builders work on completely separate file trees:
- Builder 1 writes to: `.claude-plugin/`, `clients/`, `__tests__/`
- Builder 2 writes to: `commands/`

No shared files. No merge conflicts. Integration verifies cross-references (command paths to templates match actual locations).

---

## Builder-1: Infrastructure & Templates

### Scope

Create the c2L plugin foundation: the plugin manifest that registers c2L with Claude Code, the per-client directory structure under `clients/`, all template files that define the structure of client deliverables, the gitignore that protects sensitive documents, and the validation test suite.

### Complexity Estimate

**MEDIUM**

Multiple files to create, but each is straightforward. The exploration report template requires care to ensure it is professional and comprehensive. The test scripts require attention to edge cases.

### Success Criteria

- [ ] `.claude-plugin/plugin.json` exists and is valid JSON with `"name": "c2l"`
- [ ] `clients/` directory exists
- [ ] `clients/_templates/` directory exists with 4 template files
- [ ] `clients/_templates/exploration-report.md` contains all 7 required sections (Executive Summary through Cost-Benefit) with table structures and placeholders
- [ ] `clients/_templates/document-inventory.md` contains Core Documents, Conditional Documents, and Document Relationships sections
- [ ] `clients/_templates/workflow-map.md` contains Step-by-Step Process, Decision Points, and Handoff Points sections
- [ ] `clients/_templates/client.yaml` contains all required top-level keys (client, engagement, volumes, pipeline, notes) with correct field structure
- [ ] `clients/.gitignore` excludes `*/samples/` and binary file extensions while including `*.md`, `*.yaml`, and `_templates/`
- [ ] `__tests__/validate-commands.sh` validates command frontmatter and required sections
- [ ] `__tests__/validate-templates.sh` validates template completeness
- [ ] `__tests__/validate-client-yaml.sh` validates client.yaml schema
- [ ] `__tests__/validate-structure.sh` validates overall directory structure
- [ ] `__tests__/run-all.sh` runs all validation tests and reports summary

### Files to Create

- `.claude-plugin/plugin.json` -- Plugin manifest (see Plugin Manifest Pattern in patterns.md)
- `clients/.gitignore` -- Protect sensitive documents (see .gitignore Pattern in patterns.md)
- `clients/_templates/exploration-report.md` -- Exploration report template (see Exploration Report Template Pattern in patterns.md)
- `clients/_templates/document-inventory.md` -- Document inventory template (see Document Inventory Template Pattern in patterns.md)
- `clients/_templates/workflow-map.md` -- Workflow mapping template (see Workflow Map Template Pattern in patterns.md)
- `clients/_templates/client.yaml` -- Client configuration template (see client.yaml Schema Pattern in patterns.md)
- `__tests__/validate-commands.sh` -- Command file validation
- `__tests__/validate-templates.sh` -- Template file validation
- `__tests__/validate-client-yaml.sh` -- client.yaml schema validation
- `__tests__/validate-structure.sh` -- Directory structure validation
- `__tests__/run-all.sh` -- Full test suite runner

### Dependencies

**Depends on:** Nothing. Builder 1 has no dependencies.
**Blocks:** Nothing directly. Builder 2 writes commands that reference template paths, but both builders work from the same patterns.md specification.

### Implementation Notes

1. **plugin.json is minimal.** It contains name, version, description, author, keywords. No command listings -- Claude Code discovers commands from the `commands/` directory automatically.

2. **The exploration report template is the highest-value deliverable.** It is the first thing a paying client sees. Invest time making it professional:
   - Every section has explicit table structures with column headers
   - Hebrew names included in document inventory tables (target market is Israeli)
   - Cost-benefit section must be thorough -- it justifies the engagement investment
   - Appendix includes a glossary for Hebrew-English terminology
   - Use `{PLACEHOLDER}` syntax for values Ahiya fills in

3. **client.yaml must have comments explaining each field.** Since Ahiya (and future Claude sessions) will read this file directly, inline comments explaining valid values and when each field gets populated are essential.

4. **The gitignore needs both inclusion and exclusion rules.** It must exclude `*/samples/` and binary extensions, but explicitly include `_templates/`, `*.md`, `*.yaml`, and `*.yml` using negation patterns (`!`).

5. **Test scripts must be executable.** Add `#!/bin/bash` shebang and ensure they work with basic bash (no bashisms that break on other shells). Tests should exit with code 0 on success, 1 on failure.

6. **Test scripts validate the output of BOTH builders.** validate-commands.sh checks files that Builder 2 creates. This is intentional -- it lets the integrator run the full test suite to verify both builders' work.

### Patterns to Follow

Reference patterns from `patterns.md`:
- Use **Plugin Manifest Pattern** for plugin.json
- Use **client.yaml Schema Pattern** for the client.yaml template
- Use **Exploration Report Template Pattern** for the exploration report
- Use **Document Inventory Template Pattern** for the document inventory
- Use **Workflow Map Template Pattern** for the workflow map
- Use **.gitignore Pattern for Clients Directory** for the gitignore
- Use **Testing Patterns** section for all test scripts

### Testing Requirements

- All test scripts must pass when run from the c2L repo root
- `__tests__/run-all.sh` must report a summary with pass/fail counts
- Each test script independently returns exit code 0 (pass) or 1 (fail)
- Tests should work without external dependencies (no npm packages, no complex tools)
- Python3 is used only for JSON/YAML parsing where bash is insufficient, with graceful fallback

---

## Builder-2: Commands

### Scope

Create all 7 command markdown files that define the c2L engagement workflow. Each command is a self-contained instruction document that Claude reads and follows when Ahiya invokes the corresponding slash command.

### Complexity Estimate

**MEDIUM**

7 command files, each following the same structural pattern. The main complexity is in the phase-specific orchestration logic for each command: what state to check, what questions to ask, what guidance to provide, and how to track completion.

### Success Criteria

- [ ] `commands/c2l-explore.md` exists with correct frontmatter and handles both `new` (creates client) and `{slug}` (resumes exploration)
- [ ] `commands/c2l-plan.md` exists with phase gating (requires explore complete) and guides solution design
- [ ] `commands/c2l-build.md` exists with phase gating (requires plan complete) and guides cooperative pipeline implementation
- [ ] `commands/c2l-validate.md` exists with phase gating (requires build complete) and guides accuracy testing
- [ ] `commands/c2l-heal.md` exists with phase gating (requires validate with failures) and guides issue resolution
- [ ] `commands/c2l-deliver.md` exists with phase gating (requires validate pass or heal pass) and guides handoff
- [ ] `commands/c2l-status.md` exists and handles both no-argument (all clients) and `{slug}` (single client) modes
- [ ] Every command has valid YAML frontmatter with `description`, `argument-hint`, and `allowed-tools`
- [ ] Every phase command includes: Usage, What This Does, Prerequisites, Outputs, Phase Completion Criteria, Next Step, Orchestration Logic sections
- [ ] c2l-explore handles new client initialization (creates directory structure, copies templates, initializes client.yaml)
- [ ] Phase gating logic references correct prerequisite artifacts (as specified in Phase Gating Pattern)
- [ ] Session resumption logic detects current progress and presents it to Ahiya
- [ ] Phase completion protocol validates artifacts and updates client.yaml

### Files to Create

- `commands/c2l-explore.md` -- Structured client workflow discovery
- `commands/c2l-plan.md` -- Solution design based on exploration findings
- `commands/c2l-build.md` -- Cooperative pipeline implementation
- `commands/c2l-validate.md` -- Test on real data, measure accuracy
- `commands/c2l-heal.md` -- Fix validation failures
- `commands/c2l-deliver.md` -- Handoff and responsibility transfer
- `commands/c2l-status.md` -- Engagement status overview

### Dependencies

**Depends on:** Nothing. Builder 2 has no dependencies.
**Blocks:** Nothing directly. Commands reference template paths that Builder 1 creates, but both builders work from the same specification.

### Implementation Notes

1. **Commands are session starters, not pipeline runners.** This is the most important design principle. Each command should:
   - Detect current state by reading the filesystem
   - Present what has been done and what remains
   - Guide Ahiya through the next steps interactively
   - Update state on completion
   - NEVER try to run autonomously like 2L's `/2l-build`

2. **c2l-explore is the most important command.** It is the first command that runs for every client engagement. It must handle:
   - `new` argument: Create client directory, copy templates, initialize client.yaml, start discovery conversation
   - `{slug}` argument: Resume existing exploration session with progress display
   - No argument: List available clients and prompt for selection

3. **c2l-explore new flow in detail:**
   - Ask for company name (English and Hebrew)
   - Generate slug, confirm with Ahiya
   - Create `clients/{slug}/` directory structure (all phase subdirectories)
   - Copy templates from `clients/_templates/` into the client's exploration directory
   - Initialize `client.yaml` with basic info from the conversation
   - Ask for contact person details
   - Begin structured discovery: document types, systems, workflow, pain points, volumes
   - Guide Ahiya through filling in the exploration report progressively

4. **c2l-status should be the simplest command.** It reads all `clients/*/client.yaml` files and presents a dashboard view. No phase work, no state modification. Just reporting. Handle two modes:
   - No argument: Overview of all clients (name, slug, current phase, when started)
   - `{slug}` argument: Detailed view of one client (all fields from client.yaml)

5. **Phase gating must be strict.** If prerequisites are not met, the command should clearly explain what is missing and what to do about it. Never skip prerequisites.

6. **Each command should reference the exploration report as context.** When running plan, build, validate, heal, or deliver, the command should read the exploration report to understand the client's context. This grounds every phase in the client's real situation.

7. **c2l-build should create directory structure but not pipeline code.** The command guides Ahiya through cooperative pipeline building. It creates `pipeline/` subdirectories (ingest, interpret, validate, output) and `build/build-log.md`, but the actual pipeline code is written cooperatively during real engagements. The command provides guidance on what to build, not the code itself.

8. **c2l-heal should track iteration count.** Create `healing/healing-{N}/` directories for each healing iteration. After 3 iterations without meeting accuracy targets, recommend scope adjustment with the client.

9. **c2l-deliver handles the final handoff.** Creates delivery artifacts (deployment guide, user guide, operations guide, handoff checklist) from templates or by generating from build/validation artifacts. Marks the engagement as complete.

10. **Keep commands focused.** Target 100-200 lines per command. The orchestration logic should be clear and sequential. If a command is getting long, it means it is trying to do too much.

11. **Use `$ARGUMENTS` for user input.** This is the standard Claude Code mechanism for passing arguments to commands. The variable contains everything the user typed after the command name.

### Patterns to Follow

Reference patterns from `patterns.md`:
- Use **Command File Pattern** for overall structure of every command
- Use **Command Frontmatter** pattern for YAML frontmatter
- Use **Phase Gating Pattern** for prerequisite validation
- Use **Phase Completion Pattern** for marking phases done
- Use **Session Resumption Pattern** for detecting and presenting progress
- Use **Client Slug Generation Pattern** for new client initialization
- Use **Status Command Pattern** for c2l-status
- Use **Error Handling Patterns** for argument and phase mismatch errors

### Testing Requirements

- Tests for commands are provided by Builder 1's `__tests__/validate-commands.sh`
- Each command must pass frontmatter validation (description, allowed-tools fields present)
- Each phase command must have Usage, Prerequisites, and Orchestration Logic sections
- Each command must be at least 50 lines (ensures non-trivial content)

### Command-Specific Guidance

#### c2l-explore.md (~150-200 lines)

Frontmatter:
```yaml
---
description: Structured discovery of a client's document workflow
argument-hint: <client-slug> or "new"
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---
```

Key sections in orchestration logic:
- Argument parsing (new vs existing slug vs empty)
- New client initialization (create dirs, copy templates, init client.yaml)
- Session resumption (check which exploration artifacts exist)
- Discovery guidance (what to ask about: documents, systems, workflow, pain points, volumes)
- Exploration report generation guidance
- Phase completion validation (all artifacts present, volumes captured)

#### c2l-plan.md (~120-150 lines)

Frontmatter:
```yaml
---
description: Design the solution based on exploration findings
argument-hint: <client-slug>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---
```

Key sections:
- Phase gating (explore must be complete)
- Read and summarize exploration report
- Guide solution design: pipeline architecture, field extraction targets, accuracy requirements, failure modes, output format, scope boundaries
- Create plan/solution-design.md, plan/accuracy-targets.md, plan/scope.md
- Phase completion validation

#### c2l-build.md (~120-150 lines)

Frontmatter:
```yaml
---
description: Cooperative pipeline implementation for client workflow
argument-hint: <client-slug>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---
```

Key sections:
- Phase gating (plan must be complete)
- Read solution design and field specs
- Create pipeline directory structure
- Guide cooperative building: ingest, interpret, validate, output modules
- Track progress in build/build-log.md
- Phase completion validation

#### c2l-validate.md (~120-150 lines)

Frontmatter:
```yaml
---
description: Test pipeline on real data and measure accuracy
argument-hint: <client-slug>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---
```

Key sections:
- Phase gating (build must be complete, pipeline code exists)
- Read accuracy targets from plan
- Guide validation: run pipeline, compare output to ground truth, measure accuracy
- Produce validation report with pass/fail verdict
- Create validation/failure-analysis.md if accuracy below targets
- Phase completion (transition to heal if failing, deliver if passing)

#### c2l-heal.md (~100-130 lines)

Frontmatter:
```yaml
---
description: Fix validation failures and improve pipeline accuracy
argument-hint: <client-slug>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---
```

Key sections:
- Phase gating (validate must have failures)
- Read failure analysis and current metrics
- Guide healing: prioritize failures, fix pipeline, re-test, measure improvement
- Track healing iteration (healing-1, healing-2, etc.)
- Max 3 iterations before recommending scope adjustment
- Phase completion (transition to deliver when targets met)

#### c2l-deliver.md (~100-130 lines)

Frontmatter:
```yaml
---
description: Deploy working system and hand off to client
argument-hint: <client-slug>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---
```

Key sections:
- Phase gating (validate pass or heal pass)
- Guide delivery: package pipeline, create documentation, deploy, train, monitor
- Generate delivery artifacts (guides, checklist)
- Mark engagement as complete in client.yaml
- No "Next Step" section (this is the final phase)

#### c2l-status.md (~80-100 lines)

Frontmatter:
```yaml
---
description: Show client engagement status overview
argument-hint: [client-slug]
allowed-tools: [Read, Glob, Grep, Bash]
---
```

Key sections:
- No argument: scan all `clients/*/client.yaml` files, present overview
- With argument: show detailed status for one client
- Display format: clean, aligned, human-readable
- Show next step suggestions

---

## Builder Execution Order

### Parallel Group 1 (No dependencies)

- **Builder-1: Infrastructure & Templates**
- **Builder-2: Commands**

Both builders start immediately and work in parallel. They produce files in separate directory trees with no overlap.

### Integration Notes

**How builder outputs come together:**
- Builder 1 creates the plugin registration (`.claude-plugin/plugin.json`) that makes the plugin discoverable
- Builder 1 creates the directory structure (`clients/`, `clients/_templates/`) that commands reference
- Builder 2 creates the commands (`commands/`) that use the templates and directories
- The integrator runs Builder 1's test suite to verify everything works together

**Potential conflict areas:**
- None. Builders write to completely separate directory trees.

**Cross-reference verification needed:**
- Command files reference template paths (e.g., `clients/_templates/exploration-report.md`). The integrator must verify these paths match actual template locations created by Builder 1.
- Command files reference client.yaml field names (e.g., `engagement.current_phase`). The integrator must verify these match the actual schema in Builder 1's client.yaml template.
- Command files reference artifact paths for phase gating (e.g., `exploration/exploration-report.md`). The integrator must verify these match the directory structure.

**Shared files that need coordination:**
- None. No shared files between builders.
