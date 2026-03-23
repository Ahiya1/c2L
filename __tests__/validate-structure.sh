#!/bin/bash
# __tests__/validate-structure.sh
# Validates the overall c2L plugin directory structure.

# Resolve repo root relative to this script's location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

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
  if [ -d "$REPO_ROOT/$DIR" ]; then
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
  if [ -f "$REPO_ROOT/$FILE" ]; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: Missing file: $FILE"
  fi
done

# Validate plugin.json is valid JSON with correct name
if [ -f "$REPO_ROOT/.claude-plugin/plugin.json" ]; then
  if command -v python3 >/dev/null 2>&1; then
    RESULT=$(python3 -c "
import json, sys
try:
    with open('$REPO_ROOT/.claude-plugin/plugin.json') as f:
        data = json.load(f)
    if 'name' not in data:
        print('FAIL: plugin.json missing name field')
        sys.exit(1)
    if data['name'] != 'c2l':
        print('FAIL: plugin.json name is \"' + str(data['name']) + '\", expected \"c2l\"')
        sys.exit(1)
    if 'version' not in data:
        print('FAIL: plugin.json missing version field')
        sys.exit(1)
    if 'description' not in data:
        print('FAIL: plugin.json missing description field')
        sys.exit(1)
    print('PASS: plugin.json is valid')
    sys.exit(0)
except json.JSONDecodeError as e:
    print('FAIL: plugin.json is not valid JSON: ' + str(e))
    sys.exit(1)
" 2>/dev/null)
    if [ $? -eq 0 ]; then
      PASS=$((PASS + 1))
    else
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\n$RESULT"
    fi
  else
    # Fallback: basic grep checks
    if grep -q '"name"' "$REPO_ROOT/.claude-plugin/plugin.json" && \
       grep -q '"c2l"' "$REPO_ROOT/.claude-plugin/plugin.json"; then
      PASS=$((PASS + 1))
    else
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: plugin.json basic validation failed (no python3 for full check)"
    fi
  fi
fi

# Validate .gitignore has essential rules
GITIGNORE="$REPO_ROOT/clients/.gitignore"
if [ -f "$GITIGNORE" ]; then
  # Check for samples exclusion
  if grep -q "samples" "$GITIGNORE"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: .gitignore missing samples/ exclusion"
  fi

  # Check for binary exclusions
  if grep -q "\.pdf" "$GITIGNORE"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: .gitignore missing .pdf exclusion"
  fi

  # Check for template inclusion (negation pattern)
  if grep -q "!_templates" "$GITIGNORE"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: .gitignore missing _templates/ inclusion (negation pattern)"
  fi

  # Check for markdown inclusion
  if grep -q "!.*\.md" "$GITIGNORE"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: .gitignore missing *.md inclusion (negation pattern)"
  fi

  # Check for yaml inclusion
  if grep -q "!.*\.yaml" "$GITIGNORE"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: .gitignore missing *.yaml inclusion (negation pattern)"
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
