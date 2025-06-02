import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [salesData, setSalesData] = useState({});
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000;
        
        if (Date.now() < expirationTime) {
          setIsAdmin(true);
          setAdminData({
            id: tokenData.user_id,
            email: tokenData.email,
            role: tokenData.role
          });
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (err) {
        console.error('Token validation error:', err);
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
  }, []);
  
  const loadDemoData = () => {
    // Demo orders data
    const demoOrders = [
      {
        id: 'ORD-001',
        customerName: 'Budi Santoso',
        items: [
          { id: 1, name: 'Espresso', price: 15000, quantity: 2 },
          { id: 3, name: 'Croissant', price: 18000, quantity: 1 }
        ],
        total: 48000,
        status: 'pending',
        paymentMethod: 'Bank Transfer',
        date: '2023-05-25T08:30:00'
      },
      {
        id: 'ORD-002',
        customerName: 'Siti Rahayu',
        items: [
          { id: 2, name: 'Cappuccino', price: 25000, quantity: 1 },
          { id: 5, name: 'Chocolate Cake', price: 30000, quantity: 1 }
        ],
        total: 55000,
        status: 'confirmed',
        paymentMethod: 'E-Wallet',
        date: '2023-05-24T14:15:00'
      },
      {
        id: 'ORD-003',
        customerName: 'Andi Wijaya',
        items: [
          { id: 4, name: 'Latte', price: 22000, quantity: 2 },
          { id: 6, name: 'Sandwich', price: 25000, quantity: 1 }
        ],
        total: 69000,
        status: 'pending',
        paymentMethod: 'Credit Card',
        date: '2023-05-25T10:45:00'
      }
    ];
    
    // Demo menu items with stock
    const demoMenuItems = [
      {
        id: 1,
        name: 'Espresso',
        description: 'Strong black coffee',
        price: 15000,
        category: 'coffee',
        image: '/assets/images/espresso.jpg',
        stock: 50,
        sold: 120
      },
      {
        id: 2,
        name: 'Cappuccino',
        description: 'Coffee with steamed milk foam',
        price: 25000,
        category: 'coffee',
        image: '/assets/images/cappuccino.jpg',
        stock: 45,
        sold: 95
      },
      {
        id: 3,
        name: 'Croissant',
        description: 'Buttery, flaky pastry',
        price: 18000,
        category: 'snack',
        image: '/assets/images/croissant.jpg',
        stock: 30,
        sold: 75
      },
      {
        id: 4,
        name: 'Latte',
        description: 'Coffee with a lot of milk',
        price: 22000,
        category: 'coffee',
        image: '/assets/images/latte.jpg',
        stock: 40,
        sold: 110
      },
      {
        id: 5,
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake slice',
        price: 30000,
        category: 'snack',
        image: '/assets/images/chocolate-cake.jpg',
        stock: 25,
        sold: 60
      },
      {
        id: 6,
        name: 'Sandwich',
        description: 'Fresh sandwich with vegetables and cheese',
        price: 25000,
        category: 'snack',
        image: '/assets/images/sandwich.jpg',
        stock: 20,
        sold: 45
      },
      {
        id: 7,
        name: 'Green Tea',
        description: 'Refreshing green tea',
        price: 18000,
        category: 'tea',
        image: '/assets/images/green-tea.jpg',
        stock: 35,
        sold: 80
      },
      {
        id: 8,
        name: 'Chocolate Milkshake',
        description: 'Rich chocolate milkshake',
        price: 28000,
        category: 'non-coffee',
        image: '/assets/images/chocolate-milkshake.jpg',
        stock: 30,
        sold: 65
      }
    ];
    
    // Demo sales data
    const demoSalesData = {
      categories: {
        coffee: 325,
        'non-coffee': 65,
        tea: 80,
        snack: 180
      },
      topSelling: [
        { id: 1, name: 'Espresso', sold: 120 },
        { id: 4, name: 'Latte', sold: 110 },
        { id: 2, name: 'Cappuccino', sold: 95 },
        { id: 7, name: 'Green Tea', sold: 80 },
        { id: 3, name: 'Croissant', sold: 75 }
      ],
      monthlySales: [
        { month: 'Jan', sales: 5200000 },
        { month: 'Feb', sales: 6100000 },
        { month: 'Mar', sales: 7300000 },
        { month: 'Apr', sales: 8500000 },
        { month: 'May', sales: 9200000 }
      ]
    };
    
    setOrders(demoOrders);
    setMenuItems(demoMenuItems);
    setSalesData(demoSalesData);
  };
  
  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:6543/api/admin/login', {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('adminToken', token);
      setIsAdmin(true);
      setAdminData(user);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed'
      };
    }
  };
  
  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    setAdminData(null);
  };
  
  // Fungsi untuk mengkonfirmasi pembayaran
  const confirmOrder = (orderId) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: 'confirmed' } : order
      )
    );
  };
  
  // Fungsi untuk menolak pembayaran
  const rejectOrder = (orderId) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: 'rejected' } : order
      )
    );
  };
  
  const updateStock = async (itemId, newStock) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:6543/api/admin/menu/${itemId}/stock`, { stock: newStock }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchMenuItems();
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  const increaseStock = (itemId, amount) => {
    const item = menuItems.find(i => i.id === itemId);
    if (item) updateStock(itemId, (item.stock || 0) + amount);
  };

  const decreaseStock = (itemId, amount) => {
    const item = menuItems.find(i => i.id === itemId);
    if (item) updateStock(itemId, Math.max(0, (item.stock || 0) - amount));
  };
  
  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:6543/api/admin/menu', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMenuItems(response.data);
    } catch (err) {
      console.error('Failed to fetch menu items:', err);
      throw err;
    }
  };

  const addMenuItem = async (menuItemData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:6543/api/admin/menu', menuItemData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchMenuItems();
      return response.data;
    } catch (err) {
      console.error('Failed to add menu item:', err);
      throw err;
    }
  };

  const editMenuItem = async (id, menuItemData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`http://localhost:6543/api/admin/menu/${id}`, menuItemData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchMenuItems();
      return response.data;
    } catch (err) {
      console.error('Failed to edit menu item:', err);
      throw err;
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:6543/api/admin/menu/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchMenuItems();
    } catch (err) {
      console.error('Failed to delete menu item:', err);
      throw err;
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminContext.Provider value={{
      isAdmin,
      adminData,
      loading,
      orders,
      menuItems,
      salesData,
      fetchMenuItems,
      addMenuItem,
      editMenuItem,
      deleteMenuItem,
      adminLogin,
      adminLogout,
      confirmOrder,
      rejectOrder,
      increaseStock,
      decreaseStock
    }}>
      {children}
    </AdminContext.Provider>
  );
};
