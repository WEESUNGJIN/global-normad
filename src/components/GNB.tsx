// src/components/GNB.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

import Logo from "@/assets/img/logo_gnb.svg";
import BellIcon from "@/assets/icon/icon_bell.svg";
import NotificationPopover from "@/features/notifications/NotificationPopover";

type GNBProps = {
  isLoggedIn?: boolean;
  /** 안읽은 알림 개수 (선택). 주어지면 헤더 벨 아이콘에 뱃지 표시 */
  unread?: number;
};

export default function GNB({ isLoggedIn = false, unread = 0 }: GNBProps) {
  const hasUnread = Number.isFinite(unread) && (unread as number) > 0;
  const unreadLabel = hasUnread
    ? unread! > 99
      ? "99+"
      : String(unread)
    : null;

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
                className="relative h-8 w-8 flex items-center justify-center rounded-xl border border-border-default bg-white hover:bg-gray-50 transition"
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

            {/* 프로필 버튼 */}
            <Link
              href="/profile"
              className="h-8 px-3 rounded-xl border border-border-default bg-white hover:bg-gray-50 transition flex items-center typo-12b text-gray-900"
            >
              프로필
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="typo-14-m text-gray-900 hover:text-primary"
            >
              로그인
            </Link>
            <Link
              href="/signup"
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
