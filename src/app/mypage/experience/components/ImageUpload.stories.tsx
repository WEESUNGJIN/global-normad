import type { Meta, StoryObj } from "@storybook/react";
import ImageUpload from "./ImageUpload";

const meta: Meta<typeof ImageUpload> = {
  title: "Components/ImageUpload",
  component: ImageUpload,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {
  args: {
    limit: 4,
    count: 0,
    onChange: (files) => console.log("업로드된 파일:", files),
  },
};

export const SingleUploaded: Story = {
  args: {
    limit: 4,
    count: 1,
    onChange: (files) => console.log("1개 업로드:", files),
  },
};

export const FullUploaded: Story = {
  args: {
    limit: 4,
    count: 4,
    onChange: (files) => console.log("모두 업로드됨:", files),
  },
};

export const OneOfOne: Story = {
  args: {
    limit: 1,
    count: 0,
    onChange: (files) => console.log("1개 제한 업로드:", files),
  },
};
