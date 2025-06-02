from pyramid.config import Configurator

def includeme(config: Configurator):
    """Include all routes in the application."""
    
    # Admin Routes
    config.add_route('admin_login', '/api/admin/login')
    config.add_route('admin_dashboard', '/api/admin/dashboard')
    config.add_route('admin_orders', '/api/admin/orders')
    config.add_route('admin_order', '/api/admin/orders/{id}')
    config.add_route('admin_menu', '/api/admin/menu')
    config.add_route('admin_menu_item', '/api/admin/menu/{id}')
    config.add_route('admin_categories', '/api/admin/categories')
    config.add_route('admin_category', '/api/admin/categories/{id}')
    config.add_route('admin_reports', '/api/admin/reports')
    config.add_route('admin_users', '/api/admin/users')
    config.add_route('admin_user', '/api/admin/users/{id}')
    config.add_route('admin_stats', '/api/admin/stats')
    config.add_route('admin_menu_stock', '/api/admin/menu/{id}/stock')
    config.add_route('upload_menu_image', '/api/admin/upload/menu-image')

    # Customer Routes
    config.add_route('home', '/api/home')
    config.add_route('menu', '/api/menu')
    config.add_route('menu_category', '/api/menu/{category}')
    config.add_route('checkout', '/api/checkout')
    config.add_route('checkout_success', '/api/checkout/success')
    config.add_route('customer_register', '/api/customer/register')
    config.add_route('customer_login', '/api/customer/login')
    config.add_route('customer_menu', '/api/customer/menu')
    config.add_route('customer_categories', '/api/customer/categories')
    config.add_route('customer_orders', '/api/customer/orders')
    config.add_route('customer_order', '/api/customer/orders/{id}')
    
    # Auth Routes
    config.add_route('login', '/api/login')
    config.add_route('register', '/api/register')
    config.add_route('profile', '/api/profile')

    # User Routes
    config.add_route('users', '/api/users')
    config.add_route('user', '/api/users/{id}')

    # Category Routes
    config.add_route('categories', '/api/categories')
    config.add_route('category', '/api/categories/{id}')

    # Menu Item Routes
    config.add_route('menu_items', '/api/menu-items')
    config.add_route('menu_item', '/api/menu-items/{id}')

    # Order Routes
    config.add_route('orders', '/api/orders')
    config.add_route('order', '/api/orders/{id}')
    config.add_route('order_items', '/api/orders/{id}/items')
    config.add_route('order_item', '/api/orders/{id}/items/{item_id}')
