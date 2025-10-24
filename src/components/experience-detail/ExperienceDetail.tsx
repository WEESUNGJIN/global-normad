"use client";

import { useState, useEffect } from "react";
import GNB from "@/components/GNB";
import Footer from "@/components/Footer";
import ExperienceDetailImages from "@/components/experience-detail/ExperienceDetailImages";
import ExperienceDetailInfo from "@/components/experience-detail/ExperienceDetailInfo";
import ExperienceDetailDescription from "@/components/experience-detail/ExperienceDetailDescription";
import ExperienceDetailMap from "@/components/experience-detail/ExperienceDetailMap";
import ExperienceDetailReviews from "@/components/experience-detail/ExperienceDetailReviews";
import ReservationCard from "@/components/experience-detail/ReservationCard";
import api from "@/utils/api";

interface SubImage {
  id: number;
  imageUrl: string;
}

interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImages: SubImage[];
  reviewCount: number;
  rating: number;
}

interface ExperienceDetailProps {
  activityId: number;
}

export default function ExperienceDetail({
  activityId,
}: ExperienceDetailProps) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isOwner] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("체험 상세 데이터 요청 시작");

        // 타입 명시 (api.ts에서 .data만 반환하므로)
        const activityRes = (await api.get("activities?method=offset")) as {
          activities: Activity[];
          totalCount: number;
        };

        console.log("API 응답 데이터:", activityRes);

        if (!activityRes || !activityRes.activities) {
          console.error("activities 데이터가 없습니다:", activityRes);
          return;
        }

        const foundActivity = activityRes.activities.find(
          (a: Activity) => a.id === activityId,
        );

        if (foundActivity) {
          setActivity(foundActivity);
          console.log("찾은 체험:", foundActivity);
        } else {
          console.warn(`id ${activityId} 체험을 찾을 수 없습니다.`);
        }
      } catch (err) {
        console.error("체험 상세 조회 실패:", err);
      }
    }

    fetchData();
  }, [activityId]);

  if (!activity) return <p>로딩 중...</p>;

  return (
    <main>
      <GNB />

      <div className="relative px-6 md:px-8 lg:px-80 pb-[120px] lg:pb-44">
        {/* 모바일 및 태블릿 */}
        <div className="lg:hidden flex flex-col gap-10">
          <ExperienceDetailImages images={activity.subImages} />
          <ExperienceDetailInfo
            title={activity.title}
            category={activity.category}
            address={activity.address}
            rating={activity.rating}
            reviewCount={activity.reviewCount}
            isOwner={isOwner}
          />
          <ExperienceDetailDescription description={activity.description} />
          <ExperienceDetailMap address={activity.address} />
          <ExperienceDetailReviews activityId={activity.id} />
        </div>

        {/* 데스크탑 */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_400px] lg:gap-10">
          <div className="flex flex-col">
            <ExperienceDetailImages images={activity.subImages} />
            <ExperienceDetailDescription description={activity.description} />
            <ExperienceDetailMap address={activity.address} />
            <ExperienceDetailReviews activityId={activity.id} />
          </div>

          <div className="flex flex-col h-fit">
            <ExperienceDetailInfo
              title={activity.title}
              category={activity.category}
              address={activity.address}
              rating={activity.rating}
              reviewCount={activity.reviewCount}
              isOwner={isOwner}
            />
            {!isOwner && <ReservationCard price={activity.price} />}
          </div>
        </div>
      </div>

      {/* 하단 예약 바 (모바일 전용) */}
      {!isOwner && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full z-[9999] bg-white border-t border-gray-100 px-6 pt-[22px] pb-[max(env(safe-area-inset-bottom),16px)]">
          <div className="flex items-center justify-between mb-3">
            <p className="typo-18-b text-gray-950">
              ₩{activity.price.toLocaleString()}{" "}
              <span className="typo-16-m text-gray-600">/ 인</span>
            </p>
            <button className="typo-16-b text-primary border-b-2 border-primary">
              날짜 선택하기
            </button>
          </div>
          <button className="w-full py-4 rounded-[14px] bg-primary text-white typo-16-b disabled:bg-gray-300">
            예약하기
          </button>
        </div>
      )}

      <Footer />
    </main>
  );
}
