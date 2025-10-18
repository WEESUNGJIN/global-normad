// src/components/SideMenu.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import SideMenu from "./SideMenu";

const meta = {
  title: "Components/SideMenu",
  component: SideMenu,
  parameters: { 
    layout: "centered",
  },
} satisfies Meta<typeof SideMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    size: "lg",
    onEditClick: () => console.log("프로필 편집 클릭"),
  },
  decorators: [
    (Story) => (
      <div className="w-[291px]">
        <Story />
      </div>
    ),
  ],
};

export const Small: Story = {
  args: {
    size: "sm", 
    onEditClick: () => console.log("프로필 편집 클릭"),
  },
  decorators: [
    (Story) => (
      <div className="w-[240px]">
        <Story />
      </div>
    ),
  ],
};

export const WithoutEdit: Story = {
  args: {
    size: "lg",
    // onEditClick 없음 - 편집 버튼 비활성화
  },
  decorators: [
    (Story) => (
      <div className="w-[291px]">
        <Story />
      </div>
    ),
  ],
};
