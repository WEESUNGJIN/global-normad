"use client";

import React from "react";
import backgroundSky from "@/assets/img/background_sky.png";
import GNB from "@/components/GNB";
import HeroSection from "@/components/main/HeroSection";
import Footer from "@/components/Footer";
import SearchSection from "@/components/main/SearchSection";
import PopularSection from "@/components/main/PopularSection";

export default function Main() {
  return (
    <main
      className="min-h-screen bg-top bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${backgroundSky.src})` }}
    >
      <div className="[&>header]:!bg-transparent [&>header]:!border-transparent">
        <GNB />
      </div>

      <div className="px-6">
        <HeroSection />
        <SearchSection />
      </div>

      <PopularSection />

      <Footer />
    </main>
  );
}
