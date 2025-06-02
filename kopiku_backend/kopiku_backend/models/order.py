from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from .meta import Base
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

class OrderStatus(enum.Enum):
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'

class Order(Base):
    __tablename__ = 'orders'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship('User', back_populates='orders')
    order_items = relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')

    def __init__(self, user_id, total_amount, status=OrderStatus.PENDING):
        self.user_id = user_id
        self.total_amount = total_amount
        self.status = status

    @classmethod
    def from_orm(cls, orm_obj):
        return cls(
            user_id=orm_obj.user_id,
            total_amount=orm_obj.total_amount,
            status=orm_obj.status
        )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_amount': self.total_amount,
            'status': self.status.value,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'user': self.user.to_dict() if self.user else None,
            'items': [item.to_dict() for item in self.order_items]
        }

    @classmethod
    def get_all(cls, dbsession: Session):
        orders = dbsession.query(cls).options(
            joinedload(cls.user),
            joinedload(cls.order_items)
        ).all()
        return [order.to_dict() for order in orders]

    @classmethod
    def get_by_id(cls, dbsession: Session, order_id: int):
        return dbsession.query(cls).options(
            joinedload(cls.user),
            joinedload(cls.order_items)
        ).filter(cls.id == order_id).first()

    @classmethod
    def create(cls, dbsession: Session, data: dict):
        new_order = cls(
            user_id=data['user_id'],
            total_amount=data['total_amount'],
            status=OrderStatus(data.get('status', 'pending'))
        )
        dbsession.add(new_order)
        dbsession.flush()
        return new_order

    @classmethod
    def update(cls, dbsession: Session, order_id: int, data: dict):
        order = dbsession.query(cls).filter(cls.id == order_id).first()
        if order:
            # If order is being cancelled, restore stock and reduce sold count
            if 'status' in data and data['status'] == OrderStatus.CANCELLED and order.status != OrderStatus.CANCELLED:
                for item in order.order_items:
                    from ..models.menu_item import MenuItem
                    menu_item = dbsession.query(MenuItem).filter_by(id=item.menu_item_id).first()
                    if menu_item:
                        menu_item.stock += item.quantity
                        menu_item.sold -= item.quantity

            for key, value in data.items():
                if key == 'status':
                    value = OrderStatus(value)
                setattr(order, key, value)
            dbsession.flush()
            return order
        return None

    @classmethod
    def delete(cls, dbsession: Session, order_id: int):
        order = dbsession.query(cls).filter(cls.id == order_id).first()
        if order:
            dbsession.delete(order)
            return True
        return False 