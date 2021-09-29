import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Badge, BadgeProps } from "./index";

export default {
  component: Badge,
  title: "Components/Badge",
} as Meta;

const BadgeGrid: Story<BadgeProps> = (props) => <Badge {...props}>Badge</Badge>;

export const Primary = BadgeGrid.bind({});

export const Secondary = BadgeGrid.bind({});
Secondary.args = {
  level: "secondary",
};
