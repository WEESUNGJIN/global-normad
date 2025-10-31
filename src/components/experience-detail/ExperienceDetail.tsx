"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import GNB from "@/components/GNB";
import Footer from "@/components/Footer";
import ExperienceDetailImages from "@/components/experience-detail/ExperienceDetailImages";
import ExperienceDetailInfo from "@/components/experience-detail/ExperienceDetailInfo";
import ExperienceDetailDescription from "@/components/experience-detail/ExperienceDetailDescription";
import ExperienceDetailMap from "@/components/experience-detail/ExperienceDetailMap";
import ExperienceDetailReviews from "@/components/experience-detail/ExperienceDetailReviews";
import ReservationCard from "@/components/experience-detail/ReservationCard";
import ReservationBottomSheet from "@/components/experience-detail/ReservationBottomSheet";
import Modal from "@/components/Modal";
import api from "@/utils/api";
import type { AxiosError } from "axios";

interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

interface SubImage {
  id: number;
  imageUrl: string;
}

interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImages?: SubImage[];
  subImageUrls?: string[];
  reviewCount: number;
  rating: number;
  schedules?: Schedule[];
}

interface Reservation {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface ExperienceDetailProps {
  activityId: number;
}

export default function ExperienceDetail({
  activityId,
}: ExperienceDetailProps) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);

  const [selectedReservation, setSelectedReservation] = useState<{
    date: Date;
    time: string;
    count: number;
  } | null>(null);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [reservationId, setReservationId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");
      const id = params.get("reservationId");
      setIsEditMode(mode === "edit");
      setReservationId(id);
      console.log("🔍 URL 파라미터 확인:", { mode, id });
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const activityRes = (await api.get(
          `activities/${activityId}`,
        )) as Activity;
        if (!activityRes) return;

        const storedAuth = localStorage.getItem("auth-storage");
        const currentUser = storedAuth
          ? JSON.parse(storedAuth)?.state?.user
          : null;

        const normalizedActivity: Activity = {
          ...activityRes,
          subImages:
            activityRes.subImages && activityRes.subImages.length > 0
              ? activityRes.subImages
              : activityRes.subImageUrls
                ? activityRes.subImageUrls.map((url, idx) => ({
                    id: idx,
                    imageUrl: url,
                  }))
                : [],
        };

        setActivity(normalizedActivity);
        setIsOwner(currentUser && currentUser.id === normalizedActivity.userId);
      } catch (err) {
        console.error("체험 상세 조회 실패:", err);
      }
    }

    fetchData();
  }, [activityId]);

  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        const res = await api.get<{ reservations: Reservation[] }>(
          `/my-reservations?page=1&limit=100`,
        );
        setMyReservations(res.reservations || []);
      } catch (err) {
        console.error("내 예약 목록 불러오기 실패:", err);
      }
    };
    fetchMyReservations();
  }, []);

  // 예약 시트 연 상태로 데스크탑 변경 시 시트 안보이게
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSheetOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!activity)
    return (
      <p className="text-center typo-16-m text-gray-800 pt-6">로딩 중...</p>
    );

  // 예약 변경 (변경 모드 → 취소 후 새 예약 생성)
  const handleReserve = async () => {
    if (!selectedReservation || !activity) return;

    const { date, time, count } = selectedReservation;

    const selectedDateStr = date.toISOString().split("T")[0];
    const isDuplicate = myReservations.some(
      (r) =>
        r.date === selectedDateStr &&
        `${r.startTime}~${r.endTime}` === time &&
        r.status !== "canceled" &&
        r.status !== "declined",
    );

    if (isDuplicate) {
      setModalMessage("이미 해당 시간대에 예약이 있습니다.");
      setIsModalOpen(true);
      return;
    }

    try {
      const matchedSchedule = activity.schedules?.find((s) => {
        const scheduleDate = new Date(s.date);
        return (
          scheduleDate.toDateString() === date.toDateString() &&
          `${s.startTime}~${s.endTime}` === time
        );
      });

      if (!matchedSchedule) {
        setModalMessage("선택한 스케줄을 찾을 수 없습니다.");
        setIsModalOpen(true);
        return;
      }

      if (isEditMode && reservationId) {
        // 기존 예약 취소
        await api.patch(`/my-reservations/${reservationId}`, {
          status: "canceled",
        });

        // 새 예약 생성
        await api.post(`/activities/${activity.id}/reservations`, {
          scheduleId: matchedSchedule.id,
          headCount: count,
        });

        setModalMessage("예약이 성공적으로 변경되었습니다.");
      } else {
        await api.post(`/activities/${activity.id}/reservations`, {
          scheduleId: matchedSchedule.id,
          headCount: count,
        });
        setModalMessage("예약이 완료되었습니다.");
      }

      setIsModalOpen(true);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 409) {
        setModalMessage("이미 신청된 예약입니다.");
      } else {
        setModalMessage("예약 처리 중 오류가 발생했습니다.");
      }
      setIsModalOpen(true);
    }
  };

  return (
    <main>
      <GNB />

      <div className="relative px-6 md:px-8 lg:px-80 pb-[120px] lg:pb-44">
        {/* 모바일 및 태블릿 */}
        <div className="lg:hidden flex flex-col">
          <ExperienceDetailImages
            images={
              Array.isArray(activity.subImages) && activity.subImages.length > 0
                ? activity.subImages
                : [{ id: 0, imageUrl: activity.bannerImageUrl }]
            }
          />

          <ExperienceDetailInfo
            title={activity.title}
            category={activity.category}
            address={activity.address}
            rating={activity.rating}
            reviewCount={activity.reviewCount}
            isOwner={isOwner}
            id={String(activity.id)}
          />
          <ExperienceDetailDescription description={activity.description} />
          <ExperienceDetailMap address={activity.address} />
          {activity && (
            <ExperienceDetailReviews
              activityId={activity.id}
              reviewCount={activity.reviewCount}
              rating={activity.rating}
            />
          )}
        </div>

        {/* 데스크탑 */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_400px] lg:gap-10 pt-16">
          <div className="flex flex-col">
            <ExperienceDetailImages
              images={
                Array.isArray(activity.subImages) &&
                activity.subImages.length > 0
                  ? activity.subImages
                  : [{ id: 0, imageUrl: activity.bannerImageUrl }]
              }
            />
            <ExperienceDetailDescription description={activity.description} />
            <ExperienceDetailMap address={activity.address} />
            {activity && (
              <ExperienceDetailReviews
                activityId={activity.id}
                reviewCount={activity.reviewCount}
                rating={activity.rating}
              />
            )}
          </div>

          <div className="flex flex-col top-32 gap-16 h-fit">
            <ExperienceDetailInfo
              title={activity.title}
              category={activity.category}
              address={activity.address}
              rating={activity.rating}
              reviewCount={activity.reviewCount}
              isOwner={isOwner}
              id={String(activity.id)}
            />
            {!isOwner && (
              <ReservationCard
                activityId={activity.id}
                isEditMode={isEditMode}
                reservationId={reservationId}
              />
            )}
          </div>
        </div>
      </div>

      {/* 하단 예약 바 */}
      {!isOwner && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full z-[9000] bg-white border-t border-gray-100 px-6 pt-[22px] pb-[max(env(safe-area-inset-bottom),16px)]">
          <div className="flex items-center justify-between mb-3">
            <p className="typo-18-b text-gray-950">
              ₩
              {(
                (activity.price ?? 0) * (selectedReservation?.count ?? 1)
              ).toLocaleString()}{" "}
              <span className="typo-16-m text-gray-600">
                / {selectedReservation?.count ?? 1}명
              </span>
            </p>

            {selectedReservation ? (
              <button
                onClick={() => setIsSheetOpen(true)}
                className="typo-16-b text-primary border-b-2 border-primary"
              >
                {`${String(selectedReservation.date.getFullYear()).slice(2)}/${String(
                  selectedReservation.date.getMonth() + 1,
                ).padStart(2, "0")}/${String(
                  selectedReservation.date.getDate(),
                ).padStart(2, "0")} ${selectedReservation.time}`}
              </button>
            ) : (
              <button
                className="typo-16-b text-primary border-b-2 border-primary"
                onClick={() => setIsSheetOpen(true)}
              >
                날짜 선택하기
              </button>
            )}
          </div>

          {/* 예약 버튼 활성화 조건 */}
          <button
            className={clsx(
              "w-full py-4 rounded-[14px] typo-16-b transition",
              selectedReservation
                ? "bg-primary text-white"
                : "bg-gray-300 text-white",
            )}
            disabled={!selectedReservation}
            onClick={handleReserve}
          >
            예약하기
          </button>
        </div>
      )}

      {/* 시트 연결 */}
      {isSheetOpen && (
        <ReservationBottomSheet
          activityId={activity.id}
          price={activity.price}
          initialData={selectedReservation}
          onClose={() => setIsSheetOpen(false)}
          onConfirm={(data) => setSelectedReservation(data)}
        />
      )}

      <Modal
        open={isModalOpen}
        confirmText="확인"
        showCancel={false}
        onConfirm={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        actionsMaxClass="max-w-[180px] md:max-w-[200px]"
      >
        <div className="mb-2">
          <h3 className="typo-16-b md:text-lg">{modalMessage}</h3>
        </div>
      </Modal>

      <Footer />
    </main>
  );
}
