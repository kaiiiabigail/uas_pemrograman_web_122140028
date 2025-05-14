import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BsBag, BsTrash } from 'react-icons/bs';
import './Cart.css';
import { CartContext } from '../../contexts/CartContext';

const Cart = ({ isOpen, toggleCart }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  
  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2><BsBag /> Keranjang</h2>
        <button className="close-cart" onClick={toggleCart}>×</button>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Keranjang belanja Anda kosong.</p>
          <Link to="/menu" className="btn-shop" onClick={toggleCart}>
            Lihat Menu
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">
                    Rp {item.price.toLocaleString()}
                  </p>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <button 
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>Rp {getCartTotal().toLocaleString()}</span>
            </div>
            <Link to="/checkout" className="btn-checkout" onClick={toggleCart}>
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
