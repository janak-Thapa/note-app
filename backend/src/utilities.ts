import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/config';

export interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, config.jwtSecret as string, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = { userId: user.userId };
    next();
  });
};

export default authenticateToken;
