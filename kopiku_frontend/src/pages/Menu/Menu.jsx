import React, { useState, useEffect } from 'react';
import './Menu.css';
import MenuItem from '../../components/MenuItem/MenuItem';
import { getMenu } from '../../api/menu';

const ITEMS_PER_PAGE = 8;

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getMenu()
      .then(res => {
        // Pastikan data selalu array
        const items = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
        setMenuItems(items);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch menu');
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(menuItems.length / ITEMS_PER_PAGE);
  const paginatedItems = menuItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover our selection of handcrafted beverages and delicious snacks</p>
      </div>

      {loading ? (
        <div className="loading">Loading menu...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="menu-items-grid">
            {paginatedItems.map(item => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-btn${currentPage === i + 1 ? ' active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Menu;
