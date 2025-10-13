import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DateInput from "./DateInput";

const meta: Meta<typeof DateInput> = {
  title: "Components/Form/DateInput",
  component: DateInput,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof DateInput>;

const DateInputWithState = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="w-[300px]">
      <DateInput value={selectedDate} onChange={setSelectedDate} />
    </div>
  );
};

export const Default: Story = {
  render: () => <DateInputWithState />,
};
