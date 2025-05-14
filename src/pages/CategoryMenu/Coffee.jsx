import React, { useState, useEffect } from 'react';
import MenuItem from '../../components/MenuItem/MenuItem';
import './CategoryMenu.css';
import espressoImg from '../../assets/images/espresso.jpg';
import cappuccinoImg from '../../assets/images/cappuccino.jpg';
import latteImg from '../../assets/images/latte.jpg';
import americanoImg from '../../assets/images/americano.jpg';
import mocaImg from '../../assets/images/moca.jpg';
import flatWhiteImg from '../../assets/images/flat-white.jpg';

const Coffee = () => {
  const [coffeeItems, setCoffeeItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const fetchCoffeeItems = () => {
      
      const coffeeData = [
        {
          id: 1,
          name: 'Espresso',
          description: 'Strong black coffee made by forcing steam through ground coffee beans',
          price: 15000,
          image: espressoImg,
          category: 'coffee'
        },
        {
          id: 2,
          name: 'Cappuccino',
          description: 'Coffee with steamed milk foam',
          price: 25000,
          image: cappuccinoImg,
          category: 'coffee'
        },
        {
          id: 3,
          name: 'Latte',
          description: 'Coffee with a lot of milk',
          price: 22000,
          image: latteImg,
          category: 'coffee'
        },
        {
          id: 4,
          name: 'Americano',
          description: 'Espresso with added hot water',
          price: 18000,
          image: americanoImg,
          category: 'coffee'
        },
        {
          id: 5,
          name: 'Mocha',
          description: 'Espresso with hot milk and chocolate',
          price: 26000,
          image: mocaImg, 
          category: 'coffee'
        },
        {
          id: 6,
          name: 'Flat White',
          description: 'Coffee with steamed milk',
          price: 24000,
          image: flatWhiteImg, 
          category: 'coffee'
        }
      ];

      setCoffeeItems(coffeeData);
      setIsLoading(false);
    };

    // Simulasi loading delay
    setTimeout(() => {
      fetchCoffeeItems();
    }, 500);
  }, []);

  return (
    <div className="category-menu-page">
      <div className="category-header">
        <h1>Coffee Menu</h1>
        <p>Kopi Yang Siap Menemanimu Hingga Pagi</p>
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
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
