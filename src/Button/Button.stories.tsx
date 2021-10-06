import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Button, ButtonProps } from "./index";
import { Box } from "../Box";

export default {
  component: Button,
  title: "Components/Button",
} as Meta;

const ButtonGrid: Story<Omit<ButtonProps, "css">> = (props) => (
  <Box css={{ display: "grid", gap: "$2", width: "max-content" }}>
    <Button size="small" {...props} />
    <Button {...props} />
    <Button size="large" {...props} />
    <Button size="small" disabled {...props} />
    <Button {...props} disabled />
    <Button size="large" disabled {...props} />
    <Button css={{ colorScheme: "error" }} size="small" {...props} />
    <Button css={{ colorScheme: "error" }} {...props} />
    <Button css={{ colorScheme: "error" }} size="large" {...props} />
    <Button css={{ colorScheme: "success" }} size="small" {...props} />
    <Button css={{ colorScheme: "success" }} {...props} />
    <Button css={{ colorScheme: "success" }} size="large" {...props} />
    <Button css={{ colorScheme: "warning" }} size="small" {...props} />
    <Button css={{ colorScheme: "warning" }} {...props} />
    <Button css={{ colorScheme: "warning" }} size="large" {...props} />
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
export const Ghost = ButtonGrid.bind({});
Ghost.args = { variant: "ghost", children: "Button" };
