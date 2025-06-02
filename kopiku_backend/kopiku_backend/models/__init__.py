from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker, configure_mappers
import zope.sqlalchemy

# Import all models
from .meta import Base
from .user import User
from .category import Category
from .menu_item import MenuItem
from .order import Order
from .order_item import OrderItem

# Configure mappers
configure_mappers()

def get_engine(settings, prefix='sqlalchemy.'):
    return engine_from_config(settings, prefix)

def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory

def get_tm_session(session_factory, transaction_manager, request=None):
    dbsession = session_factory(info={"request": request})
    zope.sqlalchemy.register(dbsession, transaction_manager=transaction_manager)
    return dbsession

def includeme(config):
    settings = config.get_settings()
    settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'
    config.include('pyramid_tm')
    config.include('pyramid_retry')
    session_factory = get_session_factory(get_engine(settings))
    config.registry['dbsession_factory'] = session_factory
    config.add_request_method(
        lambda r: get_tm_session(session_factory, r.tm, request=r),
        'dbsession',
        reify=True
    )
