"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  label?: string;
}

export default function Dropdown({ options, onSelect, label }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  // 외부 클릭 시 닫힘
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-[4px] typo-16-m text-text-primary leading-none"
      >
        {label ?? selected ?? "선택"}
        <span className="w-4 h-4">▾</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[120px] rounded-xl border border-gray-100 bg-white shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={clsx(
                "block w-full text-left px-4 py-2 typo-14-m hover:bg-gray-50",
                selected === option && "font-semibold text-blue-500",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
