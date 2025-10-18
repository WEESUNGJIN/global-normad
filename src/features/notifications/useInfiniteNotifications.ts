// src/lib/datasource/notifications.source.ts
import type { NotificationItem, NotificationListResponse } from "@/types/notification";
import { fetchMyNotificationsMock, deleteMyNotificationMock } from "@/lib/mock/notifications.mock";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://sp-globalnomad-api.vercel.app";
const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? "17-4";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

type ListArgs = { cursorId?: number | null; size?: number };

// 통일된 인터페이스(훅에서 기대하는 형태)
export type UnifiedNotificationResponse = {
  data: NotificationItem[];
  hasMore: boolean;
  nextCursor: number | null;
};

// 서버 응답(NotificationListResponse)을 통일 형태로 변환
function toUnified(res: NotificationListResponse, size = 10): UnifiedNotificationResponse {
  const data = res.notifications ?? [];
  // 서버 cursorId가 없을 수도 있으니 fallback 준비
  const fallbackNext = data.length === size ? data[data.length - 1]?.id ?? null : null;
  const nextCursor = (res.cursorId ?? fallbackNext) ?? null;
  return {
    data,
    hasMore: nextCursor !== null,
    nextCursor,
  };
}

/* ---------------- API 구현 ---------------- */
async function listAPI({ cursorId, size = 10 }: ListArgs): Promise<UnifiedNotificationResponse> {
  const qs = new URLSearchParams();
  if (cursorId !== undefined && cursorId !== null) qs.set("cursorId", String(cursorId));
  if (size) qs.set("size", String(size));

  const res = await fetch(`${BASE}/${TEAM_ID}/my-notifications?${qs.toString()}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = (await res.json()) as NotificationListResponse;
  return toUnified(json, size);
}

async function deleteAPI({ notificationId }: { notificationId: number }) {
  const res = await fetch(`${BASE}/${TEAM_ID}/my-notifications/${notificationId}`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (!res.ok && res.status !== 204) {
    // 204가 정상. 그 외는 에러 처리
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
}

/* ---------------- Mock 구현 ---------------- */
async function listMock({ cursorId, size = 10 }: ListArgs): Promise<UnifiedNotificationResponse> {
  const res = await fetchMyNotificationsMock({ cursorId: cursorId ?? undefined, size });
  return toUnified(res, size);
}
const deleteMock = deleteMyNotificationMock;

/* ---------------- Export Datasource ---------------- */
export const NotificationDS = {
  list: USE_MOCK ? listMock : listAPI,
  remove: USE_MOCK ? deleteMock : deleteAPI,
};
