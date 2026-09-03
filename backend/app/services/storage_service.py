import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from app.config import (
    UPLOAD_DIR,
    USE_R2,
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    R2_PUBLIC_DOMAIN,
)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE_MB = 10

CONTENT_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif"
}

def get_r2_client():
    import boto3
    from botocore.config import Config
    return boto3.client(
        service_name="s3",
        endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name="auto",
        config=Config(signature_version="s3v4")
    )

async def save_uploaded_image(file: UploadFile) -> str:
    # Validate extension
    file_ext = Path(file.filename or "").suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Formato no permitido. Formatos soportados: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read content and check size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El archivo supera el tamaño máximo permitido de {MAX_FILE_SIZE_MB}MB."
        )

    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"

    # If Cloudflare R2 is configured, upload to R2
    if USE_R2:
        try:
            s3_client = get_r2_client()
            content_type = file.content_type or CONTENT_TYPES.get(file_ext, "image/jpeg")
            s3_client.put_object(
                Bucket=R2_BUCKET_NAME,
                Key=unique_filename,
                Body=contents,
                ContentType=content_type
            )
            public_domain = R2_PUBLIC_DOMAIN.rstrip("/")
            if not public_domain.startswith("http://") and not public_domain.startswith("https://"):
                public_domain = f"https://{public_domain}"
            return f"{public_domain}/{unique_filename}"
        except Exception as e:
            print(f"[ERROR] Error al subir a Cloudflare R2: {e}")
            # Fallback to local disk if R2 fails
            target_path = UPLOAD_DIR / unique_filename
            with open(target_path, "wb") as f:
                f.write(contents)
            return f"/uploads/{unique_filename}"
    else:
        # Local filesystem storage
        target_path = UPLOAD_DIR / unique_filename
        with open(target_path, "wb") as f:
            f.write(contents)
        return f"/uploads/{unique_filename}"
