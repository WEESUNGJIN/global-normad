// src/app/oauth/kakao-login/KakaoLoginHandler.tsx

"use client";

import React, { use, useEffect } from "react";
import type { Usable } from "react";
import { useRouter } from "next/navigation";

import api from "@/utils/api";
import { useAuthStore, User } from "@/app/store/useAuthStore";

interface KakaoLoginHandlerProps {
  searchParams: Usable<Record<string, string | string[] | undefined>>;
}

export default function KakaoLoginHandler({
  searchParams,
}: KakaoLoginHandlerProps): React.ReactElement {
  const params = use(searchParams);
  const code = params.code as string | undefined;

  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
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

        const kakaoUser = {
          ...res.user,
          provider: "KAKAO",
        } as User;

        setUser(kakaoUser); // 유저 정보 업데이트

        console.log("카카오 로그인 성공", kakaoUser);
        router.push("/");
      } catch (error) {
        console.error("카카오 로그인 실패", error);
        alert("카카오 로그인 중 오류 발생");
        router.push("/auth/login");
      }
    };

    handleKakaoLogin();
  }, [code, router, setUser]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-600 text-lg">카카오 로그인 중입니다..</p>
    </div>
  );
}
