from pyramid.view import view_config
from pyramid.response import Response

@view_config(route_name='home', renderer='json')
def home_view(request):
    """API home endpoint."""
    return {
        'status': 'success',
        'message': 'Welcome to Kopiku API',
        'version': '1.0.0'
    }
