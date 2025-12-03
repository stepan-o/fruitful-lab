# backend/config.py
import os
from dotenv import load_dotenv

# Load environment variables from .env when running locally.
# On Railway, env vars come from the service config and load_dotenv()
# just quietly does nothing if there's no file.
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def require_openai_api_key() -> str:
    """
    Return the OpenAI API key or raise a clear error if it's missing.

    You can use this in actual code where the key is required.
    """
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set")
    return OPENAI_API_KEY
