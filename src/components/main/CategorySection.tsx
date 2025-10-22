"use client";

import React, { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Card from "@/components/Card";
import Dropdown from "@/components/Dropdown";

import iconCulture from "@/assets/icon/icon_art.svg";
import iconCultureWhite from "@/assets/icon/white/icon_art_white.svg";
import iconFood from "@/assets/icon/icon_food.svg";
import iconFoodWhite from "@/assets/icon/white/icon_food_white.svg";
import iconTour from "@/assets/icon/icon_tour.svg";
import iconTourWhite from "@/assets/icon/white/icon_tour_white.svg";
import iconTravel from "@/assets/icon/icon_bus.svg";
import iconTravelWhite from "@/assets/icon/white/icon_bus_white.svg";

import emojiPalette from "@/assets/img/emoji_palette.png";
import emojiPlate from "@/assets/img/emoji_plate.png";
import emojiCity from "@/assets/img/emoji_city.png";
import emojiCar from "@/assets/img/emoji_car.png";
import emojiRollerskate from "@/assets/img/emoji_rollerskate.png";

import fjordImg from "@/assets/img/fjord.png";
import coastalvillageImg from "@/assets/img/coastalvillage.png";
import reedforestImg from "@/assets/img/reedforest.png";
import hotairballoonImg from "@/assets/img/hotairballoon.png";
import bicycleImg from "@/assets/img/bicycle.png";
import tropicalfishImg from "@/assets/img/tropicalfish.png";

interface Category {
  id: number;
  name: string;
  icon: string;
  emojiSrc?: string | StaticImageData;
  iconWhite?: string;
}

interface Activity {
  id: number;
  title: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  price: number;
  category: string;
  createdAt: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: "문화·예술",
    icon: iconCulture,
    iconWhite: iconCultureWhite,
    emojiSrc: emojiPalette,
  },
  {
    id: 2,
    name: "식음료",
    icon: iconFood,
    iconWhite: iconFoodWhite,
    emojiSrc: emojiPlate,
  },
  {
    id: 3,
    name: "투어",
    icon: iconTour,
    iconWhite: iconTourWhite,
    emojiSrc: emojiCity,
  },
  {
    id: 4,
    name: "관광",
    icon: iconTravel,
    iconWhite: iconTravelWhite,
    emojiSrc: emojiCar,
  },
];

const activities: Activity[] = [
  {
    id: 1,
    title: "피오르 체험",
    bannerImageUrl: fjordImg.src,
    rating: 3.9,
    reviewCount: 108,
    price: 42800,
    category: "관광",
    createdAt: "2025-10-01T09:00:00Z",
  },
  {
    id: 2,
    title: "해안가 마을에서 1주일 살아보기",
    bannerImageUrl: coastalvillageImg.src,
    rating: 2.9,
    reviewCount: 67,
    price: 217000,
    category: "투어",
    createdAt: "2025-09-15T08:00:00Z",
  },
  {
    id: 3,
    title: "부모님과 함께 갈대숲 체험",
    bannerImageUrl: reedforestImg.src,
    rating: 4.0,
    reviewCount: 113,
    price: 6000,
    category: "관광",
    createdAt: "2025-08-10T10:00:00Z",
  },
  {
    id: 4,
    title: "열기구 페스티벌",
    bannerImageUrl: hotairballoonImg.src,
    rating: 4.1,
    reviewCount: 85,
    price: 35000,
    category: "관광",
    createdAt: "2025-08-20T10:00:00Z",
  },
  {
    id: 5,
    title: "베트남 자전거 여행",
    bannerImageUrl: bicycleImg.src,
    rating: 3.9,
    reviewCount: 108,
    price: 42800,
    category: "투어",
    createdAt: "2025-05-01T10:00:00Z",
  },
  {
    id: 6,
    title: "다양한 열대어 구경하기",
    bannerImageUrl: tropicalfishImg.src,
    rating: 4.3,
    reviewCount: 18,
    price: 12000,
    category: "문화·예술",
    createdAt: "2025-03-10T10:00:00Z",
  },
];

export default function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceSortOrder, setPriceSortOrder] = useState<"asc" | "desc" | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const handleSelectCategory = (id: number) => {
    setSelectedCategory((prev) => (prev === id ? null : id));
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePriceSortSelect = (option: string) => {
    setPriceSortOrder(option === "높은 순" ? "desc" : "asc");
  };

  const selected = categories.find((c) => c.id === selectedCategory);

  const filteredActivities =
    selectedCategory === null
      ? activities
      : activities.filter((act) => act.category === selected?.name);

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (priceSortOrder === "asc") return a.price - b.price;
    if (priceSortOrder === "desc") return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // 기본값은 최신순
  });

  return (
    <section className="px-6 md:px-8 lg:px-0 pt-10 pb-32 md:pb-[200px]">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-1">
          <Image
            src={selected?.emojiSrc ?? emojiRollerskate}
            alt={selected?.name ?? "모든 체험"}
            width={24}
            height={24}
            className="-mt-[6px] md:mr-1 object-contain md:w-8 md:h-8"
          />
          <h2 className="typo-18-b md:text-3xl text-text-primary">
            {selectedCategory === null ? "모든 체험" : selected?.name}
          </h2>
        </div>
        <Dropdown
          label="가격"
          options={["높은 순", "낮은 순"]}
          onSelect={handlePriceSortSelect}
        />
      </div>

      <div className="flex gap-2 md:gap-5 mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-[10px] rounded-full border transition whitespace-nowrap
              ${
                selectedCategory === cat.id
                  ? "bg-black text-white border-black"
                  : "bg-white text-text-primary border-border-default"
              }`}
          >
            <div className="relative w-4 h-4 md:w-6 md:h-6 flex-shrink-0">
              <Image
                src={
                  selectedCategory === cat.id
                    ? (cat.iconWhite ?? cat.icon)
                    : cat.icon
                }
                alt={cat.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="typo-14-m md:text-base">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 md:gap-y-7 gap-y-5">
        {sortedActivities.map((act) => (
          <Card key={act.id} className="!w-full">
            <Card.Image src={act.bannerImageUrl} alt={act.title} />
            <Card.Content>
              <Card.Title className="line-clamp-1">{act.title}</Card.Title>
              <Card.Meta rating={act.rating} count={act.reviewCount} />
              <Card.Price
                price={`₩ ${act.price.toLocaleString()}`}
                unit="/ 인"
              />
            </Card.Content>
          </Card>
        ))}
      </div>

      <div className="flex justify-center items-center gap-3 mt-7 md:mt-10">
        <button className="text-gray-400 hover:text-gray-700">&lt;</button>
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5].map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`w-6 h-6 rounded-md text-center ${
                currentPage === p
                  ? "text-blue-500 font-semibold border-b-2 border-blue-500"
                  : "text-gray-400"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button className="text-gray-400 hover:text-gray-700">&gt;</button>
      </div>
    </section>
  );
}
