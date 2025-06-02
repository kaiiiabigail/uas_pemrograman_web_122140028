from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from .meta import Base
from datetime import datetime

class CategoryORM(Base):
    __tablename__ = 'categories'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    menu_items = relationship("MenuItemORM", back_populates="category") 