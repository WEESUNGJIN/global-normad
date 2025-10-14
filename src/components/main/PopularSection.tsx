"use client";

import React from "react";
import Card from "@/components/Card";
import Image from "next/image";
import starOnIcon from "@/assets/icon/icon_star_on.svg";
import streetdanceImg from "@/assets/img/streetdance_main.png";
import steppingstoneImg from "@/assets/img/steppingstone.png";
import vrgameImg from "@/assets/img/vrgame.png";

interface Experience {
  id: number;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
}

const mockData: Experience[] = [
  {
    id: 1,
    title: "함께 배우면 즐거운 스트릿 댄스",
    image: streetdanceImg.src,
    rating: 4.9,
    reviews: 703,
    price: "₩ 38,000/인",
  },
  {
    id: 2,
    title: "연인과 사랑의 징검다리 건너기",
    image: steppingstoneImg.src,
    rating: 3.9,
    reviews: 108,
    price: "₩ 35,000/인",
  },
  {
    id: 3,
    title: "VR 게임 마스터 하는 법",
    image: vrgameImg.src,
    rating: 4.9,
    reviews: 293,
    price: "₩ 38,000/인",
  },
];

export default function PopularSection() {
  return (
    <section className="mt-14 pl-6">
      <h2 className="typo-18-b mb-4">
        <span className="mr-1">🔥</span>
        인기 체험
      </h2>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {mockData.map((exp) => (
          <Card
            key={exp.id}
            className="w-[131px] h-[243px] flex-shrink-0 rounded-2xl overflow-hidden"
          >
            <div className="relative w-full h-[146px] overflow-hidden">
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>

            <div className="flex flex-col justify-between h-[calc(243px-146px)] px-3 py-2">
              <h3 className="typo-14-b mb-1 line-clamp-1">{exp.title}</h3>

              <div className="flex items-center text-sm text-text-secondary gap-1">
                <Image src={starOnIcon} alt="star" width={14} height={14} />
                <span>{exp.rating}</span>
                <span className="text-gray-400">({exp.reviews})</span>
              </div>

              <div className="typo-16-b">{exp.price}</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
