// src/services/api.js
import axios from 'axios';

// Base URL for your Spring Boot backend
const BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// USER SERVICES
export const userService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Registration failed';
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Login failed';
    }
  },
};

// PRODUCT SERVICES
export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch products';
    }
  },

  // Add new product
  addProduct: async (productData) => {
    try {
      const response = await api.post('/products/add', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to add product';
    }
  },

  // Get products by owner
  getProductsByOwner: async (ownerId) => {
    try {
      const response = await api.get(`/products/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch products';
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/delete/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to delete product';
    }
  },
};

// ORDER SERVICES
export const orderService = {
  // Place order
  placeOrder: async (orderData) => {
    try {
      const response = await api.post('/orders/place', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to place order';
    }
  },

  // Get orders by client
  getOrdersByClient: async (clientId) => {
    try {
      const response = await api.get(`/orders/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch orders';
    }
  },
};

export default api;