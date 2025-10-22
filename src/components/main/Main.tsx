"use client";

import React, { useState } from "react";
import backgroundSky from "@/assets/img/background_sky.png";
import GNB from "@/components/GNB";
import HeroSection from "@/components/main/HeroSection";
import Footer from "@/components/Footer";
import SearchSection from "@/components/main/SearchSection";
import PopularSection from "@/components/main/PopularSection";
import CategorySection from "@/components/main/CategorySection";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";

import fjordImg from "@/assets/img/fjord.png";
import coastalvillageImg from "@/assets/img/coastalvillage.png";
import reedforestImg from "@/assets/img/reedforest.png";
import hotairballoonImg from "@/assets/img/hotairballoon.png";
import bicycleImg from "@/assets/img/bicycle.png";
import tropicalfishImg from "@/assets/img/tropicalfish.png";

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

const mockActivities: Activity[] = [
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

export default function Main() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Activity[]>([]);

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 8;

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);

    if (keyword.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    const results = mockActivities
      .filter((act) => act.title.toLowerCase().includes(keyword.toLowerCase()))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    setSearchResults(results);
    setIsSearching(true);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = searchResults.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  return (
    <main
      className="min-h-screen bg-top bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${backgroundSky.src})` }}
    >
      <div className="[&>header]:!bg-transparent [&>header]:!border-transparent">
        <GNB />
      </div>

      <div className="px-6 md:px-8 lg:px-100">
        <HeroSection />
      </div>

      <div className="px-6 md:px-16 lg:px-[439px]">
        <SearchSection onSearch={handleSearch} />
      </div>

      {isSearching ? (
        <div className="px-6 md:px-8 pt-11 md:pt-18 lg:pt-[90px] pb-32 md:pb-[200px]">
          <div className="max-w-[1120px] mx-auto">
            <h2 className="typo-18-m md:text-2xl mb-2 text-gray-950">
              <span className="font-bold">{searchKeyword}</span> (으)로 검색한
              결과입니다.
            </h2>
            <p className="typo-14-m md:text-lg text-gray-700 mb-7">
              총 {searchResults.length}개의 결과
            </p>

            {searchResults.length === 0 ? (
              <div className="typo-18-m text-center text-gray-700 py-20">
                일치하는 체험이 없습니다.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 md:gap-y-7 gap-y-5 pb-20">
                  {paginatedResults.map((act) => (
                    <Card key={act.id} className="!w-full">
                      <Card.Image src={act.bannerImageUrl} alt={act.title} />
                      <Card.Content>
                        <Card.Title className="line-clamp-1">
                          {act.title}
                        </Card.Title>
                        <Card.Meta
                          rating={act.rating}
                          count={act.reviewCount}
                        />
                        <Card.Price
                          price={`₩ ${act.price.toLocaleString()}`}
                          unit="/ 인"
                        />
                      </Card.Content>
                    </Card>
                  ))}
                </div>

                <Pagination
                  page={currentPage}
                  totalPages={Math.max(totalPages, 1)}
                  onChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 md:px-8">
            <div className="max-w-[1120px] mx-auto">
              <PopularSection />
            </div>
          </div>

          <div className="px-6 md:px-8">
            <div className="max-w-[1120px] mx-auto">
              <CategorySection />
            </div>
          </div>
        </>
      )}

      <Footer />
    </main>
  );
}
