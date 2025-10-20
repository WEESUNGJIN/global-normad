"use client";

import { useState, useMemo, useRef } from "react";
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
import { mockReservationDashboard } from "@/app/mypage/calendar/mock/mockActivities";
import iconDelete from "@/assets/icon/icon_delete.svg";

/** YYYY-MM-DD → 보기 좋게 변환 */
function formatDate(date: string) {
  const d = new Date(date);
  return `${d.getFullYear().toString().slice(2)}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function CalendarBoardWithPanel() {
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
    middleware: [
      offset(10), // 앵커와 10px 간격
      flip(), // 화면 밖으로 나가면 방향 전환
      shift({ padding: 8 }), // 경계 안쪽으로 자동 보정
    ],
    whileElementsMounted: autoUpdate,
    placement: "right-start", // 날짜 오른쪽 옆
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([click, dismiss]);

  const handleDateClick = (date: Date) => {
    const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
    setSelectedDate(ymd);

    // 클릭한 셀을 anchor로 설정
    const tiles = document.querySelectorAll(".react-calendar__tile");
    for (const tile of tiles) {
      const abbr = tile.querySelector("abbr");
      if (abbr?.textContent === String(date.getDate())) {
        setAnchorEl(tile as HTMLElement);
        refs.setReference(tile as HTMLElement);
        break;
      }
    }
  };

  const selectedData = useMemo(
    () => mockReservationDashboard.find((d) => d.date === selectedDate),
    [selectedDate]
  );

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* 캘린더 본체 */}
      <CalendarBoard data={mockReservationDashboard} onDateClick={handleDateClick} />

      {/* 패널 */}
      {selectedDate && selectedData && anchorEl && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
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
   ✅ 예약 상세 패널 (탭별 UI + 더 작은 사이즈)
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
  // 기본 탭: 신청
  const [tab, setTab] = useState<PanelTab>("pending");

  // 👉 실제 API 연동 시, date+tab 기준으로 목록을 불러오면 됨.
  // 여기선 시연용 mock을 탭별로 분기.
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

  // 날짜 포맷
  const labelDate = useMemo(() => {
    const d = new Date(date);
    return `${d.getFullYear().toString().slice(2)}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }, [date]);

  // 탭 표시용 카운트 (API 연동 시 서버 값 사용)
  const tabCount = {
    pending: data.reservations.pending ?? 0,
    confirmed: data.reservations.confirmed ?? 0,
    declined: 1, // 데모용
  };

  return (
    <div className="bg-white shadow-xl rounded-3xl w-[320px] sm:w-[340px] h-[500px] p-5 border border-gray-100">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-[18px] font-semibold text-gray-900">{labelDate}</p>
        <button onClick={onClose} aria-label="닫기">
          <Image
            src={iconDelete}
            alt="닫기"
            width={20}
            height={20}
            className="opacity-60 hover:opacity-90 transition"
          />
        </button>
      </div>

      {/* 탭 */}
      <div className="mb-4">
        <div className="flex items-center gap-6 border-b border-gray-200">
          <button
            type="button"
            className={`pb-2 text-sm ${
              tab === "pending"
                ? "text-primary font-semibold border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => setTab("pending")}
          >
            신청 {tabCount.pending}
          </button>
          <button
            type="button"
            className={`pb-2 text-sm ${
              tab === "confirmed"
                ? "text-primary font-semibold border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => setTab("confirmed")}
          >
            승인 {tabCount.confirmed}
          </button>
          <button
            type="button"
            className={`pb-2 text-sm ${
              tab === "declined"
                ? "text-primary font-semibold border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => setTab("declined")}
          >
            거절 {tabCount.declined}
          </button>
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
          <div
            key={r.id}
            className="border border-gray-200 rounded-2xl p-4 mb-3 bg-white"
          >
            <div className="flex items-start justify-between gap-3">
              {/* 왼쪽 정보 */}
              <div className="flex flex-col gap-1">
                <p className="typo-14-b text-gray-800">닉네임 {r.nickname}</p>
                <p className="typo-14-m text-gray-500">인원 {r.people}명</p>
              </div>

              {/* 오른쪽 액션/상태 */}
              {tab === "pending" ? (
                // 신청 탭: 버튼 2개 (오른쪽 세로)
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition text-sm">
                    승인하기
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                    거절하기
                  </button>
                </div>
              ) : tab === "confirmed" ? (
                // 승인 탭: “예약 승인” 뱃지
                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-[12px] px-3 py-[6px]">
                  예약 승인
                </span>
              ) : (
                // 거절 탭: “예약 거절” 뱃지
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

