from pyramid.view import view_config
from ..orms.user import UserORM
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound, HTTPUnauthorized
from sqlalchemy.exc import IntegrityError
from datetime import datetime
import bcrypt
from ..models.user import User
from ..schema.user import UserSchema
from .base import BaseView

class UserViews(BaseView):
    """Views for user management."""

    @view_config(route_name='users', request_method='GET', renderer='json')
    def get_users(self):
        """Get all users."""
        users = self.request.dbsession.query(User).all()
        return UserSchema(many=True).dump(users)

    @view_config(route_name='user', request_method='GET', renderer='json')
    def get_user(self):
        """Get a specific user by ID."""
        user_id = self.request.matchdict['id']
        user = self.request.dbsession.query(User).filter_by(id=user_id).first()
        if not user:
            raise HTTPNotFound()
        return UserSchema().dump(user)

    @view_config(route_name='users', request_method='POST', renderer='json')
    def create_user(self):
        """Create a new user."""
        data = self.request.json_body
        schema = UserSchema()
        user_data = schema.load(data)
        
        # Hash password
        password = user_data['password'].encode('utf-8')
        hashed = bcrypt.hashpw(password, bcrypt.gensalt())
        user_data['password'] = hashed.decode('utf-8')
        
        user = User(**user_data)
        self.request.dbsession.add(user)
        self.request.dbsession.flush()
        
        return schema.dump(user)

    @view_config(route_name='register', request_method='POST', renderer='json')
    def register(self):
        """Register a new user."""
        data = self.request.json_body
        schema = UserSchema()
        user_data = schema.load(data)
        
        # Check if email already exists
        existing_user = self.request.dbsession.query(User).filter_by(email=user_data['email']).first()
        if existing_user:
            raise HTTPBadRequest(json_body={'error': 'Email already registered'})
        
        # Hash password
        password = user_data['password'].encode('utf-8')
        hashed = bcrypt.hashpw(password, bcrypt.gensalt())
        user_data['password'] = hashed.decode('utf-8')
        
        # Set default role to USER
        user_data['role'] = 'USER'
        
        user = User(**user_data)
        self.request.dbsession.add(user)
        self.request.dbsession.flush()
        
        return schema.dump(user)

    @view_config(route_name='user', request_method='PUT', renderer='json')
    def update_user(self):
        """Update an existing user."""
        user_id = self.request.matchdict['id']
        user = self.request.dbsession.query(User).filter_by(id=user_id).first()
        if not user:
            raise HTTPNotFound()
        
        data = self.request.json_body
        schema = UserSchema()
        user_data = schema.load(data)
        
        # Hash password if provided
        if 'password' in user_data:
            password = user_data['password'].encode('utf-8')
            hashed = bcrypt.hashpw(password, bcrypt.gensalt())
            user_data['password'] = hashed.decode('utf-8')
        
        for key, value in user_data.items():
            setattr(user, key, value)
        
        return schema.dump(user)

    @view_config(route_name='user', request_method='DELETE', renderer='json')
    def delete_user(self):
        """Delete a user."""
        user_id = self.request.matchdict['id']
        user = self.request.dbsession.query(User).filter_by(id=user_id).first()
        if not user:
            raise HTTPNotFound()
        
        self.request.dbsession.delete(user)
        return {'message': 'User deleted successfully'}

    @view_config(route_name='login', request_method='POST', renderer='json')
    def login(self):
        """User login."""
        data = self.request.json_body
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise HTTPBadRequest(json_body={'error': 'Email and password are required'})
        
        user = self.request.dbsession.query(User).filter_by(email=email).first()
        if not user:
            raise HTTPBadRequest(json_body={'error': 'Invalid email or password'})
        
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            raise HTTPBadRequest(json_body={'error': 'Invalid email or password'})
        
        return UserSchema().dump(user) 