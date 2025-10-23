// src/components/GNB.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore"; // zustand 스토어 import

import Logo from "@/assets/img/logo_gnb.svg";
import BellIcon from "@/assets/icon/icon_bell.svg";
import NotificationPopover from "@/features/notifications/NotificationPopover";

type GNBProps = {
  /** 안읽은 알림 개수 (선택). 주어지면 헤더 벨 아이콘에 뱃지 표시 */
  unread?: number;
  /** 로그아웃 콜백 함수 */
  onLogout?: () => void;
  /** 레거시 호환성을 위한 props (무시됨) */
  isLoggedIn?: boolean;
  userName?: string;
};

export default function GNB({ 
  unread = 0,
  onLogout,
  // ✅ ESLint 경고 무시 주석 추가
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLoggedIn: _,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userName: __,
}: GNBProps) {
  
  // ✅ zustand 스토어에서 로그인 상태 직접 가져오기 (props 무시)
  const { user, logout } = useAuthStore();
  const isLoggedIn = !!user;
  
  // ✅ User 타입의 실제 속성명 사용 (name 대신 nickname 또는 다른 속성)
  const userName = user?.nickname || user?.email || "사용자";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const hasUnread = Number.isFinite(unread) && (unread as number) > 0;
  const unreadLabel = hasUnread
    ? unread! > 99
      ? "99+"
      : String(unread)
    : null;

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // 로그아웃 처리
  const handleLogout = () => {
    setDropdownOpen(false);
    logout(); // zustand 스토어의 logout 함수 사용
    if (onLogout) {
      onLogout();
    }
  };

  // 마이페이지 이동
  const handleMyPage = () => {
    setDropdownOpen(false);
    router.push('/mypage');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border-default">
      <div className="mx-auto w-full max-w-[1200px] h-14 px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center no-underline">
          <Image src={Logo} alt="In My Day 로고" height={28} priority />
        </Link>

        {/* Right */}
        {isLoggedIn ? (
          <nav className="flex items-center gap-3">
            {/* 알림 팝오버 */}
            <NotificationPopover>
              <button
                type="button"
                aria-label={hasUnread ? `알림 ${unreadLabel}개 있음` : "알림"}
                className="relative h-8 w-8 flex items-center justify-center rounded-xl hover:bg-gray-50 transition"
              >
                <Image
                  src={BellIcon}
                  alt=""
                  width={20}
                  height={20}
                  className="object-contain"
                  aria-hidden
                />
                {/* 뱃지 */}
                {hasUnread && (
                  <span
                    className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white typo-10-b flex items-center justify-center"
                    aria-hidden
                  >
                    {unreadLabel}
                  </span>
                )}
              </button>
            </NotificationPopover>

            {/* 사용자 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-8 px-3 rounded-xl hover:bg-gray-50 transition flex items-center gap-1 typo-12b text-gray-900"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
              >
                {userName}
                <svg 
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-border-default shadow-lg py-2 z-50">
                  <button
                    onClick={handleMyPage}
                    className="w-full px-4 py-2 text-left typo-14-m text-gray-900 hover:bg-gray-50 transition"
                  >
                    마이페이지
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left typo-14-m text-gray-900 hover:bg-gray-50 transition"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </nav>
        ) : (
          <nav className="flex items-center gap-6">
            <Link
              href="/auth/login"
              className="typo-14-m text-gray-900 hover:text-primary"
            >
              로그인
            </Link>
            <Link
              href="/auth/signup"
              className="typo-14-m text-gray-900 hover:text-primary"
            >
              회원가입
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
