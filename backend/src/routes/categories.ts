/**
 * Category Routes
 */

import { Router } from 'express';
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { verifyAuth } from '../middleware/auth';

const router = Router();

/**
 * Public routes
 */
router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);

/**
 * Protected admin routes
 */
router.post('/', verifyAuth, createCategory);
router.put('/:id', verifyAuth, updateCategory);
router.delete('/:id', verifyAuth, deleteCategory);

export default router;
