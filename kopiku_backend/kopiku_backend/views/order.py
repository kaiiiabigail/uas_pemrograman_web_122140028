from pyramid.view import view_config
from ..orms.order import OrderORM
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from ..models.order import Order
from ..schema import OrderSchema
from .base import BaseView

class OrderViews(BaseView):
    """Views for order management."""

    @view_config(route_name='orders', request_method='GET', renderer='json')
    def get_orders(self):
        """Get all orders."""
        try:
            orders = Order.get_all(self.dbsession)
            schema = OrderSchema(many=True)
            return self.json_response(schema.dump(orders))
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='order', request_method='GET', renderer='json')
    def get_order(self):
        """Get a specific order."""
        try:
            order_id = int(self.request.matchdict['id'])
            order = Order.get_by_id(self.dbsession, order_id)
            if not order:
                raise HTTPNotFound('Order not found')
            schema = OrderSchema()
            return self.json_response(schema.dump(order))
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='orders', request_method='POST', renderer='json')
    def create_order(self):
        """Create a new order."""
        try:
            schema = OrderSchema()
            schema.setschemaby_method('POST')
            data = schema.load(self.get_request_json())
            order = Order.create(self.dbsession, data)
            return self.json_response(schema.dump(order), 201)
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='order', request_method='PUT', renderer='json')
    def update_order(self):
        """Update an order."""
        try:
            order_id = int(self.request.matchdict['id'])
            order = Order.get_by_id(self.dbsession, order_id)
            if not order:
                raise HTTPNotFound('Order not found')

            schema = OrderSchema()
            schema.setschemaby_method('PUT')
            data = schema.load(self.get_request_json())
            updated_order = Order.update(self.dbsession, order_id, data)
            return self.json_response(schema.dump(updated_order))
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='order', request_method='DELETE', renderer='json')
    def delete_order(self):
        """Delete an order."""
        try:
            order_id = int(self.request.matchdict['id'])
            if Order.delete(self.dbsession, order_id):
                return self.json_response({'message': 'Order deleted successfully'})
            raise HTTPNotFound('Order not found')
        except Exception as e:
            return self.handle_error(e) 