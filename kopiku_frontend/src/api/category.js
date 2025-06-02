const API_URL = 'http://127.0.0.1:6543/api';

export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Categories fetch error:', error);
    return [];
  }
}; 