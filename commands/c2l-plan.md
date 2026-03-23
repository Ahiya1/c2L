---
description: Design the solution based on exploration findings
argument-hint: <client-slug>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# c2L Plan - Solution Design

Design a specific document processing solution based on exploration findings. Define what will be built, what accuracy is acceptable, and what the system will and will not handle.

## Usage

```
/c2l-plan <client-slug>     # Design solution for a client
/c2l-plan                   # List available clients
```

## What This Does

Opens a cooperative design session where you and Ahiya translate exploration findings into a concrete solution specification. You review the exploration report together, identify which document types to automate first, define field extraction targets, set accuracy requirements, and establish scope boundaries.

## Prerequisites

Exploration phase must be complete. Required artifacts:
- `clients/{slug}/exploration/exploration-report.md` (non-empty)
- `clients/{slug}/exploration/document-inventory.md` (non-empty)
- `clients/{slug}/exploration/workflow-map.md` (non-empty)
- `client.yaml` engagement phase is `plan` or later

## Outputs

All files created under `clients/{slug}/`:
- `plan/solution-design.md` -- Technical specification for the pipeline
- `plan/field-specs/` -- Per-document-type field extraction specifications
- `plan/accuracy-targets.md` -- Measurable accuracy criteria for validation
- `plan/scope.md` -- What is in and out of scope for the build

## Phase Completion Criteria

- [ ] Solution design document covers pipeline architecture
- [ ] Field extraction specs exist for every in-scope document type
- [ ] Accuracy targets defined (field-level and document-level)
- [ ] Scope boundaries documented (v1 vs. deferred)
- [ ] Client has reviewed and agreed to proceed

## Next Step

After planning is complete, run:
```
/c2l-build <client-slug>
```

---

## Orchestration Logic

### Step 1: Parse Arguments

The user provides `$ARGUMENTS` which should be a client slug.

**If no arguments:**
List available clients (same as c2l-explore) and ask which one to work on.

**If slug provided:**
```bash
CLIENT_DIR="clients/$ARGUMENTS"
if [ ! -d "$CLIENT_DIR" ]; then
  echo "Client directory not found: $CLIENT_DIR"
  echo "Available clients:"
  ls clients/ | grep -v "^_" | grep -v "^\."
  exit 1
fi
```

### Step 2: Validate Prerequisites

```bash
CLIENT_DIR="clients/$SLUG"
CURRENT_PHASE=$(grep "current_phase:" "$CLIENT_DIR/client.yaml" | awk '{print $2}')

# Phase must be 'plan' or later (not still in 'explore')
if [ "$CURRENT_PHASE" = "explore" ]; then
  echo "Exploration phase is still in progress."
  echo "Complete exploration first."
  echo ""
  echo "To continue exploration, run:"
  echo "  /c2l-explore $SLUG"
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

### Step 3: Session Resumption

Read the current state of plan artifacts:

```bash
CLIENT_DIR="clients/$SLUG"
CLIENT_NAME=$(grep "  name:" "$CLIENT_DIR/client.yaml" | head -1 | sed 's/.*: "\(.*\)"/\1/')

echo "Planning session for: $CLIENT_NAME"

HAS_DESIGN=false; HAS_TARGETS=false; HAS_SCOPE=false; HAS_FIELD_SPECS=false

[ -s "$CLIENT_DIR/plan/solution-design.md" ] && HAS_DESIGN=true
[ -s "$CLIENT_DIR/plan/accuracy-targets.md" ] && HAS_TARGETS=true
[ -s "$CLIENT_DIR/plan/scope.md" ] && HAS_SCOPE=true
[ -n "$(find "$CLIENT_DIR/plan/field-specs" -name "*.md" -type f 2>/dev/null)" ] && HAS_FIELD_SPECS=true

echo "Progress:"
echo "  Solution design:   $([ $HAS_DESIGN = true ] && echo 'Started' || echo 'Not started')"
echo "  Accuracy targets:  $([ $HAS_TARGETS = true ] && echo 'Defined' || echo 'Not defined')"
echo "  Scope document:    $([ $HAS_SCOPE = true ] && echo 'Written' || echo 'Not started')"
echo "  Field specs:       $([ $HAS_FIELD_SPECS = true ] && echo 'Created' || echo 'Not started')"
```

Read the exploration report to ground the session in context:
```bash
cat "$CLIENT_DIR/exploration/exploration-report.md"
```

Present a summary to Ahiya and ask what to work on.

### Step 4: Cooperative Design Session

Guide Ahiya through these design decisions:

**A. Pipeline Architecture** -- "Based on the exploration, here is the proposed pipeline flow:"
- Ingest: How documents enter the system (email watch, folder scan, manual upload)
- Interpret: Per-document-type field extraction (LLM-based, rule-based, hybrid)
- Validate: Cross-document consistency checks (B/L quantities vs. packing list)
- Output: Structured data format (JSON, CSV, direct entry to SHAAR/MASLUL)

**B. Document Type Prioritization** -- "Which document types should we automate in v1?"
- Review the document inventory from exploration
- Rank by: volume (how many per month), complexity (how hard to parse), value (what does automation save)
- Recommend starting with highest-volume, lowest-complexity types
- Create field extraction spec for each in-scope type

**C. Field Extraction Specifications** -- For each in-scope document type:
- Create `plan/field-specs/{document-type}.md`
- List every field to extract: field name, data type, where on document, validation rules
- Note known variations (different shipping lines format B/L differently)
- Define "confidence threshold" for flagging uncertain extractions

**D. Accuracy Requirements** -- "What accuracy makes this valuable?"
- Field-level accuracy: % of individual fields extracted correctly (typically 95%+)
- Document-level accuracy: % of documents where ALL fields are correct (typically 90%+)
- Define what "correct" means for each field type (exact match, numeric tolerance, fuzzy text match)
- Create `plan/accuracy-targets.md`

**E. Scope Boundaries** -- "What is in v1 and what is deferred?"
- In scope: specific document types, specific fields, specific output format
- Out of scope: edge cases, rare document types, advanced features
- Create `plan/scope.md`

**F. Failure Handling** -- "What happens when the system is not confident?"
- Documents flagged for human review
- Partial extraction (some fields filled, others flagged)
- Error reporting format

Create plan directory and field-specs subdirectory if they do not exist:
```bash
mkdir -p "clients/$SLUG/plan/field-specs"
```

### Step 5: Phase Completion

When Ahiya indicates planning is complete:

1. **Validate all required artifacts exist:**
   - [ ] `plan/solution-design.md` exists and is non-empty
   - [ ] `plan/accuracy-targets.md` exists and is non-empty
   - [ ] `plan/scope.md` exists and is non-empty
   - [ ] At least 1 file in `plan/field-specs/`

2. **If validation fails:**
   Report which items are missing. Do NOT update client.yaml.

3. **If validation passes, update client.yaml:**
   - Set `engagement.current_phase: build`
   - Set `engagement.phase_started` to today's date
   - Append to `engagement.phases_completed`:
     ```yaml
     - phase: plan
       started: {original_start_date}
       completed: {today}
       deliverable: plan/solution-design.md
     ```
   - Update `pipeline.document_types` with the in-scope types
   - Update `pipeline.accuracy_targets` with agreed targets

4. **Confirm:**
   "Planning marked complete.
    Deliverable: plan/solution-design.md
    In-scope document types: {list}
    Accuracy targets: {field_level}% field, {document_level}% document
    Next phase: build
    Run: /c2l-build {slug}"
