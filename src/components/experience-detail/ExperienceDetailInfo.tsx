"use client";

import Image from "next/image";
import starIcon from "@/assets/icon/icon_star_on.svg";
import MapIcon from "@/assets/icon/icon_map.svg";
import MoreIcon from "@/assets/icon/icon_more.svg";

export default function ExperienceDetailInfo() {
  return (
    <section className="pt-8 md:pt-10 lg:pt-0 border-b border-gray-100 lg:border-none pb-4 md:pb-6 lg:pb-10">
      <div className="relative">
        <p className="typo-13-m md:text-sm text-gray-700 mb-1 md:mb-2">
          문화 · 예술
        </p>
        <h1 className="typo-18-b md:text-2xl text-gray-950 mb-4">
          함께 배우면 즐거운 스트릿 댄스
        </h1>

        <div className="flex gap-1 items-center mb-2">
          <Image src={starIcon} alt="별점" className="w-4 h-4" />
          <span className="typo-14-m text-gray-700">4.9 (293)</span>
        </div>

        <div className="flex gap-1 items-center mb-4">
          <Image src={MapIcon} alt="지도" className="w-4 h-4" />
          <span className="typo-14-m text-gray-700">
            서울 중구 청계천로 100 10F
          </span>
        </div>

        <button type="button" className="absolute right-0 top-0">
          <Image src={MoreIcon} alt="더보기" width={28} height={28} />
        </button>
      </div>
    </section>
  );
}
