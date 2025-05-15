import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Menu.css';
import MenuItem from '../../components/MenuItem/MenuItem';

const Menu = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'coffee', name: 'Coffee' },
    { id: 'non-coffee', name: 'Non-Coffee' },
    { id: 'tea', name: 'Tea' },
    { id: 'snack', name: 'Snack' }
  ];

  const menuItems = [
    // Contoh data menu
    {
      id: 1,
      name: 'Espresso',
      description: 'Strong black coffee',
      price: 15000,
      image: '/assets/images/espresso.jpg',
      category: 'coffee'
    },
    {
      id: 2,
      name: 'Chocolate Milkshake',
      description: 'Sweet chocolate drink',
      price: 22000,
      image: '/assets/images/chocolate.jpg',
      category: 'non-coffee'
    },
    // Tambahkan item menu lainnya
  ];

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId !== 'all') {
      navigate(`/menu/${categoryId}`);
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover our selection of handcrafted beverages and delicious snacks</p>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="menu-items-grid">
        {filteredItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
