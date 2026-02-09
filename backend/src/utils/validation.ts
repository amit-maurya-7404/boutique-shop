/**
 * Validation utility functions using express-validator and zod
 */

import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Express validator middleware wrapper
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run each validation chain
    for (let validation of validations) {
      await validation.run(req);
    }

    // Collect results from the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array().map((err: any) => ({
          field: err.param || err.path || 'unknown',
          message: err.msg,
        })),
      });
    }

    next();
  };
};

/**
 * Admin login validation
 */
export const validateAdminLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
];

/**
 * Product validation using Zod
 */
export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  discountedPrice: z.number().positive('Discounted price must be positive').optional(),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string().min(1, 'Image URL cannot be empty')).min(1, 'At least one image is required'),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional().default(false),
  isNewArrival: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  stock: z.number().nonnegative('Stock cannot be negative'),
});

/**
 * Category validation using Zod
 */
export const categorySchema = z.object({
  name: z.string().min(3, 'Category name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.string().url().optional(),
});

/**
 * Offer validation using Zod
 */
export const offerSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.number().positive('Discount value must be positive'),
  applicableProducts: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean().optional(),
});

/**
 * Contact form validation using Zod
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
