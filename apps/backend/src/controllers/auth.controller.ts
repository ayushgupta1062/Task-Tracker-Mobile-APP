import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { sendResponse } from '../utils/response';
import { AuthRequest, SignupBody, LoginBody } from '../types';

export const signup = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body as SignupBody;

    const existing = await User.findOne({ email }).select('email');
    if (existing) {
      sendResponse(res, 409, false, 'An account with this email already exists');
      return;
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = signToken({ id: user.id as string, email: user.email });

    sendResponse(res, 201, true, 'Account created successfully', {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.get('createdAt'),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginBody;

    const user = await User.findOne({ email }).select('+password');
    const genericMessage = 'Invalid email or password';

    if (!user) {
      sendResponse(res, 401, false, genericMessage);
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      sendResponse(res, 401, false, genericMessage);
      return;
    }

    const token = signToken({ id: user.id as string, email: user.email });

    sendResponse(res, 200, true, 'Login successful', {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.get('createdAt'),
      },
    });
  } catch (err) {
    next(err);
  }
};
