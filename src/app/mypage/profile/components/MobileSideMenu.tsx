"use client";

import React from "react";
import SideMenu from "@/components/SideMenu";

interface MobileSideMenuProps {
  onMenuClick: (menu: string) => void;
}

export default function MobileSideMenu({ onMenuClick }: MobileSideMenuProps) {
  return (
    <div
      onClick={(e) => {
        const target = e.target as HTMLElement;

        if (target.closest("a")) {
          e.preventDefault();
        }

        if (target.tagName === "BUTTON" || target.closest("a")) {
          const text = target.innerText?.trim();
          if (text === "내 정보") {
            onMenuClick("내 정보");
          }
        }
      }}
    >
      <SideMenu />
    </div>
  );
}
