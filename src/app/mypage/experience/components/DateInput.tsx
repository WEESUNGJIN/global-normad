"use client";

import { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import IconCalendar from "@/assets/icon/icon_calendar.svg";

interface DateInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export default function DateInput({ value, onChange }: DateInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleIconClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="relative flex justify-between items-center  w-full sm:w-[344px] md:w-[360px] h-[54px] px-5 py-4 gap-[10px]
      bg-white border border-gray-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)] rounded-2xl
      box-border"
    >
      <DatePicker
        selected={value}
        onChange={(date) => onChange(date)}
        dateFormat="yy/MM/dd"
        placeholderText="yy/mm/dd"
        className="typo-16-m text-gray-400 focus:outline-none"
      />
      <button type="button" onClick={handleIconClick}>
        <Image src={IconCalendar} alt="캘린더 아이콘" width={24} height={24} />
      </button>
    </div>
  );
}
