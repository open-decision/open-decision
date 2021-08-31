import * as React from "react";

import { Meta, Story } from "@storybook/react";

import { PlayIcon } from "@radix-ui/react-icons";
import { IconButton, IconButtonProps } from "./index";

export default {
  component: IconButton,
  title: "Components/IconButton",
} as Meta;

const IconButtonGrid: Story<IconButtonProps> = (props) => (
  <IconButton {...props} />
);

export const Grid = IconButtonGrid.bind({});
Grid.args = { Icon: <PlayIcon /> };

const SingleIconButtonTemplate: Story<IconButtonProps> = (props) => (
  <IconButton {...props} />
);

export const Primary = SingleIconButtonTemplate.bind({});
Primary.args = { Icon: <PlayIcon /> };

export const Secondary = SingleIconButtonTemplate.bind({});
Secondary.args = { variant: "secondary", Icon: <PlayIcon /> };

export const Tertiary = SingleIconButtonTemplate.bind({});
Tertiary.args = { variant: "tertiary", Icon: <PlayIcon /> };
