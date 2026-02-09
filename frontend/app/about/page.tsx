/**
 * About Us Page
 */

import React from 'react';
import Link from 'next/link';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-6">About Our Boutique</h1>
          <p className="text-lg text-gray-700 mb-4">
            Welcome to our premium boutique fashion destination. Founded with a passion for
            elegance and quality, we bring you the finest selection of dresses, sarees,
            accessories, and formal wear.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Our curated collection features both traditional and contemporary designs,
            carefully selected to ensure the highest standards of quality and craftsmanship.
          </p>
          <p className="text-lg text-gray-700">
            Whether you're looking for something for a special occasion or everyday wear,
            our team is dedicated to helping you find the perfect piece that reflects your
            unique style.
          </p>
        </div>
        <div className="bg-gray-200 rounded-lg h-80" />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-8 mb-12 py-8 border-y">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">500+</div>
          <p className="text-gray-600">Premium Products</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">10K+</div>
          <p className="text-gray-600">Happy Customers</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">5+</div>
          <p className="text-gray-600">Years Experience</p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700">
            To provide accessible, high-quality fashion that empowers our customers to
            express their individuality and elegance. We believe in making premium fashion
            attainable for everyone.
          </p>
        </div>
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <p className="text-gray-700">
            Quality, authenticity, and customer satisfaction are at the heart of everything
            we do. We're committed to ethical practices and sustainable fashion choices.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Founder & Designer', 'Fashion Consultant', 'Customer Success Manager'].map((role) => (
            <div key={role} className="text-center">
              <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-4" />
              <h3 className="font-bold text-lg mb-2">{role}</h3>
              <p className="text-gray-600 text-sm">Bringing passion and expertise</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-12 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
        <p className="text-gray-300 mb-6">Get in touch with us for any inquiries</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <WhatsAppButton message="Hi! I'd like to know more about your boutique." variant="secondary" />
          <Link
            href="/contact"
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
