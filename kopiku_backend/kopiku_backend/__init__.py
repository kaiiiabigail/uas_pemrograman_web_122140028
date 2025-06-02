from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from .models import Base, includeme as models_includeme
import zope.sqlalchemy


def get_db_session(request):
    """Get database session from request"""
    return request.dbsession


def main(global_config, **settings):
    """This function returns a Pyramid WSGI application."""
    # Create database engine
    engine = engine_from_config(settings, 'sqlalchemy.')
    
    # Create session factory
    session_factory = sessionmaker(bind=engine)
    
    with Configurator(settings=settings) as config:
        # Add database session factory to registry
        config.registry['dbsession_factory'] = session_factory
        
        # Add request method to get database session
        config.add_request_method(
            lambda r: get_tm_session(session_factory, r.tm, request=r),
            'dbsession',
            reify=True
        )
        
        # Include required packages
        config.include('pyramid_jinja2')
        config.include('pyramid_tm')  # For transaction management
        config.include('pyramid_retry')  # For retry handling
        
        # Configure CORS
        def add_cors_headers_response_callback(event):
            def cors_headers(request, response):
                response.headers.update({
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization'
                })
            event.request.add_response_callback(cors_headers)
        
        config.add_subscriber(add_cors_headers_response_callback, 'pyramid.events.NewRequest')
        
        # Include our application components
        config.include('.models')  # Include models first
        config.include('.routes')  # Include routes
        
        # Configure static file serving
        config.add_static_view('static', 'kopiku_backend:static', cache_max_age=3600)
        config.include('.middleware')  # Include middleware
        config.include('.views')   # Include views
        
        # Add OPTIONS preflight handler for CORS
        def options_view(request):
            response = request.response
            return response
        
        config.add_view(options_view, route_name='options_preflight', request_method='OPTIONS')
        config.add_route('options_preflight', '{path:.*}')
        
        # Scan for views and other components
        config.scan()
        
        return config.make_wsgi_app()


def get_tm_session(session_factory, transaction_manager, request=None):
    """
    Get a session from the session factory and register it with the transaction manager.
    """
    dbsession = session_factory(info={"request": request})
    zope.sqlalchemy.register(dbsession, transaction_manager=transaction_manager)
    return dbsession
