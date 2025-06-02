import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './Admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:6543/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch categories');
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('http://localhost:6543/api/admin/categories', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Kategori berhasil ditambahkan!');
      fetchCategories();
      setShowForm(false);
      resetForm();
    } catch (err) {
      toast.error('Gagal menambah kategori!');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:6543/api/admin/categories/${selectedCategory.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Kategori berhasil diperbarui!');
      fetchCategories();
      setShowForm(false);
      setSelectedCategory(null);
      resetForm();
    } catch (err) {
      toast.error('Gagal memperbarui kategori!');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:6543/api/admin/categories/${categoryId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('Kategori berhasil dihapus!');
        fetchCategories();
      } catch (err) {
        toast.error('Gagal menghapus kategori!');
      }
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading categories...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="category-management-page">
      <header className="admin-header">
        <h1>Kelola Kategori</h1>
        <p>Manajemen kategori menu Kopiku Coffee Shop</p>
      </header>
      <section className="admin-filters">
        {/* Render filters section */}
      </section>
      <section className="categories-table-container">
        <div className="admin-content">
          <div className="admin-actions">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="btn-add-menu"
              onClick={() => {
                setSelectedCategory(null);
                resetForm();
                setShowForm(true);
              }}
            >
              <FaPlus /> Add Category
            </button>
          </div>

          <div className="menu-table-container">
            <table className="menu-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Menu Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map(category => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>{category.menu_items_count || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(category)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {showForm && (
        <div className="menu-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button
                className="close-modal"
                onClick={() => {
                  setShowForm(false);
                  setSelectedCategory(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form
                className="menu-form"
                onSubmit={selectedCategory ? handleUpdateCategory : handleCreateCategory}
              >
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => {
                    setShowForm(false);
                    setSelectedCategory(null);
                    resetForm();
                  }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {selectedCategory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default CategoryManagement; 