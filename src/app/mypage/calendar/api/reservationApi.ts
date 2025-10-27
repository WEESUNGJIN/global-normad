import api from "@/utils/api";
import { AxiosError } from "axios";

/** ===============================
 * 📘 내 체험 리스트 조회
 * GET /{teamId}/my-activities
 * =============================== */
export const getMyActivities = async () => {
  try {
    const res = await api.get<{
      cursorId: number;
      totalCount: number;
      activities: {
        id: number;
        title: string;
        category: string;
        price: number;
        bannerImageUrl: string;
      }[];
    }>("/my-activities");

    console.log("✅ [getMyActivities] 응답:", res);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    console.error("❌ [getMyActivities] 실패:", {
      status: err.response?.status,
      message: err.response?.data,
    });
    throw err;
  }
};

/** ===============================
 * 📘 내 체험 월별 예약 현황 조회
 * GET /{teamId}/my-activities/{activityId}/reservation-dashboard
 * =============================== */
export const getReservationDashboard = async (
  activityId: number,
  year: string,
  month: string
) => {
  try {
    const res = await api.get<
      {
        date: string;
        reservations: {
          completed: number;
          confirmed: number;
          pending: number;
        };
      }[]
    >(`/my-activities/${activityId}/reservation-dashboard`, {
      params: { year, month },
    });

    console.log("✅ [getReservationDashboard] 응답:", res);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    console.error("❌ [getReservationDashboard] 실패:", {
      status: err.response?.status,
      message: err.response?.data,
    });
    throw err;
  }
};

/** ===============================
 * 📘 특정 날짜별 예약 스케줄 조회
 * GET /{teamId}/my-activities/{activityId}/reserved-schedule
 * =============================== */
export const getReservedSchedule = async (
  activityId: number,
  date: string
) => {
  try {
    const formattedDate = date.includes(".")
      ? date.split(".").join("-")
      : date;

    console.log("📡 [getReservedSchedule] 요청 정보:", {
      activityId,
      originalDate: date,
      formattedDate,
      url: `/my-activities/${activityId}/reserved-schedule`,
    });

    const res = await api.get<
      {
        scheduleId: number;
        startTime: string;
        endTime: string;
        count: {
          declined: number;
          confirmed: number;
          pending: number;
        };
      }[]
    >(`/my-activities/${activityId}/reserved-schedule`, {
      params: { date: formattedDate },
    });

    console.log("✅ [getReservedSchedule] 응답:", res);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    console.error("❌ [getReservedSchedule] 실패:", {
      status: err.response?.status,
      message: err.response?.data,
    });
    throw err;
  }
};

/** ===============================
 * 📘 예약 내역 조회 (신청/승인/거절)
 * GET /{teamId}/my-activities/{activityId}/reservations
 * =============================== */
export const getReservationsBySchedule = async (
  activityId: number,
  scheduleId: number,
  status: "pending" | "confirmed" | "declined"
) => {
  try {
    const res = await api.get<{
      cursorId: number;
      totalCount: number;
      reservations: {
        id: number;
        nickname: string;
        headCount: number;
        status: string;
        date: string;
        startTime: string;
        endTime: string;
      }[];
    }>(`/my-activities/${activityId}/reservations`, {
      params: { scheduleId, status, size: 10 },
    });

    console.log("✅ [getReservationsBySchedule] 응답:", res);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    console.error("❌ [getReservationsBySchedule] 실패:", {
      status: err.response?.status,
      message: err.response?.data || err.message,
    });
    throw err;
  }
};

/** ===============================
 * 📘 예약 상태 변경 (승인/거절)
 * PATCH /{teamId}/my-activities/{activityId}/reservations/{reservationId}
 * =============================== */
export const updateReservationStatus = async (
  activityId: number,
  reservationId: number,
  status: "confirmed" | "declined"
) => {
  try {
    const res = await api.patch(
      `/my-activities/${activityId}/reservations/${reservationId}`,
      { status }
    );

    console.log("✍️ [updateReservationStatus] 상태 변경 성공:", {
      activityId,
      reservationId,
      status,
    });
    return res;
  } catch (error) {
    const err = error as AxiosError;
    console.error("❌ [updateReservationStatus] 실패:", {
      status: err.response?.status,
      message: err.response?.data || err.message,
    });
    throw err;
  }
};
