/**
 * Footer Component
 */

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white mt-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="animate-slide-up">
            <h3 className="text-lg font-bold mb-4">Boutique Shop</h3>
            <p className="text-gray-400">
              Premium fashion for every occasion. Shop elegant dresses, sarees, and accessories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/shop?category=dresses" className="hover:text-white transition">
                  Dresses
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sarees" className="hover:text-white transition">
                  Sarees
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="hover:text-white transition">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/shop?category=formal" className="hover:text-white transition">
                  Formal Wear
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-white transition"
              >
                WhatsApp
              </a>
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-white transition"
              >
                Instagram
              </a>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition">
                Email Us
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Boutique Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
