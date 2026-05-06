import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendResponse } from '../utils/response';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      req.body = result.data;
      next();
      return;
    }
    const errors = result.error.errors.map((e) => e.message);
    sendResponse(res, 422, false, 'Validation failed', errors);
  };
