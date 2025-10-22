"use client";

import Image from "next/image";
import DateInput from "./DateInput";
import CategorySelect from "./CategorySelect";
import IconPlus from "@/assets/icon/icon_plus_button.svg";
import IconMinus from "@/assets/icon/icon_minus_button.svg";

interface Slot {
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
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const label = `${i.toString().padStart(2, "0")}:00`;
    return { label, value: label };
  });

  // 맨 위 슬롯이 다 입력됐는지 확인
  const isTopSlotFilled = () => {
    if (value.length === 0) return false;
    const top = value[0];
    return top.date && top.startTime && top.endTime;
  };

  // 겹치는 시간대가 없도록 확인
  const isOverlapping = (
    slots: Slot[],
    newSlot: Slot,
    ignoreIndex?: number,
  ) => {
    return slots.some((slot, i) => {
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
    if (!isTopSlotFilled()) return;
    const newSlot: Slot = { date: "", startTime: "", endTime: "" };
    // 기존 isOverlapping 체크는 불필요했음 → 제거
    onChange?.([newSlot, ...value]);
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange?.(updated);
  };

  const handleChange = (index: number, key: keyof Slot, val: string) => {
    const updated = value.map((slot, i) =>
      i === index ? { ...slot, [key]: val } : slot,
    );
    const changedSlot = updated[index];
    if (isOverlapping(updated, changedSlot, index)) {
      alert("같은 날짜 내에 겹치는 시간대가 있습니다.");
      return;
    }
    onChange?.(updated);
  };

  return (
    <section className="flex flex-col w-full max-w-[700px] gap-5 md:gap-6">
      <h3 className="typo-16-b text-gray-950">예약 가능한 시간대</h3>

      {value.map((slot, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <DateInput
                value={
                  slot.date
                    ? new Date(`${slot.date}T00:00:00`) // 로컬 자정 기준으로 고정
                    : null
                }
                onChange={(d) =>
                  handleChange(
                    i,
                    "date",
                    d ? d.toLocaleDateString("en-CA") : "", // 로컬 기준 yyyy-mm-dd
                  )
                }
              />
            </div>

            <div className="flex flex-row items-center gap-3 sm:gap-2 w-full sm:w-[340px]">
              <CategorySelect
                value={slot.startTime}
                onChange={(v) => handleChange(i, "startTime", v)}
                options={timeOptions}
                placeholder="00:00"
              />
              <span className="text-gray-500">-</span>
              <CategorySelect
                value={slot.endTime}
                onChange={(v) => handleChange(i, "endTime", v)}
                options={timeOptions}
                placeholder="00:00"
              />

              {i === 0 ? (
                <button
                  onClick={handleAdd}
                  disabled={!isTopSlotFilled()}
                  aria-label="추가"
                  className="shrink-0 flex items-center justify-center w-[42px] h-[42px] bg-primary rounded-full sm:ml-2 hover:brightness-110 transition"
                >
                  <Image src={IconPlus} alt="추가" width={24} height={24} />
                </button>
              ) : (
                <button
                  onClick={() => handleRemove(i)}
                  aria-label="삭제"
                  className="shrink-0 flex items-center justify-center w-[42px] h-[42px] bg-gray-50 rounded-full sm:ml-2 hover:bg-gray-100 transition"
                >
                  <Image src={IconMinus} alt="삭제" width={32} height={32} />
                </button>
              )}
            </div>
          </div>

          {i === 0 && <hr className="border-t border-gray-200 mt-2" />}
        </div>
      ))}
    </section>
  );
}
