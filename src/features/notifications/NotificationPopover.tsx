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

const PAGE_SIZE = 10;
const LS_KEY = "gn:read-notifs:v1";

/* -------------------- Mock 데이터 -------------------- */
function buildMock(): NotificationItem[] {
  const list: NotificationItem[] = [];
  for (let i = 0; i < 25; i++) {
    const approved = i % 2 === 0;
    const dt = new Date();
    dt.setMinutes(dt.getMinutes() - i * 7);
    list.push({
      id: 1000 - i,
      teamId: "17-4",
      userId: 1,
      content: approved
        ? `함께하면 즐거운 스트릿 댄스 (2023-01-14 15:00~18:00)\n예약이 승인되었어요.`
        : `함께하면 즐거운 스트릿 댄스 (2023-01-14 15:00~18:00)\n예약이 거절되었어요.`,
      createdAt: dt.toISOString(),
      updatedAt: dt.toISOString(),
      deletedAt: null,
    });
  }
  return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

/* -------------------- 읽음 상태 로컬저장 -------------------- */
function loadReadSet(): Set<number> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return new Set(arr);
  } catch (error) {
    console.warn('Failed to load read notifications from localStorage:', error);
    return new Set();
  }
}

function saveReadSet(s: Set<number>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(s)));
  } catch (error) {
    console.warn('Failed to save read notifications to localStorage:', error);
  }
}

/* -------------------- 메인 컴포넌트 -------------------- */
export default function NotificationPopover({
  children,
  widthClassName = "w-[360px]",
  maxHeightClassName = "max-h-[480px]",
}: Props) {
  const [open, setOpen] = useState(false);
  // ✅ ref 대신 state로 관리하여 렌더링 중 접근 문제 해결
  const [masterList, setMasterList] = useState<NotificationItem[]>(() => buildMock());
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [readSet, setReadSet] = useState<Set<number>>(new Set());

  const panelRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = nextIndex < masterList.length;

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
    // ✅ effect 내에서 비동기적으로 처리
    const loadInitialReadSet = () => {
      const initialReadSet = loadReadSet();
      setReadSet(initialReadSet);
    };
    loadInitialReadSet();
  }, []);

  /* 페이지네이션 로드 */
  const loadMore = useCallback(() => {
    const start = nextIndex;
    const end = Math.min(nextIndex + PAGE_SIZE, masterList.length);
    const slice = masterList.slice(start, end);
    setItems((prev) => [...prev, ...slice]);
    setNextIndex(end);
  }, [nextIndex, masterList]);

  /* 열릴 때 초기 페이지 */
  useEffect(() => {
    if (open && items.length === 0) {
      loadMore();
    }
  }, [open, items.length, loadMore]);

  /* 무한 스크롤 */
  useEffect(() => {
    if (!open) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore) {
          loadMore();
        }
      },
      { root: panelRef.current, threshold: 1.0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [open, hasMore, loadMore]);

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

  /* 삭제 */
  const removeItem = (id: number) => {
    setMasterList((prev) => prev.filter((n) => n.id !== id));
    setItems((prev) => prev.filter((n) => n.id !== id));
    const next = new Set(readSet);
    next.delete(id);
    setReadSet(next);
    saveReadSet(next);
  };

  /* ✅ 뱃지 계산 - state 기반으로 수정 */
  const unreadCount = useMemo(() => {
    const totalIds = masterList.map((n) => n.id);
    let cnt = 0;
    for (const id of totalIds) if (!readSet.has(id)) cnt++;
    return cnt;
  }, [readSet, masterList]);

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
        {unreadCount > 0 && (
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
            {items.length === 0 && (
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

                // 승인/거절 색 강조
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
