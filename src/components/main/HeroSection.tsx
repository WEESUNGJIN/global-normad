"use client";

import Image from "next/image";
import streetDanceMain from "@/assets/img/streetdance_main.png";

export default function HeroSection() {
  return (
    <section
      className="mx-auto mt-16 mb-8
        w-full max-w-82
        aspect-[16/9]
        rounded-xl overflow-hidden shadow-lg relative"
    >
      <Image
        src={streetDanceMain}
        alt="함께 배우면 즐거운 스트릿 댄스"
        className="w-full h-auto object-cover"
        priority
      />
      <div className="absolute text-center bottom-9 left-14 text-white">
        <h2 className="typo-18-b">함께 배우면 즐거운 스트릿 댄스</h2>
        <p className="typo-14-m mt-1">1월의 인기 체험 BEST 🔥</p>
      </div>
    </section>
  );
}
