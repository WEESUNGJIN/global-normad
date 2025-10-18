"use client";

import Link from "next/link";
import Image from "next/image";

import Logo from "@/assets/img/logo_gnb.svg";
import BellIcon from "@/assets/icon/icon_bell.svg";
import NotificationPopover from "@/features/notifications/NotificationPopover";

type GNBProps = {
  isLoggedIn?: boolean;
};

export default function GNB({ isLoggedIn = false }: GNBProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border-default">
      <div className="mx-auto w-full max-w-[1200px] h-14 px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center no-underline">
          <Image src={Logo} alt="GlobalNomad 로고" height={28} priority />
        </Link>

        {/* Right */}
        {isLoggedIn ? (
          <nav className="flex items-center gap-3">
            {/* ✅ 알림 팝오버 (뱃지 상태까지 내부에서 관리됨) */}
            <NotificationPopover>
              <button
                type="button"
                aria-label="알림"
                className="relative h-8 w-8 flex items-center justify-center rounded-xl border border-border-default bg-white hover:bg-gray-50 transition"
              >
                <Image
                  src={BellIcon}
                  alt="알림"
                  width={20}
                  height={20}
                  className="object-contain"
                />
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
