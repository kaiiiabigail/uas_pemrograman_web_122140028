import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import { FaEnvelope, FaLock, FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const response = await axios.post('http://localhost:6543/api/customer/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Show success message (optional)
        console.log(response.data.message || 'Login successful!');
        
        // Store user data in localStorage
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirect based on user role
        if (userData.is_admin) {
          navigate('/admin/dashboard');
        } else {
          // Redirect regular customers to the homepage
          navigate('/');
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError(
          err.response?.data?.message || 
          'An error occurred during login'
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
          <h1>Masuk</h1>
          <p>Selamat datang kembali di Kopiku Coffee Shop</p>
        </div>
        
        {error && (
          <div className="error-message">
            <FaExclamationCircle /> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
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
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Ingat saya</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">Lupa password?</Link>
          </div>
          
          <button 
            type="submit" 
            className="btn-auth"
            disabled={loading}
          >
            {loading ? 'Logging in...' : <FaSignInAlt />} Masuk
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Belum punya akun? <Link to="/register">Daftar sekarang</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
