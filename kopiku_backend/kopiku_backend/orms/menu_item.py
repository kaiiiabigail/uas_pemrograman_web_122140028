from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .meta import Base
from datetime import datetime

class MenuItemORM(Base):
    __tablename__ = 'menu_items'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    price = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    image_url = Column(String(255))
    stock = Column(Integer, default=0, nullable=False)
    sold_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    category = relationship("CategoryORM", back_populates="menu_items")
    order_items = relationship("OrderItem", back_populates="menu_item") 