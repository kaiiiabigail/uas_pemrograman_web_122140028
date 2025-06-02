from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
import json

class BaseView:
    """Base view class with common functionality."""
    
    def __init__(self, request):
        self.request = request
        self.dbsession = request.dbsession

    def json_response(self, data, status=200):
        """Create a JSON response."""
        return Response(
            json=data,  # Don't use json.dumps here as Response will handle it
            status=status,
            content_type='application/json; charset=UTF-8'
        )

    def handle_error(self, error):
        """Handle common errors."""
        if isinstance(error, ValueError):
            return self.json_response({'error': str(error)}, 400)
        if isinstance(error, HTTPNotFound):
            return self.json_response({'error': 'Resource not found'}, 404)
        return self.json_response({'error': str(error)}, 500)

    def get_request_json(self):
        """Get and validate JSON from request body."""
        try:
            return self.request.json_body
        except ValueError:
            raise HTTPBadRequest('Invalid JSON in request body') 