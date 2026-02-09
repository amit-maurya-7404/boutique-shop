/**
 * Reviews / Testimonials Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IReview } from '@/types';
import { LoadingSpinner } from '@/components/Loading';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await api.getReviews({ limit: 100 });
        setReviews(response.data.data?.reviews || []);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Customer Reviews</h1>
      <p className="text-lg text-gray-600 mb-12">
        See what our customers say about our premium boutique fashion
      </p>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i} className="text-3xl text-yellow-500">
                    ★
                  </span>
                ))}
                {Array.from({ length: 5 - review.rating }).map((_, i) => (
                  <span key={i} className="text-3xl text-gray-300">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "{review.reviewText}"
              </p>
              <div>
                <p className="font-bold text-gray-900">{review.customerName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No reviews yet. Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
}
