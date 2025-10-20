// src/components/auth-detail/AuthRestore.tsx

"use client";

import { useEffect } from "react";
import { useAuthStore, User } from "@/app/store/useAuthStore";
import api from "@/utils/api";

export default function AuthRestore() {
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const user = await api.get<User>("/user/me");
        setUser(user);
      } catch (error) {
        logout();
      }
    };
    restoreAuth;
  }, [setUser, logout]);

  return null;
}
