import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

SECRET_KEY = os.getenv("SECRET_KEY", "chismOSOS_amor_y_amistad_secret_key_colombia_2026_super_secure")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Database Configuration (supports SQLite locally and PostgreSQL on Render/Neon)
raw_db_url = os.getenv("DATABASE_URL")
if not raw_db_url:
    DATABASE_URL = f"sqlite:///{BASE_DIR / 'chismos_os.db'}"
elif raw_db_url.startswith("postgres://"):
    DATABASE_URL = raw_db_url.replace("postgres://", "postgresql://", 1)
else:
    DATABASE_URL = raw_db_url

MAX_CARD_WORDS = 250

# Cloudflare R2 Storage (S3-compatible)
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID", "").strip()
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID", "").strip()
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY", "").strip()
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "").strip()
R2_PUBLIC_DOMAIN = os.getenv("R2_PUBLIC_DOMAIN", "").strip()

# Check if R2 is fully configured
USE_R2 = bool(
    R2_ACCOUNT_ID and
    R2_ACCESS_KEY_ID and
    R2_SECRET_ACCESS_KEY and
    R2_BUCKET_NAME and
    R2_PUBLIC_DOMAIN
)

# CORS Frontend URLs
FRONTEND_URL = os.getenv("FRONTEND_URL", "").strip()
