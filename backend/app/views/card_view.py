from typing import Optional
from pydantic import BaseModel, field_validator
from app.config import MAX_CARD_WORDS

def count_words(text: str) -> int:
    if not text:
        return 0
    return len(text.strip().split())

class CardCreateRequest(BaseModel):
    title: Optional[str] = "Un momento inolvidable"
    image_url: Optional[str] = None
    text_content: str
    order_index: Optional[int] = 0

    @field_validator("text_content")
    @classmethod
    def validate_word_limit(cls, v: str) -> str:
        words = count_words(v)
        if words > MAX_CARD_WORDS:
            raise ValueError(
                f"El texto supera el límite de {MAX_CARD_WORDS} palabras. "
                f"Actualmente contiene {words} palabras."
            )
        if words == 0:
            raise ValueError("El contenido de la tarjeta no puede estar vacío.")
        return v

class CardUpdateRequest(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    text_content: Optional[str] = None
    order_index: Optional[int] = None

    @field_validator("text_content")
    @classmethod
    def validate_word_limit(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            words = count_words(v)
            if words > MAX_CARD_WORDS:
                raise ValueError(
                    f"El texto supera el límite de {MAX_CARD_WORDS} palabras. "
                    f"Actualmente contiene {words} palabras."
                )
        return v

class CardResponse(BaseModel):
    id: int
    experience_id: int
    title: Optional[str]
    image_url: Optional[str]
    text_content: str
    order_index: int
    word_count: int

    @classmethod
    def from_model(cls, card):
        return cls(
            id=card.id,
            experience_id=card.experience_id,
            title=card.title,
            image_url=card.image_url,
            text_content=card.text_content,
            order_index=card.order_index,
            word_count=count_words(card.text_content)
        )

    class Config:
        from_attributes = True
