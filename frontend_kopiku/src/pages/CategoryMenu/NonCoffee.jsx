import React, { useState, useEffect } from 'react';
import MenuItem from '../../components/MenuItem/MenuItem';
import './CategoryMenu.css';
import chocolateImg from '../../assets/images/chocolate-milkshake.jpg';
import strawberryImg from '../../assets/images/strawberry-smoothie.jpg';
import vanillaImg from '../../assets/images/vanilla-milkshake.jpg';
import hotchocolateImg from '../../assets/images/hot-chocolate.jpg';
import mangoJuiceImg from '../../assets/images/mango-juice.jpg';
import matchaLatteImg from '../../assets/images/matcha-latte.jpg';

const NonCoffee = () => {
  const [nonCoffeeItems, setNonCoffeeItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data dari API
    const fetchNonCoffeeItems = () => {
      // Data untuk non-coffee
      const nonCoffeeData = [
        {
          id: 7,
          name: 'Chocolate Milkshake',
          description: 'Rich chocolate milkshake with whipped cream',
          price: 28000,
          image: chocolateImg,
          category: 'non-coffee'
        },
        {
          id: 8,
          name: 'Strawberry Smoothie',
          description: 'Fresh strawberry smoothie with yogurt',
          price: 26000,
          image: strawberryImg,
          category: 'non-coffee'
        },
        {
          id: 9,
          name: 'Vanilla Milkshake',
          description: 'Creamy vanilla milkshake',
          price: 25000,
          image: vanillaImg,
          category: 'non-coffee'
        },
        {
          id: 10,
          name: 'Mango Juice',
          description: 'Fresh mango juice',
          price: 22000,
          image: mangoJuiceImg, 
          category: 'non-coffee'
        },
        {
          id: 11,
          name: 'Hot Chocolate',
          description: 'Rich hot chocolate with marshmallows',
          price: 24000,
          image: hotchocolateImg, 
          category: 'non-coffee'
        },
        {
          id: 12,
          name: 'Matcha Latte',
          description: 'Creamy matcha green tea latte',
          price: 26000,
          image: matchaLatteImg, 
          category: 'non-coffee'
        }
      ];

      setNonCoffeeItems(nonCoffeeData);
      setIsLoading(false);
    };

    // Simulasi loading delay
    setTimeout(() => {
      fetchNonCoffeeItems();
    }, 500);
  }, []);

  return (
    <div className="category-menu-page">
      <div className="category-header">
        <h1>Non-Coffee Menu</h1>
        <p>Non-Coffee Yang Pastinya Bikin Harimu Jadi Lebih Fresh</p>
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
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
