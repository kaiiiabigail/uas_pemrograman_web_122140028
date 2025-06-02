from marshmallow import fields, validate
from .base import BaseSchema

class OrderSchema(BaseSchema):
    """Schema for Order model."""
    
    __tablename__ = 'orders'
    
    id = fields.Integer(dump_only=True)
    user_id = fields.Integer(required=True)
    total_amount = fields.Float(required=True, validate=validate.Range(min=0))
    status = fields.String(validate=validate.OneOf(['pending', 'processing', 'completed', 'cancelled']))
    created_at = fields.DateTime(dump_only=True)
    
    # Nested fields
    user = fields.Nested('UserSchema', dump_only=True)
    order_items = fields.Nested('OrderItemSchema', many=True, dump_only=True)

    def setschemaby_method(self, method):
        """Adjust schema based on HTTP method."""
        if method == 'PUT':
            self.fields['user_id'].required = False
            self.fields['total_amount'].required = False 