/**
 * Admin Dashboard
 */

'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/Loading';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOffers: number;
  totalReviews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOffers: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [productsRes, categoriesRes, offersRes, reviewsRes] = await Promise.all([
          api.getProducts({ limit: 1 }),
          api.getCategories(),
          api.getOffers(),
          api.getReviews({ limit: 1 }),
        ]);

        setStats({
          totalProducts: productsRes.data.data.pagination.total,
          totalCategories: categoriesRes.data.data.length,
          totalOffers: offersRes.data.data.length,
          totalReviews: reviewsRes.data.data.pagination.total,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const dashboardItems = [
    {
      title: 'Products',
      count: stats.totalProducts,
      icon: '👗',
      href: '/admin/products',
      color: 'bg-blue-50',
    },
    {
      title: 'Categories',
      count: stats.totalCategories,
      icon: '📂',
      href: '/admin/categories',
      color: 'bg-purple-50',
    },
    {
      title: 'Offers',
      count: stats.totalOffers,
      icon: '🎉',
      href: '/admin/offers',
      color: 'bg-yellow-50',
    },
    {
      title: 'Reviews',
      count: stats.totalReviews,
      icon: '⭐',
      href: '/admin/reviews',
      color: 'bg-pink-50',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your boutique admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {dashboardItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`${item.color} p-6 rounded-lg hover:shadow-lg transition cursor-pointer`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">{item.title}</h3>
              <p className="text-4xl font-bold">{item.count}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/products?action=new"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-center font-semibold"
          >
            Add Product
          </Link>
          <Link
            href="/admin/categories?action=new"
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-center font-semibold"
          >
            Add Category
          </Link>
          <Link
            href="/admin/offers?action=new"
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-center font-semibold"
          >
            Add Offer
          </Link>
          <Link
            href="/admin/reviews?action=new"
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-center font-semibold"
          >
            Add Review
          </Link>
        </div>
      </div>
    </div>
  );
}
