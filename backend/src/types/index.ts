/**
 * Shared TypeScript types for the boutique shop API
 */

export interface IAdminUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string; // Category ObjectId
  images: string[];
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOffer {
  _id?: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  applicableProducts?: string[]; // Product ObjectIds
  applicableCategories?: string[]; // Category ObjectIds
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  _id?: string;
  customerName: string;
  rating: number; // 1-5
  reviewText: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactMessage {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IJWTPayload {
  adminId: string;
  email: string;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
