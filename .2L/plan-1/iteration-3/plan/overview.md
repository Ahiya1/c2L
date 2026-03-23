# 2L Iteration Plan - c2L Workflow (Iteration 3)

## Project Vision

Build the c2L Claude Code plugin -- cooperative human-AI engagement tooling that guides Ahiya through structured client engagements for document processing solutions. This iteration builds the command infrastructure, templates, and per-client project structure. It does NOT build actual document processing pipelines; those are built per-client during real engagements.

The core insight: c2L commands are **session starters**, not pipeline runners. Each command checks where things stand, presents current state, and helps Ahiya continue from where he left off. Phases span days or weeks, not minutes.

## Success Criteria

Specific, measurable criteria for iteration completion:

- [ ] Plugin manifest exists at `.claude-plugin/plugin.json` and Claude Code recognizes c2L commands when run from the repo root
- [ ] All 7 commands exist as markdown files in `commands/`: c2l-explore, c2l-plan, c2l-build, c2l-validate, c2l-heal, c2l-deliver, c2l-status
- [ ] Running `/c2l-explore new` creates a client directory under `clients/` with proper structure and initialized `client.yaml`
- [ ] Running `/c2l-explore {slug}` resumes an existing exploration session with state detection
- [ ] Running `/c2l-status` reads all `clients/*/client.yaml` files and displays engagement overview
- [ ] Exploration report template in `clients/_templates/exploration-report.md` is professional and client-shareable
- [ ] `client.yaml` template captures all required metadata (client info, engagement phase, volumes, pipeline config)
- [ ] `clients/.gitignore` properly excludes sample documents while versioning reports and configs
- [ ] All command files have correct frontmatter (description, argument-hint, allowed-tools)
- [ ] Phase gating works: c2l-plan refuses to start if exploration is not complete
- [ ] Tests validate command frontmatter structure, template completeness, and client.yaml schema

## MVP Scope

**In Scope:**
- Plugin manifest (`.claude-plugin/plugin.json`)
- 7 command markdown files in `commands/`
- Per-client directory structure under `clients/`
- Template files in `clients/_templates/` (exploration-report, document-inventory, workflow-map, client.yaml)
- `clients/.gitignore` for excluding sensitive documents
- `client.yaml` schema and state management design
- Phase gating logic in each command (check prerequisites before starting)
- Session resumption logic (detect current state, present progress)
- Phase completion protocol (validate artifacts, update client.yaml)
- Validation tests for command structure, templates, and schemas

**Out of Scope (Post-MVP / Per-Client):**
- Actual document processing pipeline code (built during real c2l-build engagements)
- Pipeline runtime dependencies (pdf-parse, sharp, OCR libraries)
- Autonomous orchestration (no mega-orchestrator command)
- Agent definitions (cooperative workflow, no agent spawning)
- Automated reach-to-c2l integration (manual cross-reference via slug)
- Solution design template (c2l-plan phase -- deferred until first real planning engagement)
- Validation metrics engine (c2l-validate phase -- deferred until first real validation)

## Development Phases

1. **Exploration** -- Complete
2. **Planning** -- Current
3. **Building** -- Estimated 3-4 hours (2 parallel builders)
4. **Integration** -- Estimated 20 minutes
5. **Validation** -- Estimated 20 minutes

## Timeline Estimate

- Exploration: Complete
- Planning: Complete
- Building: ~3 hours (2 parallel builders)
- Integration: ~20 minutes
- Validation: ~20 minutes
- Total: ~4 hours

## Risk Assessment

### High Risks
None. This iteration builds markdown files and directory structure. No runtime dependencies, no external services, no databases.

### Medium Risks
- **Plugin discovery scope**: Claude Code discovers plugins from the project root `.claude-plugin/`. If Ahiya works inside a `clients/{slug}/` subdirectory, commands may not be available. **Mitigation**: Document that Ahiya should always run commands from the c2L repo root. Commands accept client slug as an argument to target specific clients.
- **Command size calibration**: Commands need to be detailed enough to guide Ahiya effectively but not so long they overwhelm context. **Mitigation**: Keep each command focused on its phase. Use templates for structured output rather than embedding full templates in the command body. Reference template paths.

### Low Risks
- **Naming collision with 2L**: All c2L commands use the `c2l-` prefix, which is distinct from 2L's `2l-` prefix. No conflict expected.
- **Over-engineering**: Risk of building too much infrastructure before real client engagements reveal what is actually needed. **Mitigation**: Build the minimal viable command set. Each command should be a cooperative session guide, not an autonomous pipeline.

## Integration Strategy

Two builders work in parallel:
- **Builder 1** creates the infrastructure: plugin manifest, directory structure, templates, client.yaml schema, gitignore, and tests
- **Builder 2** creates all 7 command files with proper frontmatter, state detection logic, phase gating, and session resumption

Integration is straightforward because:
- Builder 1 produces files in `.claude-plugin/`, `clients/_templates/`, and `clients/`
- Builder 2 produces files in `commands/`
- No shared source files between builders
- Commands reference template paths that Builder 1 creates, but this is by convention (documented in patterns.md), not by code import

The integrator verifies that:
1. Command file paths to templates match actual template locations
2. `client.yaml` fields referenced in commands match the template schema
3. Phase gating checks reference the correct artifact paths
4. All frontmatter is syntactically valid

## Deployment Plan

No deployment needed. The c2L plugin is used locally within Claude Code. Once files are committed to the c2L repo, the plugin is available when Ahiya runs `claude` from the repo root.

Post-build verification:
1. Run `claude` from the c2L repo root
2. Type `/c2l-status` to verify command registration
3. Type `/c2l-explore new` to verify client project initialization
4. Inspect the created directory structure and client.yaml
