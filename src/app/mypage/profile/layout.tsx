// src/app/mypage/profile/layout.tsx

"use client";

import React, { useState } from "react";
import SideMenu from "@/components/SideMenu";
import GNB from "@/components/GNB";
import Footer from "@/components/Footer";
import MobileSideMenu from "./components/MobileSideMenu";

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div>
      <GNB isLoggedIn unread={3} />

      <main className="min-h-screen bg-bg-default text-text-primary">
        <div className="mx-auto max-w-[1200px] p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-[178px_minmax(0,1fr)] lg:grid-cols-[290px_minmax(0,1fr)] gap-6 lg:gap-10">
            {/* LEFT */}
            <aside className="hidden md:block space-y-6">
              <SideMenu />
            </aside>

            {/* RIGHT (PC/Tablet)*/}
            <div className="space-y-8 hidden md:block">
              <header className="flex flex-wrap items-center justify-between lg:w-[640px] gap-3">
                <div>
                  <h1 className="typo-18-b">내 정보</h1>
                  <p className="mt-2 typo-14-m text-gray-500">
                    닉네임과 비밀번호를 수정하실 수 있습니다.
                  </p>
                </div>
              </header>
              {children}
            </div>

            {/* Mobile */}
            <div className="block md:hidden">
              {!showContent ? (
                <MobileSideMenu
                  showContent={showContent}
                  onMenuClick={(menu) => {
                    if (menu === "내 정보") setShowContent(true);
                  }}
                />
              ) : (
                <div>
                  <button
                    onClick={() => setShowContent(false)}
                    className="text-sm text-gray-500 mb-4"
                  >
                    ← 뒤로가기
                  </button>
                  <header className="mb-6">
                    <h1 className="typo-18-b">내 정보</h1>
                    <p className="mt-1 text-sm text-gray-500">
                      닉네임과 비밀번호를 수정하실 수 있습니다.
                    </p>
                  </header>
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
