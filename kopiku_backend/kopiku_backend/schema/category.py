from marshmallow import fields, validate
from .base import BaseSchema

class CategorySchema(BaseSchema):
    """Schema for Category model."""
    
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=2, max=100))
    description = fields.String(validate=validate.Length(max=500))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    def setschemaby_method(self, method):
        """Adjust schema based on HTTP method."""
        if method == 'PUT':
            self.fields['name'].required = False 