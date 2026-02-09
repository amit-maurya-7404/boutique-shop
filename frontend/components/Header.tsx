/**
 * Header / Navigation Component
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 animate-pop">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">B</span>
            </div>
            <span className="font-bold text-lg">Boutique</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-black transition link-underline">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-black transition link-underline">
              Shop
            </Link>
            <Link href="/offers" className="text-gray-700 hover:text-black transition link-underline">
              Offers
            </Link>
            <Link href="/reviews" className="text-gray-700 hover:text-black transition link-underline">
              Reviews
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-black transition link-underline">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black transition link-underline">
              Contact
            </Link>
          </nav>

          {/* Admin Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition btn-animated"
            >
              Admin
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <Link href="/" className="block py-2 text-gray-700">
              Home
            </Link>
            <Link href="/shop" className="block py-2 text-gray-700">
              Shop
            </Link>
            <Link href="/offers" className="block py-2 text-gray-700">
              Offers
            </Link>
            <Link href="/reviews" className="block py-2 text-gray-700">
              Reviews
            </Link>
            <Link href="/about" className="block py-2 text-gray-700">
              About
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700">
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
