import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// We extend the Express Request type to include the user info
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Get the token from the header (Format: "Bearer <token>")
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    // 2. Verify the token
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret) as { userId: string; username: string };

    // 3. Attach decoded info to the request for the next function to use
    req.user = decoded;

    // 4. Move to the next step (the controller)
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};