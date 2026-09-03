import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from app.config import UPLOAD_DIR

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE_MB = 10

async def save_uploaded_image(file: UploadFile) -> str:
    # Validate extension
    file_ext = Path(file.filename or "").suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Formato no permitido. Formatos soportados: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    target_path = UPLOAD_DIR / unique_filename

    # Read content and check size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El archivo supera el tamaño máximo permitido de {MAX_FILE_SIZE_MB}MB."
        )

    # Write file
    with open(target_path, "wb") as f:
        f.write(contents)

    # Return relative URL path
    return f"/uploads/{unique_filename}"
