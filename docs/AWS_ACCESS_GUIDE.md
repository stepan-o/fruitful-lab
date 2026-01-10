# Fruitful Snapshotter — AWS Setup & Access Guide

> Purpose: Document the AWS resources, security controls, and access patterns used by the **Repo Snapshotter** service to write/read snapshot artifacts in S3.

This doc covers:
- S3 bucket configuration + security enforcement
- IAM role + least-privilege policy for the snapshotter
- How the snapshotter (ECS task) accesses S3
- How humans/operators can access the same data safely
- Common failure modes (AccessDenied, encryption header issues, listing issues)

Scope: **Production** bucket `fruitful-lab-snapshots-prod` and the snapshotter prefix `repo-scans/snapshotter/`.

---

## 1) High-level Architecture

**Repo Snapshotter** runs as an **ECS Task** and writes artifacts to S3 under a dedicated prefix:

- Bucket: `fruitful-lab-snapshots-prod`
- Prefix: `repo-scans/snapshotter/`

Access is granted via an **IAM Role assumed by the ECS task** (no static keys in containers):
- IAM Role: `fruitful-repo-snapshotter-task-role`
- IAM Policy (customer managed): `fruitful-s3-repo-scans-rw`
- Principle: *least privilege to a single bucket + prefix*

Data access model:
- Snapshotter task role: read/write to the prefix only
- Operators: optional access via an IAM group (e.g., `fruitful-agents`) with the same policy attached

---

## 2) S3 Bucket — `fruitful-lab-snapshots-prod`

### 2.1 Public access & ownership
From the bucket Permissions tab:
- **Block Public Access**: **ON** (public access effectively blocked)
- **Object Ownership**: **Bucket owner enforced**
    - ACLs are disabled
    - Access is controlled via **bucket policy** + **IAM policies** only

### 2.2 CORS
- **CORS configuration**: none defined
- This is fine for backend-only access (ECS/servers). If you later need browser-based access (not recommended for this bucket), you would add a restrictive CORS policy.

---

## 3) S3 Bucket Policy — Security Guardrails

Current bucket policy enforces two important controls:

### 3.1 HTTPS-only
A deny statement blocks *any* S3 action if the request is not using TLS:
- `DenyInsecureTransport` with `aws:SecureTransport = false`

**Impact:** All clients must use `https://` S3 endpoints (AWS SDKs do by default).

### 3.2 Server-side encryption header requirement (SSE-S3)
A deny statement blocks `PutObject` unless the request includes:
- `s3:x-amz-server-side-encryption = AES256`

**Impact:** The snapshotter must set the SSE header on uploads.
- If missing or wrong: `AccessDenied` on PutObject

**Note:** This policy enforces the *header*, not KMS. (KMS would be `aws:kms`.)

---

## 4) IAM: Snapshotter ECS Task Role

Role name (from IAM):
- `fruitful-repo-snapshotter-task-role`

Purpose:
- Allows ECS tasks to call AWS services on your behalf (S3 access for snapshot artifacts)

Attached policy:
- `fruitful-s3-repo-scans-rw` (customer managed)

Operational notes:
- Ensure the ECS Task Definition uses this role as the **Task Role** (not just the Execution Role).
- The task’s AWS SDK credentials come from the task role automatically (via ECS credential endpoint).

---

## 5) IAM Policy: `fruitful-s3-repo-scans-rw` (Least-Privilege)

This policy is scoped to:
- Bucket: `arn:aws:s3:::fruitful-lab-snapshots-prod`
- Prefix: `repo-scans/snapshotter/*`

What it allows (as shown in the policy JSON):
- Bucket listing: `s3:ListBucket` **only** when `s3:prefix` matches `repo-scans/snapshotter/*`
- Object R/W under the prefix:
    - `s3:GetObject`
    - `s3:PutObject`
    - `s3:PutObjectTagging`
- Limited multipart support:
    - `s3:AbortMultipartUpload`
    - `s3:ListMultipartUploadParts`

Important implications:
- **ListBucket is prefix-scoped.** If code lists the bucket without a prefix filter, it will be denied.
- Multipart uploads are **not fully enabled** (missing Create/UploadPart/Complete). Only add if you truly upload large files via multipart.

---

## 6) Snapshotter Access Pattern (How the service should write to S3)

### 6.1 Required S3 write behavior
Uploads MUST:
1) Use HTTPS (handled by default by AWS SDK)
2) Include SSE-S3 header: `x-amz-server-side-encryption: AES256`

Most SDKs can set this via:
- AWS SDK config option for SSE-S3, or
- Explicit parameter on each PutObject call

### 6.2 Object key convention
All snapshotter objects must live under:
- `s3://fruitful-lab-snapshots-prod/repo-scans/snapshotter/...`

Recommendation:
- Partition by repo + timestamp to make browsing cheap:
    - `repo-scans/snapshotter/<repo>/<YYYY>/<MM>/<DD>/<run-id>/...`

### 6.3 Listing objects
Any list call must include:
- `Prefix = "repo-scans/snapshotter/"`

Otherwise, `s3:ListBucket` will be denied due to the policy condition.

---

## 7) Human / Operator Access (How to access artifacts safely)

Two safe patterns:

### 7.1 Use an IAM user/group with the same scoped policy
The `fruitful-s3-repo-scans-rw` policy is also attached to:
- IAM group: `fruitful-agents` (shown in Entities attached)

This allows operators to:
- List/read/write only under the snapshotter prefix
- Without granting broad S3 access

### 7.2 Use AWS CLI (example patterns)
List snapshots (must include prefix):
```bash
aws s3api list-objects-v2 \
  --bucket fruitful-lab-snapshots-prod \
  --prefix repo-scans/snapshotter/ \
  --max-items 50
```

Download an artifact:
```bash
aws s3 cp \
  s3://fruitful-lab-snapshots-prod/repo-scans/snapshotter/<path> \
  .
````

Upload a test object (must include SSE header):
```bash
aws s3api put-object \
  --bucket fruitful-lab-snapshots-prod \
  --key repo-scans/snapshotter/_diagnostics/test.txt \
  --body ./test.txt \
  --server-side-encryption AES256
```

---

## 8) Common Failure Modes & Fixes

### 8.1 AccessDenied on PutObject
Most likely causes:
- Missing SSE header (must be `AES256`)
- Attempting to write outside `repo-scans/snapshotter/`
- Using the wrong IAM role/credentials

Fix:
- Ensure PutObject sets `ServerSideEncryption = AES256`
- Confirm the ECS Task Role is `fruitful-repo-snapshotter-task-role`

### 8.2 AccessDenied on ListBucket / ListObjectsV2
Cause:
- Listing without a prefix (policy requires `s3:prefix` like `repo-scans/snapshotter/*`)

Fix:
- Always list with Prefix `repo-scans/snapshotter/`

### 8.3 Multipart upload fails
Cause:
- Policy currently lacks full multipart permissions (`CreateMultipartUpload`, `UploadPart`, `CompleteMultipartUpload`)

Fix options:
- Prefer single PUT for small artifacts, OR
- Add the missing actions only if needed (keep resource scoped to the prefix)

### 8.4 “Public access” / CORS confusion
Notes:
- Public access is intentionally blocked.
- No CORS is configured because this bucket is not meant for browser access.

---

## 9) S3 Write Access Policy Test (Required)

We enforce **SSE-S3 (AES256)** at the bucket level for **all `PutObject`** operations. To avoid “it works on my machine” surprises, we keep a small policy test script in the repo and run it whenever:

- bucket policy changes
- IAM user/policy changes (e.g., `agent-repo-snapshotter`)
- Snapshotter upload code changes
- credentials are rotated

### 9.1 What the test validates

The bucket policy enforces:

- **HTTPS-only transport** (not directly tested; AWS SDK uses HTTPS by default)
- **Encryption header is required** (`s3:x-amz-server-side-encryption` must be present)
- **Encryption header must be exactly `AES256`**

So the expected behavior is:

1) **No SSE header** → **FAIL** (AccessDenied; explicit deny in bucket policy)
2) **SSE = AES256** → **SUCCESS**
3) **SSE = aws:kms** → **FAIL** (AccessDenied; wrong encryption mode)

### 9.2 Script location

`backend/scripts/aws/s3_policy_test.py`

### 9.3 Prerequisites

- Valid AWS credentials in environment **or** a local `.env` file (the script calls `load_dotenv()`).
- IAM user permissions scoped to the Snapshotter prefix (example: `repo-scans/snapshotter/*`).

### 9.4 Run the test

From the repo root:

```bash
uv run python backend/scripts/aws/s3_policy_test.py \
  --bucket fruitful-lab-snapshots-prod \
  --prefix repo-scans/snapshotter/policy-tests
```

Important: The prefix must be under `repo-scans/snapshotter/` if your IAM policy is scoped to that prefix.

### 9.5 Expected output (example)
- `no_sse_header_should_fail` → ✅ EXPECTED FAILURE (AccessDenied)
- `sse_aes256_should_succeed` → ✅ SUCCESS
- `sse_aws_kms_should_fail` → ✅ EXPECTED FAILURE (AccessDenied)

If `sse_aes256_should_succeed` fails, the most common causes are:
- wrong bucket or prefix (outside the allowed IAM scope)
- credentials not loaded / wrong access keys
- identity-based policy missing `s3:PutObject` for the target prefix
- bucket policy changed (encryption requirements tightened/altered)