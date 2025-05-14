import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>Kopiku</h2>
          <p>Black Lifestyle Lovers</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h3>Menu</h3>
            <ul>
              <li><Link to="/menu/coffee">Coffee</Link></li>
              <li><Link to="/menu/non-coffee">Non-Coffee</Link></li>
              <li><Link to="/menu/tea">Tea</Link></li>
              <li><Link to="/menu/snack">Snack</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Tentang Kami</h3>
            <ul>
              <li><Link to="/about">Tentang Kopiku</Link></li>
              <li><Link to="/contact">Kontak</Link></li>
              <li><Link to="/careers">Karir</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Hubungi Kami</h3>
            <address>
              <p>Jl. Kopi No. 123</p>
              <p>Jakarta, Indonesia</p>
              <p>Email: info@kopiku.com</p>
              <p>Telp: (021) 123-4567</p>
            </address>
          </div>
        </div>
        
        <div className="footer-social">
          <h3>Ikuti Kami</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Kopiku Coffee Shop. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
