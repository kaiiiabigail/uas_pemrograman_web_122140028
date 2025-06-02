import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaExclamationCircle } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { username, email, password } = formData;
      const response = await axios.post('http://localhost:6543/api/customer/register', { username, email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Show success message (optional)
        alert(response.data.message || 'Registration successful!');
        
        // Redirect to login page using the redirect URL from the API or fallback to '/login'
        navigate(response.data.redirect || '/login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError(
          err.response?.data?.message || 
          'An error occurred during registration'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Daftar</h1>
          <p>Bergabunglah dengan Kopiku Coffee Shop</p>
        </div>
        
        {error && (
          <div className="error-message">
            <FaExclamationCircle /> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              <FaUser /> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Masukkan username Anda"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={50}
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Masukkan email Anda"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Masukkan password Anda"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirm_password">
              <FaLock /> Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              placeholder="Konfirmasi password Anda"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          
          <div className="form-terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              Saya menyetujui <Link to="/terms">Syarat dan Ketentuan</Link>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="btn-auth"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Sudah punya akun? <Link to="/login">Masuk</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
