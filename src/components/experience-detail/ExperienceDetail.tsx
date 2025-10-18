"use client";

import GNB from "@/components/GNB";
import Footer from "@/components/Footer";
import ExperienceDetailHeader from "./ExperienceDetailHeader";

export default function ExperienceDetail() {
  return (
    <main>
      <GNB />

      <div className="px-6">
        {/* 상단 이미지 + 제목 + 별점 영역 */}
        <ExperienceDetailHeader />

        {/* 체험 설명 */}

        {/* 오시는 길 (지도) */}

        {/* 예약 섹션 */}

        {/* 후기 리스트 */}
      </div>

      <Footer />
    </main>
  );
}
