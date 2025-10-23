"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { formatRelativeKorean } from "@/lib/date/relative";

interface Props {
  children?: React.ReactNode;
  widthClassName?: string;     // default: w-[360px]
  maxHeightClassName?: string; // default: max-h-[480px]
}

type NotificationItem = {
  id: number;
  teamId: string;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type ApiResponse = {
  cursorId: number;
  notifications: NotificationItem[];
  totalCount: number;
};

const PAGE_SIZE = 10;
const LS_KEY = "gn:read-notifs:v1";
const API_BASE_URL = "https://sp-globalnomad-api.vercel.app/17-2";

/* -------------------- API 함수들 -------------------- */
async function fetchNotifications(cursorId?: number): Promise<ApiResponse> {
  const url = new URL(`${API_BASE_URL}/my-notifications`);
  if (cursorId) url.searchParams.append('cursorId', cursorId.toString());
  url.searchParams.append('size', PAGE_SIZE.toString());

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // 인증 토큰
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

async function deleteNotification(notificationId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/my-notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // 인증 토큰
    },
  });

  if (!response.ok) {
    throw new Error(`Delete API Error: ${response.status}`);
  }
}

/* -------------------- 읽음 상태 로컬저장 -------------------- */
function loadReadSet(): Set<number> {
  try {
    if (typeof window === "undefined") return new Set();
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return new Set(arr);
  } catch (error) {
    console.warn('Failed to load read notifications from localStorage:', error instanceof Error ? error.message : String(error));
    return new Set();
  }
}

function saveReadSet(s: Set<number>) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(s)));
  } catch (error) {
    console.warn('Failed to save read notifications to localStorage:', error instanceof Error ? error.message : String(error));
  }
}

/* -------------------- 메인 컴포넌트 -------------------- */
export default function NotificationPopover({
  children,
  widthClassName = "w-[360px]",
  maxHeightClassName = "max-h-[480px]",
}: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [readSet, setReadSet] = useState<Set<number>>(new Set());
  const [initialLoaded, setInitialLoaded] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  /* 읽음 처리 */
  const markShownAsRead = useCallback(() => {
    const next = new Set(readSet);
    items.forEach((n) => next.add(n.id));
    setReadSet(next);
    saveReadSet(next);
  }, [readSet, items]);

  const handleClose = useCallback(() => {
    markShownAsRead();
    setOpen(false);
  }, [markShownAsRead]);

  /* 초기 읽음 상태 로드 */
  useEffect(() => {
    const loadInitialReadSet = () => {
      const initialReadSet = loadReadSet();
      setReadSet(initialReadSet);
    };
    loadInitialReadSet();
  }, []);

  /* 알림 데이터 로드 */
  const loadNotifications = useCallback(async (resetData = false) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const targetCursorId = resetData ? undefined : cursorId;
      const response = await fetchNotifications(targetCursorId || undefined);
      
      if (resetData) {
        setItems(response.notifications);
        setInitialLoaded(true);
      } else {
        setItems(prev => [...prev, ...response.notifications]);
      }
      
      setCursorId(response.cursorId);
      setHasMore(response.notifications.length === PAGE_SIZE);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      if (resetData) {
        setItems([]);
        setHasMore(false);
        setInitialLoaded(true);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, cursorId]);

  /* 열릴 때 초기 데이터 로드 */
  useEffect(() => {
    if (open && !initialLoaded && !loading) {
      const timer = setTimeout(() => {
        loadNotifications(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, initialLoaded, loading, loadNotifications]);

  /* 무한 스크롤 */
  useEffect(() => {
    if (!open) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadNotifications(false);
        }
      },
      { root: panelRef.current, threshold: 1.0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [open, hasMore, loading, loadNotifications]);

  /* ESC */
  useEffect(() => {
    function onEsc(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        handleClose();
      }
    }
    if (open) {
      document.addEventListener("keydown", onEsc);
    }
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, handleClose]);

  /* 바깥 클릭 */
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (open && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, handleClose]);

  /* ✅ 알림 삭제 (API 연동) */
  const removeItem = async (id: number) => {
    try {
      await deleteNotification(id);
      setItems(prev => prev.filter(n => n.id !== id));
      const next = new Set(readSet);
      next.delete(id);
      setReadSet(next);
      saveReadSet(next);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      alert('알림 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  /* ✅ 뱃지 계산 - 실제 안 읽은 알림만 표시 */
  const unreadCount = useMemo(() => {
    if (!initialLoaded) return 0;
    
    const unreadItems = items.filter(n => !readSet.has(n.id));
    return unreadItems.length;
  }, [readSet, items, initialLoaded]);

  /* 트리거 핸들러 */
  const onTriggerClick = () => {
    if (open) handleClose();
    else setOpen(true);
  };

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTriggerClick();
    }
  };

  /* -------------------- 렌더 -------------------- */
  return (
    <div className="relative inline-block">
      <span
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKey}
        className="inline-flex relative"
      >
        {children}
        {initialLoaded && unreadCount > 0 && (
          <span
            aria-hidden
            className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </span>

      {open && (
        <div
          role="dialog"
          aria-label="알림"
          ref={panelRef}
          className={`absolute right-0 mt-2 ${widthClassName} ${maxHeightClassName} z-50 rounded-2xl shadow-xl border border-gray-100 bg-white overflow-hidden`}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <div className="text-sm font-semibold">알림 {items.length}개</div>
            <button
              aria-label="닫기"
              onClick={handleClose}
              className="p-1 rounded hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          {/* 리스트 */}
          <div className="overflow-y-auto max-h-[420px]">
            {loading && !initialLoaded && (
              <p className="px-4 py-8 text-sm text-gray-500">
                알림을 불러오는 중...
              </p>
            )}

            {initialLoaded && items.length === 0 && (
              <p className="px-4 py-8 text-sm text-gray-500">
                알림이 없습니다.
              </p>
            )}

            <ul className="divide-y">
              {items.map((n) => {
                const isApproved = n.content.includes("승인");
                const isRejected =
                  n.content.includes("거절") || n.content.includes("거부");
                const isRead = readSet.has(n.id);

                const contentHighlighted = n.content
                  .replace(
                    /승인/g,
                    `<span class='text-[var(--color-primary-600,#5B21B6)] font-medium'>승인</span>`
                  )
                  .replace(
                    /거절/g,
                    `<span class='text-[var(--color-red-600,#DC2626)] font-medium'>거절</span>`
                  );

                return (
                  <li
                    key={n.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                      !isRead
                        ? "bg-[var(--color-primary-50,#F5F3FF)]"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {isApproved
                              ? "예약 승인"
                              : isRejected
                              ? "예약 거절"
                              : "알림"}
                          </p>
                          <span className="shrink-0 text-[11px] text-gray-400">
                            {formatRelativeKorean(n.createdAt)}
                          </span>
                        </div>
                        <p
                          className="mt-1 text-sm text-gray-700 whitespace-pre-wrap break-words"
                          dangerouslySetInnerHTML={{
                            __html: contentHighlighted,
                          }}
                        />
                      </div>

                      <button
                        onClick={() => removeItem(n.id)}
                        className="self-start p-1 rounded hover:bg-gray-200 text-gray-500"
                        aria-label="알림 삭제"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div ref={sentinelRef} className="h-10" />
            {loading && initialLoaded && items.length > 0 && (
              <div className="py-3 text-center text-xs text-gray-400">
                로딩 중...
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <div className="py-3 text-center text-xs text-gray-400">
                모든 알림을 다 불러왔습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
