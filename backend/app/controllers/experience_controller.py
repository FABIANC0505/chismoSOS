from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database.connection import get_db
from app.models.user import User
from app.models.experience import Experience, generate_unique_slug
from app.models.selection_step import SelectionStep
from app.models.card import Card
from app.views.experience_view import ExperienceCreate, ExperienceUpdate, ExperienceResponse, PublicExperienceView
from app.views.card_view import CardResponse
from app.services.auth_service import get_current_user

router = APIRouter(tags=["Experiencias de Amor y Amistad"])

def serialize_experience(exp: Experience) -> ExperienceResponse:
    cards_response = [CardResponse.from_model(c) for c in exp.cards]
    return ExperienceResponse(
        id=exp.id,
        user_id=exp.user_id,
        title=exp.title,
        slug=exp.slug,
        recipient_name=exp.recipient_name,
        sender_name=exp.sender_name,
        envelope_note=exp.envelope_note,
        music_url=exp.music_url,
        is_active=exp.is_active,
        hug_count=exp.hug_count or 0,
        last_hug_at=exp.last_hug_at,
        created_at=exp.created_at,
        updated_at=exp.updated_at,
        selection_steps=exp.selection_steps,
        cards=cards_response
    )

@router.get("/api/experiences", response_model=List[ExperienceResponse])
def get_user_experiences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    experiences = db.query(Experience).options(
        joinedload(Experience.selection_steps),
        joinedload(Experience.cards)
    ).filter(Experience.user_id == current_user.id).order_by(Experience.created_at.desc()).all()

    return [serialize_experience(exp) for exp in experiences]

@router.post("/api/experiences", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
def create_experience(
    request: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_exp = Experience(
        user_id=current_user.id,
        title=request.title,
        slug=generate_unique_slug(),
        recipient_name=request.recipient_name,
        sender_name=request.sender_name,
        envelope_note=request.envelope_note,
        music_url=request.music_url,
        is_active=True
    )
    db.add(new_exp)
    db.flush()

    # Pre-populate with default romantic/friendship interactive step
    default_step = SelectionStep(
        experience_id=new_exp.id,
        question="Antes de empezar... ¿prometes sonreír con cada detalle que veas?",
        option_a="¡Lo prometo con el corazón! ❤️",
        option_b="¡De una! A ver qué chisme es... ✨",
        reaction_text="¡Sabía que dirías que sí! Esta carta fue creada especialmente para ti...",
        order_index=0
    )
    db.add(default_step)

    # Pre-populate with initial starter card
    default_card = Card(
        experience_id=new_exp.id,
        title="Un 14 de Septiembre Especial",
        image_url="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
        text_content="Hoy celebramos el Día del Amor y la Amistad. Hay personas que hacen del mundo un lugar más cálido, más bonito y lleno de risas sinceras. Este detalle es para recordarte lo mucho que significas y celebrar todos los momentos increíbles que compartimos.",
        order_index=0
    )
    db.add(default_card)

    db.commit()
    db.refresh(new_exp)
    return serialize_experience(new_exp)

@router.get("/api/experiences/{experience_id}", response_model=ExperienceResponse)
def get_experience_by_id(
    experience_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exp = db.query(Experience).options(
        joinedload(Experience.selection_steps),
        joinedload(Experience.cards)
    ).filter(
        Experience.id == experience_id,
        Experience.user_id == current_user.id
    ).first()
    if not exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experiencia no encontrada.")
    return serialize_experience(exp)

@router.put("/api/experiences/{experience_id}", response_model=ExperienceResponse)
def update_experience(
    experience_id: int,
    request: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exp = db.query(Experience).filter(
        Experience.id == experience_id,
        Experience.user_id == current_user.id
    ).first()
    if not exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experiencia no encontrada.")

    if request.title is not None:
        exp.title = request.title
    if request.recipient_name is not None:
        exp.recipient_name = request.recipient_name
    if request.sender_name is not None:
        exp.sender_name = request.sender_name
    if request.envelope_note is not None:
        exp.envelope_note = request.envelope_note
    if request.music_url is not None:
        exp.music_url = request.music_url
    if request.is_active is not None:
        exp.is_active = request.is_active

    db.commit()
    db.refresh(exp)
    return serialize_experience(exp)

@router.delete("/api/experiences/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    experience_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exp = db.query(Experience).filter(
        Experience.id == experience_id,
        Experience.user_id == current_user.id
    ).first()
    if not exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experiencia no encontrada.")

    db.delete(exp)
    db.commit()
    return None

# --- PUBLIC ROUTE FOR RECIPIENT ---
@router.get("/api/public/experience/{slug}", response_model=PublicExperienceView)
def get_public_experience(slug: str, db: Session = Depends(get_db)):
    exp = db.query(Experience).options(
        joinedload(Experience.selection_steps),
        joinedload(Experience.cards)
    ).filter(
        Experience.slug == slug,
        Experience.is_active == True
    ).first()
    if not exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La carta o experiencia que buscas no existe o ya no está disponible."
        )

    cards_response = [CardResponse.from_model(c) for c in sorted(exp.cards, key=lambda x: x.order_index)]
    steps_sorted = sorted(exp.selection_steps, key=lambda x: x.order_index)

    return PublicExperienceView(
        id=exp.id,
        title=exp.title,
        slug=exp.slug,
        recipient_name=exp.recipient_name,
        sender_name=exp.sender_name,
        envelope_note=exp.envelope_note,
        music_url=exp.music_url,
        hug_count=exp.hug_count or 0,
        last_hug_at=exp.last_hug_at,
        selection_steps=steps_sorted,
        cards=cards_response
    )

@router.post("/api/public/experience/{slug}/hug")
def return_hug(slug: str, db: Session = Depends(get_db)):
    from datetime import datetime
    exp = db.query(Experience).filter(
        Experience.slug == slug,
        Experience.is_active == True
    ).first()
    if not exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experiencia no encontrada."
        )

    exp.hug_count = (exp.hug_count or 0) + 1
    exp.last_hug_at = datetime.utcnow()
    db.commit()
    db.refresh(exp)

    return {
        "message": "¡Abrazo enviado de vuelta con éxito! Notificación entregada.",
        "hug_count": exp.hug_count,
        "recipient_name": exp.recipient_name,
        "sender_name": exp.sender_name
    }
