import React, { useState, useEffect } from 'react';
import MenuItem from '../../components/MenuItem/MenuItem';
import './CategoryMenu.css';
import { getMenu } from '../../api/menu';

const NonCoffee = () => {
  const [nonCoffeeItems, setNonCoffeeItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getMenu()
      .then(data => {
        const items = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
        const filtered = items.filter(item => {
          if (item.category && item.category.name) {
            return item.category.name.toLowerCase() === 'non-coffee';
          }
          if (item.category) {
            return String(item.category).toLowerCase() === 'non-coffee';
          }
          return false;
        });
        setNonCoffeeItems(filtered);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch non-coffee menu');
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="category-menu-page">
      <div className="category-header">
        <h1>Non-Coffee Menu</h1>
        <p>Non-Coffee Yang Pastinya Bikin Harimu Jadi Lebih Fresh</p>
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="menu-items-grid">
          {nonCoffeeItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NonCoffee;
