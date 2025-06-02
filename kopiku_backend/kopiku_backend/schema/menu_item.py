from marshmallow import fields, validate
from .base import BaseSchema

class MenuItemSchema(BaseSchema):
    """Schema for MenuItem model."""
    
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=2, max=100))
    description = fields.String(validate=validate.Length(max=500))
    price = fields.Float(required=True, validate=validate.Range(min=0))
    image_url = fields.String(validate=validate.URL())
    category_id = fields.Integer(required=True)
    created_at = fields.DateTime(dump_only=True)
    stock = fields.Integer()
    sold = fields.Integer()
    
    # Nested fields
    category = fields.Nested('CategorySchema', dump_only=True)

    def setschemaby_method(self, method):
        """Adjust schema based on HTTP method."""
        if method == 'PUT':
            self.fields['name'].required = False
            self.fields['price'].required = False
            self.fields['category_id'].required = False 