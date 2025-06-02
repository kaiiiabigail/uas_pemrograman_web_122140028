from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from .meta import Base
from sqlalchemy import Column, Integer, String, DateTime, Enum, Boolean
from sqlalchemy.orm import relationship
import enum

class UserRole(enum.Enum):
    ADMIN = 'admin'
    USER = 'user'

class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.USER)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    orders = relationship('Order', back_populates='user')

    def __init__(self, username, email, password_hash, role=UserRole.USER, is_admin=False):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.is_admin = is_admin

    @classmethod
    def from_orm(cls, orm_obj):
        return cls(
            username=orm_obj.username,
            email=orm_obj.email,
            password_hash=orm_obj.password_hash,
            role=orm_obj.role,
            is_admin=orm_obj.is_admin
        )

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role.value,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @classmethod
    def get_all(cls, dbsession: Session):
        users = dbsession.query(cls).all()
        return [user.to_dict() for user in users]

    @classmethod
    def get_by_id(cls, dbsession: Session, user_id: int):
        return dbsession.query(cls).filter(cls.id == user_id).first()

    @classmethod
    def get_by_email(cls, dbsession: Session, email: str):
        return dbsession.query(cls).filter(cls.email == email).first()

    @classmethod
    def create(cls, dbsession: Session, data: dict):
        new_user = cls(
            username=data['username'],
            email=data['email'],
            password_hash=data['password_hash'],
            role=UserRole(data.get('role', 'user')),
            is_admin=data.get('is_admin', False)
        )
        dbsession.add(new_user)
        dbsession.flush()
        return new_user

    @classmethod
    def update(cls, dbsession: Session, user_id: int, data: dict):
        user = dbsession.query(cls).filter(cls.id == user_id).first()
        if user:
            for key, value in data.items():
                if key == 'role':
                    value = UserRole(value)
                setattr(user, key, value)
            dbsession.flush()
            return user
        return None

    @classmethod
    def delete(cls, dbsession: Session, user_id: int):
        user = dbsession.query(cls).filter(cls.id == user_id).first()
        if user:
            dbsession.delete(user)
            return True
        return False 