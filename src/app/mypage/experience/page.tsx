"use client";

import Image from "next/image";
import emptyState from "@/assets/img/empty_state.png";
import ExperienceCard from "./components/ExperienceCard";
import Modal from "@/components/Modal";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import warning from "@/assets/img/warning_state.png";
import { ActivitiesResponse } from "@/types/experience";
// testImg 나중에 인증 권한 해결 후 지울 예정
import streetdanceImg from "@/assets/img/streetdance_main.png";

export default function ExperiencePage() {
  const router = useRouter();
  // --------------------------
  // 모달 상태 관리
  // --------------------------
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<null | {
    id: number;
    title: string;
  }>(null);

  // --------------------------
  // mock 데이터 (10페이지 x 4개)
  // --------------------------
  const mockPages: ActivitiesResponse[] = Array.from(
    { length: 10 },
    (_, pageIdx) => ({
      activities: Array.from({ length: 4 }, (_, i) => {
        const id = pageIdx * 4 + i + 1;
        return {
          id,
          userId: 0,
          title: `체험 ${id}번 타이틀`,
          description: `이건 ${id}번 체험의 설명이에요.`,
          category: "액티비티",
          price: 50000 + id * 1000,
          address: `서울시 어딘가 ${id}번지`,
          bannerImageUrl: streetdanceImg.src,
          reviewCount: Math.floor(Math.random() * 50),
          rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)), // number로 변환
          createdAt: new Date(Date.now() - id * 1000 * 60 * 60).toISOString(),
          updatedAt: new Date(Date.now() - id * 1000 * 60 * 60).toISOString(),
        };
      }),
      nextCursorId: pageIdx < 9 ? pageIdx + 1 : null,
      hasNext: pageIdx < 9,
    }),
  );
  // --------------------------
  // useInfiniteQuery (현재는 mock으로 대체)
  // --------------------------
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage, // 다음 페이지 불러오기
    hasNextPage, // 다음 페이지 존재 여부
    isFetchingNextPage, // 다음 페이지 로딩 중 상태
  } = useInfiniteQuery<ActivitiesResponse>({
    queryKey: ["myActivities"],
    // 나중에 백엔드 API 붙이면 여기에 getMyActivities 호출
    queryFn: async ({ pageParam = 0 }) => {
      const index = Number(pageParam);
      await new Promise((r) => setTimeout(r, 500)); // 로딩 시뮬레이션
      return (
        mockPages[index] ?? {
          activities: [],
          nextCursorId: null,
          hasNext: false,
        }
      );
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNext ? pages.length : undefined,
    initialPageParam: 0,
  });

  // 모든 페이지 병합 후 최신순 정렬
  const activities = (data?.pages ?? [])
    .flatMap((page) => page.activities)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  // --------------------------
  // IntersectionObserver로 무한스크롤 감지
  // --------------------------
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasNextPage && // 다음 페이지 존재할 때만
          !isFetchingNextPage && // 이미 불러오는 중이 아닐 때만
          activities.length > 0 // 빈 페이지일 땐 무시
        ) {
          fetchNextPage(); // 다음 페이지 요청
        }
      },
      {
        root: container,
        threshold: 0, // 더 일찍 감지하도록 0으로 설정
        rootMargin: "100px",
      },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, activities.length]);

  // --------------------------
  // 삭제 Mutation (mock 기반)
  // --------------------------
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => id,
    onSuccess: (id) => {
      queryClient.setQueryData<{
        pages: ActivitiesResponse[];
        pageParams: unknown[];
      }>(["myActivities"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            activities: page.activities.filter((a) => a.id !== id),
          })),
        };
      });

      setDeleteModalOpen(false);
      setSelectedActivity(null);
    },
  });

  // --------------------------
  // 핸들러
  // --------------------------
  const handleDeleteClick = (act: { id: number; title: string }) => {
    setSelectedActivity(act);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedActivity) return;
    deleteMutation.mutate(selectedActivity.id);
  };

  const handleEditClick = (id: number) => {
    router.push(`/experience-edit/${id}`); // 수정 페이지로 이동
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
      <div
        className="overflow-y-auto border-none rounded-xl custom-scrollbar p-3 sm:p-4"
        style={{
          height: "80vh", // 리스트 영역 고정 높이
        }}
        id="scroll-container"
      >
        {activities.map((act) => (
          <ExperienceCard
            key={act.id}
            title={act.title}
            rating={act.rating}
            reviewCount={act.reviewCount}
            price={Number(act.price)}
            imageUrl={act.bannerImageUrl}
            onEdit={() => handleEditClick(act.id)}
            onDelete={() => handleDeleteClick(act)}
          />
        ))}

        {/* 무한스크롤 트리거 */}
        {isFetchingNextPage && (
          <p className="text-center py-4 text-gray-500">로딩 중...</p>
        )}
        <div ref={loadMoreRef} className="h-32" />
      </div>

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
