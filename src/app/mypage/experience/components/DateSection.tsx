"use client";

import { useState } from "react";
import Image from "next/image";
import DateInput from "./DateInput";
import CategorySelect from "./CategorySelect";
import IconPlus from "@/assets/icon/icon_plus_button.svg";
import IconMinus from "@/assets/icon/icon_minus_button.svg";

interface TimeSlot {
  id: number;
  date: Date | null;
  start: string;
  end: string;
}

export default function DateSection() {
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: Date.now(), date: null, start: "", end: "" },
  ]);

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const label = `${i.toString().padStart(2, "0")}:00`;
    return { label, value: label };
  });

  const handleAdd = () => {
    setSlots((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), date: null, start: "", end: "" },
    ]);
  };

  const handleRemove = (id: number) => {
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
  };

  const handleChange = (id: number, key: keyof TimeSlot, value: any) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, [key]: value } : slot)),
    );
  };

  return (
    <section className="flex flex-col w-full max-w-[700px] gap-5 md:gap-6">
      {/* 제목 */}
      <h3 className="typo-16-b text-gray-950">예약 가능한 시간대</h3>

      {/* 헤더 */}
      <div className="hidden sm:flex w-[700px] justify-between text-gray-950 px-1">
        <span className="flex-1 typo-16-m">날짜</span>
        <span className="w-[160px] text-center typo-16-m">시작 시간</span>
        <span className="w-[160px] text-center typo-16-m">종료 시간</span>
        <span className="w-10" />
      </div>

      {/* 첫 줄 (+버튼 있는 줄) */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 w-full  ">
            <DateInput
              value={slots[0].date}
              onChange={(d) => handleChange(slots[0].id, "date", d)}
            />
          </div>

          <div className="flex flex-row items-center gap-3 sm:gap-2 w-full sm:w-[340px]">
            <div className="flex-1 min-w-[120px]">
              <CategorySelect
                value={slots[0].start}
                onChange={(v) => handleChange(slots[0].id, "start", v)}
                options={timeOptions}
                placeholder="00:00"
              />
            </div>

            <span className=" text-gray-500">-</span>

            <div className="flex-1 min-w-[120px]">
              <CategorySelect
                value={slots[0].end}
                onChange={(v) => handleChange(slots[0].id, "end", v)}
                options={timeOptions}
                placeholder="00:00"
              />
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="shrink-0 flex items-center justify-center w-[42px] h-[42px] bg-primary rounded-full sm:ml-2 hover:brightness-110 transition"
            >
              <Image src={IconPlus} alt="추가" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* 고정 구분선 */}
        <hr className="border-t border-gray-200 mt-2" />
      </div>

      {/* 이후 줄들 */}
      <div className="flex flex-col gap-4">
        {slots.slice(1).map((slot) => (
          <div
            key={slot.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <div className="flex-1 w-full">
              <DateInput
                value={slot.date}
                onChange={(d) => handleChange(slot.id, "date", d)}
              />
            </div>

            <div className="flex flex-row items-center gap-3 sm:gap-2 w-full sm:w-[340px]">
              <div className="flex-1 min-w-[120px]">
                <CategorySelect
                  value={slot.start}
                  onChange={(v) => handleChange(slot.id, "start", v)}
                  options={timeOptions}
                  placeholder="00:00"
                />
              </div>

              <span className="  text-gray-500">-</span>

              <div className="flex-1 min-w-[120px]">
                <CategorySelect
                  value={slot.end}
                  onChange={(v) => handleChange(slot.id, "end", v)}
                  options={timeOptions}
                  placeholder="00:00"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemove(slot.id)}
                className="shrink-0 flex items-center justify-center w-[42px] h-[42px] bg-gray-50 rounded-full sm:ml-2 hover:bg-gray-100 transition"
              >
                <Image src={IconMinus} alt="삭제" width={24} height={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
