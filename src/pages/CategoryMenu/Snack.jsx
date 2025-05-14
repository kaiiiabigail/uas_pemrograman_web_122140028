import React, { useState, useEffect } from 'react';
import MenuItem from '../../components/MenuItem/MenuItem';
import './CategoryMenu.css';
import croissantImg from '../../assets/images/croissant.jpg';
import cakeImg from '../../assets/images/chocolate-cake.jpg';
import sandwichImg from '../../assets/images/sandwich.jpg';
import bagelImg from '../../assets/images/bagel.jpg';
import cheesecakeImg from '../../assets/images/cheesecake.jpg';
import cinnamonImg from '../../assets/images/cinnamon-roll.jpg';

const Snack = () => {
  const [snackItems, setSnackItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data dari API
    const fetchSnackItems = () => {
      // Data untuk snack
      const snackData = [
        {
          id: 19,
          name: 'Croissant',
          description: 'Buttery, flaky pastry',
          price: 15000,
          image: croissantImg,
          category: 'snack'
        },
        {
          id: 20,
          name: 'Chocolate Cake',
          description: 'Rich chocolate cake slice',
          price: 25000,
          image: cakeImg,
          category: 'snack'
        },
        {
          id: 21,
          name: 'Sandwich',
          description: 'Fresh sandwich with vegetables and cheese',
          price: 22000,
          image: sandwichImg,
          category: 'snack'
        },
        {
          id: 22,
          name: 'Cheesecake',
          description: 'Creamy New York style cheesecake',
          price: 28000,
          image: cheesecakeImg,
          category: 'snack'
        },
        {
          id: 23,
          name: 'Bagel',
          description: 'Freshly baked bagel with cream cheese',
          price: 20000,
          image: bagelImg, 
          category: 'snack'
        },
        {
          id: 24,
          name: 'Cinnamon Roll',
          description: 'Sweet pastry with cinnamon and frosting',
          price: 18000,
          image: cinnamonImg,
          category: 'snack'
        }
      ];

      setSnackItems(snackData);
      setIsLoading(false);
    };

    // Simulasi loading delay
    setTimeout(() => {
      fetchSnackItems();
    }, 500);
  }, []);

  return (
    <div className="category-menu-page">
      <div className="category-header">
        <h1>Snack Menu</h1>
        <p>Snack Yang Pastinya Cocok Banget Buat Kamu Yang Lagi Nongki</p>
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="menu-items-grid">
          {snackItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Snack;
