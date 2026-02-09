/**
 * Category Model - Product categories
 */

import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';
import { ICategory } from '../types';

interface ICategoryDocument extends Omit<ICategory, '_id'>, Document {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Auto-generate slug from name before validation
 */
categorySchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});

export const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);
