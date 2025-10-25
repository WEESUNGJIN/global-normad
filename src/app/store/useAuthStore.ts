// src/store/useAuthStore.ts
import { create } from "zustand";

export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isResoring: boolean;
  setUser: (user: User) => void;
  setRestoring: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isResoring: true,
  setUser: (user) => set({ user, isAuthenticated: true, isResoring: false }),
  setRestoring: (value) => set({ isResoring: value }),
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, isAuthenticated: false, isResoring: false });
  },
}));
