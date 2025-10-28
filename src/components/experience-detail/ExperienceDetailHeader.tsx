"use client";

import Image from "next/image";
import streetDanceMain from "@/assets/img/streetdance_main.png";
import streetDanceZoom from "@/assets/img/streetdance_zoom.png";
import streetDanceBasketball from "@/assets/img/streetdance_basketball.png";
import starIcon from "@/assets/icon/icon_star_on.svg";
import MapIcon from "@/assets/icon/icon_map.svg";
import MoreIcon from "@/assets/icon/icon_more.svg";

export default function ExperienceDetailHeader() {
  return (
    <section className="pt-8 md:pt-10 lg:pt-16 border-b border-gray-100 pb-4 md:pb-6">
      {/* 이미지 그리드 */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-rows-2 lg:h-100">
        <div className="relative overflow-hidden rounded-tl-3xl rounded-bl-3xl bg-gray-200 row-span-2">
          <Image
            src={streetDanceMain}
            alt="스트릿댄스 메인"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="relative overflow-hidden rounded-tr-3xl bg-gray-200 aspect-[3/2] lg:aspect-auto">
          <Image
            src={streetDanceZoom}
            alt="스트릿댄스 줌"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="relative overflow-hidden rounded-br-3xl bg-gray-200 aspect-[3/2] lg:aspect-auto">
          <Image
            src={streetDanceBasketball}
            alt="스트릿댄스 농구장"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* 텍스트 정보 */}
      <div className="relative mt-6">
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
