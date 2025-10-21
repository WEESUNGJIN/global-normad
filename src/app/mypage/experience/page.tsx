"use client";

import Image from "next/image";
import emptyState from "@/assets/img/empty_state.png";
import ExperienceCard from "./components/ExperienceCard";
import Modal from "@/components/Modal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import warning from "@/assets/img/warning_state.png";
// testImg 나중에 인증 권한 해결 후 지울 예정
import streetdanceImg from "@/assets/img/streetdance_main.png";

export default function ExperiencePage() {
  // --------------------------
  // 모달 상태 관리
  // --------------------------
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<null | {
    id: number;
    title: string;
  }>(null);

  // --------------------------
  // mock 데이터 (API 막혀있으니까)
  // --------------------------
  const mockData = {
    activities: [
      {
        id: 1,
        title: "트로피컬 피싱 투어",
        rating: 4.8,
        reviewCount: 25,
        price: 89000,
        bannerImageUrl: streetdanceImg.src,
      },
      {
        id: 2,
        title: "스트릿 댄스 클래스",
        rating: 4.5,
        reviewCount: 13,
        price: 65000,
        bannerImageUrl: streetdanceImg.src,
      },
    ],
  };

  // --------------------------
  // React Query (현재는 mock으로 대체)
  // --------------------------
  const {
    data = mockData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myActivities"],
    queryFn: async () => mockData, // getMyActivities 대신 mock으로
  });

  const activities = data.activities || [];

  // --------------------------
  // 핸들러
  // --------------------------
  const handleDeleteClick = (act: { id: number; title: string }) => {
    setSelectedActivity(act);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("삭제 확정:", selectedActivity?.id);
    // TODO: 삭제 API 연결 예정
    setDeleteModalOpen(false);
  };

  // --------------------------
  // 상태별 렌더링
  // --------------------------
  if (isLoading) {
    return (
      <section className="flex justify-center items-center py-20 text-gray-500">
        로딩 중...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex justify-center items-center py-20 text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </section>
    );
  }

  if (activities.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center text-center py-20">
        <Image
          src={emptyState}
          alt="체험 없음"
          width={122}
          height={122}
          className="mb-4"
        />
        <p className="typo-16-m text-gray-600 mb-[30px]">
          아직 등록한 체험이 없어요
        </p>
      </section>
    );
  }

  // --------------------------
  // 정상 렌더링
  // --------------------------
  return (
    <section className="lg:w-[640px]">
      {activities.map((act) => (
        <ExperienceCard
          key={act.id}
          title={act.title}
          rating={act.rating}
          reviewCount={act.reviewCount}
          price={Number(act.price)}
          imageUrl={act.bannerImageUrl}
          onEdit={() => console.log("수정 클릭:", act.id)}
          onDelete={() => handleDeleteClick(act)}
        />
      ))}

      {/* 삭제 모달 */}
      <Modal
        open={isDeleteModalOpen}
        title=""
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmText="네"
        cancelText="아니오"
      >
        <div className="text-center">
          <Image
            src={warning}
            alt="경고"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <p className="text-gray-950">
            선택한 체험을 삭제하시겠어요? <br />
            삭제 후에는 복구할 수 없습니다.
          </p>
          {selectedActivity && (
            <p className="mt-2 text-primary-500 font-semibold">
              [{selectedActivity.title}]
            </p>
          )}
        </div>
      </Modal>
    </section>
  );
}
