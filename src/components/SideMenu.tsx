// src/components/SideMenu.tsx
"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import avatarPng from "@/assets/img/profile_default.png";
import editPng from "@/assets/img/edit_button.png";

// 기본 아이콘
import iconUser from "@/assets/icon/icon_user.svg";
import iconList from "@/assets/icon/icon_list.svg";
import iconSetting from "@/assets/icon/icon_setting.svg";
import iconCalendar from "@/assets/icon/icon_calendar.svg";

// 활성(퍼플) 아이콘
import iconUserActive from "@/assets/icon/purple/icon_user_500.svg";
import iconListActive from "@/assets/icon/purple/icon_list_500.svg";
import iconSettingActive from "@/assets/icon/purple/icon_setting_500.svg";
import iconCalendarActive from "@/assets/icon/purple/icon_calendar_500.svg";

type MenuItem = {
  href?: string;
  label: string;
  icon: StaticImageData | string;
  activeIcon?: StaticImageData | string;
  /** startsWith 매칭 대신 정확히 일치시만 활성화하고 싶을 때 사용 */
  exact?: boolean;
};

interface SideMenuProps {
  className?: string;
  items?: MenuItem[];
  avatarSrc?: StaticImageData | string;
  onEditClick?: () => void;
  size?: "lg" | "sm";
  /** 스토리북/테스트에서 경로를 강제로 지정 (앱에선 필요 없음) */
  activePath?: string;
}

export default function SideMenu({
  className,
  items = [
    {
      href: "/mypage",
      label: "내 정보",
      icon: iconUser,
      activeIcon: iconUserActive,
    },
    {
      href: "/mypage/bookings",
      label: "예약내역",
      icon: iconList,
      activeIcon: iconListActive,
    },
    {
      href: "/mypage/experience",
      label: "내 체험 관리",
      icon: iconSetting,
      activeIcon: iconSettingActive,
    },
    {
      href: "/mypage/calendar",
      label: "예약 현황",
      icon: iconCalendar,
      activeIcon: iconCalendarActive,
    },
  ],
  avatarSrc = avatarPng,
  onEditClick,
  size = "lg",
  activePath,
}: SideMenuProps) {
  // ✅ 핵심 1: null 가드(스토리북에서 usePathname()이 null이어도 안전)
  const current = usePathname() ?? "";
  // ✅ 핵심 2: 스토리북에선 activePath가 있으면 그걸 우선 사용
  const pathname = activePath ?? current;

  const isLg = size === "lg";
  const avatarBox = isLg ? "w-28 h-28" : "w-16 h-16";
  const editSize = isLg ? "w-7 h-7" : "w-6 h-6";

  const isActive = (href?: string, exact?: boolean) => {
    if (!href || !pathname) return false;
    if (exact) return pathname === href;
    // /bookings 와 /bookings/123 모두 활성 처리
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={clsx(
        "w-full rounded-2xl border border-gray-100 bg-white",
        "shadow-[0_2px_10px_rgba(20,20,43,0.06)]",
        isLg ? "p-6" : "p-4",
        className,
      )}
    >
      {/* 프로필 영역 */}
      <div
        className={clsx("relative mx-auto", isLg ? "mb-6" : "mb-4", avatarBox)}
      >
        <div className="w-full h-full rounded-full bg-[#E9F4FF] overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={avatarSrc}
              alt="프로필"
              width={isLg ? 84 : 48}
              height={isLg ? 84 : 48}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* 연필 버튼 */}
        <button
          type="button"
          onClick={onEditClick}
          aria-label="프로필 수정"
          className={clsx(
            "absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3",
            editSize,
            "rounded-full bg-[#B7BAC2] text-white",
            "flex items-center justify-center",
            "ring-2 ring-white shadow-sm",
            onEditClick
              ? "hover:brightness-105 active:brightness-95"
              : "cursor-default",
          )}
        >
          <Image
            src={editPng}
            alt=""
            width={isLg ? 14 : 12}
            height={isLg ? 14 : 12}
            className="object-contain"
          />
        </button>
      </div>

      {/* 메뉴 리스트 */}
      <nav className={clsx("flex flex-col", isLg ? "gap-3" : "gap-2")}>
        {items.map((it, i) => {
          const active = isActive(it.href, it.exact);
          const iconToUse = active && it.activeIcon ? it.activeIcon : it.icon;

          return (
            <Link
              key={(it.href || "#") + i}
              href={it.href || "#"}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "group flex items-center rounded-xl transition-colors",
                isLg ? "h-11 px-3" : "h-10 px-3",
                active ? "bg-primary-100" : "hover:bg-gray-50",
              )}
            >
              <Image
                src={iconToUse}
                alt=""
                width={20}
                height={20}
                className="mr-3 object-contain"
              />
              <span
                className={clsx(
                  "typo-14-m",
                  active ? "text-primary-600" : "text-gray-700",
                )}
              >
                {it.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
