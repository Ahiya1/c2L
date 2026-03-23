---
description: Show client engagement status overview
argument-hint: [client-slug]
allowed-tools: [Read, Glob, Grep, Bash]
---

# c2L Status - Engagement Overview

Display the current state of all client engagements, or show detailed status for a specific client. This is a read-only command -- it never modifies any files.

## Usage

```
/c2l-status                  # Overview of all clients
/c2l-status <client-slug>    # Detailed status for one client
```

## What This Shows

### All Clients Mode (no arguments)
- List of all client engagements with current phase
- Summary counts (total, active, complete)
- Next step suggestions

### Single Client Mode (with slug)
- Client contact information
- Current phase with start date
- Phase completion history with dates
- Volume metrics
- Pipeline status (document types, accuracy)
- Notes

---

## Orchestration Logic

### If No Arguments: Show All Clients

Scan all `clients/*/client.yaml` files and present an overview.

```bash
# Find all client directories (exclude _templates and hidden)
CLIENT_COUNT=0
ACTIVE_COUNT=0
COMPLETE_COUNT=0

echo "c2L Client Engagements"
echo "======================"
echo ""

for dir in clients/*/; do
  SLUG=$(basename "$dir")
  if [[ "$SLUG" == _* ]] || [[ "$SLUG" == .* ]]; then
    continue
  fi

  if [ -f "$dir/client.yaml" ]; then
    CLIENT_COUNT=$((CLIENT_COUNT + 1))

    NAME=$(grep "  name:" "$dir/client.yaml" | head -1 | sed 's/.*: "\(.*\)"/\1/')
    PHASE=$(grep "current_phase:" "$dir/client.yaml" | awk '{print $2}')
    STARTED=$(grep "phase_started:" "$dir/client.yaml" | awk '{print $2}')

    # Count active vs complete
    if [ "$PHASE" = "complete" ]; then
      COMPLETE_COUNT=$((COMPLETE_COUNT + 1))
      STATUS_ICON="[DONE]"
    else
      ACTIVE_COUNT=$((ACTIVE_COUNT + 1))
      STATUS_ICON="[....]"
    fi

    # Phase display
    PHASE_UPPER=$(echo "$PHASE" | tr '[:lower:]' '[:upper:]')

    echo "  $STATUS_ICON $NAME ($SLUG)"
    echo "         Phase: $PHASE_UPPER (since $STARTED)"

    # Show phase-specific context
    case "$PHASE" in
      explore)
        HAS_REPORT=false
        [ -s "$dir/exploration/exploration-report.md" ] && HAS_REPORT=true
        echo "         Exploration report: $([ $HAS_REPORT = true ] && echo 'In progress' || echo 'Not started')"
        ;;
      plan)
        HAS_DESIGN=false
        [ -s "$dir/plan/solution-design.md" ] && HAS_DESIGN=true
        echo "         Solution design: $([ $HAS_DESIGN = true ] && echo 'In progress' || echo 'Not started')"
        ;;
      build)
        MODULE_COUNT=$(find "$dir/pipeline" -type f 2>/dev/null | wc -l)
        echo "         Pipeline files: $MODULE_COUNT"
        ;;
      validate)
        HAS_METRICS=false
        [ -s "$dir/validation/metrics.yaml" ] && HAS_METRICS=true
        echo "         Metrics: $([ $HAS_METRICS = true ] && echo 'Available' || echo 'Not yet')"
        ;;
      heal)
        HEAL_COUNT=$(ls -d "$dir/healing/healing-"* 2>/dev/null | wc -l)
        echo "         Healing iterations: $HEAL_COUNT"
        ;;
      deliver)
        DOCS=$(ls "$dir/delivery/"*.md 2>/dev/null | wc -l)
        echo "         Delivery docs: $DOCS/4"
        ;;
      complete)
        FIELD_ACC=$(grep "field_level:" "$dir/client.yaml" | tail -1 | awk '{print $2}')
        [ "$FIELD_ACC" != "null" ] && [ -n "$FIELD_ACC" ] && echo "         Final accuracy: ${FIELD_ACC}"
        ;;
    esac
    echo ""
  fi
done

if [ $CLIENT_COUNT -eq 0 ]; then
  echo "  No client engagements found."
  echo ""
  echo "  Get started:"
  echo "    /c2l-explore new     Start a new client engagement"
else
  echo "----------------------"
  echo "Total: $CLIENT_COUNT  |  Active: $ACTIVE_COUNT  |  Complete: $COMPLETE_COUNT"
  echo ""
  echo "Next Steps:"
  echo "  /c2l-explore new          Start new client engagement"
  echo "  /c2l-{phase} {slug}       Continue working on a client"
fi
```

### If Client Slug Provided: Show Detailed Status

Read the full `client.yaml` and present all details.

```bash
CLIENT_DIR="clients/$ARGUMENTS"

if [ ! -d "$CLIENT_DIR" ]; then
  echo "Client not found: $ARGUMENTS"
  echo ""
  echo "Available clients:"
  for dir in clients/*/; do
    SLUG=$(basename "$dir")
    [[ "$SLUG" == _* ]] || [[ "$SLUG" == .* ]] && continue
    [ -f "$dir/client.yaml" ] && echo "  $SLUG"
  done
  exit 1
fi

if [ ! -f "$CLIENT_DIR/client.yaml" ]; then
  echo "No client.yaml found in: $CLIENT_DIR"
  exit 1
fi

# Read all fields from client.yaml
echo "Client Details"
echo "=============="
echo ""

# Client info
NAME=$(grep "  name:" "$CLIENT_DIR/client.yaml" | head -1 | sed 's/.*: "\(.*\)"/\1/')
NAME_HE=$(grep "name_he:" "$CLIENT_DIR/client.yaml" | sed 's/.*: "\(.*\)"/\1/')
SLUG=$(grep "slug:" "$CLIENT_DIR/client.yaml" | awk '{print $2}')
CONTACT=$(grep "contact:" "$CLIENT_DIR/client.yaml" | sed 's/.*: "\(.*\)"/\1/')
PHONE=$(grep "phone:" "$CLIENT_DIR/client.yaml" | sed 's/.*: "\(.*\)"/\1/')
EMAIL=$(grep "email:" "$CLIENT_DIR/client.yaml" | sed 's/.*: "\(.*\)"/\1/')
LOCATION=$(grep "location:" "$CLIENT_DIR/client.yaml" | sed 's/.*: "\(.*\)"/\1/')
SIZE=$(grep "size:" "$CLIENT_DIR/client.yaml" | sed 's/.*: "\(.*\)"/\1/')
CREATED=$(grep "created:" "$CLIENT_DIR/client.yaml" | head -1 | awk '{print $2}')

echo "  Name:     $NAME ($NAME_HE)"
echo "  Slug:     $SLUG"
echo "  Contact:  $CONTACT"
echo "  Phone:    $PHONE"
echo "  Email:    $EMAIL"
echo "  Location: $LOCATION"
echo "  Size:     $SIZE"
echo "  Created:  $CREATED"
echo ""

# Engagement status
PHASE=$(grep "current_phase:" "$CLIENT_DIR/client.yaml" | awk '{print $2}')
PHASE_STARTED=$(grep "phase_started:" "$CLIENT_DIR/client.yaml" | awk '{print $2}')
PHASE_UPPER=$(echo "$PHASE" | tr '[:lower:]' '[:upper:]')

echo "Engagement"
echo "----------"
echo "  Current Phase: $PHASE_UPPER (since $PHASE_STARTED)"
echo ""

# Show completed phases
echo "  Completed Phases:"
# Parse phases_completed array from client.yaml
# Each entry has: phase, started, completed, deliverable
grep -A3 "  - phase:" "$CLIENT_DIR/client.yaml" 2>/dev/null | while read -r line; do
  case "$line" in
    *"- phase:"*) PNAME=$(echo "$line" | awk '{print $3}') ;;
    *"completed:"*) PDATE=$(echo "$line" | awk '{print $2}'); echo "    $PNAME: completed $PDATE" ;;
  esac
done

echo ""

# Volume metrics
SHIPMENTS=$(grep "shipments_per_month:" "$CLIENT_DIR/client.yaml" | awk '{print $2}')
DOCS_PER=$(grep "documents_per_shipment:" "$CLIENT_DIR/client.yaml" | awk '{print $2}')
CLERKS=$(grep "clerks:" "$CLIENT_DIR/client.yaml" | head -1 | awk '{print $2}')
ANNUAL_COST=$(grep "estimated_annual_clerk_cost:" "$CLIENT_DIR/client.yaml" | awk '{print $2}')

echo "Volume Metrics"
echo "--------------"
echo "  Shipments/month:    $SHIPMENTS"
echo "  Documents/shipment: $DOCS_PER"
echo "  Clerks:             $CLERKS"
echo "  Annual clerk cost:  $ANNUAL_COST NIS"
echo ""

# Pipeline status
echo "Pipeline"
echo "--------"
DOC_TYPES=$(grep -A20 "document_types:" "$CLIENT_DIR/client.yaml" | grep "    -" | sed 's/.*- /  /')
if [ -n "$DOC_TYPES" ]; then
  echo "  Document types:"
  echo "$DOC_TYPES"
else
  echo "  Document types: not defined yet"
fi

FIELD_TARGET=$(grep -A2 "accuracy_targets:" "$CLIENT_DIR/client.yaml" | grep "field_level:" | awk '{print $2}')
DOC_TARGET=$(grep -A2 "accuracy_targets:" "$CLIENT_DIR/client.yaml" | grep "document_level:" | tail -1 | awk '{print $2}')
FIELD_CURRENT=$(grep -A4 "current_accuracy:" "$CLIENT_DIR/client.yaml" | grep "field_level:" | tail -1 | awk '{print $2}')
DOC_CURRENT=$(grep -A4 "current_accuracy:" "$CLIENT_DIR/client.yaml" | grep "document_level:" | tail -1 | awk '{print $2}')

echo "  Accuracy targets:  field=${FIELD_TARGET}, document=${DOC_TARGET}"
echo "  Current accuracy:  field=${FIELD_CURRENT}, document=${DOC_CURRENT}"
echo ""

# Notes
NOTES=$(grep -A10 "^notes:" "$CLIENT_DIR/client.yaml" | tail -n +2 | sed 's/^  //')
if [ -n "$NOTES" ]; then
  echo "Notes"
  echo "-----"
  echo "$NOTES"
  echo ""
fi

# Next step suggestion
echo "Next Step"
echo "---------"
case "$PHASE" in
  explore)  echo "  /c2l-explore $SLUG     Continue exploration" ;;
  plan)     echo "  /c2l-plan $SLUG        Continue planning" ;;
  build)    echo "  /c2l-build $SLUG       Continue building" ;;
  validate) echo "  /c2l-validate $SLUG    Continue validation" ;;
  heal)     echo "  /c2l-heal $SLUG        Continue healing" ;;
  deliver)  echo "  /c2l-deliver $SLUG     Continue delivery" ;;
  complete) echo "  Engagement complete. No further action needed." ;;
esac
```

Now showing engagement status...
