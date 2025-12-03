# backend/tests/test_config.py
from backend.config import OPENAI_API_KEY, require_openai_api_key


def test_openai_api_key_is_present():
    """
    Basic sanity test to ensure the OpenAI API key is available
    to the backend.

    This will fail if OPENAI_API_KEY is missing or empty in:
      - backend/.env (local)
      - environment variables (CI / Railway)
    """
    assert OPENAI_API_KEY, "OPENAI_API_KEY should not be empty"
    # And double-check the helper doesn't raise
    assert require_openai_api_key() == OPENAI_API_KEY
