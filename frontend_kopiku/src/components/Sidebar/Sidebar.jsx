import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaHome, FaCoffee, FaUser } from 'react-icons/fa';
import './Sidebar.css';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, toggle }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="close-button" onClick={toggle}>
          <FaTimes />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" onClick={toggle}>
              <FaHome /> Home
            </Link>
          </li>
          <li className="menu-dropdown">
            <Link to="/menu" onClick={toggle}>
              <FaCoffee /> Menu
            </Link>
            <ul className="submenu">
              <li>
                <Link to="/menu/coffee" onClick={toggle}>Coffee</Link>
              </li>
              <li>
                <Link to="/menu/non-coffee" onClick={toggle}>Non-Coffee</Link>
              </li>
              <li>
                <Link to="/menu/tea" onClick={toggle}>Tea</Link>
              </li>
              <li>
                <Link to="/menu/snack" onClick={toggle}>Snack</Link>
              </li>
            </ul>
          </li>
          
          {isAuthenticated ? (
            <li>
              <Link to="/profile" onClick={toggle}>
                <FaUser /> Profile
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={toggle}>Login</Link>
              </li>
              <li>
                <Link to="/register" onClick={toggle}>Daftar</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
