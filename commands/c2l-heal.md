---
description: Fix validation failures and improve pipeline accuracy
argument-hint: <client-slug>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# c2L Heal - Issue Resolution

Fix issues found during validation and iterate until accuracy targets are met. Each healing iteration addresses specific failure patterns, re-tests, and measures improvement. After 3 iterations without meeting targets, recommend scope adjustment with the client.

## Usage

```
/c2l-heal <client-slug>     # Start or continue healing for a client
/c2l-heal                   # List available clients
```

## What This Does

Opens a focused healing session where you and Ahiya systematically address validation failures. You read the failure analysis, prioritize issues by impact, fix the pipeline, re-test on the failing documents, and measure whether accuracy improved. Each iteration is tracked in its own directory.

## Prerequisites

Validation phase must have failures. Required artifacts:
- `clients/{slug}/validation/failure-analysis.md` (non-empty)
- `clients/{slug}/validation/metrics.yaml` (non-empty)
- `client.yaml` engagement phase is `heal`

## Outputs

For each healing iteration N, created under `clients/{slug}/`:
- `healing/healing-{N}/healing-report.md` -- What was fixed and what improved
- `healing/healing-{N}/metrics.yaml` -- Updated accuracy metrics after fixes
- Updated pipeline code

## Phase Completion Criteria

- [ ] Accuracy targets met after healing, OR
- [ ] Scope adjustment agreed with client after 3 iterations
- [ ] Healing report documents all changes made

## Next Step

When accuracy targets are met:
```
/c2l-deliver <client-slug>
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

# Phase must be 'heal'
if [ "$CURRENT_PHASE" != "heal" ]; then
  echo "Current phase is: $CURRENT_PHASE (expected: heal)"
  echo ""
  if [ "$CURRENT_PHASE" = "validate" ]; then
    echo "Complete validation first: /c2l-validate $SLUG"
  else
    echo "Run /c2l-status $SLUG to see engagement state."
  fi
  exit 1
fi

# Verify failure analysis exists
if [ ! -f "$CLIENT_DIR/validation/failure-analysis.md" ] || [ ! -s "$CLIENT_DIR/validation/failure-analysis.md" ]; then
  echo "Missing failure analysis: validation/failure-analysis.md"
  echo "Re-run validation with failure analysis: /c2l-validate $SLUG"
  exit 1
fi
```

### Step 3: Determine Healing Iteration

```bash
CLIENT_DIR="clients/$SLUG"

# Count existing healing iterations
ITERATION=1
while [ -d "$CLIENT_DIR/healing/healing-$ITERATION" ]; do
  ITERATION=$((ITERATION + 1))
done

# Check iteration limit
if [ $ITERATION -gt 3 ]; then
  echo "WARNING: 3 healing iterations completed without meeting targets."
  echo ""
  echo "Recommendation: Discuss scope adjustment with the client."
  echo "Options:"
  echo "  1. Reduce accuracy targets for difficult document types"
  echo "  2. Remove problematic document types from v1 scope"
  echo "  3. Add additional training data for edge cases"
  echo "  4. Accept current accuracy and proceed to delivery"
  echo ""
  echo "If Ahiya decides to proceed anyway, override by creating:"
  echo "  healing/healing-$ITERATION/ directory manually."
  exit 0
fi

echo "Healing iteration: $ITERATION of 3 maximum"
```

### Step 4: Session Resumption

```bash
CLIENT_DIR="clients/$SLUG"
CLIENT_NAME=$(grep "  name:" "$CLIENT_DIR/client.yaml" | head -1 | sed 's/.*: "\(.*\)"/\1/')

echo "Healing session for: $CLIENT_NAME (iteration $ITERATION)"

# Show current accuracy vs targets
echo ""
echo "Current accuracy (from last validation/healing):"
cat "$CLIENT_DIR/validation/metrics.yaml" | grep -A4 "accuracy:"

echo ""
echo "Targets:"
cat "$CLIENT_DIR/plan/accuracy-targets.md" | head -20
```

Read the failure analysis:
```bash
cat "$CLIENT_DIR/validation/failure-analysis.md"
```

If previous healing iterations exist, read the most recent healing report:
```bash
PREV=$((ITERATION - 1))
if [ -f "$CLIENT_DIR/healing/healing-$PREV/healing-report.md" ]; then
  echo "Previous healing report:"
  cat "$CLIENT_DIR/healing/healing-$PREV/healing-report.md"
fi
```

### Step 5: Cooperative Healing

Create the healing iteration directory:
```bash
mkdir -p "clients/$SLUG/healing/healing-$ITERATION"
```

Guide Ahiya through the healing process:

**A. Prioritize failures** -- "Which failures have the biggest impact?"
- Review the failure analysis categories
- Rank by: frequency (most common first), impact (costly errors first), fixability (quick wins first)
- Agree with Ahiya on the top 3-5 issues to address this iteration

**B. Fix pipeline code** -- "Address each failure pattern"
- For each prioritized failure:
  - Identify the root cause (prompt issue, parsing error, format variation, OCR quality)
  - Implement the fix in the appropriate pipeline module
  - Test the fix on the specific failing documents
  - Document the change

**C. Regression test** -- "Make sure fixes do not break what was working"
- Re-run pipeline on previously passing documents
- Verify no regressions

**D. Re-measure accuracy** -- "Calculate updated metrics"
- Run pipeline on the full validation batch (or a representative subset)
- Measure updated field-level and document-level accuracy
- Compare to previous metrics

**E. Produce healing report** -- `healing/healing-{N}/healing-report.md`:
```markdown
# Healing Report: Iteration {N}
# Date: {DATE}
# Client: {CLIENT_NAME}

## Issues Addressed

1. **{Issue}**: {Description of root cause and fix}
2. **{Issue}**: {Description of root cause and fix}

## Accuracy Before

- Field-level: {previous}%
- Document-level: {previous}%

## Accuracy After

- Field-level: {new}%
- Document-level: {new}%

## Improvement

- Field-level: +{delta}%
- Document-level: +{delta}%

## Remaining Issues

{Issues not yet addressed, if any}

## Verdict

{PASS: targets met | FAIL: still below targets | SCOPE_ADJUSTMENT: recommend changes}
```

Create `healing/healing-{N}/metrics.yaml` with updated accuracy data.

### Step 6: Phase Completion

After the healing iteration:

1. **Check if accuracy targets are now met:**
   - Read targets from `plan/accuracy-targets.md`
   - Compare to new metrics

2. **If targets MET, update client.yaml:**
   - Set `engagement.current_phase: deliver`
   - Set `engagement.phase_started` to today's date
   - Update `pipeline.current_accuracy` with new values
   - Append to `engagement.phases_completed`:
     ```yaml
     - phase: heal
       started: {original_start_date}
       completed: {today}
       deliverable: healing/healing-{N}/healing-report.md
     ```
   - "Healing complete. Accuracy targets met.
      Field: {measured}% (target: {target}%)
      Document: {measured}% (target: {target}%)
      Next: /c2l-deliver {slug}"

3. **If targets NOT met:**
   - Keep `engagement.current_phase: heal`
   - "Iteration {N} complete. Accuracy improved but targets not yet met.
      Field: {measured}% (target: {target}%)
      Document: {measured}% (target: {target}%)
      Run /c2l-heal {slug} for iteration {N+1}."
   - If N reaches 3: Show the scope adjustment recommendation (see Step 3).
