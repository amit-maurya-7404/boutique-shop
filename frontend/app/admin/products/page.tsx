/**
 * Admin Products Management
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { IProduct } from '@/types';
import { LoadingSpinner } from '@/components/Loading';
import { toastManager } from '@/lib/toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.getProducts({ limit: 100 });
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error loading products:', error);
      toastManager.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toastManager.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toastManager.error('Failed to delete product');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Link
          href="/admin/products/new"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Add New Product
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="bg-white rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-right font-semibold">Price</th>
                <th className="px-6 py-3 text-center font-semibold">Stock</th>
                <th className="px-6 py-3 text-center font-semibold">Status</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{product.name}</td>
                  <td className="px-6 py-3 text-gray-600">{product.category?.name}</td>
                  <td className="px-6 py-3 text-right">₹{product.price}</td>
                  <td className="px-6 py-3 text-center">{product.stock}</td>
                  <td className="px-6 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center space-x-2">
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
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
          <p>No products yet. Click "Add New Product" to get started.</p>
        </div>
      )}
    </div>
  );
}
