/**
 * ContactMessage Model - Contact form submissions
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IContactMessage } from '../types';

interface IContactMessageDocument extends Omit<IContactMessage, '_id'>, Document {}

const contactMessageSchema = new Schema<IContactMessageDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: 10,
    },
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model<IContactMessageDocument>(
  'ContactMessage',
  contactMessageSchema
);
