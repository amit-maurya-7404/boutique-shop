/**
 * Offer Model - Discounts and promotional offers
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IOffer } from '../types';

interface IOfferDocument extends Omit<IOffer, '_id'>, Document {}

const offerSchema = new Schema<IOfferDocument>(
  {
    title: {
      type: String,
      required: [true, 'Offer title is required'],
    },
    description: {
      type: String,
      required: [true, 'Offer description is required'],
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      required: [true, 'Discount type is required'],
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: 0,
    },
    applicableProducts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
      default: [],
    },
    applicableCategories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Category',
      default: [],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Offer = mongoose.model<IOfferDocument>('Offer', offerSchema);
