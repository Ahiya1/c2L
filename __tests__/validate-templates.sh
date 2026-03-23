#!/bin/bash
# __tests__/validate-templates.sh
# Validates template files have correct structure and required sections.

# Resolve repo root relative to this script's location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATES_DIR="$REPO_ROOT/clients/_templates"

PASS=0
FAIL=0
ERRORS=""

echo "Validating c2L template files..."
echo ""

# Check templates directory exists
if [ ! -d "$TEMPLATES_DIR" ]; then
  echo "FAIL: clients/_templates/ directory does not exist"
  echo "Results: 0 passed, 1 failed"
  exit 1
fi

# Check required template files exist and are non-empty
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
    ERRORS="$ERRORS\nFAIL: Missing template: $TPL"
    continue
  fi

  if [ ! -s "$FILE" ]; then
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Empty template: $TPL"
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
    if grep -qi "$SECTION" "$REPORT"; then
      PASS=$((PASS + 1))
    else
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: exploration-report.md missing section: $SECTION"
    fi
  done

  # Check for table structures (pipe characters indicate tables)
  TABLE_COUNT=$(grep -c "|.*|.*|" "$REPORT" || true)
  if [ "$TABLE_COUNT" -ge 5 ]; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: exploration-report.md has fewer than 5 table rows (found $TABLE_COUNT)"
  fi

  # Check for Hebrew content in glossary
  if grep -q "שטר מטען\|חשבונית\|מכס" "$REPORT"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: exploration-report.md missing Hebrew terminology in glossary"
  fi

  # Check for placeholder syntax
  if grep -q "{CLIENT_NAME}" "$REPORT"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: exploration-report.md missing {CLIENT_NAME} placeholder"
  fi

  # Check for Appendix section
  if grep -qi "Appendix" "$REPORT"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: exploration-report.md missing Appendix section"
  fi
fi

# Validate document-inventory.md has required sections
INVENTORY="$TEMPLATES_DIR/document-inventory.md"
if [ -f "$INVENTORY" ]; then
  for SECTION in "Core Documents" "Conditional Documents" "Document Relationships"; do
    if grep -qi "$SECTION" "$INVENTORY"; then
      PASS=$((PASS + 1))
    else
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: document-inventory.md missing section: $SECTION"
    fi
  done

  # Check for field extraction structure
  if grep -qi "Key fields to extract" "$INVENTORY"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: document-inventory.md missing field extraction structure"
  fi
fi

# Validate workflow-map.md has required sections
WORKFLOW="$TEMPLATES_DIR/workflow-map.md"
if [ -f "$WORKFLOW" ]; then
  for SECTION in "Step-by-Step Process" "Decision Points" "Handoff Points"; do
    if grep -qi "$SECTION" "$WORKFLOW"; then
      PASS=$((PASS + 1))
    else
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: workflow-map.md missing section: $SECTION"
    fi
  done

  # Check for step structure elements
  if grep -q "Who:" "$WORKFLOW" && grep -q "Action:" "$WORKFLOW" && grep -q "Time:" "$WORKFLOW"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: workflow-map.md missing step structure (Who/Action/Time)"
  fi
fi

echo "Results: $PASS passed, $FAIL failed"
if [ $FAIL -gt 0 ]; then
  echo ""
  echo "Failures:"
  echo -e "$ERRORS"
  exit 1
fi
echo "All template validations passed."
