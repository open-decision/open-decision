import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  Icon,
  ToggleButton as SystemToggleButton,
  ToggleButtonProps,
} from "@open-decision/design-system";
import { User } from "react-feather";

export default {
  component: SystemToggleButton,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const ToggleButton: Story<ToggleButtonProps> = (props) => (
  <SystemToggleButton variant="secondary" square {...props}>
    <Icon>
      <User />
    </Icon>
  </SystemToggleButton>
);
