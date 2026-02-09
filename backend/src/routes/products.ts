/**
 * Product Routes
 */

import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
} from '../controllers/productController';
import { verifyAuth } from '../middleware/auth';

const router = Router();

/**
 * Public routes
 */
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id', getProductById);

/**
 * Protected admin routes
 */
router.post('/', verifyAuth, createProduct);
router.put('/:id', verifyAuth, updateProduct);
router.delete('/:id', verifyAuth, deleteProduct);

export default router;
