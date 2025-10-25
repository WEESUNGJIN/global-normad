// src/app/auth/login/hooks/useLogin.ts

import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/utils/api";
import { useAuthStore } from "@/app/store/useAuthStore";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleLogin = async (
    email: string,
    password: string,
    onError: (msg: string) => void,
  ) => {
    try {
      const res = await api.post<{
        user: { id: number; email: string; nickname: string };
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", { email, password });

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      setUser(res.user);

      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message ||
          "이메일 또는 비밀번호가 올바르지 않습니다.";
        onError(msg);
      } else {
        alert("알수 없는 오류가 발생했습니다");
      }
    }
  };
  return { handleLogin };
}
