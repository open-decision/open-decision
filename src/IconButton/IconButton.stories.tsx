import * as React from "react";

import { Meta, Story } from "@storybook/react";

import { IconButton, IconButtonProps } from "./index";
import { Users } from "react-feather";
import { Box } from "../Box";
export default {
  component: IconButton,
  title: "Components/IconButton",
} as Meta;

const SingleIconButtonTemplate: Story<IconButtonProps> = (props) => (
  <Box css={{ display: "grid", gap: "$2", width: "max-content" }}>
    <IconButton {...props} />
    <IconButton round {...props} />
  </Box>
);

export const Primary = SingleIconButtonTemplate.bind({});
Primary.args = { Icon: <Users /> };

export const Secondary = SingleIconButtonTemplate.bind({});
Secondary.args = { variant: "secondary", Icon: <Users /> };

export const Tertiary = SingleIconButtonTemplate.bind({});
Tertiary.args = { variant: "tertiary", Icon: <Users /> };
