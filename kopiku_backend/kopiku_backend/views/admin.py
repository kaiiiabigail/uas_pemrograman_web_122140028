from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPUnauthorized, HTTPForbidden
from ..models.user import User, UserRole
from ..models.order import Order, OrderStatus
from ..models.order_item import OrderItem
from ..models.menu_item import MenuItem
from ..models.category import Category
from ..schema.user import UserSchema
from ..schema.order import OrderSchema
from ..schema.menu_item import MenuItemSchema
from ..schema.category import CategorySchema
from .base import BaseView
import bcrypt
from datetime import datetime, timedelta
from sqlalchemy import func, desc
import jwt
from pyramid.response import Response
import json
import os
import uuid
import shutil

class AdminViews(BaseView):
    def __init__(self, request):
        super().__init__(request)
        self.category_schema = CategorySchema()
        self.menu_item_schema = MenuItemSchema()
        
    @view_config(route_name='admin_login', request_method='POST', renderer='json')
    def admin_login(self):
        """Admin login endpoint."""
        data = self.request.json_body
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise HTTPBadRequest(json_body={'error': 'Email and password are required'})
        
        user = self.request.dbsession.query(User).filter_by(email=email).first()
        if not user or not user.is_admin:
            raise HTTPUnauthorized(json_body={'error': 'Invalid credentials'})
        
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            raise HTTPUnauthorized(json_body={'error': 'Invalid credentials'})
        
        # Generate JWT token
        settings = self.request.registry.settings
        secret = settings.get('jwt.secret', 'your-secret-key-here')
        algorithm = settings.get('jwt.algorithm', 'HS256')
        expiration = int(settings.get('jwt.expiration', 86400))  # Default 24 hours
        
        token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'role': user.role.value,
            'is_admin': user.is_admin,
            'exp': datetime.utcnow() + timedelta(seconds=expiration)
        }, secret, algorithm=algorithm)
        
        return {
            'user': UserSchema().dump(user),
            'token': token
        }

    @view_config(route_name='admin_dashboard', renderer='json', request_method='GET')
    def admin_dashboard(self):
        """Get dashboard statistics."""
        try:
            # Get today's date range
            today = datetime.utcnow().date()
            today_start = datetime.combine(today, datetime.min.time())
            today_end = datetime.combine(today, datetime.max.time())

            # Get this month's date range
            month_start = today.replace(day=1)
            if today.month == 12:
                next_month = today.replace(year=today.year + 1, month=1, day=1)
            else:
                next_month = today.replace(month=today.month + 1, day=1)
            month_end = next_month - timedelta(days=1)

            # Get statistics
            stats = {
                'today': {
                    'orders': self.request.dbsession.query(func.count(Order.id))
                        .filter(Order.created_at >= today_start)
                        .filter(Order.created_at <= today_end)
                        .scalar() or 0,
                    'revenue': self.request.dbsession.query(func.sum(Order.total_amount))
                        .filter(Order.created_at >= today_start)
                        .filter(Order.created_at <= today_end)
                        .scalar() or 0
                },
                'this_month': {
                    'orders': self.request.dbsession.query(func.count(Order.id))
                        .filter(Order.created_at >= month_start)
                        .filter(Order.created_at <= month_end)
                        .scalar() or 0,
                    'revenue': self.request.dbsession.query(func.sum(Order.total_amount))
                        .filter(Order.created_at >= month_start)
                        .filter(Order.created_at <= month_end)
                        .scalar() or 0
                },
                'total_users': self.request.dbsession.query(func.count(User.id)).scalar() or 0,
                'total_menu_items': self.request.dbsession.query(func.count(MenuItem.id)).scalar() or 0,
                'total_categories': self.request.dbsession.query(func.count(Category.id)).scalar() or 0
            }

            # Get recent orders
            recent_orders = self.request.dbsession.query(Order)\
                .order_by(Order.created_at.desc())\
                .limit(5)\
                .all()
            stats['recent_orders'] = [OrderSchema().dump(order) for order in recent_orders]

            # Get top selling items
            top_items = self.request.dbsession.query(
                MenuItem,
                func.sum(OrderItem.quantity).label('total_quantity')
            ).join(OrderItem)\
                .group_by(MenuItem.id)\
                .order_by(desc('total_quantity'))\
                .limit(5)\
                .all()
            stats['top_items'] = [
                {
                    'item': MenuItemSchema().dump(item),
                    'total_quantity': quantity
                }
                for item, quantity in top_items
            ]

            return stats
        except Exception as e:
            return Response(json={'error': str(e)}, status=500)

    @view_config(route_name='admin_users', renderer='json', request_method='GET')
    def get_users(self):
        """Get all users with pagination and filtering."""
        try:
            # Get query parameters
            page = int(self.request.params.get('page', 1))
            per_page = int(self.request.params.get('per_page', 10))
            role = self.request.params.get('role')
            search = self.request.params.get('search')

            # Build query
            query = self.request.dbsession.query(User)
            
            # Apply filters
            if role:
                query = query.filter(User.role == role)
            if search:
                query = query.filter(
                    (User.name.ilike(f'%{search}%')) |
                    (User.email.ilike(f'%{search}%'))
                )

            # Get total count
            total = query.count()

            # Apply pagination
            users = query.order_by(User.created_at.desc())\
                .offset((page - 1) * per_page)\
                .limit(per_page)\
                .all()

            return {
                'users': [self.user_schema.dump(user) for user in users],
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': (total + per_page - 1) // per_page
            }
        except Exception as e:
            return Response(json={'error': str(e)}, status=500)

    @view_config(route_name='admin_user', renderer='json', request_method='GET')
    def get_user(self):
        """Get a specific user by ID."""
        try:
            user_id = self.request.matchdict['id']
            user = self.request.dbsession.query(User).get(user_id)
            
            if not user:
                return Response(json={'error': 'User not found'}, status=404)
            
            return self.user_schema.dump(user)
        except Exception as e:
            return Response(json={'error': str(e)}, status=500)

    @view_config(route_name='admin_stats', renderer='json', request_method='GET')
    def get_stats(self):
        """Get detailed statistics."""
        try:
            # Get parameters from query
            report_type = self.request.params.get('type', 'daily')
            start_date = self.request.params.get('start_date')
            end_date = self.request.params.get('end_date')

            print(f"Fetching stats with type={report_type}, start_date={start_date}, end_date={end_date}")

            if not start_date or not end_date:
                return self.json_response({'error': 'Start date and end date are required'}, 400)

            # Convert dates
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
                # Add time to end_date to include the entire day
                end_date = datetime.combine(end_date.date(), datetime.max.time())
            except ValueError as e:
                print(f"Date parsing error: {str(e)}")
                return self.json_response({'error': f'Invalid date format: {str(e)}'}, 400)

            print(f"Parsed dates: start={start_date}, end={end_date}")

            # Helper function to safely convert Decimal to float
            def decimal_to_float(value):
                from decimal import Decimal
                if isinstance(value, Decimal):
                    return float(value)
                return value or 0

            # Base query for orders
            order_query = self.request.dbsession.query(
                func.date(Order.created_at).label('date'),
                func.count(Order.id).label('order_count'),
                func.sum(Order.total_amount).label('revenue')
            ).filter(
                Order.created_at >= start_date,
                Order.created_at <= end_date
            )

            # Get order statistics based on report type
            if report_type == 'daily':
                order_stats = order_query.group_by(
                    func.date(Order.created_at)
                ).all()
            elif report_type == 'weekly':
                order_stats = order_query.group_by(
                    func.date_trunc('week', Order.created_at)
                ).all()
            elif report_type == 'monthly':
                order_stats = order_query.group_by(
                    func.date_trunc('month', Order.created_at)
                ).all()
            else:
                return self.json_response({'error': 'Invalid report type'}, 400)

            print(f"Found {len(order_stats)} order stats records")

            # Get category statistics - with null checks
            # Use select_from to explicitly define the left side of the join
            category_stats_query = self.request.dbsession.query(
                Category,
                func.count(MenuItem.id).label('item_count'),
                func.sum(OrderItem.quantity).label('total_quantity'),
                func.sum(OrderItem.subtotal).label('total_sales')
            ).select_from(Category)
            
            # Add explicit joins with ON clauses
            category_stats_query = category_stats_query.outerjoin(
                MenuItem, MenuItem.category_id == Category.id
            )
            
            # Only apply the order filters if we have order data
            if order_stats:
                category_stats_query = category_stats_query.outerjoin(
                    OrderItem, OrderItem.menu_item_id == MenuItem.id
                ).outerjoin(
                    Order, OrderItem.order_id == Order.id
                ).filter(
                    Order.created_at >= start_date,
                    Order.created_at <= end_date
                )
            else:
                category_stats_query = category_stats_query.outerjoin(
                    OrderItem, OrderItem.menu_item_id == MenuItem.id
                )
                
            category_stats = category_stats_query.group_by(Category.id).all()
            
            print(f"Found {len(category_stats)} category stats records")

            # Get top selling items - with null checks
            # Use select_from to explicitly define the left side of the join
            top_items_query = self.request.dbsession.query(
                MenuItem,
                func.sum(OrderItem.quantity).label('total_quantity'),
                func.sum(OrderItem.subtotal).label('total_sales')
            ).select_from(MenuItem)
            
            # Add explicit join with ON clause
            top_items_query = top_items_query.outerjoin(
                OrderItem, OrderItem.menu_item_id == MenuItem.id
            )
            
            # Only apply the order filters if we have order data
            if order_stats:
                top_items_query = top_items_query.outerjoin(
                    Order, OrderItem.order_id == Order.id
                ).filter(
                    Order.created_at >= start_date,
                    Order.created_at <= end_date
                )
                
            top_items = top_items_query.group_by(MenuItem.id).order_by(func.sum(OrderItem.quantity).desc()).limit(5).all()
            
            print(f"Found {len(top_items)} top items records")

            # Calculate totals - safely handle empty results
            total_orders = sum(stat.order_count for stat in order_stats) if order_stats else 0
            total_revenue = sum(decimal_to_float(stat.revenue) for stat in order_stats) if order_stats else 0
            average_order_value = total_revenue / total_orders if total_orders > 0 else 0

            # Format the response to match frontend expectations
            response_data = {
                'total_orders': total_orders,
                'total_revenue': total_revenue,
                'average_order_value': average_order_value,
                'order_stats': [
                    {
                        'date': str(stat.date),
                        'order_count': stat.order_count,
                        'revenue': decimal_to_float(stat.revenue)
                    }
                    for stat in order_stats
                ],
                # Format category stats to match frontend expectations
                'top_categories': [
                    {
                        'id': category.id,
                        'name': category.name,
                        'items_sold': decimal_to_float(quantity),
                        'total_sales': decimal_to_float(sales)
                    }
                    for category, count, quantity, sales in category_stats
                ],
                # Format top items to match frontend expectations
                'top_items': [
                    {
                        'id': item.id,
                        'name': item.name,
                        'category_name': item.category.name if item.category else 'Uncategorized',
                        'image': item.image_url if hasattr(item, 'image_url') else '',
                        'quantity_sold': decimal_to_float(quantity),
                        'total_sales': decimal_to_float(sales)
                    }
                    for item, quantity, sales in top_items
                ]
            }
            
            print(f"Returning stats response with {len(response_data['order_stats'])} order stats, {len(response_data['top_categories'])} categories, {len(response_data['top_items'])} top items")
            return response_data
            
        except Exception as e:
            import traceback
            print(f"Error in get_stats: {str(e)}")
            print(traceback.format_exc())
            return self.json_response({'error': str(e)}, 500)

    @view_config(route_name='admin_orders', request_method='GET', renderer='json')
    def get_orders(self):
        """Get all orders with optional filters."""
        status = self.request.params.get('status')
        start_date = self.request.params.get('start_date')
        end_date = self.request.params.get('end_date')
        
        query = self.request.dbsession.query(Order)
        
        if status:
            query = query.filter(Order.status == status)
        if start_date:
            query = query.filter(Order.created_at >= start_date)
        if end_date:
            query = query.filter(Order.created_at <= end_date)
            
        orders = query.order_by(Order.created_at.desc()).all()
        return OrderSchema(many=True).dump(orders)

    @view_config(route_name='admin_order', request_method='GET', renderer='json')
    def get_order(self):
        """Get a specific order by ID with its order items."""
        try:
            order_id = int(self.request.matchdict['id'])
            order = self.request.dbsession.query(Order).get(order_id)
            
            if not order:
                return self.json_response({'error': 'Order not found'}, 404)
                
            # Get order items for this order
            order_items = self.request.dbsession.query(OrderItem).filter(OrderItem.order_id == order_id).all()
            
            # Convert order to dict
            order_dict = order.to_dict()
            
            # Add order items to the order dict
            order_dict['items'] = [item.to_dict() for item in order_items]
            
            return order_dict
            
        except ValueError:
            return self.json_response({'error': 'Invalid order ID'}, 400)

    @view_config(route_name='admin_order', request_method='DELETE', renderer='json')
    def delete_order(self):
        """Delete an order (only for cancelled orders)."""
        order_id = self.request.matchdict['id']
        
        order = self.request.dbsession.query(Order).get(order_id)
        if not order:
            raise HTTPNotFound(json_body={'error': 'Order not found'})
        
        if order.status != OrderStatus.CANCELLED:
            raise HTTPForbidden(json_body={'error': 'Only cancelled orders can be deleted'})
        
        self.request.dbsession.delete(order)
        return {'message': 'Order deleted successfully'}

    @view_config(route_name='admin_menu', request_method='GET', renderer='json')
    def get_menu_items(self):
        """Get all menu items with optional category filter."""
        category_id = self.request.params.get('category_id')
        
        query = self.request.dbsession.query(MenuItem)
        if category_id:
            query = query.filter(MenuItem.category_id == category_id)
            
        menu_items = query.all()
        return MenuItemSchema(many=True).dump(menu_items)

    @view_config(route_name='admin_menu', request_method='POST', renderer='json')
    def create_menu_item(self):
        """Create a new menu item."""
        data = self.request.json_body
        
        # Validate required fields
        required_fields = ['name', 'price', 'category_id']
        for field in required_fields:
            if field not in data:
                raise HTTPBadRequest(json_body={'error': f'{field} is required'})
        
        # Check if category exists
        category = self.request.dbsession.query(Category).get(data['category_id'])
        if not category:
            raise HTTPBadRequest(json_body={'error': 'Category not found'})
        
        # Ensure stock is a valid integer
        stock = data.get('stock', 0)
        if not isinstance(stock, int) or stock < 0:
            raise HTTPBadRequest(json_body={'error': 'Stock must be a non-negative integer'})
        
        menu_item = MenuItem(
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            category_id=data['category_id'],
            is_available=data.get('is_available', True),
            image_url=data.get('image_url'),
            stock=stock,
            sold=0  # Initialize sold count to 0
        )
        
        self.request.dbsession.add(menu_item)
        self.request.dbsession.flush()  # Flush to get the ID
        self.request.dbsession.refresh(menu_item)  # Refresh to get all fields
        return MenuItemSchema().dump(menu_item)

    @view_config(route_name='admin_menu_item', request_method='PUT', renderer='json')
    def update_menu_item(self):
        """Update an existing menu item."""
        menu_id = self.request.matchdict['id']
        data = self.request.json_body
        
        menu_item = self.request.dbsession.query(MenuItem).get(menu_id)
        if not menu_item:
            raise HTTPNotFound(json_body={'error': 'Menu item not found'})
        
        # Update fields if provided
        if 'name' in data:
            menu_item.name = data['name']
        if 'description' in data:
            menu_item.description = data['description']
        if 'price' in data:
            menu_item.price = data['price']
        if 'category_id' in data:
            category = self.request.dbsession.query(Category).get(data['category_id'])
            if not category:
                raise HTTPBadRequest(json_body={'error': 'Category not found'})
            menu_item.category_id = data['category_id']
        if 'is_available' in data:
            menu_item.is_available = data['is_available']
        if 'image_url' in data:
            menu_item.image_url = data['image_url']
        if 'stock' in data:
            stock = data['stock']
            if not isinstance(stock, int) or stock < 0:
                raise HTTPBadRequest(json_body={'error': 'Stock must be a non-negative integer'})
            menu_item.stock = stock
        
        menu_item.updated_at = datetime.utcnow()
        self.request.dbsession.flush()
        self.request.dbsession.refresh(menu_item)  # Refresh to get updated values
        return MenuItemSchema().dump(menu_item)

    @view_config(route_name='admin_menu_item', request_method='DELETE', renderer='json')
    def delete_menu_item(self):
        """Delete a menu item."""
        menu_id = self.request.matchdict['id']
        
        try:
            # Check if menu item exists
            menu_item = self.request.dbsession.query(MenuItem).get(menu_id)
            if not menu_item:
                return Response(json={'error': 'Menu item not found'}, status=404)
            
            # Check if menu item has any associated order items
            order_items = self.request.dbsession.query(OrderItem).filter_by(menu_item_id=menu_id).first()
            if order_items:
                return Response(
                    json={'error': 'Cannot delete menu item that has been ordered'}, 
                    status=400
                )
            
            # Delete the menu item
            self.request.dbsession.delete(menu_item)
            self.request.dbsession.flush()
            
            return {'message': 'Menu item deleted successfully'}
        except Exception as e:
            self.request.dbsession.rollback()
            return Response(json={'error': str(e)}, status=500)

    @view_config(route_name='admin_categories', request_method='GET', renderer='json')
    def get_categories(self):
        """Get all menu categories."""
        categories = self.request.dbsession.query(Category).all()
        return CategorySchema(many=True).dump(categories)

    @view_config(route_name='admin_categories', request_method='POST', renderer='json')
    def create_category(self):
        """Create a new menu category."""
        data = self.request.json_body
        
        if 'name' not in data:
            raise HTTPBadRequest(json_body={'error': 'Name is required'})
        
        category = Category(
            name=data['name'],
            description=data.get('description', '')
        )
        
        self.request.dbsession.add(category)
        self.request.dbsession.flush()  # Flush to get the ID
        self.request.dbsession.refresh(category)  # Refresh to get all fields
        return CategorySchema().dump(category)

    @view_config(route_name='admin_category', request_method='PUT', renderer='json')
    def update_category(self):
        """Update an existing category."""
        category_id = self.request.matchdict['id']
        data = self.request.json_body
        
        category = self.request.dbsession.query(Category).get(category_id)
        if not category:
            raise HTTPNotFound(json_body={'error': 'Category not found'})
        
        if 'name' in data:
            category.name = data['name']
        if 'description' in data:
            category.description = data['description']
        
        category.updated_at = datetime.utcnow()
        return CategorySchema().dump(category)

    @view_config(route_name='admin_category', request_method='DELETE', renderer='json')
    def delete_category(self):
        """Delete a category (only if no menu items are associated)."""
        category_id = self.request.matchdict['id']
        
        category = self.request.dbsession.query(Category).get(category_id)
        if not category:
            raise HTTPNotFound(json_body={'error': 'Category not found'})
        
        # Check if category has any menu items
        menu_items = self.request.dbsession.query(MenuItem).filter_by(category_id=category_id).first()
        if menu_items:
            raise HTTPForbidden(json_body={'error': 'Cannot delete category with associated menu items'})
        
        self.request.dbsession.delete(category)
        return {'message': 'Category deleted successfully'}

    @view_config(route_name='admin_reports', request_method='GET', renderer='json')
    def get_sales_report(self):
        """Get sales report with date range."""
        start_date = self.request.params.get('start_date')
        end_date = self.request.params.get('end_date')
        
        if not start_date or not end_date:
            raise HTTPBadRequest(json_body={'error': 'Start date and end date are required'})
        
        # Get daily sales
        daily_sales = self.request.dbsession.query(
            func.date(Order.created_at).label('date'),
            func.count(Order.id).label('orders'),
            func.sum(Order.total_amount).label('revenue')
        ).filter(
            Order.created_at >= start_date,
            Order.created_at <= end_date
        ).group_by(
            func.date(Order.created_at)
        ).all()
        
        # Get top selling items
        top_items = self.request.dbsession.query(
            MenuItem.name,
            func.sum(OrderItem.quantity).label('total_quantity')
        ).join(OrderItem).join(Order).filter(
            Order.created_at >= start_date,
            Order.created_at <= end_date
        ).group_by(MenuItem.name)\
         .order_by(func.sum(OrderItem.quantity).desc())\
         .limit(5).all()
        
        return {
            'daily_sales': [
                {
                    'date': str(sale.date),
                    'orders': sale.orders,
                    'revenue': float(sale.revenue or 0)
                }
                for sale in daily_sales
            ],
            'top_items': [
                {
                    'name': item.name,
                    'total_quantity': item.total_quantity
                }
                for item in top_items
            ]
        }

    @view_config(route_name='admin_menu_stock', request_method='PUT', renderer='json')
    def update_menu_stock(self):
        """Update menu item stock."""
        menu_id = self.request.matchdict['id']
        data = self.request.json_body
        stock = data.get('stock')
        
        if stock is None or not isinstance(stock, int) or stock < 0:
            return Response(json={'error': 'Stock is required and must be a non-negative integer'}, status=400)
            
        menu_item = self.request.dbsession.query(MenuItem).get(menu_id)
        if not menu_item:
            return Response(json={'error': 'Menu item not found'}, status=404)
            
        menu_item.stock = stock
        menu_item.updated_at = datetime.utcnow()
        self.request.dbsession.flush()
        self.request.dbsession.refresh(menu_item)  # Refresh to get updated values
        return MenuItemSchema().dump(menu_item) 