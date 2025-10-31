"use client";
import clsx from "clsx";
import Tag from "@/components/Tag";
import Button from "@/components/Button";
import { useState } from "react";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "canceled"
  | "completed";

export interface ListCardProps {
  thumbnail: string;
  title: string;
  price: string;
  subtitle?: string;
  status?: ReservationStatus;
  priceSub?: string;
  peopleText?: string;
  dateText?: string;
  timeText?: string;
  className?: string;
  ctaLabel?: string;
  onClickCTA?: () => void;
  onClickChange?: () => void;
  onClickCancel?: () => void;
  variant?: "pc" | "mobile";
  showActions?: boolean;
  actionsDisabled?: boolean;
}

function badge(s?: ReservationStatus) {
  switch (s) {
    case "pending":   return { v: "warning" as const, t: "확인 요청" };
    case "confirmed": return { v: "success" as const,  t: "예약 완료" };
    case "declined":  return { v: "error" as const,    t: "거절됨" };
    case "canceled":  return { v: "default" as const,  t: "취소됨" };
    case "completed": return { v: "success" as const,  t: "체험 완료" };
    default:          return { v: "default" as const,  t: "" };
  }
}

export default function ListCard({
  thumbnail,
  title,
  price,
  subtitle,
  status,
  priceSub,
  peopleText = "00명",
  dateText = "0000.00.00",
  timeText = "11:00 - 12:30",
  className,
  ctaLabel = "후기 작성",
  onClickCTA,
  onClickChange,
  onClickCancel,
  variant = "pc",
  actionsDisabled,
}: ListCardProps) {
  const { v: tagVariant, t: tagText } = badge(status);
  const hasSubtitle = !!subtitle?.trim();

  const [showMobileActions, setShowMobileActions] = useState(false);

  const handleCardClick = () => {
    if (variant === "mobile") {
      if (status === "pending" || status === "completed") {
          setShowMobileActions(!showMobileActions);
      }
    }
  };

  const ProgressActions = (
    <div className={clsx(variant === "mobile" ? "grid grid-cols-2 gap-3" : "flex gap-2")}>
      <button
        className={clsx(
          "typo-12-m rounded-xl px-3",
          variant === "mobile" ? "h-11 w-full" : "h-9",
          actionsDisabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-text-secondary hover:bg-gray-200"
        )}
        onClick={actionsDisabled ? undefined : onClickChange}
      >
        예약 변경
      </button>
      <button
        className={clsx(
          "typo-12-m rounded-xl px-3",
          variant === "mobile" ? "h-11 w-full" : "h-9",
          actionsDisabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-text-secondary hover:bg-gray-200"
        )}
        onClick={actionsDisabled ? undefined : onClickCancel}
      >
        예약 취소
      </button>
    </div>
  );

  const DoneCTA = (
    <Button
      label={ctaLabel}
      size={variant === "mobile" ? "md" : "sm"}
      variant="primary"
      className={clsx(variant === "mobile" ? "w-full h-11 rounded-xl" : "h-9 rounded-xl")}
      onClick={onClickCTA}
    />
  );

  /* ───────────── MOBILE ───────────── */
  if (variant === "mobile") {
    const CARD_WIDTH_RATIO = "75.36%"; // 309 / 410
    const IMAGE_WIDTH_RATIO = "34%";  // 139 / 410 (겹치는 부분 포함)

    return (
      <div className={clsx("relative w-full max-w-[410px]", className)}>
        
        {/* 이미지 컨테이너 - 우측 (z-index가 낮아야 카드에 가려짐) */}
        <div 
            // ✅ z-index를 z-0으로 설정 (왼쪽 카드보다 낮음)
            className={`absolute right-0 top-0 z-0 h-[139px] rounded-[20px] overflow-hidden`}
            style={{ width: IMAGE_WIDTH_RATIO }} 
        >
          <img src={thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* 카드 본체 - 좌측 (이미지보다 z-index가 높아야 겹쳐짐) */}
        <div 
          // ✅ z-index를 z-10으로 설정 (이미지보다 높음)
          className="relative z-10 h-[139px] rounded-[20px] bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer"
          style={{ width: CARD_WIDTH_RATIO }} 
          onClick={handleCardClick}
        >
          <div className="h-full px-5 py-5 flex flex-col justify-between">
            <div>
              {tagText && (
                <Tag
                  variant={tagVariant}
                  size="sm"
                  className="inline-flex items-center h-fit px-2 py-[2px] mb-2"
                >
                  {tagText}
                </Tag>
              )}
              <h4 className="typo-16-b text-text-primary mb-1">{title}</h4>

              {hasSubtitle ? (
                <p className="typo-12-m text-text-secondary mb-1 line-clamp-2">{subtitle}</p>
              ) : (
                <p className="typo-12-m text-text-secondary">
                  {dateText}
                  <span className="mx-2">·</span>
                  {timeText}
                </p>
              )}
            </div>

            <div className="mt-2">
              <span className="typo-16-b text-text-primary">{price}</span>
              {priceSub && <span className="typo-12-m text-text-secondary ml-1">{priceSub}</span>}
              <span className="typo-12-m text-text-secondary ml-1">/ {peopleText}</span>
            </div>
          </div>
        </div>
        
        {/* ✅ 모바일에서는 버튼을 상시 노출 */}
        <div className="mt-3 w-full">
          {status === "completed"
            ? DoneCTA
            : status === "pending"
            ? ProgressActions
            : null}
        </div>
      </div>
    );
  }

  /* ───────────── PC ───────────── */
  return (
    <div
      className={clsx(
        "flex items-stretch bg-white rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden",
        "h-[200px]",
        className
      )}
      onClick={handleCardClick}
    >
      {/* 좌 텍스트 */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div className="space-y-2">
          {tagText && (
            <Tag
              variant={tagVariant}
              size="sm"
              className="inline-flex items-center h-fit px-2 py-[2px]"
            >
              {tagText}
            </Tag>
          )}
          <div>
            <h4 className="typo-16-b text-text-primary mb-1 line-clamp-2">
                {title}
            </h4>
            {hasSubtitle ? (
              <p className="typo-12-m text-text-secondary line-clamp-2">{subtitle}</p>
            ) : (
              <p className="typo-12-m text-text-secondary mt-1">
                {dateText}
                <span className="mx-2">·</span>
                {timeText}
              </p>
            )}
          </div>
        </div>

        {/* PC 버튼 위치: 텍스트 영역의 하단 우측 (항상 표시됨) */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="typo-16-b text-text-primary">{price}</span>
            {priceSub && <span className="typo-12-m text-text-secondary ml-1">{priceSub}</span>}
            <span className="typo-12-m text-text-secondary ml-1">/ {peopleText}</span>
          </div>
          {status === "completed"
            ? DoneCTA
            : status === "pending"
            ? ProgressActions
            : null}
        </div>
      </div>

      {/* 우 이미지 */}
      <div className="w-[180px] shrink-0 overflow-hidden">
        <img
          src={thumbnail}
          alt=""
          className="w-full h-full object-cover rounded-r-[20px]"
          loading="lazy"
        />
      </div>
    </div>
  );
}