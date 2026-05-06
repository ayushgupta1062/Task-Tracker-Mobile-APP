import { create } from 'zustand';
import { User } from '../types';
import { getToken, setToken, clearToken } from '../utils/storage';

interface AuthState {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  getToken().then((token) => {
    if (token) {
      set({ token, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  });

  return {
    token: null,
    user: null,
    isHydrated: false,
    setAuth: (token: string, user: User) => {
      setToken(token);
      set({ token, user });
    },
    clearAuth: () => {
      clearToken();
      set({ token: null, user: null });
    },
    setHydrated: () => set({ isHydrated: true }),
  };
});
