import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { AuthContext } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaExclamationCircle } from 'react-icons/fa';

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
              placeholder="Masukkan username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">
              <FaLock /> Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Konfirmasi password Anda"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              Saya menyetujui <Link to="/terms">Syarat dan Ketentuan</Link>
            </label>
          </div>
          
          <button type="submit" className="btn-auth">
            <FaUserPlus /> Daftar
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
