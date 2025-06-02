import React, { useState } from 'react';
import { FaUpload, FaSpinner, FaImage } from 'react-icons/fa';

const FileUpload = ({ onFileUpload, currentImage }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, or WEBP)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('image', file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload the file to the server
      const response = await fetch('http://localhost:6543/api/admin/upload/menu-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      onFileUpload(data.imageUrl); // Pass the image URL to the parent component
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Menu preview" />
        </div>
      )}
      <div className="upload-button-container">
        <label className="upload-button">
          {isUploading ? 
            <FaSpinner className="spinner" style={{color: '#6f4e37'}} /> : 
            <FaUpload style={{color: '#6f4e37'}} />
          }
          {isUploading ? 'Uploading...' : 'Upload Image'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
      {!previewUrl && !isUploading && (
        <div className="no-image">
          <FaImage style={{fontSize: '2rem', color: '#d1c0a8', marginBottom: '8px'}} />
          <p>No image selected</p>
        </div>
      )}
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
};

export default FileUpload;
