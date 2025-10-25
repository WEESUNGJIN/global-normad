import React from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-8">
      {/* 헤더 */}
      <header className="flex flex-wrap items-center justify-between lg:w-[640px] gap-3">
        <div>
          <h1 className="typo-18-b">내 체험 관리</h1>
          <p className="mt-2 typo-14-m text-gray-500">
            체험을 등록하거나 수정 및 삭제가 가능합니다.
          </p>
        </div>
        <Link href="/experience-register">
          <Button label="체험 등록하기" variant="primary" />
        </Link>
      </header>

      {/* 콘텐츠 자리 */}
      {children}
    </section>
  );
}
