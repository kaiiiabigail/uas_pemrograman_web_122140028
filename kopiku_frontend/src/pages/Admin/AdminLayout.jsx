import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AdminContext } from '../../contexts/AdminContext';
import './Admin.css';
import { FaChartBar, FaClipboardList, FaShoppingBag, FaSignOutAlt, FaChartLine, FaCog } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = ({ children }) => {
  const { isAdmin, adminData, adminLogout } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const verifyToken = () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        adminLogout();
        navigate('/admin/login');
        return;
      }

      // Check if token is expired
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
        
        if (Date.now() >= expirationTime) {
          localStorage.removeItem('adminToken');
          adminLogout();
          navigate('/admin/login');
          return;
        }

        // Token is valid
        setLoading(false);
      } catch (err) {
        console.error('Token validation error:', err);
        localStorage.removeItem('adminToken');
        adminLogout();
        navigate('/admin/login');
      }
    };
    
    verifyToken();
  }, [adminLogout, navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    adminLogout();
    toast.info('Anda telah logout', { autoClose: 2000 });
    navigate('/admin/login');
  };
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="admin-dashboard coffee-theme">
      <aside className="admin-sidebar coffee-sidebar">
        <div className="admin-sidebar-header">
          <h2>Kopiku Admin</h2>
          <p>{adminData?.username}</p>
        </div>
        <nav className="admin-nav" aria-label="Admin Navigation">
          <Link 
            to="/admin/dashboard" 
            className={`admin-nav-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
          >
            <FaChartBar /> <span>Dashboard</span>
          </Link>
          <Link 
            to="/admin/orders" 
            className={`admin-nav-item ${location.pathname === '/admin/orders' ? 'active' : ''}`}
          >
            <FaClipboardList /> <span>Kelola Pesanan</span>
          </Link>
          <Link 
            to="/admin/menu" 
            className={`admin-nav-item ${location.pathname === '/admin/menu' ? 'active' : ''}`}
          >
            <FaShoppingBag /> <span>Kelola Menu</span>
          </Link>
          <Link 
            to="/admin/reports" 
            className={`admin-nav-item ${location.pathname === '/admin/reports' ? 'active' : ''}`}
          >
            <FaChartLine /> <span>Laporan Penjualan</span>
          </Link>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          {/* Judul halaman akan diisi oleh masing-masing page */}
        </header>
        <main className="admin-content coffee-content">
          {children}
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default AdminLayout;
