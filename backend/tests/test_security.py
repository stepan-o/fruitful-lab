# backend/tests/test_security.py

from security import hash_password, verify_password


def test_password_hash_and_verify_roundtrip():
    raw = "super-secret-password"
    hashed = hash_password(raw)

    assert hashed != raw
    assert verify_password(raw, hashed)
    assert not verify_password("wrong-password", hashed)
