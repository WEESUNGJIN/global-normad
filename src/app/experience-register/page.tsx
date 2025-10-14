"use client";

import { useState } from "react";
import Input from "@/components/Input";
import CategorySelect from "../mypage/experience/components/CategorySelect";
import Button from "@/components/Button";
import AddressInput from "../mypage/experience/components/AddressInput";

export default function ExperienceRegisterPage() {
  const [selected, setSelected] = useState("");

  const SAMPLE_OPTIONS = [
    { label: "문화 예술", value: "문화 예술" },
    { label: "식음료", value: "식음료" },
    { label: "투어", value: "투어" },
    { label: "관광", value: "관광" },
    { label: "웰빙", value: "웰빙" },
  ];

  return (
    <main className="flex justify-center px-6">
      <div className="w-full max-w-[610px] mt-12">
        <h3 className="mb-6 typo-18-b">내 체험 등록</h3>

        {/* 제목 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">제목</div>
          <Input placeholder="제목을 입력해 주세요" />
        </div>

        {/* 카테고리 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">카테고리</div>
          <CategorySelect
            value={selected}
            onChange={setSelected}
            options={SAMPLE_OPTIONS}
            placeholder="카테고리를 선택해 주세요"
          />
        </div>

        {/* 설명 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">설명</div>
          <textarea
            placeholder="체험에 대한 설명을 입력해 주세요"
            className="w-full rounded-2xl border border-border-default px-4 py-3
            typo-14-m text-text-primary placeholder:text-text-secondary/60
            focus:outline-none focus:ring-2 focus:ring-primary
            h-[140px] md:h-[200px]
          "
          />
        </div>

        {/* 가격 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">가격</div>
          <Input placeholder="체험 금액을 입력해 주세요" />
        </div>

        {/* 주소 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">주소</div>
          <AddressInput />
        </div>

        {/* 예약 가능한 시간대 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">예약 가능한 시간대</div>
        </div>

        {/* 배너 이미지 등록 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">배너 이미지 등록</div>
        </div>

        {/* 소개 이미지 등록 */}
        <div className="mb-10">
          <div className="mb-2 typo-16-b text-gray-950">소개 이미지 등록</div>
        </div>
        <div className="flex justify-center mb-24">
          <Button label="등록하기" variant="primary" size="md" />
        </div>
      </div>
    </main>
  );
}
