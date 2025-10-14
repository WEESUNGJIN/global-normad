// src/components/SideMenu.stories.tsx
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import SideMenu from "./SideMenu";

const meta: Meta<typeof SideMenu> = {
  title: "Components/SideMenu",
  component: SideMenu,
};
export default meta;

type Story = StoryObj<typeof SideMenu>;

/** Controls로만 확인하고 싶을 때 */
export const WithControls: Story = {
  render: (args) => (
    <div className="w-[291px] bg-white p-0"> {/* 👈 시안 폭 고정 */}
      <SideMenu {...args} />
    </div>
  ),
  args: {
    size: "lg",
    currentPath: "/bookings",
  },
  argTypes: {
    currentPath: {
      control: { type: "select" },
      options: ["/profile", "/bookings", "/experiences", "/calendar"],
    },
    size: { control: { type: "inline-radio" }, options: ["lg", "sm"] },
  },
};

/** ✅ 클릭으로 활성 탭 변경 (라우팅 없이 useState로 처리) */
export const ClickInteractive: Story = {
  render: () => {
    const [path, setPath] = useState("/bookings");

    const onClickCapture: React.MouseEventHandler<HTMLDivElement> = (e) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      e.preventDefault(); // 스토리북 페이지 이동 차단
      const href = a.getAttribute("href") ?? "";
      setPath(href);
    };

    return (
      <div className="w-[291px]" onClickCapture={onClickCapture}>
        <SideMenu currentPath={path} />
      </div>
    );
  },
};
