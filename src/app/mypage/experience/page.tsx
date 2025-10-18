"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import emptyState from "@/assets/img/empty_state.png";
import ExperienceCard from "./components/ExperienceCard";
import { Activity } from "@/types/experience";

export default function ExperiencePage() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("activities") || "[]");
    setActivities(localData);
  }, []);

  if (activities.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center text-center py-20">
        <Image
          src={emptyState}
          alt="체험 없음"
          width={122}
          height={122}
          className="mb-4"
        />
        <p className="typo-16-m text-gray-600 mb-[30px]">
          아직 등록한 체험이 없어요
        </p>
      </section>
    );
  }

  return (
    <section className="lg:w-[640px]">
      {activities.map((act) => (
        <ExperienceCard
          key={act.id}
          title={act.title}
          rating={act.rating}
          reviewCount={act.reviewCount}
          price={Number(act.price)}
          imageUrl={act.bannerImageUrl}
          onEdit={() => console.log("수정 클릭:", act.id)}
          onDelete={() => console.log("삭제 클릭:", act.id)}
        />
      ))}
    </section>
  );
}
