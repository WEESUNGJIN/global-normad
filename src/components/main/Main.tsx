"use client";

import React from "react";
import backgroundSky from "@/assets/img/background_sky.png";
import GNB from "@/components/GNB";
import HeroSection from "@/components/main/HeroSection";
import Footer from "@/components/Footer";
import SearchSection from "@/components/main/SearchSection";
import PopularSection from "@/components/main/PopularSection";
import CategorySection from "@/components/main/CategorySection";

export default function Main() {
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
        <SearchSection />
      </div>

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

      <Footer />
    </main>
  );
}
