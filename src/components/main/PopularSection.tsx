"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Card from "@/components/Card";
import emojiFire from "@/assets/img/emoji_fire.png";
import iconArrowRight from "@/assets/icon/icon_arrow_right.svg";
import iconArrowLeft from "@/assets/icon/icon_arrow_left.svg";
import { fetchPopularExperiencesInfinite } from "@/api/experience";
import type { Experience } from "@/api/experience";

export default function PopularSection() {
  const router = useRouter();

  const [activities, setActivities] = useState<Experience[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPopularExperiencesInfinite(0);
        setActivities(data.activities);
        setOffset(data.nextOffset ?? 8);
        setHasMore(!!data.nextOffset);
      } catch (err) {
        console.error("초기 인기 체험 로드 실패:", err);
      }
    })();
  }, []);

  useEffect(() => {
    const loadMore = async () => {
      if (isLoading || !hasMore) return;

      try {
        setIsLoading(true);
        const data = await fetchPopularExperiencesInfinite(offset);

        if (data.activities.length > 0) {
          setActivities((prev) => [...prev, ...data.activities]);
          setOffset(data.nextOffset ?? offset + 8);
          setHasMore(!!data.nextOffset);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("인기 체험 추가 로드 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [offset, hasMore, isLoading]);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) return setVisibleCount(activities.length);
      if (window.innerWidth < 1024) return setVisibleCount(2);
      return setVisibleCount(4);
    };
    updateVisibleCount();

    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [activities.length]);

  const handleNext = () => {
    const nextIndex = currentIndex + visibleCount;
    if (nextIndex < activities.length) {
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
    visibleCount === activities.length
      ? activities
      : activities.slice(currentIndex, currentIndex + visibleCount);

  return (
    <section className="pt-14 md:pt-20 lg:pt-24 pl-6 md:pl-8 lg:pl-0 relative">
      <h2 className="typo-18-b -ml-[2px] md:text-2xl mb-4 md:mb-5 flex items-center">
        <Image
          src={emojiFire}
          alt="불 이모지"
          width={20}
          height={20}
          className="-mt-[3px] mr-[5px] md:mr-[5px] md:w-7 md:h-7 object-contain"
        />
        인기 체험
      </h2>

      <div
        className={clsx(
          "flex overflow-x-auto md:overflow-x-hidden scrollbar-hide transition-transform duration-300 ease-in-out",
          "gap-3 md:gap-[3.5%] lg:gap-6",
        )}
      >
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
                <Card.Title className="line-clamp-1">{act.title}</Card.Title>
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

      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className={clsx(
            "hidden md:flex absolute top-1/2 -translate-y-1/2 left-[-24px]",
            "w-[54px] h-[54px] bg-white border border-gray-300 rounded-full shadow-md items-center justify-center",
          )}
        >
          <Image src={iconArrowLeft} alt="이전" />
        </button>
      )}

      {currentIndex + visibleCount < activities.length && (
        <button
          onClick={handleNext}
          className={clsx(
            "hidden md:flex absolute top-1/2 -translate-y-1/2 right-1 lg:right-[-22px]",
            "w-[54px] h-[54px] bg-white border border-gray-300 rounded-full shadow-md items-center justify-center",
          )}
        >
          <Image src={iconArrowRight} alt="다음" />
        </button>
      )}

      <div ref={observerRef} className="h-4" />
      {isLoading && (
        <p className="text-gray-400 text-sm text-center mt-4 animate-pulse">
          로딩 중...
        </p>
      )}
    </section>
  );
}
