import * as React from "react";

import { Meta, Story } from "@storybook/react";

import { IconButton, IconButtonProps } from "./index";
import { Play } from "react-feather";
export default {
  component: IconButton,
  title: "Components/IconButton",
} as Meta;

const IconButtonGrid: Story<IconButtonProps> = (props) => (
  <IconButton {...props} />
);

export const Grid = IconButtonGrid.bind({});
Grid.args = { Icon: <Play /> };

const SingleIconButtonTemplate: Story<IconButtonProps> = (props) => (
  <IconButton {...props} />
);

export const Primary = SingleIconButtonTemplate.bind({});
Primary.args = { Icon: <Play /> };

export const Secondary = SingleIconButtonTemplate.bind({});
Secondary.args = { variant: "secondary", Icon: <Play /> };

export const Tertiary = SingleIconButtonTemplate.bind({});
Tertiary.args = { variant: "tertiary", Icon: <Play /> };
