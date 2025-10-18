// src/lib/mock/notifications.mock.ts
import type { NotificationItem, NotificationListResponse } from "@/types/notification";

// 스크린샷 느낌 살린 seed 생성
const seed: NotificationItem[] = Array.from({ length: 37 }).map((_, i) => {
  const approved = i % 3 !== 0; // 대략 2/3 승인, 1/3 거절
  const now = new Date();
  now.setMinutes(now.getMinutes() - (i + 1) * 7); // 7분 간격
  return {
    id: 10_000 - i,
    teamId: "17-4",
    userId: 1,
    content: approved
      ? `함께하면 즐거운 스트릿 댄스 (2023-01-14 15:00~18:00) 예약이 승인되었어요.`
      : `함께하면 즐거운 스트릿 댄스 (2023-01-14 15:00~18:00) 예약이 거절되었어요.`,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    deletedAt: null,
  };
});

let db = [...seed];

export async function fetchMyNotificationsMock({
  cursorId,
  size = 10,
}: {
  cursorId?: number | null;
  size?: number;
}): Promise<NotificationListResponse> {
  await new Promise((r) => setTimeout(r, 350)); // 네트워크 지연 흉내

  const sorted = [...db].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );

  let startIdx = 0;
  if (cursorId) {
    const idx = sorted.findIndex((n) => n.id === cursorId);
    startIdx = idx >= 0 ? idx + 1 : 0;
  }

  const slice = sorted.slice(startIdx, startIdx + size);
  const next = slice.length === size ? slice[slice.length - 1].id : null;

  return {
    cursorId: next,
    notifications: slice,
    totalCount: db.length,
  };
}

export async function deleteMyNotificationMock({
  notificationId,
}: {
  notificationId: number;
}) {
  await new Promise((r) => setTimeout(r, 150));
  db = db.filter((n) => n.id !== notificationId);
}

// 테스트용 리셋
export function __resetMock() {
  db = [...seed];
}
