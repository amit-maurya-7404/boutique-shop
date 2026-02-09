/**
 * Offer Controller - Promotional offers management
 */

import { Request, Response } from 'express';
import { Offer } from '../models/Offer';
import { offerSchema } from '../utils/validation';

/**
 * Get all active offers
 */
export const getAllOffers = async (req: Request, res: Response): Promise<void> => {
  try {
    const offers = await Offer.find({ isActive: true })
      .populate('applicableProducts', 'name price')
      .populate('applicableCategories', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Offers retrieved successfully',
      data: offers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offers',
      error: error.message,
    });
  }
};

/**
 * Create offer (Admin only)
 */
export const createOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = offerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validation.error.errors,
      });
      return;
    }

    const offer = new Offer(validation.data);
    await offer.save();
    await offer.populate('applicableProducts', 'name price');
    await offer.populate('applicableCategories', 'name');

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create offer',
      error: error.message,
    });
  }
};

/**
 * Update offer (Admin only)
 */
export const updateOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validation = offerSchema.partial().safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validation.error.errors,
      });
      return;
    }

    const offer = await Offer.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    })
      .populate('applicableProducts', 'name price')
      .populate('applicableCategories', 'name');

    if (!offer) {
      res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: offer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update offer',
      error: error.message,
    });
  }
};

/**
 * Delete offer (Admin only)
 */
export const deleteOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndDelete(id);

    if (!offer) {
      res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully',
      data: offer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete offer',
      error: error.message,
    });
  }
};
