"use client";

import GNB from "@/components/GNB";
import Footer from "@/components/Footer";
import ExperienceDetailHeader from "./ExperienceDetailHeader";
import ExperienceDetailDescription from "./ExperienceDetailDescription";
import ExperienceDetailMap from "./ExperienceDetailMap";
import ExperienceDetailReviews from "./ExperienceDetailReviews";
import ReservationCard from "./ReservationCard";

export default function ExperienceDetail() {
  return (
    <main>
      <GNB />

      <div className="relative px-6 md:px-8 lg:px-80 pb-[120px] lg:pb-44">
        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-12">
          {/* 왼쪽 컬럼 */}
          <div>
            {/* 헤더 (이미지 + 기본 정보) */}
            <ExperienceDetailHeader />

            {/* 체험 설명 */}
            <ExperienceDetailDescription />

            {/* 오시는 길 (지도) */}
            <ExperienceDetailMap />

            {/* 후기 리스트 */}
            <ExperienceDetailReviews />
          </div>

          {/* 오른쪽 공간은 비워둠 (absolute 카드용) */}
          <div className="hidden lg:block" />
        </div>

        {/* 오른쪽 예약 카드 */}
        <div className="hidden lg:block absolute top-16 right-80">
          <ReservationCard />
        </div>
      </div>

      {/* 하단 고정 예약 바 */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-[9999] bg-white border-t border-gray-100 px-6 pt-[22px] pb-[max(env(safe-area-inset-bottom),16px)]">
        <div className="flex items-center justify-between mb-3">
          <p className="typo-18-b text-gray-950">
            ₩1,0000 <span className="typo-16-m text-gray-600">/ 인</span>
          </p>
          <button className="typo-16-b text-primary border-b-2 border-primary">
            날짜 선택하기
          </button>
        </div>
        <button className="w-full py-4 rounded-[14px] bg-primary text-white typo-16-b disabled:bg-gray-300">
          예약하기
        </button>
      </div>

      <Footer />
    </main>
  );
}
