import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { AuthContext } from '../../contexts/AuthContext';
import { FaSignOutAlt, FaEdit, FaUser } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Contoh data untuk progress bar
  const purchaseCount = user?.purchaseCount || 15;
  const purchaseGoal = 50; // Jumlah pembelian untuk mendapatkan diskon
  const progressPercentage = (purchaseCount / purchaseGoal) * 100;
  const hasDiscount = progressPercentage >= 100;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ username, profileImage });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Profil Saya</h1>
        
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-image-container">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  <FaUser />
                </div>
              )}
              {isEditing && (
                <label className="change-photo-btn">
                  Ubah Foto
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="edit-profile-form">
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
                <div className="form-actions">
                  <button type="submit" className="btn-save">Simpan</button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setIsEditing(false)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <h2>{username}</h2>
                <div className="profile-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit /> Edit Profil
                  </button>
                  <button 
                    className="btn-logout"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="profile-stats">
            <h3>Progress Pembelian</h3>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="progress-info">
              <p>{purchaseCount} dari {purchaseGoal} pembelian</p>
              {hasDiscount && (
                <div className="discount-badge">Diskon 30% Aktif!</div>
              )}
            </div>
            <p className="progress-description">
              Selesaikan {purchaseGoal} pembelian untuk mendapatkan diskon 30% pada pembelian berikutnya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
