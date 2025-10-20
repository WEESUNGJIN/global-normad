// src/app/oauth/kakko/page.tsx

"use client";

import { useEffect } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import api from "@/utils/api";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function KakaoRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const fetchKakaoSignup = async () => {
      try {
        const res = await api.post<{
          user: {
            id: number;
            email: string;
            nickname: string;
            profileImageUrl?: string;
          };
          accessToken: string;
          refreshToken: string;
        }>("/auth/kakao", {
          token: code, // 카카오에서 받음
          redirectUrl: "http://localhost:3000/oauth/kakao",
          nickname: "유저",
        });
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        setUser(res.user);

        router.push("/");
      } catch (error) {
        console.error("카카오 회원가입 실패", error);
        alert("카카오 로그인 중 오류가 발생했습니다");
        router.push("/auth/signup");
      }
    };

    fetchKakaoSignup();
  }, [router, searchParams, setUser]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-600 text-lg">카카오 로그인 중입니다..</p>
    </div>
  );
}
