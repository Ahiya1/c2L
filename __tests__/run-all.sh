#!/bin/bash
# __tests__/run-all.sh
# Runs all c2L validation tests and reports a summary.

# Resolve paths relative to this script's location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=================================="
echo "c2L Plugin Validation Suite"
echo "=================================="
echo ""

TOTAL_PASS=0
TOTAL_FAIL=0
RESULTS=""

# Run each test suite
for TEST in "$SCRIPT_DIR"/validate-*.sh; do
  TEST_NAME="$(basename "$TEST")"
  echo "--- Running: $TEST_NAME ---"
  bash "$TEST"
  EXIT_CODE=$?
  if [ $EXIT_CODE -ne 0 ]; then
    TOTAL_FAIL=$((TOTAL_FAIL + 1))
    RESULTS="$RESULTS\n  FAIL: $TEST_NAME"
  else
    TOTAL_PASS=$((TOTAL_PASS + 1))
    RESULTS="$RESULTS\n  PASS: $TEST_NAME"
  fi
  echo ""
done

echo "=================================="
echo "Summary: $TOTAL_PASS suites passed, $TOTAL_FAIL suites failed"
echo -e "$RESULTS"
echo "=================================="

if [ $TOTAL_FAIL -gt 0 ]; then
  exit 1
fi
echo ""
echo "All validation suites passed."
