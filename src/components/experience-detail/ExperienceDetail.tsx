"use client";

import GNB from "@/components/GNB";
import Footer from "@/components/Footer";
import ExperienceDetailHeader from "./ExperienceDetailHeader";
import ExperienceDetailDescription from "./ExperienceDetailDescription";
import ExperienceDetailMap from "./ExperienceDetailMap";

export default function ExperienceDetail() {
  return (
    <main>
      <GNB />

      <div className="px-6">
        {/* 상단 이미지 + 제목 + 별점 영역 */}
        <ExperienceDetailHeader />

        {/* 체험 설명 */}
        <ExperienceDetailDescription />

        {/* 오시는 길 (지도) */}
        <ExperienceDetailMap />

        {/* 후기 리스트 */}

        {/* 예약 섹션 */}
      </div>

      <Footer />
    </main>
  );
}
