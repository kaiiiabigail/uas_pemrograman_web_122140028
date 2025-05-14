import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { AuthContext } from '../../contexts/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validasi sederhana
    if (!username || !email || !password || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    // Simulasi registrasi
    // Dalam aplikasi nyata, ini akan mengirim permintaan ke backend
    try {
      // Dummy register success
      register({
        id: Date.now(),
        username,
        email,
        purchaseCount: 0
      });
      navigate('/');
    } catch (err) {
      setError('Gagal mendaftar, silakan coba lagi');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Daftar</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-auth">Daftar</button>
        </form>
        
        <div className="auth-footer">
          <p>Sudah punya akun? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
