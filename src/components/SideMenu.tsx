// src/components/SideMenu.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import SideMenu from "./SideMenu";

const meta = {
  title: "Components/SideMenu",
  component: SideMenu,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SideMenu>;
export default meta;

type Story = StoryObj<typeof meta>;

// ✅ Hook은 대문자 컴포넌트 안에서 사용
function SideMenuStory(args: React.ComponentProps<typeof SideMenu>) {
  const [currentPath, setCurrentPath] = useState<string>("/profile");

  const paths = [
    ["/profile", "내 정보"],
    ["/bookings", "예약내역"],
    ["/experiences", "내 체험 관리"],
    ["/calendar", "예약 현황"],
  ] as const;

  return (
    <div className="w-[291px]">
      <SideMenu {...args} currentPath={currentPath} />

      {/* 스토리북용 경로 스위처 (컴포넌트 외 UI) */}
      <div className="mt-4 flex flex-wrap gap-2">
        {paths.map(([p, label]) => (
          <button
            key={p}
            type="button"
            onClick={() => setCurrentPath(p)}
            className={`rounded-lg border px-3 py-1 text-sm ${
              currentPath === p ? "bg-[#E5F3FF] text-[#3D9EF2] border-transparent" : "bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export const Primary: Story = {
  render: (args) => <SideMenuStory {...args} />,
  args: {
    size: "lg",
    // items를 안 넘기면 컴포넌트 내부 default 아이템(아이콘 포함) 사용
  },
};
