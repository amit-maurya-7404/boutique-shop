/**
 * JWT Utility Functions
 */

import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment. Set JWT_SECRET in backend/.env and restart the server.');
}

export const generateToken = (adminId: string, email: string): string => {
  const payload: any = { adminId, email };
  try {
    const s = JWT_SECRET || '';
    console.log('generateToken - JWT_SECRET fingerprint:', s.substring(0,6) + '...' + s.substring(Math.max(0,s.length-6)));
  } catch (e) {}
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE } as any);
  return token;
};

export const verifyToken = (token: string): IJWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as IJWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
