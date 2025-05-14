import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validasi sederhana
    if (!email || !password) {
      setError('Semua field harus diisi');
      return;
    }

    // Simulasi login
    // Dalam aplikasi nyata, ini akan mengirim permintaan ke backend
    try {
      // Dummy login success
      login({
        id: 1,
        email,
        username: email.split('@')[0],
        purchaseCount: 15
      });
      navigate('/');
    } catch (err) {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-auth">Login</button>
        </form>
        
        <div className="auth-footer">
          <p>Belum punya akun? <Link to="/register">Daftar</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
