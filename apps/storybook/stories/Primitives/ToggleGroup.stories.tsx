import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  Icon,
  ToggleGroup as SystemToggleGroup,
} from "@open-decision/design-system";
import { User } from "react-feather";

export default {
  component: SystemToggleGroup.Item,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const ToggleGroup: Story<SystemToggleGroup.ToggleButtonProps> = (
  props
) => (
  <SystemToggleGroup.Root type="single">
    <SystemToggleGroup.Item value="1" asChild>
      <SystemToggleGroup.Button {...props}>
        User
        <Icon>
          <User />
        </Icon>
      </SystemToggleGroup.Button>
    </SystemToggleGroup.Item>
    <SystemToggleGroup.Item value="2" asChild>
      <SystemToggleGroup.Button {...props}>Test</SystemToggleGroup.Button>
    </SystemToggleGroup.Item>
  </SystemToggleGroup.Root>
);
