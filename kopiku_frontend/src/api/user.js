import api from './api';

export const getUserProfile = () => {
  return api.get('/api/profile');
};

export const updateUserProfile = (profileData) => {
  return api.put('/api/profile', profileData);
};

export const uploadProfileImage = (formData) => {
  return api.post('/api/profile/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
