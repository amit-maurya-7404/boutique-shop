/**
 * Home Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { IProduct, IReview, IOffer } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { LoadingSkeleton } from '@/components/Loading';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { formatPrice } from '@/lib/utils';

export default function HomePage() {
  const [featured, setFeatured] = useState<IProduct[]>([]);
  const [newArrivals, setNewArrivals] = useState<IProduct[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [offers, setOffers] = useState<IOffer[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredRes, newRes, reviewsRes, offersRes, categoriesRes] = await Promise.all([
          api.getFeaturedProducts(6),
          api.getNewArrivals(6),
          api.getReviews({ limit: 5 }),
          api.getOffers(),
          api.getCategories(),
        ]);
        setFeatured(featuredRes.data.data);
        setNewArrivals(newRes.data.data);
        setReviews(reviewsRes.data.data?.reviews || []);
        setOffers(offersRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <Image
            src="https://images.unsplash.com/photo-1570857502809-08184874388e?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZXxlbnwwfHx8fDE3NzA1OTI4MzF8MA&ixlib=rb-4.1.0&w=800&h=600&fit=max&q=80"
            alt="Hero Banner"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Premium Boutique Fashion</h1>
          <p className="text-lg md:text-xl mb-6 text-gray-200">
            Discover elegant dresses, sarees, and accessories for every occasion
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/shop?category=${cat.slug}`}
                className="group"
              >
                <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center group-hover:bg-gray-200 transition overflow-hidden">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <p className="text-4xl">👗</p>
                    </div>
                  )}
                </div>
                <p className="text-center mt-2 font-semibold text-gray-800">{cat.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No categories available. Add categories from the admin panel.</p>
          </div>
        )}
      </section>

      {/* Active Offers */}
      {offers.length > 0 && (
        <section className="bg-yellow-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Active Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {offers.slice(0, 3).map((offer) => (
                <div key={offer._id} className="bg-white p-6 rounded-lg border border-yellow-200">
                  <h3 className="font-bold text-lg mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                  <div className="text-3xl font-bold text-red-500 mb-4">
                    {offer.discountValue}
                    {offer.discountType === 'percentage' ? '%' : ' ₹'} off
                  </div>
                  <Link
                    href="/offers"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/shop?featured=true" className="text-blue-600 hover:underline">
            View All →
          </Link>
        </div>
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link href="/shop?new=true" className="text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          {loading ? (
            <LoadingSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Slider */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.reviewText}"</p>
                <p className="font-semibold text-gray-900">— {review.customerName}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Question?</h2>
          <p className="text-lg text-gray-300 mb-6">
            Connect with us on WhatsApp for personalized assistance
          </p>
          <WhatsAppButton message="Hi! I would like to enquire about your products." />
        </div>
      </section>
    </>
  );
}
