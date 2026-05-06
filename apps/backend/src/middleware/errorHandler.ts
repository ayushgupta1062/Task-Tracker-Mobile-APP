import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { sendResponse } from '../utils/response';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err);

  if (err instanceof mongoose.Error.CastError) {
    sendResponse(res, 400, false, 'Invalid ID format');
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    sendResponse(res, 422, false, 'Validation failed', messages);
    return;
  }

  const mongoErr = err as MongoError;
  if (mongoErr.code === 11000 && mongoErr.keyValue) {
    const field = Object.keys(mongoErr.keyValue)[0];
    sendResponse(res, 409, false, `A record with this ${field} already exists`);
    return;
  }

  if (err instanceof TokenExpiredError) {
    sendResponse(res, 401, false, 'Token has expired');
    return;
  }

  if (err instanceof JsonWebTokenError) {
    sendResponse(res, 401, false, 'Invalid token');
    return;
  }

  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message;

  sendResponse(res, 500, false, message);
};
