import sys
import os
import bcrypt
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from kopiku_backend.models.user import User, UserRole
from kopiku_backend.models.meta import Base

def create_admin_user():
    # Database connection
    DATABASE_URL = "postgresql://postgres:jarwok@localhost:5432/kopiku_db"
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Check if admin already exists
        admin = session.query(User).filter_by(email='admin1@kopiku.com').first()
        if admin:
            print("Admin user already exists!")
            return

        # Create password hash
        password = "admin123"
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Create admin user
        admin = User(
            email='admin1@kopiku.com',
            username='admin1',
            password_hash=password_hash.decode('utf-8'),
            role=UserRole.ADMIN,
            is_admin=True
        )

        session.add(admin)
        session.commit()
        print("Admin user created successfully!")

    except Exception as e:
        print(f"Error creating admin user: {str(e)}")
        session.rollback()
    finally:
        session.close()

if __name__ == '__main__':
    create_admin_user() 