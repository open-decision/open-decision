import * as React from "react";
import {
  Badge as SystemBadge,
  BadgeProps,
  Stack,
} from "@open-decision/design-system";

import { Meta, Story } from "@storybook/react";

export default {
  component: SystemBadge,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const Badge: Story<BadgeProps> = (props) => (
  <Stack css={{ gap: "$4" }} center>
    <SystemBadge size="small" {...props}>
      Badge
    </SystemBadge>
    <SystemBadge {...props}>Badge</SystemBadge>
    <SystemBadge size="large" {...props}>
      Badge
    </SystemBadge>
  </Stack>
);
