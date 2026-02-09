/**
 * Contact Us Page
 */

'use client';

import React, { useState } from 'react';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { toastManager } from '@/lib/toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // For now, just show a success message
      // In production, you would make an API call here
      toastManager.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toastManager.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-gray-600 mb-12">
        We'd love to hear from you. Get in touch with us anytime.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">WhatsApp</h4>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Click to chat
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Instagram</h4>
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Follow us
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-gray-700">contact@boutique.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
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
              <label className="block font-semibold mb-2">Phone (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Quick Contact */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Quick Response</h2>
        <p className="text-gray-700 mb-6">
          For immediate assistance, use our WhatsApp button for real-time support.
        </p>
        <WhatsAppButton message="Hi! I have a quick question about your products." />
      </section>
    </div>
  );
}
