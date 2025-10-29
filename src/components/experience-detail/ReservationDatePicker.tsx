"use client";

import DatePicker from "react-datepicker";
import Image from "next/image";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import clsx from "clsx";
import "./datepicker-custom.css";

import iconArrowLeft from "@/assets/icon/icon_alt arrow_left.svg";
import iconArrowRight from "@/assets/icon/icon_alt arrow_right.svg";

interface ReservationDatePickerProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  includeDates?: Date[];
}

export default function ReservationDatePicker({
  selectedDate,
  setSelectedDate,
}: ReservationDatePickerProps) {
  return (
    <div className="w-full">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        inline
        locale={ko}
        dateFormat="yyyy.MM.dd"
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
          <div className="flex justify-between items-center w-full">
            {/* 월, 년도 (왼쪽 정렬) */}
            <span className="text-gray-950 typo-16-m">
              {date.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>

            {/* 달 이동 버튼 (오른쪽 정렬) */}
            <div className="flex gap-2">
              <button onClick={decreaseMonth}>
                <Image
                  src={iconArrowLeft}
                  alt="이전 달"
                  width={26}
                  height={26}
                />
              </button>
              <button onClick={increaseMonth}>
                <Image
                  src={iconArrowRight}
                  alt="다음 달"
                  width={26}
                  height={26}
                />
              </button>
            </div>
          </div>
        )}
        calendarClassName="custom-calendar"
        dayClassName={(date) => {
          const isSelected =
            selectedDate?.toDateString() === date.toDateString();

          const isToday = date.toDateString() === new Date().toDateString();

          return clsx(
            "w-10 h-10 flex items-center justify-center rounded-full transition-all",
            {
              // 선택된 날짜
              "bg-[#8A66FF] text-white": isSelected,

              // 오늘 날짜
              "bg-[#F1E1FF] text-[#8A66FF]": isToday && isSelected,

              "!bg-transparent": !isSelected && !isToday,
            },
          );
        }}
        formatWeekDay={(nameOfDay) => {
          const daysMap: Record<string, string> = {
            일요일: "S",
            월요일: "M",
            화요일: "T",
            수요일: "W",
            목요일: "T",
            금요일: "F",
            토요일: "S",
          };
          return daysMap[nameOfDay] || "";
        }}
      />
    </div>
  );
}
