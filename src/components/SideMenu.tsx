// src/components/SideMenu.tsx
"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import clsx from "clsx";
import type { ComponentType, SVGProps } from "react";

import avatarPng from "@/assets/img/profile_default.png";
import editPng from "@/assets/img/edit_button.png";

// SVG as React components (SVGR)
import IconUser from "@/assets/icon/icon_user.svg";
import IconList from "@/assets/icon/icon_list.svg";
import IconSetting from "@/assets/icon/icon_setting.svg";
import IconCalendar from "@/assets/icon/icon_calendar.svg";

type IconCmp = ComponentType<SVGProps<SVGSVGElement>>;

export type MenuItem = {
  href: string;
  label: string;
  icon: IconCmp;
};

export interface SideMenuProps {
  className?: string;
  items?: MenuItem[];
  avatarSrc?: StaticImageData | string;
  onEditClick?: () => void;
  size?: "lg" | "sm";
  /** Storybook/테스트에서 현재 경로 주입 */
  currentPath?: string;
}


export default function SideMenu({
  className,
  items = [
    { href: "/profile", label: "내 정보", icon: IconUser },
    { href: "/bookings", label: "예약내역", icon: IconList },
    { href: "/experiences", label: "내 체험 관리", icon: IconSetting },
    { href: "/calendar", label: "예약 현황", icon: IconCalendar },
  ],
  avatarSrc = avatarPng,
  onEditClick,
  size = "lg",
  currentPath = "",
}: SideMenuProps) {
  const isLg = size === "lg";
  const avatarBox = isLg ? "w-28 h-28" : "w-16 h-16";
  const editSize = isLg ? "w-7 h-7" : "w-6 h-6";

  return (
    <aside
      className={clsx(
        "w-full rounded-2xl border border-gray-100 bg-white",
        "shadow-[0_2px_10px_rgba(20,20,43,0.06)]",
        isLg ? "p-6" : "p-4",
        className,
      )}
    >
      {/* 프로필 */}
      <div className={clsx("relative mx-auto", isLg ? "mb-6" : "mb-4", avatarBox)}>
        <div className="w-full h-full rounded-full bg-[#E9F4FF] overflow-hidden flex items-center justify-center">
          <Image
            src={avatarSrc}
            alt="프로필"
            width={isLg ? 84 : 48}
            height={isLg ? 84 : 48}
            className="object-contain"
            priority
          />
        </div>
        <button
          type="button"
          onClick={onEditClick}
          aria-label="프로필 수정"
          className={clsx(
            "absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3",
            editSize,
            "rounded-full bg-[#B7BAC2] text-white flex items-center justify-center ring-2 ring-white shadow-sm",
            onEditClick ? "hover:brightness-105 active:brightness-95" : "cursor-default",
          )}
        >
          <Image src={editPng} alt="" width={isLg ? 14 : 12} height={isLg ? 14 : 12} />
        </button>
      </div>

      {/* 메뉴 */}
      <nav className={clsx("flex flex-col", isLg ? "gap-3" : "gap-2")}>
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = currentPath === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "group flex items-center rounded-xl transition-colors",
                isLg ? "h-11 px-3" : "h-10 px-3",
                isActive ? "bg-[#E5F3FF]" : "hover:bg-gray-50",
              )}
            >
              {/* SVGR + removeAttrs → text-색이 곧 아이콘 색 */}
              <Icon
                className={clsx(
                  "mr-3 w-5 h-5",
                  isActive ? "text-[#3D9EF2]" : "text-gray-500",
                )}
              />
              <span
                className={clsx(
                  "typo-14-m",
                  isActive ? "text-[#3D9EF2]" : "text-gray-700",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}