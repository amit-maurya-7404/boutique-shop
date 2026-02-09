/**
 * Add New Review Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { toastManager } from '@/lib/toast';

export default function AddReviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    rating: '5',
    reviewText: '',
    isActive: true,
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) {
      setAuthError('You are not authenticated. Please login first.');
      router.push('/admin/login');
    }
  }, []);

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
      const reviewData = {
        customerName: formData.customerName,
        rating: parseInt(formData.rating),
        reviewText: formData.reviewText,
        isActive: formData.isActive,
      };

      console.log('Submitting review data:', reviewData);
      const response = await api.createReview(reviewData);
      console.log('Review created response:', response);

      toastManager.success('Review created successfully');
      router.push('/admin/reviews');
    } catch (error: any) {
      console.error('Error creating review:', error);

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
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create review';
        toastManager.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authError) {
    return <div className="p-8 text-center text-red-600">{authError}</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/reviews" className="text-pink-600 hover:underline mb-4 inline-block">
          ← Back to Reviews
        </Link>
        <h1 className="text-3xl font-bold">Add New Review</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Customer Name *</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter customer name"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold mb-2">Rating *</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="1">1 Star ⭐</option>
            <option value="2">2 Stars ⭐⭐</option>
            <option value="3">3 Stars ⭐⭐⭐</option>
            <option value="4">4 Stars ⭐⭐⭐⭐</option>
            <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
          </select>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-semibold mb-2">Review Text *</label>
          <textarea
            name="reviewText"
            value={formData.reviewText}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter the customer's review"
          />
        </div>

        {/* Active Checkbox */}
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 border-gray-300 rounded focus:ring-pink-500"
          />
          <span className="ml-2 text-sm font-medium">Active</span>
        </label>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Review'}
          </button>
          <Link
            href="/admin/reviews"
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
