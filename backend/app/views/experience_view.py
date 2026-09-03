from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from app.views.selection_view import SelectionStepResponse
from app.views.card_view import CardResponse

class ExperienceCreate(BaseModel):
    title: Optional[str] = "Feliz Día del Amor y la Amistad"
    recipient_name: str
    sender_name: str
    envelope_note: Optional[str] = "Tienes una carta especial de Amor y Amistad esperando por ti..."
    music_url: Optional[str] = None

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    recipient_name: Optional[str] = None
    sender_name: Optional[str] = None
    envelope_note: Optional[str] = None
    music_url: Optional[str] = None
    is_active: Optional[bool] = None

class ExperienceResponse(BaseModel):
    id: int
    user_id: int
    title: str
    slug: str
    recipient_name: str
    sender_name: str
    envelope_note: Optional[str]
    music_url: Optional[str]
    is_active: bool
    hug_count: int = 0
    last_hug_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    selection_steps: List[SelectionStepResponse] = []
    cards: List[CardResponse] = []

    class Config:
        from_attributes = True

class PublicExperienceView(BaseModel):
    id: int
    title: str
    slug: str
    recipient_name: str
    sender_name: str
    envelope_note: Optional[str]
    music_url: Optional[str]
    hug_count: int = 0
    last_hug_at: Optional[datetime] = None
    selection_steps: List[SelectionStepResponse] = []
    cards: List[CardResponse] = []

    class Config:
        from_attributes = True
