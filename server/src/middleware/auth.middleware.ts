import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tripforge_super_secure_jwt_secret_key_2026';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  // Check Authorization header or x-user-id header
  const authHeader = req.headers.authorization;
  const directUserId = req.headers['x-user-id'] as string;

  if (directUserId) {
    req.userId = directUserId;
    return next();
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role?: string };
      req.userId = decoded.id;
      req.userRole = decoded.role || 'user';
      return next();
    } catch (err) {
      // If token invalid, proceed with 401
      res.status(401).json({ success: false, message: 'Invalid or expired token.', code: 'UNAUTHORIZED' });
      return;
    }
  }

  // Default to demo user 1 if not specified (for public exploration)
  req.userId = '1';
  next();
}
