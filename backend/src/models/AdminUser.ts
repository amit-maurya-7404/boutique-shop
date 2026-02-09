/**
 * AdminUser Model - Represents admin users who can manage the boutique
 */

import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';
import { IAdminUser } from '../types';

interface IAdminUserDocument extends Omit<IAdminUser, '_id'>, Document {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const adminUserSchema = new Schema<IAdminUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
  },
  { timestamps: true }
);

/**
 * Hash password before saving
 */
adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Method to compare passwords
 */
adminUserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export const AdminUser = mongoose.model<IAdminUserDocument>('AdminUser', adminUserSchema);
