"use client";

import Image from "next/image";
import starIcon from "@/assets/icon/icon_star_on.svg";
import MapIcon from "@/assets/icon/icon_map.svg";
import MoreIcon from "@/assets/icon/icon_more.svg";

interface ExperienceDetailInfoProps {
  title: string;
  category: string;
  address: string;
  rating: number;
  reviewCount: number;
  isOwner: boolean;
}

export default function ExperienceDetailInfo({
  title,
  category,
  address,
  rating,
  reviewCount,
  isOwner,
}: ExperienceDetailInfoProps) {
  return (
    <section className="pt-8 md:pt-10 lg:pt-16 border-b border-gray-100 lg:border-none pb-4 md:pb-6 lg:pb-10">
      <div className="relative">
        {/* 카테고리 */}
        <p className="typo-13-m md:text-sm text-gray-700 mb-1 md:mb-2">
          {category}
        </p>

        {/* 제목 */}
        <h1 className="typo-18-b md:text-2xl text-gray-950 mb-4">{title}</h1>

        {/* 평점 + 후기 수 */}
        <div className="flex gap-1 items-center mb-2">
          <Image src={starIcon} alt="별점" className="w-4 h-4" />
          <span className="typo-14-m text-gray-700">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* 주소 */}
        <div className="flex gap-1 items-center mb-4">
          <Image src={MapIcon} alt="지도" className="w-4 h-4" />
          <span className="typo-14-m text-gray-700">{address}</span>
        </div>

        {/* ✅ 내가 등록한 체험일 때만 케밥 버튼 표시 */}
        {isOwner && (
          <button type="button" className="absolute right-0 top-0">
            <Image src={MoreIcon} alt="더보기" width={28} height={28} />
          </button>
        )}
      </div>
    </section>
  );
}
