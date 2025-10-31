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
import DownArrow from "@/assets/icon/icon_alt arrow_down.svg";
import {
  getReservedSchedule,
  getReservationsBySchedule,
  updateReservationStatus,
} from "@/app/mypage/calendar/api/reservationApi";

/* ===============================
   타입 정의
=============================== */
export type ReservationSummary = {
  date: string;
  reservations: {
    completed: number;
    confirmed: number;
    pending: number;
  };
};

type Props = {
  activityId: number | undefined;
  data: ReservationSummary[];
  onMonthChange?: (date: Date) => void;
};

// API에서 내려오는 예약 아이템 형태 (스케줄별 조회 응답의 원소)
type ApiReservation = {
  id: number;
  nickname: string;
  headCount: number;
  status: "pending" | "confirmed" | "declined" | "canceled" | "completed";
  date: string;
  endTime: string;
};

// 스케줄별 예약 조회 API 응답 타입 (getReservationsBySchedule 반환 형태)
type ReservationsByScheduleResponse = {
  reservations: ApiReservation[];
};

/* ===============================
   반응형 감지 (SSR 안전)
=============================== */
const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsTablet(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isTablet;
};

/* ===============================
   CalendarBoardWithPanel
=============================== */
export default function CalendarBoardWithPanel({
  activityId,
  data,
  onMonthChange,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  const isTablet = useIsTablet();

  const { refs, floatingStyles, context } = useFloating({
    open: !isTablet && !!selectedDate,    // ✅ 태블릿/모바일에선 floating-ui 자체 비활성
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

  // ✅ 중복 없이 한 번만 선언
  const click = useClick(context);
  const dismiss = useDismiss(context);

  // ✅ useInteractions는 PC에서도 항상 호출, 단 렌더 시에만 분기
  const { getFloatingProps } = useInteractions([click, dismiss]);


  const handleDateClick = (date: Date) => {
    const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
    setSelectedDate(ymd);

    // ✅ 클릭 시 달력이 바뀌면 바로 렌더가 교체되기 때문에, 살짝 딜레이 줘서 새 타일을 찾기
  setTimeout(() => {
    const tiles = document.querySelectorAll(".react-calendar__tile");
    for (const tile of tiles) {
      const abbr = tile.querySelector("abbr");
      if (abbr?.textContent === String(date.getDate())) {
        setAnchorEl(tile as HTMLElement); // ✅ 이게 refs.setReference로 이어짐
        break;
      }
    }
  }, 30);

    if (isTablet) {
      setIsBottomOpen(true);
    }
  };

  useEffect(() => {
    if (!isTablet && anchorEl) refs.setReference(anchorEl); // ✅ PC에서만 reference 연결
  }, [isTablet, anchorEl, refs]);

  const selectedData = useMemo(
    () => data.find((d) => d.date === selectedDate),
    [data, selectedDate]
  );

  if (isTablet === null) return null; // SSR 중일 때 렌더 방지

  return (
    <div className="relative w-full flex flex-col items-center">
      <CalendarBoard
        data={data}
        onMonthChange={onMonthChange}
        onDateClick={handleDateClick}
      />

      {!activityId && selectedDate && (
        <p className="mt-3 text-sm text-rose-500">
          활동 ID가 설정되지 않았습니다. 상위 컴포넌트에서 activityId를 전달해주세요.
        </p>
      )}

      {/* 💻 PC: 기존 floating-ui 패널 그대로 */}
      {!isTablet && selectedDate && selectedData && anchorEl && activityId && (
        <FloatingPortal>
          <div
            {...getFloatingProps()}
            ref={(el) => refs.setFloating(el)}
            style={floatingStyles}
            className="z-50"
          >
            <ReservationPanel
              activityId={activityId}
              date={selectedDate}
              data={selectedData}
              onClose={() => {
                setSelectedDate(null);
                setAnchorEl(null);
              }}
              variant="pc"
            />
          </div>
        </FloatingPortal>
      )}

      {/* 📱 모바일/태블릿: Bottom Sheet */}
      {isTablet && isBottomOpen && selectedData && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40 flex items-end"
          onClick={(e) => {
            // ✅ 오버레이 클릭 시만 닫기
            if (e.target === e.currentTarget) setIsBottomOpen(false);
          }}
        >
          {/* ✅ 패널 내부 클릭 시 닫히지 않게 버블링 차단 */}
          <div
            className="relative z-[10000] w-full bg-white rounded-t-3xl shadow-lg max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* 상단 손잡이 */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* ✅ ReservationPanel 내부 */}
            <ReservationPanel
              activityId={activityId!}
              date={selectedDate!}
              data={selectedData}
              onClose={() => setIsBottomOpen(false)}
              variant="mobile"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ===============================
   ReservationPanel
=============================== */
type PanelTab = "pending" | "confirmed" | "declined" | "completed";

type ReservationItem = {
  id: number;
  nickname: string;
  people: number;
  status: PanelTab;
  date?: string;
  endTime?: string;
};

function ReservationPanel({
  activityId,
  date,
  onClose,
  variant = "pc",
}: {
  activityId: number;
  date: string;
  data: {
    date: string;
    reservations: { pending: number; confirmed: number; completed: number };
  };
  onClose: () => void;
  variant?: "pc" | "mobile";
}) {
  const [tab, setTab] = useState<PanelTab>("pending");
  const [scheduleList, setScheduleList] = useState<
    { scheduleId: number; startTime: string; endTime: string }[]
  >([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );
  const [list, setList] = useState<ReservationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tabCount, setTabCount] = useState({
    pending: 0,
    confirmed: 0,
    declined: 0,
    completed: 0,
  });

  useEffect(() => {
    if (!activityId || !date) return;

    const formattedDate = date.includes(".")
      ? date.split(".").join("-")
      : date;

    const fetchSchedules = async () => {
      try {
        const res = await getReservedSchedule(activityId, formattedDate);
        setScheduleList(res);
        setSelectedScheduleId(res.length > 0 ? res[0].scheduleId : null);
      } catch (err) {
        console.error("❌ 예약 스케줄 조회 실패:", err);
        setScheduleList([]);
      }
    };
    fetchSchedules();
  }, [activityId, date]);

  useEffect(() => {
    if (!activityId || !selectedScheduleId) return;

    const fetchAllReservations = async () => {
      setIsLoading(true);
      try {
        const [pendingRes, confirmedRes, declinedRes] = await Promise.all([
          getReservationsBySchedule(activityId, selectedScheduleId, "pending"),
          getReservationsBySchedule(activityId, selectedScheduleId, "confirmed"),
          getReservationsBySchedule(activityId, selectedScheduleId, "declined"),
        ]);

        // 🔽 응답 타입 명시적으로 변환 (any 제거)
        const pendingResTyped = pendingRes as ReservationsByScheduleResponse;
        const confirmedResTyped = confirmedRes as ReservationsByScheduleResponse;
        const declinedResTyped = declinedRes as ReservationsByScheduleResponse;

        const all = [
          ...pendingResTyped.reservations,
          ...confirmedResTyped.reservations,
          ...declinedResTyped.reservations,
        ].map((r: ApiReservation) => ({
          id: r.id,
          nickname: r.nickname,
          people: r.headCount,
          status: r.status as PanelTab,
          date: r.date,
          endTime: r.endTime,
        }));

        const now = new Date();
        const autoCompleted = all.filter(
          (r) =>
            r.status === "confirmed" &&
            new Date(`${r.date}T${r.endTime}`) < now
        );

        setTabCount({
          pending: all.filter((r) => r.status === "pending").length,
          confirmed: all.filter((r) => r.status === "confirmed").length,
          declined: all.filter((r) => r.status === "declined").length,
          completed: autoCompleted.length,
        });

        const filtered = all.filter((r) =>
          tab === "completed"
            ? new Date(`${r.date}T${r.endTime}`) < now && r.status === "confirmed"
            : r.status === tab
        );

        setList(filtered);
      } catch (err) {
        console.error("❌ 예약 조회 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllReservations();
  }, [activityId, selectedScheduleId, tab, date]);

  const labelDate = useMemo(() => {
    const d = new Date(date);
    return `${d.getFullYear().toString().slice(2)}년 ${
      d.getMonth() + 1
    }월 ${d.getDate()}일`;
  }, [date]);

  return (
    <div
      className={`${
        variant === "pc"
          ? "bg-white shadow-xl rounded-3xl w-[320px] sm:w-[340px] h-[520px] p-5 border border-gray-100 flex flex-col"
          : "bg-white rounded-t-3xl p-5 flex flex-col w-full h-auto"
      }`}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-[18px] font-semibold text-gray-900">{labelDate}</p>
        <button onClick={onClose}>
          <Image
            src={iconDelete}
            alt="닫기"
            width={20}
            height={20}
            className="opacity-70 hover:opacity-100 transition"
          />
        </button>
      </div>

      {/* 탭 */}
      <div className="mb-4">
        <div className="flex items-center gap-5 border-b border-gray-200 overflow-x-auto">
          {(["pending", "confirmed", "declined", "completed"] as PanelTab[]).map(
            (key) => (
              <button
                key={key}
                type="button"
                className={`pb-2 text-sm whitespace-nowrap ${
                  tab === key
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-gray-500"
                }`}
                onClick={() => setTab(key)}
              >
                {key === "pending"
                  ? "신청"
                  : key === "confirmed"
                  ? "승인"
                  : key === "declined"
                  ? "거절"
                  : "완료"}{" "}
                {tabCount[key]}
              </button>
            )
          )}
        </div>
      </div>

      {/* 시간 선택 */}
      <div className="mb-3">
        <label className="text-gray-800 text-sm">예약 시간</label>
        <div className="relative mt-2">
          <select
            className="w-full border border-gray-200 rounded-[12px] px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary appearance-none"
            onChange={(e) => setSelectedScheduleId(Number(e.target.value))}
            value={selectedScheduleId ?? ""}
          >
            {scheduleList.length === 0 && (
              <option value="">스케줄이 없습니다</option>
            )}
            {scheduleList.map((s) => (
              <option key={s.scheduleId} value={s.scheduleId}>
                {s.startTime} - {s.endTime}
              </option>
            ))}
          </select>
          <Image
            src={DownArrow}
            alt="드롭다운"
            width={20}
            height={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-70"
          />
        </div>
      </div>

      {/* 예약 리스트 */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {isLoading ? (
          <p className="text-center text-sm text-gray-400 py-10">
            불러오는 중...
          </p>
        ) : list.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-10">
            해당 내역이 없습니다.
          </p>
        ) : (
          list.map((r) => (
            <div
              key={r.id}
              className="border border-gray-200 rounded-2xl p-4 mb-3 bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-semibold text-gray-800">
                    닉네임 {r.nickname}
                  </p>
                  <p className="text-[14px] text-gray-500">인원 {r.people}명</p>
                </div>
                {tab === "pending" ? (
                  <div className="flex flex-col gap-2">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                      onClick={() =>
                        updateReservationStatus(activityId, r.id, "confirmed")
                      }
                    >
                      승인
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-100 text-sm rounded-lg hover:bg-gray-200"
                      onClick={() =>
                        updateReservationStatus(activityId, r.id, "declined")
                      }
                    >
                      거절
                    </button>
                  </div>
                ) : tab === "confirmed" ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-[12px] px-3 py-[6px]">
                    예약 승인
                  </span>
                ) : tab === "completed" ? (
                  <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-600 text-[12px] px-3 py-[6px]">
                    체험 완료
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-600 text-[12px] px-3 py-[6px]">
                    예약 거절
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ===============================
   ✨ Bottom Sheet 애니메이션
=============================== */
<style jsx global>{`
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }
`}</style>
