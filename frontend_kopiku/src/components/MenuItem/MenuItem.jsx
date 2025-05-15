import React, { useContext } from 'react';
import './MenuItem.css';
import { CartContext } from '../../contexts/CartContext';

const MenuItem = ({ item }) => {
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = () => {
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
    </div>
  );
};

export default MenuItem;
