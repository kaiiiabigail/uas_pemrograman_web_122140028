const axios = require('axios');

async function fetchOrderDetails() {
  try {
    // Get admin token from localStorage or use a test token
    const token = process.env.ADMIN_TOKEN || 'your-admin-token-here';
    
    // First get all orders to find an order ID
    const ordersResponse = await axios.get('http://localhost:6543/api/admin/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('All orders:', ordersResponse.data);
    
    // If we have orders, get details for the first one
    if (ordersResponse.data && ordersResponse.data.length > 0) {
      const orderId = ordersResponse.data[0].id;
      
      const orderDetailsResponse = await axios.get(`http://localhost:6543/api/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Order details structure:', JSON.stringify(orderDetailsResponse.data, null, 2));
      
      // Check where customer data is located
      if (orderDetailsResponse.data.customer) {
        console.log('Customer data is in the customer object:', orderDetailsResponse.data.customer);
      } else {
        console.log('Customer data fields at root level:');
        console.log('customer_name:', orderDetailsResponse.data.customer_name);
        console.log('customer_email:', orderDetailsResponse.data.customer_email);
        console.log('customer_phone:', orderDetailsResponse.data.customer_phone);
        console.log('address:', orderDetailsResponse.data.address);
      }
    } else {
      console.log('No orders found');
    }
  } catch (error) {
    console.error('Error fetching order data:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

fetchOrderDetails();
