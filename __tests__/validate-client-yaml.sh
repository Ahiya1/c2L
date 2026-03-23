#!/bin/bash
# __tests__/validate-client-yaml.sh
# Validates client.yaml template has correct schema and required fields.

# Resolve repo root relative to this script's location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CLIENT_YAML="$REPO_ROOT/clients/_templates/client.yaml"

PASS=0
FAIL=0
ERRORS=""

echo "Validating client.yaml schema..."
echo ""

if [ ! -f "$CLIENT_YAML" ]; then
  echo "FAIL: client.yaml template not found at $CLIENT_YAML"
  echo "Results: 0 passed, 1 failed"
  exit 1
fi

# Check YAML is parseable (with Python if available, otherwise basic checks)
YAML_VALID=false
if command -v python3 >/dev/null 2>&1; then
  python3 -c "
import yaml, sys
try:
    with open('$CLIENT_YAML') as f:
        data = yaml.safe_load(f)
    if data is None:
        print('FAIL: YAML parsed but is empty')
        sys.exit(1)
    print('PASS: YAML is valid and parseable')
    sys.exit(0)
except yaml.YAMLError as e:
    print(f'FAIL: YAML parse error: {e}')
    sys.exit(1)
except Exception as e:
    print(f'FAIL: Error reading file: {e}')
    sys.exit(1)
" 2>/dev/null
  if [ $? -eq 0 ]; then
    PASS=$((PASS + 1))
    YAML_VALID=true
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: client.yaml is not valid YAML (Python parse failed)"
  fi
else
  echo "WARN: Python3 not available, skipping YAML parse validation"
  echo "      Using basic grep-based validation only"
  YAML_VALID=true
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

# Check required client fields (indented under client:)
CLIENT_FIELDS=(
  "name:"
  "name_he:"
  "slug:"
  "contact:"
  "phone:"
  "email:"
  "location:"
  "size:"
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
# The comment should list all valid phase values
if grep -q "explore" "$CLIENT_YAML" && grep -q "complete" "$CLIENT_YAML"; then
  PASS=$((PASS + 1))
else
  FAIL=$((FAIL + 1))
  ERRORS="$ERRORS\nFAIL: Valid phase values not documented in client.yaml"
fi

# Check all valid phases are mentioned (in comment or value)
for PHASE in explore plan build validate heal deliver complete; do
  if grep -q "$PHASE" "$CLIENT_YAML"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Phase '$PHASE' not mentioned in client.yaml"
  fi
done

# Check volumes fields
VOLUME_FIELDS=(
  "shipments_per_month:"
  "documents_per_shipment:"
  "clerks:"
  "estimated_annual_clerk_cost:"
)

for FIELD in "${VOLUME_FIELDS[@]}"; do
  if grep -q "  $FIELD" "$CLIENT_YAML"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Missing volumes field: $FIELD"
  fi
done

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

# Check accuracy sub-fields
for FIELD in "field_level:" "document_level:"; do
  COUNT=$(grep -c "    $FIELD" "$CLIENT_YAML" || true)
  if [ "$COUNT" -ge 2 ]; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Expected $FIELD to appear in both accuracy_targets and current_accuracy (found $COUNT)"
  fi
done

# Check that comments exist (inline documentation)
COMMENT_COUNT=$(grep -c "^  #\|^    #\|# " "$CLIENT_YAML" || true)
if [ "$COMMENT_COUNT" -ge 5 ]; then
  PASS=$((PASS + 1))
else
  FAIL=$((FAIL + 1))
  ERRORS="$ERRORS\nFAIL: client.yaml has fewer than 5 comments (found $COMMENT_COUNT) -- needs inline documentation"
fi

echo "Results: $PASS passed, $FAIL failed"
if [ $FAIL -gt 0 ]; then
  echo ""
  echo "Failures:"
  echo -e "$ERRORS"
  exit 1
fi
echo "All client.yaml schema validations passed."
