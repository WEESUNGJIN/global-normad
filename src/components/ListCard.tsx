"use client";
import clsx from "clsx";
import Tag from "@/components/Tag";
import Button from "@/components/Button";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "canceled"
  | "completed";

// type MobileState = "done" | "ing"; // done=후기작성 / ing=예약변경·취소 // 모바일 코드 변경으로 사용 안함

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

  // 모바일 테스트용
  // forceMobileState?: MobileState; // 모바일 코드 변경으로 사용 안함
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
  // forceMobileState, // 모바일 코드 변경으로 사용 안함
  actionsDisabled,
}: ListCardProps) {
  const { v: tagVariant, t: tagText } = badge(status);
  // const mobileState: MobileState =
  //   forceMobileState ?? (status === "completed" ? "done" : "ing"); 모바일 코드 변경으로 사용 안함
  const hasSubtitle = !!subtitle?.trim();

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

  /* ───────────── MOBILE (시안 동일: 309/139, 38px 겹침, 버튼 410px) ───────────── */
  if (variant === "mobile") {
    // 고정값: 카드 309, 이미지 139, 카드가 가리는 폭 38 → 밖으로 보이는 폭 101
    // 총 너비(버튼 기준) = 309 + 101 = 410
    return (
      <div className={clsx("relative w-[410px]", className)}>
        {/* 이미지: 카드 뒤에 깔리고, 오른쪽으로 101px 노출되도록 right:0에 배치 */}
        <div className="absolute right-0 top-0 -z-10 w-[139px] h-[139px] rounded-[20px] overflow-hidden">
          <img src={thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* 카드: 폭 309, 높이 139, 이미지 위 38px 덮음 */}
        <div className="relative z-0 h-[139px] w-[309px] rounded-[20px] bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
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

        {/* 버튼: 카드+이미지 전체 폭(410px)에 맞춤 */}
        <div className="mt-3 w-[410px]">
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
        // ✅ PC 높이를 200px로 고정
        "h-[200px]",
        className
      )}
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
                {/* ✅ 제목이 2줄을 넘지 않도록 line-clamp-2 적용 (높이 유지 목적) */}
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

      {/* 우 이미지: 카드 내부에서 꽉 차게, 높이 200px에 맞춰집니다. */}
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