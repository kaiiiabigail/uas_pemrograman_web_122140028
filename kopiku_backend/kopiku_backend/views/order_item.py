from pyramid.view import view_config
from ..models.order_item import OrderItem
from ..models.menu_item import MenuItem
from ..models.order import Order
from sqlalchemy.orm import Session
from pyramid.response import Response
import json

class OrderItemViews:
    def __init__(self, request):
        self.request = request
        self.dbsession = request.dbsession

    @view_config(route_name='order_items', request_method='GET')
    def get_order_items(self):
        order_id = self.request.matchdict.get('id')
        if order_id:
            order_items = OrderItem.get_by_order_id(self.dbsession, int(order_id))
            return Response(json.dumps(order_items), content_type='application/json; charset=UTF-8', status=200)
        return Response(json.dumps({'error': 'Order ID is required'}), content_type='application/json; charset=UTF-8', status=400)

    @view_config(route_name='order_item', request_method='GET')
    def get_order_item(self):
        order_item_id = self.request.matchdict.get('id')
        if order_item_id:
            order_item = OrderItem.get_by_id(self.dbsession, int(order_item_id))
            if order_item:
                return Response(json.dumps(order_item.to_dict()), content_type='application/json; charset=UTF-8', status=200)
            return Response(json.dumps({'error': 'Order item not found'}), content_type='application/json; charset=UTF-8', status=404)
        return Response(json.dumps({'error': 'Order item ID is required'}), content_type='application/json; charset=UTF-8', status=400)

    @view_config(route_name='order_items', request_method='POST')
    def create_order_item(self):
        try:
            url_order_id = self.request.matchdict.get('id')
            if not url_order_id:
                return Response(json.dumps({'error': 'Order ID is required in URL path'}), content_type='application/json; charset=UTF-8', status=400)
            
            print(f'Processing order item creation for order ID: {url_order_id}')
            
            # Get the request data
            try:
                data = self.request.json_body
                print(f'Request body: {data}')
            except Exception as e:
                print(f'Error parsing request JSON: {str(e)}')
                return Response(json.dumps({'error': f'Invalid JSON in request: {str(e)}'}), content_type='application/json; charset=UTF-8', status=400)
            
            # Ensure order_id is set from URL path
            data['order_id'] = int(url_order_id)
            print(f'Updated data with order_id: {data}')
            
            # Validate required fields
            required_fields = ['order_id', 'menu_item_id', 'quantity']
            for field in required_fields:
                if field not in data:
                    error_msg = f'Required field {field} is missing'
                    print(error_msg)
                    return Response(json.dumps({'error': error_msg}), content_type='application/json; charset=UTF-8', status=400)
                elif data[field] is None:
                    error_msg = f'Required field {field} cannot be null'
                    print(error_msg)
                    return Response(json.dumps({'error': error_msg}), content_type='application/json; charset=UTF-8', status=400)
            
            # Convert values to appropriate types
            try:
                data['order_id'] = int(data['order_id'])
                data['menu_item_id'] = int(data['menu_item_id'])
                data['quantity'] = int(data['quantity'])
            except (ValueError, TypeError) as e:
                error_msg = f'Invalid data type: {str(e)}'
                print(error_msg)
                return Response(json.dumps({'error': error_msg}), content_type='application/json; charset=UTF-8', status=400)
            
            print(f'Validated data: {data}')
            
            # Get menu item to get price
            menu_item = MenuItem.get_by_id(self.dbsession, data['menu_item_id'])
            if not menu_item:
                error_msg = f'Menu item not found with ID: {data["menu_item_id"]}'
                print(error_msg)
                return Response(json.dumps({'error': error_msg}), content_type='application/json; charset=UTF-8', status=404)

            print(f'Found menu item: {menu_item.name} with price: {menu_item.price}')
            
            # Get order to validate
            order = Order.get_by_id(self.dbsession, data['order_id'])
            if not order:
                error_msg = f'Order not found with ID: {data["order_id"]}'
                print(error_msg)
                return Response(json.dumps({'error': error_msg}), content_type='application/json; charset=UTF-8', status=404)

            print(f'Found order with ID: {order.id}')
            
            # Create order item - get price from menu item if not provided
            if 'price' not in data or data['price'] is None:
                data['price'] = float(menu_item.price)
            else:
                # Ensure price is a float
                data['price'] = float(data['price'])
            
            # Ensure all required fields are present
            required_fields = ['order_id', 'menu_item_id', 'quantity', 'price']
            for field in required_fields:
                if field not in data or data[field] is None:
                    error_msg = f'Required field {field} is missing or null'
                    print(error_msg)
                    return Response(json.dumps({'error': error_msg}), content_type='application/json; charset=UTF-8', status=400)
                    
            print(f'Creating order item with data: {data}')
            
            try:
                # Log all data before creating the order item
                print(f'Data being passed to OrderItem.create: {data}')
                
                # Create the order item
                new_order_item = OrderItem.create(self.dbsession, data)
                
                if new_order_item is None:
                    print('OrderItem.create returned None')
                    return Response(json.dumps({'error': 'Failed to create order item - null result'}), content_type='application/json; charset=UTF-8', status=500)
                    
                print(f'Successfully created order item with ID: {new_order_item.id}')
                
                # Convert to dict and log the result
                result_dict = new_order_item.to_dict()
                print(f'Order item dict for response: {result_dict}')
                
                # Make sure all required fields are in the response
                for field in ['id', 'order_id', 'menu_item_id', 'quantity', 'price', 'subtotal']:
                    if field not in result_dict or result_dict[field] is None:
                        print(f'WARNING: Field {field} is missing or null in response')
                
                # Convert Decimal objects to float for JSON serialization
                if 'price' in result_dict and result_dict['price'] is not None:
                    result_dict['price'] = float(result_dict['price'])
                if 'subtotal' in result_dict and result_dict['subtotal'] is not None:
                    result_dict['subtotal'] = float(result_dict['subtotal'])
                
                # Handle any nested objects with Decimal values
                if 'menu_item' in result_dict and result_dict['menu_item'] is not None:
                    if 'price' in result_dict['menu_item']:
                        result_dict['menu_item']['price'] = float(result_dict['menu_item']['price'])
                
                return Response(json.dumps(result_dict), content_type='application/json; charset=UTF-8', status=201)
            except Exception as item_error:
                import traceback
                import sys
                error_trace = traceback.format_exc()
                print(f'Error creating order item: {str(item_error)}')
                print(error_trace)
                
                # Extract more detailed error information
                error_message = str(item_error)
                
                # Check for specific error types
                if 'null value in column' in error_message.lower():
                    # Extract column name from error message
                    import re
                    match = re.search(r'null value in column \"(.+?)\"', error_message)
                    if match:
                        column_name = match.group(1)
                        print(f'NULL value violation in column: {column_name}')
                        return Response(json.dumps({'error': f'Missing required value for {column_name}'}), content_type='application/json; charset=UTF-8', status=400)
                
                return Response(json.dumps({'error': f'Error creating order item: {error_message}'}), content_type='application/json; charset=UTF-8', status=500)

        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f'Exception in create_order_item: {str(e)}')
            print(error_trace)
            return Response(json.dumps({'error': str(e), 'trace': error_trace}), content_type='application/json; charset=UTF-8', status=500)

    @view_config(route_name='order_item', request_method='PUT')
    def update_order_item(self):
        try:
            order_item_id = self.request.matchdict.get('id')
            if not order_item_id:
                return Response(json.dumps({'error': 'Order item ID is required'}), content_type='application/json; charset=UTF-8', status=400)

            data = self.request.json_body
            updated_order_item = OrderItem.update(self.dbsession, int(order_item_id), data)
            if updated_order_item:
                return Response(json.dumps(updated_order_item.to_dict()), content_type='application/json; charset=UTF-8', status=200)
            return Response(json.dumps({'error': 'Order item not found'}), content_type='application/json; charset=UTF-8', status=404)

        except Exception as e:
            return Response(json.dumps({'error': str(e)}), content_type='application/json; charset=UTF-8', status=500)

    @view_config(route_name='order_item', request_method='DELETE')
    def delete_order_item(self):
        try:
            order_item_id = self.request.matchdict.get('id')
            if not order_item_id:
                return Response(json.dumps({'error': 'Order item ID is required'}), content_type='application/json; charset=UTF-8', status=400)

            if OrderItem.delete(self.dbsession, int(order_item_id)):
                return Response(json.dumps({'message': 'Order item deleted successfully'}), content_type='application/json; charset=UTF-8', status=200)
            return Response(json.dumps({'error': 'Order item not found'}), content_type='application/json; charset=UTF-8', status=404)

        except Exception as e:
            return Response(json.dumps({'error': str(e)}), content_type='application/json; charset=UTF-8', status=500) 