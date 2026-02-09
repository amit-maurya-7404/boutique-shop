/**
 * Admin Reviews Management
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { IReview } from '@/types';
import { LoadingSpinner } from '@/components/Loading';
import { toastManager } from '@/lib/toast';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await api.getReviews({ limit: 100 });
      setReviews(response.data.data?.reviews || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toastManager.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toastManager.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toastManager.error('Failed to delete review');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reviews Management</h1>
        <Link
          href="/admin/reviews/new"
          className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
        >
          Add New Review
        </Link>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{review.customerName}</h3>
                <div className="flex gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">"{review.reviewText}"</p>
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    review.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {review.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="space-x-2">
                  <Link
                    href={`/admin/reviews/${review._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
          <p>No reviews yet. Click "Add New Review" to get started.</p>
        </div>
      )}
    </div>
  );
}
