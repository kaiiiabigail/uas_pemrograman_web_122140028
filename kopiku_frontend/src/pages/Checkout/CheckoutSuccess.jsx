import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CheckoutSuccess.css';
import { FaCheckCircle, FaHome, FaShoppingBag, FaReceipt, FaEnvelope, FaWhatsapp, FaCoffee, FaMapMarkerAlt, FaTruck, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CheckoutSuccess = () => {
  const location = useLocation();
  const paymentMethod = location.state?.paymentMethod || 'Cash';
  const orderId = location.state?.orderId || `#${Math.floor(Math.random() * 10000)}`;
  const [showConfetti, setShowConfetti] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Auto-advance the order status steps
    const timer = setTimeout(() => {
      setCurrentStep(2);
      setTimeout(() => {
        setCurrentStep(3);
      }, 2000);
    }, 2000);
    
    // Hide confetti after 4 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 1, repeat: Infinity }
    }
  };
  
  const shareOrder = (platform) => {
    const message = `Saya baru saja memesan di Kopiku Coffee Shop! Order ID: ${orderId}`;
    
    switch(platform) {
      case 'email':
        window.open(`mailto:?subject=Pesanan Kopiku Coffee Shop&body=${encodeURIComponent(message)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="checkout-success-page">
      {showConfetti && <div className="confetti"></div>}
      
      <motion.div 
        className="success-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="success-header" variants={itemVariants}>
          <motion.div 
            className="success-icon"
            variants={pulseVariants}
            animate="pulse"
          >
            <FaCheckCircle />
          </motion.div>
          <h1>Terima Kasih!</h1>
          <p className="success-message">Pesanan Anda berhasil...</p>
        </motion.div>
        
        <motion.div className="order-info" variants={itemVariants}>
          <div className="order-info-item">
            <span className="info-label"><FaReceipt /> Order ID</span>
            <span className="info-value">{orderId}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label"><FaCalendarAlt /> Tanggal</span>
            <span className="info-value">{new Date().toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label"><FaCreditCard /> Metode Pembayaran</span>
            <span className="info-value">{paymentMethod}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label"><FaCheckCircle /> Status</span>
            <span className="info-value status-success">Pembayaran Berhasil</span>
          </div>
        </motion.div>
        
        <motion.div className="order-status-tracker" variants={itemVariants}>
          <h3>Status Pesanan</h3>
          <div className="status-steps">
            <div className={`status-step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-icon"><FaCheckCircle /></div>
              <div className="step-label">Pesanan Diterima</div>
            </div>
            <div className="step-connector"></div>
            <div className={`status-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-icon"><FaCoffee /></div>
              <div className="step-label">Sedang Diproses</div>
            </div>
            <div className="step-connector"></div>
            <div className={`status-step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-icon"><FaTruck /></div>
              <div className="step-label">Dalam Pengiriman</div>
            </div>
          </div>
        </motion.div>
        
        <motion.p className="delivery-info" variants={itemVariants}>
          <strong>Informasi Pengiriman:</strong> Pesanan Anda sedang diproses dan akan segera dikirimkan. 
          Anda akan menerima email konfirmasi dengan detail pesanan dalam waktu 15 menit.
          <br/><br/>
          <strong>Estimasi Pengiriman:</strong> 30-45 menit (tergantung jarak lokasi Anda)
        </motion.p>
        
        <motion.div className="share-section" variants={itemVariants}>
          <h3>Bagikan Pesanan Anda</h3>
          <div className="share-buttons">
            <button className="share-btn email" onClick={() => shareOrder('email')}>
              <FaEnvelope /> Email
            </button>
            <button className="share-btn whatsapp" onClick={() => shareOrder('whatsapp')}>
              <FaWhatsapp /> WhatsApp
            </button>
          </div>
        </motion.div>
        
        <motion.div className="success-actions" variants={itemVariants}>
          <Link to="/" className="btn-home">
            <FaHome /> Kembali ke Beranda
          </Link>
          <Link to="/menu/coffee" className="btn-shop">
            <FaShoppingBag /> Belanja Lagi
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
