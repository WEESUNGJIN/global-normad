"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

// =======================================================================
// ✅ 환경 감지 훅 추가
// =======================================================================
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const mobileWidth = 768; // 일반적으로 태블릿/모바일 경계

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};
// =======================================================================

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

const PAGE_SIZE = 5;

type PageMeta = {
  page?: number;
  totalPages?: number;
  isLastPage?: boolean;
  nextCursor?: string | null;
};

function inferIsLastPage(
  res: MyReservationsResponse & PageMeta,
  receivedCount: number,
  pageSize: number,
): boolean {
  if (typeof res.isLastPage === "boolean") return res.isLastPage;
  if ("nextCursor" in res) return (res.nextCursor ?? null) === null;
  if (typeof res.page === "number" && typeof res.totalPages === "number") {
    return res.page >= res.totalPages;
  }
  return receivedCount < pageSize;
}

export default function BookingsPage() {
  const router = useRouter();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<ReservationFilter>("all");

  // ✅ 모바일 환경 상태 가져오기
  const isMobile = useIsMobile();

  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [targetReservation, setTargetReservation] =
    useState<Reservation | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const seenIdsRef = useRef<Set<number>>(new Set());

  // ✅ 예약 리스트 불러오기
  useEffect(() => {
    if (!hasMore) {
      setLoading(false);
      return;
    }

    let aborted = false;

    const loadReservations = async () => {
      try {
        setIsFetching(true);

        const res = await api.get<MyReservationsResponse & PageMeta>(
          `/my-reservations?page=${page}&limit=${PAGE_SIZE}`,
        );

        if (aborted) return;

        const incoming = res.reservations ?? [];
        const uniqueNew = incoming.filter((r) => !seenIdsRef.current.has(r.id));
        const noNewItems = uniqueNew.length === 0;
        const isEnd =
          inferIsLastPage(res, incoming.length, PAGE_SIZE) || noNewItems;

        if (uniqueNew.length > 0) {
          setReservations((prev) => {
            const map = new Map<number, Reservation>();
            prev.forEach((p) => map.set(p.id, p));
            uniqueNew.forEach((n) => {
              map.set(n.id, n);
              seenIdsRef.current.add(n.id);
            });
            return Array.from(map.values());
          });
        }

        if (isEnd) setHasMore(false);
      } catch (err) {
        console.error("예약 리스트 조회 실패:", err);
        setHasMore(false);
      } finally {
        if (!aborted) {
          setIsFetching(false);
          setLoading(false);
        }
      }
    };

    loadReservations();
    return () => {
      aborted = true;
    };
  }, [page, hasMore]);

  // ✅ 무한 스크롤 감시
  useEffect(() => {
    if (!hasMore || isFetching) return;
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  // ✅ 클라이언트 필터
  const filtered = useMemo(
    () =>
      reservations.filter((r) =>
        filter === "all" ? true : r.status === filter,
      ),
    [reservations, filter],
  );

  // ✅ 후기 작성 (서버 저장)
  const handleSubmitReview = async () => {
    if (!selectedReservation) return;
    try {
      const { id: reservationId } = selectedReservation;

      await api.post(`/my-reservations/${reservationId}/reviews`, {
        rating,
        content,
      });

      setReservations((prev) =>
        prev.map((r) =>
          r.id === selectedReservation.id ? { ...r, reviewSubmitted: true } : r,
        ),
      );

      setOpenReviewModal(false);
      setRating(0);
      setContent("");
      alert("후기가 성공적으로 등록되었습니다!");
    } catch (err: unknown) {
      console.error("후기 등록 실패:", err);
      const apiError = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      if (apiError.response?.data?.message) {
        alert(`후기 등록 실패: ${apiError.response.data.message}`);
      } else {
        alert("후기 등록 중 오류가 발생했습니다.");
      }
    }
  };

  // ✅ 예약 취소
  const handleCancelReservation = async () => {
    if (!targetReservation) return;
    try {
      console.log("예약 취소 요청:", targetReservation.id);

      await api.patch(`/my-reservations/${targetReservation.id}`, {
        status: "canceled",
      });

      setReservations((prev) =>
        prev.map((r) =>
          r.id === targetReservation.id ? { ...r, status: "canceled" } : r,
        ),
      );

      setOpenCancelModal(false);
      setTargetReservation(null);
      alert("예약이 성공적으로 취소되었습니다.");
    } catch (err) {
      console.error("❌ 예약 취소 실패:", err);
      const apiError = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      if (apiError.response?.data?.message) {
        alert(`예약 취소 실패: ${apiError.response.data.message}`);
      } else {
        alert("예약 취소 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) return <p>로딩 중...</p>;

  const hasReservations = reservations.length > 0;

  return hasReservations ? (
    <div className="space-y-6">
      {/* ✅ 필터 */}
      <div
        className={`flex gap-2 ${
          isMobile
            ? "overflow-x-auto no-scrollbar flex-nowrap -mx-2 px-2"
            : "flex-wrap"
        }`}
      >
        {filterOrder.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full border whitespace-nowrap ${
              filter === f
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            {filterLabel(f)}
          </button>
        ))}
      </div>

      {/* ✅ 예약 카드 */}
<<<<<<< HEAD
      {filtered.map((r) => {
        // ✅ 여기가 올바른 위치입니다.
        console.log("예약 데이터:", r);
=======
      {filtered.map((r) => (
        <div key={r.id}>
          <div className="cursor-pointer transition-all">
            <ListCard
              // ✅ ListCard에 환경 variant 전달 및 mx-auto로 중앙 정렬
              variant={isMobile ? "mobile" : "pc"}
              className="mx-auto"
              thumbnail={r.activity.bannerImageUrl}
              title={r.activity.title}
              subtitle={`${r.date} · ${r.startTime} - ${r.endTime}`}
              status={r.status}
              price={`₩${r.totalPrice.toLocaleString()}`}
              ctaLabel={
                r.status === "completed"
                  ? r.reviewSubmitted
                    ? "후기 완료"
                    : "후기 작성"
                  : undefined
              }
              // ListCard 내부에서 액션 버튼을 렌더링하도록 콜백 함수만 전달합니다.
              onClickCTA={() => {
                setSelectedReservation(r);
                setOpenReviewModal(true);
              }}
              onClickChange={() =>
                router.push(
                  `/experience-detail/${r.activity.id}?mode=edit&reservationId=${r.id}`,
                )
              }
              onClickCancel={() => {
                setTargetReservation(r);
                setOpenCancelModal(true);
              }}
            />
          </div>
>>>>>>> dev

        return (
          <div key={r.id}>
            <div className="cursor-pointer transition-all">
              <ListCard
                // ✅ 모바일이면 'mobile', PC면 'pc' 버전으로 렌더
                variant={isMobile ? "mobile" : "pc"}
                className="mx-auto"
                thumbnail={r.activity.bannerImageUrl}
                title={r.activity.title}
                subtitle={`${r.date} · ${r.startTime} - ${r.endTime}`}
                peopleText={`${r.headCount}명`}
                status={r.status}
                price={`₩${r.totalPrice.toLocaleString()}`}
                ctaLabel={
                  r.status === "completed"
                    ? r.reviewSubmitted
                      ? "후기 완료"
                      : "후기 작성"
                    : undefined
                }
                onClickCTA={() => {
                  // ✅ 후기 완료된 경우 클릭 막기
                  if (r.reviewSubmitted) return;
                  setSelectedReservation(r);
                  setOpenReviewModal(true);
                }}
                onClickChange={() =>
                  router.push(`/experience-detail/${r.activity.id}`)
                }
                onClickCancel={() => {
                  setTargetReservation(r);
                  setOpenCancelModal(true);
                }}
              />
            </div>
          </div>
        );
      })}

      {/* ✅ 비어있을 때 */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white py-10 text-center text-gray-500">
          해당 조건의 예약이 없습니다.
        </div>
      )}

      {/* ✅ 무한스크롤 */}
      {hasMore && filtered.length > 0 && (
        <div
          ref={observerRef}
          className="h-10 flex justify-center items-center text-gray-400"
        >
          {isFetching ? "불러오는 중..." : "아래로 스크롤"}
        </div>
      )}

      {/* ✅ 예약 취소 모달 */}
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
      <Link href="/">
        <Button
          label="둘러보기"
          variant="primary"
          className="w-[182px] h-[54px]"
        />
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
<<<<<<< HEAD
} 

=======
}
>>>>>>> dev
