"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import api from "@/utils/api";
import ReservationDatePicker from "@/components/experience-detail/ReservationDatePicker";
import MinusIcon from "@/assets/icon/icon_minus.svg";
import PlusIcon from "@/assets/icon/icon_plus.svg";
import ArrowLeftIcon from "@/assets/icon/icon_arrow_left.svg";

interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

interface Experience {
  id: number;
  price: number;
  schedules: Schedule[];
}

interface ReservationBottomSheetProps {
  activityId: number;
  price: number;
  onClose: () => void;
  onConfirm: (data: { date: Date; time: string; count: number }) => void; // ✅ 선택 데이터만 전달
  initialData?: { date: Date; time: string; count: number } | null;
}

export default function ReservationBottomSheet({
  activityId,
  onClose,
  onConfirm,
  initialData,
}: ReservationBottomSheetProps) {
  const [activity, setActivity] = useState<Experience | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialData?.date ?? null,
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(
    initialData?.time ?? null,
  );
  const [count, setCount] = useState(initialData?.count ?? 1);
  const [step, setStep] = useState<"date" | "count">("date");
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const availableDates =
    activity?.schedules.map((s) => {
      const [year, month, day] = s.date.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      d.setHours(9, 0, 0, 0);
      return d;
    }) ?? [];

  const availableTimes =
    selectedDate && activity
      ? activity.schedules
          .filter((s) => {
            const [year, month, day] = s.date.split("-").map(Number);
            const d = new Date(year, month - 1, day);
            d.setHours(9, 0, 0, 0);
            return selectedDate.toDateString() === d.toDateString();
          })
          .map((s) => `${s.startTime}~${s.endTime}`)
      : [];

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      alert("날짜와 시간을 선택해주세요.");
      return;
    }

    if (isMobile && step === "date") {
      setStep("count");
      return;
    }

    // ✅ 예약 정보만 상위로 전달
    onConfirm({ date: selectedDate, time: selectedTime, count });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/50 flex items-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full bg-white rounded-t-3xl p-6 md:p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
        {isMobile ? (
          <>
            {step === "date" && (
              <>
                <p className="typo-18-b mb-[10px] text-gray-950">날짜</p>
                <ReservationDatePicker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  includeDates={availableDates}
                />

                <div className="mt-8">
                  <p className="typo-16-b mb-4 text-gray-950">
                    예약 가능한 시간
                  </p>
                  {availableTimes.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={clsx(
                            "w-full py-4 typo-16-m rounded-xl border transition",
                            selectedTime === time
                              ? "bg-primary text-white border-transparent"
                              : "border-gray-200 text-gray-950",
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center typo-16-m text-gray-700">
                      날짜를 선택해주세요.
                    </p>
                  )}
                </div>
              </>
            )}

            {step === "count" && (
              <>
                <div className="flex items-center mb-2">
                  <button onClick={() => setStep("date")} className="mr-2">
                    <Image
                      src={ArrowLeftIcon}
                      alt="뒤로가기"
                      width={24}
                      height={24}
                    />
                  </button>
                  <p className="typo-18-b text-gray-950">인원</p>
                </div>

                <p className="typo-16-m text-gray-800 mb-5">
                  예약할 인원을 선택해주세요.
                </p>

                <div className="flex items-center justify-between">
                  <p className="typo-16-b text-gray-950">참여 인원 수</p>
                  <div className="flex items-center justify-between border border-gray-300 rounded-xl px-5 py-3 min-w-[140px]">
                    <button
                      onClick={() => setCount((p) => Math.max(1, p - 1))}
                      className="flex items-center justify-center"
                    >
                      <Image
                        src={MinusIcon}
                        alt="빼기"
                        width={20}
                        height={20}
                      />
                    </button>
                    <span className="typo-16-b text-gray-800 text-center">
                      {count}
                    </span>
                    <button
                      onClick={() => setCount((p) => p + 1)}
                      className="flex items-center justify-center"
                    >
                      <Image
                        src={PlusIcon}
                        alt="더하기"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-6 md:gap-10">
            <div>
              <p className="typo-20-b mb-6 text-gray-950">날짜</p>
              <ReservationDatePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                includeDates={availableDates}
              />
            </div>

            <div className="bg-white md:shadow-searchbar md:rounded-2xl p-6 flex flex-col justify-between min-h-[380px]">
              <div>
                <p className="typo-16-b mb-4 text-gray-950">예약 가능한 시간</p>
                {availableTimes.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={clsx(
                          "w-full py-4 typo-16-m rounded-xl border transition",
                          selectedTime === time
                            ? "bg-primary text-white border-transparent"
                            : "border-gray-200 text-gray-950",
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center typo-16-m text-gray-700">
                    날짜를 선택해주세요.
                  </p>
                )}

                {availableTimes.length > 0 && (
                  <div className="mt-6">
                    <p className="typo-16-b text-gray-950 mb-3">참여 인원 수</p>
                    <div className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-8 py-4">
                      <button
                        onClick={() => setCount((p) => Math.max(1, p - 1))}
                        className="flex items-center justify-center"
                      >
                        <Image
                          src={MinusIcon}
                          alt="빼기"
                          width={20}
                          height={20}
                        />
                      </button>
                      <span className="typo-16-b text-gray-800">{count}</span>
                      <button
                        onClick={() => setCount((p) => p + 1)}
                        className="flex items-center justify-center"
                      >
                        <Image
                          src={PlusIcon}
                          alt="더하기"
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="pt-8">
          <button
            className={clsx(
              "w-full py-4 rounded-2xl typo-16-b transition",
              selectedDate && selectedTime
                ? "bg-primary text-white"
                : "bg-gray-300 text-white",
            )}
            disabled={!selectedDate || !selectedTime}
            onClick={handleConfirm} // ✅ 여기서 상위 전달만 수행
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
