---
description: Deploy working system and hand off to client
argument-hint: <client-slug>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# c2L Deliver - Handoff and Deployment

Deploy the validated pipeline and hand off the working system to the client. Generate delivery documentation, guide the deployment process, and mark the engagement as complete.

## Usage

```
/c2l-deliver <client-slug>     # Start delivery for a client
/c2l-deliver                   # List available clients
```

## What This Does

Opens a delivery session where you and Ahiya package the pipeline for deployment, create user-facing documentation, and prepare the handoff checklist. This is the final phase -- it produces everything the client needs to operate the system independently and marks the engagement as complete.

## Prerequisites

Validation must have passed (directly or after healing). Required artifacts:
- `clients/{slug}/validation/validation-report.md` with passing metrics
- OR `clients/{slug}/healing/healing-{N}/metrics.yaml` with passing metrics
- `client.yaml` engagement phase is `deliver`

## Outputs

All files created under `clients/{slug}/delivery/`:
- `deployment-guide.md` -- How the system is deployed and configured
- `user-guide.md` -- How to use the system day-to-day
- `operations-guide.md` -- Monitoring, troubleshooting, escalation
- `handoff-checklist.md` -- Verified checklist of everything transferred

## Phase Completion Criteria

- [ ] Deployment guide covers installation and configuration
- [ ] User guide covers daily operation
- [ ] Operations guide covers troubleshooting and escalation
- [ ] Handoff checklist is complete and verified
- [ ] Client has received all documentation
- [ ] Engagement marked as complete in client.yaml

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

# Phase must be 'deliver'
if [ "$CURRENT_PHASE" != "deliver" ]; then
  echo "Current phase is: $CURRENT_PHASE (expected: deliver)"
  echo ""
  case "$CURRENT_PHASE" in
    explore|plan|build)
      echo "Complete the $CURRENT_PHASE phase first:"
      echo "  /c2l-$CURRENT_PHASE $SLUG"
      ;;
    validate)
      echo "Complete validation first: /c2l-validate $SLUG"
      ;;
    heal)
      echo "Complete healing first: /c2l-heal $SLUG"
      ;;
    complete)
      echo "This engagement is already complete."
      echo "Run /c2l-status $SLUG to see details."
      ;;
  esac
  exit 1
fi

# Verify passing validation or healing metrics exist
VALIDATION_PASSED=false

# Check direct validation pass
if [ -f "$CLIENT_DIR/validation/metrics.yaml" ]; then
  VERDICT=$(grep "verdict:" "$CLIENT_DIR/validation/metrics.yaml" | awk '{print $2}')
  [ "$VERDICT" = "pass" ] && VALIDATION_PASSED=true
fi

# Check healing pass (most recent healing iteration)
if [ "$VALIDATION_PASSED" = "false" ]; then
  LATEST_HEALING=$(ls -d "$CLIENT_DIR/healing/healing-"* 2>/dev/null | sort -V | tail -1)
  if [ -n "$LATEST_HEALING" ] && [ -f "$LATEST_HEALING/metrics.yaml" ]; then
    VERDICT=$(grep "verdict:" "$LATEST_HEALING/metrics.yaml" | awk '{print $2}' | tr '[:upper:]' '[:lower:]')
    [ "$VERDICT" = "pass" ] && VALIDATION_PASSED=true
  fi
fi

if [ "$VALIDATION_PASSED" = "false" ]; then
  echo "No passing validation or healing metrics found."
  echo "Pipeline must meet accuracy targets before delivery."
  echo ""
  echo "Run /c2l-validate $SLUG or /c2l-heal $SLUG first."
  exit 1
fi
```

### Step 3: Session Resumption

Read the current state of delivery artifacts:

```bash
CLIENT_DIR="clients/$SLUG"
CLIENT_NAME=$(grep "  name:" "$CLIENT_DIR/client.yaml" | head -1 | sed 's/.*: "\(.*\)"/\1/')

echo "Delivery session for: $CLIENT_NAME"

HAS_DEPLOY=false; HAS_USER=false; HAS_OPS=false; HAS_HANDOFF=false

[ -s "$CLIENT_DIR/delivery/deployment-guide.md" ] && HAS_DEPLOY=true
[ -s "$CLIENT_DIR/delivery/user-guide.md" ] && HAS_USER=true
[ -s "$CLIENT_DIR/delivery/operations-guide.md" ] && HAS_OPS=true
[ -s "$CLIENT_DIR/delivery/handoff-checklist.md" ] && HAS_HANDOFF=true

echo "Progress:"
echo "  Deployment guide:   $([ $HAS_DEPLOY = true ] && echo 'Written' || echo 'Not started')"
echo "  User guide:         $([ $HAS_USER = true ] && echo 'Written' || echo 'Not started')"
echo "  Operations guide:   $([ $HAS_OPS = true ] && echo 'Written' || echo 'Not started')"
echo "  Handoff checklist:  $([ $HAS_HANDOFF = true ] && echo 'Written' || echo 'Not started')"
```

Read exploration report and validation results for context:
```bash
head -30 "$CLIENT_DIR/exploration/exploration-report.md"
cat "$CLIENT_DIR/validation/metrics.yaml"
```

### Step 4: Cooperative Delivery

Guide Ahiya through creating each delivery artifact:

**A. Deployment Guide** -- `delivery/deployment-guide.md`
- How to install and configure the pipeline
- System requirements (Python version, dependencies, API keys)
- Configuration file reference
- How to run the pipeline (command line, scheduled task, integration hook)
- Environment-specific notes (client's actual infrastructure)

**B. User Guide** -- `delivery/user-guide.md`
- Daily workflow: how to feed documents into the pipeline
- How to review pipeline output
- How to handle flagged documents (low confidence, validation failures)
- Common scenarios and their expected behavior
- FAQ for the client team

**C. Operations Guide** -- `delivery/operations-guide.md`
- Monitoring: how to check the system is working
- Troubleshooting: common issues and how to fix them
- Performance: expected processing times
- Escalation: when and how to contact Ahiya
- Known limitations from validation/healing phases
- 30-day support window details

**D. Handoff Checklist** -- `delivery/handoff-checklist.md`
```markdown
# Handoff Checklist: {CLIENT_NAME}
# Date: {DATE}

## System Delivery
- [ ] Pipeline code delivered to client environment
- [ ] Configuration set for client's specific setup
- [ ] Pipeline tested in client environment
- [ ] Pipeline processing real documents successfully

## Documentation Delivery
- [ ] Deployment guide provided
- [ ] User guide provided
- [ ] Operations guide provided
- [ ] Exploration report provided

## Knowledge Transfer
- [ ] Training session conducted with client team
- [ ] Client team can run pipeline independently
- [ ] Client team knows how to handle flagged documents
- [ ] Client team knows escalation procedure

## Support Agreement
- [ ] 30-day bug-fix window started: {DATE}
- [ ] 30-day window ends: {DATE}
- [ ] Emergency contact shared
- [ ] Support scope agreed (bugs only, no new features)

## Final Metrics
- Field-level accuracy: {N}%
- Document-level accuracy: {N}%
- Document types covered: {list}
- Processing time per shipment: {N} seconds

## Sign-Off
- [ ] Client confirms system is operational
- [ ] Client confirms documentation is sufficient
- [ ] Engagement complete
```

### Step 5: Phase Completion

When Ahiya indicates delivery is complete:

1. **Validate all required artifacts exist:**
   - [ ] `delivery/deployment-guide.md` exists and is non-empty
   - [ ] `delivery/user-guide.md` exists and is non-empty
   - [ ] `delivery/operations-guide.md` exists and is non-empty
   - [ ] `delivery/handoff-checklist.md` exists and is non-empty

2. **If validation fails:**
   Report what is missing. Do NOT update client.yaml.

3. **If validation passes, update client.yaml:**
   - Set `engagement.current_phase: complete`
   - Append to `engagement.phases_completed`:
     ```yaml
     - phase: deliver
       started: {original_start_date}
       completed: {today}
       deliverable: delivery/handoff-checklist.md
     ```

4. **Confirm:**
   "Engagement complete for {client_name}.
    All delivery artifacts created.
    Phase: COMPLETE
    Run /c2l-status {slug} to see the full engagement summary."
