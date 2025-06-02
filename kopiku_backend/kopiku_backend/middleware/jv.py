from pyramid.httpexceptions import HTTPBadRequest
from marshmallow import ValidationError
from ..schema import IJSONSchema

def jsonvalidatortween_factory(handler, registry):
    """Factory for JSON validation tween."""
    def jsonvalidatortween(request):
        if request.method in ['POST', 'PUT', 'PATCH'] and request.content_type == 'application/json':
            try:
                # Extract the first path segment for schema lookup
                path_segments = request.path.split('/')
                if len(path_segments) > 1:
                    first_path = path_segments[1]
                    schema_name = f"{first_path}_schema"
                    
                    # Get the appropriate schema from registry
                    schema = registry.queryUtility(IJSONSchema, name=schema_name)
                    if schema:
                        # Set schema validation based on request method
                        schema.setschemaby_method(request.method)
                        # Validate request body
                        schema.load(request.json_body)
            except ValidationError as e:
                raise HTTPBadRequest(json={'errors': e.messages})
            except Exception as e:
                raise HTTPBadRequest(json={'errors': str(e)})
        return handler(request)
    return jsonvalidatortween 