import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaUser, 
  FaShoppingBag, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaClock,
  FaTruck,
  FaClipboardList
} from 'react-icons/fa';
import './Admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helper function to format order status
const formatOrderStatus = (status) => {
  if (!status) return '';
  
  // Handle cases like OrderStatus.CONFIRMED or OrderStatus.PENDING
  if (status.includes('.')) {
    const parts = status.split('.');
    if (parts.length > 1) {
      status = parts[1].toLowerCase();
    }
  }
  
  // Capitalize first letter
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

// Helper function to normalize status for comparison
const normalizeStatus = (status) => {
  if (!status) return '';
  
  // Handle cases like OrderStatus.CONFIRMED
  if (status.includes('.')) {
    const parts = status.split('.');
    if (parts.length > 1) {
      status = parts[1];
    }
  }
  
  return status.toLowerCase();
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:6543/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Log the orders to see the status values
      console.log('Orders from API:', response.data);
      if (response.data.length > 0) {
        console.log('Sample order status:', response.data[0].status);
        console.log('Status type:', typeof response.data[0].status);
      }
      
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`http://localhost:6543/api/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Order details:', response.data);
      
      // Extract customer data from the order response
      // First check if there's a nested customer object
      let customerData = {};
      
      if (response.data.customer) {
        // If customer data is in a nested object
        customerData = {
          customer_name: response.data.customer.name || '',
          customer_email: response.data.customer.email || '',
          customer_phone: response.data.customer.phone || '',
          address: response.data.customer.address || ''
        };
      } else {
        // If customer data is at the root level
        customerData = {
          customer_name: response.data.customer_name || '',
          customer_email: response.data.customer_email || '',
          customer_phone: response.data.customer_phone || '',
          address: response.data.address || response.data.shipping_address || ''
        };
      }
      
      // Merge the order data with extracted customer data
      const orderData = {
        ...response.data,
        ...customerData
      };
      
      setSelectedOrder(orderData);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details');
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `http://localhost:6543/api/admin/orders/${orderId}`,
        { status: status },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success(`Order #${orderId} berhasil diubah menjadi ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error('Gagal mengubah status order');
    }
  };

  const filteredOrders = orders.filter(order => {
    // Add null checks for customer_name
    const customerName = order.customer_name || '';
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    
    // Use the normalizeStatus helper for consistent comparison
    const normalizedOrderStatus = normalizeStatus(order.status);
    const normalizedStatusFilter = normalizeStatus(statusFilter);
    
    const matchesStatus = !statusFilter || normalizedOrderStatus === normalizedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-management-page">
      <header className="admin-header">
        <h1>Kelola Pesanan</h1>
        <p>Daftar pesanan pelanggan Kopiku Coffee Shop</p>
      </header>
      <section className="admin-filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by order ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <FaFilter className="filter-icon" />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </section>
      <section className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer_name}</td>
                <td>Rp {order.total_amount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {formatOrderStatus(order.status)}
                  </span>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      <FaEye />
                    </button>
                    {normalizeStatus(order.status) === 'pending' && (
                      <>
                        <button
                          className="btn-confirm"
                          onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content order-detail-enhanced">
            <div className="modal-header">
              <h2><FaClipboardList style={{marginRight: '10px'}} /> Order #{selectedOrder.id}</h2>
              <button
                className="close-modal"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>
            
            <div className="order-status-banner" data-status={selectedOrder.status.toLowerCase()}>
              <div className="status-indicator">
                <span className={`status-dot ${selectedOrder.status.toLowerCase()}`}></span>
                <span className="status-text">{formatOrderStatus(selectedOrder.status)}</span>
              </div>
              <div className="order-date">
                <FaClock style={{marginRight: '5px'}} />
                {new Date(selectedOrder.created_at).toLocaleString()}
              </div>
            </div>
            
            <div className="modal-body order-detail-grid">
              <div className="customer-card info-card">
                <div className="card-header">
                  <FaUser style={{marginRight: '8px'}} />
                  <h3>Customer Details</h3>
                </div>
                <div className="card-content">
                  <div className="info-item">
                    <span className="info-label"><FaUser /></span>
                    <span className="info-value">{selectedOrder.customer_name || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><FaEnvelope /></span>
                    <span className="info-value">{selectedOrder.customer_email || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><FaPhone /></span>
                    <span className="info-value">{selectedOrder.customer_phone || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><FaMapMarkerAlt /></span>
                    <span className="info-value">{selectedOrder.address || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="order-summary-card info-card">
                <div className="card-header">
                  <FaShoppingBag style={{marginRight: '8px'}} />
                  <h3>Order Summary</h3>
                </div>
                <div className="card-content">
                  <div className="info-item">
                    <span className="info-label">Order ID:</span>
                    <span className="info-value">#{selectedOrder.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><FaCalendarAlt /></span>
                    <span className="info-value">{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><FaClock /></span>
                    <span className="info-value">{new Date(selectedOrder.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><FaTruck /></span>
                    <span className="info-value status-badge" data-status={selectedOrder.status.toLowerCase()}>
                      {formatOrderStatus(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="info-item total-amount">
                    <span className="info-label"><FaMoneyBillWave /></span>
                    <span className="info-value">Rp {selectedOrder.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="order-items-card info-card">
                <div className="card-header">
                  <FaClipboardList style={{marginRight: '8px'}} />
                  <h3>Order Items</h3>
                </div>
                <div className="card-content">
                  <div className="order-items-list">
                    {selectedOrder.items.map(item => (
                      <div className="order-item" key={item.id}>
                        <div className="item-image">
                          <img src={item.image_url || '/assets/images/default-menu.jpg'} alt={item.name} />
                        </div>
                        <div className="item-details">
                          <h4 className="item-name">{item.name}</h4>
                          <div className="item-meta">
                            <span className="item-price">Rp {item.price.toLocaleString()}</span>
                            <span className="item-quantity">x {item.quantity}</span>
                          </div>
                        </div>
                        <div className="item-subtotal">
                          Rp {(item.quantity * item.price).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>Rp {selectedOrder.total_amount.toLocaleString()}</span>
                    </div>
                    {selectedOrder.delivery_fee > 0 && (
                      <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>Rp {selectedOrder.delivery_fee.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.tax > 0 && (
                      <div className="summary-row">
                        <span>Tax</span>
                        <span>Rp {selectedOrder.tax.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>Rp {selectedOrder.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {normalizeStatus(selectedOrder.status) === 'pending' && (
                <div className="order-actions-card info-card">
                  <div className="card-header">
                    <FaTruck style={{marginRight: '8px'}} />
                    <h3>Order Actions</h3>
                  </div>
                  <div className="card-content action-buttons">
                    <button
                      className="btn-confirm-large"
                      onClick={() => {
                        if(window.confirm('Are you sure you want to confirm this order?')) {
                          handleUpdateStatus(selectedOrder.id, 'confirmed');
                          setSelectedOrder(null);
                        }
                      }}
                    >
                      <FaCheck /> Confirm Order
                    </button>
                    <button
                      className="btn-reject-large"
                      onClick={() => {
                        if(window.confirm('Are you sure you want to cancel this order?')) {
                          handleUpdateStatus(selectedOrder.id, 'cancelled');
                          setSelectedOrder(null);
                        }
                      }}
                    >
                      <FaTimes /> Cancel Order
                    </button>
                  </div>
                </div>
              )}
              
              {normalizeStatus(selectedOrder.status) === 'confirmed' && (
                <div className="order-actions-card info-card">
                  <div className="card-header">
                    <FaTruck style={{marginRight: '8px'}} />
                    <h3>Order Actions</h3>
                  </div>
                  <div className="card-content action-buttons">
                    <button
                      className="btn-complete-large"
                      onClick={() => {
                        if(window.confirm('Mark this order as completed?')) {
                          handleUpdateStatus(selectedOrder.id, 'completed');
                          setSelectedOrder(null);
                        }
                      }}
                    >
                      <FaCheck /> Complete Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default OrderManagement;

