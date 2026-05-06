import { Application } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

export const applySecurityMiddleware = (app: Application): void => {
  app.use(mongoSanitize());
  app.use(hpp());
};
