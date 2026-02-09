/**
 * Admin Login Page
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toastManager } from '@/lib/toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'admin@boutique.com',
    password: 'AdminPassword123',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.adminLogin(formData.email, formData.password);
      // Ensure token saved under consistent key
      try {
        localStorage.setItem('adminToken', response.data.data.token);
      } catch (e) {}
      toastManager.success('Login successful!');
      router.push('/admin/dashboard');
    } catch (error: any) {
      toastManager.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
        <p className="text-gray-600 mb-6">Sign in to manage your boutique</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Email: admin@boutique.com</p>
          <p>Password: AdminPassword123</p>
        </div>
      </div>
    </div>
  );
}
