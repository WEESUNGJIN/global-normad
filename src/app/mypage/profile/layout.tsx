// src/app/mypage/profile/layout.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MobileSideMenu from "./components/MobileSideMenu";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* 모바일 */}
      <div className="block md:hidden">
        {!showContent ? (
          <MobileSideMenu
            onMenuClick={(menu) => {
              if (menu === "내 정보") setShowContent(true);
              else
                router.push(
                  `/mypage/${
                    menu === "예약내역"
                      ? "bookings"
                      : menu === "내 체험 관리"
                        ? "experience"
                        : "calendar"
                  }`,
                );
            }}
          />
        ) : (
          <div className="px-4 w-full">
            <button
              onClick={() => setShowContent(false)}
              className="text-sm text-gray-500 mb-4"
            >
              ← 뒤로가기
            </button>
            {children}
          </div>
        )}
      </div>

      <div className="hidden md:block">{children}</div>
    </>
  );
}
