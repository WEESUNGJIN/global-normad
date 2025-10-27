"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import emptyState from "@/assets/img/empty_state.png";
import DownArrow from "@/assets/icon/icon_alt arrow_down.svg";
import api from "@/utils/api";

// ✅ 패널 포함된 캘린더 컴포넌트로 교체
import CalendarBoardWithPanel from "@/app/mypage/calendar/components/CalendarBoardWithPanel";

/** 내 체험 요약 타입 */
type MyActivity = {
  id: number;
  title: string;
};

/** 월별 예약 현황 타입 */
type ReservationDashboard = {
  date: string; // YYYY-MM-DD
  reservations: {
    completed: number;
    confirmed: number;
    pending: number;
  };
};

export default function CalendarPage() {
  const [activities, setActivities] = useState<MyActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [dashboard, setDashboard] = useState<ReservationDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  /** ✅ 체험 목록 조회 */
  type MyActivitiesResponse = {
  activities: MyActivity[];
  nextCursorId?: number | null;
};

useEffect(() => {
  async function fetchActivities() {
    try {
      // ✅ 실제 응답 구조에 맞게 타입 수정
      const res = await api.get<MyActivitiesResponse>("/my-activities");

      // ✅ 내부의 배열만 꺼내서 상태로 저장
      setActivities(res.activities);

      if (res.activities.length > 0 && !selectedActivity) {
        setSelectedActivity(res.activities[0].id);
      }
    } catch (err) {
      console.error("체험 리스트 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchActivities();
}, []);

  /** ✅ 선택된 체험의 월별 예약 현황 조회 */
  useEffect(() => {
    async function fetchDashboard() {
      if (!selectedActivity) return;
      try {
        const year = activeDate.getFullYear();
        const month = activeDate.getMonth() + 1;
        const res = await api.get<ReservationDashboard[]>(
          `/my-activities/${selectedActivity}/reservation-dashboard?year=${year}&month=${month}`
        );
        setDashboard(res);
      } catch (err) {
        console.error("예약 현황 조회 실패:", err);
      }
    }
    fetchDashboard();
  }, [selectedActivity, activeDate]);

  /** ✅ 로딩 상태 */
  if (loading) {
    return <p className="typo-14-m text-gray-600">로딩 중...</p>;
  }

  /** ✅ 체험이 하나도 없을 때 */
  if (activities.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center text-center py-20">
        <Image
          src={emptyState}
          alt="체험 없음"
          width={122}
          height={122}
          className="mb-4"
        />
        <p className="typo-16-m text-gray-600 mb-[30px]">
          아직 등록한 체험이 없어요
        </p>
        <Link href="/experience-register">
          <Button
            label="체험 등록하기"
            variant="primary"
            className="w-[182px] h-[54px]"
          />
        </Link>
      </section>
    );
  }

  /** ✅ UI 렌더링 */
    return (
    <div className="space-y-6">
      {/* 체험이 있을 때만 드롭다운 표시 */}
      {activities.length > 0 && (
        <div className="relative w-full">
          <select
            value={selectedActivity ?? ""}
            onChange={(e) => setSelectedActivity(Number(e.target.value))}
            className={`appearance-none w-full justify-between items-center p-4 gap-3 box-border
              bg-white border border-gray-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)] rounded-2xl
              typo-14-m text-gray-950`}
          >
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>

          {/* 드롭다운 화살표 아이콘 */}
          <Image
            src={DownArrow}
            alt="아래화살표"
            width={24}
            height={24}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      )}

      {/* ✅ CalendarBoardWithPanel 사용 */}
      {selectedActivity && (
        <CalendarBoardWithPanel
          activityId={selectedActivity}
          data={dashboard}
          onMonthChange={(date) => setActiveDate(date)}
        />
      )}
    </div>
  );
}
