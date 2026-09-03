from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class SelectionStep(Base):
    __tablename__ = "selection_steps"

    id = Column(Integer, primary_key=True, index=True)
    experience_id = Column(Integer, ForeignKey("experiences.id", ondelete="CASCADE"), nullable=False)
    
    question = Column(String(255), nullable=False)
    option_a = Column(String(120), nullable=False)
    option_b = Column(String(120), nullable=False)
    option_c = Column(String(120), nullable=True)
    
    reaction_text = Column(String(255), nullable=True, default="¡Sabía que elegirías esta opción! Prepárate para lo que viene...")
    order_index = Column(Integer, default=0)

    # Relationships
    experience = relationship("Experience", back_populates="selection_steps")
