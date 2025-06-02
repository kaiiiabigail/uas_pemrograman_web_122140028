import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import AdminLayout from './pages/Admin/AdminLayout'; // Import AdminLayout

// Pages
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import Coffee from './pages/CategoryMenu/Coffee';
import NonCoffee from './pages/CategoryMenu/NonCoffee';
import Tea from './pages/CategoryMenu/Tea';
import Snack from './pages/CategoryMenu/Snack';
import Checkout from './pages/Checkout/Checkout';
import CheckoutSuccess from './pages/Checkout/CheckoutSuccess';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import OrderManagement from './pages/Admin/OrderManagement';
import MenuManagement from './pages/Admin/MenuManagement';
import SalesReport from './pages/Admin/SalesReport';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AdminProvider } from './contexts/AdminContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <AdminProvider>
          <Router>
            <Routes>
              {/* Admin Routes dengan AdminLayout */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              } />
              <Route path="/admin/orders" element={
                <AdminLayout>
                  <OrderManagement />
                </AdminLayout>
              } />
              <Route path="/admin/menu" element={
                <AdminLayout>
                  <MenuManagement />
                </AdminLayout>
              } />
              <Route path="/admin/reports" element={
                <AdminLayout>
                  <SalesReport />
                </AdminLayout>
              } />
              
              {/* Customer Routes */}
              <Route path="/*" element={
                <div className="app">
                  <Header toggleSidebar={toggleSidebar} />
                  <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/menu" element={<Menu />} />
                      <Route path="/menu/coffee" element={<Coffee />} />
                      <Route path="/menu/non-coffee" element={<NonCoffee />} />
                      <Route path="/menu/tea" element={<Tea />} />
                      <Route path="/menu/snack" element={<Snack />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/checkout-success" element={<CheckoutSuccess />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </Router>
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
