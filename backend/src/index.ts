/**
 * Main Express Server Entry Point
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables as early as possible
dotenv.config();

import { connectDB } from './config/database';
import { errorHandler } from './middleware/auth';

// Routes
import adminRoutes from './routes/admin';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import offerRoutes from './routes/offers';
import reviewRoutes from './routes/reviews';


const app: Express = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware
// ============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// ============================================
// API Routes
// ============================================

app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `${req.method} ${req.path}`,
  });
});

// Error handling middleware
app.use(errorHandler);

// ============================================
// Database Connection & Server Start
// ============================================

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
