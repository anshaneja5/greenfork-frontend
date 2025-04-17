import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token added to request:', token.substring(0, 10) + '...');
  } else {
    console.log('No token found in localStorage');
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - server may be down or unreachable');
      return Promise.reject({
        message: 'Network error - server may be down or unreachable. Please check if the backend server is running.'
      });
    }
    
    // Handle specific error status codes
    if (error.response.status === 401) {
      // Unauthorized - token expired or invalid
      // Don't redirect directly, just remove the token
      // The AuthContext will handle the redirection
      localStorage.removeItem('token');
      console.log('Token expired or invalid, removed from localStorage');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Orders API
export const orders = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  delete: (id) => api.delete(`/orders/${id}`),
  checkZomatoLogin: () => api.get('/orders/zomato'),
  fetchZomatoOrders: (data) => api.post('/orders/zomato/fetch', { ordersData: data }),
  importOrders: (ordersData) => api.post('/orders/zomato/fetch', { ordersData }),
  checkSwiggyLogin: () => api.get('/orders/swiggy'),
  fetchSwiggyOrders: (data) => api.post('/orders/swiggy/fetch', { ordersData: data }),
  importSwiggyOrders: (ordersData) => api.post('/orders/swiggy/fetch', { ordersData }),
  getOrderRecommendations: (orderId) => api.get(`/orders/${orderId}/recommendations`)
};

// Insights API
export const insights = {
  getSummary: () => api.get('/insights/summary'),
  getTrends: () => api.get('/insights/trends'),
  getPlatformComparison: () => api.get('/insights/platform-comparison'),
  getSuggestions: () => api.get('/insights/suggestions'),
  getAIRecommendations: () => api.get('/insights/ai-recommendations')
};

export default api; 