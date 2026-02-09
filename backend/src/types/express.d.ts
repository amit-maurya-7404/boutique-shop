/**
 * Express Request type augmentation
 * Extends Express.Request with custom admin property for authentication
 */

import { IncomingHttpHeaders } from 'http';
import { IJWTPayload } from './index';

declare global {
  namespace Express {
    interface Request {
      admin?: IJWTPayload;
    }
  }
}

export {};
