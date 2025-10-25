// src/app/mypage/calendar/layout.tsx
import React from "react";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-8">
      {/* 헤더 */}
      <header className="flex flex-wrap items-center justify-between lg:w-[640px] gap-3">
        <div>
          <h1 className="typo-18-b">예약 현황</h1>
          <p className="mt-2 typo-14-m text-gray-500">
            내 체험에 예약된 내역을 한눈에 확인할 수 있습니다.
          </p>
        </div>
      </header>

      {/* 콘텐츠 영역 */}
      {children}
    </section>
  );
}
