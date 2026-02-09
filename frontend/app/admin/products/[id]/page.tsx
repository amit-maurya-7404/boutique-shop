/**
 * Edit Product Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { toastManager } from '@/lib/toast';
import { ICategory, IProduct } from '@/types';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = React.useState(true);
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
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      const [productRes, categoriesRes] = await Promise.all([
        api.getProductById(productId),
        api.getCategories(),
      ]);

      const product: IProduct = productRes.data.data;
      setCategories(categoriesRes.data.data);

      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        discountedPrice: product.discountedPrice?.toString() || '',
        categoryId: product.category._id,
        images: product.images?.join(', ') || '',
        sizes: product.sizes?.join(', ') || '',
        colors: product.colors?.join(', ') || '',
        tags: product.tags?.join(', ') || '',
        isFeatured: product.isFeatured,
        isNewArrival: product.isNewArrival,
        isActive: product.isActive,
        stock: product.stock.toString(),
      });
    } catch (error) {
      console.error('Error loading product:', error);
      toastManager.error('Failed to load product');
      router.push('/admin/products');
    } finally {
      setPageLoading(false);
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

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : undefined,
        category: formData.categoryId,
        images: formData.images ? formData.images.split(',').map((img) => img.trim()) : [],
        sizes: formData.sizes ? formData.sizes.split(',').map((size) => size.trim()) : [],
        colors: formData.colors ? formData.colors.split(',').map((color) => color.trim()) : [],
        tags: formData.tags ? formData.tags.split(',').map((tag) => tag.trim()) : [],
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isActive: formData.isActive,
        stock: parseInt(formData.stock),
      };

      console.log('Submitting product data:', productData);
      const response = await api.updateProduct(productId, productData);
      console.log('Product updated response:', response);

      toastManager.success('Product updated successfully');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);

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
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update product';
        toastManager.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authError) {
    return <div className="p-8 text-center text-red-600">{authError}</div>;
  }

  if (pageLoading) {
    return <div className="p-8 text-center">Loading product...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/products" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-bold">Edit Product</h1>
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
            {loading ? 'Updating...' : 'Update Product'}
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
