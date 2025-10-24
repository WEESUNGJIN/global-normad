"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Card from "@/components/Card";
import emojiFire from "@/assets/img/emoji_fire.png";
import iconArrowRight from "@/assets/icon/icon_arrow_right.svg";
import iconArrowLeft from "@/assets/icon/icon_arrow_left.svg";
import { activities } from "@/components/experience-detail/mock/activities";

export default function PopularSection() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isClient, setIsClient] = useState(false);

  const sortedActivities = [...activities].sort(
    (a, b) => b.reviewCount - a.reviewCount,
  );

  useEffect(() => {
    setIsClient(true);

    const getVisibleCount = () => {
      if (window.innerWidth < 768) return sortedActivities.length;
      if (window.innerWidth < 1024) return 2;
      return 4;
    };

    setVisibleCount(getVisibleCount());

    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sortedActivities.length]);

  const handleNext = () => {
    const nextIndex = currentIndex + visibleCount;
    if (nextIndex < sortedActivities.length) {
      setCurrentIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = currentIndex - visibleCount;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
    }
  };

  const visibleCards =
    visibleCount === sortedActivities.length
      ? sortedActivities
      : sortedActivities.slice(currentIndex, currentIndex + visibleCount);

  const sectionClasses = "pt-14 md:pt-20 lg:pt-24 pl-6 md:pl-8 lg:pl-0";
  const listClasses = clsx(
    "flex overflow-x-auto md:overflow-x-hidden scrollbar-hide transition-transform duration-300 ease-in-out",
    "gap-3 md:gap-[3.5%] lg:gap-6",
  );
  const arrowBaseClasses =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 w-[54px] h-[54px] bg-white border border-gray-300 rounded-full shadow-md items-center justify-center";

  return (
    <section className={sectionClasses}>
      <h2 className="typo-18-b md:text-3xl mb-4 md:mb-5 flex items-center">
        <Image
          src={emojiFire}
          alt="불 이모지"
          width={20}
          height={20}
          className="-mt-[6px] mr-[3px] md:w-7 md:h-7 object-contain"
        />
        인기 체험
      </h2>

      {isClient && (
        <div className="relative">
          {/* 카드 리스트 */}
          <div className={listClasses}>
            {(visibleCards ?? []).map((act) => (
              <div
                key={act.id}
                onClick={() => router.push(`/experience-detail/${act.id}`)}
                className={clsx(
                  "cursor-pointer flex-shrink-0",
                  "w-[44.5%] md:w-[46.5%] lg:w-[23.4%]",
                )}
              >
                <Card className="!w-full">
                  <Card.Image src={act.bannerImageUrl} alt={act.title} />
                  <Card.Content>
                    <Card.Title className="line-clamp-1">
                      {act.title}
                    </Card.Title>
                    <Card.Meta rating={act.rating} count={act.reviewCount} />
                    <Card.Price
                      price={`₩ ${act.price.toLocaleString()}`}
                      unit="/ 인"
                    />
                  </Card.Content>
                </Card>
              </div>
            ))}
          </div>

          {/* 왼쪽 버튼 */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className={clsx(arrowBaseClasses, "left-[-24px]")}
            >
              <Image src={iconArrowLeft} alt="이전" />
            </button>
          )}

          {/* 오른쪽 버튼 */}
          {currentIndex + visibleCount < sortedActivities.length && (
            <button
              onClick={handleNext}
              className={clsx(arrowBaseClasses, "right-1 lg:right-[-22px]")}
            >
              <Image src={iconArrowRight} alt="다음" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
