import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CheckoutSuccess.css';
import { FaCheckCircle } from 'react-icons/fa';
import logoImg from '../../assets/images/kopiku-logo.png';

const CheckoutSuccess = () => {
  const location = useLocation();
  const paymentMethod = location.state?.paymentMethod || 'E-Wallet';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Menggunakan tanggal saat ini
  const currentDate = new Date().toLocaleDateString();
  // Membuat order ID yang random
  const orderId = `#KP${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="checkout-success-page">
      <div className="success-container">
        <div className="success-header">
          <div className="logo-circle">
            <img src={logoImg} alt="Kopiku Logo" className="success-logo" />
          </div>
        </div>

        <div className="success-icon">
          <FaCheckCircle />
        </div>
        
        <h1>Pesanan Berhasil!</h1>
        <p className="success-message">Terima kasih telah berbelanja di Kopiku Coffee Shop.</p>
        <p className="success-message">Pesanan Anda sedang diproses dan akan segera dikirimkan.</p>
        
        <div className="order-info">
          <h2>Informasi Pesanan</h2>
          <div className="order-detail">
            <div className="order-detail-item">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">{orderId}</span>
            </div>
            <div className="order-detail-item">
              <span className="detail-label">Tanggal:</span>
              <span className="detail-value">{currentDate}</span>
            </div>
            <div className="order-detail-item">
              <span className="detail-label">Metode Pembayaran:</span>
              <span className="detail-value">{paymentMethod}</span>
            </div>
          </div>
        </div>
        
        <div className="success-actions">
          <Link to="/" className="btn-home">Kembali ke Beranda</Link>
          <Link to="/menu" className="btn-shop">Belanja Lagi</Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;