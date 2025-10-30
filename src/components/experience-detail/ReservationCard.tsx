"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import api from "@/utils/api";

import MinusIcon from "@/assets/icon/icon_minus.svg";
import PlusIcon from "@/assets/icon/icon_plus.svg";
import ReservationDatePicker from "@/components/experience-detail/ReservationDatePicker";
import Modal from "@/components/Modal";
import type { AxiosError } from "axios";

interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

interface Experience {
  id: number;
  title: string;
  price: number;
  schedules: Schedule[];
}

interface ReservationCardProps {
  activityId: number;
  isEditMode?: boolean;
  reservationId?: string | null;
}

export default function ReservationCard({
  activityId,
  isEditMode = false,
  reservationId = null,
}: ReservationCardProps) {
  const [activity, setActivity] = useState<Experience | null>(null);
  const [count, setCount] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get<Experience>(`/activities/${activityId}`);
        setActivity(res);
      } catch (err) {
        console.error("체험 데이터 불러오기 실패:", err);
      }
    };
    fetchActivity();
  }, [activityId]);

  const handleReserve = async () => {
    if (!selectedDate || !selectedTime || !activity) return;
    setIsSubmitting(true);

    const matchedSchedule = activity.schedules.find((s) => {
      const d = new Date(s.date);
      return (
        selectedDate.toDateString() === d.toDateString() &&
        `${s.startTime}~${s.endTime}` === selectedTime
      );
    });

    if (!matchedSchedule) {
      setIsSubmitting(false);
      setModalMessage("선택한 스케줄을 찾을 수 없습니다.");
      setIsModalOpen(true);
      return;
    }

    try {
      if (isEditMode && reservationId) {
        // 기존 예약 취소 + 새 예약 생성
        await api.patch(`/my-reservations/${reservationId}`, {
          status: "canceled",
        });
        await api.post(`/activities/${activityId}/reservations`, {
          scheduleId: matchedSchedule.id,
          headCount: count,
        });
        setModalMessage("예약이 성공적으로 변경되었습니다.");
      } else {
        await api.post(`/activities/${activityId}/reservations`, {
          scheduleId: matchedSchedule.id,
          headCount: count,
        });
        setModalMessage("예약이 완료되었습니다.");
      }
      setIsModalOpen(true);
    } catch (err) {
      const axiosError = err as AxiosError;
      setModalMessage(
        axiosError.response?.status === 409
          ? "이미 신청된 예약입니다."
          : "예약 처리 중 오류가 발생했습니다.",
      );
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-8 w-100 rounded-3xl border border-gray-100 shadow-searchbar bg-white">
      {/* 가격 */}
      {activity && (
        <div className="flex items-center mb-6">
          <p className="typo-24-b text-gray-950 leading-none">
            ₩{activity.price.toLocaleString()}
          </p>
          <span className="typo-20-m text-gray-700 ml-1.5">/ 인</span>
        </div>
      )}

      {/* 날짜 선택 */}
      <div className="mb-6">
        <p className="typo-16-b text-gray-950 mb-3">날짜</p>
        <div className="w-full overflow-hidden">
          <ReservationDatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            includeDates={
              activity?.schedules.map((s) => new Date(s.date)) ?? []
            }
          />
        </div>
      </div>

      {/* 인원 선택 */}
      <div className="flex items-center justify-between mb-6">
        <p className="typo-16-b text-gray-950">참여 인원 수</p>
        <div className="min-w-[140px] flex gap-5 px-5 items-center justify-between border border-gray-200 rounded-full py-3">
          <button onClick={() => setCount((prev) => Math.max(1, prev - 1))}>
            <Image src={MinusIcon} alt="빼기" width={20} height={20} />
          </button>
          <span className="typo-16-b text-gray-950">{count}</span>
          <button onClick={() => setCount((prev) => prev + 1)}>
            <Image src={PlusIcon} alt="더하기" width={20} height={20} />
          </button>
        </div>
      </div>

      {/* 예약 가능한 시간 */}
      <div className="pb-6 border-b border-gray-100">
        <p className="typo-16-b text-gray-950">예약 가능한 시간</p>
        {activity?.schedules.length ? (
          activity.schedules
            .filter((s) => {
              const d = new Date(s.date);
              return selectedDate?.toDateString() === d.toDateString();
            })
            .map((s) => `${s.startTime}~${s.endTime}`)
            .map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={clsx(
                  "w-full py-4 typo-16-m rounded-xl mt-4 border transition",
                  selectedTime === time
                    ? "bg-primary text-white border-transparent"
                    : "border-gray-200 text-gray-950",
                )}
              >
                {time}
              </button>
            ))
        ) : (
          <p className="text-gray-500 pt-10 pb-6 typo-14-m text-center">
            선택한 날짜에는 예약 가능한 시간이 없습니다.
          </p>
        )}
      </div>

      {/* 총 합계 + 예약 버튼 */}
      <div className="flex items-center justify-between gap-4 mt-6">
        <div className="flex gap-2">
          <p className="typo-20-m text-gray-700">총 합계</p>
          <p className="typo-20-b text-gray-950">
            ₩{((activity?.price ?? 0) * count).toLocaleString()}
          </p>
        </div>

        <button
          className={clsx(
            "flex-shrink-0 px-10 py-3.5 rounded-2xl typo-16-b transition",
            selectedTime
              ? "bg-primary text-white"
              : "bg-gray-300 text-white cursor-not-allowed",
          )}
          onClick={handleReserve}
          disabled={!selectedTime || isSubmitting}
        >
          예약하기
        </button>
      </div>

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
    </div>
  );
}
