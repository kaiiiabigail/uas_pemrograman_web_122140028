import React, { useState, useEffect } from 'react';
import MenuItem from '../../components/MenuItem/MenuItem';
import './CategoryMenu.css';
import { getMenu } from '../../api/menu';

const Tea = () => {
  const [teaItems, setTeaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getMenu()
      .then(data => {
        const items = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
        const filtered = items.filter(item => {
          if (item.category && item.category.name) {
            return item.category.name.toLowerCase() === 'tea';
          }
          if (item.category) {
            return String(item.category).toLowerCase() === 'tea';
          }
          return false;
        });
        setTeaItems(filtered);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch tea menu');
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="category-menu-page">
      <div className="category-header">
        <h1>Tea Menu</h1>
        <p>Menu Teh Yang Pastinya Enak</p>
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="menu-items-grid">
          {teaItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tea;
