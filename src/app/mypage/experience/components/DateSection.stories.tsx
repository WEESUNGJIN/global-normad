import type { Meta, StoryObj } from "@storybook/react";
import DateSection from "./DateSection";

const meta: Meta<typeof DateSection> = {
  title: "Experience/DateSection",
  component: DateSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DateSection>;

export const Default: Story = {};
