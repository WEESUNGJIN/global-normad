import type { Meta, StoryObj } from "@storybook/react";
import ListCard from "./ListCard";

const meta = {
  title: "Components/ListCard",
  component: ListCard,
  parameters: { layout: "padded" },

  // ✅ 기본 args: 필수값 & 자주 쓰는 값들
  args: {
    thumbnail: "https://placehold.co/300x200",
    title: "연가구 투어",
    subtitle: "성인 2명 · 09:00–13:30",
    price: "₩ 35,000",
    dateText: "0000.00.00",
    timeText: "11:00 - 12:30",
    peopleText: "00명",
    status: "confirmed",
    variant: "pc",
  },

  // ✅ 스토리북 Controls 설정
  argTypes: {
    status: {
      control: "select",
      options: ["pending", "confirmed", "declined", "canceled", "completed"],
    },
    variant: {
      control: "inline-radio",
      options: ["pc", "mobile"],
    },
    forceMobileState: {
      control: "inline-radio",
      options: ["done", "ing"],
    },
    actionsDisabled: { control: "boolean" },
  },
} satisfies Meta<typeof ListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ──────────────────────────────── PC 시안 ──────────────────────────────── */

export const Primary: Story = {
  args: {
    priceSub: "세금 포함",
    ctaLabel: "후기 작성",
    onClickCTA: () => console.log("후기 작성 클릭"),
  },
};

export const Pending: Story = {
  args: {
    title: "열기구 체험",
    subtitle: "성인 4명 · 14:00–18:00",
    price: "₩ 85,000",
    priceSub: "세금 포함",
    status: "pending",
    ctaLabel: "확인하기",
  },
};

export const Canceled: Story = {
  args: {
    title: "서핑 레슨",
    price: "₩ 45,000",
    status: "canceled",
  },
};

export const WithActionHandler: Story = {
  args: {
    ctaLabel: "자세히 보기",
    onClickCTA: () => alert("자세히 클릭"),
  },
};

export const LongTexts: Story = {
  args: {
    title: "글자가 아주 길 때는 이렇게 말줄임 처리가 되는지 테스트합니다",
    subtitle:
      "설명도 길 때 한 줄 혹은 두 줄로 클램프가 적용되는지 확인합니다. 테스트 테스트 테스트",
  },
};

/* ──────────────────────────────── 모바일 시안 ──────────────────────────────── */

export const MobileCompleted: Story = {
  args: {
    variant: "mobile",
    status: "completed",
    title: "열기구 체험 (완료)",
    price: "₩ 35,000",
    subtitle: "성인 2명 · 11:00–12:30",
    ctaLabel: "후기 작성",
  },
};

export const MobileProgress: Story = {
  args: {
    variant: "mobile",
    status: "confirmed",
    title: "열기구 체험 (진행중)",
    price: "₩ 35,000",
    subtitle: "성인 2명 · 11:00–12:30",
    forceMobileState: "ing", // ✅ 진행중 상태 강제
  },
};
