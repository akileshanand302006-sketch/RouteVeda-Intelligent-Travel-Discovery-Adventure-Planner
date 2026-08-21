import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { checkDatabaseConnection } from './config/database';

import authRoutes from './routes/auth.routes';
import destinationRoutes from './routes/destination.routes';
import stateRoutes from './routes/state.routes';
import activityRoutes from './routes/activity.routes';
import tripRoutes from './routes/trip.routes';
import wishlistRoutes from './routes/wishlist.routes';
import dashboardRoutes from './routes/dashboard.routes';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', async (req: Request, res: Response) => {
    const dbStatus = await checkDatabaseConnection();
    res.json({
      status: 'ok',
      service: 'TripForge REST API',
      timestamp: new Date().toISOString(),
      database: dbStatus
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/destinations', destinationRoutes);
  app.use('/api/states', stateRoutes);
  app.use('/api', activityRoutes);
  app.use('/api/trips', tripRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // 404 Catch-All
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
      code: 'ROUTE_NOT_FOUND'
    });
  });

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Express Error:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error.',
      code: err.code || 'INTERNAL_ERROR'
    });
  });

  return app;
}
