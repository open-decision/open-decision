import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Link as SystemLink, LinkProps } from "@open-decision/design-system";

export default {
  component: SystemLink,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const Link: Story<LinkProps> = (props) => (
  <SystemLink href="#" {...props}>
    Badge
  </SystemLink>
);
