import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaFilter, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import './Admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:6543/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('http://localhost:6543/api/admin/users', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('User berhasil ditambahkan!');
      fetchUsers();
      setShowForm(false);
      resetForm();
    } catch (err) {
      toast.error('Gagal menambah user!');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:6543/api/admin/users/${selectedUser.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('User berhasil diperbarui!');
      fetchUsers();
      setShowForm(false);
      setSelectedUser(null);
      resetForm();
    } catch (err) {
      toast.error('Gagal memperbarui user!');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:6543/api/admin/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('User berhasil dihapus!');
        fetchUsers();
      } catch (err) {
        toast.error('Gagal menghapus user!');
      }
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'customer'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-management-page">
      <header className="admin-header">
        <h1>Kelola Pengguna</h1>
        <p>Manajemen data pengguna Kopiku Coffee Shop</p>
      </header>
      <section className="admin-filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <FaFilter className="filter-icon" />
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </section>
      <section className="users-table-container">
        <div className="admin-actions">
          <button
            className="btn-add-menu"
            onClick={() => {
              setSelectedUser(null);
              resetForm();
              setShowForm(true);
            }}
          >
            <FaUserPlus /> Add User
          </button>
        </div>

        <div className="menu-table-container">
          <table className="menu-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`status-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClick(user)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user.id)}
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
      </section>
      {showForm && (
        <div className="menu-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedUser ? 'Edit User' : 'Add User'}</h2>
              <button
                className="close-modal"
                onClick={() => {
                  setShowForm(false);
                  setSelectedUser(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form
                className="menu-form"
                onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
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
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  >
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => {
                    setShowForm(false);
                    setSelectedUser(null);
                    resetForm();
                  }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {selectedUser ? 'Update' : 'Create'}
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

export default UserManagement; 