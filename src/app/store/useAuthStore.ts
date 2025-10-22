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
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, isAuthenticated: false });
  },
}));
