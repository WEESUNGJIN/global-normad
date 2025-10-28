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

/* -------------------- API 함수들 (변경 없음) -------------------- */
async function fetchNotifications(cursorId?: number, token?: string): Promise<ApiResponse> {
  // ✅ 토큰이 없으면 빈 응답 반환
  if (!token) {
    console.warn('No auth token provided');
    return {
      cursorId: 0,
      notifications: [],
      totalCount: 0
    };
  }

  const url = new URL(`${API_BASE_URL}/my-notifications`);
  if (cursorId) url.searchParams.append('cursorId', cursorId.toString());
  url.searchParams.append('size', PAGE_SIZE.toString());

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // ✅ 401 오류 시 특별 처리
  if (response.status === 401) {
    console.warn('Authentication failed - token expired or invalid');
    return {
      cursorId: 0,
      notifications: [],
      totalCount: 0
    };
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error ${response.status}:`, errorText);
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

async function deleteNotification(notificationId: number, token?: string): Promise<void> {
  if (!token) {
    throw new Error('No authentication token provided');
  }

  const response = await fetch(`${API_BASE_URL}/my-notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    throw new Error('Authentication failed - please login again');
  }

  if (!response.ok) {
    throw new Error(`Delete API Error: ${response.status}`);
  }
}

/* -------------------- 읽음 상태 로컬저장 (변경 없음) -------------------- */
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
  widthClassName = "w-[360px]", // 데스크톱 기본값
  maxHeightClassName = "max-h-[480px]", // 데스크톱 기본값
}: Props) {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

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

  /* 알림 데이터 로드 (변경 없음) */
  const loadNotifications = useCallback(async (resetData = false) => {
    if (loading) return;
    
    // accessToken 확인
    if (!accessToken) {
      console.log('User not logged in - no access token available');
      if (resetData) {
        setItems([]);
        setInitialLoaded(true);
        setHasMore(false);
      }
      return;
    }
    
    try {
      setLoading(true);
      const targetCursorId = resetData ? undefined : cursorId;
      const response = await fetchNotifications(targetCursorId || undefined, accessToken);
      
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
  }, [loading, cursorId, accessToken]);

  /* 열릴 때 초기 데이터 로드 (변경 없음) */
  useEffect(() => {
    if (open && !initialLoaded && !loading) {
      const timer = setTimeout(() => {
        loadNotifications(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, initialLoaded, loading, loadNotifications]);

  /* 무한 스크롤 (변경 없음) */
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

  /* ESC (변경 없음) */
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

  /* 바깥 클릭 (변경 없음) */
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

  /* 알림 삭제 (변경 없음 - 단일 삭제 로직은 유지) */
  const removeItem = async (id: number) => {
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // ✅ 이 API 호출은 하나의 알림 ID만 삭제합니다.
      await deleteNotification(id, accessToken); 
      // ✅ 프론트엔드에서도 해당 ID만 필터링하여 제거합니다. (단일 삭제 로직)
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

  /* 뱃지 계산 (변경 없음) */
  const unreadCount = useMemo(() => {
    if (!initialLoaded) return 0;
    
    const unreadItems = items.filter(n => !readSet.has(n.id));
    return unreadItems.length;
  }, [readSet, items, initialLoaded]);

  /* 트리거 핸들러 (변경 없음) */
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

  // ✅ 모바일 팝오버를 위한 반응형 클래스 (이전 요청대로 팝오버 유지)
  const popoverPositionClass = open
    ? "fixed top-12 left-1/2 transform -translate-x-1/2 w-full max-w-sm md:absolute md:top-auto md:left-auto md:right-0 md:transform-none md:mt-2" 
    : "";

  const finalWidthClass = open
    ? `w-full max-w-sm md:${widthClassName}`
    : widthClassName;
    
  // ✅ 모바일 환경에서 잘리지 않도록 최대 높이를 유동적으로 조정
  const finalMaxHeightClass = open
    ? `max-h-[80vh] md:${maxHeightClassName}` // 모바일에서는 화면 높이의 80%로 제한
    : maxHeightClassName;


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
        {/* 뱃지 (변경 없음) */}
        {initialLoaded && unreadCount > 0 && (
          <span
            aria-hidden
            className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[10px] flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </span>

      {open && (
        // ✅ 팝오버 컨테이너에 반응형 스타일 적용
        <div
          role="dialog"
          aria-label="알림"
          ref={panelRef}
          className={`
            ${popoverPositionClass} 
            ${finalWidthClass} 
            ${finalMaxHeightClass} 
            z-50 rounded-2xl shadow-xl border border-gray-100 bg-white overflow-hidden
          `}
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
          <div className="overflow-y-auto max-h-full"> {/* max-h-full로 설정하여 부모의 높이(finalMaxHeightClass)를 따르게 함 */}
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
                    `<span class='text-purple-600 font-medium'>승인</span>`
                  )
                  .replace(
                    /거절/g,
                    `<span class='text-red-600 font-medium'>거절</span>`
                  );

                const unreadBg = 'bg-purple-50';

                return (
                  <li
                    key={n.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                      !isRead
                        ? unreadBg
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

                      {/* ✅ 조건부 렌더링: '예약 승인' 알림이 아닐 경우에만 삭제 버튼을 표시합니다. */}
                      {!isApproved && (
                        <button
                          onClick={() => removeItem(n.id)}
                          className="self-start p-1 rounded hover:bg-gray-200 text-gray-500"
                          aria-label="알림 삭제"
                        >
                          ✕
                        </button>
                      )}
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