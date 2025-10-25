"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import starIcon from "@/assets/icon/icon_star_on.svg";
import mapIcon from "@/assets/icon/icon_map.svg";
import MoreIcon from "@/assets/icon/icon_more.svg";

import Dropdown from "@/components/Dropdown";

interface ExperienceDetailInfoProps {
  title: string;
  category: string;
  address: string;
  rating: number;
  reviewCount: number;
  isOwner: boolean;
  id: string;
}

export default function ExperienceDetailInfo({
  title,
  category,
  address,
  rating,
  reviewCount,
  isOwner,
  id,
}: ExperienceDetailInfoProps) {
  const router = useRouter();

  const handleOwnerAction = (option: string) => {
    if (option === "수정하기") {
      router.push(`/experience-edit/${id}`);
    } else if (option === "삭제하기") {
      console.log("삭제 모달 오픈");
    }
  };

  return (
    <section className="relative flex flex-col py-5 lg:py-0 border-b border-gray-100 lg:border-none">
      {/* 카테고리 + 제목 */}
      <div className="pb-4">
        <p className="typo-13-m md:text-sm text-gray-700 mb-1 md:mb-2">
          {category}
        </p>
        <h1 className="typo-18-b md:text-2xl text-gray-950">{title}</h1>
      </div>

      {/* 평점 + 리뷰 수 */}
      <div className="flex gap-1 items-center mb-2">
        <Image
          src={starIcon}
          alt="별 아이콘"
          width={16}
          height={16}
          className="w-4 h-4"
        />
        <span className="typo-14-m text-gray-700">{rating.toFixed(1)}</span>
        <span className="typo-14-m text-gray-700">({reviewCount})</span>
      </div>

      {/* 주소 */}
      <div className="flex gap-1 items-center">
        <Image
          src={mapIcon}
          alt="지도 아이콘"
          width={16}
          height={16}
          className="w-4 h-4"
        />
        <p className="typo-14-m text-gray-700">{address}</p>
      </div>

      {/* 등록자 표시 */}
      {isOwner && (
        <div className="absolute right-0 top-0">
          <Dropdown
            trigger="click"
            customIcon={MoreIcon}
            options={["수정하기", "삭제하기"]}
            onSelect={handleOwnerAction}
            highlightSelected={false}
          />
        </div>
      )}
    </section>
  );
}
