# Explorer 2 Report: c2L Engagement Phases & Per-Client Project Structure

## Executive Summary

c2L needs six engagement phases (explore, plan, build, validate, heal, deliver) that mirror 2L's iteration model but are oriented toward client workflow discovery and document pipeline construction rather than software development. The per-client project structure should live under a `clients/` directory at the c2L repo root, with each client getting a self-contained workspace that accumulates artifacts across phases. The key design insight is that c2L phases are NOT the same as 2L phases -- 2L phases happen within a single session and produce code, while c2L phases span weeks and produce client-facing deliverables. The commands must reflect this: they are session starters that pick up where the last session left off, not autonomous pipelines.

## Discoveries

### 1. Fundamental Difference Between 2L and c2L Phases

2L's flow (explore -> plan -> build -> integrate -> validate -> heal) happens within a single `/2l-mvp` or `/2l-prod` invocation. It is automated orchestration of parallel agents producing software in one sitting.

c2L's flow is fundamentally different:

- **Timescale**: Each c2L phase spans days or weeks, not minutes or hours
- **External dependency**: Each phase requires real client input (documents, access, feedback)
- **Human centrality**: Ahiya drives every phase. The system assists, structures, and remembers -- it does not orchestrate autonomously
- **Deliverables**: Each phase produces a client-facing artifact, not just internal reports
- **Resumability**: Sessions within a phase may be interrupted and resumed across days

This means c2L commands should be **session starters**, not **pipeline runners**. When Ahiya runs `/c2l-explore`, the system should check where things stand, present the current state, and help Ahiya continue from where he left off.

### 2. The Six Phases in Detail

#### Phase 1: c2l-explore (Structured Discovery)

**Purpose**: Understand the client's actual workflow with enough detail to design a solution. Produce a structured exploration report that has standalone value.

**Inputs required to start**:
- Client name and basic info (company, location, size)
- Access to the client (via screen share, on-site visit, or document exchange)
- At minimum: 3-5 sample documents from real shipments

**Activities**:
1. Create client project directory (`clients/{client-slug}/`)
2. Initialize client config (`client.yaml`) with basic info
3. Document inventory: catalog every document type the client handles, with samples
4. System mapping: what software/portals they use (SHAAR, MASLUL, shipping line portals, internal systems)
5. Workflow observation: step-by-step what clerks do for a typical shipment
6. Pain point assessment: where errors happen, what they cost, what frustrates the team
7. Volume metrics: shipments/day, documents/shipment, clerks employed, hours per shipment
8. Expected outputs: what structured data needs to be produced, in what format, for what system
9. Feasibility assessment: which document types are automatable now, which need more work

**Outputs**:
- `exploration/exploration-report.md` -- comprehensive, structured, client-shareable
- `exploration/document-inventory.md` -- catalog of document types with sample references
- `exploration/workflow-map.md` -- current manual process documented step by step
- `samples/` directory with actual client documents (PDFs, scans)
- `client.yaml` updated with structured metadata

**Exit criteria**:
- All document types cataloged with at least 1 sample each
- Current workflow documented end-to-end
- Volume and cost metrics captured
- Feasibility assessment completed
- Client has reviewed and confirmed accuracy of the report

**Human role**:
- Ahiya conducts the discovery (calls, visits, screen shares)
- Ahiya feeds information and documents into the system
- The system structures, organizes, and produces the report
- Ahiya reviews and refines the report before sharing with client

#### Phase 2: c2l-plan (Solution Design)

**Purpose**: Design the specific solution based on exploration findings. Define what will be built, what accuracy is acceptable, and what the system will and will not handle.

**Inputs**:
- Completed exploration report
- Client agreement to proceed to this phase
- Any additional documents or clarifications from exploration follow-up

**Activities**:
1. Define the pipeline architecture: which document types to process, in what order
2. Define field extraction targets: for each document type, exactly what data fields to extract
3. Define accuracy requirements: per-field and per-document accuracy targets
4. Define failure modes: what happens when the system cannot process a document (e.g., flag for human review)
5. Define output format: what the structured data looks like (JSON schema, CSV, direct system entry format)
6. Define scope boundaries: what is in v1, what is deferred
7. Estimate build timeline and effort
8. Produce solution design document

**Outputs**:
- `plan/solution-design.md` -- the technical specification for what will be built
- `plan/field-specs/` -- per-document-type field extraction specifications
- `plan/accuracy-targets.md` -- measurable accuracy criteria for validation phase
- `plan/scope.md` -- what is in/out of scope for the build

**Exit criteria**:
- Solution design reviewed by Ahiya
- Accuracy targets agreed with client
- Scope boundaries clear
- Client agrees to proceed to build

**Human role**:
- Ahiya makes architectural decisions (what to include in v1)
- The system generates specifications from exploration data
- Ahiya negotiates scope and accuracy targets with client

#### Phase 3: c2l-build (Pipeline Implementation)

**Purpose**: Build the actual document processing pipeline using real client documents.

**Inputs**:
- Completed solution design
- Client sample documents (from exploration)
- Additional document samples for training/testing (request from client if needed)

**Activities**:
1. Implement document ingestion (PDF parsing, OCR if needed, image processing)
2. Implement per-document-type interpreters (field extraction using LLM + rules)
3. Implement cross-document validation (e.g., B/L quantities match packing list)
4. Implement output formatting (structured data matching target system format)
5. Build test harness for running pipeline on sample documents
6. Iterative refinement: run on samples, review output, fix errors, repeat
7. Track accuracy metrics on sample set

**Outputs**:
- `pipeline/` -- the actual pipeline code
- `pipeline/ingest/` -- document ingestion modules
- `pipeline/interpret/` -- per-document-type interpretation modules
- `pipeline/validate/` -- cross-document validation logic
- `pipeline/output/` -- output formatting modules
- `build/build-log.md` -- record of build decisions, iterations, accuracy progress
- `build/sample-results/` -- pipeline output on sample documents with accuracy scores

**Exit criteria**:
- Pipeline processes all in-scope document types
- Accuracy on sample documents meets or exceeds targets from plan
- Build log documents all decisions and known limitations
- Pipeline is runnable end-to-end on new documents

**Human role**:
- Ahiya drives the build cooperatively with the system
- The system generates and iterates on pipeline code
- Ahiya reviews output quality on real documents
- Ahiya decides when accuracy is sufficient to proceed to validation

#### Phase 4: c2l-validate (Real-World Testing)

**Purpose**: Test the pipeline on a production-scale batch of real client data. Measure accuracy against agreed targets.

**Inputs**:
- Working pipeline from build phase
- Fresh batch of real client documents (not the training samples)
- Accuracy targets from plan phase

**Activities**:
1. Run pipeline on validation batch (50-100 shipments worth of documents)
2. Compare pipeline output to ground truth (what clerks would produce)
3. Measure per-field and per-document accuracy
4. Categorize failures: which document types, which fields, which error patterns
5. Produce validation report with pass/fail verdict against targets
6. If near-miss: identify specific improvements needed (feeds into heal phase)

**Outputs**:
- `validation/validation-report.md` -- comprehensive accuracy report, client-shareable
- `validation/results/` -- per-document results with accuracy scores
- `validation/failure-analysis.md` -- categorized failure patterns
- `validation/metrics.yaml` -- machine-readable accuracy metrics

**Exit criteria**:
- Validation batch processed completely
- Accuracy measured and documented
- Clear pass/fail verdict against agreed targets
- Client has reviewed validation results

**Human role**:
- Ahiya coordinates getting fresh documents from client
- The system runs the pipeline and produces the report
- Ahiya reviews and interprets results for client
- Client provides ground truth data (or Ahiya compares against clerk output)

#### Phase 5: c2l-heal (Issue Resolution)

**Purpose**: Fix issues found during validation. Iterate until accuracy targets are met.

**Inputs**:
- Validation report with failure analysis
- Specific failure patterns identified
- Additional sample documents for the problematic cases (if available)

**Activities**:
1. Prioritize failures by impact (most common errors first)
2. Fix pipeline code for identified failure patterns
3. Re-run on failed documents to verify fixes
4. Run regression check on previously passing documents
5. If new validation needed: produce updated metrics
6. Track healing iterations (max 2-3 before escalating to client for scope adjustment)

**Outputs**:
- `healing/healing-{N}/healing-report.md` -- what was fixed, what improved
- `healing/healing-{N}/metrics.yaml` -- updated accuracy metrics
- Updated pipeline code
- If still failing after max iterations: escalation report recommending scope adjustment

**Exit criteria**:
- Accuracy targets met, OR
- Scope adjustment agreed with client (some edge cases deferred to v2)
- Healing report documents all changes

**Human role**:
- Ahiya reviews failure patterns and decides priority
- The system implements fixes
- Ahiya decides when to stop healing and move to delivery
- If scope adjustment needed: Ahiya negotiates with client

#### Phase 6: c2l-deliver (Handoff)

**Purpose**: Deploy the working system and hand off to the client. Transfer responsibility.

**Inputs**:
- Validated, healed pipeline
- Client's target environment details

**Activities**:
1. Package pipeline for deployment
2. Create usage documentation (how to run, what to expect, known limitations)
3. Create operations guide (monitoring, troubleshooting, when to contact Ahiya)
4. Deploy to client's environment (or a hosted environment if needed)
5. Supervised run: system processes real daily workload while Ahiya monitors
6. Knowledge transfer session with client team
7. Start 30-day bug-fix commitment window

**Outputs**:
- `delivery/deployment-guide.md` -- how the system is deployed and configured
- `delivery/user-guide.md` -- how to use the system day-to-day
- `delivery/operations-guide.md` -- monitoring, troubleshooting, escalation
- `delivery/handoff-checklist.md` -- verified checklist of everything transferred
- Deployed, running system

**Exit criteria**:
- System deployed and processing real documents
- Client team trained
- Documentation complete
- 30-day support window started
- Client confirms acceptance

**Human role**:
- Ahiya handles deployment and training
- The system generates documentation from build/validation artifacts
- Ahiya provides the 30-day support commitment

### 3. Per-Client Project Structure

```
c2L/                              # repo root
  .2L/                            # 2L orchestration metadata (for building c2L itself)
  .github/
  site/                           # c2l.dev website
  reach/                          # outreach system
  clients/                        # ALL client engagements live here
    .gitignore                    # ignore client docs/samples by default
    _templates/                   # templates used across all clients
      exploration-report.md       # exploration report template
      document-inventory.md       # document inventory template
      workflow-map.md             # workflow mapping template
      solution-design.md          # solution design template
      field-spec.md               # per-document field spec template
      validation-report.md        # validation report template
      client.yaml                 # client config template
    {client-slug}/                # one directory per client engagement
      client.yaml                 # client metadata and current phase
      samples/                    # real client documents (NEVER committed to git)
        bill-of-lading/
        commercial-invoice/
        packing-list/
        ...per document type
      exploration/                # Phase 1 artifacts
        exploration-report.md
        document-inventory.md
        workflow-map.md
      plan/                       # Phase 2 artifacts
        solution-design.md
        field-specs/
          bill-of-lading.md
          commercial-invoice.md
          ...per document type
        accuracy-targets.md
        scope.md
      pipeline/                   # Phase 3 code (the actual product)
        ingest/
        interpret/
        validate/
        output/
        config.yaml               # pipeline configuration
        run.ts                    # main entry point
      build/                      # Phase 3 records
        build-log.md
        sample-results/
      validation/                 # Phase 4 artifacts
        validation-report.md
        results/
        failure-analysis.md
        metrics.yaml
      healing/                    # Phase 5 artifacts
        healing-1/
          healing-report.md
          metrics.yaml
        healing-2/                # if needed
          ...
      delivery/                   # Phase 6 artifacts
        deployment-guide.md
        user-guide.md
        operations-guide.md
        handoff-checklist.md
```

#### Key Design Decisions

**Why `clients/` at repo root, not in a separate repo?**
- c2L is a plugin + tooling repo. The client work is what the tooling produces.
- Keeping them together means the commands can directly access templates and shared code.
- Client documents are gitignored. Only the structured reports and pipeline code are versioned.
- When c2L matures, client projects could graduate to their own repos.

**Why `samples/` is gitignored:**
- Client documents contain sensitive business data (shipment values, consignee details, etc.)
- They should live on Ahiya's machine and potentially in encrypted storage
- The `samples/` directory has subdirectories per document type for organization
- Pipeline code references sample paths but does not embed document content

**Why `_templates/` with underscore prefix:**
- The underscore convention signals "this is meta, not a client"
- Templates are shared across all clients
- When `/c2l-explore` starts a new client, it copies templates into the client directory

**How `client.yaml` works:**

```yaml
# clients/broker-alpha/client.yaml
client:
  name: "Example Brokerage Ltd"
  name_he: "חברת עמיל מכס לדוגמה בע״מ"
  slug: broker-alpha
  contact: "Yossi Cohen"
  phone: "058-123-4567"
  email: "yossi@example.co.il"
  location: "Ashdod"
  size: "15 employees, 5 clerks"
  created: 2026-04-15

engagement:
  current_phase: explore  # explore | plan | build | validate | heal | deliver | complete
  phase_started: 2026-04-15
  phases_completed:
    - phase: explore
      started: 2026-04-15
      completed: 2026-04-22
      deliverable: exploration/exploration-report.md
    - phase: plan
      started: 2026-04-25
      completed: 2026-04-28
      deliverable: plan/solution-design.md

volumes:
  shipments_per_month: 200
  documents_per_shipment: 12
  clerks: 5
  estimated_annual_clerk_cost: 720000  # NIS

pipeline:
  document_types:
    - bill-of-lading
    - commercial-invoice
    - packing-list
    - certificate-of-origin
  accuracy_targets:
    field_level: 0.95
    document_level: 0.90
  current_accuracy:
    field_level: null  # populated after validation
    document_level: null

notes: |
  Met at port area office. Traditional brokerage, paper-heavy workflow.
  Uses SHAAR via web portal, no API integration.
  Very interested in reducing clerk dependency.
```

### 4. Exploration Report Template

The exploration report is the first paid deliverable. It must have standalone value -- the client keeps it even if they stop after Phase 1.

```markdown
# Exploration Report: {Client Name}
# Date: {Date}
# Prepared by: Ahiya Butman, c2L

---

## Executive Summary

{2-3 paragraphs: what the client does, what was observed, key findings, 
feasibility assessment, cost-benefit headline}

---

## 1. Document Types Inventory

### 1.1 Core Documents (Every Shipment)

| Document Type | Hebrew | Format | Source | Frequency | Sample ID |
|--------------|--------|--------|--------|-----------|-----------|
| Bill of Lading | שטר מטען | PDF | Shipping line portal | Every shipment | S001 |
| Commercial Invoice | חשבונית מסחרית | PDF/Scan | Importer email | Every shipment | S002 |
| ... | ... | ... | ... | ... | ... |

### 1.2 Conditional Documents

| Document Type | Hebrew | When Required | Frequency (% of shipments) | Sample ID |
|--------------|--------|---------------|---------------------------|-----------|
| Certificate of Origin | תעודת מקור | FTA duty reduction | ~60% | S005 |
| EUR.1 | תעודת תנועה | EU/EFTA imports | ~25% | S006 |
| ... | ... | ... | ... | ... |

### 1.3 Document Quality Assessment

| Document Type | Digital PDF % | Scanned % | Handwritten % | Multi-language | Avg Quality (1-5) |
|--------------|--------------|-----------|---------------|----------------|-------------------|
| Bill of Lading | 80% | 15% | 5% | EN, HE | 4 |
| Commercial Invoice | 60% | 30% | 10% | EN, CN, TR | 3 |
| ... | ... | ... | ... | ... | ... |

---

## 2. Systems Mapping

### 2.1 Primary Systems

| System | Purpose | Access Method | Data Entered | Time/Shipment |
|--------|---------|---------------|-------------|---------------|
| SHAAR (שע"ר) | Customs declaration | Web portal + digital signature | 40+ fields | 20-40 min |
| MASLUL (מסל"ל) | Cargo release | Web portal | Release requests | 5-10 min |
| ... | ... | ... | ... | ... |

### 2.2 Internal Systems

{Description of internal tools: spreadsheets, legacy software, 
folder structures, email workflows}

### 2.3 System Integration Points

{How systems connect to each other. Where data is re-entered manually 
vs. transferred electronically}

---

## 3. Current Workflow

### 3.1 End-to-End Process (Per Shipment)

| Step | Who | Action | Input | Output | Time | Error Risk |
|------|-----|--------|-------|--------|------|-----------|
| 1 | Clerk | Receive docs via email | Email + attachments | Saved to folder | 2 min | Low |
| 2 | Clerk | Identify document types | PDF files | Sorted documents | 3 min | Low |
| 3 | Clerk | Extract data from B/L | Bill of lading | Notes/spreadsheet | 5 min | Medium |
| 4 | Clerk | Extract invoice data | Commercial invoice | Notes/spreadsheet | 8 min | Medium |
| 5 | Clerk | Cross-reference docs | All documents | Verified data set | 10 min | High |
| 6 | Clerk | Classify HS codes | Item descriptions | HS codes | 10 min | High |
| 7 | Clerk | Enter into SHAAR | Verified data | Draft declaration | 20 min | Medium |
| 8 | Broker | Review declaration | Draft declaration | Approved declaration | 10 min | Low |
| 9 | Broker | Submit + track | Approved declaration | Filed declaration | 5 min | Low |

### 3.2 Exception Handling

{What happens when documents are incomplete, contradictory, 
or in unexpected formats}

### 3.3 Bottlenecks

{Where the process slows down. Peak hours, seasonal patterns, 
dependency chains}

---

## 4. Pain Points & Error Analysis

### 4.1 Error Types (Ranked by Cost)

| Error Type | Frequency | Cost per Occurrence | Annual Impact | Root Cause |
|-----------|-----------|-------------------|---------------|-----------|
| Wrong HS classification | 5-10% of shipments | 2,000-10,000 NIS | High | Manual lookup + judgment |
| Value discrepancy | 3-5% | 500-5,000 NIS | Medium | Multi-doc comparison error |
| Missing fields | 2-4% | 500 NIS (amendment fee) | Medium | Overlooked data |
| ... | ... | ... | ... | ... |

### 4.2 Pain Points (Ranked by Severity)

1. **{Pain point}**: {Description, frequency, impact}
2. **{Pain point}**: {Description, frequency, impact}
3. ...

---

## 5. Volume Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Shipments/month | {N} | Average over last 6 months |
| Documents/shipment | {N} | Average, range: {min}-{max} |
| Clerks employed | {N} | Full-time equivalent |
| Clerk cost/month | {N} NIS | Including benefits |
| Annual clerk cost | {N} NIS | Total |
| Time per shipment | {N} min | Average clerk time |
| Amendments/month | {N} | Declaration corrections |
| Port storage incidents/month | {N} | Delays causing storage fees |

---

## 6. Automation Feasibility Assessment

### 6.1 Per-Document-Type Feasibility

| Document Type | Feasibility | Confidence | Notes |
|--------------|------------|-----------|-------|
| Bill of Lading | HIGH | 90% | Structured format, mostly digital |
| Commercial Invoice | MEDIUM | 75% | Variable formats, multi-language |
| Packing List | HIGH | 85% | Tabular, consistent structure |
| Certificate of Origin | MEDIUM | 70% | Varies by issuing country |

### 6.2 Overall Feasibility

{Summary: which parts of the workflow can be automated in v1, 
which require more work, which may need human oversight long-term}

### 6.3 Recommended Scope for Build Phase

{Specific recommendation: start with these document types, 
target these fields, defer these edge cases}

---

## 7. Cost-Benefit Projection

### 7.1 Current Cost Structure
- Annual clerk cost: {N} NIS
- Amendment costs: ~{N} NIS/year
- Port storage from delays: ~{N} NIS/year
- Training/turnover cost: ~{N} NIS/year
- **Total annual cost of manual processing: {N} NIS**

### 7.2 Projected Savings
- Clerk reduction: {N} clerks x {cost} = {N} NIS/year saved
- Error reduction: ~{N}% fewer amendments = {N} NIS/year saved
- Speed improvement: ~{N}% faster processing = fewer port storage incidents
- **Projected annual savings: {N} NIS**

### 7.3 Investment vs. Return
- c2L engagement cost: 150,000 NIS (one-time)
- Payback period: ~{N} months
- Year 1 net savings: ~{N} NIS

---

## Appendix

### A. Sample Document References
{List of sample documents collected, with anonymization notes}

### B. Glossary
{Hebrew-English terminology used in this report}

### C. Next Steps
{What happens if the client proceeds to Phase 2 (Plan)}
```

### 5. Command Interaction Design

#### How Phases Chain Together

c2L phases are **sequential and gated**. Each phase requires explicit completion before the next begins. Unlike 2L where the orchestrator automatically chains phases, c2L requires Ahiya to make the call.

**Command flow:**

```
/c2l-explore {client-slug}     # Start or resume exploration for a client
/c2l-plan {client-slug}        # Start or resume planning (requires explore complete)
/c2l-build {client-slug}       # Start or resume build (requires plan complete)
/c2l-validate {client-slug}    # Start or resume validation (requires build complete)
/c2l-heal {client-slug}        # Fix validation failures (requires validate with failures)
/c2l-deliver {client-slug}     # Start delivery (requires validate pass or heal pass)

/c2l-status                    # Show all clients and their current phase
/c2l-status {client-slug}      # Show detailed status for one client
```

#### State Management Between Phases

State is passed through the filesystem, not through command arguments or in-memory state. Each phase reads the artifacts from previous phases:

```
c2l-explore reads: nothing (starts fresh or resumes from client.yaml)
c2l-plan reads: exploration/exploration-report.md, exploration/document-inventory.md
c2l-build reads: plan/solution-design.md, plan/field-specs/*, samples/*
c2l-validate reads: pipeline/*, plan/accuracy-targets.md
c2l-heal reads: validation/failure-analysis.md, validation/metrics.yaml, pipeline/*
c2l-deliver reads: pipeline/*, validation/validation-report.md, build/build-log.md
```

Each command:
1. Checks if the client directory exists
2. Reads `client.yaml` to determine current phase
3. Validates prerequisites (previous phase artifacts exist)
4. Presents current state to Ahiya
5. Assists with the phase work
6. Updates `client.yaml` on phase completion

#### How Ahiya Controls the Flow

**Starting a new client:**
```
Ahiya: /c2l-explore new
System: "What is the client's name?"
Ahiya: "ABC Customs Brokerage"
System: Creates clients/abc-customs/ with client.yaml template
System: "Client project initialized. Let's start discovery..."
```

**Resuming work on an existing client:**
```
Ahiya: /c2l-explore abc-customs
System: Reads client.yaml, sees exploration 60% complete
System: "ABC Customs exploration in progress. Here's where we are:
         - Document inventory: 8 of ~12 types cataloged
         - Workflow map: draft complete
         - Still needed: volume metrics, feasibility assessment
         What would you like to work on?"
```

**Moving to next phase:**
```
Ahiya: /c2l-plan abc-customs
System: Reads client.yaml, checks exploration is complete
System: "Exploration is complete. Here's the summary:
         [key findings]
         Ready to start solution design. Shall I generate an initial draft 
         based on the exploration report?"
```

**Checking overall status:**
```
Ahiya: /c2l-status
System: 
  "c2L Client Engagements:
  
   1. ABC Customs (abc-customs)
      Phase: BUILD (started 2026-05-01)
      Pipeline: 3/5 document types implemented
      
   2. XYZ Freight (xyz-freight)  
      Phase: EXPLORE (started 2026-05-10)
      Exploration: 60% complete
      
   3. DEF Logistics (def-logistics)
      Phase: COMPLETE (delivered 2026-04-28)
      Accuracy: 96.2% field-level"
```

#### Phase Completion Protocol

Each phase has explicit completion. Ahiya decides when a phase is done:

```
Ahiya: "Mark exploration as complete"
System: Validates all required artifacts exist:
  - [x] exploration-report.md exists and is non-empty
  - [x] document-inventory.md exists
  - [x] workflow-map.md exists  
  - [x] At least 3 document samples in samples/
  - [x] Volume metrics captured in client.yaml
System: Updates client.yaml: current_phase: plan, adds explore to phases_completed
System: "Exploration marked complete. 
         Deliverable: exploration/exploration-report.md
         Ready for: /c2l-plan abc-customs"
```

### 6. Plugin Manifest Design

The c2L plugin should register the following commands:

```json
{
  "name": "c2l",
  "version": "1.0.0",
  "description": "c2L - Cooperative workflow automation for customs brokerage and logistics",
  "author": {
    "name": "Ahiya"
  },
  "commands": {
    "c2l-explore": "commands/c2l-explore.md",
    "c2l-plan": "commands/c2l-plan.md",
    "c2l-build": "commands/c2l-build.md",
    "c2l-validate": "commands/c2l-validate.md",
    "c2l-heal": "commands/c2l-heal.md",
    "c2l-deliver": "commands/c2l-deliver.md",
    "c2l-status": "commands/c2l-status.md"
  }
}
```

Each command markdown file should follow the 2L command pattern:
1. Description and usage
2. Prerequisites check
3. State detection and resumption logic
4. Activity guidance
5. Completion criteria
6. Next step pointer

### 7. Reach Pipeline Integration

The reach system already defines pipeline stages that map to c2L engagement phases:

| Reach Stage | c2L Phase | Trigger |
|------------|-----------|---------|
| `pending` | -- | Lead identified |
| `contacted` | -- | First email sent |
| `follow_up_1` | -- | Follow-up sent |
| `follow_up_2` | -- | Value-add sent |
| `responded` | -- | Broker replied |
| `call_scheduled` | -- | Discovery call booked |
| `exploring` | c2l-explore | Phase 1 started |
| `closed_won` | c2l-plan/build/validate/deliver | Engagement began |
| `closed_lost` | -- | Not proceeding |
| `dormant` | -- | No response |

When Ahiya runs `/c2l-explore new` and creates a client project, the reach system's contact record (if one exists) should be updated to `exploring` stage. This is a manual update via the reach scripts, not an automatic integration. Keep it simple.

## Patterns Identified

### Pattern: Phase-Gated Client Engagement with Filesystem State

**Description**: Each engagement phase is a directory within the client project. Phase transitions are controlled by Ahiya, not automated. State is the filesystem itself -- if the artifacts exist, the phase is complete.

**Use Case**: Any cooperative human-AI workflow where phases span multiple sessions and require external input between phases.

**Example**:
```
clients/broker-alpha/
  client.yaml          # current_phase: build
  exploration/         # complete (artifacts present)
  plan/                # complete (artifacts present)
  pipeline/            # in progress (being built)
  build/               # in progress
  validation/          # empty (not started)
```

**Recommendation**: Strongly adopt. This is the natural structure for a consulting engagement managed through CLI tools. It is inspectable, resumable, and requires no database.

### Pattern: Session Starters vs. Pipeline Runners

**Description**: c2L commands start a cooperative work session rather than running an autonomous pipeline. The command checks state, presents where things are, and then Ahiya drives the work with the system's assistance.

**Use Case**: When the human is the decision-maker and the AI assists rather than orchestrates.

**Recommendation**: Essential for c2L. This is fundamentally different from 2L's autonomous orchestration and the commands must reflect it. Each command is a session where Ahiya and the system work together, not a pipeline that runs to completion.

### Pattern: Template-Based Deliverable Generation

**Description**: Templates in `clients/_templates/` are copied into new client projects and progressively filled in. The template defines the structure; the exploration/planning process fills in the content.

**Use Case**: Producing consistent, professional client-facing reports across multiple engagements.

**Recommendation**: Use. The exploration report template should be polished enough that the output is directly shareable with clients. This is a paid deliverable.

## Complexity Assessment

### High Complexity Areas

- **c2l-build command and pipeline architecture**: This is the core intellectual property of c2L. The document processing pipeline (ingest -> interpret -> structure -> validate -> output) is where the real engineering challenge lives. Each document type needs its own interpretation logic, and the cross-document validation (e.g., verifying B/L matches invoice) is complex. Estimated: this will need significant iteration. Recommend starting with a single document type end-to-end, then expanding. Likely needs builder splits: one for ingestion/OCR, one for interpretation/extraction, one for validation/output.

- **c2l-validate accuracy measurement**: Measuring accuracy requires ground truth data. The client's clerk output serves as ground truth, but it may itself contain errors. The validation system needs to handle: field-level comparison, fuzzy matching (different transliterations of names, slight value differences), and per-document scoring. Medium-high complexity.

### Medium Complexity Areas

- **c2l-explore command with structured output**: The exploration phase needs to produce a professional, detailed report. The system needs to know what questions to ask, how to structure the answers, and how to generate the final report. The template helps, but the interactive guidance logic is medium complexity.

- **Per-client project initialization and state management**: Creating the directory structure, initializing templates, reading/writing client.yaml, and detecting current phase across sessions. Not algorithmically complex but needs to be reliable.

- **c2l-heal iteration tracking**: Managing multiple healing iterations with metrics comparison requires careful state tracking.

### Low Complexity Areas

- **c2l-status command**: Read client.yaml files and present a summary. Straightforward.

- **c2l-deliver documentation generation**: Given the build/validation artifacts, generating deployment and user guides is template-based work.

- **Plugin manifest and command registration**: Follows the exact 2L pattern. Copy, adapt, done.

## Technology Recommendations

### Primary Stack

- **Plugin system**: Claude Code plugin (identical to 2L). Commands as markdown files in `commands/` directory. No framework needed.
- **State management**: Filesystem (YAML + markdown files). No database. `client.yaml` as the source of truth per client.
- **Document processing**: Claude's built-in vision and text understanding for document interpretation. Supplemented by pdf-parse or similar for text extraction from digital PDFs.
- **Pipeline runtime**: TypeScript/Node.js scripts that can be run from the command line. Each pipeline stage is a function that takes input and produces output.

### Supporting Libraries (for the pipeline, when built)

- **pdf-parse**: Extract text from digital PDFs without OCR
- **sharp** or **jimp**: Image preprocessing before sending to Claude for vision analysis
- **yaml**: Read/write client.yaml and pipeline config
- **csv-parse/csv-stringify**: Handle tabular data in/out
- **zod**: Schema validation for pipeline output (ensuring extracted fields match expected types)

### Not Needed

- **Database**: Filesystem is sufficient for the per-client engagement model
- **Web framework**: No web UI needed. Everything runs in Claude Code
- **Authentication/authorization**: Single user (Ahiya)
- **CI/CD**: The pipeline code is per-client and deployed manually

## Integration Points

### Internal Integrations

- **c2L commands <-> client filesystem**: Every command reads/writes to `clients/{slug}/`
- **c2L commands <-> client.yaml**: Phase tracking and metadata
- **c2L reach <-> client projects**: When a contact moves to `exploring` stage, a corresponding client project should exist. Manual cross-reference via slug.
- **c2L templates <-> client reports**: Templates are the skeleton; commands fill in the content.

### External Integrations (Per Client, During Build Phase)

- **Claude API**: For document interpretation (vision + text analysis). Used during pipeline execution, not during the explore/plan phases.
- **SHAAR system**: The target system for output data. Output format must match SHAAR's input requirements. No API integration planned for v1 -- output is structured data that can be copy-pasted or imported.
- **Client email**: Documents arrive via email. During explore phase, Ahiya manually collects them. Future: automated email ingestion could be added.

## Risks & Challenges

### Technical Risks

- **Document interpretation accuracy**: The entire value proposition depends on high-accuracy extraction from varied, multi-language documents. If Claude's vision capabilities cannot achieve 95%+ field-level accuracy on standard documents, the product does not work. Mitigation: test early with real documents during exploration phase, before committing to build pricing.

- **Document format variability**: Every shipping line, every exporter, every country has slightly different document formats. A bill of lading from Maersk looks different from one from ZIM. Mitigation: the per-client pipeline approach means we only need to handle the formats this specific client encounters. Start with the most common 3-5 and expand.

### Process Risks

- **Phase duration unpredictability**: The vision estimates 8-13 weeks total engagement. But real client engagements can stall (client is slow to provide documents, goes on vacation, changes requirements). Mitigation: track time per phase in client.yaml, have clear expectations set during explore phase.

- **Ground truth for validation**: If the client's clerks make errors, comparing pipeline output against clerk output produces misleading accuracy numbers. Mitigation: during validation, have Ahiya manually verify a random sample of "mismatches" to determine whether the pipeline or the clerk was wrong.

### Complexity Risks

- **c2l-build is too large for one builder**: The pipeline spans ingestion, interpretation, validation, and output formatting. Each is a significant subsystem. Recommendation: plan for builder splits from the start. Have one builder create the pipeline skeleton, then sub-builders handle each document type.

## Recommendations for Planner

1. **Build the command skeleton first, pipeline second.** Iteration 3 should focus on the command infrastructure: plugin manifest, all 7 commands (explore, plan, build, validate, heal, deliver, status), the client directory structure, templates, and the client.yaml state management. The actual document processing pipeline is per-client and will be built during real engagements. The commands should be functional enough that Ahiya can run `/c2l-explore new` and get a structured project directory with templates ready to fill.

2. **The exploration report template is the highest-value deliverable in this iteration.** It is the first thing a client sees. It must be professional, thorough, and organized. Spend builder time on getting this right. The template in section 4 of this report provides a detailed starting point.

3. **Design commands as session helpers, not autonomous runners.** Each command should: (a) detect current state, (b) present what has been done and what remains, (c) guide Ahiya through the next steps interactively, (d) update state on completion. Do NOT try to make them run autonomously like 2L's `/2l-build`.

4. **Keep the `samples/` directory structure but gitignore everything in it.** Client documents are the lifeblood of the system but must never be committed. The `.gitignore` in `clients/` should ignore `*/samples/` and any binary files. Only markdown reports, YAML configs, and pipeline TypeScript code should be versioned.

5. **The client.yaml is the single source of truth for engagement state.** Every command reads it to know where things stand. It should be simple, human-readable, and manually editable if needed. Do not over-engineer this -- it is a YAML file, not a database.

6. **Do not build the pipeline runtime in this iteration.** The scope says "c2l-build: cooperative pipeline building" but the actual pipeline code (LLM calls, PDF parsing, OCR) should be deferred to real client engagements. This iteration builds the scaffolding that makes those engagements structured and repeatable. The c2l-build command should create the pipeline directory structure and provide guidance, not implement the actual processing logic.

7. **c2l-status should be the simplest but most useful command.** It reads all `clients/*/client.yaml` files and presents a dashboard view. This is what Ahiya runs every morning to see where things stand across clients.

## Resource Map

### Critical Files/Directories to Create

- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/.claude-plugin/plugin.json` -- c2L plugin manifest
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/commands/` -- all 7 command files
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/clients/` -- client engagement root
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/clients/_templates/` -- shared templates
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/clients/.gitignore` -- ignore samples

### Reference Files

- `/home/ahiya/Ahiya/2L/.claude-plugin/plugin.json` -- 2L plugin manifest pattern
- `/home/ahiya/Ahiya/2L/commands/2l-explore.md` -- 2L explore command pattern
- `/home/ahiya/Ahiya/2L/commands/2l-build.md` -- 2L build command pattern
- `/home/ahiya/Ahiya/2L/commands/2l-validate.md` -- 2L validate command pattern
- `/home/ahiya/Ahiya/2L/commands/2l-heal.md` -- 2L heal command pattern
- `/home/ahiya/Ahiya/2L/commands/2l-status.md` -- 2L status command pattern
- `/home/ahiya/Ahiya/2L/commands/2l-continue.md` -- 2L continue/resume pattern (relevant for c2L session resumption)
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/reach/config.yaml` -- reach pipeline stages (maps to c2L phases)
- `/home/ahiya/Ahiya/2L/Prod/biz/c2L/reach/lib/types.ts` -- reach type definitions

### Key Dependencies

- **Claude Code plugin system**: The command registration mechanism. Must follow existing conventions.
- **2L command patterns**: c2L commands should feel familiar to Ahiya since he uses 2L daily. Same general structure, different purpose.
- **Reach pipeline stages**: The `exploring` and `closed_won` stages in reach connect to c2L engagement phases.

## Questions for Planner

1. **Should the c2l-build command include any stub pipeline code, or just the directory structure and guidance?** My recommendation is directory structure + guidance only, with the actual pipeline code built per-client. But if the planner wants a reusable pipeline skeleton with pluggable document type modules, that could be valuable for future engagements.

2. **Should there be a `/c2l-new` command separate from `/c2l-explore new`?** Creating a new client project could be its own command for clarity, or it could be a sub-flow within explore. I lean toward keeping it inside explore (fewer commands to remember), but the planner should decide.

3. **How should the c2L plugin be installed?** 2L is installed by being in the directory with `.claude-plugin/`. For c2L, should it be a standalone plugin at the repo root, or should it only activate when working within the `clients/` directory? The former is simpler and follows 2L's pattern.

4. **Should pipeline code be per-client or shared?** If Broker A and Broker B both need bill of lading parsing, should there be a shared library, or should each client have their own copy? Recommendation: start per-client (simple), extract shared modules after 2-3 clients reveal common patterns.

5. **Does the deliver phase need command support in this iteration?** The vision says "Should-Have (Post-First-Client)" for delivery tooling. If the planner agrees, we can skip the c2l-deliver command implementation and just create a placeholder.
