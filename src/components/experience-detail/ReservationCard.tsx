"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import MinusIcon from "@/assets/icon/icon_minus.svg";
import PlusIcon from "@/assets/icon/icon_plus.svg";
import ReservationDatePicker from "@/components/experience-detail/ReservationDatePicker";

interface ReservationCardProps {
  price: number;
}

export default function ReservationCard({ price }: ReservationCardProps) {
  const [count, setCount] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleMinus = () => setCount((prev) => Math.max(1, prev - 1));
  const handlePlus = () => setCount((prev) => prev + 1);

  const handleReserve = () => {
    if (!selectedDate || !selectedTime) {
      alert("날짜와 시간을 모두 선택해주세요.");
      return;
    }
    alert("예약이 완료되었습니다.");
  };

  return (
    <div className="p-6 w-100 rounded-3xl border border-gray-100 shadow-searchbar bg-white">
      {/* 가격 */}
      <div className="flex items-center mb-6">
        <p className="typo-24-b text-gray-950 leading-none">
          ₩{price.toLocaleString()}
        </p>
        <span className="typo-20-m text-gray-700 ml-1.5">/ 인</span>
      </div>

      {/* 날짜 선택 */}
      <div className="mb-6">
        <p className="typo-16-b text-gray-950 mb-3">날짜</p>
        <div className="w-full overflow-hidden">
          <ReservationDatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      </div>

      {/* 인원 선택 */}
      <div className="flex items-center justify-between mb-6">
        <p className="typo-16-b text-gray-950">참여 인원 수</p>
        <div className="min-w-[140px] flex gap-5 px-5 items-center justify-between border border-gray-200 rounded-full py-3">
          <button
            className="w-5 h-5 flex items-center justify-center"
            onClick={handleMinus}
          >
            <Image src={MinusIcon} alt="빼기 아이콘" width={20} height={20} />
          </button>
          <span className="typo-16-b text-gray-950">{count}</span>
          <button
            className="w-5 h-5 flex items-center justify-center"
            onClick={handlePlus}
          >
            <Image src={PlusIcon} alt="더하기 아이콘" width={20} height={20} />
          </button>
        </div>
      </div>

      {/* 예약 가능한 시간 */}
      <div className="pb-6 border-b border-gray-100">
        <p className="typo-16-b text-gray-950">예약 가능한 시간</p>
        {["14:00~15:00", "15:00~16:00"].map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={clsx(
              "w-full py-4 typo-16-m rounded-xl mt-4 border transition",
              selectedTime === time
                ? "bg-primary text-white border-transparent"
                : "border-gray-200 text-gray-950 hover:text-primary",
            )}
          >
            {time}
          </button>
        ))}
      </div>

      {/* 총 합계 + 예약 버튼 */}
      <div className="flex items-center justify-between gap-4 mt-6">
        <div className="flex gap-2">
          <p className="typo-20-m text-gray-700">총 합계</p>
          <p className="typo-20-b text-gray-950">
            ₩{(count * price).toLocaleString()}
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
          disabled={!selectedTime}
        >
          예약하기
        </button>
      </div>
    </div>
  );
}
