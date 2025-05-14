import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BsBag } from 'react-icons/bs';
import { FaBars } from 'react-icons/fa';
import './Header.css';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <Link to="/" className="logo">
            Kopiku
          </Link>
        </div>
        
        <div className="header-right">
          <div className="cart-icon">
            <Link to="/checkout">
              <BsBag size={24} />
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </Link>
          </div>
          
          {isAuthenticated ? (
            <Link to="/profile" className="auth-link">Profile</Link>
          ) : (
            <>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
