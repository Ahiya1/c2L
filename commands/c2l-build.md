---
description: Cooperative pipeline implementation for client workflow
argument-hint: <client-slug>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# c2L Build - Cooperative Pipeline Implementation

Build the document processing pipeline cooperatively with Ahiya, using real client documents as the test bed. The command guides the implementation, tracks progress, and ensures each pipeline module meets the solution design specification.

## Usage

```
/c2l-build <client-slug>     # Build pipeline for a client
/c2l-build                   # List available clients
```

## What This Does

Opens a cooperative build session where you and Ahiya implement the document processing pipeline module by module. You read the solution design and field specs, create the pipeline directory structure, and guide Ahiya through building ingest, interpret, validate, and output modules. Progress is tracked in a build log.

## Prerequisites

Plan phase must be complete. Required artifacts:
- `clients/{slug}/plan/solution-design.md` (non-empty)
- `clients/{slug}/plan/accuracy-targets.md` (non-empty)
- At least 1 field spec in `clients/{slug}/plan/field-specs/`
- `client.yaml` engagement phase is `build` or later

## Outputs

All files created under `clients/{slug}/`:
- `pipeline/` -- The actual pipeline code modules
  - `pipeline/ingest/` -- Document ingestion modules
  - `pipeline/interpret/` -- Per-document-type interpretation modules
  - `pipeline/validate/` -- Cross-document validation logic
  - `pipeline/output/` -- Output formatting modules
- `build/build-log.md` -- Record of build decisions, iterations, and progress
- `build/sample-results/` -- Pipeline output on sample documents

## Phase Completion Criteria

- [ ] Pipeline processes all in-scope document types
- [ ] Accuracy on sample documents approaches targets from plan
- [ ] Build log documents all decisions and known limitations
- [ ] Pipeline is runnable end-to-end on new documents

## Next Step

After build is complete, run:
```
/c2l-validate <client-slug>
```

---

## Orchestration Logic

### Step 1: Parse Arguments

The user provides `$ARGUMENTS` which should be a client slug.

**If no arguments:**
List available clients and ask which one to work on.

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

# Phase must be 'build' or later
if [ "$CURRENT_PHASE" = "explore" ] || [ "$CURRENT_PHASE" = "plan" ]; then
  echo "Previous phases not yet complete."
  echo "Current phase: $CURRENT_PHASE"
  echo ""
  echo "Complete the $CURRENT_PHASE phase first:"
  echo "  /c2l-$CURRENT_PHASE $SLUG"
  exit 1
fi

# Verify plan artifacts exist
REQUIRED_FILES=(
  "$CLIENT_DIR/plan/solution-design.md"
  "$CLIENT_DIR/plan/accuracy-targets.md"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$FILE" ] || [ ! -s "$FILE" ]; then
    echo "Missing or empty required file: $FILE"
    echo "Complete planning first."
    exit 1
  fi
done

# Check at least one field spec exists
if [ -z "$(find "$CLIENT_DIR/plan/field-specs" -name "*.md" -type f 2>/dev/null)" ]; then
  echo "No field specifications found in plan/field-specs/"
  echo "Complete planning first."
  exit 1
fi
```

### Step 3: Session Resumption

Read the current state of build artifacts:

```bash
CLIENT_DIR="clients/$SLUG"
CLIENT_NAME=$(grep "  name:" "$CLIENT_DIR/client.yaml" | head -1 | sed 's/.*: "\(.*\)"/\1/')

echo "Build session for: $CLIENT_NAME"

HAS_BUILD_LOG=false; HAS_INGEST=false; HAS_INTERPRET=false
HAS_VALIDATE=false; HAS_OUTPUT=false; HAS_RESULTS=false

[ -s "$CLIENT_DIR/build/build-log.md" ] && HAS_BUILD_LOG=true
[ -n "$(find "$CLIENT_DIR/pipeline/ingest" -type f 2>/dev/null)" ] && HAS_INGEST=true
[ -n "$(find "$CLIENT_DIR/pipeline/interpret" -type f 2>/dev/null)" ] && HAS_INTERPRET=true
[ -n "$(find "$CLIENT_DIR/pipeline/validate" -type f 2>/dev/null)" ] && HAS_VALIDATE=true
[ -n "$(find "$CLIENT_DIR/pipeline/output" -type f 2>/dev/null)" ] && HAS_OUTPUT=true
[ -n "$(find "$CLIENT_DIR/build/sample-results" -type f 2>/dev/null)" ] && HAS_RESULTS=true

echo "Progress:"
echo "  Build log:          $([ $HAS_BUILD_LOG = true ] && echo 'Started' || echo 'Not started')"
echo "  Ingest module:      $([ $HAS_INGEST = true ] && echo 'Created' || echo 'Not started')"
echo "  Interpret modules:  $([ $HAS_INTERPRET = true ] && echo 'Created' || echo 'Not started')"
echo "  Validate module:    $([ $HAS_VALIDATE = true ] && echo 'Created' || echo 'Not started')"
echo "  Output module:      $([ $HAS_OUTPUT = true ] && echo 'Created' || echo 'Not started')"
echo "  Sample results:     $([ $HAS_RESULTS = true ] && echo 'Generated' || echo 'Not yet')"
```

Read the solution design and field specs to ground the session:
```bash
cat "$CLIENT_DIR/plan/solution-design.md"
```

Present a summary and ask what to work on next.

### Step 4: Initialize Build Environment

If this is the first build session, create the directory structure and build log:

```bash
mkdir -p "clients/$SLUG/pipeline"/{ingest,interpret,validate,output}
mkdir -p "clients/$SLUG/build/sample-results"
```

Create `build/build-log.md` if it does not exist:
```markdown
# Build Log: {CLIENT_NAME}
# Started: {DATE}

## Build Decisions

{Record architectural and implementation decisions here}

## Progress Tracker

| Module | Status | Notes |
|--------|--------|-------|
| Ingest | Not started | |
| Interpret | Not started | |
| Validate | Not started | |
| Output | Not started | |

## Iteration History

### Session 1 - {DATE}
{What was worked on, what was accomplished, what remains}
```

### Step 5: Cooperative Build Guidance

Guide Ahiya through building each module. The build order should follow the pipeline flow:

**A. Ingest Module** -- "How do documents enter the pipeline?"
- Read solution design for ingestion approach
- Implement: file reading, PDF text extraction, image handling (OCR if needed)
- Test on sample documents from `samples/` directory
- Record decisions in build log

**B. Interpret Modules** -- "One module per document type"
- For each document type in scope (read from `pipeline.document_types` in client.yaml):
  - Read the field spec from `plan/field-specs/{type}.md`
  - Implement field extraction (LLM prompts, regex patterns, structural parsing)
  - Test on sample documents of that type
  - Record accuracy observations

**C. Validate Module** -- "Cross-document consistency checks"
- Implement checks defined in solution design
- Example: B/L quantities match packing list totals
- Example: Invoice amounts are within expected ranges
- Flag documents that fail validation for human review

**D. Output Module** -- "Format results for the target system"
- Implement the output format defined in solution design
- May be JSON, CSV, or direct system entry format
- Include confidence scores per field
- Flag low-confidence fields

After each module, run on sample documents and review results:
```bash
# Save results to build/sample-results/
```

Update the build log with progress after each session.

### Step 6: Phase Completion

When Ahiya indicates the build is complete:

1. **Validate pipeline exists and is functional:**
   - [ ] At least 1 file in `pipeline/ingest/`
   - [ ] At least 1 file in `pipeline/interpret/`
   - [ ] `build/build-log.md` exists and is non-empty
   - [ ] Pipeline can process at least 1 sample document end-to-end

2. **If validation fails:**
   Report what is missing. Do NOT update client.yaml.

3. **If validation passes, update client.yaml:**
   - Set `engagement.current_phase: validate`
   - Set `engagement.phase_started` to today's date
   - Append to `engagement.phases_completed`:
     ```yaml
     - phase: build
       started: {original_start_date}
       completed: {today}
       deliverable: build/build-log.md
     ```

4. **Confirm:**
   "Build marked complete.
    Deliverable: build/build-log.md
    Pipeline modules: ingest, interpret, validate, output
    Next phase: validate
    Run: /c2l-validate {slug}"
