import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi, signup as signupApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { LoginPayload, SignupPayload } from '../types';
import { clearToken } from '../utils/storage';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data) => {
      setAuth(data.data.token, data.data.user);
    },
  });
};

export const useSignup = () => {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: (payload: SignupPayload) => signupApi(payload),
    onSuccess: (data) => {
      setAuth(data.data.token, data.data.user);
    },
  });
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  return () => {
    clearToken();
    clearAuth();
    queryClient.clear();
  };
};
