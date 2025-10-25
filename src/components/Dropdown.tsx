"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";

import iconArrowDown from "@/assets/icon/icon_alt arrow_down.svg";
import iconArrowUp from "@/assets/icon/icon_alt arrow_up.svg";

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  label?: string | React.ReactNode;
  trigger?: "hover" | "click";
  customIcon?: string;
  highlightSelected?: boolean;
}

export default function Dropdown({
  options,
  onSelect,
  label,
  trigger = "hover",
  customIcon,
  highlightSelected = true,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  // hover 시 지연 닫힘 처리
  const handleMouseEnter = () => {
    if (trigger === "hover") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
    }
  };

  const handleClick = () => {
    if (trigger === "click") {
      setIsOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        onClick={handleClick} // ← 이 줄 추가
      >
        {label}
        {customIcon ? (
          <Image
            src={customIcon}
            alt="커스텀 아이콘"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
        ) : (
          <Image
            src={isOpen ? iconArrowUp : iconArrowDown}
            alt="드롭다운 화살표"
            width={20}
            height={20}
            className="w-5 h-5 object-contain transition-transform"
          />
        )}
      </button>

      {/* 드롭다운 */}
      <div
        className={clsx(
          "mt-2 absolute right-0 min-w-fit rounded-lg border border-gray-100 bg-white shadow-md z-50 transition-all duration-150 whitespace-nowrap",
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
              highlightSelected &&
                selected === option &&
                "font-semibold text-primary",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
