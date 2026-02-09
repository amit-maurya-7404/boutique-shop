/**
 * Database Seeding Script - Populate with dummy data
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AdminUser } from '../models/AdminUser';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Review } from '../models/Review';
import { Offer } from '../models/Offer';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-shop';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      AdminUser.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
      Offer.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create Admin
    const admin = await AdminUser.create({
      email: process.env.ADMIN_EMAIL || 'admin@boutique.com',
      password: process.env.ADMIN_PASSWORD || 'AdminPassword123',
      name: 'Admin User',
    });
    console.log('👤 Admin created');

    // Skip categories seeding - will be added through admin panel
    console.log('📂 Categories skipped (add through admin panel)');

    // Skip products seeding - will be added through admin panel
    console.log('👗 Products skipped (add through admin panel)');

    // Skip reviews and offers seeding
    console.log('⭐ Reviews skipped');
    console.log('🎉 Offers skipped');

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📌 Login Credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'AdminPassword123'}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
