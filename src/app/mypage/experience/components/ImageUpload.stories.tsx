import type { Meta, StoryObj } from "@storybook/react";
import ImageUpload from "./ImageUpload";

const meta: Meta<typeof ImageUpload> = {
  title: "Components/ImageUpload",
  component: ImageUpload,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const SingleImage: Story = {
  args: {
    limit: 1,
    onChange: (files) => console.log("Single image:", files),
  },
};

export const MultiImage: Story = {
  args: {
    limit: 4,
    onChange: (files) => console.log("Multi images:", files),
  },
};
