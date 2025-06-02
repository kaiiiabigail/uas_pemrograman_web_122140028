from zope.interface import implementer
from marshmallow import Schema, ValidationError
from .interface import IJSONSchema

@implementer(IJSONSchema)
class BaseSchema(Schema):
    """Base schema class implementing IJSONSchema interface."""
    
    def setschemaby_method(self, method):
        """Default implementation for method-based schema adjustment."""
        pass
        
    def load(self, data, **kwargs):
        """Validate and deserialize input data."""
        try:
            return super().load(data, **kwargs)
        except ValidationError as e:
            raise ValidationError(e.messages) 