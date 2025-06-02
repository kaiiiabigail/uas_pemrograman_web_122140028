from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from .meta import Base
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship

class MenuItem(Base):
    __tablename__ = 'menu_items'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    stock = Column(Integer, nullable=False, default=0)
    sold = Column(Integer, nullable=False, default=0)

    # Relationships
    category = relationship("Category", backref="menu_items")
    order_items = relationship('OrderItem', back_populates='menu_item')

    def __init__(self, name, price, category_id, description=None, image_url=None, is_available=True, stock=0, sold=0):
        self.name = name
        self.price = price
        self.category_id = category_id
        self.description = description
        self.image_url = image_url
        self.is_available = is_available
        self.stock = stock
        self.sold = sold
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    @classmethod
    def from_orm(cls, orm_obj):
        return cls(
            name=orm_obj.name,
            price=orm_obj.price,
            category_id=orm_obj.category_id,
            description=orm_obj.description,
            image_url=orm_obj.image_url,
            is_available=orm_obj.is_available,
            stock=getattr(orm_obj, 'stock', 0),
            sold=getattr(orm_obj, 'sold', 0)
        )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image_url': self.image_url,
            'category_id': self.category_id,
            'is_available': self.is_available,
            'stock': self.stock or 0,
            'sold': self.sold or 0,
            'category': self.category.to_dict() if self.category else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @classmethod
    def get_all(cls, dbsession: Session):
        menu_items = dbsession.query(cls).options(
            joinedload(cls.category)
        ).all()
        return [item.to_dict() for item in menu_items]

    @classmethod
    def get_by_id(cls, dbsession: Session, menu_item_id: int):
        return dbsession.query(cls).options(
            joinedload(cls.category)
        ).filter(cls.id == menu_item_id).first()

    @classmethod
    def create(cls, dbsession: Session, data: dict):
        new_item = cls(
            name=data['name'],
            price=data['price'],
            category_id=data['category_id'],
            description=data.get('description'),
            image_url=data.get('image_url'),
            is_available=data.get('is_available', True),
            stock=data.get('stock', 0),
            sold=data.get('sold', 0)
        )
        dbsession.add(new_item)
        dbsession.flush()
        return new_item

    @classmethod
    def update(cls, dbsession: Session, menu_item_id: int, data: dict):
        menu_item = dbsession.query(cls).filter(cls.id == menu_item_id).first()
        if menu_item:
            for key, value in data.items():
                setattr(menu_item, key, value)
            dbsession.flush()
            return menu_item
        return None

    @classmethod
    def delete(cls, dbsession: Session, menu_item_id: int):
        menu_item = dbsession.query(cls).filter(cls.id == menu_item_id).first()
        if menu_item:
            dbsession.delete(menu_item)
            return True
        return False 