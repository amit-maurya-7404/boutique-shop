/**
 * Authentication Middleware - JWT verification
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../types';

export interface AuthenticatedRequest extends Request {
  admin?: IJWTPayload;
}

export const verifyAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const rawAuth = req.headers.authorization;
    console.log('verifyAuth - Authorization header:', rawAuth);
    // Log partial JWT_SECRET fingerprint for debugging (do not log full secret in production)
    try {
      const s = process.env.JWT_SECRET || '';
      console.log('verifyAuth - JWT_SECRET fingerprint:', s.substring(0,6) + '...' + s.substring(Math.max(0,s.length-6)));
    } catch (e) {}

    const token = rawAuth?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided',
        error: 'Unauthorized',
      });
      return;
    }
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('verifyAuth - JWT_SECRET not configured');
        res.status(500).json({ success: false, message: 'Server misconfiguration: JWT_SECRET not set' });
        return;
      }
      const decoded = jwt.verify(token, secret) as IJWTPayload;
      console.log('verifyAuth - token decoded:', decoded);
      req.admin = decoded;
      next();
      return;
    } catch (verError) {
      console.error('verifyAuth - jwt.verify error:', verError);
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: 'Unauthorized',
      });
      return;
    }
  } catch (error) {
    console.error('verifyAuth - unexpected error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: 'Unauthorized',
    });
  }
};

/**
 * Error handling middleware
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    error: error.details || message,
  });
};
