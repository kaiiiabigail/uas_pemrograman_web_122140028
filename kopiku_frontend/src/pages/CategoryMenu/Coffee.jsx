import React, { useState, useEffect } from 'react';
import MenuItem from '../../components/MenuItem/MenuItem';
import './CategoryMenu.css';
import { getMenu } from '../../api/menu';

const Coffee = () => {
  const [coffeeItems, setCoffeeItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getMenu()
      .then(data => {
        // Selalu pastikan items adalah array
        const items = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
        const filtered = items.filter(item => {
          // Cek berdasarkan nama kategori atau properti category/category_id
          if (item.category && item.category.name) {
            return item.category.name.toLowerCase() === 'coffee';
          }
          if (item.category) {
            return String(item.category).toLowerCase() === 'coffee';
          }
          return false;
        });
        setCoffeeItems(filtered);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch coffee menu');
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="category-menu-page">
      <div className="category-header">
        <h1>Coffee Menu</h1>
        <p>Kopi Yang Siap Menemanimu Hingga Pagi</p>
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="menu-items-grid">
          {coffeeItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Coffee;
