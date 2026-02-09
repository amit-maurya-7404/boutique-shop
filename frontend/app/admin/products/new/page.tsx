/**
 * Add New Product Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { toastManager } from '@/lib/toast';
import { ICategory } from '@/types';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [categoriesLoading, setCategoriesLoading] = React.useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    categoryId: '',
    images: '',
    sizes: '',
    colors: '',
    tags: '',
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    stock: '',
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) {
      setAuthError('You are not authenticated. Please login first.');
      router.push('/admin/login');
      return;
    }
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toastManager.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify token before submission
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) {
      toastManager.error('Session expired. Please login again.');
      router.push('/admin/login');
      return;
    }
    
    // Client-side validation & normalization
    const name = formData.name.trim();
    const description = formData.description.trim();
    if (name.length < 3) {
      toastManager.error('Product name must be at least 3 characters');
      return;
    }
    if (description.length < 10) {
      toastManager.error('Description must be at least 10 characters');
      return;
    }

    if (!formData.categoryId) {
      toastManager.error('Please select a category');
      return;
    }

    const price = parseFloat(formData.price as any);
    if (isNaN(price) || price <= 0) {
      toastManager.error('Price must be a positive number');
      return;
    }

    const discountedPrice = formData.discountedPrice ? parseFloat(formData.discountedPrice as any) : undefined;
    if (discountedPrice !== undefined && (isNaN(discountedPrice) || discountedPrice < 0)) {
      toastManager.error('Discounted price must be a valid number');
      return;
    }

    const stock = parseInt(formData.stock as any);
    if (isNaN(stock) || stock < 0) {
      toastManager.error('Stock must be a valid non-negative number');
      return;
    }

    const imagesArr = formData.images
      ? formData.images.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    if (imagesArr.length === 0) {
      toastManager.error('At least one image is required');
      return;
    }

    const sizesArr = formData.sizes
      ? formData.sizes.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const colorsArr = formData.colors
      ? formData.colors.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const tagsArr = formData.tags
      ? formData.tags.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    setLoading(true);

    try {
      const productData: any = {
        name,
        description,
        price,
        category: formData.categoryId,
        images: imagesArr,
        sizes: sizesArr,
        colors: colorsArr,
        tags: tagsArr,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isActive: formData.isActive,
        stock,
      };

      if (discountedPrice !== undefined && !isNaN(discountedPrice)) productData.discountedPrice = discountedPrice;

      console.log('Submitting product data:', productData);
      const response = await api.createProduct(productData);
      console.log('Product created response:', response);
      
      toastManager.success('Product created successfully');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      
      if (error.response?.status === 401) {
        toastManager.error('Your session has expired. Please login again.');
        try { localStorage.removeItem('adminToken'); } catch (e) {}
        router.push('/admin/login');
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.errors?.[0]?.message || 
                           error.response?.data?.message || 
                           'Invalid data provided';
        toastManager.error(errorMessage);
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create product';
        toastManager.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authError) {
    return <div className="p-8 text-center text-red-600">{authError}</div>;
  }

  if (categoriesLoading) {
    return <div className="p-8 text-center">Loading categories...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/products" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold mb-2">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          {/* Discounted Price */}
          <div>
            <label className="block text-sm font-semibold mb-2">Discounted Price (₹)</label>
            <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold mb-2">Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product description"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold mb-2">Images (comma-separated URLs)</label>
          <textarea
            name="images"
            value={formData.images}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-semibold mb-2">Sizes (comma-separated)</label>
          <input
            type="text"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="XS, S, M, L, XL"
          />
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-semibold mb-2">Colors (comma-separated)</label>
          <input
            type="text"
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Red, Blue, Black"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="summer, casual, trending"
          />
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium">Featured Product</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isNewArrival"
              checked={formData.isNewArrival}
              onChange={handleChange}
              className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium">New Arrival</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium">Active</span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <Link
            href="/admin/products"
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
