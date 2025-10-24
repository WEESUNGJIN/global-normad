"use client";

import GNB from "@/components/GNB";
import Footer from "@/components/Footer";
import ExperienceDetailImages from "@/components/experience-detail/ExperienceDetailImages";
import ExperienceDetailInfo from "@/components/experience-detail/ExperienceDetailInfo";
import ExperienceDetailDescription from "@/components/experience-detail/ExperienceDetailDescription";
import ExperienceDetailMap from "@/components/experience-detail/ExperienceDetailMap";
import ExperienceDetailReviews from "@/components/experience-detail/ExperienceDetailReviews";
import ReservationCard from "@/components/experience-detail/ReservationCard";

export default function ExperienceDetail() {
  return (
    <main>
      <GNB />

      <div className="relative px-6 md:px-8 lg:px-80 pb-[120px] lg:pb-44">
        {/* 모바일 및 태블릿 레이아웃 */}
        <div className="lg:hidden flex flex-col gap-10">
          <ExperienceDetailImages />
          <ExperienceDetailInfo />
          <ExperienceDetailDescription />
          <ExperienceDetailMap />
          <ExperienceDetailReviews />
        </div>

        {/* 데스크탑 레이아웃 */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_400px] lg:gap-10">
          {/* 왼쪽 컬럼 */}
          <div className="flex flex-col">
            <ExperienceDetailImages />
            <ExperienceDetailDescription />
            <ExperienceDetailMap />
            <ExperienceDetailReviews />
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex flex-col lg:sticky lg:top-32 h-fit">
            <ExperienceDetailInfo />
            <ReservationCard />
          </div>
        </div>
      </div>

      {/* 하단 고정 예약바 (모바일 및 태블릿 전용) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-[9999] bg-white border-t border-gray-100 px-6 pt-[22px] pb-[max(env(safe-area-inset-bottom),16px)]">
        <div className="flex items-center justify-between mb-3">
          <p className="typo-18-b text-gray-950">
            ₩10,000 <span className="typo-16-m text-gray-600">/ 인</span>
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
