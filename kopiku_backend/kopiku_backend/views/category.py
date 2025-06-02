from pyramid.view import view_config
from ..orms.category import CategoryORM
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from ..models.category import Category
from ..schema import CategorySchema
from .base import BaseView

class CategoryViews(BaseView):
    """Views for category management."""

    @view_config(route_name='categories', request_method='GET', renderer='json')
    def get_categories(self):
        """Get all categories."""
        try:
            categories = Category.get_all(self.dbsession)
            schema = CategorySchema(many=True)
            return self.json_response(schema.dump(categories))
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='category', request_method='GET', renderer='json')
    def get_category(self):
        """Get a specific category."""
        try:
            category_id = int(self.request.matchdict['id'])
            category = Category.get_by_id(self.dbsession, category_id)
            if not category:
                raise HTTPNotFound('Category not found')
            schema = CategorySchema()
            return self.json_response(schema.dump(category))
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='categories', request_method='POST', renderer='json')
    def create_category(self):
        """Create a new category."""
        try:
            schema = CategorySchema()
            schema.setschemaby_method('POST')
            data = schema.load(self.get_request_json())
            category = Category.create(self.dbsession, data)
            return self.json_response(schema.dump(category), 201)
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='category', request_method='PUT', renderer='json')
    def update_category(self):
        """Update a category."""
        try:
            category_id = int(self.request.matchdict['id'])
            category = Category.get_by_id(self.dbsession, category_id)
            if not category:
                raise HTTPNotFound('Category not found')

            schema = CategorySchema()
            schema.setschemaby_method('PUT')
            data = schema.load(self.get_request_json())
            updated_category = Category.update(self.dbsession, category_id, data)
            return self.json_response(schema.dump(updated_category))
        except Exception as e:
            return self.handle_error(e)

    @view_config(route_name='category', request_method='DELETE', renderer='json')
    def delete_category(self):
        """Delete a category."""
        try:
            category_id = int(self.request.matchdict['id'])
            if Category.delete(self.dbsession, category_id):
                return self.json_response({'message': 'Category deleted successfully'})
            raise HTTPNotFound('Category not found')
        except Exception as e:
            return self.handle_error(e) 