"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Card from "@/components/Card";
import emojiFire from "@/assets/img/emoji_fire.png";
import { activities } from "@/components/experience-detail/mock/activities";

export default function PopularSection() {
  const router = useRouter();

  return (
    <section className="pt-14 md:pt-20 lg:pt-24 pl-6 md:pl-8 lg:pl-0">
      <h2 className="typo-18-b md:text-3xl mb-4 md:mb-5">
        <Image
          src={emojiFire}
          alt="불 이모지"
          width={20}
          height={20}
          className="-mt-[6px] mr-[3px] inline-block md:w-7 md:h-7 object-contain"
        />
        인기 체험
      </h2>

      <div className="flex gap-3 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide">
        {(activities ?? []).map((act) => (
          <div
            key={act.id}
            onClick={() => router.push(`/experience-detail/${act.id}`)}
            className="cursor-pointer flex-shrink-0 w-[44.5%] md:w-[46.5%] lg:w-[23.4%]"
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
    </section>
  );
}
