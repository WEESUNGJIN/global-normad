"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";

import iconArrowDown from "@/assets/icon/icon_alt arrow_down.svg";
import iconArrowUp from "@/assets/icon/icon_alt arrow_up.svg";

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  label?: string;
}

export default function Dropdown({ options, onSelect, label }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  // hover 시 지연 닫힘 처리
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150); // ← 150ms 지연
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 버튼 */}
      <button
        type="button"
        className="flex items-center gap-1 typo-16-m text-gray-950 leading-none pr-3"
      >
        {label}
        <Image
          src={isOpen ? iconArrowUp : iconArrowDown}
          alt="드롭다운 화살표"
          width={20}
          height={20}
          className="w-5 h-5 object-contain transition-transform"
        />
      </button>

      {/* 드롭다운 */}
      <div
        className={clsx(
          "mt-2 absolute right-0 w-[103px] rounded-lg border border-gray-100 bg-white shadow-md z-50 transition-all duration-150",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={clsx(
              "block w-full text-center px-6 py-4 typo-16-m hover:bg-gray-50",
              selected === option && "font-semibold text-primary",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
