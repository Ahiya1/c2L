# Code Patterns & Conventions

## File Structure

```
c2L/
  .claude-plugin/
    plugin.json                         # Plugin metadata
  commands/                             # Slash commands (markdown prompts)
    c2l-explore.md
    c2l-plan.md
    c2l-build.md
    c2l-validate.md
    c2l-heal.md
    c2l-deliver.md
    c2l-status.md
  clients/                              # All client engagements
    .gitignore                          # Exclude samples, include reports
    _templates/                         # Shared templates (underscore = meta)
      exploration-report.md
      document-inventory.md
      workflow-map.md
      client.yaml
    {client-slug}/                      # One per client (created by c2l-explore)
      client.yaml
      samples/
        {document-type}/                # e.g., bill-of-lading/
      exploration/
        exploration-report.md
        document-inventory.md
        workflow-map.md
      plan/
        solution-design.md
        field-specs/
        accuracy-targets.md
        scope.md
      pipeline/
        ingest/
        interpret/
        validate/
        output/
      build/
        build-log.md
        sample-results/
      validation/
        validation-report.md
        results/
        failure-analysis.md
        metrics.yaml
      healing/
        healing-1/
          healing-report.md
          metrics.yaml
      delivery/
        deployment-guide.md
        user-guide.md
        operations-guide.md
        handoff-checklist.md
  site/                                 # Existing: c2l.dev
  reach/                                # Existing: outreach system
```

## Naming Conventions

- Command files: `c2l-{phase}.md` (kebab-case with c2l prefix)
- Template files: `{name}.md` (kebab-case)
- Client directories: `{client-slug}/` (kebab-case, derived from company name)
- YAML config files: `{name}.yaml` (kebab-case)
- Phase directories: lowercase single word (`exploration/`, `plan/`, `pipeline/`, etc.)
- Document type directories in samples: kebab-case (`bill-of-lading/`, `commercial-invoice/`)

## Plugin Manifest Pattern

**File:** `.claude-plugin/plugin.json`

```json
{
  "name": "c2l",
  "version": "1.0.0",
  "description": "c2L - Cooperative client engagement tooling for document processing solutions",
  "author": {
    "name": "Ahiya"
  },
  "keywords": [
    "engagement",
    "workflow",
    "customs",
    "document-processing",
    "cooperative"
  ]
}
```

**Key points:**
- Minimal metadata. Commands are discovered from `commands/` directory, not listed in manifest.
- No `marketplace.json` -- c2L is private.
- Version starts at 1.0.0. Increment on significant changes.

## Command File Pattern

**When to use:** Every c2l command file follows this exact structure.

### Command Frontmatter

```yaml
---
description: Short description shown in /help listing
argument-hint: <client-slug> or "new"
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---
```

**Key points:**
- `description` is required. Keep it under 80 characters.
- `argument-hint` shows the user what to type. Use `<required>` and `[optional]` notation.
- `allowed-tools` should always include Read, Write, Edit, Glob, Grep, Bash for c2L commands (they all need filesystem access).

### Command Body Structure

Every phase command (explore, plan, build, validate, heal, deliver) follows this structure:

```markdown
---
description: {Phase name} - {one-line purpose}
argument-hint: <client-slug> or "new"
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# c2L {Phase Name} - {Purpose}

{One paragraph: what this phase does and why it matters.}

## Usage

```
/c2l-{phase} <client-slug>
/c2l-{phase} new
```

## What This Does

{2-3 sentences describing the cooperative workflow this command facilitates.}

## Prerequisites

{What must exist before this phase can start. Reference specific files/artifacts.}

## Outputs

{What this phase produces. List specific file paths relative to client directory.}

## Phase Completion Criteria

{Checkable criteria. What must be true for this phase to be marked complete.}

## Next Step

After this phase, run:
```
/c2l-{next-phase} <client-slug>
```

---

## Orchestration Logic

### Step 1: Parse Arguments

The user provides `$ARGUMENTS` which is either:
- A client slug (e.g., `abc-customs`) to resume work on an existing client
- The word `new` to start a new client engagement

If no arguments provided, list all clients and ask which one to work on.

### Step 2: Locate or Create Client Directory

**For existing client:**
```bash
CLIENT_DIR="clients/$ARGUMENTS"
if [ ! -d "$CLIENT_DIR" ]; then
  echo "Client directory not found: $CLIENT_DIR"
  echo "Available clients:"
  ls clients/ | grep -v "^_" | grep -v "^\."
  exit 1
fi
```

**For new client:**
```bash
# Ask for client name
# Generate slug from name (lowercase, hyphens, no special chars)
# Create directory structure
mkdir -p "clients/$SLUG"/{samples,exploration,plan,pipeline,build,validation,healing,delivery}
# Copy templates
cp clients/_templates/client.yaml "clients/$SLUG/client.yaml"
cp clients/_templates/exploration-report.md "clients/$SLUG/exploration/exploration-report.md"
cp clients/_templates/document-inventory.md "clients/$SLUG/exploration/document-inventory.md"
cp clients/_templates/workflow-map.md "clients/$SLUG/exploration/workflow-map.md"
```

### Step 3: Read Current State

```bash
# Read client.yaml to determine current phase
cat "clients/$SLUG/client.yaml"
```

Check `engagement.current_phase` to determine where things stand.

### Step 4: Validate Prerequisites

{Phase-specific prerequisite checks. Verify previous phase artifacts exist.}

### Step 5: Present Current State

Show Ahiya:
- Client name and basic info
- Current phase and when it started
- What has been completed in this phase so far
- What remains to be done

### Step 6: Cooperative Work Session

{Phase-specific guidance for the cooperative work. What questions to ask, what to document, what to produce.}

### Step 7: Phase Completion

When Ahiya indicates the phase is complete:

1. Validate all required artifacts exist:
   {List of files that must exist}

2. Update client.yaml:
   - Set `engagement.current_phase` to next phase
   - Add completed phase to `engagement.phases_completed` with dates and deliverable path

3. Confirm completion:
   "Phase complete. Deliverable: {path}. Next: /c2l-{next-phase} {slug}"
```

## Status Command Pattern

The c2l-status command follows a different structure (no phase work, just reporting):

```markdown
---
description: Show all client engagement statuses
argument-hint: [client-slug]
allowed-tools: [Read, Glob, Grep, Bash]
---

# c2L Status - Engagement Overview

Display current state of all client engagements, or detailed status for one client.

## Usage

```
/c2l-status                  # All clients overview
/c2l-status <client-slug>    # Detailed status for one client
```

---

## Orchestration Logic

### If no arguments: Show all clients

```bash
# Find all client directories (exclude _templates and hidden)
for dir in clients/*/; do
  SLUG=$(basename "$dir")
  if [[ "$SLUG" == _* ]] || [[ "$SLUG" == .* ]]; then
    continue
  fi

  # Read client.yaml
  if [ -f "$dir/client.yaml" ]; then
    # Extract key fields
    NAME=$(grep "name:" "$dir/client.yaml" | head -1 | sed 's/.*name: "\(.*\)"/\1/')
    PHASE=$(grep "current_phase:" "$dir/client.yaml" | awk '{print $2}')
    STARTED=$(grep "phase_started:" "$dir/client.yaml" | awk '{print $2}')

    echo "$SLUG | $NAME | Phase: $PHASE | Started: $STARTED"
  fi
done
```

### If client slug provided: Show detailed status

Read the full client.yaml and present:
- Client info (name, contact, location, size)
- Current phase with start date
- Completed phases with dates and deliverables
- Volume metrics
- Pipeline config (document types, accuracy targets, current accuracy)
- Notes

### Display Format

```
c2L Client Engagements
======================

  1. ABC Customs (abc-customs)
     Phase: BUILD (started 2026-05-01)
     Pipeline: 3/5 document types implemented

  2. XYZ Freight (xyz-freight)
     Phase: EXPLORE (started 2026-05-10)
     Exploration: In progress

  3. DEF Logistics (def-logistics)
     Phase: COMPLETE (delivered 2026-04-28)
     Accuracy: 96.2% field-level

Next Steps:
  /c2l-explore new          Start new client engagement
  /c2l-{phase} {slug}       Continue working on a client
```
```

## client.yaml Schema Pattern

**When to use:** Every new client gets this template. It is the single source of truth for engagement state.

```yaml
# clients/_templates/client.yaml
# c2L Client Configuration
# Copy this template when initializing a new client engagement

client:
  name: "{CLIENT_NAME}"
  name_he: "{CLIENT_NAME_HEBREW}"
  slug: "{CLIENT_SLUG}"
  contact: "{CONTACT_PERSON}"
  phone: "{PHONE}"
  email: "{EMAIL}"
  location: "{CITY}"
  size: "{EMPLOYEE_COUNT} employees, {CLERK_COUNT} clerks"
  created: "{DATE}"

engagement:
  current_phase: explore  # explore | plan | build | validate | heal | deliver | complete
  phase_started: "{DATE}"
  phases_completed: []
  # Example completed phase entry:
  # - phase: explore
  #   started: 2026-04-15
  #   completed: 2026-04-22
  #   deliverable: exploration/exploration-report.md

volumes:
  shipments_per_month: null
  documents_per_shipment: null
  clerks: null
  estimated_annual_clerk_cost: null  # NIS

pipeline:
  document_types: []
  accuracy_targets:
    field_level: null
    document_level: null
  current_accuracy:
    field_level: null
    document_level: null

notes: |
  {Free-form notes about this client engagement}
```

**Key points:**
- All fields start as null or placeholder. Filled progressively during engagement.
- `current_phase` is the authoritative state indicator. Valid values: explore, plan, build, validate, heal, deliver, complete.
- `phases_completed` is an append-only array. Each entry records start/end dates and the primary deliverable path.
- `volumes` and `pipeline` sections are populated during exploration and planning phases.

## Exploration Report Template Pattern

**When to use:** The exploration report is the first paid deliverable. It must have standalone value.

The template must include these required sections (in order):

```markdown
# Exploration Report: {CLIENT_NAME}
# Date: {DATE}
# Prepared by: Ahiya Butman, c2L

---

## Executive Summary

{2-3 paragraphs: what the client does, what was observed, key findings,
feasibility assessment, cost-benefit headline}

---

## 1. Document Types Inventory

### 1.1 Core Documents (Every Shipment)

| Document Type | Hebrew | Format | Source | Frequency | Sample ID |
|--------------|--------|--------|--------|-----------|-----------|
| {type} | {hebrew} | {PDF/Scan/Email} | {source} | {frequency} | {id} |

### 1.2 Conditional Documents

| Document Type | Hebrew | When Required | Frequency (% of shipments) | Sample ID |
|--------------|--------|---------------|---------------------------|-----------|

### 1.3 Document Quality Assessment

| Document Type | Digital PDF % | Scanned % | Handwritten % | Multi-language | Avg Quality (1-5) |
|--------------|--------------|-----------|---------------|----------------|-------------------|

---

## 2. Systems Mapping

### 2.1 Primary Systems

| System | Purpose | Access Method | Data Entered | Time/Shipment |
|--------|---------|---------------|-------------|---------------|

### 2.2 Internal Systems

{Description of internal tools}

### 2.3 System Integration Points

{How systems connect to each other}

---

## 3. Current Workflow

### 3.1 End-to-End Process (Per Shipment)

| Step | Who | Action | Input | Output | Time | Error Risk |
|------|-----|--------|-------|--------|------|-----------|

### 3.2 Exception Handling

{What happens when documents are incomplete or contradictory}

### 3.3 Bottlenecks

{Where the process slows down}

---

## 4. Pain Points & Error Analysis

### 4.1 Error Types (Ranked by Cost)

| Error Type | Frequency | Cost per Occurrence | Annual Impact | Root Cause |
|-----------|-----------|-------------------|---------------|-----------|

### 4.2 Pain Points (Ranked by Severity)

1. **{Pain point}**: {Description, frequency, impact}

---

## 5. Volume Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Shipments/month | {N} | |
| Documents/shipment | {N} | |
| Clerks employed | {N} | |
| Clerk cost/month | {N} NIS | |
| Annual clerk cost | {N} NIS | |
| Time per shipment | {N} min | |
| Amendments/month | {N} | |
| Port storage incidents/month | {N} | |

---

## 6. Automation Feasibility Assessment

### 6.1 Per-Document-Type Feasibility

| Document Type | Feasibility | Confidence | Notes |
|--------------|------------|-----------|-------|

### 6.2 Overall Feasibility

{Summary assessment}

### 6.3 Recommended Scope for Build Phase

{Specific recommendation for what to build first}

---

## 7. Cost-Benefit Projection

### 7.1 Current Cost Structure

- Annual clerk cost: {N} NIS
- Amendment costs: ~{N} NIS/year
- Port storage from delays: ~{N} NIS/year
- Training/turnover cost: ~{N} NIS/year
- **Total annual cost of manual processing: {N} NIS**

### 7.2 Projected Savings

- Clerk reduction: {N} clerks x {cost} = {N} NIS/year saved
- Error reduction: ~{N}% fewer amendments = {N} NIS/year saved
- Speed improvement: ~{N}% faster processing
- **Projected annual savings: {N} NIS**

### 7.3 Investment vs. Return

- c2L engagement cost: {N} NIS (one-time)
- Payback period: ~{N} months
- Year 1 net savings: ~{N} NIS

---

## Appendix

### A. Sample Document References

{List of sample documents collected, with anonymization notes}

### B. Glossary

{Hebrew-English terminology used in this report}

### C. Next Steps

{What happens if the client proceeds to Phase 2 (Plan)}
```

**Key points:**
- Every section has explicit table structures. This ensures consistency across clients.
- Hebrew names included in document inventory (target market is Israeli).
- Cost-benefit section is critical -- it justifies the engagement investment.
- The appendix includes a glossary because the report bridges Hebrew and English terminology.

## Document Inventory Template Pattern

```markdown
# Document Inventory: {CLIENT_NAME}
# Date: {DATE}

## Overview

Total document types identified: {N}
Documents reviewed: {N} samples across {N} types

---

## Core Documents

### {Document Type 1}: {Hebrew Name}

- **Format:** PDF / Scan / Email attachment
- **Source:** {Where it comes from}
- **Frequency:** Every shipment / {N}% of shipments
- **Languages:** {List}
- **Typical length:** {N} pages
- **Key fields to extract:**
  - {Field 1}: {Description}
  - {Field 2}: {Description}
- **Sample IDs:** {S001, S002, ...}
- **Quality notes:** {Observations about readability, consistency}

### {Document Type 2}: {Hebrew Name}

{Same structure}

---

## Conditional Documents

### {Document Type}: {Hebrew Name}

{Same structure, plus:}
- **When required:** {Condition}
- **Percentage of shipments:** {N}%

---

## Document Relationships

{How documents cross-reference each other. E.g., B/L number appears on
invoice, packing list quantities should match invoice quantities.}

## Format Variations

{Notable variations within the same document type. E.g., different shipping
lines produce different B/L layouts.}
```

## Workflow Map Template Pattern

```markdown
# Workflow Map: {CLIENT_NAME}
# Date: {DATE}

## Overview

Processing a typical shipment takes {N} minutes across {N} steps,
involving {N} people.

---

## Step-by-Step Process

### Step 1: {Action Name}

- **Who:** {Role}
- **Input:** {What they receive}
- **Action:** {What they do}
- **Output:** {What they produce}
- **Time:** {Minutes}
- **Tools used:** {Systems/software}
- **Error risk:** Low / Medium / High
- **Error description:** {What can go wrong}

### Step 2: {Action Name}

{Same structure}

---

## Decision Points

### {Decision}: {Description}

- **When:** {Condition}
- **Options:** {What the clerk/broker decides}
- **Impact:** {What changes based on the decision}

---

## Handoff Points

{Where work passes between people. These are often error-prone.}

## Peak Times

{When the workload is highest. Time of day, day of week, seasonal patterns.}

## Current Pain Points in Workflow

1. {Pain point with specific step reference}
2. {Pain point with specific step reference}
```

## Phase Gating Pattern

**When to use:** Every phase command must validate that prerequisites are met before starting work.

```markdown
### Step 4: Validate Prerequisites

Check that the required previous phase is complete:

**For c2l-plan (requires explore complete):**
```bash
CLIENT_DIR="clients/$SLUG"

# Check client.yaml phase
CURRENT_PHASE=$(grep "current_phase:" "$CLIENT_DIR/client.yaml" | awk '{print $2}')

# Phase must be 'plan' (already transitioned) or check artifacts
if [ "$CURRENT_PHASE" = "explore" ]; then
  echo "Exploration phase is still in progress."
  echo "Complete exploration first, then transition to plan."
  echo ""
  echo "To mark exploration complete, run:"
  echo "  /c2l-explore $SLUG"
  echo "  Then say: 'Mark exploration as complete'"
  exit 1
fi

# Verify exploration artifacts exist
REQUIRED_FILES=(
  "$CLIENT_DIR/exploration/exploration-report.md"
  "$CLIENT_DIR/exploration/document-inventory.md"
  "$CLIENT_DIR/exploration/workflow-map.md"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$FILE" ] || [ ! -s "$FILE" ]; then
    echo "Missing or empty required file: $FILE"
    echo "Complete exploration first."
    exit 1
  fi
done
```

**Prerequisite chain:**
| Phase | Requires Phase Complete | Required Artifacts |
|-------|------------------------|-------------------|
| explore | (none) | (none) |
| plan | explore | exploration-report.md, document-inventory.md, workflow-map.md |
| build | plan | plan/solution-design.md, plan/accuracy-targets.md |
| validate | build | pipeline/ directory with code, plan/accuracy-targets.md |
| heal | validate (with failures) | validation/failure-analysis.md, validation/metrics.yaml |
| deliver | validate (pass) OR heal (pass) | validation/validation-report.md with passing metrics |
| status | (none) | (none) |
```

## Phase Completion Pattern

**When to use:** When Ahiya indicates a phase is complete.

```markdown
### Phase Completion Protocol

When Ahiya says "mark {phase} as complete" or similar:

1. **Validate all required artifacts exist:**

   For explore phase:
   - [ ] exploration/exploration-report.md exists and is non-empty
   - [ ] exploration/document-inventory.md exists and is non-empty
   - [ ] exploration/workflow-map.md exists and is non-empty
   - [ ] At least 1 subdirectory in samples/ has files
   - [ ] client.yaml has volumes section populated (non-null values)

2. **If validation fails:**
   Report which items are missing. Do NOT update client.yaml.
   "Cannot mark exploration complete. Missing: {list of missing items}"

3. **If validation passes, update client.yaml:**

   Read the current client.yaml. Update these fields:

   - Set `engagement.current_phase` to the next phase name
   - Set `engagement.phase_started` to today's date
   - Append to `engagement.phases_completed`:
     ```yaml
     - phase: explore
       started: {original_start_date}
       completed: {today}
       deliverable: exploration/exploration-report.md
     ```

4. **Confirm to Ahiya:**
   "Exploration marked complete.
    Deliverable: exploration/exploration-report.md
    Next phase: plan
    Run: /c2l-plan {slug}"
```

## Session Resumption Pattern

**When to use:** Every time a phase command is invoked for an existing client.

```markdown
### Session Resumption Logic

When the command is invoked for an existing client (not "new"):

1. Read client.yaml
2. Check if current_phase matches this command's phase
3. Assess progress within the phase by checking which artifacts exist

**Example for c2l-explore resumption:**

```bash
CLIENT_DIR="clients/$SLUG"

# Read basic info
CLIENT_NAME=$(grep "  name:" "$CLIENT_DIR/client.yaml" | head -1 | sed 's/.*: "\(.*\)"/\1/')

echo "Resuming exploration for: $CLIENT_NAME"
echo ""

# Check what exists
HAS_REPORT=false
HAS_INVENTORY=false
HAS_WORKFLOW=false
HAS_SAMPLES=false
HAS_VOLUMES=false

[ -s "$CLIENT_DIR/exploration/exploration-report.md" ] && HAS_REPORT=true
[ -s "$CLIENT_DIR/exploration/document-inventory.md" ] && HAS_INVENTORY=true
[ -s "$CLIENT_DIR/exploration/workflow-map.md" ] && HAS_WORKFLOW=true
[ -n "$(find "$CLIENT_DIR/samples" -type f 2>/dev/null)" ] && HAS_SAMPLES=true

# Check if volumes are populated in client.yaml
SHIPMENTS=$(grep "shipments_per_month:" "$CLIENT_DIR/client.yaml" | awk '{print $2}')
[ "$SHIPMENTS" != "null" ] && [ -n "$SHIPMENTS" ] && HAS_VOLUMES=true

echo "Progress:"
echo "  Exploration report: $([ $HAS_REPORT = true ] && echo 'Started' || echo 'Not started')"
echo "  Document inventory: $([ $HAS_INVENTORY = true ] && echo 'Started' || echo 'Not started')"
echo "  Workflow map:       $([ $HAS_WORKFLOW = true ] && echo 'Started' || echo 'Not started')"
echo "  Sample documents:   $([ $HAS_SAMPLES = true ] && echo 'Collected' || echo 'None yet')"
echo "  Volume metrics:     $([ $HAS_VOLUMES = true ] && echo 'Captured' || echo 'Not yet')"
echo ""
echo "What would you like to work on?"
```

**Key points:**
- Always show what is done and what remains
- Let Ahiya choose what to work on next
- Never assume linear order within a phase -- Ahiya may jump between tasks
```

## Client Slug Generation Pattern

**When to use:** When creating a new client from `/c2l-explore new`.

```markdown
### Generate client slug from company name

Take the company name provided by Ahiya and generate a kebab-case slug:

1. Ask for the company name
2. Generate slug:
   - Convert to lowercase
   - Replace spaces and special characters with hyphens
   - Remove Hebrew characters (slug is English-only for filesystem compatibility)
   - Remove consecutive hyphens
   - Remove leading/trailing hyphens
   - Limit to 30 characters
3. Show the generated slug to Ahiya for confirmation
4. Check that `clients/{slug}/` does not already exist

Example:
- "ABC Customs Brokerage Ltd" -> "abc-customs-brokerage"
- "Golden Gate Shipping" -> "golden-gate-shipping"
```

## .gitignore Pattern for Clients Directory

**File:** `clients/.gitignore`

```gitignore
# Client sample documents - NEVER commit these
# They contain sensitive business data (shipment values, consignee details, etc.)
*/samples/

# Binary files that might end up in client directories
*.pdf
*.png
*.jpg
*.jpeg
*.tiff
*.tif
*.bmp
*.xlsx
*.xls
*.doc
*.docx

# But DO track these:
!_templates/
!_templates/**
!**/client.yaml
!**/*.md
!**/*.yaml
!**/*.yml
```

**Key points:**
- Samples directory is always excluded
- Binary files are excluded by extension as a safety net
- Templates directory is explicitly included
- YAML configs and markdown reports are explicitly included

## Testing Patterns

### Test File Naming Conventions

Test scripts live alongside the files they validate or in a dedicated `__tests__/` directory:
- Command validation: `__tests__/validate-commands.sh`
- Template validation: `__tests__/validate-templates.sh`
- Schema validation: `__tests__/validate-client-yaml.sh`
- Full suite runner: `__tests__/run-all.sh`

### Command File Validation Test

**Purpose:** Verify every command file has correct frontmatter and required sections.

```bash
#!/bin/bash
# __tests__/validate-commands.sh
# Validates all command files have correct structure

COMMANDS_DIR="commands"
PASS=0
FAIL=0
ERRORS=""

# Required commands
REQUIRED_COMMANDS=(
  "c2l-explore"
  "c2l-plan"
  "c2l-build"
  "c2l-validate"
  "c2l-heal"
  "c2l-deliver"
  "c2l-status"
)

echo "Validating c2L command files..."
echo ""

# Check all required commands exist
for CMD in "${REQUIRED_COMMANDS[@]}"; do
  FILE="$COMMANDS_DIR/$CMD.md"
  if [ ! -f "$FILE" ]; then
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Missing command file: $FILE"
    continue
  fi

  # Check frontmatter exists (starts with ---)
  FIRST_LINE=$(head -1 "$FILE")
  if [ "$FIRST_LINE" != "---" ]; then
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: $FILE missing frontmatter (first line must be ---)"
    continue
  fi

  # Check frontmatter has required fields
  # Extract frontmatter (between first and second ---)
  FRONTMATTER=$(sed -n '2,/^---$/p' "$FILE" | head -n -1)

  # Check description field
  if ! echo "$FRONTMATTER" | grep -q "^description:"; then
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: $FILE missing 'description' in frontmatter"
  else
    PASS=$((PASS + 1))
  fi

  # Check allowed-tools field
  if ! echo "$FRONTMATTER" | grep -q "^allowed-tools:"; then
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: $FILE missing 'allowed-tools' in frontmatter"
  else
    PASS=$((PASS + 1))
  fi

  # Check required body sections (all phase commands except status)
  if [ "$CMD" != "c2l-status" ]; then
    # Check for Usage section
    if ! grep -q "^## Usage" "$FILE"; then
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: $FILE missing '## Usage' section"
    else
      PASS=$((PASS + 1))
    fi

    # Check for Prerequisites section
    if ! grep -q "^## Prerequisites" "$FILE"; then
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: $FILE missing '## Prerequisites' section"
    else
      PASS=$((PASS + 1))
    fi

    # Check for Orchestration Logic section
    if ! grep -q "^## Orchestration Logic" "$FILE"; then
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: $FILE missing '## Orchestration Logic' section"
    else
      PASS=$((PASS + 1))
    fi

    # Check for Next Step section (except deliver which is the last phase)
    if [ "$CMD" != "c2l-deliver" ]; then
      if ! grep -q "^## Next Step" "$FILE"; then
        FAIL=$((FAIL + 1))
        ERRORS="$ERRORS\nFAIL: $FILE missing '## Next Step' section"
      else
        PASS=$((PASS + 1))
      fi
    fi
  fi

  # Check file is non-trivial (at least 50 lines)
  LINE_COUNT=$(wc -l < "$FILE")
  if [ "$LINE_COUNT" -lt 50 ]; then
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: $FILE is only $LINE_COUNT lines (expected at least 50)"
  else
    PASS=$((PASS + 1))
  fi
done

echo "Results: $PASS passed, $FAIL failed"
if [ $FAIL -gt 0 ]; then
  echo ""
  echo "Failures:"
  echo -e "$ERRORS"
  exit 1
fi
echo "All command validations passed."
```

### Template File Validation Test

**Purpose:** Verify all template files exist and have required sections.

```bash
#!/bin/bash
# __tests__/validate-templates.sh
# Validates template files have correct structure

TEMPLATES_DIR="clients/_templates"
PASS=0
FAIL=0
ERRORS=""

echo "Validating c2L template files..."
echo ""

# Check required template files exist
REQUIRED_TEMPLATES=(
  "exploration-report.md"
  "document-inventory.md"
  "workflow-map.md"
  "client.yaml"
)

for TPL in "${REQUIRED_TEMPLATES[@]}"; do
  FILE="$TEMPLATES_DIR/$TPL"
  if [ ! -f "$FILE" ]; then
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Missing template: $FILE"
    continue
  fi

  # Check file is non-empty
  if [ ! -s "$FILE" ]; then
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Empty template: $FILE"
    continue
  fi

  PASS=$((PASS + 1))
done

# Validate exploration-report.md has required sections
REPORT="$TEMPLATES_DIR/exploration-report.md"
if [ -f "$REPORT" ]; then
  REQUIRED_SECTIONS=(
    "Executive Summary"
    "Document Types Inventory"
    "Systems Mapping"
    "Current Workflow"
    "Pain Points"
    "Volume Metrics"
    "Automation Feasibility"
    "Cost-Benefit"
  )

  for SECTION in "${REQUIRED_SECTIONS[@]}"; do
    if ! grep -qi "$SECTION" "$REPORT"; then
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: exploration-report.md missing section: $SECTION"
    else
      PASS=$((PASS + 1))
    fi
  done
fi

# Validate document-inventory.md has required sections
INVENTORY="$TEMPLATES_DIR/document-inventory.md"
if [ -f "$INVENTORY" ]; then
  for SECTION in "Core Documents" "Conditional Documents" "Document Relationships"; do
    if ! grep -qi "$SECTION" "$INVENTORY"; then
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: document-inventory.md missing section: $SECTION"
    else
      PASS=$((PASS + 1))
    fi
  done
fi

# Validate workflow-map.md has required sections
WORKFLOW="$TEMPLATES_DIR/workflow-map.md"
if [ -f "$WORKFLOW" ]; then
  for SECTION in "Step-by-Step Process" "Decision Points" "Handoff Points"; do
    if ! grep -qi "$SECTION" "$WORKFLOW"; then
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: workflow-map.md missing section: $SECTION"
    else
      PASS=$((PASS + 1))
    fi
  done
fi

echo "Results: $PASS passed, $FAIL failed"
if [ $FAIL -gt 0 ]; then
  echo ""
  echo "Failures:"
  echo -e "$ERRORS"
  exit 1
fi
echo "All template validations passed."
```

### client.yaml Schema Validation Test

**Purpose:** Verify the client.yaml template has all required fields and valid default values.

```bash
#!/bin/bash
# __tests__/validate-client-yaml.sh
# Validates client.yaml template has correct schema

CLIENT_YAML="clients/_templates/client.yaml"
PASS=0
FAIL=0
ERRORS=""

echo "Validating client.yaml schema..."
echo ""

if [ ! -f "$CLIENT_YAML" ]; then
  echo "FAIL: client.yaml template not found at $CLIENT_YAML"
  exit 1
fi

# Check YAML is parseable
python3 -c "
import yaml, sys
try:
    with open('$CLIENT_YAML') as f:
        data = yaml.safe_load(f)
    if data is None:
        print('FAIL: YAML parsed but is empty')
        sys.exit(1)
    print('PASS: YAML is valid')
except yaml.YAMLError as e:
    print(f'FAIL: YAML parse error: {e}')
    sys.exit(1)
" 2>/dev/null

if [ $? -ne 0 ]; then
  # Try without python, use basic grep checks
  echo "WARN: Python not available, using basic validation"
fi

# Check required top-level keys
REQUIRED_KEYS=(
  "client:"
  "engagement:"
  "volumes:"
  "pipeline:"
  "notes:"
)

for KEY in "${REQUIRED_KEYS[@]}"; do
  if grep -q "^$KEY" "$CLIENT_YAML"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Missing top-level key: $KEY"
  fi
done

# Check required client fields
CLIENT_FIELDS=(
  "name:"
  "slug:"
  "contact:"
  "email:"
  "location:"
  "created:"
)

for FIELD in "${CLIENT_FIELDS[@]}"; do
  if grep -q "  $FIELD" "$CLIENT_YAML"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Missing client field: $FIELD"
  fi
done

# Check engagement fields
ENGAGEMENT_FIELDS=(
  "current_phase:"
  "phase_started:"
  "phases_completed:"
)

for FIELD in "${ENGAGEMENT_FIELDS[@]}"; do
  if grep -q "  $FIELD" "$CLIENT_YAML"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Missing engagement field: $FIELD"
  fi
done

# Check valid phase values are documented
if grep -q "explore.*plan.*build.*validate.*heal.*deliver.*complete" "$CLIENT_YAML"; then
  PASS=$((PASS + 1))
else
  # Check if the comment listing valid phases exists
  if grep -q "explore" "$CLIENT_YAML" && grep -q "complete" "$CLIENT_YAML"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Valid phase values not documented in client.yaml"
  fi
fi

# Check pipeline fields
PIPELINE_FIELDS=(
  "document_types:"
  "accuracy_targets:"
  "current_accuracy:"
)

for FIELD in "${PIPELINE_FIELDS[@]}"; do
  if grep -q "  $FIELD" "$CLIENT_YAML"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Missing pipeline field: $FIELD"
  fi
done

echo "Results: $PASS passed, $FAIL failed"
if [ $FAIL -gt 0 ]; then
  echo ""
  echo "Failures:"
  echo -e "$ERRORS"
  exit 1
fi
echo "All client.yaml schema validations passed."
```

### Directory Structure Validation Test

**Purpose:** Verify the expected directory structure exists after building.

```bash
#!/bin/bash
# __tests__/validate-structure.sh
# Validates the overall c2L plugin directory structure

PASS=0
FAIL=0
ERRORS=""

echo "Validating c2L directory structure..."
echo ""

# Required directories
REQUIRED_DIRS=(
  ".claude-plugin"
  "commands"
  "clients"
  "clients/_templates"
)

for DIR in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$DIR" ]; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Missing directory: $DIR"
  fi
done

# Required files
REQUIRED_FILES=(
  ".claude-plugin/plugin.json"
  "commands/c2l-explore.md"
  "commands/c2l-plan.md"
  "commands/c2l-build.md"
  "commands/c2l-validate.md"
  "commands/c2l-heal.md"
  "commands/c2l-deliver.md"
  "commands/c2l-status.md"
  "clients/.gitignore"
  "clients/_templates/exploration-report.md"
  "clients/_templates/document-inventory.md"
  "clients/_templates/workflow-map.md"
  "clients/_templates/client.yaml"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  if [ -f "$FILE" ]; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Missing file: $FILE"
  fi
done

# Validate plugin.json is valid JSON
if [ -f ".claude-plugin/plugin.json" ]; then
  python3 -c "
import json, sys
try:
    with open('.claude-plugin/plugin.json') as f:
        data = json.load(f)
    if 'name' not in data:
        print('FAIL: plugin.json missing name field')
        sys.exit(1)
    if data['name'] != 'c2l':
        print(f'FAIL: plugin.json name is {data[\"name\"]}, expected c2l')
        sys.exit(1)
    print('PASS: plugin.json is valid')
except json.JSONDecodeError as e:
    print(f'FAIL: plugin.json is not valid JSON: {e}')
    sys.exit(1)
" 2>/dev/null
  if [ $? -eq 0 ]; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: plugin.json validation failed"
  fi
fi

echo "Results: $PASS passed, $FAIL failed"
if [ $FAIL -gt 0 ]; then
  echo ""
  echo "Failures:"
  echo -e "$ERRORS"
  exit 1
fi
echo "All structure validations passed."
```

### Full Test Suite Runner

```bash
#!/bin/bash
# __tests__/run-all.sh
# Runs all c2L validation tests

echo "=================================="
echo "c2L Plugin Validation Suite"
echo "=================================="
echo ""

TOTAL_PASS=0
TOTAL_FAIL=0

# Run each test suite
for TEST in __tests__/validate-*.sh; do
  echo "--- Running: $(basename $TEST) ---"
  bash "$TEST"
  if [ $? -ne 0 ]; then
    TOTAL_FAIL=$((TOTAL_FAIL + 1))
  else
    TOTAL_PASS=$((TOTAL_PASS + 1))
  fi
  echo ""
done

echo "=================================="
echo "Summary: $TOTAL_PASS suites passed, $TOTAL_FAIL suites failed"
echo "=================================="

if [ $TOTAL_FAIL -gt 0 ]; then
  exit 1
fi
```

### Coverage Expectations

| Validation Area | Coverage | Notes |
|----------------|----------|-------|
| Command frontmatter | 100% | All 7 commands validated |
| Required sections | 100% | Phase commands checked for Usage, Prerequisites, Orchestration Logic |
| Template completeness | 100% | All templates checked for required sections |
| client.yaml schema | 100% | All required fields and valid values checked |
| Directory structure | 100% | All expected directories and files verified |
| JSON/YAML validity | 100% | plugin.json and client.yaml parsed for syntax |

## Error Handling Patterns

### Command Argument Errors

```markdown
### Handle Missing or Invalid Arguments

If `$ARGUMENTS` is empty:
  "Usage: /c2l-{phase} <client-slug> or /c2l-{phase} new

   Available clients:"
   {List client directories}

If `$ARGUMENTS` is a slug that does not exist:
  "Client not found: {slug}

   Available clients:"
   {List client directories}

   "To create a new client: /c2l-explore new"
```

### Phase Mismatch Errors

```markdown
### Handle Phase Mismatch

If Ahiya runs /c2l-build but client is in explore phase:
  "Cannot start build phase.
   Client '{name}' is currently in EXPLORE phase.

   Required: Complete exploration and planning first.

   Current phase: explore
   Next step: /c2l-explore {slug} (to continue exploration)"
```

### Missing Artifact Errors

```markdown
### Handle Missing Artifacts During Phase Completion

If Ahiya tries to mark a phase complete but artifacts are missing:
  "Cannot mark {phase} as complete. Missing artifacts:

   [ ] exploration/exploration-report.md (NOT FOUND)
   [x] exploration/document-inventory.md (exists)
   [ ] exploration/workflow-map.md (NOT FOUND)

   Complete these items first, then try again."
```

## Import Order Convention

Not applicable -- c2L commands are markdown files, not source code with imports.

## Security Patterns

### Sensitive Data Protection

```gitignore
# clients/.gitignore
# Client sample documents contain sensitive business data
# NEVER commit these to version control

*/samples/
*.pdf
*.png
*.jpg
*.jpeg
*.tiff
*.tif
*.xlsx
*.xls
*.doc
*.docx
```

### Client Data Handling

```markdown
Commands should remind Ahiya about data sensitivity:

"Note: Client documents in samples/ are gitignored and should never be
committed. If sharing this repo, verify no client data is included."
```

## Performance Patterns

Not applicable -- c2L commands are prompt documents, not executable applications.
