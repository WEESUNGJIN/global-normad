// src/components/Card.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: { layout: "centered" },
  args: {
    className: "w-64",
    children: <></>, // ✅ Card가 children 필수라 기본값 채워줌
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FigmaOverlay: Story = {
  args: { children: <></> }, // ✅ 타입 만족용 (render가 덮어씀)
  render: (args) => (
    <Card {...args}>
      <Card.Image src="https://picsum.photos/800/600" alt="thumb" />
      <Card.Content>
        <Card.Title>카드 내용입니다</Card.Title>
        <Card.Meta rating={4.5} count={200} />
        <Card.Price price="₩ 38,000" unit="/인" />
      </Card.Content>
    </Card>
  ),
};