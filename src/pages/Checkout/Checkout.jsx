import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user, isAuthenticated, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
    paymentMethod: 'credit-card'
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nama harus diisi';
    if (!formData.email.trim()) newErrors.email = 'Email harus diisi';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon harus diisi';
    if (!formData.address.trim()) newErrors.address = 'Alamat harus diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
// Di dalam Checkout.jsx, pada fungsi handleSubmit
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  // Simulasi proses checkout
  // Dalam aplikasi nyata, ini akan mengirim permintaan ke backend
  
  // Update purchase count untuk user yang login
  if (isAuthenticated) {
    const purchaseCount = user.purchaseCount + cartItems.reduce((total, item) => total + item.quantity, 0);
    updateUser({ purchaseCount });
  }
  
  // Clear cart
  clearCart();
  
  // Redirect ke halaman sukses dengan meneruskan metode pembayaran
  navigate('/checkout-success', { 
    state: { 
      paymentMethod: formData.paymentMethod === 'e-wallet' ? 'E-Wallet' : 
                     formData.paymentMethod === 'bank-transfer' ? 'Bank Transfer' : 'Credit Card'
    } 
  });
};

  
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <h1>Checkout</h1>
          <div className="empty-cart-message">
            <p>Keranjang belanja Anda kosong.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/menu')}
            >
              Lihat Menu
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <h2>Informasi Pengiriman</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Nomor Telepon</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Alamat</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <span className="error">{errors.address}</span>}
              </div>
              
              <div className="form-group">
                <label>Metode Pembayaran</label>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === 'credit-card'}
                      onChange={handleChange}
                    />
                    Kartu Kredit
                  </label>
                  
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={formData.paymentMethod === 'bank-transfer'}
                      onChange={handleChange}
                    />
                    Transfer Bank
                  </label>
                  
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="e-wallet"
                      checked={formData.paymentMethod === 'e-wallet'}
                      onChange={handleChange}
                    />
                    E-Wallet
                  </label>
                </div>
              </div>
              
              <button type="submit" className="btn-checkout">
                Selesaikan Pesanan
              </button>
            </form>
          </div>
          
          <div className="order-summary">
            <h2>Ringkasan Pesanan</h2>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>Rp {item.price.toLocaleString()} x {item.quantity}</p>
                  </div>
                  <p className="item-total">
                    Rp {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="order-total">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rp {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Biaya Pengiriman</span>
                <span>Rp 10.000</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>Rp {(getCartTotal() + 10000).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
