/**
 * Product Card Component
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/types';
import { formatPrice, calculateDiscount, generateWhatsAppLink } from '@/lib/utils';
import { WhatsAppButton } from './WhatsAppButton';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getProductUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/product/${product._id}`;
    }
    return `/product/${product._id}`;
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group animate-slide-up">
      <Link href={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />

          {/* Badge */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.isFeatured && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                Featured
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                New
              </span>
            )}
            {product.discountedPrice && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                {calculateDiscount(product.price, product.discountedPrice)}% Off
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg">
              {formatPrice(product.discountedPrice || product.price)}
            </span>
            {product.discountedPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <p className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </Link>

      {/* WhatsApp Button */}
      <div className="p-4 border-t" onClick={handleWhatsAppClick}>
        <WhatsAppButton
          message={`Hi! I'm interested in this product: ${product.name}. Please provide more details.\n\nProduct Link: ${getProductUrl()}`}
          variant="outline"
          className="w-full justify-center"
        />
      </div>
    </div>
  );
};
