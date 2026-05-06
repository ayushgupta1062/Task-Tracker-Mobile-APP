import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendResponse } from '../utils/response';
import { AuthRequest } from '../types';

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendResponse(res, 401, false, 'Authentication token is required');
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    sendResponse(res, 401, false, 'Invalid or expired token');
  }
};
