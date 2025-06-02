from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .meta import Base
from datetime import datetime
import enum

class OrderStatus(enum.Enum):
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    REJECTED = 'rejected'

class PaymentMethod(enum.Enum):
    BANK_TRANSFER = 'bank_transfer'
    E_WALLET = 'e_wallet'
    CREDIT_CARD = 'credit_card'

class OrderORM(Base):
    __tablename__ = 'orders'
    
    id = Column(Integer, primary_key=True)
    customer_name = Column(String(100), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    order_date = Column(DateTime, nullable=False)
    admin_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    admin = relationship("UserORM", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order") 