"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import emptyState from "@/assets/img/empty_state.png";
import StyledDropdown from "@/app/mypage/calendar/components/StyledDropdown";
import api from "@/utils/api";
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

  /** ✅ 체험 목록 응답 타입 */
  type MyActivitiesResponse = {
    activities: MyActivity[];
    nextCursorId?: number | null;
  };

  /** ✅ 체험 목록 조회 (최초 1회만 실행) */
  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await api.get<MyActivitiesResponse>("/my-activities");
        setActivities(res.activities);

        // ✅ 첫 번째 체험을 기본 선택
        if (res.activities.length > 0 && !selectedActivity) {
          setSelectedActivity(null);
        }
      } catch (err) {
        console.error("체험 리스트 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ selectedActivity 넣지 않음 (한 번만 실행하도록)

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
  }, [selectedActivity, activeDate]); // ✅ 정상적인 의존성 배열

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
      {/* ✅ 체험 드롭다운 */}
      {activities.length > 0 && (
        <div className="relative w-full">
          <StyledDropdown
            options={activities.map((a) => ({ label: a.title, value: a.id }))}
            value={selectedActivity ?? null}
            onChange={(val) => setSelectedActivity(Number(val))}
            placeholder="체험을 선택하세요"
          />
        </div>
      )}

      {/* ✅ 캘린더 + 패널 */}
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
