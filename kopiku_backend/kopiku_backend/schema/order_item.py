from marshmallow import fields, validate
from .base import BaseSchema

class OrderItemSchema(BaseSchema):
    """Schema for OrderItem model."""
    
    id = fields.Integer(dump_only=True)
    order_id = fields.Integer(required=True)
    menu_item_id = fields.Integer(required=True)
    quantity = fields.Integer(required=True, validate=validate.Range(min=1))
    price = fields.Float(required=True, validate=validate.Range(min=0))
    subtotal = fields.Float(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    
    # Nested fields
    menu_item = fields.Nested('MenuItemSchema', dump_only=True)

    def setschemaby_method(self, method):
        """Adjust schema based on HTTP method."""
        if method == 'PUT':
            self.fields['order_id'].required = False
            self.fields['menu_item_id'].required = False
            self.fields['quantity'].required = False
            self.fields['price'].required = False 