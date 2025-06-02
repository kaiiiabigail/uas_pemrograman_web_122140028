from .user import UserViews
from .category import CategoryViews
from .menu_item import MenuItemViews
from .order import OrderViews
from .order_item import OrderItemViews
from .admin import AdminViews
from .customer import CustomerViews
from .upload import UploadViews

__all__ = [
    'UserViews',
    'CategoryViews',
    'MenuItemViews',
    'OrderViews',
    'OrderItemViews',
    'AdminViews',
    'CustomerViews',
    'UploadViews'
]

def includeme(config):
    """Include all views in the application."""
    config.scan('.user')
    config.scan('.upload')
    config.scan('.category')
    config.scan('.menu_item')
    config.scan('.order')
    config.scan('.order_item')
    config.scan('.admin')
    config.scan('.customer')
