import React, { useContext, useState } from 'react';
import './MenuItem.css';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MenuItem = ({ item }) => {
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    addToCart(item);
  };

  return (
    <div className="menu-item">
      <div className="menu-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="menu-item-content">
        <h3 className="menu-item-title">{item.name}</h3>
        <p className="menu-item-description">{item.description}</p>
        <div className="menu-item-footer">
          <span className="menu-item-price">Rp {item.price.toLocaleString()}</span>
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
      {showAuthDialog && (
        <div className="auth-modal-backdrop" onClick={() => setShowAuthDialog(false)}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <div className="auth-modal-icon">☕</div>
            <h3>Yuk, Login atau Daftar Dulu!</h3>
            <p>Untuk menambah ke keranjang dan melanjutkan pesanan, silakan masuk atau buat akun Kopiku. Kami siap menyajikan kopi terbaik untukmu!</p>
            <div className="auth-modal-actions">
              <button className="btn-primary" onClick={() => navigate('/login')}>Masuk</button>
              <button className="btn-secondary" onClick={() => navigate('/register')}>Buat Akun</button>
            </div>
            <button className="auth-modal-close" onClick={() => setShowAuthDialog(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItem;
