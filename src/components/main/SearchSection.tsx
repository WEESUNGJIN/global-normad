"use client";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import iconSearch from "@/assets/icon/icon_search.svg";

export default function SearchSection() {
  return (
    <section>
      <h2 className="typo-16-b text-center mb-4">
        무엇을 체험하고 싶으신가요?
      </h2>

      <div className="relative w-full max-w-82 mx-auto">
        <Input
          placeholder="내가 원하는 체험은"
          leadingIconSrc={iconSearch}
          leadingIconAlt="검색"
          className="w-full [&>div>input]:!h-[53px] [&>div>input]:!py-[13px] [&>div>input]:border-none [&>div>input]:shadow-searchbar"
        />

        <Button
          variant="primary"
          size="md"
          label="검색하기"
          className="absolute top-1/2 right-2 -translate-y-1/2 !h-10 !px-5 rounded-xl"
        />
      </div>
    </section>
  );
}
