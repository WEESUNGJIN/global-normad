"use client";
import React from "react";
import clsx from "clsx";
import Image from "next/image";
import starIcon from "@/assets/icon/icon_star_on.svg";

/* ===========================================================
   Card Component (단일 파일)
   이미지 + 겹치는 흰 콘텐츠 박스
   피그마 구조 그대로 복원
=========================================================== */

/* ---------- 타입 정의 ---------- */
interface CardProps {
  className?: string;
  children: React.ReactNode;
}
interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}
interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}
interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}
interface CardMetaProps {
  rating?: number;
  count?: number;
  className?: string;
}
interface CardPriceProps {
  price: string;
  unit?: string;
  right?: React.ReactNode;
  className?: string;
}

/* ---------- Root ---------- */
/**
 * 카드 전체를 감싸는 래퍼
 * - overflow-visible로 겹침 표현 가능
 * - 폭은 고정 132px (섹션마다 조정 가능)
 */
const CardRoot: React.FC<CardProps> = ({ className, children }) => (
<<<<<<< HEAD
  <div
    className={clsx(
      "relative w-[132px] rounded-[20px] bg-white dark:bg-gray-900",
      "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]",
      "overflow-hidden transition-shadow",
      className,
    )}
  >
=======
  <div className={clsx("relative w-[132px] mb-10 overflow-visible", className)}>
>>>>>>> 06f1cc2 (Fix: 공용 카드 컴포넌트 사용할 페이지에 맞게 수정 후 인기 체험 섹션에서 적용)
    {children}
  </div>
);

/* ---------- Thumbnail ---------- */
/**
 * 카드 상단 이미지
 * - 라운드 20px로 동일하게
 * - overflow-hidden으로 클리핑
 */
const CardImage: React.FC<CardImageProps> = ({ src, alt, className }) => (
<<<<<<< HEAD
  <div
    className={clsx(
      "w-full h-[176px] md:h-[299px] rounded-[20px] overflow-hidden",
      className,
    )}
  >
=======
  <div className="w-full h-[176px] md:h-[299px] rounded-[20px] overflow-hidden">
>>>>>>> 06f1cc2 (Fix: 공용 카드 컴포넌트 사용할 페이지에 맞게 수정 후 인기 체험 섹션에서 적용)
    <img src={src} alt={alt} className="w-full h-full object-cover" />
  </div>
);

/* ---------- Content ---------- */
/**
 * 이미지 위로 겹치는 흰 패널
 * - 위로 살짝 겹치게 (-mt)
 * - 라운드와 그림자 유지
 */
const CardContent: React.FC<CardContentProps> = ({ className, children }) => (
  <div
    className={clsx(
<<<<<<< HEAD
      "relative z-10 -mt-[33px] md:-mt-[60px]",
      "rounded-2xl bg-white dark:bg-gray-900",
      "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]",
<<<<<<< HEAD
      "p-4",
=======
      "px-5 pt-5 pb-6",
>>>>>>> acffd37 (Design: 메인 페이지 내 인기 체험 섹션 구현)
=======
      "relative z-10",
      "-mt-[33px] md:-mt-[60px]",
      "rounded-2xl bg-white dark:bg-gray-900",
      "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]",
      "p-4",
>>>>>>> 06f1cc2 (Fix: 공용 카드 컴포넌트 사용할 페이지에 맞게 수정 후 인기 체험 섹션에서 적용)
      className,
    )}
  >
    {children}
  </div>
);

/* ---------- Title ---------- */
const CardTitle: React.FC<CardTitleProps> = ({ className, children }) => (
  <h3 className={clsx("typo-14-sb text-text-primary", className)}>
    {children}
  </h3>
);

/* ---------- Meta ---------- */
const CardMeta: React.FC<CardMetaProps> = ({ rating, count, className }) => {
  if (rating == null && count == null) return null;
  return (
    <div
      className={clsx(
<<<<<<< HEAD
<<<<<<< HEAD
        "flex gap-1 items-center mt-2 text-text-secondary",
        className,
      )}
    >
      <Image src={starIcon} alt="별점 아이콘" className="w-3 h-3" />
      <div className="flex items-baseline gap-1">
        <span className="typo-12-m text-text-primary">
          {rating?.toFixed(1)}
        </span>
        {typeof count === "number" && (
          <span className="typo-12-m text-text-secondary">({count})</span>
        )}
      </div>
=======
        "flex items-center gap-2 text-text-secondary mt-2",
=======
        "flex gap-1 items-center mt-2 text-text-secondary",
>>>>>>> 06f1cc2 (Fix: 공용 카드 컴포넌트 사용할 페이지에 맞게 수정 후 인기 체험 섹션에서 적용)
        className,
      )}
    >
      <Image src={starIcon} alt="별점 아이콘" className="w-3 h-3" />

      <div className="flex items-baseline gap-1">
        <span className="typo-12-m text-text-primary">
          {rating?.toFixed(1)}
        </span>
        {typeof count === "number" && (
          <span className="typo-12-m text-text-secondary">({count})</span>
        )}
<<<<<<< HEAD
      </span>
>>>>>>> acffd37 (Design: 메인 페이지 내 인기 체험 섹션 구현)
=======
      </div>
>>>>>>> 06f1cc2 (Fix: 공용 카드 컴포넌트 사용할 페이지에 맞게 수정 후 인기 체험 섹션에서 적용)
    </div>
  );
};

/* ---------- Price ---------- */
const CardPrice: React.FC<CardPriceProps> = ({
  price,
  unit,
  right,
  className,
}) => (
<<<<<<< HEAD
<<<<<<< HEAD
  <div className={clsx("flex items-end justify-between mt-2", className)}>
    <div className="flex items-baseline gap-[2px]">
      <span className="typo-16-b text-text-primary">{price}</span>
      {unit && <span className="typo-12-sb text-text-secondary">{unit}</span>}
=======
  <div className={clsx("flex items-end justify-between mt-4", className)}>
    <div className="flex items-baseline gap-1">
      <span className="typo-20-b">{price}</span>
      {unit && <span className="typo-14-m text-text-secondary">{unit}</span>}
>>>>>>> acffd37 (Design: 메인 페이지 내 인기 체험 섹션 구현)
=======
  <div className={clsx("flex items-end justify-between mt-3", className)}>
    <div className="flex items-baseline gap-[2px]">
      <span className="typo-16-b text-text-primary">{price}</span>
      {unit && <span className="typo-12-sb text-text-secondary">{unit}</span>}
>>>>>>> 06f1cc2 (Fix: 공용 카드 컴포넌트 사용할 페이지에 맞게 수정 후 인기 체험 섹션에서 적용)
    </div>
    {right}
  </div>
);

/* ---------- BottomSpacer (선택) ---------- */
const CardBottomSpacer: React.FC = () => <div className="h-5" />;

/* ---------- 합치기 (컴파운드) ---------- */
const Card = Object.assign(CardRoot, {
  Image: CardImage,
  Content: CardContent,
  Title: CardTitle,
  Meta: CardMeta,
  Price: CardPrice,
  BottomSpacer: CardBottomSpacer,
});

export default Card;

/* ===========================================================
   ✅ 사용 예시
   import Card from "@/components/Card";

   <Card>
     <Card.Image src="https://picsum.photos/800/600" alt="thumb" />
     <Card.Content>
       <Card.Title>카드 내용입니다</Card.Title>
       <Card.Meta rating={4.5} count={200} />
       <Card.Price price="₩ 38,000" unit="/인" />
     </Card.Content>
     <Card.BottomSpacer />
   </Card>
=========================================================== */
