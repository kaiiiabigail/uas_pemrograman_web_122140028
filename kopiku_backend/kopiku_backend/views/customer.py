from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPUnauthorized
from ..models.menu_item import MenuItem
from ..models.category import Category
from ..models.order import Order
from ..models.user import User
from ..schema.menu_item import MenuItemSchema
from ..schema.category import CategorySchema
from ..schema.order import OrderSchema
from ..schema.user import UserSchema
from .base import BaseView
import bcrypt

class CustomerViews(BaseView):
    @view_config(route_name='home', request_method='GET', renderer='json')
    def get_home(self):
        """Get home page data."""
        # Get featured items
        featured_items = self.request.dbsession.query(MenuItem)\
            .filter(MenuItem.is_featured == True)\
            .limit(6).all()
        
        # Get categories
        categories = self.request.dbsession.query(Category).all()
        
        return {
            'featured_items': MenuItemSchema(many=True).dump(featured_items),
            'categories': CategorySchema(many=True).dump(categories)
        }

    @view_config(route_name='menu', request_method='GET', renderer='json')
    def get_menu(self):
        """Get all menu items."""
        menu_items = self.request.dbsession.query(MenuItem).all()
        return MenuItemSchema(many=True).dump(menu_items)

    @view_config(route_name='menu_category', request_method='GET', renderer='json')
    def get_menu_by_category(self):
        """Get menu items by category."""
        category = self.request.matchdict['category']
        menu_items = self.request.dbsession.query(MenuItem)\
            .join(Category)\
            .filter(Category.name == category)\
            .all()
        return MenuItemSchema(many=True).dump(menu_items)

    @view_config(route_name='checkout', request_method='POST', renderer='json')
    def create_order(self):
        """Create a new order."""
        data = self.request.json_body
        schema = OrderSchema()
        order_data = schema.load(data)
        
        # Create order
        order = Order(**order_data)
        self.request.dbsession.add(order)
        self.request.dbsession.flush()
        
        return schema.dump(order)

    @view_config(route_name='checkout_success', request_method='GET', renderer='json')
    def get_order_success(self):
        """Get order success details."""
        order_id = self.request.params.get('order_id')
        if not order_id:
            raise HTTPBadRequest(json_body={'error': 'Order ID is required'})
        
        order = self.request.dbsession.query(Order).filter_by(id=order_id).first()
        if not order:
            raise HTTPNotFound()
        
        return OrderSchema().dump(order)

    @view_config(route_name='profile', request_method='GET', renderer='json')
    def get_profile(self):
        """Get user profile."""
        user_id = self.request.authenticated_userid
        if not user_id:
            raise HTTPUnauthorized()
        
        user = self.request.dbsession.query(User).filter_by(id=user_id).first()
        if not user:
            raise HTTPNotFound()
        
        # Get user's orders
        orders = self.request.dbsession.query(Order)\
            .filter_by(user_id=user_id)\
            .order_by(Order.created_at.desc())\
            .all()
        
        return {
            'user': UserSchema().dump(user),
            'orders': OrderSchema(many=True).dump(orders)
        }
    
    @view_config(route_name='customer_register', request_method='POST', renderer='json')
    def customer_register(self):
        """Register a new customer."""
        data = self.request.json_body
        schema = UserSchema()
        user_data = schema.load(data)
        
        # Check if email already exists
        existing_user = self.request.dbsession.query(User).filter_by(email=user_data['email']).first()
        if existing_user:
            raise HTTPBadRequest(json_body={'error': 'Email already registered'})
        
        # Check if username already exists
        existing_username = self.request.dbsession.query(User).filter_by(username=user_data['username']).first()
        if existing_username:
            raise HTTPBadRequest(json_body={'error': 'Username already taken'})
        
        # Hash password
        password = user_data.pop('password')
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create new user
        new_user = User(
            username=user_data['username'],
            email=user_data['email'],
            password_hash=password_hash
        )
        
        self.request.dbsession.add(new_user)
        self.request.dbsession.flush()
        
        return {
            'success': True,
            'message': 'Registration successful',
            'user': UserSchema().dump(new_user),
            'redirect': '/login'  # Redirect URL for the frontend to navigate to the login page
        }
    
    @view_config(route_name='customer_login', request_method='POST', renderer='json')
    def customer_login(self):
        """Customer login."""
        data = self.request.json_body
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise HTTPBadRequest(json_body={'error': 'Email and password are required'})
        
        # Find user by email
        user = self.request.dbsession.query(User).filter_by(email=email).first()
        if not user:
            raise HTTPBadRequest(json_body={'error': 'Invalid email or password'})
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            raise HTTPBadRequest(json_body={'error': 'Invalid email or password'})
        
        # Return user data
        return {
            'success': True,
            'message': 'Login successful',
            'user': UserSchema().dump(user)
        }