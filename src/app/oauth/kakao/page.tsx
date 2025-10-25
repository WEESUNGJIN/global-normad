// src/app/oauth/kakao/page.tsx

"use client";

import { Suspense } from "react";
import KakaoSignupHandler from "./KakaoSignupHandler";
import LoadingSpinner from "@/components/auth-detail/LoadingSpinner";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function KakaoSignupPage({ searchParams }: any) {
  return (
    <Suspense
      fallback={<LoadingSpinner message="카카오 회원가입 중입니다..." />}
    >
      <KakaoSignupHandler searchParams={searchParams} />
    </Suspense>
  );
}
