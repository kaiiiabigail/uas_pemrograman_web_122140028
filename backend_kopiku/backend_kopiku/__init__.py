from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from pyramid_sqlalchemy import BaseObject

def main(global_config, **settings):
    """This function returns a Pyramid WSGI application."""
    
    # Membuat koneksi engine SQLAlchemy menggunakan URL dari file development.ini
    engine = engine_from_config(settings, 'sqlalchemy.')

    # Membuat session factory
    Session = sessionmaker(bind=engine)

    # Membuat session untuk berinteraksi dengan database
    session = Session()

    # Inisialisasi Pyramid config
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2')  # Menambahkan template Jinja2
        config.include('.routes')  # Menambahkan routing aplikasi
        config.include('pyramid_sqlalchemy')  # Integrasi pyramid_sqlalchemy
        config.registry['dbsession'] = session  # Menyimpan session ke registry Pyramid
        config.scan()  # Memindai file view dan route
     
    return config.make_wsgi_app()
