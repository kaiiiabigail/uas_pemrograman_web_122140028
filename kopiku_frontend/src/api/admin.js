import api from './api';

export const getAdminOrders = () => {
  return api.get('/api/admin/orders');
};

export const getAdminMenu = () => {
  return api.get('/api/admin/menu');
};

export const updateMenuStock = (itemId, newStock) => {
  return api.put(`/api/admin/menu/${itemId}/stock`, { stock: newStock });
};

export const addMenuItem = (menuItemData) => {
  return api.post('/api/admin/menu', menuItemData);
};

export const deleteMenuItem = (itemId) => {
  return api.delete(`/api/admin/menu/${itemId}`);
};

export const getSalesReport = () => {
  return api.get('/api/admin/reports');
};
