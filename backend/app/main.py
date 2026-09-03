from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import UPLOAD_DIR, FRONTEND_URL
from app.database.connection import engine, Base
from app.models import User, Experience, SelectionStep, Card
from app.controllers import auth_router, experience_router, card_router, selection_router

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="chismOSOS API",
    description="Backend para la experiencia interactiva del Día del Amor y la Amistad",
    version="1.0.0"
)

# CORS configuration for local development and Vercel production
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]
if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for static images
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Include MVC Controllers
app.include_router(auth_router)
app.include_router(experience_router)
app.include_router(card_router)
app.include_router(selection_router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "message": "chismOSOS API - Detalle de Amor y Amistad listo para enviar sonrisas ❤️✨",
        "celebration_date": "14 de Septiembre - Colombia"
    }
