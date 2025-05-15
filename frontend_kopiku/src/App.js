import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import Coffee from './pages/CategoryMenu/Coffee';
import NonCoffee from './pages/CategoryMenu/NonCoffee';
import Tea from './pages/CategoryMenu/Tea';
import Snack from './pages/CategoryMenu/Snack';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import CheckoutSuccess from './pages/Checkout/CheckoutSuccess';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
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
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
