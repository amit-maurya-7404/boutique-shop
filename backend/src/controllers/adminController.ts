/**
 * Admin Controller - Authentication and admin operations
 */

import { Request, Response } from 'express';
import { AdminUser } from '../models/AdminUser';
import { generateToken } from '../utils/jwt';
import { validateAdminLogin, validate } from '../utils/validation';

/**
 * Admin Login
 */
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find admin by email and include password field
    const admin = await AdminUser.findOne({ email }).select('+password');
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'Admin not found',
      });
      return;
    }

    // Check password
    const isMatched = await admin.matchPassword(password);
    if (!isMatched) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'Password mismatch',
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(admin._id.toString(), admin.email);
    console.log('adminLogin - generated token:', token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

/**
 * Get current admin profile
 */
export const getAdminProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).admin?.adminId;
    const admin = await AdminUser.findById(adminId);

    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Admin profile retrieved',
      data: admin,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile',
      error: error.message,
    });
  }
};
