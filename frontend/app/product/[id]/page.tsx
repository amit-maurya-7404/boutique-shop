/**
 * Product Details Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { IProduct } from '@/types';
import { LoadingSpinner } from '@/components/Loading';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.getProductById(productId);
        setProduct(response.data.data);
        setSelectedColor(response.data.data.colors?.[0] || '');
        setSelectedSize(response.data.data.sizes?.[0] || '');

        // Load related products
        const relatedRes = await api.getProducts({
          category: response.data.data.category._id,
          limit: 4,
        });
        setRelatedProducts(
          relatedRes.data.data.products.filter((p: IProduct) => p._id !== productId).slice(0, 3)
        );
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-12 text-red-500">Product not found</div>;

  const discount = product.discountedPrice
    ? calculateDiscount(product.price, product.discountedPrice)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4 animate-pop">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded">
                {discount}% OFF
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === idx ? 'border-black' : 'border-gray-300'
                }`}
              >
                <Image
                  src={img}
                  alt={`View ${idx + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="animate-slide-up">
          <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          {/* Rating & Stock */}
          <div className="flex items-center gap-4 mb-4">
            <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">
                {formatPrice(product.discountedPrice || product.price)}
              </span>
              {product.discountedPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block font-semibold mb-3">Color</label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block font-semibold mb-3">Size</label>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="space-y-3 mb-6">
            <WhatsAppButton
              message={`Hi! I'm interested in ${product.name}. ${
                selectedColor ? `Color: ${selectedColor}. ` : ''
              }${selectedSize ? `Size: ${selectedSize}. ` : ''}Could you provide more details?\n\nProduct Link: ${typeof window !== 'undefined' ? window.location.href : ''}`}
            />
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 px-3 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
