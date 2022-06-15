import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Textarea as SystemTextarea } from "@open-decision/design-system";

export default {
  component: SystemTextarea,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const Textarea: Story = (props) => {
  return <SystemTextarea rows={10} {...props} />;
};
