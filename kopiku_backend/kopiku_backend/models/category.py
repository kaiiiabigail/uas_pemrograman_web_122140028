from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from .meta import Base
from sqlalchemy import Column, Integer, String, DateTime

class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, name, description=None):
        self.name = name
        self.description = description
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    @classmethod
    def from_orm(cls, orm_obj):
        return cls(
            name=orm_obj.name,
            description=orm_obj.description
        )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @classmethod
    def get_all(cls, dbsession: Session):
        categories = dbsession.query(cls).all()
        return [category.to_dict() for category in categories]

    @classmethod
    def get_by_id(cls, dbsession: Session, category_id: int):
        return dbsession.query(cls).filter(cls.id == category_id).first()

    @classmethod
    def create(cls, dbsession: Session, data: dict):
        new_category = cls(
            name=data['name'],
            description=data.get('description')
        )
        dbsession.add(new_category)
        dbsession.flush()
        return new_category

    @classmethod
    def update(cls, dbsession: Session, category_id: int, data: dict):
        category = dbsession.query(cls).filter(cls.id == category_id).first()
        if category:
            for key, value in data.items():
                setattr(category, key, value)
            dbsession.flush()
            return category
        return None

    @classmethod
    def delete(cls, dbsession: Session, category_id: int):
        category = dbsession.query(cls).filter(cls.id == category_id).first()
        if category:
            dbsession.delete(category)
            return True
        return False 