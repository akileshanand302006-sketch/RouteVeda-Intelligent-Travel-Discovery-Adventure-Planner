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
import contentRoutes from './routes/content.routes';

export function createApp(): Express {
  const app = express();

  // Production-grade CORS Configuration
  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean) as string[];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // In non-production, allow all
      if (process.env.NODE_ENV !== 'production') return callback(null, true);

      // Check allowed list or any Netlify deploy preview
      const isAllowed = allowedOrigins.includes(origin) ||
                        origin.endsWith('.netlify.app') ||
                        origin.includes('localhost');

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin ${origin} not allowed by RouteVeda policy.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint with PostGIS & DB verification
  app.get('/api/health', async (req: Request, res: Response) => {
    const dbStatus = await checkDatabaseConnection();
    res.json({
      status: 'ok',
      service: 'RouteVeda REST API',
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
  app.use('/api', contentRoutes);

  // 404 Catch-All
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
      code: 'ROUTE_NOT_FOUND'
    });
  });

  // Global Error Handler (sanitized for production)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const isProd = process.env.NODE_ENV === 'production';
    if (!isProd) {
      console.error('Unhandled Express Error:', err);
    } else {
      console.error('Express Error:', err.message);
    }

    res.status(err.status || 500).json({
      success: false,
      message: isProd && err.status === 500
        ? 'Internal server error. Please try again later.'
        : (err.message || 'Internal server error.'),
      code: err.code || 'INTERNAL_ERROR'
    });
  });

  return app;
}
