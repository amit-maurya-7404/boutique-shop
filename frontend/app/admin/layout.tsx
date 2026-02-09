/**
 * Admin Layout
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    // Allow the test page to be accessible without authentication
    const isTestPage = pathname === '/admin/test';

    if (!token && pathname !== '/admin/login' && !isTestPage) {
      router.push('/admin/login');
    } else if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [pathname, router]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  // Allow login and test pages to render without the authenticated sidebar
  if (pathname === '/admin/login' || pathname === '/admin/test') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    try { localStorage.removeItem('adminToken'); } catch (e) {}
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6 flex flex-col">
        <Link href="/admin/dashboard" className="text-2xl font-bold mb-8">
          Admin Panel
        </Link>
        <nav className="flex-1 space-y-4">
          <Link
            href="/admin/dashboard"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === '/admin/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname.includes('products') ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            Products
          </Link>
          <Link
            href="/admin/categories"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname.includes('categories') ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            Categories
          </Link>
          <Link
            href="/admin/offers"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname.includes('offers') ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            Offers
          </Link>
          <Link
            href="/admin/reviews"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname.includes('reviews') ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            Reviews
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
