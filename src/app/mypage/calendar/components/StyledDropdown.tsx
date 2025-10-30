"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import DownArrow from "@/assets/icon/icon_alt arrow_down.svg";

export type DropdownOption = { label: string; value: string | number };

type Props = {
  options: DropdownOption[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  /** 필요시 외부에서 width만 감싸고 싶다면 true로 (기본 false) */
  fluid?: boolean;
};

export default function StyledDropdown({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  fluid = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [highlight, setHighlight] = useState<number>(-1);

  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value]
  );

  // 외부 클릭 닫기
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlight(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // 키보드 접근성
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      setHighlight(0);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, options.length - 1));
      scrollIntoView(Math.min(highlight + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
      scrollIntoView(Math.max(highlight - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlight >= 0 && highlight < options.length) {
        onChange(options[highlight].value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  const scrollIntoView = (index: number) => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[index] as HTMLElement | undefined;
    if (item) item.scrollIntoView({ block: "nearest" });
  };

  return (
    <div ref={rootRef} className={`relative ${fluid ? "w-full" : ""}`}>
      {/* 버튼 영역: 기존 select와 동일한 크기/느낌 */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`w-full h-[56px] px-4 text-left
          bg-white border border-gray-100 rounded-2xl
          shadow-[0_2px_6px_rgba(0,0,0,0.02)]
          text-gray-950 typo-14-m
          hover:border-primary hover:shadow-[0_4px_10px_rgba(0,0,0,0.04)]
          focus:outline-none focus:ring-2 focus:ring-primary/20
          transition-all duration-200`}
      >
        <span className="block truncate">
          {selected ? selected.label : placeholder}
        </span>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <Image
            src={DownArrow}
            alt="열기"
            width={22}
            height={22}
            className={`opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {/* 목록 */}
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 w-full max-h-[280px] overflow-y-auto
                     bg-white border border-gray-100 rounded-2xl shadow-lg
                     py-1"
        >
          {options.length === 0 ? (
            <li
              className="px-4 py-3 text-gray-400 text-sm"
              aria-disabled="true"
            >
              데이터가 없습니다
            </li>
          ) : (
            options.map((opt, idx) => {
              const active = highlight === idx;
              const selected = value === opt.value;
              return (
                <li
                  key={`${opt.value}`}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setHighlight(idx)}
                  onMouseDown={(e) => {
                    // onClick은 blur 타이밍 이슈 있으니 mousedown 사용
                    e.preventDefault();
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`px-4 py-3 cursor-pointer text-[14px]
                    ${active ? "bg-gray-50" : "bg-white"}
                    ${selected ? "text-primary" : "text-gray-700"}
                    transition`}
                >
                  {opt.label}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
