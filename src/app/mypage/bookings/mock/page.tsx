"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ListCard from "@/components/ListCard";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import StarRatingInput from "@/components/StarRatingInput";
import logoAuth from "@/assets/img/empty_state.png";
import warningImg from "@/assets/img/warning_state.png"; // ✅ 경고 이미지 추가
import { mockReservations } from "./mockReservations";

type ReservationFilter =
  | "all"
  | "pending"
  | "canceled"
  | "confirmed"
  | "declined"
  | "completed";

export default function MockBookingsPage() {
  const [filter, setFilter] = useState<ReservationFilter>("all");
  const [openCardId, setOpenCardId] = useState<number | null>(null);

  // ✅ 후기 모달 상태
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [selectedReservation, setSelectedReservation] =
    useState<(typeof mockReservations)[number] | null>(null);

  // ✅ 예약 취소 모달 상태
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [targetReservation, setTargetReservation] =
    useState<(typeof mockReservations)[number] | null>(null);

  // ✅ 필터 순서
  const filterOrder: ReservationFilter[] = [
    "all",
    "pending",
    "canceled",
    "confirmed",
    "declined",
    "completed",
  ];

  // ✅ 예약 데이터가 없으면 필터 숨김, 하나라도 있으면 전체 표시
  const availableFilters = useMemo(() => {
    if (mockReservations.length === 0) return [];
    return filterOrder;
  }, [mockReservations, filterOrder]);

  // ✅ 필터된 예약 목록
  const filtered = useMemo(
    () =>
      filter === "all"
        ? mockReservations
        : mockReservations.filter((r) => r.status === filter),
    [mockReservations, filter]
  );

  const hasReservations = mockReservations.length > 0;

  const onCardClick = (id: number) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  };

  // ✅ 후기 작성 (mock)
  const handleSubmitReview = () => {
    if (!selectedReservation) return;

    console.log("📢 후기 등록 (mock):", {
      reservationId: selectedReservation.id,
      rating,
      content,
    });

    setOpenReviewModal(false);
    setRating(0);
    setContent("");
  };

  // ✅ 예약 취소 (mock)
  const handleCancelReservation = () => {
    if (!targetReservation) return;

    console.log("⚠️ 예약 취소 요청 (mock):", targetReservation.id);

    // 예약 상태를 취소로 변경 (mock 업데이트)
    const index = mockReservations.findIndex(
      (r) => r.id === targetReservation.id
    );
    if (index !== -1) {
      mockReservations[index].status = "canceled";
    }

    setOpenCancelModal(false);
    setTargetReservation(null);
  };

  // ✅ 데이터 없을 경우
  if (!hasReservations) {
    return (
      <section className="flex flex-col items-center justify-center text-center py-20">
        <Image
          src={logoAuth}
          alt="예약 없음"
          width={122}
          height={122}
          className="mb-4"
        />
        <p className="typo-16-m text-gray-600 mb-[30px]">
          아직 예약한 체험이 없어요
        </p>
        <Button
          label="둘러보기"
          variant="primary"
          className="w-[182px] h-[54px]"
        />
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ 필터 */}
      {availableFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableFilters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setOpenCardId(null);
              }}
              className={`px-4 py-2 rounded-full border ${
                filter === f
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {filterLabel(f)}
            </button>
          ))}
        </div>
      )}

      {/* ✅ 예약 카드 목록 */}
      <div className="space-y-4">
        {filtered.map((r) => (
          <div key={r.id}>
            <div
              className={`cursor-pointer transition-all ${
                openCardId === r.id ? "ring-2 ring-primary/30 rounded-2xl" : ""
              }`}
              onClick={() => onCardClick(r.id)}
            >
              <ListCard
                thumbnail={r.activity.bannerImageUrl}
                title={r.activity.title}
                subtitle={`${r.date} · ${r.startTime} - ${r.endTime}`}
                status={r.status}
                price={`₩${r.totalPrice.toLocaleString()}`}
                ctaLabel="자세히"
              />
            </div>

            {/* ✅ 카드 하단 버튼 */}
            {openCardId === r.id && (
              <div className="mt-3 mb-4 flex justify-center gap-3">
                {r.status === "pending" && (
                  <>
                    <Button
                      label="예약 변경"
                      variant="secondary"
                      className="w-1/3 h-11"
                      onClick={() => console.log("예약 변경 클릭")}
                    />
                    <Button
                      label="예약 취소"
                      variant="outline"
                      className="w-1/3 h-11"
                      onClick={() => {
                        setTargetReservation(r);
                        setOpenCancelModal(true);
                      }}
                    />
                  </>
                )}

                {r.status === "completed" && (
                  <Button
                    label="후기 작성"
                    variant="primary"
                    className="w-2/3 h-11"
                    onClick={() => {
                      setSelectedReservation(r);
                      setOpenReviewModal(true);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ 예약 취소 확인 모달 */}
      <Modal
        open={openCancelModal}
        onClose={() => setOpenCancelModal(false)}
        confirmText="취소하기"
        cancelText="아니오"
        onConfirm={handleCancelReservation}
        widthClass="max-w-xs"
      >
        <div className="flex flex-col items-center text-center">
          <Image
            src={warningImg}
            alt="경고"
            width={72}
            height={72}
            className="mb-4"
          />
          <p className="typo-16-b text-gray-900 mb-2">
            예약을 취소하시겠어요?
          </p>
        </div>
      </Modal>

      {/* ✅ 후기 작성 모달 */}
      <Modal
        open={openReviewModal}
        onClose={() => {
          setOpenReviewModal(false);
          setRating(0);
          setContent("");
        }}
        confirmText="작성하기"
        cancelText="취소"
        onConfirm={handleSubmitReview}
        widthClass="max-w-xs"
      >
        {selectedReservation && (
          <>
            {/* 제목 + 일정 */}
            <div className="text-center mb-4">
              <p className="typo-16-b text-gray-900">
                {selectedReservation.activity.title}
              </p>
              <p className="typo-14-m text-gray-500">
                {selectedReservation.date} / {selectedReservation.startTime} -{" "}
                {selectedReservation.endTime}
              </p>
            </div>

            {/* 별점 입력 */}
            <StarRatingInput initialRating={rating} onChange={setRating} />

            {/* 후기 입력 */}
            <div className="mt-5">
              <p className="typo-14-b mb-2 text-gray-800">
                소중한 경험을 들려주세요
              </p>
              <textarea
                className="w-full h-28 border border-gray-200 rounded-2xl p-4 text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="체험에서 느낀 경험을 자유롭게 남겨주세요"
                maxLength={100}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="text-right text-gray-400 text-12-m mt-1">
                {content.length}/100
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

// ✅ 필터 이름 매핑 함수
function filterLabel(key: ReservationFilter) {
  switch (key) {
    case "pending":
      return "예약 신청";
    case "canceled":
      return "예약 취소";
    case "confirmed":
      return "예약 승인";
    case "declined":
      return "예약 거절";
    case "completed":
      return "체험 완료";
    default:
      return "전체";
  }
}
