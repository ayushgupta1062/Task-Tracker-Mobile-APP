import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface SignupBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateTaskBody {
  title: string;
  description?: string;
}

export interface UpdateTaskBody {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}
