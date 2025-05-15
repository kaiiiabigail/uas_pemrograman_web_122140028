import React, { useState, useEffect } from 'react';
import MenuItem from '../../components/MenuItem/MenuItem';
import './CategoryMenu.css';
import greenTeaImg from '../../assets/images/green-tea.jpg';
import blackTeaImg from '../../assets/images/black-tea.jpg';
import chamomileImg from '../../assets/images/chamomile-tea.jpg';
import earlgreyteaImg from '../../assets/images/earl-grey-tea.jpg';
import jasmineTeaImg from '../../assets/images/jasmine-tea.jpg';
import lemonTeaImg from '../../assets/images/lemon-tea.jpg';



const Tea = () => {
  const [teaItems, setTeaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data dari API
    const fetchTeaItems = () => {
      // Data untuk tea
      const teaData = [
        {
          id: 13,
          name: 'Green Tea',
          description: 'Refreshing green tea',
          price: 18000,
          image: greenTeaImg,
          category: 'tea'
        },
        {
          id: 14,
          name: 'Black Tea',
          description: 'Strong black tea',
          price: 18000,
          image: blackTeaImg,
          category: 'tea'
        },
        {
          id: 15,
          name: 'Chamomile Tea',
          description: 'Calming chamomile tea',
          price: 20000,
          image: chamomileImg,
          category: 'tea'
        },
        {
          id: 16,
          name: 'Earl Grey Tea',
          description: 'Aromatic tea with bergamot flavor',
          price: 19000,
          image: earlgreyteaImg, 
          category: 'tea'
        },
        {
          id: 17,
          name: 'Jasmine Tea',
          description: 'Fragrant jasmine tea',
          price: 20000,
          image: jasmineTeaImg, 
          category: 'tea'
        },
        {
          id: 18,
          name: 'Lemon Tea',
          description: 'Refreshing tea with lemon',
          price: 19000,
          image: lemonTeaImg, 
          category: 'tea'
        }
      ];

      setTeaItems(teaData);
      setIsLoading(false);
    };

    
    setTimeout(() => {
      fetchTeaItems();
    }, 500);
  }, []);

  return (
    <div className="category-menu-page">
      <div className="category-header">
        <h1>Tea Menu</h1>
        <p>Menu Teh Yang Pastinya Enak</p>
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
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
