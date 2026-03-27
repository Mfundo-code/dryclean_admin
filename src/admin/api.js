import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8000/api'
  : 'https://drycleandemo.207.180.201.93.sslip.io/api';

const api = axios.create({ baseURL: BASE_URL });

// Token helpers
export const getToken   = () => localStorage.getItem('access_token');
export const saveToken  = (access, refresh, user) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  localStorage.setItem('username', user);
};
export const clearToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
};
export const getUsername = () => localStorage.getItem('username');

// Attach Bearer token
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token refresh on 401
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && localStorage.getItem('refresh_token')) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, {
          refresh: localStorage.getItem('refresh_token'),
        });
        localStorage.setItem('access_token', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        clearToken();
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (username, password) => api.post('/auth/login/', { username, password });

// Dashboard
export const getStats = () => api.get('/admin/stats/');

// Services
export const getServices = () => api.get('/admin/services/');
export const getService = (id) => api.get(`/admin/services/${id}/`);
export const createService = (data) => api.post('/admin/services/', data);
export const updateService = (id, data) => api.put(`/admin/services/${id}/`, data);
export const deleteService = (id) => api.delete(`/admin/services/${id}/`);

// Customers
export const getCustomers = () => api.get('/admin/customers/');
export const getCustomer = (id) => api.get(`/admin/customers/${id}/`);
export const createCustomer = (data) => api.post('/admin/customers/', data);
export const updateCustomer = (id, data) => api.put(`/admin/customers/${id}/`, data);
export const deleteCustomer = (id) => api.delete(`/admin/customers/${id}/`);

// Orders
export const getOrders = (params = {}) => api.get('/admin/orders/', { params });
export const getOrder = (id) => api.get(`/admin/orders/${id}/`);
export const createOrder = (data) => api.post('/admin/orders/', data);
export const updateOrder = (id, data) => api.put(`/admin/orders/${id}/`, data);
export const deleteOrder = (id) => api.delete(`/admin/orders/${id}/`);

// Payments
export const getPayments = () => api.get('/admin/payments/');
export const getPayment = (id) => api.get(`/admin/payments/${id}/`);
export const createPayment = (data) => api.post('/admin/payments/', data);
export const updatePayment = (id, data) => api.put(`/admin/payments/${id}/`, data);
export const deletePayment = (id) => api.delete(`/admin/payments/${id}/`);

// Invoices
export const getInvoices = () => api.get('/admin/invoices/');
export const getInvoice = (id) => api.get(`/admin/invoices/${id}/`);
export const createInvoice = (data) => api.post('/admin/invoices/', data);
export const updateInvoice = (id, data) => api.put(`/admin/invoices/${id}/`, data);
export const deleteInvoice = (id) => api.delete(`/admin/invoices/${id}/`);

// Documents
export const getDocuments = () => api.get('/admin/documents/');
export const getDocument = (id) => api.get(`/admin/documents/${id}/`);
export const uploadDocument = (data) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('document_type', data.document_type);
  formData.append('file', data.file);
  return api.post('/admin/documents/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateDocument = (id, data) => api.put(`/admin/documents/${id}/`, data);
export const deleteDocument = (id) => api.delete(`/admin/documents/${id}/`);

// Contact messages
export const getMessages = () => api.get('/admin/contact/');
export const getMessage = (id) => api.get(`/admin/contact/${id}/`);
export const updateMessage = (id, data) => api.patch(`/admin/contact/${id}/`, data);

// Audit logs
export const getAuditLogs = () => api.get('/admin/audit-logs/');

export default api;