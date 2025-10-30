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
  // 공통 필수
  thumbnail: string;
  title: string;
  price: string;

  // 공통 선택
  subtitle?: string;        // 보조정보(인원/장소/시간 등)
  status?: ReservationStatus;
  priceSub?: string;        // "세금 포함" 등
  peopleText?: string;      // "00명"
  dateText?: string;        // "0000.00.00"
  timeText?: string;        // "11:00 - 12:30"
  className?: string;

  // 액션
  ctaLabel?: string;        // 기본 "후기 작성"
  onClickCTA?: () => void;
  onClickChange?: () => void;
  onClickCancel?: () => void;

  // 레이아웃
  variant?: "pc" | "mobile";

  showActions?: boolean;

  actionsDisabled?: boolean;
}

/** 상태 → 배지 매핑 */
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

  // ✅ 모바일에서 사용할 내부 토글 상태
  const [showMobileActions, setShowMobileActions] = useState(false);

  // ✅ 카드 본체 클릭 핸들러: 모바일에서만 토글 기능을 수행
  const handleCardClick = () => {
    if (variant === "mobile") {
      // 액션이 있는 상태일 때만 토글
      if (status === "pending" || status === "completed") {
          setShowMobileActions(!showMobileActions);
      }
    }
    // PC에서는 클릭해도 아무 일 없음
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

  /* ───────────── MOBILE (클릭 시 하단 버튼 토글) ───────────── */
  if (variant === "mobile") {
    // 원본 비율 (309px + 101px = 410px)을 유지하면서 가변 너비로 전환합니다.
    const CARD_WIDTH_RATIO = "75.36%"; // 309 / 410
    const IMAGE_WIDTH_RATIO = "34%";  // 139px 부분

    return (
      // w-full, max-w-[410px]로 변경하여 가변 너비 및 최대 너비 제한
      <div className={clsx("relative w-full max-w-[410px]", className)}>
        
        {/* 이미지: 오른쪽 139px 부분 */}
        {/* ✅ 수정: w-[34%] 대신 style prop 사용 */}
        <div 
            className={`absolute right-0 top-0 -z-10 h-[139px] rounded-[20px] overflow-hidden`}
            style={{ width: IMAGE_WIDTH_RATIO }} // <== 인라인 스타일 적용
        >
          <img src={thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* 카드: 왼쪽 309px 부분 */}
        {/* ✅ 수정: w-[75.36%] 대신 style prop 사용 */}
        <div 
          className="relative z-0 h-[139px] rounded-[20px] bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer"
          style={{ width: CARD_WIDTH_RATIO }} // <== 인라인 스타일 적용
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

              {/* subtitle이 있으면 날짜/시간 줄 숨김 */}
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

        {/* 버튼: w-full 유지 (문제 없음) */}
        {showMobileActions && (
          <div className="mt-3 w-full">
            {status === "completed"
              ? DoneCTA
              : status === "pending"
              ? ProgressActions
              : null}
          </div>
        )}
      </div>
    );
  }

  /* ───────────── PC (버튼 고정 표시) ───────────── */
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