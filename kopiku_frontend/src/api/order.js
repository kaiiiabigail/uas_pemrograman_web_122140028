import api from './api';

export const checkout = (orderData) => {
  return api.post('/api/checkout', orderData);
};

export const getOrders = () => {
  return api.get('/api/orders');
};

export const getOrderById = (orderId) => {
  return api.get(`/api/orders/${orderId}`);
};

export const confirmOrder = (orderId) => {
  return api.post(`/api/orders/${orderId}/confirm`);
};

export const rejectOrder = (orderId) => {
  return api.post(`/api/orders/${orderId}/reject`);
};
