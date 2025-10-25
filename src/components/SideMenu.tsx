// src/components/SideMenu.tsx
"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useRef, useState } from "react";
import axios from "axios";

import { useAuthStore } from "@/app/store/useAuthStore";
import api from "@/utils/api"; 

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

const DEFAULT_PROFILE_IMAGE_URL =
  "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/17-2_2755_1761370682670.png";

type MenuItem = {
  href?: string;
  label: string;
  icon: StaticImageData | string;
  activeIcon?: StaticImageData | string;
  exact?: boolean;
};

const DEFAULT_MENU_ITEMS: MenuItem[] = [
    { href: "/mypage", label: "내 정보", icon: iconUser, activeIcon: iconUserActive },
    { href: "/bookings", label: "예약내역", icon: iconList, activeIcon: iconListActive },
    { href: "/mypage/experience", label: "내 체험 관리", icon: iconSetting, activeIcon: iconSettingActive },
    { href: "/mypage/calendar", label: "예약 현황", icon: iconCalendar, activeIcon: iconCalendarActive },
];


interface SideMenuProps {
  className?: string;
  items?: MenuItem[];
  size?: "lg" | "sm";
  activePath?: string;
}

export default function SideMenu({
  className,
  items = DEFAULT_MENU_ITEMS,
  size = "lg",
  activePath,
}: SideMenuProps) {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 💡 프로필 이미지 업로드 핸들러
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      // ✅ teamId 제거 - baseURL에 이미 17-2가 포함되어 있음
      const res = await api.post<{ profileImageUrl: string }>(
        `/users/me/image`, // ✅ teamId 부분 완전히 제거
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // 전역 상태 업데이트
      if (user) {
        setUser({ ...user, profileImageUrl: res.profileImageUrl });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "프로필 이미지 변경 실패";
        alert(errorMessage);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openFileInput = () => {
    if (user && !isUploading) {
        fileInputRef.current?.click();
    }
  };

  const current = usePathname() ?? "";
  const pathname = activePath ?? current;

  const nickname = user?.nickname ?? "로그인 정보 없음";
  const avatarSrc = user?.profileImageUrl ?? DEFAULT_PROFILE_IMAGE_URL;

  const isLg = size === "lg";
  const avatarBox = isLg ? "w-28 h-28" : "w-16 h-16";
  const editSize = isLg ? "w-7 h-7" : "w-6 h-6";

  const isActive = (href?: string, exact?: boolean) => {
    if (!href || !pathname) return false;
    if (exact) return pathname === href;
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
        <div className="w-full h-full rounded-full overflow-hidden relative"> 
          
          <Image
            src={avatarSrc}
            alt="프로필"
            fill 
            className="object-cover rounded-full" 
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          
        </div>

        {/* 숨겨진 파일 input 요소 */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
          disabled={isUploading || !user}
        />

        {/* 연필 버튼 */}
        <button
          type="button"
          onClick={openFileInput}
          aria-label="프로필 수정"
          className={clsx(
            "absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3",
            editSize,
            "rounded-full bg-[#B7BAC2] text-white",
            "flex items-center justify-center",
            "ring-2 ring-white shadow-sm",
            user && !isUploading
              ? "hover:brightness-105 active:brightness-95"
              : "cursor-default",
          )}
          disabled={!user || isUploading}
        >
          {isUploading ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Image
              src={editPng}
              alt="수정"
              width={isLg ? 14 : 12}
              height={isLg ? 14 : 12}
              className="object-contain"
            />
          )}
        </button>
      </div>

      {/* 닉네임 영역 */}
      <div
        className={clsx(
          "text-center",
          isLg ? "mb-6 typo-16-sb text-gray-800" : "mb-4 typo-14-m text-gray-700",
        )}
      >
        {nickname}
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