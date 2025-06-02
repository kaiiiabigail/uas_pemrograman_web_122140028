from .jv import jsonvalidatortween_factory
from .cors import corstween_factory
from ..schema import (
    UserSchema,
    CategorySchema,
    MenuItemSchema,
    OrderSchema,
    OrderItemSchema,
    IJSONSchema
)

def includeme(config):
    """Include middleware components and register schemas."""
    # Include JSON validator middleware
    config.add_tween('kopiku_backend.middleware.jv.jsonvalidatortween_factory')
    
    # Register schemas
    config.registry.registerUtility(UserSchema(), IJSONSchema, name='users_schema')
    config.registry.registerUtility(CategorySchema(), IJSONSchema, name='categories_schema')
    config.registry.registerUtility(MenuItemSchema(), IJSONSchema, name='menu-items_schema')
    config.registry.registerUtility(OrderSchema(), IJSONSchema, name='orders_schema')
    config.registry.registerUtility(OrderItemSchema(), IJSONSchema, name='order-items_schema')
    
    # Include CORS middleware
    config.add_tween('kopiku_backend.middleware.cors.corstween_factory') 