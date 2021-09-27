import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Badge, BadgeProps } from "./index";

export default {
  component: Badge,
  title: "Components/Badge",
} as Meta;

const BadgeGrid: Story<BadgeProps> = (props) => <Badge {...props} />;

export const Default = BadgeGrid.bind({});
Default.args = { children: "Badge" };

export const Large = BadgeGrid.bind({});
Large.args = {
  size: "large",
  children: "Badge",
};
