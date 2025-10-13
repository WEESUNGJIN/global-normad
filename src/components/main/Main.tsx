"use client";

import React from "react";
import Image from "next/image";
import backgroundSky from "@/assets/img/background_sky.png";
import GNB from "@/components/GNB";
import Footer from "@/components/Footer";

export default function Main() {
  return (
    <main
      className="min-h-screen bg-top bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${backgroundSky.src})` }}
    >
      <div className="[&>header]:!bg-transparent [&>header]:!border-transparent">
        <GNB />
      </div>
      <h1>hero section</h1>
      <Footer />
    </main>
  );
}
