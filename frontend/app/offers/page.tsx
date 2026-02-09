/**
 * Offers Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IOffer } from '@/types';
import { LoadingSpinner } from '@/components/Loading';

export default function OffersPage() {
  const [offers, setOffers] = useState<IOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const response = await api.getOffers();
        setOffers(response.data.data);
      } catch (error) {
        console.error('Error loading offers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-12">Active Offers & Discounts</h1>

      {offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer._id} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-lg border-2 border-yellow-300">
              <div className="text-5xl font-bold text-orange-600 mb-4">
                {offer.discountValue}
                {offer.discountType === 'percentage' ? '%' : ' ₹'}
              </div>
              <h3 className="text-2xl font-bold mb-3">{offer.title}</h3>
              <p className="text-gray-700 mb-4">{offer.description}</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  Valid from{' '}
                  <span className="font-semibold">
                    {new Date(offer.startDate).toLocaleDateString()}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold">
                    {new Date(offer.endDate).toLocaleDateString()}
                  </span>
                </p>
                {offer.discountType === 'percentage' && (
                  <p className="text-orange-600 font-semibold">Save up to {offer.discountValue}%</p>
                )}
                {offer.discountType === 'flat' && (
                  <p className="text-orange-600 font-semibold">Save ₹{offer.discountValue}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No active offers at the moment</p>
        </div>
      )}
    </div>
  );
}
