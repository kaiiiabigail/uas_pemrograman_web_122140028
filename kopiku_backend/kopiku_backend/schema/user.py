from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    """Schema for User model."""
    
    id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)
    username = fields.Str(required=True)
    role = fields.Str(validate=validate.OneOf(['ADMIN', 'USER']))
    is_admin = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    def setschemaby_method(self, method):
        """Adjust schema based on HTTP method."""
        if method == 'POST':
            self.fields['password'].required = True
        elif method == 'PUT':
            self.fields['password'].required = False 