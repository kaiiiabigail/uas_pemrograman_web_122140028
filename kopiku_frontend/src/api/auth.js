import api from './api';

export const login = (email, password) => {
  return api.post('/api/login', { email, password });
};

export const register = (username, email, password) => {
  return api.post('/api/register', { username, email, password });
};

export const logout = () => {
  // Jika menggunakan token, hapus token di sini
  localStorage.removeItem('token');
};
