// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  provider?: "KAKAO"; //확장성 높음 LOCAL | KAKAO | GOOGLE | APPLE
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isResoring: boolean;
  setUser: (user: User) => void;
  setRestoring: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isResoring: true,
      setUser: (user) =>
        set((state) => ({
          user: { ...state.user, ...user },
          isAuthenticated: true,
          isResoring: false,
        })),
      setRestoring: (value) => set({ isResoring: value }),
      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("auth-storage");
        set({ user: null, isAuthenticated: false, isResoring: false });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // 복원 시작
        state?.setRestoring(true);

        return (hydratedState: AuthState | undefined, error?: unknown) => {
          // 복원 완료
          state?.setRestoring(false);
          if (error) console.error("hydration error", error);
        };
      },
    },
  ),
);
