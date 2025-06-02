import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';
import { FaShoppingBag, FaClipboardList, FaChartBar, FaExclamationCircle, FaUsers, FaUtensils, FaTags } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    today: { orders: 0, revenue: 0 },
    this_month: { orders: 0, revenue: 0 },
    total_users: 0,
    total_menu_items: 0,
    total_categories: 0,
    recent_orders: [],
    top_items: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:6543/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err.response?.data?.error || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard-content">
      <header className="admin-header">
        <h1>Dashboard</h1>
        <p>Selamat datang di Panel Admin Kopiku Coffee Shop. Kelola data dan pantau performa toko Anda di sini.</p>
      </header>
      <section className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-icon today-orders">
            <FaClipboardList />
          </div>
          <div className="stat-info">
            <h3>Today's Orders</h3>
            <p>{stats.today.orders}</p>
            <small>Revenue: Rp {stats.today.revenue.toLocaleString()}</small>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon monthly-sales">
            <FaChartBar />
          </div>
          <div className="stat-info">
            <h3>This Month</h3>
            <p>{stats.this_month.orders} orders</p>
            <small>Revenue: Rp {stats.this_month.revenue.toLocaleString()}</small>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon total-users">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>{stats.total_users}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon menu-items">
            <FaUtensils />
          </div>
          <div className="stat-info">
            <h3>Menu Items</h3>
            <p>{stats.total_menu_items}</p>
          </div>
        </div>
      </section>
      <section className="dashboard-sections">
        <div className="recent-orders">
          <h2><FaClipboardList/> Daftar Pesanan Terbaru</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>Rp {order.total_amount.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="top-items">
          <h2><FaTags/> Menu Terlaris</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Total Sold</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_items.map(({ item, total_quantity }) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category_name}</td>
                    <td>{total_quantity}</td>
                    <td>Rp {item.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default AdminDashboard;
