/**
 * Admin Offers Management
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { IOffer } from '@/types';
import { LoadingSpinner } from '@/components/Loading';
import { toastManager } from '@/lib/toast';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<IOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const response = await api.getOffers();
      setOffers(response.data.data);
    } catch (error) {
      console.error('Error loading offers:', error);
      toastManager.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      await api.deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o._id !== id));
      toastManager.success('Offer deleted successfully');
    } catch (error) {
      console.error('Error deleting offer:', error);
      toastManager.error('Failed to delete offer');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Offers Management</h1>
        <Link
          href="/admin/offers/new"
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Add New Offer
        </Link>
      </div>

      {offers.length > 0 ? (
        <div className="bg-white rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Title</th>
                <th className="px-6 py-3 text-left font-semibold">Type</th>
                <th className="px-6 py-3 text-right font-semibold">Value</th>
                <th className="px-6 py-3 text-center font-semibold">Valid Till</th>
                <th className="px-6 py-3 text-center font-semibold">Status</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {offers.map((offer) => (
                <tr key={offer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{offer.title}</td>
                  <td className="px-6 py-3 text-gray-600">
                    {offer.discountType === 'percentage' ? '% Off' : '₹ Off'}
                  </td>
                  <td className="px-6 py-3 text-right">{offer.discountValue}</td>
                  <td className="px-6 py-3 text-center text-sm">
                    {new Date(offer.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        offer.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center space-x-2">
                    <Link
                      href={`/admin/offers/${offer._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
          <p>No offers yet. Click "Add New Offer" to get started.</p>
        </div>
      )}
    </div>
  );
}
