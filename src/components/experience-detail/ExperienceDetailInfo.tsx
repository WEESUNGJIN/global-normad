"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";

import starIcon from "@/assets/icon/icon_star_on.svg";
import mapIcon from "@/assets/icon/icon_map.svg";
import moreIcon from "@/assets/icon/icon_more.svg";
import warningStateImg from "@/assets/img/warning_state.png";

import Dropdown from "@/components/Dropdown";
import Modal from "@/components/Modal";
import { deleteActivity } from "@/app/mypage/experience/api/activities";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOwnerAction = (option: string) => {
    if (option === "수정하기") {
      router.push(`/experience-edit/${id}`);
    } else if (option === "삭제하기") {
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteActivity(Number(id));
      alert("체험이 삭제되었습니다.");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleteModalOpen(false);
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
        <div className="absolute top-5 -right-3 lg:top-0">
          <Dropdown
            trigger="click"
            customIcon={moreIcon}
            options={["수정하기", "삭제하기"]}
            onSelect={handleOwnerAction}
            highlightSelected={false}
          />
        </div>
      )}

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        confirmText="네"
        cancelText="아니요"
        onConfirm={handleDeleteConfirm}
        widthClass="w-80 md:w-100"
        actionsMaxClass="max-w-[234px] md:max-w-[282px]"
      >
        <div className="-mt-3 flex flex-col items-center justify-center">
          {/* 상단 경고 아이콘 */}
          <Image
            src={warningStateImg}
            alt="경고 아이콘"
            width={48}
            height={48}
            className="w-12 h-12 md:w-[88px] md:h-[88px]"
          />

          {/* 문구 */}
          <h3 className="typo-16-b md:text-lg text-gray-950">
            체험을 삭제하시겠습니까?
          </h3>
        </div>
      </Modal>
    </section>
  );
}
