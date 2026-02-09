/**
 * Category Products Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { IProduct, ICategory } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { LoadingSkeleton, LoadingSpinner } from '@/components/Loading';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [category, setCategory] = useState<ICategory | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryAndProducts = async () => {
      try {
        const [catRes, prodsRes] = await Promise.all([
          api.getCategoryBySlug(slug),
          api.getProducts({ category: slug, limit: 100 }),
        ]);
        setCategory(catRes.data.data);
        setProducts(prodsRes.data.data.products);
      } catch (error) {
        console.error('Error loading category:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategoryAndProducts();
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {category && (
        <>
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-lg text-gray-600">{category.description}</p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No products found in this category</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
