"use client";

import GNB from "@/components/GNB";
import Footer from "@/components/Footer";
import ExperienceDetailHeader from "./ExperienceDetailHeader";
import ExperienceDetailDescription from "./ExperienceDetailDescription";
import ExperienceDetailMap from "./ExperienceDetailMap";
import ExperienceDetailReviews from "./ExperienceDetailReviews";

export default function ExperienceDetail() {
  return (
    <main>
      <GNB />

      <div className="px-6 md:px-8 pb-[120px]">
        {/* 상단 이미지 + 제목 + 별점 영역 */}
        <ExperienceDetailHeader />

        {/* 체험 설명 */}
        <ExperienceDetailDescription />

        {/* 오시는 길 (지도) */}
        <ExperienceDetailMap />

        {/* 후기 리스트 */}
        <ExperienceDetailReviews />
      </div>

      {/* 예약 섹션 */}
      <div className="fixed bottom-0 left-0 w-full z-[9999] bg-white border-t border-gray-100 px-6 pt-4 pb-[max(env(safe-area-inset-bottom),16px)]">
        <div className="flex items-center justify-between mb-3">
          <p className="typo-18-b text-gray-950">
            ₩1,000 <span className="typo-16-m text-gray-600">/ 1명</span>
          </p>
          <button className="typo-16-b text-primary border-b-2 border-primary">
            날짜 선택하기
          </button>
        </div>
        <button className="w-full py-4 rounded-[14px] bg-primary text-white typo-16-b disabled:bg-gray-300">
          예약하기
        </button>
      </div>

      {/* <Footer /> */}
    </main>
  );
}
