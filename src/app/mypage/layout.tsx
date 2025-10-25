// src/app/mypage/layout.tsx

"use client";

import React from "react";
import GNB from "@/components/GNB";
import Footer from "@/components/Footer";
import SideMenu from "@/components/SideMenu";
import Protected from "@/components/auth-detail/Protected";

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected>
      <div>
        <GNB isLoggedIn unread={3} />

        <main className="min-h-screen bg-bg-default text-text-primary">
          <div className="mx-auto max-w-[1200px] p-6 md:p-8 lg:p-10">
            <div className="hidden md:grid md:grid-cols-[178px_minmax(0,1fr)] lg:grid-cols-[290px_minmax(0,1fr)] gap-6 lg:gap-10">
              <aside className="space-y-6">
                <SideMenu />
              </aside>
              <div className="space-y-8">{children}</div>
            </div>

            <div className="block md:hidden">{children}</div>
          </div>
        </main>

        <Footer />
      </div>
    </Protected>
  );
}
