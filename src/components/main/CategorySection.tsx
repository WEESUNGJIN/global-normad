"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image, { type StaticImageData } from "next/image";
import Card from "@/components/Card";
import Dropdown from "@/components/Dropdown";
import Pagination from "@/components/Pagination";
import { fetchCategoryActivities } from "@/api/experience";
import type { Experience } from "@/api/experience";

import iconCulture from "@/assets/icon/icon_art.svg";
import iconCultureWhite from "@/assets/icon/white/icon_art_white.svg";
import iconFood from "@/assets/icon/icon_food.svg";
import iconFoodWhite from "@/assets/icon/white/icon_food_white.svg";
import iconSport from "@/assets/icon/icon_sport.svg";
import iconSportWhite from "@/assets/icon/white/icon_sport_white.svg";
import iconTour from "@/assets/icon/icon_tour.svg";
import iconTourWhite from "@/assets/icon/white/icon_tour_white.svg";
import iconTravel from "@/assets/icon/icon_bus.svg";
import iconTravelWhite from "@/assets/icon/white/icon_bus_white.svg";
import iconWellbeing from "@/assets/icon/icon_wellbeing.svg";
import iconWellbeingWhite from "@/assets/icon/white/icon_wellbeing_white.svg";

import emojiPalette from "@/assets/img/emoji_palette.png";
import emojiPlate from "@/assets/img/emoji_plate.png";
import emojiSport from "@/assets/img/emoji_sport.png";
import emojiCity from "@/assets/img/emoji_city.png";
import emojiCar from "@/assets/img/emoji_car.png";
import emojiWellbeing from "@/assets/img/emoji_wellbeing.png";
import emojiRollerskate from "@/assets/img/emoji_rollerskate.png";

interface CategorySectionProps {
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
  priceSortOrder: "asc" | "desc" | null;
  onSelectPriceSort: (order: "asc" | "desc" | null) => void;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  emojiSrc?: string | StaticImageData;
  iconWhite?: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: "문화 · 예술",
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
    name: "스포츠",
    icon: iconSport,
    iconWhite: iconSportWhite,
    emojiSrc: emojiSport,
  },
  {
    id: 4,
    name: "투어",
    icon: iconTour,
    iconWhite: iconTourWhite,
    emojiSrc: emojiCity,
  },
  {
    id: 5,
    name: "관광",
    icon: iconTravel,
    iconWhite: iconTravelWhite,
    emojiSrc: emojiCar,
  },
  {
    id: 6,
    name: "웰빙",
    icon: iconWellbeing,
    iconWhite: iconWellbeingWhite,
    emojiSrc: emojiWellbeing,
  },
];

export default function CategorySection({
  selectedCategory,
  onSelectCategory,
  priceSortOrder,
  onSelectPriceSort,
}: CategorySectionProps) {
  const router = useRouter();
  const [activities, setActivities] = useState<Experience[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSelectCategory = (id: number) => {
    onSelectCategory(selectedCategory === id ? null : id);
    setCurrentPage(1);
  };

  const handlePriceSortSelect = (option: string) => {
    const order = option === "높은 순" ? "desc" : "asc";
    onSelectPriceSort(order);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const selected = categories.find((c) => c.id === selectedCategory);

  const filteredActivities =
    selectedCategory === null
      ? (activities ?? [])
      : (activities ?? []).filter((act) => act.category === selected?.name);

  const sortedActivities = filteredActivities ?? [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = sortedActivities.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(sortedActivities.length / itemsPerPage);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const sortKey =
          priceSortOrder === "asc"
            ? "price_asc"
            : priceSortOrder === "desc"
              ? "price_desc"
              : "latest";

        const categoryName =
          selectedCategory === null
            ? undefined
            : categories.find((c) => c.id === selectedCategory)?.name;

        const { activities } = await fetchCategoryActivities(
          categoryName,
          sortKey,
        );
        setActivities(activities);
      } catch (error) {
        console.error("체험 데이터 로드 실패:", error);
        setActivities([]);
      }
    };

    loadActivities();
  }, [selectedCategory, priceSortOrder]);

  return (
    <section className="px-6 md:px-8 lg:px-0 pt-10 pb-32 md:pb-[200px]">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-1">
          <Image
            src={selected?.emojiSrc ?? emojiRollerskate}
            alt={selected?.name ?? "모든 체험"}
            width={20}
            height={20}
            className="-mt-[3px] md:mr-[1px] object-contain md:w-7 md:h-7"
          />
          <h2 className="typo-18-b md:text-2xl text-text-primary">
            {selectedCategory === null ? "모든 체험" : selected?.name}
          </h2>
        </div>
        <Dropdown
          label="가격"
          options={["높은 순", "낮은 순"]}
          onSelect={handlePriceSortSelect}
          highlightSelected={true}
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
                  : "bg-white text-text-primary border border-gray-100"
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
        {paginatedActivities.map((act) => (
          <div
            key={act.id}
            onClick={() => router.push(`/experience-detail/${act.id}`)}
            className="cursor-pointer"
          >
            <Card className="!w-full">
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
          </div>
        ))}
      </div>

      <Pagination
        page={currentPage}
        totalPages={Math.max(totalPages, 1)}
        onChange={handlePageChange}
        className="mt-10"
      />
    </section>
  );
}
