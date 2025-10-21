// src/app/oauth/kakao-login/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/utils/api";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function KakaoLoginRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const handleKakaoLogin = async () => {
      try {
        const redirectUri =
          process.env.NODE_ENV === "production"
            ? "https://inmyday.vercel.app/oauth/kakao-login"
            : "http://localhost:3000/oauth/kakao-login";

        const res = await api.post<{
          user: {
            id: number;
            email: string;
            nickname: string;
            profileImageUrl?: string;
          };
          accessToken: string;
          refreshToken: string;
        }>("/oauth/sign-in/kakao", {
          token: code,
          redirectUri,
        });

        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        setUser(res.user);

        console.log("카카오 로그인 성공", res.user);
        router.push("/");
      } catch (error: any) {
        console.error("카카오 로그인 실패", error.response?.data || error);
        alert("카카오 로그인 중 오류 발생");
        router.push("/auth/login");
      }
    };

    handleKakaoLogin();
  }, [router, searchParams, setUser]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-600 text-lg">카카오 로그인 중입니다..</p>
    </div>
  );
}
