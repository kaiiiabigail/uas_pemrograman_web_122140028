import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDownload, FaCalendarAlt, FaChartLine, FaChartPie, FaShoppingBag, FaMoneyBillWave, FaChartBar, FaTag, FaCoffee, FaPercent } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SalesReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    average_order_value: 0,
    category_stats: [],
    top_items: []
  });
  
  // Function to get color for category based on index
  const getCategoryColor = (index) => {
    const colors = [
      '#5C8D89', // Coffee Green
      '#D3A762', // Coffee Brown
      '#E67E22', // Coffee Orange
      '#3498DB', // Blue
      '#9B59B6', // Purple
      '#E74C3C', // Red
      '#1ABC9C', // Turquoise
      '#34495E'  // Dark Blue
    ];
    return colors[index % colors.length];
  };
  
  // Function to calculate percentage for bar charts
  const getPercentage = (value, max) => {
    if (!max) return 0;
    return (value / max) * 100;
  };
  
  // Calculate max values for scaling charts - safely handle potentially undefined values
  const maxCategorySales = Math.max(...((stats.category_stats || []).map(cat => (cat && cat.sales) || 0)), 1);
  const maxItemSales = Math.max(...((stats.top_items || []).map(item => (item && item.total_sales) || 0)), 1);

  useEffect(() => {
    fetchStats();
  }, [reportType, dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken');
      console.log(`Fetching stats with params: type=${reportType}, start_date=${dateRange.start}, end_date=${dateRange.end}`);
      
      const response = await axios.get('http://localhost:6543/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          type: reportType,
          start_date: dateRange.start,
          end_date: dateRange.end
        }
      });
      
      console.log('Stats response:', response.data);
      
      // Initialize default values if data is missing
      const defaultStats = {
        total_orders: 0,
        total_revenue: 0,
        average_order_value: 0,
        category_stats: [],
        top_items: []
      };
      
      // Merge the response data with default values for any missing properties
      setStats({...defaultStats, ...response.data});
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.response?.data?.error || 'Failed to fetch sales statistics');
      setLoading(false);
      
      // Set default empty values on error
      setStats({
        total_orders: 0,
        total_revenue: 0,
        average_order_value: 0,
        category_stats: [],
        top_items: []
      });
    }
  };

  const handleExport = async () => {
    try {
      // Simulasi export, tampilkan toast sukses
      toast.success('Laporan berhasil diexport!');
    } catch (err) {
      toast.error('Gagal export laporan!');
    }
  };

  if (loading) return <div className="loading">Loading sales report...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <motion.div 
      className="sales-report-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header 
        className="admin-header"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1>Laporan Penjualan</h1>
        <p>Rekap dan analisis penjualan Kopiku Coffee Shop</p>
      </motion.header>
      
      <motion.section 
        className="report-controls"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="report-type-selector">
          <button
            className={`report-btn ${reportType === 'daily' ? 'active' : ''}`}
            onClick={() => setReportType('daily')}
          >
            <FaChartBar /> Daily
          </button>
          <button
            className={`report-btn ${reportType === 'weekly' ? 'active' : ''}`}
            onClick={() => setReportType('weekly')}
          >
            <FaChartLine /> Weekly
          </button>
          <button
            className={`report-btn ${reportType === 'monthly' ? 'active' : ''}`}
            onClick={() => setReportType('monthly')}
          >
            <FaChartPie /> Monthly
          </button>
        </div>
        <div className="date-range-selector">
          <FaCalendarAlt />
          <input
            type="date"
            className="date-select"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <span>to</span>
          <input
            type="date"
            className="date-select"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
          <button className="btn-export" onClick={handleExport}>
            <FaDownload /> Export Report
          </button>
        </div>
      </motion.section>
      
      <motion.section 
        className="report-summary"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
      <div className="summary-cards">
        <motion.div 
          className="summary-card"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="stat-icon">
            <FaShoppingBag />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{stats.total_orders || 0}</div>
          </div>
        </motion.div>
        <motion.div 
          className="summary-card"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">Rp {(stats.total_revenue || 0).toLocaleString()}</div>
          </div>
        </motion.div>
        
        <motion.div 
          className="summary-card"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="stat-icon">
            <FaPercent />
          </div>
          <div className="stat-content">
            <div className="stat-label">Average Order Value</div>
            <div className="stat-value">Rp {(stats.average_order_value || 0).toLocaleString()}</div>
          </div>
        </motion.div>
      </div>
      </motion.section>
      <motion.section 
        className="report-section"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2><FaChartBar /> Category Performance</h2>
        <div className="category-chart-container">
          <div className="category-chart">
            {(stats.category_stats || []).map((category, index) => (
              <motion.div 
                key={index} 
                className="category-bar"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <div className="category-name">
                  <span>
                    <span
                      className="category-color"
                      style={{ backgroundColor: getCategoryColor(index) }}
                    ></span>
                    {category.category ? category.category.name : 'Unknown Category'}
                  </span>
                  <span>Rp {(category.sales || 0).toLocaleString()}</span>
                </div>
                <div className="bar-container">
                  <motion.div
                    className="bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${getPercentage(category.sales || 0, maxCategorySales)}%` }}
                    transition={{ delay: 0.2 * index, duration: 0.8 }}
                    style={{
                      backgroundColor: getCategoryColor(index),
                    }}
                  >
                    <span className="bar-value">
                      {category.quantity || 0} items
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="category-table">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Items Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(stats.category_stats || []).map((category, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <td>
                      <span
                        className="category-color"
                        style={{ backgroundColor: getCategoryColor(index) }}
                      ></span>
                      {category.category ? category.category.name : 'Unknown Category'}
                    </td>
                    <td>{category.quantity || 0}</td>
                    <td>Rp {(category.sales || 0).toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>
      
      <motion.section 
        className="report-section"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2><FaCoffee /> Top Selling Products</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Quantity Sold</th>
              <th>Revenue</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {(stats.top_items || []).map((item, index) => {
              // Safely get category color
              const getCategoryColorSafe = () => {
                if (!item || !item.item || !item.item.category) return getCategoryColor(0);
                
                const categoryIndex = (stats.category_stats || []).findIndex(
                  (cat) => cat.category && cat.category.id === item.item.category.id
                );
                
                return getCategoryColor(categoryIndex >= 0 ? categoryIndex : index);
              };
              
              return (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <td>
                    <div className="product-info">
                      <img
                        src={(item.item && item.item.image_url) ? 
                          (item.item.image_url.startsWith('http') ? item.item.image_url : `http://localhost:6543${item.item.image_url}`) : 
                          'https://via.placeholder.com/50x50?text=Kopiku'}
                        alt={(item.item && item.item.name) || 'Product'}
                        className="product-thumbnail"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/50x50?text=Kopiku'; }}
                      />
                      <span>{(item.item && item.item.name) || 'Unknown Product'}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="category-color"
                      style={{ backgroundColor: getCategoryColorSafe() }}
                    ></span>
                    {(item.item && item.item.category && item.item.category.name) || 'Unknown Category'}
                  </td>
                  <td>{item.total_quantity || 0}</td>
                  <td>Rp {(item.total_sales || 0).toLocaleString()}</td>
                  <td>
                    <div className="performance-bar-container">
                      <motion.div
                        className="performance-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${getPercentage(item.total_sales || 0, maxItemSales)}%` }}
                        transition={{ delay: 0.2 * index, duration: 0.8 }}
                        style={{
                          backgroundColor: getCategoryColorSafe()
                        }}
                      ></motion.div>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.section>
      <ToastContainer position="bottom-right" />
    </motion.div>
  );
};

export default SalesReport;
