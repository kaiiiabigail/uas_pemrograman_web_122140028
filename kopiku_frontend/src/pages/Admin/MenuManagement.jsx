import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../contexts/AdminContext';
import './Admin.css';
import { FaPlus, FaMinus, FaEdit, FaTrash, FaSearch, FaFilter, FaSync, FaUtensils, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileUpload from '../../components/FileUpload';

const MenuManagement = () => {
  const { 
    isAdmin, 
    menuItems, 
    increaseStock, 
    decreaseStock, 
    addMenuItem,
    editMenuItem,
    deleteMenuItem
  } = useContext(AdminContext);
  
  const navigate = useNavigate();
  
  const [filteredItems, setFilteredItems] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockAmount, setStockAmount] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state untuk tambah/edit menu
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_available: true,
    image_url: '',
    stock: 0
  });
  
  useEffect(() => {
    // Redirect ke login jika bukan admin
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);
  
  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
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
  
  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:6543/api/admin/menu', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAllMenuItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch menu items');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Filter menu berdasarkan pencarian dan kategori
    let result = [...allMenuItems];
    
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category_id === parseInt(categoryFilter));
    }
    
    setFilteredItems(result);
  }, [allMenuItems, searchTerm, categoryFilter]);
  
  const handleIncreaseStock = async (itemId) => {
    try {
      await increaseStock(itemId, stockAmount);
      toast.success('Stok berhasil ditambah!');
      fetchMenuItems(); // Refresh the menu items after increasing stock
    } catch {
      toast.error('Gagal menambah stok!');
    }
  };
  
  const handleDecreaseStock = async (itemId) => {
    try {
      await decreaseStock(itemId, stockAmount);
      toast.success('Stok berhasil dikurangi!');
      fetchMenuItems(); // Refresh the menu items after decreasing stock
    } catch {
      toast.error('Gagal mengurangi stok!');
    }
  };
  
  const openAddModal = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      is_available: true,
      image_url: '',
      stock: 0
    });
    setShowAddModal(true);
  };
  
  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      is_available: item.is_available,
      image_url: item.image_url || '',
      stock: item.stock ?? 0
    });
    setShowEditModal(true);
  };
  
  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseInt(value) || '' : value
    }));
  };

  const handleStockAmountChange = (e) => {
    const value = e.target.value;
    setStockAmount(value === '' ? 1 : Math.max(1, parseInt(value, 10)));
  };
  
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMenuItem(formData);
      setShowAddModal(false);
      resetForm();
      fetchMenuItems(); // Refresh the menu items after adding
    } catch (err) {
      setError('Failed to add menu item');
    }
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await editMenuItem(selectedItem.id, formData);
      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
      fetchMenuItems(); // Refresh the menu items after editing
    } catch (err) {
      setError('Failed to update menu item');
    }
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await deleteMenuItem(selectedItem.id);
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchMenuItems(); // Refresh the menu items after deleting
    } catch (err) {
      setError('Failed to delete menu item');
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      is_available: true,
      image_url: '',
      stock: 0
    });
  };
  
  if (!isAdmin) {
    return null;
  }
  
  if (loading) return <div className="loading">Loading menu items...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="menu-management-page">
      <header className="admin-header">
        <h1><FaUtensils style={{marginRight: 8}}/> Manajemen Menu</h1>
        <p>Atur stok dan kelola menu Kopiku Coffee Shop</p>
      </header>
      <section className="admin-actions">
        <div className="admin-filters">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <FaFilter className="filter-icon" />
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn-refresh" onClick={fetchMenuItems} title="Refresh Data">
          <FaSync /> Refresh
        </button>
        <button className="btn-add-menu" onClick={openAddModal}>
          <FaPlus /> Tambah Menu Baru
        </button>
      </section>
      <section className="menu-table-container">
        <h2 style={{display:'flex',alignItems:'center',fontSize:'1.1rem',marginBottom:10}}>
          <FaEdit style={{marginRight:8}}/> Daftar Menu
        </h2>
        <table className="menu-table">
          <thead>
            <tr>
              <th>Gambar</th>
              <th>Nama Menu</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Terjual</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>
                  <img 
                    src={item.image_url || '/assets/images/default-menu.jpg'} 
                    alt={item.name} 
                    className="menu-thumbnail"
                  />
                </td>
                <td>{item.name}</td>
                <td>{categories.find(cat => cat.id === item.category_id)?.name}</td>
                <td>Rp {item.price.toLocaleString()}</td>
                <td>
                  <span className={`stock-badge ${Number(item.stock ?? 0) < 10 ? 'low' : 'normal'}`}>
                    {item.stock ?? 0}
                  </span>
                </td>
                <td>{item.sold ?? 0}</td>
                <td className="action-buttons">
                  <button 
                    className="btn-edit" 
                    onClick={() => openEditModal(item)}
                    title="Edit Menu"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => openDeleteModal(item)}
                    title="Hapus Menu"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {/* Modal Tambah Menu */}
      {showAddModal && (
        <div className="menu-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Tambah Menu Baru</h2>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddSubmit} className="menu-form">
                <div className="form-group">
                  <label htmlFor="name">Nama Menu</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Deskripsi</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                  ></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Harga (Rp)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Kategori</label>
                    <select
                      id="category"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="image_upload"><FaImage style={{marginRight: '8px', color: '#6f4e37'}} /> Gambar Menu</label>
                  <FileUpload 
                    onFileUpload={(imageUrl) => {
                      setFormData(prev => ({
                        ...prev,
                        image_url: imageUrl
                      }));
                    }}
                    currentImage={formData.image_url}
                  />
                  {formData.image_url && (
                    <div className="current-image-url">
                      <small>URL Gambar: {formData.image_url}</small>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="stock">Stok</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    />
                    Available
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">Simpan Menu</button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setShowAddModal(false)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Modal Edit Menu */}
      {showEditModal && selectedItem && (
        <div className="menu-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Menu</h2>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit} className="menu-form">
                <div className="form-group">
                  <label htmlFor="name">Nama Menu</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Deskripsi</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                  ></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Harga (Rp)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Kategori</label>
                    <select
                      id="category"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="image_upload"><FaImage style={{marginRight: '8px', color: '#6f4e37'}} /> Gambar Menu</label>
                  <FileUpload 
                    onFileUpload={(imageUrl) => {
                      setFormData(prev => ({
                        ...prev,
                        image_url: imageUrl
                      }));
                    }}
                    currentImage={formData.image_url}
                  />
                  {formData.image_url && (
                    <div className="current-image-url">
                      <small>URL Gambar: {formData.image_url}</small>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="stock">Stok</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    />
                    Available
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">Simpan Perubahan</button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setShowEditModal(false)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && selectedItem && (
        <div className="menu-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Konfirmasi Hapus</h2>
              <button className="close-modal" onClick={() => setShowDeleteModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p className="delete-confirmation">
                Apakah Anda yakin ingin menghapus menu <strong>{selectedItem.name}</strong>?
              </p>
              <p className="delete-warning">
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="form-actions">
                <button 
                  className="btn-delete-confirm"
                  onClick={handleDeleteConfirm}
                >
                  Hapus Menu
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default MenuManagement;

