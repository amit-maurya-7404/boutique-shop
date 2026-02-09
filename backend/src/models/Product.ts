/**
 * Product Model - Boutique products
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../types';

interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    discountedPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    } as any,
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one image URL is required',
      },
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

/**
 * Index for search optimization
 */
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });

export const Product = mongoose.model<IProductDocument>('Product', productSchema);
