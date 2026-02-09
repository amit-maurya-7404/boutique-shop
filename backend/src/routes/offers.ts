/**
 * Offer Routes
 */

import { Router } from 'express';
import {
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from '../controllers/offerController';
import { verifyAuth } from '../middleware/auth';

const router = Router();

/**
 * Public routes
 */
router.get('/', getAllOffers);

/**
 * Protected admin routes
 */
router.post('/', verifyAuth, createOffer);
router.put('/:id', verifyAuth, updateOffer);
router.delete('/:id', verifyAuth, deleteOffer);

export default router;
