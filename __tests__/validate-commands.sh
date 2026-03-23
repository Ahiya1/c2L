#!/bin/bash
# __tests__/validate-commands.sh
# Validates all command files have correct structure.
# This script validates Builder 2's output (command files).
# It is expected to fail if commands/ does not exist yet.

# Resolve repo root relative to this script's location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
COMMANDS_DIR="$REPO_ROOT/commands"

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

# Check commands directory exists
if [ ! -d "$COMMANDS_DIR" ]; then
  echo "FAIL: commands/ directory does not exist"
  echo "Results: 0 passed, 1 failed"
  exit 1
fi

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
    ERRORS="$ERRORS\nFAIL: $CMD.md missing frontmatter (first line must be ---)"
    continue
  fi

  # Extract frontmatter (between first and second ---)
  FRONTMATTER=$(sed -n '2,/^---$/p' "$FILE" | head -n -1)

  # Check description field
  if echo "$FRONTMATTER" | grep -q "^description:"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: $CMD.md missing 'description' in frontmatter"
  fi

  # Check allowed-tools field
  if echo "$FRONTMATTER" | grep -q "^allowed-tools:"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: $CMD.md missing 'allowed-tools' in frontmatter"
  fi

  # Check required body sections (all phase commands except status)
  if [ "$CMD" != "c2l-status" ]; then
    # Check for Usage section
    if grep -q "^## Usage" "$FILE"; then
      PASS=$((PASS + 1))
    else
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: $CMD.md missing '## Usage' section"
    fi

    # Check for Prerequisites section
    if grep -q "^## Prerequisites" "$FILE"; then
      PASS=$((PASS + 1))
    else
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: $CMD.md missing '## Prerequisites' section"
    fi

    # Check for Orchestration Logic section
    if grep -q "^## Orchestration Logic" "$FILE"; then
      PASS=$((PASS + 1))
    else
      FAIL=$((FAIL + 1))
      ERRORS="$ERRORS\nFAIL: $CMD.md missing '## Orchestration Logic' section"
    fi

    # Check for Next Step section (except deliver which is the last phase)
    if [ "$CMD" != "c2l-deliver" ]; then
      if grep -q "^## Next Step" "$FILE"; then
        PASS=$((PASS + 1))
      else
        FAIL=$((FAIL + 1))
        ERRORS="$ERRORS\nFAIL: $CMD.md missing '## Next Step' section"
      fi
    fi
  fi

  # Check file is non-trivial (at least 50 lines)
  LINE_COUNT=$(wc -l < "$FILE")
  if [ "$LINE_COUNT" -lt 50 ]; then
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\nFAIL: $CMD.md is only $LINE_COUNT lines (expected at least 50)"
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
