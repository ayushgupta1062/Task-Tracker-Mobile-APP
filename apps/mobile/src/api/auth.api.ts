import client from './client';
import { ApiResponse, LoginPayload, SignupPayload, User } from '../types';

interface AuthData {
  token: string;
  user: User;
}

export const login = async (
  payload: LoginPayload
): Promise<ApiResponse<AuthData>> => {
  const response = await client.post<ApiResponse<AuthData>>('/auth/login', payload);
  return response.data;
};

export const signup = async (
  payload: SignupPayload
): Promise<ApiResponse<AuthData>> => {
  const response = await client.post<ApiResponse<AuthData>>('/auth/signup', payload);
  return response.data;
};
