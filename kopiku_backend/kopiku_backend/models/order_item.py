from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from .meta import Base
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Numeric, func
from sqlalchemy.orm import relationship

class OrderItem(Base):
    __tablename__ = 'order_items'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
    menu_item_id = Column(Integer, ForeignKey('menu_items.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    # Relationships
    order = relationship('Order', back_populates='order_items')
    menu_item = relationship('MenuItem', back_populates='order_items')

    def __init__(self, order_id, menu_item_id, quantity, price):
        from decimal import Decimal
        from datetime import datetime
        
        # Convert all values to appropriate types
        self.order_id = int(order_id)
        self.menu_item_id = int(menu_item_id)
        self.quantity = int(quantity)
        
        # Ensure price is a Decimal
        if not isinstance(price, Decimal):
            self.price = Decimal(str(price))  # Convert to string first to avoid float precision issues
        else:
            self.price = price
            
        # Explicitly calculate and set subtotal
        self.subtotal = self.quantity * self.price
        
        # Set created_at explicitly to ensure it's not null
        self.created_at = datetime.now()
        
        print(f"Initialized OrderItem with subtotal: {self.subtotal} (type: {type(self.subtotal)}) from quantity: {self.quantity} and price: {self.price}")
        print(f"Set created_at to: {self.created_at}")


    @classmethod
    def from_orm(cls, orm_obj):
        return cls(
            order_id=orm_obj.order_id,
            menu_item_id=orm_obj.menu_item_id,
            quantity=orm_obj.quantity,
            price=orm_obj.price
        )

    def to_dict(self):
        from decimal import Decimal
        
        # Helper function to convert Decimal to float
        def decimal_to_float(value):
            if isinstance(value, Decimal):
                return float(value)
            return value
        
        return {
            'id': self.id,
            'order_id': self.order_id,
            'menu_item_id': self.menu_item_id,
            'quantity': self.quantity,
            'price': decimal_to_float(self.price),
            'subtotal': decimal_to_float(self.subtotal),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'menu_item': self.menu_item.to_dict() if self.menu_item else None
        }

    @classmethod
    def get_by_order_id(cls, dbsession: Session, order_id: int):
        order_items = dbsession.query(cls).options(
            joinedload(cls.menu_item)
        ).filter(cls.order_id == order_id).all()
        return [item.to_dict() for item in order_items]

    @classmethod
    def get_by_id(cls, dbsession: Session, order_item_id: int):
        return dbsession.query(cls).options(
            joinedload(cls.menu_item)
        ).filter(cls.id == order_item_id).first()

    @classmethod
    def create(cls, dbsession: Session, data: dict):
        """Create a new OrderItem with explicit handling of all required fields."""
        from decimal import Decimal
        import traceback
        
        try:
            print(f"Starting OrderItem.create with data: {data}")
            
            # 1. Validate and convert required fields
            required_fields = ['order_id', 'menu_item_id', 'quantity']
            for field in required_fields:
                if field not in data or data[field] is None:
                    raise ValueError(f"Required field {field} is missing or null")
            
            # Convert to appropriate types
            order_id = int(data['order_id'])
            menu_item_id = int(data['menu_item_id'])
            quantity = int(data['quantity'])
            
            print(f"Validated fields: order_id={order_id}, menu_item_id={menu_item_id}, quantity={quantity}")
            
            # 2. Get menu item to check stock and get price
            from .menu_item import MenuItem
            menu_item = dbsession.query(MenuItem).filter(MenuItem.id == menu_item_id).first()
            if not menu_item:
                raise ValueError(f"Menu item not found with ID: {menu_item_id}")
            
            print(f"Found menu item: {menu_item.name} with price: {menu_item.price}")
            
            # 3. Check stock
            if menu_item.stock < quantity:
                raise ValueError(f"Insufficient stock for menu item {menu_item.name} (ID: {menu_item.id}). Available: {menu_item.stock}, Requested: {quantity}")
                
            # 4. Handle price and calculate subtotal
            # Get price from menu item if not provided
            if 'price' not in data or data['price'] is None:
                price = menu_item.price
                print(f"Using menu item price: {price}")
            else:
                price = data['price']
                print(f"Using provided price: {price}")
            
            # Convert price to Decimal for accurate calculations
            if not isinstance(price, Decimal):
                price = Decimal(str(price))  # Convert to string first to avoid float precision issues
            
            # Convert quantity to Decimal for calculation
            quantity_decimal = Decimal(str(quantity))
            
            # Calculate subtotal explicitly
            subtotal = price * quantity_decimal
            print(f"Calculated subtotal: {subtotal} (type: {type(subtotal)})")
            
            # 5. Create a new OrderItem instance with all fields explicitly set
            try:
                # Check if created_at was provided in the data
                created_at = None
                if 'created_at' in data and data['created_at'] is not None:
                    from datetime import datetime
                    try:
                        # Try to parse the created_at string to a datetime object
                        created_at = datetime.fromisoformat(data['created_at'].replace('Z', '+00:00'))
                        print(f"Using provided created_at: {created_at}")
                    except Exception as e:
                        print(f"Error parsing created_at: {str(e)}. Will use current time.")
                        created_at = datetime.now()
                
                # Create a dictionary with all required fields
                item_data = {
                    'order_id': order_id,
                    'menu_item_id': menu_item_id,
                    'quantity': quantity,
                    'price': price,
                    # Set subtotal explicitly
                    'subtotal': subtotal,
                    # Include created_at if provided
                    'created_at': created_at
                }
                
                print(f"Creating OrderItem with data: {item_data}")
                
                # Create the OrderItem instance directly
                new_item = cls(
                    order_id=order_id,
                    menu_item_id=menu_item_id,
                    quantity=quantity,
                    price=price
                )
                
                # Explicitly set the subtotal after creation
                new_item.subtotal = subtotal
                
                # Set created_at if it was provided
                if created_at is not None:
                    new_item.created_at = created_at
                    print(f"Set created_at to: {new_item.created_at}")
                
                print(f"Created OrderItem instance with subtotal: {new_item.subtotal}")
            
                
                # Verify all required fields are set
                for field_name, value in {
                    'order_id': order_id,
                    'menu_item_id': menu_item_id,
                    'quantity': quantity,
                    'price': price,
                    'subtotal': subtotal
                }.items():
                    print(f"Verifying field {field_name} = {value} (type: {type(value)})")
                    if value is None:
                        raise ValueError(f"Field {field_name} is None before database commit!")
                
                # Double check subtotal is set
                if new_item.subtotal is None:
                    print("WARNING: Subtotal is still None! Setting it again...")
                    new_item.subtotal = subtotal
                
            except Exception as e:
                print(f"Error during OrderItem object creation: {str(e)}")
                raise
            
            # 6. Update menu item stock and sold count
            menu_item.stock -= quantity
            menu_item.sold += quantity
            print(f"Updated menu item stock to {menu_item.stock} and sold to {menu_item.sold}")
            
            # 7. Final verification before database commit
            print(f"Final verification of OrderItem instance:")
            print(f"  - order_id: {new_item.order_id} (type: {type(new_item.order_id)})")
            print(f"  - menu_item_id: {new_item.menu_item_id} (type: {type(new_item.menu_item_id)})")
            print(f"  - quantity: {new_item.quantity} (type: {type(new_item.quantity)})")
            print(f"  - price: {new_item.price} (type: {type(new_item.price)})")
            print(f"  - subtotal: {new_item.subtotal} (type: {type(new_item.subtotal)})")
            
            # 8. Add to session and flush to get ID
            try:
                dbsession.add(new_item)
                dbsession.flush()
                print(f"Successfully added OrderItem to database with ID: {new_item.id}")
                return new_item
            except Exception as db_error:
                print(f"Database error during commit: {str(db_error)}")
                # Try to extract more information about the database error
                if 'psycopg2.errors.NotNullViolation' in str(db_error):
                    import re
                    match = re.search(r'null value in column \"(.+?)\"', str(db_error))
                    if match:
                        column_name = match.group(1)
                        print(f"NULL value violation in column: {column_name}")
                raise
            
        except Exception as e:
            # Log the error and re-raise
            import traceback
            import sys
            error_trace = traceback.format_exc()
            print(f"Error in OrderItem.create: {str(e)}")
            print(error_trace)
            
            # Print detailed information about the exception
            exc_type, exc_value, exc_traceback = sys.exc_info()
            print(f"Exception type: {exc_type.__name__}")
            print(f"Exception value: {exc_value}")
            print(f"Exception traceback: {traceback.format_tb(exc_traceback)}")
            
            # If it's a database error, try to get more details
            if 'psycopg2.errors' in str(e):
                print(f"Database error details: {str(e)}")
                if 'null value in column' in str(e):
                    # Try to extract the column name
                    import re
                    match = re.search(r'null value in column \"(.+?)\"', str(e))
                    if match:
                        column_name = match.group(1)
                        print(f"NULL value violation in column: {column_name}")
            
            raise

    @classmethod
    def update(cls, dbsession: Session, order_item_id: int, data: dict):
        order_item = dbsession.query(cls).filter(cls.id == order_item_id).first()
        if order_item:
            for key, value in data.items():
                setattr(order_item, key, value)
            if 'quantity' in data or 'price' in data:
                order_item.update_subtotal()
            dbsession.flush()
            return order_item
        return None

    @classmethod
    def delete(cls, dbsession: Session, order_item_id: int):
        order_item = dbsession.query(cls).filter(cls.id == order_item_id).first()
        if order_item:
            dbsession.delete(order_item)
            return True
        return False

    def update_subtotal(self):
        self.subtotal = self.quantity * self.price 