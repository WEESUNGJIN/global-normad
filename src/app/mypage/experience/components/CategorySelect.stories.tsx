import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import CategorySelect from "./CategorySelect";

const meta: Meta<typeof CategorySelect> = {
  title: "Components/Common/CategorySelect",
  component: CategorySelect,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof CategorySelect>;

const SAMPLE_OPTIONS = [
  { label: "문화 예술", value: "문화 예술" },
  { label: "식음료", value: "식음료" },
  { label: "투어", value: "투어" },
  { label: "관광", value: "관광" },
  { label: "웰빙", value: "웰빙" },
];

const SelectExample = () => {
  const [selected, setSelected] = useState("");
  return (
    <div style={{ width: 327 }}>
      <CategorySelect
        value={selected}
        onChange={setSelected}
        options={SAMPLE_OPTIONS}
        placeholder="카테고리를 선택하세요"
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <SelectExample />,
};

export const Disabled: Story = {
  render: () => (
    <CategorySelect
      value=""
      onChange={() => {}}
      options={SAMPLE_OPTIONS}
      disabled
    />
  ),
};
