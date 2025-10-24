"use client";

import Image from "next/image";
import streetDanceMain from "@/assets/img/streetdance_main.png";
import streetDanceZoom from "@/assets/img/streetdance_zoom.png";
import streetDanceBasketball from "@/assets/img/streetdance_basketball.png";

export default function ExperienceDetailImages() {
  return (
    <section className="pt-8 md:pt-10 lg:pt-16">
      <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-rows-2 lg:h-100">
        <div className="relative overflow-hidden rounded-tl-3xl rounded-bl-3xl bg-gray-200 row-span-2">
          <Image
            src={streetDanceMain}
            alt="스트릿댄스 메인"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="relative overflow-hidden rounded-tr-3xl bg-gray-200 aspect-[3/2] lg:aspect-auto">
          <Image
            src={streetDanceZoom}
            alt="스트릿댄스 줌"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="relative overflow-hidden rounded-br-3xl bg-gray-200 aspect-[3/2] lg:aspect-auto">
          <Image
            src={streetDanceBasketball}
            alt="스트릿댄스 농구장"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
