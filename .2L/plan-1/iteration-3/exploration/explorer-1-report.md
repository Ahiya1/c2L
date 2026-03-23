# Explorer 1 Report: 2L Plugin System Analysis for c2L Replication

## Executive Summary

The 2L system registers as a Claude Code plugin through a `.claude-plugin/plugin.json` manifest and exposes commands (slash commands) and agents (spawnable sub-processes) via symlinked directories under `~/.claude/`. c2L needs a much simpler plugin -- just 5-7 commands and 0-2 agents -- focused on guiding Ahiya through client engagement phases (explore, plan, build, validate, heal, deliver). The official Claude Code plugin format has evolved since 2L was built: the new preferred format uses `skills/<name>/SKILL.md` directories instead of `commands/<name>.md` files, and c2L should adopt the newer format.

## Discoveries

### 1. How 2L Registers as a Claude Code Plugin

2L uses TWO mechanisms that work together:

**A. Plugin Manifest (`.claude-plugin/plugin.json`):**
Located at `/home/ahiya/Ahiya/2L/.claude-plugin/plugin.json`, this is a minimal JSON file:

```json
{
  "name": "2l",
  "version": "1.0.0",
  "description": "2L Development Framework - Iterative orchestration...",
  "author": { "name": "Ahiya" },
  "keywords": ["orchestration", "development", ...],
  "repository": "https://github.com/ahiya/2L"
}
```

There is also a `marketplace.json` in the same directory for marketplace registration, but this is not required for local-only plugins.

**B. Symlinks from `~/.claude/` to 2L source directories:**

This is the actual mechanism that makes commands and agents available globally in Claude Code:

```
~/.claude/commands -> /home/ahiya/Ahiya/2L/commands    (31 command .md files)
~/.claude/agents   -> /home/ahiya/Ahiya/2L/agents      (12 agent .md files)
~/.claude/lib      -> /home/ahiya/Ahiya/2L/lib          (utility scripts)
```

The symlinks mean that every Claude Code session in any directory has access to all 2L commands (as `/2l-*` slash commands) and agents (spawnable via the Task tool).

**Key insight:** The plugin.json alone does NOT register commands. The symlinks do. The plugin.json is metadata only.

### 2. The Newer Official Plugin Format

The official Anthropic `example-plugin` (from `claude-plugins-official`) reveals a newer, cleaner format:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json           # Plugin metadata (name, description, author)
├── .mcp.json                 # Optional: MCP server configuration
├── skills/                   # PREFERRED: New format
│   ├── command-name/
│   │   └── SKILL.md          # User-invoked (slash command) OR model-invoked
│   └── skill-name/
│       └── SKILL.md          # Model-invoked (contextual activation)
├── commands/                 # LEGACY: Old format (still works)
│   └── command-name.md
└── agents/                   # Agent definitions
    └── agent-name.md
```

**Important differences between skills and commands:**

| Aspect | `commands/*.md` (legacy) | `skills/*/SKILL.md` (preferred) |
|--------|-------------------------|--------------------------------|
| Layout | Flat file in commands/ | Directory with SKILL.md inside |
| Invocation | User-invoked (`/command-name`) | User-invoked OR model-invoked |
| Format | Same frontmatter | Same frontmatter |
| Extra files | None | Can have README.md, references/, scripts/ |

**Frontmatter for slash commands (both formats):**

```yaml
---
name: command-name             # (skills format only -- required)
description: Short description shown in /help
argument-hint: <required> [optional]
allowed-tools: [Read, Glob, Grep, Bash]
model: sonnet                  # Optional model override
---
```

**Frontmatter for model-invoked skills:**

```yaml
---
name: skill-name
description: Trigger conditions -- describe WHEN Claude should use this skill
version: 1.0.0
---
```

### 3. Command File Structure and Conventions (2L)

Every 2L command follows this pattern:

```markdown
# Title - Description

Purpose statement.

## Usage

/command-name [args]

## What This Does

[Human-readable explanation of the workflow]

## Requirements / Prerequisites

[What must exist before running]

## Output

[What gets created/produced]

## Next Steps

[What to do after this command completes]

---

## Orchestration Logic

[Detailed step-by-step instructions that Claude follows to execute the command]
```

**Key patterns observed across 2L commands:**

1. **Self-contained instruction documents** -- each .md file IS the prompt. Claude reads it and follows the instructions inside.
2. **State detection via filesystem** -- commands check for existence of files/directories in `.2L/` to determine current state.
3. **Phase chain** -- each command explicitly tells the user what to run next (`/2l-explore` -> `/2l-plan` -> `/2l-build` -> ...).
4. **`$ARGUMENTS`** -- user arguments are available via the `$ARGUMENTS` placeholder.
5. **Agent spawning** -- commands use the Task tool to spawn agents defined in the `agents/` directory.

**Command sizes vary enormously:**
- `/2l-explore`: 1,293 bytes (simple launcher)
- `/2l-vision`: 14,074 bytes (interactive conversation guide)
- `/2l-mvp`: 71,326 bytes (full orchestrator protocol)
- `/2l-prod`: 86,053 bytes (production orchestrator)

### 4. Agent File Structure and Conventions (2L)

Agents have a YAML frontmatter header followed by a system prompt:

```yaml
---
name: 2l-explorer
model: opus
description: Analyzes codebase architecture, patterns, and complexity
tools: Read, Glob, Grep, Bash
---

You are a 2L Explorer agent - ...

# Your Mission
...

# Your Process
...

# Report Structure
...
```

**Agent frontmatter fields:**
- `name` (required): Agent identifier
- `model` (required): Which model to use (opus, sonnet, haiku)
- `description` (required): What this agent does
- `tools` (required): Comma-separated list of allowed tools
- `color` (optional): Terminal color for output

**Agent body is a system prompt** -- it defines the agent's identity, mission, process, and output format. The agent is spawned by a command using the Task tool and operates independently.

**2L has 12 agents:**
- `2l-explorer.md` -- reconnaissance (10.5KB)
- `2l-master-explorer.md` -- strategic exploration (21.3KB)
- `2l-planner.md` -- creates iteration plans (24KB)
- `2l-iplanner.md` -- integration planning (14.3KB)
- `2l-builder.md` -- implements features (25KB)
- `2l-integrator.md` -- merges builder output (16.9KB)
- `2l-ivalidator.md` -- validates integration (23.6KB)
- `2l-validator.md` -- quality gatekeeper (57.3KB)
- `2l-healer.md` -- fixes validation failures (29.9KB)
- `2l-dashboard-builder.md` -- builds monitoring dashboards (6.9KB)
- `2l-evaluator.md` -- evaluates quality (5.4KB)

### 5. How Commands and Agents Interact

The interaction model is straightforward:

1. **User invokes a command** (e.g., `/2l-explore`)
2. **Command reads filesystem state** (checks `.2L/` for current plan, iteration)
3. **Command spawns agents** using the Task tool with specific instructions
4. **Agents execute independently** -- reading files, writing reports, modifying code
5. **Agents write reports** to agreed-upon file paths in `.2L/`
6. **Command reads agent reports** and determines next action (continue, spawn more agents, report to user)

The orchestrator commands (`/2l-mvp`, `/2l-prod`) are the "main loop" -- they chain through all phases, spawning agents as needed.

### 6. 2L vs c2L: What's Different

| Aspect | 2L | c2L |
|--------|-----|------|
| **Purpose** | Build software projects | Guide client engagements (customs doc processing) |
| **Phases** | explore, plan, build, integrate, validate, heal | explore, plan, build, validate, heal, deliver |
| **Agents** | 12 specialized agents | Likely 0-2 (Ahiya IS the operator, not agents) |
| **Parallelism** | Multiple builders/explorers in parallel | Sequential, cooperative (Ahiya + Claude) |
| **Output** | Working software | Engagement artifacts, pipeline code, reports |
| **Scope** | Single project | Multiple client projects, each with own lifecycle |
| **Autonomy** | High (autonomous orchestration) | Lower (cooperative, Ahiya makes decisions) |

### 7. Current c2L Directory State

The c2L repo already has:
- `site/` -- Next.js static site (iteration 1 output)
- `reach/` -- Outreach system (iteration 2 output)
- `.2L/config.yaml` -- 2L-managed config
- `.github/` -- GitHub config
- No plugin files, no commands, no agents yet

## Patterns Identified

### Pattern 1: Filesystem-as-State
**Description:** 2L uses the `.2L/` directory structure to track all state. No database, no external services. Just files on disk.
**Use Case:** Perfect for c2L because client engagements are inherently project-based and local.
**Recommendation:** ADOPT. Use `.c2l/projects/<client-name>/` for per-client state.

### Pattern 2: Command = Prompt Document
**Description:** Each command .md file is a self-contained instruction set. Claude reads it and follows it.
**Use Case:** Every c2L phase needs a guiding document.
**Recommendation:** ADOPT. But use the newer `skills/*/SKILL.md` format instead of `commands/*.md`.

### Pattern 3: Symlink Installation
**Description:** 2L symlinks its directories into `~/.claude/` to make commands globally available.
**Use Case:** c2L commands need to be available when working inside client project directories.
**Recommendation:** PARTIALLY ADOPT. c2L needs its own registration mechanism. Since 2L already owns `~/.claude/commands`, c2L cannot symlink to the same path. Instead, c2L should register as a proper Claude Code plugin using the `.claude-plugin/` manifest at the c2L repo root. When Ahiya works in the c2L repo directory, the plugin commands will be available. Alternatively, c2L could use project-level `.claude/commands/` directories.

### Pattern 4: Agent Spawning for Parallelism
**Description:** 2L spawns multiple agents (builders, explorers) in parallel via the Task tool.
**Use Case:** c2L engagement phases are sequential and cooperative, not parallel.
**Recommendation:** SKIP (mostly). c2L should use direct instruction (command = the session becomes the guide) rather than agent spawning. Agents may be useful later for document processing pipeline building, but not for the engagement workflow itself.

### Pattern 5: Phase Chain
**Description:** Each command tells the user what to run next.
**Use Case:** c2L phases (explore -> plan -> build -> validate -> heal -> deliver) form a natural chain.
**Recommendation:** ADOPT. Each c2L command should end with "Next: run `/c2l-<next-phase>`".

### Pattern 6: Mega-Orchestrator
**Description:** `/2l-mvp` and `/2l-prod` are massive (71KB, 86KB) single-file orchestrators that control the entire flow.
**Use Case:** c2L does NOT need this level of autonomous orchestration.
**Recommendation:** SKIP. c2L phases are human-triggered, one at a time. No need for a mega-orchestrator.

## Complexity Assessment

### Low Complexity Areas
- **Plugin manifest** (`.claude-plugin/plugin.json`): 5-line JSON file. Trivial.
- **Status command** (`c2l-status`): Read filesystem, display current state. Straightforward.
- **Explore command** (`c2l-explore`): Guided conversation producing a structured report. Moderate template but simple execution.

### Medium Complexity Areas
- **Per-client project structure**: Need to design how multiple client engagements are tracked and isolated. Not technically hard but important to get right.
- **Build command** (`c2l-build`): Cooperative pipeline building. The command guides Ahiya and Claude through building a document processing pipeline. More complex because it involves real code generation.
- **Validate command** (`c2l-validate`): Run pipeline on real data and measure accuracy. Needs to handle various document types and output formats.

### High Complexity Areas
- **None in the plugin structure itself**. The complexity in c2L is in the actual document processing pipelines built per-client, not in the engagement tooling.

## Technology Recommendations

### Plugin Format
- **Format:** `skills/<name>/SKILL.md` (new preferred format, NOT `commands/*.md`)
- **Rationale:** The official Anthropic example-plugin demonstrates this as the preferred approach. Each skill can have supporting files (templates, references) in its directory. This is better for c2L because explore/build/validate phases need reference materials alongside the command definition.

### Plugin Registration
- **Method:** `.claude-plugin/plugin.json` at the c2L repo root
- **Rationale:** When Ahiya runs `claude` from the c2L repo directory, commands are automatically available. No symlink management needed.

### State Storage
- **Method:** `.c2l/` directory in the c2L repo root (or within each client project directory)
- **Rationale:** Follows 2L pattern. Filesystem-as-state is perfect for this use case.

## Integration Points

### c2L Plugin <-> c2L Repo
The plugin lives IN the c2L repo. Commands and agents are part of the repo itself.

### c2L Plugin <-> Client Projects
Client projects may be subdirectories of c2L (`projects/<client>/`) or separate repos. The plugin needs to support both modes.

### c2L Plugin <-> 2L System
No integration needed. c2L is independent. It may reference 2L patterns for inspiration but does not depend on 2L at runtime.

## Risks & Challenges

### Risk 1: Plugin Discovery Scope
Claude Code discovers plugins from the project root's `.claude-plugin/` directory. If Ahiya is working inside a client project subdirectory, the c2L plugin commands might not be available.

**Mitigation:** Keep client work within the c2L repo tree, or have each client project install c2L as a plugin dependency.

### Risk 2: Command Naming Collision
2L already owns the `/2l-*` namespace. c2L must use `/c2l-*` to avoid conflicts.

**Mitigation:** Prefix all c2L commands with `c2l-`.

### Risk 3: Over-Engineering the Plugin
c2L's first need is simple: guided conversations for explore/plan phases. There is a risk of building too much infrastructure (agents, orchestrators, event logging) before it is needed.

**Mitigation:** Build the minimal set first. Add complexity only when real client engagements demand it.

## Recommendations for Planner

### 1. Use the Skills Format, Not Commands

Build c2L using the `skills/<name>/SKILL.md` directory layout. This is the current official Anthropic recommendation and allows each phase to have supporting files (templates, checklists) alongside the command definition.

### 2. Build Only 6 Phase Commands + 1 Status Command

**Phase commands (user-invoked slash commands):**
- `/c2l-explore` -- Structured client workflow discovery
- `/c2l-plan` -- Solution design based on exploration findings
- `/c2l-build` -- Cooperative pipeline implementation
- `/c2l-validate` -- Test on real data, measure accuracy
- `/c2l-heal` -- Fix validation failures
- `/c2l-deliver` -- Handoff and responsibility transfer

**Utility commands:**
- `/c2l-status` -- Show current engagement state

**Total: 7 commands, 0 agents initially.**

Ahiya + Claude work cooperatively within each phase. No need for autonomous agent spawning.

### 3. Design the Per-Client Project Structure

```
c2L/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── c2l-explore/
│   │   ├── SKILL.md
│   │   └── templates/
│   │       └── exploration-report.md
│   ├── c2l-plan/
│   │   └── SKILL.md
│   ├── c2l-build/
│   │   └── SKILL.md
│   ├── c2l-validate/
│   │   └── SKILL.md
│   ├── c2l-heal/
│   │   └── SKILL.md
│   ├── c2l-deliver/
│   │   └── SKILL.md
│   └── c2l-status/
│       └── SKILL.md
├── projects/
│   └── <client-name>/
│       ├── .c2l/
│       │   ├── config.yaml          # Engagement state
│       │   ├── exploration/
│       │   │   └── report.md
│       │   ├── plan/
│       │   │   └── solution-plan.md
│       │   ├── validation/
│       │   │   └── results.md
│       │   └── delivery/
│       │       └── handoff.md
│       ├── documents/               # Sample client documents
│       ├── pipeline/                # The actual processing code
│       └── output/                  # Pipeline output samples
├── site/                            # (existing) c2l.dev
└── reach/                           # (existing) outreach system
```

### 4. Start with c2l-explore and c2l-status Only

For iteration 3, build only the two commands that are immediately needed:
- `/c2l-explore` (the first thing that happens with a new client)
- `/c2l-status` (know where you are)

Add the remaining phase commands in later iterations as real client engagements demand them.

### 5. Skip These 2L Patterns for c2L

| 2L Pattern | Why Skip |
|------------|----------|
| Mega-orchestrator (`/2l-mvp`, `/2l-prod`) | c2L phases are human-triggered, not autonomous |
| Parallel agent spawning | c2L is cooperative, not parallel |
| Event logging / dashboard | Overkill for 1 operator (Ahiya) |
| Builder/integrator split | c2L builds pipeline code directly, no multi-builder merging |
| Marketplace.json | c2L is private, not a marketplace plugin |
| Symlink installation | Use native plugin discovery instead |
| Complex config.yaml | Simple per-client config is sufficient |

### 6. Adopt These 2L Patterns for c2L

| 2L Pattern | Why Adopt |
|------------|-----------|
| Filesystem-as-state (`.c2l/`) | Simple, reliable, no infrastructure |
| Command = prompt document | Proven pattern, Claude follows .md instructions |
| Phase chain (explicit "next step") | Guides Ahiya through the engagement |
| Structured report templates | Exploration reports, validation results |
| `$ARGUMENTS` for user input | Standard Claude Code mechanism |
| Allowed-tools frontmatter | Reduce permission prompts |
| Skills directory format | Official current best practice |

## Resource Map

### Critical Reference Files (2L System)
- `/home/ahiya/Ahiya/2L/.claude-plugin/plugin.json` -- Plugin manifest format
- `/home/ahiya/Ahiya/2L/commands/2l-explore.md` -- Explore command pattern (simple)
- `/home/ahiya/Ahiya/2L/commands/2l-vision.md` -- Interactive conversation command pattern
- `/home/ahiya/Ahiya/2L/commands/2l-status.md` -- Status command pattern with filesystem checks
- `/home/ahiya/Ahiya/2L/agents/2l-explorer.md` -- Agent frontmatter and structure

### Critical Reference Files (Official Plugins)
- `/home/ahiya/.claude/plugins/marketplaces/claude-plugins-official/plugins/example-plugin/` -- Canonical plugin structure
- `/home/ahiya/.claude/plugins/marketplaces/claude-plugins-official/plugins/feature-dev/` -- Plugin with agents + commands

### c2L Existing Files
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/.2L/config.yaml` -- Current config
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/.2L/plan-1/vision.md` -- c2L vision document
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/.2L/plan-1/master-plan.yaml` -- Iteration 3 scope

## Questions for Planner

1. **Should c2L commands be available globally or only within the c2L repo?** Global availability (via symlinks or user-level plugin install) would let Ahiya use `/c2l-explore` from any directory. Repo-scoped availability (via `.claude-plugin/`) limits it to the c2L repo tree. The former is more flexible; the latter is simpler.

2. **Should each client project be a subdirectory of c2L or a separate repo?** Subdirectory is simpler to start. Separate repos are cleaner for client isolation and potential handoff.

3. **How many commands to build in iteration 3?** The scope says "phase commands and agents for structured client engagement" -- but the recommendation is to start with just explore + status and add others incrementally. The planner should decide the scope.

4. **Should c2l-build create actual document processing pipeline code?** Or should it be a guide/template that Ahiya fills in cooperatively? The former is more valuable but much more complex.
