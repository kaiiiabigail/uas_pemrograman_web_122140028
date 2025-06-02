import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { FaMinus, FaPlus, FaTrash, FaCreditCard, FaQrcode, FaMoneyBillWave } from 'react-icons/fa';
import QRCode from 'react-qr-code';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const { user, isAuthenticated, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    cashNote: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === 'cardExpiry') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === 'cardCVV') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 3);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nama harus diisi';
    if (!formData.email.trim()) newErrors.email = 'Email harus diisi';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon harus diisi';
    if (!formData.address.trim()) newErrors.address = 'Alamat harus diisi';

    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Nomor kartu kredit harus 16 digit';
      }
      if (!formData.cardName.trim()) newErrors.cardName = 'Nama pemegang kartu harus diisi';
      if (!formData.cardExpiry.trim() || formData.cardExpiry.length < 5) {
        newErrors.cardExpiry = 'Tanggal kadaluarsa harus dalam format MM/YY';
      }
      if (!formData.cardCVV.trim() || formData.cardCVV.length < 3) {
        newErrors.cardCVV = 'CVV harus 3 digit';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitCheckout = async (orderData) => {
    try {
      const response = await axios.post('http://localhost:6543/api/orders', orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Full order response:', response);
      
      // Handle different response formats
      if (typeof response.data === 'string') {
        try {
          // Try to parse the JSON string
          const parsedData = JSON.parse(response.data);
          console.log('Parsed order data:', parsedData);
          return parsedData;
        } catch (parseError) {
          console.error('Error parsing response data:', parseError);
          throw new Error('Invalid JSON response from server');
        }
      } else if (response.data && typeof response.data === 'object') {
        // If it's already an object, return it directly
        return response.data;
      } else {
        // If it's neither a valid string nor an object
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          try {
            const parsedError = JSON.parse(errorData);
            throw parsedError.error || 'Terjadi kesalahan saat checkout';
          } catch (parseError) {
            throw errorData;
          }
        } else if (typeof errorData === 'object') {
          throw errorData.error || 'Terjadi kesalahan saat checkout';
        }
      }
      throw error.message || 'Terjadi kesalahan saat checkout';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    setIsProcessing(true);

    const orderData = {
      user_id: user?.id,
      total_amount: total
    };

    try {
      // 1. Buat order utama
      const orderResponse = await submitCheckout(orderData);
      console.log('Order creation response:', orderResponse);
      
      // Extract order ID from response - handle different possible response formats
      let orderId = null;
      
      if (orderResponse && typeof orderResponse === 'object') {
        // Direct ID in response
        if (orderResponse.id) {
          orderId = orderResponse.id;
          console.log('Found order ID directly:', orderId);
        } 
        // ID in nested order object
        else if (orderResponse.order && orderResponse.order.id) {
          orderId = orderResponse.order.id;
          console.log('Found order ID in order object:', orderId);
        }
      }
      
      console.log('Final order ID to use:', orderId);

      // Ensure we have a valid order ID before proceeding
      if (!orderId) {
        throw new Error('Order ID tidak ditemukan dalam respons server');
      }
      
      // 2. Buat order items untuk setiap item di cart
      if (orderId) {
        console.log('Starting to create order items for order ID:', orderId);
        console.log('Cart items to process:', cartItems);
        
        let allItemsSuccessful = true;
        const failedItems = [];
        
        for (const item of cartItems) {
          // Ensure we have the correct properties
          console.log('Processing cart item:', item);
          
          // Make sure we have the correct ID field
          const menuItemId = item.id || item.menu_item_id;
          if (!menuItemId) {
            console.error('Missing menu item ID in cart item:', item);
            allItemsSuccessful = false;
            failedItems.push({...item, error: 'Missing menu item ID'});
            continue; // Skip this item
          }
          
          const orderItemData = {
            menu_item_id: menuItemId,
            quantity: item.quantity,
            price: item.price, // Include the price from the cart item
            created_at: new Date().toISOString() // Include the created_at timestamp
          };
          
          console.log('Order item data to submit:', orderItemData);
          
          try {
            console.log(`Submitting order item for menu item ${menuItemId}, quantity ${item.quantity} to URL: http://localhost:6543/api/orders/${orderId}/items`);
            const response = await axios.post(`http://localhost:6543/api/orders/${orderId}/items`, orderItemData, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            console.log('Order item creation successful:', response.data);
          } catch (error) {
            console.error('Error adding order item:', error);
            allItemsSuccessful = false;
            
            let errorMessage = 'Unknown error';
            if (error.response) {
              console.error('Error response data:', error.response.data);
              console.error('Error response status:', error.response.status);
              
              if (error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
              }
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            failedItems.push({...item, error: errorMessage});
          }
        }
        
        // If any items failed, show an error message but continue with the checkout process
        if (!allItemsSuccessful) {
          console.error('Some items failed to be added to the order:', failedItems);
          setFormError(`Beberapa item gagal ditambahkan ke pesanan. Pesanan tetap dibuat dengan item yang berhasil.`);
        }
      }

      // 3. Lanjutkan proses sukses
      clearCart();
      navigate('/checkout-success', {
        state: {
          paymentMethod: formData.paymentMethod,
          orderId: orderId
        }
      });
    } catch (err) {
      setFormError(err.message || 'Terjadi kesalahan saat checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIncreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) updateQuantity(itemId, item.quantity + 1);
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item && item.quantity > 1) updateQuantity(itemId, item.quantity - 1);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const subtotal = getCartTotal();
  const shippingFee = 10000;
  const total = subtotal + shippingFee;
  const qrisData = `BNI.ID*${total}*KOPIKU*PEMBAYARAN KOPIKU`;

  if (!isAuthenticated) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <h1>Checkout</h1>
          <div className="empty-cart-message">
            <p>Anda harus login untuk melakukan checkout.</p>
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn-secondary" onClick={() => navigate('/register')}>
              Daftar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <h1>Checkout</h1>
          <div className="empty-cart-message">
            <p>Keranjang belanja Anda kosong.</p>
            <button className="btn-primary" onClick={() => navigate('/menu')}>
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
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Nomor Telepon</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">Alamat</label>
                <textarea id="address" name="address" value={formData.address} onChange={handleChange} />
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
                    <FaCreditCard /> Kartu Kredit
                  </label>

                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qris"
                      checked={formData.paymentMethod === 'qris'}
                      onChange={handleChange}
                    />
                    <FaQrcode /> QRIS
                  </label>

                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                    />
                    <FaMoneyBillWave /> Cash
                  </label>
                </div>
              </div>

              {formData.paymentMethod === 'credit-card' && (
                <div className="credit-card-form">
                  <h3>Detail Kartu Kredit</h3>

                  <div className="form-group">
                    <label htmlFor="cardNumber">Nomor Kartu</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                    {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardName">Nama Pemegang Kartu</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      placeholder="Nama sesuai kartu"
                      value={formData.cardName}
                      onChange={handleChange}
                    />
                    {errors.cardName && <span className="error">{errors.cardName}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cardExpiry">Tanggal Kadaluarsa</label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                      />
                      {errors.cardExpiry && <span className="error">{errors.cardExpiry}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardCVV">CVV</label>
                      <input
                        type="text"
                        id="cardCVV"
                        name="cardCVV"
                        placeholder="XXX"
                        value={formData.cardCVV}
                        onChange={handleChange}
                      />
                      {errors.cardCVV && <span className="error">{errors.cardCVV}</span>}
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'qris' && (
                <div className="qris-payment">
                  <h3>Pembayaran QRIS</h3>
                  <p>Scan kode QR berikut untuk melakukan pembayaran:</p>

                  <div className="qr-code-container">
                    <QRCode value={qrisData} size={200} level="H" />
                  </div>

                  <div className="qris-info">
                    <p>
                      Total Pembayaran: <strong>Rp {total.toLocaleString()}</strong>
                    </p>
                    <p>
                      Merchant: <strong>Kopiku Coffee Shop</strong>
                    </p>
                    <p className="qris-note">Pembayaran akan otomatis terverifikasi dalam sistem</p>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'cash' && (
                <div className="cash-payment">
                  <h3>Pembayaran Tunai</h3>
                  <p>Pembayaran akan dilakukan saat pengiriman.</p>

                  <div className="form-group">
                    <label htmlFor="cashNote">Catatan (opsional)</label>
                    <textarea
                      id="cashNote"
                      name="cashNote"
                      placeholder="Misal: Tolong sediakan kembalian"
                      value={formData.cashNote}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {formError && <div className="form-error">{formError}</div>}

              <button type="submit" className={`btn-checkout ${isProcessing ? 'processing' : ''}`} disabled={isProcessing}>
                {isProcessing ? 'Memproses...' : 'Selesaikan Pesanan'}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h2>Ringkasan Pesanan</h2>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>Rp {item.price.toLocaleString()}</p>
                    <div className="quantity-control">
                      <button onClick={() => handleDecreaseQuantity(item.id)} disabled={item.quantity <= 1}>
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleIncreaseQuantity(item.id)}>
                        <FaPlus />
                      </button>
                    </div>
                    <button className="remove-item" onClick={() => handleRemoveItem(item.id)}>
                      <FaTrash /> Hapus
                    </button>
                  </div>
                  <p className="item-total">Rp {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Biaya Pengiriman</span>
                <span>Rp {shippingFee.toLocaleString()}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>Rp {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
