"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";

import heroHalloween from "@/assets/img/hero_halloween.png";
import heroReview from "@/assets/img/hero_review.png";
import heroPottery from "@/assets/img/hero_pottery.png";
import heroGardening from "@/assets/img/hero_gardening.png";

const heroImages = [
  { src: heroHalloween, alt: "할로윈 이벤트 배너" },
  { src: heroReview, alt: "체험 리뷰 이벤트 배너" },
  { src: heroPottery, alt: "공방 원데이클래스 오픈 배너" },
  { src: heroGardening, alt: "꽃가게 원데이클래스 오픈 배너" },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3초마다 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={clsx(
        "w-full aspect-[16/9] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg relative",
        "mt-16 md:mt-25 lg:mt-32",
      )}
    >
      {heroImages.map((item, index) => (
        <div
          key={index}
          className={clsx(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        >
          <Image
            src={item.src}
            alt={item.alt}
            className="w-full h-full object-cover"
            priority={index === currentIndex}
          />
        </div>
      ))}

      {/* 하단 인디케이터 */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-[9000]">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={clsx(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-white w-5" : "bg-white/50",
            )}
          />
        ))}
      </div>
    </section>
  );
}
