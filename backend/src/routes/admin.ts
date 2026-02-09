/**
 * Admin Routes
 */

import { Router } from 'express';
import { adminLogin, getAdminProfile } from '../controllers/adminController';
import { verifyAuth } from '../middleware/auth';
import { validateAdminLogin, validate } from '../utils/validation';

const router = Router();

/**
 * Public routes
 */
router.post('/login', validate(validateAdminLogin), adminLogin);

/**
 * Protected routes
 */
router.get('/profile', verifyAuth, getAdminProfile);

export default router;
