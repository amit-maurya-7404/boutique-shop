/**
 * Review Controller - Customer reviews management
 */

import { Request, Response } from 'express';
import { Review } from '../models/Review';

/**
 * Get all active reviews
 */
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const reviews = await Review.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Review.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: {
        reviews,
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
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

/**
 * Create review (Admin only)
 */
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, rating, reviewText } = req.body;

    if (!customerName || !rating || !reviewText) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
      return;
    }

    const review = new Review({
      customerName,
      rating,
      reviewText,
      isActive: true,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message,
    });
  }
};

/**
 * Update review (Admin only)
 */
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { customerName, rating, reviewText, isActive } = req.body;

    const update: any = {};
    if (customerName) update.customerName = customerName;
    if (rating) {
      if (rating < 1 || rating > 5) {
        res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5',
        });
        return;
      }
      update.rating = rating;
    }
    if (reviewText) update.reviewText = reviewText;
    if (isActive !== undefined) update.isActive = isActive;

    const review = await Review.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Review not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message,
    });
  }
};

/**
 * Delete review (Admin only)
 */
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Review not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message,
    });
  }
};
