"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import CategorySelect from "@/app/mypage/experience/components/CategorySelect";
import Button from "@/components/Button";
import AddressInput from "@/app/mypage/experience/components/AddressInput";
import DateSection from "../mypage/experience/components/DateSection";
import PhotoSection from "../mypage/experience/components/PhotoSection";
import { ExperienceForm, Activity } from "@/types/experience";

export default function ExperienceRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<ExperienceForm>({
    title: "",
    category: "",
    description: "",
    price: "",
    address: "",
    bannerImageUrl: "",
    subImages: [],
    schedules: [],
  });

  // string | string[] | Schedule[] 받을 수 있게
  const handleChange = (
    key: keyof ExperienceForm,
    value: string | string[] | ExperienceForm["schedules"],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const SAMPLE_OPTIONS = [
    { label: "문화 예술", value: "문화 예술" },
    { label: "식음료", value: "식음료" },
    { label: "투어", value: "투어" },
    { label: "관광", value: "관광" },
    { label: "웰빙", value: "웰빙" },
  ];

  const handleSubmit = () => {
    if (!form.title || !form.category || !form.price) {
      alert("필수 항목을 입력해 주세요.");
      return;
    }

    const stored: Activity[] = JSON.parse(
      localStorage.getItem("activities") || "[]",
    );

    const newActivity: Activity = {
      id: Date.now(),
      userId: 101,
      title: form.title,
      description: form.description,
      category: form.category,
      price: Number(form.price).toString(),
      address: form.address,
      bannerImageUrl: form.bannerImageUrl,
      subImages: form.subImages.map((url, idx) => ({
        id: idx + 1,
        imageUrl: url,
      })),
      schedules: form.schedules,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "activities",
      JSON.stringify([newActivity, ...stored]),
    );
    alert("체험이 등록되었습니다!");
    router.push("/mypage/experience");
  };

  return (
    <main className="flex justify-center px-6">
      <div className="w-full max-w-[700px] mt-12">
        <h3 className="mb-6 typo-18-b">내 체험 등록</h3>

        {/* 제목 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">제목</div>
          <Input
            value={form.title}
            placeholder="제목을 입력해 주세요"
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        {/* 카테고리 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">카테고리</div>
          <CategorySelect
            value={form.category}
            onChange={(v) => handleChange("category", v)}
            options={SAMPLE_OPTIONS}
            placeholder="카테고리를 선택해 주세요"
          />
        </div>

        {/* 설명 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">설명</div>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="체험에 대한 설명을 입력해 주세요"
            className="w-full rounded-2xl border border-border-default px-4 py-3
              typo-14-m text-text-primary placeholder:text-text-secondary/60
              focus:outline-none focus:ring-2 focus:ring-primary
              h-[140px] md:h-[200px]"
          />
        </div>

        {/* 가격 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">가격</div>
          <Input
            value={form.price}
            placeholder="체험 금액을 입력해 주세요"
            onChange={(e) => handleChange("price", e.target.value)}
          />
        </div>

        {/* 주소 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">주소</div>
          <AddressInput
            value={form.address}
            onChange={(v: string) => handleChange("address", v)}
          />
        </div>

        {/* 예약 가능한 시간대 */}
        <div className="mb-6">
          <DateSection
            value={form.schedules}
            onChange={(schedules) => handleChange("schedules", schedules)}
          />
        </div>

        {/* 배너 이미지 등록 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">배너 이미지 등록</div>
          <PhotoSection
            limit={1}
            value={form.bannerImageUrl ? [form.bannerImageUrl] : []}
            onChange={(urls: string[]) =>
              handleChange("bannerImageUrl", urls[0])
            }
          />
        </div>

        {/* 소개 이미지 등록 */}
        <div className="mb-10">
          <div className="mb-2 typo-16-b text-gray-950">소개 이미지 등록</div>
          <PhotoSection
            limit={4}
            value={form.subImages}
            onChange={(urls: string[]) => handleChange("subImages", urls)}
          />
        </div>

        <div className="flex justify-center mb-24">
          <Button
            label="등록하기"
            variant="primary"
            size="md"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}
