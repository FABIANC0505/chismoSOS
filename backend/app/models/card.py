from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    experience_id = Column(Integer, ForeignKey("experiences.id", ondelete="CASCADE"), nullable=False)
    
    image_url = Column(String(500), nullable=True)
    title = Column(String(120), nullable=True, default="Un momento inolvidable")
    text_content = Column(Text, nullable=False)
    order_index = Column(Integer, default=0)

    # Relationships
    experience = relationship("Experience", back_populates="cards")
