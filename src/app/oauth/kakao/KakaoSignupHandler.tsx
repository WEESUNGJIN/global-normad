// src/app/oauth/kakao-login/KakaoSignupHandler.tsx

"use client";

import React, { use, useEffect } from "react";
import type { Usable } from "react";
import { useRouter } from "next/navigation";

import api from "@/utils/api";
import { useAuthStore, User } from "@/app/store/useAuthStore";

interface KakaoSignupHandlerProps {
  searchParams: Usable<Record<string, string | string[] | undefined>>;
}

export default function KakaoSignupHandler({
  searchParams,
}: KakaoSignupHandlerProps): React.ReactElement {
  const params = use(searchParams);
  const code = params.code as string | undefined;

  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (!code) {
      console.warn("code 없음 searchParams:", params);
      return;
    }

    const handleKakaoSignup = async () => {
      try {
        const redirectUri =
          process.env.NODE_ENV === "production"
            ? "https://inmyday.vercel.app/oauth/kakao"
            : "http://localhost:3000/oauth/kakao";

        // console.log("🚀 [KAKAO SIGNUP] 요청 전 파라미터 확인");
        // console.log("code(token):", code);
        // console.log("redirectUri:", redirectUri);

        const res = await api.post<{
          user: {
            id: number;
            email: string;
            nickname: string;
            profileImageUrl?: string;
          };
          accessToken: string;
          refreshToken: string;
        }>("/oauth/sign-up/kakao", {
          token: code,
          redirectUri,
          nickname: "유저",
        });

        const kakaoUser = {
          ...res.user,
          provider: "KAKAO",
        } as User;

        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);

        setUser(kakaoUser); // 유저 정보 업데이트

        console.log("카카오 로그인 성공", kakaoUser);
        router.push("/");
      } catch (error) {
        console.error("카카오 로그인 실패", error);
        alert("카카오 로그인 중 오류 발생");
        router.push("/auth/login");
      }
    };

    handleKakaoSignup();
  }, [code, router, setUser]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-600 text-lg">카카오 로그인 중입니다..</p>
    </div>
  );
}
