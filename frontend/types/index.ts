/**
 * Frontend TypeScript types and interfaces
 */

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: ICategory;
  images: string[];
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOffer {
  _id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ISearchParams {
  [key: string]: string | string[] | undefined;
}

export interface IPaginationParams {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
