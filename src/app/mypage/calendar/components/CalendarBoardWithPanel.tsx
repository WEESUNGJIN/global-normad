"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";

import CalendarBoard from "@/app/mypage/calendar/components/calendarBoard/CalendarBoard";
import iconDelete from "@/assets/icon/icon_delete.svg";

export type ReservationSummary = {
  date: string;
  reservations: {
    completed: number;
    confirmed: number;
    pending: number;
  };
};

type Props = {
  data: ReservationSummary[];
  onMonthChange?: (date: Date) => void;
};

export default function CalendarBoardWithPanel({ data, onMonthChange }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: !!selectedDate,
    onOpenChange: (open) => {
      if (!open) {
        setSelectedDate(null);
        setAnchorEl(null);
      }
    },
    middleware: [offset(10), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement: "right-start",
  });

  const { getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  // ✅ 날짜 클릭 시 anchor 지정
  const handleDateClick = (date: Date) => {
    const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
    setSelectedDate(ymd);

    const tiles = document.querySelectorAll(".react-calendar__tile");
    for (const tile of tiles) {
      const abbr = tile.querySelector("abbr");
      if (abbr?.textContent === String(date.getDate())) {
        setAnchorEl(tile as HTMLElement);
        break;
      }
    }
  };

  // ✅ 렌더 후 anchorEl이 변경될 때만 ref 연결
  useEffect(() => {
    if (anchorEl) refs.setReference(anchorEl);
  }, [anchorEl, refs]);

  const selectedData = useMemo(
    () => data.find((d) => d.date === selectedDate),
    [data, selectedDate]
  );

  // ✅ 안전하게 style 전달 (렌더 시점에서 ref 접근 X)
  const safeFloatingStyles = useMemo(() => ({ ...floatingStyles }), [floatingStyles]);

  return (
    <div className="relative w-full flex flex-col items-center">
      <CalendarBoard data={data} onMonthChange={onMonthChange} onDateClick={handleDateClick} />

      {selectedDate && selectedData && anchorEl && (
        <FloatingPortal>
          <div
            {...getFloatingProps()}
            ref={(el) => refs.setFloating(el)} // ✅ 콜백 ref로 교체
            style={safeFloatingStyles}
            className="z-50"
          >
            <ReservationPanel
              date={selectedDate}
              data={selectedData}
              onClose={() => {
                setSelectedDate(null);
                setAnchorEl(null);
              }}
            />
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}

/* ======================================
   ✅ ReservationPanel 그대로 유지
   ====================================== */
type PanelTab = "pending" | "confirmed" | "declined";

type ReservationItem = {
  id: number;
  nickname: string;
  people: number;
  status: PanelTab;
};

function ReservationPanel({
  date,
  data,
  onClose,
}: {
  date: string;
  data: { date: string; reservations: { pending: number; confirmed: number; completed: number } };
  onClose: () => void;
}) {
  const [tab, setTab] = useState<PanelTab>("pending");

  const list: ReservationItem[] = useMemo(() => {
    if (tab === "pending") {
      return [
        { id: 1, nickname: "정만철", people: 10, status: "pending" },
        { id: 2, nickname: "정만철", people: 12, status: "pending" },
      ];
    }
    if (tab === "confirmed") {
      return [{ id: 3, nickname: "정만철", people: 10, status: "confirmed" }];
    }
    return [{ id: 4, nickname: "정만철", people: 12, status: "declined" }];
  }, [tab]);

  const labelDate = useMemo(() => {
    const d = new Date(date);
    return `${d.getFullYear().toString().slice(2)}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }, [date]);

  const tabCount = {
    pending: data.reservations.pending ?? 0,
    confirmed: data.reservations.confirmed ?? 0,
    declined: 1,
  };

  return (
    <div className="bg-white shadow-xl rounded-3xl w-[320px] sm:w-[340px] h-[500px] p-5 border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <p className="text-[18px] font-semibold text-gray-900">{labelDate}</p>
        <button onClick={onClose} aria-label="닫기">
          <Image src={iconDelete} alt="닫기" width={20} height={20} className="opacity-60 hover:opacity-90 transition" />
        </button>
      </div>

      {/* 탭 */}
      <div className="mb-4">
        <div className="flex items-center gap-6 border-b border-gray-200">
          {(["pending", "confirmed", "declined"] as PanelTab[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`pb-2 text-sm ${
                tab === key ? "text-primary font-semibold border-b-2 border-primary" : "text-gray-500"
              }`}
              onClick={() => setTab(key)}
            >
              {key === "pending" ? "신청" : key === "confirmed" ? "승인" : "거절"}{" "}
              {tabCount[key]}
            </button>
          ))}
        </div>
      </div>

      {/* 예약 시간 */}
      <div className="mb-3">
        <label className="text-gray-800 text-sm">예약 시간</label>
        <div className="mt-2">
          <select className="w-full border border-gray-200 rounded-[12px] px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary">
            <option>14:00 - 15:00</option>
            <option>15:30 - 16:30</option>
          </select>
        </div>
      </div>

      {/* 예약 내역 */}
      <div className="overflow-y-auto max-h-[330px] pr-1">
        <label className="block text-gray-800 text-sm mb-3">예약 내역</label>

        {list.map((r) => (
          <div key={r.id} className="border border-gray-200 rounded-2xl p-4 mb-3 bg-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="typo-14-b text-gray-800">닉네임 {r.nickname}</p>
                <p className="typo-14-m text-gray-500">인원 {r.people}명</p>
              </div>

              {tab === "pending" ? (
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition text-sm">
                    승인하기
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                    거절하기
                  </button>
                </div>
              ) : tab === "confirmed" ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-[12px] px-3 py-[6px]">
                  예약 승인
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-600 text-[12px] px-3 py-[6px]">
                  예약 거절
                </span>
              )}
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">해당 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
