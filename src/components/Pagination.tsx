"use client";
import clsx from "clsx";
import Image from "next/image";

import chevronLeft from "@/assets/icon/icon_chevron_left.svg";
import chevronRight from "@/assets/icon/icon_chevron_right.svg";
import chevronLeftHover from "@/assets/icon/icon_chevron_left_hover.svg";
import chevronRightHover from "@/assets/icon/icon_chevron_right_hover.svg";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange?: (p: number) => void;
  className?: string;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: PaginationProps) {
  const go = (p: number) => onChange?.(Math.max(1, Math.min(totalPages, p)));
  const items = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={clsx(
        "w-full flex items-center justify-center gap-2 bg-white",
        className,
      )}
    >
      {/* 이전 버튼 */}
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="이전"
        className={clsx(
          "h-8 w-8 flex items-center justify-center transition",
          page === 1
            ? "opacity-40 cursor-default"
            : "group hover:opacity-100 opacity-80",
        )}
      >
        {page === 1 ? (
          <Image src={chevronLeft} alt="이전" width={20} height={20} />
        ) : (
          <>
            <Image
              src={chevronLeft}
              alt="이전"
              width={20}
              height={20}
              className="group-hover:hidden"
            />
            <Image
              src={chevronLeftHover}
              alt="이전(호버)"
              width={20}
              height={20}
              className="hidden group-hover:block"
            />
          </>
        )}
      </button>

      {/* 페이지 번호 */}
      <div className="flex items-center gap-1">
        {items.map((n) => (
          <button
            key={n}
            onClick={() => go(n)}
            disabled={n === page}
            className={clsx(
              "relative w-10 h-10 typo-14-b transition-all duration-150",
              n === page
                ? "text-gray-950 after:absolute after:content-[''] after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-primary"
                : "text-gray-300 hover:text-gray-950",
            )}
          >
            {n}
          </button>
        ))}
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        aria-label="다음"
        className={clsx(
          "h-8 w-8 flex items-center justify-center transition",
          page === totalPages
            ? "opacity-40 cursor-default"
            : "group hover:opacity-100 opacity-80",
        )}
      >
        {page === totalPages ? (
          <Image src={chevronRight} alt="다음" width={20} height={20} />
        ) : (
          <>
            <Image
              src={chevronRight}
              alt="다음"
              width={20}
              height={20}
              className="group-hover:hidden"
            />
            <Image
              src={chevronRightHover}
              alt="다음(호버)"
              width={20}
              height={20}
              className="hidden group-hover:block"
            />
          </>
        )}
      </button>
    </div>
  );
}
