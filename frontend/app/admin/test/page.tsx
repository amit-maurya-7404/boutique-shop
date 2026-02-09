/**
 * Backend Connection Test Page
 * Visit: http://localhost:3000/admin/test
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const testResults: TestResult[] = [];
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    // Test 1: Backend Health Check
    testResults.push({ name: 'API URL Setup', status: 'pending', message: `API URL: ${API_URL}` });
    setResults([...testResults]);

    try {
      const healthResponse = await fetch(`${API_URL.replace('/api', '')}/api/health`);
      const healthData = await healthResponse.json();
      testResults[0] = {
        name: 'Backend Health Check',
        status: healthResponse.ok ? 'success' : 'error',
        message: healthResponse.ok ? 'Backend is running' : 'Backend not responding',
        details: healthData,
      };
    } catch (error: any) {
      testResults[0] = {
        name: 'Backend Health Check',
        status: 'error',
        message: `Backend is not reachable: ${error.message}`,
        details: error,
      };
    }
    setResults([...testResults]);

    // Test 2: Database Connection
    testResults.push({
      name: 'Database Connection',
      status: 'pending',
      message: 'Testing database...',
    });
    setResults([...testResults]);

    try {
      const productsResponse = await fetch(`${API_URL}/products?limit=1`);
      testResults[1] = {
        name: 'Database Connection',
        status: productsResponse.ok ? 'success' : 'error',
        message: productsResponse.ok ? 'Database is accessible' : 'Database not accessible',
        details: { status: productsResponse.status },
      };
    } catch (error: any) {
      testResults[1] = {
        name: 'Database Connection',
        status: 'error',
        message: `Database check failed: ${error.message}`,
        details: error,
      };
    }
    setResults([...testResults]);

    // Test 3: Admin Login Route
    testResults.push({
      name: 'Admin Login Endpoint',
      status: 'pending',
      message: 'Testing login route...',
    });
    setResults([...testResults]);

    try {
      const loginResponse = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@boutique.com',
          password: 'AdminPassword123',
        }),
      });
      const loginData = await loginResponse.json();
      testResults[2] = {
        name: 'Admin Login Endpoint',
        status: loginResponse.ok ? 'success' : 'error',
        message: loginResponse.ok ? 'Login successful' : `Login failed: ${loginData.message}`,
        details: {
          status: loginResponse.status,
          hasToken: !!loginData?.data?.token,
        },
      };
    } catch (error: any) {
      testResults[2] = {
        name: 'Admin Login Endpoint',
        status: 'error',
        message: `Login test failed: ${error.message}`,
        details: error,
      };
    }
    setResults([...testResults]);

    // Test 4: Protected Route (with token)
    testResults.push({
      name: 'Protected Routes',
      status: 'pending',
      message: 'Testing protected routes...',
    });
    setResults([...testResults]);

    try {
      // First login to get token
      const loginResponse = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@boutique.com',
          password: 'AdminPassword123',
        }),
      });

      if (!loginResponse.ok) {
        testResults[3] = {
          name: 'Protected Routes',
          status: 'error',
          message: 'Could not login to test protected routes',
          details: { status: loginResponse.status },
        };
      } else {
        const loginData = await loginResponse.json();
        const token = loginData?.data?.token;

        if (!token) {
          testResults[3] = {
            name: 'Protected Routes',
            status: 'error',
            message: 'No token received from login',
            details: { loginData },
          };
        } else {
          // Test creating a product
          const createResponse = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: 'Test Product',
              description: 'Test',
              price: 100,
              category: '000000000000000000000001',
              stock: 10,
            }),
          });

          testResults[3] = {
            name: 'Protected Routes (POST /products)',
            status:
              createResponse.status === 400 || createResponse.ok ? 'success' : 'error',
            message:
              createResponse.status === 400
                ? 'Route works (validation error expected for test data)'
                : createResponse.ok
                  ? 'Route works'
                  : `Route failed with status ${createResponse.status}`,
            details: {
              status: createResponse.status,
              tokenLength: token.length,
            },
          };
        }
      }
    } catch (error: any) {
      testResults[3] = {
        name: 'Protected Routes',
        status: 'error',
        message: `Protected route test failed: ${error.message}`,
        details: error,
      };
    }
    setResults([...testResults]);

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/login" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Login
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Backend Connection Test</h1>
          <p className="text-gray-600 mb-8">
            This page tests if your backend is properly configured and running.
          </p>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getStatusIcon(result.status)}</span>
                  <h3 className="text-lg font-semibold">{result.name}</h3>
                  <span className={`font-semibold ${getStatusColor(result.status)}`}>
                    {result.status === 'pending' ? 'Testing...' : result.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{result.message}</p>
                {result.details && (
                  <details className="text-xs text-gray-500">
                    <summary>Details</summary>
                    <pre className="mt-2 p-2 bg-gray-200 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-bold mb-2">🔧 Troubleshooting Guide</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Backend not running?</strong>
                <p className="ml-4">
                  Run: <code className="bg-gray-200 px-2 py-1 rounded">cd backend && npm run dev</code>
                </p>
              </li>
              <li>
                <strong>Database connection error?</strong>
                <p className="ml-4">
                  Check your MongoDB URI in backend/.env and ensure your database is accessible.
                </p>
              </li>
              <li>
                <strong>Login failed?</strong>
                <p className="ml-4">
                  Ensure you've run: <code className="bg-gray-200 px-2 py-1 rounded">npm run seed</code> in the backend directory to create the admin user.
                </p>
              </li>
              <li>
                <strong>CORS errors?</strong>
                <p className="ml-4">
                  Ensure CORS_ORIGIN in backend/.env includes http://localhost:3000
                </p>
              </li>
            </ul>
          </div>

          {!loading && (
            <button
              onClick={runTests}
              className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Run Tests Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
