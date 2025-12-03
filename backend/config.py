# backend/config.py
import os
from dotenv import load_dotenv

load_dotenv()

# --- OpenAI (existing) ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def require_openai_api_key() -> str:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set")
    return OPENAI_API_KEY


# --- Auth / JWT config (new) ---
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)


def require_jwt_secret() -> str:
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is not set")
    return JWT_SECRET_KEY
