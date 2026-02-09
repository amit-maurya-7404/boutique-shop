/**
 * Review Routes
 */

import { Router } from 'express';
import {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/contactController';
import { verifyAuth } from '../middleware/auth';

const router = Router();

/**
 * Public routes
 */
router.get('/', getAllReviews);

/**
 * Protected admin routes
 */
router.post('/', verifyAuth, createReview);
router.put('/:id', verifyAuth, updateReview);
router.delete('/:id', verifyAuth, deleteReview);

export default router;
