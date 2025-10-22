// src/app/oauth/kakao-login/page.tsx

"use client";

import { Suspense } from "react";
import KakaoLoginHandler from "./KakaoLoginHandler";
import LoadingSpinner from "@/components/auth-detail/LoadingSpinner";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function KakaoLoginPage({ searchParams }: any) {
  return (
    <Suspense fallback={<LoadingSpinner message="카카오 로그인 중입니다..." />}>
      <KakaoLoginHandler searchParams={searchParams} />
    </Suspense>
  );
}
