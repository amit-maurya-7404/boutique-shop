/**
 * Edit Category Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { toastManager } from '@/lib/toast';
import { ICategory } from '@/types';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) {
      setAuthError('You are not authenticated. Please login first.');
      router.push('/admin/login');
      return;
    }
    loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      // Since getCategoryBySlug expects a slug, we'll try to get it by fetching all categories
      // In a real scenario, the backend should support getting by ID
      const response = await api.getCategories();
      const category = response.data.data.find((c: ICategory) => c._id === categoryId);

      if (!category) {
        throw new Error('Category not found');
      }

      setFormData({
        name: category.name,
        description: category.description,
        image: category.image || '',
      });
    } catch (error) {
      console.error('Error loading category:', error);
      toastManager.error('Failed to load category');
      router.push('/admin/categories');
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      const categoryData = {
        name: formData.name,
        description: formData.description,
        image: formData.image || undefined,
      };

      console.log('Submitting category data:', categoryData);
      const response = await api.updateCategory(categoryId, categoryData);
      console.log('Category updated response:', response);

      toastManager.success('Category updated successfully');
      router.push('/admin/categories');
    } catch (error: any) {
      console.error('Error updating category:', error);

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
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update category';
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
    return <div className="p-8 text-center">Loading category...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/categories" className="text-purple-600 hover:underline mb-4 inline-block">
          ← Back to Categories
        </Link>
        <h1 className="text-3xl font-bold">Edit Category</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Category Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter category name"
          />
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter category description"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-semibold mb-2">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Category'}
          </button>
          <Link
            href="/admin/categories"
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
