"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import api from "@/utils/api";
import starIconOn from "@/assets/icon/icon_star_on.svg";
import starIconOff from "@/assets/icon/icon_star_off.svg";

interface Review {
  id: number;
  nickname: string;
  rating: number;
  content: string;
  createdAt?: string;
}

interface ExperienceDetailReviewsProps {
  activityId: number;
}

export default function ExperienceDetailReviews({
  activityId,
}: ExperienceDetailReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        console.log("리뷰 요청 시작");

        const res = await api.get<{ reviews: Review[] }>(
          `activities/${activityId}/reviews?method=offset`,
        );

        console.log("리뷰 응답 데이터:", res);

        const data: Review[] = res.reviews ?? [];

        setReviews(data);

        const avg =
          data.length > 0
            ? data.reduce((acc: number, cur: Review) => acc + cur.rating, 0) /
              data.length
            : 0;

        setAverageRating(avg);
        setTotalCount(data.length);
      } catch (err) {
        console.error("리뷰 조회 실패:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, [activityId]);

  if (isLoading) return <p>리뷰를 불러오는 중...</p>;

  return (
    <section>
      {/* 상단 요약 */}
      <div className="pt-5 flex gap-2 items-center">
        <h2 className="typo-16-b md:text-lg text-gray-950">체험 후기</h2>
        <p className="typo-14-sb md:text-base text-gray-700">
          {totalCount.toLocaleString()}개
        </p>
      </div>

      {/* 평점 표시 */}
      <div className="pt-2 md:pt-3 md:pb-8 pb-7 text-center">
        <p className="typo-24-sb md:text-3xl mb-2 text-gray-950">
          {averageRating.toFixed(1)}
        </p>
        <p className="typo-14-b md:text-base text-gray-950 mb-2">
          {averageRating > 4
            ? "매우 만족"
            : averageRating > 3
              ? "만족"
              : averageRating > 0
                ? "보통"
                : "평가 없음"}
        </p>
        <div className="flex justify-center items-center gap-1 typo-14-m text-gray-700">
          <Image src={starIconOn} alt="별 아이콘" width={16} height={16} />
          {totalCount.toLocaleString()}개의 후기
        </div>
      </div>

      {/* 후기 리스트 */}
      {reviews.length > 0 && (
        <div className="flex flex-col gap-10 lg:gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl bg-white shadow-searchbar p-5"
            >
              {/* 사용자 정보 */}
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <p className="typo-14-sb md:text-base text-gray-950">
                  {review.nickname}
                </p>
                {review.createdAt && (
                  <span className="typo-12-sb md:text-sm text-gray-500">
                    {review.createdAt.split("T")[0].replace(/-/g, ". ")}
                  </span>
                )}
              </div>

              {/* 별점 */}
              <div className="flex gap-[1px] mb-2 md:mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image
                    key={i}
                    src={i < review.rating ? starIconOn : starIconOff}
                    alt="별점 아이콘"
                    className="w-4 h-4"
                  />
                ))}
              </div>

              {/* 후기 내용 */}
              <p className="typo-14-m md:text-base !leading-[1.7] text-gray-950">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={1}
        totalPages={1}
        onChange={(p) => console.log("페이지 이동:", p)}
        className="mt-8"
      />
    </section>
  );
}
