import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.connection import Base

def generate_unique_slug():
    return uuid.uuid4().hex[:10]

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(120), nullable=False, default="Feliz Día del Amor y la Amistad")
    slug = Column(String(64), unique=True, index=True, default=generate_unique_slug)
    
    recipient_name = Column(String(80), nullable=False, default="Alguien muy especial")
    sender_name = Column(String(80), nullable=False, default="Con mucho cariño")
    envelope_note = Column(String(200), default="Tienes una carta especial de Amor y Amistad esperando por ti...")
    music_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    hug_count = Column(Integer, default=0, nullable=False)
    last_hug_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="experiences")
    selection_steps = relationship("SelectionStep", back_populates="experience", cascade="all, delete-orphan", order_by="SelectionStep.order_index")
    cards = relationship("Card", back_populates="experience", cascade="all, delete-orphan", order_by="Card.order_index")
