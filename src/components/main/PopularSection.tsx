"use client";

import React from "react";
import Card from "@/components/Card";
import streetdanceImg from "@/assets/img/streetdance_main.png";
import steppingstoneImg from "@/assets/img/steppingstone.png";
import vrgameImg from "@/assets/img/vrgame.png";

interface Activity {
  id: number;
  title: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  price: number;
}

const mockData: Activity[] = [
  {
    id: 1,
    title: "함께 배우면 즐거운 스트릿 댄스",
    bannerImageUrl: streetdanceImg.src,
    rating: 4.9,
    reviewCount: 703,
    price: 38000,
  },
  {
    id: 2,
    title: "연인과 사랑의 징검다리 건너기",
    bannerImageUrl: steppingstoneImg.src,
    rating: 3.9,
    reviewCount: 108,
    price: 35000,
  },
  {
    id: 3,
    title: "VR 게임 마스터 하는 법",
    bannerImageUrl: vrgameImg.src,
    rating: 4.9,
    reviewCount: 293,
    price: 38000,
  },
];

export default function PopularSection() {
  return (
    <section className="pt-14 pl-6">
      <h2 className="typo-18-b mb-4">
        <span className="mr-1">🔥</span>
        인기 체험
      </h2>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {mockData.map((exp) => (
          <Card key={exp.id} className="flex-shrink-0">
            <Card.Image src={exp.bannerImageUrl} alt={exp.title} />
            <Card.Content>
              <Card.Title className="line-clamp-1">{exp.title}</Card.Title>
              <Card.Meta rating={exp.rating} count={exp.reviewCount} />
              <Card.Price
                price={`₩ ${exp.price.toLocaleString()}`}
                unit="/ 인"
              />
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
