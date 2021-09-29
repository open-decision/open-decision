import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Button, ButtonProps } from "./index";
import { Box } from "../Box";

export default {
  component: Button,
  title: "Components/Button",
} as Meta;

const ButtonGrid: Story<ButtonProps> = (props) => (
  <Box css={{ display: "grid", gap: "$2", width: "max-content" }}>
    <Button {...props} />
    <Button disabled {...props} />
  </Box>
);

export const Primary = ButtonGrid.bind({});
Primary.args = { children: "Button" };

export const Secondary = ButtonGrid.bind({});
Secondary.args = {
  variant: "secondary",
  children: "Button",
};

export const Tertiary = ButtonGrid.bind({});
Tertiary.args = { variant: "tertiary", children: "Button" };
