def corstween_factory(handler, registry):
    """Factory for CORS handling tween."""
    def cors_tween(request):
        # Handle preflight request
        if request.method == 'OPTIONS':
            response = request.response
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Max-Age'] = '3600'
            return response
        
        # Handle actual request
        response = handler(request)
        
        # Set Content-Type header if not present
        if 'Content-Type' not in response.headers:
            response.headers['Content-Type'] = 'application/json'
        
        # Set CORS headers
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response
    return cors_tween 