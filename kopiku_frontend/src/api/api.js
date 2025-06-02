// src/api/api.js
const API_URL = 'http://127.0.0.1:6543/api';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getMenu = async () => {
  try {
    const response = await fetch(`${API_URL}/menu`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Menu fetch error:', error);
    return []; // Return empty array on error
  }
};
