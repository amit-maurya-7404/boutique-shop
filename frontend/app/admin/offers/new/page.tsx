/**
 * Add New Offer Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { toastManager } from '@/lib/toast';
import { IProduct, ICategory } from '@/types';

export default function AddOfferPage() {
  const router = useRouter();
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: '',
    applicableProducts: '',
    applicableCategories: '',
    startDate: '',
    endDate: '',
    isActive: true,
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
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.getProducts({ limit: 1000 }),
        api.getCategories(),
      ]);
      setProducts(productsRes.data.data.products || []);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toastManager.error('Failed to load products and categories');
    } finally {
      setDataLoading(false);
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
      const offerData = {
        title: formData.title,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        applicableProducts: formData.applicableProducts
          ? formData.applicableProducts.split(',').map((id) => id.trim())
          : [],
        applicableCategories: formData.applicableCategories
          ? formData.applicableCategories.split(',').map((id) => id.trim())
          : [],
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isActive: formData.isActive,
      };

      console.log('Submitting offer data:', offerData);
      const response = await api.createOffer(offerData);
      console.log('Offer created response:', response);

      toastManager.success('Offer created successfully');
      router.push('/admin/offers');
    } catch (error: any) {
      console.error('Error creating offer:', error);

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
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create offer';
        toastManager.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authError) {
    return <div className="p-8 text-center text-red-600">{authError}</div>;
  }

  if (dataLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/offers" className="text-yellow-600 hover:underline mb-4 inline-block">
          ← Back to Offers
        </Link>
        <h1 className="text-3xl font-bold">Add New Offer</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Offer Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter offer title"
            />
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">Discount Type *</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'} *
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="0"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">Start Date *</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">End Date *</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter offer description"
          />
        </div>

        {/* Applicable Products */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Applicable Products (Product IDs, comma-separated)
          </label>
          <textarea
            name="applicableProducts"
            value={formData.applicableProducts}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Leave empty for all products, or enter product IDs separated by commas"
          />
        </div>

        {/* Applicable Categories */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Applicable Categories (Category IDs, comma-separated)
          </label>
          <textarea
            name="applicableCategories"
            value={formData.applicableCategories}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Leave empty for all categories, or enter category IDs separated by commas"
          />
        </div>

        {/* Active Checkbox */}
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 border-gray-300 rounded focus:ring-yellow-500"
          />
          <span className="ml-2 text-sm font-medium">Active</span>
        </label>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Offer'}
          </button>
          <Link
            href="/admin/offers"
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
