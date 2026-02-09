/**
 * API utility functions and axios configuration
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if it exists (use consistent key `adminToken`)
    this.api.interceptors.request.use((config) => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', config.method?.toUpperCase(), config.url, { hasToken: !!token });
      } catch (e) {}
      return config;
    });

    // Handle errors
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
      },
      (error: AxiosError) => {
        console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
        if (error.response?.status === 401) {
          // Remove token so UI can handle re-login, but do NOT auto-redirect.
          try {
            if (typeof window !== 'undefined') localStorage.removeItem('adminToken');
          } catch (e) {}
        }
        return Promise.reject(error);
      }
    );
  }

  // Optional: store token automatically when login returns it
  private storeTokenIfPresent(response: any) {
    try {
      const url = response?.config?.url || '';
      const token = response?.data?.data?.token;
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('adminToken', token);
      }
    } catch (e) {}
  }

  // wrap request to capture login responses
  private async requestWrapper(fn: () => Promise<any>) {
    const res = await fn();
    this.storeTokenIfPresent(res);
    return res;
  }

  // Products
  getProducts(params?: any) {
    return this.api.get('/products', { params });
  }

  getFeaturedProducts(limit: number = 6) {
    return this.api.get(`/products/featured?limit=${limit}`);
  }

  getNewArrivals(limit: number = 6) {
    return this.api.get(`/products/new-arrivals?limit=${limit}`);
  }

  getProductById(id: string) {
    return this.api.get(`/products/${id}`);
  }

  createProduct(data: any) {
    return this.api.post('/products', data);
  }

  updateProduct(id: string, data: any) {
    return this.api.put(`/products/${id}`, data);
  }

  deleteProduct(id: string) {
    return this.api.delete(`/products/${id}`);
  }

  // Categories
  getCategories() {
    return this.api.get('/categories');
  }

  getCategoryBySlug(slug: string) {
    return this.api.get(`/categories/${slug}`);
  }

  createCategory(data: any) {
    return this.api.post('/categories', data);
  }

  updateCategory(id: string, data: any) {
    return this.api.put(`/categories/${id}`, data);
  }

  deleteCategory(id: string) {
    return this.api.delete(`/categories/${id}`);
  }

  // Offers
  getOffers() {
    return this.api.get('/offers');
  }

  createOffer(data: any) {
    return this.api.post('/offers', data);
  }

  updateOffer(id: string, data: any) {
    return this.api.put(`/offers/${id}`, data);
  }

  deleteOffer(id: string) {
    return this.api.delete(`/offers/${id}`);
  }

  // Reviews
  getReviews(params?: any) {
    return this.api.get('/reviews', { params });
  }

  createReview(data: any) {
    return this.api.post('/reviews', data);
  }

  updateReview(id: string, data: any) {
    return this.api.put(`/reviews/${id}`, data);
  }

  deleteReview(id: string) {
    return this.api.delete(`/reviews/${id}`);
  }

  // Admin
  adminLogin(email: string, password: string) {
    return this.requestWrapper(() => this.api.post('/admin/login', { email, password }));
  }

  getAdminProfile() {
    return this.api.get('/admin/profile');
  }
}

export default new ApiClient();
