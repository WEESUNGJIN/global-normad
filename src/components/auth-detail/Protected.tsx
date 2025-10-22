// src/components/auth-detail/Protected.tsx

"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function Protected({ children }: Props) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          로그인이 필요합니다!
        </h2>
        <p className="text-gray-500 mb-8">로그인 후 이용해주세요!</p>
        <button
          onClick={() => router.push("/auth/login")}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          로그인 하러가기
        </button>
      </div>
    );
  }
  return <>{children}</>;
}

// 페이지 상단에 작성해서 사용
