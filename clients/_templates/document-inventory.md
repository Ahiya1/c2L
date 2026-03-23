# Document Inventory: {CLIENT_NAME}
# Date: {DATE}

## Overview

Total document types identified: {N}
Documents reviewed: {N} samples across {N} types

---

## Core Documents

### {Document Type 1}: {Hebrew Name}

- **Format:** PDF / Scan / Email attachment
- **Source:** {Where it comes from -- shipping line, agent, client system}
- **Frequency:** Every shipment / {N}% of shipments
- **Languages:** {List -- English, Hebrew, Chinese, etc.}
- **Typical length:** {N} pages
- **Key fields to extract:**
  - {Field 1}: {Description and typical format}
  - {Field 2}: {Description and typical format}
  - {Field 3}: {Description and typical format}
- **Sample IDs:** {S001, S002, ...}
- **Quality notes:** {Observations about readability, consistency, layout variation}

### {Document Type 2}: {Hebrew Name}

- **Format:** PDF / Scan / Email attachment
- **Source:** {Where it comes from}
- **Frequency:** Every shipment / {N}% of shipments
- **Languages:** {List}
- **Typical length:** {N} pages
- **Key fields to extract:**
  - {Field 1}: {Description and typical format}
  - {Field 2}: {Description and typical format}
- **Sample IDs:** {S001, S002, ...}
- **Quality notes:** {Observations}

---

## Conditional Documents

### {Document Type}: {Hebrew Name}

- **Format:** PDF / Scan / Email attachment
- **Source:** {Where it comes from}
- **When required:** {Condition -- e.g., imports from specific countries, specific goods categories}
- **Percentage of shipments:** {N}%
- **Languages:** {List}
- **Typical length:** {N} pages
- **Key fields to extract:**
  - {Field 1}: {Description and typical format}
  - {Field 2}: {Description and typical format}
- **Sample IDs:** {S001, S002, ...}
- **Quality notes:** {Observations}

---

## Document Relationships

{How documents cross-reference each other. These relationships are critical
for cross-document validation in the pipeline.}

| Source Document | Target Document | Shared Field | Validation Rule |
|----------------|----------------|-------------|-----------------|
| Bill of Lading | Commercial Invoice | B/L Number | Must match exactly |
| Packing List | Commercial Invoice | Total quantity | Must match or reconcile |
| {source} | {target} | {field} | {rule} |

---

## Format Variations

{Notable variations within the same document type. Different shipping lines,
agents, or systems produce different layouts for the same document type.
This is critical for pipeline design -- the interpreter must handle all variants.}

### {Document Type} Variations

| Variant | Source/Issuer | Layout Differences | Sample ID |
|---------|-------------|-------------------|-----------|
| {variant name} | {issuer} | {how it differs} | {id} |

---

## Collection Status

| Document Type | Samples Collected | Minimum Needed | Status |
|--------------|------------------|----------------|--------|
| {type} | {N} | {N} | Complete / Need more |
