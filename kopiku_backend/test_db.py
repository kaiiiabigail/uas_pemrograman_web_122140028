from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import SQLAlchemyError

def test_connection():
    try:
        # Gunakan URL yang sama dengan development.ini
        engine = create_engine('postgresql://postgres:jarwok@localhost:5432/kopiku_db')
        connection = engine.connect()
        print("Database connection successful!")
        
        # Periksa tabel yang ada
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print("\nTabel yang ada di database:")
        for table in tables:
            print(f"- {table}")
            
        # Periksa isi tabel alembic_version
        if 'alembic_version' in tables:
            result = connection.execute(text("SELECT * FROM alembic_version"))
            version = result.fetchone()
            print("\nVersi Alembic yang terdaftar:", version[0] if version else "Tidak ada versi")
            
        connection.close()
    except SQLAlchemyError as e:
        print(f"Database connection failed: {str(e)}")

if __name__ == "__main__":
    test_connection() 