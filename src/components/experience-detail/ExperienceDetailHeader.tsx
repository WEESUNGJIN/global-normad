"use client";

import Image from "next/image";

import streetDanceMain from "@/assets/img/streetdance_main.png";
import streetDanceZoom from "@/assets/img/streetdance_zoom.png";
import streetDanceBasketball from "@/assets/img/streetdance_basketball.png";

interface ImageData {
  src: string;
  alt: string;
}

const mockImages: ImageData[] = [
  { src: streetDanceMain.src, alt: "스트릿댄스 메인 이미지" },
  { src: streetDanceZoom.src, alt: "스트릿댄스 줌 이미지" },
  { src: streetDanceBasketball.src, alt: "스트릿댄스 농구장 이미지" },
];

export default function ExperienceDetailHeader() {
  return (
    <section>
      {/* 체험 이미지 섹션 */}
      <div className="grid grid-cols-2 grid-template-rows:repeat(2,1fr)] gap-2 pt-8">
        {/* 왼쪽 큰 이미지 (세로형) */}
        <div className="relative row-span-2 overflow-hidden w-full rounded-tl-2xl rounded-bl-2xl bg-gray-200">
          <Image
            src={mockImages[0].src}
            alt={mockImages[0].alt}
            fill
            className="object-cover object-center"
          />
        </div>

        {/* 오른쪽 위 */}
        <div className="relative overflow-hidden w-full aspect-[3/2] rounded-tr-2xl bg-gray-200">
          <Image
            src={mockImages[1].src}
            alt={mockImages[1].alt}
            fill
            className="object-cover object-center"
          />
        </div>

        {/* 오른쪽 아래 */}
        <div className="relative overflow-hidden w-full aspect-[3/2] rounded-br-2xl bg-gray-200">
          <Image
            src={mockImages[2].src}
            alt={mockImages[2].alt}
            fill
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* 체험 이름 및 정보 섹션 */}
    </section>
  );
}
