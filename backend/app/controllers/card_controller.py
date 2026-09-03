from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.experience import Experience
from app.models.card import Card
from app.views.card_view import CardCreateRequest, CardUpdateRequest, CardResponse, count_words
from app.services.auth_service import get_current_user
from app.services.storage_service import save_uploaded_image

router = APIRouter(tags=["Tarjetas"])

@router.post("/api/cards/upload")
async def upload_card_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    url = await save_uploaded_image(file)
    return {"image_url": url}

@router.post("/api/experiences/{experience_id}/cards", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def add_card(
    experience_id: int,
    request: CardCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    experience = db.query(Experience).filter(
        Experience.id == experience_id,
        Experience.user_id == current_user.id
    ).first()
    if not experience:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experiencia no encontrada.")

    # Calculate default order if not passed
    existing_count = db.query(Card).filter(Card.experience_id == experience_id).count()
    order = request.order_index if request.order_index is not None and request.order_index > 0 else existing_count

    card = Card(
        experience_id=experience_id,
        title=request.title,
        image_url=request.image_url,
        text_content=request.text_content,
        order_index=order
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return CardResponse.from_model(card)

@router.put("/api/cards/{card_id}", response_model=CardResponse)
def update_card(
    card_id: int,
    request: CardUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    card = db.query(Card).join(Experience).filter(
        Card.id == card_id,
        Experience.user_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarjeta no encontrada.")

    if request.title is not None:
        card.title = request.title
    if request.image_url is not None:
        card.image_url = request.image_url
    if request.text_content is not None:
        card.text_content = request.text_content
    if request.order_index is not None:
        card.order_index = request.order_index

    db.commit()
    db.refresh(card)
    return CardResponse.from_model(card)

@router.delete("/api/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    card = db.query(Card).join(Experience).filter(
        Card.id == card_id,
        Experience.user_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarjeta no encontrada.")

    db.delete(card)
    db.commit()
    return None
