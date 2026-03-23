---
description: Test pipeline on real data and measure accuracy
argument-hint: <client-slug>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# c2L Validate - Real-World Accuracy Testing

Test the pipeline on a production-scale batch of real client data. Measure accuracy against agreed targets and produce a validation report with a clear pass/fail verdict.

## Usage

```
/c2l-validate <client-slug>     # Validate pipeline for a client
/c2l-validate                   # List available clients
```

## What This Does

Runs the pipeline against a fresh batch of real client documents (not the training samples used during build). Compares output to ground truth, measures per-field and per-document accuracy, categorizes failures, and produces a comprehensive validation report. The result determines the next phase: deliver if passing, heal if failing.

## Prerequisites

Build phase must be complete. Required artifacts:
- `clients/{slug}/pipeline/` directory with code
- `clients/{slug}/plan/accuracy-targets.md` (non-empty)
- `client.yaml` engagement phase is `validate` or later

## Outputs

All files created under `clients/{slug}/`:
- `validation/validation-report.md` -- Comprehensive accuracy report, client-shareable
- `validation/results/` -- Per-document results with accuracy scores
- `validation/metrics.yaml` -- Machine-readable accuracy metrics
- `validation/failure-analysis.md` -- Categorized failure patterns (if accuracy below targets)

## Phase Completion Criteria

- [ ] Validation batch processed completely
- [ ] Per-field and per-document accuracy measured
- [ ] Validation report written with clear pass/fail verdict
- [ ] If failing: failure analysis produced with categorized patterns

## Next Step

If validation passes:
```
/c2l-deliver <client-slug>
```

If validation fails:
```
/c2l-heal <client-slug>
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

# Phase must be 'validate' or later (not explore, plan, or build)
case "$CURRENT_PHASE" in
  explore|plan|build)
    echo "Previous phases not yet complete."
    echo "Current phase: $CURRENT_PHASE"
    echo ""
    echo "Complete the $CURRENT_PHASE phase first:"
    echo "  /c2l-$CURRENT_PHASE $SLUG"
    exit 1
    ;;
esac

# Verify pipeline exists
if [ -z "$(find "$CLIENT_DIR/pipeline" -type f 2>/dev/null)" ]; then
  echo "No pipeline code found in pipeline/"
  echo "Complete the build phase first."
  exit 1
fi

# Verify accuracy targets exist
if [ ! -f "$CLIENT_DIR/plan/accuracy-targets.md" ] || [ ! -s "$CLIENT_DIR/plan/accuracy-targets.md" ]; then
  echo "Missing accuracy targets: plan/accuracy-targets.md"
  echo "Complete the plan phase first."
  exit 1
fi
```

### Step 3: Session Resumption

Read the current state of validation artifacts:

```bash
CLIENT_DIR="clients/$SLUG"
CLIENT_NAME=$(grep "  name:" "$CLIENT_DIR/client.yaml" | head -1 | sed 's/.*: "\(.*\)"/\1/')

echo "Validation session for: $CLIENT_NAME"

HAS_REPORT=false; HAS_RESULTS=false; HAS_METRICS=false; HAS_FAILURES=false

[ -s "$CLIENT_DIR/validation/validation-report.md" ] && HAS_REPORT=true
[ -n "$(find "$CLIENT_DIR/validation/results" -type f 2>/dev/null)" ] && HAS_RESULTS=true
[ -s "$CLIENT_DIR/validation/metrics.yaml" ] && HAS_METRICS=true
[ -s "$CLIENT_DIR/validation/failure-analysis.md" ] && HAS_FAILURES=true

echo "Progress:"
echo "  Validation report:  $([ $HAS_REPORT = true ] && echo 'Written' || echo 'Not started')"
echo "  Per-doc results:    $([ $HAS_RESULTS = true ] && echo 'Generated' || echo 'Not yet')"
echo "  Metrics:            $([ $HAS_METRICS = true ] && echo 'Calculated' || echo 'Not yet')"
echo "  Failure analysis:   $([ $HAS_FAILURES = true ] && echo 'Written' || echo 'N/A or not yet')"
```

Read the accuracy targets to ground the session:
```bash
cat "$CLIENT_DIR/plan/accuracy-targets.md"
```

### Step 4: Initialize Validation Environment

```bash
mkdir -p "clients/$SLUG/validation/results"
```

### Step 5: Cooperative Validation

Guide Ahiya through the validation process:

**A. Prepare validation batch** -- "We need fresh documents, not the training samples"
- Ask Ahiya to provide a batch of real documents (ideally 50-100 shipments)
- These should be placed in a temporary validation input directory
- Or run pipeline on documents Ahiya selects from `samples/`

**B. Run the pipeline** -- "Process the validation batch"
- Execute the pipeline on the validation documents
- Save per-document results to `validation/results/`
- Each result should include: document name, extracted fields, confidence scores

**C. Compare to ground truth** -- "Check accuracy against the real answers"
- Ahiya provides ground truth (what clerks would have entered)
- Or Ahiya manually reviews pipeline output for correctness
- Compare field by field, document by document

**D. Measure accuracy** -- "Calculate the numbers"
- Field-level accuracy: (correct fields / total fields) across all documents
- Document-level accuracy: (fully correct documents / total documents)
- Per-document-type breakdown
- Per-field breakdown (which fields have the most errors)

Create `validation/metrics.yaml`:
```yaml
validation:
  date: {DATE}
  batch_size: {N}
  document_types_tested: [{list}]
  accuracy:
    field_level: {decimal}
    document_level: {decimal}
  per_type:
    {document-type}:
      documents_tested: {N}
      field_accuracy: {decimal}
      document_accuracy: {decimal}
  per_field:
    {field-name}:
      correct: {N}
      total: {N}
      accuracy: {decimal}
  verdict: pass | fail
```

**E. Determine verdict** -- "Does it meet the targets?"
- Read targets from `plan/accuracy-targets.md`
- Compare measured accuracy to targets
- Verdict: PASS if both field-level and document-level meet targets, FAIL otherwise

**F. Produce validation report** -- `validation/validation-report.md`
- Executive summary with verdict
- Methodology (batch size, document types, comparison method)
- Results tables (overall, per-type, per-field)
- If FAIL: categorized failure patterns

**G. If failing, produce failure analysis** -- `validation/failure-analysis.md`
- Group failures by category (wrong field, missing field, OCR error, format variation)
- Rank by frequency and impact
- Identify root causes
- Suggest specific fixes for the heal phase

### Step 6: Phase Completion

When Ahiya indicates validation is complete:

1. **Validate all required artifacts exist:**
   - [ ] `validation/validation-report.md` exists and is non-empty
   - [ ] `validation/metrics.yaml` exists and is non-empty
   - [ ] Verdict is recorded in metrics.yaml

2. **If validation fails (items missing):**
   Report what is missing. Do NOT update client.yaml.

3. **If validation passes, update client.yaml:**

   Read the verdict from `validation/metrics.yaml`.

   **If verdict is PASS:**
   - Set `engagement.current_phase: deliver`
   - Set `engagement.phase_started` to today's date
   - Update `pipeline.current_accuracy` with measured values
   - Append to `engagement.phases_completed`:
     ```yaml
     - phase: validate
       started: {original_start_date}
       completed: {today}
       deliverable: validation/validation-report.md
     ```
   - "Validation PASSED. Accuracy meets targets.
      Next: /c2l-deliver {slug}"

   **If verdict is FAIL:**
   - Set `engagement.current_phase: heal`
   - Set `engagement.phase_started` to today's date
   - Update `pipeline.current_accuracy` with measured values
   - Append to `engagement.phases_completed`:
     ```yaml
     - phase: validate
       started: {original_start_date}
       completed: {today}
       deliverable: validation/validation-report.md
     ```
   - "Validation FAILED. Accuracy below targets.
      Field: {measured}% (target: {target}%)
      Document: {measured}% (target: {target}%)
      Failure analysis: validation/failure-analysis.md
      Next: /c2l-heal {slug}"
