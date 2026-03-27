import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8000/api'
  : 'https://drycleandemo.207.180.201.93.sslip.io/api';

const api = axios.create({ baseURL: BASE_URL });

// Public endpoints (no auth required)
export const getServices = () => api.get('/services/');
export const createOrder = (data) => api.post('/order/create/', data);
export const getOrderStatus = (orderNumber, phone) => 
  api.get('/order/status/', { params: { order_number: orderNumber, phone } });
export const submitContact = (data) => api.post('/contact/', data);
export const trackVisit = (page) => api.post('/track/visit/', { page }).catch(() => {});

export default api;