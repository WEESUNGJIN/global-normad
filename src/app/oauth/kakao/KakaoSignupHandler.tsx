// src/app/oauth/kakao/KakaoSignupHandler.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function KakaoSignupHandler({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const code = searchParams.code as string | undefined;
    if (!code) return;

    const handleKakaoSignup = async () => {
      try {
        const redirectUri =
          process.env.NODE_ENV === "production"
            ? "https://inmyday.vercel.app/oauth/kakao"
            : "http://localhost:3000/oauth/kakao";

        // console.log("redirectUri:", redirectUri); //디버깅용

        const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
            redirect_uri: redirectUri,
            code,
          }),
        });

        const tokenData = await tokenRes.json();
        const kakaoAccessToken = tokenData.access_token;

        const profileRes = await fetch("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
            "Content-Type": "application/x-www-from-urlencoded;charset=utf-8",
          },
        });
        const profileData = await profileRes.json();
        const nickname = profileData.kakao_account?.profile?.nickname || "유저";

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
          nickname,
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

    handleKakaoSignup();
  }, [router, searchParams, setUser]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-600 text-lg">카카오 로그인 중입니다..</p>
    </div>
  );
}
