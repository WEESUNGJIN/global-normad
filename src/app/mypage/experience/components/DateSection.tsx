"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CategorySelect from "./CategorySelect";
import IconPlus from "@/assets/icon/icon_plus_button.svg";
import IconMinus from "@/assets/icon/icon_minus_button.svg";
import DateInput from "@/app/mypage/experience/components/DateInput";

export interface Slot {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
}

interface DateSectionProps {
  value?: Slot[];
  onChange?: (slots: Slot[]) => void;
}

export default function DateSection({
  value = [],
  onChange,
}: DateSectionProps) {
  const [slots, setSlots] = useState<Slot[]>(value);
  const [inputSlot, setInputSlot] = useState<Slot>({
    date: "",
    startTime: "",
    endTime: "",
  });

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const label = `${i.toString().padStart(2, "0")}:00`;
    return { label, value: label };
  });

  // ✅ 부모 value 변경 시 동기화
  useEffect(() => {
    setSlots(value);
  }, [value]);

  const isOverlapping = (list: Slot[], newSlot: Slot, ignoreIndex?: number) => {
    return list.some((slot, i) => {
      if (i === ignoreIndex) return false;
      if (slot.date !== newSlot.date) return false;
      if (
        !slot.startTime ||
        !slot.endTime ||
        !newSlot.startTime ||
        !newSlot.endTime
      )
        return false;
      return (
        slot.startTime < newSlot.endTime && newSlot.startTime < slot.endTime
      );
    });
  };

  const handleAdd = () => {
    if (!inputSlot.date || !inputSlot.startTime || !inputSlot.endTime) {
      alert("날짜와 시간을 모두 입력하세요.");
      return;
    }

    if (isOverlapping(slots, inputSlot)) {
      alert("같은 날짜 내에 겹치는 시간대가 있습니다.");
      return;
    }

    const updated = [...slots, inputSlot];
    setSlots(updated);
    onChange?.(updated);
    setInputSlot({ date: "", startTime: "", endTime: "" });
  };

  const handleRemove = (index: number) => {
    const updated = slots.filter((_, i) => i !== index);
    setSlots(updated);
    onChange?.(updated);
  };

  const handleChange = (index: number, key: keyof Slot, val: string) => {
    const updated = slots.map((slot, i) =>
      i === index ? { ...slot, [key]: val } : slot,
    );
    const changed = updated[index];
    if (isOverlapping(updated, changed, index)) {
      alert("같은 날짜 내에 겹치는 시간대가 있습니다.");
      return;
    }
    setSlots(updated);
    onChange?.(updated);
  };

  return (
    <section className="flex flex-col w-full max-w-[700px] gap-5 md:gap-6">
      <h3 className="typo-16-b text-gray-950">예약 가능한 시간대</h3>

      {/* 입력 슬롯 */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <DateInput
              value={
                inputSlot.date ? new Date(`${inputSlot.date}T00:00:00`) : null
              }
              onChange={(d) =>
                setInputSlot((prev) => ({
                  ...prev,
                  date: d ? d.toLocaleDateString("en-CA") : "",
                }))
              }
            />
          </div>

          <div className="flex flex-row items-center gap-3 sm:gap-2 w-full sm:w-[340px]">
            <CategorySelect
              value={inputSlot.startTime}
              onChange={(v) =>
                setInputSlot((prev) => ({ ...prev, startTime: v }))
              }
              options={timeOptions}
              placeholder="00:00"
            />
            <span className="text-gray-500">-</span>
            <CategorySelect
              value={inputSlot.endTime}
              onChange={(v) =>
                setInputSlot((prev) => ({ ...prev, endTime: v }))
              }
              options={timeOptions}
              placeholder="00:00"
            />
            <button
              onClick={handleAdd}
              aria-label="추가"
              className="shrink-0 flex items-center justify-center w-[42px] h-[42px] bg-primary rounded-full sm:ml-2 hover:brightness-110 transition"
            >
              <Image src={IconPlus} alt="추가" width={24} height={24} />
            </button>
          </div>
        </div>
        <hr className="border-t border-gray-200 mt-2" />
      </div>

      {/* 저장된 슬롯 */}
      {slots.map((slot, i) => (
        <div key={slot.id ?? `slot-${i}`} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <DateInput
                value={slot.date ? new Date(`${slot.date}T00:00:00`) : null}
                onChange={(d) =>
                  handleChange(
                    i,
                    "date",
                    d ? d.toLocaleDateString("en-CA") : "",
                  )
                }
              />
            </div>

            <div className="flex flex-row items-center gap-3 sm:gap-2 w-full sm:w-[340px]">
              <CategorySelect
                value={slot.startTime}
                onChange={(v) => handleChange(i, "startTime", v)}
                options={timeOptions}
              />
              <span className="text-gray-500">-</span>
              <CategorySelect
                value={slot.endTime}
                onChange={(v) => handleChange(i, "endTime", v)}
                options={timeOptions}
              />
              <button
                onClick={() => handleRemove(i)}
                aria-label="삭제"
                className="shrink-0 flex items-center justify-center w-[42px] h-[42px] bg-gray-50 rounded-full sm:ml-2 hover:bg-gray-100 transition"
              >
                <Image src={IconMinus} alt="삭제" width={32} height={32} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
