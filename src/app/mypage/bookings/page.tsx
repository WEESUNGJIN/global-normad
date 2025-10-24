"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ListCard from "@/components/ListCard";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import StarRatingInput from "@/components/StarRatingInput";
import logoAuth from "@/assets/img/empty_state.png";
import warningImg from "@/assets/img/warning_state.png";
import api from "@/utils/api";
import { MyReservationsResponse, Reservation } from "@/types/reservation";

type ReservationFilter =
  | "all"
  | "pending"
  | "canceled"
  | "confirmed"
  | "declined"
  | "completed";

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
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [targetReservation, setTargetReservation] =
    useState<Reservation | null>(null);

  // ✅ 무한 스크롤 상태
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const PAGE_SIZE = 5;

  // ✅ 예약 데이터 불러오기 (React 권장 구조)
  useEffect(() => {
    if (!hasMore) return;

    const loadReservations = async () => {
      try {
        setIsFetching(true);
        const res = await api.get<MyReservationsResponse>(
          `/my-reservations?page=${page}&limit=${PAGE_SIZE}`
        );

        if (res.reservations.length === 0) {
          setHasMore(false);
        } else {
          setReservations((prev) => [...prev, ...res.reservations]);
        }
      } catch (err) {
        console.error("예약 리스트 조회 실패:", err);
      } finally {
        setIsFetching(false);
        setLoading(false);
      }
    };

    loadReservations();
  }, [page, hasMore]);

  // ✅ IntersectionObserver (스크롤 감지)
  useEffect(() => {
    if (!hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  // ✅ 필터 적용
  const filtered = useMemo(
    () => reservations.filter((r) => (filter === "all" ? true : r.status === filter)),
    [reservations, filter]
  );

  // ✅ 필터 표시 여부
  const availableFilters = useMemo(() => {
    if (reservations.length === 0) return [];
    return filterOrder;
  }, [reservations]);

  // ✅ 후기 제출
  const handleSubmitReview = async () => {
    if (!selectedReservation) return;
    try {
      console.log("후기 등록:", {
        reservationId: selectedReservation.id,
        rating,
        content,
      });
      // TODO: 후기 등록 API 연동 예정
      setOpenReviewModal(false);
      setRating(0);
      setContent("");
    } catch (err) {
      console.error("후기 등록 실패:", err);
    }
  };

  // ✅ 예약 취소
  const handleCancelReservation = async () => {
    if (!targetReservation) return;
    try {
      console.log("예약 취소 요청:", targetReservation.id);
      // TODO: 실제 API 연동 예정
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
              ctaLabel="후기 작성"
            />
          </div>

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

      {/* ✅ 무한스크롤 감시용 엘리먼트 */}
      {hasMore && (
        <div
          ref={observerRef}
          className="h-10 flex justify-center items-center text-gray-400"
        >
          {isFetching ? "불러오는 중..." : "아래로 스크롤"}
        </div>
      )}

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
          <Image src={warningImg} alt="경고" width={72} height={72} className="mb-4" />
          <p className="typo-16-b text-gray-900 mb-2">예약을 취소하시겠어요?</p>
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
            <div className="text-center mb-4">
              <p className="typo-16-b text-gray-900">
                {selectedReservation.activity.title}
              </p>
              <p className="typo-14-m text-gray-500">
                {selectedReservation.date} / {selectedReservation.startTime} -{" "}
                {selectedReservation.endTime}
              </p>
            </div>
            <StarRatingInput initialRating={rating} onChange={setRating} />
            <div className="mt-5">
              <p className="typo-14-b mb-2 text-gray-800">소중한 경험을 들려주세요</p>
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
      <Link href="/">
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
