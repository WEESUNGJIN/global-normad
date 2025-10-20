"use client";

import DownArrow from "@/assets/icon/icon_alt arrow_down.svg";
import Image from "next/image";

interface Option {
  label: string;
  value: string;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  placeholder?: string;
}

export default function CategorySelect({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "선택해주세요",
}: CategorySelectProps) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`appearance-none w-full justify-between items-center p-4 gap-3 box-border
      bg-white border border-gray-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)] rounded-2xl
        ${value ? "text-gray-950" : "text-gray-400"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Image
        src={DownArrow}
        alt="아래화살표"
        width={24}
        height={24}
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
      />
    </div>
  );
}
