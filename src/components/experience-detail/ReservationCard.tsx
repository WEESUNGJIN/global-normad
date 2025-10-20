"use client";

import { useState } from "react";
import Image from "next/image";

import MinusIcon from "@/assets/icon/icon_minus.svg";
import PlusIcon from "@/assets/icon/icon_plus.svg";

export default function ReservationCard() {
  const [count, setCount] = useState(1);
  const [selectedTime, setSelectedTime] = useState("15:00~16:00");

  const handleMinus = () => setCount((prev) => Math.max(1, prev - 1));
  const handlePlus = () => setCount((prev) => prev + 1);

  return (
    <div className="p-6 w-100 rounded-3xl border border-gray-100 shadow-searchbar bg-white">
      {/* 가격 */}
      <div className="flex items-center mb-6">
        <p className="typo-24-b text-gray-950 leading-none">₩1,000</p>
        <span className="typo-20-m text-gray-700 ml-1.5">/ 인</span>
      </div>

      {/* 날짜 선택 */}
      <div className="mb-6">
        <p className="typo-16-b text-gray-950 mb-3">날짜</p>
        <div className="w-full h-[280px] rounded-xl flex items-center justify-center text-gray-950 bg-gray-100">
          {/* react-datepicker 들어올 자리 */}
          달력 컴포넌트
        </div>
      </div>

      {/* 인원 선택 */}
      <div className="flex items-center justify-between mb-6">
        <p className="typo-16-b text-gray-950">참여 인원 수</p>
        <div className="flex gap-5 px-5 items-center justify-between border border-gray-200 rounded-full py-3">
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
            <Image src={PlusIcon} alt="빼기 아이콘" width={20} height={20} />
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
            className={`w-full py-4 typo-16-m rounded-xl mt-4 border border-gray-100 transition ${
              selectedTime === time
                ? "bg-primary-100 text-primary border-transparent"
                : "border-gray-200 text-gray-950"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 mt-6">
        {/* 왼쪽: 총 합계 */}
        <div className="flex gap-2">
          <p className="typo-20-m text-gray-700">총 합계</p>
          <p className="typo-20-b text-gray-950">
            ₩{(count * 10000).toLocaleString()}
          </p>
        </div>

        {/* 오른쪽: 예약 버튼 */}
        <button className="flex-shrink-0 px-10 py-3.5 rounded-2xl bg-primary text-white typo-16-b">
          예약하기
        </button>
      </div>
    </div>
  );
}
