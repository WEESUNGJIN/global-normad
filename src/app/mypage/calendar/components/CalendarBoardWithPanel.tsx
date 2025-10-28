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

/* ======================================
   📘 타입 정의
====================================== */
export type ReservationSummary = {
  date: string;
  reservations: {
    completed: number;
    confirmed: number;
    pending: number;
  };
};

type Props = {
  /** ✅ 부모에서 선택된 체험 ID */
  activityId: number | undefined;
  data: ReservationSummary[];
  onMonthChange?: (date: Date) => void;
};

/* ======================================
   📅 CalendarBoardWithPanel
====================================== */
export default function CalendarBoardWithPanel({
  activityId,
  data,
  onMonthChange,
}: Props) {
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

  /** ✅ 날짜 클릭 시 패널 열기 */
  const handleDateClick = (date: Date) => {
    const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
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

  useEffect(() => {
    if (anchorEl) refs.setReference(anchorEl);
  }, [anchorEl, refs]);

  const selectedData = useMemo(
    () => data.find((d) => d.date === selectedDate),
    [data, selectedDate]
  );

  const safeFloatingStyles = useMemo(
    () => ({ ...floatingStyles }),
    [floatingStyles]
  );

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

      {selectedDate && selectedData && anchorEl && activityId && (
        <FloatingPortal>
          <div
            {...getFloatingProps()}
            ref={(el) => refs.setFloating(el)}
            style={safeFloatingStyles}
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
            />
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}

/* ======================================
   🪄 ReservationPanel (탭 카운트 전역 반영)
====================================== */
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
  data,
  onClose,
}: {
  activityId: number;
  date: string;
  data: {
    date: string;
    reservations: { pending: number; confirmed: number; completed: number };
  };
  onClose: () => void;
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

  /* ✅ 날짜별 예약 스케줄 조회 */
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

  /* ✅ 모든 상태 불러와서 카운트 계산 (자동 완료 포함) */
  useEffect(() => {
    if (!activityId || !selectedScheduleId) return;

    const fetchAllReservations = async () => {
      setIsLoading(true);
      try {
        // 1️⃣ 모든 상태의 예약 요청 병렬 처리
        const [pendingRes, confirmedRes, declinedRes] = await Promise.all([
          getReservationsBySchedule(activityId, selectedScheduleId, "pending"),
          getReservationsBySchedule(activityId, selectedScheduleId, "confirmed"),
          getReservationsBySchedule(activityId, selectedScheduleId, "declined"),
        ]);

        // 2️⃣ 합치기
        const allReservations = [
          ...pendingRes.reservations,
          ...confirmedRes.reservations,
          ...declinedRes.reservations,
        ].map(
          (r: {
            id: number;
            nickname: string;
            headCount: number;
            status: string;
            date: string;
            endTime: string;
          }) => ({
            id: r.id,
            nickname: r.nickname,
            people: r.headCount,
            status: r.status as PanelTab,
            date: r.date,
            endTime: r.endTime,
          })
        );

        // 3️⃣ 자동 완료 처리
        const now = new Date();
        const autoCompleteTargets = allReservations.filter(
          (r) =>
            r.status === "confirmed" &&
            r.date &&
            r.endTime &&
            new Date(`${r.date}T${r.endTime}`) < now
        );

        if (autoCompleteTargets.length > 0) {
          await Promise.allSettled(
            autoCompleteTargets.map((r) =>
              updateReservationStatus(activityId, r.id, "completed" as any)
            )
          );
        }

        // 4️⃣ 카운트 계산
        const counts = {
          pending: allReservations.filter((r) => r.status === "pending").length,
          confirmed: allReservations.filter((r) => r.status === "confirmed").length,
          declined: allReservations.filter((r) => r.status === "declined").length,
          completed: autoCompleteTargets.length,
        };
        setTabCount(counts);

        // 5️⃣ 현재 탭 리스트 필터
        const filteredList = allReservations.filter((r) => {
          if (tab === "completed") {
            const end =
              r.date && r.endTime ? new Date(`${r.date}T${r.endTime}`) : null;
            return r.status === "confirmed" && end && end < now;
          }
          return r.status === tab;
        });

        setList(filteredList);
      } catch (err) {
        console.error("❌ 예약 조회 실패:", err);
        setList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllReservations();
  }, [activityId, selectedScheduleId, tab, date]);

  /* ✅ 승인 / 거절 */
  const handleUpdateStatus = async (
    id: number,
    status: "confirmed" | "declined"
  ) => {
    try {
      await updateReservationStatus(activityId, id, status);
      setList((prev) => prev.filter((r) => r.id !== id));
      setTabCount((prev) => ({
        ...prev,
        [status]: prev[status] + 1,
        pending: Math.max(prev.pending - 1, 0),
      }));
      if (status === "confirmed") setTab("confirmed");
    } catch (err) {
      console.error("❌ 예약 상태 변경 실패:", err);
    }
  };

  /* ✅ 날짜 포맷 */
  const labelDate = useMemo(() => {
    const d = new Date(date);
    return `${d.getFullYear().toString().slice(2)}년 ${
      d.getMonth() + 1
    }월 ${d.getDate()}일`;
  }, [date]);

  return (
    <div className="bg-white shadow-xl rounded-3xl w-[320px] sm:w-[340px] h-[520px] p-5 border border-gray-100 flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
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
      <div className="mb-4 flex-shrink-0">
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
                  : "체험 완료"}{" "}
                {tabCount[key]}
              </button>
            )
          )}
        </div>
      </div>

      {/* 예약 시간 */}
      <div className="mb-3 flex-shrink-0">
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
            alt="드롭다운 화살표"
            width={20}
            height={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-70"
          />
        </div>
      </div>

      {/* 예약 내역 */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <label className="block text-gray-800 text-sm mb-3">예약 내역</label>

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
                <div className="flex flex-col gap-1">
                  <p className="typo-14-b text-gray-800">
                    닉네임 {r.nickname}
                  </p>
                  <p className="typo-14-m text-gray-500">인원 {r.people}명</p>
                </div>

                {tab === "pending" ? (
                  <div className="flex flex-col gap-2">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition text-sm"
                      onClick={() => handleUpdateStatus(r.id, "confirmed")}
                    >
                      승인하기
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                      onClick={() => handleUpdateStatus(r.id, "declined")}
                    >
                      거절하기
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
