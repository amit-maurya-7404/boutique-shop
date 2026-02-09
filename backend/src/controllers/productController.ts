/**
 * Product Controller - Product management operations
 */

import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { productSchema } from '../utils/validation';

/**
 * Get all products with filters and sorting
 */
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      isFeatured,
      isNewArrival,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
      search,
    } = req.query;

    const filter: any = { isActive: true };

    // Handle category filtering by slug
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        // If category not found, return empty results
        res.status(200).json({
          success: true,
          message: 'Products retrieved successfully',
          data: {
            products: [],
            pagination: {
              total: 0,
              page: 1,
              limit: Number(limit),
              pages: 0,
            },
          },
        });
        return;
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (isFeatured === 'true') filter.isFeatured = true;
    if (isNewArrival === 'true') filter.isNewArrival = true;

    if (search) {
      filter.$text = { $search: String(search) };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const sortObj: any = {};
    sortObj[String(sortBy)] = order === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .exec();

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

/**
 * Get single product by ID
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category', 'name slug');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

/**
 * Create new product (Admin only)
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validation.error.errors,
      });
      return;
    }

    const product = new Product(validation.data);
    await product.save();
    await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

/**
 * Update product (Admin only)
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validation = productSchema.partial().safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validation.error.errors,
      });
      return;
    }

    const product = await Product.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

/**
 * Delete product (Admin only)
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 6 } = req.query;
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: 'Featured products retrieved',
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message,
    });
  }
};

/**
 * Get new arrivals
 */
export const getNewArrivals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 6 } = req.query;
    const products = await Product.find({ isNewArrival: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: 'New arrivals retrieved',
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch new arrivals',
      error: error.message,
    });
  }
};
