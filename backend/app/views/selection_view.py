from typing import Optional
from pydantic import BaseModel

class SelectionStepCreate(BaseModel):
    question: str
    option_a: str
    option_b: str
    option_c: Optional[str] = None
    reaction_text: Optional[str] = "¡Sabía que elegirías esta opción! ❤️"
    order_index: Optional[int] = 0

class SelectionStepUpdate(BaseModel):
    question: Optional[str] = None
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    reaction_text: Optional[str] = None
    order_index: Optional[int] = None

class SelectionStepResponse(BaseModel):
    id: int
    experience_id: int
    question: str
    option_a: str
    option_b: str
    option_c: Optional[str]
    reaction_text: Optional[str]
    order_index: int

    class Config:
        from_attributes = True
