import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { signup, login } from '../controllers/auth.controller';

const router = Router();

const signupSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address')
    .transform((v) => v.toLowerCase()),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (v) => /[A-Z]/.test(v),
      'Password must contain at least one uppercase letter'
    )
    .refine((v) => /[0-9]/.test(v), 'Password must contain at least one number')
    .refine(
      (v) => /[^A-Za-z0-9]/.test(v),
      'Password must contain at least one special character'
    ),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address'),
  password: z.string({ required_error: 'Password is required' }),
});

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

export default router;
