"use client";

import React from "react";
import clsx from "clsx";
import Input from "@/components/Input";
import Button from "@/components/Button";
import iconSearch from "@/assets/icon/icon_search.svg";

export default function SearchSection() {
  return (
    <section className="pt-8 md:pt-16 lg:pt-20">
      <h2 className="text-base md:text-3xl font-bold text-center mb-4 md:mb-9 lg:mb-10">
        무엇을 체험하고 싶으신가요?
      </h2>

      <div className="relative w-full mx-auto">
        <Input
          placeholder="내가 원하는 체험은"
          leadingIconSrc={iconSearch}
          leadingIconAlt="검색"
          className={clsx(
            "w-full [&>div>input]:!h-[53px] [&>div>input]:!py-[13px]",
            "[&>div>input]:border-none [&>div>input]:shadow-searchbar",

            "md:[&>div>span:first-child]:!pl-8",
            "md:[&>div>input]:!pl-16 md:[&>div>input]:!h-[70px]",
            "md:[&>div>input]:placeholder:text-lg",
          )}
        />

        <Button
          variant="primary"
          size="md"
          label="검색하기"
          className={clsx(
            "absolute top-1/2 right-2 md:right-3 -translate-y-1/2",
            "!h-10 !px-5 rounded-xl",
            "md:!h-12 md:!px-7 md:text-base md:!w-30",
          )}
        />
      </div>
    </section>
  );
}
