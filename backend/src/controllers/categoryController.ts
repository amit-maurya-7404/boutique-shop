/**
 * Category Controller - Category management operations
 */

import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { categorySchema } from '../utils/validation';
import slugify from 'slugify';

/**
 * Get all categories
 */
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().exec();

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message,
    });
  }
};

/**
 * Create category (Admin only)
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = categorySchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validation.error.errors,
      });
      return;
    }

    // Ensure slug exists (generate from name if missing)
    const data: any = { ...validation.data };
    if (!data.slug && data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }

    const category = new Category(data);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message,
    });
  }
};

/**
 * Update category (Admin only)
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validation = categorySchema.partial().safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validation.error.errors,
      });
      return;
    }

    // If name is being updated and slug not provided, generate slug from new name
    const data: any = { ...validation.data };
    if (data.name && !data.slug) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }

    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message,
    });
  }
};

/**
 * Delete category (Admin only)
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message,
    });
  }
};
