/**
 * Admin Categories Management
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ICategory } from '@/types';
import { LoadingSpinner } from '@/components/Loading';
import { toastManager } from '@/lib/toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await api.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toastManager.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toastManager.error('Failed to delete category');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <Link
          href="/admin/categories/new"
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
        >
          Add New Category
        </Link>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category._id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <p className="text-xs text-gray-500 mb-4">Slug: {category.slug}</p>
              <div className="flex gap-2">
                <Link
                  href={`/admin/categories/${category._id}`}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-center text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
          <p>No categories yet. Click "Add New Category" to get started.</p>
        </div>
      )}
    </div>
  );
}
