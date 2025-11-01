// src/components/auth-detail/Protected.tsx

"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function Protected({ children }: Props) {
  const { user, isResoring } = useAuthStore();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isResoring && !user) {
      setShowModal(true);
      const timer = setTimeout(() => {
        router.replace("/auth/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, router, isResoring]);

  if (isResoring) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        새로고침 중...
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm text-center">
              <p className="text-gray-800 font-semibold mb-3">
                로그인이 필요합니다
              </p>
              <p className="text-sm text-gray-500">
                로그인 페이지로 이동합니다 ...
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}

// 페이지 상단에 작성해서 사용
