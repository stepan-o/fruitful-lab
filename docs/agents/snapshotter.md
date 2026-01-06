## Snapshotter Spec v0.1 (Fruitful Lab Tools System)

## 0) Purpose

Snapshotter produces **auditable repo scan artifacts** for:
- onboarding new LLM architects
- reality-first implementation audits
- drift detection (by downstream agents, not Snapshotter)

Snapshotter must be:
- **observable** (what was scanned, what was skipped, what was read)
- **bounded** (no runaway repo sizes)
- **safe** (no secret exfiltration)
- **repeatable** (stable output shape and stable S3 paths)

## 1) Authority Model

- This spec governs Snapshotter behavior.
- Snapshotter is **not** a refactor/plan agent.
- Snapshotter **may** produce semantic summaries in Pass 2, but must:
    - cite evidence (file paths)
    - record uncertainties
    - never claim it read files it didn’t read

## 2) Two-Pass Model (Locked)

Snapshotter runs **two passes** per job.

### Pass 1 (Non-LLM, deterministic)
**Goal:** Produce a complete inventory + integrity receipt.

**Outputs:**
- `repo_index.json` (required)
- `artifact_manifest.json` (required)
- `repo_snapshot.tar.gz` (optional, default ON for v0.1)

### Pass 2 (LLM, semantic)
**Goal:** Produce onboarding-quality structure + gaps, *anchored to repo_index*.

**Outputs:**
- `ARCHITECTURE_SUMMARY_SNAPSHOT.json` (required)
- `GAPS_AND_INCONSISTENCIES.json` (required)
- `ONBOARDING.md` (optional, default ON for v0.1)

## 3) Job Input Contract (Locked)

Snapshotter accepts a single job payload:

```json
{
  "job_id": "optional-string",
  "repo_url": "string",
  "ref": "string (branch|tag|commit)",
  "mode": "full|light",
  "limits": {
    "max_file_bytes": 10485760,
    "max_total_bytes": 262144000,
    "max_files": 20000
  },
  "filters": {
    "deny_dirs": ["node_modules", ".git", ".next", "dist", "build", ".venv"],
    "deny_file_regex": ["(?i).*\\.pem$", "(?i).*\\.key$", "(?i).*id_rsa$"],
    "allow_exts": ["*"]
  },
  "output": {
    "s3_bucket": "fruitful-lab-snapshots-prod",
    "s3_prefix": "repo-scans/snapshotter"
  },
  "metadata": {
    "triggered_by": "manual|langgraph|cron",
    "notes": "optional"
  }
}
```
Defaults (v0.1):
- `mode = full`
- `max_file_bytes = 10MB`
- `max_total_bytes = 250MB`
- `max_files = 20,000`
- `allow_exts="*"` with deny-list doing the safety work


## 4) S3 Output Layout (Locked)

All job artifacts are written under:

`{s3_prefix}/{repo_slug}/{timestamp_utc}/{job_id}/`

Example:
- `repo-scans/snapshotter/fruitful-lab__tools/2025-12-24T15-03-12Z/abc123/...`

**Files (v0.1):**
- `repo_index.json`
- `artifact_manifest.json`
- `ARCHITECTURE_SUMMARY_SNAPSHOT.json`
- `GAPS_AND_INCONSISTENCIES.json`
- `ONBOARDING.md` (if enabled)
- `repo_snapshot.tar.gz` (if enabled)

## 5) Security & Bucket Constraints (Locked)

Uploads MUST satisfy bucket policy requirements:

- HTTPS only (implicit via AWS SDK)
- **SSE-S3 encryption required:** `AES256`
  - boto3 upload must include:
    - `ExtraArgs={"ServerSideEncryption":"AES256"}`

Snapshotter must never upload secrets:
- any file matching deny rules is skipped
- binary files are skipped unless explicitly allowed
- report all skips in `repo_index.json`

## 6) Pass 1: repo_index.json (Locked schema)

`repo_index.json` is the ground truth inventory:

```json
{
  "generated_at": "ISO-8601",
  "job": {
    "job_id": "string",
    "repo_url": "string",
    "requested_ref": "string",
    "resolved_commit": "string|unknown",
    "repo_slug": "string"
  },
  "limits": { "max_file_bytes": 0, "max_total_bytes": 0, "max_files": 0 },
  "filters": { "deny_dirs": [], "deny_file_regex": [], "allow_exts": [] },
  "counts": {
    "files_scanned": 0,
    "files_included": 0,
    "files_skipped": 0,
    "bytes_included": 0
  },
  "files": [
    {
      "path": "string",
      "bytes": 0,
      "sha256": "string",
      "language": "string",
      "imports": ["string"],
      "top_level_defs": ["string"],
      "flags": ["string"]
    }
  ],
  "skipped_files": [
    { "path": "string", "reason": "string", "bytes": 0 }
  ]
}
```
**Extraction rules (Pass 1):**
- `language` inferred from extension (`.py`, `.ts`, `.tsx`, `.js`, `.json`, `.md`, etc.)
- `imports`:
  - best-effort regex is acceptable in v0.1
- `top_level_defs`:
  - v0.1 required for Python via `ast`
  - best-effort for JS/TS (regex OK) OR mark unknown and add a flag

**Determinism:**
- file list sorted lexicographically by path
- stable timestamps recorded, but ordering stable

## 7) Pass 2: LLM semantic outputs (Locked constraints)
### 7.1 ARCHITECTURE_SUMMARY_SNAPSHOT.json

Must conform to the original Snapshotter concept, plus coverage/audit fields:

```json
{
  "generated_at": "ISO-8601",
  "repo": {
    "repo_url": "string",
    "resolved_commit": "string|unknown",
    "job_id": "string"
  },
  "coverage": {
    "files_scanned": 0,
    "files_read": 0,
    "files_not_read": 0
  },
  "modules": [
    {
      "module_name": "string",
      "path": "string",
      "responsibility": "string|unknown",
      "key_entrypoints": ["string"],
      "dependencies": ["string"],
      "notes": "string",
      "evidence_paths": ["string"]
    }
  ],
  "uncertainties": [
    {
      "type": "string",
      "description": "string",
      "files_involved": ["string"],
      "suggested_questions": ["string"]
    }
  ],
  "files_read": ["string"],
  "files_not_read": [
    { "path": "string", "reason": "string" }
  ]
}
```

**Hard constraints:**
- Responsibility must be grounded in:
  - docstrings/comments/README text, or
  - explicit exports / function names
- If not grounded: `responsibility="unknown"` + an uncertainty entry
- Dependencies must match literal imports (from Pass 1 index)

### 7.2 GAPS_AND_INCONSISTENCIES.json

```json
{
  "generated_at": "ISO-8601",
  "job_id": "string",
  "items": [
    {
      "type": "overlap|unclear_boundary|naming_mismatch|unexpected_dependency|missing_docs|incomplete_extraction",
      "description": "string",
      "files_involved": ["string"],
      "severity": "low|medium|high",
      "suggested_questions": ["string"]
    }
  ]
}
```

### 7.3 ONBOARDING.md (optional)

A human-readable doc including:
- “start here” files
- key flows
- where auth/analytics/experiments live (if present)
- “known confusing areas” (from gaps)

## 8) LLM Read Plan (Locked behavior, flexible implementation)

LLM does **not** blindly read every file. Instead:

1) It receives `repo_index.json`
2) It generates a **read plan** (list of file paths) bounded by:
   - `max_files_to_read` default 120
   - `max_total_chars` default ~250k
3) Worker streams contents for those files
4) LLM outputs the semantic docs + `files_read`/`files_not_read`

If the LLM requests a file not in `repo_index.json`: log it and mark as uncertainty.

## 9) Execution Environment (v0.1)

**Replit worker** runs:
- clone → pass1 → pass2 → upload → print result JSON

**Auth:**
- IAM User + scoped keys (v0.1)
- Future upgrade: role-based auth (not in v0.1)

## 10) Worker Result Contract (Locked)

The Replit run prints one JSON object:

```json
{
  "ok": true,
  "job_id": "string",
  "repo_url": "string",
  "requested_ref": "string",
  "resolved_commit": "string|unknown",
  "s3_bucket": "string",
  "s3_prefix": "string",
  "artifacts": {
    "repo_index": "s3://.../repo_index.json",
    "architecture_snapshot": "s3://.../ARCHITECTURE_SUMMARY_SNAPSHOT.json",
    "gaps": "s3://.../GAPS_AND_INCONSISTENCIES.json",
    "onboarding": "s3://.../ONBOARDING.md",
    "tarball": "s3://.../repo_snapshot.tar.gz"
  },
  "hashes": {
    "repo_index_sha256": "string",
    "tarball_sha256": "string"
  }
}
```
On failure:
- `ok=false`
- include `error_code`, `error_message`, `stage` (clone|pass1|pass2|upload)

## 11) Optional Approaches (Explicitly optional)

These are “later” knobs, not required for v0.1:

### A) Skip tarball
- OFF by default later to reduce storage
- Keep on in v0.1 for replayability

### B) Parsing depth for JS/TS
- v0.1: regex imports + unknown defs is acceptable
- v0.2+: ts-morph/tree-sitter

### C) Multi-agent LLM pass
- v0.1: single LLM call producing snapshot + gaps + onboarding
- later: separate “summarizer” + “gap detector”

### D) Triggering
- v0.1: manual run
- later: LangGraph webhook trigger + retries

## 12) Final Decisions Locked (So We Don’t Wobble)

- ✅ Two-pass model is locked
- ✅ Pass 1 is deterministic inventory receipt
- ✅ Pass 2 is semantic but must reconcile against Pass 1
- ✅ Outputs + S3 layout are locked
- ✅ AES256 SSE-S3 required on all uploads
- ✅ IAM user keys for v0.1