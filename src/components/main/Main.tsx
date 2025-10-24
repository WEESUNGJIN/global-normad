"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import backgroundSky from "@/assets/img/background_sky.png";
import GNB from "@/components/GNB";
import HeroSection from "@/components/main/HeroSection";
import Footer from "@/components/Footer";
import SearchSection from "@/components/main/SearchSection";
import PopularSection from "@/components/main/PopularSection";
import CategorySection from "@/components/main/CategorySection";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";
import { searchExperiences } from "@/api/experience";
import type { Experience } from "@/api/experience";

export default function Main() {
  const router = useRouter();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Experience[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceSortOrder, setPriceSortOrder] = useState<"asc" | "desc" | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 8;

  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);

    if (keyword.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      setSelectedCategory(null);
      setPriceSortOrder(null);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchExperiences(keyword);
      setSearchResults(results);
      setCurrentPage(1);
    } catch (error) {
      console.error("검색 오류:", error);
      setSearchResults([]);
    }
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
                    <div
                      key={act.id}
                      onClick={() =>
                        router.push(`/experience-detail/${act.id}`)
                      }
                      className="cursor-pointer"
                    >
                      <Card className="!w-full">
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
                    </div>
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
          <div className="max-w-[1120px] mx-auto">
            <PopularSection />
          </div>

          <div className="max-w-[1120px] mx-auto">
            <CategorySection
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              priceSortOrder={priceSortOrder}
              onSelectPriceSort={setPriceSortOrder}
            />
          </div>
        </>
      )}

      <Footer />
    </main>
  );
}
