---
description: Structured discovery of a client's document workflow
argument-hint: <client-slug> or "new"
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# c2L Explore - Structured Client Discovery

Guide a cooperative discovery session to understand a client's customs brokerage document workflow. This is the foundation of every engagement -- the exploration report has standalone value even if the client stops here.

## Usage

```
/c2l-explore new               # Start new client engagement
/c2l-explore <client-slug>     # Resume exploration for existing client
/c2l-explore                   # List available clients
```

## What This Does

Opens a structured discovery session where you and Ahiya cooperatively build a complete picture of a client's document workflow. You ask guided questions, Ahiya provides information from client meetings, and together you produce the exploration report, document inventory, and workflow map.

## Prerequisites

None. This is the first phase of every engagement.

## Outputs

All files created under `clients/{slug}/`:
- `exploration/exploration-report.md` -- Comprehensive, client-shareable discovery report
- `exploration/document-inventory.md` -- Catalog of all document types with samples
- `exploration/workflow-map.md` -- Step-by-step current manual process
- `client.yaml` -- Updated with client metadata and volume metrics
- `samples/` -- Directory structure for real client documents (added by Ahiya)

## Phase Completion Criteria

- [ ] All document types cataloged with at least 1 sample each
- [ ] Current workflow documented end-to-end
- [ ] Volume and cost metrics captured in client.yaml
- [ ] Feasibility assessment completed in exploration report
- [ ] Cost-benefit projection completed in exploration report

## Next Step

After exploration is complete, run:
```
/c2l-plan <client-slug>
```

---

## Orchestration Logic

### Step 1: Parse Arguments

The user provides `$ARGUMENTS` which is either:
- The word `new` to start a new client engagement
- A client slug (e.g., `abc-customs`) to resume exploration on an existing client
- Empty -- list all clients and ask which one to work on

**If no arguments:**
```bash
echo "Available clients:"
for dir in clients/*/; do
  SLUG=$(basename "$dir")
  if [[ "$SLUG" == _* ]] || [[ "$SLUG" == .* ]]; then
    continue
  fi
  if [ -f "$dir/client.yaml" ]; then
    NAME=$(grep "  name:" "$dir/client.yaml" | head -1 | sed 's/.*: "\(.*\)"/\1/')
    PHASE=$(grep "current_phase:" "$dir/client.yaml" | awk '{print $2}')
    echo "  $SLUG  ($NAME) - Phase: $PHASE"
  fi
done
```
Then ask Ahiya: "Which client would you like to explore? Or type 'new' to start a new engagement."

### Step 2: Handle "new" -- Create New Client

If `$ARGUMENTS` is `new`:

1. **Ask for company name:**
   "What is the company name? (English)"

2. **Ask for Hebrew name:**
   "What is the Hebrew name? (e.g., חברת עמיל מכס בע״מ)"

3. **Generate slug from English name:**
   - Convert to lowercase
   - Replace spaces and special characters with hyphens
   - Remove consecutive hyphens
   - Remove leading/trailing hyphens
   - Limit to 30 characters
   - Show to Ahiya for confirmation: "Generated slug: `abc-customs`. Use this? (or suggest alternative)"

4. **Check slug does not already exist:**
   ```bash
   if [ -d "clients/$SLUG" ]; then
     echo "Client directory already exists: clients/$SLUG"
     echo "Use /c2l-explore $SLUG to resume, or choose a different name."
     exit 1
   fi
   ```

5. **Create directory structure:**
   ```bash
   mkdir -p "clients/$SLUG"/{samples,exploration,plan,pipeline,build,validation,healing,delivery}
   mkdir -p "clients/$SLUG"/pipeline/{ingest,interpret,validate,output}
   ```

6. **Copy templates:**
   ```bash
   cp clients/_templates/client.yaml "clients/$SLUG/client.yaml"
   cp clients/_templates/exploration-report.md "clients/$SLUG/exploration/exploration-report.md"
   cp clients/_templates/document-inventory.md "clients/$SLUG/exploration/document-inventory.md"
   cp clients/_templates/workflow-map.md "clients/$SLUG/exploration/workflow-map.md"
   ```

7. **Initialize client.yaml** with the information gathered so far:
   - Set `client.name`, `client.name_he`, `client.slug`, `client.created`
   - Set `engagement.current_phase: explore`
   - Set `engagement.phase_started` to today's date

8. **Ask for contact information:**
   - Contact person name
   - Phone number
   - Email
   - Location (city)
   - Company size (employees, clerks)
   Update client.yaml with the answers.

9. **Begin discovery conversation** (proceed to Step 4 below).

### Step 3: Handle Existing Slug -- Resume Exploration

If `$ARGUMENTS` is a slug:

```bash
CLIENT_DIR="clients/$ARGUMENTS"
if [ ! -d "$CLIENT_DIR" ]; then
  echo "Client directory not found: $CLIENT_DIR"
  echo "Available clients:"
  ls clients/ | grep -v "^_" | grep -v "^\."
  exit 1
fi
```

Read client.yaml and check `engagement.current_phase`:
- If phase is `explore`: Good, resume exploration (proceed to session resumption).
- If phase is beyond `explore`: "Exploration is already complete for this client. Current phase: {phase}. Use /c2l-{phase} {slug} to continue."

**Session Resumption -- Show Progress:**

```bash
CLIENT_DIR="clients/$SLUG"
CLIENT_NAME=$(grep "  name:" "$CLIENT_DIR/client.yaml" | head -1 | sed 's/.*: "\(.*\)"/\1/')

echo "Resuming exploration for: $CLIENT_NAME"

HAS_REPORT=false; HAS_INVENTORY=false; HAS_WORKFLOW=false
HAS_SAMPLES=false; HAS_VOLUMES=false

[ -s "$CLIENT_DIR/exploration/exploration-report.md" ] && HAS_REPORT=true
[ -s "$CLIENT_DIR/exploration/document-inventory.md" ] && HAS_INVENTORY=true
[ -s "$CLIENT_DIR/exploration/workflow-map.md" ] && HAS_WORKFLOW=true
[ -n "$(find "$CLIENT_DIR/samples" -type f 2>/dev/null)" ] && HAS_SAMPLES=true

SHIPMENTS=$(grep "shipments_per_month:" "$CLIENT_DIR/client.yaml" | awk '{print $2}')
[ "$SHIPMENTS" != "null" ] && [ -n "$SHIPMENTS" ] && HAS_VOLUMES=true

echo "Progress:"
echo "  Exploration report: $([ $HAS_REPORT = true ] && echo 'Started' || echo 'Not started')"
echo "  Document inventory: $([ $HAS_INVENTORY = true ] && echo 'Started' || echo 'Not started')"
echo "  Workflow map:       $([ $HAS_WORKFLOW = true ] && echo 'Started' || echo 'Not started')"
echo "  Sample documents:   $([ $HAS_SAMPLES = true ] && echo 'Collected' || echo 'None yet')"
echo "  Volume metrics:     $([ $HAS_VOLUMES = true ] && echo 'Captured' || echo 'Not yet')"
```

Then ask: "What would you like to work on?"

### Step 4: Discovery Guidance

Guide Ahiya through structured discovery. These are the areas to cover (in any order Ahiya prefers):

**A. Document Types** -- "What document types does this client handle?"
- Bill of Lading (B/L) / Airway Bill / Delivery Note
- Commercial Invoice
- Packing List
- Certificate of Origin
- Customs Declaration (Rashimon)
- Import License
- Delivery Order
- Other client-specific documents
- For each: format (PDF/scan/email), source, frequency, languages, quality

**B. Systems** -- "What systems/portals do they use?"
- SHAAR (customs authority portal)
- MASLUL (classification system)
- Shipping line portals
- Internal ERP/management system
- Email for document receipt
- For each: purpose, access method, data entered, time spent

**C. Workflow** -- "Walk me through a typical shipment, step by step"
- Who receives the documents?
- What data is extracted from each document?
- Where is the data entered?
- What cross-checks are performed?
- What is the output (declaration file, internal record)?
- How long does each step take?

**D. Pain Points** -- "Where does the current process hurt?"
- Common errors and their cost (amendments, storage fees)
- Bottlenecks and delays
- Staff training and turnover challenges
- Peak load issues

**E. Volume Metrics** -- "Help me understand the scale"
- Shipments per month
- Documents per shipment
- Number of clerks
- Clerk salary cost (monthly/annual)
- Time per shipment
- Error rate

As Ahiya provides information, progressively fill in the exploration report, document inventory, and workflow map templates. Update client.yaml with volume metrics.

### Step 5: Phase Completion

When Ahiya indicates exploration is complete:

1. **Validate all required artifacts exist:**
   - [ ] `exploration/exploration-report.md` exists and is non-empty
   - [ ] `exploration/document-inventory.md` exists and is non-empty
   - [ ] `exploration/workflow-map.md` exists and is non-empty
   - [ ] At least 1 subdirectory in `samples/` has files
   - [ ] `client.yaml` has `volumes.shipments_per_month` populated (non-null)

2. **If validation fails:**
   Report which items are missing. Do NOT update client.yaml.
   "Cannot mark exploration complete. Missing: {list}"

3. **If validation passes, update client.yaml:**
   - Set `engagement.current_phase: plan`
   - Set `engagement.phase_started` to today's date
   - Append to `engagement.phases_completed`:
     ```yaml
     - phase: explore
       started: {original_start_date}
       completed: {today}
       deliverable: exploration/exploration-report.md
     ```

4. **Confirm:**
   "Exploration marked complete.
    Deliverable: exploration/exploration-report.md
    Next phase: plan
    Run: /c2l-plan {slug}"
