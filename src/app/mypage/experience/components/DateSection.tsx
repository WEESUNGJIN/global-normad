"use client";

import Image from "next/image";
import DateInput from "./DateInput";
import CategorySelect from "./CategorySelect";
import IconPlus from "@/assets/icon/icon_plus_button.svg";
import IconMinus from "@/assets/icon/icon_minus_button.svg";

interface DateSectionProps {
  value: { id: number; date: string; startTime: string; endTime: string }[];
  onChange?: (
    slots: { id: number; date: string; startTime: string; endTime: string }[],
  ) => void;
}
export default function DateSection({ value, onChange }: DateSectionProps) {
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const label = `${i.toString().padStart(2, "0")}:00`;
    return { label, value: label };
  });

  const handleAdd = () => {
    onChange?.([
      ...value,
      { id: Date.now(), date: "", startTime: "", endTime: "" },
    ]);
  };

  const handleRemove = (id: number) => {
    onChange?.(value.filter((slot) => slot.id !== id));
  };

  const handleChange = (
    id: number,
    key: "date" | "startTime" | "endTime",
    val: string,
  ) => {
    onChange?.(
      value.map((slot) => (slot.id === id ? { ...slot, [key]: val } : slot)),
    );
  };

  return (
    <section className="flex flex-col w-full max-w-[700px] gap-5 md:gap-6">
      <h3 className="typo-16-b text-gray-950">예약 가능한 시간대</h3>

      {value.map((slot, i) => (
        <div key={slot.id} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <DateInput
                value={slot.date ? new Date(slot.date) : null}
                onChange={(d) =>
                  handleChange(
                    slot.id,
                    "date",
                    d?.toISOString().split("T")[0] ?? "",
                  )
                }
              />
            </div>

            <div className="flex flex-row items-center gap-3 sm:gap-2 w-full sm:w-[340px]">
              <CategorySelect
                value={slot.startTime}
                onChange={(v) => handleChange(slot.id, "startTime", v)}
                options={timeOptions}
                placeholder="00:00"
              />
              <span className="text-gray-500">-</span>
              <CategorySelect
                value={slot.endTime}
                onChange={(v) => handleChange(slot.id, "endTime", v)}
                options={timeOptions}
                placeholder="00:00"
              />
              {i === 0 ? (
                <button
                  onClick={handleAdd}
                  className="bg-primary rounded-full w-[42px] h-[42px] flex items-center justify-center"
                >
                  <Image src={IconPlus} alt="추가" width={24} height={24} />
                </button>
              ) : (
                <button
                  onClick={() => handleRemove(slot.id)}
                  className="bg-gray-50 rounded-full w-[42px] h-[42px] flex items-center justify-center"
                >
                  <Image src={IconMinus} alt="삭제" width={24} height={24} />
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
