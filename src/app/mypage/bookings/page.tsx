"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ListCard from "@/components/ListCard";
import Button from "@/components/Button";
import Image from "next/image";
import Modal from "@/components/Modal";
import StarRatingInput from "@/components/StarRatingInput";
import logoAuth from "@/assets/img/empty_state.png";
import warningImg from "@/assets/img/warning_state.png";
import api from "@/utils/api";
import { MyReservationsResponse, Reservation } from "@/types/reservation";

type ReservationFilter = "all" | "pending" | "canceled" | "confirmed" | "declined" | "completed";

  // ✅ 필터 순서를 명시적으로 정의
const filterOrder: ReservationFilter[] = [
  "all",
  "pending",
  "canceled",
  "confirmed",
  "declined",
  "completed",
];

export default function BookingsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReservationFilter>("all");
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [targetReservation, setTargetReservation] = useState<Reservation | null>(null);

  // ✅ Hook 순서는 항상 일정해야 함
  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await api.get<MyReservationsResponse>("/my-reservations");
        setReservations(res.reservations);
      } catch (err) {
        console.error("예약 리스트 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReservations();
  }, []);

  // ✅ useMemo는 절대 조건문 안에 넣지 않음
  const filtered = useMemo(
    () => reservations.filter((r) => (filter === "all" ? true : r.status === filter)),
    [reservations, filter]
  );



  // ✅ 예약 데이터가 없으면 필터 숨김, 하나라도 있으면 전체 목록 표시
  const availableFilters = useMemo(() => {
    if (reservations.length === 0) return []; // 데이터 없으면 필터 안 보이게
    return filterOrder; // 하나라도 있으면 전체 필터 표시
  }, [reservations]);

  // 후기 작성 핸들러
  const handleSubmitReview = async () => {
    if (!selectedReservation) return;
    try {
      // TODO: 후기 API 연동 예정
      console.log("후기 등록:", {
        reservationId: selectedReservation.id,
        rating,
        content,
      });

      // 성공 후 초기화
      setOpenReviewModal(false);
      setRating(0);
      setContent("");
    } catch (err) {
      console.error("후기 등록 실패:", err);
    }
  };

  const handleCancelReservation = async () => {
    if (!targetReservation) return;
    try {
      console.log("예약 취소 요청:", targetReservation.id);
      // TODO: 실제 취소 API 연동 예정 (예: await api.post(`/reservations/${targetReservation.id}/cancel`))

      // 취소 성공 시 상태 업데이트 (선택적)
      setReservations((prev) =>
        prev.map((r) =>
          r.id === targetReservation.id ? { ...r, status: "canceled" } : r
        )
      );

      setOpenCancelModal(false);
      setTargetReservation(null);
    } catch (err) {
      console.error("예약 취소 실패:", err);
    }
  };

  if (loading) {
    // Hook 이후 return 해야 함 (조건부 Hook 금지)
    return <p>로딩 중...</p>;
  }

  const hasReservations = reservations.length > 0;

  return hasReservations ? (
    <div className="space-y-6">
      {/* ✅ 필터 */}
      {availableFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableFilters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setOpenCardId(null); // ✅ 필터 변경 시 열려 있던 카드 닫기
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

      {/* ✅ 예약 카드 리스트 */}
      {filtered.map((r) => (
        <div key={r.id}>
          <div
            className={`cursor-pointer transition-all ${
              openCardId === r.id ? "ring-2 ring-primary/30 rounded-2xl" : ""
            }`}
            onClick={() => setOpenCardId((prev) => (prev === r.id ? null : r.id))}
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

          {/* ✅ 카드 아래 버튼 */}
          {openCardId === r.id && (
            <div className="mt-3 mb-4 flex justify-center gap-3">
              {r.status === "pending" && (
                <>
                  <Button
                    label="예약 변경"
                    variant="secondary"
                    className="w-1/3 h-11"
                    onClick={() => {
                      // TODO: 예약 변경 기능 추가 예정
                      console.log("예약 변경 클릭");
                    }}
                  />
                  <Button
                    label="예약 취소"
                    variant="outline"
                    className="w-1/3 h-11"
                    onClick={() => {
                      setTargetReservation(r);
                      setOpenCancelModal(true); // 취소 모달 열기
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
                    setSelectedReservation(r);   // 클릭된 예약 정보를 저장
                    setOpenReviewModal(true);    // 후기 모달 열기
                  }}
                />
              )}
            </div>
          )}
        </div>
      ))}

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
        onClose={() => setOpenReviewModal(false)}
        confirmText="작성하기"
        cancelText="취소"
        onConfirm={handleSubmitReview}
        widthClass="max-w-sm"
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
                {/* {selectedReservation.endTime} ({selectedReservation.participants}명) */}
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
  ) : (
    <section className="flex flex-col items-center justify-center text-center py-20">
      <Image src={logoAuth} alt="예약 없음" width={122} height={122} className="mb-4" />
      <p className="typo-16-m text-gray-600 mb-[30px]">아직 예약한 체험이 없어요</p>
      <Link href="/activities">
        <Button label="둘러보기" variant="primary" className="w-[182px] h-[54px]" />
      </Link>
    </section>
  );
}

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
