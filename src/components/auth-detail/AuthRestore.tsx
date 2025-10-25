// src/components/auth-detail/AuthRestore.tsx

"use client";

import { useEffect } from "react";
import { useAuthStore, User } from "@/app/store/useAuthStore";
import api from "@/utils/api";

export default function AuthRestore() {
  const { setUser, logout, setRestoring } = useAuthStore();

  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setRestoring(false);
        return;
      }

      try {
        const user = await api.get<User>("/users/me");
        setUser(user);
      } catch {
        logout();
      } finally {
        setRestoring(false);
      }
    };
    restoreAuth();
  }, [setUser, logout, setRestoring]);

  return null;
}
