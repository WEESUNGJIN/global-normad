// src/app/mypage/profile/layout.tsx

import React from "react";
import SideMenu from "@/components/SideMenu";
import GNB from "@/components/GNB";
import Footer from "@/components/Footer";

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

            {/* RIGHT */}
            <div className="space-y-8">
              <header className="flex flex-wrap items-center justify-between lg:w-[640px] gap-3">
                <div>
                  <h1 className="typo-18-b">내 정보</h1>
                  <p className="mt-2 typo-14-m text-gray-500">
                    닉네임과 비밀번호를 수정하실 수 있습니다.
                  </p>
                </div>
              </header>

              {/* 본문 내용 */}
              {children}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
