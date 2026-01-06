#!/usr/bin/env python3
"""
S3 bucket policy test for:
- Deny non-HTTPS (not tested here; boto3 uses HTTPS by default)
- Deny incorrect encryption header (StringNotEqualsIfExists -> AES256)

Expected results:
1) no SSE header      -> SUCCESS (if bucket default encryption is enabled)
2) SSE=AES256         -> SUCCESS
3) SSE=aws:kms        -> FAIL (AccessDenied)
"""

import argparse
import datetime as dt
import sys

import boto3
from botocore.exceptions import ClientError

from dotenv import load_dotenv
load_dotenv()


def put_test_object(s3, bucket: str, key: str, body: bytes, sse: str | None):
    kwargs = {"Bucket": bucket, "Key": key, "Body": body}
    if sse is not None:
        kwargs["ServerSideEncryption"] = sse  # "AES256" or "aws:kms"

    return s3.put_object(**kwargs)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--bucket", required=True, help="e.g. fruitful-lab-snapshots-prod")
    parser.add_argument("--prefix", default="policy-tests", help="object prefix/folder in the bucket")
    args = parser.parse_args()

    s3 = boto3.client("s3")

    ts = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    base_key = f"{args.prefix}/{ts}"

    payload = f"policy test @ {ts}\n".encode("utf-8")

    tests = [
        ("no_sse_header_should_fail", None, False),
        ("sse_aes256_should_succeed", "AES256", True),
        ("sse_aws_kms_should_fail", "aws:kms", False),
    ]

    print(f"Bucket: {args.bucket}")
    print(f"Prefix: {args.prefix}")
    print("-" * 60)

    all_ok = True

    for name, sse, should_succeed in tests:
        key = f"{base_key}/{name}.txt"
        print(f"TEST: {name}")
        print(f"  Key: s3://{args.bucket}/{key}")
        print(f"  SSE: {sse if sse else '(none)'}")

        try:
            resp = put_test_object(s3, args.bucket, key, payload, sse)
            etag = resp.get("ETag", "").strip('"')
            if should_succeed:
                print(f"  ✅ SUCCESS (ETag={etag})")
            else:
                print("  ❌ UNEXPECTED SUCCESS (should have been denied)")
                all_ok = False

        except ClientError as e:
            code = e.response.get("Error", {}).get("Code", "Unknown")
            msg = e.response.get("Error", {}).get("Message", "")
            if should_succeed:
                print(f"  ❌ UNEXPECTED FAILURE: {code} — {msg}")
                all_ok = False
            else:
                # This is what we want for the aws:kms case
                print(f"  ✅ EXPECTED FAILURE: {code} — {msg}")

        print("-" * 60)

    if not all_ok:
        print("One or more tests did not match expectations.")
        sys.exit(1)

    print("All tests behaved as expected.")
    sys.exit(0)


if __name__ == "__main__":
    main()
