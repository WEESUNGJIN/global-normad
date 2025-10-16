"use client";

import clsx from "clsx";
import Image from "next/image";
import streetDanceMain from "@/assets/img/streetdance_main.png";
import emojiFire from "@/assets/img/emoji_fire.png";

export default function HeroSection() {
  return (
    <section
      className={clsx(
        "w-full aspect-[16/9] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg relative",
        "mt-16 md:mt-25 lg:mt-32",
      )}
    >
      <Image
        src={streetDanceMain}
        alt="함께 배우면 즐거운 스트릿 댄스"
        className="w-full h-auto object-cover"
        priority
      />
      <div className="absolute whitespace-nowrap bottom-[14%] left-1/2 -translate-x-1/2 text-center text-white">
        <h2 className="typo-18-b md:text-2xl lg:text-[32px]">
          함께 배우면 즐거운 스트릿 댄스
        </h2>
        <p
          className={clsx(
            "typo-14-m mt-1",
            "md:text-base md:mt-3 md:font-bold",
            "lg:text-lg lg:mt-5",
          )}
        >
          1월의 인기 체험 BEST
          <Image
            src={emojiFire}
            alt="불 이모지"
            width={14}
            height={14}
            className="ml-1 -mt-1 inline-block md:w-4 md:h-4 object-contain"
          />
        </p>
      </div>
    </section>
  );
}
