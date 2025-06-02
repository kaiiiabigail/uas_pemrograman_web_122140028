import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../contexts/AdminContext';
import axios from 'axios';
import './Admin.css';
import { FaUser, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { adminLogin, isAdmin } = useContext(AdminContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect ke dashboard jika sudah login sebagai admin
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!username || !email || !password) {
      setError('Semua field harus diisi');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:6543/api/admin/login', {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.token) {
        // Simpan token ke localStorage
        localStorage.setItem('adminToken', response.data.token);
        // Update context dengan data admin
        adminLogin(response.data.admin);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        'Username, email, atau password salah'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p>Masuk ke panel admin Kopiku Coffee Shop</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">
              <FaUser /> Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username admin"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email admin"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn-admin-login" disabled={loading}>
            <FaSignInAlt /> {loading ? 'Loading...' : 'Login Admin'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p>Kembali ke <a href="/">Halaman Utama</a></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
