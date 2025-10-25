// src/app/auth/signup/hooks/useSignup.ts

import axios from "axios";
import api from "@/utils/api";

import { useAuthStore } from "@/app/store/useAuthStore";

interface SignupReqeust {
  email: string;
  nickname: string;
  password: string;
}

export function useSignup() {
  const { setUser } = useAuthStore(); // zustand 전역 상태 접근

  const signup = async (data: SignupReqeust) => {
    const res = await api.post<{ message: string }, SignupReqeust>(
      "/users",
      data,
    );
    return res;
  };

  const handleSignup = async (
    email: string,
    nickname: string,
    password: string,
    onError: (msg: string) => void,
    onSuccess: (msg: string) => void,
  ) => {
    try {
      await signup({ email, nickname, password });

      const loginReq = await api.post<{
        accessToken: string;
        refreshToken: string;
        user: { id: number; email: string; nickname: string };
      }>("auth/login", { email, password });

      localStorage.setItem("accessToken", loginReq.accessToken);
      localStorage.setItem("refreshToken", loginReq.refreshToken);

      setUser(loginReq.user); //로그인시 전역 상태 업데이트

      onSuccess("회원가입이 완료되었습니다!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message as string | undefined;

        if (status === 409) {
          onError(message ?? "이미 사용 중인 이메일입니다.");
          return;
        }

        onError(message ?? "회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return { handleSignup };
}
