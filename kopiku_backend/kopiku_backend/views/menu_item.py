from pyramid.view import view_config
from ..orms.menu_item import MenuItemORM
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from ..models.menu_item import MenuItem
from ..schema import MenuItemSchema
from .base import BaseView

class MenuItemViews(BaseView):
    """Views for menu item management."""

    @view_config(route_name='menu_items', request_method='GET', renderer='json')
    def get_menu_items(self):
        """Get all menu items."""
        try:
            menu_items = MenuItem.get_all(self.dbsession)
            schema = MenuItemSchema(many=True)
            return self.json_response(schema.dump(menu_items))
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='menu_item', request_method='GET', renderer='json')
    def get_menu_item(self):
        """Get a specific menu item."""
        try:
            menu_item_id = int(self.request.matchdict['id'])
            menu_item = MenuItem.get_by_id(self.dbsession, menu_item_id)
            if not menu_item:
                raise HTTPNotFound('Menu item not found')
            schema = MenuItemSchema()
            return self.json_response(schema.dump(menu_item))
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='menu_items', request_method='POST', renderer='json')
    def create_menu_item(self):
        """Create a new menu item."""
        try:
            schema = MenuItemSchema()
            schema.setschemaby_method('POST')
            data = schema.load(self.get_request_json())
            menu_item = MenuItem.create(self.dbsession, data)
            return self.json_response(schema.dump(menu_item), 201)
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='menu_item', request_method='PUT', renderer='json')
    def update_menu_item(self):
        """Update a menu item."""
        try:
            menu_item_id = int(self.request.matchdict['id'])
            menu_item = MenuItem.get_by_id(self.dbsession, menu_item_id)
            if not menu_item:
                raise HTTPNotFound('Menu item not found')

            schema = MenuItemSchema()
            schema.setschemaby_method('PUT')
            data = schema.load(self.get_request_json())
            updated_menu_item = MenuItem.update(self.dbsession, menu_item_id, data)
            return self.json_response(schema.dump(updated_menu_item))
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='menu_item', request_method='DELETE', renderer='json')
    def delete_menu_item(self):
        """Delete a menu item."""
        try:
            menu_item_id = int(self.request.matchdict['id'])
            if MenuItem.delete(self.dbsession, menu_item_id):
                return self.json_response({'message': 'Menu item deleted successfully'})
            raise HTTPNotFound('Menu item not found')
        except Exception as e:
            return self.handle_error(e) 