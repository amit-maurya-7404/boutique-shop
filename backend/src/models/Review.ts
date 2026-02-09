/**
 * Review Model - Customer reviews and testimonials
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '../types';

interface IReviewDocument extends Omit<IReview, '_id'>, Document {}

const reviewSchema = new Schema<IReviewDocument>(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      minlength: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReviewDocument>('Review', reviewSchema);
