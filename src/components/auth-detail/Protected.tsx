// src/components/auth-detail/Protected.tsx

"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function Protected({ children }: Props) {
  const { user, isResoring } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isResoring && !user) {
      router.replace("/auth/login");
    }
  }, [user, router, isResoring]);

  if (isResoring) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        새로고침 중...
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

// 페이지 상단에 작성해서 사용