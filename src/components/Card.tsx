"use client";
import React from "react";
import clsx from "clsx";

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
 * 카드 전체를 감싸는 래퍼 (투명)
 * - overflow-visible로 겹침 표현 가능
 * - 폭은 고정 262px, 필요 시 className으로 조절 가능
 */
const CardRoot: React.FC<CardProps> = ({ className, children }) => (
  <div className={clsx("relative w-[262px] overflow-visible", className)}>
    {children}
  </div>
);

/* ---------- Thumbnail ---------- */
/**
 * 카드 상단 이미지
 * - 라운드 20px로 동일하게
 * - overflow-hidden으로 클리핑
 * - ✅ 콘텐츠 박스와 같은 폭: mx-4 / md:mx-[17px]
 */
const CardImage: React.FC<CardImageProps> = ({ src, alt, className }) => (
  <div className={clsx("mx-4 md:mx-[17px]", className)}>
    <div className="w-full h-[176px] md:h-[299px] rounded-[20px] overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  </div>
);

/* ---------- Content ---------- */
/**
 * 이미지 위로 겹치는 흰 패널
 * - 위로 겹침(-mt)
 * - 좌우 인셋: mx-4(모바일), md:mx-[17px](데스크탑)
 * - 그림자/테두리/라운드 동일
 */
const CardContent: React.FC<CardContentProps> = ({ className, children }) => (
  <div
    className={clsx(
      "relative z-10",
      "-mt-[33px] md:-mt-[60px]",
      "mx-4 md:mx-[17px]",
      "rounded-[20px] bg-white dark:bg-gray-900",
      "border border-border-default",
      "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]",
      "px-5 pt-5 pb-6",
      className
    )}
  >
    {children}
  </div>
);

/* ---------- Title ---------- */
const CardTitle: React.FC<CardTitleProps> = ({ className, children }) => (
  <h3 className={clsx("typo-16-b text-text-primary", className)}>{children}</h3>
);

/* ---------- Meta ---------- */
const CardMeta: React.FC<CardMetaProps> = ({ rating, count, className }) => {
  if (rating == null && count == null) return null;
  return (
    <div className={clsx("flex items-center gap-2 text-text-secondary mt-2", className)}>
      <span aria-hidden>⭐</span>
      <span className="typo-14-m">
        {rating?.toFixed(1)}
        {typeof count === "number" && <span className="ml-1 text-text-secondary">({count})</span>}
      </span>
    </div>
  );
};

/* ---------- Price ---------- */
const CardPrice: React.FC<CardPriceProps> = ({ price, unit, right, className }) => (
  <div className={clsx("flex items-end justify-between mt-4", className)}>
    <div className="flex items-baseline gap-1">
      <span className="typo-20-b">{price}</span>
      {unit && <span className="typo-14-m text-text-secondary">{unit}</span>}
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